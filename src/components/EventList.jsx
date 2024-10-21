import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Plus } from 'lucide-react';

const EventCard = ({ event }) => (
  <div className="bg-white shadow rounded-lg p-6 mb-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
        <p className="text-gray-600 mt-1">{event.description}</p>
      </div>
      <span className={`px-2 py-1 rounded text-sm font-semibold ${
        event.status === 'À venir' ? 'bg-yellow-100 text-yellow-800' :
        event.status === 'En cours' ? 'bg-green-100 text-green-800' :
        'bg-red-100 text-red-800'
      }`}>
        {event.status}
      </span>
    </div>
    <div className="mt-4 flex items-center text-sm text-gray-600">
      <Calendar className="h-4 w-4 mr-2" />
      <span>{event.date}</span>
    </div>
    <div className="mt-2 flex items-center text-sm text-gray-600">
      <MapPin className="h-4 w-4 mr-2" />
      <span>{event.location}</span>
    </div>
    <div className="mt-2 flex items-center text-sm text-gray-600">
      <Users className="h-4 w-4 mr-2" />
      <span>{event.attendees} participants</span>
    </div>
  </div>
);

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Simuler un appel API
        const response = await new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve([
              { id: 1, name: "Mariage de Sophie et Thomas", description: "Célébration du mariage", date: "15 Août 2024", location: "Château de Versailles", attendees: 150, status: "À venir" },
              { id: 2, name: "Conférence Tech Inno", description: "Conférence sur l'innovation technologique", date: "22 Sept 2024", location: "Palais des Congrès", attendees: 500, status: "À venir" },
              { id: 3, name: "Gala de charité", description: "Levée de fonds annuelle", date: "5 Oct 2024", location: "Hôtel Ritz", attendees: 200, status: "À venir" },
            ])
          }), 1000)
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des événements');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Chargement des événements...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mes Événements</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition">
          <Plus className="h-5 w-5 mr-2" />
          Nouvel Événement
        </button>
      </div>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;