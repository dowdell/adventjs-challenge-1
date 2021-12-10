class Timer {
  constructor(renderer = () => {}, seconds = 900) {
    this.render = renderer.render;
    this.set(seconds);
  }
  isRunning() {
    return !!this.startTime && !!this.interval;
  }
  toggle() {
    this.isRunning() ? this.reset() : this.start();
  }
  set(seconds) {
    if (seconds > 0) this.desiredSeconds = seconds;
    this.reset();
  }
  start() {
    if (!this.isRunning()) {
      this.startTime = new Date();
      this.interval = setInterval(this.tick, 250);
    }
  }
  reset() {
    this.interval && clearInterval(this.interval);
    delete this.interval;
    delete this.startTime;
    this.tick();
  }
  tick = () => {
    const remain = this.secondsRemaining();
    remain > 0 ? this.render(remain, this.isRunning()) : this.complete();
  };
  secondsRemaining() {
    if (!this.startTime) {
      return this.desiredSeconds;
    }
    const elapsed = (new Date() - this.startTime) / 1000;
    return Math.round(this.desiredSeconds - elapsed);
  }
  complete() {
    console.log("BEEP");
    this.reset();
  }
}

class DOMRenderer {
  constructor(minutesEl, secondsEl, toggleEl) {
    this.m = minutesEl;
    this.s = secondsEl;
    this.t = toggleEl;
  }
  getMinutes(s) {
    return ("" + Math.min(99, Math.floor(s / 60))).padStart(2, "0");
  }
  getSeconds(s) {
    return ("" + (s % 60)).padStart(2, "0");
  }
  render = (secondsRemaining, isRunning) => {
    this.m.value = this.getMinutes(secondsRemaining);
    this.s.value = this.getSeconds(secondsRemaining);
    this.t.innerHTML = isRunning ? "stop" : "start";
  };
}

function registerHandlers(timer, toggle, config) {
  const collectTime = () => {
    while (true) {
      seconds = parseInt(
        prompt("how many seconds? (integer greater than zero)")
      );
      if (seconds > 0) return seconds;
    }
  };

  config.addEventListener("click", (e) => {
    timer.set(collectTime());
  });

  toggle.addEventListener("click", (e) => {
    timer.toggle();
  });
}

toggle = document.getElementsByClassName("start")[0];

registerHandlers(
  new Timer(
    new DOMRenderer(
      document.querySelectorAll(".minutes input")[0],
      document.querySelectorAll(".seconds input")[0],
      toggle
    )
  ),
  toggle,
  document.getElementsByClassName("settings")[0]
);
