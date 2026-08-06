import Head from "next/head";
import React from "react";
import { programConfig } from "@/constants/Home";

export const MetaTitle = ({ title, description, keywords, config = programConfig }) => {
  const activeConfig = config || programConfig;
  const defaultTitle = `${activeConfig?.name || "Property Law Career Masterclass"} – How Property Lawyers Build Practice | VLS LAW ACADEMY`;
  const defaultDescription =
    "A practical 3-hour live masterclass focused on property law practice in Tamil Nadu — documents, disputes, clients, and career pathways.";
  const defaultKeywords =
    "Law school gives you theory. We give you real courtroom practice. Whether you aim to become a judge, a practicing advocate, or a corporate lawyer — this course gives you the hands-on legal skills you need to start your career with clarity and confidence";

  return (
    <Head>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
    </Head>
  );
};
