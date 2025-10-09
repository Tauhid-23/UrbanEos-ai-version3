import React, { useState } from 'react';
import { Search, Filter, Plus, Camera, Upload, CheckCircle, Loader2, ShoppingCart, X, Lock, Phone, Mail, MapPin } from 'lucide-react';
import { mockPlantDatabase } from '../../data/mock';

const PlantDatabase = () => {
  const [plants] = useState(mockPlantDatabase);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  
  // AI Scanner states
  const [activeTab, setActiveTab] = useState('browse');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResults, setScanResults] = useState(null);

  // Shopping modal states
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  
  // Contact form states
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    division: '',
    district: '',
    area: '',
    address: '',
    contactMethod: 'WhatsApp',
    email: '',
    postalCode: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');

  const plantTypes = ['All Types', ...new Set(plants.map(plant => plant.type))];

  // Supply items
  const essentialSupplies = [
    { id: 'seeds', name: 'Seeds/Seedlings', description: 'High-quality seeds for your plant', badge: 'Required' },
    { id: 'pot', name: 'Growing Pot', description: 'Appropriate size container with drainage', badge: 'Required' },
    { id: 'soil', name: 'Potting Mix', description: 'Nutrient-rich soil for optimal growth', badge: 'Required' }
  ];

  const optionalSupplies = [
    { id: 'fertilizer', name: 'Organic Fertilizer', description: 'Boost plant health and growth', badge: 'Recommended' },
    { id: 'tools', name: 'Garden Tools Set', description: 'Basic tools for planting and maintenance', badge: 'Popular' },
    { id: 'pestcontrol', name: 'Natural Pest Control', description: 'Organic pest prevention solution', badge: 'Recommended' },
    { id: 'watercan', name: 'Watering Can', description: 'Perfect size for balcony gardening', badge: 'Popular' },
    { id: 'nutrients', name: 'Plant Nutrients', description: 'Essential vitamins and minerals', badge: 'Recommended' }
  ];

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All Types' || plant.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddToGarden = (plant) => {
    setSelectedPlant(plant);
    setShowShoppingModal(true);
    initializeSupplies();
  };

  // Initialize essential supplies (pre-checked and locked)
  const initializeSupplies = () => {
    const essentialIds = ['seeds', 'pot', 'soil'];
    const newSelections = {};
    const newQuantities = {};
    
    essentialIds.forEach(id => {
      newSelections[id] = true;
      newQuantities[id] = 1;
    });
    
    setSelectedItems(newSelections);
    setItemQuantities(newQuantities);
  };

  const toggleItem = (itemId, isEssential) => {
    if (isEssential) return; // Can't toggle essential items
    
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    
    if (!selectedItems[itemId]) {
      setItemQuantities(prev => ({
        ...prev,
        [itemId]: 1
      }));
    }
  };

  const updateQuantity = (itemId, quantity) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: parseInt(quantity)
    }));
  };

  const getSelectedItemsCount = () => {
    return Object.values(selectedItems).filter(Boolean).length;
  };

  const handleSkipSupplies = () => {
    // Add plant to garden without supplies
    const existingPlants = JSON.parse(localStorage.getItem('myGardenPlants') || '[]');
    const newPlant = {
      id: Date.now(),
      name: selectedPlant.name,
      type: selectedPlant.type,
      health: Math.floor(Math.random() * 20) + 80,
      status: 'healthy',
      image: selectedPlant.image || '🌱',
      daysGrowing: Math.floor(Math.random() * 30) + 1,
      nextHarvest: Math.floor(Math.random() * 60) + 10,
    };
    
    const plantExists = existingPlants.some(plant => plant.name === selectedPlant.name);
    
    if (!plantExists) {
      existingPlants.push(newPlant);
      localStorage.setItem('myGardenPlants', JSON.stringify(existingPlants));
      alert(`${selectedPlant.name} added to your garden! 🌱`);
    }
    
    setShowShoppingModal(false);
    setSelectedPlant(null);
  };

  const handleRequestQuote = () => {
    setShowShoppingModal(false);
    setShowContactForm(true);
  };

  // Bangladesh divisions and districts
  const divisions = {
    'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Tangail'],
    'Chittagong': ['Chittagong', 'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachari', 'Feni'],
    'Rajshahi': ['Rajshahi', 'Bogra', 'Pabna', 'Sirajganj', 'Natore', 'Naogaon'],
    'Khulna': ['Khulna', 'Jessore', 'Satkhira', 'Bagerhat', 'Chuadanga', 'Kushtia'],
    'Barisal': ['Barisal', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati', 'Barguna'],
    'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    'Rangpur': ['Rangpur', 'Dinajpur', 'Lalmonirhat', 'Nilphamari', 'Gaibandha', 'Kurigram'],
    'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'Required';
    if (!formData.phone.trim()) errors.phone = 'Required';
    else if (!/^(\+880|880|0)?1[3-9]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Invalid Bangladesh phone number';
    }
    if (!formData.division) errors.division = 'Required';
    if (!formData.district) errors.district = 'Required';
    if (!formData.area.trim()) errors.area = 'Required';
    if (!formData.address.trim()) errors.address = 'Required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Reset district when division changes
    if (field === 'division') {
      setFormData(prev => ({
        ...prev,
        district: ''
      }));
    }
  };

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const reqId = 'REQ' + Date.now().toString().slice(-8);
      setRequestId(reqId);
      
      // Add plant to garden
      const existingPlants = JSON.parse(localStorage.getItem('myGardenPlants') || '[]');
      const newPlant = {
        id: Date.now(),
        name: selectedPlant.name,
        type: selectedPlant.type,
        health: Math.floor(Math.random() * 20) + 80,
        status: 'healthy',
        image: selectedPlant.image || '🌱',
        daysGrowing: 1,
        nextHarvest: Math.floor(Math.random() * 60) + 10,
      };
      
      const plantExists = existingPlants.some(plant => plant.name === selectedPlant.name);
      if (!plantExists) {
        existingPlants.push(newPlant);
        localStorage.setItem('myGardenPlants', JSON.stringify(existingPlants));
      }
      
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 2000);
  };

  const closeAllModals = () => {
    setShowShoppingModal(false);
    setShowContactForm(false);
    setShowSuccess(false);
    setSelectedPlant(null);
    setFormData({
      fullName: '',
      phone: '',
      division: '',
      district: '',
      area: '',
      address: '',
      contactMethod: 'WhatsApp',
      email: '',
      postalCode: '',
      notes: ''
    });
    setFormErrors({});
  };

  // AI Scanner functions
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setScanResults(null);
        // Start analysis
        analyzePlant();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePlant = () => {
    setIsAnalyzing(true);
    
    // Mock AI analysis after 3 seconds
    setTimeout(() => {
      const mockResults = {
        confidence: 94,
        commonName: 'Tomato Plant',
        scientificName: 'Solanum lycopersicum',
        type: 'Vegetable',
        difficulty: 'Easy',
        sunNeeds: 'Full Sun',
        water: 'Moderate',
        description: 'Tomatoes are one of the most popular vegetables to grow in Bangladesh. They thrive in warm weather and can be grown in containers or garden beds. Perfect for balcony gardens with adequate sunlight.',
        image: '🍅'
      };
      
      setScanResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleScanAnother = () => {
    setUploadedImage(null);
    setScanResults(null);
    setIsAnalyzing(false);
  };

  const handleAddScannedPlant = () => {
    if (scanResults) {
      const existingPlants = JSON.parse(localStorage.getItem('myGardenPlants') || '[]');
      const newPlant = {
        id: Date.now(),
        name: scanResults.commonName,
        type: scanResults.type,
        health: Math.floor(Math.random() * 20) + 80,
        status: 'healthy',
        image: scanResults.image || '🌱',
        daysGrowing: 1,
        nextHarvest: Math.floor(Math.random() * 60) + 10,
      };
      
      const plantExists = existingPlants.some(plant => plant.name === scanResults.commonName);
      
      if (plantExists) {
        alert(`${scanResults.commonName} is already in your garden! 🌱`);
      } else {
        existingPlants.push(newPlant);
        localStorage.setItem('myGardenPlants', JSON.stringify(existingPlants));
        alert(`${scanResults.commonName} added to your garden! 🌱`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Plant Database 📚</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover perfect plants for Bangladesh's climate with detailed care guides and success rates
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'browse'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Search className="h-5 w-5" />
              Browse Database
            </span>
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'scan'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Camera className="h-5 w-5" />
              AI Scan Plant
            </span>
          </button>
        </div>
      </div>

      {/* Browse Database Tab Content */}
      {activeTab === 'browse' && (
        <>
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search plants..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="sm:w-48 relative">
            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              {plantTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredPlants.length} of {plants.length} plants</span>
          <span>Perfect for Bangladesh climate 🇧🇩</span>
        </div>
      </div>

      {/* Plant Grid */}
      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map((plant) => (
            <div key={plant.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{plant.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plant.name}</h3>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {plant.type}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Difficulty</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                      {plant.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sun Needs</span>
                    <span className="text-sm font-medium text-gray-900">{plant.sunNeeds}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Water</span>
                    <span className="text-sm font-medium text-gray-900">{plant.water}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Growth Time</span>
                    <span className="text-sm font-medium text-gray-900">{plant.growthTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToGarden(plant)}
                  className="btn-primary w-full py-2 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Garden</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No plants found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('All Types');
            }}
            className="btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      )}

          {/* Success Tips */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="text-lg font-bold text-green-900 mb-3">🎯 Success Tips for Bangladesh</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-green-800">
              <div className="space-y-2">
                <p>• Choose plants that match your available sunlight</p>
                <p>• Consider monsoon season drainage needs</p>
              </div>
              <div className="space-y-2">
                <p>• Start with "Easy" difficulty plants if you're new</p>
                <p>• Factor in Dhaka's high humidity levels</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* AI Scan Plant Tab Content */}
      {activeTab === 'scan' && (
        <div className="space-y-6">
          {!uploadedImage && !scanResults && (
            <>
              {/* Upload Section */}
              <div className="bg-white rounded-xl shadow-lg p-12">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-6">
                      <Camera className="h-16 w-16 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Identify Any Plant Instantly</h2>
                    <p className="text-lg text-gray-600">
                      Take a photo or upload an image to get instant plant identification with AI
                    </p>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    id="plant-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Upload Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <label
                      htmlFor="plant-image-upload"
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      <Camera className="h-5 w-5" />
                      Take Photo
                    </label>
                    <label
                      htmlFor="plant-image-upload"
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors cursor-pointer"
                    >
                      <Upload className="h-5 w-5" />
                      Upload Image
                    </label>
                  </div>

                  {/* Tips */}
                  <div className="bg-green-50 rounded-lg p-6 text-left">
                    <h4 className="font-semibold text-gray-900 mb-4">📸 Tips for Best Results:</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">Take a clear, well-lit photo of the plant</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">Include leaves, flowers, or distinctive features</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">Avoid blurry or distant shots</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">Center the plant in the frame</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Image Preview & Analysis */}
          {uploadedImage && !scanResults && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Uploaded Image</h3>
                <div className="mb-6">
                  <img
                    src={uploadedImage}
                    alt="Uploaded plant"
                    className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-200"
                  />
                </div>
                {isAnalyzing && (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-900">Analyzing plant...</p>
                    <p className="text-gray-600 mt-2">Our AI is identifying your plant</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scan Results */}
          {scanResults && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="max-w-3xl mx-auto">
                {/* Confidence Score */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-900">
                      {scanResults.confidence}% Match Confidence
                    </span>
                  </div>
                </div>

                {/* Plant Image Preview */}
                <div className="mb-6">
                  <img
                    src={uploadedImage}
                    alt="Scanned plant"
                    className="w-full max-h-64 object-contain rounded-lg border-2 border-gray-200"
                  />
                </div>

                {/* Plant Name */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{scanResults.image}</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{scanResults.commonName}</h2>
                  <p className="text-lg italic text-gray-600">{scanResults.scientificName}</p>
                </div>

                {/* Quick Facts */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Facts</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Type</span>
                      <p className="font-semibold text-gray-900">{scanResults.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Difficulty</span>
                      <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(scanResults.difficulty)}`}>
                        {scanResults.difficulty}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Sun Needs</span>
                      <p className="font-semibold text-gray-900">{scanResults.sunNeeds}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Water</span>
                      <p className="font-semibold text-gray-900">{scanResults.water}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{scanResults.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddScannedPlant}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Add to Garden & Get Supplies
                  </button>
                  <button
                    onClick={handleScanAnother}
                    className="flex-1 px-6 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                  >
                    Scan Another Plant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shopping Modal */}
      {showShoppingModal && selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{selectedPlant.image}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPlant.name}</h2>
                  <p className="text-sm text-gray-600">Select supplies for your plant</p>
                </div>
              </div>
              <button
                onClick={() => setShowShoppingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Essential Supplies */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Essential Supplies
              </h3>
              <div className="space-y-3">
                {essentialSupplies.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="mt-1 h-5 w-5 text-green-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{item.name}</span>
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <select
                      value={itemQuantities[item.id] || 1}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>Qty: {num}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Add-ons */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Optional Add-ons</h3>
              <div className="space-y-3">
                {optionalSupplies.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedItems[item.id]
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleItem(item.id, false)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems[item.id] || false}
                      onChange={() => {}}
                      className="mt-1 h-5 w-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{item.name}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          item.badge === 'Recommended'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    {selectedItems[item.id] && (
                      <select
                        value={itemQuantities[item.id] || 1}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, e.target.value);
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>Qty: {num}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Summary */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {getSelectedItemsCount()} items selected
                  </p>
                  <p className="text-sm text-gray-600">
                    We'll contact you with a personalized quote
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSkipSupplies}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handleRequestQuote}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && selectedPlant && !showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                <p className="text-sm text-gray-600">We'll contact you with a personalized quote</p>
              </div>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Selected Items Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Selected Items ({getSelectedItemsCount()})
              </h4>
              <div className="flex flex-wrap gap-2">
                {essentialSupplies.filter(item => selectedItems[item.id]).map(item => (
                  <span key={item.id} className="px-3 py-1 bg-white border border-green-300 rounded-full text-sm">
                    {item.name} (x{itemQuantities[item.id]})
                  </span>
                ))}
                {optionalSupplies.filter(item => selectedItems[item.id]).map(item => (
                  <span key={item.id} className="px-3 py-1 bg-white border border-blue-300 rounded-full text-sm">
                    {item.name} (x{itemQuantities[item.id]})
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmitQuote} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleFormChange('fullName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+880 1XXXXXXXXX"
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* Division and District */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => handleFormChange('division', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      formErrors.division ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Division</option>
                    {Object.keys(divisions).map(div => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                  {formErrors.division && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.division}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleFormChange('district', e.target.value)}
                    disabled={!formData.division}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      formErrors.district ? 'border-red-500' : 'border-gray-300'
                    } ${!formData.division ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">Select District</option>
                    {formData.division && divisions[formData.division].map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                  {formErrors.district && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.district}</p>
                  )}
                </div>
              </div>

              {/* Area/Thana */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area/Thana <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => handleFormChange('area', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      formErrors.area ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your area or thana"
                  />
                </div>
                {formErrors.area && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.area}</p>
                )}
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="House/Flat, Road, Landmark..."
                />
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                )}
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {['WhatsApp', 'Phone', 'Email'].map(method => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={method}
                        checked={formData.contactMethod === method}
                        onChange={(e) => handleFormChange('contactMethod', e.target.value)}
                        className="h-4 w-4 text-green-600"
                      />
                      <span className="text-sm text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Postal Code (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleFormChange('postalCode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1234"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Budget constraints, delivery preferences, etc."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowContactForm(false);
                    setShowShoppingModal(true);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Quote Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Request Submitted!</h2>
            <p className="text-gray-600 mb-4">
              We'll contact you within 24 hours with a personalized quote
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Request ID</p>
              <p className="text-lg font-mono font-semibold text-gray-900">{requestId}</p>
            </div>
            <button
              onClick={closeAllModals}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View My Garden
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDatabase;