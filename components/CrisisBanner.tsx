'use client';

interface CrisisBannerProps {
  onGetHelp: () => void;
}

export default function CrisisBanner({ onGetHelp }: CrisisBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-red-50 border border-red-200 rounded-xl p-4 mx-4 mt-2 flex flex-col gap-2"
    >
      <div className="flex items-start gap-2">
        <span className="text-red-500 text-xl" aria-hidden="true">🆘</span>
        <div>
          <p className="font-semibold text-red-700 text-sm">We noticed you might be struggling</p>
          <p className="text-red-600 text-sm mt-1">
            You are not alone. Help is available right now. Please reach out to a crisis helpline.
          </p>
        </div>
      </div>
      <button
        onClick={onGetHelp}
        className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        aria-label="Get help now - scroll to emergency helplines"
      >
        🆘 Get Help Now
      </button>
    </div>
  );
}
