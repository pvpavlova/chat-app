import AuthForm from '../../organisms/AuthForm/AuthForm';
import styles from './LoginPage.module.css';

export default function LoginPage({ setUser }) {
  return (
    <div className={styles.wrapper}>
      <AuthForm title='Войти' type='signin' setUser={setUser} />
    </div>
  );
}
