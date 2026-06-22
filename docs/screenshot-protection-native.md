# Protección contra capturas — plan del wrapper nativo

## Resumen

Bloquear capturas de pantalla **no es posible en un navegador**: ninguna API web puede
poner la captura en negro ni impedirla. La función "captura en negro" de apps como Nequi
solo existe porque son **apps nativas**. Para lograr lo mismo en BeadStudio hay que
empaquetar la web actual en una app nativa con **Capacitor** (reutiliza el mismo build de
Vite, sin reescribir nada).

| Plataforma | Captura en negro (tipo Nequi) | Marca de agua en la captura |
| --- | :---: | :---: |
| Web (Cloudflare, hoy) | ❌ imposible | ✅ ya implementado (editor + export) |
| App Android nativa | ✅ `FLAG_SECURE` | ✅ |
| App iOS nativa | ⚠️ solo detección (no bloqueo real) | ✅ |
| App escritorio (Electron/Tauri) | ✅ content-protection (Win/Mac) | ✅ |

> Ninguna protección evita una **foto con otra cámara**. El objetivo realista es frenar al
> 99% casual. La marca de agua (ya hecha) es la defensa para la web; el wrapper nativo añade
> la captura en negro en móvil.

## Defensa por capas (estado actual)

1. **Export con marca de agua** — footer con logo + retícula diagonal. ✅ Hecho.
2. **Editor con marca de agua** — retícula tenue sobre el lienzo en vivo, gateada por `pro`,
   para que cualquier captura web salga marcada. ✅ Hecho.
3. **Captura en negro nativa** — este documento. ⏳ Pendiente (proyecto aparte).

El flag `pro` del store es el único punto de control: hoy controla la marca de agua; mañana
lo controlará el paywall (y, si se quiere, el `FLAG_SECURE` nativo).

## Fase 1 — Empaquetar con Capacitor (Android primero)

```bash
npm i -D @capacitor/cli
npm i @capacitor/core @capacitor/android
npx cap init "BeadStudio" "app.beadstudio" --web-dir=dist
npm run build          # genera dist/
npx cap add android
npx cap sync android
npx cap open android    # abre Android Studio
```

`capacitor.config.ts` puede apuntar `server.url` a la web desplegada (carga en vivo) o
servir `dist/` empaquetado (offline). Para una app de tienda, lo normal es empaquetar `dist/`.

## Fase 2 — Captura en negro en Android (`FLAG_SECURE`)

Es una sola línea en la `MainActivity`. Las capturas y la grabación de pantalla salen en negro.

```java
// android/app/src/main/java/app/beadstudio/MainActivity.java
import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().setFlags(
      WindowManager.LayoutParams.FLAG_SECURE,
      WindowManager.LayoutParams.FLAG_SECURE
    );
  }
}
```

**Gating por plan:** si se quiere que solo el usuario **gratuito** tenga la pantalla
protegida (y el Pro pueda capturar libremente), exponer un plugin Capacitor mínimo
`setSecure(boolean)` que llame `getWindow().addFlags/clearFlags(FLAG_SECURE)` en runtime y
llamarlo desde el front según `store.pro`. Si la idea es "todos protegidos", basta la línea
del `onCreate`.

## Fase 3 — iOS (detección, no bloqueo)

iOS **no** permite bloquear capturas como Android. Solo se puede:

- **Detectar** captura: notificación `UIApplication.userDidTakeScreenshotNotification` →
  reaccionar (registrar evento, tapar el patrón un instante, avisar).
- **Grabación de pantalla**: observar `UIScreen.main.isCaptured` → ocultar/difuminar el
  lienzo mientras `isCaptured == true`.

Se implementa con un plugin Capacitor pequeño que emite eventos al front; el front decide
qué hacer (p. ej. mostrar un overlay con la marca o pausar el render).

## Fase 4 — Distribución

- **Android:** generar AAB firmado, cuenta Google Play Console (pago único ~25 USD), ficha
  de tienda, revisión.
- **iOS:** cuenta Apple Developer (99 USD/año), Xcode/macOS para compilar, App Store Review.
- **CI:** se puede automatizar el build nativo, pero requiere runners macOS para iOS.

## Esfuerzo estimado

| Fase | Esfuerzo | Resultado |
| --- | --- | --- |
| 1 — Capacitor + Android | ~0.5–1 día | App Android instalable del mismo código |
| 2 — `FLAG_SECURE` | ~1–2 h | Capturas en negro reales en Android |
| 3 — iOS detección | ~0.5 día + cuenta Apple | Detección de captura/grabación (parcial) |
| 4 — Tiendas | variable | Publicación + revisión |

## Recomendación

1. **Ahora:** la marca de agua (web) ya cubre el caso web; suficiente para el lanzamiento.
2. **Cuando exista tracción / el paywall:** Fases 1–2 (Android) dan el efecto Nequi con muy
   poco esfuerzo. iOS (Fase 3) es opcional y solo parcial.
3. No invertir en disuasivos web de teclado/clic derecho: son cosméticos y se saltan trivial.
