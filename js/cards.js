/* Banco de cartas de «Nunca te lo pregunté».
 *
 * Formato compacto, una carta por línea:
 *   libre / rapida / predice / alavez:   rareza profundidad etiquetas | texto
 *   juicio:                               rareza etiquetas | pregunta | postura A | postura B
 *   caos:                                 duración afecta | nombre | regla
 * rareza 1–5 · profundidad 0 ligera, 1 media, 2 profunda · etiquetas separadas por comas
 * (la etiqueta «w» activa la variante secreta con escritura).
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
  rap: 'Responde en 5 segundos',
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

## libre acus
3 0 manias | Acusa formalmente a tu pareja de un delito inventado basado en una costumbre real. La defensa tiene un minuto.
3 0 casa | Presenta pruebas de que tu pareja lleva años saboteando sutilmente algo de esta casa.
4 0 comida | Lee los cargos: tu pareja está acusada de un crimen contra la cocina. ¿Cuál es y cuántos años le caen?
3 0 objetos | Denuncia ante el tribunal de la casa el uso indebido de un objeto por parte de tu pareja. Pide una pena proporcionada.

## libre tit
2 0 semana | Ponle un *titular* de periódico a nuestra última semana.
3 0 vecinos | Escribe el titular del periódico del barrio si los vecinos supieran lo que pasó en esta casa el último sábado.
2 0 comida | Resume en un titular la peor decisión culinaria que hemos tomado juntos.
3 0 nosotros | Escribe la portada del periódico del día en que nos conocimos, si solo hubiera sido noticia eso.

## libre expl
3 0 nosotros | Explícale nuestra relación a un extraterrestre usando solo tres objetos de esta casa.
3 0 domingos | Explícale a alguien del siglo XVIII qué hacemos un domingo por la tarde.
3 0 casa | Explica cómo funciona nuestra cocina como si fuera el manual de una nave espacial.
4 0 nosotros | Explícale a un niño de cinco años cómo nos conocimos, dibujando en el aire.

## libre ctx
2 0 comida | Tenemos 20 minutos, estamos agotados y nadie quiere decidir qué cenar. ¿Quién acaba decidiendo y qué acaba pasando?
3 0 bodas | Nos invitan a dos bodas el mismo día: una de alguien muy querido a cuatro horas, otra de alguien que nos da igual con la mejor comida de la historia. ¿Qué hacemos de verdad?
2 0 planes | Llueve, es sábado, uno quiere salir y el otro no. ¿Quién gana normalmente y con qué argumento?
3 0 vacaciones | Nos sobra un día de vacaciones y 200 euros, y hay que decidir en cinco minutos. ¿Qué acaba pasando de verdad?
3 0 familia | Llama un familiar para avisar de que viene a comer en una hora. ¿Qué hace cada uno en los primeros cinco minutos?

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
3 0 fiestas,w | En una fiesta de disfraces sin tema, ¿de qué te disfrazas si nadie te ayuda a decidir?
3 0 tecnologia | Puedes borrar un invento de la historia, pero tiene que ser pequeño y cotidiano. ¿Cuál desaparece?
3 0 tecnologia | Internet desaparece una semana en todo el mundo. ¿Qué cosa rara acabas haciendo el martes por la tarde?
2 0 trabajo,w | Te regalan un año sabático pagado. ¿Qué haces el primer mes?
3 0 tiempo | Puedes cambiarle el nombre a un día de la semana. ¿Cuál y cómo se llama?
3 0 comida | En una isla desierta te permiten un solo condimento para toda la vida. ¿Cuál?
3 0 talentos | Te suben a un escenario delante de 300 personas a hablar una hora sin preparar nada. ¿De qué hablas, y en qué minuto empiezas a inventar?
3 0 talentos,w | Escribes un libro de autoayuda basado en algo que haces bien. ¿Cómo se titula?
4 0 objetos | Una empresa fabrica un muñeco con tu cara. ¿Qué frase dice al apretarle la barriga?
3 0 musica | Te cuelan en el camerino de un concierto y tienes cinco minutos a solas con el artista. ¿Con quién, y qué le preguntas que nadie le pregunta?
2 0 viajes | Tenemos que mudarnos mañana a otra ciudad del país. ¿Cuál eliges, y por qué motivo poco serio?
3 0 cdb,frases | Tienes que pasar 24 horas sin hablar. ¿Qué es lo primero que intentas decir con gestos?
2 0 tiendas | Tienes una tarde para ti en un centro comercial vacío. ¿A qué tienda vas primero?
3 0 animales | Puedes tener un animal de compañía de cualquier especie, pero tiene que vivir en este piso. ¿Cuál eliges?
3 0 cine | Ganas una cena en casa de cualquier personaje de ficción. ¿En qué casa cenas?
3 0 casa | Hay que salir de casa en 30 segundos. ¿Qué objeto coges que no tiene ningún sentido coger?
3 0 ropa,w | Tienes que llevar una camiseta con una frase durante un año. Tú eliges la frase. ¿Cuál es?
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
3 0 comida,w | Escribid tres cosas que siempre hay en nuestra nevera. ¿Cuántas coinciden?
3 1 nosotros,w | Escribid una palabra que defina este último mes.
3 0 viajes,w | Escribid el próximo destino que elegiríais si no hubiera que ponerse de acuerdo.
3 0 casa,w | Escribid el objeto de casa que el otro salvaría primero.

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

## caos caos
2 any | Abogado | Durante las próximas dos cartas, cada uno puede *impugnar* una respuesta del otro. Quien sea impugnado tiene 15 segundos para defenderla o cambiarla.
3 any | Prohibido «depende» | Durante tres cartas nadie puede responder «depende». Quien lo diga, vuelve a empezar.
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
2 any | Una sola frase | Durante dos cartas, cada respuesta cabe en una sola frase.
2 any | Pruebas | Durante dos cartas, cada respuesta necesita un ejemplo real de vuestra vida. Sin ejemplo, no vale.
2 any | Diez segundos | Durante dos cartas, tenéis diez segundos para empezar a responder. Contad en voz alta.
1 any | Hace cinco años | Después de la siguiente respuesta, el otro dice qué habrías respondido hace cinco años.
1 any | Crítica | El otro hace una crítica de la siguiente respuesta como si fuera una película: estrellas y una frase.
1 any | Acento | La siguiente respuesta se da con el acento de algún familiar. El otro adivina de quién.
1 any | Lugar común | La siguiente respuesta tiene que incluir un sitio donde hayáis estado juntos.
2 any | Sin «yo» | Durante dos cartas, prohibido decir «yo». Quien lo diga, reformula.
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
