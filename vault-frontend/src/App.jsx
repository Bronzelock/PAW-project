import { useState, useEffect } from 'react';
import StlViewer from './StlViewer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [models, setModels] = useState([]);

  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);

  const [previewModel, setPreviewModel] = useState(null);

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setCurrentUserId(getUserIdFromToken(token));
    }
  }, []);

const fetchModels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:3000/models', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchModels();
    }
  }, [isLoggedIn]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const endpoint = isRegisterMode ? '/auth/register' : '/auth/login';
    const url = `http://127.0.0.1:3000${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegisterMode) {
          setMessage('Account succesfully created.');
          setIsError(false);
          setIsRegisterMode(false);
        } else {
          localStorage.setItem('token', data.token);
          setCurrentUserId(getUserIdFromToken(data.token));
          setIsLoggedIn(true);
          setEmail('');
          setPassword('');
        }
      } else {
        setMessage(data.error || 'Error occured.');
        setIsError(true);
      }
    } catch (error) {
      console.error("Connection error: ", error);
      setMessage('Server connection error, check if node is running.');
    }
  };

const handleUpload = async () => {
    if (!uploadTitle || !uploadFile) {
      alert("Title and file are required!");
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('description', uploadDescription);
    formData.append('file', uploadFile); 

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:3000/models', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        alert("Model succesfully added!");
        setUploadTitle('');
        setUploadDescription('');
        setUploadFile(null);
        fetchModels();
      } else {
        const data = await response.json();
        alert(`Błąd: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this model?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:3000/models/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchModels();
      } else {
        alert("Error occured during deletion.");
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

    if (!isLoggedIn) {
      return (
        <div className="p-10 flex justify-center">
          <div className="card bg-base-100 shadow-xl border" style={{ width: '400px' }}>
            <div className="card-body">
              <h2 className="text-2xl font-bold mb-4">
                {isRegisterMode ? "Create Account" : "3D Vault Login"}
              </h2>
              
              {message && (
                <div className={`p-3 mb-4 rounded ${!isError ? 'bg-success text-success-content' : 'bg-error text-error-content'}`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleAuth}>
                <p className="mb-1">Email</p>
                <input 
                  type="email" 
                  className="input input-bordered mb-4" 
                  style={{ width: '100%' }} 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                <p className="mb-1">Password</p>
                <input 
                  type="password" 
                  className="input input-bordered mb-6" 
                  style={{ width: '100%' }} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  {isRegisterMode ? "Register" : "Login"}
                </button>
              </form>

              <button 
                className="btn btn-ghost mt-4" 
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setMessage('');
                }}
              >
                {isRegisterMode ? "Switch to Login" : "Switch to Register"}
              </button>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="p-10">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">3D Models Repository</h1>
          <button className="btn btn-error" onClick={() => {localStorage.removeItem('token'); setIsLoggedIn(false)}}>Logout</button>
        </div>

<div className="card bg-base-100 shadow border p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Upload New Model</h2>
          <div className="flex flex-col xl:flex-row gap-4 w-full">
            <input 
              type="text" 
              placeholder="Title" 
              className="input input-bordered flex-1" 
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Description" 
              className="input input-bordered flex-1" 
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
            />
            <input 
              type="file" 
              accept=".stl" 
              className="file-input file-input-bordered flex-1" 
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
            <button className="btn btn-success whitespace-nowrap" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow border overflow-hidden">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Volume</th>
                <th>Dimensions</th>
                <th>Action</th>
              </tr>
            </thead>
<tbody>
              {models.length === 0 ? (
                <tr><td colSpan="5" className="text-center">No models found in the repository.</td></tr>
              ) : (
                models.map((model) => {
                  const authorId = model.userId?._id || model.userId;
                  const authorEmail = model.userId?.email || 'Unknown User';
                  const isOwner = authorId === currentUserId;

                  return (
                    <tr key={model._id}>
                      <td>
                        <div className="font-bold">{model.title}</div>
                        <div className="text-xs opacity-50 mb-1">{model.description}</div>
                        <div className="text-xs text-primary">By: {authorEmail}</div>
                      </td>
                      <td>
                        <span className={`badge ${model.status === 'analyzed' ? 'badge-success' : 'badge-warning'} gap-2`}>
                          {model.status}
                        </span>
                      </td>
                      <td className="font-mono text-sm">
                        {model.volume ? `${model.volume.toFixed(2)} mm³` : '-'}
                      </td>
                      <td className="font-mono text-sm text-info">
                        {model.dimensions || '-'}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button className="btn btn-sm btn-info" onClick={() => handleDownload(model.fileUrl)}>Download</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setPreviewModel(model)}>Preview 3D</button>
                          {isOwner ? (
                            <button className="btn btn-sm btn-error" onClick={() => handleDelete(model._id)}>Delete</button>
                          ) : (
                            <span className="text-xs text-base-content/50"></span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
          {previewModel && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="card bg-base-100 shadow-2xl border w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{previewModel.title}</h3>
                    <p className="text-xs opacity-60">Dimensions: {previewModel.dimensions} | Volume: {previewModel.volume?.toFixed(2)} mm³</p>
                  </div>
                  <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setPreviewModel(null)}>✕</button>
                </div>

              <StlViewer fileUrl={previewModel.fileUrl} />

              <div className="mt-4 flex justify-end gap-2">
                  <button className="btn btn-sm btn-info" onClick={() => handleDownload(previewModel.fileUrl)}>Download STL</button>
                  <button className="btn btn-sm" onClick={() => setPreviewModel(null)}>Close</button>
           </div>
         </div>
       </div>
     )}
      </div>
    </div>
  );
}

export default App;