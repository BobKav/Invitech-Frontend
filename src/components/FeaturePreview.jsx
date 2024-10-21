import React from 'react';
import MapIntegration from './MapIntegration';
import FeedbackSurvey from './FeedbackSurvey';
import CalendarIntegration from './CalendarIntegration';
import HotelReservation from './HotelReservation';

const FeaturePreview = () => {
  const sampleLocation = { lat: 48.8584, lng: 2.2945, name: 'Tour Eiffel' };
  const sampleEvents = [
    { id: 1, name: 'Événement 1', date: new Date(2023, 5, 15) },
    { id: 2, name: 'Événement 2', date: new Date(2023, 5, 20) },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Prévisualisation des nouvelles fonctionnalités</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Intégration de carte</h2>
        <MapIntegration location={sampleLocation} />
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Enquête de satisfaction</h2>
        <FeedbackSurvey eventId="123" onSubmit={console.log} />
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Intégration de calendrier</h2>
        <CalendarIntegration events={sampleEvents} />
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Réservation d'hôtel</h2>
        <HotelReservation eventId="123" guestId="456" isOrganizer={false} />
      </div>
    </div>
  );
};

export default FeaturePreview;