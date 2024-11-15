import AuthForm from '../../organisms/AuthForm/AuthForm';
import styles from './RegistrationPage.module.css';

export default function RegistrationPage({ setUser }) {
  return (
    <div className={styles.wrapper}>
      <AuthForm title='Зарегистрироваться' type='signup' setUser={setUser} />
    </div>
  );
}
