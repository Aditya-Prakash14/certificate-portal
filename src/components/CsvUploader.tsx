import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type CsvRow = {
  fullName: string;
  email: string;
  organization?: string;
  eventId: string;
  valid: boolean;
  errors: string[];
};

type Props = {
  onUploadComplete: () => void;
  eventId?: string;
};
export function CsvUploader({ onUploadComplete, eventId }: Props) {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<CsvRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUploader = () => {
    setParsedData([]);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setSuccess(null);
    
    if (!selectedFile) {
      return;
    }
    
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    parseCsvFile(selectedFile);
  };

  const parseCsvFile = async (file: File) => {
    setError(null);
    setParsing(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      // Check if there's at least a header and one data row
      if (lines.length < 2) {
        throw new Error('CSV file must contain a header row and at least one data row');
      }
      
      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
      
      // Validate required headers
      const requiredHeaders = ['email', 'fullname'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
      }
      
      // Parse data rows
      const parsedRows: CsvRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        
        const values = lines[i].split(',').map(value => value.trim());
        
        if (values.length !== headers.length) {
          throw new Error(`Row ${i} has incorrect number of columns`);
        }
        
        const row: Record<string, string> = {};
        const errors: string[] = [];
        
        // Map CSV columns to row object
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        
        // Validate required fields
        if (!row.email) errors.push('Email is required');
        else if (!row.email.includes('@')) errors.push('Invalid email format');
        
        if (!row.fullname) errors.push('Full name is required');
        
        // Map to our format and validate
        const csvRow: CsvRow = {
          fullName: row.fullname,
          email: row.email,
          organization: row.organization || '',
          eventId: eventId || row.eventid,
          valid: errors.length === 0,
          errors
        };
        
        parsedRows.push(csvRow);
      }
      
      setParsedData(parsedRows);
      
      // Check if all rows are valid
      const invalidRows = parsedRows.filter(row => !row.valid);
      if (invalidRows.length > 0) {
        setError(`${invalidRows.length} rows contain errors. Please fix them before uploading.`);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
      setParsedData([]);
    } finally {
      setParsing(false);
    }
  };

  const handleUpload = async () => {
    if (!eventId && !parsedData.some(row => row.eventId)) {
      setError('Event ID is required. Either select an event or include eventId column in your CSV.');
      return;
    }
    
    if (parsedData.some(row => !row.valid)) {
      setError('Please fix all errors before uploading');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      const participants = parsedData.map(row => ({
        full_name: row.fullName,
        email: row.email.toLowerCase(),
        organization: row.organization,
      }));
      
      // Insert participants in batch with proper conflict handling
      const { error: participantsError } = await supabase
        .from('participants')
        .upsert(participants, { 
          onConflict: 'email', 
          ignoreDuplicates: false
        });
      
      if (participantsError) {
        console.error('Error details:', participantsError);
        throw new Error(participantsError.message || 'Failed to upload participants');
      }
      
      // Query for all participant IDs by emails
      const emails = participants.map(p => p.email);
      const { data: foundParticipants, error: lookupError } = await supabase
        .from('participants')
        .select('id, email')
        .in('email', emails);
      
      if (lookupError) throw new Error(lookupError.message);
      
      // Create a map of emails to participant IDs
      const emailToIdMap = new Map();
      foundParticipants?.forEach(p => {
        emailToIdMap.set(p.email, p.id);
      });
      
      // Optional: Create event_participants mappings here if needed
      
      setSuccess(`Successfully uploaded ${participants.length} participants`);
      onUploadComplete();
      resetUploader();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload participants');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <span>Upload a file</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            CSV files only with columns: fullName, email, organization (optional)
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Parsed Data Preview with loading state */}
      {parsing ? (
        <div className="text-center p-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
          <p className="text-sm text-gray-500">Parsing CSV file...</p>
        </div>
      ) : parsedData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parsedData.slice(0, 5).map((row, index) => (
                <tr key={index} className={row.valid ? '' : 'bg-red-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.organization || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.valid ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Valid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title={row.errors.join(', ')}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {row.errors[0]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {parsedData.length > 5 && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Showing 5 of {parsedData.length} entries
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {parsedData.length > 0 && (
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetUploader}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={uploading || parsedData.some(row => !row.valid)}
            onClick={handleUpload}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Participants'}
          </button>
        </div>
      )}
    </div>
  );
} 