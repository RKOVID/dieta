'use strict';
// Lettore minimale di file .docx (zip) senza librerie esterne.
// Restituisce una lista di blocchi: {type:'p', text, style, list} | {type:'tbl', rows:[[righe cella]]}

const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

async function readDocx(buf) {
  const u8 = new Uint8Array(buf);
  const dv = new DataView(buf);
  let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('il file non è un documento Word (.docx)');
  const count = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  const dec = new TextDecoder();
  for (let n = 0; n < count; n++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break;
    const method = dv.getUint16(p + 10, true);
    const csize = dv.getUint32(p + 20, true);
    const nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true);
    const lho = dv.getUint32(p + 42, true);
    const name = dec.decode(u8.subarray(p + 46, p + 46 + nl));
    if (name === 'word/document.xml') {
      const start = lho + 30 + dv.getUint16(lho + 26, true) + dv.getUint16(lho + 28, true);
      const data = u8.subarray(start, start + csize);
      let out;
      if (method === 0) out = data;
      else if (method === 8) {
        const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        out = new Uint8Array(await new Response(stream).arrayBuffer());
      } else throw new Error('compressione non supportata');
      return parseDocXml(dec.decode(out));
    }
    p += 46 + nl + el + cl;
  }
  throw new Error('contenuto del documento non trovato');
}

function paraText(p) {
  let s = '';
  for (const n of p.getElementsByTagNameNS(W_NS, '*')) {
    if (n.localName === 't') s += n.textContent;
    else if (n.localName === 'tab' || n.localName === 'br' || n.localName === 'cr') s += ' ';
    else if (n.localName === 'noBreakHyphen') s += '-';
  }
  return s.replace(/ /g, ' ');
}

function kids(el, name) {
  return [...el.children].filter(c => c.localName === name);
}

function parseDocXml(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const body = doc.getElementsByTagNameNS(W_NS, 'body')[0];
  const blocks = [];
  const walk = parent => {
    for (const n of parent.children) {
      if (n.localName === 'p') {
        const pPr = kids(n, 'pPr')[0];
        const st = pPr && kids(pPr, 'pStyle')[0];
        blocks.push({
          type: 'p',
          text: paraText(n).trim(),
          style: st ? st.getAttributeNS(W_NS, 'val') || st.getAttribute('w:val') || '' : '',
          list: !!(pPr && kids(pPr, 'numPr').length),
        });
      } else if (n.localName === 'tbl') {
        const rows = kids(n, 'tr').map(tr =>
          kids(tr, 'tc').map(tc => kids(tc, 'p').map(paraText).map(s => s.trim()).filter(Boolean)));
        blocks.push({ type: 'tbl', rows });
      } else if (n.localName === 'sdt') {
        const c = kids(n, 'sdtContent')[0];
        if (c) walk(c);
      }
    }
  };
  if (body) walk(body);
  return blocks;
}
