import { useEffect, useState } from 'react';
import { ChipIcon, DuplicateIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import Loader from "react-loader-spinner";
import axios from 'axios';

import styles from '~/styles/auth.module.css';

import Button from '~/components/Button';

const Unauthorize = () => {
  const router = useRouter();

  const onLogin = async () => {
    router.push('/basic/auth');
  };

  return (
    <div className="mt-5">
      <h1 className="text-xl text-red-500 text-center">
        Please login to your Instagram account first<br />before generate the token!
      </h1>
      <Button className="group w-full mt-5" onClick={onLogin}>
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          <ChipIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
        </span>
        Login
      </Button>
    </div>
  );
};

const Authorized = (props) => {
  const { token = '' } = props;
  const [isCopied, setCopied] = useState(false);
  
  const onCopyToken = () => {
    setCopied(true);
    navigator.clipboard.writeText(token);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <div className="border border-[#EAEAEA] rounded-lg shadow-lg w-full max-w-[500px] p-4">
        <p>
          Get your token here!
        </p>
        <div className="flex items-center mt-3">
          <div className="flex-grow truncate mr-3">
            <h1 className="rounded-lg bg-[#EAEAEA] truncate h-[40px] py-2 px-3 mb-0">
              {token}
            </h1>
          </div>
          <div className="flex-none">
            <div className="relative">
              <Button className="h-[40px]" onClick={onCopyToken}>
                <DuplicateIcon className="h-5 w-5 text-[#FFFFFF]" aria-hidden="true" />
              </Button>
              {isCopied && (
                <p className="absolute -top-4 left-[5px] text-xs text-indigo-700">
                  Copied!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GenerateToken = (props) => {
  const { code } = props;
  const [isLoading, setLoading] = useState(true);
  const [longLivedToken, setLongLivedToken] = useState('');

  const onGetToken = async () => {
    try {
      setLoading(true);
      const baseUrl = 'https://graph.facebook.com/v12.0/oauth/access_token';
      const savedBusinessClientId = localStorage.getItem('businessClientId');
      const savedBusinessClientSecret = localStorage.getItem('businessClientSecret');
      const encodedRedirectUri = 'https%3A%2F%2Finstagram-widget-nextjs.vercel.app%2Fbusiness%2Fgenerate-token%2F';

      const { data: shortLivedTokenResponse } = await axios.get(baseUrl, {
        params: {
          client_id: savedBusinessClientId,
          client_secret: savedBusinessClientSecret,
          redirect_uri: encodedRedirectUri,
          code,
        },
      });

      const { data: longLivedTokenResponse } = await axios.get(baseUrl, {
        params: {
          client_id: savedBusinessClientId,
          client_secret: savedBusinessClientSecret,
          grant_type: 'fb_exchange_token',
          fb_exchange_token: shortLivedTokenResponse.access_token,
        },
      });
      setLongLivedToken(longLivedTokenResponse.access_token);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLongLivedToken('');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      onGetToken();
    } else {
      setLoading(false);
    }
  }, [code]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="border border-[#EAEAEA] rounded-lg shadow-lg w-full max-w-[500px] p-4">
          <div className="text-center">
            <h1 className={styles['auth-title']}>
              Instagram
            </h1>
            <h2 className="text-sm mt-2">
              Generate Token
            </h2>
          </div>
          {isLoading ? (
            <div className="flex justify-center mt-6 mb-3">
              <Loader type="Oval" color="#00BFFF" height={60} width={60} />
            </div>
          ) : (
            <>
              {longLivedToken ? <Authorized token={longLivedToken} /> : <Unauthorize />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateToken;

export async function getServerSideProps({ query }) {
  return {
    props: {
      code: query.code ?? '',
    },
  };
};
