import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Clock, Calendar, Search, Filter } from 'lucide-react';

const TaskManagement = ({ eventId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'medium' });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simuler le chargement des tâches depuis une API
    const fetchTasks = async () => {
      // Remplacer ceci par un vrai appel API
      const mockTasks = [
        { id: 1, title: 'Réserver le lieu', completed: false, dueDate: '2023-12-01', priority: 'high' },
        { id: 2, title: 'Envoyer les invitations', completed: true, dueDate: '2023-11-15', priority: 'high' },
        { id: 3, title: 'Choisir le menu', completed: false, dueDate: '2023-12-15', priority: 'medium' },
        { id: 4, title: 'Organiser la décoration', completed: false, dueDate: '2023-12-20', priority: 'low' },
      ];
      setTasks(mockTasks);
    };
    fetchTasks();
  }, [eventId]);

  const handleAddTask = (e) => {
    e.preventDefault();
    const taskToAdd = { ...newTask, id: tasks.length + 1, completed: false };
    setTasks([...tasks, taskToAdd]);
    setNewTask({ title: '', dueDate: '', priority: 'medium' });
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  }).filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Gestion des tâches</h2>

      {/* Formulaire d'ajout de tâche */}
      <form onSubmit={handleAddTask} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Nouvelle tâche"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="w-full md:w-1/4 px-2">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          <Plus className="inline-block mr-2" size={16} />
          Ajouter une tâche
        </button>
      </form>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="relative w-full md:w-auto mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Rechercher une tâche"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-md ${filter === 'active' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
          >
            Actives
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Terminées
          </button>
        </div>
      </div>

      {/* Liste des tâches */}
      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="h-5 w-5 text-indigo-600"
              />
              <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                <Filter className="inline-block mr-1" size={14} />
                {task.priority}
              </span>
              <span className="text-sm text-gray-500">
                <Calendar className="inline-block mr-1" size={14} />
                {task.dueDate}
              </span>
              <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700">
                <X size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManagement;