---
marp: true
theme: gaia
size: 16:9
paginate: true
math: mathjax
---

# <div style='position:absolute;top:40px;left:40px;font-size: 100px;'>**Voice**</div>

# <div style='position:absolute;top:0px;left:940px;font-size: 240px;'>**QL**</div>


![ bg](./images/wordcloud.png)

<!--
footer: "<sub><sub><sub>Voice-QL - Talk to your Database - Frank Börncke - www.boerncke.de</sub></sub></sub>"
-->

---

## <center>Worum geht es?</center>

<center>

$$\\[20pt]$$

*„Voice-QL ermöglicht die Kommunikation mit einer Tabelle oder Datenbank in natürlicher Sprache.“*

</center>

<!-- backgroundImage: "linear-gradient(to bottom, #EFEFEF, #FFFFFF)" -->

---

## <center>Hintergrund</center>

$$\\[3pt]$$

- Frank Börncke

- Sprachverarbeitung und NLP (neudeutsch *„Voice“* )

- Systeme, die mit natürlicher Sprache bedient werden

$$\\[0pt]$$

- Kein Bildschirm, keine Tastatur, keine Maus, kein Touch

- Für viele Menschen ist das Alltag

---

## <center>Warum mache ich das?</center>

<center>

$$\\[3pt]$$

Brücken bauen und Barrieren aus dem Weg räumen macht Spaß

$$\\[3pt]$$

Die Idee hatte ich schon länger in der Schublade

$$\\[3pt]$$

Mit der Unterstützung vom Prototype Fund hatte ich die Möglichkeit, mich nun länger diesem Thema zu widmen.
</center>

---

## <center>Tabellen erscheinen einfach</center>

Tabellen sind ein **einfach** zu verstehendes Konzept:

   - Zeilen
   - Spalten
   - Zellen

Wir alle nutzen Tabellen: Datenbanken, Open/Libre Office, Excel

Auch **Open Data** verwendet Tabellen. Einheitliche Standardformate existieren nicht. Das erschwert Navigation und Orientierung.

---

## <center>Tabellen sind kompliziert
</center>

<center>

$$\\[10pt]$$

Tabellen versprechen **Struktur und Ordnung**

$$\\[10pt]$$

Aber was wir vorfinden, ist häufig ein **komplexes Durcheinander**
</center>

---

## <center>Warum ist das so?</center>

<center>

$$\\[3pt]$$

Es ist **leicht**, Daten in Tabellen zu gießen

$$\\[3pt]$$

Es ist **schwer**, Informationen aus Tabellen zu extrahieren

$$\\[3pt]$$

Wird das zu einer **Einbahnstraße**, dann schaffen wir **Datenfriedhöfe**
</center>

---

## <center>Ursachen</center>

$$\\[5pt]$$

<center>

Tabellen sind eben **kein** einfach zu verstehendes Konzept

Inhalte oft umfangreich (Ergebnisse leider auch)

Uneinheitlicher Formate / Strukturen (siehe **Open Data**)

Nicht jeder beherrscht Excel oder Abfragesprachen wie SQL
</center>

---

## <center>Wo führt das alles hin?</center>

$$\\[1pt]$$

<center>

Tabellen sind implizit barrierebehaftet!

Bei technischen Neuentwicklungen werden Fragen der Zugänglichkeit oft nicht berücksichtigt oder mitgedacht. 

Wo das passiert, da kann Fortschritt zur Ausgrenzung führen. 

Dagegen müssen wir was tun!</center>

---

## <center>Voice-QL: sprich mit Deiner Datenbank</center>

Können wir mit einem Sprach-Assistenten über eine Tabelle reden?

    "Was ist der größte Wert in der Spalte Einwohnerzahl?"

Können wir sogar direkt mit einer Tabelle sprechen?

    "Wie heißen Deine Spaltennamen?"
    "Erzähle mir was über Dich!"

Darum geht es bei Voice-QL.

---

## <center>Herausforderungen an das System</center>

$$\\[10pt]$$

<center>
Intention des Nutzers erkennen

$$\\[7pt]$$

Passende Information aus der Datenbank holen

$$\\[7pt]$$

Ergebnisse mit Sprache präsentieren
</center>

---

## <center>Intention des Nutzers erkennen</center>

- Was interessiert den Anwender? `"Summe berechnen"`

- Auf welche(n) Tabelle / Zeile / Spalte / Bereich bezieht er sich?
  `"Zeige mir die Summe der Werte aus der Spalte Verkauf"`

- Ist ein Filter definiert?
  `"Mich interessieren nur Daten aus dem Jahr 2018"`

Ein **Context** merkt sich frühere Entscheidungen des Benutzers. 

**Fehlertoleranz**: Informationen werden im **Dialog** eingesammelt. 


---

## <center>Datenbankabfrage  (SQL)</center>

Datenbank-Zugriff sollte trivial sein. Aber die reale Welt ist gemein:

- Schreibweisen: `Zwölf`, `zwoelf` vs. `12`

- Verschiedene Begriffe klingen gleich: `Ja` vs. `Jahr`

- Kryptische Spaltennamen: `X19Q3`

- Datenqualität: `<div style = 'color:green;'>grün</div>` (Markup)

---

## <center>Ergebnisse vorlesen</center>

- Ergebnisse können (sehr) lang und umfangreich sein. 
  Einfach alles vorlesen ist nicht praktikabel.

- Lösung: **Cursorkonzept** mit Sprachnavigation
  `"Lies die aktuelle Zeile"`
  `"Gehe in die erste / letzte / nächste ... Zeile"`

$$\\[1pt]$$

- Inhalte wie&nbsp;  `true, false, null, #nbsp;, "", ...` machen Arbeit

---

## <center>Voice-QL</center>

1. Metadaten & DB auswerten
2. Code generieren:
  - trainierbare Sprachmodelle
  - Voice-App-Prototypen:
    - Voice-Applikationen
    - Webanwendung
    - Chatbot

![w:530 bg right](./images/flow.svg)

---

## <center>Ausblick - Ist das die Zukunft?</center>

Für jede Tabelle eine eigene Anwendung? Sicher nicht.

- **Multimodalität**: klassische UI mit ergänzendem Sprachassistent

Voraussetzung:

- Inhalte **barrierearm** aufbereiten: Struktur und Datenqualität

- Von Anfang an die **Tools** des Nutzers mitdenken

Wenn das gelingt, kann jeder Nutzer von Voice-QL profitieren.

---

## <center>Fragen und Antworten</center>

<center>

![w:900 ](./images/wordcloud.png)

</center>

<!-- _backgroundColor: white -->
