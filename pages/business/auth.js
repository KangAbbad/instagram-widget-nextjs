import { useEffect, useState } from 'react';
import { ChipIcon } from '@heroicons/react/solid';
import axios from 'axios';

import styles from '~/styles/auth.module.css';

import Input from '~/components/Input';
import Button from '~/components/Button';

const Auth = () => {
  const [form, setForm] = useState({
    clientId: '',
    clientSecret: '',
    state: '',
  });

  const { state, ...restForm } = form;
  const isValidate = Object.values(restForm).every((value) => value);

  const onChangeForm = (key, value) => {
    setForm((ps) => ({
      ...ps,
      [key]: value,
    }));
  };

  const onSubmit = async () => {
    if (isValidate) {
      const url = '/api/business/auth'; 
      localStorage.setItem('businessClientId', form.clientId);
      localStorage.setItem('businessClientSecret', form.clientSecret);

      const { data: response } = await axios.get(url, {
        params: {
          clientId: form.clientId,
          redirectUri: 'https://instagram-widget-nextjs.vercel.app/business/generate-token',
          state: form.state || `1738`,
        }
      });
      location.href = response.data.url;
    }
  };

  useEffect(() => {
    const savedBusinessClientId = localStorage.getItem('businessClientId');
    const savedBusinessClientSecret = localStorage.getItem('businessClientSecret');
    if (savedBusinessClientSecret) {
      onChangeForm(`clientSecret`, savedBusinessClientSecret);
    }
    if (savedBusinessClientId) {
      onChangeForm(`clientId`, savedBusinessClientId);
    }
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="border border-[#EAEAEA] rounded-lg shadow-lg w-full max-w-[500px] p-4">
          <div className="text-center">
            <h1 className={styles['auth-title']}>
              Instagram
            </h1>
            <h2 className="text-sm mt-2">
              Authentication
            </h2>
          </div>
          <div className="space-y-3 mt-5">
            <Input
              placeholder="Client ID"
              value={form.clientId}
              onChange={(e) => onChangeForm('clientId', e.target.value)}
            />

            <Input
              placeholder="Client Secret"
              value={form.clientSecret}
              onChange={(e) => onChangeForm('clientSecret', e.target.value)}
            />

            <Input
              placeholder="State (Optional)"
              value={form.state}
              onChange={(e) => onChangeForm('state', e.target.value)}
            />
          </div>
          <Button disabled={!isValidate} className="bg-indigo-600 hover:bg-indigo-700 focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 group w-full mt-5" onClick={onSubmit}>
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <ChipIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
            </span>
            Facebook Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
