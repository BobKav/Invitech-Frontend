import React, { useState, useEffect } from 'react';
import { Bell, Plus, Check, X, Clock } from 'lucide-react';

const RemindersNotifications = () => {
  const [reminders, setReminders] = useState([]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    date: '',
    time: '',
    eventId: null
  });

  useEffect(() => {
    // Simuler le chargement des rappels depuis une API
    const fetchReminders = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockReminders = [
        { id: 1, title: "Confirmer le traiteur", date: "2023-07-10", time: "09:00", eventId: 1, completed: false },
        { id: 2, title: "Envoyer les invitations", date: "2023-07-05", time: "14:00", eventId: 1, completed: true },
        { id: 3, title: "Préparer la présentation", date: "2023-07-20", time: "10:00", eventId: 2, completed: false },
      ];
      setReminders(mockReminders);
    };
    fetchReminders();
  }, []);

  const handleAddReminder = (e) => {
    e.preventDefault();
    const createdReminder = {
      ...newReminder,
      id: Date.now(),
      completed: false
    };
    setReminders([...reminders, createdReminder]);
    setShowAddReminder(false);
    setNewReminder({ title: '', date: '', time: '', eventId: null });
  };

  const toggleReminderCompletion = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rappels et Notifications</h2>
        <button 
          onClick={() => setShowAddReminder(true)} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Nouveau rappel
        </button>
      </div>

      <div className="space-y-4">
        {reminders.map(reminder => (
          <div 
            key={reminder.id} 
            className={`flex items-center justify-between p-4 rounded-lg ${
              reminder.completed ? 'bg-gray-100' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <button 
                onClick={() => toggleReminderCompletion(reminder.id)}
                className={`p-1 rounded-full mr-4 ${
                  reminder.completed ? 'bg-green-500 text-white' : 'border border-gray-300'
                }`}
              >
                {reminder.completed && <Check size={16} />}
              </button>
              <div>
                <h3 className={`font-semibold ${reminder.completed ? 'line-through text-gray-500' : ''}`}>
                  {reminder.title}
                </h3>
                <p className="text-sm text-gray-500">
                  <Clock size={14} className="inline mr-1" />
                  {reminder.date} à {reminder.time}
                </p>
              </div>
            </div>
            <button 
              onClick={() => deleteReminder(reminder.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      {showAddReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Ajouter un nouveau rappel</h3>
            <form onSubmit={handleAddReminder}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  id="title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <input
                  type="time"
                  id="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddReminder(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemindersNotifications;