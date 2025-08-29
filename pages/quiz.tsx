import { useEffect, useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import Link from 'next/link'

type MCQ = {
  type: 'mcq'
  question: string
  options: string[]
  answer: number
}
type Passage = {
  type: 'passage'
  passage: string
  questions: MCQ[]
}
type Item = MCQ | Passage

export default function QuizPage() {
  const [items, setItems] = useState<Item[]>([])
  const [flat, setFlat] = useState<(MCQ & { passage?: string })[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [mode, setMode] = useState<'all' | 'mcq' | 'passage' | null>(null)

  useEffect(() => {
    fetch('/questions.json')
      .then(r => r.json())
      .then((data: Item[]) => setItems(data))
  }, [])

  // Prepare questions based on mode
  useEffect(() => {
    if (!items.length || !mode) return
    const flatQs: (MCQ & { passage?: string })[] = []

    if (mode === 'mcq') {
      items.forEach(it => {
        if (it.type === 'mcq') flatQs.push(it)
      })
    } else if (mode === 'passage') {
      items.forEach(it => {
        if (it.type === 'passage') {
          it.questions.forEach(q => flatQs.push({ ...q, passage: it.passage }))
        }
      })
    } else {
      items.forEach(it => {
        if (it.type === 'mcq') flatQs.push(it)
        else it.questions.forEach(q => flatQs.push({ ...q, passage: it.passage }))
      })
    }

    setFlat(flatQs)
    setAnswers(Array(flatQs.length).fill(null))
    setIndex(0)
  }, [mode, items])

  if (!items.length) return <div className="p-8">Loading questions...</div>
  if (!mode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full text-center space-y-4">
          <h2 className="text-2xl font-bold">Choose Mode</h2>
          <button onClick={() => setMode('all')} className="w-full py-3 bg-blue-600 text-white rounded-lg">All Questions</button>
          <button onClick={() => setMode('mcq')} className="w-full py-3 bg-green-600 text-white rounded-lg">MCQ Only</button>
          <button onClick={() => setMode('passage')} className="w-full py-3 bg-purple-600 text-white rounded-lg">Passage Only</button>
        </div>
      </div>
    )
  }

  // ✅ Final Result Screen
  if (index >= flat.length) {
    const score = answers.reduce((acc, ans, i) => ans === flat[i].answer ? acc + 1 : acc, 0)
    const attempted = answers.filter(ans => ans !== null).length
    const incorrect: number[] = answers
      .map((ans, i) => (ans !== null && ans !== flat[i].answer ? i + 1 : null))
      .filter((x): x is number => x !== null)

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
          <h2 className="text-2xl font-bold">Quiz Complete</h2>

          {/* Summary */}
          <div className="space-y-2">
            <p className="text-lg">Score: <span className="font-semibold">{score}</span> / {flat.length}</p>
            <p className="text-gray-700">Attempted: {attempted} / {flat.length}</p>
            <p className="text-red-600">Incorrect: {incorrect.length}</p>
          </div>

          {/* Incorrect questions with details */}
          {incorrect.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left space-y-4">
              <h3 className="font-semibold text-red-700">Incorrect Questions:</h3>

              {incorrect.map((qNo) => {
                const q = flat[qNo - 1] // index correction
                return (
                  <div key={qNo} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <p className="font-medium text-gray-800">
                      Q{qNo}. {q.question}
                    </p>
                    {q.passage && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold">Passage:</span> {q.passage}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-semibold">Your Answer:</span>{" "}
                      {answers[qNo - 1] != null ? q.options[answers[qNo - 1]!] : "Not attempted"}
                    </p>
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">Correct Answer:</span>{" "}
                      {q.options[q.answer]}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-4 py-2 bg-gray-200 rounded">Home</Link>
            <Link href="/quiz" className="px-4 py-2 bg-blue-600 text-white rounded">Retry</Link>
          </div>
        </div>
      </div>
    )
  }

  const q = flat[index]

  const handleAnswer = (choice: number) => {
    setAnswers(prev => {
      const copy = [...prev]
      copy[index] = choice
      return copy
    })
  }

  // Count unattempted
  const leftCount = answers.filter(ans => ans === null).length

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Question {index + 1} / {flat.length}</h3>
          <div className="text-sm text-gray-600">Left: {leftCount}</div>
        </div>

        {/* Passage + Question */}
        <div className={`flex flex-col ${q.passage ? 'md:flex-row gap-6' : ''}`}>
          {q.passage && (
            <div className="md:w-1/2 bg-gray-50 p-4 rounded-xl text-gray-800 text-sm leading-relaxed shadow-sm">
              <h4 className="font-semibold mb-2">Passage</h4>
              <p>{q.passage}</p>
            </div>
          )}

          <div className={`w-full ${q.passage ? 'md:w-1/2' : ''}`}>
            <QuestionCard
              question={q}
              selected={answers[index]}
              onSelect={handleAnswer}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex justify-between">
            <button
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={index === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setIndex(i => i + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {index === flat.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>

          {/* Jump-to Grid */}
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-sm mb-2">Jump to Question:</h4>
            <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-2">
              {flat.map((_, i) => {
                let colorClass = 'bg-white'
                if (answers[i] != null) colorClass = 'bg-green-200'
                else colorClass = 'bg-red-200'
                if (i === index) colorClass = 'bg-blue-600 text-white'

                return (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-8 h-8 rounded text-xs flex items-center justify-center 
                      ${colorClass} border border-gray-300 hover:bg-blue-100`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
