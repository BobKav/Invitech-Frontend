import React, { useState } from 'react';
import { Star } from 'lucide-react';

const FeedbackSurvey = ({ eventId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ eventId, rating, comment });
    // Réinitialiser le formulaire après soumission
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Donnez votre avis</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              onClick={() => setRating(star)}
              fill={star <= rating ? "gold" : "none"}
              stroke={star <= rating ? "gold" : "currentColor"}
              className="cursor-pointer"
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Envoyer le retour
      </button>
    </form>
  );
};

export default FeedbackSurvey;