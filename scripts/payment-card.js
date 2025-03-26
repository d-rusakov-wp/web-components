customElements.define('payment-card-component', class extends HTMLElement {
	constructor() {
			super();

			const shadowRoot = this.attachShadow({ mode: 'open' });

			const styleSheet = document.createElement('style');

			const styles = this.getStyles();

			styleSheet.innerHTML = styles;

			const template = document.createElement('template');

			template.innerHTML = /* HTML */`
					<div class="payment-form">
							<form id="paymentForm">
									<div class="form-group">
											<label for="cardNumber">Номер карты</label>
											<input type="text" id="cardNumber" placeholder="•••• •••• •••• ••••">
											<div id="cardNumberError" class="error-message"></div>
									</div>

									<div class="form-group">
											<label for="cardHolder">Имя владельца</label>
											<input type="text" id="cardHolder" placeholder="Иванов Иван Иванович">
											<div id="cardHolderError" class="error-message"></div>
									</div>

									<div class="form-group">
											<label>Срок действия</label>
											<select id="expirationMonth">
													<option value="">Месяц</option>
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
									</div>

									<div class="form-group">
											<label for="expirationYear">Год</label>
											<select id="expirationYear">
													<option value="">Год</option>
													${Array.from({length: 15}, (_, i) => `<option value="${new Date().getFullYear() + i}">${new Date().getFullYear() + i}</option>`).join('')}
											</select>
									</div>

									<div class="form-group">
											<label for="cvv">CVV</label>
											<input type="text" id="cvv" maxlength="3" placeholder="•••">
											<div id="cvvError" class="error-message"></div>
									</div>

									<button type="submit">Оплатить</button>
							</form>

							<div class="modal-overlay" id="successModal">
									<div class="modal-content">
											<h3>Успешно!</h3>
											<p>Оплата прошла успешно.</p>
											<button onclick="this.parentElement.parentElement.style.display='none'">Закрыть</button>
									</div>
							</div>
					</div>
			`;

			shadowRoot.appendChild(styleSheet);
			shadowRoot.appendChild(template.content.cloneNode(true));

			this.initializeForm();
	}

	initializeForm() {
			const form = this.shadowRoot.querySelector('#paymentForm');
			const cardNumberInput = this.shadowRoot.querySelector('#cardNumber');
			const cvvInput = this.shadowRoot.querySelector('#cvv');

			cardNumberInput.addEventListener('input', () => {
					const value = cardNumberInput.value.replace(/\D/g, '');

					cardNumberInput.value = value.match(/.{1,4}/g)?.join(' ') || '';

					if (!this.validateCardNumber(value)) {
							cardNumberInput.classList.add('invalid');

							this.shadowRoot.querySelector('#cardNumberError').textContent = 'Неверный формат номера карты';
					} else {
							cardNumberInput.classList.remove('invalid');

							this.shadowRoot.querySelector('#cardNumberError').textContent = '';
					}
			});

			cvvInput.addEventListener('input', () => {
					cvvInput.value = cvvInput.value.replace(/\D/g, '');

					if (!this.validateCVV(cvvInput.value)) {
							cvvInput.classList.add('invalid');

							this.shadowRoot.querySelector('#cvvError').textContent = 'CVV должен содержать 3 цифры';
					} else {
							cvvInput.classList.remove('invalid');

							this.shadowRoot.querySelector('#cvvError').textContent = '';
					}
			});

			form.addEventListener('submit', async (event) => {
					event.preventDefault();

					const formData = {
							cardNumber: cardNumberInput.value.replace(/\D/g, ''),
							expirationMonth: this.shadowRoot.querySelector('#expirationMonth').value,
							expirationYear: this.shadowRoot.querySelector('#expirationYear').value,
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
			return /^[0-9]{13,16}$/.test(number);
	}

	validateCVV(cvv) {
			return /^[0-9]{3}$/.test(cvv);
	}

	validateForm(formData) {
			const requiredFields = ['expirationMonth', 'expirationYear'];

			for (const field of requiredFields) {
					if (!formData[field]) {
							const errorDiv = this.shadowRoot.querySelector(`#${field}Error`);

							errorDiv.textContent = 'Это поле обязательно';

							return false;
					}
			}

			return true;
	}

	async submitPayment(formData) {
			await new Promise(resolve => setTimeout(resolve, 1000));
	}

	showSuccessModal() {
			const modal = this.shadowRoot.querySelector('#successModal');

			modal.style.display = 'flex';
	}

	getStyles() {
		return `
					.payment-form {
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
							box-sizing: border-box;
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
							background-color: rgba(0,0,0,0.5);
							justify-content: center;
							align-items: center;
					}

					.modal-content {
							background-color: white;
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
