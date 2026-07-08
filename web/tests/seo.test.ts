import { describe, expect, test } from "bun:test";
import {
  buildAlternates,
  canonicalUrl,
  openGraphDefaults,
  seoDescription,
  twitterSummary,
} from "../i18n/seo";

describe("SEO metadata helpers", () => {
  test("keeps canonical URLs locale-aware", () => {
    expect(canonicalUrl("en", "/docs")).toBe("https://cmux.com/docs");
    expect(canonicalUrl("ja", "/docs")).toBe("https://cmux.com/ja/docs");
    expect(buildAlternates("ja", "/docs").canonical).toBe(
      "https://cmux.com/ja/docs",
    );
  });

  test("extends short descriptions with localized product context", () => {
    expect(seoDescription("en", "CLI reference")).toBe(
      "CLI reference. Built for AI coding agents on macOS.",
    );
    expect(seoDescription("ja", "CLI リファレンス。")).toContain(
      "macOS の AI コーディングエージェント向けです。",
    );
    expect(
      seoDescription(
        "en",
        "A detailed page about running multiple coding agents in cmux on macOS.",
      ),
    ).toContain("Built for AI coding agents on macOS.");
  });

  test("adds complete shared social metadata", () => {
    expect(openGraphDefaults("article")).toEqual({
      siteName: "cmux",
      type: "article",
      images: [
        {
          url: "https://cmux.com/opengraph-image",
          width: 1200,
          height: 630,
          alt: "cmux - The terminal built for multitasking",
        },
      ],
    });
    expect(twitterSummary("Title", "Description")).toEqual({
      card: "summary_large_image",
      title: "Title",
      description: "Description",
      images: ["https://cmux.com/opengraph-image"],
    });
  });
});
