import { FC, SetStateAction, useState, useRef, FormEvent } from 'react';
import loginStyle from './signup.module.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setCookie } from '../utils/cookies';

const Signup: FC = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [bizNumber, setBizNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const idInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const bizNumberInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLInputElement>(null);

  const handleId = (e: { target: { value: SetStateAction<string> } }) => {
    setId(e.target.value);
  };

  const handlePw = (e: { target: { value: SetStateAction<string> } }) => {
    setPw(e.target.value);
  };

  const handleName = (e: { target: { value: SetStateAction<string> } }) => {
    setName(e.target.value);
  };

  const handleBizNumber = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setBizNumber(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    nextRef: React.RefObject<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef.current) {
        nextRef.current.focus();
      } else {
        const form = (e.currentTarget as HTMLInputElement).form;
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  const signupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || !pw || !name || !bizNumber || !file) {
      toast.error('모든 필드를 채워주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('username', id);
    formData.append('password', pw);
    formData.append('name', name);
    formData.append('bizNumber', bizNumber);
    formData.append('file', file);

    axios('http://meal-queen.kro.kr/api/auth/signup/restaurant', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    })
      .then((res) => {
        setCookie('auth_token', res.data.data, { path: '/' });
        window.location.href = '/';
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <form className={loginStyle.page} onSubmit={signupSubmit}>
      <div className={loginStyle.titleWrap}>Signup</div>
      <div className={loginStyle.contentWrap}>
        <div className={loginStyle.inputTitleId}>ID</div>
        <div className={loginStyle.inputWrap}>
          <input
            ref={idInputRef}
            type="text"
            className={loginStyle.input}
            placeholder="ID"
            value={id}
            onChange={handleId}
            onKeyDown={(e) => handleKeyDown(e, pwInputRef)}
          />
        </div>
        <div className={loginStyle.inputTitlePw}>PASSWORD</div>
        <div className={loginStyle.inputWrap}>
          <input
            ref={pwInputRef}
            type="password"
            className={loginStyle.input}
            placeholder="PASSWORD"
            value={pw}
            onChange={handlePw}
            onKeyDown={(e) => handleKeyDown(e, nameInputRef)}
          />
        </div>
        <div className={loginStyle.inputTitleName}>NAME</div>
        <div className={loginStyle.inputWrap}>
          <input
            ref={nameInputRef}
            type="text"
            className={loginStyle.input}
            placeholder="NAME"
            value={name}
            onChange={handleName}
            onKeyDown={(e) => handleKeyDown(e, bizNumberInputRef)}
          />
        </div>
        <div className={loginStyle.inputTitleBizNumber}>BUSINESS NUMBER</div>
        <div className={loginStyle.inputWrap}>
          <input
            ref={bizNumberInputRef}
            type="text"
            className={loginStyle.input}
            placeholder="BUSINESS NUMBER"
            value={bizNumber}
            onChange={handleBizNumber}
            onKeyDown={(e) => handleKeyDown(e, fileInputRef)}
          />
        </div>
        <div className={loginStyle.inputTitleFile}>FILE</div>
        <div className={loginStyle.inputWrap}>
          <input
            ref={fileInputRef}
            type="file"
            className={loginStyle.input}
            onChange={handleFileChange}
            onKeyDown={(e) => handleKeyDown(e, submitButtonRef)}
          />
        </div>
      </div>
      <div>
        <input
          ref={submitButtonRef}
          type="submit"
          className={loginStyle.bottomButton}
          value={'Submit'}
        />
      </div>
    </form>
  );
};

export default Signup;
