import { useEffect, useState } from 'react';
import { ChipIcon, DuplicateIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { useRouter } from 'next/router';

import SpinnerLoader from 'components/SpinnerLoader';

const LongLivedToken = () => {
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState('');
  const [shortLivedToken, setShortLivedToken] = useState('');
  const [longLivedToken, setLongLivedToken] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isCopied, setCopied] = useState(false);

  const onCopyToken = () => {
    setCopied(true);
    navigator.clipboard.writeText(longLivedToken);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const onSubmit = async () => {
    if (clientSecret && shortLivedToken) {
      try {
        setLoading(true);
        const payload = {
          client_secret: clientSecret,
          access_token: shortLivedToken,
        };
        const { data: response } = await axios.post('/api/long-lived-token', payload);
        setLongLivedToken(response.data.access_token);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const savedClientSecret = localStorage.getItem('client_secret');
    if (savedClientSecret) {
      setClientSecret(savedClientSecret);
    }
  }, []);

  useEffect(() => {
    if (router.query.access_token) {
      setShortLivedToken(router.query.access_token);
    }
  }, [router.query.access_token]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="border border-[#EAEAEA] rounded-lg shadow-lg w-full max-w-[500px] p-4">
          <h1 className="text-2xl">
            Generate Long Lived Token
          </h1>
          <div className="rounded-md shadow-sm my-4">
            <input
              id="client-secret"
              name="client-secret"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Client Secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
            <input
              id="short-lived-token"
              name="short-lived-token"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 border-t-0 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Short Lived Token"
              value={shortLivedToken}
              onChange={(e) => setShortLivedToken(e.target.value)}
            />
          </div>

          {isError && (
            <>
              {!clientSecret && <p className="text-red-500">Please fill Client Secret!</p>}
              {!shortLivedToken && <p className="text-red-500">Please fill Short Lived Token!</p>}
            </>
          )}
          <button
            className="group relative w-full flex justify-center py-3 px-4 mt-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onSubmit}
          >
            {isLoading ? (
              <SpinnerLoader />
            ) : (
              <>
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ChipIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Generate
              </>
            )}
          </button>
        </div>

        {longLivedToken && (
          <div className="border border-[#EAEAEA] rounded-lg shadow-lg w-full max-w-[500px] p-4 mt-5">
            <p>
              Get your long lived token here!
            </p>
            <div className="flex items-center mt-3">
              <div className="flex-grow truncate mr-3">
                <h1 className="rounded-lg bg-[#EAEAEA] truncate py-2 px-3 mb-0">
                  {longLivedToken}
                </h1>
              </div>
              <div className="flex-none">
                <div className="relative">
                  <button
                    className="group relative flex justify-center py-2 px-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={onCopyToken}
                  >
                    <DuplicateIcon className="h-5 w-5 text-[#FFFFFF]" aria-hidden="true" />
                  </button>
                  {isCopied && (
                    <p className="absolute left-[2px] text-xs text-indigo-700">
                      Copied!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LongLivedToken;
