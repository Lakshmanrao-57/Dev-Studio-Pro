class AlgorithmVisualizer {
  constructor() {
    this.container = document.getElementById('bars-container');
    this.array = [];
    this.isSorting = false;

    this.initEvents();
    this.generateArray();
  }

  initEvents() {
    document.getElementById('btn-generate-array').addEventListener('click', () => this.generateArray());
    document.getElementById('btn-start-sort').addEventListener('click', () => this.startSorting());
  }

  generateArray() {
    if (this.isSorting) return;
    this.array = Array.from({ length: 25 }, () => Math.floor(Math.random() * 80) + 10);
    this.render();
  }

  render(comparingIndices = [], sortedIndices = []) {
    this.container.innerHTML = '';
    this.array.forEach((val, idx) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${val * 4}px`;
      if (comparingIndices.includes(idx)) bar.classList.add('comparing');
      if (sortedIndices.includes(idx)) bar.classList.add('sorted');
      this.container.appendChild(bar);
    });
  }

  async startSorting() {
    if (this.isSorting) return;
    this.isSorting = true;
    const algo = document.getElementById('algo-select').value;
    
    if (algo === 'bubble') {
      await this.bubbleSort();
    } else {
      await this.insertionSort();
    }
    
    this.isSorting = false;
  }

  sleep() {
    const ms = 510 - document.getElementById('algo-speed').value;
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async bubbleSort() {
    const len = this.array.length;
    let sorted = [];
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        this.render([j, j + 1], sorted);
        await this.sleep();
        if (this.array[j] > this.array[j + 1]) {
          [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
        }
      }
      sorted.push(len - i - 1);
    }
    this.render([], Array.from({ length: len }, (_, i) => i));
  }

  async insertionSort() {
    const len = this.array.length;
    for (let i = 1; i < len; i++) {
      let key = this.array[i];
      let j = i - 1;
      while (j >= 0 && this.array[j] > key) {
        this.array[j + 1] = this.array[j];
        j = j - 1;
        this.render([j, j + 1]);
        await this.sleep();
      }
      this.array[j + 1] = key;
    }
    this.render([], Array.from({ length: len }, (_, i) => i));
  }
} 