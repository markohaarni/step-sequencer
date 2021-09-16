import classNames from 'classnames';
import styles from './IconButton.module.css';
import Button from './Button';

export default function IconButton({ className, children, ...rest }) {
  return (
    <Button className={classNames(styles.iconButton, className)} {...rest}>
      {children}
    </Button>
  );
}
