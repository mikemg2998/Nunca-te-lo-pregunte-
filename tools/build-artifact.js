// Genera una sola página (sin <html>/<head>) para publicarla como Artifact. Las fuentes van incrustadas en base64.
const fs = require('fs'), path = require('path');
const R = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const B64 = p => 'data:font/woff2;base64,' + fs.readFileSync(path.join(__dirname, '..', p)).toString('base64');
const css = R('styles.css')
  .replace('url(fonts/GeneralSans-Variable.woff2)', `url(${B64('fonts/GeneralSans-Variable.woff2')})`)
  .replace('url(fonts/GeneralSans-VariableItalic.woff2)', `url(${B64('fonts/GeneralSans-VariableItalic.woff2')})`);
const out = `<title>Let’s Talk</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="theme-color" content="#0a0908">
<style>
${css}
</style>
<div class="splash" id="splash" aria-hidden="true"><span class="mark"><i class="halo"></i><svg class="key" viewBox="0 0 512 512" aria-hidden="true"><path d="M215 247.6 188 384h136l-27-136.4A74 74 0 1 0 215 247.6Z"/></svg></span><b>Let’s Talk</b></div>
<main class="app" id="app"></main>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script>
${R('js/cards.js')}
</script>
<script>
${R('js/director.js')}
</script>
<script>
${R('js/app.js')}
</script>
`;
fs.mkdirSync(path.join(__dirname, '..', 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'nunca-te-lo-pregunte.html'), out);
console.log('dist/nunca-te-lo-pregunte.html', out.length, 'bytes');
