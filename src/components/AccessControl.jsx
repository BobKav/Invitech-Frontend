import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';

const AccessControl = ({ eventId }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ scanned: 0, total: 0 });
  const [isCameraActive, setIsCameraActive] = useState(true);

  useEffect(() => {
    fetchEventStats();
  }, [eventId]);

  const fetchEventStats = async () => {
    try {
      const response = await api.getEventStats(eventId);
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const handleScan = async (data) => {
    if (data) {
      try {
        const response = await api.verifyQRCode(eventId, data);
        setScanResult(response.data);
        setError(null);
        await fetchEventStats();
      } catch (error) {
        setError(error.response?.data?.message || 'Erreur lors de la vérification du QR code');
        setScanResult(null);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Erreur de lecture du QR code');
  };

  const resetScan = () => {
    setScanResult(null);
    setError(null);
    setIsCameraActive(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Contrôle d'accès</h2>

      <div className="mb-6">
        <p className="text-center text-lg font-semibold">
          Invités scannés: {stats.scanned} / {stats.total}
        </p>
      </div>

      {isCameraActive && (
        <div className="mb-6">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {scanResult && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <div className="flex items-center">
            <CheckCircle className="mr-2" size={24} />
            <div>
              <p className="font-bold">Accès autorisé</p>
              <p>Nom: {scanResult.guestName}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex items-center">
            <XCircle className="mr-2" size={24} />
            <div>
              <p className="font-bold">Accès refusé</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={resetScan}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
      >
        <RefreshCw className="mr-2" size={20} />
        Nouvelle vérification
      </button>
    </div>
  );
};

export default AccessControl;