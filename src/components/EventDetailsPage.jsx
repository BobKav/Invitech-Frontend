import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Mail, Edit, Trash2, ChevronDown } from 'lucide-react';
import api from '../services/api';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const response = await api.getEventDetails(eventId);
        setEvent(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (isLoading) {
    return <div className="text-center py-10">Chargement des détails de l'événement...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!event) {
    return <div className="text-center py-10">Événement non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{event.name}</h1>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-indigo-700 rounded">
                <Edit className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-indigo-700 rounded">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="mt-2">{event.description}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <span>{event.currentAttendees} / {event.maxAttendees} participants</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span>{event.currentAttendees} invitations envoyées</span>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                  event.status === 'À venir' ? 'bg-yellow-100 text-yellow-800' :
                  event.status === 'En cours' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Tâches</h2>
            <ul className="space-y-2">
              {event.tasks.map(task => (
                <li key={task.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => {/* Logique pour mettre à jour la tâche */}} 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className={`ml-2 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 flex justify-between">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
              Gérer les invités
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition flex items-center">
              Plus d'actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;