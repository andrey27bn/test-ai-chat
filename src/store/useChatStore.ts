import { create } from 'zustand'

interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
}

interface ChatState {
	messages: Message[]
	isGenerating: boolean
	streamingText: string
	addMessage: (message: Message) => void
	setStreamingText: (text: string) => void
	setGenerating: (val: boolean) => void
	completeStreaming: () => void
}

export const useChatStore = create<ChatState>(set => ({
	messages: [],
	isGenerating: false,
	streamingText: '',

	addMessage: msg =>
		set(state => ({
			messages: [...state.messages, msg],
		})),

	setStreamingText: text => set({ streamingText: text }),

	setGenerating: val => set({ isGenerating: val }),

	completeStreaming: () =>
		set(state => {
			if (!state.streamingText) return { isGenerating: false }
			const newMessage: Message = {
				id: `ai-${Date.now()}`,
				role: 'assistant',
				content: state.streamingText,
			}
			return {
				messages: [...state.messages, newMessage],
				streamingText: '',
				isGenerating: false,
			}
		}),
}))
