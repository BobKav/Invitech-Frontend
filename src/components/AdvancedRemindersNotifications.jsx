import React, { useState, useEffect } from 'react';
import { Bell, Plus, Check, X, Clock, Calendar, Filter, Mail, Smartphone } from 'lucide-react';

const AdvancedRemindersNotifications = ({ events = [] }) => {
  const [reminders, setReminders] = useState([]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    date: '',
    time: '',
    eventId: null,
    category: 'Autre',
    priority: 'Normal',
    recurrence: 'none',
    notificationMethod: ['app']
  });
  const [filter, setFilter] = useState({ category: 'all', priority: 'all' });
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Simuler le chargement des rappels depuis une API
    const fetchReminders = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockReminders = [
        { id: 1, title: "Confirmer le traiteur", date: "2023-07-10", time: "09:00", eventId: 1, completed: false, category: "Mariage", priority: "Haute", recurrence: "none", notificationMethod: ["app", "email"] },
        { id: 2, title: "Envoyer les invitations", date: "2023-07-05", time: "14:00", eventId: 1, completed: true, category: "Mariage", priority: "Normal", recurrence: "none", notificationMethod: ["app"] },
        { id: 3, title: "Préparer la présentation", date: "2023-07-20", time: "10:00", eventId: 2, completed: false, category: "Professionnel", priority: "Haute", recurrence: "weekly", notificationMethod: ["app", "push"] },
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
    setNewReminder({
      title: '',
      date: '',
      time: '',
      eventId: null,
      category: 'Autre',
      priority: 'Normal',
      recurrence: 'none',
      notificationMethod: ['app']
    });

    // Simuler l'envoi d'une notification
    if (createdReminder.notificationMethod.includes('push')) {
      console.log("Notification push envoyée pour:", createdReminder.title);
    }
    if (createdReminder.notificationMethod.includes('email')) {
      console.log("Email de notification envoyé pour:", createdReminder.title);
    }
  };

  const toggleReminderCompletion = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const filteredAndSortedReminders = reminders
    .filter(reminder => 
      (filter.category === 'all' || reminder.category === filter.category) &&
      (filter.priority === 'all' || reminder.priority === filter.priority)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time);
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'Basse': 0, 'Normal': 1, 'Haute': 2 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

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

      <div className="mb-4 flex space-x-4">
        <select 
          value={filter.category}
          onChange={(e) => setFilter({...filter, category: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">Toutes les catégories</option>
          <option value="Mariage">Mariage</option>
          <option value="Professionnel">Professionnel</option>
          <option value="Autre">Autre</option>
        </select>
        <select 
          value={filter.priority}
          onChange={(e) => setFilter({...filter, priority: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">Toutes les priorités</option>
          <option value="Basse">Basse</option>
          <option value="Normal">Normal</option>
          <option value="Haute">Haute</option>
        </select>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="date">Trier par date</option>
          <option value="priority">Trier par priorité</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredAndSortedReminders.map(reminder => (
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
                  {reminder.eventId && events.find(e => e.id === reminder.eventId) && (
                    <span className="ml-2">
                      <Calendar size={14} className="inline mr-1" />
                      {events.find(e => e.id === reminder.eventId).title}
                    </span>
                  )}
                </p>
                <div className="flex space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    reminder.priority === 'Haute' ? 'bg-red-100 text-red-800' :
                    reminder.priority === 'Normal' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {reminder.priority}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {reminder.category}
                  </span>
                  {reminder.recurrence !== 'none' && (
                    <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 flex items-center">
                      <Bell size={12} className="mr-1" />
                      {reminder.recurrence}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {reminder.notificationMethod.includes('push') && <Smartphone size={16} />}
              {reminder.notificationMethod.includes('email') && <Mail size={16} />}
              <button 
                onClick={() => deleteReminder(reminder.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Ajouter un nouveau rappel</h3>
            <form onSubmit={handleAddReminder}>
              {/* Formulaire d'ajout de rappel */}
              {/* ... (le reste du formulaire reste inchangé) ... */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedRemindersNotifications;