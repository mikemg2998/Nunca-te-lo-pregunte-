# Nunca te lo pregunté

Juego de cartas para dos personas que llevan años juntas y creen que ya se lo han preguntado todo.
Web estática instalable en el móvil (Añadir a pantalla de inicio).

- `index.html`, `styles.css`: interfaz.
- `js/cards.js`: banco de cartas con metadatos (mecánica, categoría/territorio, rareza, profundidad 1–5, energía, intimidad, familia semántica, marco temporal, etiquetas).
- `fonts/`: General Sans (variable), única familia tipográfica de la interfaz.
- `js/director.js`: director de partida, un DJ de conversaciones (pesos por mezcla, enfriamientos, familias semánticas, ritmo de profundidad/energía/tiempo, intimidad configurable).
- `js/app.js`: pantallas, flujos de cada mecánica, reglas Caos, favoritas e historial (localStorage).
- `tests/simulate.js`: `node tests/simulate.js 100` simula 100 partidas por modo y debe terminar en «✓ Todo correcto».
- `tools/build-artifact.js`: genera una versión en un solo archivo en `dist/`.

Modo desarrollo: añade `#dev` a la URL para forzar una mecánica concreta.
