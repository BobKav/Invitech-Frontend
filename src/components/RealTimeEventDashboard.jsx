import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, UserX, RefreshCw } from 'lucide-react';
import api from '../services/api';
import MultiStationAccessControl from './MultiStationAccessControl';

const RealTimeEventDashboard = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [userRole, setUserRole] = useState('operator');
  const [eventStats, setEventStats] = useState({
    totalGuests: 0,
    checkedIn: 0,
    notArrived: 0
  });
  const [recentEntries, setRecentEntries] = useState([]);
  const [entryData, setEntryData] = useState([]);

  useEffect(() => {
    fetchEventDetails();
    fetchUserRole();
    fetchEventData();
    const interval = setInterval(fetchEventData, 30000); // Rafraîchir toutes les 30 secondes
    return () => clearInterval(interval);
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'événement", error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const response = await api.get('/auth/user-role');
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle de l'utilisateur", error);
    }
  };

  const fetchEventData = async () => {
    try {
      const statsResponse = await api.getEventStats(eventId);
      setEventStats(statsResponse.data);

      const entriesResponse = await api.getRecentEntries(eventId);
      setRecentEntries(entriesResponse.data);

      const entryDataResponse = await api.getEntryData(eventId);
      setEntryData(entryDataResponse.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'événement:', error);
    }
  };

  if (!event) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord en temps réel - {event.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Users className="mr-2" size={20} />
            Total des invités
          </h3>
          <p className="text-3xl font-bold text-blue-800">{eventStats.totalGuests}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <UserCheck className="mr-2" size={20} />
            Arrivés
          </h3>
          <p className="text-3xl font-bold text-green-800">{eventStats.checkedIn}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <UserX className="mr-2" size={20} />
            Pas encore arrivés
          </h3>
          <p className="text-3xl font-bold text-yellow-800">{eventStats.notArrived}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Entrées récentes</h3>
        <ul className="space-y-2">
          {recentEntries.map((entry, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded flex justify-between items-center">
              <span>{entry.guestName}</span>
              <span className="text-gray-500">{new Date(entry.entryTime).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Graphique des entrées</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={entryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="entries" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={fetchEventData}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center mb-8"
      >
        <RefreshCw className="mr-2" size={20} />
        Rafraîchir les données
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Contrôle d'accès multi-stations</h2>
        <MultiStationAccessControl eventId={eventId} userRole={userRole} />
      </div>
    </div>
  );
};

export default RealTimeEventDashboard;