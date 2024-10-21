import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventCreator, setShowEventCreator] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    category: 'Autre'
  });

  useEffect(() => {
    // Simuler le chargement des événements depuis une API
    const fetchEvents = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockEvents = [
        { id: 1, title: "Mariage de Sophie et Thomas", date: "2023-07-15", category: "Mariage" },
        { id: 2, title: "Conférence Tech Inno", date: "2023-07-22", category: "Professionnel" },
        { id: 3, title: "Anniversaire de Julie", date: "2023-07-05", category: "Anniversaire" },
      ];
      setEvents(mockEvents);
    };
    fetchEvents();
  }, []);

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= days; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateString);

      calendarDays.push(
        <div key={day} className="p-2 border border-gray-200 min-h-[100px]">
          <div className="font-bold">{day}</div>
          {dayEvents.map(event => (
            <div 
              key={event.id}
              className="text-xs p-1 mb-1 rounded cursor-pointer bg-indigo-100 text-indigo-800"
              onClick={() => setSelectedEvent(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }

    return calendarDays;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNewEvent = () => {
    setShowEventCreator(true);
  };

  const handleEventCreated = (e) => {
    e.preventDefault();
    const createdEvent = {
      ...newEvent,
      id: Date.now()
    };
    setEvents([...events, createdEvent]);
    setShowEventCreator(false);
    setNewEvent({ title: '', date: '', category: 'Autre' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Calendrier des événements</h2>
        <button onClick={handleNewEvent} className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center">
          <Plus size={20} className="mr-2" />
          Nouvel événement
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2"><ChevronLeft /></button>
        <h3 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={nextMonth} className="p-2"><ChevronRight /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">{selectedEvent.title}</h3>
            <p className="mb-2">Date : {selectedEvent.date}</p>
            <p className="mb-4">Catégorie : {selectedEvent.category}</p>
            <button 
              onClick={() => setSelectedEvent(null)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      {showEventCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Créer un nouvel événement</h3>
              <button onClick={() => setShowEventCreator(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEventCreated}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  id="category"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Autre">Autre</option>
                  <option value="Mariage">Mariage</option>
                  <option value="Anniversaire">Anniversaire</option>
                  <option value="Professionnel">Professionnel</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md">
                Créer l'événement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;