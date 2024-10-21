import React, { useState, useEffect } from 'react';
import { Send, Edit, Trash, Search, Filter, Download, Upload } from 'lucide-react';
import api from '../services/api';

const InvitationManagement = ({ eventId }) => {
  const [invitations, setInvitations] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvitations();
    fetchTemplates();
  }, [eventId]);

  const fetchInvitations = async () => {
    try {
      const response = await api.getInvitations(eventId);
      setInvitations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des invitations:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await api.getInvitationTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles:', error);
    }
  };

  const handleSendInvitation = async (guestId) => {
    try {
      const response = await api.sendInvitation({
        eventId,
        guestId,
        templateId: selectedTemplate,
        customMessage
      });
      setInvitations(invitations.map(inv => 
        inv.guestId === guestId ? { ...inv, status: 'sent' } : inv
      ));
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'invitation:', error);
    }
  };

  const handleDeleteInvitation = async (invitationId) => {
    try {
      await api.deleteInvitation(invitationId);
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'invitation:', error);
    }
  };

  const filteredInvitations = invitations.filter(invitation => 
    (filter === 'all' || invitation.status === filter) &&
    (invitation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     invitation.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Gestion des invitations</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Sélectionner un modèle</h3>
        <div className="grid grid-cols-3 gap-4">
          {templates.map(template => (
            <div 
              key={template.id}
              className={`border p-4 rounded-lg cursor-pointer ${selectedTemplate === template.id ? 'border-indigo-500' : ''}`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <img src={template.thumbnail} alt={template.name} className="w-full h-32 object-cover mb-2" />
              <p className="text-center">{template.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Message personnalisé</h3>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows="4"
        ></textarea>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une invitation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`px-3 py-1 rounded-md ${filter === 'sent' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Envoyées
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-md ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
          >
            En attente
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invité</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvitations.map((invitation) => (
              <tr key={invitation.id}>
                <td className="px-4 py-2 whitespace-nowrap">{invitation.guestName}</td>
                <td className="px-4 py-2 whitespace-nowrap">{invitation.guestEmail}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${invitation.status === 'sent' ? 'bg-green-100 text-green-800' : 
                      invitation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {invitation.status}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button 
                    onClick={() => handleSendInvitation(invitation.guestId)} 
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                    disabled={invitation.status === 'sent'}
                  >
                    <Send size={16} />
                  </button>
                  <button onClick={() => handleDeleteInvitation(invitation.id)} className="text-red-600 hover:text-red-900">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          <Upload className="inline-block mr-2" size={16} />
          Importer des invités
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Download className="inline-block mr-2" size={16} />
          Exporter la liste
        </button>
      </div>
    </div>
  );
};

export default InvitationManagement;