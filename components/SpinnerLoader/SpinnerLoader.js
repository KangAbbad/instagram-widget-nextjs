import styles from './styles.module.css';

const SpinnerLoader = (props) => {
  const { height = 20, width = 20 } = props;

  const border = `${Math.round(20 / 5)}px solid #4339CA`;
  const borderTop = `${Math.round(20 / 5)}px solid #FFFFFF`;

  return (
    <div className={styles.loader} style={{ border, borderTop, height, width }} />
  )
};

export default SpinnerLoader;
