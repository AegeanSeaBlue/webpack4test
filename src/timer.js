class SetTimer {
  timeList = [];
  frequency = null;
  timer = null;

  constructor(list, freq) {
    this.update(list, true, freq);
  }

  dispatchTimer() {
    this.timer = setInterval(() => {
      this.timeList.forEach((item, index) => {
        let now = Date.now();
        if (Date.now() - item.recordTime >= item.interval) {
          item.recordTime = now;
          Promise.resolve().then(() => {
            if (typeof item.handle === 'function') {
              item.handle({...item}, index);
            }
          });
        }
      });
    }, this.frequency || 1000);
  }

  dispatchInterval() {
    if (!this.frequency) return false;
    this.timer = setInterval(() => {
      this.timeList.forEach((item, index) => {
        Promise.resolve().then(() => {
          if (typeof item.handle === 'function') {
            item.handle({...item}, index);
          }
        });
      });
    }, this.frequency);
  }

  clear() {
    this.timeList = [];
    clearInterval(this.timer);
  }

  setTimer() {
    clearInterval(this.timer);
    if (!(this.timeList instanceof Array) || this.timeList.length < 1) return false;
    this.timeList = this.timeList.filter(item => item.interval > 100);
    if (this.timeList.length < 1) return false;

    if (this.timeList.length > 1) {
      let first = this.timeList[0];
      let refreshAll = this.timeList.every(elem => {
        elem.recordTime = Date.now();
        return elem.interval === first.interval;
      });
      if (refreshAll) {
        this.frequency = first.interval;
        this.dispatchInterval();
      } else {
        this.dispatchTimer();
      }
    } else {
      this.dispatchTimer();
    }
  }

  update(list, refreshTimer, freq) {
    if (typeof freq === 'number' && freq > 1000) {
      this.frequency = freq;
    }
    if (list instanceof Array) {
      let len = this.timeList.length;
      this.timeList = this.timeList.concat(list);
      if (len < 2 && this.timeList.length > len) {
        this.setTimer();
      }
    }
    console.log('update', this.timeList, refreshTimer);
    if (refreshTimer) {
      this.clear();
      this.setTimer();
    }
  }
}

export {SetTimer};
