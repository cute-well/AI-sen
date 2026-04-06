'use client';

const HELPLINES = [
  {
    name: 'iCall',
    number: '9152987821',
    description: 'Psychological counselling and support',
    available: 'Mon–Sat, 8am–10pm',
  },
  {
    name: 'Vandrevala Foundation',
    number: '1860-2662-345',
    description: '24/7 mental health helpline',
    available: '24/7',
  },
  {
    name: 'NIMHANS',
    number: '080-46110007',
    description: 'National Institute of Mental Health',
    available: 'Mon–Sat, 8am–8pm',
  },
  {
    name: 'Fortis Stress Helpline',
    number: '8376804102',
    description: 'Emotional support and crisis intervention',
    available: '24/7',
  },
  {
    name: 'Snehi',
    number: '044-24640050',
    description: 'Emotional support for suicidal individuals',
    available: 'Daily, 8am–10pm',
  },
];

interface EmergencyHelplineProps {
  id?: string;
}

export default function EmergencyHelpline({ id = 'emergency-helplines' }: EmergencyHelplineProps) {
  return (
    <section
      id={id}
      className="bg-blue-50 border border-blue-200 rounded-xl p-4 mx-4 my-3"
      aria-label="Emergency helplines"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" aria-hidden="true">📞</span>
        <h2 className="font-bold text-blue-800 text-base">Emergency Helplines (India)</h2>
      </div>
      <p className="text-blue-700 text-sm mb-3 italic">
        &quot;You are not alone. Reaching out is a sign of strength.&quot;
      </p>
      <div className="space-y-2">
        {HELPLINES.map((line) => (
          <div
            key={line.name}
            className="bg-white rounded-lg p-3 border border-blue-100 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800 text-sm">{line.name}</p>
              <p className="text-gray-500 text-xs">{line.description}</p>
              <p className="text-gray-400 text-xs">{line.available}</p>
            </div>
            <a
              href={`tel:${line.number.replace(/-/g, '')}`}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 flex-shrink-0 ml-3"
              aria-label={`Call ${line.name} at ${line.number}`}
            >
              {line.number}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
