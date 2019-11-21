<script>
  import { onMount } from "svelte";
  import * as monaco from "monaco-editor";

  self.MonacoEnvironment = {
    getWorkerUrl: function(moduleId, label) {
      if (label === "json") {
        return "./json.worker.bundle.js";
      }
      if (label === "css") {
        return "./css.worker.bundle.js";
      }
      if (label === "html") {
        return "./html.worker.bundle.js";
      }
      if (label === "typescript" || label === "javascript") {
        return "./ts.worker.bundle.js";
      }
      return "./editor.worker.bundle.js";
    }
  };

  import "../public/prism.css";
  const prism = require("markdown-it-prism");
  const markdownItAttrs = require("markdown-it-attrs");
  const md = require("markdown-it")({
    html: true // Enable HTML tags in source
  });

  md.use(markdownItAttrs, {
    // optional, these are default options
    leftDelimiter: "{",
    rightDelimiter: "}",
    allowedAttributes: [] // empty array = all attributes are allowed
  });
  md.use(prism);

  let html = "";
  let fileName = "markdown";

  const markdownModel = monaco.editor.createModel("", "markdown");
  const styleModel = monaco.editor.createModel("", "css");
  const markdownValue = () => markdownModel.getValue();
  const styleValue = () => styleModel.getValue();

  markdownModel.updateOptions({ tabSize: 2 });
  styleModel.updateOptions({ tabSize: 2 });

  markdownModel.onDidChangeContent(e => {
    let mdv = markdownValue();
    html = md.render(mdv);
    window.localStorage.setItem("markdown", mdv);
  });

  styleModel.onDidChangeContent(e => {
    let css = styleValue();
    let styler = document.getElementById("styler");
    styler.innerText = css;
    window.localStorage.setItem("css", css);
  });

  onMount(() => {
    markdownModel.setValue(window.localStorage.getItem("markdown"));
    styleModel.setValue(window.localStorage.getItem("css"));

    monaco.editor.create(document.getElementById("markdown-editor"), {
      model: markdownModel,
      wordWrap: "wordWrapColumn",
      wordWrapColumn: 60,
      wordWrapMinified: true,
      wrappingIndent: "indent",
      lineNumbers: "off"
    });

    monaco.editor.create(document.getElementById("style-editor"), {
      model: styleModel,
      wordWrap: "wordWrapColumn",
      wordWrapColumn: 60,
      wordWrapMinified: true,
      wrappingIndent: "indent",
      lineNumbers: "off"
    });

    document.addEventListener(
      "keydown",
      function(e) {
        if ( window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
          if (e.keyCode === 83) {
            e.preventDefault();

            const data = JSON.stringify({
              markdown: markdownValue(),            
              css: styleValue()
            });   
            
            fileName = prompt("Save File As", fileName);
            const blob = new Blob([data], {type : 'application/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", fileName + ".json");
            const event = document.createEvent("MouseEvents");
            event.initMouseEvent("click");
            link.dispatchEvent(event);                       
          } else if(e.keyCode === 72){
              e.preventDefault();

             const data = `
             {
               markdown: 
                \`${html}\`,            
              css: 
                \`${styleValue()}\`
            }
            `;   
            
            fileName = prompt("Save File As", fileName);
            const blob = new Blob([data], {type : 'text/plain'});
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
              input.addEventListener('change', readFile);
              const event = document.createEvent("MouseEvents");
              event.initMouseEvent("click");
              input.dispatchEvent(event);
             

              function readFile(evt) {    
                evt.preventDefault()
                const f = evt.target.files[0] 
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
      }
    );
  });
</script>

<style>
  #editor {
    display: flex;
    padding: 1em;
    height: calc(100vh - 3em);
  }
  #editor > div {
    width: 100%;
    flex-grow: 1;
  }
  #markdown-editor,
  #style-editor {
    border-right: 1px solid #000;
  }

  #viewer {
    overflow-y: auto;
  }
</style>

<svelte:head>
  <style type="text/css" id="styler"></style>
</svelte:head>

<div id="editor">
  <div id="style-editor"></div>
  <div id="markdown-editor"></div>
  <div id="viewer">
    {@html html}
  </div>
</div>
