class ArchitectureDiagrammer {
  constructor() {
    this.canvas = document.getElementById('architecture-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [
      { id: 1, label: 'Frontend App', x: 100, y: 150, width: 140, height: 60, type: 'client' },
      { id: 2, label: 'API Gateway', x: 350, y: 150, width: 140, height: 60, type: 'api' },
      { id: 3, label: 'Database', x: 600, y: 150, width: 140, height: 60, type: 'db' }
    ];
    this.activeNode = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.initEvents();
    this.draw();
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      this.nodes.forEach(node => {
        if (mouseX >= node.x && mouseX <= node.x + node.width &&
            mouseY >= node.y && mouseY <= node.y + node.height) {
          this.activeNode = node;
          this.dragOffsetX = mouseX - node.x;
          this.dragOffsetY = mouseY - node.y;
        }
      });
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.activeNode) {
        const rect = this.canvas.getBoundingClientRect();
        this.activeNode.x = (e.clientX - rect.left) - this.dragOffsetX;
        this.activeNode.y = (e.clientY - rect.top) - this.dragOffsetY;
        this.draw();
      }
    });

    window.addEventListener('mouseup', () => {
      this.activeNode = null;
    });

    document.getElementById('add-node-client').addEventListener('click', () => this.addNode('Client', 'client'));
    document.getElementById('add-node-api').addEventListener('click', () => this.addNode('API Service', 'api'));
    document.getElementById('add-node-db').addEventListener('click', () => this.addNode('Database', 'db'));
    document.getElementById('clear-canvas').addEventListener('click', () => {
      this.nodes = [];
      this.draw();
    });
  }

  addNode(label, type) {
    this.nodes.push({
      id: Date.now(),
      label,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 200,
      width: 140,
      height: 60,
      type
    });
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connecting lines between consecutive nodes
    for (let i = 0; i < this.nodes.length - 1; i++) {
      const start = this.nodes[i];
      const end = this.nodes[i + 1];
      this.ctx.beginPath();
      this.ctx.moveTo(start.x + start.width / 2, start.y + start.height / 2);
      this.ctx.lineTo(end.x + end.width / 2, end.y + end.height / 2);
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    // Draw nodes
    this.nodes.forEach(node => {
      this.ctx.fillStyle = node.type === 'db' ? '#0284c7' : node.type === 'api' ? '#334155' : '#1e293b';
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 2;

      // Rounded rectangle
      this.ctx.fillRect(node.x, node.y, node.width, node.height);
      this.ctx.strokeRect(node.x, node.y, node.width, node.height);

      // Label text
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.font = '14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.label, node.x + node.width / 2, node.y + node.height / 2 + 5);
    });
  }
} 