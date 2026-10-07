document.addEventListener('DOMContentLoaded', () => {
  // Initialize App Modules
  const editor = new CodeEditor();
  const diagrammer = new ArchitectureDiagrammer();
  const visualizer = new AlgorithmVisualizer();

  // Navigation Tab Switching Logic
  const navButtons = document.querySelectorAll('.nav-btn');
  const moduleViews = document.querySelectorAll('.module-view');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      moduleViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.dataset.target;
      document.getElementById(targetId).classList.add('active');

      if (targetId === 'diagram-module') {
        diagrammer.draw();
      }
    });
  });

  // Export Project JSON
  document.getElementById('btn-export').addEventListener('click', () => {
    const projectData = {
      files: editor.files,
      nodes: diagrammer.nodes,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "devstudio_project.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Save to LocalStorage
  document.getElementById('btn-save').addEventListener('click', () => {
    editor.saveCurrentState();
    const payload = {
      files: editor.files,
      nodes: diagrammer.nodes
    };
    localStorage.setItem('devstudio_saved_project', JSON.stringify(payload));
    alert('Project state successfully saved to localStorage!');
  });
}); 