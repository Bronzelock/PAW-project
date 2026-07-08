import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    console.log("");
    if (!isRegisterMode) setIsLoggedIn(true); 
  };

  const handleUpload = () => {
    console.log("");
  };

  const handleDelete = () => {
    console.log("");
  };

  if (!isLoggedIn) {
    return (
      <div className="p-10 flex justify-center">
        <div className="card bg-base-100 shadow-xl border" style={{ width: '400px' }}>
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">
              {isRegisterMode ? "Create Account" : "3D Vault Login"}
            </h2>
            
            <form onSubmit={handleAuth}>
              <p className="mb-1">Email</p>
              <input type="email" className="input input-bordered mb-4" style={{ width: '100%' }} required />
              
              <p className="mb-1">Password</p>
              <input type="password" className="input input-bordered mb-6" style={{ width: '100%' }} required />
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {isRegisterMode ? "Register" : "Login"}
              </button>
            </form>

            <button 
              className="btn btn-ghost mt-4" 
              onClick={() => setIsRegisterMode(!isRegisterMode)}
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
          <button className="btn btn-error" onClick={() => setIsLoggedIn(false)}>Logout</button>
        </div>

        <div className="card bg-base-100 shadow border p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Upload New Model</h2>
          <div className="flex gap-4">
            <input type="text" placeholder="Title" className="input input-bordered" />
            <input type="text" placeholder="Description" className="input input-bordered" />
            <input type="file" accept=".stl" className="file-input file-input-bordered" />
            <button className="btn btn-success" onClick={handleUpload}>Upload</button>
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
              <tr>
                <td>Sample Gear</td>
                <td><span className="badge badge-success">Analyzed</span></td>
                <td>125.50 mm³</td>
                <td>10x10x10</td>
                <td>
                  <button className="btn btn-sm btn-error" onClick={handleDelete}>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default App;