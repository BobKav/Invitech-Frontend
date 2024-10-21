import React, { useState, useEffect } from 'react';
import { 
  Home, Calendar, Users, MessageSquare, Layers, Moon, Settings, Bell, Search, Globe, ChevronDown, Plus
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import api from '../services/api';

const Header = () => (
  <header className="bg-white shadow-sm p-4 flex justify-between items-center">
    <div className="flex items-center">
      <img src="/logo-invitech.svg" alt="Invitech Logo" className="h-8 w-8 mr-2" />
      <span className="font-bold text-xl text-indigo-600">Invitech</span>
      <span className="ml-4 font-semibold">Dashboard</span>
    </div>
    <div className="flex-1 max-w-3xl mx-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher"
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <button className="relative p-2 text-gray-400 hover:text-indigo-500">
        <Bell size={20} />
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
      </button>
      <div className="relative">
        <button className="flex items-center space-x-1 focus:outline-none">
          <Globe size={20} />
          <span>FR</span>
          <ChevronDown size={16} />
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <img src="/api/placeholder/32/32" alt="Utilisateur" className="h-8 w-8 rounded-full" />
        <span className="font-medium">Mpiodi Thompson</span>
      </div>
    </div>
  </header>
);

const NotificationCard = ({ title, count, color, onClick }) => (
  <div 
    className={`bg-${color}-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200`}
    onClick={onClick}
  >
    <h3 className="font-semibold">{title}</h3>
    <p className={`text-sm text-${color}-800`}>{count} {title.toLowerCase()}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalGuests: 0,
    budget: {
      initial: 0,
      spent: 0,
      remaining: 0
    }
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [eventStatisticsData, setEventStatisticsData] = useState([]);
  const [weeklyEventData, setWeeklyEventData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.getDashboardData();
      setStats(response.data.stats);
      setEventStatisticsData(response.data.eventStatistics);
      setWeeklyEventData(response.data.weeklyEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des données du dashboard:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-8">
          <div className="grid grid-cols-4 gap-4 mb-8 items-center">
            <NotificationCard 
              title="Notifications" 
              count="5 non lues" 
              color="yellow" 
              onClick={() => setShowNotifications(!showNotifications)} 
            />
            <NotificationCard 
              title="Messages" 
              count="3 nouveaux" 
              color="green" 
              onClick={() => setShowMessages(!showMessages)} 
            />
            <NotificationCard 
              title="Calendrier" 
              count="2 événements aujourd'hui" 
              color="purple" 
              onClick={() => setShowCalendar(!showCalendar)} 
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-indigo-700 transition-colors duration-200">
              <Plus size={20} className="mr-2" />
              Créer un nouvel événement
            </button>
          </div>
          
          {showNotifications && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-bold mb-2">Liste des notifications</h3>
              {/* Ajouter ici la liste des notifications */}
            </div>
          )}

          {showMessages && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-bold mb-2">Liste des messages</h3>
              {/* Ajouter ici la liste des messages */}
            </div>
          )}

          {showCalendar && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-bold mb-2">Événements du jour</h3>
              {/* Ajouter ici la liste des événements du jour */}
            </div>
          )}

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Statistiques des événements</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eventStatisticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Réalisés" stroke="#8884d8" />
                  <Line type="monotone" dataKey="EnCours" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-8">
              <div className="bg-indigo-600 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">Gérez vos événements en un clic</h3>
                <p className="text-sm mb-4">Simplifiez votre planification d'événements avec Invitech.</p>
                <button className="bg-white text-indigo-600 px-4 py-2 rounded font-medium">
                  Essayez maintenant
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Gestion du budget</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Initial', value: stats.budget.initial },
                        { name: 'Dépensé', value: stats.budget.spent },
                        { name: 'Restant', value: stats.budget.remaining }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {
                        [stats.budget.initial, stats.budget.spent, stats.budget.remaining].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                      }
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Événements hebdomadaires</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyEventData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Prochain événement</h2>
              <div className="bg-orange-500 text-white p-4 rounded">
                <p className="font-semibold">10:00</p>
                <p>Réunion de planification - Mariage de Sophie et Thomas</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;