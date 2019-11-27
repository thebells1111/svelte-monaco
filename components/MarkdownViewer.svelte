<script>
  import "../public/prism.css";
  import * as markdownItAttrs from "markdown-it-attrs";
  const Prism = require('prismjs');

  let md = require("markdown-it")({
    html: true,
    highlight: (str, lang) => {
    if (lang) {
          let langObject = Prism.languages[lang]
        try {
          return (
              `<pre class=" language-${lang}"><code class=" language-${lang}>` + 
              Prism.highlight(str, langObject, lang) + 
              '</code></pre>'
          ) 
        } catch (__) {}
      }
      return `<pre class=" language-${lang}><code class=" language-${lang}>` + md.utils.escapeHtml(str) + "</code></pre>"
    }
  });
  md.use(markdownItAttrs);
  
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
