import React, { useState } from 'react';
import { Search, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { jsPDF } from 'jspdf';
import type { Database } from '../lib/supabase-types';

type TemplateData = {
  customText?: string;
  certifyingAuthority?: string;
  logo?: string;
  participantName?: string;
  eventName?: string;
  issueDate?: string;
};

type Certificate = Database['public']['Tables']['certificates']['Row'] & {
  participants: Database['public']['Tables']['participants']['Row'];
  events: Database['public']['Tables']['events']['Row'];
  template_data: TemplateData;
};

export function CertificateSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'email' | 'id'>('email');
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setCertificates([]);

    try {
      if (!searchQuery.trim()) {
        throw new Error('Please enter a search term');
      }

      if (searchType === 'email') {
        // For email search, first get the participant ID
        const { data: participantData, error: participantError } = await supabase
          .from('participants')
          .select('id')
          .eq('email', searchQuery.toLowerCase().trim())
          .single();

        if (participantError && participantError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw new Error(`Error finding participant: ${participantError.message}`);
        }

        if (!participantData) {
          setError(`No participant found with email: ${searchQuery}`);
          setLoading(false);
          return;
        }

        // Then get certificates with that participant ID
        const { data, error } = await supabase
          .from('certificates')
          .select(`
            *,
            participants!inner (*),
            events!inner (*)
          `)
          .eq('participant_id', participantData.id);

        if (error) throw error;
        
        setCertificates(data as Certificate[]);
        
        if (data.length === 0) {
          setError(`No certificates found for email: ${searchQuery}`);
        } else {
          setSuccess(`Found ${data.length} certificate(s)`);
        }
      } else {
        // For certificate ID search, query directly
        const { data, error } = await supabase
          .from('certificates')
          .select(`
            *,
            participants!inner (*),
            events!inner (*)
          `)
          .eq('certificate_number', searchQuery.trim());

        if (error) throw error;
        
        setCertificates(data as Certificate[]);
        
        if (data.length === 0) {
          setError(`No certificate found with ID: ${searchQuery}`);
        } else {
          setSuccess(`Found ${data.length} certificate(s)`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find certificates. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateCertificatePDF = async (certificate: Certificate) => {
    // Create a new jsPDF instance (A4 landscape)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Get template data
    const templateData = certificate.template_data;
    
    if (!templateData) {
      throw new Error("Certificate template data not found");
    }

    // Set background color
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, 'F');

    // Set border
    doc.setDrawColor(44, 62, 80);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 277, 190);

    // Add decorative elements
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(1.5);
    doc.line(10, 30, 287, 30);
    doc.line(10, 180, 287, 180);

    // Add title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(44, 62, 80);
    doc.text('CERTIFICATE OF PARTICIPATION', 148.5, 25, { align: 'center' });

    // Add certifying text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('This is to certify that', 148.5, 70, { align: 'center' });

    // Add participant name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(41, 128, 185);
    doc.text(certificate.participants.full_name, 148.5, 90, { align: 'center' });

    // Add custom text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(templateData.customText || 'has successfully completed the event and is awarded this certificate of participation.', 148.5, 110, { align: 'center' });

    // Add event name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(certificate.events.name, 148.5, 125, { align: 'center' });

    // Add date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Issue Date: ${new Date(certificate.issue_date).toLocaleDateString()}`, 148.5, 145, { align: 'center' });

    // Add certificate number
    doc.setFontSize(10);
    doc.text(`Certificate #: ${certificate.certificate_number}`, 148.5, 155, { align: 'center' });

    // Add authority signature
    doc.setFont('helvetica', 'bold');
    doc.text(templateData.certifyingAuthority || 'Certificate Authority', 148.5, 170, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Signatory', 148.5, 175, { align: 'center' });

    return doc;
  };

  const handleDownload = async (certificate: Certificate) => {
    setDownloading(certificate.id);
    setError(null);
    
    try {
      // Generate the certificate
      const doc = await generateCertificatePDF(certificate);
      
      // Create a unique filename
      const filename = `certificate_${certificate.certificate_number}.pdf`;
      
      // Trigger download
      doc.save(filename);
      
      // Update download count in analytics (if needed)
      // This is optional but could be useful for tracking
      
    } catch (err) {
      setError('Failed to generate certificate. Please try again.');
      console.error('Download error:', err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Find Your Certificate
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Enter your email or certificate ID to find and download your certificates
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={searchType === 'email'}
                  onChange={(e) => setSearchType(e.target.value as 'email' | 'id')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Search by Email</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="id"
                  checked={searchType === 'id'}
                  onChange={(e) => setSearchType(e.target.value as 'email' | 'id')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Search by Certificate ID</span>
              </label>
            </div>

            <div className="relative">
              <input
                type={searchType === 'email' ? 'email' : 'text'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === 'email'
                    ? 'Enter your email address'
                    : 'Enter certificate ID'
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Certificates'}
          </button>
        </form>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-4 rounded-md bg-red-50 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 rounded-md bg-green-50 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {certificates.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Certificates</h3>
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {cert.events.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Issued to: <span className="font-medium">{cert.participants.full_name}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Certificate #: <span className="font-medium">{cert.certificate_number}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Issued on: <span className="font-medium">{new Date(cert.issue_date).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(cert)}
                    disabled={downloading === cert.id}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {downloading === cert.id ? 'Downloading...' : 'Download'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          If you're having trouble finding your certificate, please contact the event organizer.
        </p>
      </div>
    </div>
  );
}