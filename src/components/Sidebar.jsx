// Sidebar.jsx
import React from 'react';
import { Home, Calendar, Users, MessageSquare, Layers, Settings, Moon, Plus } from 'lucide-react';

const Sidebar = () => (
  <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-md">
    <div className="p-4">
      <h1 className="text-2xl font-bold text-indigo-600">Invitech</h1>
      <p className="text-sm text-gray-500">Gestion d'événements</p>
    </div>
    <nav className="mt-8">
      <a href="/" className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700">
        <Home className="mr-3" size={20} />
        Tableau de bord
      </a>
      <a href="/create-event" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
        <Plus className="mr-3" size={20} />
        Créer un événement
      </a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
        <Calendar className="mr-3" size={20} />
        Événements
      </a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
        <Users className="mr-3" size={20} />
        Invités
      </a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
        <Layers className="mr-3" size={20} />
        Planification
      </a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
        <MessageSquare className="mr-3" size={20} />
        Messages
      </a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
        <Settings className="mr-3" size={20} />
        Paramètres
      </a>
      <a href="/event/:eventId/guests" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
      <Users className="mr-3" size={20} />
      Gestion des invités
      </a>
      <a href="/event/:eventId/invitations" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
      <Mail className="mr-3" size={20} />
      Gestion des invitations
      </a>
      <a href="/event/:eventId/access-control" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
      <QrCode className="mr-3" size={20} />
      Contrôle d'accès
      </a>
      <a href="/event/:eventId/dashboard" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
      <BarChart2 className="mr-3" size={20} />
      Tableau de bord en temps réel
      </a>
    </nav>
    <div className="absolute bottom-4 left-4 flex items-center">
      <Moon className="mr-2" size={20} />
      <span>Mode sombre</span>
      <div className="ml-2 w-8 h-4 bg-indigo-600 rounded-full relative">
        <div className="absolute right-0 top-0 bg-white w-4 h-4 rounded-full shadow"></div>
      </div>
    </div>
  </div>
);

export default Sidebar;