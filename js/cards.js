/* Banco de cartas de «Nunca te lo pregunté».
 *
 * Formato compacto, una carta por línea:
 *   libre / rapida / predice / alavez:   rareza profundidad energía intimidad etiquetas | texto
 *   juicio:                               rareza profundidad energía intimidad etiquetas | pregunta | postura A | postura B
 *   caos:                                 duración afecta | nombre | regla
 * rareza 1–5 (1 reconocible y real … 5 escenario muy construido)
 * profundidad 1–5 (1 ligera · 2 curiosa · 3 personal · 4 profunda · 5 íntima/vulnerable)
 * energía 1–3 (1 tranquila · 2 normal · 3 rápida/juguetona) · intimidad 0–3 (0 ninguna … 3 fantasías)
 * etiquetas separadas por comas; tokens especiales: f:familia-semantica  t:past|now|future|hyp  em:emocion  to:yo|tu|nos
 * Profundidad, intimidad y energía no son lo mismo: una carta puede ser profunda y tranquila, personal y divertida, ligera y caótica.
 * *palabras* entre asteriscos = único acento dorado de la carta (usar muy poco).
 * Perspectiva: en LIBRE, «yo» es quien lee la carta en voz alta y «tú» quien escucha.
 * En PREDICE, la carta habla a quien responde. En A LA VEZ, a los dos.
 * Juicio: rareza 1–2 = situación real y reconocible; 3–5 = absurdo deliberado.
 */
(function (root) {
const CATS = {
  obs: 'Cuánto me conoces',
  cdb: 'Cuánto me conoces',
  pre: 'Predice',
  hip: 'Hipotético',
  mini: 'Mini mundos',
  exis: 'Existenciales',
  esp: 'Situaciones concretas',
  lore: 'Lore de la pareja',
  pref: 'Qué prefieres',
  teo: 'Teorías innecesarias',
  comp: 'Completa la frase',
  rank: 'Ranking',
  acus: 'Acusación',
  tit: 'Titular',
  expl: 'Explica',
  ctx: 'Nosotros, de verdad',
  rap: 'Sin pensar',
  vez: 'A la vez',
  jui: 'Juicio',
  caos: 'Caos',
  antes: 'Antes de mí',
  cotid: 'Cotidiano',
  intim: 'Intimidad',
};
/* Territorios temáticos (metadatos del catálogo, no tipos elegibles): cada categoría pertenece a uno. */
const TERRITORY = {
  antes: 'pasado', cotid: 'cotidiano', intim: 'intimidad', obs: 'conoces', cdb: 'conoces', pre: 'conoces',
  exis: 'existencial', lore: 'nosotros', ctx: 'nosotros', vez: 'nosotros', pref: 'dilema', jui: 'opinion',
  hip: 'absurdo', mini: 'absurdo', esp: 'absurdo', teo: 'absurdo', rank: 'absurdo', acus: 'absurdo', tit: 'absurdo', expl: 'absurdo', comp: 'juego', rap: 'juego', caos: 'caos',
};

const SRC = String.raw`
## libre obs
1 1 2 0 salir | ¿Qué hago exactamente en los cinco minutos antes de decir que ya podemos salir?
1 1 2 0 humor | ¿Cómo sabes que estoy de mal humor aunque diga que no pasa nada?
1 1 2 0 compras | ¿Qué compro una y otra vez creyendo que esta vez sí lo voy a usar?
2 1 2 0 frases | ¿Qué frase mía podrías doblar perfectamente, entonación incluida? Demuéstralo.
2 1 2 0 sonidos | ¿Qué *sonido* hago que reconocerías entre cien personas?
1 1 2 0 objetos | ¿Qué objeto pierdo con una frecuencia estadísticamente preocupante?
2 1 2 0 frases | ¿Qué hago justo antes de decir algo que sé que no te va a gustar?
2 1 2 0 musica | ¿Qué canción canto mal siempre exactamente en la misma parte?
2 1 2 0 comida | ¿Qué comida podrías reconocer que estoy comiendo solo por mi cara?
2 1 2 0 frases | ¿Cuál es la frase que repito tanto que, si yo fuera un personaje de videojuego, la diría cada vez que pasas por mi lado?
2 1 2 0 casa | Imítame entrando en casa después de un día horrible. Tres cosas, en orden.
2 1 2 0 sueño | ¿Qué hago al dormir que yo no sé que hago?
1 1 2 0 manias | ¿Qué ordeno con muchísimo cuidado mientras todo lo demás está en caos?
2 1 2 0 restaurantes | ¿Qué hago siempre en los restaurantes que podrías predecir antes de sentarnos?
2 1 2 0 supermercado | ¿Qué pasillo del supermercado me cambia el humor?
2 1 2 0 viajes | ¿Qué hago siempre en un aeropuerto, en el mismo orden, aunque vayamos tarde?
2 1 2 0 mañanas | ¿Qué es lo primero que digo por las mañanas con más frecuencia de lo razonable?
3 1 2 0 manias | ¿Qué cosa sabes que me va a molestar antes incluso de que ocurra?
2 1 2 0 social | En una fiesta donde no conozco a nadie, ¿con quién o con qué acabo hablando?
2 3 2 0 cambios | ¿Qué cosa mía te parecía rarísima al principio y ahora te parece de lo más normal?
2 1 2 0 tecnologia | ¿Con qué aparato de casa tengo una relación claramente tóxica?
2 1 2 0 salud | ¿Cómo soy cuando estoy enfermo, de verdad? Sin diplomacia.
3 1 2 0 objetos | ¿Qué objeto de esta casa he defendido con argumentos que no usaría ni un abogado?
2 1 2 0 familia | ¿Qué cambia en mí cuando hablo con mi familia, aunque yo crea que no se nota? Imítalo.
2 1 2 0 voz | ¿Qué tono pongo cuando quiero que hagas algo pero que parezca idea tuya?
2 1 2 0 coche | ¿Qué digo siempre en el coche cuando alguien conduce peor que yo?
2 1 2 0 compras | ¿Qué hago en una tienda cuando el dependiente me pregunta si necesito ayuda?
3 1 2 0 casa | ¿Dónde dejo las cosas cuando digo «lo he dejado en su sitio»?
2 1 2 0 sueño | ¿Cuál es mi postura oficial para dormir y cuál la que acabo adoptando a las 4 de la mañana?
2 1 2 0 comida | ¿Qué comida defiendo como si fuera parte de mi identidad?
2 1 2 0 social | ¿Cuál es mi frase para irme de una fiesta sin que parezca que me quiero ir?
3 1 2 0 viajes | ¿Qué llevo siempre en la maleta «por si acaso» y nunca uso?
2 3 2 0 cambios | ¿Qué hago ahora que hace diez años habría jurado que nunca haría?
3 1 2 0 tecnologia | ¿Cómo explico yo un problema técnico cuando llamo al servicio de atención al cliente?
2 1 2 0 frases | ¿Qué palabra uso para todo cuando no me sale la palabra correcta?
3 1 2 0 casa | ¿Cuál es mi forma de «ayudar» en la cocina que en realidad no ayuda?
2 1 2 0 mañanas | ¿Qué hago en los primeros diez minutos después de despertarme que nadie más hace igual?
3 1 2 0 manias | Si tuvieras que redactar mis *instrucciones de uso*, ¿cuál sería la advertencia en letra pequeña?
3 1 2 0 cine | ¿En qué minuto de una película empiezo a preguntar quién es cada personaje?
2 1 2 0 llamadas | ¿Cómo me cambia la voz cuando me llama alguien del trabajo? Imítala.
3 1 2 0 regalos | ¿Cómo abro un regalo que no me gusta? Describe la cara, paso a paso.
2 1 2 0 fotos | ¿Qué pose repito en todas las fotos desde hace años sin darme cuenta?
2 1 2 0 comida | ¿Qué parte del plato me dejo siempre para el final, y qué pasa si alguien la toca?
3 1 2 0 sueño | ¿Cuál es la señal exacta de que me he dormido en el sofá aunque yo diga que estoy escuchando?
3 1 2 0 coche | Cuando me pierdo conduciendo, ¿qué digo, qué hago y a quién culpo? En ese orden.
2 1 2 0 dinero | ¿Qué cosa cara me parece razonable y qué cosa barata me parece un atraco?
3 1 2 0 cocina | ¿Qué ingrediente echo de más siempre, y a qué plato ya le has cogido cariño así?
2 1 2 0 ropa | ¿Qué prenda mía te gustaría que desapareciera en una mudanza, y cuál fingirías no encontrar?
3 1 2 0 humor | ¿Con qué tipo de chiste me río aunque no quiera, y cuál finjo que no me hace gracia?

## libre hip
3 3 3 0 casa | Un fantasma muy educado se muda a casa y solo pone una condición para no molestar. Viendo cómo vivimos, ¿qué pide?
4 1 3 0 casa | Nuestra casa tiene un *libro de reclamaciones* escrito por todos los que han vivido aquí. ¿Qué queja escribiría la casa sobre nosotros?
3 4 3 0 memoria | Una empresa te ofrece 50.000 euros por un recuerdo concreto. Te lo borran, pero eliges tú cuál. ¿Vendes alguno?
3 1 3 0 tiempo | Te regalan una máquina del tiempo que solo retrocede cuatro minutos y funciona una vez al día. ¿Para qué la usas un martes cualquiera?
4 1 3 0 casa | Los muebles de esta casa votan para echar a uno de los dos. ¿Quién sale y qué mueble hizo campaña en su contra?
4 3 3 0 tiempo | Hay una versión de ti que vive tu misma vida con un día de retraso. ¿Qué día de este año le avisarías?
3 1 3 0 dinero | Te dan 10.000 euros que solo puedes gastar en cosas que cuesten menos de dos euros. ¿Cuál es el plan?
3 1 3 0 vecinos | Te ofrecen una casa enorme gratis. El vecino de al lado es la persona que más te irritaba en el colegio. ¿Aceptas?
4 1 3 0 voz | Cada vez que entras en una habitación, un narrador invisible dice una frase sobre ti. ¿Qué frase ha dicho hoy?
4 1 3 0 objetos | Todo lo que has perdido en tu vida está en un almacén y puedes recuperar tres cosas. ¿Cuáles?
4 4 3 0 infancia | Encuentras una carta que escribiste a los 12 años para tu yo de ahora. ¿Qué te pedía que no has cumplido?
3 3 3 0 casa | Esta casa puede recordar perfectamente un solo día de todos los que hemos vivido en ella. ¿Cuál elegiría?
3 1 3 0 trabajo | Escribe tres mensajes de galleta de la fortuna pensados solo para mí, *ligeramente inquietantes* porque me conoces.
3 1 3 0 trabajo | Si tuvieras que ponerle nombre, como a los colores de pintura, ¿cómo se llamaría el color de nuestro sofá? ¿Y el de nuestros domingos?
3 1 3 0 trabajo | Te contratan para inventar una fiesta nacional nueva. ¿Qué se celebra y cómo?
3 3 3 0 tiempo | Puedes regalar una hora de tu tiempo libre a tu yo de hace diez años. ¿Qué haría con ella?
4 1 3 0 dobles | Mañana aparece un duplicado tuyo y hay que repartirse la semana. ¿Qué días te quedas y cuáles le cedes sin pensarlo?
3 3 3 0 vecinos | El vecino nuevo resulta ser tu yo de dentro de veinte años, que ha venido a vivir tranquilo. ¿Qué le preguntas en la escalera?
3 3 3 0 regalos | Cada regalo que haces le dice a quien lo recibe cuánto tardaste en elegirlo. ¿Qué regalo pasado te daría más vergüenza?
3 1 3 0 dinero | Cobras un sueldo mensual, pero solo por tareas que nadie te ha pedido. ¿Cuál es tu primera factura?
4 1 3 0 tiempo | Un día cualquiera de tu vida se repite cada año, el mismo día, sin cambios. Eliges cuál. ¿Cuál escoges para no cansarte nunca?
3 1 3 0 restaurantes | Abres un restaurante que solo sirve un plato y solo abre un día al año. ¿Qué plato y qué día?
3 1 3 0 familia | Te nombran cronista oficial de la familia y la última reunión hay que contarla como una crónica deportiva. ¿Quién marcó el gol?
4 1 3 0 ciudad | En tu ciudad aparece una calle nueva que solo tú ves. ¿Qué hay en ella y a quién llevarías primero?
3 3 3 0 recuerdos | Puedes meter un recuerdo tuyo en una botella para que lo encuentre un desconocido dentro de cien años. ¿Cuál mandas?

## libre mini
3 1 3 0 social | Cada vez que alguien te da las gracias, sube un marcador visible sobre tu cabeza. ¿Quién de nuestro entorno tendría el número más alto?
4 1 3 0 vecinos | En este mundo, cualquier discusión de pareja se resuelve ante un jurado de tres vecinos. ¿Qué discusión nuestra ganaría yo por goleada?
3 3 3 0 trabajo | La gente se jubila a los 20 y empieza a trabajar a los 65. ¿Cómo habrías pasado tus años de jubilación?
4 1 3 0 ropa | La ropa cambia de color según tu humor real. ¿Qué prenda tuya pasaría más tiempo en color «no me hables»?
4 3 3 0 tiempo | Cada persona nace con un número fijo de horas de paciencia. ¿Cuántas crees que has gastado ya, y en qué?
3 1 3 0 trabajo | Todo el mundo recibe a los 30 años un título oficial según lo que mejor hace. ¿Cuál te dieron a ti? ¿Y a mí?
4 1 3 0 frases | Desaparecen todos los idiomas menos uno que inventamos nosotros dos. ¿Cuáles son sus cinco primeras palabras?
3 1 3 0 casa | Cada vez que terminas una tarea aburrida, alguien te aplaude desde algún sitio. ¿Qué tarea harías mucho más a menudo?
4 1 3 0 animales | Cada familia tiene un animal oficial que la representa en los actos públicos. ¿Cuál sería el nuestro?
4 3 3 0 recuerdos | Las personas guardan sus recuerdos en tarros y pueden prestarlos. ¿Qué recuerdo tuyo me prestarías?
3 1 3 0 trabajo | Todo el mundo cambia de profesión cada cinco años por sorteo. ¿Qué te ha tocado ya y qué te tocaría ahora?
4 3 3 0 tiempo | Los años duran lo que tú decidas, pero hay que decidirlo el 1 de enero. ¿Cuánto durará el que viene?
4 1 3 0 casa | Las casas se mueven un metro cada noche hacia el sitio donde más felices fueron sus habitantes. ¿Hacia dónde va la nuestra?
4 1 3 0 sueño | Una vez al mes puedes elegir en qué cama del mundo despertarte. ¿Dónde amaneces la próxima?

## libre exis
1 3 1 0 decisiones | ¿Qué decisión pequeñísima de hace años te cambió la vida más que muchas decisiones grandes?
2 3 1 0 gente | Si tu vida tuviera créditos finales, ¿qué persona inesperada saldría con un agradecimiento especial?
2 3 1 0 infancia | ¿En qué eres hoy exactamente igual que a los ocho años, sin ninguna mejora?
2 3 1 0 casa | ¿Qué versión de ti aparece solo cuando no hay nadie más en casa?
2 4 1 0 gente | ¿A quién crees que viste por última vez sin saber que era la última?
3 3 1 0 fotos | ¿En cuántas fotos de desconocidos sales de fondo, y en cuál te gustaría aparecer?
1 3 1 0 infancia | ¿Qué sigues haciendo exactamente como te lo enseñaron de pequeño, sin preguntarte si tiene sentido?
2 3 1 0 opiniones | ¿Qué opinión defiendes con una intensidad desproporcionada para lo poco que importa?
3 4 1 0 gente | ¿Qué recuerda de ti alguien a quien tú ya has olvidado por completo?
2 4 1 0 gente | Si todas las personas que has conocido votaran tu rasgo más reconocible, ¿qué ganaría? ¿Y qué te gustaría que ganara?
3 3 1 0 estadisticas | Si pudieras saber una *estadística inútil* sobre tu vida, ¿cuál elegirías?
2 4 1 0 cambios | Tu yo de hace diez años se lleva un susto al verte hoy. ¿Por qué detalle pequeño?
3 3 1 0 futuro | ¿Qué cosa normalísima de hoy parecerá incomprensible dentro de 300 años?
2 4 1 0 gente | ¿Qué persona fue importante en tu vida solo durante un verano y aun así te cambió algo?
3 3 1 0 cambios | ¿Qué sabías hacer perfectamente hace quince años y has olvidado del todo?
2 4 1 0 identidad | ¿Qué parte de tu personalidad elegiste a propósito y cuál simplemente te pasó?
3 3 1 0 gente | Si los desconocidos con los que has compartido ascensor pudieran dejarte una reseña, ¿cuántas estrellas tendrías y qué diría la peor?
2 4 1 0 cambios | ¿Qué cosa nuestra de hace diez años te parecería hoy de otra pareja?
2 4 1 0 infancia | Si pudieras pasear diez minutos por la casa en la que creciste, tal como era, ¿a qué habitación irías primero?
3 3 1 0 manias | ¿Qué manía tuya heredarán sin querer las personas que pasan tiempo contigo?
2 3 1 0 infancia | ¿Qué te daba miedo en la infancia y ahora te parece encantador?
3 3 1 0 talentos | ¿Qué talento tienes que no le sirve a nadie, pero que te enorgullece en secreto?
3 4 1 0 nosotros | ¿Cuántas veces crees que estuvimos a punto de conocernos antes de conocernos de verdad?
2 4 1 0 identidad | ¿Qué te gustaría que contara de ti alguien que solo te conoció un día?
3 3 1 0 tiempo | Si pudieras saber cuántas horas de tu vida has pasado haciendo una sola cosa, ¿qué número te daría miedo consultar?
2 4 1 0 identidad | ¿Qué opinión tuya ha cambiado por completo sin que te dieras cuenta de cuándo?
3 3 1 0 futuro | ¿Qué costumbre tuya de ahora crees que te dará vergüenza ajena dentro de veinte años?
2 4 1 0 nosotros | ¿Qué cosa aprendiste de mí sin que yo intentara enseñártela?
2 3 1 0 casualidades | ¿Qué casualidad pequeña de tu vida te sigue pareciendo rara cuando la piensas?
3 3 1 0 gente | ¿Qué persona te ha hecho un favor enorme sin saberlo nunca?
2 4 1 0 decisiones | ¿Qué decisión tomaste por cansancio y resultó ser de las mejores?
3 3 1 0 objetos | ¿Qué objeto tuyo lleva más años contigo que yo, y por qué sigue aquí?
2 3 1 0 habitos | ¿Qué cosa haces todavía solo porque alguien te dijo una vez que lo hacías bien?
3 4 1 0 futuro | ¿Qué quieres que siga exactamente igual dentro de veinte años, por pequeño que sea?
2 3 1 0 lugares | ¿Qué sitio recuerdas con una nitidez absurda sin haber pasado allí más de una hora?
3 3 1 0 talentos | ¿En qué eres el mejor de todas las personas que conoces, aunque nadie lo diga nunca?
2 4 1 0 gente | ¿A quién le debes una conversación que llevas años posponiendo?
3 3 1 0 nombres | ¿Cuántos nombres o apodos distintos te han puesto en tu vida, y cuál era el que mejor te quedaba?
2 3 1 0 tiempo | ¿Qué hora del día te sienta mejor como persona, y cuál te sienta peor?
3 4 1 0 nosotros | ¿Qué cosa buena de ti crees que solo he visto yo?

## libre esp
4 1 3 0 bodas | Te toca dar el discurso en la boda de alguien que apenas conoces porque el padrino se ha quedado en un ascensor. Tienes 90 segundos. Empieza.
3 1 3 0 peluqueria | Se va la luz en todo el país cuando llevas media cabeza cortada en la peluquería. ¿Cuál es tu plan para las próximas 48 horas?
3 1 3 0 vecinos | Llevas tres semanas saludando a un vecino por un nombre equivocado. Hoy su pareja lo llama por su nombre real delante de ti. ¿Qué haces?
4 1 3 0 trabajo | Te quedas 40 minutos en un ascensor averiado con tu jefe de hace diez años y una tarta de cumpleaños que no es de nadie. ¿Cómo pasáis el rato?
4 1 3 0 ropa | Llegas a una cena y todos los invitados llevan exactamente tu misma camiseta. Nadie lo comenta. ¿Cuánto tardas en decir algo?
4 1 3 0 viajes | En el control del aeropuerto aparece en tu mochila un objeto de casa que yo metí sin avisar. ¿Cuál es y cómo se lo explicas al agente?
3 1 3 0 viajes | Llevas dos horas de tren frente a alguien que pela mandarinas sin parar y te ofrece la mitad de cada una. Van once. ¿Cuándo dices basta, y cómo?
4 1 3 0 bodas | En una boda te sientan por error en la mesa de los niños. Tienen entre 7 y 9 años y te han nombrado su líder. ¿Qué ordenas primero?
4 1 3 0 restaurantes | El camarero de un restaurante elegantísimo te confunde con un crítico famoso y no te deja aclararlo. ¿Cómo sobrevives a los siete platos?
3 1 3 0 vecinos | Son las 3 de la mañana y el vecino de arriba ensaya con una trompeta. Es la tercera noche. ¿Qué nota le dejas en el buzón?
5 1 3 0 familia | Un desconocido te para en la calle convencido de que eres su primo y te invita a una comida familiar hoy mismo. ¿Vas?
4 1 3 0 musica | Coincides en el ascensor con tu ídolo de adolescencia. Tienes ocho pisos. ¿Qué dices?
4 1 3 0 trabajo | Estás presentando algo importante en el trabajo y descubres que llevas el jersey del revés. Faltan 20 minutos de presentación. ¿Qué haces?
3 1 3 0 supermercado | Te equivocas de carro en el supermercado y te llevas el de otra persona hasta la caja. Su compra es fascinante. ¿Qué había y qué conclusiones sacas?
4 1 3 0 fiestas | Te toca organizar la cena de Nochebuena para 14 personas y la cocina deja de funcionar a las 6 de la tarde. ¿Plan?
4 1 3 0 trabajo | En una videollamada importante, tu cámara se activa con un filtro de dinosaurio que no sabes quitar. Quedan 25 minutos. ¿Qué haces?
3 1 3 0 vecinos | El vecino te pide que cuides su planta una semana y resulta que la planta tiene nombre, horario y lista de canciones. ¿Cumples?
4 1 3 0 fiestas | Llegas a un cumpleaños sorpresa y descubres que la sorpresa es para ti, pero no es tu cumpleaños. ¿Lo dices?
4 1 3 0 comida | El anfitrión de una cena sirve un plato que claramente ha salido mal y pregunta tu opinión mirándote fijamente. ¿Qué dices, palabra por palabra?
3 1 3 0 colas | Llevas 40 minutos en una cola y descubres que es para otra cosa. La otra cosa es interesante. ¿Te quedas?
3 1 3 0 bodas | En una boda, el DJ te anuncia como encargado del primer discurso. No eres tú. Te acercan el micro. ¿Qué dices?
4 1 3 0 tiendas | El dependiente te confunde con un cliente que ha pagado un regalo carísimo y te lo entrega. Sabes de quién es. ¿Qué pasa en los siguientes diez segundos?

## libre lore
3 1 2 0 dobles | Tenemos que entrenar a dos *dobles* para que nos sustituyan una semana sin que nadie lo note. ¿Qué detalle sería lo más difícil de enseñarles?
2 1 2 0 frases | ¿Qué palabra o expresión inventada nuestra merece entrar en el diccionario? Explica su origen como lo haría un académico.
3 1 2 0 casa | Somos una empresa de dos empleados. ¿Qué cargo tiene cada uno, quién pide un ascenso y qué departamento está mal gestionado?
2 1 2 0 discusiones | ¿Cuál es el *gran clásico* de nuestra relación, esa situación que se repite igual y siempre acaba con el mismo resultado?
4 1 2 0 objetos | Si hubiera un museo de nuestra relación, ¿qué objeto ridículo estaría en una vitrina? Redacta la placa.
4 1 2 0 casa | Dentro de cien años, unos arqueólogos excavan esta casa tal y como está. ¿Qué conclusión equivocada sacan sobre nosotros?
2 1 2 0 casa | ¿Qué *regla* existe en esta casa aunque nunca la hayamos acordado?
3 1 2 0 objetos | ¿Qué objeto de casa ha sobrevivido a muchas más cosas de las que debería? ¿Qué medalla le damos?
3 1 2 0 recuerdos | ¿Qué historia nuestra contamos tantas veces que ya tiene una versión oficial? ¿Qué parte exageramos?
3 1 2 0 viajes | ¿Qué viaje nuestro tendría la peor reseña en internet, y cuál sería el título de la reseña?
2 3 2 0 casa | ¿Qué trabajo invisible hace cada uno en esta casa que el otro quizá ni sabe que existe?
3 1 2 0 musica | Si tuviéramos un himno de casa, ¿de qué hablaría la primera estrofa? Tararéalo.
3 1 2 0 objetos | ¿Qué objeto, lugar o electrodoméstico es oficialmente nuestro enemigo común?
2 1 2 0 recuerdos | ¿Qué hicimos juntos por primera vez y nunca más volvimos a repetir?
3 1 2 0 frases | ¿Qué frase nuestra, dicha sin contexto delante de desconocidos, haría que alguien llamara a la policía?
3 1 2 0 vecinos | ¿Qué creen los vecinos que somos, basándose solo en lo que oyen a través de la pared?
2 1 2 0 discusiones | ¿Cuál es la discusión más absurda que hemos tenido, y quién tenía razón de verdad?
3 1 2 0 costumbres | ¿Qué tradición nuestra empezó por accidente y ahora ya es sagrada?
3 3 2 0 nosotros | Si dividieras nuestra relación en *temporadas*, ¿cómo se llama la actual?
4 1 2 0 costumbres | Un antropólogo pasa una semana viviendo con nosotros. ¿Qué ritual nuestro le parecería más inexplicable?
3 1 2 0 costumbres | ¿Qué hacemos los dos igual sin que ninguno se lo haya copiado al otro... o eso creemos?
2 3 2 0 recuerdos | ¿Qué día normal, sin nada especial, recuerdas de nosotros con un detalle sorprendente?
3 1 2 0 familia | ¿Qué personaje de nuestra familia o amigos tendría una página entera en la enciclopedia de nuestra vida?
2 1 2 0 comida | ¿Qué plato nuestro tiene receta secreta porque en realidad nadie recuerda cómo salió bien la primera vez?
3 1 2 0 apodos | ¿Qué apodo nuestro para alguien de fuera se ha vuelto tan normal que un día lo diremos delante de esa persona?
3 3 2 0 costumbres | ¿Qué hábito nuestro empezó siendo temporal y lleva años instalado?
2 1 2 0 frases | ¿Qué frase de una película o serie usamos ya como si fuera nuestra?
3 1 2 0 vecinos | ¿Qué saben de nosotros los del bar o la tienda de abajo que nuestros amigos no saben?
3 1 2 0 compras | ¿Qué compramos juntos convencidos de que nos iba a cambiar la vida, y cuántas veces lo hemos usado?
3 1 2 0 planes | ¿Qué plan llevamos años diciendo que haremos «el mes que viene»? Ponle fecha ahora, en serio.
2 3 2 0 recuerdos | ¿Qué momento nuestro recordamos distinto cada uno, y quién tiene la versión correcta?
3 1 2 0 familia | ¿Qué costumbre de mi familia has adoptado sin querer, y cuál de la tuya he adoptado yo?

## libre pref
2 3 2 0 memoria | ¿Preferirías recordar todo lo que has leído en tu vida, o todo lo que te han dicho las personas que quieres?
3 1 2 0 sueño | ¿Preferirías dormir cuatro horas y despertar descansado pero soñando siempre lo mismo, o nueve horas con sueños increíbles que recuerdas con todo detalle?
2 3 2 0 humor | ¿Preferirías que todo el mundo notara siempre cuándo estás de mal humor, o que nadie lo notara nunca, ni siquiera yo?
3 3 2 0 futuro | ¿Preferirías saber la fecha exacta del mejor día de tu vida, o no saberla pero que te avisen esa misma mañana?
3 1 2 0 ropa | ¿Preferirías ropa eternamente cómoda pero dos años pasada de moda, o eternamente elegante pero que cruje un poco al caminar?
2 1 2 0 tiempo | ¿Preferirías pausar a todo el mundo diez segundos una vez al día, o rebobinar tu última frase tres veces al día?
2 3 2 0 tiempo | ¿Preferirías volver a vivir un día cualquiera de tu pasado sin cambiar nada, o vivir un día de dentro de veinte años sin poder recordarlo después?
3 1 2 0 dinero | ¿Preferirías cobrar el salario mínimo por cada hora que duermes, o una cantidad desconocida por cada buena idea, pagada a final de año?
3 3 2 0 infancia | ¿Preferirías hablar diez minutos con tu yo de 15 años, o que tu yo de 15 años te observara un día entero sin que lo sepas?
3 1 2 0 casa | ¿Preferirías un mayordomo perfecto que comenta en voz alta todo lo que haces, o hacerlo todo tú sin testigos?
3 3 2 0 cultura | ¿Preferirías olvidar el final de tus películas favoritas para disfrutarlas otra vez, o recordar perfectamente todas las que ya has olvidado?
3 1 2 0 familia | ¿Preferirías que tu peor foto fuera famosa en todo el país una semana, o que tu peor frase en público se repitiera en tu familia durante diez años?
3 1 2 0 objetos | ¿Preferirías un botón que encuentra cualquier cosa perdida pero tarda un día, o uno que te dice al instante por qué entraste en una habitación?
3 3 2 0 gente | ¿Preferirías saber qué pensó de ti cada persona la primera vez que te vio, o qué piensa de ti hoy alguien que ya no está en tu vida?
2 1 2 0 vacaciones | ¿Preferirías unas vacaciones perfectas de las que no puedes hacer ninguna foto, o unas normales con fotos preciosas?
3 1 2 0 vecinos | ¿Preferirías unos vecinos que cantan ópera bien a las 8 de la mañana, o unos silenciosos que te saludan con un abrazo cada vez?
3 1 2 0 gente | ¿Preferirías saber el nombre de todas las personas que te han visto hoy, o que todas ellas supieran el tuyo?
3 3 2 0 gente | ¿Preferirías recibir cada lunes una carta sincera de un desconocido, o tener que escribir una tú cada viernes?
3 1 2 0 discusiones | ¿Preferirías tener siempre razón en las discusiones pequeñas y nunca en las grandes, o al revés?
3 3 2 0 tiempo | ¿Preferirías pasar un día entero a solas con tu yo de 17 años, o con tu yo de 70?
3 1 2 0 coche | ¿Preferirías que las plantas te dijeran exactamente lo que necesitan, o que tu coche te dijera lo que piensa de tu forma de conducir?
3 4 2 0 familia | ¿Preferirías que tus padres pudieran ver un día cualquiera de tu vida actual, o ver tú un día cualquiera de ellos cuando tenían tu edad?
2 1 2 0 amigos | ¿Preferirías un amigo que siempre llega tarde pero con una historia increíble, o uno que siempre llega pronto y nunca tiene nada que contar?
3 1 2 0 comida | ¿Preferirías poder dormir en cualquier postura como si fuera una cama, o comer cualquier cosa como si fuera tu plato favorito?
2 3 2 0 identidad | ¿Preferirías que los desconocidos te creyeran más simpático de lo que eres, o más listo?
3 1 2 0 tiempo | ¿Preferirías un día extra cada semana que solo tú recuerdas, o una hora extra cada día que todo el mundo comparte?
3 1 2 0 objetos | ¿Preferirías que te devolvieran todos los paraguas que has perdido, o todas las horas que has pasado esperando a alguien?
3 1 2 0 restaurantes | ¿Preferirías saber qué pensó de nosotros el camarero de la última cena, o qué piensa de nosotros el vecino que nunca saluda?
3 1 2 0 viajes | ¿Preferirías pasar un año entero en el mejor hotel del mundo sin salir, o un año viajando sin dormir dos noches en el mismo sitio?
3 1 2 0 regalos | ¿Preferirías recibir cada año un objeto absurdo pero perfecto para ti, o 500 euros que solo puedes gastar en otras personas?
3 1 2 0 sueño | ¿Preferirías recordar todos tus sueños con detalle, o que te los contara cada mañana una voz de documental?
3 3 2 0 gente | ¿Preferirías saber cuántas veces has hecho reír a alguien en tu vida, o cuántas personas han pensado en ti hoy?
2 3 2 0 nosotros | ¿Preferirías saber qué pensé de ti el primer día, o qué pensaré de ti dentro de diez años?
3 1 2 0 comida | ¿Preferirías que cada comida te supiera a la primera vez que la probaste, o que cada canción te sonara como la primera vez que la oíste?
3 3 2 0 gente | ¿Preferirías una hora con cualquier persona de tu pasado, o una hora con la persona que serás dentro de treinta años?
3 1 2 0 animales | ¿Preferirías entender a los perros pero que te hablaran sin parar, o entender a los gatos pero que solo hablaran para pedir cosas?
2 1 2 0 semana | ¿Preferirías que los lunes durasen la mitad, o que los viernes durasen el doble?
3 1 2 0 viajes | ¿Preferirías ir al sitio que quieras con alguien que no eliges tú, o a un sitio que no eliges con quien quieras?
3 1 2 0 talentos | ¿Preferirías tocar perfectamente un instrumento que nadie quiere escuchar, o cantar regular una canción que todo el mundo adora?
3 3 2 0 memoria | ¿Preferirías olvidar todas las discusiones pequeñas de tu vida, o recordar con detalle todas las veces que pediste perdón?
3 1 2 0 trabajo | ¿Preferirías un trabajo aburridísimo con compañeros fascinantes, o un trabajo fascinante completamente solo?
3 1 2 0 dinero | ¿Preferirías que te devolvieran el dinero de todo lo que compraste y nunca usaste, o el tiempo de todo lo que viste y no te gustó?
3 1 2 0 familia | ¿Preferirías una comida familiar al mes de diez horas, o una a la semana de treinta minutos exactos?
2 1 2 0 sueño | ¿Preferirías despertarte siempre cinco minutos antes de la alarma, o dormirte siempre en menos de un minuto?
4 1 2 0 social | ¿Preferirías saber el nombre de todo el mundo pero que nadie recordara el tuyo, o que todos recordaran el tuyo y tú ninguno?
3 1 2 0 comida | ¿Preferirías comer solo lo que cocines tú durante un año, o solo lo que cocine yo?
3 3 2 0 identidad | ¿Preferirías que te conocieran por tu mejor momento, o por tu día más normal?
3 1 2 0 cultura | ¿Preferirías leer la última página de todos los libros antes de empezarlos, o no saber nunca el final de los que no termines?
2 1 2 0 clima | ¿Preferirías vivir siempre en octubre, o siempre en mayo?
3 1 2 0 gente | ¿Preferirías que los desconocidos te contaran siempre su mejor historia, o que te pidieran siempre consejo?
3 1 2 0 compras | ¿Preferirías que todo lo que compres dure el doble y cueste el doble, o que dure la mitad y la segunda sea gratis?
3 3 2 0 infancia | ¿Preferirías tener siete años una semana con lo que sabes ahora, o que tu yo de siete años pasara una semana aquí, con nosotros?
3 1 2 0 viajes | ¿Preferirías hablar todos los idiomas pero perder el sentido de la orientación, o no perderte nunca y hablar solo el tuyo?
3 1 2 0 tecnologia | ¿Preferirías un teléfono que nunca se queda sin batería pero no tiene cámara, o una cámara perfecta en un teléfono que dura dos horas?
3 1 2 0 restaurantes | ¿Preferirías el mejor plato del mundo en un sitio feo y con prisa, o un plato normal en el sitio más bonito que hayas visto, sin prisa?
3 1 2 0 costumbres | ¿Preferirías no hacer cola jamás, o no esperar a nadie jamás?
3 1 2 0 casa | ¿Preferirías vivir en una casa diminuta en tu calle favorita, o en una enorme en una calle que te da igual?
3 3 2 0 vecinos | ¿Preferirías saber exactamente qué piensan de ti tus amigos, o qué piensan de ti tus vecinos?
3 1 2 0 trabajo | ¿Preferirías no trabajar nunca los lunes pero trabajar todos los domingos, o al revés?
2 1 2 0 comida | ¿Preferirías no volver a comer tu plato favorito, o comerlo todos los días durante un año?
3 1 2 0 sueño | ¿Preferirías soñar cada noche con el mismo lugar precioso, o no repetir sueño nunca pero no recordar ninguno?
3 3 2 0 nosotros | ¿Preferirías ver una grabación de nuestra primera conversación, o de la que tendremos dentro de cincuenta años?
3 1 2 0 regalos | ¿Preferirías recibir siempre el regalo exacto que querías, o uno que nunca habrías pedido pero que siempre acaba siendo mejor?
3 1 2 0 ciudad | ¿Preferirías una ciudad siempre en fiestas donde nunca hay aparcamiento, o una siempre tranquila sin una sola terraza?
3 1 2 0 talentos | ¿Preferirías bailar perfectamente solo cuando nadie mira, o solo cuando todo el mundo mira?
4 1 2 0 cultura | ¿Preferirías que tu vida fuera un documental narrado por alguien que te admira, o una comedia narrada por alguien que te conoce demasiado?
3 3 2 0 futuro | ¿Preferirías saber qué cosa de hoy echarás de menos dentro de diez años, o qué cosa de hoy te alegrará haber dejado?
3 1 2 0 gente | ¿Preferirías una cena con tus tres profesores favoritos, o con las tres personas que peor te cayeron en el colegio, ya adultas?
3 1 2 0 casa | ¿Preferirías la temperatura perfecta en casa pero sin ventanas, o ventanas enormes y siempre un grado menos de lo que te gusta?
2 1 2 0 rutinas | ¿Preferirías que todos los días fueran iguales pero buenos, o distintos pero con uno malo a la semana?
3 1 2 0 dinero | ¿Preferirías mil euros ahora, o cien euros cada vez que hagas reír a alguien durante un año?
3 1 2 0 viajes | ¿Preferirías repetir el mejor viaje de tu vida exactamente igual, o hacer uno nuevo sabiendo que será un poco peor?
3 1 2 0 familia | ¿Preferirías que tus padres te vieran discutir conmigo una vez, o que te vieran cantar en la ducha una vez?
3 1 2 0 mentiras | ¿Preferirías no poder mentir nunca, o no poder detectar nunca una mentira?
3 3 2 0 identidad | ¿Preferirías que te recordaran por algo que hiciste a propósito, o que te quisieran por algo que hiciste sin darte cuenta?
3 1 2 0 tecnologia | ¿Preferirías que internet funcionara solo de 9 a 5, o solo de 5 a 9?
3 1 2 0 social | ¿Preferirías llegar siempre diez minutos tarde con una excusa perfecta, o diez minutos antes y tener que esperar hablando con desconocidos?
1 1 2 0 comida,ligero,f:pref-desayuno-cena | ¿Preferirías desayunar siempre lo mismo o cenar siempre lo mismo?
1 1 2 0 casa,ligero,f:pref-fregar-tender | ¿Preferirías no volver a fregar nunca o no volver a tender nunca?
1 1 2 0 clima,ligero,f:pref-frio-calor | ¿Preferirías pasar siempre un poco de frío o siempre un poco de calor?
1 2 2 0 cotidiano,f:pref-madrugar-trasnochar | ¿Preferirías tener que madrugar siempre o tener que trasnochar siempre?
1 2 2 0 cotidiano,f:pref-cocinar-limpiar | ¿Preferirías cocinar cada día pero no limpiar nunca, o al revés?
1 2 2 0 viajes,f:pref-viaje-largo-corto | ¿Preferirías un viaje largo cada tres años o uno corto cada tres meses?
1 2 2 0 social,f:pref-fiesta-cena | ¿Preferirías una fiesta de cien personas o una cena de cuatro, todos los sábados del año?
1 3 2 0 personal,f:pref-saber-piensan | ¿Preferirías saber lo que la gente piensa de ti de verdad, o que la gente supiera lo que piensas tú?
1 3 2 0 personal,f:pref-cambiar-pasado-futuro | ¿Preferirías cambiar una decisión del pasado o conocer una del futuro?
1 3 2 0 personal,f:pref-pedir-ayuda | ¿Preferirías pedir ayuda y que te la den regular, o no pedirla y hacerlo tú peor?
1 3 2 0 trabajo,f:pref-trabajo-reconocido | ¿Preferirías hacer un trabajo importante que nadie ve, o uno que no importa pero todos aplauden?
2 4 1 0 revelador,f:pref-recordar-olvidar | ¿Preferirías recordar todo lo que te han hecho, o que todos recordaran todo lo que has hecho tú?
2 4 1 0 revelador,f:pref-admirado-querido | ¿Preferirías ser admirado por muchos o querido de verdad por tres personas?
2 4 1 0 revelador,f:pref-decir-callar | ¿Preferirías haber dicho todo lo que callaste, o haber callado todo lo que dijiste?
2 4 1 0 revelador,f:pref-saber-fecha | ¿Preferirías saber cuántos años vas a vivir, o cuántos años buenos te quedan?
2 4 1 0 dificil,f:pref-tiempo-dinero | ¿Preferirías tener la mitad de dinero y el doble de tiempo, o al revés?
2 4 1 0 dificil,f:pref-vivir-cerca-familia | ¿Preferirías vivir a cinco minutos de tu familia o a cinco horas?
2 4 1 0 dificil,f:pref-cambiar-ciudad | ¿Preferirías cambiar de ciudad cada cinco años o no moverte nunca de esta?
2 4 1 0 dificil,f:pref-verdad-incomoda | ¿Preferirías una verdad incómoda ahora o una duda cómoda para siempre?
2 4 1 0 dificil,f:pref-amigos-nuevos-viejos | ¿Preferirías conservar a todos tus amigos de siempre o conocer gente nueva cada año?
1 2 2 0 inesperado,f:pref-saber-cocinar-arreglar | ¿Preferirías saber cocinar cualquier cosa o saber arreglar cualquier cosa?
1 2 2 0 inesperado,f:pref-bailar-cantar | ¿Preferirías bailar bien o cantar bien?
1 2 2 0 inesperado,f:pref-idiomas-instrumento | ¿Preferirías hablar cinco idiomas o tocar cinco instrumentos?
1 2 2 0 inesperado,f:pref-nunca-colas | ¿Preferirías no hacer cola nunca más o no tener que esperar nunca a nadie?
1 2 2 0 inesperado,f:pref-sueño-hambre | ¿Preferirías no tener sueño nunca o no tener hambre nunca?
1 3 2 0 personal,f:pref-vecinos-familia | ¿Preferirías unos vecinos perfectos o una familia perfecta a dos calles?
1 2 2 0 cotidiano,f:pref-sin-coche-sin-movil | ¿Preferirías vivir un año sin coche o un mes sin móvil?
1 2 2 0 cotidiano,f:pref-casa-grande-cerca | ¿Preferirías una casa pequeña en el centro o una grande a cuarenta minutos?
1 3 2 0 personal,f:pref-ver-nacer-ver-viejo | ¿Preferirías ver una grabación de tu primer año de vida o de tu último?
2 4 1 0 revelador,f:pref-reir-llorar | ¿Preferirías una vida con muchas risas y pocos momentos grandes, o pocas risas y momentos que cambian todo?
1 2 2 0 ligero,f:pref-playa-montaña-siempre | ¿Preferirías todas las vacaciones en la misma playa o todas en la misma montaña?
1 2 2 0 ligero,f:pref-mañana-noche-persona | ¿Preferirías ser una persona de mañanas o de noches, para siempre y sin excepciones?
1 2 2 0 cotidiano,f:pref-invitar-ser-invitado | ¿Preferirías ser siempre quien invita a cenar en casa, o siempre el invitado?
1 3 2 0 personal,f:pref-opinion-sincera | ¿Preferirías que te dijera siempre lo que pienso de tu ropa, o que no lo dijera nunca?
2 4 1 0 dificil,f:pref-volver-empezar | ¿Preferirías volver a empezar tu carrera desde cero con lo que sabes, o seguir donde estás con lo que tienes?
1 2 2 0 inesperado,f:pref-nunca-perder-nunca-olvidar | ¿Preferirías no perder nunca nada o no olvidar nunca un nombre?
1 2 2 0 cotidiano,f:pref-cena-casa-fuera | ¿Preferirías cenar fuera cada viernes del año o un viaje de una semana sin cenas fuera?
2 4 1 0 revelador,f:pref-fuerte-sensible | ¿Preferirías que te vieran más fuerte de lo que eres, o más sensible de lo que eres?
1 3 2 0 personal,f:pref-elogios-criticas | ¿Preferirías recibir solo elogios sinceros o solo críticas útiles durante un año?
1 2 2 0 ligero,f:pref-lluvia-sol-domingo | ¿Preferirías que todos los domingos lloviera o que todos hiciera sol?
2 4 1 0 dificil,f:pref-saber-todo-de-mi | ¿Preferirías saberlo todo de mí o que yo lo supiera todo de ti?
1 2 2 0 inesperado,f:pref-regalar-recibir | ¿Preferirías hacer siempre el regalo perfecto o recibirlo siempre?
1 3 2 0 personal,f:pref-dia-libre-solo-juntos | ¿Preferirías un día libre entero para ti solo, o un día libre entero conmigo sin planes?
2 4 1 0 revelador,f:pref-segunda-oportunidad | ¿Preferirías una segunda oportunidad con alguien del pasado, o una primera con alguien que aún no conoces? No hablo de amor.
1 2 2 0 ligero,f:pref-mascota-planta | ¿Preferirías diez plantas que no se mueren o una mascota que no ensucia?

## libre teo
3 1 3 0 ascensores | ¿Por qué crees realmente que los ascensores tienen espejo? Quiero la versión conspirativa.
3 1 3 0 comida | Inventa una teoría convincente de por qué siempre acabamos cenando lo mismo cuando nadie quiere decidir.
3 1 3 0 tiendas | ¿Qué conspiración inocente ocurre en las tiendas de muebles para que siempre salgas con una vela que no necesitabas?
3 1 3 0 animales | ¿Qué creen los peces del acuario de una sala de espera que hacemos allí todo el día?
3 1 3 0 objetos | Inventa la historia secreta del cajón de los cables de esta casa. ¿Quién lo fundó y cuál fue el primer cable?
4 1 3 0 tele | ¿Por qué desaparece el mando de la tele justo cuando empieza algo? Responde como detective.
3 1 3 0 casa | ¿Qué piensa nuestra lavadora de nosotros, basándose solo en lo que le damos?
4 1 3 0 domingos | Explica con toda la seriedad posible por qué los domingos por la tarde duran el doble que los sábados por la mañana.
3 1 3 0 familia | ¿Por qué los relojes de las cocinas de los abuelos siempre van adelantados? Inventa la razón.
3 1 3 0 objetos | ¿Por qué las tapas de los táperes desaparecen y los táperes no? Necesito una teoría.
4 1 3 0 sueño | ¿De dónde salen realmente las ideas brillantes que se tienen justo antes de dormir y por qué se van?
3 1 3 0 cafes | ¿Por qué el café de las máquinas del trabajo sabe así? Inventa la receta oficial.
3 1 3 0 objetos | ¿Dónde están todos los bolígrafos que has perdido en tu vida? Describe el lugar como un guía turístico.
4 1 3 0 tecnologia | ¿Por qué el wifi funciona peor justo en la habitación donde más lo necesitas? Dame la explicación geopolítica.
3 1 3 0 supermercado | Explica por qué la otra cola del supermercado siempre va más rápido, como un físico muy cansado.
4 1 3 0 comida | ¿Por qué el pan del día siguiente está duro pero las galletas del día siguiente están blandas? Inventa el pacto.

## libre comp
1 1 2 0 humor | Completa: «Sé que te estás quedando sin batería cuando empiezas a ______.»
2 1 2 0 casa | Completa: «Si alguna vez desaparezco, buscadme primero en ______.»
2 3 2 0 nosotros | Completa: «Lo que más me sorprendió de vivir contigo fue ______.»
2 1 2 0 talentos | Completa: «Nadie lo sabe, pero tengo un talento secreto para ______.»
2 1 2 0 cine | Completa: «En una película de atracos, mi papel sería ______ y el tuyo ______.»
2 3 2 0 cambios | Completa: «Algo que hacía antes de conocerte y he dejado de hacer sin darme cuenta es ______.»
2 1 2 0 rutinas | Completa: «Mi martes perfecto empieza con ______ y termina con ______.»
2 1 2 0 gustos | Completa: «Lo que más me cuesta admitir que me gusta es ______.»
3 1 2 0 casa | Completa: «En esta casa, lo único que nunca se discute es ______.»
2 1 2 0 social | Completa: «Mi peor momento social del año pasado fue cuando ______.»
2 1 2 0 vacaciones | Completa: «Se nota que estamos de vacaciones cuando tú ______ y yo ______.»
2 1 2 0 discusiones | Completa: «La frase que más repito en una discusión y debería jubilar es ______.»
2 3 2 0 nosotros | Completa: «Si abriéramos un negocio juntos se llamaría ______ y quebraría por ______.»
2 1 2 0 humor | Completa: «Mi forma de pedir perdón sin decir perdón es ______.»
2 1 2 0 comida | Completa: «En mi última cena pediría, sin pensarlo, ______.»

## libre rank
3 1 3 0 secretos | Ordena de más a menos fiable para guardarte un secreto: una abuela de 90 años, un loro, un niño de seis años, un notario muy aburrido.
3 1 3 0 domingos | Ordena según cuánto pueden arruinarnos un domingo: una visita sorpresa, un grifo que gotea, una serie que se acaba, un plan que nadie quería cancelar.
3 1 3 0 viajes | Ordena de mejor a peor compañero de viaje: un guía turístico jubilado, un niño que lo pregunta todo, un fotógrafo obsesivo, alguien que solo quiere dormir.
3 1 3 0 casa | Ordena estas tareas de la que más fingimos no ver a la que menos: tender, vaciar el lavavajillas, cambiar el rollo de papel, bajar la basura.
3 1 3 0 sonidos | Ordena del ruido que más te saca de quicio al que menos: alguien masticando hielo, una moto a las 7, un globo frotándose, una alarma que no es tuya.
4 1 3 0 vecinos | Ordena de mejor a peor vecino de arriba: un batería profesional, alguien que mueve muebles a medianoche, una pareja de claqué, un loro que ha aprendido tu nombre.
3 1 3 0 casa | Ordena de más a menos probable que nos pase esta semana: perder las llaves, olvidar algo en el horno, dormirnos en el sofá, comprar algo que ya teníamos.
3 1 3 0 clima | Ordena de mejor a peor para pasar una tarde entera: una tormenta sin luz, una ola de calor sin ventilador, nieve que no cuaja, un viento que no deja hablar.
4 1 3 0 tiempo | Ordena qué querrías que fuera eterno: un domingo por la mañana, el viaje de vuelta en tren, la sobremesa, el minuto antes de abrir un regalo.
3 1 3 0 compras | Ordena de más a menos justificable comprar en una gasolinera a las 2 de la mañana: un peluche, una guía de setas, un cargador, una plancha para el pelo.
3 1 3 0 casa | Ordena qué electrodoméstico echarías más de menos una semana: la lavadora, el microondas, la nevera, el router.

## libre acus
3 1 3 0 manias | Acusa formalmente a tu pareja de un delito inventado basado en una costumbre real. La defensa tiene un minuto.
3 1 3 0 casa | Presenta pruebas de que tu pareja lleva años saboteando sutilmente algo de esta casa.
3 1 3 0 objetos | Denuncia ante el tribunal de la casa el uso indebido de un objeto por parte de tu pareja. Pide una pena proporcionada.
3 1 3 0 planes | Acusa a tu pareja de cancelar planes con una técnica concreta y repetida. Describe la técnica como un experto en seguridad.

## libre tit
2 1 3 0 semana | Ponle un *titular* de periódico a nuestra última semana.
3 1 3 0 vecinos | Escribe el titular del periódico del barrio si los vecinos supieran lo que pasó en esta casa el último sábado.
2 1 3 0 comida | Resume en un titular la peor decisión culinaria que hemos tomado juntos.
3 1 3 0 nosotros | Escribe la portada del periódico del día en que nos conocimos, si solo hubiera sido noticia eso.
2 1 3 0 salir | Titular del telediario sobre nuestro último intento de salir de casa a la hora prevista.

## libre expl
3 1 3 0 nosotros | Explica nuestra relación a alguien que no nos conoce usando solo tres objetos de esta casa.
3 1 3 0 domingos | Explícale a alguien del siglo XVIII qué hacemos un domingo por la tarde.
4 1 3 0 nosotros | Explícale a un niño de cinco años cómo nos conocimos, dibujando en el aire.
3 1 3 0 tele | Explícale a alguien de 1950 lo que hacemos cada noche antes de elegir una serie.
3 1 3 0 discusiones | Explica una discusión nuestra típica como si fuera el reglamento de un deporte: duración, faltas, cómo se gana.

## libre ctx
2 1 2 0 comida | Tenemos 20 minutos, estamos agotados y nadie quiere decidir qué cenar. ¿Quién acaba decidiendo y qué acaba pasando?
3 1 2 0 bodas | Nos invitan a dos bodas el mismo día: una de alguien muy querido a cuatro horas, otra de alguien que nos da igual con la mejor comida de la historia. ¿Qué hacemos de verdad?
2 1 2 0 planes | Llueve, es sábado, uno quiere salir y el otro no. ¿Quién gana normalmente y con qué argumento?
3 1 2 0 vacaciones | Nos sobra un día de vacaciones y 200 euros, y hay que decidir en cinco minutos. ¿Qué acaba pasando de verdad?
3 1 2 0 familia | Llama un familiar para avisar de que viene a comer en una hora. ¿Qué hace cada uno en los primeros cinco minutos?
3 1 2 0 regalos | Faltan dos días para el cumpleaños de alguien importante y ninguno ha comprado nada. ¿Quién lo arregla, cómo, y quién se lleva el mérito?
2 1 2 0 casa | Hemos invitado a cenar a seis personas y una hora antes el horno no funciona. ¿Quién decide qué, y qué acabamos comiendo?
3 1 2 0 viajes | Nos regalan un fin de semana en una ciudad que uno adora y el otro odia, o nada. ¿Qué pasa de verdad?

## rapida rap
2 1 3 0 identidad | Nombre de mi autobiografía.
2 1 3 0 humor | Un color para mi humor de hoy.
3 1 3 0 casa | El electrodoméstico que más me quiere.
2 1 3 0 domingos | Nombre para un perfume que huela a domingo por la tarde.
2 1 3 0 coche | Una palabra para mi forma de conducir.
2 1 3 0 animales | El peor nombre posible para un gato.
1 1 3 0 comida | Una cosa que nunca falta en nuestra nevera.
2 1 3 0 viajes | Título de la película de nuestro último viaje.
3 1 3 0 talentos | Mi superpoder inútil.
2 1 3 0 trabajo | Una profesión que yo haría fatal.
3 1 3 0 comida | Un sabor de helado que solo compraría yo.
1 1 3 0 objetos | El objeto más inútil que tenemos en casa.
2 1 3 0 musica | La canción que pondría yo para fregar.
2 1 3 0 viajes | Primer destino que te viene a la cabeza para escaparnos este fin de semana.
2 1 3 0 frases | La palabra que yo digo mal a propósito.
3 1 3 0 casa | El nombre de esta casa si fuera un hotel.
2 1 3 0 manias | Una manía mía en tres palabras.
1 1 3 0 viajes | Algo que siempre olvido en los viajes.
2 1 3 0 casa | Mi sitio de la casa a las 11 de la noche.
2 1 3 0 planes | Lo que yo haría ahora mismo con 20 minutos libres.
2 1 3 0 comida | Mi plato de emergencia.
2 1 3 0 objetos | Lo que yo digo cuando pierdo algo.
2 1 3 0 casa | Un apodo para nuestro sofá.
1 1 3 0 semana | La primera palabra que piensas al oír «lunes».
2 1 3 0 tiempo | Mi frase cuando llego tarde.
2 1 3 0 dinero | Lo primero que compraría yo si me tocara la lotería a las 7 de la mañana.
2 1 3 0 compras | Una cosa que yo compro siempre de más.
2 1 3 0 tiempo | Mi hora favorita del día, en un número.
3 1 3 0 fiestas | Una tradición navideña nueva para esta casa.
2 1 3 0 sueño | La hora a la que de verdad me duermo cuando digo «ya me voy a la cama».
4 1 3 0 tecnologia | Un objeto que jamás debería tener versión inteligente.
2 1 3 0 clima | El tiempo que hace hoy dentro de mi cabeza.
2 1 3 0 comida | La fruta que mejor me representa.
2 1 3 0 casa | La habitación de la casa donde pienso mejor.
2 1 3 0 tiempo | Mi mes favorito del año, sin dudar.
2 1 3 0 musica | El instrumento que yo tocaría en una orquesta.
2 1 3 0 fiestas | Mi disfraz por defecto.
2 1 3 0 animales | El animal al que más me parezco al despertarme.
2 1 3 0 frases | Mi muletilla.
2 1 3 0 deporte | El deporte que yo inventaría.
3 1 3 0 ciudad | La ciudad donde yo sería más feliz, sin pensarlo.
2 1 3 0 comida | Mi postre de urgencia.
2 1 3 0 sueño | Mi sueño recurrente en tres palabras.
2 1 3 0 tele | El programa de televisión que yo presentaría.
3 1 3 0 talentos | Mi superpoder, pero solo útil dentro de casa.
2 1 3 0 viajes | Lo primero que hago en una ciudad nueva.
2 1 3 0 ropa | La prenda que yo rescataría de un incendio.
3 1 3 0 restaurantes | Nombre del restaurante que abriríamos juntos.
2 1 3 0 social | Mi frase para saludar a alguien cuyo nombre he olvidado.
3 1 3 0 familia | El pariente al que más me parezco sin querer.
2 1 3 0 objetos | Lo que hay en mi bolsillo ahora mismo, sin mirar.
2 1 3 0 mañanas | Mi primer pensamiento de hoy.
2 1 3 0 casa | Mi tarea de casa favorita, si existe.
2 1 3 0 comida | El sabor que me pone de buen humor.
2 1 3 0 tiempo | Una hora del día a la que nunca deberían llamarme.
2 1 3 0 planes | El plan perfecto para esta noche, en cuatro palabras.
3 1 3 0 vecinos | El apodo que me tienen los vecinos.
2 1 3 0 dinero | En qué gastaría yo cien euros hoy mismo.
3 1 3 0 objetos | Un objeto de esta casa que sabría guardar un secreto.
2 1 3 0 humor | Lo que me quita el enfado al instante.
2 1 3 0 viajes | El sitio al que volvería mañana mismo.
3 1 3 0 trabajo | Mi excusa más creíble para no ir a algo.
2 1 3 0 comida | Lo que yo robaría de un bufé.
2 1 3 0 talentos | Lo que yo haría en un concurso de talentos.
3 1 3 0 cine | El género de nuestra vida esta semana.
2 1 3 0 manias | Lo que no soporto que me toquen.
2 1 3 0 sonidos | El sonido que más me calma.
2 1 3 0 casa | Mi rincón favorito de esta casa, en una palabra.
3 1 3 0 social | La persona famosa con la que yo me llevaría fatal.

## predice pre
3 1 2 0 cdb | Unos extraterrestres te devuelven a casa después de 48 horas de abducción. Sin decir una palabra, haces algo que confirma que sigues siendo tú. ¿Qué haces?
3 1 2 0 cdb,casa | Un detective tiene que averiguar si has pasado por una habitación solo mirando la habitación. ¿Qué pista te delata siempre?
3 1 2 0 cafes | Tienes que elegir un nombre falso para dar en las cafeterías el resto de tu vida. ¿Cuál eliges?
3 1 2 0 cdb,viajes | Nos regalan una noche en un hotel de lujo, pero solo si el personal no descubre en 24 horas que no somos ricos. ¿Qué haces tú que nos delataría antes de la cena?
2 1 2 0 cdb,humor | Si tuvieras una barra de energía visible, ¿qué cosa cotidiana te la baja a cero de golpe?
2 1 2 0 cdb,supermercado | Te pierdo de vista diez minutos en el supermercado. ¿En qué pasillo te encuentro y haciendo qué?
3 1 2 0 cdb,tele | Te meten en un reality de convivencia con desconocidos. ¿En qué semana te echan y por qué motivo ridículo?
3 3 2 0 cdb,futuro | Tu yo de dentro de 30 años llama a la puerta, te da un único aviso y se va. ¿Sobre qué es el aviso?
2 1 2 0 compras | Te dan 500 euros para gastarlos hoy enteros en una sola tienda que no venda comida. ¿En qué tienda entras?
2 1 2 0 restaurantes | En un restaurante te traen un plato que no has pedido. ¿Te lo comes sin decir nada, lo devuelves, preguntas mientras ya lo pruebas, o miras a tu pareja para que lo resuelva?
1 3 2 0 infancia | Puedes recuperar un solo objeto de tu infancia que ya no existe. ¿Cuál pides?
2 1 2 0 cdb,frases | Te prohíben durante una semana decir tu frase más repetida. ¿Cuál es la frase y cuánto aguantas?
3 1 2 0 cdb,tiendas | Pasas una noche entera dentro de un IKEA cerrado. ¿Qué es lo primero que haces?
2 1 2 0 tele | Tienes 20 minutos en televisión nacional para hablar de lo que quieras. ¿De qué hablas?
3 1 2 0 ropa,trabajo | Te ofrecen el trabajo de tus sueños con una sola condición: llevar el mismo jersey todos los días durante un año. ¿Aceptas? ¿Qué jersey?
2 1 2 0 restaurantes | Ganas una cena con cualquier persona viva, pero tiene que ser en un sitio de comida rápida. ¿A quién invitas?
3 1 2 0 cdb,trabajo | Te dan un día libre sorpresa un miércoles y no puedes contárselo a nadie. ¿Qué haces a las 11 de la mañana?
2 1 2 0 musica,coche | Eliges la música de un viaje en coche de seis horas y nadie puede discutírtelo. ¿Qué suena primero?
3 1 2 0 fiestas | En una fiesta de disfraces sin tema, ¿de qué te disfrazas si nadie te ayuda a decidir?
3 1 2 0 tecnologia | Puedes borrar un invento de la historia, pero tiene que ser pequeño y cotidiano. ¿Cuál desaparece?
3 1 2 0 tecnologia | Internet desaparece una semana en todo el mundo. ¿Qué cosa rara acabas haciendo el martes por la tarde?
2 1 2 0 trabajo | Te regalan un año sabático pagado. ¿Qué haces el primer mes?
3 1 2 0 talentos | Te suben a un escenario delante de 300 personas a hablar una hora sin preparar nada. ¿De qué hablas, y en qué minuto empiezas a inventar?
3 1 2 0 talentos | Escribes un libro de autoayuda basado en algo que haces bien. ¿Cómo se titula?
2 1 2 0 viajes | Tenemos que mudarnos mañana a otra ciudad del país. ¿Cuál eliges, y por qué motivo poco serio?
3 1 2 0 cdb,frases | Tienes que pasar 24 horas sin hablar. ¿Qué es lo primero que intentas decir con gestos?
2 1 2 0 tiendas | Tienes una tarde para ti en un centro comercial vacío. ¿A qué tienda vas primero?
3 1 2 0 casa | Hay que salir de casa en 30 segundos. ¿Qué objeto coges que no tiene ningún sentido coger?
3 1 2 0 ropa | Tienes que llevar una camiseta con una frase durante un año. Tú eliges la frase. ¿Cuál es?
2 1 2 0 cdb,mañanas | Tienes la mañana libre y no hay nadie en casa. ¿Qué es lo primero que haces?
3 1 2 0 casa | Puedes elegir el olor oficial de nuestra casa. ¿Cuál?
3 1 2 0 viajes | Puedes quedarte con un objeto de cualquier hotel en el que hayas estado. ¿Cuál coges?
2 1 2 0 deseos | Aparece un genio que solo concede deseos pequeños e inmediatos. ¿Qué le pides primero?
3 3 2 0 tiempo | Tienes que vivir un mes en el pasado con tu trabajo actual. ¿En qué año te defenderías mejor?
3 1 2 0 cdb,social | En una cena con desconocidos, ¿qué tema sacas tú cuando nadie sabe qué decir?
3 1 2 0 cdb,dinero | Te toca la lotería y prometes que no cambiará nada. ¿Qué es lo primero que cambia?
3 1 2 0 cdb,viajes | Perdemos el último tren y hay que pasar la noche en la estación. ¿Qué haces tú en la primera hora?
4 1 2 0 cdb,objetos | Tienes que convencer a un jurado de que eres tú y no un clon. Solo puedes enseñar un objeto de la casa. ¿Cuál?
2 1 2 0 cdb,comida | Te quedas a solas con una tarta entera durante una hora y nadie lo va a saber nunca. ¿Cuánta queda?
3 1 2 0 cdb,familia | En la próxima comida familiar te pagan 100 euros por cada tema polémico que consigas evitar. ¿Cuánto ganas?
3 1 2 0 cdb,casa | Te quedas tres días solo en casa. ¿Qué norma de convivencia se rompe primero, y a qué hora?
3 1 2 0 cdb,comida | Puedes cenar lo que quieras esta noche sin cocinar ni pagar. ¿Qué pides exactamente, con los cambios que siempre pides?
3 1 2 0 cdb,viajes | Nos regalan un viaje sorpresa y solo te dicen el clima: frío. ¿Qué es lo primero que metes en la maleta?
3 1 2 0 cdb,tiempo | Te dan una hora extra al día que nadie más tiene. ¿A qué hora la pones y en qué la gastas la primera semana?
2 1 2 0 cdb,social | En una boda te sientan con desconocidos. ¿Cuál es tu primera pregunta para romper el hielo?
3 1 2 0 cdb,objetos | Alguien te da 200 euros para una sola cosa inútil. ¿Qué compras?
3 3 2 0 cdb,infancia | Tu yo de diez años pasa un día contigo. ¿Qué es lo que más le impresiona de tu vida actual?
2 1 2 0 cdb,casa | Avisan de visita con media hora de margen. ¿Qué parte de casa limpias primero?
3 1 2 0 cdb,cine | Eliges tú el género de la película de esta noche. ¿Cuál, y en qué minuto te duermes?
3 1 2 0 cdb,trabajo | Te regalan un día libre que tienes que gastar en un sitio al que normalmente no irías. ¿Dónde acabas?
3 1 2 0 cdb,casa | ¿Cuántos vasos o tazas hay ahora mismo fuera de su sitio en esta casa? Di un número.
2 1 2 0 cdb,musica | Te piden una canción para abrir una fiesta. ¿Cuál dices?
3 1 2 0 cdb,dinero | Te toca un premio pequeño: 3.000 euros. ¿Qué haces primero, antes incluso de contarlo?
3 1 2 0 cdb,familia | Tu familia prepara una fiesta sorpresa. ¿En qué momento te das cuenta, y cómo disimulas?
3 1 2 0 cdb,viajes | Perdemos las maletas en un viaje. ¿Qué es lo primero que compras al llegar?
2 1 2 0 cdb,frases | Te dan un megáfono un minuto en una plaza llena. ¿Qué dices?
3 1 2 0 cdb,objetos | Hay que meter un objeto de casa en una cápsula del tiempo. ¿Cuál eliges tú?
3 3 2 0 cdb,futuro | Dentro de veinte años damos una fiesta. ¿Qué anécdota de ahora contarás tú a todo el mundo?
2 1 2 0 cdb,mañanas | Hoy no suena la alarma. ¿A qué hora te despiertas solo?
3 1 2 0 cdb,tele | Te invitan a un concurso de televisión. ¿Cuál eliges, y en qué pregunta caes?
3 1 2 0 cdb,salud | Te mandan una semana de reposo absoluto. ¿Qué día te la saltas, y para qué?
3 1 2 0 cdb,planes | Tarde libre, llueve y la nevera está vacía. ¿Qué estás haciendo a las seis?
3 1 2 0 cdb,gente | Invitas a cenar a tres personas de tu vida que no se conocen entre sí. ¿A quiénes?
2 1 2 0 cdb,ropa | Te invitan a algo elegante dentro de una hora. ¿Qué te pones, sin pensarlo?
3 1 2 0 cdb,animales | Encuentras un perro perdido. ¿Qué nombre provisional le pones mientras buscas a su dueño?
3 1 2 0 cdb,talentos | Te apuntan sin permiso a un taller de fin de semana y eliges tú el tema para que no sea un desastre. ¿Cuál?
3 1 2 0 cdb,casa | Puedes añadir una habitación a casa, del tamaño que quieras, con un único uso. ¿Qué habitación?
3 1 2 0 cdb,viajes | Vuelo largo: ventana, pasillo o en medio. ¿Qué eliges, y qué haces la primera hora?
3 1 2 0 cdb,comida | Solo puedes pedir una cosa de la carta de un bar cualquiera durante un mes. ¿Qué pides?
2 1 2 0 cdb,tiempo | Te sobran veinte minutos antes de una cita. ¿Dónde los pasas?
3 1 2 0 cdb,objetos | Tienes que regalar uno de tus objetos favoritos a alguien que lo cuidará bien. ¿Cuál das?
3 1 2 0 cdb,trabajo | Te hacen jefe por un día en tu trabajo. ¿Cuál es tu primera decisión, y cuál te costaría el puesto?
3 1 2 0 cdb,casa | Nos regalan una planta enorme. ¿Dónde la pones, y cuánto dura?
3 1 2 0 cdb,gente | Un desconocido te pide ayuda con algo que se te da bien. ¿Qué es?
2 1 2 0 cdb,comida | Toca pedir el postre para los dos sin consultarme. ¿Qué pides?
3 1 2 0 cdb,social | En una reunión eterna, ¿qué haces para sobrevivir sin que se note?
3 1 2 0 cdb,viajes | Tarde libre en una ciudad desconocida y sin mapa. ¿Qué buscas primero?
3 1 2 0 cdb,sueño | Te dan un día entero para dormir sin consecuencias. ¿Cuántas horas duermes de verdad?
3 1 2 0 cdb,objetos | Puedes llevar un solo objeto a una isla con comida y agua. ¿Cuál?
3 1 2 0 cdb,fiestas | Organizas una fiesta temática y eliges el tema. ¿Cuál es, y quién no viene?
3 1 2 0 cdb,casa | Se va la luz toda la noche. ¿Qué estás haciendo a las once?
3 3 2 0 cdb,tiempo | Puedes mandar una sola frase a tu yo de hace diez años. ¿Qué dice?
1 2 2 0 cdb,antes,colegio,f:asignatura | ¿Qué asignatura te hacía sufrir en el colegio aunque estudiaras?
1 2 2 0 cdb,antes,infancia,f:comida-odiada | ¿Qué comida odiabas de pequeño y ahora te gusta?
1 2 2 0 cdb,antes,adolescencia,f:musica-adolescente | ¿Qué grupo o cantante escuchabas sin parar a los quince años?
1 2 2 0 cdb,antes,hobbies,f:hobby-abandonado | ¿Qué hobby abandonaste y todavía guardas el material?
1 3 2 0 cdb,antes,sueños,f:sueño-antiguo | ¿Qué querías ser a los diez años?
1 2 2 0 cdb,cotid,rutinas,f:momento-dia | ¿Qué momento del día es tuyo de verdad, aunque dure diez minutos?
1 2 2 0 cdb,cotid,comida,f:comida-sola | ¿Qué comes cuando estás solo y nadie mira?
1 2 2 0 cdb,cotid,f:cosa-que-aplazas | ¿Qué cosa llevas semanas aplazando?
1 3 2 0 cdb,cotid,gente,f:llamada-pendiente | ¿A quién deberías llamar esta semana y no vas a llamar?
1 2 2 0 cdb,cotid,f:pequeño-lujo | ¿Cuál es tu pequeño lujo de la semana?
1 2 2 0 cdb,habitos,f:cosa-que-haces-mal-aposta | ¿Qué cosa haces mal a propósito para que la acabe haciendo yo?
1 2 2 0 cdb,opiniones,f:opinion-impopular | ¿Cuál es tu opinión más impopular sobre algo cotidiano?
1 3 2 0 cdb,cambios,f:cosa-ya-no-importa | ¿Qué te importaba muchísimo hace cinco años y ahora te da igual?
1 2 2 0 cdb,antes,verguenza,f:mote | ¿Qué mote tenías en el colegio?
1 2 2 0 cdb,antes,primeras,f:primera-compra-dinero | ¿Qué fue lo primero que compraste con tu propio dinero?
1 2 2 0 cdb,gente,f:persona-admirada-cerca | ¿A quién de nuestro entorno admiras en silencio?
1 2 2 0 cdb,cotid,f:tarea-placer | ¿Qué tarea de casa te gusta hacer aunque no lo reconozcas?
1 2 2 0 cdb,antes,f:profesor-recordado | ¿Qué profesor recuerdas mejor, para bien o para mal?
1 3 2 0 cdb,cotid,f:lo-que-te-preocupa | ¿Qué te preocupa estos días?
1 2 2 0 cdb,antes,f:programa-tele-infancia | ¿Qué programa de televisión no te perdías de pequeño?

## alavez vez
2 1 2 0 casa | Si esta casa tuviera un *modo invitados*, ¿qué es lo primero que cambiamos sin hablarlo cuando viene alguien?
2 1 2 0 discusiones | ¿Cuál es el tema de nuestra discusión más repetida? Decidlo a la vez.
2 1 2 0 objetos | ¿Qué objeto de casa sobra claramente pero nadie se atreve a tirar?
2 1 2 0 amigos | ¿Qué amigo nuestro llegaría primero a una emergencia a las 4 de la mañana?
3 1 2 0 amigos | ¿Qué amigo nuestro sería el peor compañero en una isla desierta?
2 1 2 0 planes | ¿Cuál fue el plan que menos esperábamos y mejor salió?
2 1 2 0 comida | Hay que pedir cena ahora mismo, sin hablar. ¿Qué pedimos?
3 3 2 0 musica | ¿Qué canción suena en vuestra cabeza al pensar en nuestro primer año?
2 1 2 0 social | ¿Quién de los dos se rendiría antes en un concurso de no hablar durante un día?
2 1 2 0 objetos | ¿Quién de los dos ha perdido más llaves a lo largo de su vida?
3 1 2 0 social | ¿Quién de los dos acabaría antes hablando con un desconocido en una cola?
3 1 2 0 fama | ¿Quién de los dos se haría famoso antes por accidente? ¿Y por qué?
3 1 2 0 vacaciones | Una palabra para nuestras últimas vacaciones.
2 1 2 0 casa | ¿Qué rincón de la casa es claramente territorio de uno de los dos?
3 1 2 0 sonidos | Si esta casa tuviera un sonido característico, ¿cuál sería?
3 1 2 0 frases | ¿Qué frase decimos los dos con demasiada frecuencia?
2 1 2 0 comida | ¿Cuál es el plato que mejor nos sale cuando cocinamos juntos?
3 1 2 0 tiempo | ¿En qué época del año somos peores personas?
2 1 2 0 tele | ¿Qué serie empezamos y nunca terminamos?
3 1 2 0 viajes | ¿Qué viaje repetiríamos exactamente igual, sin cambiar nada?
3 1 2 0 semana | ¿Qué día de la semana nos sienta peor como pareja?
2 1 2 0 casa | ¿Qué tarea de casa está más injustamente repartida?
3 1 2 0 amigos | ¿Qué amigo nuestro sería el peor guardando un secreto?
2 1 2 0 compras | ¿Qué compramos que más rápido se convirtió en un error?
3 3 2 0 nosotros | Si esta etapa de nuestra vida tuviera nombre, ¿cuál sería?
3 3 2 0 recuerdos | ¿Qué olor os lleva directamente a nuestros primeros meses?
2 1 2 0 restaurantes | Si solo pudiéramos ir a un restaurante el resto de la vida, ¿cuál?
3 1 2 0 familia | ¿Qué miembro de la familia sobreviviría mejor a un apocalipsis?
3 1 2 0 familia | ¿Qué frase de un familiar se ha convertido en una frase nuestra?
2 1 2 0 tele | ¿Cuál es nuestra película de «no sabemos qué ver»?
3 1 2 0 discusiones | ¿Qué discusión nuestra nunca se ha resuelto y probablemente nunca se resolverá?
2 3 2 0 rutinas | ¿Qué cosa pequeña convierte un día normal en un buen día para nosotros?
3 1 2 0 fiestas | ¿En qué momento exacto de una fiesta queremos irnos los dos?
3 1 2 0 comida | Tres cosas que siempre hay en nuestra nevera. Decidlas a la vez y contad cuántas coinciden.
3 3 2 0 nosotros | Una palabra que defina este último mes.
3 1 2 0 viajes | El próximo destino, si no hubiera que ponerse de acuerdo.
3 1 2 0 casa | El objeto de casa que el otro salvaría primero de un incendio.
2 1 2 0 comida | El plato que pediríamos si solo pudiéramos pedir uno para los dos.
3 1 2 0 amigos | ¿Qué amigo nuestro tiene más probabilidades de llamarnos esta semana?
2 1 2 0 casa | ¿Qué cosa de casa lleva más tiempo rota?
3 1 2 0 viajes | El próximo viaje que haremos, aunque no esté planeado.
2 1 2 0 tele | La serie que vemos cuando no queremos pensar.
3 1 2 0 nosotros | ¿Quién de los dos pediría perdón primero tras una discusión por nada?
2 1 2 0 compras | Lo último que compramos y no deberíamos.
3 1 2 0 familia | ¿A qué familiar llamaríamos primero si nos pasara algo bueno?
2 1 2 0 tiempo | ¿A qué hora cenamos de verdad, de media?
3 1 2 0 casa | ¿Qué habitación de casa necesita más una reforma?
2 1 2 0 musica | La canción que cantaríamos en un karaoke sin ponernos de acuerdo.
3 1 2 0 nosotros | ¿Quién de los dos hablaría más en una entrevista sobre nuestra pareja?
2 1 2 0 comida | El ingrediente que nunca falta cuando cocinamos juntos.
3 1 2 0 planes | El plan que siempre decimos que haremos y no hacemos.
2 1 2 0 animales | Si tuviéramos que adoptar un animal mañana, ¿cuál?
3 1 2 0 nosotros | ¿Cuál de los dos tiene mejor memoria para las fechas?
2 1 2 0 sueño | ¿Quién de los dos se duerme antes casi siempre?
3 1 2 0 viajes | El sitio donde hemos sido más felices de viaje, en una palabra.
2 1 2 0 casa | El sitio exacto de casa donde se acumulan las cosas sin dueño.
3 1 2 0 amigos | ¿Quién de los dos tiene el amigo más raro?
2 1 2 0 compras | El objeto que compramos dos veces porque creíamos no tenerlo.
3 1 2 0 discusiones | La palabra que más decimos cuando discutimos.
2 1 2 0 comida | Nuestro desayuno de domingo, en dos palabras.
3 1 2 0 nosotros | ¿Quién de los dos se iría a vivir a otra ciudad mañana mismo?
3 1 2 0 vecinos | El vecino al que mejor conocemos sin saber su nombre.
2 1 2 0 planes | Lo que haríamos con un fin de semana libre y dinero de sobra.
2 1 2 0 musica | El grupo o cantante que escuchamos los dos sin confesarlo.
2 1 2 0 familia | La frase que diría una de nuestras madres si entrara ahora mismo por la puerta.
3 1 2 0 tiempo | El año de nuestra vida que repetiríamos.
2 1 2 0 restaurantes | El restaurante al que llevaríamos a alguien para impresionarlo.
3 1 2 0 nosotros | ¿Quién de los dos perdería antes el pasaporte?
2 1 2 0 sonidos | El sonido que más se oye en casa un sábado por la mañana.
3 1 2 0 gente | La persona que mejor nos conoce aparte de nosotros.
2 1 2 0 comida | Lo que pediríamos en una pizzería sin ponernos de acuerdo.
3 1 2 0 cine | La película que ya hemos visto demasiadas veces.
2 1 2 0 nosotros | ¿Quién de los dos tiene peor sentido de la orientación?
2 1 2 0 compras | Lo que siempre olvidamos comprar.
3 1 2 0 nosotros | Nuestro mayor punto en común, en una palabra.
2 1 2 0 casa | La tarea de casa que hacemos juntos y nos sale bien.
3 1 2 0 planes | El sitio al que iremos la próxima vez que nadie quiera decidir.
2 1 2 0 gente | ¿Quién de los dos se haría antes amigo del camarero?
3 1 2 0 semana | El día de la semana que más nos gusta a los dos.
2 1 2 0 objetos | El objeto que más veces se ha perdido en esta casa.
3 1 2 0 nosotros | La palabra con la que nos describiría un desconocido tras cenar con nosotros.
2 1 2 0 comida | La comida que cada uno cree que al otro no le gusta, pero sí.
1 2 2 0 antes,primeras,f:primer-concierto | Vuestro primer concierto. Cada uno el suyo, a la vez.
1 2 2 0 antes,comida,f:comida-infancia | Un plato de vuestra infancia que nadie hace igual. A la vez.
1 2 2 0 antes,colegio,f:asignatura | La asignatura que peor se os daba. A la vez.
1 2 2 0 antes,adolescencia,f:musica-adolescente | El grupo que escuchabais a los quince años. A la vez.
1 2 2 0 antes,objetos,f:objeto-infancia | El objeto de vuestra infancia que querríais recuperar. A la vez.
1 2 2 0 cotid,rutinas,f:momento-dia | El momento del día que es solo vuestro. A la vez.
1 2 2 0 cotid,comida,f:restaurante-pendiente | El restaurante que llevamos tiempo sin probar. A la vez.
1 2 2 0 cotid,planes,f:plan-fin-de-semana | El plan que llevamos meses sin hacer. A la vez.
1 3 2 0 nosotros,f:lo-que-mas-ha-cambiado | Lo que más ha cambiado en nosotros este año. Una palabra cada uno, a la vez.
1 2 2 0 cotid,casa,f:cosa-casa-cambiarias | Lo primero que cambiaríais de esta casa. A la vez.
1 2 2 0 antes,lugares,f:lugar-vacaciones | El sitio al que ibais cada verano de pequeños. A la vez.
1 2 2 0 nosotros,f:primera-impresion | La primera impresión que os causasteis. Una palabra, a la vez.
1 2 2 0 cotid,gente,f:persona-piensas-mas | La persona en la que más habéis pensado esta semana, aparte del otro. A la vez.
1 2 2 0 antes,f:mejor-amigo-infancia | El nombre de vuestro mejor amigo a los ocho años. A la vez.
1 2 2 0 nosotros,f:viaje-pendiente | El viaje que haremos antes de que acabe el año que viene. A la vez.

## juicio jui
2 2 2 0 sueño | ¿Una siesta de más de dos horas sigue siendo una siesta? | Sí. Una siesta es una siesta, dure lo que dure. | No. A partir de dos horas es una segunda noche.
2 2 2 0 casa | ¿Quien duerme más cerca de la puerta tiene que investigar los ruidos raros? | Sí. Quien está más cerca, va. | No. Va quien oyó el ruido primero.
2 2 2 0 comida | Si pruebas la comida cinco veces mientras cocinas, ¿ya has cenado? | Sí. Cinco pruebas son una cena. | No. Probar no cuenta.
2 2 2 0 frases | ¿Es aceptable decir «ya voy» cuando todavía no te has movido? | Sí. Es una declaración de intenciones. | No. Es una mentira con buena prensa.
2 2 2 0 salud | ¿Hay que decir «salud» si alguien estornuda cinco veces seguidas? | Sí. Cada estornudo merece el suyo. | No. A partir del tercero ya es su problema.
4 2 2 0 comida | ¿Es aceptable comerse la parte crujiente de la lasaña antes de servirla? | Sí. Es la propina del cocinero. | No. Es un robo con delantal.
2 2 2 0 objetos | ¿Ponerle nombre propio a un electrodoméstico es normal? | Sí. Se lo ha ganado. | No. Es un aparato.
2 2 2 0 casa | ¿Hablar con las plantas es razonable? | Sí. Crecen mejor y escuchan. | No. Es un monólogo con hojas.
2 2 2 0 objetos | ¿Guardar bolsas dentro de una bolsa es orden o un problema? | Orden. Siempre hacen falta. | Un problema con asas.
2 2 2 0 ropa | ¿La ropa de la silla está limpia o sucia? | Limpia. Solo está descansando. | Sucia. Está en lista de espera.
2 2 2 0 comida | ¿Mojar galletas en el café es una técnica o una falta de respeto a la galleta? | Una técnica milenaria. | Una falta de respeto.
2 2 2 0 sueño | ¿Posponer la alarma tres veces es descansar o sufrir? | Descansar. Son tres minisiestas. | Sufrir. Tres despertares en vez de uno.
4 2 2 0 cine | Si te duermes en una película y sueñas el final, ¿la has visto? | Sí. Has visto un final. | No. Has visto otra película.
4 2 2 0 sueño | ¿Se puede estar enfadado con alguien por lo que hizo en tu sueño? | Sí. Tú lo viste. | No. Fue tu cerebro el que lo escribió.
2 2 2 0 casa | ¿Las plantas del balcón son mascotas o muebles? | Mascotas. Comen, beben y se mueren si las olvidas. | Muebles. No vienen cuando las llamas.
4 2 2 0 comida | ¿Un sándwich cortado en triángulos sabe mejor? | Sí. El triángulo es un formato superior. | No. Es el mismo sándwich con pretensiones.
4 2 2 0 musica | Si una canción se te pega tres días, ¿tiene derecho a salir en tu biografía? | Sí. Ha vivido contigo. | No. Fue un okupa.
4 2 2 0 casa | ¿Un robot aspirador que se atasca siempre en la misma esquina es tonto o rebelde? | Tonto. No aprende. | Rebelde. Le gusta esa esquina.
4 2 2 0 animales | Si un gato te trae un ratón, ¿es un regalo o una amenaza? | Un regalo. Es lo mejor que tiene. | Una amenaza. Te está enseñando lo que sabe hacer.
4 2 2 0 casa | Si el microondas pita y nadie va, ¿se ofende? | Sí. Por eso pita otra vez. | No. Pita porque no sabe hacer otra cosa.
4 2 2 0 animales | Un perro con abrigo, ¿va vestido o va disfrazado? | Vestido. Tiene frío como todos. | Disfrazado. Un perro no es de abrigos.
4 2 2 0 vecinos | ¿Un ascensor que se para en todos los pisos está roto o es sociable? | Roto. Hay que llamar al técnico. | Sociable. Quiere conocer a todo el mundo.
4 2 2 0 vecinos | ¿Un árbol de nuestra calle cuenta como vecino? | Sí. Lleva aquí más que nadie. | No. Nunca ha subido a una reunión.
4 2 2 0 comida | Si alguien te invita a cenar y el plato es increíble pero se olvidó de tu nombre, ¿ha sido una buena cena? | Sí. Lo importante es el plato. | No. Lo importante es saber a quién cocinas.
4 2 2 0 tiempo | Si por el cambio de hora te sobra una hora, ¿es tuya o de todos? | Tuya. Te ha caído a ti. | De todos. Hay que usarla con responsabilidad.
2 2 2 0 comida | ¿La pizza fría del desayuno es desayuno o cena atrasada? | Desayuno. Son las 9 y la estás comiendo. | Cena atrasada. La pizza no cambia de turno.
4 2 2 0 objetos | Si un paraguas te protege diez años, ¿tienes derecho a perderlo? | Sí. Ya ha cumplido. | No. Después de diez años es familia.
2 2 2 0 casa | ¿La planta que lleva un año sin crecer está viva o está de brazos cruzados? | Viva. Está ahorrando energía. | De brazos cruzados. Es una protesta.
4 2 2 0 vecinos | Un vecino que te saluda solo los martes, ¿es educado o sospechoso? | Educado. Un saludo es un saludo. | Sospechoso. ¿Qué pasa los otros días?
2 2 2 0 ropa | ¿El pijama por la tarde es ropa o una declaración? | Ropa. Tapa y abriga. | Declaración. Dice «hoy no».
4 2 2 0 cine | Si una película dura cuatro horas, ¿son dos películas? | Sí. A partir de la segunda hora es otra. | No. Una historia es una película.
2 2 2 0 comida | Si la receta dice «una pizca» y echas tres, ¿sigues la receta? | Sí. La pizca es una unidad flexible. | No. Tres pizcas son un puñado.
4 2 2 0 objetos | Si encuentras un billete en un abrigo del año pasado, ¿es un regalo o es tuyo? | Regalo. Del pasado para ti. | Tuyo. Solo estaba escondido.
2 2 2 0 sueño | ¿Dormirse en el sofá cuenta como dormir? | Sí. Estás dormido. | No. Es una siesta larga sin dignidad.
4 2 2 0 animales | Un perro que se niega a pasear bajo la lluvia, ¿es sensato o rebelde? | Sensato. Nadie quiere mojarse. | Rebelde. Un perro pasea y punto.
4 2 2 0 familia | Si tu abuela dice que estás más delgado, ¿es un cumplido o una preocupación? | Cumplido. Lo dice sonriendo. | Preocupación. Lo dice sirviendo comida.
2 2 2 0 casa | ¿Una toalla usada una vez está sucia? | Sí. Ha hecho su trabajo. | No. Solo está húmeda y lo sabe.
4 2 2 0 vecinos | Un vecino que riega las plantas a las 7 de la mañana, ¿es ejemplar o provocador? | Ejemplar. Madruga por la vida. | Provocador. Nadie riega a esa hora sin intención.
4 2 2 0 objetos | Si al montar un mueble sobra una pieza, ¿está bien montado? | Sí. Si se mantiene, está bien. | No. Esa pieza era de algo.
2 2 2 0 comida | ¿Repetir plato en un bufé es aprovechar o exceso? | Aprovechar. Lo has pagado. | Exceso. Hay una línea y la has cruzado.
4 2 2 0 tiempo | ¿Un plan aplazado tres años sigue siendo un plan? | Sí. Nunca se ha cancelado. | No. Ya es una leyenda.
2 2 2 0 frases | Decir «en cinco minutos» cuando serán veinte, ¿es optimismo o mentira? | Optimismo. Crees en ti. | Mentira. Nunca han sido cinco.
4 2 2 0 cine | Si ves una película doblada, ¿la has visto? | Sí. Has visto la historia. | No. Has visto una versión.
4 2 2 0 casa | La mesa del comedor donde nunca se come, ¿es una mesa o un almacén? | Mesa. Tiene patas y tablero. | Almacén. Lleva seis meses con cosas encima.
2 2 2 0 comida | ¿El agua con gas es agua? | Sí. Es agua con una fiesta dentro. | No. Es otra bebida.
4 2 2 0 objetos | Si pierdes un guante, ¿el otro sigue siendo un guante? | Sí. Sigue abrigando una mano. | No. Es un huérfano de tela.
2 2 2 0 casa | ¿El cajón de los cables es un sistema de organización? | Sí. Todo está en un sitio. | No. Es un agujero negro con asa.
4 2 2 0 vecinos | Si oyes cantar al vecino y canta bien, ¿es ruido? | Sí. Nadie lo ha pedido. | No. Es un concierto gratis.
4 2 2 0 comida | Si una tortilla lleva cebolla, ¿sigue siendo la misma tortilla? | Sí. Es tortilla con una mejora. | No. Es otra tortilla con el mismo nombre.
2 2 2 0 objetos | Un libro que has empezado tres veces, ¿lo has leído? | Sí. Tres veces el principio. | No. Lo has visitado.
4 2 2 0 animales | Si tu gato te ignora, ¿es independencia o una opinión sobre ti? | Independencia. Es su naturaleza. | Una opinión. Y no es buena.
2 2 2 0 casa | ¿Tiene sentido hacer la cama si la vas a deshacer por la noche? | Sí. Es un acto de fe. | No. Es trabajar para el futuro que la deshará.
4 2 2 0 cine | Comentar la película en voz alta, ¿es compañía o sabotaje? | Compañía. Es compartir. | Sabotaje. Es otra película encima.
4 2 2 0 objetos | Un reloj de pared que lleva años mal, ¿es decorativo o un mentiroso? | Decorativo. Nadie le pide nada. | Mentiroso. Miente a todas horas.
2 2 2 0 comida | Un sándwich de madrugada, ¿es la última comida del día o la primera del siguiente? | Última. Todavía no te has dormido. | Primera. Ya es mañana.
2 2 2 0 casa | Apagar la luz de una habitación vacía, ¿es ahorro o manía? | Ahorro. Cada vatio cuenta. | Manía. Nadie se arruina por una bombilla.
4 2 2 0 tiempo | ¿Una tradición de dos años ya es tradición? | Sí. Dos veces es una serie. | No. Hasta cinco es coincidencia.
4 2 2 0 objetos | Un sofá con una zona hundida, ¿está roto o personalizado? | Roto. Ya no es plano. | Personalizado. Es el molde de alguien.
2 2 2 0 comida | ¿La corteza del pan es la mejor parte o un envoltorio? | La mejor. Ahí está el sabor. | Envoltorio. Protege lo bueno.
4 2 2 0 vecinos | Un niño que te saluda cada día desde su ventana, ¿es tu amigo? | Sí. Hay constancia. | No. Es un vecino con horario.
2 2 2 0 frases | ¿«Luego lo hago» es un compromiso? | Sí. Hay un verbo y un futuro. | No. «Luego» no es una hora.
4 2 2 0 casa | Una lámpara que solo funciona con un golpe, ¿está rota o tiene carácter? | Rota. Una lámpara no pide golpes. | Carácter. Solo quiere atención.
4 2 2 0 tiempo | Si la fiesta de cumpleaños es otro día, ¿cuál es el cumpleaños de verdad? | El del calendario. Es lo que es. | El de la fiesta. Ahí está la tarta.
4 2 2 0 comida | Si el postre llega antes que el plato principal, ¿hay que esperar? | Sí. El orden es sagrado. | No. Un postre caliente no espera a nadie.
4 2 2 0 ropa | Unos zapatos que solo te pones una vez al año, ¿son tuyos o de la ocasión? | Tuyos. Están en tu armario. | De la ocasión. Tú solo los guardas.
1 2 2 0 puntualidad,convivencia,f:tarde-avisando | Llegar tarde pero avisar siempre: ¿sigue siendo ser impuntual? | Sí. Avisar no devuelve el tiempo a nadie. | No. Avisar es respeto; lo grave es el silencio.
1 2 2 0 regalos,f:regalo-util | ¿Un regalo útil puede ser más romántico que uno sentimental? | Sí. Fijarse en lo que necesitas es amor práctico. | No. Lo útil es una compra; lo romántico es otra cosa.
1 2 2 0 planes,amistad,f:cancelar-o-ir | ¿Es peor cancelar un plan a última hora o ir sin ganas? | Cancelar. Dejas a la gente colgada. | Ir sin ganas. Se nota, y arruina el plan a los demás.
1 3 2 0 privacidad,tecnologia,f:ubicacion | Compartir la ubicación permanentemente: ¿confianza o exceso? | Confianza. Si no hay nada que esconder, no molesta. | Exceso. La confianza es precisamente no necesitarlo.
1 2 2 0 regalos,dinero,f:vender-regalo | Si nunca usas algo que te regalaron, ¿está bien venderlo? | Sí. Es tuyo, y mejor que criar polvo. | No. Un regalo lleva a alguien dentro.
1 2 2 0 convivencia,f:ultimo-que-se-levanta | ¿Quien se levanta el último tiene que hacer la cama? | Sí. El último cierra el turno. | No. Cada uno su lado, como personas adultas.
1 2 2 0 amistad,f:amigo-no-llama | Un amigo que solo llama cuando necesita algo, ¿sigue siendo amigo? | Sí. Hay amistades que funcionan así y están bien. | No. Eso es un contacto con buena memoria.
1 3 2 0 dinero,pareja,f:cuentas-separadas | ¿Una pareja debería tener cuentas separadas? | Sí. Cada uno su dinero, y lo común, en común. | No. Si compartes la vida, compartes el dinero.
1 2 2 0 modales,f:movil-mesa | ¿Mirar el móvil en la mesa con amigos es de mala educación? | Sí. Siempre. Aunque sea un segundo. | Depende de para qué; hay vidas que no se apagan.
1 2 2 0 trabajo,f:trabajo-vocacion | ¿Un trabajo tiene que gustarte o basta con que te pague bien? | Tiene que gustarte. Son ocho horas al día. | Basta que pague. Lo que te gusta lo haces fuera.
1 2 2 0 familia,f:comida-familiar-obligatoria | ¿Hay que ir a todas las comidas familiares? | Sí. La familia se mantiene yendo. | No. Ir siempre por obligación las estropea.
1 2 2 0 vacaciones,f:vacaciones-descansar | ¿Las vacaciones son para descansar o para ver cosas? | Descansar. Si vuelves cansado, no eran vacaciones. | Ver cosas. Para descansar ya está el sofá.
1 2 2 0 redes,f:fotos-pareja-redes | ¿Subir fotos de pareja a redes es bonito o innecesario? | Bonito. Compartes lo que te hace feliz. | Innecesario. Lo importante no necesita público.
1 2 2 0 nostalgia,f:todo-tiempo-pasado | ¿Antes la gente se aburría mejor? | Sí. El aburrimiento era fértil. | No. Antes también había tele y se miraba igual.
1 2 2 0 modales,f:regalo-no-gusta | Si un regalo no te gusta, ¿hay que fingir? | Sí. El gesto vale más que el objeto. | No. Fingir bien es mentir bien.
1 3 2 0 convivencia,f:dormir-separados | ¿Dormir en camas separadas es un problema o una solución? | Un problema. Dormir juntos es parte de estar juntos. | Una solución. Descansar bien también es cuidar la pareja.
1 2 2 0 amistad,f:amigos-de-pareja | ¿Los amigos de uno tienen que ser amigos de los dos? | Sí. Con el tiempo, es lo natural. | No. Cada uno necesita gente que sea solo suya.
1 2 2 0 dinero,f:propina | ¿Dejar propina debería ser obligatorio? | Sí. Es parte del precio real. | No. Si quieren pagar más, que suban el precio.
1 2 2 0 trabajo,f:contestar-fuera-horario | ¿Contestar mensajes del trabajo fuera de horario es profesionalidad o un error? | Profesionalidad. Las cosas no esperan. | Un error. Enseñas que siempre estás.
1 2 2 0 regalos,f:dinero-como-regalo | ¿Regalar dinero es un buen regalo? | Sí. Nadie ha devuelto nunca dinero. | No. Es admitir que no te has molestado.
1 2 2 0 tecnologia,f:leer-mensajes-pareja | ¿Mirar el móvil de tu pareja con su permiso es normal? | Sí. Con permiso, no hay nada raro. | No. Pedir permiso ya dice algo.
1 2 2 0 convivencia,f:invitados-sin-avisar | Un amigo que viene sin avisar, ¿es cariño o invasión? | Cariño. Antes la gente llamaba a la puerta. | Invasión. Mi casa tiene horario.
1 2 2 0 familia,f:opinar-sobre-hijos-ajenos | ¿Se puede opinar sobre cómo educan otros a sus hijos? | Sí. Si te importan, opinas. | No. Nunca. Ni con la mejor intención.
1 2 2 0 modales,f:llegar-antes | ¿Llegar quince minutos antes es educado o molesto? | Educado. Mejor esperar que hacer esperar. | Molesto. Me pillas con la casa a medias.
1 2 2 0 vacaciones,f:viajar-solo-pareja | ¿Irse de viaje con amigos sin la pareja es sano? | Sí. Es necesario, incluso. | Es raro. Las mejores cosas se viven juntos.
1 2 2 0 redes,f:stories-de-todo | Subir todo lo que haces a redes, ¿es compartir o vivir para los demás? | Compartir. Es el álbum de ahora. | Vivir para los demás. Si no lo subes, ¿no ha pasado?
1 2 2 0 dinero,f:prestar-dinero-amigos | ¿Se le presta dinero a un amigo? | Sí. Para eso están los amigos. | No. Si quieres conservarlo, regálaselo.
1 2 2 0 convivencia,f:tele-en-la-cama | ¿La tele en el dormitorio es un lujo o un error? | Un lujo. Ver algo tumbado es la vida. | Un error. El dormitorio es para otras cosas.
1 2 2 0 trabajo,f:cambiar-trabajo-por-dinero | ¿Cambiarías un trabajo que te gusta por otro peor que paga el doble? | Sí. El dinero compra tiempo. | No. Ocho horas infelices no se compensan.
1 2 2 0 amistad,f:contar-secreto-pareja | Contarle a tu pareja un secreto que te confió un amigo, ¿es traición? | Sí. Un secreto es un secreto. | No. La pareja no cuenta como otra persona.
1 2 2 0 nostalgia,f:musica-de-antes | ¿La música de tu adolescencia era mejor o solo eras más joven? | Era mejor. Objetivamente. | Eras más joven. Todo suena mejor a los quince.
1 2 2 0 modales,f:devolver-llamada | Si alguien te llama y no contestas, ¿hay que devolver la llamada? | Sí. Siempre. Es básico. | No. Si era importante, me escribe.
1 2 2 0 familia,f:casa-padres-navidad | ¿Hay que pasar la Navidad con la familia cada año? | Sí. Son dos días y hacen mucho. | No. La Navidad también puede ser nuestra.
1 2 2 0 regalos,f:regalo-caro-o-pensado | ¿Mejor un regalo caro o uno pensado? | Caro. Lo pensado se dice con palabras. | Pensado. Lo caro lo compra cualquiera.
1 2 2 0 convivencia,f:comer-en-el-sofa | ¿Cenar en el sofá entre semana es normal o una decadencia? | Normal. La mesa es para las visitas. | Decadencia. Una cena es un momento.
1 2 2 0 trabajo,f:amigos-del-trabajo | ¿Los compañeros de trabajo pueden ser amigos de verdad? | Sí. Compartes más horas con ellos que con nadie. | No. Son amigos del contexto.
1 2 2 0 tecnologia,f:fotos-de-todo | Hacer fotos de todo, ¿es guardar recuerdos o no vivir el momento? | Guardar. Luego las agradeces. | No vivir. Estás mirando una pantalla.
1 2 2 0 vacaciones,f:planificar-viaje | ¿Un viaje hay que planificarlo o improvisarlo? | Planificar. Improvisar es perder el tiempo caro. | Improvisar. Lo mejor nunca estaba en el plan.
1 2 2 0 dinero,f:pagar-a-medias | ¿En una cena en pareja hay que pagar a medias? | Sí. Es lo justo y lo moderno. | No. Que invite quien pueda y le apetezca.
1 2 2 0 amistad,f:amigo-ex | ¿Se puede seguir siendo amigo de un ex? | Sí. Si hubo cariño, queda cariño. | No. Alguien siempre quiere algo más.
1 2 2 0 modales,f:llegar-tarde-cena | Si una cena es a las nueve, ¿a qué hora llegas? | A las nueve. Se dice una hora por algo. | A las nueve y cuarto. Llegar en punto es agresivo.
1 2 2 0 convivencia,f:cosas-del-otro-tirar | ¿Se puede tirar algo de tu pareja sin preguntar? | Sí, si es basura evidente. | No. Nunca. Ni un calcetín.
1 3 2 0 pareja,f:secretos-en-pareja | ¿Una pareja puede tener secretos sanos? | Sí. No todo hay que contarlo. | No. Lo que no se cuenta acaba pesando.
1 2 2 0 trabajo,f:jefe-amigo | ¿Un jefe puede ser amigo? | Sí. La gente es gente. | No. El día que te despide, te lo aclara.
1 2 2 0 nostalgia,f:volver-a-vivir-donde-creciste | ¿Volverías a vivir en el barrio donde creciste? | Sí. Ahí está todo lo que importa. | No. Se vuelve de visita, no a vivir.
1 2 2 0 familia,f:padres-opinan-pareja | ¿Los padres pueden opinar sobre la pareja de un hijo? | Sí. Te conocen más que nadie. | No. Es la única opinión que no se pide.
1 2 2 0 redes,f:borrar-fotos-ex | ¿Hay que borrar las fotos con un ex? | Sí. Es una vida que terminó. | No. Son recuerdos, no trofeos.
1 2 2 0 modales,f:corregir-en-publico | ¿Corregir a tu pareja delante de otros es ayudarla o humillarla? | Ayudarla. Mejor que siga diciendo algo mal. | Humillarla. Se corrige en casa.
1 2 2 0 dinero,f:lujo-justificado | ¿Gastar mucho en algo que usas cada día es lujo o sentido común? | Lujo. Caro es caro. | Sentido común. Lo barato sale caro.
1 2 2 0 convivencia,f:mascota-en-la-cama | ¿Las mascotas pueden dormir en la cama? | Sí. Son de la familia. | No. Son de la familia y tienen su cama.
1 2 2 0 vacaciones,f:mismo-sitio-cada-ano | ¿Ir siempre al mismo sitio de vacaciones es cómodo o un fracaso? | Cómodo. Saber dónde está todo es descansar. | Un fracaso. El mundo es grande.
1 2 2 0 amistad,f:amigo-que-no-felicita | Si un amigo olvida tu cumpleaños, ¿es grave? | Sí. Un cumpleaños se recuerda. | No. La amistad no es un calendario.
1 2 2 0 tecnologia,f:movil-en-el-baño | ¿Llevarse el móvil al baño es normal? | Sí. Todo el mundo lo hace. | No. Hay sitios sagrados.
1 2 2 0 trabajo,f:llorar-en-el-trabajo | ¿Llorar en el trabajo es humano o poco profesional? | Humano. Trabajan personas. | Poco profesional. Hay un sitio para cada cosa.
1 2 2 0 modales,f:regalo-regalado | ¿Regalar algo que te regalaron a ti es reciclaje o traición? | Reciclaje. Que llegue a quien lo quiera. | Traición. A dos personas a la vez.
1 2 2 0 pareja,f:contraseñas-compartidas | ¿Una pareja debería conocer las contraseñas del otro? | Sí. No hay nada que esconder. | No. La privacidad no es un secreto.
1 2 2 0 familia,f:herencia-reparto | ¿Una herencia se reparte a partes iguales o según quién cuidó? | A partes iguales. Lo demás es un conflicto seguro. | Según quién cuidó. Lo justo no siempre es igual.
1 2 2 0 convivencia,f:silencio-en-casa | ¿Estar en casa en silencio, cada uno a lo suyo, es intimidad o distancia? | Intimidad. Solo se calla con quien se está bien. | Distancia. Si no hay nada que decir, algo pasa.
1 2 2 0 nostalgia,f:colegio-mejor-epoca | ¿La época del colegio fue la mejor de la vida? | Sí. Sin facturas, con amigos a diario. | No. Era obligatoria y nadie elegía nada.
1 2 2 0 dinero,f:ahorrar-o-vivir | ¿Mejor ahorrar para después o gastar ahora? | Ahorrar. El después llega siempre. | Gastar. El ahora es lo único seguro.
1 2 2 0 modales,f:plato-del-otro | ¿Se puede coger comida del plato de tu pareja sin preguntar? | Sí. Lo que es de uno es de los dos. | No. Un plato es un territorio.
1 2 2 0 redes,f:no-tener-redes | ¿No tener redes sociales es de persona sana o de persona rara? | Sana. Vive sin público. | Rara. Se está perdiendo cómo se habla hoy.
1 2 2 0 trabajo,f:fin-de-semana-trabajo | ¿Trabajar un fin de semana por un proyecto propio es pasión o un error? | Pasión. El tiempo bien gastado no cansa. | Un error. El descanso también es trabajo.
1 2 2 0 vacaciones,f:vacaciones-con-familia | ¿Ir de vacaciones con los padres siendo adulto es un plan o un sacrificio? | Un plan. Son días que no vuelven. | Un sacrificio. Se quiere a la familia a distancia de autopista.
1 2 2 0 amistad,f:amistad-a-distancia | ¿Una amistad que solo vive por mensajes sigue siendo amistad? | Sí. Lo que importa es la constancia. | No. Sin verse, se convierte en noticia.
1 2 2 0 convivencia,f:discusion-antes-de-dormir | ¿Hay que resolver una discusión antes de dormir? | Sí. Nunca te duermas enfadado. | No. Dormir arregla más que hablar cansado.
1 2 2 0 pareja,f:celos-un-poco | ¿Un poco de celos es sano? | Sí. Es la prueba de que importa. | No. Es la prueba de que algo falla.
1 2 2 0 modales,f:regalos-de-cumpleaños-adultos | ¿Los adultos deberían seguir haciéndose regalos de cumpleaños? | Sí. Un regalo es decir «me acordé». | No. A partir de cierta edad, basta una cena.
1 2 2 0 dinero,f:comprar-barato-varias-veces | ¿Comprar barato y cambiar a menudo es inteligente o un desperdicio? | Inteligente. Te cansas de todo igual. | Desperdicio. Lo bueno se compra una vez.
1 2 2 0 familia,f:fotos-niños-ajenos-redes | ¿Está bien subir fotos de los hijos de otros a redes? | Sí, si los padres no dicen nada. | No. Nunca sin preguntar.
1 2 2 0 tecnologia,f:series-por-separado | ¿Ver sin tu pareja un capítulo de la serie que veis juntos es traición? | Sí. Es el pacto más sagrado que hay. | No. Es un capítulo, no un secreto.
1 2 2 0 nostalgia,f:conservar-cosas-infancia | ¿Hay que guardar las cosas de la infancia o soltarlas? | Guardar. Son la prueba de quién fuiste. | Soltar. Lo que importa está en la memoria.
1 2 2 0 convivencia,f:quien-cocina-no-friega | ¿Quien cocina no friega? | Sí. Es la ley más justa que existe. | No. Quien cocina ensucia, y eso cuenta.
1 2 2 0 trabajo,f:hablar-de-trabajo-en-casa | ¿Hablar del trabajo en casa es compartir o contaminar? | Compartir. Es un tercio de la vida. | Contaminar. En casa, el trabajo se queda fuera.
1 2 2 0 amistad,f:amigo-que-cambia | Si un amigo cambia mucho, ¿se mantiene la amistad por historia? | Sí. La historia también es amistad. | No. La amistad es presente, o no es.
1 2 2 0 modales,f:oler-comida-ajena | ¿Preguntar «¿qué es eso?» mirando el plato de un desconocido es simpático o invasivo? | Simpático. La comida une. | Invasivo. Come y calla.
1 2 2 0 pareja,f:planes-por-separado | ¿Hacer planes por separado el fin de semana es sano o una señal? | Sano. Hay que echarse de menos. | Una señal. Los fines de semana son para los dos.
1 2 2 0 dinero,f:decir-cuanto-ganas | ¿Decir cuánto ganas a los amigos es transparencia o mal gusto? | Transparencia. Ayuda a todos. | Mal gusto. Hay cosas que no se cuentan.
1 2 2 0 vacaciones,f:madrugar-de-vacaciones | ¿Madrugar de vacaciones es aprovechar o un contrasentido? | Aprovechar. El día es largo. | Un contrasentido. Vacaciones es no tener alarma.
1 2 2 0 redes,f:likes-a-ex | ¿Dar «me gusta» a fotos de un ex es inocente? | Sí. Es un botón. | No. Un botón también habla.
1 2 2 0 familia,f:nombre-hijo-familiar | ¿Ponerle a un hijo el nombre de un familiar es un homenaje o una carga? | Un homenaje. Los nombres llevan historias. | Una carga. Cada persona merece empezar de cero.
1 2 2 0 convivencia,f:visitas-largas | ¿Cuántos días puede quedarse una visita en casa antes de ser un problema? | Los que haga falta. Es familia o amigos. | Tres. Al cuarto, ya convives.
1 2 2 0 modales,f:decir-que-no-sin-excusa | ¿Se puede decir «no me apetece» sin dar más explicaciones? | Sí. Es la excusa más honesta. | No. A la gente se le debe un motivo.
1 2 2 0 nostalgia,f:mejor-epoca-propia | ¿Tu mejor época ya ha pasado? | Sí. Y está bien que así sea. | No. La mejor época es siempre la próxima.
1 2 2 0 trabajo,f:ambicion-necesaria | ¿Hay que querer ascender o basta con estar bien? | Hay que querer más. Si no, te estancas. | Basta estar bien. Más responsabilidad no es más vida.
1 2 2 0 tecnologia,f:televisor-grande | ¿Un televisor enorme mejora la vida o la ocupa? | La mejora. El cine en casa es una conquista. | La ocupa. Un salón no es una sala.
1 2 2 0 amistad,f:presentar-amigos-entre-si | ¿Hay que presentar a los amigos de distintos grupos? | Sí. Cuanta más mezcla, mejor. | No. Cada grupo tiene su versión de ti.
1 2 2 0 pareja,f:pareja-sin-reir | ¿Una pareja que no se ríe junta tiene futuro? | Sí. No todo es reírse. | No. La risa es el pegamento.
1 2 2 0 dinero,f:regalo-caro-a-si-mismo | ¿Regalarse algo caro a uno mismo sin motivo es sano? | Sí. Nadie se cuida como uno mismo. | No. Sin motivo es solo gastar.
1 2 2 0 convivencia,f:toalla-compartida | ¿Compartir toalla con tu pareja es normal? | Sí. Compartes más que eso. | No. Cada uno la suya, por favor.
1 2 2 0 familia,f:cuñados-amigos | ¿Los cuñados pueden ser amigos de verdad? | Sí. Algunos son la mejor parte de la familia. | No. Son amistad por contrato.
1 2 2 0 modales,f:avisar-antes-de-llamar | ¿Hay que escribir antes de llamar? | Sí. Una llamada sin aviso es una emergencia. | No. Un teléfono es para llamar.
1 2 2 0 vacaciones,f:trabajar-un-poco-de-vacaciones | ¿Contestar un correo de trabajo de vacaciones es una traición al descanso? | Sí. Un correo abre la puerta a todos. | No. Cinco minutos y sigues en la playa.
1 2 2 0 nostalgia,f:revisitar-sitios | ¿Volver a un sitio donde fuiste feliz es un regalo o un riesgo? | Un regalo. Lo bueno vuelve. | Un riesgo. Lo bueno estaba en el momento.
1 2 2 0 trabajo,f:decir-no-se-en-trabajo | ¿Decir «no lo sé» en el trabajo es honestidad o debilidad? | Honestidad. Mejor que inventar. | Debilidad. Se dice «lo miro» y luego lo averiguas.
1 2 2 0 amistad,f:amigo-que-no-te-gusta-su-pareja | Si no te gusta la pareja de un amigo, ¿se lo dices? | Sí. Para eso están los amigos. | No. Se lo dirá la vida.
1 2 2 0 pareja,f:recordar-aniversario | ¿Olvidar un aniversario es grave? | Sí. Hay una fecha porque importa. | No. Lo grave es olvidar lo que celebra.

## caos caos
2 any | Abogado | Durante las próximas dos cartas, cada uno puede *impugnar* una respuesta del otro. Quien sea impugnado tiene 15 segundos para defenderla o cambiarla.
3 any | Prohibido «depende» | Durante tres cartas nadie puede responder «depende». Quien lo diga pierde el derecho a réplica en esa carta.
1 any | Espejo | En la siguiente carta, responde primero como crees que respondería tu pareja. Después, la tuya.
1 any | Interrogatorio | Después de la siguiente respuesta, el otro puede hacer tres preguntas de seguimiento. Hay que contestarlas todas.
1 any | Sin contexto | La siguiente respuesta se da sin explicación. El otro intenta adivinar el motivo antes de que lo cuentes.
1 juicio | Cambio de bando | En el próximo Juicio, cada uno defiende la postura que no comparte.
5 veto | Derecho a veto | Durante las próximas cinco cartas, cada uno tiene un veto para saltarse una carta sin dar explicaciones.
1 any | Testigo | Después de la siguiente respuesta, el otro cuenta una situación real que la confirme o la desmienta.
2 any | Traductor | Durante dos cartas, el otro resume cada respuesta en cinco palabras exactas. Si no lo consigue, hay que explicarse mejor.
2 any | Turno cambiado | Durante dos cartas, empieza a responder quien normalmente respondería después.
1 any | Pregunta de vuelta | Después de responder la siguiente carta, devuélvele la misma pregunta a tu pareja.
1 any | Abogado del diablo | En la siguiente carta, el otro tiene que llevarte la contraria, aunque esté de acuerdo.
2 any | Pruebas | Durante dos cartas, cada respuesta necesita un ejemplo real de vuestra vida. Sin ejemplo, no vale.
1 any | Hace cinco años | Después de la siguiente respuesta, el otro dice qué habrías respondido hace cinco años.
1 any | Lugar común | La siguiente respuesta tiene que incluir un sitio donde hayáis estado juntos.
2 any | Juez | Durante dos cartas, quien no responde decide si la respuesta convence. Si no, se repite mejor.
1 any | Te empiezo yo | En la siguiente carta, el otro empieza tu respuesta con una frase y tú tienes que continuarla.
1 any | Pregunta extra | Después de la siguiente carta, el otro inventa una pregunta relacionada y tienes que contestarla.
0 now | Confesión menor | Ahora mismo, cada uno confiesa algo pequeñísimo que nunca había mencionado. Nada grave.
1 juicio | Jurado familiar | Después del próximo Juicio, cada uno dice qué postura habría defendido su madre, y por qué.
1 any | Tres palabras | Antes de la siguiente respuesta, el otro elige tres palabras que tienes que usar en ella.
1 any | Eco | Después de la siguiente respuesta, el otro intenta repetirla con tus mismas palabras.
0 now | Brindis | Levantad lo que estéis bebiendo. Cada uno brinda por algo muy concreto y muy poco importante de esta semana.
1 any | Mentira escondida | En la siguiente carta, cuela una mentira pequeña en tu respuesta. El otro tiene que encontrarla.
1 any | Doble respuesta | La siguiente carta se responde dos veces: la que dirías delante de mí y la que dirías si no estuviera.
1 any | Respuesta robada | En la siguiente carta, el otro responde por ti. Tú solo puedes corregir una cosa.
1 any | Condición extra | Antes de responder la siguiente carta, el otro añade una condición ridícula a la pregunta.
1 any | Pista | Antes de la siguiente respuesta, das una pista de una sola palabra. El otro intenta adivinar lo que vas a decir.
1 any | Devuélvela | Después de la siguiente carta, quien la ha respondido inventa una pregunta igual de rara para el otro.
1 any | Primera impresión | Antes de la siguiente respuesta, el otro dice en una frase lo que cree que vas a responder. Después respondes de verdad.
1 any | Más detalles | Después de la siguiente respuesta, el otro puede decir «más detalles» hasta tres veces. Cada vez hay que añadir algo nuevo.
2 any | Pregunta del público | Durante dos cartas, después de cada respuesta el otro hace una pregunta como si fuera del público: «Hola, una pregunta rápida».
0 now | Sinopsis | Resumid la partida hasta ahora en una frase cada uno, como si fuera la sinopsis de una serie.
2 any | Entrevista | Durante dos cartas, quien no responde hace la pregunta con sus propias palabras y añade una de seguimiento. Si no la añade, responde él también.
1 any | Apuesta | Antes de la siguiente respuesta, el otro dice en una palabra lo que cree que vas a responder. Si acierta, tú le debes una respuesta extra a la pregunta que él quiera.
1 any | Contraejemplo | Después de la siguiente respuesta, el otro busca un momento real en que hiciste justo lo contrario. Si lo encuentra, lo explicas.
2 any | Segunda opinión | Durante dos cartas, después de cada respuesta el otro añade lo que cree que has dejado fuera. Tú solo puedes decir «cierto» o «ni de lejos».
1 any | Capítulo anterior | Después de la siguiente respuesta, el otro cuenta qué pasó justo antes en esa historia, inventándolo si hace falta. Tú corriges lo que no fue así.
1 any | Misma historia | La siguiente carta la respondéis los dos sobre el mismo recuerdo compartido. Cada uno cuenta su versión; ninguna de las dos es la buena.

## libre antes
1 3 1 0 habitacion,adolescencia,f:habitacion-adolescente | ¿Qué había en tu habitación de adolescente que hoy me sorprendería muchísimo?
1 2 2 0 habitacion,infancia,f:habitacion-infancia | ¿Qué veías desde la ventana de tu habitación de pequeño? Descríbelo con todo el detalle que puedas.
1 3 1 0 infancia,lugares,f:primer-solo | ¿Cuál fue el primer sitio al que recuerdas haber ido solo?
1 2 2 0 comida,infancia,f:comida-infancia | ¿Qué comida de tu infancia no sabe igual en ningún otro sitio, y quién la hacía?
2 3 1 0 profesores,colegio,f:profesor-entiendes | ¿Hubo algún profesor que te cayera fatal y ahora entiendas mejor?
1 3 2 0 compras,primeras,f:compra-esperada | ¿Qué compra recuerdas haber esperado muchísimo para poder hacer? ¿Cuánto duró la ilusión?
2 3 1 0 habitos,cambios,f:dejaste-de-hacer | ¿Qué cosa hacías todos los días durante una etapa y un día simplemente dejaste de hacer?
1 2 2 0 colegio,amigos,f:patio | ¿A qué jugabas en el patio del colegio, y con quién? Nombres.
2 3 1 0 colegio,verguenza,f:verguenza-colegio | ¿Cuál fue tu peor momento de vergüenza en el colegio, de esos que todavía te hacen cerrar los ojos?
1 2 2 0 adolescencia,estetica,f:etapa-estetica | ¿Qué etapa estética tuviste que hoy negarías delante de desconocidos? Descríbela con cariño.
2 3 1 0 obsesiones,adolescencia,f:obsesion | ¿Con qué estuviste obsesionado durante un año entero y luego desapareció sin dejar rastro?
1 3 1 0 hobbies,f:hobby-abandonado | ¿Qué hobby abandonaste y todavía tienes guardado el material por si acaso?
1 2 2 0 vacaciones,familia,f:vacaciones-familia | ¿Cómo eran las vacaciones con tu familia? Cuéntame un día entero, de la mañana a la noche.
2 3 1 0 libertad,adolescencia,f:primera-libertad | ¿Cuál fue la primera vez que sentiste que eras libre de verdad? ¿Dónde estabas?
2 3 1 0 rebeldia,adolescencia,f:rebeldia | ¿Cuál fue tu rebeldía más pequeña y más orgullosa? De esas que nadie llegó a descubrir.
1 2 2 0 lugares,desaparecidos,f:lugar-desaparecido | ¿Qué sitio de tu infancia ya no existe, y qué hay ahora en su lugar?
2 3 1 0 decisiones,f:decision-pequeña | ¿Qué decisión tomaste en cinco minutos que acabó cambiando años de tu vida?
1 2 2 0 trabajo,primeras,f:primer-trabajo | ¿Cómo fue tu primer día de tu primer trabajo? ¿Qué llevabas puesto?
2 3 1 0 gente,olvidados,f:persona-olvidada | ¿Qué persona fue importante para ti durante una etapa y hoy no sabes dónde está?
1 2 2 0 tradiciones,familia,f:tradicion-familiar | ¿Qué tradición rara tenía tu familia que de niño creías que tenían todas las familias?
1 3 1 0 objetos,infancia,f:objeto-infancia | ¿Qué objeto de tu infancia te gustaría tener ahora mismo en las manos?
2 3 1 0 sueños,infancia,f:sueño-antiguo | ¿Qué querías ser a los diez años, y en qué momento exacto dejaste de quererlo?
2 3 1 0 recuerdos,especificos,f:recuerdo-nitido | Cuéntame un recuerdo tuyo tan concreto que no tenga ningún sentido que lo recuerdes.
1 2 2 0 amigos,infancia,f:mejor-amigo-infancia | ¿Quién era tu mejor amigo a los ocho años? ¿Qué hacíais juntos y qué fue de esa persona?
1 2 2 0 colegio,f:asignatura | ¿Qué asignatura se te daba bien sin esforzarte y cuál te hacía sufrir aunque estudiaras?
2 2 2 0 profesores,f:profesor-frase | ¿Qué frase de un profesor te acompañó más tiempo del que esa persona imaginaría?
1 2 2 0 habitacion,adolescencia,f:paredes | ¿Qué tenías colgado en las paredes a los quince años? Y en el techo.
2 3 1 0 adolescencia,musica,f:musica-adolescente | ¿Qué música escuchabas a escondidas porque no encajaba con tu grupo de entonces?
1 2 2 0 compras,primeras,f:primera-compra-dinero | ¿Qué fue lo primero que compraste con dinero que habías ganado tú?
1 2 2 0 comida,infancia,f:comida-odiada | ¿Qué comida odiabas de pequeño y ahora pides en restaurantes?
2 3 1 0 verguenza,f:mentira-infancia | ¿Qué mentira contaste de niño que se te fue de las manos?
1 2 2 0 vacaciones,lugares,f:lugar-vacaciones | ¿A qué sitio volvías cada verano? ¿Qué era lo primero que hacías al llegar?
2 3 1 0 primeras,f:primera-vez-solo-casa | ¿Qué hiciste la primera vez que te quedaste solo en casa sin nadie vigilando?
1 2 2 0 tecnologia,infancia,f:primer-aparato | ¿Cuál fue el primer aparato que fue tuyo de verdad, sin compartir? ¿Qué hacías con él?
2 3 1 0 habitos,f:ritual-infancia | ¿Qué ritual tenías de pequeño antes de dormir que nunca le has contado a nadie?
1 2 2 0 colegio,amigos,f:mote | ¿Qué mote te pusieron en el colegio y quién lo inventó?
2 3 1 0 gente,f:adulto-raro | ¿Qué adulto de tu infancia te parecía fascinante y hoy entiendes que era simplemente raro?
1 2 2 0 objetos,coleccion,f:coleccion | ¿Qué coleccionabas? ¿Dónde está ahora esa colección?
2 3 1 0 decisiones,f:camino-no-tomado | ¿Qué camino estuviste a punto de tomar y no tomaste por un detalle tonto?
1 2 2 0 familia,casa,f:casa-abuelos | ¿Cómo olía la casa de tus abuelos? ¿Qué objeto de allí recuerdas mejor?
2 3 1 0 adolescencia,f:primera-salida-noche | ¿Cómo fue la primera noche que saliste hasta tarde? ¿Qué excusa diste al volver?
1 2 2 0 cine,infancia,f:pelicula-repetida | ¿Qué película viste tantas veces de pequeño que todavía te sabes frases enteras?
2 3 1 0 trabajo,f:trabajo-olvidado | ¿Qué trabajo tuviste que casi nunca mencionas? ¿Por qué?
1 2 2 0 compras,ropa,f:prenda-importante | ¿Qué prenda fue importantísima para ti en algún momento, y por qué?
2 3 1 0 verguenza,amor | ¿De quién estuviste enamorado en el colegio sin que esa persona llegara a enterarse nunca?
1 2 2 0 infancia,juegos,f:juego-inventado | ¿Qué juego inventaste de pequeño, con sus reglas? Explícamelas.
2 3 1 0 familia,f:frase-padres | ¿Qué frase de tus padres te prometiste no decir nunca, y ya has dicho?
1 2 2 0 lugares,f:camino-colegio | ¿Cómo era el camino al colegio? ¿Qué mirabas por el camino cada día?
2 3 1 0 primeras,viajes,f:primer-viaje-sin-padres | ¿Cómo fue tu primer viaje sin tus padres? ¿Qué salió mal?
1 2 2 0 comida,f:merienda | ¿Qué merendabas al volver del colegio? ¿Quién te lo preparaba?
2 3 1 0 gente,f:persona-que-te-vio | ¿Quién fue la primera persona que vio algo en ti antes de que tú lo vieras?
1 2 2 0 tecnologia,adolescencia,f:internet-primero | ¿Qué fue lo primero que hiciste cuando tuviste internet para ti solo?
2 3 1 0 habitos,f:miedo-infancia-real | ¿A qué le tenías miedo de pequeño y qué hacías para que no se notara?
1 2 2 0 habitacion,f:escondite | ¿Dónde escondías las cosas de pequeño? ¿Qué escondías?
2 3 1 0 adolescencia,f:grupo-amigos | ¿Cómo era tu grupo de amigos a los dieciséis? ¿Qué papel tenías tú?
1 2 2 0 objetos,f:regalo-infancia | ¿Qué regalo de pequeño recuerdas mejor, y quién te lo hizo?
2 3 1 0 sueños,f:sueño-abandonado-sin-pena | ¿Qué sueño abandonaste sin ninguna pena, y cuál te dolió dejar?
1 2 2 0 colegio,f:excursion | ¿Qué excursión del colegio recuerdas mejor? ¿Qué pasó?
2 3 1 0 familia,tradiciones,f:navidad-infancia | ¿Cómo era la Navidad en tu casa de pequeño? ¿Qué parte del día esperabas más?
1 2 2 0 deporte,f:deporte-infancia | ¿Qué deporte o actividad te obligaron a hacer de pequeño? ¿Cuánto aguantaste?
2 3 1 0 verguenza,adolescencia,f:ridiculo-adolescente | ¿Cuál fue tu mayor ridículo adolescente, visto hoy con cariño?
1 2 2 0 musica,primeras,f:primer-concierto | ¿Cuál fue tu primer concierto? ¿Con quién fuiste y qué recuerdas de verdad?
2 3 1 0 decisiones,f:consejo-ignorado | ¿Qué consejo ignoraste de joven y hoy sabes que era bueno?
1 2 2 0 lugares,f:barrio-infancia | ¿Cómo era tu barrio de pequeño? ¿Quién era el personaje del barrio?
2 3 1 0 gente,profesores,f:adulto-ayudo | ¿Qué adulto te ayudó de pequeño sin que tú supieras entonces que te estaba ayudando?
1 2 2 0 comida,f:restaurante-infancia | ¿A qué restaurante os llevaban de pequeños para celebrar algo? ¿Qué pedías siempre?
2 3 1 0 habitos,f:talento-perdido | ¿Qué sabías hacer de pequeño que hoy serías incapaz de repetir?
1 2 2 0 juegos,f:juguete-roto | ¿Qué juguete se rompió y nunca lo superaste del todo?
2 3 1 0 adolescencia,f:diario | ¿Escribías un diario? ¿Qué pondría la página más vergonzosa?
1 2 2 0 familia,f:coche-familiar | ¿Cómo era el coche de tu familia? ¿Dónde te sentabas y qué hacías en los viajes largos?
2 3 1 0 primeras,f:primera-vez-llorar-pelicula | ¿Cuál fue la primera película o libro que te hizo llorar? ¿Lo escondiste?
1 2 2 0 colegio,f:castigo | ¿Cuál fue el castigo más injusto que te pusieron en el colegio?
2 3 1 0 gente,f:vecino-infancia | ¿Qué vecino de tu infancia recuerdas mejor? ¿Qué sabías de esa persona?
1 2 2 0 habitos,f:programa-tele-infancia | ¿Qué programa de televisión no te perdías de pequeño? ¿A qué hora era?
2 3 1 0 trabajo,f:jefe-primero | ¿Cómo era tu primer jefe? ¿Qué aprendiste de esa persona sin querer?
1 2 2 0 adolescencia,f:ropa-adolescente | ¿Qué ropa te ponías para parecer mayor? ¿Funcionaba?
2 3 1 0 recuerdos,f:dia-perfecto-infancia | Cuéntame un día perfecto de tu infancia, de esos que no sabías que eran perfectos.
1 2 2 0 primeras,f:primera-mascota | ¿Cuál fue tu primera mascota, aunque fuera un pez? ¿Cómo se llamaba y qué pasó?
2 3 1 0 verguenza,f:secreto-infancia | ¿Qué secreto guardaste de pequeño durante años? ¿Alguien lo supo al final?
1 2 2 0 compras,f:ahorros | ¿Para qué ahorraste por primera vez? ¿Llegaste a comprarlo?
2 3 1 0 cambios,f:cuando-te-hiciste-mayor | ¿En qué momento exacto sentiste que ya no eras un niño?
1 2 2 0 habitos,f:verano-aburrido | ¿Qué hacías en las tardes de verano en las que no había nada que hacer?
2 3 1 0 familia,f:cosa-familia-descubriste | ¿Qué descubriste de tu familia ya de mayor que te hizo ver tu infancia de otra forma?
1 2 2 0 colegio,amigos,f:cumpleaños-infancia | ¿Cómo eran tus cumpleaños de pequeño? ¿Cuál recuerdas mejor?
2 3 1 0 gente,f:persona-dejo-de-hablar | ¿Con quién dejaste de hablar sin que hubiera ningún motivo claro?
1 2 2 0 lugares,f:sitio-secreto | ¿Tenías un sitio secreto de pequeño? ¿Qué hacías allí?
2 3 1 0 adolescencia,f:cancion-epoca | ¿Qué canción te devuelve de golpe a una época concreta? ¿A cuál?
1 2 2 0 habitos,f:lectura-infancia | ¿Qué leías de pequeño una y otra vez? ¿Todavía lo tienes?
2 3 1 0 decisiones,f:cosa-que-casi-no-haces | ¿Qué cosa estuviste a punto de no hacer y hoy te alegra haber hecho?
1 2 2 0 familia,f:plato-madre-padre | ¿Qué plato hacía tu madre o tu padre que nadie ha conseguido imitar? ¿Lo has intentado?
2 3 1 0 verguenza,f:fama-colegio | ¿Por qué eras conocido en el colegio? ¿Era justo?
1 2 2 0 objetos,f:mochila | ¿Qué llevabas siempre en la mochila de adolescente que no era material escolar?
2 3 1 0 recuerdos,f:conversacion-recordada | ¿Qué conversación de hace muchos años recuerdas casi palabra por palabra?
1 2 2 0 primeras,f:primer-viaje-avion | ¿Cómo fue tu primer vuelo en avión? ¿Qué te sorprendió más?
2 3 1 0 habitos,f:cosa-tonta-orgullo | ¿Qué cosa tonta hiciste de joven de la que, en el fondo, sigues orgulloso?
1 2 2 0 tradiciones,f:domingos-infancia | ¿Cómo eran los domingos en tu casa de pequeño?
2 3 1 0 cambios,f:version-de-ti-20 | ¿Qué le sorprendería más de tu vida de ahora a tu yo de veinte años?
1 2 2 0 adolescencia,f:lugar-quedar | ¿Dónde quedabais con los amigos de adolescente? ¿Qué hacíais allí exactamente?
2 3 1 0 gente,f:primera-decepcion | ¿Quién fue la primera persona que te decepcionó de verdad?
1 2 2 0 compras,f:compra-mala-primera | ¿Cuál fue la primera compra de la que te arrepentiste nada más llegar a casa?
2 3 1 0 recuerdos,f:olor-infancia | ¿Qué olor te lleva directamente a tu infancia? ¿Dónde lo olías?
1 2 2 0 habitos,f:excusa-colegio | ¿Qué excusa usabas para no ir al colegio? ¿Colaba?
2 3 1 0 sueños,f:vida-imaginada | ¿Cómo imaginabas tu vida a los treinta cuando tenías quince? ¿Qué parte has cumplido sin querer?

## libre cotid
1 2 2 0 rutinas,f:momento-dia | ¿Qué momento del día es tuyo de verdad, aunque dure diez minutos?
1 2 2 0 casa,f:rincon-casa | ¿En qué sitio de la casa piensas mejor? ¿Y en cuál no consigues pensar nada?
1 2 2 0 trabajo,f:parte-trabajo | ¿Qué parte de tu trabajo te gusta de verdad y nunca cuentas?
1 3 1 0 gente,f:conversacion-pendiente | ¿Con quién te gustaría tener una conversación larga y no encuentras el momento?
1 2 2 0 compras,f:compra-reciente-feliz | ¿Qué compra pequeña de este año te ha hecho más feliz de lo que debería?
1 2 2 0 rutinas,f:cosa-que-aplazas | ¿Qué cosa llevas aplazando semanas y cuánto tardarías en hacerla de verdad?
2 3 1 0 cambios,f:cambio-reciente | ¿Qué ha cambiado en ti este último año que yo quizá no he notado?
1 2 2 0 comida,f:comida-sola | ¿Qué comes cuando estás solo y nadie mira?
1 2 2 0 gente,f:persona-admirada-cerca | ¿A quién de nuestro entorno admiras en silencio? ¿Por qué nunca se lo has dicho?
1 2 2 0 rutinas,f:camino-habitual | ¿Qué ves cada día en tu camino habitual que nadie más parece ver?
2 3 1 0 trabajo,f:dia-trabajo-bueno | ¿Cómo es un buen día de trabajo para ti, concretamente? ¿Cuándo fue el último?
1 2 2 0 casa,f:tarea-placer | ¿Qué tarea de casa te gusta hacer aunque nunca lo reconozcas?
1 2 2 0 tecnologia,f:app-mas-usada | ¿Qué miras en el móvil cuando dices que no estás mirando nada?
2 3 1 0 gente,f:amistad-reciente | ¿Qué amistad nueva te ha sorprendido en los últimos años?
1 2 2 0 ciudad,f:sitio-ciudad | ¿Qué sitio de esta ciudad te gusta y nunca vamos?
1 2 2 0 rutinas,f:pequeño-lujo | ¿Cuál es tu pequeño lujo de la semana, ese que no cuesta casi nada?
2 3 1 0 cambios,f:cosa-ya-no-importa | ¿Qué te importaba muchísimo hace cinco años y ahora te da igual?
1 2 2 0 comida,f:plato-que-te-sale | ¿Qué plato te sale bien y casi nunca haces? ¿Por qué?
1 2 2 0 gente,f:ultima-risa | ¿Cuándo fue la última vez que te reíste solo, sin nadie delante? ¿De qué?
2 3 1 0 rutinas,f:lo-que-te-cansa | ¿Qué te cansa más de lo que debería, y no lo dices para no parecer quejica?
1 2 2 0 casa,f:objeto-mejor-compra | ¿Qué objeto de esta casa fue la mejor compra, calidad-precio-felicidad?
1 2 2 0 trabajo,f:compañero-trabajo | ¿Qué compañero de trabajo me caería bien, y cuál te preocupa que conozca?
2 3 1 0 gente,f:llamada-pendiente | ¿A quién deberías llamar esta semana y sabes que no vas a llamar?
1 2 2 0 ciudad,f:paseo | ¿Qué paseo darías ahora mismo si tuvieras una hora libre y buen tiempo?
1 2 2 0 habitos,f:habito-nuevo | ¿Qué hábito has intentado empezar este año y en qué semana lo abandonaste?
2 3 1 0 cambios,f:cosa-que-te-dio-miedo-decir | ¿Qué te dio miedo decirme hace poco y al final dijiste de otra forma?
1 2 2 0 rutinas,f:noche-ideal-semana | ¿Cómo sería un martes por la noche perfecto, sin salir de casa?
1 2 2 0 comida,f:restaurante-pendiente | ¿Qué restaurante llevas tiempo queriendo probar y nunca propones?
2 3 1 0 gente,f:persona-piensas-mas | ¿En qué persona has pensado más esta semana, aparte de mí?
1 2 2 0 casa,f:cosa-casa-cambiarias | ¿Qué cambiarías de esta casa mañana mismo si no costara nada?
1 2 2 0 trabajo,f:elogio-trabajo | ¿Cuál es el último elogio que te han hecho en el trabajo? ¿Te lo creíste?
2 3 1 0 habitos,f:cosa-que-haces-por-mi | ¿Qué haces por mí sin que yo lo sepa, y querrías que supiera?
1 2 2 0 rutinas,f:musica-ahora | ¿Qué estás escuchando últimamente que no me has enseñado?
1 2 2 0 ciudad,f:tienda-favorita | ¿En qué tienda podrías pasar una hora sin comprar nada?
2 3 1 0 cambios,f:lo-que-te-preocupa | ¿Qué te preocupa estos días que todavía no has dicho en voz alta?
1 2 2 0 gente,f:persona-nueva-conocer | ¿A quién has conocido este año que te gustaría conocer mejor?
1 2 2 0 comida,f:desayuno-ideal | ¿Cómo sería tu desayuno ideal un día sin prisa? Con detalle.
2 3 1 0 rutinas,f:cuando-estas-bien | ¿En qué se nota, desde fuera, que estás pasando una buena temporada?
1 2 2 0 casa,f:ruido-casa | ¿Qué ruido de esta casa te tranquiliza y cuál te saca de quicio?
1 2 2 0 habitos,f:cosa-que-lees | ¿Qué fue lo último que leíste entero, de principio a fin?
2 3 1 0 gente,f:consejo-reciente | ¿Cuál es el último buen consejo que te han dado? ¿Lo has seguido?
1 2 2 0 trabajo,f:lo-que-nadie-sabe-trabajo | ¿Qué parte de tu trabajo no entiende nadie de tu familia por mucho que la expliques?
1 2 2 0 rutinas,f:plan-fin-de-semana | ¿Qué plan de fin de semana te apetece desde hace meses y no hemos hecho?
2 3 1 0 cambios,f:orgullo-reciente | ¿De qué te has sentido orgulloso últimamente sin decírselo a nadie?
1 2 2 0 ciudad,f:vecino-actual | ¿Qué sabes de algún vecino actual que yo no sepa?

## libre intim
1 3 1 1 atraccion,f:momento-atraccion | ¿En qué momento reciente te sentiste especialmente atraído por mí sin que yo me enterara?
1 3 1 1 detalles,f:detalle-fisico | ¿Qué detalle mío, de esos que yo no valoro, es de los que más te gustan?
1 3 1 1 romanticismo,f:gesto-romantico | ¿Qué gesto mío te pareció más romántico, aunque yo no lo hiciera con esa intención?
1 4 1 1 comunicacion,f:nunca-dicho | ¿Qué cosa buena de mí nunca me has dicho porque te parecía demasiado cursi?
1 3 1 1 recuerdos,f:primer-recuerdo-atraccion | ¿Cuál es tu primer recuerdo de sentirte atraído por mí? ¿Dónde estábamos?
2 3 1 1 curiosidad,f:pregunta-siempre-quisiste | ¿Qué me has querido preguntar alguna vez y no te atreviste?
1 3 1 1 atraccion,f:ropa-mia | ¿Qué me pongo que te gusta más de lo que yo creo?
1 3 1 1 romanticismo,f:cita-ideal | Describe una cita perfecta conmigo, con detalles reales, no de película.
1 4 1 1 comunicacion,f:cuando-te-sientes-querido | ¿Cuándo te sientes más querido por mí? Un momento concreto de esta semana.
2 3 1 1 recuerdos,f:beso-recordado | ¿Qué beso nuestro recuerdas mejor, y por qué ese?
1 3 1 1 detalles,f:voz | ¿Qué te gusta de mi voz, o de cómo digo alguna palabra en concreto?
1 4 1 1 comunicacion,f:cosa-que-echas-de-menos | ¿Qué echas de menos de nuestros primeros meses y podríamos recuperar esta semana?
2 3 1 1 atraccion,f:ropa-tuya-que-me-gusta | ¿Qué crees que me gusta de ti y nunca te lo he dicho con claridad?
1 3 1 1 romanticismo,f:lo-que-te-gusta-que-haga | ¿Qué pequeña cosa te gusta que haga cuando estamos a solas?
2 4 1 2 deseo,f:deseo-reciente | ¿Cuándo fue la última vez que me deseaste de verdad y no hiciste nada?
2 4 1 2 preferencias,f:preferencia-no-dicha | ¿Qué te gusta que te haga y nunca has sabido cómo pedirlo?
2 4 1 2 comunicacion,f:verguenza-pedir | ¿Qué te da vergüenza pedirme, aunque sepas que yo diría que sí?
2 4 1 2 atraccion,f:momento-sexy | ¿Cuál es el momento más sexy que recuerdas de mí, de esos en los que yo no estaba intentando serlo?
2 4 1 2 preferencias,f:lo-que-prefieres | ¿Qué prefieres de verdad: lo que hacemos siempre o lo que hacemos a veces? Sé concreto.
2 4 1 2 curiosidad,f:curiosidad-sobre-mi | ¿Qué curiosidad tienes sobre mí en la intimidad que nunca has preguntado?
2 4 1 2 recuerdos,f:recuerdo-intimo | ¿Qué recuerdo íntimo nuestro te viene a la cabeza en el momento más inoportuno?
2 4 1 2 deseo,f:como-te-gusta-empezar | ¿Cómo te gusta que empiecen las cosas, de verdad? ¿Y cómo te gusta que terminen?
2 4 1 2 comunicacion,f:señal | ¿Qué señal me mandas cuando tienes ganas, y crees que yo nunca capto?
2 4 1 2 atraccion,f:parte-de-mi | ¿Qué parte de mí mirarías durante un minuto entero si pudieras hacerlo sin que me diera cuenta?
2 4 1 2 preferencias,f:lugar-momento | ¿Hay un lugar o un momento del día en el que te apetezco más? ¿Lo sabía yo?
2 4 1 2 comunicacion,f:cosa-que-no-te-gusta | ¿Qué cosa no te gusta tanto como yo creo, y nunca me lo has dicho para no cortarme?
3 5 1 3 fantasias,f:fantasia-nunca-dicha | ¿Qué fantasía tienes que nunca me has contado? Puedes contar solo la mitad.
3 5 1 3 deseo,f:deseo-que-te-sorprendio | ¿Qué deseo te sorprendió tener, de esos que no pegan con la idea que tienes de ti?
3 5 1 3 curiosidad,f:lo-que-nunca-hemos-probado | ¿Qué no hemos probado nunca y te da curiosidad, aunque no estés seguro de que te gustaría?
3 5 1 3 recuerdos,f:mejor-vez | ¿Cuál fue nuestra mejor vez, según tú? ¿Qué la hizo distinta?
3 5 1 3 fantasias,f:escenario-fantasia | Si pudieras elegir un sitio, cualquiera, para una noche juntos, ¿cuál sería? Sin que sea bonito, solo sincero.
3 5 1 3 comunicacion,f:lo-mas-dificil-de-decir | ¿Qué es lo más difícil de decirme sobre lo que te gusta? Intenta decirlo ahora, aunque sea a medias.
3 5 1 3 deseo,f:ganas-de-mi | ¿Qué es lo que te da más ganas de mí: algo que hago, algo que digo o algo que no sabes explicar?
3 5 1 3 fantasias,f:papel | ¿Hay algo que te gustaría que yo tomara la iniciativa de hacer, sin pedirlo tú?
1 3 1 1 romanticismo,f:lo-que-me-dirias-primera-cita | Si tuviéramos una primera cita hoy, sabiendo lo que sabes, ¿qué me dirías para conquistarme?
1 3 1 1 detalles,f:gesto-inconsciente | ¿Qué gesto hago sin darme cuenta que te encanta?
2 4 1 2 atraccion,f:cuando-me-miras | ¿Cuándo me miras sin que me entere? ¿Qué estoy haciendo en ese momento?
1 3 1 1 comunicacion,f:te-quiero-distinto | ¿De qué forma te gusta más que te diga que te quiero: con palabras, con un gesto o con un plan?
2 4 1 2 recuerdos,f:noche-que-repetirias | ¿Qué noche nuestra repetirías exactamente igual? ¿Dónde y cuándo fue?
1 3 1 1 romanticismo,f:lo-que-te-enamoro | ¿Qué te enamoró de mí que todavía sigue ahí? ¿Y qué ha aparecido después que no esperabas?
2 4 1 2 preferencias,f:ritmo | ¿Te gusta más cuando hay prisa o cuando no hay ninguna? Pon un ejemplo nuestro.
3 5 1 3 curiosidad,f:pregunta-intima-directa | Hazme ahora la pregunta íntima que más te cuesta hacer. Yo respondo sin reírme.
1 3 1 1 detalles,f:olor | ¿A qué huelo según tú? ¿Cuándo lo notas más?
2 4 1 2 comunicacion,f:despues | ¿Qué te gusta que pase justo después? ¿Lo hacemos?
1 3 1 1 romanticismo,f:mensaje | ¿Qué mensaje mío guardas o recuerdas, de esos que no eran importantes y lo fueron?
2 4 1 2 deseo,f:ropa-que-te-gusta-ver | ¿Qué te gusta verme hacer, aunque sea cotidiano, porque te atrae sin saber por qué?
1 3 1 1 comunicacion,f:cosa-que-agradeces | ¿Qué me agradeces de nuestra intimidad y nunca has dicho en voz alta?
3 5 1 3 fantasias,f:cosa-que-pensaste-y-callaste | ¿Qué pensaste alguna vez estando juntos y te callaste? Cuéntalo ahora.
1 3 1 1 atraccion,f:primera-impresion-fisica | ¿Qué fue lo primero que te fijaste de mí físicamente? ¿Y lo segundo?
2 4 1 2 preferencias,f:sorpresa | ¿Te gusta que te sorprenda o prefieres saber que va a pasar? Un ejemplo real.
`;

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
function opener(t) { return t.replace(/^[¿¡«"]+/, '').split(/\s+/).slice(0, 2).join(' ').toLowerCase().replace(/[^a-záéíóúñü ]/g, ''); }
const PAST = ['infancia', 'adolescencia', 'colegio', 'recuerdos', 'primeras', 'profesores', 'antes', 'nostalgia', 'memoria', 'historia'];
function timeframe(c, plain) {
  if (c.cat === 'antes') return 'past';
  if (c.tags.some(t => PAST.includes(t))) return 'past';
  if (/dentro de|futuro|serás|seremos|dentro de \d+ años/i.test(plain)) return 'future';
  if (c.r >= 4 || ['hip', 'mini', 'esp'].includes(c.cat)) return 'hyp';
  return 'now';
}
const TARGET = { obs: 'tu', cdb: 'tu', pre: 'yo', lore: 'nos', ctx: 'nos', tit: 'nos', expl: 'nos', acus: 'nos', vez: 'nos', intim: 'nos', jui: 'nos' };

function parse(src) {
  const out = []; let mech = null, cat = null;
  for (const raw of src.split('\n')) {
    const line = raw.trim(); if (!line) continue;
    if (line.startsWith('## ')) { [mech, cat] = line.slice(3).split(/\s+/); continue; }
    const parts = line.split(' | ');
    const head = parts[0].trim().split(/\s+/);
    let c;
    if (mech === 'caos') {
      c = { mech, cat, r: 3, d: 1, e: 3, i: 0, tags: ['caos'], n: +head[0], affects: head[1], name: parts[1], text: parts[2] };
    } else {
      const tags = (head[4] || '').split(',').filter(Boolean);
      c = { mech, cat, r: +head[0], d: +head[1], e: +head[2], i: +head[3], tags, text: parts[1] };
      if (mech === 'juicio') { c.a = parts[2]; c.b = parts[3]; }
      else c.text = parts.slice(1).join(' | ');
    }
    // tokens especiales dentro de las etiquetas
    const tok = {}; c.tags = c.tags.filter(t => { const m = t.match(/^(f|t|em|to):(.+)$/); if (m) { tok[m[1]] = m[2]; return false; } return true; });
    if (c.tags.includes('cdb')) { c.cat = 'cdb'; c.tags = c.tags.filter(t => t !== 'cdb'); }
    c.catLabel = CATS[c.cat] || c.cat;
    c.territory = TERRITORY[c.cat] || 'otro';
    c.id = mech[0] + hash(c.text);
    const plain = c.text.replace(/\*/g, '');
    c.len = plain.length;
    c.dur = mech === 'rapida' ? 0 : mech === 'juicio' || mech === 'caos' ? 1 : c.d >= 4 || plain.length > 150 ? 2 : 1; // 0 corta · 1 media · 2 larga
    c.open = opener(plain);
    c.topic = c.tags[0] || c.cat;
    c.fam = tok.f ? 'f:' + tok.f : c.cat + '/' + c.topic; // familia semántica: explícita (fuerte) o derivada (suave)
    c.famExplicit = !!tok.f;
    c.time = tok.t || timeframe(c, plain);
    c.emotion = tok.em || null;
    c.target = tok.to || TARGET[c.cat] || 'yo';
    c.real = mech === 'juicio' ? c.r <= 2 : c.r <= 2 && !['hip', 'mini', 'esp', 'teo'].includes(c.cat);
    out.push(c);
  }
  return out;
}

const CARDS = parse(SRC);
const api = { CARDS, CATS, TERRITORY };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.NTP_CARDS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
