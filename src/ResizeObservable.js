class ResizeObservable {
  constructor(_subscribe) {
    this._subscribe = _subscribe;
  }

  subscribe(observer) {
    const safeObserver = new SafeObserver(observer);
    safeObserver._unsubscribe = this._subscribe(safeObserver);
  }
}

class SafeObserver {
  constructor(observer) {
    this.observer = observer;
  }

  next() {
    if (this.observer.next && !this.isUnsubscribed) {
      this.observer.next && this.observer.next();
    }
  }

  error(err) {
    if (!this.isUnsubscribed) {
      if (this.observer.error) {
        this.observer.error(err);
      }
      this.unsubscribe();
    }
  }

  complete() {
    if (!this.isUnsubscribed) {
      if (this.observer.complete) {
        this.observer.complete();
      }
      this.unsubscribe();
    }
  }

  unsubscribe() {
    this.isUnsubscribed = true;
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

const observer = {
  next() {
    console.log("Resized window");
  },
  error(err) {
    console.log("New error:");
    console.log(err);
  },
  complete() {
    console.log("Complete sub");
  }
};

const observable = new ResizeObservable(observer => {
  window.onresize = e => observer.next();
  window.onerror = err => observer.error(err);
  return () => observer.complete();
});

const foo = observable.subscribe(observer);
