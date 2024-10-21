import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import MessagingSystem from './components/MessagingSystem';
import RemindersNotifications from './components/RemindersNotifications';

const NotificationItem = ({ notification, onDismiss }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-400" />;
      case 'error':
        return <X className="h-6 w-6 text-red-400" />;
      default:
        return <Info className="h-6 w-6 text-blue-400" />;
    }
  };

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 ${
      notification.type === 'success' ? 'border-green-500' :
      notification.type === 'warning' ? 'border-yellow-500' :
      notification.type === 'error' ? 'border-red-500' :
      'border-blue-500'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
          <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => onDismiss(notification.id)}
          >
            <span className="sr-only">Fermer</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simuler la réception de notifications
    const fetchNotifications = async () => {
      <MessagingSystem />
      const mockNotifications = [
        { id: 1, type: 'success', title: 'Invitations envoyées', message: "Toutes les invitations pour l'événement \"Mariage de Sophie et Thomas\" ont été envoyées avec succès." },
        { id: 2, type: 'warning', title: 'Rappel', message: "N'oubliez pas de finaliser la liste de musique pour l'événement \"Mariage de Sophie et Thomas\"." },
        { id: 3, type: 'info', title: 'Nouvel inscrit', message: "Un nouveau participant s'est inscrit à l'événement \"Conférence Tech Inno\"." }
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={toggleNotifications}
      >
        <span className="sr-only">Voir les notifications</span>
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg py-4 z-10">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          <div className="px-4 py-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune nouvelle notification</p>
            ) : (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={dismissNotification}
                />
              ))
            )}
          </div>
          <RemindersNotifications />
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;