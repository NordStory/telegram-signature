document.addEventListener('DOMContentLoaded', function () {
	let signatureInput = document.getElementById('signature')
	let saveButton = document.getElementById('save')
	let currentSignature = document.getElementById('current-signature')

	// Загружаем сохраненную подпись и отображаем её
	chrome.storage.sync.get(['signature'], function (data) {
		let signature = data.signature || '- [ https://github.com/NordStory ]' // Значение по умолчанию
		signatureInput.value = signature // Заполняем поле ввода
		currentSignature.textContent = signature // Отображаем текущую подпись
	})

	// Обработчик нажатия кнопки "Сохранить"
	saveButton.addEventListener('click', function () {
		let newSignature = signatureInput.value.trim()
		chrome.storage.sync.set({ signature: newSignature }, function () {
			currentSignature.textContent = newSignature // Обновляем отображаемую подпись
			alert(
				'Подпись сохранена! Не забудьте обновить страницу https://web.telegram.org/a'
			)
		})
	})
})

document.getElementById('myLink').addEventListener('click', function (e) {
	e.preventDefault() // Отменяем стандартное поведение
	chrome.tabs.create({ url: this.href }) // Открываем через API
})
