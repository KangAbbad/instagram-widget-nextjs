import { useEffect, useState } from 'react';
import { ChipIcon } from '@heroicons/react/solid';

import styles from '~/styles/auth.module.css';

import Input from '~/components/Input';
import Button from '~/components/Button';

const Auth = () => {
  const [form, setForm] = useState({
    clientId: '',
    clientSecret: '',
  });

  const isValidate = Object.values(form).every((value) => value);

  const onChangeForm = (key, value) => {
    setForm((ps) => ({
      ...ps,
      [key]: value,
    }));
  };

  const onSubmit = async () => {
    if (isValidate) {
      Object.entries(form).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      const redirectUri = `https://instagram-widget-nextjs.vercel.app/basic/generate-token`;
      const url = `https://api.instagram.com/oauth/authorize?client_id=${form.clientId}&redirect_uri=${redirectUri}&scope=user_media,user_profile&response_type=code`;
      location.href = url;
    }
  };

  useEffect(() => {
    const savedClientId = localStorage.getItem('clientId');
    const savedClientSecret = localStorage.getItem('clientSecret');
    if (savedClientSecret) {
      onChangeForm(`clientSecret`, savedClientSecret);
    }
    if (savedClientId) {
      onChangeForm(`clientId`, savedClientId);
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
          </div>
          <Button disabled={!isValidate} className="group w-full mt-5" onClick={onSubmit}>
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <ChipIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
            </span>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
