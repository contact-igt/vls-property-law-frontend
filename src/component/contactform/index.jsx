"use client";

import Button from "@/common/Button";
import styles from "./styles.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Title from "@/common/Title";
import { HomePage } from "@/constants/Home";
import { useRouter } from "next/router";
import { useState } from "react";
import { Popup } from "@/common/Popup";
import { PropertyLawRegisterQuery } from "@/hooks/useAcademyTrainingQuery";

const ContactForm = ({
  ipAddress,
  formId = "contact_form",
  className = "",
}) => {
  const router = useRouter();
  const { mutate: registerMutate } = PropertyLawRegisterQuery();
  const [instructionOpen, setInstructionOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const getUTM = (key) => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(key) || "";
    } catch {
      return "";
    }
  };
  // ---------------- FORM ----------------
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      yearsOfPractice: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().matches(/^[a-zA-Z ]*$/, "Invalid name"),
      email: Yup.string()
        .required("Email required")
        .email("Enter valid email")
        .test(
          "lowercase",
          "Email must be lowercase",
          (v) => !v || v === v.toLowerCase(),
        ),
      mobile: Yup.string()
        .required("Mobile required")
        .matches(/^[0-9]{10}$/, "Invalid mobile number"),
      yearsOfPractice: Yup.string()
        .required("Years of practice required")
        .matches(/^[0-9]{1,2}$/, "Enter valid years"),
    }),

    onSubmit: (values) => {
      setFormValues(values);
      setAgree(false);
      setInstructionOpen(true);
    },
  });

  const openRazorpay = async () => {
    if (!formValues) return;

    const resp = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: HomePage?.razorpay?.amount }),
    });

    const order = await resp.json();

    if (!resp.ok) {
      router.replace("/error");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      // key: "rzp_test_Ss2NFtpJFLRAiw",
      amount: order.amount,
      currency: order.currency,
      name: formValues.name,
      order_id: order.id,
      description: `${HomePage?.razorpay?.title} — ₹${HomePage?.razorpay?.amount}`,
        notes: {
        name: formValues?.name || "",
        email: formValues?.email || "",
        mobile: formValues?.mobile || "",
        yearsOfPractice: formValues?.yearsOfPractice || "",
        programm_date: "2026-06-06",
        page_name: "property-law-masterclass",
        ip_address: ipAddress || "",
        utm_source: getUTM("utm_source") || "",
        utm_medium: getUTM("utm_medium") || "",
        utm_campaign: getUTM("utm_campaign") || "",
        utm_term: getUTM("utm_term") || "",
        utm_content: getUTM("utm_content") || "",
      },

      handler: async (response) => {
        if (!response?.razorpay_payment_id) {
          router.replace("/error");
          return;
        }

        setProcessing(true);

        const apiPayload = {
          name: formValues?.name || "",
          email: formValues?.email,
          mobile: `+91${formValues?.mobile}`,
          yearsOfPractice: formValues?.yearsOfPractice || "",
          amount: order?.amount / 100,
          programm_date: "2026-06-06",
          razorpay_order_id: response.razorpay_order_id || "",
          razorpay_payment_id: response.razorpay_payment_id || "",
          razorpay_signature: response.razorpay_signature || "",
          payment_status: "paid",
          page_name: "property-law-masterclass",
          ip_address: ipAddress || "",
          client_key: "vls_law",
          utm_source: getUTM("utm_source"),
          utm_medium: getUTM("utm_medium"),
          utm_campaign: getUTM("utm_campaign"),
          utm_term: getUTM("utm_term"),
          utm_content: getUTM("utm_content"),
        };

        // await handleWhatsappMessage(
        //   `91${formValues.mobile}`,
        //   formValues.name,
        //   HomePage?.razorpay?.amount,
        //   HomePage?.razorpay?.title,
        //   "June 6th, 2026",
        //   "Online (Live)",
        //   "June 6",
        // );


        await registerUserToDB(apiPayload);

        const params = new URLSearchParams();
        Object.keys(apiPayload).forEach((key) =>
          params.append(key, apiPayload[key] ?? ""),
        );
        await handleGoogleSheetForm(params);

        await safeSetPaymentDetails(apiPayload);
        router.replace("/thank-you");
      },

      prefill: {
        name: formValues.name,
        email: formValues.email,
        contact: formValues.mobile,
      },

      theme: { color: "#b20a0a" },
    };

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", () => {
      router.replace("/error");
    });

    razor.open();
  };

  const registerUserToDB = (payload) =>
    new Promise((resolve, reject) => {
      registerMutate(
        { value: payload },
        {
          onSuccess: resolve,
          onError: reject,
        },
      );
    });

  const handleWhatsappMessage = async (
    phone,
    name,
    amount,
    program,
    schedule,
    platform,
    date,
  ) => {
    await fetch("/api/sendWhatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        name,
        amount,
        programm_name: program,
        schedule,
        platform,
        link_date: date,
      }),
    });
  };

  const handleGoogleSheetForm = async (formData, retries = 3, delay = 1500) => {
    try {
      const res = await fetch(
"https://script.google.com/macros/s/AKfycbwk4JkO_Maiuad7Cbw2gOpcfR5PPbFzP1WCjgN8n3HZPx2kP5n1MoeB3X5pfiPafrWR/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        },
      );
      console.log(res);
      const text = await res.text();
      console.log("Google Sheet Response:", text);
      if (res.ok) {
        return true;
      } else {
        throw new Error("Sheet responded with non-OK");
      }
    } catch (err) {
      console.error(
        `Google Sheet attempt failed. Retries left: ${retries}, err `,
      );
      if (retries <= 1) {
        console.error("Google Sheet failed permanently!");
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      return handleGoogleSheetForm(formData, retries - 1, delay);
    }
  };

  const safeSetPaymentDetails = async (data) => {
    if (typeof window === "undefined") return;

    try {
      const safeData = JSON.stringify(data);
      localStorage.setItem("PaymentDetails", safeData);
    } catch (error) {
      console.error("Failed to store PaymentDetails:", error);
    }
  };

  // ---------------- UI ----------------
  return (
    <>
      <div className={`${styles?.formcardbottom} ${className}`} id={formId}>
        <form
          id="contactForm"
          className="contact-form"
          onSubmit={formik.handleSubmit}
        >
          <div className={styles.formtitle}>
              <Title
                title1={"Register"}
                spantitle={"Now"}
                subtitle={`( Get Your Legal — Career Roadmap )`}
              />
            </div>
            {/* <div className={styles.chipWrap}>
              <div className={styles.chip}>Early Access Enrollment</div>
              <div className={styles.smallText}>Limited seats available</div>
            </div> */}

            <div className={styles.inputgrp}>
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Full name"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <small style={{ fontSize: "12px" }}>{formik.errors.name}</small>
              )}
            </div>

            <div className={styles.inputgrp}>
              <label>
                Email<span>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Email address"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <small style={{ fontSize: "12px" }}>{formik.errors.email}</small>
              )}
            </div>

            <div className={styles.inputgrp}>
              <label>
                Mobile Number<span>*</span>
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className={`${styles.inputmobile} form-control `}
                  placeholder="Mobile number"
                  {...formik.getFieldProps("mobile")}
                />
                <input
                  className={`${styles.inputmobilecode} form-control position-absolute`}
                  readOnly
                  value={"+91"}
                />
              </div>
              {formik.touched.mobile && formik.errors.mobile && (
                <small style={{ fontSize: "12px" }}>{formik.errors.mobile}</small>
              )}
            </div>

            <div className={styles.inputgrp}>
              <label>Years of Practice</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 0, 1, 5"
                {...formik.getFieldProps("yearsOfPractice")}
              />
              {formik.touched.yearsOfPractice && formik.errors.yearsOfPractice && (
                <small style={{ fontSize: "12px" }}>{formik.errors.yearsOfPractice}</small>
              )}
            </div>

            {/* <div className={`mt-3 mb-2`}>
              <div className={styles.seatBar}>Seats filling fast</div>
            </div> */}

            <div className={`mt-4 d-md-flex justify-content-center`}>
              <Button
                name={`Claim My Seat for ₹${HomePage?.razorpay?.amount}`}
                type={"submit"}
                icon={"arrow-right"}
                iconPosition={"right"}
              />
            </div>

            <div className={`mt-3 d-flex justify-content-center`}>
              <p className={styles.bottomNote}>🔒 Secure Access</p>
            </div>
        </form>
      </div>

      <Popup open={instructionOpen} onClose={() => setInstructionOpen(false)}>
        <div className={styles.loadingPopup}>
          <h4>⚠️ Important Payment Instruction</h4>

          <h6>
            After completing the payment, please wait until you are redirected
            to the success page. Do not close or refresh this page.
          </h6>

          <p className="text-danger fw-semibold mt-2">
            If you close or refresh this page during payment, your registration
            details may not be recorded.
          </p>

          <div className="form-check mt-3 d-flex justify-content-center gap-2">
            <input
              type="checkbox"
              className="form-check-input custom-red-checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              id="agree"
            />
            <label
              className="form-check-label text-danger fw-bold"
              htmlFor="agree"
              style={{ fontSize: "14px", marginTop: "2px" }}
            >
              I understand and agree.
            </label>
          </div>

          <div
            className={`d-flex flex-md-row flex-column flex-column-reverse gap-3 mt-4 ${styles.instructionbtn}`}
          >
            <button
              className="btn btn-secondary"
              onClick={() => setInstructionOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              disabled={!agree}
              onClick={() => {
                setInstructionOpen(false);
                openRazorpay();
              }}
            >
              I Agree & Pay
            </button>
          </div>
        </div>
      </Popup>

      {/* ⏳ Processing Popup */}
      <Popup open={processing} onClose={() => setProcessing(false)}>
        <div className={styles.loadingPopup}>
          <h4>⏳ Processing Payment</h4>
          <p>Please wait. Do not close or refresh this page.</p>
        </div>
      </Popup>
    </>
  );
};

export default ContactForm;
