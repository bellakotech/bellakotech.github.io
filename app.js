/* =========================================
   GrowTale — interacciones compartidas por index.html y proyecto.html
   ========================================= */

const LANG_KEY = 'growtale_lang'
const MUSIC_KEY = 'growtale_music'
const MUSIC_TIME_KEY = 'growtale_music_time'
const MUSIC_VOLUME = 0.3

const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const storage = {
  get(key, area = localStorage){ try{ return area.getItem(key) }catch(e){ return null } },
  set(key, value, area = localStorage){ try{ area.setItem(key, value) }catch(e){} }
}

/* -----------------------------------------
   Traducciones
   El español es el texto del propio HTML (se guarda al cargar);
   aquí solo vive el inglés. Atributos traducibles:
   data-i18n (texto), data-i18n-aria-label, data-i18n-title,
   data-i18n-alt, data-i18n-content.
   ----------------------------------------- */
const I18N_EN = {
  // meta
  meta_title_cover: 'GrowTale — Turn healthy habits into an adventure',
  meta_title_project: 'GrowTale — Official site',
  meta_description: 'GrowTale is a fantasy RPG that turns healthy habits, like putting your phone down, into in-game progress. A professionally validated digital wellbeing project.',
  // comunes
  select_language: 'Select language',
  discover: 'Discover GrowTale',
  cover_tagline: 'Turn healthy habits into progress in a fantasy RPG',
  back_to_cover: 'Back to cover',
  open_menu: 'Open menu',
  main_nav: 'Main',
  skip_to_content: 'Skip to content',
  // nav
  nav_impact: 'Goals',
  nav_game: 'Video game',
  nav_universe: 'Universe',
  nav_team: 'Team',
  nav_contact: 'Contact',
  // visión
  vision_title: 'An adventure that grows as the player disconnects',
  vision_lead: 'GrowTale turns healthy habits, like putting your phone down, into progress in an RPG universe.',
  view_product: 'View product',
  contact: 'Contact',
  // bloques
  block_impact_title: 'GOALS & GROWTH',
  block_impact_sub: 'We are building a new way to improve our relationship with technology through video games',
  block_game_title: 'THE VIDEO GAME',
  block_game_sub: 'See how it works, try it out and watch disconnection turn into progress.',
  block_project_title: 'PROJECT & INVESTMENT',
  block_project_sub: 'Learn about the opportunity, our advantage, the development status and the team behind GrowTale.',
  // problema
  problem_title: 'The problem',
  problem_subtitle: 'Getting our attention back has become a daily challenge.',
  problem_p1: 'Phones are part of our everyday life, but constant interruptions make it harder to study, focus, rest and make time for other activities.',
  problem_p2: 'Many tools show us how much we use our phone. However, knowing the problem is not always enough to change our habits.',
  screen_time_label: 'Screen time today',
  problem_highlight: 'GrowTale turns that challenge into an adventure',
  bestiary_title: 'Some of the enemies of Mindveil',
  bestiary_subtitle: 'Every everyday distraction takes the shape of a creature in the game.',
  bestiary_beat: 'How to beat it',
  enemy1_dist: 'Endless scrolling',
  enemy1_text: 'It coils endlessly and traps you in a loop of content.',
  enemy1_trait: 'gains stacking damage every turn.',
  enemy1_beat: 'The longer the fight lasts, the stronger it gets. Break its routine early and finish it with one focused blow, just like stopping the scroll in time.',
  enemy1_traitname: 'Infinite Feed',
  enemy1_skill1: 'Endless Feed',
  enemy1_skill2: 'Time Drain',
  enemy1_skill3: 'Scroll Bite',
  enemy3_dist: 'App hopping',
  enemy3_text: 'A swift fairy that splits your attention and drags you from one task to the next.',
  enemy3_trait: 'the first hit each turn has a 30% chance to miss.',
  enemy3_beat: 'It is slippery and sometimes dodges your hits. Don\'t scatter: focus on a single goal and act decisively.',
  enemy3_traitname: 'Fragmented Presence',
  enemy3_skill1: 'Glitch Pulse',
  enemy3_skill2: 'Attention Split',
  enemy3_skill3: 'Micro-Interrupt',
  enemy4_dist: 'Looping thoughts',
  enemy4_text: 'It keeps changing shape and distorts what you see and what you think.',
  enemy4_trait: 'a random stat is boosted each turn (+30%).',
  enemy4_beat: 'It is unpredictable because it changes every turn. Stick to your plan instead of reacting to every change.',
  enemy4_traitname: 'Unstable Form',
  enemy4_skill1: 'Form Shift',
  enemy4_skill2: 'Cognitive Distortion',
  enemy4_skill3: 'Loop Thought',
  enemy5_dist: 'Procrastination',
  enemy5_text: 'It wraps you in its sticky calm and convinces you to leave it for tomorrow.',
  enemy5_trait: 'heals 3% of its max HP each turn.',
  enemy5_beat: 'It slowly heals if you give it time. Don\'t keep repeating the same thing: switch tactics so you don\'t get stuck.',
  enemy5_traitname: 'Passive Growth',
  enemy5_skill1: 'Warm Drift',
  enemy5_skill2: 'Sticky Body',
  enemy5_skill3: 'Sleep Field',
  // validación
  validation_title: 'Professional validation',
  validation_seal: 'Independent professional assessment',
  validation_wellbeing_title: 'Digital wellbeing',
  validation_wellbeing_text: 'Reduces passive phone use through positive reinforcement mechanics',
  validation_ethics_title: 'Ethical design',
  validation_ethics_text: 'No artificial addiction or systems designed to create dependency',
  validation_potential_title: 'Application potential',
  validation_potential_education: 'Education',
  validation_potential_prevention: 'Psychosocial prevention',
  validation_quote: '“GrowTale presents an innovative and socially relevant proposal within digital wellbeing and psychosocial prevention.”',
  validation_author: 'Independent professional assessment from the field of Social Work.',
  validation_download: 'View full report',
  validation_doc_title: 'Independent professional assessment',
  pitch_doc_title: 'GrowTale Pitch Deck',
  doc_open: 'Open in a new tab',
  doc_download: 'Download',
  doc_frame: 'Document',
  doc_fallback: 'Your browser cannot show the PDF here.',
  doc_open_pdf: 'Open the PDF',
  // cómo funciona
  how_title: 'How it works',
  how_lead: 'Turn less time on distracting apps into progress in GrowTale.',
  how_step1_title: 'Choose your challenge',
  how_step1_text: 'Pick the apps you want to avoid and set your goals.',
  how_step1_alt: 'GrowTale screen for choosing challenges',
  how_step2_title: 'Spend time on what matters',
  how_step2_text: 'Complete real challenges and earn resources to move forward.',
  how_step2_alt: 'GrowTale screen showing an active challenge',
  how_step3_title: 'Grow your world',
  how_step3_text: 'Unlock new areas and grow your adventure.',
  how_step3_alt: 'GrowTale screen showing the world growing',
  // producto
  product_title: 'Product',
  gallery_title: 'Gallery',
  challenges_title: 'Daily challenges',
  challenge1_title: '30-minute focus',
  challenge1_text: 'Avoid distracting apps for 30 minutes.',
  challenge1_badge: 'Daily challenge',
  daily_advance: 'Advance challenge',
  daily_restart: 'Restart challenge',
  challenge2_title: 'Outdoor walk',
  challenge2_text: 'Spend 20 minutes away from your phone.',
  challenge2_badge: 'Wellbeing challenge',
  challenge3_title: 'Learning',
  challenge3_text: 'Complete a study or reading goal.',
  challenge3_badge: 'Learning challenge',
  // universo
  universe_title: 'The map of Mindveil',
  nodes_title: 'Node types',
  node_main: 'Main quest',
  node_main_text: 'They move each act\'s story forward and open the way to new areas of the map.',
  node_side: 'Side quest',
  node_side_text: 'Optional tasks from the people of Mindveil that give extra rewards.',
  node_combat: 'Combat',
  node_combat_text: 'Turn-based fights against distractions turned into enemies.',
  node_tip: 'Tip',
  node_tip_text: 'Short stops with practical ideas about digital wellbeing and healthy habits.',
  liria_problem: 'How many times have you unlocked your phone today without noticing?',
  liria_how: 'Every challenge you complete away from the screen becomes progress in Mindveil.',
  liria_challenges: 'Tap the + to move forward and complete your challenges!',
  liria_map: 'Mindveil is huge… and every place hides a habit to improve.',
  liria_status: 'The prototype already works. Now it is time to take it to schools and families.',
  liria_contact: 'I\'d love to hear from you!',
  tryit_title: 'Try it yourself',
  tryit_lead: 'Press the buttons and try out some key pieces of the game.',
  tryit_challenge_title: 'Set up today\'s challenge',
  tryit_challenge_hint: 'Adjust the difficulty, swap the challenge or ban it if it doesn\'t suit you.',
  dc_difficulty: 'Difficulty',
  dc_less: 'Lower difficulty',
  dc_more: 'Raise difficulty',
  dc_ban: 'Ban',
  dc_swap: 'Swap',
  dc_apply: 'Apply',
  tryit_skills_title: 'Skills that recharge with your goals',
  tryit_skills_hint: 'Pick a skill to see what it does and when it is ready.',
  skills_group: 'Skills',
  making_title: 'How we create the game art',
  making_subtitle: 'From sketch to final art: this is how the team works. Drag to compare.',
  making_before: 'Sketch',
  making_after: 'Final',
  making_compare: 'Compare sketch and final version',
  making_city_title: 'The city of Vigilaris, step by step',
  making_scene_title: 'Scenery',
  making_scene_text: 'From the greyscale sketch to the final background you will see in the game.',
  making_castle_title: 'Vigilaris Castle',
  making_castle_text: 'First every room is planned; then the whole castle is illustrated.',
  making_flicker_title: 'Flicker',
  making_flicker_text: 'From the first strokes to the finished enemy.',
  making_city1_title: 'Planning',
  making_city1_text: 'How the city is laid out is studied.',
  making_city2_title: '3D blockout',
  making_city2_text: 'Volumes in Blender to lock the perspective.',
  making_city3_title: 'Final line art',
  making_city3_text: 'The definitive drawing, ready for colour.',
  nav_project: 'Project',
  gallery_label: 'Game screenshots',
  carousel_prev: 'Previous',
  carousel_next: 'Next',
  gallery_map: 'World map',
  gallery_map_alt: 'GrowTale world map screen with the route and daily progress',
  gallery_progress: 'Daily progress',
  gallery_progress_alt: 'Daily progress screen with steps, screen time and challenges',
  gallery_objectives: 'Goals and missions',
  gallery_objectives_alt: 'Goals screen with daily challenges and main missions',
  gallery_skills: 'Skills',
  gallery_skills_alt: 'GrowTale skill deck screen',
  gallery_combat: 'Combat',
  gallery_combat_alt: 'Ongoing combat screen with the player skills',
  gallery_dialogue: 'Talking with Liria',
  gallery_dialogue_alt: 'Event screen with a dialogue from Liria',
  hero_eyebrow: 'Digital wellbeing RPG',
  hero_fact1_value: 'Playable',
  hero_fact1_label: 'prototype',
  hero_fact2_value: 'Validated',
  hero_fact2_label: 'by professionals',
  hero_fact3_label: 'people on the team',
  hero_liria_alt: 'Liria, the GrowTale guide',
  hero_scroll: 'Scroll down',
  tryit_badge: 'Interactive demo',
  tryit_tap: 'Try it',
  hero_speech_next: 'Next message from Liria',
  dc_range: 'Challenge progress',
  dc_drag: 'Drag the bar to make progress',
  bestiary_attacks: 'Attacks',
  hero_liria_talk: 'Talk to Liria',
  hero_discover: 'Discover the game',
  hero_contact_q: 'Are you an investor or a school?',
  hero_contact_cta: "Let's talk",
  why_title: "Why it makes sense",
  solution_title: "Our solution",
  solution1_title: "What you do off screen counts",
  solution1_text: "Real challenges like walking, reading or switching off the apps you choose.",
  solution2_title: "It becomes progress in an RPG",
  solution2_text: "Every challenge you complete unlocks skills, map areas and fights against your distractions.",
  solution3_title: "Positive reinforcement, no punishment",
  solution3_text: "It does not block or blame: it rewards every step so the new habit sticks.",
  block_universe_title: 'THE GROWTALE UNIVERSE',
  block_universe_sub: 'Travel through Mindveil, meet its enemies and discover how we create its art.',
  map_title: 'Mindveil, the Realm of Compulsion',
  map_text: 'A brain-shaped island. Tap each place to discover what awaits you.',
  map_alt: 'Map of Mindveil: a brain-shaped island',
  region_theme: 'Theme',
  region_optional: 'Optional',
  act_prologue: 'Prologue',
  act_1: 'Act I',
  act_2: 'Act II',
  act_3: 'Act III',
  region_fuente: 'The Source',
  region_fuente_text: 'Where souls awaken. Here Liria finds you and your journey through the Realms of Being begins.',
  region_fuente_theme: 'waking up and becoming aware of your habits',
  region_ciudad: 'Vigilaris City',
  region_ciudad_text: 'The hordes took it while its guards were distracted. Today its streets are empty and its people have taken refuge in the church.',
  region_ciudad_theme: 'distractions have consequences',
  region_castillo: 'Vigilaris Castle',
  region_castillo_text: 'Locked tight while the city falls. What is the royal family hiding behind its walls?',
  region_castillo_theme: 'shutting yourself away solves nothing',
  region_hushgrove: 'Hushgrove Village',
  region_hushgrove_text: 'A village with its mill and a council that must decide how to resist the monsters.',
  region_hushgrove_theme: 'community: nobody moves forward alone',
  region_laberinto: 'The Labyrinth of Mirrors',
  region_laberinto_text: 'Corridors that reflect your own image back at you: the Hall of Distortions, the Corridor of Vanity and the Heart of the Labyrinth.',
  region_laberinto_theme: 'self-image and comparison',
  region_foco: 'Focus Training Grounds',
  region_foco_text: 'Those who want to master their attention train here, under the demanding eye of the Focus Masters.',
  region_foco_theme: 'mindful attention',
  region_mercado: 'The Sensory Market',
  region_mercado_text: 'The Streets of Temptation and the Avenue of Sighs: a great bazaar designed so you never want to leave.',
  region_mercado_theme: 'instant gratification',
  region_ojo: 'Chamber of the Fractured Eye',
  region_ojo_text: 'A stone structure by the summit waterfalls. Few dare to look at what it holds.',
  region_ojo_theme: 'what we would rather not see',
  region_tiempo: 'Room of Time',
  region_tiempo_text: 'At the very top of the realm, where time no longer flows the same way. The end of the Realm of Compulsion.',
  region_tiempo_theme: 'the value of your time',
  // ventaja
  advantage_title: 'Our advantage',
  advantage_subtitle: 'Creativity, technology and education in a single experience.',
  advantage_universe: 'Original universe',
  advantage_music: 'Original music',
  advantage_design: 'Responsible design',
  advantage_wellbeing: 'Digital wellbeing',
  advantage_team: 'Expert team',
  advantage_systems: 'Core systems implemented',
  advantage_highlight: 'Technology can be copied. Experience and community are much harder to replicate.',
  // estado
  status_title: 'Project status',
  status_subtitle: 'From idea to a real experience.',
  status_idea: 'Idea',
  status_idea_text: 'Concept, purpose and universe',
  status_prototype: 'Prototype',
  status_prototype_text: 'First playable version',
  status_pilots: 'Pilots',
  status_pilots_text: 'Validation with schools and parent associations',
  status_market: 'Market',
  status_market_text: 'First complete commercial version',
  status_done: 'Completed',
  status_in_progress: 'In preparation',
  status_next: 'Next milestone',
  // mercado
  market_title: 'Market',
  market_schools_title: 'Schools and parent associations',
  market_schools_text: 'Programmes to work on focus, digital wellbeing and healthy habits.',
  market_families_title: 'Families',
  market_families_text: 'Positive tools to support healthy technology use.',
  market_users_title: 'Individual users',
  market_users_text: 'People who want to reduce distractions through an engaging experience.',
  // equipo
  team_title: 'Team',
  team_lead: 'Technical and creative team with experience in product, AAA and operations — ready to execute and scale.',
  view_profile: 'View full profile',
  role_daniel: 'CPO & Head of Product',
  bio_daniel: 'Technical Producer at Foundever and former Head of Product at BrytSpace. Engineer and manager combining his passion for technology and psychology to improve mental health through software.',
  role_charlie: 'Creative Director',
  bio_charlie: 'Senior Game Designer at Gameloft Barcelona, lecturer at U-Tad and founder of Beast Arts. Gamification specialist with over seven years of experience.',
  role_raquel: 'Full-Stack Developer',
  bio_raquel: 'Former gameplay and systems developer at Péndulo Studios. Specialist in Unity, Unreal Engine and interfaces.',
  role_david: 'Full-Stack Developer & DevSecOps',
  bio_david: 'Rigging and IT programmer at Huhaa Studios. Industrial Engineering graduate and expert in systems and backend.',
  role_rober: 'Composer & Sound Designer',
  bio_rober: 'Video game music composer and author of “Crónicas de un Gamer: Guía Emocional de Videojuegos”.',
  role_ismael: 'Concept Artist',
  bio_ismael: 'Concept Artist and Graphic Designer at Infinite Thread Games. Specialised in digital illustration and concept art.',
  role_sergio: 'Business & Operations',
  bio_sergio: 'Life Cycle Support Engineer at Navantia. A University of Málaga graduate, he brings engineering method and vision to GrowTale’s development.',
  role_andrea: 'Concept Artist',
  bio_andrea: 'Concept artist and Marketing student. Combines illustration with the project’s communication.',
  // qué buscamos
  ask_title: 'What we are looking for',
  ask_subtitle: 'We are building GrowTale together with people and institutions who share our vision.',
  ask_investment_title: 'Investment',
  ask_investment_text: 'Capital to accelerate development, validate the market and prepare the launch.',
  ask_schools_title: 'Schools',
  ask_schools_text: 'Secondary schools, parent associations and organisations interested in joining the first pilots.',
  ask_partners_title: 'Partnerships',
  ask_partners_text: 'Strategic partners, institutions, companies and professionals.',
  ask_highlight: 'Let’s grow GrowTale together',
  // contacto
  contact_title: 'Contact',
  contact_subtitle: 'School, parent association, investor or partner? Tell us how we could work together.',
  contact_write: 'Write to us',
  contact_alt: 'Or email us directly at',
  // formulario
  form_kicker: 'LET’S TALK',
  form_title: 'Want to know more about GrowTale?',
  form_intro: 'Tell us who you are and how we could work together.',
  form_required: 'Fields marked with * are required.',
  form_name: 'Full name *',
  form_email: 'Email *',
  form_org: 'Organisation',
  form_org_help: 'School, parent association, investment fund, company or institution.',
  form_role: 'Position or relationship with the organisation',
  form_participation: 'How would you like to get involved? *',
  form_opt_pilot: 'Join an educational pilot',
  form_opt_ampa: 'Collaborate as a parent association',
  form_opt_investor: 'Learn about the project as an investor',
  form_opt_institutional: 'Explore an institutional partnership',
  form_opt_professional: 'Offer a professional collaboration',
  form_opt_press: 'Press and media',
  form_opt_other: 'Another kind of collaboration',
  form_message: 'Message *',
  form_message_help: 'Briefly tell us who you are, which organisation you represent and what you would like to explore with GrowTale.',
  form_note: 'When you send it, your email app will open with the message ready.',
  form_submit: 'Prepare email',
  form_close: 'Close',
  form_success_title: 'Your email is ready!',
  form_success_text: 'Your email app should have opened with the message. Just press send.',
  form_success_fallback: 'If it didn’t open, write to us at',
  form_success_close: 'Back to the site',
  // pie
  footer_credit: 'Designed in collaboration with José Manuel Ruiz',
  // lightbox
  lightbox_label: 'Enlarged image',
  lightbox_close: 'Close (Esc)',
  lightbox_prev: 'Previous',
  lightbox_next: 'Next'
}

// Textos generados desde JS (no están en el HTML)
const STRINGS = {
  es: {
    music_on: 'Silenciar',
    music_off: 'Activar sonido',
    view_profile: 'Ver perfil completo',
    enemy_more: 'Ver ataques y estrategia',
    enemy_less: 'Ocultar detalles',
    validation_doc_title: 'Evaluación profesional independiente',
    pitch_doc_title: 'Pitch Deck de GrowTale',
    hide_profile: 'Ocultar perfil',
    participation_required: 'Selecciona al menos una forma de participación.',
    mail_subject: 'Contacto GrowTale',
    mail_name: 'Nombre',
    mail_email: 'Email',
    mail_org: 'Organización',
    mail_role: 'Cargo',
    mail_interest: 'Interés',
    mail_message: 'Mensaje'
  },
  en: {
    music_on: 'Mute',
    music_off: 'Turn sound on',
    view_profile: 'View full profile',
    enemy_more: 'See attacks and strategy',
    enemy_less: 'Hide details',
    validation_doc_title: 'Independent professional assessment',
    pitch_doc_title: 'GrowTale Pitch Deck',
    hide_profile: 'Hide profile',
    participation_required: 'Please choose at least one way to get involved.',
    mail_subject: 'GrowTale contact',
    mail_name: 'Name',
    mail_email: 'Email',
    mail_org: 'Organisation',
    mail_role: 'Position',
    mail_interest: 'Interest',
    mail_message: 'Message'
  }
}

const currentLang = () => (document.documentElement.lang === 'en' ? 'en' : 'es')
const t = key => STRINGS[currentLang()][key] || STRINGS.es[key] || key

/* -----------------------------------------
   Sonidos de interfaz (los del juego: carpeta GrowTale_UI Samples)
   Web Audio: suenan al instante y se pueden solapar. Los navegadores no dejan
   reproducir audio hasta la primera interacción, así que se cargan entonces.
   El botón de sonido silencia música y efectos a la vez.
   ----------------------------------------- */
const SFX = {
  hover: 0.16, button: 0.55, tap: 0.6, tap2: 0.4, 'toggle-on': 0.45, 'toggle-off': 0.5,
  'modal-open': 0.4, 'modal-close': 0.3, 'nav-transition': 0.5, 'nav-transition-2': 0.5,
  success: 0.4, error: 0.35
}
let sfxCtx = null
const sfxBuffers = {}
const sfxEnabled = () => storage.get(MUSIC_KEY) !== 'off'

function unlockSfx(){
  if(sfxCtx) return
  const AC = window.AudioContext || window.webkitAudioContext
  if(!AC) return
  sfxCtx = new AC()
  Object.keys(SFX).forEach(name=>{
    fetch(`assets/audio/ui/${name}.mp3`)
      .then(r=> r.arrayBuffer())
      .then(data=> new Promise((ok, ko)=> sfxCtx.decodeAudioData(data, ok, ko)))
      .then(buf=>{ sfxBuffers[name] = buf })
      .catch(()=>{})
  })
}

// force: suena aunque el sonido esté desactivado (p. ej. el "clic" al silenciar)
function playSfx(name, force){
  if(!sfxCtx || (!force && !sfxEnabled())) return
  const buf = sfxBuffers[name]
  if(!buf) return
  if(sfxCtx.state === 'suspended') sfxCtx.resume()
  const src = sfxCtx.createBufferSource()
  const gain = sfxCtx.createGain()
  gain.gain.value = SFX[name]
  src.buffer = buf
  src.connect(gain).connect(sfxCtx.destination)
  src.start()
}

function initSfx(){
  ;['pointerdown', 'keydown', 'touchstart'].forEach(ev=>
    document.addEventListener(ev, unlockSfx, { capture: true, once: true, passive: true }))

  // Hover: solo con ratón y solo al entrar en un elemento nuevo
  const HOVER = '.btn, .nav-links a, .nav-logo, .nav-toggle, .lang-switch, #music-toggle, .member-link, .map-spot, ' +
    '.gallery-item img, .map-wrapper img, .lb-prev, .lb-next, .lb-close, .contact-dialog-close, .back-to-cover'
  let lastHover = 0
  document.addEventListener('pointerover', e=>{
    if(e.pointerType !== 'mouse') return
    const el = e.target.closest && e.target.closest(HOVER)
    if(!el || (e.relatedTarget && el.contains(e.relatedTarget))) return
    const now = performance.now()
    if(now - lastHover < 70) return
    lastHover = now
    playSfx('hover')
  }, { passive: true })

  // Clics. Los pop-ups, la música y el formulario reproducen su propio sonido.
  document.addEventListener('click', e=>{
    const el = e.target.closest && e.target.closest('a, button')
    if(!el) return
    if(el.id === 'discover-btn') return playSfx('nav-transition')
    if(el.matches('a[href="index.html"]')) return playSfx('nav-transition-2')
    if(el.matches('.hero-liria-stage, .enemy-toggle, [data-doc-viewer], [data-close-doc], .carousel-btn, .carousel-dot, .daily-end, .dc-modal button, .dc-apply, .skill-btn, #music-toggle, [data-open-contact], [data-close-contact], .lb-close, [type="submit"]')) return
    if(el.matches('.lang-switch, .nav-toggle')) return playSfx('tap2')
    if(el.matches('.nav-links a, .member-link, .lb-prev, .lb-next, .contact-alt a, .map-spot')) return playSfx('tap')
    playSfx('button')
  }, true)
}

const I18N_ATTRS = ['aria-label', 'title', 'alt', 'content']

function translatePage(lang){
  const useEn = lang === 'en'
  document.documentElement.lang = useEn ? 'en' : 'es'

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    if(el.dataset.i18nEs === undefined) el.dataset.i18nEs = el.textContent
    const en = I18N_EN[el.dataset.i18n]
    el.textContent = useEn && en ? en : el.dataset.i18nEs
  })

  I18N_ATTRS.forEach(attr=>{
    const keyAttr = `data-i18n-${attr}`
    const esAttr = `data-i18n-es-${attr}`
    document.querySelectorAll(`[${keyAttr}]`).forEach(el=>{
      if(!el.hasAttribute(esAttr)) el.setAttribute(esAttr, el.getAttribute(attr) || '')
      const en = I18N_EN[el.getAttribute(keyAttr)]
      el.setAttribute(attr, useEn && en ? en : el.getAttribute(esAttr))
    })
  })

  document.dispatchEvent(new CustomEvent('growtale:langchange'))
}

// Cambio de idioma animado: los textos visibles se desvanecen, cambian y vuelven a aparecer.
// Se usa la Web Animations API para no pisar las animaciones CSS de entrada de la portada.
let langSwitching = false
async function switchLanguage(lang){
  if(langSwitching) return
  const visible = Array.from(document.querySelectorAll('[data-i18n]')).filter(el=>{
    if(el.tagName === 'TITLE' || !el.animate) return false
    const r = el.getBoundingClientRect()
    return r.bottom > 0 && r.top < window.innerHeight && r.width > 0
  })
  if(prefersReducedMotion() || visible.length === 0){ translatePage(lang); return }

  langSwitching = true
  const out = { opacity: [1, 0], filter: ['blur(0px)', 'blur(6px)'], transform: ['translateY(0)', 'translateY(-4px)'] }
  const back = { opacity: [0, 1], filter: ['blur(6px)', 'blur(0px)'], transform: ['translateY(4px)', 'translateY(0)'] }
  // Límite de tiempo por si el navegador pausa las animaciones (pestaña en segundo plano)
  const settle = (anims, ms)=> Promise.race([Promise.all(anims.map(a=> a.finished)), new Promise(r=> setTimeout(r, ms))])

  const outs = visible.map(el=> el.animate(out, { duration: 180, easing: 'ease-in', fill: 'forwards' }))
  await settle(outs, 260)
  translatePage(lang)
  const backs = visible.map((el, i)=>
    el.animate(back, { duration: 320, delay: Math.min(i * 12, 160), easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'backwards' }))
  outs.forEach(a=> a.cancel()) // la entrada (fill: backwards) ya mantiene el texto oculto durante su retardo
  await settle(backs, 600)
  langSwitching = false
}

/* -----------------------------------------
   Selector de idioma: interruptor deslizable ESP <-> ENG
   ----------------------------------------- */
function initLanguage(){
  const toggle = document.getElementById('lang-select')
  const saved = storage.get(LANG_KEY) ||
    ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en')
  translatePage(saved)
  if(!toggle) return

  const sync = ()=> toggle.setAttribute('aria-checked', currentLang() === 'en' ? 'true' : 'false')
  toggle.addEventListener('click', ()=>{
    if(langSwitching) return
    const lang = currentLang() === 'en' ? 'es' : 'en'
    storage.set(LANG_KEY, lang)
    toggle.setAttribute('aria-checked', lang === 'en' ? 'true' : 'false') // el interruptor se mueve ya
    switchLanguage(lang)
  })
  document.addEventListener('growtale:langchange', sync)
  sync()
}

/* -----------------------------------------
   Música (portada y proyecto)
   Suena por defecto a volumen bajo salvo que el usuario la apague.
   Si el navegador bloquea el autoplay, arranca con la primera interacción.
   La posición se conserva al pasar de una página a otra.
   ----------------------------------------- */
function initMusic(){
  const audio = document.getElementById('theme-audio')
  const button = document.getElementById('music-toggle')
  if(!audio || !button) return

  let enabled = storage.get(MUSIC_KEY) !== 'off'
  audio.loop = true
  audio.volume = 0

  const savedTime = parseFloat(storage.get(MUSIC_TIME_KEY, sessionStorage))
  if(savedTime > 0){
    const restore = ()=>{ try{ audio.currentTime = savedTime }catch(e){} }
    audio.readyState >= 1 ? restore() : audio.addEventListener('loadedmetadata', restore, { once: true })
  }

  const updateButton = ()=>{
    const playing = !audio.paused
    button.classList.toggle('on', playing)
    button.setAttribute('aria-pressed', playing ? 'true' : 'false')
    button.setAttribute('aria-label', playing ? t('music_on') : t('music_off'))
    button.title = playing ? t('music_on') : t('music_off')
  }

  // Fundido de entrada con temporizador (requestAnimationFrame se pausa en pestañas ocultas)
  let fadeTimer = 0
  const fadeIn = ()=>{
    clearInterval(fadeTimer)
    const start = performance.now()
    fadeTimer = setInterval(()=>{
      const k = Math.min(1, (performance.now() - start) / 1500)
      audio.volume = MUSIC_VOLUME * k
      if(k >= 1) clearInterval(fadeTimer)
    }, 50)
  }

  const play = async ()=>{
    if(!enabled || !audio.paused) return
    try{
      await audio.play()
      fadeIn()
    }catch(e){ /* autoplay bloqueado: esperamos a la primera interacción */ }
  }

  button.addEventListener('click', ()=>{
    if(audio.paused){
      enabled = true
      storage.set(MUSIC_KEY, 'on')
      play()
      playSfx('toggle-on')
    } else {
      enabled = false
      storage.set(MUSIC_KEY, 'off')
      audio.pause()
      playSfx('toggle-off', true)
    }
  })

  const unlockEvents = ['pointerdown', 'keydown', 'touchstart']
  const unlock = e=>{
    if(button.contains(e.target)) return
    unlockEvents.forEach(ev=> document.removeEventListener(ev, unlock, true))
    play()
  }
  unlockEvents.forEach(ev=> document.addEventListener(ev, unlock, true))

  audio.addEventListener('play', updateButton)
  audio.addEventListener('pause', updateButton)
  document.addEventListener('growtale:langchange', updateButton)
  window.addEventListener('pagehide', ()=>{
    storage.set(MUSIC_TIME_KEY, String(audio.currentTime || 0), sessionStorage)
  })

  updateButton()
  play()
}

/* -----------------------------------------
   Navegación: menú móvil y enlace activo
   ----------------------------------------- */
function initNav(){
  const nav = document.querySelector('.top-nav')
  if(!nav) return
  const toggle = nav.querySelector('.nav-toggle')
  const list = nav.querySelector('.nav-links')
  const links = Array.from(nav.querySelectorAll('.nav-links a'))

  const setOpen = open=>{
    list.classList.toggle('open', open)
    if(toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
  }
  if(toggle) toggle.addEventListener('click', ()=> setOpen(!list.classList.contains('open')))
  document.addEventListener('click', e=>{ if(!nav.contains(e.target)) setOpen(false) })
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && list.classList.contains('open')){ setOpen(false); if(toggle) toggle.focus() }
  })
  links.forEach(a=> a.addEventListener('click', ()=> setOpen(false)))

  const sections = links.map(a=> document.querySelector(a.getAttribute('href'))).filter(Boolean)
  let navRaf = 0
  const updateActive = ()=>{
    navRaf = 0
    const line = window.innerHeight * 0.45
    let current = null
    sections.forEach(s =>{ if(s.getBoundingClientRect().top <= line) current = s })
    links.forEach(l =>{
      const active = !!current && l.getAttribute('href') === '#' + current.id
      l.classList.toggle('active', active)
      if(active) l.setAttribute('aria-current', 'true')
      else l.removeAttribute('aria-current')
    })
  }
  window.addEventListener('scroll', ()=>{ if(!navRaf) navRaf = requestAnimationFrame(updateActive) }, { passive: true })
  updateActive()
}

/* -----------------------------------------
   Equipo: desplegar perfil completo
   ----------------------------------------- */
function initTeam(){
  const buttons = Array.from(document.querySelectorAll('.team-section .view-profile'))
  const sync = btn=>{
    const expanded = btn.getAttribute('aria-expanded') === 'true'
    btn.textContent = expanded ? t('hide_profile') : t('view_profile')
  }
  // El botón solo tiene sentido si la bio está recortada
  const updateVisibility = ()=> buttons.forEach(btn=>{
    const card = btn.closest('.member-card')
    if(card.classList.contains('expanded')) return
    const bio = card.querySelector('.bio-short')
    btn.hidden = bio.scrollHeight <= bio.clientHeight + 1
  })
  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const card = btn.closest('.member-card')
      const bio = card.querySelector('.bio-short')
      const opening = !card.classList.contains('expanded')
      // El cambio de tamaño es instantáneo (animar la altura recalcula toda la rejilla del equipo en cada
      // fotograma y daba tirones); el texto aparece con un fundido que solo usa opacidad y transform.
      card.classList.toggle('expanded', opening)
      btn.setAttribute('aria-expanded', opening ? 'true' : 'false')
      sync(btn)
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || !bio.animate) return
      bio.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }],
        { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' })
    })
  })
  document.addEventListener('growtale:langchange', ()=>{ buttons.forEach(sync); updateVisibility() })
  window.addEventListener('resize', updateVisibility)
  updateVisibility()
}

/* -----------------------------------------
   Lightbox para galería, pasos y mapa
   ----------------------------------------- */
function initLightbox(){
  const lightbox = document.getElementById('lightbox')
  if(!lightbox) return
  const lbImage = lightbox.querySelector('.lb-image')
  const lbCaption = lightbox.querySelector('.lb-caption')
  const targets = Array.from(document.querySelectorAll('.gallery-item img, .map-wrapper img'))
  if(targets.length === 0) return

  let current = 0
  let lastFocus = null
  const captionOf = img=>{
    const cap = img.closest('figure') && img.closest('figure').querySelector('figcaption')
    return cap ? cap.textContent.trim() : ''
  }
  const show = i=>{
    current = (i + targets.length) % targets.length
    const img = targets[current]
    lbImage.src = img.currentSrc || img.src
    lbImage.alt = img.alt
    lbCaption.textContent = captionOf(img)
  }
  const open = i=>{
    lastFocus = document.activeElement
    show(i)
    lightbox.classList.replace('lightbox-hidden', 'lightbox-visible')
    lightbox.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
    lightbox.querySelector('.lb-close').focus()
    playSfx('modal-open')
  }
  const close = ()=>{
    playSfx('modal-close')
    lightbox.classList.replace('lightbox-visible', 'lightbox-hidden')
    lightbox.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
    // la imagen se quita cuando termina el fundido de salida
    setTimeout(()=>{ if(lightbox.classList.contains('lightbox-hidden')) lbImage.removeAttribute('src') }, 300)
    if(lastFocus) lastFocus.focus()
  }

  targets.forEach((img, i)=>{
    img.tabIndex = 0
    img.setAttribute('role', 'button')
    img.addEventListener('click', ()=> open(i))
    img.addEventListener('keydown', e=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(i) } })
  })
  lightbox.querySelectorAll('[data-lb-close]').forEach(el=> el.addEventListener('click', close))
  lightbox.querySelector('.lb-next').addEventListener('click', ()=> show(current + 1))
  lightbox.querySelector('.lb-prev').addEventListener('click', ()=> show(current - 1))
  document.addEventListener('keydown', e=>{
    if(!lightbox.classList.contains('lightbox-visible')) return
    if(e.key === 'Escape') close()
    if(e.key === 'ArrowRight') show(current + 1)
    if(e.key === 'ArrowLeft') show(current - 1)
  })
}

/* -----------------------------------------
   Formulario de contacto (pop-up)
   Sin servidor: al enviar abre el cliente de correo con el mensaje listo.
   ----------------------------------------- */
function initContact(){
  const dialog = document.getElementById('contact-dialog')
  if(!dialog || typeof dialog.showModal !== 'function') return
  const form = dialog.querySelector('form')
  const success = dialog.querySelector('.contact-success')
  const participation = Array.from(form.querySelectorAll('input[name="participation"]'))
  const email = form.dataset.email

  const open = ()=>{
    form.hidden = false
    success.hidden = true
    dialog.showModal()
    form.querySelector('input').focus()
    playSfx('modal-open')
  }
  // Cierre animado: la clase "closing" reproduce la salida y después se cierra de verdad
  const close = ()=>{
    if(!dialog.open || dialog.classList.contains('closing')) return
    playSfx('modal-close')
    if(prefersReducedMotion()){ dialog.close(); return }
    dialog.classList.add('closing')
    const done = ()=>{ dialog.classList.remove('closing'); dialog.close() }
    dialog.addEventListener('animationend', done, { once: true })
    setTimeout(()=>{ if(dialog.classList.contains('closing')) done() }, 400) // por si no llega el evento
  }
  document.querySelectorAll('[data-open-contact]').forEach(btn=>
    btn.addEventListener('click', e=>{ e.preventDefault(); open() })
  )
  dialog.querySelectorAll('[data-close-contact]').forEach(btn=> btn.addEventListener('click', close))
  // cerrar al pulsar fuera del panel o con Escape, también animado
  dialog.addEventListener('click', e=>{ if(e.target === dialog) close() })
  dialog.addEventListener('cancel', e=>{ e.preventDefault(); close() })

  const checkParticipation = ()=>{
    const ok = participation.some(o=> o.checked)
    participation[0].setCustomValidity(ok ? '' : t('participation_required'))
  }
  participation.forEach(o=> o.addEventListener('change', checkParticipation))

  form.addEventListener('submit', e=>{
    e.preventDefault()
    checkParticipation()
    if(!form.reportValidity()){ playSfx('error'); return }

    const field = name=> String(new FormData(form).get(name) || '').trim()
    const interests = participation.filter(o=> o.checked).map(o=> o.closest('label').textContent.trim())
    const lines = [`${t('mail_name')}: ${field('name')}`, `${t('mail_email')}: ${field('email')}`]
    if(field('organization')) lines.push(`${t('mail_org')}: ${field('organization')}`)
    if(field('role')) lines.push(`${t('mail_role')}: ${field('role')}`)
    lines.push(`${t('mail_interest')}: ${interests.join(', ')}`, '', `${t('mail_message')}:`, field('message'))
    const subject = `${t('mail_subject')} — ${field('name')}${field('organization') ? ` (${field('organization')})` : ''}`

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`

    form.hidden = true
    success.hidden = false
    success.focus()
    form.reset()
    playSfx('success')
  })

  // Los enlaces antiguos a contacto.html redirigen a proyecto.html#contacto
  if(location.hash === '#contacto'){
    const section = document.getElementById('contact')
    if(section) section.scrollIntoView()
    open()
  }
}

/* -----------------------------------------
   Detalles visuales
   ----------------------------------------- */
function initParallax(){
  const el = document.getElementById('vision')
  // la portada a pantalla completa ya tiene su propio movimiento: sin parallax por scroll
  if(!el || prefersReducedMotion() || el.classList.contains('hero-full')) return
  const maxShift = 88
  let ticking = false

  const update = ()=>{
    ticking = false
    const rect = el.getBoundingClientRect()
    if(rect.bottom < 0 || rect.top > window.innerHeight) return
    const pct = (rect.top + rect.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2 + rect.height / 2)
    el.style.setProperty('--vision-parallax', `${Math.round(pct * maxShift)}px`)
  }
  const onScroll = ()=>{ if(!ticking){ ticking = true; requestAnimationFrame(update) } }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  update()
}

// Portada: al pulsar "Descubre GrowTale" el contenido se desvanece, el fondo se ilumina
// (shader.js escucha growtale:leave) y después se navega; proyecto.html entra con un fundido.
function initCoverTransition(){
  const btn = document.getElementById('discover-btn')
  if(!btn) return
  const root = document.documentElement
  const LEAVE_MS = 750

  btn.addEventListener('click', e=>{
    // Respetar abrir en pestaña nueva y la preferencia de reducir movimiento
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || prefersReducedMotion()) return
    e.preventDefault()
    if(root.classList.contains('leaving')) return
    root.classList.add('leaving')
    storage.set('growtale_enter', '1', sessionStorage)
    document.dispatchEvent(new CustomEvent('growtale:leave'))
    setTimeout(()=>{ window.location.href = btn.href }, LEAVE_MS)
  })
  // Al volver con "atrás" el navegador puede restaurar la página tal cual (bfcache):
  // quitamos el estado de salida y reproducimos la animación de regreso
  window.addEventListener('pageshow', e=>{
    if(!e.persisted) return
    root.classList.remove('leaving', 'return')
    if(prefersReducedMotion()) return
    void root.offsetWidth // reinicia las animaciones CSS
    root.classList.add('return')
    document.dispatchEvent(new CustomEvent('growtale:return'))
  })
}

// Proyecto: los enlaces a la portada funden la página antes de navegar;
// la portada reproduce entonces la animación de regreso (clase "return").
function initBackToCover(){
  if(document.getElementById('discover-btn')) return // estamos en la portada
  const root = document.documentElement
  const LEAVE_MS = 420
  document.querySelectorAll('a[href="index.html"]').forEach(link=>{
    link.addEventListener('click', e=>{
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      storage.set('growtale_return', '1', sessionStorage)
      if(prefersReducedMotion()) return
      e.preventDefault()
      root.classList.add('leaving-project')
      setTimeout(()=>{ window.location.href = link.href }, LEAVE_MS)
    })
  })
  window.addEventListener('pageshow', e=>{ if(e.persisted) root.classList.remove('leaving-project') })
}

// Mapa interactivo de Mindveil: la tarjeta de un lugar solo cambia al pulsarlo
// (al pasar el ratón por encima solo se ve su nombre).
function initWorldMap(){
  const map = document.querySelector('.world-map')
  if(!map) return
  const spots = Array.from(map.querySelectorAll('.map-spot'))
  const cards = Array.from(map.querySelectorAll('.region-card'))

  const select = region=>{
    cards.forEach(c=> c.hidden = c.dataset.region !== region)
    spots.forEach(s=> s.setAttribute('aria-pressed', s.dataset.region === region ? 'true' : 'false'))
  }
  spots.forEach(spot=> spot.addEventListener('click', ()=> select(spot.dataset.region)))
  select('fuente')
}

function initScreenTimeCounter(){
  const counter = document.getElementById('screen-time-counter')
  if(!counter || prefersReducedMotion()) return
  let minutes = 462 // 7h 42m
  setInterval(()=>{
    minutes++
    counter.textContent = `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`
  }, 3000)
}

/* -----------------------------------------
   Arranque
   ----------------------------------------- */
// Abrir siempre arriba salvo que se llegue a una sección concreta (#ancla)
if(!location.hash && 'scrollRestoration' in history){
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
}

/* -----------------------------------------
   Retos diarios: el "+" avanza el progreso hasta completarlo (barra dorada y ✓).
   Pulsar el ✓ de un reto completado lo reinicia.
   ----------------------------------------- */
function initDailyChallenges(){
  const STEP = 20
  const ES = { daily_advance: 'Avanzar reto', daily_restart: 'Reiniciar reto' }
  document.querySelectorAll('.daily').forEach(item=>{
    const btn = item.querySelector('.daily-end')
    if(!btn) return
    let value = parseFloat(item.style.getPropertyValue('--progress')) || 0
    // La barra se llena primero; al terminar la animación pasa a "completado" (dorada y ✓)
    const FILL_MS = 480
    let timer = null
    const render = (done = value >= 100) =>{
      item.style.setProperty('--progress', value + '%')
      item.dataset.state = done ? 'done' : 'progress'
      const key = done ? 'daily_restart' : 'daily_advance'
      btn.setAttribute('data-i18n-aria-label', key)
      btn.setAttribute('data-i18n-es-aria-label', ES[key])
      btn.setAttribute('aria-label', currentLang() === 'en' ? I18N_EN[key] : ES[key])
    }
    btn.addEventListener('click', ()=>{
      if(timer) return
      if(value >= 100){ value = 0; playSfx('toggle-off'); render(); return }
      value = Math.min(100, value + STEP)
      playSfx('tap')
      if(value < 100){ render(); return }
      render(false)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      timer = setTimeout(()=>{
        timer = null
        render(true)
        playSfx('success')
        item.classList.remove('just-done'); void item.offsetWidth; item.classList.add('just-done')
      }, reduce ? 0 : FILL_MS)
    })
    render()
  })
}

/* -----------------------------------------
   "Pruébalo": modal de reto diario y habilidades, recreados del juego.
   Los textos dinámicos se generan aquí en los dos idiomas.
   ----------------------------------------- */
const TRYIT = {
  es: {
    levels: ['Fácil', 'Normal', 'Difícil'],
    challenges: {
      walk: g => `Camina ${g.toLocaleString('es-ES')} pasos`,
      read: g => `Lee ${g} páginas`
    },
    banned: 'Reto descartado: hoy no volverá a aparecer.',
    lastOne: 'No puedes descartar tu último reto.',
    applied: '¡Reto aplicado! Ya cuenta para tu progreso.',
    completed: '¡Reto completado! Has ganado recompensas para tu aventura.',
    ready: 'Lista',
    cooldown: 'En recarga',
    steps: n => `Se recarga al completar tu próximo objetivo (faltan ${n.toLocaleString('es-ES')} pasos)`,
    readyLine: 'Lista para usar en el próximo combate',
    skills: {
      smite: ['Golpe Poderoso', 'Motivación', '“La acción es la clave fundamental.” — Pablo Picasso', 'Inflige 40 puntos de daño.'],
      gust: ['Estado de Flujo', 'Foco', '“El tiempo desaparece en el flujo.” — Mihaly Csikszentmihalyi', 'Alarga 2 turnos la duración de todas tus mejoras activas.'],
      frost: ['Determinación Firme', 'Resiliencia', '“Las raíces profundas no las alcanza la escarcha.” — J. R. R. Tolkien', 'Cada efecto negativo que recibes aumenta tu defensa física de forma acumulativa.'],
      heal: ['Toque Sanador', 'Empatía', '“Donde hay amor, hay vida.” — Mahatma Gandhi', 'Recupera al instante un 20 % de tu vitalidad total.']
    }
  },
  en: {
    levels: ['Easy', 'Normal', 'Hard'],
    challenges: {
      walk: g => `Walk ${g.toLocaleString('en-GB')} steps`,
      read: g => `Read ${g} pages`
    },
    banned: "Challenge banned: it won't come back today.",
    lastOne: "You can't ban your last challenge.",
    applied: 'Challenge applied! It now counts towards your progress.',
    completed: 'Challenge complete! You earned rewards for your adventure.',
    ready: 'Ready',
    cooldown: 'Cooldown',
    steps: n => `Recharges when you complete your next goal (${n.toLocaleString('en-GB')} steps to go)`,
    readyLine: 'Ready to use in the next fight',
    skills: {
      smite: ['Power Strike', 'Motivation', '“Action is the foundational key.” — Pablo Picasso', 'Deals 40 damage points.'],
      gust: ['Flow State', 'Focus', '“Time disappears in flow.” — Mihaly Csikszentmihalyi', 'Extends the duration of all your active buffs by 2 turns.'],
      frost: ['Sturdy Resolve', 'Resilience', '“Deep roots are not reached by frost.” — J. R. R. Tolkien', 'Every debuff you receive stacks a physical defence boost.'],
      heal: ['Healing Touch', 'Empathy', '“Where there is love, there is life.” — Mahatma Gandhi', 'Instantly restores 20% of your total vitality.']
    }
  }
}

function initTryIt(){
  const modal = document.getElementById('dc-modal')
  if(!modal) return
  document.querySelectorAll('.tryit-item').forEach(item => item.addEventListener('click', e =>{
    if(e.target.closest('button')) item.classList.add('touched')
  }))
  const L = () => TRYIT[currentLang()]
  const $ = id => document.getElementById(id)

  // Reto diario
  const CH = [
    { id: 'walk', icon: 'footprints', goals: [6000, 9000, 12000], done: 2500 },
    { id: 'read', icon: 'book-bookmark', goals: [10, 20, 40], done: 6 }
  ]
  let pool = CH.slice(), cur = 0, level = 1, toastTimer = null
  const toast = msg =>{
    const el = $('dc-toast'); el.textContent = msg; el.classList.add('show')
    clearTimeout(toastTimer); toastTimer = setTimeout(()=> el.classList.remove('show'), 2600)
  }
  const renderDc = () =>{
    const c = pool[cur], goal = c.goals[level]
    $('dc-icon').style.setProperty('--icon', `url(assets/icons/${c.icon}.svg)`)
    $('dc-title').textContent = L().challenges[c.id](goal)
    const range = $('dc-range')
    range.max = goal; range.step = Math.max(1, Math.round(goal / 90)); range.value = Math.min(c.done, goal)
    $('dc-fill').style.width = Math.min(100, c.done / goal * 100) + '%'
    modal.classList.toggle('done', c.done >= goal)
    const fmt = n => n.toLocaleString(currentLang() === 'en' ? 'en-GB' : 'es-ES')
    $('dc-count').textContent = `${fmt(c.done)} / ${fmt(goal)}`
    $('dc-level').textContent = L().levels[level]
    $('dc-minus').disabled = level === 0
    $('dc-plus').disabled = level === 2
    $('dc-ban').disabled = pool.length < 2
  }
  const bump = () =>{ modal.classList.remove('bump'); void modal.offsetWidth; modal.classList.add('bump') }
  $('dc-minus').addEventListener('click', ()=>{ if(level > 0){ level--; playSfx('toggle-off'); renderDc() } })
  $('dc-plus').addEventListener('click', ()=>{ if(level < 2){ level++; playSfx('toggle-on'); renderDc() } })
  $('dc-swap').addEventListener('click', ()=>{ cur = (cur + 1) % pool.length; playSfx('tap'); bump(); renderDc() })
  $('dc-ban').addEventListener('click', ()=>{
    if(pool.length < 2){ playSfx('error'); return toast(L().lastOne) }
    pool.splice(cur, 1); cur = cur % pool.length
    playSfx('error'); bump(); renderDc(); toast(L().banned)
  })
  $('dc-apply').addEventListener('click', ()=>{ playSfx('success'); toast(L().applied) })
  let lastTick = 0
  $('dc-range').addEventListener('input', e =>{
    const c = pool[cur], goal = c.goals[level], wasDone = c.done >= goal
    c.done = Math.min(goal, Number(e.target.value))
    if(c.done >= goal - Number(e.target.step) / 2) c.done = goal
    renderDc()
    if(c.done >= goal && !wasDone){ playSfx('success'); bump(); toast(L().completed) }
    else if(performance.now() - lastTick > 90){ lastTick = performance.now(); playSfx('hover') }
    modal.closest('.tryit-item').classList.add('touched')
  })

  // Habilidades
  const SK = { smite: 0, gust: 2386, frost: 0, heal: 1150 } // pasos que faltan para recargar
  let selected = 'frost'
  const glyph = (el, id) =>{ el.style.setProperty('--icon', `url(assets/icons/skills/${id}.svg)`); el.dataset.skill = id }
  const renderSkills = () =>{
    const l = L()
    document.querySelectorAll('.skill-btn').forEach(b =>{
      const id = b.dataset.skill
      glyph(b.querySelector('.skill-glyph'), id)
      b.querySelector('.skill-btn-name').textContent = l.skills[id][0]
      b.querySelector('.skill-btn-state').textContent = SK[id] ? l.cooldown : l.ready
      b.classList.toggle('cooldown', !!SK[id])
      b.setAttribute('aria-pressed', id === selected ? 'true' : 'false')
    })
    const [name, power, quote, effect] = l.skills[selected]
    glyph($('skill-card-icon'), selected)
    $('skill-card-name').textContent = name
    $('skill-card-state').textContent = power + ' · ' + (SK[selected] ? l.cooldown : l.ready)
    $('skill-card').classList.toggle('is-cooldown', !!SK[selected])
    $('skill-card-quote').textContent = quote
    $('skill-card-effect').textContent = effect
    $('skill-card-steps').textContent = SK[selected] ? l.steps(SK[selected]) : l.readyLine
    $('skill-card').dataset.skill = selected
  }
  document.querySelectorAll('.skill-btn').forEach(b => b.addEventListener('click', ()=>{
    selected = b.dataset.skill; playSfx('tap'); renderSkills()
    const card = $('skill-card'); card.classList.remove('bump'); void card.offsetWidth; card.classList.add('bump')
  }))

  renderDc(); renderSkills()
  document.addEventListener('growtale:langchange', ()=>{ renderDc(); renderSkills() })
}

/* Comparadores boceto → final: el range (accesible con teclado) mueve la cortinilla */
function initBeforeAfter(){
  document.querySelectorAll('.ba').forEach(ba =>{
    const range = ba.querySelector('.ba-range')
    if(!range) return
    const set = () => ba.style.setProperty('--pos', range.value + '%')
    range.addEventListener('input', set)
    set()
  })
}

/* Galería en carrusel: botones, puntos, teclado y diapositiva activa según el scroll */
function initCarousel(){
  document.querySelectorAll('[data-carousel]').forEach(root =>{
    const track = root.querySelector('.carousel-track')
    const slides = Array.from(track.children)
    const prev = root.querySelector('.carousel-prev'), next = root.querySelector('.carousel-next')
    const dotsBox = root.querySelector('.carousel-dots')
    const dotLabel = i => `${currentLang() === 'en' ? 'Go to image' : 'Ir a la imagen'} ${i + 1}`
    let active = 0
    const go = i =>{
      i = Math.max(0, Math.min(slides.length - 1, i))
      const s = slides[i]
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' })
    }
    const dots = slides.map((_, i)=>{
      const d = document.createElement('button')
      d.type = 'button'; d.className = 'carousel-dot'; d.setAttribute('role', 'tab')
      d.setAttribute('aria-label', dotLabel(i))
      d.addEventListener('click', ()=>{ playSfx('tap'); go(i) })
      dotsBox.appendChild(d)
      return d
    })
    const update = ()=>{
      const mid = track.scrollLeft + track.clientWidth / 2
      let best = 0, bestDist = Infinity
      slides.forEach((s, i)=>{
        const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid)
        if(d < bestDist){ bestDist = d; best = i }
      })
      active = best
      slides.forEach((s, i)=> s.classList.toggle('is-active', i === active))
      dots.forEach((d, i)=> d.setAttribute('aria-selected', i === active ? 'true' : 'false'))
      prev.disabled = active === 0
      next.disabled = active === slides.length - 1
    }
    prev.addEventListener('click', ()=>{ playSfx('tap'); go(active - 1) })
    next.addEventListener('click', ()=>{ playSfx('tap'); go(active + 1) })
    track.addEventListener('keydown', e =>{
      if(e.key === 'ArrowRight'){ e.preventDefault(); go(active + 1) }
      if(e.key === 'ArrowLeft'){ e.preventDefault(); go(active - 1) }
    })
    let raf = 0
    track.addEventListener('scroll', ()=>{ cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }, { passive: true })
    window.addEventListener('resize', update)
    // las imágenes cargan de forma diferida: recalcular cuando llegan
    track.querySelectorAll('img').forEach(img => img.addEventListener('load', update))
    document.addEventListener('growtale:langchange', ()=> dots.forEach((d, i)=> d.setAttribute('aria-label', dotLabel(i))))
    update()
  })
}

/* -----------------------------------------
   Visor de documentos: el informe y el Pitch Deck se abren en un pop-up.
   Si el navegador no muestra PDF incrustados (muchos móviles), ofrece abrirlo aparte.
   ----------------------------------------- */
function initDocViewer(){
  const dialog = document.getElementById('doc-viewer')
  if(!dialog || typeof dialog.showModal !== 'function') return
  const frame = document.getElementById('doc-viewer-frame')
  const title = document.getElementById('doc-viewer-title')
  const openLink = document.getElementById('doc-viewer-open')
  const download = document.getElementById('doc-viewer-download')
  const fallback = document.getElementById('doc-viewer-fallback')
  const fallbackLink = document.getElementById('doc-viewer-fallback-link')
  const canEmbed = navigator.pdfViewerEnabled !== false && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  let lastFocus = null

  const open = link =>{
    const url = link.getAttribute('href')
    lastFocus = link
    title.textContent = t(link.dataset.docTitle) || link.textContent.trim()
    openLink.href = download.href = fallbackLink.href = url
    fallback.hidden = canEmbed
    frame.hidden = !canEmbed
    if(canEmbed) frame.src = url + '#view=FitH'
    dialog.showModal()
    playSfx('modal-open')
  }
  const close = ()=>{
    if(!dialog.open || dialog.classList.contains('closing')) return
    playSfx('modal-close')
    dialog.classList.add('closing')
    const done = ()=>{
      dialog.classList.remove('closing')
      dialog.close()
      frame.removeAttribute('src')
      if(lastFocus) lastFocus.focus()
    }
    dialog.addEventListener('animationend', done, { once: true })
    setTimeout(()=>{ if(dialog.classList.contains('closing')) done() }, 400)
  }

  document.querySelectorAll('[data-doc-viewer]').forEach(link => link.addEventListener('click', e =>{
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return // abrir en pestaña nueva a propósito
    e.preventDefault()
    open(link)
  }))
  dialog.querySelector('[data-close-doc]').addEventListener('click', close)
  dialog.addEventListener('cancel', e =>{ e.preventDefault(); close() })
  dialog.addEventListener('click', e =>{ if(e.target === dialog) close() })
  document.addEventListener('growtale:langchange', ()=>{
    if(dialog.open && lastFocus) title.textContent = t(lastFocus.dataset.docTitle) || title.textContent
  })
}

/* -----------------------------------------
   Liria habla en la portada: diálogo con efecto de máquina de escribir
   y una expresión distinta para cada frase. Pulsar el bocadillo avanza.
   ----------------------------------------- */
const LIRIA_LINES = {
  es: [
    ['happy2', '¡Hola! Soy Liria, tu guía en Mindveil.'],
    ['happy1', 'Bienvenido a GrowTale: aquí cada hábito saludable te hace más fuerte.'],
    ['explicative', 'Cuando dejas el móvil y cumples tus retos, tu aventura avanza.'],
    ['surprised', '¡Y hay todo un mundo por descubrir, lleno de distracciones con forma de monstruo!'],
    ['thinking', '¿Te lo enseño? Baja conmigo y descubre cómo lo hacemos.']
  ],
  en: [
    ['happy2', "Hi! I'm Liria, your guide in Mindveil."],
    ['happy1', 'Welcome to GrowTale: here every healthy habit makes you stronger.'],
    ['explicative', 'When you put your phone down and complete your challenges, your adventure moves forward.'],
    ['surprised', "And there's a whole world to discover, full of distractions shaped like monsters!"],
    ['thinking', 'Shall I show you? Scroll down with me and see how we do it.']
  ]
}

function initHeroVisibility(){
  const hero = document.getElementById('vision')
  if(!hero || !('IntersectionObserver' in window)) return
  new IntersectionObserver(entries =>{
    entries.forEach(e => hero.classList.toggle('is-offscreen', !e.isIntersecting))
  }).observe(hero)
}

function initLiriaSpeech(){
  const bubble = document.getElementById('hero-speech')
  const textEl = document.getElementById('hero-speech-text')
  const img = document.getElementById('hero-liria')
  if(!bubble || !textEl || !img) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // precargar las expresiones para que el cambio sea instantáneo
  new Set(LIRIA_LINES.es.map(l => l[0])).forEach(e =>{ const i = new Image(); i.src = `assets/images/hero/liria-${e}.webp` })

  let index = 0, typing = null, autoNext = null, full = ''
  const lines = () => LIRIA_LINES[currentLang()]
  // Cambio de expresión sin doble imagen: Liria se encoge y atenúa un instante,
  // se cambia la expresión en el punto más bajo y vuelve a su tamaño (como un parpadeo)
  let swapToken = 0
  const setExpression = expr =>{
    const src = `assets/images/hero/liria-${expr}.webp`
    if(img.getAttribute('src') === src) return
    if(reduce || !img.animate){ img.setAttribute('src', src); return }
    const token = ++swapToken
    const loader = new Image()
    loader.src = src
    const ready = loader.decode ? loader.decode().catch(()=>{}) : Promise.resolve()
    const out = img.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: .15, transform: 'scale(.94)' }],
      { duration: 160, easing: 'ease-in', fill: 'forwards' })
    Promise.all([ready, out.finished.catch(()=>{})]).then(()=>{
      if(token !== swapToken) return
      img.setAttribute('src', src)
      const back = ()=>{
        out.cancel()
        img.animate([{ opacity: .15, transform: 'scale(.94)' }, { opacity: 1, transform: 'scale(1.02)', offset: .7 }, { opacity: 1, transform: 'scale(1)' }],
          { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' })
      }
      if(img.decode) img.decode().then(back, back); else back()
    })
  }
  const finish = ()=>{
    clearInterval(typing); typing = null
    textEl.textContent = full
    bubble.classList.remove('is-typing')
    bubble.classList.toggle('is-last', index === lines().length - 1)
    clearTimeout(autoNext)
    if(index < lines().length - 1) autoNext = setTimeout(next, 4200)
  }
  const show = i =>{
    index = i
    const [expr, text] = lines()[index]
    full = text
    setExpression(expr)
    clearInterval(typing); clearTimeout(autoNext)
    if(reduce){ finish(); return }
    let n = 0
    textEl.textContent = ''
    bubble.classList.add('is-typing')
    typing = setInterval(()=>{
      n += 1
      textEl.textContent = full.slice(0, n)
      if(n >= full.length) finish()
    }, 28)
  }
  const next = ()=>{
    if(typing){ finish(); return }
    show((index + 1) % lines().length)
  }
  bubble.addEventListener('click', ()=>{ playSfx('tap2'); next() })
  const stage = document.getElementById('hero-liria-stage')
  if(stage) stage.addEventListener('click', ()=>{ playSfx('tap2'); next() })
  bubble.addEventListener('keydown', e =>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); next() } })
  document.addEventListener('growtale:langchange', ()=> show(index))
  // empieza cuando Liria está a la vista (en móvil queda debajo del texto de presentación)
  const start = ()=> setTimeout(()=> show(0), reduce ? 0 : 500)
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries =>{
      if(entries.some(e => e.isIntersecting)){ io.disconnect(); start() }
    }, { threshold: 0.6 })
    io.observe(bubble)
  }else start()
}

/* Enemigos: tarjetas desplegables con ataques y estrategia */
function initEnemyCards(){
  const toggles = Array.from(document.querySelectorAll('.enemy-toggle'))
  const label = btn => btn.querySelector('.enemy-toggle-text').textContent = t(btn.getAttribute('aria-expanded') === 'true' ? 'enemy_less' : 'enemy_more')
  toggles.forEach(btn =>{
    const panel = document.getElementById(btn.getAttribute('aria-controls'))
    btn.addEventListener('click', ()=>{
      const opening = btn.getAttribute('aria-expanded') !== 'true'
      btn.setAttribute('aria-expanded', opening ? 'true' : 'false')
      btn.closest('.enemy-card').classList.toggle('is-open', opening)
      label(btn)
      playSfx(opening ? 'modal-open' : 'modal-close')
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if(reduce || !panel.animate){ panel.hidden = !opening; return }
      if(opening){
        panel.hidden = false
        const h = panel.scrollHeight
        panel.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' })
      }else{
        const h = panel.scrollHeight
        const anim = panel.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'ease-in' })
        let done = false
        const end = ()=>{ if(done) return; done = true; if(btn.getAttribute('aria-expanded') !== 'true') panel.hidden = true }
        anim.onfinish = end
        setTimeout(end, 320)
      }
    })
  })
  document.addEventListener('growtale:langchange', ()=> toggles.forEach(label))
  toggles.forEach(label)
}

document.addEventListener('DOMContentLoaded', ()=>{
  initSfx()
  initLanguage()
  initMusic()
  initNav()
  initTeam()
  initEnemyCards()
  initCarousel()
  initLiriaSpeech()
  initHeroVisibility()
  initDocViewer()
  initLightbox()
  initContact()
  initParallax()
  initScreenTimeCounter()
  initCoverTransition()
  initWorldMap()
  initDailyChallenges()
  initTryIt()
  initBeforeAfter()
  initBackToCover()
})
