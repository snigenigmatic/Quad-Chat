import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Shield, Zap, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">QuadChat</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Connect
              </span>{' '}
              with Your Campus Community
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              QuadChat brings university students together in real-time conversations.
              Share ideas, collaborate on projects, and build meaningful connections.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Connect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make your campus communication seamless and engaging.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-indigo-600" />}
              title="Real-time Chat"
              description="Instant messaging with fellow students and study groups"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-indigo-600" />}
              title="Study Groups"
              description="Create or join subject-specific chat rooms"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-indigo-600" />}
              title="Secure"
              description="End-to-end encryption for private conversations"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-indigo-600" />}
              title="Fast & Reliable"
              description="Built for speed and consistent performance"
            />
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Students at Top Universities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who are already using QuadChat to connect and collaborate.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <UniversityLogo src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80" />
            <UniversityLogo src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80" />
            <UniversityLogo src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MessageSquare className="h-8 w-8 text-indigo-400" />
              <span className="text-2xl font-bold">QuadChat</span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} QuadChat. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
    <div className="inline-block p-3 bg-indigo-50 rounded-lg mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const UniversityLogo = ({ src }: { src: string }) => (
  <div className="w-32 h-32 relative group">
    <img
      src={src}
      alt="University Logo"
      className="w-full h-full object-cover rounded-lg filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
    />
  </div>
);

export default Home;