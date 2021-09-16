import classNames from 'classnames';
import styles from './Button.module.css';

export default function Button({ className, children, ...rest }) {
  return (
    <button
      type="button"
      className={classNames(styles.button, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
