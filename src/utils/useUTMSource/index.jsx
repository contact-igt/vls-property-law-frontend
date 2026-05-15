import { useEffect } from "react";

export default function useUTMSource() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const params = new URLSearchParams(window.location.search);

      let utmData = {
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        utm_term: params.get("utm_term"),
        utm_content: params.get("utm_content"),
      };

      const utmMap = {
        fb: "facebook.com",
        ig: "instagram.com",
        yt: "youtube.com",
        li: "linkedin.com",
        tw: "twitter.com",
        gads: "google.com",
      };

      // Handle utm_source
      if (utmData.utm_source) {
        const mapped =
          utmMap[utmData.utm_source.toLowerCase()] || utmData.utm_source;
        utmData.utm_source = mapped;
      } else {
        const referrer = document.referrer || "";

        if (referrer) {
          try {
            const hostname = new URL(referrer).hostname.replace(/^www\./, "");
            utmData.utm_source = hostname;
          } catch {
            utmData.utm_source = "direct";
          }
        } else {
          utmData.utm_source = "direct";
        }
      }

      // Direct traffic handling
      if (
        utmData.utm_source === "direct" ||
        utmData.utm_source.includes("localhost") ||
        utmData.utm_source.includes("127.0.0.1")
      ) {
        utmData = {
          utm_source: "direct",
          utm_medium: "none",
          utm_campaign: "none",
          utm_term: "none",
          utm_content: "none",
        };
      } else {
        Object.keys(utmData).forEach((key) => {
          if (utmData[key] == null) utmData[key] = "";
        });
      }

      // Safe localStorage write
      Object.entries(utmData).forEach(([key, value]) => {
        try {
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, value);
          }
        } catch (e) {
          console.warn("localStorage blocked:", e);
        }
      });
    } catch (error) {
      // Final fallback (safe)
      try {
        localStorage.setItem("utm_source", "direct");
        localStorage.setItem("utm_medium", "none");
        localStorage.setItem("utm_campaign", "none");
        localStorage.setItem("utm_term", "none");
        localStorage.setItem("utm_content", "none");
      } catch {
        // do nothing – avoid crash
      }
    }
  }, []);
}
