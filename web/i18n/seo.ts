import { locales } from "./routing";

const BASE = "https://cmux.com";
const DEFAULT_OG_IMAGE = `${BASE}/opengraph-image`;

const shortDescriptionSuffixes: Record<string, string> = {
  en: "Built for AI coding agents on macOS.",
  ja: "macOS の AI コーディングエージェント向けです。",
  "zh-CN": "面向 macOS 上的 AI 编码代理。",
  "zh-TW": "面向 macOS 上的 AI 程式碼代理。",
  ko: "macOS의 AI 코딩 에이전트를 위해 설계되었습니다.",
  de: "Für KI-Coding-Agenten auf macOS entwickelt.",
  es: "Creado para agentes de codificación con IA en macOS.",
  fr: "Conçu pour les agents de codage IA sur macOS.",
  it: "Creato per agenti di codifica IA su macOS.",
  da: "Bygget til AI-kodeagenter på macOS.",
  pl: "Stworzone dla agentów kodowania AI na macOS.",
  ru: "Создано для AI-агентов программирования на macOS.",
  bs: "Napravljeno za AI agente za kodiranje na macOS-u.",
  ar: "مصمم لوكلاء البرمجة بالذكاء الاصطناعي على macOS.",
  no: "Laget for AI-kodeagenter på macOS.",
  "pt-BR": "Criado para agentes de código com IA no macOS.",
  th: "สร้างมาเพื่อเอเจนต์เขียนโค้ด AI บน macOS.",
  tr: "macOS'taki AI kodlama ajanları için tasarlandı.",
  km: "បង្កើតសម្រាប់ភ្នាក់ងារ AI សរសេរកូដលើ macOS។",
  uk: "Створено для AI-агентів програмування на macOS.",
};

export const defaultOpenGraphImage = {
  url: DEFAULT_OG_IMAGE,
  width: 1200,
  height: 630,
  alt: "cmux - The terminal built for multitasking",
};

export function seoDescription(locale: string, description: string) {
  const trimmed = description.trim();
  if (trimmed.length >= 90) return trimmed;

  const suffix =
    shortDescriptionSuffixes[locale] ?? shortDescriptionSuffixes.en;
  if (trimmed.includes(suffix)) return trimmed;

  const separator =
    /[。！？.!?]$/.test(trimmed) || trimmed.endsWith("؟") ? " " : ". ";
  return `${trimmed}${separator}${suffix}`;
}

export function openGraphDefaults(type: "website" | "article" = "website") {
  return {
    siteName: "cmux",
    type,
    images: [defaultOpenGraphImage],
  };
}

export function twitterSummary(title: string, description: string) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: [DEFAULT_OG_IMAGE],
  };
}

export function canonicalUrl(locale: string, path: string) {
  return locale === "en" ? `${BASE}${path}` : `${BASE}/${locale}${path}`;
}

/**
 * Build the full alternates object (canonical + hreflang languages)
 * for a given locale and path. Use in every generateMetadata that
 * sets alternates so child metadata doesn't wipe parent hreflang.
 */
export function buildAlternates(
  locale: string,
  path: string,
  availableLocales: readonly string[] = locales,
) {
  const languages: Record<string, string> = {};
  for (const loc of availableLocales) {
    languages[loc] =
      loc === "en" ? `${BASE}${path}` : `${BASE}/${loc}${path}`;
  }
  languages["x-default"] = `${BASE}${path}`;

  const canonical = canonicalUrl(locale, path);

  return { canonical, languages };
}

export function buildAlternateLinkHeader(
  origin: string,
  path: string,
  availableLocales: readonly string[] = locales,
) {
  const entries = availableLocales.map((locale) => {
    const url = localizedUrl(origin, locale, path);
    return `<${url}>; rel="alternate"; hreflang="${locale}"`;
  });
  entries.push(
    `<${localizedUrl(origin, "en", path)}>; rel="alternate"; hreflang="x-default"`,
  );
  return entries.join(", ");
}

function localizedUrl(origin: string, locale: string, path: string) {
  const pathname = locale === "en" ? path : `/${locale}${path}`;
  return new URL(pathname, origin).toString();
}
