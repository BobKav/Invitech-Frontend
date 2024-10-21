import React, { useState } from 'react';
import { Edit, Image, Type, Calendar, MapPin, Send, Download, Plus } from 'lucide-react';
import config from '../config';

const InvitationCreator = ({ eventId, eventDetails }) => {
  const [invitation, setInvitation] = useState({
    template: 'template1',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    title: eventDetails?.name || 'Mon Événement',
    date: eventDetails?.date || '',
    time: eventDetails?.time || '',
    location: eventDetails?.location || '',
    description: eventDetails?.description || 'Vous êtes cordialement invité(e) à notre événement.',
    imageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvitation(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvitation(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Ici, vous implémenteriez la logique pour sauvegarder l'invitation
    console.log('Invitation sauvegardée:', invitation);
  };

  const handleSend = () => {
    // Ici, vous implémenteriez la logique pour envoyer l'invitation
    console.log('Invitation envoyée:', invitation);
  };

  const searchTemplates = async (query) => {
    const response = await fetch(`https://api.freepik.com/v1/resources?apikey=${config.FREEPIK_API_KEY}&q=${query}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Créateur d'invitations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulaire de personnalisation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Personnalisation</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <select
                name="template"
                value={invitation.template}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="template1">Modèle 1</option>
                <option value="template2">Modèle 2</option>
                <option value="template3">Modèle 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur de fond</label>
              <input
                type="color"
                name="backgroundColor"
                value={invitation.backgroundColor}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur du texte</label>
              <input
                type="color"
                name="textColor"
                value={invitation.textColor}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                name="title"
                value={invitation.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={invitation.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                name="time"
                value={invitation.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
              <input
                type="text"
                name="location"
                value={invitation.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={invitation.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Aperçu de l'invitation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Aperçu</h3>
          <div 
            className="border rounded-lg p-6 mb-4"
            style={{ backgroundColor: invitation.backgroundColor, color: invitation.textColor }}
          >
            <h1 className="text-2xl font-bold mb-4">{invitation.title}</h1>
            {invitation.imageUrl && (
              <img src={invitation.imageUrl} alt="Invitation" className="w-full h-40 object-cover mb-4 rounded" />
            )}
            <p className="mb-2"><Calendar className="inline mr-2" size={16} />{invitation.date} à {invitation.time}</p>
            <p className="mb-4"><MapPin className="inline mr-2" size={16} />{invitation.location}</p>
            <p className="mb-4">{invitation.description}</p>
          </div>
          <div className="flex justify-between">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Download className="mr-2" size={16} />
              Sauvegarder
            </button>
            <button 
              onClick={handleSend}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <Send className="mr-2" size={16} />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationCreator;