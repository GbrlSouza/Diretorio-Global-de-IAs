import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  DollarSign,
  Zap,
  Image,
  Video,
  Code,
  Globe,
  Users,
  Eye,
  EyeOff,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  Crown,
  Camera,
  Bot,
  Brain,
  Lightbulb,
  Palette,
  FileText,
  MessageSquare,
  Music,
  Gamepad2,
  Shield
} from "lucide-react";

export default function AIDirectoryPage() {
  const [ais, setAis] = useState([]);
  const [filteredAis, setFilteredAis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    pricing: [],
    content: [],
    development: [],
    restrictions: []
  });
  const [viewMode, setViewMode] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const filterCategories = [
    {
      title: "Popularidade",
      key: "category",
      options: [
        { id: "famous", label: "Famosas", icon: Crown },
        { id: "anonymous", label: "Anônimas", icon: Eye },
        { id: "trending", label: "Em Alta", icon: Zap }
      ]
    },
    {
      title: "Preço",
      key: "pricing",
      options: [
        { id: "free", label: "Gratuitas", icon: Star },
        { id: "paid", label: "Pagas", icon: DollarSign },
        { id: "freemium", label: "Freemium", icon: Zap }
      ]
    },
    {
      title: "Criação de Conteúdo",
      key: "content",
      options: [
        { id: "text", label: "Texto", icon: FileText },
        { id: "image", label: "Imagens", icon: Camera },
        { id: "video", label: "Vídeos", icon: Video },
        { id: "audio", label: "Áudio", icon: Music },
        { id: "art", label: "Arte", icon: Palette }
      ]
    },
    {
      title: "Desenvolvimento",
      key: "development",
      options: [
        { id: "coding", label: "Programação", icon: Code },
        { id: "ai-dev", label: "IA Development", icon: Bot },
        { id: "automation", label: "Automação", icon: Zap },
        { id: "analytics", label: "Análise", icon: Brain }
      ]
    },
    {
      title: "Restrições",
      key: "restrictions",
      options: [
        { id: "unrestricted", label: "Sem Restrições", icon: Globe },
        { id: "family-friendly", label: "Família", icon: Shield },
        { id: "adult", label: "Adulto", icon: EyeOff },
        { id: "commercial", label: "Comercial", icon: DollarSign }
      ]
    }
  ];

  useEffect(() => {
    fetchAIs();
  }, []);

  useEffect(() => {
    filterAIs();
  }, [ais, searchTerm, selectedFilters]);

  const fetchAIs = async () => {
    try {
      const response = await fetch('/api/ais');
      const data = await response.json();
      setAis(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar IAs:', error);
      setLoading(false);
    }
  };

  const filterAIs = () => {
    let filtered = [...ais];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(ai =>
        ai.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ai.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ai.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtros por categoria
    Object.keys(selectedFilters).forEach(filterKey => {
      if (selectedFilters[filterKey].length > 0) {
        filtered = filtered.filter(ai => {
          return selectedFilters[filterKey].some(filter => {
            switch (filterKey) {
              case 'category':
                return ai.popularity === filter;
              case 'pricing':
                return ai.pricing === filter;
              case 'content':
                return ai.contentTypes.includes(filter);
              case 'development':
                return ai.developmentTools.includes(filter);
              case 'restrictions':
                return ai.restrictions.includes(filter);
              default:
                return false;
            }
          });
        });
      }
    });

    setFilteredAis(filtered);
  };

  const toggleFilter = (filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: prev[filterKey].includes(value)
        ? prev[filterKey].filter(f => f !== value)
        : [...prev[filterKey], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      category: [],
      pricing: [],
      content: [],
      development: [],
      restrictions: []
    });
    setSearchTerm("");
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).flat().length;
  };

  const getPricingColor = (pricing) => {
    switch (pricing) {
      case 'free': return 'text-green-600 bg-green-100';
      case 'paid': return 'text-blue-600 bg-blue-100';
      case 'freemium': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPricingLabel = (pricing) => {
    switch (pricing) {
      case 'free': return 'Gratuito';
      case 'paid': return 'Pago';
      case 'freemium': return 'Freemium';
      default: return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando diretório de IAs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">AI Directory</h1>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-80`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>

          {/* Brand */}
          <div className="flex items-center mb-8 pt-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Directory</h1>
              <p className="text-sm text-gray-500">Todas as IAs do mundo</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar IAs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Filter size={16} className="mr-2" />
              Filtros
              {getActiveFiltersCount() > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </h3>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {filterCategories.map((category) => (
              <div key={category.key}>
                <h4 className="font-medium text-gray-900 mb-3">{category.title}</h4>
                <div className="space-y-2">
                  {category.options.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedFilters[category.key].includes(option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => toggleFilter(category.key, option.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                          isSelected
                            ? "bg-blue-100 text-blue-900 border border-blue-200"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={16} className="mr-3" />
                        <span className="text-sm">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-80 pt-16 lg:pt-0">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Diretório Global de IAs
            </h1>
            <p className="text-gray-600">
              Descubra e explore todas as inteligências artificiais disponíveis no mundo
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredAis.length} IAs encontradas
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* AI Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAis.map((ai) => (
                <div
                  key={ai.id}
                  className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-3">
                          {ai.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{ai.name}</h3>
                          <p className="text-sm text-gray-500">{ai.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">{ai.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {ai.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPricingColor(ai.pricing)}`}>
                        {getPricingLabel(ai.pricing)}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {ai.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {ai.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{ai.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <span>Acessar</span>
                      <ExternalLink size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAis.map((ai) => (
                <div
                  key={ai.id}
                  className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                        {ai.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-semibold text-gray-900 mr-2">{ai.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPricingColor(ai.pricing)}`}>
                            {getPricingLabel(ai.pricing)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{ai.company}</p>
                        <p className="text-gray-600 text-sm">{ai.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ml-4">
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">{ai.rating}</span>
                      </div>
                      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <span>Acessar</span>
                        <ExternalLink size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredAis.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma IA encontrada</h3>
              <p className="text-gray-500 mb-4">
                Tente ajustar seus filtros ou termo de busca
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}