import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // Ici, vous intégreriez votre logique de réinitialisation de mot de passe réelle
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Échec de la demande de réinitialisation');
      setMessage('Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.');
    } catch (err) {
      setError('Une erreur est survenue lors de la demande de réinitialisation.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-8">
          <img src="/logo-invitech.svg" alt="Invitech Logo" className="h-12" />
        </div>
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Réinitialisation du mot de passe</h2>
        {message && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse e-mail
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="vous@exemple.com"
                required
              />
              <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Réinitialiser le mot de passe
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
            Retour à la page de connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;