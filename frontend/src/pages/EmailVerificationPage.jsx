import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { useCallback } from "react";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];
    const char = value.slice(0, 1).replace(/\D/g, "");

    newCode[index] = char;
    setCode(newCode);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const newCode = pastedData.slice(0, 6).split("");

    setCode(newCode.map((digit, i) => digit || code[i]));
    inputRefs.current[newCode.length - 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (!newCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      newCode[index] = "";
      setCode(newCode);
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const verificationCode = code.join("");
      try {
        await verifyEmail(verificationCode);
        navigate("/");
        toast.success("Email verified successfully!");
      } catch (error) {
        console.log(error);
      }
    },
    [code, verifyEmail, navigate]
  );

  useEffect(() => {
    if (code.every((digit) => digit !== "") && code.join("").length === 6) {
      handleSubmit(new Event("submit"));
    }
  }, [code, handleSubmit]);

  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onPaste={handlePaste}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <motion.button
            className={`w-full py-3 px-4 bg-gradient-to-r 
              from-green-500 to-emerald-600 text-white font-bold rounded-lg 
              shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none 
              focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 
              transition duration-200 ${
                code.every((digit) => digit) && code.join("").length === 6
                  ? "opacity-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={
              !code.every((digit) => digit) || code.join("").length !== 6
            }
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
