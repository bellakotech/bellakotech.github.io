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
  nav_impact: 'Impact',
  nav_game: 'Game',
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
  block_game_sub: 'Discover the mechanics, challenges and universe that turn disconnection into progress.',
  block_project_title: 'PROJECT & INVESTMENT',
  block_project_sub: 'Learn about the development status, the opportunity and the team behind GrowTale.',
  // problema
  problem_title: 'The problem',
  problem_subtitle: 'Getting our attention back has become a daily challenge.',
  problem_p1: 'Phones are part of our everyday life, but constant interruptions make it harder to study, focus, rest and make time for other activities.',
  problem_p2: 'Many tools show us how much we use our phone. However, knowing the problem is not always enough to change our habits.',
  screen_time_label: 'Screen time today',
  problem_highlight: 'GrowTale turns that challenge into an adventure',
  // validación
  validation_title: 'Professional validation',
  validation_seal: '✅ Independent professional assessment',
  validation_wellbeing_title: '🧘 Digital wellbeing',
  validation_wellbeing_text: 'Reduces passive phone use through positive reinforcement mechanics',
  validation_ethics_title: '🌱 Ethical design',
  validation_ethics_text: 'No artificial addiction or systems designed to create dependency',
  validation_potential_title: '🚀 Application potential',
  validation_potential_education: 'Education',
  validation_potential_prevention: 'Psychosocial prevention',
  validation_quote: '“GrowTale presents an innovative and socially relevant proposal within digital wellbeing and psychosocial prevention.”',
  validation_author: 'Independent professional assessment from the field of Social Work.',
  validation_download: '📄 Download full report',
  // cómo funciona
  how_title: 'How it works',
  how_lead: 'Turn less time on distracting apps into progress in GrowTale.',
  how_step1_title: '🎲 Choose your challenge',
  how_step1_text: 'Pick the apps you want to avoid and set your goals.',
  how_step1_alt: 'GrowTale screen for choosing challenges',
  how_step2_title: '🎯 Spend time on what matters',
  how_step2_text: 'Complete real challenges and earn resources to move forward.',
  how_step2_alt: 'GrowTale screen showing an active challenge',
  how_step3_title: '🌱 Grow your world',
  how_step3_text: 'Unlock new areas and grow your adventure.',
  how_step3_alt: 'GrowTale screen showing the world growing',
  // producto
  product_title: 'Product',
  gallery_title: 'Gallery',
  gallery_skills: 'Skills',
  gallery_skills_alt: 'GrowTale skills screen',
  gallery_combat: 'Combat',
  gallery_combat_alt: 'GrowTale combat screen',
  gallery_character: 'Character',
  gallery_character_alt: 'GrowTale character screen',
  challenges_title: 'Daily challenges',
  challenge1_title: '30-minute focus',
  challenge1_text: 'Avoid distracting apps for 30 minutes and earn seeds.',
  challenge1_badge: 'Daily challenge',
  challenge1_reward: 'Reward: Seeds',
  challenge2_title: 'Outdoor walk',
  challenge2_text: 'Spend 20 minutes away from your phone and unlock a map area.',
  challenge2_badge: 'Wellbeing challenge',
  challenge2_reward: 'Reward: Region unlock',
  challenge3_title: 'Learning',
  challenge3_text: 'Complete a study or reading goal.',
  challenge3_badge: 'Learning challenge',
  challenge3_reward: 'Reward: Book of power',
  // universo
  universe_title: 'The GrowTale universe',
  map_title: 'World map',
  map_text: 'Explore regions and discover unique challenges.',
  map_alt: 'GrowTale world map',
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
  market_schools_title: '🏫 Schools and parent associations',
  market_schools_text: 'Programmes to work on focus, digital wellbeing and healthy habits.',
  market_families_title: '👨‍👩‍👧 Families',
  market_families_text: 'Positive tools to support healthy technology use.',
  market_users_title: '👩 Individual users',
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
  contact_write: '✉️ Write to us',
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
    music_on: 'Desactivar música',
    music_off: 'Activar música',
    view_profile: 'Ver perfil completo',
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
    music_on: 'Turn music off',
    music_off: 'Turn music on',
    view_profile: 'View full profile',
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
    } else {
      enabled = false
      storage.set(MUSIC_KEY, 'off')
      audio.pause()
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
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return
      links.forEach(l=>{
        const active = l.getAttribute('href') === '#' + en.target.id
        l.classList.toggle('active', active)
        if(active) l.setAttribute('aria-current', 'true')
        else l.removeAttribute('aria-current')
      })
    })
  }, { rootMargin: '-40% 0px -55% 0px' })
  sections.forEach(s=> obs.observe(s))
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
      const expanded = btn.closest('.member-card').classList.toggle('expanded')
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false')
      sync(btn)
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
  }
  const close = ()=>{
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
  }
  // Cierre animado: la clase "closing" reproduce la salida y después se cierra de verdad
  const close = ()=>{
    if(!dialog.open || dialog.classList.contains('closing')) return
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
    if(!form.reportValidity()) return

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
  if(!el || prefersReducedMotion()) return
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

document.addEventListener('DOMContentLoaded', ()=>{
  initLanguage()
  initMusic()
  initNav()
  initTeam()
  initLightbox()
  initContact()
  initParallax()
  initScreenTimeCounter()
  initCoverTransition()
  initBackToCover()
})
