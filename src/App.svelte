<script>
  import { onMount } from "svelte";
  import * as monaco from "monaco-editor";
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
      lineNumbers: "off",
      scrollBeyondLastLine: false
    });

    monaco.editor.create(document.getElementById("style-editor"), {
      model: styleModel,
      wordWrap: "wordWrapColumn",
      wordWrapColumn: 60,
      wordWrapMinified: true,
      wrappingIndent: "indent",
      lineNumbers: "off",
      scrollBeyondLastLine: false
    });
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
