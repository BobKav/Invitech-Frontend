import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  fr: {
    title: "Gestion des invités",
    import: "Importer la liste",
    name: "Nom",
    email: "Email",
    status: "Statut",
    actions: "Actions",
    confirm: "Confirmer",
    decline: "Refuser",
    pending: "En attente",
    confirmed: "Confirmé",
    declined: "Refusé",
    bookHotel: "Réserver l'hôtel",
    languageName: "Français"
  },
  en: {
    title: "Guest Management",
    import: "Import List",
    name: "Name",
    email: "Email",
    status: "Status",
    actions: "Actions",
    confirm: "Confirm",
    decline: "Decline",
    pending: "Pending",
    confirmed: "Confirmed",
    declined: "Declined",
    bookHotel: "Book Hotel",
    languageName: "English"
  },
  de: {
    title: "Gästeverwaltung",
    import: "Liste importieren",
    name: "Name",
    email: "E-Mail",
    status: "Status",
    actions: "Aktionen",
    confirm: "Bestätigen",
    decline: "Ablehnen",
    pending: "Ausstehend",
    confirmed: "Bestätigt",
    declined: "Abgelehnt",
    bookHotel: "Hotel buchen",
    languageName: "Deutsch"
  },
  ar: {
    title: "إدارة الضيوف",
    import: "استيراد القائمة",
    name: "الاسم",
    email: "البريد الإلكتروني",
    status: "الحالة",
    actions: "الإجراءات",
    confirm: "تأكيد",
    decline: "رفض",
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    declined: "مرفوض",
    bookHotel: "حجز الفندق",
    languageName: "العربية"
  },
  es: {
    title: "Gestión de Invitados",
    import: "Importar Lista",
    name: "Nombre",
    email: "Correo electrónico",
    status: "Estado",
    actions: "Acciones",
    confirm: "Confirmar",
    decline: "Rechazar",
    pending: "Pendiente",
    confirmed: "Confirmado",
    declined: "Rechazado",
    bookHotel: "Reservar Hotel",
    languageName: "Español"
  },
  pt: {
    title: "Gestão de Convidados",
    import: "Importar Lista",
    name: "Nome",
    email: "E-mail",
    status: "Estado",
    actions: "Ações",
    confirm: "Confirmar",
    decline: "Recusar",
    pending: "Pendente",
    confirmed: "Confirmado",
    declined: "Recusado",
    bookHotel: "Reservar Hotel",
    languageName: "Português"
  },
  it: {
    title: "Gestione degli Ospiti",
    import: "Importa Lista",
    name: "Nome",
    email: "Email",
    status: "Stato",
    actions: "Azioni",
    confirm: "Conferma",
    decline: "Rifiuta",
    pending: "In Attesa",
    confirmed: "Confermato",
    declined: "Rifiutato",
    bookHotel: "Prenota Hotel",
    languageName: "Italiano"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr');

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Composant de sélection de langue
const LanguageSwitcher = () => {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <select 
      value={language} 
      onChange={(e) => changeLanguage(e.target.value)}
      className="px-2 py-1 border rounded-md"
    >
      {Object.keys(translations).map((lang) => (
        <option key={lang} value={lang}>
          {translations[lang].languageName}
        </option>
      ))}
    </select>
  );
};

// Composant d'exemple utilisant les traductions
const TranslatedContent = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
      <p><strong>{t.name}:</strong> John Doe</p>
      <p><strong>{t.email}:</strong> john@example.com</p>
      <p><strong>{t.status}:</strong> {t.pending}</p>
      <div className="mt-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
          {t.confirm}
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          {t.decline}
        </button>
      </div>
    </div>
  );
};

// Composant principal qui englobe les exemples avec LanguageProvider
const MultilingualExample = () => {
  return (
    <LanguageProvider>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="mb-4 text-right">
          <LanguageSwitcher />
        </div>
        <TranslatedContent />
      </div>
    </LanguageProvider>
  );
};

export default MultilingualExample;