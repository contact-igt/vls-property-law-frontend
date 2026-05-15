import { MetaTitle } from "@/common/Meta/MetaTitle";
import Banner from "@/component/banner";
import SocialProof from "@/component/socialProofStrip";
import FastFact from "@/component/fastfact";
import Promise from "@/component/promise";
import { HomePage } from "@/constants/Home";
import { useEffect, useRef, useState } from "react";
import Speaker from "@/component/speaker";
import Faculty from "@/component/faculty";
import FAQ from "@/component/faq";
import RegisterSticky from "@/common/RegisterSticky";
import WhoJoin from "@/component/whoJoin";
import WhyCourse from "@/component/whycourse";
import WhatLearn from "@/component/whatlearn";
import WhyVls from "@/component/whyvls";
import Testimonial from "@/component/testimonial";
import FinalCta from "@/component/finalcta";

const HomePageComponent = () => {
  const contactFormRef = useRef(null);
  const [ipid, setipid] = useState("");

  const scrollToContactForm = () => {
    contactFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getIpAddress = async () => {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    setipid(ipData.ip);
  };


  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("PaymentDetails");
    getIpAddress();
  }, []);

  return (
    <>
      <MetaTitle />

      <Banner
        bannerdata={HomePage?.hero_banner}
        contactFormRef={contactFormRef}
        ipName={ipid}
      />

      <SocialProof />

      <FastFact factdata={HomePage?.the_problem ?? HomePage?.fast_fact} />

      <WhyCourse scrollToContactForm={scrollToContactForm} />

      <Promise
        promisedata={HomePage?.promise}
        scrollToContactForm={scrollToContactForm}
      />

      <WhatLearn learndata={HomePage?.what_learn} />

      {/* <Speaker speakerdata={HomePage?.speaker} /> */}

      <Faculty facultydata={HomePage?.faculty} />

      <WhoJoin
        whojoindata={HomePage?.who_join}
        scrollToContactForm={scrollToContactForm}
      />

      <WhyVls
        whyvlsdata={HomePage?.whyvls}
        scrollToContactForm={scrollToContactForm}
      />

      <FAQ faqdata={HomePage?.faqs} />

      <RegisterSticky scrollToContactForm={scrollToContactForm} />

      <Testimonial scrollToContactForm={scrollToContactForm} />

      <FinalCta ipAddress={ipid} />
    </>
  );
};

export default HomePageComponent;
