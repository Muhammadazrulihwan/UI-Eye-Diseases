import React, { useState } from 'react';
import { Upload, Eye, Activity, AlertCircle, CheckCircle, ImageIcon } from 'lucide-react';

const EyeDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const diseaseInfo = {
    'Cataract': {
      color: 'from-yellow-500 to-orange-500',
      description: 'Katarak adalah kekeruhan pada lensa mata yang dapat mengganggu penglihatan.',
      recommendation: 'Konsultasikan dengan dokter mata untuk evaluasi lebih lanjut.'
    },
    'Diabetic Retinopathy': {
      color: 'from-red-500 to-pink-500',
      description: 'Retinopati diabetik adalah kerusakan pembuluh darah retina akibat diabetes.',
      recommendation: 'Segera hubungi dokter spesialis mata dan kontrol gula darah Anda.'
    },
    'Glaucoma': {
      color: 'from-purple-500 to-indigo-500',
      description: 'Glaukoma adalah kerusakan saraf optik yang dapat menyebabkan kebutaan.',
      recommendation: 'Diperlukan pemeriksaan tekanan mata dan konsultasi dokter mata.'
    },
    'Normal': {
      color: 'from-green-500 to-emerald-500',
      description: 'Mata Anda dalam kondisi sehat berdasarkan analisis gambar.',
      recommendation: 'Lakukan pemeriksaan mata rutin setiap 6-12 bulan.'
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setError(null);
      setResult(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Silakan pilih gambar terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);

    // API URL dari environment variable atau default localhost
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) {
    throw new Error(
      'VITE_API_URL is not defined. Please set it in Vercel Environment Variables.'
    );
  }
    
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // FIX: Sesuaikan dengan response backend
      if (data.status === 'success' && data.result) {
        setResult({
          prediction: data.result.disease,
          confidence: data.result.confidence / 100 // Convert ke decimal (95.5 -> 0.955)
        });
      } else {
        throw new Error('Invalid response format');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError(`Gagal menganalisis gambar: ${err.message}. Pastikan backend berjalan di ${API_URL}`);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Eye className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Eye Disease Detection
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Deteksi Penyakit Mata Menggunakan Machine Learning
          </p>
          <div className="flex items-center justify-center mt-3 text-sm text-gray-500">
            <Activity className="w-4 h-4 mr-1" />
            <span>Powered by Muhammad Azrul Ihwan</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Upload className="w-6 h-6 mr-2 text-indigo-600" />
              Upload Gambar Mata
            </h2>

            <div className="space-y-4">
              {/* Upload Area */}
              <label className="block">
                <div className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  preview ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }`}>
                  {preview ? (
                    <div className="space-y-4">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600">
                        {selectedImage?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon className="w-16 h-16 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Klik untuk upload gambar
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG, JPEG (Maks. 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedImage || loading}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all ${
                    !selectedImage || loading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Activity className="w-5 h-5 mr-2 animate-spin" />
                      Menganalisis...
                    </span>
                  ) : (
                    'Analisis Gambar'
                  )}
                </button>
                
                {(preview || result) && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-indigo-600" />
              Hasil Analisis
            </h2>

            {!result && !loading && (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Eye className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Hasil analisis akan muncul di sini</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-indigo-600 animate-spin" />
                  <p className="text-lg text-gray-600">Sedang menganalisis gambar...</p>
                  <p className="text-sm text-gray-500 mt-2">Ekstraksi fitur menggunakan ResNet50</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fade-in">
                {/* Prediction Badge */}
                <div className={`bg-gradient-to-r ${diseaseInfo[result.prediction].color} rounded-2xl p-6 text-white shadow-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium opacity-90">Prediksi:</span>
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{result.prediction}</h3>
                  <div className="flex items-center text-sm opacity-90">
                    <span>Confidence: {(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Akurasi</span>
                    <span className="font-semibold">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${diseaseInfo[result.prediction].color} transition-all duration-1000 ease-out`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Deskripsi:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {diseaseInfo[result.prediction].description}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Rekomendasi:
                  </h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    {diseaseInfo[result.prediction].recommendation}
                  </p>
                </div>

                {/* Disclaimer */}
                <div className="text-xs text-gray-500 italic text-center pt-4 border-t">
                  * Hasil ini hanya sebagai referensi awal. Konsultasikan dengan dokter spesialis mata untuk diagnosis yang akurat.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {Object.entries(diseaseInfo).map(([disease, info]) => (
            <div key={disease} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${info.color} mb-2`}></div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{disease}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{info.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EyeDiseaseDetection;
