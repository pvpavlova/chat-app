import { useState } from 'react';
import styles from './AuthForm.module.css';
import axiosInstance, { setAccessToken } from '../../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function AuthForm({ setUser }) {
  const [inputs, setInputs] = useState({});
  const [formType, setFormType] = useState('signin');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const confirmPasswordChangeHandler = (e) => {
    setConfirmPassword(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Проверка, что пароли совпадают при регистрации
    if (formType === 'signup' && inputs.password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API}/auth/${formType}`,
        inputs
      );

      console.log(response.data);
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      navigate('/');
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  };

  const toggleFormType = () => {
    setFormType(formType === 'signin' ? 'signup' : 'signin');
    setInputs({});
    setConfirmPassword(''); // Сбрасываем confirmPassword при смене формы
  };

  return (
    <form onSubmit={submitHandler} className={styles.wrapper}>
      <h3 className={styles.head}>
        {formType === 'signin' ? 'Вход' : 'Регистрация'}
      </h3>
      <div className={styles.inputs}>
        {formType === 'signup' && (
          <>
            <input
              onChange={changeHandler}
              name='username'
              value={inputs?.username || ''}
              placeholder='Имя пользователя'
              className={styles.input}
            />
          </>
        )}
        <input
          onChange={changeHandler}
          name='email'
          value={inputs?.email || ''}
          placeholder='Эл.почта'
          className={styles.input}
        />
        <input
          onChange={changeHandler}
          type='password'
          name='password'
          value={inputs?.password || ''}
          placeholder='Пароль'
          className={styles.input}
        />
        {formType === 'signup' && (
          <input
            onChange={confirmPasswordChangeHandler}
            type='password'
            value={confirmPassword}
            placeholder='Повторите пароль'
            className={styles.input}
          />
        )}
      </div>
      <div className={styles.btns}>
        <button type='submit' className={styles.button}>
          {formType === 'signin' ? 'Вход' : 'Регистрация'}
        </button>
        <button type='button' onClick={toggleFormType} className={styles.toggleButton}>
          {formType === 'signin'
            ? 'Нет аккаунта? Зарегистрироваться'
            : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </form>
  );
}