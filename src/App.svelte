<script>
	import * as monaco from 'monaco-editor'
	import { onMount } from 'svelte'

	let markupEditor = monaco.editor;
	
	let html = ''

	onMount(()=>{
		markupEditor.create(document.getElementById('container'), {
		value: 'console.log("Hello, world")',
		language: "markdown",
		wordWrap: 'wordWrapColumn',
		wordWrapColumn: 80,	
		wordWrapMinified: true,
		wrappingIndent: "indent",
		lineNumbers: "off",
		scrollBeyondLastLine: false,
		});
	})

	function markup(e){
		html = markupEditor.getModels()[0].getValue();
	}

</script>

<style>
	
</style>

<div style="height:95%; display: flex">
<div id="container" style="height:95%; width: 45%" on:keyup={markup}></div>
<div style="height:95%; width: 45%">{@html html}</div>
</div>