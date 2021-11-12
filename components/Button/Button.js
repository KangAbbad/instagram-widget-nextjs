import classNames from 'classnames';

const Button = (props) => {
  const { children, ...btnProps } = props;

  return (
    <button
      {...btnProps}
      className={classNames(
        'border border-transparent rounded-md relative bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-center items-center font-medium text-sm text-white py-3 px-4',
        { 'bg-gray-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500': props.disabled },
        props.className,
      )}
    >
      {children || `Button`}
    </button>
  )
};

export default Button;
