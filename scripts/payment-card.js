customElements.define('payment-card-component', class extends HTMLElement {
	constructor() {
		super();

		const shadowRoot = this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		const styleSheet = document.createElement('style');

		template.innerHTML = this.getTemplate();
		styleSheet.innerHTML = this.getStyles();

		shadowRoot.appendChild(styleSheet);
		shadowRoot.appendChild(template.content.cloneNode(true));

		this.initializeForm();
	}

	requiredFields = ['card-number', 'card-holder', 'cvv']

	initializeForm() {
		const form = this.shadowRoot.querySelector('#payment-form');
		const cardNumberInput = this.shadowRoot.querySelector('#card-number');
		const cvvInput = this.shadowRoot.querySelector('#cvv');
		const cardHolder = this.shadowRoot.querySelector('#card-holder');

		const cardNumberError = this.shadowRoot.querySelector('#card-number-error');
		const cardHolderError = this.shadowRoot.querySelector('#card-holder-error');
		const cvvError = this.shadowRoot.querySelector('#cvv-error');

		cardNumberInput.addEventListener('input', () => {
			const value = cardNumberInput.value.replace(/\D/g, '');

			cardNumberInput.value = value.match(/.{1,4}/g)?.join(' ') || '';

			if (this.validateCardNumber(value)) {
				cardNumberInput.classList.remove('invalid');

				cardNumberError.textContent = '';
			} else {
				cardNumberInput.classList.add('invalid');

				cardNumberError.textContent = 'Неверный формат номера карты';
			}
		});

		cardHolder.addEventListener('input', () => {
			const value = cardNumberInput.value;

			if (value) {
				cardHolderError.textContent = '';
			} else {
				cardHolderError.textContent = 'Это поле обязательно';
			}
		});

		cvvInput.addEventListener('input', () => {
			cvvInput.value = cvvInput.value.replace(/\D/g, '');

			if (this.validateCVV(cvvInput.value)) {
				cvvInput.classList.remove('invalid');

				cvvError.textContent = '';
			} else {
				cvvInput.classList.add('invalid');

				cvvError.textContent = 'CVV должен содержать 3 цифры';
			}
		});

		form.addEventListener('submit', async (event) => {
			event.preventDefault();

			const formData = {
				'card-number': cardNumberInput.value.replace(/\D/g, ''),
				'card-holder': this.shadowRoot.querySelector('#card-holder').value,
				cvv: cvvInput.value
			};

			if (this.validateForm(formData)) {
				try {
					await this.submitPayment(formData);

					this.showSuccessModal();
				} catch (error) {
					alert('Ошибка при обработке платежа');
				}
			}
		});
	}

	validateCardNumber(number) {
		return /^[0-9]{16}$/.test(number);
	}

	validateCVV(cvv) {
		return /^[0-9]{3}$/.test(cvv);
	}

	validateForm(formData) {
		for (const field of this.requiredFields) {
			if (!formData[field]) {
				const errorDiv = this.shadowRoot.querySelector(`#${field}-error`);

				errorDiv.textContent = 'Это поле обязательно';

				return false;
			}
		}

		return true;
	}

	async submitPayment() {
		await new Promise(resolve => setTimeout(resolve, 300));
	}

	showSuccessModal() {
		const modal = this.shadowRoot.querySelector('#success-modal');

		modal.style.display = 'flex';
	}

	getTemplate() {
		return /* HTML */ `
			<div class="container">
				<form id="payment-form">
					<div class="form-group">
						<label for="card-number">Номер карты</label>
						<input type="text" id="card-number" placeholder="•••• •••• •••• ••••">
						<div id="card-number-error" class="error-message"></div>
					</div>

					<div class="form-group">
						<label for="card-holder">Имя владельца</label>
						<input type="text" id="card-holder" placeholder="Иванов Иван Иванович">
						<div id="card-holder-error" class="error-message"></div>
					</div>

					<div class="form-group">
						<label>Срок действия</label>
						<select id="expiration-month">
							<option value="01">Январь</option>
							<option value="02">Февраль</option>
							<option value="03">Март</option>
							<option value="04">Апрель</option>
							<option value="05">Май</option>
							<option value="06">Июнь</option>
							<option value="07">Июль</option>
							<option value="08">Август</option>
							<option value="09">Сентябрь</option>
							<option value="10">Октябрь</option>
							<option value="11">Ноябрь</option>
							<option value="12">Декабрь</option>
						</select>
						<div id="expiration-month-error" class="error-message"></div>
					</div>

					<div class="form-group">
						<label for="expiration-year">Год</label>
						<select id="expiration-year">
							${Array.from({length: 15}, (_, i) => `<option value="${new Date().getFullYear() + i}">${new Date().getFullYear() + i}</option>`).join('')}
						</select>
						<div id="expiration-year-error" class="error-message"></div>
					</div>

					<div class="form-group">
						<label for="cvv">CVV</label>
						<input type="text" id="cvv" maxlength="3" placeholder="•••">
						<div id="cvv-error" class="error-message"></div>
					</div>

					<button type="submit">Оплатить</button>
				</form>

				<div class="modal-overlay" id="success-modal">
					<div class="modal-content">
						<h3>Успешно!</h3>
						<p>Оплата прошла успешно.</p>
						<button onclick="this.parentElement.parentElement.style.display='none'">Закрыть</button>
					</div>
				</div>
			</div>
		`
	}

	getStyles() {
		return /* CSS */ `
			.container {
				max-width: 400px;
				margin: 20px auto;
				padding: 20px;
				border-radius: 8px;
				box-shadow: 0 2px 4px rgba(0,0,0,0.1);
				font-family: Arial, sans-serif;
			}

			.form-group {
				margin-bottom: 15px;
			}

			label {
				display: block;
				margin-bottom: 5px;
				color: #333;
			}

			input {
				width: 100%;
				padding: 8px;
				border: 1px solid #ddd;
				border-radius: 4px;
			}

			input.invalid {
				border-color: #ff0000;
			}

			button {
				width: 100%;
				padding: 10px;
				background-color: #007bff;
				color: white;
				border: none;
				border-radius: 4px;
				cursor: pointer;
			}

			button:hover {
				background-color: #0056b3;
			}

			.modal-overlay {
				display: none;
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, .5);
				justify-content: center;
				align-items: center;
			}

			.modal-content {
				background-color: #fff;
				padding: 20px;
				border-radius: 8px;
				max-width: 300px;
				text-align: center;
			}

			.error-message {
				color: #ff0000;
				font-size: 14px;
				margin-top: 5px;
			}
		`;
	}
});
