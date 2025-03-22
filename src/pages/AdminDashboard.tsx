import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, Award, Plus, Trash2, Edit, FileText, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';
import { CsvUploader } from '../components/CsvUploader';
import { CertificateGenerator } from '../components/CertificateGenerator';

type Event = Database['public']['Tables']['events']['Row'];
type Participant = Database['public']['Tables']['participants']['Row'];
type Certificate = Database['public']['Tables']['certificates']['Row'];

function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase.from('events').insert({
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        created_by: user.id
      });

      if (error) throw error;
      
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium">Events List</h2>
        </div>
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No events found</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {events.map((event) => (
                <li key={event.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{event.name}</h3>
                      <p className="text-sm text-gray-500">{event.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-500">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function ParticipantsManagement() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCertificateGenerator, setShowCertificateGenerator] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchParticipants();
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
      if (data && data.length > 0) {
        setSelectedEvent(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  async function fetchParticipants() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleUploadComplete = () => {
    fetchParticipants();
    setSuccess('Participants uploaded successfully');
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleGenerateCertificate = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowCertificateGenerator(true);
  };

  const handleCertificateGenerated = () => {
    setShowCertificateGenerator(false);
    setSelectedParticipant(null);
  };

  const getSelectedEventDetails = (): Event | undefined => {
    return events.find(event => event.id === selectedEvent);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Upload Participants</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Event
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
        <CsvUploader onUploadComplete={handleUploadComplete} eventId={selectedEvent} />
      </div>

      {success && (
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium">Participants</h2>
          <span className="text-sm text-gray-500">
            {participants.length} participants
          </span>
        </div>
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading participants...</div>
          ) : participants.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No participants found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant) => (
                    <tr key={participant.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {participant.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.organization || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleGenerateCertificate(participant)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          title="Generate Certificate"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-500"
                          title="Delete Participant"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCertificateGenerator && selectedParticipant && selectedEvent && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Generate Certificate
                    </h3>
                    <div className="mt-4">
                      {getSelectedEventDetails() && (
                        <CertificateGenerator
                          participant={selectedParticipant}
                          event={getSelectedEventDetails()!}
                          onGenerate={handleCertificateGenerated}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowCertificateGenerator(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CertificatesManagement() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  async function fetchCertificates() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          participants (id, full_name, email),
          events (id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium">Issued Certificates</h2>
          <span className="text-sm text-gray-500">
            {certificates.length} certificates
          </span>
        </div>
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading certificates...</div>
          ) : certificates.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No certificates found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certificate ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {certificates.map((cert: any) => (
                    <tr key={cert.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cert.certificate_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cert.participants?.full_name} ({cert.participants?.email})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cert.events?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(cert.issue_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Download Certificate"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage events, participants, and certificates
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/events"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <LayoutGrid className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Events</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Create and manage events, hackathons, and competitions
          </p>
        </Link>

        <Link
          to="/admin/participants"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Participants</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Manage participants and generate certificates
          </p>
        </Link>

        <Link
          to="/admin/certificates"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <Award className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Certificates</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            View and manage issued certificates
          </p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Routes>
          <Route path="events" element={<EventsManagement />} />
          <Route path="participants" element={<ParticipantsManagement />} />
          <Route path="certificates" element={<CertificatesManagement />} />
          <Route path="*" element={<div className="p-8 text-center text-gray-500">Select a section from above</div>} />
        </Routes>
      </div>
    </div>
  );
}