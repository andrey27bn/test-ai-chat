import React, { useMemo } from 'react'
import { marked } from 'marked'

export const ChatMessage = React.memo(
	({ role, content }: { role: string; content: string }) => {
		const html = useMemo(() => marked.parse(content), [content])

		return (
			<div
				className={`p-6 ${role === 'assistant' ? 'bg-slate-800/40' : 'bg-transparent'}`}
			>
				<div className='max-w-4xl mx-auto flex gap-4'>
					<div
						className={`w-8 h-8 shrink-0 rounded flex items-center justify-center font-bold ${
							role === 'assistant'
								? 'bg-blue-600 text-white'
								: 'bg-slate-600 text-slate-200'
						}`}
					>
						{role === 'assistant' ? 'AI' : 'U'}
					</div>
					<div
						className='prose prose-invert max-w-none break-words text-slate-200 overflow-hidden'
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</div>
			</div>
		)
	},
)
