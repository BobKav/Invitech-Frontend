import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  // Événements
  getEvents: () => axios.get(`${API_URL}/events`),
  createEvent: (eventData) => axios.post(`${API_URL}/events`, eventData),
  updateEvent: (id, eventData) => axios.put(`${API_URL}/events/${id}`, eventData),
  deleteEvent: (id) => axios.delete(`${API_URL}/events/${id}`),
  getEventDetails: (id) => axios.get(`${API_URL}/events/${id}`),

  // Budget et dépenses
  getBudget: (eventId) => axios.get(`${API_URL}/events/${eventId}/budget`),
  addExpense: (eventId, expenseData) => axios.post(`${API_URL}/events/${eventId}/expenses`, expenseData),
  deleteExpense: (eventId, expenseId) => axios.delete(`${API_URL}/events/${eventId}/expenses/${expenseId}`),

  // Invités
  getGuests: (eventId) => axios.get(`${API_URL}/events/${eventId}/guests`),
  addGuest: (eventId, guestData) => axios.post(`${API_URL}/events/${eventId}/guests`, guestData),
  updateGuest: (eventId, guestId, guestData) => axios.put(`${API_URL}/events/${eventId}/guests/${guestId}`, guestData),
  deleteGuest: (eventId, guestId) => axios.delete(`${API_URL}/events/${eventId}/guests/${guestId}`),

  // Invitations
  getInvitations: (eventId) => axios.get(`${API_URL}/events/${eventId}/invitations`),
  sendInvitation: (eventId, invitationData) => axios.post(`${API_URL}/events/${eventId}/invitations`, invitationData),
  updateInvitation: (eventId, invitationId, invitationData) => axios.put(`${API_URL}/events/${eventId}/invitations/${invitationId}`, invitationData),

  // Contrôle d'accès
  getEventStats: (eventId) => axios.get(`${API_URL}/events/${eventId}/stats`),
  verifyQRCode: (eventId, qrData) => axios.post(`${API_URL}/events/${eventId}/verify-qr`, { qrData }),

  // Réservations d'hôtel
  getHotels: (eventId) => axios.get(`${API_URL}/events/${eventId}/hotels`),
  createHotelReservation: (eventId, reservationData) => axios.post(`${API_URL}/events/${eventId}/hotel-reservations`, reservationData),

  // Analytiques
  getAnalytics: (eventId) => axios.get(`${API_URL}/events/${eventId}/analytics`),

  // Authentification
  login: (credentials) => axios.post(`${API_URL}/auth/login`, credentials),
  register: (userData) => axios.post(`${API_URL}/auth/register`, userData),
  getCurrentUser: () => axios.get(`${API_URL}/auth/me`),

  // Templates d'invitation
  getInvitationTemplates: (category) => axios.get(`${API_URL}/invitation-templates`, { params: { category } }),
  customizeTemplate: (templateId, customizations) => axios.post(`${API_URL}/invitation-templates/${templateId}/customize`, customizations),

  // Freepik API
  searchFreepikTemplates: (query) => axios.get(`${API_URL}/freepik/search`, { params: { query } }),
  getFreepikTemplateDetails: (templateId) => axios.get(`${API_URL}/freepik/templates/${templateId}`),
};

export default api;