import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Eye, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';
import { motion } from 'framer-motion';

type Participant = Database['public']['Tables']['participants']['Row'];
type Event = Database['public']['Tables']['events']['Row'];

type CertificateData = {
  participantId: string;
  eventId: string;
  certificateNumber: string;
  templateData: {
    participantName: string;
    eventName: string;
    issueDate: string;
    certifyingAuthority?: string;
    position?: string;
    venue?: string;
    customText?: string;
    logo?: string;
  };
};

type Props = {
  participant: Participant;
  event: Event;
  onGenerate?: (certificateId: string) => void;
};

export function CertificateGenerator({ participant, event, onGenerate }: Props) {
  const [generating, setGenerating] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData>({
    participantId: participant.id,
    eventId: event.id,
    certificateNumber: `TEKRON-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`,
    templateData: {
      participantName: participant.full_name,
      eventName: event.name,
      issueDate: new Date().toISOString().split('T')[0],
      certifyingAuthority: 'Newton School of Technology',
      position: '1st',
      venue: 'Newton School of Technology, ADYPU, Pune',
      customText: 'We appreciate your dedication and commend your outstanding performance.',
    },
  });
  const [error, setError] = useState<string | null>(null);

  const generateCertificatePDF = async () => {
    // Create a new jsPDF instance (A4 landscape)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Create gradient background effect with multiple rectangles
    // Base light purple background
    doc.setFillColor(240, 230, 255); // Slightly adjusted for closer match
    doc.rect(0, 0, 297, 210, 'F');

    // Add subtle gradient layers
    doc.setFillColor(230, 220, 250);
    doc.rect(20, 20, 257, 170, 'F');

    doc.setFillColor(220, 210, 245);
    doc.rect(30, 30, 237, 150, 'F');

    // Dark purple edges with higher aesthetic appeal
    doc.setFillColor(80, 10, 120);

    // Bottom left corner
    doc.triangle(0, 210, 0, 140, 70, 210, 'F');
    doc.setFillColor(120, 40, 160);
    doc.triangle(0, 210, 0, 170, 40, 210, 'F');

    // Top left corner
    doc.setFillColor(80, 10, 120);
    doc.triangle(0, 0, 0, 70, 70, 0, 'F');
    doc.setFillColor(120, 40, 160);
    doc.triangle(0, 0, 0, 40, 40, 0, 'F');

    // Bottom right corner
    doc.setFillColor(80, 10, 120);
    doc.triangle(297, 210, 297, 140, 227, 210, 'F');
    doc.setFillColor(120, 40, 160);
    doc.triangle(297, 210, 297, 170, 257, 210, 'F');

    // Top right section
    doc.setFillColor(80, 10, 120);
    doc.triangle(297, 0, 297, 70, 227, 0, 'F');
    doc.setFillColor(120, 40, 160);
    doc.triangle(297, 0, 297, 40, 257, 0, 'F');

    // Decorative elements - hexagons and nodes
    // Top left hexagon hub
    doc.setDrawColor(100, 50, 150);
    doc.setFillColor(100, 50, 150);
    doc.circle(40, 40, 15, 'F'); // Adjusted position

    // Hexagonal node grid pattern
    doc.setLineWidth(0.5);
    for (let i = 0; i < 3; i++) {
      doc.line(70 + (i * 30), 40, 90 + (i * 30), 40); // Adjusted spacing
      doc.circle(70 + (i * 30), 40, 2, 'F');
      doc.circle(90 + (i * 30), 40, 2, 'F');

      if (i < 2) {
        doc.line(70 + (i * 30), 40, 90 + (i * 30), 60);
        doc.circle(90 + (i * 30), 60, 2, 'F');
      }
    }

    // Bottom right decorative pattern
    doc.setFillColor(120, 40, 160);
    doc.circle(260, 180, 5, 'F'); // Adjusted position
    doc.setLineWidth(0.3);
    doc.line(260, 175, 280, 165);
    doc.line(260, 185, 280, 190);
    doc.circle(280, 165, 1.5, 'F');
    doc.circle(280, 190, 1.5, 'F');

    // TEKRON logo in top right
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('TEKRON', 277, 25, { align: 'right' });
    doc.setFontSize(16);
    doc.text('2025', 277, 35, { align: 'right' });

    // Decorative line below logo
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1);
    doc.line(237, 40, 277, 40);

    // Title with shadow effect
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(52);
    doc.setTextColor(60, 30, 110, 0.4);
    doc.text('CERTIFICATE', 150.5, 52, { align: 'center' });

    doc.setTextColor(20, 20, 80);
    doc.text('CERTIFICATE', 148.5, 50, { align: 'center' });

    doc.setFontSize(32);
    doc.setTextColor(60, 30, 110, 0.4);
    doc.text('OF ACHIEVEMENT', 150.5, 67, { align: 'center' });

    doc.setTextColor(20, 20, 80);
    doc.text('OF ACHIEVEMENT', 148.5, 65, { align: 'center' });

    // Decorative line below title
    doc.setDrawColor(100, 50, 150);
    doc.setLineWidth(1.5);
    doc.line(108.5, 72, 188.5, 72);

    // Award text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('THIS CERTIFICATE IS AWARDED TO', 148.5, 90, { align: 'center' });

    // Participant name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(60, 0, 100);
    doc.text(certificateData.templateData.participantName, 148.5, 105, { align: 'center' });

    // Decorative border around name
    doc.setDrawColor(100, 20, 140);
    doc.setLineWidth(1);
    const nameWidth = doc.getTextWidth(certificateData.templateData.participantName);
    const nameStart = 148.5 - (nameWidth / 2) - 15;
    const nameEnd = 148.5 + (nameWidth / 2) + 15;
    doc.line(nameStart, 115, nameEnd, 115);

    // Achievement text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    const positionText = `for securing ${certificateData.templateData.position} position in`;
    doc.text(positionText, 148.5, 130, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.text('TEKRON 2025', 148.5, 140, { align: 'center' });

    const venueText = `held on ${new Date(certificateData.templateData.issueDate).toLocaleDateString()} at`;
    doc.setFont('helvetica', 'normal');
    doc.text(venueText, 148.5, 150, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.text(certificateData.templateData.venue || 'Newton School of Technology, ADYPU, Pune', 148.5, 160, { align: 'center' });

    // Custom text
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(40, 10, 70);
    doc.text(certificateData.templateData.customText || 'We appreciate your dedication and commend your outstanding performance.', 148.5, 175, { align: 'center' });

    // Decorative line below custom text
    doc.setDrawColor(100, 50, 150);
    doc.setLineWidth(0.75);
    doc.line(88.5, 185, 208.5, 185);

    // Presented by text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(20, 20, 20);
    doc.text('Presented by', 148.5, 195, { align: 'center' });

    // Certificate number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`Certificate #: ${certificateData.certificateNumber}`, 270, 205, { align: 'right' });

    // Simulate QR code in bottom left (visual effect)
    doc.setFillColor(80, 10, 120);
    doc.rect(20, 185, 15, 15, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(22, 187, 4, 4, 'F');
    doc.rect(29, 187, 4, 4, 'F');
    doc.rect(22, 194, 4, 4, 'F');
    doc.rect(27, 190, 2, 6, 'F');

    return doc;
  };

  const handlePreview = async () => {
    try {
      const doc = await generateCertificatePDF();
      doc.output('dataurlnewwindow');
    } catch (err) {
      setError('Failed to generate certificate preview');
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      // Generate the certificate
      const doc = await generateCertificatePDF();
      const pdfOutput = doc.output('blob');
      
      // Create a unique filename
      const filename = `tekron_certificate_${certificateData.certificateNumber}.pdf`;
      
      // Store certificate record in database
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          participant_id: certificateData.participantId,
          event_id: certificateData.eventId,
          certificate_number: certificateData.certificateNumber,
          template_data: certificateData.templateData,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Trigger download
      const url = URL.createObjectURL(pdfOutput);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      // Notify parent component if needed
      if (onGenerate && data) {
        onGenerate(data.id);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate certificate');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="cyberpunk-card overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-cyberpunk-dark-purple/60 backdrop-blur-sm">
          <h3 className="text-lg leading-6 font-medium neon-text">
            TEKRON Certificate Generator
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-400">
            Generate a futuristic TEKRON certificate for {participant.full_name}
          </p>
        </div>
        <div className="border-t border-cyberpunk-accent/20 px-4 py-5 sm:p-6 bg-cyberpunk-dark-purple/30 backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-300">
                Certificate Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="certificateNumber"
                  value={certificateData.certificateNumber}
                  onChange={(e) => setCertificateData({
                    ...certificateData,
                    certificateNumber: e.target.value
                  })}
                  className="cyber-input w-full"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-300">
                Issue Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  id="issueDate"
                  value={certificateData.templateData.issueDate}
                  onChange={(e) => setCertificateData({
                    ...certificateData,
                    templateData: {
                      ...certificateData.templateData,
                      issueDate: e.target.value
                    }
                  })}
                  className="cyber-input w-full"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="position" className="block text-sm font-medium text-gray-300">
                Position Achieved
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="position"
                  value={certificateData.templateData.position}
                  onChange={(e) => setCertificateData({
                    ...certificateData,
                    templateData: {
                      ...certificateData.templateData,
                      position: e.target.value
                    }
                  })}
                  className="cyber-input w-full"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">E.g., 1st, 2nd, 3rd, Participant</p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="venue" className="block text-sm font-medium text-gray-300">
                Venue
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="venue"
                  value={certificateData.templateData.venue}
                  onChange={(e) => setCertificateData({
                    ...certificateData,
                    templateData: {
                      ...certificateData.templateData,
                      venue: e.target.value
                    }
                  })}
                  className="cyber-input w-full"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="customText" className="block text-sm font-medium text-gray-300">
                Appreciation Text
              </label>
              <div className="mt-1">
                <textarea
                  id="customText"
                  rows={2}
                  value={certificateData.templateData.customText}
                  onChange={(e) => setCertificateData({
                    ...certificateData,
                    templateData: {
                      ...certificateData.templateData,
                      customText: e.target.value
                    }
                  })}
                  className="cyber-input w-full"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="authority" className="block text-sm font-medium text-gray-300">
                Certifying Authority
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="authority"
                  value={certificateData.templateData.certifyingAuthority}
                  onChange={(e) => setCertificateData({
                    ...certificateData,
                    templateData: {
                      ...certificateData.templateData,
                      certifyingAuthority: e.target.value
                    }
                  })}
                  className="cyber-input w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="px-4 py-3 bg-red-900/50 text-red-300 text-sm border-t border-red-500/50 flex items-center">
            <div className="mr-2 p-1 rounded-full bg-red-500/20">
              <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {error}
          </div>
        )}
        
        <div className="px-4 py-3 bg-cyberpunk-dark-purple backdrop-blur-sm border-t border-cyberpunk-accent/20 text-right sm:px-6 flex justify-end space-x-3">
          <motion.button
            type="button"
            onClick={handlePreview}
            className="neon-button group flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Eye className="h-4 w-4 mr-2 group-hover:animate-pulse" />
            Preview
          </motion.button>
          <motion.button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="neon-button-pink group flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download className="h-4 w-4 mr-2 group-hover:animate-pulse" />
            {generating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-cyberpunk-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate & Download'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}