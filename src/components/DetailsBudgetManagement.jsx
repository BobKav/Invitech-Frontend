import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Plus, DollarSign, Tag, Calendar, Trash2 } from 'lucide-react';
import api from '../services/api';

const DetailsBudgetManagement = ({ eventId }) => {
  const [budget, setBudget] = useState({
    total: 25000,
    spent: 0,
    remaining: 25000
  });
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: ''
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    // Simuler le chargement des dépenses depuis une API
    const fetchExpenses = async () => {
      // Remplacer ceci par un vrai appel API
      const mockExpenses = [
        { id: 1, description: 'Location salle', amount: 5000, category: 'Lieu', date: '2023-11-15' },
        { id: 2, description: 'Traiteur', amount: 7500, category: 'Nourriture', date: '2023-12-01' },
        { id: 3, description: 'DJ', amount: 1200, category: 'Divertissement', date: '2023-12-15' },
        { id: 4, description: 'Décoration', amount: 2000, category: 'Décor', date: '2024-01-10' },
      ];
      setExpenses(mockExpenses);
      updateBudget(mockExpenses);
    };
    fetchExpenses();
  }, [eventId]);

  const updateBudget = (currentExpenses) => {
    const totalSpent = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    setBudget(prev => ({
      ...prev,
      spent: totalSpent,
      remaining: prev.total - totalSpent
    }));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const expenseToAdd = { 
      ...newExpense, 
      id: expenses.length + 1, 
      amount: parseFloat(newExpense.amount)
    };
    const updatedExpenses = [...expenses, expenseToAdd];
    setExpenses(updatedExpenses);
    updateBudget(updatedExpenses);
    setNewExpense({ description: '', amount: '', category: '', date: '' });
  };

  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    updateBudget(updatedExpenses);
  };

  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Gestion du Budget</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Budget Total</h3>
          <p className="text-2xl font-bold text-blue-600">{budget.total.toLocaleString()} €</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Dépensé</h3>
          <p className="text-2xl font-bold text-green-600">{budget.spent.toLocaleString()} €</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Restant</h3>
          <p className="text-2xl font-bold text-yellow-600">{budget.remaining.toLocaleString()} €</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Ajouter une dépense</h3>
        <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              id="description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <DollarSign className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <div className="relative">
              <input
                type="text"
                id="category"
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <Tag className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                id="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <Calendar className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              <Plus className="inline-block mr-2" size={16} />
              Ajouter la dépense
            </button>
          </div>
        </form>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Répartition des dépenses</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Liste des dépenses</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.amount.toLocaleString()} €</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};