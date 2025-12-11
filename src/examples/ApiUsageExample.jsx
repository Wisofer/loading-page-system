/**
 * EJEMPLO DE USO DE LA API
 * Este componente muestra diferentes formas de consumir la API
 */

import { useState, useEffect } from 'react';
import { useApi, useAuth } from '../hooks/useApi';
import { AuthService, UserService } from '../services/api.service';
import apiService from '../services/api.service';

// ============================================
// EJEMPLO 1: Uso básico con el hook useApi
// ============================================
function Example1_BasicUsage() {
  const { data, loading, error, execute } = useApi();

  const handleFetchData = async () => {
    await execute(() => apiService.get('/api/endpoint'));
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Ejemplo 1: Uso Básico</h3>
      <button 
        onClick={handleFetchData}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Cargar Datos
      </button>
      
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {data && <pre className="bg-gray-100 p-2 mt-2">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

// ============================================
// EJEMPLO 2: Login con AuthService
// ============================================
function Example2_Login() {
  const { isAuthenticated, user, login, logout, loading, error } = useAuth();
  const [credentials, setCredentials] = useState({
    usuario: '',
    contraseña: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(() => AuthService.login(credentials));
  };

  const handleLogout = async () => {
    await logout(() => AuthService.logout());
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Ejemplo 2: Autenticación</h3>
      
      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="space-y-2">
          <input
            type="text"
            placeholder="Usuario"
            value={credentials.usuario}
            onChange={(e) => setCredentials({...credentials, usuario: e.target.value})}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={credentials.contraseña}
            onChange={(e) => setCredentials({...credentials, contraseña: e.target.value})}
            className="w-full border p-2 rounded"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      ) : (
        <div>
          <p className="mb-2">Bienvenido, <strong>{user?.nombre || 'Usuario'}</strong></p>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

// ============================================
// EJEMPLO 3: Obtener lista de usuarios
// ============================================
function Example3_UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await UserService.getAll(filters);
      setUsers(response.data || response);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.page]); // Recargar cuando cambia la página

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Ejemplo 3: Lista de Usuarios</h3>
      
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
          className="border p-2 rounded flex-1"
        />
        <button 
          onClick={fetchUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {loading && <p>Cargando usuarios...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {users.length > 0 && (
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="bg-gray-100 p-2 rounded">
              <p><strong>{user.nombre}</strong></p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          ))}
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilters({...filters, page: filters.page - 1})}
              disabled={filters.page === 1}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              Anterior
            </button>
            <span className="px-4 py-2">Página {filters.page}</span>
            <button
              onClick={() => setFilters({...filters, page: filters.page + 1})}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// EJEMPLO 4: Crear nuevo usuario
// ============================================
function Example4_CreateUser() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await UserService.create(formData);
      setSuccess(true);
      setFormData({ nombre: '', email: '', telefono: '' });
    } catch (err) {
      setError(err.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Ejemplo 4: Crear Usuario</h3>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
          className="w-full border p-2 rounded"
        />
        <button 
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>

      {success && <p className="text-green-500 mt-2">¡Usuario creado exitosamente!</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

// ============================================
// EJEMPLO 5: Petición personalizada
// ============================================
function Example5_CustomRequest() {
  const [endpoint, setEndpoint] = useState('/api/custom-endpoint');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('{}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let result;
      const parsedBody = method !== 'GET' ? JSON.parse(body) : undefined;

      switch (method) {
        case 'GET':
          result = await apiService.get(endpoint);
          break;
        case 'POST':
          result = await apiService.post(endpoint, parsedBody);
          break;
        case 'PUT':
          result = await apiService.put(endpoint, parsedBody);
          break;
        case 'DELETE':
          result = await apiService.delete(endpoint);
          break;
        default:
          throw new Error('Método no soportado');
      }

      setResponse(result);
    } catch (err) {
      setError(err.message || 'Error en la petición');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Ejemplo 5: Petición Personalizada</h3>
      
      <div className="space-y-2">
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          placeholder="Endpoint (ej: /api/users)"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {method !== 'GET' && (
          <textarea
            placeholder='Body JSON (ej: {"nombre": "Juan"})'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border p-2 rounded h-24"
          />
        )}

        <button 
          onClick={handleRequest}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {loading ? 'Enviando...' : 'Enviar Petición'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {response && (
        <div className="mt-4">
          <h4 className="font-bold mb-2">Respuesta:</h4>
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-64">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL CON TODOS LOS EJEMPLOS
// ============================================
export default function ApiUsageExample() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Ejemplos de Uso de API</h1>
      <p className="mb-6 text-gray-600">
        API Base URL: <code className="bg-gray-100 px-2 py-1 rounded">https://app.emsinetsolut.com/</code>
      </p>

      <div className="space-y-6">
        <Example1_BasicUsage />
        <Example2_Login />
        <Example3_UsersList />
        <Example4_CreateUser />
        <Example5_CustomRequest />
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">📚 Documentación</h3>
        <p className="text-sm">
          Para más información, consulta el archivo <code>DOCUMENTACION_API.md</code> en la raíz del proyecto.
        </p>
      </div>
    </div>
  );
}

// ============================================
// EXPORTS INDIVIDUALES PARA USO MODULAR
// ============================================
export {
  Example1_BasicUsage,
  Example2_Login,
  Example3_UsersList,
  Example4_CreateUser,
  Example5_CustomRequest
};



