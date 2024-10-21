import React, { useState, useEffect } from 'react';
import api from '../services/api';

const HotelReservation = ({ eventId, guestId, isOrganizer }) => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelsResponse = await api.get(`/events/${eventId}/hotels`);
        setHotels(hotelsResponse.data);

        if (isOrganizer) {
          const reservationsResponse = await api.get(`/events/${eventId}/hotel-reservations`);
          setReservations(reservationsResponse.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    fetchData();
  }, [eventId, isOrganizer]);

  const handleReservation = async () => {
    try {
      const response = await api.post('/hotel-reservations', {
        eventId,
        guestId,
        hotelId: selectedHotel.id,
        promoCode
      });
      alert('Réservation effectuée avec succès !');
      // Vous pouvez ajouter ici une logique pour mettre à jour l'état local ou recharger les données
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert('Erreur lors de la réservation. Veuillez réessayer.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Réservation d'hôtel</h2>
      {isOrganizer ? (
        <div>
          <h3 className="text-xl font-semibold mb-2">Réservations des invités</h3>
          <ul>
            {reservations.map(reservation => (
              <li key={reservation.id} className="mb-2">
                {reservation.guestName} - {reservation.hotelName}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <select
            value={selectedHotel ? selectedHotel.id : ''}
            onChange={(e) => setSelectedHotel(hotels.find(h => h.id === parseInt(e.target.value)))}
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="">Sélectionnez un hôtel</option>
            {hotels.map(hotel => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name} - {hotel.price}€ par nuit
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Code promo"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={handleReservation}
            disabled={!selectedHotel}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Réserver
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelReservation;