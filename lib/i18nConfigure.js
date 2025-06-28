import { I18n } from "i18n";
import path from "node:path";

const i18n = new I18n({
  locales: ["en", "es"],
  directory: path.join(import.meta.dirname, "..", "locales"),
  defaultLocale: "en",
  autoReload: true, //watch for changes in JSON files to reload locales on updates
  syncFiles: true, //si creo un literal de idioma el solo lo va a crear en todos los ficheros de idioma
  cookie: "nodeapp-locale",
});

export default i18n;
