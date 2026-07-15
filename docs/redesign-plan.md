# Redesign Plan — "Clean Pop" (glass → clean + neon glow)

สถานะ: **Implemented 2026-07-16** — เก็บไว้เป็นบันทึกการ migrate; ค่า canonical ปัจจุบันอยู่ใน `design-spec.md`

## 0. ทิศทาง

เลิกภาษา Liquid Glass ทั้งหมด (blur, tint, highlight streak, ambient blobs) แล้วแทนด้วย:

- **พื้นผิวแบนทึบ** + hairline border — เงียบ สะอาด ทั้งแอป
- **เงา neutral เบาๆ** สำหรับ elevation ปกติ (cards, popovers)
- **Neon glow สี accent** เป็น signature — ปรากฏเฉพาะจุด pop 5 จุดเท่านั้น
- **Accent ใหม่: gradient ม่วง→ชมพู "Neon Orchid"** แทนเขียว forest ทั้งระบบ

กติกาเดิม "accent is functional only" ยังอยู่ และขยายเป็น: *gradient/glow คือส่วนขยายของ accent — ใช้ได้เฉพาะจุดที่ accent ใช้ได้*. กติกา no-hover (ยกเว้น dense list rows) คงเดิมทุกประการ

## 1. Palette ใหม่ — Neon Orchid

| ชื่อ | ค่า | ใช้ทำอะไร |
|---|---|---|
| `--pop-a` | `#a855f7` (ม่วง) | ปลาย gradient ด้านเริ่ม |
| `--pop-b` | `#ec4899` (ชมพู) | ปลาย gradient ด้านจบ |
| `--grad-pop` | `linear-gradient(135deg, var(--pop-a), var(--pop-b))` | พื้นหลังจุด pop (ปุ่ม play, active chip, progress fill) |
| `--accent-solid` (light) | `#c026d3` (fuchsia-600) | บริบทสีเดียว: icon toggled, ring, text-accent, `--spice-accent` |
| `--accent-solid` (dark) | `#e879f9` (fuchsia-400) | เวอร์ชันสว่างขึ้นบนพื้นดำ |
| `--glow-core` | `#d946ef` (fuchsia-500) | สีของเงา glow ทุกตัว (box-shadow เป็น gradient ไม่ได้ — ใช้สีกลางของ gradient แทน) |
| พื้นหลัง | `#fafafa` / `#0a0a0a` แบนสนิท | ไม่มี gradient/blob — พื้นสะอาดทำให้ glow เด้ง |

ทางเลือก "Sunset" (ถ้าอยากลอง): แก้แค่ `--pop-a: #f97316`, `--glow-core: #f43f5e` — ทุกอย่างที่เหลือไหลตาม token เอง

ข้อจำกัดที่รู้ล่วงหน้า:
- `box-shadow` เป็น gradient ไม่ได้ → glow ใช้ `--glow-core` สีเดียว (ตากลืนกับ gradient ได้สนิทเพราะเป็นสีกลาง)
- ข้อความ/ไอคอนสี accent บนพื้นสว่างต้องใช้ `#c026d3` ขึ้นไป (เข้มพอสำหรับ contrast) — ห้ามใช้ `#ec4899` เป็นสีตัวหนังสือบน `#fafafa`

## 2. Token layer ใหม่ (user.css §1)

### ลบทิ้ง

- `--glass-blur-1..5`, `--glass-sat-1..5` (ทั้งสเกล)
- `--glass-overlay-tint`, `--glass-border`, `--glass-highlight`, `--glass-shadow`, `--glass-ink*` (ทั้งกลุ่ม)
- `--ambient-gradient`, `--ambient-lavender-tint`, `--ambient-blob-lavender`, `--ambient-blob-green`
- `--surface-input/chip/modal/popover/panel` แบบโปร่งแสง → เหลือ solid เท่านั้น (ความโปร่งแสงมีไว้เพื่อ blur ซึ่งไม่มีแล้ว)
- `--noise-svg`
- `--color-accent: #16a34a`, `--color-accent-hover` (แทนด้วยชุด Orchid)

### เพิ่มใหม่

```css
:root {
  /* Pop accent — Neon Orchid */
  --pop-a: #a855f7;
  --pop-b: #ec4899;
  --grad-pop: linear-gradient(135deg, var(--pop-a), var(--pop-b));
  --glow-core: #d946ef;
  --accent-solid: #c026d3;                 /* dark scheme override: #e879f9 */
  --accent-ink: #ffffff;                   /* ตัวหนังสือบน gradient */
  --accent-a12: color-mix(in srgb, var(--accent-solid) 12%, transparent);
  --accent-a28: color-mix(in srgb, var(--accent-solid) 28%, transparent);

  /* Elevation — 3 ระดับแทน glass 5 ระดับ */
  --shadow-lift: 0 2px 12px rgba(17, 17, 17, 0.07);        /* cards, dropdowns */
  --shadow-float: 0 10px 32px rgba(17, 17, 17, 0.12);      /* player bar, modal */
  --glow-pop: 0 6px 20px color-mix(in srgb, var(--glow-core) 45%, transparent);
  --glow-pop-wide: 0 12px 44px color-mix(in srgb, var(--glow-core) 28%, transparent);
  --glow-ring: 0 0 0 2px var(--accent-solid),
               0 0 16px color-mix(in srgb, var(--glow-core) 35%, transparent);

  /* Surfaces — ทึบล้วน */
  --surface: var(--spice-card, #ffffff);
  --surface-bg: var(--spice-main, #fafafa);
  --hairline: var(--spice-contour, #ececec);
  --row-hover: color-mix(in srgb, var(--spice-text, #111) 5%, transparent);
}
html[data-scheme="dark"] {
  --accent-solid: #e879f9;
  --shadow-lift: 0 2px 12px rgba(0, 0, 0, 0.5);
  --shadow-float: 0 10px 32px rgba(0, 0, 0, 0.6);
  /* glow ค่าเดิมใช้ได้เลย — สีสดบนพื้นดำยิ่งเด้ง */
}
```

Radius scale + motion tokens คงเดิมทั้งหมด (pill/โค้งมนเข้ากับ neon glow ดีอยู่แล้ว)

## 3. จุด Pop — 5 จุดเท่านั้น ที่เหลือ neutral ล้วน

1. **ปุ่ม play หลัก** — พื้น `--grad-pop`, icon ขาว, `--glow-pop`; `:active` scale 0.96
2. **Player bar ลอย (signature)** — พื้นทึบ `--surface` + `--shadow-float` + `--glow-pop-wide` จางๆ ซ้อน และ **เส้น hairline gradient 1px ที่ขอบบน** (ทำด้วย `::before` สูง 1px พื้น `--grad-pop`) — จุดจี๊ดที่แพงแต่เงียบ
3. **Progress bar** — fill เป็น `--grad-pop`, handle มี glow เล็ก; volume ใช้ `--accent-solid` เฉยๆ (ลดความดัง)
4. **Active chip / tab / selected state** — พื้น `--grad-pop` + ตัวหนังสือขาว + glow สั้น; chip ปกติ = พื้นทึบ + hairline ไม่มีเงา
5. **Focus ring (search + คีย์บอร์ดทุกจุด)** — `--glow-ring` แทน glass focus เดิม

Toggled icons (heart/shuffle/repeat) ใช้ `--accent-solid` สีเดียว ไม่มี glow — เป็น accent ชั้นสอง

## 4. แผนไล่ section ใน user.css

| Section เดิม | ทำอะไร |
|---|---|
| §1 Tokens | เขียนใหม่ตามข้อ 2 |
| §2 Ambient/Base | **ลบ blob rules ทั้งหมด** → เหลือ `background: var(--surface-bg)` แบนเดียว |
| Nav bar / Right sidebar | ตัด backdrop-filter + glass border → พื้นทึบ, คั่นด้วย hairline; sidebar panel ได้ `--shadow-lift` เมื่อลอย |
| Playing bar | ตาม Pop จุด 2; ลบ shimmer streak `::after` เดิม, `::before` เปลี่ยนหน้าที่เป็นเส้น gradient ขอบบน |
| Topbar search | pill พื้นทึบ + hairline; focus = `--glow-ring`; ไอคอน hover-accent เดิมเปลี่ยนเป็น focus-accent (คงกติกา no-hover) |
| Search modal | การ์ดทึบ + `--shadow-float`; **ลบ accent blob เคลื่อนไหวใน dialog**; overlay เป็น scrim ทึบบางๆ (`rgba(0,0,0,.3)`) ไม่ blur |
| Dropdown | พื้นทึบ + `--shadow-lift` |
| Buttons / Player controls | tertiary = neutral เดิม; play หลัก = Pop จุด 1; hit areas คงเดิม |
| Progress & volume | Pop จุด 3; rail โค้งเดิม; **gog gif อยู่ต่อ** |
| Cards | พื้นทึบ + hairline, `--shadow-lift` เฉพาะ interactive card; ไม่มี glow |
| List rows | `--row-hover` เดิมคงไว้ (D1); selected = `--accent-a12` + ตัวหนังสือ `--accent-solid` |
| Chips / tabs | Pop จุด 4 |
| Context menus | พื้นทึบ + `--shadow-lift`; keyboard-current cue เดิมคงไว้ |
| Lyrics | ลบ glass ทับพื้น → พื้นแบน; active line = `--accent-solid` สว่าง; radial glow หลัง active line **เปลี่ยนสีเป็น `--glow-core`** และเบาลง (เป็นจุด pop โบนัสที่มีอยู่แล้ว ไม่นับเพิ่ม) |

## 5. theme.js

- **ลบ IIFE ที่ 2 ทั้งก้อน** (ambient blob injector + `<div class="spice-ambient-blob-*">`)
- คง class injector (`spice-glass-topbar/dialog/inputWrap/overlay`) — CSS ยังต้องใช้ hook พวกนี้อยู่ แม้จะไม่ glass แล้ว → **rename ทีหลังเป็น `spice-pop-*`** ใน commit แยก (ลดความเสี่ยง apply แตก) หรือคงชื่อเดิมพร้อม comment ว่าเป็น legacy name
- คง data-scheme stamping (dark override ยังใช้)

## 6. color.ini

ทั้งสอง scheme แก้เฉพาะแถว accent-เกี่ยว:

```ini
[suudLorLight]                       [suudLorDark]
button             = c026d3          button             = e879f9
button-active      = d946ef          button-active      = f0a5fb
accent             = c026d3          accent             = e879f9
notification       = c026d3          notification       = e879f9
player-bar-bg      = d946ef          player-bar-bg      = d946ef
player-bar-shadow  = f5d0fe          player-bar-shadow  = 0a0a0a
notif-bubble-info  = fdf4ff          notif-bubble-info  = 1c1c1e
```

แถว neutral (main/text/card/…) คงเดิมทั้งหมด — ฐาน platinum/ดำของเดิมดีอยู่แล้ว

## 7. docs

- `docs/design-spec.md` — rewrite §4.1 (accent ramp → Orchid + gradient rules), §4.3 (ตัด glass chrome), §4.4 (elevation = เงา 3 ระดับ), §6 (ambient → flat); กติกา states/hover (§5) คงเดิม
- `CLAUDE.md` — อัปเดตหมวด "Glass Effect Pattern" → "Pop Elevation Pattern"

## 8. ลำดับ commit

1. `refactor(css)!: replace glass elevation with flat surfaces + shadow scale` (tokens + ทุก section, ยังเขียวเดิม)
2. `feat(css): switch accent to Neon Orchid gradient` (+ color.ini)
3. `refactor(theme): remove ambient blob injector`
4. `docs: rewrite design spec for Clean Pop`

แยกขั้น 1/2 เพื่อให้ debug ง่าย: ถ้า layout เพี้ยนรู้ว่ามาจากโครง ไม่ใช่สี

## 9. Verify (ทั้ง 2 scheme หลัง `spicetify apply`)

- ไม่มี `backdrop-filter` เหลือ (grep = 0 hits) และไม่มี `#16a34a`/`16a34a` เหลือ
- ปุ่ม play: gradient + glow, active chip: gradient, progress fill: gradient
- Focus ring ม่วงชมพูทำงานที่ topbar search + modal + chips
- Player bar: เส้น gradient ขอบบน + เงาลอย, อ่าน metadata ชัด
- Lyrics: พื้นแบน อ่านง่าย glow สีใหม่
- Light scheme: ตัวหนังสือ accent ทุกจุดเป็น `#c026d3` ไม่ใช่ชมพูอ่อน (contrast)
- Reduced motion: ไม่มี animation ใหม่ที่ต้อง gate (blob เดิมที่ gate ไว้ถูกลบไปแล้ว)
