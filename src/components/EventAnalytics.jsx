import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const EventAnalytics = ({ eventId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(`/analytics/${eventId}`);
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des analyses:', error);
      }
    };

    fetchAnalytics();
  }, [eventId]);

  if (!analyticsData) {
    return <div>Chargement des analyses...</div>;
  }

  const { invitationStatus, budgetData } = analyticsData;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Analyse de l'événement</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Statut des invitations</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(invitationStatus).map(([name, value]) => ({ name, value }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Budget vs Dépenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" />
            <Bar dataKey="expenses" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventAnalytics;