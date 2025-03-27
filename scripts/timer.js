customElements.define('timer-component', class extends HTMLElement {
  constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: 'open' });
      const styles = this.getStyles();

      const template = this.getTemplate();

      shadowRoot.innerHTML = `
          <style>${styles}</style>
          ${template}
      `;

      this.setInitialState(shadowRoot);
      this.setListener();
  }

  formatTime(seconds) {
      const hours = Math.floor(seconds / 3600).toString();
      const minutes = Math.floor((seconds % 3600) / 60).toString();
      const newSeconds = (seconds % 60).toString();

      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${newSeconds.padStart(2, '0')}`;
  }

  start() {
      if (!this.intervalId) {
          this.intervalId = setInterval(() => {
              this.time++;
              this.timeDisplay.textContent = this.formatTime(this.time);
          }, 1000);
      }
  }

  stop() {
      if (this.intervalId) {
          clearInterval(this.intervalId);

          this.intervalId = null;
      }
  }

  reset() {
      this.stop();

      this.time = 0;
      this.timeDisplay.textContent = this.formatTime(this.time);
  }

  getStyles() {
    return /* CSS */`
          .container {
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              text-align: center;
          }

          .time-display {
              font-size: 48px;
              margin: 20px 0;
              color: #333;
              font-family: monospace;
          }

          .controls {
              display: flex;
              gap: 10px;
              justify-content: center;
          }

          button {
              padding: 10px 20px;
              font-size: 16px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              transition: opacity .2s;
          }

          button:hover {
              opacity: .9;
          }

          #btn-start {
              background-color:rgb(0, 139, 5);
              color: #fff;
          }

          #btn-stop {
              background-color:rgb(182, 12, 0);
              color: #fff;
          }

          #btn-reset {
              background-color:rgb(0, 89, 162)
              color: #fff;
          }
      `
  }

  getTemplate() {
      return /* HTML */ `
          <div class="container">
              <div class="time-display">00:00:00</div>
              <div class="controls">
                  <button id="btn-start">Старт</button>
                  <button id="btn-stop">Стоп</button>
                  <button id="btn-reset">Сброс</button>
              </div>
          </div>
      `
  }

  setListener() {
    this.startButton.addEventListener('click', () => this.start());
    this.stopButton.addEventListener('click', () => this.stop());
    this.resetButton.addEventListener('click', () => this.reset());
  }

  setInitialState(shadowRoot) {
    this.timeDisplay = shadowRoot.querySelector('.time-display');
    this.startButton = shadowRoot.querySelector('#btn-start');
    this.stopButton = shadowRoot.querySelector('#btn-stop');
    this.resetButton = shadowRoot.querySelector('#btn-reset');

    this.time = 0;
    this.intervalId = null;
  }
});
