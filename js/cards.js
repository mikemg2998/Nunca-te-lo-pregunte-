/* Banco de cartas de «Nunca te lo pregunté».
 *
 * Formato compacto, una carta por línea:
 *   libre / rapida / predice / alavez:   rareza profundidad etiquetas | texto
 *   juicio:                               rareza etiquetas | pregunta | postura A | postura B
 *   caos:                                 duración afecta | nombre | regla
 * rareza 1–5 · profundidad 0 ligera, 1 media, 2 profunda · etiquetas separadas por comas
 * *palabras* entre asteriscos = único acento dorado de la carta (usar muy poco).
 * Perspectiva: en LIBRE, «yo» es quien lee la carta en voz alta y «tú» quien escucha.
 * En PREDICE, la carta habla a quien responde. En A LA VEZ, a los dos.
 */
(function (root) {
const CATS = {
  obs: 'Conocimiento inútil',
  cdb: 'Conozco demasiado bien a esta persona',
  pre: 'Predice a tu pareja',
  hip: 'Hipotético absurdo',
  mini: 'Mini mundos',
  exis: 'Existenciales extrañas',
  esp: 'Situaciones ridículamente específicas',
  lore: 'Lore de la pareja',
  pref: 'Qué prefieres',
  teo: 'Teorías innecesarias',
  comp: 'Completa la frase',
  rank: 'Ranking',
  acus: 'Acusación ridícula',
  tit: 'Titular',
  expl: 'Explica',
  ctx: 'Elección con contexto',
  rap: 'Sin pensar',
  vez: 'Los dos a la vez',
  jui: 'Juicio absurdo',
  caos: 'Caos',
};

const SRC = String.raw`
## libre obs
1 0 salir | ¿Qué hago exactamente en los cinco minutos antes de decir que ya podemos salir?
1 0 humor | ¿Cómo sabes que estoy de mal humor aunque diga que no pasa nada?
1 0 compras | ¿Qué compro una y otra vez creyendo que esta vez sí lo voy a usar?
2 0 frases | ¿Qué frase mía podrías doblar perfectamente, entonación incluida? Demuéstralo.
2 0 sonidos | ¿Qué *sonido* hago que reconocerías entre cien personas?
1 0 objetos | ¿Qué objeto pierdo con una frecuencia estadísticamente preocupante?
2 0 frases | ¿Qué hago justo antes de decir algo que sé que no te va a gustar?
2 0 musica | ¿Qué canción canto mal siempre exactamente en la misma parte?
2 0 comida | ¿Qué comida podrías reconocer que estoy comiendo solo por mi cara?
2 0 frases | ¿Cuál es la frase que repito tanto que, si yo fuera un personaje de videojuego, la diría cada vez que pasas por mi lado?
2 0 casa | Imítame entrando en casa después de un día horrible. Tres cosas, en orden.
2 0 sueño | ¿Qué hago al dormir que yo no sé que hago?
1 0 manias | ¿Qué ordeno con muchísimo cuidado mientras todo lo demás está en caos?
2 0 restaurantes | ¿Qué hago siempre en los restaurantes que podrías predecir antes de sentarnos?
2 0 supermercado | ¿Qué pasillo del supermercado me cambia el humor?
2 0 viajes | ¿Cuál es mi ritual de aeropuerto que nunca me salto?
2 0 mañanas | ¿Qué es lo primero que digo por las mañanas con más frecuencia de lo razonable?
3 0 manias | ¿Qué cosa sabes que me va a molestar antes incluso de que ocurra?
2 0 social | En una fiesta donde no conozco a nadie, ¿con quién o con qué acabo hablando?
2 1 cambios | ¿Qué cosa mía te parecía rarísima al principio y ahora te parece de lo más normal?
2 0 tecnologia | ¿Con qué aparato de casa tengo una relación claramente tóxica?
2 0 salud | ¿Cómo me comporto cuando tengo un resfriado, y a qué personaje histórico me parezco?
3 0 objetos | ¿Qué objeto de esta casa he defendido con argumentos que no usaría ni un abogado?
2 0 familia | ¿Qué hago distinto cuando hablo con mi familia, aunque crea que no se nota?
2 0 voz | ¿Qué tono pongo cuando quiero que hagas algo pero que parezca idea tuya?
2 0 coche | ¿Qué digo siempre en el coche cuando alguien conduce peor que yo?
2 0 compras | ¿Qué hago en una tienda cuando el dependiente me pregunta si necesito ayuda?
3 0 casa | ¿Dónde dejo las cosas cuando digo «lo he dejado en su sitio»?
2 0 sueño | ¿Cuál es mi postura oficial para dormir y cuál la que acabo adoptando a las 4 de la mañana?
2 0 comida | ¿Qué comida defiendo como si fuera parte de mi identidad?
2 0 social | ¿Cuál es mi frase para irme de una fiesta sin que parezca que me quiero ir?
3 0 viajes | ¿Qué llevo siempre en la maleta «por si acaso» y nunca uso?
2 1 cambios | ¿Qué hago ahora que hace diez años habría jurado que nunca haría?
3 0 tecnologia | ¿Cómo explico yo un problema técnico cuando llamo al servicio de atención al cliente?
2 0 frases | ¿Qué palabra uso para todo cuando no me sale la palabra correcta?
3 0 casa | ¿Cuál es mi forma de «ayudar» en la cocina que en realidad no ayuda?
2 0 mañanas | ¿Qué hago en los primeros diez minutos después de despertarme que nadie más hace igual?
3 0 manias | Si tuvieras que redactar mis *instrucciones de uso*, ¿cuál sería la advertencia en letra pequeña?
2 0 cafes | ¿Cuántas veces remuevo el café antes de beberlo? Número exacto, y si cambia cuando estoy nervioso.
2 0 tele | ¿Qué anuncio comento siempre con la misma frase, aunque ya lo hayamos visto cuarenta veces?
3 0 cine | ¿En qué minuto de una película empiezo a preguntar quién es cada personaje?
2 0 llamadas | ¿Cómo me cambia la voz cuando me llama alguien del trabajo? Imítala.
2 0 colas | ¿Qué hago con las manos cuando espero en una cola larga?
3 0 regalos | ¿Cómo abro un regalo que no me gusta? Describe la cara, paso a paso.
2 0 fotos | ¿Qué pose repito en todas las fotos desde hace años sin darme cuenta?
2 0 comida | ¿Qué parte del plato me dejo siempre para el final, y qué pasa si alguien la toca?
3 0 sueño | ¿Cuál es la señal exacta de que me he dormido en el sofá aunque yo diga que estoy escuchando?
2 0 clima | ¿Qué digo del tiempo cada vez que salimos a la calle, haga el tiempo que haga?
3 0 coche | Cuando me pierdo conduciendo, ¿qué digo, qué hago y a quién culpo? En ese orden.
2 0 dinero | ¿Qué cosa cara me parece razonable y qué cosa barata me parece un atraco?
3 0 cocina | ¿Qué ingrediente echo de más siempre, y a qué plato ya le has cogido cariño así?
2 0 ropa | ¿Qué prenda mía te gustaría que desapareciera en una mudanza, y cuál fingirías no encontrar?
3 0 humor | ¿Con qué tipo de chiste me río aunque no quiera, y cuál finjo que no me hace gracia?

## libre hip
3 1 casa | Un fantasma muy educado se muda a casa y solo pone una condición para no molestar. Viendo cómo vivimos, ¿qué pide?
4 0 casa | Nuestra casa tiene un *libro de reclamaciones* escrito por todos los que han vivido aquí. ¿Qué queja escribiría la casa sobre nosotros?
3 2 memoria | Una empresa te ofrece 50.000 euros por un recuerdo concreto. Te lo borran, pero eliges tú cuál. ¿Vendes alguno?
4 0 bebes | Te despiertas entendiendo perfectamente a los bebés de menos de un año. ¿Qué descubres primero?
4 0 animales | Cada vez que estornudas, un señor en Noruega recibe un euro. Lleva toda tu vida siguiéndote la pista. ¿Qué opina de ti?
4 0 animales | Mañana todos los perros del mundo te reconocen como una celebridad. Los gatos, no. ¿Qué hiciste?
5 0 animales | Una paloma te salva la vida en público y desde entonces las palomas de la ciudad te tratan como a alguien de la familia. ¿Cómo cambia tu día a día?
3 0 tiempo | Te regalan una máquina del tiempo que solo retrocede cuatro minutos y funciona una vez al día. ¿Para qué la usas un martes cualquiera?
4 0 casa | Los muebles de esta casa votan para echar a uno de los dos. ¿Quién sale y qué mueble hizo campaña en su contra?
4 1 tiempo | Hay una versión de ti que vive tu misma vida con un día de retraso. ¿Qué día de este año le avisarías?
4 0 viajes | Puedes vivir un año en cualquier ciudad del mundo, pero solo con lo que quepa en la caja de un microondas. ¿Dónde, y qué cabe?
3 0 dinero | Te dan 10.000 euros que solo puedes gastar en cosas que cuesten menos de dos euros. ¿Cuál es el plan?
3 0 vecinos | Te ofrecen una casa enorme gratis. El vecino de al lado es la persona que más te irritaba en el colegio. ¿Aceptas?
4 0 voz | Cada vez que entras en una habitación, un narrador invisible dice una frase sobre ti. ¿Qué frase ha dicho hoy?
4 0 objetos | Todo lo que has perdido en tu vida está en un almacén y puedes recuperar tres cosas. ¿Cuáles?
4 2 infancia | Encuentras una carta que escribiste a los 12 años para tu yo de ahora. ¿Qué te pedía que no has cumplido?
3 0 viajes | Eres el huésped un millón de un hotel y puedes pedir una sola cosa ridícula. ¿Qué pides?
4 0 compras | Tienes un poder extraordinario, pero solo funciona dentro de las ferreterías. ¿Qué poder eliges para que merezca la pena?
3 1 casa | Esta casa puede recordar perfectamente un solo día de todos los que hemos vivido en ella. ¿Cuál elegiría?
4 0 vecinos | Te nombran representante de la humanidad ante unos extraterrestres, pero solo puedes enseñarles una costumbre de nuestro barrio. ¿Cuál?
5 0 objetos | Tu sombra decide independizarse y deja una nota de despedida. ¿Qué dice la nota?
3 0 trabajo | Te contratan para escribir los mensajes de las galletas de la fortuna, pero tu jefe los quiere *ligeramente inquietantes*. Escribe tres.
4 0 trabajo | Trabajas como consultor de fantasmas que no consiguen asustar a nadie. ¿Cuál es tu primer consejo?
3 0 trabajo | Tu trabajo es poner nombre a los colores nuevos de pintura. ¿Cómo se llama el color de nuestro sofá?
4 0 trabajo | Te pagan por inventar pequeñas molestias para gente que lo tiene todo. ¿Qué inventas primero?
3 0 trabajo | Te contratan para inventar una fiesta nacional nueva. ¿Qué se celebra y cómo?
4 0 objetos | Un objeto cualquiera de esta casa cobra vida durante una hora. Eliges cuál. ¿Qué hace en esa hora?
3 1 tiempo | Puedes regalar una hora de tu tiempo libre a tu yo de hace diez años. ¿Qué haría con ella?
4 0 dobles | Mañana aparece un duplicado tuyo y hay que repartirse la semana. ¿Qué días te quedas y cuáles le cedes sin pensarlo?
3 1 vecinos | El vecino nuevo resulta ser tu yo de dentro de veinte años, que ha venido a vivir tranquilo. ¿Qué le preguntas en la escalera?
4 0 animales | Durante un mes, todos los gatos del barrio te siguen a dos metros, con respeto. ¿Qué haces con ese ejército?
3 1 regalos | Cada regalo que haces le dice a quien lo recibe cuánto tardaste en elegirlo. ¿Qué regalo pasado te daría más vergüenza?
4 0 trabajo | Te contratan como juez de un concurso de excusas para no ir a eventos. ¿Qué excusa gana y por qué?
3 0 dinero | Cobras un sueldo mensual, pero solo por tareas que nadie te ha pedido. ¿Cuál es tu primera factura?
4 0 tiempo | Un día cualquiera de tu vida se repite cada año, el mismo día, sin cambios. Eliges cuál. ¿Cuál escoges para no cansarte nunca?
3 0 restaurantes | Abres un restaurante que solo sirve un plato y solo abre un día al año. ¿Qué plato y qué día?
4 0 frases | Las mentiras se oyen con eco. ¿Qué conversación tuya de esta semana habría retumbado?
3 0 familia | Te nombran cronista oficial de la familia y la última reunión hay que contarla como una crónica deportiva. ¿Quién marcó el gol?
4 0 ciudad | En tu ciudad aparece una calle nueva que solo tú ves. ¿Qué hay en ella y a quién llevarías primero?
3 1 recuerdos | Puedes meter un recuerdo tuyo en una botella para que lo encuentre un desconocido dentro de cien años. ¿Cuál mandas?

## libre mini
3 0 social | Cada vez que alguien te da las gracias, sube un marcador visible sobre tu cabeza. ¿Quién de nuestro entorno tendría el número más alto?
4 0 vecinos | En este mundo, cualquier discusión de pareja se resuelve ante un jurado de tres vecinos. ¿Qué discusión nuestra ganaría yo por goleada?
3 1 trabajo | La gente se jubila a los 20 y empieza a trabajar a los 65. ¿Cómo habrías pasado tus años de jubilación?
4 0 ropa | La ropa cambia de color según tu humor real. ¿Qué prenda tuya pasaría más tiempo en color «no me hables»?
4 0 colas | Las colas se ordenan por quién tiene la mejor excusa, no por quién llegó antes. ¿Qué excusa usarías en la cola del médico?
5 0 musica | Cada persona tiene una melodía que suena flojito cuando está a punto de hacer una tontería. ¿Cuál es la tuya y cuántas veces sonó esta semana?
4 0 sueño | Los sueños se pueden alquilar como películas. ¿Cuál de los tuyos sería el más alquilado?
4 1 tiempo | Cada persona nace con un número fijo de horas de paciencia. ¿Cuántas crees que has gastado ya, y en qué?
3 0 trabajo | Todo el mundo recibe a los 30 años un título oficial según lo que mejor hace. ¿Cuál te dieron a ti? ¿Y a mí?
4 0 casa | Cada mentira piadosa hace crecer un poco una planta en tu casa. ¿Cuánta jungla tendríamos ahora mismo?
4 0 frases | Desaparecen todos los idiomas menos uno que inventamos nosotros dos. ¿Cuáles son sus cinco primeras palabras?
5 0 domingos | Los domingos la gravedad funciona a la mitad. ¿Qué rutina nuestra cambia más?
3 0 casa | Cada vez que terminas una tarea aburrida, alguien te aplaude desde algún sitio. ¿Qué tarea harías mucho más a menudo?
4 0 objetos | En este mundo cada persona puede convocar un solo objeto diciendo una frase. ¿Qué objeto y qué frase eliges?
4 0 sonidos | Puedes cambiar el sonido de un objeto de la casa por el que tú quieras. ¿Qué objeto y qué sonido?
4 0 animales | Cada familia tiene un animal oficial que la representa en los actos públicos. ¿Cuál sería el nuestro?
5 0 comida | Cada comida que cocinas deja escrito en el plato lo que pensabas mientras la hacías. ¿Qué pondría tu última cena?
4 1 recuerdos | Las personas guardan sus recuerdos en tarros y pueden prestarlos. ¿Qué recuerdo tuyo me prestarías?
4 0 objetos | Cada persona lleva colgado el nombre de la última cosa que ha roto. ¿Qué pone en tu cartel ahora mismo?
4 0 musica | Los vecinos votan una canción que suena en todo el edificio a las 8 de la mañana. ¿Qué gana en nuestro bloque?
3 0 trabajo | Todo el mundo cambia de profesión cada cinco años por sorteo. ¿Qué te ha tocado ya y qué te tocaría ahora?
4 0 comida | Cada plato recuerda quién lo cocinó y le pone nota en voz alta. ¿Qué nota media tendrías tú en esta casa?
4 1 tiempo | Los años duran lo que tú decidas, pero hay que decidirlo el 1 de enero. ¿Cuánto durará el que viene?
3 0 animales | Los perros eligen a sus dueños en una feria anual. ¿Qué perro te elegiría a ti y cuál me elegiría a mí?
4 0 casa | Las casas se mueven un metro cada noche hacia el sitio donde más felices fueron sus habitantes. ¿Hacia dónde va la nuestra?
4 0 ropa | La ropa que no usas en un año se marcha sola a otra casa. ¿Qué prenda tuya ya estaría viviendo con otra persona?
3 0 social | Cada barrio tiene un saludo obligatorio inventado por sus habitantes. Inventa el nuestro.
4 0 sueño | Una vez al mes puedes elegir en qué cama del mundo despertarte. ¿Dónde amaneces la próxima?

## libre exis
1 1 decisiones | ¿Qué decisión pequeñísima de hace años te cambió la vida más que muchas decisiones grandes?
2 1 gente | Si tu vida tuviera créditos finales, ¿qué persona inesperada saldría con un agradecimiento especial?
2 1 infancia | ¿En qué eres hoy exactamente igual que a los ocho años, sin ninguna mejora?
2 1 casa | ¿Qué versión de ti aparece solo cuando no hay nadie más en casa?
2 2 gente | ¿A quién crees que viste por última vez sin saber que era la última?
3 1 fotos | ¿En cuántas fotos de desconocidos sales de fondo, y en cuál te gustaría aparecer?
1 1 infancia | ¿Qué sigues haciendo exactamente como te lo enseñaron de pequeño, sin preguntarte si tiene sentido?
2 1 opiniones | ¿Qué opinión defiendes con una intensidad desproporcionada para lo poco que importa?
3 2 gente | ¿Qué recuerda de ti alguien a quien tú ya has olvidado por completo?
2 2 gente | Si todas las personas que has conocido votaran tu rasgo más reconocible, ¿qué ganaría? ¿Y qué te gustaría que ganara?
3 1 estadisticas | Si pudieras saber una *estadística inútil* sobre tu vida, ¿cuál elegirías?
2 2 cambios | Tu yo de hace diez años se lleva un susto al verte hoy. ¿Por qué detalle pequeño?
3 1 futuro | ¿Qué cosa normalísima de hoy parecerá incomprensible dentro de 300 años?
2 2 gente | ¿Qué persona fue importante en tu vida solo durante un verano y aun así te cambió algo?
3 1 cambios | ¿Qué sabías hacer perfectamente hace quince años y has olvidado del todo?
2 2 identidad | ¿Qué parte de tu personalidad elegiste a propósito y cuál simplemente te pasó?
3 1 gente | Si los desconocidos con los que has compartido ascensor pudieran dejarte una reseña, ¿cuántas estrellas tendrías y qué diría la peor?
2 2 cambios | ¿Qué cosa nuestra de hace diez años te parecería hoy de otra pareja?
2 2 infancia | Si pudieras pasear diez minutos por la casa en la que creciste, tal como era, ¿a qué habitación irías primero?
3 1 manias | ¿Qué manía tuya heredarán sin querer las personas que pasan tiempo contigo?
2 1 infancia | ¿Qué te daba miedo en la infancia y ahora te parece encantador?
3 1 talentos | ¿Qué talento tienes que no le sirve a nadie, pero que te enorgullece en secreto?
3 2 nosotros | ¿Cuántas veces crees que estuvimos a punto de conocernos antes de conocernos de verdad?
2 2 identidad | ¿Qué te gustaría que contara de ti alguien que solo te conoció un día?
3 1 tiempo | Si pudieras saber cuántas horas de tu vida has pasado haciendo una sola cosa, ¿qué número te daría miedo consultar?
2 2 identidad | ¿Qué opinión tuya ha cambiado por completo sin que te dieras cuenta de cuándo?
3 1 futuro | ¿Qué costumbre tuya de ahora crees que te dará vergüenza ajena dentro de veinte años?
2 2 nosotros | ¿Qué cosa aprendiste de mí sin que yo intentara enseñártela?
2 1 casualidades | ¿Qué casualidad pequeña de tu vida te sigue pareciendo rara cuando la piensas?
3 1 gente | ¿Qué persona te ha hecho un favor enorme sin saberlo nunca?
2 2 decisiones | ¿Qué decisión tomaste por cansancio y resultó ser de las mejores?
3 1 objetos | ¿Qué objeto tuyo lleva más años contigo que yo, y por qué sigue aquí?
2 1 habitos | ¿Qué cosa haces todavía solo porque alguien te dijo una vez que lo hacías bien?
3 2 futuro | ¿Qué quieres que siga exactamente igual dentro de veinte años, por pequeño que sea?
2 1 lugares | ¿Qué sitio recuerdas con una nitidez absurda sin haber pasado allí más de una hora?
3 1 talentos | ¿En qué eres el mejor de todas las personas que conoces, aunque nadie lo diga nunca?
2 2 gente | ¿A quién le debes una conversación que llevas años posponiendo?
3 1 nombres | ¿Cuántos nombres o apodos distintos te han puesto en tu vida, y cuál era el que mejor te quedaba?
2 1 tiempo | ¿Qué hora del día te sienta mejor como persona, y cuál te sienta peor?
3 2 nosotros | ¿Qué cosa buena de ti crees que solo he visto yo?

## libre esp
4 0 bodas | Te toca dar el discurso en la boda de alguien que apenas conoces porque el padrino se ha quedado en un ascensor. Tienes 90 segundos. Empieza.
3 0 peluqueria | Se va la luz en todo el país cuando llevas media cabeza cortada en la peluquería. ¿Cuál es tu plan para las próximas 48 horas?
5 0 vecinos | Te comes sin querer un caramelo que te hace hablar *en verso* durante tres horas, y tienes reunión de vecinos en veinte minutos. ¿Qué haces?
5 0 animales | Un pato te ha seguido desde el parque hasta casa y lleva dos días en la puerta. ¿Cuál es el siguiente paso?
3 0 vecinos | Llevas tres semanas saludando a un vecino por un nombre equivocado. Hoy su pareja lo llama por su nombre real delante de ti. ¿Qué haces?
4 0 trabajo | Te quedas 40 minutos en un ascensor averiado con tu jefe de hace diez años y una tarta de cumpleaños que no es de nadie. ¿Cómo pasáis el rato?
4 0 ropa | Llegas a una cena y todos los invitados llevan exactamente tu misma camiseta. Nadie lo comenta. ¿Cuánto tardas en decir algo?
4 0 viajes | En el control del aeropuerto aparece en tu mochila un objeto de casa que yo metí sin avisar. ¿Cuál es y cómo se lo explicas al agente?
4 0 musica | Una cantante famosa te saca del público para cantar a dúo una canción que no conoces. Tienes la letra, pero no la melodía. ¿Estrategia?
3 0 viajes | Llevas dos horas de tren frente a alguien que pela mandarinas sin parar y te ofrece la mitad de cada una. Van once. ¿Cuándo dices basta, y cómo?
4 0 bodas | En una boda te sientan por error en la mesa de los niños. Tienen entre 7 y 9 años y te han nombrado su líder. ¿Qué ordenas primero?
4 0 museos | Cierran el museo de cera contigo dentro hasta mañana a las 10. ¿Qué haces durante la noche?
4 0 restaurantes | El camarero de un restaurante elegantísimo te confunde con un crítico famoso y no te deja aclararlo. ¿Cómo sobrevives a los siete platos?
3 0 vecinos | Son las 3 de la mañana y el vecino de arriba ensaya con una trompeta. Es la tercera noche. ¿Qué nota le dejas en el buzón?
5 0 familia | Un desconocido te para en la calle convencido de que eres su primo y te invita a una comida familiar hoy mismo. ¿Vas?
4 0 musica | Coincides en el ascensor con tu ídolo de adolescencia. Tienes ocho pisos. ¿Qué dices?
4 0 animales | Te regalan por error un caballo de verdad. No se puede devolver hasta el lunes. ¿Dónde duerme esta noche?
4 0 trabajo | Estás presentando algo importante en el trabajo y descubres que llevas el jersey del revés. Faltan 20 minutos de presentación. ¿Qué haces?
3 0 supermercado | Te equivocas de carro en el supermercado y te llevas el de otra persona hasta la caja. Su compra es fascinante. ¿Qué había y qué conclusiones sacas?
4 0 fiestas | Te toca organizar la cena de Nochebuena para 14 personas y la cocina deja de funcionar a las 6 de la tarde. ¿Plan?
5 0 animales | Una gaviota te roba el bocadillo en la playa y a la mañana siguiente vuelve y deja algo en tu toalla. ¿Qué crees que deja?
4 0 viajes | El autobús en el que vas se desvía y el conductor anuncia que hoy toca excursión sorpresa. Nadie protesta. ¿Cuánto tardas en protestar tú?
4 0 trabajo | En una videollamada importante, tu cámara se activa con un filtro de dinosaurio que no sabes quitar. Quedan 25 minutos. ¿Qué haces?
3 0 vecinos | El vecino te pide que cuides su planta una semana y resulta que la planta tiene nombre, horario y lista de canciones. ¿Cumples?
4 0 fiestas | Llegas a un cumpleaños sorpresa y descubres que la sorpresa es para ti, pero no es tu cumpleaños. ¿Lo dices?
4 0 comida | El anfitrión de una cena sirve un plato que claramente ha salido mal y pregunta tu opinión mirándote fijamente. ¿Qué dices, palabra por palabra?
3 0 colas | Llevas 40 minutos en una cola y descubres que es para otra cosa. La otra cosa es interesante. ¿Te quedas?
4 0 viajes | Pasas la noche encerrado en un aeropuerto pequeño con un coro infantil y su director. ¿Qué está pasando a las 3 de la mañana?
4 0 animales | Un cuervo te deja cada mañana un objeto distinto en el alféizar. Hoy ha dejado una llave. ¿Qué haces?
3 0 bodas | En una boda, el DJ te anuncia como encargado del primer discurso. No eres tú. Te acercan el micro. ¿Qué dices?
4 0 tiendas | El dependiente te confunde con un cliente que ha pagado un regalo carísimo y te lo entrega. Sabes de quién es. ¿Qué pasa en los siguientes diez segundos?

## libre lore
3 0 dobles | Tenemos que entrenar a dos *dobles* para que nos sustituyan una semana sin que nadie lo note. ¿Qué detalle sería lo más difícil de enseñarles?
2 0 frases | ¿Qué palabra o expresión inventada nuestra merece entrar en el diccionario? Explica su origen como lo haría un académico.
3 0 casa | Somos una empresa de dos empleados. ¿Qué cargo tiene cada uno, quién pide un ascenso y qué departamento está mal gestionado?
2 0 discusiones | ¿Cuál es el *gran clásico* de nuestra relación, esa situación que se repite igual y siempre acaba con el mismo resultado?
4 0 objetos | Si hubiera un museo de nuestra relación, ¿qué objeto ridículo estaría en una vitrina? Redacta la placa.
4 0 casa | Dentro de cien años, unos arqueólogos excavan esta casa tal y como está. ¿Qué conclusión equivocada sacan sobre nosotros?
2 0 casa | ¿Qué *regla* existe en esta casa aunque nunca la hayamos acordado?
3 0 objetos | ¿Qué objeto de casa ha sobrevivido a muchas más cosas de las que debería? ¿Qué medalla le damos?
3 0 recuerdos | ¿Qué historia nuestra contamos tantas veces que ya tiene una versión oficial? ¿Qué parte exageramos?
3 0 viajes | ¿Qué viaje nuestro tendría la peor reseña en internet, y cuál sería el título de la reseña?
2 1 casa | ¿Qué trabajo invisible hace cada uno en esta casa que el otro quizá ni sabe que existe?
3 0 musica | Si tuviéramos un himno de casa, ¿de qué hablaría la primera estrofa? Tararéalo.
3 0 objetos | ¿Qué objeto, lugar o electrodoméstico es oficialmente nuestro enemigo común?
2 0 recuerdos | ¿Qué hicimos juntos por primera vez y nunca más volvimos a repetir?
3 0 frases | ¿Qué frase nuestra, dicha sin contexto delante de desconocidos, haría que alguien llamara a la policía?
3 0 vecinos | ¿Qué creen los vecinos que somos, basándose solo en lo que oyen a través de la pared?
2 0 discusiones | ¿Cuál es la discusión más absurda que hemos tenido, y quién tenía razón de verdad?
3 0 costumbres | ¿Qué tradición nuestra empezó por accidente y ahora ya es sagrada?
3 1 nosotros | Si dividieras nuestra relación en *temporadas*, ¿cómo se llama la actual?
4 0 costumbres | Un antropólogo pasa una semana viviendo con nosotros. ¿Qué ritual nuestro le parecería más inexplicable?
3 0 costumbres | ¿Qué hacemos los dos igual sin que ninguno se lo haya copiado al otro... o eso creemos?
3 0 casa | Si esta casa tuviera logros secretos, ¿cuál es el más raro que ya hemos desbloqueado?
2 1 recuerdos | ¿Qué día normal, sin nada especial, recuerdas de nosotros con un detalle sorprendente?
3 0 familia | ¿Qué personaje de nuestra familia o amigos tendría una página entera en la enciclopedia de nuestra vida?
3 0 casa | Dibuja con el dedo el mapa de nuestra casa como si fuera un parque de atracciones. ¿Cuál es la atracción estrella y cuál la que siempre está en reparación?
2 0 comida | ¿Qué plato nuestro tiene receta secreta porque en realidad nadie recuerda cómo salió bien la primera vez?
3 0 apodos | ¿Qué apodo nuestro para alguien de fuera se ha vuelto tan normal que un día lo diremos delante de esa persona?
3 1 costumbres | ¿Qué hábito nuestro empezó siendo temporal y lleva años instalado?
3 0 coche | Nuestro coche escribe sus memorias. ¿Qué capítulo nos daría más vergüenza?
2 0 frases | ¿Qué frase de una película o serie usamos ya como si fuera nuestra?
3 0 vecinos | ¿Qué saben de nosotros los del bar o la tienda de abajo que nuestros amigos no saben?
4 0 casa | Nuestra casa publica un parte meteorológico diario sobre el ambiente que hay dentro. ¿Qué decía el de ayer?
3 0 compras | ¿Qué compramos juntos convencidos de que nos iba a cambiar la vida, y cuántas veces lo hemos usado?
3 0 planes | ¿Qué plan llevamos años diciendo que haremos «el mes que viene»? Ponle fecha ahora, en serio.
2 1 recuerdos | ¿Qué momento nuestro recordamos distinto cada uno, y quién tiene la versión correcta?
3 0 familia | ¿Qué costumbre de mi familia has adoptado sin querer, y cuál de la tuya he adoptado yo?

## libre pref
2 1 memoria | ¿Preferirías recordar todo lo que has leído en tu vida, o todo lo que te han dicho las personas que quieres?
3 0 sueño | ¿Preferirías dormir cuatro horas y despertar descansado pero soñando siempre lo mismo, o nueve horas con sueños increíbles que recuerdas con todo detalle?
2 1 humor | ¿Preferirías que todo el mundo notara siempre cuándo estás de mal humor, o que nadie lo notara nunca, ni siquiera yo?
3 1 futuro | ¿Preferirías saber la fecha exacta del mejor día de tu vida, o no saberla pero que te avisen esa misma mañana?
4 0 mentiras | ¿Preferirías que cada vez que mientes te saliera una florecita en el pelo, o que cada vez que dices la verdad sonara un aplauso muy flojito?
3 0 ropa | ¿Preferirías ropa eternamente cómoda pero dos años pasada de moda, o eternamente elegante pero que cruje un poco al caminar?
2 0 tiempo | ¿Preferirías pausar a todo el mundo diez segundos una vez al día, o rebobinar tu última frase tres veces al día?
2 1 tiempo | ¿Preferirías volver a vivir un día cualquiera de tu pasado sin cambiar nada, o vivir un día de dentro de veinte años sin poder recordarlo después?
3 0 dinero | ¿Preferirías cobrar el salario mínimo por cada hora que duermes, o una cantidad desconocida por cada buena idea, pagada a final de año?
3 1 infancia | ¿Preferirías hablar diez minutos con tu yo de 15 años, o que tu yo de 15 años te observara un día entero sin que lo sepas?
3 0 casa | ¿Preferirías un mayordomo perfecto que comenta en voz alta todo lo que haces, o hacerlo todo tú sin testigos?
3 1 cultura | ¿Preferirías olvidar el final de tus películas favoritas para disfrutarlas otra vez, o recordar perfectamente todas las que ya has olvidado?
3 0 familia | ¿Preferirías que tu peor foto fuera famosa en todo el país una semana, o que tu peor frase en público se repitiera en tu familia durante diez años?
3 0 objetos | ¿Preferirías un botón que encuentra cualquier cosa perdida pero tarda un día, o uno que te dice al instante por qué entraste en una habitación?
3 1 gente | ¿Preferirías saber qué pensó de ti cada persona la primera vez que te vio, o qué piensa de ti hoy alguien que ya no está en tu vida?
2 0 vacaciones | ¿Preferirías unas vacaciones perfectas de las que no puedes hacer ninguna foto, o unas normales con fotos preciosas?
3 0 vecinos | ¿Preferirías unos vecinos que cantan ópera bien a las 8 de la mañana, o unos silenciosos que te saludan con un abrazo cada vez?
4 0 animales | ¿Preferirías que el perro de un vecino pudiera hablar pero solo para criticar tu ropa, o que nuestra nevera hablara pero solo para darte ánimos?
3 0 gente | ¿Preferirías saber el nombre de todas las personas que te han visto hoy, o que todas ellas supieran el tuyo?
3 0 casa | ¿Preferirías un gato que friega los platos pero te juzga en silencio, o un robot que lo hace todo pero suspira cada vez?
3 1 gente | ¿Preferirías recibir cada lunes una carta sincera de un desconocido, o tener que escribir una tú cada viernes?
3 0 discusiones | ¿Preferirías tener siempre razón en las discusiones pequeñas y nunca en las grandes, o al revés?
4 0 social | ¿Preferirías que te aplaudieran al entrar en cada tienda, o que te dedicaran un minuto de silencio al salir?
3 1 tiempo | ¿Preferirías pasar un día entero a solas con tu yo de 17 años, o con tu yo de 70?
3 0 coche | ¿Preferirías que las plantas te dijeran exactamente lo que necesitan, o que tu coche te dijera lo que piensa de tu forma de conducir?
3 2 familia | ¿Preferirías que tus padres pudieran ver un día cualquiera de tu vida actual, o ver tú un día cualquiera de ellos cuando tenían tu edad?
2 0 amigos | ¿Preferirías un amigo que siempre llega tarde pero con una historia increíble, o uno que siempre llega pronto y nunca tiene nada que contar?
3 0 comida | ¿Preferirías poder dormir en cualquier postura como si fuera una cama, o comer cualquier cosa como si fuera tu plato favorito?
2 1 identidad | ¿Preferirías que los desconocidos te creyeran más simpático de lo que eres, o más listo?
3 0 tiempo | ¿Preferirías un día extra cada semana que solo tú recuerdas, o una hora extra cada día que todo el mundo comparte?
3 0 objetos | ¿Preferirías que te devolvieran todos los paraguas que has perdido, o todas las horas que has pasado esperando a alguien?
3 0 restaurantes | ¿Preferirías saber qué pensó de nosotros el camarero de la última cena, o qué piensa de nosotros el vecino que nunca saluda?
3 0 viajes | ¿Preferirías pasar un año entero en el mejor hotel del mundo sin salir, o un año viajando sin dormir dos noches en el mismo sitio?
4 0 animales | ¿Preferirías que todos los perros te adoraran pero todos los niños te temieran, o al revés?
3 0 regalos | ¿Preferirías recibir cada año un objeto absurdo pero perfecto para ti, o 500 euros que solo puedes gastar en otras personas?
3 0 sueño | ¿Preferirías recordar todos tus sueños con detalle, o que te los contara cada mañana una voz de documental?
4 1 identidad | ¿Preferirías que tus memorias las escribiera tu profesora de primaria, o el gato de un vecino que te observa desde hace años?
3 1 gente | ¿Preferirías saber cuántas veces has hecho reír a alguien en tu vida, o cuántas personas han pensado en ti hoy?
3 0 casa | ¿Preferirías una casa donde cada noche una habitación cambia de sitio, o una donde todo está siempre donde lo dejaste pero nunca recuerdas dónde?
2 1 nosotros | ¿Preferirías saber qué pensé de ti el primer día, o qué pensaré de ti dentro de diez años?
3 0 comida | ¿Preferirías que cada comida te supiera a la primera vez que la probaste, o que cada canción te sonara como la primera vez que la oíste?
3 0 casa | ¿Preferirías una casa que se limpia sola pero cambia los muebles de sitio cada semana, o una que nunca se ensucia pero con un vecino que lo comenta todo?
3 1 gente | ¿Preferirías una hora con cualquier persona de tu pasado, o una hora con la persona que serás dentro de treinta años?
3 0 animales | ¿Preferirías entender a los perros pero que te hablaran sin parar, o entender a los gatos pero que solo hablaran para pedir cosas?
2 0 semana | ¿Preferirías que los lunes durasen la mitad, o que los viernes durasen el doble?
3 0 viajes | ¿Preferirías ir al sitio que quieras con alguien que no eliges tú, o a un sitio que no eliges con quien quieras?
3 0 talentos | ¿Preferirías tocar perfectamente un instrumento que nadie quiere escuchar, o cantar regular una canción que todo el mundo adora?
3 1 memoria | ¿Preferirías olvidar todas las discusiones pequeñas de tu vida, o recordar con detalle todas las veces que pediste perdón?
4 0 objetos | ¿Preferirías unas llaves que gritan dónde están, o unos zapatos que te llevan solos a donde tienes que ir, pero a su ritmo?
3 0 trabajo | ¿Preferirías un trabajo aburridísimo con compañeros fascinantes, o un trabajo fascinante completamente solo?
3 0 dinero | ¿Preferirías que te devolvieran el dinero de todo lo que compraste y nunca usaste, o el tiempo de todo lo que viste y no te gustó?
3 0 familia | ¿Preferirías una comida familiar al mes de diez horas, o una a la semana de treinta minutos exactos?
2 0 sueño | ¿Preferirías despertarte siempre cinco minutos antes de la alarma, o dormirte siempre en menos de un minuto?
4 0 social | ¿Preferirías saber el nombre de todo el mundo pero que nadie recordara el tuyo, o que todos recordaran el tuyo y tú ninguno?
3 0 comida | ¿Preferirías comer solo lo que cocines tú durante un año, o solo lo que cocine yo?
3 1 identidad | ¿Preferirías que te conocieran por tu mejor momento, o por tu día más normal?
3 0 cultura | ¿Preferirías leer la última página de todos los libros antes de empezarlos, o no saber nunca el final de los que no termines?
3 0 casa | ¿Preferirías una ducha que te canta las noticias del día, o una nevera que te sugiere la cena con tono de reproche?
2 0 clima | ¿Preferirías vivir siempre en octubre, o siempre en mayo?
3 0 gente | ¿Preferirías que los desconocidos te contaran siempre su mejor historia, o que te pidieran siempre consejo?
3 0 compras | ¿Preferirías que todo lo que compres dure el doble y cueste el doble, o que dure la mitad y la segunda sea gratis?
4 0 fama | ¿Preferirías que una frase tuya se convirtiera en refrán sin que nadie supiera que es tuya, o que te citaran mal con tu nombre durante cien años?
3 1 infancia | ¿Preferirías tener siete años una semana con lo que sabes ahora, o que tu yo de siete años pasara una semana aquí, con nosotros?
3 0 viajes | ¿Preferirías hablar todos los idiomas pero perder el sentido de la orientación, o no perderte nunca y hablar solo el tuyo?
3 0 tecnologia | ¿Preferirías un teléfono que nunca se queda sin batería pero no tiene cámara, o una cámara perfecta en un teléfono que dura dos horas?
3 0 restaurantes | ¿Preferirías el mejor plato del mundo en un sitio feo y con prisa, o un plato normal en el sitio más bonito que hayas visto, sin prisa?
3 0 costumbres | ¿Preferirías no hacer cola jamás, o no esperar a nadie jamás?
3 0 casa | ¿Preferirías vivir en una casa diminuta en tu calle favorita, o en una enorme en una calle que te da igual?
3 1 vecinos | ¿Preferirías saber exactamente qué piensan de ti tus amigos, o qué piensan de ti tus vecinos?
4 0 animales | ¿Preferirías que un búho te acompañara a todas partes juzgándote, o que un perro pequeño te animara a todas horas, incluso en los entierros?
3 0 trabajo | ¿Preferirías no trabajar nunca los lunes pero trabajar todos los domingos, o al revés?
2 0 comida | ¿Preferirías no volver a comer tu plato favorito, o comerlo todos los días durante un año?
3 0 sueño | ¿Preferirías soñar cada noche con el mismo lugar precioso, o no repetir sueño nunca pero no recordar ninguno?
3 1 nosotros | ¿Preferirías ver una grabación de nuestra primera conversación, o de la que tendremos dentro de cincuenta años?
3 0 objetos | ¿Preferirías un sofá que se adapta perfectamente a ti pero rechaza a los demás, o uno normal que te aplaude al sentarte?
3 0 regalos | ¿Preferirías recibir siempre el regalo exacto que querías, o uno que nunca habrías pedido pero que siempre acaba siendo mejor?
3 0 ciudad | ¿Preferirías una ciudad siempre en fiestas donde nunca hay aparcamiento, o una siempre tranquila sin una sola terraza?
3 0 talentos | ¿Preferirías bailar perfectamente solo cuando nadie mira, o solo cuando todo el mundo mira?
4 0 cultura | ¿Preferirías que tu vida fuera un documental narrado por alguien que te admira, o una comedia narrada por alguien que te conoce demasiado?
3 1 futuro | ¿Preferirías saber qué cosa de hoy echarás de menos dentro de diez años, o qué cosa de hoy te alegrará haber dejado?
3 0 gente | ¿Preferirías una cena con tus tres profesores favoritos, o con las tres personas que peor te cayeron en el colegio, ya adultas?
3 0 casa | ¿Preferirías la temperatura perfecta en casa pero sin ventanas, o ventanas enormes y siempre un grado menos de lo que te gusta?
2 0 rutinas | ¿Preferirías que todos los días fueran iguales pero buenos, o distintos pero con uno malo a la semana?
3 0 dinero | ¿Preferirías mil euros ahora, o cien euros cada vez que hagas reír a alguien durante un año?
3 0 viajes | ¿Preferirías repetir el mejor viaje de tu vida exactamente igual, o hacer uno nuevo sabiendo que será un poco peor?
3 0 familia | ¿Preferirías que tus padres te vieran discutir conmigo una vez, o que te vieran cantar en la ducha una vez?
3 0 mentiras | ¿Preferirías no poder mentir nunca, o no poder detectar nunca una mentira?
3 1 identidad | ¿Preferirías que te recordaran por algo que hiciste a propósito, o que te quisieran por algo que hiciste sin darte cuenta?
3 0 tecnologia | ¿Preferirías que internet funcionara solo de 9 a 5, o solo de 5 a 9?
3 0 social | ¿Preferirías llegar siempre diez minutos tarde con una excusa perfecta, o diez minutos antes y tener que esperar hablando con desconocidos?

## libre teo
3 0 ascensores | ¿Por qué crees realmente que los ascensores tienen espejo? Quiero la versión conspirativa.
4 0 animales | Si las hormigas tuvieran religión, ¿qué significado teológico tendría que a alguien se le cayera una galleta?
4 0 tiendas | ¿Qué hacen los maniquíes de las tiendas cuando cierran, y quién manda entre ellos?
3 0 comida | Inventa una teoría convincente de por qué siempre acabamos cenando lo mismo cuando nadie quiere decidir.
3 0 tiendas | ¿Qué conspiración inocente ocurre en las tiendas de muebles para que siempre salgas con una vela que no necesitabas?
4 0 animales | ¿Por qué los gatos tiran cosas de las mesas? Inventa el motivo político.
3 0 animales | ¿Qué creen los peces del acuario de una sala de espera que hacemos allí todo el día?
3 0 objetos | Inventa la historia secreta del cajón de los cables de esta casa. ¿Quién lo fundó y cuál fue el primer cable?
4 0 tele | ¿Por qué desaparece el mando de la tele justo cuando empieza algo? Responde como detective.
3 0 casa | ¿Qué piensa nuestra lavadora de nosotros, basándose solo en lo que le damos?
4 0 domingos | Explica con toda la seriedad posible por qué los domingos por la tarde duran el doble que los sábados por la mañana.
3 0 familia | ¿Por qué los relojes de las cocinas de los abuelos siempre van adelantados? Inventa la razón.
4 0 animales | ¿Qué cuentan las palomas de nuestro barrio de nosotros cuando nos ven pasar?
3 0 objetos | ¿Por qué las tapas de los táperes desaparecen y los táperes no? Necesito una teoría.
4 0 sueño | ¿De dónde salen realmente las ideas brillantes que se tienen justo antes de dormir y por qué se van?
3 0 ropa | ¿Adónde van los calcetines que desaparecen en la lavadora? Quiero destino, medio de transporte y motivo.
4 0 coche | ¿Por qué el semáforo se pone en rojo justo cuando llegas tú? Explica el sistema de vigilancia.
3 0 cafes | ¿Por qué el café de las máquinas del trabajo sabe así? Inventa la receta oficial.
4 0 clima | Las nubes tienen forma de cosas porque alguien las diseña. ¿Quién, y qué encargo recibió esta mañana?
3 0 objetos | ¿Dónde están todos los bolígrafos que has perdido en tu vida? Describe el lugar como un guía turístico.
4 0 tecnologia | ¿Por qué el wifi funciona peor justo en la habitación donde más lo necesitas? Dame la explicación geopolítica.
3 0 supermercado | Explica por qué la otra cola del supermercado siempre va más rápido, como un físico muy cansado.
4 0 comida | ¿Por qué el pan del día siguiente está duro pero las galletas del día siguiente están blandas? Inventa el pacto.

## libre comp
1 0 humor | Completa: «Sé que te estás quedando sin batería cuando empiezas a ______.»
2 0 casa | Completa: «Si alguna vez desaparezco, buscadme primero en ______.»
2 1 nosotros | Completa: «Lo que más me sorprendió de vivir contigo fue ______.»
2 0 talentos | Completa: «Nadie lo sabe, pero tengo un talento secreto para ______.»
2 0 cine | Completa: «En una película de atracos, mi papel sería ______ y el tuyo ______.»
2 1 cambios | Completa: «Algo que hacía antes de conocerte y he dejado de hacer sin darme cuenta es ______.»
2 0 rutinas | Completa: «Mi martes perfecto empieza con ______ y termina con ______.»
3 0 dinero | Completa: «Si me pagaran por ______, ya tendría una casa en la playa.»
2 0 gustos | Completa: «Lo que más me cuesta admitir que me gusta es ______.»
3 0 casa | Completa: «En esta casa, lo único que nunca se discute es ______.»
2 0 social | Completa: «Mi peor momento social del año pasado fue cuando ______.»
2 0 vacaciones | Completa: «Se nota que estamos de vacaciones cuando tú ______ y yo ______.»
2 0 casa | Completa: «La señal de que esta casa necesita una limpieza es que ______.»
2 0 discusiones | Completa: «La frase que más repito en una discusión y debería jubilar es ______.»
2 1 nosotros | Completa: «Si abriéramos un negocio juntos se llamaría ______ y quebraría por ______.»
2 0 humor | Completa: «Mi forma de pedir perdón sin decir perdón es ______.»
2 0 comida | Completa: «En mi última cena pediría, sin pensarlo, ______.»

## libre rank
3 0 secretos | Ordena de más a menos fiable para guardarte un secreto: una abuela de 90 años, un loro, un niño de seis años, un notario muy aburrido.
5 0 noche | Ordena de más a menos inquietante encontrarte en la cocina a las 3 de la mañana: un pavo real, tu profesor de primaria, un mimo, tu yo de ocho años.
3 0 domingos | Ordena según cuánto pueden arruinarnos un domingo: una visita sorpresa, un grifo que gotea, una serie que se acaba, un plan que nadie quería cancelar.
3 0 viajes | Ordena de mejor a peor compañero de viaje: un guía turístico jubilado, un niño que lo pregunta todo, un fotógrafo obsesivo, alguien que solo quiere dormir.
4 0 fiestas | Ordena quién organizaría mejor tu cumpleaños: un general retirado, un mago de fiestas infantiles que odia su trabajo, tu dentista, tu yo de hace diez años.
3 0 casa | Ordena estas tareas de la que más fingimos no ver a la que menos: tender, vaciar el lavavajillas, cambiar el rollo de papel, bajar la basura.
3 0 sonidos | Ordena del ruido que más te saca de quicio al que menos: alguien masticando hielo, una moto a las 7, un globo frotándose, una alarma que no es tuya.
4 0 vecinos | Ordena de mejor a peor vecino de arriba: un batería profesional, alguien que mueve muebles a medianoche, una pareja de claqué, un loro que ha aprendido tu nombre.
3 0 casa | Ordena de más a menos probable que nos pase esta semana: perder las llaves, olvidar algo en el horno, dormirnos en el sofá, comprar algo que ya teníamos.
4 0 apocalipsis | Ordena quién sobreviviría más a un apocalipsis: tu vecino, un chef, tu profesor favorito, un niño de ocho años muy listo.
3 0 clima | Ordena de mejor a peor para pasar una tarde entera: una tormenta sin luz, una ola de calor sin ventilador, nieve que no cuaja, un viento que no deja hablar.
4 0 tiempo | Ordena qué querrías que fuera eterno: un domingo por la mañana, el viaje de vuelta en tren, la sobremesa, el minuto antes de abrir un regalo.
3 0 gente | Ordena de mejor a peor compañero de piso: un monje que ha roto su voto de silencio, una presentadora del tiempo, un chef jubilado con insomnio, un niño prodigio del ajedrez.
3 0 compras | Ordena de más a menos justificable comprar en una gasolinera a las 2 de la mañana: un peluche, una guía de setas, un cargador, una plancha para el pelo.
4 0 animales | Ordena qué animal sería mejor árbitro de nuestras discusiones: un búho, una cabra, un golden retriever, una tortuga de 80 años.
3 0 casa | Ordena qué electrodoméstico echarías más de menos una semana: la lavadora, el microondas, la nevera, el router.

## libre acus
3 0 manias | Acusa formalmente a tu pareja de un delito inventado basado en una costumbre real. La defensa tiene un minuto.
3 0 casa | Presenta pruebas de que tu pareja lleva años saboteando sutilmente algo de esta casa.
4 0 comida | Lee los cargos: tu pareja está acusada de un crimen contra la cocina. ¿Cuál es y cuántos años le caen?
3 0 objetos | Denuncia ante el tribunal de la casa el uso indebido de un objeto por parte de tu pareja. Pide una pena proporcionada.
3 0 planes | Acusa a tu pareja de cancelar planes con una técnica concreta y repetida. Describe la técnica como un experto en seguridad.
3 0 sueño | Acusa a tu pareja de un delito nocturno del que no se acuerda. Aporta testigos: la almohada, la manta, el despertador.
3 0 tele | Acusa a tu pareja de manipular el mando a distancia con fines oscuros. Presenta la línea temporal de los hechos.

## libre tit
2 0 semana | Ponle un *titular* de periódico a nuestra última semana.
3 0 vecinos | Escribe el titular del periódico del barrio si los vecinos supieran lo que pasó en esta casa el último sábado.
2 0 comida | Resume en un titular la peor decisión culinaria que hemos tomado juntos.
3 0 nosotros | Escribe la portada del periódico del día en que nos conocimos, si solo hubiera sido noticia eso.
3 0 casa | Titular de la revista de decoración que visitara nuestra casa sin avisar un martes a las 8 de la tarde.
2 0 salir | Titular del telediario sobre nuestro último intento de salir de casa a la hora prevista.
3 0 compras | Titular de la sección de economía sobre la última compra que hicimos «porque estaba de oferta».

## libre expl
3 0 nosotros | Explícale nuestra relación a un extraterrestre usando solo tres objetos de esta casa.
3 0 domingos | Explícale a alguien del siglo XVIII qué hacemos un domingo por la tarde.
3 0 casa | Explica cómo funciona nuestra cocina como si fuera el manual de una nave espacial.
4 0 nosotros | Explícale a un niño de cinco años cómo nos conocimos, dibujando en el aire.
3 0 tele | Explícale a alguien de 1950 lo que hacemos cada noche antes de elegir una serie.
3 0 comida | Explícale a un chef con tres estrellas cómo preparamos la cena un miércoles cualquiera, con el mismo tono que usaría él.
3 0 discusiones | Explica una discusión nuestra típica como si fuera el reglamento de un deporte: duración, faltas, cómo se gana.

## libre ctx
2 0 comida | Tenemos 20 minutos, estamos agotados y nadie quiere decidir qué cenar. ¿Quién acaba decidiendo y qué acaba pasando?
3 0 bodas | Nos invitan a dos bodas el mismo día: una de alguien muy querido a cuatro horas, otra de alguien que nos da igual con la mejor comida de la historia. ¿Qué hacemos de verdad?
2 0 planes | Llueve, es sábado, uno quiere salir y el otro no. ¿Quién gana normalmente y con qué argumento?
3 0 vacaciones | Nos sobra un día de vacaciones y 200 euros, y hay que decidir en cinco minutos. ¿Qué acaba pasando de verdad?
3 0 familia | Llama un familiar para avisar de que viene a comer en una hora. ¿Qué hace cada uno en los primeros cinco minutos?
3 0 regalos | Faltan dos días para el cumpleaños de alguien importante y ninguno ha comprado nada. ¿Quién lo arregla, cómo, y quién se lleva el mérito?
2 0 casa | Hemos invitado a cenar a seis personas y una hora antes el horno no funciona. ¿Quién decide qué, y qué acabamos comiendo?
3 0 viajes | Nos regalan un fin de semana en una ciudad que uno adora y el otro odia, o nada. ¿Qué pasa de verdad?

## rapida rap
2 0 identidad | Nombre de mi autobiografía.
2 0 humor | Un color para mi humor de hoy.
3 0 casa | El electrodoméstico que más me quiere.
2 0 domingos | Nombre para un perfume que huela a domingo por la tarde.
4 0 objetos | Un objeto que sería un pésimo presidente.
2 0 coche | Una palabra para mi forma de conducir.
2 0 animales | El peor nombre posible para un gato.
1 0 comida | Una cosa que nunca falta en nuestra nevera.
2 0 viajes | Título de la película de nuestro último viaje.
3 0 talentos | Mi superpoder inútil.
2 0 trabajo | Una profesión que yo haría fatal.
3 0 vecinos | Nombre del grupo de música que formarían nuestros vecinos.
3 0 comida | Un sabor de helado que solo compraría yo.
1 0 objetos | El objeto más inútil que tenemos en casa.
2 0 comida | Un alimento que yo nunca compartiría.
2 0 musica | La canción que pondría yo para fregar.
3 0 viajes | Nombre de nuestro barco pirata.
2 0 viajes | Primer destino que te viene a la cabeza para escaparnos este fin de semana.
3 0 familia | Un famoso que podría ser primo mío.
2 0 frases | La palabra que yo digo mal a propósito.
3 0 deporte | Un deporte olímpico que yo ganaría sin entrenar.
3 0 casa | El nombre de esta casa si fuera un hotel.
2 0 manias | Una manía mía en tres palabras.
1 0 viajes | Algo que siempre olvido en los viajes.
3 0 animales | El nombre de nuestra próxima mascota imaginaria.
2 0 casa | Mi sitio de la casa a las 11 de la noche.
2 0 planes | Lo que yo haría ahora mismo con 20 minutos libres.
2 0 comida | Mi plato de emergencia.
2 0 objetos | Lo que yo digo cuando pierdo algo.
2 0 casa | Un apodo para nuestro sofá.
1 0 semana | La primera palabra que piensas al oír «lunes».
2 0 tiempo | Mi frase cuando llego tarde.
3 0 restaurantes | Nombre para un bar que solo abre cuando llueve.
2 0 dinero | Lo primero que compraría yo si me tocara la lotería a las 7 de la mañana.
3 0 cine | Nombre de nuestro dúo si fuéramos atracadores de bancos.
3 0 supermercado | Mi animal espiritual dentro de un supermercado.
3 0 sonidos | El sonido que haría yo si fuera un electrodoméstico.
2 0 compras | Una cosa que yo compro siempre de más.
3 0 objetos | Un objeto de esta habitación que sería un buen sombrero.
2 0 tiempo | Mi hora favorita del día, en un número.
3 0 fiestas | Una tradición navideña nueva para esta casa.
2 0 sueño | La hora a la que de verdad me duermo cuando digo «ya me voy a la cama».
4 0 tecnologia | Un objeto que jamás debería tener versión inteligente.
2 0 clima | El tiempo que hace hoy dentro de mi cabeza.
2 0 comida | La fruta que mejor me representa.
3 0 vecinos | Título de la serie sobre nuestro edificio.
2 0 casa | La habitación de la casa donde pienso mejor.
2 0 tiempo | Mi mes favorito del año, sin dudar.
3 0 trabajo | Mi cargo si trabajara en un circo.
2 0 musica | El instrumento que yo tocaría en una orquesta.
2 0 fiestas | Mi disfraz por defecto.
3 0 cine | El actor o la actriz que me interpretaría en una película barata.
2 0 animales | El animal al que más me parezco al despertarme.
3 0 objetos | Un objeto de casa que serviría de arma en una película de acción.
2 0 frases | Mi muletilla.
2 0 deporte | El deporte que yo inventaría.
3 0 ciudad | La ciudad donde yo sería más feliz, sin pensarlo.
2 0 comida | Mi postre de urgencia.
2 0 sueño | Mi sueño recurrente en tres palabras.
3 0 identidad | Mi nombre si fuera un personaje de novela histórica.
2 0 tele | El programa de televisión que yo presentaría.
3 0 talentos | Mi superpoder, pero solo útil dentro de casa.
2 0 viajes | Lo primero que hago en una ciudad nueva.
2 0 ropa | La prenda que yo rescataría de un incendio.
3 0 restaurantes | Nombre del restaurante que abriríamos juntos.
2 0 social | Mi frase para saludar a alguien cuyo nombre he olvidado.
3 0 familia | El pariente al que más me parezco sin querer.
2 0 objetos | Lo que hay en mi bolsillo ahora mismo, sin mirar.
3 0 cine | Título de la película de miedo sobre nuestra cocina.
2 0 mañanas | Mi primer pensamiento de hoy.
2 0 casa | Mi tarea de casa favorita, si existe.
3 0 animales | El animal que yo sería en una fábula, y su moraleja.
2 0 comida | El sabor que me pone de buen humor.
3 0 tecnologia | El invento que yo habría patentado por accidente.
2 0 tiempo | Una hora del día a la que nunca deberían llamarme.
3 0 musica | La canción que sonaría al entrar yo en un bar del Oeste.
2 0 planes | El plan perfecto para esta noche, en cuatro palabras.
3 0 vecinos | El apodo que me tienen los vecinos.
2 0 dinero | En qué gastaría yo cien euros hoy mismo.
3 0 objetos | Un objeto de esta casa que sabría guardar un secreto.
2 0 humor | Lo que me quita el enfado al instante.
2 0 viajes | El sitio al que volvería mañana mismo.
3 0 trabajo | Mi excusa más creíble para no ir a algo.
2 0 comida | Lo que yo robaría de un bufé.
3 0 casa | Nombre del fantasma que vive en nuestro pasillo.
2 0 talentos | Lo que yo haría en un concurso de talentos.
3 0 cine | El género de nuestra vida esta semana.
2 0 manias | Lo que no soporto que me toquen.
3 0 historia | La época histórica en la que yo habría durado menos.
2 0 sonidos | El sonido que más me calma.
3 0 regalos | El regalo que yo le haría a alguien que no me gusta.
2 0 casa | Mi rincón favorito de esta casa, en una palabra.
3 0 social | La persona famosa con la que yo me llevaría fatal.

## predice pre
3 0 cdb | Unos extraterrestres te devuelven a casa después de 48 horas de abducción. Sin decir una palabra, haces algo que confirma que sigues siendo tú. ¿Qué haces?
3 0 cdb,casa | Un detective tiene que averiguar si has pasado por una habitación solo mirando la habitación. ¿Qué pista te delata siempre?
4 0 cdb,viajes | Te dejan dirigir un aeropuerto durante un día entero. ¿Qué norma nueva implantas antes del mediodía?
3 0 cafes | Tienes que elegir un nombre falso para dar en las cafeterías el resto de tu vida. ¿Cuál eliges?
3 0 cdb,viajes | Nos regalan una noche en un hotel de lujo, pero solo si el personal no descubre en 24 horas que no somos ricos. ¿Qué haces tú que nos delataría antes de la cena?
2 0 cdb,humor | Si tuvieras una barra de energía visible, ¿qué cosa cotidiana te la baja a cero de golpe?
2 0 cdb,supermercado | Te pierdo de vista diez minutos en el supermercado. ¿En qué pasillo te encuentro y haciendo qué?
3 0 cdb,tele | Te meten en un reality de convivencia con desconocidos. ¿En qué semana te echan y por qué motivo ridículo?
3 1 cdb,futuro | Tu yo de dentro de 30 años llama a la puerta, te da un único aviso y se va. ¿Sobre qué es el aviso?
2 0 compras | Te dan 500 euros para gastarlos hoy enteros en una sola tienda que no venda comida. ¿En qué tienda entras?
3 0 trabajo | Te ofrecen ser durante un año la voz de la megafonía de una estación de tren. ¿Aceptas? ¿Qué frase añadirías por tu cuenta?
2 0 restaurantes | En un restaurante te traen un plato que no has pedido. ¿Te lo comes sin decir nada, lo devuelves, preguntas mientras ya lo pruebas, o miras a tu pareja para que lo resuelva?
1 1 infancia | Puedes recuperar un solo objeto de tu infancia que ya no existe. ¿Cuál pides?
2 0 cdb,frases | Te prohíben durante una semana decir tu frase más repetida. ¿Cuál es la frase y cuánto aguantas?
3 0 animales | ¿Contra qué animal crees que ganarías una pelea, aunque claramente no ganarías?
3 0 cdb,tiendas | Pasas una noche entera dentro de un IKEA cerrado. ¿Qué es lo primero que haces?
2 0 tele | Tienes 20 minutos en televisión nacional para hablar de lo que quieras. ¿De qué hablas?
3 0 ropa,trabajo | Te ofrecen el trabajo de tus sueños con una sola condición: llevar el mismo jersey todos los días durante un año. ¿Aceptas? ¿Qué jersey?
2 0 restaurantes | Ganas una cena con cualquier persona viva, pero tiene que ser en un sitio de comida rápida. ¿A quién invitas?
3 0 cdb,trabajo | Te dan un día libre sorpresa un miércoles y no puedes contárselo a nadie. ¿Qué haces a las 11 de la mañana?
2 0 musica,coche | Eliges la música de un viaje en coche de seis horas y nadie puede discutírtelo. ¿Qué suena primero?
4 0 cdb,vecinos | Te dan el mando de nuestra calle durante un mes. ¿Cuál es tu primera medida?
3 0 fiestas | En una fiesta de disfraces sin tema, ¿de qué te disfrazas si nadie te ayuda a decidir?
3 0 tecnologia | Puedes borrar un invento de la historia, pero tiene que ser pequeño y cotidiano. ¿Cuál desaparece?
3 0 tecnologia | Internet desaparece una semana en todo el mundo. ¿Qué cosa rara acabas haciendo el martes por la tarde?
2 0 trabajo | Te regalan un año sabático pagado. ¿Qué haces el primer mes?
3 0 tiempo | Puedes cambiarle el nombre a un día de la semana. ¿Cuál y cómo se llama?
3 0 comida | En una isla desierta te permiten un solo condimento para toda la vida. ¿Cuál?
3 0 talentos | Te suben a un escenario delante de 300 personas a hablar una hora sin preparar nada. ¿De qué hablas, y en qué minuto empiezas a inventar?
3 0 talentos | Escribes un libro de autoayuda basado en algo que haces bien. ¿Cómo se titula?
4 0 objetos | Una empresa fabrica un muñeco con tu cara. ¿Qué frase dice al apretarle la barriga?
3 0 musica | Te cuelan en el camerino de un concierto y tienes cinco minutos a solas con el artista. ¿Con quién, y qué le preguntas que nadie le pregunta?
2 0 viajes | Tenemos que mudarnos mañana a otra ciudad del país. ¿Cuál eliges, y por qué motivo poco serio?
3 0 cdb,frases | Tienes que pasar 24 horas sin hablar. ¿Qué es lo primero que intentas decir con gestos?
2 0 tiendas | Tienes una tarde para ti en un centro comercial vacío. ¿A qué tienda vas primero?
3 0 animales | Puedes tener un animal de compañía de cualquier especie, pero tiene que vivir en este piso. ¿Cuál eliges?
3 0 cine | Ganas una cena en casa de cualquier personaje de ficción. ¿En qué casa cenas?
3 0 casa | Hay que salir de casa en 30 segundos. ¿Qué objeto coges que no tiene ningún sentido coger?
3 0 ropa | Tienes que llevar una camiseta con una frase durante un año. Tú eliges la frase. ¿Cuál es?
4 0 tiempo | Te toca ponerle nombre al próximo huracán. ¿Cómo se llama?
2 0 cdb,mañanas | Tienes la mañana libre y no hay nadie en casa. ¿Qué es lo primero que haces?
3 0 casa | Puedes elegir el olor oficial de nuestra casa. ¿Cuál?
3 0 viajes | Puedes quedarte con un objeto de cualquier hotel en el que hayas estado. ¿Cuál coges?
4 0 cine | Te ofrecen un pequeño papel en una película. Eliges el género. ¿Cuál, y qué papel?
2 0 deseos | Aparece un genio que solo concede deseos pequeños e inmediatos. ¿Qué le pides primero?
3 1 tiempo | Tienes que vivir un mes en el pasado con tu trabajo actual. ¿En qué año te defenderías mejor?
4 0 casa | Te obligan a cambiar tu nombre por el de un mueble. ¿Cuál eliges?
3 0 cdb,social | En una cena con desconocidos, ¿qué tema sacas tú cuando nadie sabe qué decir?
3 0 cdb,dinero | Te toca la lotería y prometes que no cambiará nada. ¿Qué es lo primero que cambia?
3 0 cdb,viajes | Perdemos el último tren y hay que pasar la noche en la estación. ¿Qué haces tú en la primera hora?
4 0 cdb,objetos | Tienes que convencer a un jurado de que eres tú y no un clon. Solo puedes enseñar un objeto de la casa. ¿Cuál?
2 0 cdb,comida | Te quedas a solas con una tarta entera durante una hora y nadie lo va a saber nunca. ¿Cuánta queda?
3 0 cdb,familia | En la próxima comida familiar te pagan 100 euros por cada tema polémico que consigas evitar. ¿Cuánto ganas?
3 0 cdb,casa | Te quedas tres días solo en casa. ¿Qué norma de convivencia se rompe primero, y a qué hora?
3 0 cdb,comida | Puedes cenar lo que quieras esta noche sin cocinar ni pagar. ¿Qué pides exactamente, con los cambios que siempre pides?
3 0 cdb,viajes | Nos regalan un viaje sorpresa y solo te dicen el clima: frío. ¿Qué es lo primero que metes en la maleta?
3 0 cdb,tiempo | Te dan una hora extra al día que nadie más tiene. ¿A qué hora la pones y en qué la gastas la primera semana?
2 0 cdb,social | En una boda te sientan con desconocidos. ¿Cuál es tu primera pregunta para romper el hielo?
3 0 animales | Puedes tener cualquier animal como compañero de trabajo. ¿Cuál te llevas el primer día?
3 0 cdb,objetos | Alguien te da 200 euros para una sola cosa inútil. ¿Qué compras?
4 0 cdb,fama | Te ofrecen ser famoso un año por una sola habilidad tuya. ¿Cuál eliges para no pasar vergüenza?
3 1 cdb,infancia | Tu yo de diez años pasa un día contigo. ¿Qué es lo que más le impresiona de tu vida actual?
2 0 cdb,casa | Avisan de visita con media hora de margen. ¿Qué parte de casa limpias primero?
3 0 cdb,cine | Eliges tú el género de la película de esta noche. ¿Cuál, y en qué minuto te duermes?
3 0 cdb,trabajo | Te regalan un día libre que tienes que gastar en un sitio al que normalmente no irías. ¿Dónde acabas?
3 0 cdb,casa | ¿Cuántos vasos o tazas hay ahora mismo fuera de su sitio en esta casa? Di un número.
2 0 cdb,musica | Te piden una canción para abrir una fiesta. ¿Cuál dices?
3 0 cdb,dinero | Te toca un premio pequeño: 3.000 euros. ¿Qué haces primero, antes incluso de contarlo?
4 0 cdb,tiendas | Te encierran una noche en una tienda de deportes. ¿Qué estás haciendo a la una de la madrugada?
3 0 cdb,familia | Tu familia prepara una fiesta sorpresa. ¿En qué momento te das cuenta, y cómo disimulas?
3 0 cdb,viajes | Perdemos las maletas en un viaje. ¿Qué es lo primero que compras al llegar?
2 0 cdb,frases | Te dan un megáfono un minuto en una plaza llena. ¿Qué dices?
3 0 cdb,objetos | Hay que meter un objeto de casa en una cápsula del tiempo. ¿Cuál eliges tú?
3 0 cdb,comida | Abres un puesto de comida callejera. ¿Qué vendes, y cómo se llama?
3 1 cdb,futuro | Dentro de veinte años damos una fiesta. ¿Qué anécdota de ahora contarás tú a todo el mundo?
2 0 cdb,mañanas | Hoy no suena la alarma. ¿A qué hora te despiertas solo?
3 0 cdb,tele | Te invitan a un concurso de televisión. ¿Cuál eliges, y en qué pregunta caes?
3 0 cdb,salud | Te mandan una semana de reposo absoluto. ¿Qué día te la saltas, y para qué?
4 0 cdb,vecinos | Durante un día puedes cambiar una norma del edificio. ¿Cuál cambias?
3 0 cdb,planes | Tarde libre, llueve y la nevera está vacía. ¿Qué estás haciendo a las seis?
3 0 cdb,gente | Invitas a cenar a tres personas de tu vida que no se conocen entre sí. ¿A quiénes?
2 0 cdb,ropa | Te invitan a algo elegante dentro de una hora. ¿Qué te pones, sin pensarlo?
3 0 cdb,animales | Encuentras un perro perdido. ¿Qué nombre provisional le pones mientras buscas a su dueño?
3 0 cdb,talentos | Te apuntan sin permiso a un taller de fin de semana y eliges tú el tema para que no sea un desastre. ¿Cuál?
3 0 cdb,casa | Puedes añadir una habitación a casa, del tamaño que quieras, con un único uso. ¿Qué habitación?
3 0 cdb,viajes | Vuelo largo: ventana, pasillo o en medio. ¿Qué eliges, y qué haces la primera hora?
3 0 cdb,comida | Solo puedes pedir una cosa de la carta de un bar cualquiera durante un mes. ¿Qué pides?
4 0 cdb,fama | Un periodista escribe un artículo sobre ti. ¿Qué titular acaba eligiendo?
2 0 cdb,tiempo | Te sobran veinte minutos antes de una cita. ¿Dónde los pasas?
3 0 cdb,objetos | Tienes que regalar uno de tus objetos favoritos a alguien que lo cuidará bien. ¿Cuál das?
3 0 cdb,trabajo | Te hacen jefe por un día en tu trabajo. ¿Cuál es tu primera decisión, y cuál te costaría el puesto?
3 0 historia | Puedes pasar un día en cualquier siglo, con la ropa adecuada, y volver. ¿Qué siglo, y por qué te metes en problemas?
3 0 cdb,casa | Nos regalan una planta enorme. ¿Dónde la pones, y cuánto dura?
3 0 cdb,gente | Un desconocido te pide ayuda con algo que se te da bien. ¿Qué es?
2 0 cdb,comida | Toca pedir el postre para los dos sin consultarme. ¿Qué pides?
3 0 cdb,social | En una reunión eterna, ¿qué haces para sobrevivir sin que se note?
3 0 cdb,viajes | Tarde libre en una ciudad desconocida y sin mapa. ¿Qué buscas primero?
3 1 cdb,identidad | Tienes que escribir la frase de tu propia estatua. ¿Qué pone?
3 0 cdb,sueño | Te dan un día entero para dormir sin consecuencias. ¿Cuántas horas duermes de verdad?
3 0 cdb,objetos | Puedes llevar un solo objeto a una isla con comida y agua. ¿Cuál?
3 0 cdb,fiestas | Organizas una fiesta temática y eliges el tema. ¿Cuál es, y quién no viene?
3 0 cdb,casa | Se va la luz toda la noche. ¿Qué estás haciendo a las once?
3 1 cdb,tiempo | Puedes mandar una sola frase a tu yo de hace diez años. ¿Qué dice?

## alavez vez
2 0 casa | Si esta casa tuviera un *modo invitados*, ¿qué es lo primero que cambiamos sin hablarlo cuando viene alguien?
4 0 casa | Cada casa desprende un olor que refleja el humor de quien vive en ella. ¿A qué huele esta casa un domingo por la mañana?
2 0 discusiones | ¿Cuál es el tema de nuestra discusión más repetida? Decidlo a la vez.
2 0 objetos | ¿Qué objeto de casa sobra claramente pero nadie se atreve a tirar?
2 0 amigos | ¿Qué amigo nuestro llegaría primero a una emergencia a las 4 de la mañana?
3 0 amigos | ¿Qué amigo nuestro sería el peor compañero en una isla desierta?
2 0 planes | ¿Cuál fue el plan que menos esperábamos y mejor salió?
2 0 comida | Hay que pedir cena ahora mismo, sin hablar. ¿Qué pedimos?
3 1 musica | ¿Qué canción suena en vuestra cabeza al pensar en nuestro primer año?
2 0 social | ¿Quién de los dos se rendiría antes en un concurso de no hablar durante un día?
2 0 objetos | ¿Quién de los dos ha perdido más llaves a lo largo de su vida?
3 0 social | ¿Quién de los dos acabaría antes hablando con un desconocido en una cola?
3 0 fama | ¿Quién de los dos se haría famoso antes por accidente? ¿Y por qué?
3 0 vacaciones | Una palabra para nuestras últimas vacaciones.
2 0 casa | ¿Qué rincón de la casa es claramente territorio de uno de los dos?
3 0 sonidos | Si esta casa tuviera un sonido característico, ¿cuál sería?
3 0 frases | ¿Qué frase decimos los dos con demasiada frecuencia?
2 0 comida | ¿Cuál es el plato que mejor nos sale cuando cocinamos juntos?
3 0 tiempo | ¿En qué época del año somos peores personas?
4 0 viajes | Hay que huir mañana a otro país con un solo objeto de la casa. ¿Cuál cogemos?
2 0 tele | ¿Qué serie empezamos y nunca terminamos?
3 0 viajes | ¿Qué viaje repetiríamos exactamente igual, sin cambiar nada?
3 0 semana | ¿Qué día de la semana nos sienta peor como pareja?
2 0 casa | ¿Qué tarea de casa está más injustamente repartida?
3 0 amigos | ¿Qué amigo nuestro sería el peor guardando un secreto?
2 0 compras | ¿Qué compramos que más rápido se convirtió en un error?
3 1 nosotros | Si esta etapa de nuestra vida tuviera nombre, ¿cuál sería?
3 1 recuerdos | ¿Qué olor os lleva directamente a nuestros primeros meses?
2 0 restaurantes | Si solo pudiéramos ir a un restaurante el resto de la vida, ¿cuál?
3 0 familia | ¿Qué miembro de la familia sobreviviría mejor a un apocalipsis?
4 0 animales | Si fuéramos una especie animal de documental, ¿cuál seríamos?
3 0 familia | ¿Qué frase de un familiar se ha convertido en una frase nuestra?
2 0 tele | ¿Cuál es nuestra película de «no sabemos qué ver»?
3 0 discusiones | ¿Qué discusión nuestra nunca se ha resuelto y probablemente nunca se resolverá?
2 1 rutinas | ¿Qué cosa pequeña convierte un día normal en un buen día para nosotros?
3 0 fiestas | ¿En qué momento exacto de una fiesta queremos irnos los dos?
3 0 comida | Tres cosas que siempre hay en nuestra nevera. Decidlas a la vez y contad cuántas coinciden.
3 1 nosotros | Una palabra que defina este último mes.
3 0 viajes | El próximo destino, si no hubiera que ponerse de acuerdo.
3 0 casa | El objeto de casa que el otro salvaría primero de un incendio.
2 0 numeros | ¿Cuántos meses llevamos juntos? El número exacto, a la vez.
2 0 comida | El plato que pediríamos si solo pudiéramos pedir uno para los dos.
3 0 amigos | ¿Qué amigo nuestro tiene más probabilidades de llamarnos esta semana?
2 0 casa | ¿Qué cosa de casa lleva más tiempo rota?
3 0 viajes | El próximo viaje que haremos, aunque no esté planeado.
2 0 tele | La serie que vemos cuando no queremos pensar.
3 0 nosotros | ¿Quién de los dos pediría perdón primero tras una discusión por nada?
2 0 compras | Lo último que compramos y no deberíamos.
3 0 familia | ¿A qué familiar llamaríamos primero si nos pasara algo bueno?
2 0 tiempo | ¿A qué hora cenamos de verdad, de media?
3 0 casa | ¿Qué habitación de casa necesita más una reforma?
2 0 musica | La canción que cantaríamos en un karaoke sin ponernos de acuerdo.
3 0 nosotros | ¿Quién de los dos hablaría más en una entrevista sobre nuestra pareja?
2 0 comida | El ingrediente que nunca falta cuando cocinamos juntos.
3 0 planes | El plan que siempre decimos que haremos y no hacemos.
2 0 animales | Si tuviéramos que adoptar un animal mañana, ¿cuál?
3 0 nosotros | ¿Cuál de los dos tiene mejor memoria para las fechas?
2 0 sueño | ¿Quién de los dos se duerme antes casi siempre?
3 0 viajes | El sitio donde hemos sido más felices de viaje, en una palabra.
2 0 casa | El sitio exacto de casa donde se acumulan las cosas sin dueño.
3 0 amigos | ¿Quién de los dos tiene el amigo más raro?
2 0 compras | El objeto que compramos dos veces porque creíamos no tenerlo.
3 0 discusiones | La palabra que más decimos cuando discutimos.
2 0 comida | Nuestro desayuno de domingo, en dos palabras.
3 0 nosotros | ¿Quién de los dos se iría a vivir a otra ciudad mañana mismo?
2 0 cine | El personaje de ficción que podría vivir con nosotros sin problema.
3 0 vecinos | El vecino al que mejor conocemos sin saber su nombre.
2 0 planes | Lo que haríamos con un fin de semana libre y dinero de sobra.
3 0 casa | El mueble que mejor aguantaría una mudanza.
2 0 musica | El grupo o cantante que escuchamos los dos sin confesarlo.
3 0 nosotros | ¿Cuál de los dos tiene mejor letra?
2 0 familia | La frase que diría una de nuestras madres si entrara ahora mismo por la puerta.
3 0 tiempo | El año de nuestra vida que repetiríamos.
2 0 restaurantes | El restaurante al que llevaríamos a alguien para impresionarlo.
3 0 nosotros | ¿Quién de los dos perdería antes el pasaporte?
2 0 sonidos | El sonido que más se oye en casa un sábado por la mañana.
3 0 gente | La persona que mejor nos conoce aparte de nosotros.
2 0 comida | Lo que pediríamos en una pizzería sin ponernos de acuerdo.
3 0 cine | La película que ya hemos visto demasiadas veces.
2 0 nosotros | ¿Quién de los dos tiene peor sentido de la orientación?
3 0 viajes | El transporte en el que peor viajamos juntos.
2 0 compras | Lo que siempre olvidamos comprar.
3 0 nosotros | Nuestro mayor punto en común, en una palabra.
2 0 casa | La tarea de casa que hacemos juntos y nos sale bien.
3 0 planes | El sitio al que iremos la próxima vez que nadie quiera decidir.
2 0 gente | ¿Quién de los dos se haría antes amigo del camarero?
3 0 semana | El día de la semana que más nos gusta a los dos.
2 0 objetos | El objeto que más veces se ha perdido en esta casa.
3 0 nosotros | La palabra con la que nos describiría un desconocido tras cenar con nosotros.
2 0 comida | La comida que cada uno cree que al otro no le gusta, pero sí.

## juicio jui
3 sueño | ¿Una siesta de más de dos horas sigue siendo una siesta? | Sí. Una siesta es una siesta, dure lo que dure. | No. A partir de dos horas es una segunda noche.
3 casa | ¿Quien duerme más cerca de la puerta tiene que investigar los ruidos raros? | Sí. Quien está más cerca, va. | No. Va quien oyó el ruido primero.
3 comida | Si pruebas la comida cinco veces mientras cocinas, ¿ya has cenado? | Sí. Cinco pruebas son una cena. | No. Probar no cuenta.
3 frases | ¿Es aceptable decir «ya voy» cuando todavía no te has movido? | Sí. Es una declaración de intenciones. | No. Es una mentira con buena prensa.
3 salud | ¿Hay que decir «salud» si alguien estornuda cinco veces seguidas? | Sí. Cada estornudo merece el suyo. | No. A partir del tercero ya es su problema.
4 comida | ¿Es aceptable comerse la parte crujiente de la lasaña antes de servirla? | Sí. Es la propina del cocinero. | No. Es un robo con delantal.
3 objetos | ¿Ponerle nombre propio a un electrodoméstico es normal? | Sí. Se lo ha ganado. | No. Es un aparato.
3 casa | ¿Hablar con las plantas es razonable? | Sí. Crecen mejor y escuchan. | No. Es un monólogo con hojas.
3 objetos | ¿Guardar bolsas dentro de una bolsa es orden o un problema? | Orden. Siempre hacen falta. | Un problema con asas.
3 ropa | ¿La ropa de la silla está limpia o sucia? | Limpia. Solo está descansando. | Sucia. Está en lista de espera.
3 comida | ¿Mojar galletas en el café es una técnica o una falta de respeto a la galleta? | Una técnica milenaria. | Una falta de respeto.
3 sueño | ¿Posponer la alarma tres veces es descansar o sufrir? | Descansar. Son tres minisiestas. | Sufrir. Tres despertares en vez de uno.
4 casa | ¿Los fantasmas deberían pagar alquiler? | Sí. Ocupan espacio. | No. Ya trabajan bastante asustando.
4 animales | Si un perro pudiera votar, ¿debería poder hacerlo? | Sí. Tiene opiniones claras. | No. Votaría a quien le dé jamón.
4 animales | Un gato que lleva diez años en una casa, ¿tiene derecho a voto en la mudanza? | Sí. Es el que más horas pasa en ella. | No. Votaría quedarse en una caja.
4 animales | Si un caracol lleva tres días cruzando la cocina, ¿está de paso o se ha mudado? | De paso. Solo es lento. | Se ha mudado. Tres días es vivir ahí.
4 comida | Si la tostada cae del lado de la mermelada tres veces seguidas, ¿es mala suerte o es personal? | Mala suerte. Es física. | Es personal. La tostada sabe algo.
4 objetos | Si un calcetín perdido aparece en casa de otra persona, ¿sigue siendo tuyo? | Sí. Un calcetín no cambia de dueño. | No. Ya ha hecho su vida.
4 cine | Si te duermes en una película y sueñas el final, ¿la has visto? | Sí. Has visto un final. | No. Has visto otra película.
4 animales | ¿Un pato con corbata es más respetable que una persona sin corbata? | Sí. Ha hecho un esfuerzo. | No. Sigue siendo un pato.
4 casa | Un fantasma que solo abre armarios, ¿está asustando o ayudando? | Asustando. Nadie le pidió nada. | Ayudando. Está aireando la ropa.
4 restaurantes | Si una paloma entra en un restaurante, ¿es cliente o incidente? | Cliente. Ha entrado por su pie. | Incidente. No ha reservado.
4 sueño | ¿Se puede estar enfadado con alguien por lo que hizo en tu sueño? | Sí. Tú lo viste. | No. Fue tu cerebro el que lo escribió.
4 familia | Si heredas un elefante, ¿rechazarlo es de mala educación? | Sí. Un regalo es un regalo. | No. Un elefante es una hipoteca.
3 casa | ¿Las plantas del balcón son mascotas o muebles? | Mascotas. Comen, beben y se mueren si las olvidas. | Muebles. No vienen cuando las llamas.
4 animales | Si un pulpo sabe abrir botes, ¿puede trabajar de cocinero? | Sí. Tiene ocho manos y disciplina. | No. Se comería a los compañeros.
4 identidad | Si tu reflejo te guiña un ojo, ¿lo cuentas o te lo callas? | Lo cuentas. Es noticia. | Te lo callas. Nadie te creería.
4 vecinos | ¿La luna es un vecino de arriba o un objeto decorativo? | Vecino. Se asoma cada noche. | Decoración. No paga comunidad.
4 comida | ¿Un sándwich cortado en triángulos sabe mejor? | Sí. El triángulo es un formato superior. | No. Es el mismo sándwich con pretensiones.
4 animales | Si una tortuga lleva 40 años en una familia, ¿es mascota o abuela? | Mascota. Vive en un terrario. | Abuela. Ha visto nacer a todos.
4 vecinos | Si descubres que tu vecino es un robot, ¿le sigues prestando azúcar? | Sí. Un buen vecino es un buen vecino. | No. ¿Para qué quiere azúcar un robot?
4 animales | Un pato que sabe abrir puertas, ¿debería tener su propia llave? | Sí. Es una cuestión de dignidad. | No. Ya tiene demasiado poder.
4 musica | Si una canción se te pega tres días, ¿tiene derecho a salir en tu biografía? | Sí. Ha vivido contigo. | No. Fue un okupa.
4 casa | ¿Un robot aspirador que se atasca siempre en la misma esquina es tonto o rebelde? | Tonto. No aprende. | Rebelde. Le gusta esa esquina.
4 animales | Si un gato te trae un ratón, ¿es un regalo o una amenaza? | Un regalo. Es lo mejor que tiene. | Una amenaza. Te está enseñando lo que sabe hacer.
4 casa | Si el microondas pita y nadie va, ¿se ofende? | Sí. Por eso pita otra vez. | No. Pita porque no sabe hacer otra cosa.
4 viajes | ¿Las palomas que viven en el aeropuerto son viajeras frecuentes? | Sí. Nadie pasa más tiempo allí. | No. Nunca han embarcado.
4 animales | Un perro con abrigo, ¿va vestido o va disfrazado? | Vestido. Tiene frío como todos. | Disfrazado. Un perro no es de abrigos.
4 casa | Si un fantasma deja la luz encendida, ¿quién paga? | El fantasma. La ha encendido él. | Nosotros. El fantasma no tiene cuenta bancaria.
4 tiempo | Si llueve solo sobre ti, ¿es mala suerte o es un servicio? | Mala suerte. Nadie lo pidió. | Un servicio. Ducha gratis y sin esperas.
4 vecinos | ¿Un ascensor que se para en todos los pisos está roto o es sociable? | Roto. Hay que llamar al técnico. | Sociable. Quiere conocer a todo el mundo.
4 animales | Si una ardilla te roba una nuez cada día durante un año, ¿es ladrona o socia? | Ladrona. 365 nueces son un delito. | Socia. Ya es parte del presupuesto.
4 tiempo | Si viajas al pasado y te robas tu propia bici, ¿es robo? | Sí. La bici era de otra persona entonces. | No. Siempre ha sido tuya.
4 animales | Si un dinosaurio apareciera en el salón, ¿lo paseas o llamas a alguien? | Lo paseas. Todo animal necesita salir. | Llamas a alguien. No es tu dinosaurio.
4 vecinos | ¿Un árbol de nuestra calle cuenta como vecino? | Sí. Lleva aquí más que nadie. | No. Nunca ha subido a una reunión.
4 comida | Si alguien te invita a cenar y el plato es increíble pero se olvidó de tu nombre, ¿ha sido una buena cena? | Sí. Lo importante es el plato. | No. Lo importante es saber a quién cocinas.
4 objetos | Si un mago te hace desaparecer y vuelves con otro peinado, ¿es un favor o un delito? | Un favor. Peluquería gratis. | Un delito. Nadie pidió peinado.
4 identidad | Si un desconocido te sonríe en un sueño tres noches seguidas, ¿ya es tu amigo? | Sí. Tres veces es una relación. | No. Es un figurante que repite.
4 tiempo | Si por el cambio de hora te sobra una hora, ¿es tuya o de todos? | Tuya. Te ha caído a ti. | De todos. Hay que usarla con responsabilidad.
3 comida | ¿La pizza fría del desayuno es desayuno o cena atrasada? | Desayuno. Son las 9 y la estás comiendo. | Cena atrasada. La pizza no cambia de turno.
4 objetos | Si un paraguas te protege diez años, ¿tienes derecho a perderlo? | Sí. Ya ha cumplido. | No. Después de diez años es familia.
3 casa | ¿La planta que lleva un año sin crecer está viva o está de brazos cruzados? | Viva. Está ahorrando energía. | De brazos cruzados. Es una protesta.
4 vecinos | Un vecino que te saluda solo los martes, ¿es educado o sospechoso? | Educado. Un saludo es un saludo. | Sospechoso. ¿Qué pasa los otros días?
4 animales | Si una gaviota te mira fijamente un minuto, ¿te juzga o te pide algo? | Te juzga. Esa mirada tiene opinión. | Te pide. Siempre piden.
3 ropa | ¿El pijama por la tarde es ropa o una declaración? | Ropa. Tapa y abriga. | Declaración. Dice «hoy no».
4 cine | Si una película dura cuatro horas, ¿son dos películas? | Sí. A partir de la segunda hora es otra. | No. Una historia es una película.
3 comida | Si la receta dice «una pizca» y echas tres, ¿sigues la receta? | Sí. La pizca es una unidad flexible. | No. Tres pizcas son un puñado.
4 objetos | Si encuentras un billete en un abrigo del año pasado, ¿es un regalo o es tuyo? | Regalo. Del pasado para ti. | Tuyo. Solo estaba escondido.
3 sueño | ¿Dormirse en el sofá cuenta como dormir? | Sí. Estás dormido. | No. Es una siesta larga sin dignidad.
4 animales | Un perro que se niega a pasear bajo la lluvia, ¿es sensato o rebelde? | Sensato. Nadie quiere mojarse. | Rebelde. Un perro pasea y punto.
4 familia | Si tu abuela dice que estás más delgado, ¿es un cumplido o una preocupación? | Cumplido. Lo dice sonriendo. | Preocupación. Lo dice sirviendo comida.
3 casa | ¿Una toalla usada una vez está sucia? | Sí. Ha hecho su trabajo. | No. Solo está húmeda y lo sabe.
4 vecinos | Un vecino que riega las plantas a las 7 de la mañana, ¿es ejemplar o provocador? | Ejemplar. Madruga por la vida. | Provocador. Nadie riega a esa hora sin intención.
4 objetos | Si al montar un mueble sobra una pieza, ¿está bien montado? | Sí. Si se mantiene, está bien. | No. Esa pieza era de algo.
3 comida | ¿Repetir plato en un bufé es aprovechar o exceso? | Aprovechar. Lo has pagado. | Exceso. Hay una línea y la has cruzado.
4 tiempo | ¿Un plan aplazado tres años sigue siendo un plan? | Sí. Nunca se ha cancelado. | No. Ya es una leyenda.
4 animales | Un caracol que llega a un balcón de un cuarto piso, ¿es un héroe o un intruso? | Héroe. Mira la hazaña. | Intruso. Nadie lo ha invitado.
3 frases | Decir «en cinco minutos» cuando serán veinte, ¿es optimismo o mentira? | Optimismo. Crees en ti. | Mentira. Nunca han sido cinco.
4 cine | Si ves una película doblada, ¿la has visto? | Sí. Has visto la historia. | No. Has visto una versión.
4 casa | La mesa del comedor donde nunca se come, ¿es una mesa o un almacén? | Mesa. Tiene patas y tablero. | Almacén. Lleva seis meses con cosas encima.
3 comida | ¿El agua con gas es agua? | Sí. Es agua con una fiesta dentro. | No. Es otra bebida.
4 objetos | Si pierdes un guante, ¿el otro sigue siendo un guante? | Sí. Sigue abrigando una mano. | No. Es un huérfano de tela.
4 tiempo | Si te duermes a las 23:59 y despiertas a las 00:01, ¿has dormido un día? | Sí. Dos fechas distintas. | No. Dos minutos no son un día.
4 animales | Una paloma que anida en tu balcón, ¿paga el alquiler con compañía? | Sí. Es una inquilina que da conversación. | No. Es una okupa con plumas.
3 casa | ¿El cajón de los cables es un sistema de organización? | Sí. Todo está en un sitio. | No. Es un agujero negro con asa.
4 vecinos | Si oyes cantar al vecino y canta bien, ¿es ruido? | Sí. Nadie lo ha pedido. | No. Es un concierto gratis.
4 comida | Si una tortilla lleva cebolla, ¿sigue siendo la misma tortilla? | Sí. Es tortilla con una mejora. | No. Es otra tortilla con el mismo nombre.
3 objetos | Un libro que has empezado tres veces, ¿lo has leído? | Sí. Tres veces el principio. | No. Lo has visitado.
4 tiempo | Si repites el mismo lunes toda la vida, ¿es un castigo o unas vacaciones? | Castigo. Es lunes. | Vacaciones. Ya sabes qué va a pasar.
4 animales | Si tu gato te ignora, ¿es independencia o una opinión sobre ti? | Independencia. Es su naturaleza. | Una opinión. Y no es buena.
3 casa | ¿Tiene sentido hacer la cama si la vas a deshacer por la noche? | Sí. Es un acto de fe. | No. Es trabajar para el futuro que la deshará.
4 cine | Comentar la película en voz alta, ¿es compañía o sabotaje? | Compañía. Es compartir. | Sabotaje. Es otra película encima.
4 objetos | Un reloj de pared que lleva años mal, ¿es decorativo o un mentiroso? | Decorativo. Nadie le pide nada. | Mentiroso. Miente a todas horas.
3 comida | Un sándwich de madrugada, ¿es la última comida del día o la primera del siguiente? | Última. Todavía no te has dormido. | Primera. Ya es mañana.
4 vecinos | Si el ascensor huele siempre a la misma colonia, ¿es una pista o una tradición? | Pista. Alguien tiene un horario. | Tradición. Ya es parte del edificio.
4 animales | Si un pez de acuario te sigue con la mirada, ¿te conoce o se aburre? | Te conoce. Eres su persona. | Se aburre. Eres lo único que se mueve.
3 casa | Apagar la luz de una habitación vacía, ¿es ahorro o manía? | Ahorro. Cada vatio cuenta. | Manía. Nadie se arruina por una bombilla.
4 tiempo | ¿Una tradición de dos años ya es tradición? | Sí. Dos veces es una serie. | No. Hasta cinco es coincidencia.
4 objetos | Un sofá con una zona hundida, ¿está roto o personalizado? | Roto. Ya no es plano. | Personalizado. Es el molde de alguien.
3 comida | ¿La corteza del pan es la mejor parte o un envoltorio? | La mejor. Ahí está el sabor. | Envoltorio. Protege lo bueno.
4 vecinos | Un niño que te saluda cada día desde su ventana, ¿es tu amigo? | Sí. Hay constancia. | No. Es un vecino con horario.
4 animales | Si un perro te trae su juguete favorito, ¿te lo regala o te lo presta? | Regala. Lo ha soltado. | Presta. Mira cómo lo vigila.
3 frases | ¿«Luego lo hago» es un compromiso? | Sí. Hay un verbo y un futuro. | No. «Luego» no es una hora.
4 casa | Una lámpara que solo funciona con un golpe, ¿está rota o tiene carácter? | Rota. Una lámpara no pide golpes. | Carácter. Solo quiere atención.
4 objetos | Si un bolígrafo se gasta del todo, ¿merece una ceremonia? | Sí. Es un hecho histórico. | No. Es un boli.
4 tiempo | Si la fiesta de cumpleaños es otro día, ¿cuál es el cumpleaños de verdad? | El del calendario. Es lo que es. | El de la fiesta. Ahí está la tarta.
4 comida | Si el postre llega antes que el plato principal, ¿hay que esperar? | Sí. El orden es sagrado. | No. Un postre caliente no espera a nadie.
4 ropa | Unos zapatos que solo te pones una vez al año, ¿son tuyos o de la ocasión? | Tuyos. Están en tu armario. | De la ocasión. Tú solo los guardas.

## caos caos
2 any | Abogado | Durante las próximas dos cartas, cada uno puede *impugnar* una respuesta del otro. Quien sea impugnado tiene 15 segundos para defenderla o cambiarla.
3 any | Prohibido «depende» | Durante tres cartas nadie puede responder «depende». Quien lo diga pierde el derecho a réplica en esa carta.
1 any | Cinco palabras | La siguiente respuesta debe tener exactamente cinco palabras. Luego, si hace falta, la explicáis.
1 any | Espejo | En la siguiente carta, responde primero como crees que respondería tu pareja. Después, la tuya.
1 any | Interrogatorio | Después de la siguiente respuesta, el otro puede hacer tres preguntas de seguimiento. Hay que contestarlas todas.
1 any | Sin contexto | La siguiente respuesta se da sin explicación. El otro intenta adivinar el motivo antes de que lo cuentes.
1 juicio | Cambio de bando | En el próximo Juicio, cada uno defiende la postura que no comparte.
5 veto | Derecho a veto | Durante las próximas cinco cartas, cada uno tiene un veto para saltarse una carta sin dar explicaciones.
1 any | Titular | La siguiente respuesta empieza con un titular de periódico. Después, la noticia.
1 any | Testigo | Después de la siguiente respuesta, el otro cuenta una situación real que la confirme o la desmienta.
1 any | Sin palabras | La siguiente carta se responde solo con gestos. El otro tiene que adivinar.
2 any | Traductor | Durante dos cartas, el otro resume cada respuesta en cinco palabras exactas. Si no lo consigue, hay que explicarse mejor.
2 any | Turno cambiado | Durante dos cartas, empieza a responder quien normalmente respondería después.
1 any | Pregunta de vuelta | Después de responder la siguiente carta, devuélvele la misma pregunta a tu pareja.
1 any | Documental | La siguiente respuesta se cuenta en tercera persona, como un narrador de documentales de animales.
1 any | Abogado del diablo | En la siguiente carta, el otro tiene que llevarte la contraria, aunque esté de acuerdo.
2 any | Una sola frase | Durante dos cartas, cada respuesta cabe en una sola frase. Si se alarga, el otro la corta con un «gracias» y pasa a la siguiente.
2 any | Pruebas | Durante dos cartas, cada respuesta necesita un ejemplo real de vuestra vida. Sin ejemplo, no vale.
2 any | Diez segundos | Durante dos cartas, tenéis diez segundos para empezar a responder. El otro cuenta en voz alta; si llega a diez, elige él la respuesta.
1 any | Hace cinco años | Después de la siguiente respuesta, el otro dice qué habrías respondido hace cinco años.
1 any | Crítica | El otro hace una crítica de la siguiente respuesta como si fuera una película: estrellas y una frase.
1 any | Acento | La siguiente respuesta se da con el acento de algún familiar. El otro adivina de quién.
1 any | Lugar común | La siguiente respuesta tiene que incluir un sitio donde hayáis estado juntos.
2 any | Sin «yo» | Durante dos cartas, prohibido decir «yo». Quien lo diga cumple un mini reto que elige la otra persona.
2 any | Juez | Durante dos cartas, quien no responde decide si la respuesta convence. Si no, se repite mejor.
1 any | Te empiezo yo | En la siguiente carta, el otro empieza tu respuesta con una frase y tú tienes que continuarla.
1 any | Pregunta extra | Después de la siguiente carta, el otro inventa una pregunta relacionada y tienes que contestarla.
1 any | Al revés | La siguiente carta se responde al revés: primero el porqué, después la respuesta.
0 now | Confesión menor | Ahora mismo, cada uno confiesa algo pequeñísimo que nunca había mencionado. Nada grave.
1 juicio | Jurado familiar | Después del próximo Juicio, cada uno dice qué postura habría defendido su madre, y por qué.
1 any | Tres palabras | Antes de la siguiente respuesta, el otro elige tres palabras que tienes que usar en ella.
1 any | Sin pensar | La siguiente respuesta se da sin pararse a pensar. Si dudas más de tres segundos, empiezas de nuevo.
1 any | Eco | Después de la siguiente respuesta, el otro intenta repetirla con tus mismas palabras.
1 any | Cámara lenta | La siguiente respuesta se cuenta como la repetición a cámara lenta de una jugada.
0 now | Comentaristas | Narrad los últimos cinco minutos como comentaristas deportivos. Uno narra, el otro comenta.
0 now | Brindis | Levantad lo que estéis bebiendo. Cada uno brinda por algo muy concreto y muy poco importante de esta semana.
1 any | Susurro | La siguiente carta se responde entera en susurros, como si alguien durmiera al lado.
2 any | Rima | Durante dos cartas, cada respuesta termina con una rima. Si no la hay, el otro te elige un apodo para el resto de la partida.
1 any | Mentira escondida | En la siguiente carta, cuela una mentira pequeña en tu respuesta. El otro tiene que encontrarla.
1 any | Doble respuesta | La siguiente carta se responde dos veces: la que dirías delante de mí y la que dirías si no estuviera.
2 any | Prohibido «no sé» | Durante dos cartas no se puede decir «no sé». Quien lo diga, canta su respuesta.
1 any | Respuesta robada | En la siguiente carta, el otro responde por ti. Tú solo puedes corregir una cosa.
3 any | Tres palabras prohibidas | Elegid tres palabras cualquiera. Durante tres cartas no se pueden decir. Cada vez que caiga una, el otro gana un punto que no sirve para nada pero duele.
1 any | Cámara | La siguiente respuesta se da mirando fijamente a una cámara imaginaria, como en una entrevista de reality.
1 any | Publicidad | Después de la siguiente respuesta, el otro la convierte en un anuncio de televisión de veinte segundos.
2 any | Juramento | Durante dos cartas, cada respuesta empieza con «Juro que». Si alguien se ríe antes de terminar la frase, vuelve a empezar.
1 any | Condición extra | Antes de responder la siguiente carta, el otro añade una condición ridícula a la pregunta.
1 any | Final feliz | La siguiente respuesta tiene que terminar con «y por eso somos felices». Encaje o no.
2 any | Cronista | Durante dos cartas, quien no responde narra en voz baja lo que hace el otro mientras piensa.
1 any | Pista | Antes de la siguiente respuesta, das una pista de una sola palabra. El otro intenta adivinar lo que vas a decir.
1 any | Cantada | La siguiente respuesta se canta con la melodía de una canción que elige el otro.
1 any | Objeto a la vista | La siguiente respuesta tiene que incluir un objeto que estéis viendo ahora mismo.
2 any | Puntuación | Durante dos cartas, el otro puntúa cada respuesta del 1 al 10 y lo justifica en una frase. Nadie puede protestar.
1 any | Monosílabos | La siguiente carta se responde solo con monosílabos. El otro reconstruye la respuesta larga.
1 any | Devuélvela | Después de la siguiente carta, quien la ha respondido inventa una pregunta igual de rara para el otro.
0 now | Oído | Un segundo de silencio. Decid qué es lo primero que habéis oído y discutid quién tiene mejor oído.
1 any | De pie | La siguiente respuesta se da de pie, como un discurso. El otro aplaude si lo merece.
2 any | Nombre completo | Durante dos cartas, os llamáis por el nombre completo, con apellidos, cada vez que os dirigís al otro.
1 any | Giro final | La siguiente respuesta tiene que tener un giro final que nadie espera.
1 any | Presentador | La siguiente carta la lee el otro como presentador de un programa nocturno, con presentación incluida.
2 any | Sin manos | Durante dos cartas, prohibido mover las manos al hablar. Quien las mueva repite la respuesta sentado encima de ellas.
1 any | Primera impresión | Antes de la siguiente respuesta, el otro dice en una frase lo que cree que vas a responder. Después respondes de verdad.
1 any | Más detalles | Después de la siguiente respuesta, el otro puede decir «más detalles» hasta tres veces. Cada vez hay que añadir algo nuevo.
1 any | Inglés macarrónico | La siguiente respuesta se da en el peor inglés posible. El otro traduce.
0 now | Cambio de sitio | Intercambiad el sitio ahora mismo. El resto de la partida, cada uno responde desde donde estaba el otro.
1 any | Teléfono roto | La siguiente respuesta se dice al oído del otro, que la repite en voz alta tal y como la ha entendido.
2 any | Pregunta del público | Durante dos cartas, después de cada respuesta el otro hace una pregunta como si fuera del público: «Hola, una pregunta rápida».
1 any | Sin adjetivos | La siguiente respuesta no puede tener adjetivos. Quien oiga uno lo señala, y la frase se repite sin él.
1 any | Brindis corto | Después de la siguiente respuesta, el otro brinda por ella con una sola frase.
1 any | Edades | La siguiente carta la respondes como si tuvieras ocho años. El otro la comenta como si tuviera ochenta.
0 now | Sinopsis | Resumid la partida hasta ahora en una frase cada uno, como si fuera la sinopsis de una serie.

`;

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
function opener(t) { return t.replace(/^[¿¡«"]+/, '').split(/\s+/).slice(0, 2).join(' ').toLowerCase().replace(/[^a-záéíóúñü ]/g, ''); }

function parse(src) {
  const out = []; let mech = null, cat = null;
  for (const raw of src.split('\n')) {
    const line = raw.trim(); if (!line) continue;
    if (line.startsWith('## ')) { [mech, cat] = line.slice(3).split(/\s+/); continue; }
    const parts = line.split(' | ');
    const head = parts[0].trim().split(/\s+/);
    let c;
    if (mech === 'juicio') {
      c = { mech, cat, r: +head[0], d: 0, tags: (head[1] || '').split(',').filter(Boolean), text: parts[1], a: parts[2], b: parts[3] };
    } else if (mech === 'caos') {
      c = { mech, cat, r: 3, d: 0, tags: ['caos'], n: +head[0], affects: head[1], name: parts[1], text: parts[2] };
    } else {
      c = { mech, cat, r: +head[0], d: +head[1], tags: (head[2] || '').split(',').filter(Boolean), text: parts.slice(1).join(' | ') };
    }
    c.write = c.tags.includes('w');
    c.tags = c.tags.filter(t => t !== 'w');
    if (c.tags.includes('cdb')) { c.cat = 'cdb'; c.tags = c.tags.filter(t => t !== 'cdb'); }
    c.catLabel = CATS[c.cat] || c.cat;
    c.id = mech[0] + hash(c.text);
    const plain = c.text.replace(/\*/g, '');
    c.len = plain.length;
    c.dur = mech === 'rapida' ? 0 : mech === 'juicio' || mech === 'caos' ? 1 : c.d === 2 || plain.length > 150 ? 2 : 1; // 0 corta · 1 media · 2 larga
    c.open = opener(plain);
    out.push(c);
  }
  return out;
}

const CARDS = parse(SRC);
const api = { CARDS, CATS };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.NTP_CARDS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
