import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, CheckCircle, XCircle, Edit, Trash } from 'lucide-react';
import api from '../services/api';

const GuestManagement = ({ eventId }) => {
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGuests();
  }, [eventId]);

  const fetchGuests = async () => {
    try {
      const response = await api.getGuests(eventId);
      setGuests(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des invités:', error);
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addGuest(eventId, newGuest);
      setGuests([...guests, response.data]);
      setNewGuest({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'invité:', error);
    }
  };

  const handleUpdateGuest = async (id, updatedData) => {
    try {
      const response = await api.updateGuest(eventId, id, updatedData);
      setGuests(guests.map(guest => guest.id === id ? response.data : guest));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'invité:', error);
    }
  };

  const handleDeleteGuest = async (id) => {
    try {
      await api.deleteGuest(eventId, id);
      setGuests(guests.filter(guest => guest.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'invité:', error);
    }
  };

  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (filter === 'all' || guest.status === filter)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Gestion des invités</h2>
      
      <form onSubmit={handleAddGuest} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nom"
            value={newGuest.name}
            onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newGuest.email}
            onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="tel"
            placeholder="Téléphone"
            value={newGuest.phone}
            onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          <Plus className="inline-block mr-2" size={16} />
          Ajouter un invité
        </button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un invité"
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
            Tous
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1 rounded-md ${filter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Confirmés
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
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGuests.map((guest) => (
              <tr key={guest.id}>
                <td className="px-4 py-2 whitespace-nowrap">{guest.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <Mail className="inline-block mr-2" size={16} />
                  {guest.email}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <Phone className="inline-block mr-2" size={16} />
                  {guest.phone}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {guest.status === 'confirmed' && <span className="text-green-600"><CheckCircle className="inline-block mr-1" size={16} /> Confirmé</span>}
                  {guest.status === 'pending' && <span className="text-yellow-600">En attente</span>}
                  {guest.status === 'declined' && <span className="text-red-600"><XCircle className="inline-block mr-1" size={16} /> Refusé</span>}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button onClick={() => handleUpdateGuest(guest.id, { status: 'confirmed' })} className="text-green-600 hover:text-green-800 mr-2">
                    <CheckCircle size={16} />
                  </button>
                  <button onClick={() => handleDeleteGuest(guest.id)} className="text-red-600 hover:text-red-800">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestManagement;