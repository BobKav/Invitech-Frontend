import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const TemplateCustomizer = ({ onSave }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customizations, setCustomizations] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get('/api/invitations/categories');
    setCategories(response.data);
  };

  const searchTemplates = async (query) => {
    const response = await fetch(`https://api.freepik.com/v1/resources?apikey=${config.FREEPIK_API_KEY}&q=${query}`);
  };

  const selectTemplate = async (templateId) => {
    const response = await axios.get(`/api/invitations/templates/${templateId}`);
    setSelectedTemplate(response.data);
    setCustomizations({
      text: '',
      textX: 0,
      textY: 0,
    });
  };

  const handleCustomizationChange = (key, value) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const customizedTemplate = await axios.post('/api/invitations/templates/customize', {
      templateId: selectedTemplate.id,
      customizations
    });
    onSave(customizedTemplate.data);
  };

  return (
    <div>
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Rechercher des modèles"
      />
      <button onClick={searchTemplates}>Rechercher</button>

      {templates.map(template => (
        <div key={template.id} onClick={() => selectTemplate(template.id)}>
          <img src={template.thumbnail} alt={template.title} />
          <p>{template.title}</p>
        </div>
      ))}

      {selectedTemplate && (
        <div>
          <h3>Personnaliser le modèle</h3>
          <input
            type="text"
            value={customizations.text}
            onChange={(e) => handleCustomizationChange('text', e.target.value)}
            placeholder="Texte personnalisé"
          />
          <input
            type="number"
            value={customizations.textX}
            onChange={(e) => handleCustomizationChange('textX', parseInt(e.target.value))}
            placeholder="Position X du texte"
          />
          <input
            type="number"
            value={customizations.textY}
            onChange={(e) => handleCustomizationChange('textY', parseInt(e.target.value))}
            placeholder="Position Y du texte"
          />
          <button onClick={handleSave}>Enregistrer et utiliser ce modèle</button>
        </div>
      )}
    </div>
  );
};

export default TemplateCustomizer;