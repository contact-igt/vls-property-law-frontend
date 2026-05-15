import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";

const WHATSAPP_URL = "https://wa.me/919500025216";

const WhatsAppFloat = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <a
      className={styles.whatsappFloat}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
    >
      <div className={styles.whatsappicon}>
        <Image
          src="/assets/home/whatsapp.png"
          width={60}
          height={60}
          alt="whatsapp-logo"
        />
      </div>
    </a>
  );
};

export default WhatsAppFloat;
