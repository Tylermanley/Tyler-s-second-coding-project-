// ============================================================
//  Chrono Grove — animated anime-style character portraits (SVG)
//  Expressions: neutral, smile, happy, blush, surprised, sad, determined, smirk
// ============================================================

let _pid = 0;

const CHAR_STYLE = {
  anna: {
    skin: '#fde3d0', shade: '#f0c2a8', hair: '#9a4a2f', hairDark: '#6b2c1b', hairShine: '#e09372',
    irisTop: '#1d5638', irisBot: '#6fd49a', brow: '#6b2c1b', defaultExpr: 'smile',
  },
  cedric: {
    skin: '#f3c9a3', shade: '#dfa67f', hair: '#262a42', hairDark: '#14162a', hairShine: '#5c6690',
    irisTop: '#7a3e0a', irisBot: '#f5b53a', brow: '#14162a', defaultExpr: 'smirk', narrow: true,
  },
  hero: {
    skin: '#fbe0cc', shade: '#ecbfa3', hair: '#6a4428', hairDark: '#45291a', hairShine: '#b07a4e',
    irisTop: '#1d3f8a', irisBot: '#74b8ff', brow: '#45291a', defaultExpr: 'determined',
  },
};

const EMOTES = { happy: '♪', blush: '💗', surprised: '❗', sad: '💧', determined: '🔥', smirk: '✦' };

function eyeSVG(cx, cy, flip, st, id, expr) {
  if (expr === 'happy') {
    return `<g transform="translate(${cx} ${cy})"><path d="M-12 3 Q1 -10 14 3" transform="scale(${flip} 1)" fill="none" stroke="#2a1a1a" stroke-width="3.4" stroke-linecap="round"/></g>`;
  }
  const clip = `pc${id}${flip > 0 ? 'r' : 'l'}`;
  const sclera = 'M-12 0 Q-6 -13 6 -12 Q13 -10 14 -3 Q13 10 2 13 Q-10 12 -12 0 Z';
  const sy = st.narrow ? 0.82 : 1;
  const irisR = expr === 'surprised' ? 0.8 : 1;
  return `
  <g transform="translate(${cx} ${cy}) scale(1 ${sy})">
    <g class="eye-open">
      <defs>
        <clipPath id="${clip}"><path d="${sclera}" transform="scale(${flip} 1)"/></clipPath>
        <linearGradient id="g${clip}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${st.irisTop}"/><stop offset="1" stop-color="${st.irisBot}"/></linearGradient>
      </defs>
      <path d="${sclera}" transform="scale(${flip} 1)" fill="#fff"/>
      <g clip-path="url(#${clip})">
        <ellipse cx="${flip}" cy="1" rx="${8.5 * irisR}" ry="${11.5 * irisR}" fill="url(#g${clip})"/>
        <ellipse cx="${flip}" cy="1" rx="${8.5 * irisR}" ry="${11.5 * irisR}" fill="none" stroke="${st.irisTop}" stroke-width="1.3"/>
        <ellipse cx="${flip}" cy="2.5" rx="${4 * irisR}" ry="${6 * irisR}" fill="#120c18"/>
        <path d="M-16 -14 L16 -14 L16 -6 Q1 -10 -16 -4Z" fill="rgba(0,0,0,.2)"/>
      </g>
      <circle cx="${-3.5}" cy="-3" r="3.4" fill="#fff"/>
      <circle cx="${3.5}" cy="6" r="1.6" fill="#fff" opacity=".9"/>
      <g transform="scale(${flip} 1)">
        <path d="M-13 -1 Q-6 -15 6 -13.5 Q13 -12 16 -4" fill="none" stroke="#2a1a1a" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M14 -6 L19.5 -9.5" stroke="#2a1a1a" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M-6 12 Q3 15 10 10" fill="none" stroke="#2a1a1a" stroke-width="1.1" opacity=".55"/>
      </g>
    </g>
  </g>`;
}

function browSVG(cx, cy, flip, st, expr) {
  const d = {
    sad: 'M-11 -27 Q1 -26 13 -21',
    determined: 'M-11 -19 Q1 -23 13 -27',
    surprised: 'M-11 -28 Q1 -33 13 -28',
    smirk: flip > 0 ? 'M-11 -24 Q1 -29 13 -25' : 'M-11 -21 Q1 -24 13 -22',
  }[expr] || 'M-11 -23 Q1 -27 13 -23';
  return `<g transform="translate(${cx} ${cy}) scale(${flip} 1)"><path d="${d}" fill="none" stroke="${st.brow}" stroke-width="2.4" stroke-linecap="round"/></g>`;
}

function mouthSVG(expr) {
  const line = d => `<path d="${d}" fill="none" stroke="#9a4a3a" stroke-width="2" stroke-linecap="round"/>`;
  const shut = {
    neutral: line('M94 141 Q100 143 106 141'),
    smile: line('M92 139 Q100 146 108 139'),
    blush: line('M94 140 Q100 144 106 140'),
    smirk: line('M93 142 Q102 144 109 137'),
    determined: line('M94 142 L106 141'),
    sad: line('M94 144 Q100 139 106 144'),
    surprised: '<ellipse cx="100" cy="142" rx="3.6" ry="4.6" fill="#7a2a2a"/>',
    happy: '<path d="M91 137 Q100 153 109 137 Z" fill="#7a2a2a"/><path d="M95 145 Q100 141 105 145 Q100 151 95 145Z" fill="#ec7a80"/>',
  }[expr] || line('M94 141 Q100 143 106 141');
  return `<g class="mouth"><g class="m-shut">${shut}</g><g class="m-open"><path d="M94 139 Q100 137 106 139 Q105 148 100 148 Q95 148 94 139Z" fill="#7a2a2a"/><path d="M96 145 Q100 143 104 145 Q100 148 96 145Z" fill="#ec7a80"/></g></g>`;
}

function blushSVG(expr) {
  const strong = expr === 'blush' || expr === 'happy';
  const op = strong ? 0.6 : 0.22;
  const hatch = strong
    ? `<g stroke="#e0607e" stroke-width="1.2" stroke-linecap="round" opacity=".8">
        <path d="M71 125 l-3 5 M76 125 l-3 5 M81 125 l-3 5"/><path d="M121 125 l-3 5 M126 125 l-3 5 M131 125 l-3 5"/></g>` : '';
  return `<g class="blush"><ellipse cx="77" cy="128" rx="10" ry="5" fill="#ff8fa3" opacity="${op}"/><ellipse cx="123" cy="128" rx="10" ry="5" fill="#ff8fa3" opacity="${op}"/>${hatch}</g>`;
}

const FACE_PATH = 'M60 92 Q59 128 78 149 Q92 163 100 164 Q108 163 122 149 Q141 128 140 92 Q140 48 100 46 Q60 48 60 92Z';

function charParts(id, st) {
  if (id === 'anna') {
    return {
      back: `<path d="M56 80 Q50 34 100 28 Q150 34 144 80 Q152 140 160 205 Q150 222 132 214 Q140 170 128 150 L72 150 Q60 170 68 214 Q50 222 40 205 Q48 140 56 80Z" fill="${st.hair}"/>
             <path d="M64 120 Q60 170 70 210" stroke="${st.hairDark}" stroke-width="2" fill="none" opacity=".5"/><path d="M136 120 Q140 170 130 210" stroke="${st.hairDark}" stroke-width="2" fill="none" opacity=".5"/>`,
      body: `<path d="M28 240 Q30 196 70 186 L88 180 L112 180 L130 186 Q170 196 172 240Z" fill="#3c8c86"/>
             <path d="M70 186 Q60 210 64 240 M130 186 Q140 210 136 240" stroke="#2b6b66" stroke-width="2" fill="none"/>
             <path d="M86 179 L100 214 L114 179 L106 177 L100 192 L94 177Z" fill="#fffaf2"/>
             <path d="M88 184 L78 192 L88 196Z M112 184 L122 192 L112 196Z" fill="#fffaf2" stroke="#ddd" stroke-width=".8"/>
             <path d="M100 186 L88 180 L88 194Z" fill="#d6454f"/><path d="M100 186 L112 180 L112 194Z" fill="#d6454f"/>
             <circle cx="100" cy="187" r="3.5" fill="#b8323d"/>
             <circle cx="82" cy="222" r="2.5" fill="#e8d9a8"/><circle cx="118" cy="222" r="2.5" fill="#e8d9a8"/>`,
      side: `<path d="M62 88 Q53 130 60 178 Q66 170 71 160 Q64 128 70 96Z" fill="${st.hair}"/><path d="M138 88 Q147 130 140 178 Q134 170 129 160 Q136 128 130 96Z" fill="${st.hair}"/>`,
      front: `<path d="M57 96 Q52 40 100 36 Q148 40 143 96 L136 78 L131 93 L121 66 L113 90 L102 62 L94 88 L84 66 L76 91 L66 76 L62 96Z" fill="${st.hair}"/>
              <path d="M84 66 L80 84 M121 66 L124 84 M102 62 L101 80" stroke="${st.hairDark}" stroke-width="1.5" opacity=".5"/>`,
      shine: `<path d="M68 58 Q100 42 132 58 Q100 50 68 63Z" fill="${st.hairShine}" opacity=".75"/>`,
      acc: `<g fill="rgba(210,235,255,.18)" stroke="#6b4a2a" stroke-width="2.2"><circle cx="80" cy="109" r="16"/><circle cx="120" cy="109" r="16"/></g>
            <path d="M96 106 Q100 102 104 106" stroke="#6b4a2a" stroke-width="2" fill="none"/>
            <path d="M70 100 L76 96 M110 100 L116 96" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
            <g transform="translate(134 60)"><circle r="7" fill="#ffb3c7"/><circle r="3" fill="#ffe27a"/><circle cx="-6" cy="5" r="5" fill="#ff9ab5"/></g>`,
    };
  }
  if (id === 'cedric') {
    return {
      back: `<path d="M58 86 Q54 40 100 34 Q146 40 142 86 Q147 114 141 136 L133 126 L131 144 L121 130 L79 130 L69 144 L67 126 L59 136 Q53 114 58 86Z" fill="${st.hair}"/>`,
      body: `<path d="M24 240 Q28 194 68 184 L88 178 L112 178 L132 184 Q172 194 176 240Z" fill="#1f2d5a"/>
             <path d="M88 178 L96 240 M112 178 L104 240" stroke="#e3b341" stroke-width="3"/>
             <path d="M90 178 Q100 194 110 178 L107 200 Q100 208 93 200Z" fill="#fff"/>
             <g fill="#e3b341"><ellipse cx="50" cy="194" rx="16" ry="7"/><ellipse cx="150" cy="194" rx="16" ry="7"/>
             <circle cx="84" cy="216" r="3"/><circle cx="116" cy="216" r="3"/><circle cx="86" cy="232" r="3"/><circle cx="114" cy="232" r="3"/></g>
             <path d="M38 198 l-2 10 M44 200 l-1 10 M50 201 l0 10 M56 200 l1 10 M62 198 l2 10 M138 198 l-2 10 M144 200 l-1 10 M150 201 l0 10 M156 200 l1 10 M162 198 l2 10" stroke="#e3b341" stroke-width="1.6"/>`,
      side: `<path d="M61 92 Q57 118 62 136 L68 124 Q64 108 67 96Z" fill="${st.hair}"/><path d="M139 92 Q143 118 138 136 L132 124 Q136 108 133 96Z" fill="${st.hair}"/>`,
      front: `<path d="M58 98 Q54 52 100 46 Q146 52 142 98 L135 82 L129 98 L119 72 L111 95 L100 68 L91 94 L82 74 L73 99 L66 84Z" fill="${st.hair}"/>
              <path d="M100 68 L96 86 M119 72 L122 88" stroke="${st.hairDark}" stroke-width="1.5" opacity=".6"/>`,
      shine: `<path d="M74 62 Q100 54 126 62 Q100 58 74 66Z" fill="${st.hairShine}" opacity=".8"/>`,
      acc: `<path d="M56 68 Q60 22 100 16 Q140 22 144 68Z" fill="#1a2140"/>
            <path d="M28 72 Q100 40 172 72 Q162 84 140 72 Q100 58 60 72 Q38 84 28 72Z" fill="#121831" stroke="#e3b341" stroke-width="2.5"/>
            <path d="M58 62 Q100 50 142 62" stroke="#e3b341" stroke-width="3" fill="none"/>
            <g transform="translate(100 40)" fill="#e3b341"><path d="M0 -9 L2.6 -3 L9 -3 L4 1 L6 8 L0 4 L-6 8 L-4 1 L-9 -3 L-2.6 -3Z"/></g>
            <circle cx="58" cy="120" r="2.8" fill="none" stroke="#e3b341" stroke-width="1.8"/>
            <path d="M126 125 L134 119" stroke="#c98a6a" stroke-width="1.8" stroke-linecap="round"/>`,
    };
  }
  // hero
  return {
    back: `<path d="M58 88 Q54 40 100 34 Q146 40 142 88 Q144 118 136 138 L64 138 Q56 118 58 88Z" fill="${st.hair}"/>`,
    body: `<path d="M26 240 Q30 196 68 186 L132 186 Q170 196 174 240Z" fill="#8a5a32"/>
           <path d="M68 186 L84 240 M132 186 L116 240" stroke="#6b4223" stroke-width="3"/>
           <path d="M78 176 Q100 192 122 176 L126 193 Q100 207 74 193Z" fill="#c8453a"/>
           <path d="M110 194 L122 232 L131 228 L120 192Z" fill="#a8352c"/>
           <circle cx="70" cy="214" r="5" fill="#d9a441"/><circle cx="70" cy="214" r="2.2" fill="#fff4c9"/>`,
    side: `<path d="M61 92 Q57 118 63 138 L69 124 Q65 108 68 96Z" fill="${st.hair}"/><path d="M139 92 Q143 118 137 138 L131 124 Q135 108 132 96Z" fill="${st.hair}"/>`,
    front: `<path d="M58 98 Q55 46 100 40 Q145 46 142 98 L135 82 L128 96 L120 70 L110 92 L101 66 L92 91 L82 70 L74 96 L66 80Z" fill="${st.hair}"/>
            <path d="M102 41 Q94 16 116 10 Q104 24 109 41Z" fill="${st.hair}"/>`,
    shine: `<path d="M70 60 Q100 48 130 60 Q100 54 70 64Z" fill="${st.hairShine}" opacity=".8"/>`,
    acc: `<path d="M57 66 Q100 50 143 66 L143 75 Q100 60 57 75Z" fill="#5a3a20"/>
          <g stroke="#c9a043" stroke-width="3"><circle cx="83" cy="64" r="10" fill="#8fd3ff"/><circle cx="117" cy="64" r="10" fill="#8fd3ff"/></g>
          <path d="M78 59 L82 56 M112 59 L116 56" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  };
}

// opts: { talking, crop: 'head' | 'bust' | undefined, cls }
function portraitSVG(id, expr, opts = {}) {
  const st = CHAR_STYLE[id];
  expr = expr || st.defaultExpr;
  const n = ++_pid;
  const p = charParts(id, st);
  const vb = opts.crop === 'head' ? '48 22 104 118' : opts.crop === 'bust' ? '20 10 160 230' : '0 0 200 240';
  const emote = EMOTES[expr] ? `<span class="emote">${EMOTES[expr]}</span>` : '';
  return `<div class="portrait expr-${expr} char-${id} ${opts.talking ? 'talking' : ''} ${opts.cls || ''}">
  <svg viewBox="${vb}" class="portrait-svg" aria-label="${id}">
    <g class="fig">
      <g class="tilt">${p.back}</g>
      <path d="M88 148 L88 184 L112 184 L112 148Z" fill="${st.skin}"/>
      <path d="M88 152 Q100 168 112 152 L112 162 Q100 174 88 162Z" fill="${st.shade}"/>
      ${p.body}
      <g class="tilt">
        <ellipse cx="59" cy="110" rx="5.5" ry="9" fill="${st.skin}"/><ellipse cx="141" cy="110" rx="5.5" ry="9" fill="${st.skin}"/>
        <path d="${FACE_PATH}" fill="${st.skin}"/>
        <path d="M62 100 Q66 70 100 66 Q80 76 74 100Z" fill="${st.shade}" opacity=".35"/>
        ${blushSVG(expr)}
        ${eyeSVG(80, 108, -1, st, n, expr)}
        ${eyeSVG(120, 108, 1, st, n, expr)}
        <path d="M101 123 L99 129 L102.5 129" fill="none" stroke="${st.shade}" stroke-width="1.4" stroke-linecap="round"/>
        ${mouthSVG(expr)}
        <g class="sway-side">${p.side}</g>
        ${p.front}
        ${p.shine}
        ${browSVG(80, 108, -1, st, expr)}
        ${browSVG(120, 108, 1, st, expr)}
        ${p.acc}
      </g>
    </g>
  </svg>${emote}
  <span class="sparkle s1">✦</span><span class="sparkle s2">✧</span><span class="sparkle s3">✦</span>
</div>`;
}
