import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptRGPD, setAcceptRGPD] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!acceptTerms || !acceptRGPD) {
      setError('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité');
      return;
    }
    try {
      // Ici, vous intégreriez votre logique d'inscription réelle
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) throw new Error('Échec de l\'inscription');
      // Rediriger vers le tableau de bord ou la page d'accueil après inscription
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
    }
  };

  const handleSocialSignup = (provider) => {
    // Ici, vous intégreriez la logique d'inscription sociale
    console.log(`Inscription avec ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-8">
          <img src="/logo-invitech.svg" alt="Invitech Logo" className="h-12" />
        </div>
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Rejoignez Invitech</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John Doe"
                required
              />
              <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center">
            <input
              id="accept-terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
              J'accepte les <a href="#" className="text-indigo-600 hover:text-indigo-500">conditions d'utilisation</a>
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="accept-rgpd"
              type="checkbox"
              checked={acceptRGPD}
              onChange={(e) => setAcceptRGPD(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="accept-rgpd" className="ml-2 block text-sm text-gray-900">
              J'accepte la <a href="#" className="text-indigo-600 hover:text-indigo-500">politique de confidentialité (RGPD)</a>
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              S'inscrire
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou s'inscrire avec</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSocialSignup('Google')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign up with Google</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </button>
            <button
              onClick={() => handleSocialSignup('Facebook')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign up with Facebook</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => handleSocialSignup('Apple')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign up with Apple</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.543 13.789C17.257 14.444 16.943 15 16.6 15.5c-.47.667-.941 1.167-1.415 1.5-.566.408-1.174.617-1.823.617-.463 0-1.027-.134-1.69-.4-.664-.267-1.273-.4-1.827-.4-.586 0-1.212.133-1.878.4-.665.267-1.202.4-1.61.4-.74 0-1.403-.257-1.989-.77-.626-.555-1.127-1.233-1.501-2.033-.407-.867-.611-1.79-.611-2.77 0-1.023.239-1.902.717-2.636.377-.578.878-1.034 1.503-1.368.625-.334 1.302-.5 2.032-.5.463 0 1.068.133 1.817.4.749.267 1.231.4 1.445.4.157 0 .69-.156 1.598-.467.855-.29 1.575-.41 2.161-.367 1.597.135 2.794.798 3.592 1.99-1.427.9-2.136 2.161-2.125 3.78.01 1.265.455 2.317 1.332 3.158.395.374.837.663 1.326.868-.106.32-.218.624-.335.912zM13.445.076c0 .99-.268 1.912-.803 2.77-.643 1.023-1.422 1.612-2.337 1.78-.01-.085-.015-.17-.015-.253 0-.963.301-1.993.902-3.09.3-.546.685-1.023 1.154-1.433.47-.4.915-.694 1.337-.879.121.378.182.756.182 1.134l-.42-.03z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;