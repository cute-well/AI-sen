'use client';

import { useState } from 'react';

const STEPS = [
  { count: 5, sense: 'see', emoji: '👀', instruction: 'Name 5 things you can SEE around you right now.' },
  { count: 4, sense: 'touch', emoji: '🤚', instruction: 'Name 4 things you can TOUCH or feel physically.' },
  { count: 3, sense: 'hear', emoji: '👂', instruction: 'Name 3 things you can HEAR right now.' },
  { count: 2, sense: 'smell', emoji: '👃', instruction: 'Name 2 things you can SMELL (or like the smell of).' },
  { count: 1, sense: 'taste', emoji: '👅', instruction: 'Name 1 thing you can TASTE right now.' },
];

interface GroundingExerciseProps {
  onClose: () => void;
}

export default function GroundingExercise({ onClose }: GroundingExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompleted(false);
  };

  return (
    <div
      className="bg-green-50 border border-green-200 rounded-xl p-5 mx-4 my-3"
      role="region"
      aria-label="5-4-3-2-1 grounding exercise"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">🌱</span>
          <h2 className="font-bold text-green-800 text-base">5-4-3-2-1 Grounding Exercise</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close grounding exercise"
          className="text-green-500 hover:text-green-700 text-sm font-medium"
        >
          ✕
        </button>
      </div>

      {!completed ? (
        <>
          <div className="flex gap-1 mb-4" aria-label="Progress">
            {STEPS.map((s, i) => (
              <div
                key={s.sense}
                className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                  i <= currentStep ? 'bg-green-500' : 'bg-green-200'
                }`}
              />
            ))}
          </div>

          <div className="text-center py-4">
            <div className="text-5xl mb-3" aria-hidden="true">{step.emoji}</div>
            <div className="text-4xl font-bold text-green-700 mb-2">{step.count}</div>
            <p className="text-green-800 font-medium text-base mb-1">{step.instruction}</p>
            <p className="text-green-600 text-xs">
              Take your time. Breathe slowly. Notice each one.
            </p>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 mt-2"
            aria-label={currentStep < STEPS.length - 1 ? 'Continue to next step' : 'Complete exercise'}
          >
            {currentStep < STEPS.length - 1 ? 'Next →' : 'Complete ✓'}
          </button>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="text-5xl mb-3" aria-hidden="true">✨</div>
          <p className="text-green-800 font-semibold text-base mb-1">
            Well done! You completed the grounding exercise.
          </p>
          <p className="text-green-600 text-sm mb-4">
            You are present. You are safe. You are not alone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleRestart}
              className="flex-1 bg-white border border-green-400 text-green-700 font-medium py-2 px-4 rounded-lg hover:bg-green-50 transition-colors duration-200 text-sm"
            >
              Do Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              Back to Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
