import React, { useState, useEffect } from 'react';
import { Send, Search, User, ChevronLeft } from 'lucide-react';
import io from 'socket.io-client';
import api from '../services/api';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

const MessagingSystem = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      socket.emit('joinConversation', selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const handleNewMessage = (newMessage) => {
    if (newMessage.conversationId === selectedConversation?.id) {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
    updateLastMessage(newMessage);
  };

  const updateLastMessage = (newMessage) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === newMessage.conversationId
          ? { ...conv, lastMessage: newMessage.content, date: new Date(newMessage.timestamp).toISOString().split('T')[0] }
          : conv
      )
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedConversation) {
      try {
        const response = await api.post(`/conversations/${selectedConversation.id}/messages`, { content: message });
        socket.emit('sendMessage', response.data);
        setMessage('');
        setMessages(prevMessages => [...prevMessages, response.data]);
        updateLastMessage(response.data);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
      }
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Messagerie</h2>
      <div className="flex h-[600px]">
        {/* Liste des conversations */}
        <div className={`w-1/3 border-r ${selectedConversation ? 'hidden md:block' : ''}`}>
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${selectedConversation?.id === conv.id ? 'bg-indigo-50' : ''}`}
              >
                <div className="flex items-center mb-1">
                  <User className="h-8 w-8 rounded-full bg-indigo-100 p-1 mr-2" />
                  <span className="font-semibold">{conv.name}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                <p className="text-xs text-gray-400 mt-1">{conv.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation sélectionnée */}
        <div className={`w-full md:w-2/3 flex flex-col ${!selectedConversation ? 'hidden md:flex' : ''}`}>
          {selectedConversation ? (
            <>
              <div className="bg-indigo-50 p-4 flex items-center">
                <button onClick={() => setSelectedConversation(null)} className="md:hidden mr-2">
                  <ChevronLeft />
                </button>
                <User className="h-8 w-8 rounded-full bg-indigo-100 p-1 mr-2" />
                <span className="font-semibold">{selectedConversation.name}</span>
              </div>
              <div className="flex-grow overflow-y-auto p-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                      {msg.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="border-t p-4 flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Sélectionnez une conversation pour commencer
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;