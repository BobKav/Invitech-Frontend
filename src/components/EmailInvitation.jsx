import React, { useState } from 'react';

// Fonction simulée pour générer un QR Code
const generateQRCode = (data) => {
  // Dans une vraie application, vous utiliseriez une bibliothèque ou une API pour générer le QR Code
  // Ici, nous simulons simplement le processus
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
};

const EmailInvitation = ({ event, guest, translations }) => {
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [menuChoice, setMenuChoice] = useState('');
  const [drinkChoice, setDrinkChoice] = useState('');
  const [comment, setComment] = useState('');

  const t = translations;

  const isPersonalEvent = ['wedding', 'birthday', 'other'].includes(event.type);

  const menus = [
    { id: 1, name: 'Menu 1', details: 'Entrée: Salade César, Plat: Poulet rôti, Dessert: Tarte aux pommes' },
    { id: 2, name: 'Menu 2', details: 'Entrée: Carpaccio de saumon, Plat: Bœuf Wellington, Dessert: Crème brûlée' },
    { id: 3, name: 'Menu 3', details: 'Entrée: Velouté de champignons, Plat: Risotto aux fruits de mer, Dessert: Tiramisu' },
  ];

  const drinks = [
    'Bière', 'Bière sans alcool', 'Vin', 'Liqueur', 'Cocktail', 'Cocktail sans alcool', 'Jus/Soda'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('RSVP soumis:', { rsvpStatus, menuChoice, drinkChoice, comment });
  };

  // Générer un QR Code unique pour cet invité et cet événement
  const qrCodeData = `event_id=${event.id}&guest_id=${guest.id}`;
  const qrCodeUrl = generateQRCode(qrCodeData);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">{t.invitationTo} {event.name}</h1>
      <p className="mb-4">{event.description}</p>
      <p className="mb-4">{t.date}: {event.date} {t.at} {event.time}</p>
      <p className="mb-4">{t.location}: {event.location}</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t.hotelReservation}</h2>
        <p>{t.usePromoCode}: <strong>{event.promoCode}</strong></p>
        <a href={event.hotelReservationLink} className="text-blue-600 hover:underline">
          {t.bookHotel}
        </a>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t.yourQRCode}</h2>
        <p className="mb-2">{t.qrCodeInstructions}</p>
        <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold">{t.rsvp}</label>
          <select
            value={rsvpStatus}
            onChange={(e) => setRsvpStatus(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">{t.selectOption}</option>
            <option value="attending">{t.attending}</option>
            <option value="notAttending">{t.notAttending}</option>
          </select>
        </div>

        {isPersonalEvent && rsvpStatus === 'attending' && (
          <>
            <div>
              <label className="block mb-2 font-semibold">{t.menuChoice}</label>
              <select
                value={menuChoice}
                onChange={(e) => setMenuChoice(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">{t.selectMenu}</option>
                {menus.map(menu => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name} - {menu.details}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">{t.drinkChoice}</label>
              <select
                value={drinkChoice}
                onChange={(e) => setDrinkChoice(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">{t.selectDrink}</option>
                {drinks.map(drink => (
                  <option key={drink} value={drink}>{drink}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block mb-2 font-semibold">{t.comment}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t.submit}
        </button>
      </form>
    </div>
  );
};

// Exemple d'utilisation
const App = () => {
  const eventExample = {
    id: "evt_123",
    name: "Mariage de Alice et Bob",
    type: "wedding",
    description: "Nous sommes heureux de vous inviter à notre mariage !",
    date: "2023-12-31",
    time: "18:00",
    location: "Château de Versailles",
    promoCode: "ALICEBOB2023",
    hotelReservationLink: "https://hotel-reservation.com/alicebob2023"
  };

  const guestExample = {
    id: "guest_456",
    name: "Charlie Dupont",
    email: "charlie@example.com"
  };

  const translations = {
    invitationTo: "Invitation pour",
    date: "Date",
    at: "à",
    location: "Lieu",
    hotelReservation: "Réservation d'hôtel",
    usePromoCode: "Utilisez le code promo",
    bookHotel: "Réserver l'hôtel",
    yourQRCode: "Votre QR Code",
    qrCodeInstructions: "Veuillez présenter ce QR Code à l'entrée de l'événement",
    rsvp: "RSVP",
    selectOption: "Sélectionnez une option",
    attending: "Je serai présent(e)",
    notAttending: "Je ne pourrai pas être présent(e)",
    menuChoice: "Choix du menu",
    selectMenu: "Sélectionnez un menu",
    drinkChoice: "Choix de boisson",
    selectDrink: "Sélectionnez une boisson",
    comment: "Commentaire",
    submit: "Envoyer"
  };

  return (
    <EmailInvitation 
      event={eventExample}
      guest={guestExample}
      translations={translations}
    />
  );
};

export default App;