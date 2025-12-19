interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="cyber-progress w-full h-4">
      <div
        className="cyber-progress-bar h-full transition-all duration-500 ease-out flex items-center justify-end px-2"
        style={{ width: `${percentage}%` }}
      >
        {percentage > 15 && (
          <span className="text-xs font-bold text-black font-mono">
            {current}/{total}
          </span>
        )}
      </div>
    </div>
  );
};
