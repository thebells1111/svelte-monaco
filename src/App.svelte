<script>
  import Editor from "./MonacoEditor.svelte";

  let html=''

  function markdownContentChange(e) {
    html = e.detail.value;
  }

  function styleContentChange(e) {
    console.log(e.detail.value);
  }

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
  console.log(styleOptions)
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

<div id="editor">  
  <Editor {...styleOptions} on:didContentChange={styleContentChange}/>
  <Editor {...markdownOptions} on:didContentChange={markdownContentChange}/>
  <div id="viewer">
    {@html html}
  </div>
</div>

