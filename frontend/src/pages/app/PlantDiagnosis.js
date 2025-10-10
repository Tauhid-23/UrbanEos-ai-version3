import React, { useState } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle, Clock, Lightbulb } from 'lucide-react';

const PlantDiagnosis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;
    
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setResults({
        confidence: 92,
        issue: 'Leaf Spot Disease',
        severity: 'Moderate',
        causes: [
          { cause: 'Fungal infection', probability: 85 },
          { cause: 'Overwatering', probability: 65 },
          { cause: 'Poor air circulation', probability: 45 }
        ],
        treatment: [
          'Remove affected leaves immediately',
          'Reduce watering frequency',
          'Improve ventilation around the plant',
          'Apply fungicide spray (neem oil recommended)',
          'Monitor plant daily for 1 week'
        ],
        recovery: '1-2 weeks with proper treatment'
      });
      setLoading(false);
    }, 3000);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResults(null);
    setLoading(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Mild': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Plant Doctor 🔬</h1>
        <p className="text-xl text-gray-600">
          Upload a photo of your plant and get instant AI-powered health diagnosis
        </p>
      </div>

      {/* Upload Section */}
      {!selectedImage && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="max-w-md mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Plant Photo</h3>
              <p className="text-gray-600 mb-4">Take or upload a photo of your plant for diagnosis</p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="btn-primary inline-flex items-center space-x-2 cursor-pointer"
              >
                <Upload className="h-5 w-5" />
                <span>Choose Photo</span>
              </label>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📸 Tips for Best Results:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Focus on affected leaves or areas</li>
                <li>• Use natural lighting when possible</li>
                <li>• Include multiple symptoms in one photo</li>
                <li>• Avoid blurry or dark images</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview & Analysis */}
      {selectedImage && !results && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Image Preview</h3>
            <p className="text-gray-600">Review your photo and start analysis</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={selectedImage} 
                alt="Plant for diagnosis" 
                className="w-full h-64 object-cover"
              />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Analyzing your plant with AI...</p>
                <p className="text-gray-600">This may take a few seconds</p>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleAnalyze}
                  className="btn-primary w-full py-3 text-lg"
                >
                  Analyze Plant Health
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary w-full py-2"
                >
                  Choose Different Photo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Diagnosis Results</h3>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{results.confidence}%</div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img 
                  src={selectedImage} 
                  alt="Analyzed plant" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Identified Issue</h4>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-lg font-medium">{results.issue}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Severity</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(results.severity)}`}>
                    {results.severity}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Recovery Timeline</h4>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="text-blue-700 font-medium">{results.recovery}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Possible Causes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Possible Causes</h4>
            <div className="space-y-3">
              {results.causes.map((cause, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{cause.cause}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${cause.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{cause.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Plan */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Treatment Plan</h4>
            <div className="space-y-3">
              {results.treatment.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-900">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleReset}
              className="btn-primary flex-1 py-3"
            >
              Diagnose Another Plant
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary flex-1 py-3"
            >
              Save Results
            </button>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Lightbulb className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">Diagnosis Tips</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>95% accuracy rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Trained on 1M+ plant images</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Instant results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Expert-validated treatments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDiagnosis;