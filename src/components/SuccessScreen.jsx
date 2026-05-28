import React from "react";
import { Button } from "antd";

export function SuccessScreen() {
  return (
    <div
      style={{
        fontFamily: "Fraunces,Georgia,serif",
        textAlign: "center",
        padding: "20px",
        animation: "bounceIn .45s cubic-bezier(.34,1.56,.64,1)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#ECFDF5,#D1FAE5)",
          border: "2px solid #6EE7B7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: 32,
        }}
      >
        ✅
      </div>

      <h2
        style={{
          fontFamily: "Fraunces,Georgia,serif",
          fontSize: 18,
          fontWeight: 600,
          color: "#1E293B",
          marginBottom: 8,
        }}
      >
        Application submitted!
      </h2>
      <div>
        <p className="mb-4 text-xl font-bold">Thank You for Participating</p>
        <p className="text-base text-gray-600">
          Your task has been completed successfully. Thank you for taking part
          in this research study. Your participation helps improve adaptive
          interface design for users experiencing cognitive load.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-left">
        <h2 className="text-xl font-bold text-slate-900">
          Continue to the Survey
        </h2>

        <p className="mt-3 text-base leading-7 text-slate-700">
          Please continue to the Google Form to complete the survey about your
          experience using this prototype application.
        </p>
        
      </div>

      <p className="text-gray-500 mt-5">
        Once again, thank you for your time and contribution.
      </p>
    </div>
  );
}
