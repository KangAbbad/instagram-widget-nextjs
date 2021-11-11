import { useEffect, useState } from 'react';
import { ChipIcon } from '@heroicons/react/solid';
import axios from 'axios';

const Home = () => {
  const [clientId, setClientId] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [isError, setError] = useState(false);

  const onSubmit = async () => {
    if (clientId && redirectUri) {
      try {
        const { data: response } = await axios.get(`/api/auth`, {
          params: {
            client_id: clientId,
            redirect_uri: redirectUri,
          },
        });
        window.open(response.data.url);
        localStorage.setItem('client_id', clientId);
        localStorage.setItem('redirect_uri', redirectUri);
      } catch (error) {
        console.log(error);
      }
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const savedClientId = localStorage.getItem('client_id');
    const savedRedirectUri = localStorage.getItem('redirect_uri');
    if (savedClientId) {
      setClientId(savedClientId);
    }
    if (savedRedirectUri) {
      setRedirectUri(savedRedirectUri);
    }
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="border border-[#EAEAEA] rounded-lg shadow-lg w-[500px] p-4">
          <h1 className="text-2xl">
            Generate Auth Token
          </h1>
          <div className="rounded-md shadow-sm my-4">
            <input
              id="client-id"
              name="client-id"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
            <input
              id="redirect-uri"
              name="redirect-uri"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Redirect Uri"
              value={redirectUri}
              onChange={(e) => setRedirectUri(e.target.value)}
            />
          </div>

          {isError && (
            <>
              {!clientId && <p className="text-red-500">Please fill Client Id!</p>}
              {!redirectUri && <p className="text-red-500">Please fill RedirectUri!</p>}
            </>
          )}
          <button
            className="group relative w-full flex justify-center py-3 px-4 mt-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onSubmit}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <ChipIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
            </span>
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
