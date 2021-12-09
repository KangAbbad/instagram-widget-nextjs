import { useEffect, useState } from 'react';
import { ChipIcon, DuplicateIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import Loader from "react-loader-spinner";
import axios from 'axios';
import classNames from 'classnames';

import styles from '~/styles/auth.module.css';

import Button from '~/components/Button';

const Card = (props) => {
  return (
    <div
      className={classNames(
        'border border-[#EAEAEA] rounded-lg shadow-lg w-full max-w-[500px] p-4',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};

const Unauthorize = () => {
  const router = useRouter();

  const onLogin = async () => {
    router.push('/business/auth');
  };

  return (
    <div className="mt-5">
      <h1 className="text-xl text-red-500 text-center">
        Please login to your Instagram account first<br />before generate the token!
      </h1>
      <Button className="bg-indigo-600 hover:bg-indigo-700 focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 group w-full mt-5" onClick={onLogin}>
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
      <Card>
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
              <Button className="bg-indigo-600 hover:bg-indigo-700 focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 h-[40px]" onClick={onCopyToken}>
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
      </Card>
    </div>
  );
};

const GenerateToken = (props) => {
  const { code } = props;
  const [isLongLivedTokenLoading, setLongLivedTokenLoading] = useState(false);
  const [isBusinessAccountsLoading, setBusinessAccountsLoading] = useState(false);
  const [longLivedToken, setLongLivedToken] = useState('');
  const [businessAccounts, setBusinessAccounts] = useState([]);

  const onGetToken = async () => {
    try {
      setLongLivedTokenLoading(true);
      const savedBusinessClientId = localStorage.getItem('businessClientId');
      const savedBusinessClientSecret = localStorage.getItem('businessClientSecret');

      const shortLivedTokenUrl = '/api/business/short-lived-token';
      const { data: shortLivedTokenResponse } = await axios.get(shortLivedTokenUrl, {
        params: {
          clientId: savedBusinessClientId,
          clientSecret: savedBusinessClientSecret,
          code,
        },
      });

      const longLivedTokenUrl = '/api/business/long-lived-token';
      const { data: longLivedTokenResponse } = await axios.get(longLivedTokenUrl, {
        params: {
          clientId: savedBusinessClientId,
          clientSecret: savedBusinessClientSecret,
          accessToken: shortLivedTokenResponse.data.access_token,
        },
      });

      setLongLivedToken(longLivedTokenResponse.data.access_token);
      setLongLivedTokenLoading(false);
    } catch (error) {
      console.error(error);
      setLongLivedToken('');
      setLongLivedTokenLoading(false);
    }
  };

  const onGetBusinessAccounts = async () => {
    try {
      setBusinessAccountsLoading(true);
      const { data: response } = await axios.get('/api/business/accounts', {
        params: {
          accessToken: longLivedToken,
        },
      });
      const accounts = response.data.accounts.data.map((account) => ({
        ...account,
        instagram_business_account_id: '-',
      }));
      setBusinessAccounts(accounts);
      setBusinessAccountsLoading(false);
    } catch (error) {
      console.error(error);
      setBusinessAccounts([]);
      setBusinessAccountsLoading(false);
    }
  };

  const onGetIgBusinessId = async (id) => {
    try {
      const { data: response } = await axios.get('/api/business/connected-ig', {
        params: {
          businessPageId: id,
          accessToken: longLivedToken,
        },
      });
      const igBusinessId = response.data.instagram_business_account.id;
      const indexOfAccountId = businessAccounts.map((account) => account.id).indexOf(id);
      const copyBusinessAccounts = [...businessAccounts];
      copyBusinessAccounts[indexOfAccountId].instagram_business_account_id = igBusinessId;
      setBusinessAccounts(copyBusinessAccounts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (code) {
      onGetToken();
    } else {
      setLongLivedTokenLoading(false);
    }
  }, [code]);

  useEffect(() => {
    if (longLivedToken) {
      onGetBusinessAccounts();
    }
  }, [longLivedToken]);

  useEffect(() => {
    if (businessAccounts.length) {
      businessAccounts.map((account) => {
        onGetIgBusinessId(account.id);
      });
    }
  }, [businessAccounts.length]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center min-h-screen py-5">
        <Card>
          <div className="text-center">
            <h1 className={styles['auth-title']}>
              Instagram
            </h1>
            <h2 className="text-sm mt-2">
              Generate Token
            </h2>
          </div>
          {isLongLivedTokenLoading ? (
            <div className="flex justify-center mt-6 mb-3">
              <Loader type="Oval" color="#00BFFF" height={60} width={60} />
            </div>
          ) : (
            <>
              {longLivedToken ? <Authorized token={longLivedToken} /> : <Unauthorize />}
            </>
          )}
        </Card>
        {businessAccounts.length > 0 && businessAccounts.map((account, accountIndex) => {
          return (
            <Card key={accountIndex} className="mt-5">
              <h1 className="text-xl mb-2">
                {account.name}
              </h1>
              <p className="text-sm">
                Category: {account.category}
              </p>
              <p className="text-sm">
                ID: {account.id}
              </p>
              <p className="text-sm truncate">
                IG Business Account ID: {account.instagram_business_account_id}
              </p>
            </Card>
          );
        })}
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
