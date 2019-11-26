function saveLoad(e, html, markdownModel, styleModel, fileName) {
  if (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
    if (e.keyCode === 83) {
      e.preventDefault();

      const data = JSON.stringify({
        markdown: markdownModel.getValue(),
        css: styleModel.getValue()
      });
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", fileName + ".json");
      const event = document.createEvent("MouseEvents");
      event.initMouseEvent("click");
      link.dispatchEvent(event);
    } else if (e.keyCode === 72) {
      e.preventDefault();

      const data = `
        {
          html: 
          \`${html}\`,            
        css: 
          \`${styleModel.getValue()}\`
        }
      `;

      const blob = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", fileName + ".txt");
      const event = document.createEvent("MouseEvents");
      event.initMouseEvent("click");
      link.dispatchEvent(event);
    } else if (e.keyCode === 76) {
      e.preventDefault();
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.addEventListener("change", readFile);
      const event = document.createEvent("MouseEvents");
      event.initMouseEvent("click");
      input.dispatchEvent(event);

      function readFile(evt) {
        evt.preventDefault();
        const f = evt.target.files[0];
        if (f) {
          var r = new FileReader();
          r.onload = function(e) {
            const contents = JSON.parse(e.target.result);
            markdownModel.setValue(contents.markdown);
            styleModel.setValue(contents.css);
          };
          r.readAsText(f);
        } else {
          alert("Failed to load file");
        }
      }
    }
  }
  return fileName;
}

export { saveLoad };
