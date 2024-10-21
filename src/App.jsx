import FeaturePreview from './components/FeaturePreview';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EventDetailsPage from '../../../Archiv/Frontend/EventDetailsPage';
import EventCreationForm from '../../../Archiv/Frontend/EventCreationForm';
import GuestManagement from '../../../Archiv/Frontend/GuestManagement';
import InvitationManagement from './components/InvitationManagement';
import BudgetManagement from './components/BudgetManagement';
import Login from './components/Login';
import Signup from './components/Signup';
import RealTimeEventDashboard from './components/RealTimeEventDashboard';
import { AccessControl } from '../../../Archiv/Frontend/AccessControl';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/preview" component={FeaturePreview} />
        <Route exact path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/events/new" component={EventCreationForm} />
        <Route path="/events/:id" component={EventDetailsPage} />
        <Route path="/events/:id/guests" component={GuestManagement} />
        <Route path="/events/:id/invitations" component={InvitationManagement} />
        <Route path="/events/:id/budget" component={BudgetManagement} />
        <Route path="/event/:eventId/dashboard" component={RealTimeEventDashboard} />
        <Route path="/event/:eventId/access-control" component={AccessControl} />
      </Routes>
    </Router>
  );
}

export default App;