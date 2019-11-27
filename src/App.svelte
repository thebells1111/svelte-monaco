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
  let fileName = 'markdown';  
  let activeTab = 'markdown'

  function markdownContentChange(e) {
    markdown = e.detail.value;
    window.localStorage.setItem("markdown", markdown);
    
    Prism.highlightAll()
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
    fileName = window.localStorage.getItem("fileName");
  });

  
</script>

<style>
.container {
  display: flex;
  padding: 1em;
  height: calc(100vh - 3em);  
}

.container-left{
  width: 100%;
  flex-grow: 1;
}

.editor{
  width:100%;
  height:calc(100% - 3em);
  visibility: hidden;
  position:relative;
}

.markdown.editor{
  transform: translateY(-100%);
}

.active{
  visibility: visible;
}

.top-bar{
  border-bottom: 1px solid #ddd;	
  margin-bottom: .25em;
  width: calc(100% - 1em);
}
button{
		display: inline-block;
		margin: 0 0 -1px;
		padding: .5rem;
		font-weight: 600;
		text-align: center;
		color: #bbb;
		border: 1px solid transparent;
    border-bottom: 1px solid #ddd;		
		background: #fff;
		margin-left: .25em;
		cursor: pointer;
		border-radius: 4px 4px 0 0 
	}
	button.active{
		color: #000;
		border: 1px solid #ddd;
		border-bottom: 1px solid #fff;
		background: #fff;
	}
	
	button:hover {
		color: #555;
	}
	
	button.active:hover {
		color: #000;
	}
	
	input{
		margin-bottom:0;
    margin-left: 1em;
	}
  label{
    display:inline-block;
    position: relative;
    float: right;
  }



</style>

<svelte:window on:keydown="{handleKeydown}" />

<svelte:head>
  <style type="text/css" id="styler"></style>
</svelte:head>

<div class="container"> 
  <div class="container-left">
    <div class="top-bar">
      <button class:active="{activeTab === 'style'}" on:click={()=>
        activeTab='style'}>
        style
      </button>
      <button class:active="{activeTab === 'markdown'}"on:click={()=>
        activeTab='markdown'}>
        markdown
      </button>   
      <label>File Name:<input type="text" bind:value={fileName} on:input={e=>window.localStorage.setItem("fileName", fileName)}/></label>
    </div>
      <div class="style editor" class:active="{activeTab === 'style'}">        
        <Editor bind:model={styleModel} {...styleOptions} on:didContentChange={styleContentChange}/>
      </div>
      <div class="markdown editor" class:active="{activeTab === 'markdown'}">        
        <Editor bind:model={markdownModel} {...markdownOptions} on:didContentChange={markdownContentChange}/>
      </div>
  </div>  
 
  <Viewer bind:html {markdown}/>  
</div>

