;(async function () {
	console.log('Telegram Auto Signature script loaded!')

	// Загружаем подпись из настроек
	let signature = await new Promise(resolve => {
		chrome.storage.sync.get(['signature'], data => {
			resolve(data.signature || '— [ https://github.com/NordStory ]')
		})
	})

	console.log('Loaded signature:', signature)

	// Функция для сохранения позиции курсора
	function getCursorPosition(element) {
		let selection = window.getSelection()
		if (selection.rangeCount === 0) return element.innerText.length
		let range = selection.getRangeAt(0)
		let preCaretRange = range.cloneRange()
		preCaretRange.selectNodeContents(element)
		preCaretRange.setEnd(range.endContainer, range.endOffset)
		return preCaretRange.toString().length
	}

	// Функция для восстановления позиции курсора
	function setCursorPosition(element, pos) {
		let selection = window.getSelection()
		let range = document.createRange()
		range.setStart(element.childNodes[0] || element, pos)
		range.collapse(true)
		selection.removeAllRanges()
		selection.addRange(range)
	}

	// Функция для добавления подписи без перезаписи текста
	function addSignature() {
		let inputField = document.querySelector('#editable-message-text')
		if (!inputField) {
			console.log('Input field NOT found!')
			return
		}
		let message = inputField.innerText.trim()
		// Сохраняем позицию курсора
		let cursorPosition = getCursorPosition(inputField)
		if (message.length > 0 && !message.endsWith(signature)) {
			console.log('Appending signature...')
			// Создаём текстовый узел с подписью и добавляем его
			let br = document.createElement('br')
			let textNode = document.createTextNode(' ' + signature)
			inputField.appendChild(br)
			inputField.appendChild(textNode)
			// Генерируем событие "input", чтобы Telegram обновил состояние
			inputField.dispatchEvent(new Event('input', { bubbles: true }))
			// Восстанавливаем позицию курсора
			setCursorPosition(inputField, cursorPosition)
		}
	}

	// Наблюдатель за изменениями в поле ввода (авто-добавление подписи)
	function startObserving() {
		let inputField = document.querySelector('#editable-message-text')
		if (!inputField) {
			console.log('Waiting for input field...')
			setTimeout(startObserving, 500)
			return
		}
		console.log('Input field found, starting observer...')
		let observer = new MutationObserver(() => {
			addSignature()
		})
		observer.observe(inputField, {
			childList: true,
			subtree: true,
			characterData: true,
		})
	}
	startObserving()
})()
