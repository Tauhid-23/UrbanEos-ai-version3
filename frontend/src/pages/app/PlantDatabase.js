import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { mockPlantDatabase } from '../../data/mock';

const PlantDatabase = () => {
  const [plants] = useState(mockPlantDatabase);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const plantTypes = ['All Types', ...new Set(plants.map(plant => plant.type))];

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
    setShowModal(true);
  };

  const confirmAddToGarden = () => {
    // In a real app, this would add to the user's garden
    alert(`${selectedPlant.name} added to your garden! 🌱`);
    setShowModal(false);
    setSelectedPlant(null);
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

      {/* Add to Garden Modal */}
      {showModal && selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedPlant.image}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add {selectedPlant.name}?</h2>
              <p className="text-gray-600">
                This will add {selectedPlant.name} to your garden and start tracking its growth.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Plant Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{selectedPlant.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedPlant.difficulty)}`}>
                    {selectedPlant.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Time:</span>
                  <span className="font-medium">{selectedPlant.growthTime}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1 py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddToGarden}
                className="btn-primary flex-1 py-2"
              >
                Add to Garden
              </button>
            </div>
          </div>
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
    </div>
  );
};

export default PlantDatabase;