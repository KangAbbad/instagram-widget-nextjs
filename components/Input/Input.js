import classNames from 'classnames';

const Input = (props) => {
  return (
    <input
      {...props}
      className={classNames(
        "border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 relative block w-full placeholder-gray-300 text-gray-900 sm:text-sm appearance-none px-3 py-2",
        props.className,
      )}
    />
  );
};

export default Input;
