<script>
  import { onMount } from "svelte";
  import { saveLoad }from "../util/saveLoad";
  import Editor from "../components/MonacoEditor.svelte";
  import Viewer from "../components/MarkdownViewer.svelte";
  import { markdownOptions, styleOptions } from "../util/editorOptions"
 
  let markdown='';
  let html ='';
  let markdownModel;
  let styleModel;  
  let fileName = "markdown";  
  let activeTab = 'markdown'

  function markdownContentChange(e) {
    markdown = e.detail.value;
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

#editor>div{
  width: 100%;
  flex-grow: 1;
}

</style>

<svelte:window on:keydown="{handleKeydown}" />

<svelte:head>
  <style type="text/css" id="styler"></style>
</svelte:head>

<div id="editor"> 
  <div>
      <label>
        <input type=radio bind:group={activeTab} value={'style'}>
        Style
      </label>
      <label>
        <input type=radio bind:group={activeTab} value={'markdown'}>
        Markdown
      </label>
      <Editor name={'style'} {activeTab} bind:model={styleModel} {...styleOptions} on:didContentChange={styleContentChange}/>
      
      <Editor name={'markdown'} {activeTab} bind:model={markdownModel} {...markdownOptions} on:didContentChange={markdownContentChange}/>
     
  </div>  
 
  <Viewer bind:html {markdown}/>  
</div>

