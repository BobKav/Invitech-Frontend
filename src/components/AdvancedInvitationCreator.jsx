import React, { useState, useEffect } from 'react';
import { Edit, Image, Calendar, MapPin, Send, Download, Plus, Smartphone, Trash, Save } from 'lucide-react';
import { getInvitationTemplates, customizeTemplate, createInvitation, sendInvitation } from '../services/api';

const AdvancedInvitationCreator = ({ eventId, eventDetails }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [invitation, setInvitation] = useState({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'Arial',
    title: eventDetails?.name || 'Mon Événement',
    date: eventDetails?.date || '',
    time: eventDetails?.time || '',
    location: eventDetails?.location || '',
    description: eventDetails?.description || 'Vous êtes cordialement invité(e) à notre événement.',
    imageUrl: '',
    imageFilter: 'none',
    decorativeElements: []
  });
  const [layout, setLayout] = useState([
    { id: 'title', type: 'text', content: invitation.title },
    { id: 'image', type: 'image', content: invitation.imageUrl },
    { id: 'date', type: 'text', content: `${invitation.date} à ${invitation.time}` },
    { id: 'location', type: 'text', content: invitation.location },
    { id: 'description', type: 'text', content: invitation.description }
  ]);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [category, setCategory] = useState('');
  const [aiPreferences, setAiPreferences] = useState({ category: '', style: '', mood: '' });
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    fetchTemplates(category);
  }, [category]);

  const fetchTemplates = async (category) => {
    try {
      const response = await getInvitationTemplates(category);
      setTemplates(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
    }
  };

  const handleGenerateAITemplate = async () => {
    try {
      const response = await customizeTemplate('ai-generated', aiPreferences);
      setTemplates(prev => [response.data, ...prev]);
      setSelectedTemplate(response.data);
    } catch (error) {
      console.error('Erreur lors de la génération du template IA:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await createInvitation({
        eventId,
        templateId: selectedTemplate.id,
        customizations: invitation
      });
      console.log('Invitation sauvegardée:', response.data);
      const draft = { id: Date.now(), invitation, layout, selectedTemplate };
      setDrafts(prev => [...prev, draft]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'invitation:', error);
    }
  };

  const handleSend = async () => {
    try {
      const response = await sendInvitation(invitation.id);
      console.log('Invitation envoyée:', response.data);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'invitation:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvitation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvitation(prev => ({ ...prev, imageUrl: reader.result }));
        setLayout(prev => prev.map(item => 
          item.id === 'image' ? { ...item, content: reader.result } : item
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const moveItem = (fromIndex, toIndex) => {
    const newLayout = [...layout];
    const [movedItem] = newLayout.splice(fromIndex, 1);
    newLayout.splice(toIndex, 0, movedItem);
    setLayout(newLayout);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Appliquer le style du template à l'invitation
  };

  const handleLoadDraft = (draft) => {
    setInvitation(draft.invitation);
    setLayout(draft.layout);
    setSelectedTemplate(draft.selectedTemplate);
  };

  const applyImageFilter = (filter) => {
    setInvitation(prev => ({ ...prev, imageFilter: filter }));
  };

  const addDecorativeElement = (element) => {
    setInvitation(prev => ({
      ...prev,
      decorativeElements: [...prev.decorativeElements, element]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Créateur d'invitations avancé</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Galerie de modèles et IA générative */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Modèles d'invitation</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="">Toutes les catégories</option>
            <option value="Mariage">Mariage</option>
            <option value="Professionnel">Professionnel</option>
            <option value="Anniversaire">Anniversaire</option>
          </select>
          <div className="mb-4">
            <h4 className="text-md font-semibold mb-2">Générer avec IA</h4>
            <input
              type="text"
              placeholder="Style (ex: moderne, classique)"
              value={aiPreferences.style}
              onChange={(e) => setAiPreferences(prev => ({ ...prev, style: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="Ambiance (ex: joyeuse, formelle)"
              value={aiPreferences.mood}
              onChange={(e) => setAiPreferences(prev => ({ ...prev, mood: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            />
            <button
              onClick={handleGenerateAITemplate}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Générer un modèle IA
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-96">
            {templates.map(template => (
              <div 
                key={template.id} 
                className={`cursor-pointer border rounded-lg p-2 ${selectedTemplate?.id === template.id ? 'border-indigo-500' : ''}`}
                onClick={() => handleTemplateSelect(template)}
              >
                <img src={template.imageUrl} alt={template.name} className="w-full h-32 object-cover rounded" />
                <p className="text-center mt-2">{template.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Éditeur d'invitation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Personnalisation</h3>
          <div className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Police</label>
              <select
                name="fontFamily"
                value={invitation.fontFamily}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier">Courier</option>
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filtre d'image</label>
              <select
                name="imageFilter"
                value={invitation.imageFilter}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="none">Aucun</option>
                <option value="grayscale">Noir et blanc</option>
                <option value="sepia">Sépia</option>
                <option value="blur">Flou</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Éléments décoratifs</label>
              <button
                onClick={() => addDecorativeElement('fleur')}
                className="mr-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded"
              >
                Ajouter fleur
              </button>
              <button
                onClick={() => addDecorativeElement('ruban')}
                className="mr-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded"
              >
                Ajouter ruban
              </button>
            </div>
          </div>
          <div className="mt-4 border rounded-lg p-4">
            <h4 className="text-md font-semibold mb-2">Mise en page</h4>
            {layout.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded">
                <span>{item.id}</span>
                <div>
                  <button onClick={() => moveItem(index, Math.max(0, index - 1))} className="px-2 py-1 bg-gray-200 rounded mr-2">↑</button>
                  <button onClick={() => moveItem(index, Math.min(layout.length - 1, index + 1))} className="px-2 py-1 bg-gray-200 rounded">↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aperçu de l'invitation et gestion des brouillons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Aperçu</h3>
          <div className="flex justify-center space-x-2 mb-4">
            <button onClick={() => setPreviewDevice('mobile')} className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-indigo-100' : ''}`}>
              <Smartphone size={20} />
            </button>
            <button onClick={() => setPreviewDevice('desktop')} className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-indigo-100' : ''}`}>
              Desktop
            </button>
          </div>
          <div 
            className={`border rounded-lg p-6 mb-4 ${
              previewDevice === 'mobile' ? 'w-64 mx-auto' : 'w-full'
            }`}
            style={{ 
              backgroundColor: invitation.backgroundColor, 
              color: invitation.textColor,
              fontFamily: invitation.fontFamily
            }}
          >
            {layout.map((item) => {
              switch (item.id) {
                case 'title':
                  return <h1 key={item.id} className="text-2xl font-bold mb-4">{item.content}</h1>;
                case 'image':
                  return item.content && (
                    <div key={item.id} className="mb-4">
                      <img 
                        src={item.content} 
                        alt="Invitation" 
                        className="w-full h-40 object-cover rounded" 
                        style={{ filter: invitation.imageFilter }}
                      />
                    </div>
                  );
                case 'date':
                  return <p key={item.id} className="mb-2"><Calendar className="inline mr-2" size={16} />{item.content}</p>;
                case 'location':
                  return <p key={item.id} className="mb-4"><MapPin className="inline mr-2" size={16} />{item.content}</p>;
                case 'description':
                  return <p key={item.id} className="mb-4">{item.content}</p>;
                default:
                  return null;
              }
            })}
            {invitation.decorativeElements.map((element, index) => (
              <div key={index} className="absolute" style={{ top: '10px', left: '10px' }}>
                {element === 'fleur' && '🌸'}
                {element === 'ruban' && '🎀'}
              </div>
            ))}
          </div>
          <div className="flex justify-between mb-4">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            >
             <Save className="mr-2" size={16} />
              Sauvegarder brouillon
            </button>
            <button 
              onClick={handleSend}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <Send className="mr-2" size={16} />
              Envoyer
            </button>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Brouillons sauvegardés</h4>
            <ul className="space-y-2">
              {drafts.map(draft => (
                <li key={draft.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>Brouillon du {new Date(draft.id).toLocaleString()}</span>
                  <button
                    onClick={() => handleLoadDraft(draft)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Charger
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedInvitationCreator;