<script>
  import { onMount } from "svelte";
  import { saveLoad }from "../util/saveLoad";
  import Editor from "../components/MonacoEditor.svelte";
  import "../public/prism.css";
  import * as prism from "markdown-it-prism";
  import * as markdownItAttrs from "markdown-it-attrs";
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

  let html=''
  let markdownModel;
  let styleModel;  
  let fileName = "markdown";

  const markdownOptions = {
    language: "markdown",
    textModelOptions: { tabSize: 2 },
    editorOptions: {
      wordWrap: "wordWrapColumn",
      wordWrapColumn: 60,
      wordWrapMinified: true,
      wrappingIndent: "indent"
    }
  };

  const styleOptions = {...markdownOptions}
  styleOptions.language = 'css'

  function markdownContentChange(e) {
    let markdown = e.detail.value;
    html = md.render(markdown);
    window.localStorage.setItem("markdown", markdown);
  }

  function styleContentChange(e) {
    let css = e.detail.value;
    let styler = document.getElementById("styler");
    styler.innerText = css;
    window.localStorage.setItem("css", css);
  }

  function handleKeydown(e) {
    fileName = saveLoad(e, html, markdownModel, styleModel, fileName) || fileName;    
  }

  onMount(() => {
    markdownModel.setValue(window.localStorage.getItem("markdown"));
    styleModel.setValue(window.localStorage.getItem("css"));
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

#viewer {
  overflow-y: auto;
}
</style>

<svelte:window on:keydown|preventDefault="{handleKeydown}" />

<svelte:head>
  <style type="text/css" id="styler"></style>
</svelte:head>

<div id="editor">  
  <Editor bind:model={styleModel} {...styleOptions} on:didContentChange={styleContentChange}/>
  <Editor bind:model={markdownModel} {...markdownOptions} on:didContentChange={markdownContentChange}/>
  <div id="viewer">
    {@html html}
  </div>
</div>

