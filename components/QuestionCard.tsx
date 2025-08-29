'use client'
export default function QuestionCard({ question, selected, onSelect }: any) {
  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <p className="text-lg font-semibold mb-4">{question.question}</p>
      <div className="space-y-3">
        {question.options.map((opt: string, i: number) => {
          const isSelected = selected === i
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-full text-left p-3 rounded-lg border transition
                ${isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 hover:bg-gray-100'}
              `}
            >
              <div className="flex items-center">
                <div className="w-6 font-mono mr-3">{String.fromCharCode(97 + i)})</div>
                <div>{opt}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
