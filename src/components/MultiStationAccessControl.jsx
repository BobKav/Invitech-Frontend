import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, CheckCircle, XCircle, Edit, Trash } from 'lucide-react';
import AccessControl from '../../../../Archiv/Frontend/AccessControl';
import api from '../services/api';

const MultiStationAccessControl = ({ eventId, userRole }) => {
  const [stations, setStations] = useState([]);
  const [stationStats, setStationStats] = useState({});

  useEffect(() => {
    fetchStations();
    const interval = setInterval(fetchStationStats, 30000); // Mise à jour toutes les 30 secondes
    return () => clearInterval(interval);
  }, [eventId]);

  const fetchStations = async () => {
    try {
      const response = await api.getAccessStations(eventId);
      setStations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des stations", error);
    }
  };

  const fetchStationStats = async () => {
    try {
      const response = await api.getStationStats(eventId);
      setStationStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des stations", error);
    }
  };

  const addStation = async () => {
    try {
      const response = await api.addAccessStation(eventId);
      setStations([...stations, response.data]);
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une station", error);
    }
  };

  const toggleStation = async (stationId) => {
    try {
      const response = await api.toggleAccessStation(eventId, stationId);
      setStations(stations.map(station => 
        station.id === stationId ? response.data : station
      ));
    } catch (error) {
      console.error("Erreur lors de la désactivation/activation de la station", error);
    }
  };

  const removeStation = async (stationId) => {
    try {
      await api.removeAccessStation(eventId, stationId);
      setStations(stations.filter(station => station.id !== stationId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la station", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contrôle d'accès multi-stations</h1>
      {(userRole === 'admin' || userRole === 'supervisor') && (
        <button onClick={addStation} className="mb-4 bg-blue-500 text-white p-2 rounded">
          Ajouter une station
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <div key={station.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Station {station.id}</h2>
            {(userRole === 'admin' || userRole === 'supervisor') && (
              <div className="mb-2">
                <button 
                  onClick={() => toggleStation(station.id)} 
                  className={`mr-2 p-1 rounded ${station.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                >
                  {station.isActive ? 'Désactiver' : 'Activer'}
                </button>
                <button 
                  onClick={() => removeStation(station.id)} 
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Supprimer
                </button>
              </div>
            )}
            {station.isActive && <AccessControl eventId={eventId} stationId={station.id} />}
            {!station.isActive && <p className="text-red-500">Station désactivée</p>}
            {stationStats[station.id] && (
              <div className="mt-2">
                <p>Entrées traitées : {stationStats[station.id].entriesProcessed}</p>
                <p>Temps moyen de traitement : {stationStats[station.id].averageProcessingTime.toFixed(2)} secondes</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiStationAccessControl;