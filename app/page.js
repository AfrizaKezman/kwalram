"use client";
import {
  GlobeAltIcon, BuildingOffice2Icon, ShieldCheckIcon, UsersIcon, ChartBarIcon, BoltIcon, CheckBadgeIcon, BriefcaseIcon, BanknotesIcon, AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      title: "Global Textile Solutions",
      description: "PT Kwalram delivers world-class textile manufacturing, serving clients across five continents with quality and reliability.",
      icon: (
        <GlobeAltIcon className="h-8 w-8 text-blue-600" />
      ),
    },
    {
      title: "Sustainable Manufacturing",
      description: "Committed to eco-friendly processes and responsible sourcing, ensuring a better future for the industry and the planet.",
      icon: (
        <ShieldCheckIcon className="h-8 w-8 text-green-600" />
      ),
    },
    {
      title: "Trusted by Leading Brands",
      description: "Decades of experience and innovation have made us the partner of choice for global apparel and textile brands.",
      icon: (
        <CheckBadgeIcon className="h-8 w-8 text-indigo-600" />
      ),
    },
  ];

  const testimonials = [
    {
      name: "John Tan",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      text: "PT Kwalram's commitment to quality and timely delivery has made them our preferred textile supplier for over a decade.",
    },
    {
      name: "Maria Gomez",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      text: "Their sustainable practices and innovative solutions set a new standard in the textile industry.",
    },
    {
      name: "Akira Sato",
      avatar: "https://randomuser.me/api/portraits/men/30.jpg",
      text: "Professional, reliable, and always ahead in technology. Highly recommended for global brands.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-white font-sans">
      {/* Geometric Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <svg className="absolute left-0 top-0" width="700" height="700" viewBox="0 0 700 700" fill="none">
          <rect x="0" y="0" width="700" height="700" fill="#3b82f6" fillOpacity="0.07" />
          <polygon points="0,0 700,0 0,700" fill="#2563eb" fillOpacity="0.05" />
        </svg>
        <svg className="absolute right-0 bottom-0" width="400" height="400" viewBox="0 0 400 400" fill="none">
          <rect x="0" y="0" width="400" height="400" fill="#0ea5e9" fillOpacity="0.08" />
          <polygon points="400,0 400,400 0,400" fill="#1e293b" fillOpacity="0.04" />
        </svg>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10 text-left">
          <h1
            className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 animate-fade-in-up leading-tight md:leading-[1.1]"
            style={{ paddingBottom: '0.2em', lineHeight: 1.1, overflow: 'visible' }}
          >
            PT Kwalram
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-8 leading-relaxed animate-fade-in-up delay-200">
            Leading the textile industry with innovation, sustainability, and global reach. Your trusted partner for quality fabrics and apparel solutions since 1976.
          </p>
          <a href="#features" className="inline-block px-8 py-4 rounded bg-blue-700 text-white font-bold text-lg shadow-lg hover:bg-blue-800 transition-colors duration-300 animate-fade-in-up">
            Discover Our Solutions
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100 rounded-lg mb-5 group-hover:rotate-3 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-400 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 animate-fade-in-up">
              <div className="text-4xl font-extrabold text-white mb-2">45+</div>
              <div className="text-blue-100 text-lg">Years of Excellence</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 animate-fade-in-up delay-100">
              <div className="text-4xl font-extrabold text-white mb-2">5</div>
              <div className="text-blue-100 text-lg">Continents Served</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 animate-fade-in-up delay-200">
              <div className="text-4xl font-extrabold text-white mb-2">10,000+</div>
              <div className="text-blue-100 text-lg">Employees Worldwide</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 animate-fade-in-up">Client Testimonials</h2>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Hear from our global partners about their experience with PT Kwalram's products and services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-xl p-7 shadow-md border border-blue-100 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full border-2 border-blue-200 mb-3 shadow-sm" />
              <p className="text-gray-700 text-base mb-2 text-center">“{t.text}”</p>
              <span className="font-semibold text-blue-700">{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Partners/Badges Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 animate-fade-in-up">Our Global Partners</h2>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Proudly collaborating with leading brands and organizations worldwide.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 opacity-80">
          <BuildingOffice2Icon className="h-10 w-10 text-blue-500" />
          <UsersIcon className="h-10 w-10 text-gray-500" />
          <ChartBarIcon className="h-10 w-10 text-indigo-500" />
          <BriefcaseIcon className="h-10 w-10 text-blue-700" />
          <BanknotesIcon className="h-10 w-10 text-green-600" />
          <AcademicCapIcon className="h-10 w-10 text-gray-700" />
          <BoltIcon className="h-10 w-10 text-yellow-500" />
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.9s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in-up.delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}
