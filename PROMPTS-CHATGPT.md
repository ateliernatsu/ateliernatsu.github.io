# Prompts para ChatGPT · Ilustraciones del libro del Atelier

La web es un **libro mágico apoyado en un escritorio**: al tocarlo se levanta, se pone en el centro y se abre. El libro, sus páginas y los post-its los dibuja la web.
Con ChatGPT solo hace falta el **fondo del escritorio** (de día y de noche) y, si quieres, la tapa, los emblemas y la mascota.

Guarda cada imagen en `img/` con el nombre indicado y escríbelo en `IMAGENES`, dentro de `js/datos.js`.
Consejo: pide **.png con fondo transparente** para emblemas y mascota, y **.webp o .jpg** para los fondos (pesan menos).

---

## 0 · Bloque de estilo (pégalo primero)
```
Vamos a crear ilustraciones para la web de una hermandad de World of Warcraft: Forever llamada "El Atelier Natsu" (el taller de verano). Estilo común:
- Ilustración pintada a mano, acogedora, entre libro ilustrado y fantasía cálida (tipo Ghibli / cozy game), con luz suave y partículas de polvo brillante.
- Tema: el escritorio de un taller mágico de artesanos con un toque japonés de verano (farolillos de papel, furin, flores de verano).
- Paleta: madera cálida, rosa #d0578a y #f2a7c4, ciruela #5a2a5e, dorado #ecc77f, crema #f6ecd8, verde musgo #6f9a6a.
- Sin texto, sin letras, sin logotipos de Blizzard ni personajes oficiales reconocibles.
Confirma que lo has entendido y espera a mis peticiones.
```

## 1 · Escritorio de día (atardecer) → `img/escritorio-dia.webp` · 1920×1080
```
Ilustración pintada a mano, muy acogedora, de un escritorio de madera junto a una ventana al atardecer, vista frontal y algo elevada. La luz dorada entra por la ventana en HACES DE LUZ diagonales que cruzan la escena, con motas de polvo brillando en el aire. Por la ventana se ven árboles y un cielo rosado y miel.
Sobre la mesa, SOLO EN LOS LADOS: a la izquierda un tarro de cristal con ramas de bayas rosas, un vaso de té con luz atravesándolo y una regadera con flores amarillas y rosas; a la derecha unas plantas en sombra, unos libros apilados y un tintero con pluma rosa. Algunas bayas sueltas caídas sobre la mesa.
MUY IMPORTANTE: deja el CENTRO y la zona central-inferior de la mesa VACÍOS y despejados, con la luz cayendo justo ahí: encima colocaremos un libro mágico. No dibujes ningún libro en el centro. Sin texto. Formato horizontal 16:9.
```

## 2 · Escritorio de noche → `img/escritorio-noche.webp` · 1920×1080
```
Exactamente la MISMA escena, el mismo encuadre y los mismos objetos que la imagen anterior, pero de noche: por la ventana se ve un cielo ciruela y azul con estrellas y luna, entra un haz de luz de luna suave y azulado, hay una vela encendida que ilumina la mesa con luz cálida, farolillos de papel encendidos colgando y luciérnagas flotando. Mantén el CENTRO de la mesa VACÍO. Sin texto. Horizontal 16:9.
```
> Truco: pídele "la misma escena" para que al cambiar de día a noche no salte la composición.

> Puedes adjuntarle a ChatGPT tus imágenes de referencia y decirle «quiero este estilo y este ambiente, pero sin libro en el centro y con estos objetos». No uses tal cual ilustraciones de otros artistas en la web: pídele una propia inspirada en ellas.

## 2b · Tapa del libro (opcional) → `img/tapa.webp` · 800×1200 (vertical)
```
Tapa frontal de un libro mágico antiguo vista totalmente de frente y plana (sin perspectiva), que ocupe toda la imagen: cuero burdeos-ciruela con relieves y filigranas doradas, un rosetón dorado en el centro en forma de estrella de cuatro puntas con un farolillo de papel rosa, esquinas metálicas doradas. Deja libre el tercio inferior para poner el título encima. Sin texto.
```

## 3 · Emblemas de rango (opcional) · 512×512, fondo transparente
```
Seis emblemas circulares a juego, estilo insignia pintada con marco dorado, mismo tamaño, fondo transparente, sin texto:
1. Visitante de Verano (img/rango-visitante.png): un brote 🌱, tono verde claro.
2. Aprendiz (img/rango-aprendiz.png): una paleta de pintor 🎨, verde.
3. Artesano (img/rango-artesano.png): un martillo de artesano 🔨, turquesa.
4. Artífice (img/rango-artifice.png): dos espadas cruzadas ⚔️, lila.
5. Guardián del Atelier (img/rango-guardian.png): una llama protegida por dos manos 🔥, coral.
6. Maestra del Atelier (img/rango-maestra.png): una corona sobre un farolillo encendido 👑, dorado.
```

## 4 · La mascota chibi → `img/chibi-maestra.webp`
Ahora uso un recorte de tu imagen «Primeros pasos». Para que quede perfecta, pídele a ChatGPT **la misma chibi de cuerpo entero, sola, con fondo transparente (PNG)** y sustituye el archivo.

## 5 · Logo / sello (opcional) → `img/logo.png` · 512×512, transparente
```
Sello circular de lacre rosa con un farolillo de papel en relieve y pequeñas estrellas doradas, sin texto, fondo transparente.
```

---

### Cómo queda en `js/datos.js`
```js
const IMAGENES = {
  escritorioDia:   "img/escritorio-dia.webp",
  escritorioNoche: "img/escritorio-noche.webp",
  tapa: "img/tapa.webp",
  logo: "",
  rangos: {
    visitante: "img/rango-visitante.png", aprendiz: "img/rango-aprendiz.png",
    artesano:  "img/rango-artesano.png",  artifice: "img/rango-artifice.png",
    guardian:  "img/rango-guardian.png",  maestra:  "img/rango-maestra.png"
  },
  chibi: "img/chibi-maestra.webp"
};
```
