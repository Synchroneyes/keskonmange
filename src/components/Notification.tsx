interface Props {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: Props) {
  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-700',
      text: 'text-green-800 dark:text-green-200',
      icon: '✅'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-700',
      text: 'text-red-800 dark:text-red-200',
      icon: '❌'
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      border: 'border-amber-200 dark:border-amber-700',
      text: 'text-amber-800 dark:text-amber-200',
      icon: '⚠️'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-700',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'ℹ️'
    }
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 mb-6 relative`}>
      <div className="flex items-start space-x-3">
        <span className="text-xl">{style.icon}</span>
        <div className="flex-1">
          <p className={`text-sm font-medium ${style.text}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70 transition-opacity duration-200`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
