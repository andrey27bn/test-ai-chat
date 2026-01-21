import { useChatStore } from '../store/useChatStore'

export const useGenerator = () => {
	const { setStreamingText, setGenerating, completeStreaming } = useChatStore()

	const generate = async () => {
		setGenerating(true)
		setStreamingText('')

		let fullText = ''
		// Генерируем базу для 10,000 слов
		const baseText =
			'Это пример высокопроизводительного стриминга текста в React. '
		const iterations = 10000 / baseText.split(' ').length

		for (let i = 0; i < iterations; i++) {
			// Проверка на кнопку "Стоп"
			if (!useChatStore.getState().isGenerating) break

			fullText += baseText + `(Блок ${i + 1}) `

			// Обновляем состояние
			setStreamingText(fullText)

			// Даем браузеру "отдохнуть" и отрисовать инпут/скролл
			if (i % 2 === 0) {
				await new Promise(resolve => setTimeout(resolve, 0))
			}
		}

		completeStreaming()
	}

	return { generate }
}
