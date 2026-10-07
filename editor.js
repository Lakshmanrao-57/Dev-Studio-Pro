class CodeEditor {
  constructor() {
    this.files = {
      html: '<h1>Hello DevStudio</h1>\n<p>Edit HTML, CSS, or JS to see changes live!</p>',
      css: 'body {\n  font-family: sans-serif;\n  padding: 20px;\n  color: #333;\n}',
      js: 'console.log("DevStudio System Ready!");'
    };
    this.activeFile = 'html';

    this.textarea = document.getElementById('code-textarea');
    this.lineNumbers = document.getElementById('line-numbers');
    this.iframe = document.getElementById('preview-iframe');
    this.consoleLogs = document.getElementById('console-logs');
    this.filenameDisplay = document.getElementById('active-filename');

    this.initEvents();
    this.loadActiveFile();
    this.runCode();
  }

  initEvents() {
    document.querySelectorAll('.file-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.file-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.saveCurrentState();
        this.activeFile = e.target.dataset.file;
        this.loadActiveFile();
      });
    });

    this.textarea.addEventListener('input', () => {
      this.updateLineNumbers();
      this.updateAnalytics();
    });

    document.getElementById('btn-run').addEventListener('click', () => {
      this.saveCurrentState();
      this.runCode();
    });

    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'CONSOLE_LOG') {
        const entry = document.createElement('div');
        entry.textContent = `> ${e.data.data}`;
        this.consoleLogs.appendChild(entry);
      }
    });
  }

  saveCurrentState() {
    this.files[this.activeFile] = this.textarea.value;
  }

  loadActiveFile() {
    this.textarea.value = this.files[this.activeFile];
    this.filenameDisplay.textContent = `${this.activeFile}.${this.activeFile === 'js' ? 'js' : this.activeFile === 'css' ? 'css' : 'html'}`;
    this.updateLineNumbers();
    this.updateAnalytics();
  }

  updateLineNumbers() {
    const lines = this.textarea.value.split('\n').length;
    this.lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
  }

  updateAnalytics() {
    const metrics = CodeAnalytics.analyze(this.textarea.value);
    document.getElementById('metric-loc').textContent = metrics.loc;
    document.getElementById('metric-funcs').textContent = metrics.functions;
    document.getElementById('metric-complexity').textContent = metrics.complexity;
  }

  runCode() {
    this.consoleLogs.innerHTML = '';
    const src = `
      <!DOCTYPE html>
      <html>
        <head><style>${this.files.css}</style></head>
        <body>
          ${this.files.html}
          <script>
            const _log = console.log;
            console.log = (...args) => {
              _log(...args);
              window.parent.postMessage({ type: 'CONSOLE_LOG', data: args.join(' ') }, '*');
            };
            try { ${this.files.js} } catch(err) { console.log("Error: " + err.message); }
          </script>
        </body>
      </html>
    `;
    this.iframe.srcdoc = src;
  }
} 