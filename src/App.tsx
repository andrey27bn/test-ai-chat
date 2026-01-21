import { useState, useRef, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';
import type { VirtuosoHandle } from 'react-virtuoso'; 
import { Send, Square, Zap } from 'lucide-react';
import { useChatStore } from './store/useChatStore';
import { useGenerator } from './hooks/useGenerator';
import { ChatMessage } from './components/ChatMessage';

export default function App() {
	const { messages, streamingText, isGenerating, setGenerating, addMessage } =
		useChatStore()
	const { generate } = useGenerator()
	const [inputValue, setInputValue] = useState('')
	const virtuosoRef = useRef<VirtuosoHandle>(null)

	const handleSend = useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault()
			if (!inputValue.trim()) return

			addMessage({
				id: `user-${Date.now()}`,
				role: 'user',
				content: inputValue,
			})

			setInputValue('')
			if (!isGenerating) generate()
		},
		[inputValue, isGenerating, addMessage, generate],
	)

	return (
		<div className='flex flex-col h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30'>
			{/* Header */}
			<header className='h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]/80 backdrop-blur-md z-10'>
				<div className='flex items-center gap-2'>
					<Zap className='text-blue-500' size={20} fill='currentColor' />
					<span className='font-semibold tracking-tight'>
						AI High-Speed Stream
					</span>
				</div>
				<div className='text-xs font-mono text-slate-500'>
					History size: ~
					{(JSON.stringify(messages).length / 1024 / 1024).toFixed(2)} MB
				</div>
			</header>

			{/* Chat List */}
			<div className='flex-1 relative overflow-hidden'>
				<Virtuoso
					ref={virtuosoRef}
					data={messages}
					initialTopMostItemIndex={
						messages.length > 0 ? messages.length - 1 : 0
					}
					followOutput={isAtBottom => (isAtBottom ? 'auto' : false)}
					itemContent={(_index, msg) => <ChatMessage {...msg} />}
					components={{
						Footer: () => (
							<div className='pb-32'>
								{isGenerating && (
									<ChatMessage
										role='assistant'
										content={streamingText + ' █'}
									/>
								)}
							</div>
						),
					}}
				/>
			</div>

			{/* Input Form */}
			<div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent'>
				<form
					onSubmit={handleSend}
					className='max-w-4xl mx-auto relative group'
				>
					<input
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
						placeholder='Спросите что-нибудь (например, напиши код на Rust)...'
						className='w-full bg-slate-800 border border-slate-700 p-4 pr-32 rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-2xl'
					/>
					<div className='absolute right-2 top-2 bottom-2 flex gap-2'>
						{isGenerating ? (
							<button
								type='button'
								onClick={() => setGenerating(false)}
								className='bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 rounded-xl flex items-center gap-2 transition-colors border border-red-500/20'
							>
								<Square size={16} fill='currentColor' />{' '}
								<span className='text-sm font-medium'>Стоп</span>
							</button>
						) : (
							<button
								type='submit'
								disabled={!inputValue.trim()}
								className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-4 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20'
							>
								<Send size={16} />{' '}
								<span className='text-sm font-medium'>Отправить</span>
							</button>
						)}
					</div>
				</form>
				<p className='text-center text-[10px] text-slate-500 mt-3'>
					60 FPS Virtualized Stream Test • 2026 Edition
				</p>
			</div>
		</div>
	)
}
