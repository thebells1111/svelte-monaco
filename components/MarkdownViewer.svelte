<script>
  import "../public/prism.css";
  import * as prism from "markdown-it-prism";
  import * as markdownItAttrs from "markdown-it-attrs";

  const md = require("markdown-it")({ html: true });
  md.use(markdownItAttrs);
  md.use(prism);

  export let markdown;
  export let html;
  $: rendered = md.render(markdown);
  $: if (html !== rendered) {
    html = rendered;
  }
</script>

<style>
  div {
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }
</style>

<div>
  {@html rendered}
</div>
