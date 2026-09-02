# Preset-Buttons — Kurzanleitung

Diese Anleitung beschreibt, wie die **Presets** dieses Moduls funktionieren: Latch-Buttons, Displays, Rotary-Encoder und **Local Variables**.

> Geräte-Setup, Polling und OSC-Ports: [`companion/HELP.md`](../companion/HELP.md)

---

## Preset-Typen

| Typ | Verhalten | Farbe / Text |
|-----|-----------|--------------|
| **Latch (2-Step)** | 1. Druck = an (z. B. Mute), 2. Druck = aus | Grau = aus, Farbe = an (Mute rot, Delay orange, …) |
| **All-Button** | Mute/Unmute **alle** Kanäle | Grau = alle aus, Farbe = alle an, **Gelb + ≠** = gemischt |
| **Momentary** | Ein Druck führt die Action aus (z. B. Gain setzen) | — |
| **Display** | Kein Druck nötig — Button zeigt Live-Wert per Feedback | Schwarzer Hintergrund, grüner/weißer Text |
| **Inc / Dec** | Kurzer Druck: Wert ± Schrittweite | Grau, ohne Feedback |
| **Rotary** | Stream Deck **Plus**-Drehencoder: links/rechts = Dec/Inc | Lila Hintergrund; **halten** = grobe Schritte |

Presets mit **„EXAMPLE“** im Namen sind Vorlagen: ein Button pro Kanal/Parameter — Kanalnummer über **Local Variables** steuern, Button duplizieren für weitere Kanäle.

---

## Local Variables (`$(local:…)`)

Viele Example-Presets nutzen **Button-lokale Variablen**, damit **ein** Preset für **beliebige** Kanäle reicht.

### So einstellen

1. Preset auf den Button ziehen  
2. Button auswählen → **Local Variables** (oder im Button-Editor)  
3. Variable setzen, z. B. `matrixinput` = `5` für Matrix Input 5  

### Typische Variablen

| Variable | Bedeutung | Beispiel-Presets |
|----------|-----------|------------------|
| `matrixinput` | Matrix-Input 1…128 | In Mute, Gain, Delay, … |
| `matrixoutput` | Matrix-Output 1…64 | Out Mute, Gain, … |
| `functiongroup` | Function Group 1…32 | SOR Mute/Gain |
| `soundobject` | Sound Object 1…N | SOR Mute/Gain |
| `zone` | En-Space Zone 1…4 | Reverb Input Gain |

Button-Text und Actions verwenden Ausdrücke wie `$(local:matrixinput)` — beim Druck wird **immer der aktuelle Local-Variable-Wert** an die DS100 geschickt.

### Duplizieren für mehrere Kanäle

1. Example-Button platzieren, Local Variable setzen (z. B. Input 1)  
2. Button **duplizieren**  
3. Am Duplikat nur die Local Variable ändern (z. B. Input 2)  
4. Actions und Feedbacks müssen **nicht** einzeln angepasst werden  

---

## Latch-Buttons (Mute, Delay, EQ, Polarity)

- **Step 1:** Parameter **ein** (Mute an, Delay an, …)  
- **Step 2:** Parameter **aus**  
- **Feedback** zeigt den echten Gerätestatus (rot/orange/blau/gelb bei Mute/Delay/EQ/Pol).  

**All-Buttons** (`In ALL Mute`, …):

- Alle Kanäle gleich **aus** → grau  
- Alle gleich **an** → Aktivfarbe (z. B. rot)  
- **Gemischt** → gelb, Text: `In ALL Mute` + `≠`  

Polling muss aktiv sein, damit Änderungen an der DS100 (R1) im Companion sichtbar werden — siehe HELP.md (Port 50011 frei halten).

---

## Display-Buttons

Display-Presets haben **keine** Druck-Action (nur Feedback). Sie zeigen Live-Werte:

| Preset | Anzeige |
|--------|---------|
| Display Gain / Delay | Aktueller dB- oder ms-Wert |
| Display Input Name | Kanalname der gewählten Input-Nummer |
| Display Scene | Szenennummer / Name |
| Display Room Id | En-Space-Raumname (+ Foto bei Räumen 1–9) |
| Special En-Space Send | Send Gain des **gewählten** Matrix Inputs |

**Wichtig:** Display-Buttons brauchen das passende **Feedback** (ist im Preset enthalten) **und** bei subscribed polling eine **Action** auf demselben Button *oder* ein anderes Preset, das den OSC-Pfad abonniert. Example-Latch-Buttons abonnieren automatisch über ihre Set-Action.

Schwarzer Hintergrund = Display-Stil; Wert kommt vom Gerät, nicht vom Button-Text.

---

## Inc / Dec (+ / −)

- Grauer Button, kurzer Druck  
- Schrittweite steht in der **Action-Option** (z. B. Gain ±0,5 dB, Delay ±0,5 ms)  
- Kein Feedback — nur zum Hoch-/Runterregeln  

Paare: `… Inc` und `… Dec` gehören zusammen.

---

## Rotary (Stream Deck Plus Encoder)

Rotary-Presets sind für **Elgato Stream Deck Plus** (Drehencoder):

| Aktion | Effekt |
|--------|--------|
| **Drehen rechts** | Increase-Action (feiner Schritt) |
| **Drehen links** | Decrease-Action (feiner Schritt) |
| **Encoder gedrückt halten + drehen** | **Grobe** Schritte (z. B. Gain ±6 dB, Delay ±10 ms, Input-Auswahl ±10) |

Technisch: Beim Drücken des Encoders läuft `pressRotaryEncoder`, beim Loslassen `releaseRotaryEncoder`. Solange gedrückt, wählen Increase/Decrease-Actions die größere Schrittweite.

**Special Presets — Input Rotary:** Drehen wählt Matrix Input ±1 (halten = ±10). Der gewählte Input gilt **modulweit** für alle Special En-Space-Buttons (Send, Name, Zones).

Rotary-Buttons haben **kein** Feedback (Encoder hat keine Anzeige auf dem Gerät). Status siehst du auf den **Display**-Buttons daneben.

---

## Special Presets (En-Space Input Bank)

Gemeinsamer **Matrix Input** für die ganze Bank (Variable `special_enspace_input` im Modul, gesteuert über Input Inc/Dec/Rotary):

| Preset | Funktion |
|--------|----------|
| Input − / + / Rotary | Matrix Input wählen (1…128) |
| Display Input Name | Name des gewählten Inputs |
| Display Send Gain | Reverb Send des gewählten Inputs |
| Send − / + / Rotary | Send Gain ± (Standard 0,5 dB; halten = 6 dB) |
| All In EnSp −120 | Alle Inputs Send auf −120 dB |
| Zone 1…4 | Zone Gain toggeln (−120 ↔ 0 dB); nur **eine** Zone kann 0 sein |
| All Zones All In −120 | Alles auf −120 |

Zonen-Farben im Feedback: aus = schwarz, Z1 blau, Z2 weiß, Z3 rot, Z4 dunkelgrün; Text grün.

---

## Farben (R1-Nähe)

| Parameter | Aktiv |
|-----------|-------|
| Mute | Rot |
| Delay | Orange |
| EQ | Blau |
| Polarity | Gelb |
| Inaktiv / aus | Grau (#878787) |
| All gemischt | Gelb + ≠ |
| Display | Schwarz |
| Rotary | Magenta |

---

## Checkliste nach dem Platzieren

1. **Connection:** Polling an, Matrix-Größe (S/L/XL) passend, OSC **50011** nicht belegt  
2. **Example-Presets:** Local Variables prüfen  
3. **Displays:** Feedback sichtbar? Sonst Polling / Action auf dem Button prüfen  
4. **All-Buttons:** Nach Modul-Update Preset ggf. **neu** platzieren  
5. **Rotary:** Nur auf Stream Deck **Plus**-Encoder-Keys legen  

---

## Version

Stand: Modul **2.0.0-beta.15.39** — Preset-Struktur kann sich in späteren Betas leicht ändern.
