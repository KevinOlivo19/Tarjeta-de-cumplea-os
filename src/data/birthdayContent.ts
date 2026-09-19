export interface MemoryItem {
  id: string;
  image: string;
  date?: string;
  title?: string;
  text?: string;
}

export interface TasteItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  images?: string[];
  message: string;
  tag?: string;
}

export interface IntimateClue {
  id: string;
  step: number;
  clue: string;
  expectedAnswer: string;
  acceptedAnswers?: string[];
  complement?: string;
  revealedPhrase: string;
}

export interface BirthdayContent {
  name: string;
  subheading: string;
  portrait: {
    image: string;
    caption: string;
    quote: string;
    title?: string;
    message?: string;
  };
  tastes: {
    title: string;
    subtitle: string;
    items: TasteItem[];
  };
  normalLetter: {
    title: string;
    date: string;
    paragraphs: string[];
    signOff: string;
    signature: string;
    postscript?: string;
  };
  memoriesHeader?: {
    title: string;
    subtitle?: string;
  };
  memories: MemoryItem[];
  intimateSequence: IntimateClue[];
  secretLetter: {
    title: string;
    date: string;
    paragraphs: string[];
    signOff: string;
    signature: string;
  };
}

export const birthdayContent: BirthdayContent = {
  name: "Luisa",
  subheading: "Un pequeño universo creado solo para ti",

  portrait: {
    image: "/images/luisa.png",
    caption: "",
    title: "Luisa",
    message: "Ya te lo dije en el pasado, pero aún así te lo diré nuevamente. Te convertiste en alguien que quiero mantener en mi vida, eres alguien muy especial para mí y no puedo simplemente olvidarte. Te quiero.",
    quote: "Ya te lo dije en el pasado, pero aún así te lo diré nuevamente. Te convertiste en alguien que quiero mantener en mi vida, eres alguien muy especial para mí y no puedo simplemente olvidarte. Te quiero"
  },

  // OBJETO UNIFICADO: GUSTOS Y PASIONES
  tastes: {
    title: "Tus Gustos & Pasiones",
    subtitle: "",
    items: [
      {
        id: "dibujo",
        title: "Gusto por el dibujo",
        image: "/images/pible.png",
        images: [
          "/images/pible.png",
          "/images/ojito.jpg",
          "/images/gato.jpg",
          "/images/ella.png"
        ],
        message: "Me facina tu pasión por el dibujo y esa dedicación tan marcada que le pones a cada detalle. Me di cuenta de eso desde que vi los dibujos en tu libreta y los carteles que vi en tus historias; se nota de inmediato cuando alguien hace las cosas con verdadero gusto y no solo por pasar el rato. Muchas veces me gustaría tener ese talento, pero sé bien que no solo es facilidad, sino mucha práctica, paciencia y ganas de que las cosas queden bien hechas.\n\nMe parece muy curioso cómo hasta para elegir tus materiales tienes tu propio criterio y te tomas tu tiempo; es como si al dibujar entraras en tu propio espacio donde nada más importa. A veces entre las responsabilidades, la rutina y demás es fácil ir dejando de lado lo que nos gusta, pero ojalá nunca sueltes el dibujo. Es algo muy tuyo, de esas cosas auténticas que te distinguen y que da gusto ver en ti."
      },
      {
        id: "musica",
        title: "Gusto por la música",
        image: "/images/bts.jpg",
        images: [
          "/images/bts.jpg",
          "/images/morat.jpg",
          "/images/hielo.jpg",
          "/images/spoti.jpg"
        ],
        message: "Admiro mucho la gran variedad que tienes en tus gustos musicales. Cada vez que usábamos tu teléfono para poner música, me sorprendía la enorme cantidad de canciones y estilos que conoces; era muy bonito notar cuando una canción te gustaba de verdad o cuando te la sabías completa. Me parece increíble la pasión con la que vives lo que te gusta, como tu amor por BTS; me contaste todo lo que batallaste para conseguir entradas e ir a sus transmisiones en el cine, y eso demuestra lo comprometida que eres. Tampoco puedo evitar recordar las canciones de Morat en la clínica: siempre las ponías. Aunque yo no soy tan fan de ellos y me basta con unas cuantas canciones, y aun sabiendo que me comentaste que ya no los sigues tanto ni estás tan al pendiente, sé lo mucho que pueden significar para ti. Estoy seguro de que en el futuro podrás ir a uno de sus conciertos, y deseo de corazón que lo logres.\n\nComo extra, mi canción favorita es \"Aprender a quererte o tal vez Amor con Hielo\"; tal vez no me preguntaste, pero es algo que quería decirte."
      },
      {
        id: "tercer-gusto",
        title: "",
        image: "/images/third-taste.jpg",
        images: [
          "/images/third-taste.jpg"
        ],
        message: ""
      }
    ]
  },

  // OBJETO 2: CARTA NORMAL
  normalLetter: {
    title: "Carta personalizada",
    date: "",
    paragraphs: [
      "Eres una persona increíble. De verdad estoy muy feliz de haberte conocido y de haber tenido la oportunidad de convivir contigo en la clínica. Me da muchísimo gusto que hayas entrado en mi vida, porque con el tiempo te has convertido en alguien a quien quiero mucho y con quien disfruto pasar el tiempo.",
      "Me gusta mucho la forma en la que eres. Me gusta que seas una persona asertiva, directa, creativa y que tengas tus propias ideas. Admiro esa forma que tienes de decir lo que piensas y defender lo que quieres. También admiro lo consciente que eres de lo que pasa a tu alrededor, de que no todo en el mundo está bien y de que existen muchas cosas malas, errores y problemas. Y aun sabiendo todo eso, me gusta que tengas esa disposición de ayudar cuando puedes.",
      "También me gusta cómo eres conmigo y la confianza que poco a poco hemos ido construyendo. Me gusta bromear contigo y, siendo sincero, también me gusta hacerte enojar. Me divierte molestarte un poco y ver cómo reaccionas. También recuerdo con mucho cariño cuando jugábamos con la máquina de toques y siempre terminábamos los dos intentando ver cuánto aguantábamos. Son momentos sencillos, pero que disfrutaba muchísimo contigo.",
      "Me siento muy a gusto hablando contigo, tanto en persona como por chat. Puedo pasar un buen rato simplemente platicando contigo, aunque sea de cualquier tontería. También agradezco mucho todas las veces que me has escuchado, porque para mí significa bastante saber que puedo hablar contigo.",
      "Y también me gustaría saber si tú sientes esa misma confianza conmigo. Si alguna vez necesitas hablar, desahogarte, contarme algo o simplemente que alguien te escuche, quiero que sepas que puedes hacerlo conmigo. Siempre voy a estar dispuesto a escucharte cuando lo necesites, sin juzgarte y sin importar de qué se trate.",
      "Precisamente por todo eso quisiera conocerte aún mejor. Quiero saber más de tus gustos, de las cosas que te apasionan, de lo que te hace reír y de todo aquello que forma parte de ti. También quiero conocer más sobre tu club de teatro, lo que haces ahí y lo que significa para ti. Quiero conocer tus cosas buenas, tus defectos, tus miedos, tus fortalezas, tus sueños y todo aquello que te hace ser quien eres.",
      "Y no quiero que pienses que tienes que contarme todo de golpe. Simplemente quiero seguir conociéndote poco a poco, seguir teniendo conversaciones contigo, seguir haciendo bromas, seguir molestándote hasta hacerte enojar y seguir compartiendo momentos que quizá para alguien más parezcan pequeños, pero que para mí significan mucho.",
      "Hay muchas cosas que podría decir de ti, pero creo que lo más importante es que me alegra muchísimo haberte conocido. Me alegra todo lo que hemos vivido en la clínica, todas las bromas, las risas, las conversaciones y hasta esos momentos en los que simplemente estábamos ahí sin hacer gran cosa.",
      "Te quiero mucho y no quisiera guardar todo esto que siento ni dejar pasar la oportunidad de decirte lo importante que eres para mí.",
      "No sé exactamente qué vaya a pasar después ni quiero apresurar nada. Solo sé que quiero seguir compartiendo cosas contigo, seguir hablando contigo, seguir conociéndote y descubrir poco a poco todas esas partes de ti que todavía no conozco.",
      "Porque, sinceramente, me gusta la persona que conozco de ti hasta ahora, pero tengo muchas ganas de conocer todo lo que todavía me falta por descubrir."
    ],
    signOff: "con mucho amor y cariño,",
    signature: "de: tu ex compañerito"
  },

  // OBJETO 3: RECUERDOS
  memoriesHeader: {
    title: "Álbum de Recuerdos",
    subtitle: `Todas estas fotos las encontré en Facebook y, aunque son de distintas etapas de tu vida, creo que todas tienen algo en común: muestran lo linda y hermosa que eres, pero también muestran algo más que eso. Se nota a alguien que disfruta estar consigo misma, que puede ser feliz y transmitir una alegría muy auténtica. Hay algo en la forma en la que apareces en estas fotos que hace muy fácil entender por qué alguien podría sentirse afortunado de conocerte. Yo, personalmente, lo estoy. No sé exactamente qué pienses al leer esto, pero de verdad creo que eres una persona hermosa, tanto por fuera como por dentro. Y no te lo digo para quedar bien contigo, ni para que lo tomes como un simple cumplido. Es simplemente algo que he notado en ti y que quería decirte de la manera más sincera posible.`
  },
  memories: [
    {
      id: "recuerdo-1",
      image: "/img/img1.png",
      text: "Siempre me gustaron tus aretes, son muy tú.",
    },
    {
      id: "recuerdo-2",
      image: "/img/img2.jpeg",
      text: "Te veías tan llena de vida, ¿qué te pasó?",
    },
    {
      id: "recuerdo-3",
      image: "/img/img3.png",
      text: "Era verdad que tenías audífonos parecidos a los míos.",
    },
    {
      id: "recuerdo-4",
      image: "/img/img4.png",
      text: "Elegante por una vez en la vida.",
    },
    {
      id: "recuerdo-5",
      image: "/img/img5.png",
      text: "Ese cabello me encanta, el vestido está muy bonito, muy coqueto y el collar está todo que ver.",
    },
    {
      id: "recuerdo-6",
      image: "/img/img9.png",
      text: "Aquí ya te ves decente.",
    },
    {
      id: "recuerdo-7",
      image: "/img/img14.png",
      text: "Mírala, qué linda.",
    },
    {
      id: "recuerdo-21",
      image: "/img/img21.jpeg",
      text: "Tres lesbianas en una foto.",
    },
    {
      id: "recuerdo-8",
      image: "/img/img8.png",
      text: "Aquí sí te la debo, no está chido el sweater, pero eso no importa, te ves bien.",
    },
    {
      id: "recuerdo-23",
      image: "/img/img23.png",
      text: "Todos los chambeadores.",
    },
    {
      id: "recuerdo-9",
      image: "/img/img6.png",
      text: "Espectacular, lo normal en ti.",
    },
    {
      id: "recuerdo-10",
      image: "/img/img10.png",
      text: "Acostada sin hacer nada como siempre.",
    },
    {
      id: "recuerdo-11",
      image: "/img/img11.png",
      text: "Cara de mamona la neta.",
    },
    {
      id: "recuerdo-12",
      image: "/img/img12.png",
      text: "Mi foto favorita, aquí sí te rifaste con la calidad, soy tu fan.",
    },
    {
      id: "recuerdo-22",
      image: "/img/img22.png",
      text: "Los asustadores (de viejes).",
    },
    {
      id: "recuerdo-13",
      image: "/img/imagen13.jpeg",
      text: "El outfit de siempre.",
    },
    {
      id: "recuerdo-24",
      image: "/img/img24.jpeg",
      text: "Después de ese día todo cambió.",
    },
    {
      id: "recuerdo-14",
      image: "/img/img7.png",
      text: "Qué envidia, se antoja ir a la playa.",
    },
    {
      id: "recuerdo-15",
      image: "/img/img15.png",
      text: "Cara de mamona nuevamente, como de costumbre.",
    },
    {
      id: "recuerdo-16",
      image: "/img/img16.png",
      text: "No te recuerdo con cabello largo, te queda bien, todo te queda bien.",
    },
    {
      id: "recuerdo-17",
      image: "/img/img19.png",
      text: "Segunda foto favorita, le sabes.",
    },
    {
      id: "recuerdo-18",
      image: "/img/img18.png",
      text: "Con la camisa de lesbian al fondo.",
    },
    {
      id: "recuerdo-19",
      image: "/img/img17.png",
      text: "Mucha foto, poco estudio.",
    },
    {
      id: "recuerdo-20",
      image: "/img/img20.png",
      text: "Te juro que me encanta tu maquillaje, es hipnotizante.",
    },
  ],

  // OBJETO 4: ENIGMA ÍNTIMO DE 3 FRASES EN SECUENCIA (MÓDULO "?")
  intimateSequence: [
    {
      id: "pista-1",
      step: 1,
      clue: "Teníamos una manera peculiar de arrepentirnos de algo: bastaba con decirlo rápido, casi como si al hacerlo así pesara un poco menos.",
      expectedAnswer: "PERDÓNAME LUISA",
      acceptedAnswers: [
        "PERDÓNAME LUISA",
        "PERDONAME LUISA",
        "PERDÓNAME, LUISA",
        "PERDONAME, LUISA"
      ],
      revealedPhrase: "PERDÓNAME LUISA",
    },
    {
      id: "pista-2",
      step: 2,
      clue: "Un joven sabio siempre tuvo esta frase presente, él sabía cómo eran las cosas. Curiosamente, eso no le impidió terminar convirtiéndose en eso.",
      expectedAnswer: "EL AMOR NOS VUELVE PENDEJOS",
      acceptedAnswers: [
        "EL AMOR NOS VUELVE PENDEJOS",
        "EL AMOR NOS VUELVE PENDEJO",
        "EL AMOR VUELVE PENDEJOS",
        "EL AMOR VUELVE PENDEJO",
        "EL AMOR NOS PONE PENDEJOS",
        "EL AMOR NOS PONE PENDEJO",
        "EL AMOR PONE PENDEJOS",
        "EL AMOR PONE PENDEJO",
        "EL AMOR TE PONE PENDEJO",
        "EL AMOR TE PONE PENDEJOS",
        "EL AMOR NOS HACE PENDEJOS",
        "EL AMOR NOS HACE PENDEJO",
        "EL AMOR HACE PENDEJOS",
        "EL AMOR HACE PENDEJO",
        "EL AMOR TE HACE PENDEJO",
        "EL AMOR TE HACE PENDEJOS",
        "EL AMOR NOS CONVIERTE EN PENDEJOS",
        "EL AMOR NOS CONVIERTE EN PENDEJO",
        "EL AMOR CONVIERTE EN PENDEJOS",
        "EL AMOR CONVIERTE EN PENDEJO",
        "EL AMOR TE CONVIERTE EN PENDEJO",
        "EL AMOR TE CONVIERTE EN PENDEJOS",
        "EL AMOR NOS HACE SER PENDEJOS",
        "EL AMOR NOS HACE SER PENDEJO",
        "EL AMOR HACE SER PENDEJOS",
        "EL AMOR HACE SER PENDEJO",
        "EL AMOR TE HACE SER PENDEJO",
        "EL AMOR TE HACE SER PENDEJOS",
        "EL AMOR NOS DEJA PENDEJOS",
        "EL AMOR DEJA PENDEJOS",
        "EL AMOR NOS TRANSFORMA EN PENDEJOS",
        "NOS VUELVE PENDEJOS",
        "NOS PONE PENDEJOS",
        "NOS HACE PENDEJOS",
        "NOS CONVIERTE EN PENDEJOS",
        "NOS HACE SER PENDEJOS",
        "AMOR NOS VUELVE PENDEJOS",
        "AMOR NOS PONE PENDEJOS",
        "AMOR NOS HACE PENDEJOS",
        "AMOR NOS CONVIERTE EN PENDEJOS",
        "AMOR NOS HACE SER PENDEJOS"
      ],
      revealedPhrase: "EL AMOR NOS VUELVE PENDEJOS",
    },
    {
      id: "pista-3",
      step: 3,
      clue: "Es una canción de esa conocida banda de Bogotá, es mi canción favorita.",
      complement: "pero yo quiero",
      expectedAnswer: "APRENDER A QUERERTE",
      acceptedAnswers: [
        "APRENDER A QUERERTE",
        "PARA APRENDER A QUERERTE",
        "APRENDER A QUERER",
        "APRENDER A AMARTE"
      ],
      revealedPhrase: "APRENDER A QUERERTE",
    },
  ],

  // CARTA SECRETA (DESBLOQUEADA TRAS RESOLVER EL EASTER EGG)
  secretLetter: {
    title: "",
    date: "",
    paragraphs: [
      "No quiero vivir con arrepentimientos. No importa si las decisiones que tome terminan haciéndome una mejor persona, si me ayudan a crecer o incluso si alguna me hace caer muy bajo. No quiero pasar mi vida pensando en qué hubiera pasado si hubiera hecho algo diferente. Prefiero hacer lo que tenga que hacer, aunque eso signifique equivocarme, sufrir o aceptar las consecuencias de mis decisiones.",
      "Esta vez no dejé que alguien más me confundiera. No hubo una historia de una serie o una película, no hubo una canción ni algo que alguien dijera que me hiciera pensar cosas equivocadas. Tampoco estoy intentando encontrar una explicación para lo que siento.",
      "Solo sé que me gustas.",
      "Tengo una infinidad de cosas que podría decirte: razones por las que llegué hasta este punto, cosas que nunca te he contado, cosas que realmente quiero y muchas otras que significas para mí. Son tantas que sería imposible decirlas todas aquí. Hay cosas que solo quiero contarte si tú estás de acuerdo y si realmente quieres escucharlas, porque no quiero soltarte todo esto sin saber primero si tú quieres conocer esa parte de mí.",
      "Y sé que probablemente no debería ser una sorpresa tan grande. Digo, era bastante obvio. Creo que se notaba, incluso aunque yo intentara disimularlo.",
      "La razón por la que me enojaba cuando hacías comentarios relacionados conmigo y con alguien más era precisamente porque sentía que para ti no significaban lo mismo que para mí. Yo podía tomarlo de una manera y pensar que quizá había algo detrás, mientras que para ti parecía no tener importancia. Y eso me ardía, porque en el fondo me hacía pensar que yo simplemente no te interesaba de la misma manera.",
      "La verdad es que sí me gustas. De verdad.",
      "Quiero conocerte más. Quiero saber más de ti, entenderte, conocer las cosas que te gustan, las que te molestan, lo que quieres y lo que esperas de las personas que tienes cerca. Sé que todo esto puede ser complicado y tampoco quiero hacer como si no lo fuera.",
      "No estás obligada a nada. No tienes ningún compromiso conmigo y no espero que respondas algo solamente porque yo estoy diciendo todo esto. Solo quiero una respuesta sincera.",
      "Quisiera saber qué podría pasar después de esto.",
      "Si lo único que puede existir entre nosotros es una amistad, lo aceptaré. Si después de esto prefieres tomar distancia, también lo entenderé. Y si simplemente esto significa un adiós, aunque no sea lo que quiero, voy a respetarlo.",
      "No quisiera que las cosas que tenemos se perdieran solamente por haber dicho esto. De verdad quiero que sigas en mi vida, de la forma que sea posible. Pero también entiendo que no puedo decidir eso por los dos.",
      "Yo ya decidí ser honesto contigo. Ahora la decisión es tuya.",
      "Sea lo que sea que decidas, voy a estar agradecido.",
      "Agradecido por haberte conocido, por todo lo que compartimos y por todo lo que significaste para mí.",
      "Y, sobre todo, por haber sido tú."
    ],
    signOff: "",
    signature: ""
  }
};
