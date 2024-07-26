class PomodoroTimer extends HTMLElement {
  static styles = `
    <style>
      :host {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        font-family: Arial, sans-serif;
      }

      #clock {
        font-size: 5rem;
        font-weight: 700;
        letter-spacing: 10px;
        margin: 20px 0;
      }

      button {
        font-size: 1.5rem;
        margin: 5px;
        padding: 10px 20px;
        background-color: rgba(255, 238, 169, 0.1);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      button.active {
        background-color: #CA8787;
      }

      #mode-btns {
        display: flex;
        justify-content: center;
      }

      @media screen and (min-width: 900px) {
        #clock {
          font-size: 6rem;
        }
      }
    </style>
  `;

  get template() {
    return `
      ${PomodoroTimer.styles}
      <div id="clock">
        <span id="minutes">25</span>:<span id="seconds">00</span>
      </div>
      <button id="start-btn" data-action="start">Start</button>
      <button id="reset-btn">Reset</button>
      <div id="mode-btns">
        <button data-mode="pomodoro" class="active">Pomodoro</button>
        <button data-mode="short">Short Break</button>
        <button data-mode="long">Long Break</button>
      </div>
    `;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = this.template;
    this.timer = {
      pomodoro: 25,
      short: 5,
      long: 15,
      longInterval: 4,
      mode: 'pomodoro',
      remaining: {
        total: 25 * 60,
        minutes: 25,
        seconds: 0,
      }
    };
    this.interval = null;

    this.min = this.shadowRoot.getElementById('minutes');
    this.sec = this.shadowRoot.getElementById('seconds');
    this.startBtn = this.shadowRoot.getElementById('start-btn');
    this.resetBtn = this.shadowRoot.getElementById('reset-btn');
    this.modeBtns = this.shadowRoot.getElementById('mode-btns');

    this.startBtn.addEventListener('click', () => {
      const { action } = this.startBtn.dataset;
      if (action === 'start') this.startTimer();
      else this.stopTimer();
    });

    this.resetBtn.addEventListener('click', () => {
      clearInterval(this.interval);
      this.switchMode(this.timer.mode);
      this.stopTimer();
    });

    this.modeBtns.addEventListener('click', (e) => {
      const { mode } = e.target.dataset;
      if (!mode) return;
      this.switchMode(mode);
      this.stopTimer();
    });

    this.switchMode('pomodoro');
  }

  getRemainingTime(end) {
    const currentTime = Date.parse(new Date());
    const difference = end - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return { total, minutes, seconds };
  }

  startTimer() {
    let { total } = this.timer.remaining;
    const end = Date.parse(new Date()) + total * 1000;

    this.startBtn.dataset.action = 'stop';
    this.startBtn.textContent = 'Stop';

    this.interval = setInterval(() => {
      this.timer.remaining = this.getRemainingTime(end);
      this.updateClock();

      total = this.timer.remaining.total;
      if (total <= 0) {
        clearInterval(this.interval);
        this.switchMode(this.timer.mode);
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
    this.startBtn.dataset.action = 'start';
    this.startBtn.textContent = 'Start';
  }

  updateClock() {
    const { remaining } = this.timer;
    this.min.textContent = `${remaining.minutes}`.padStart(2, '0');
    this.sec.textContent = `${remaining.seconds}`.padStart(2, '0');
  }

  switchMode(mode) {
    this.timer.mode = mode;
    this.timer.remaining = {
      total: this.timer[mode] * 60,
      minutes: this.timer[mode],
      seconds: 0,
    };

    this.shadowRoot.querySelectorAll('button[data-mode]').forEach(e => e.classList.remove('active'));
    this.shadowRoot.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    switch (mode) {
      case 'pomodoro':
        this.shadowRoot.host.style.backgroundColor = `rgba(241, 229, 209, 0.1)`;
        break;
      case 'long':
        this.shadowRoot.host.style.backgroundColor = `rgba(241, 229, 209, 0.1)`;
        break;
      case 'short':
        this.shadowRoot.host.style.backgroundColor = `rgba(241, 229, 209, 0.1)`;
        break;
    }

    this.updateClock();
  }
}

customElements.define('pomodoro-timer', PomodoroTimer);


