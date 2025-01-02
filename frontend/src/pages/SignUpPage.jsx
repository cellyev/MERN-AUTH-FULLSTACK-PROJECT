import { motion } from "framer-motion";
import Input from "../components/Input";
import { useState } from "react";
import { User, Mail, Phone, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import { Loader } from "lucide-react";
import PhoneNumberInput from "../components/PhoneNumberInput";

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+62");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value !== password) {
      setErrorMessage("Passwords do not match!");
    } else {
      setErrorMessage("");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const fullPhoneNumber = `${phoneCode}${phoneNumber}`;
      await signup(
        firstName,
        lastName,
        email,
        fullPhoneNumber,
        password,
        confirmPassword
      );
      navigate("/verify-email");
    } catch (error) {
      console.error(error);
      // setErrorMessage(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            icon={User}
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PhoneNumberInput
            icon={Phone}
            phoneCode={phoneCode}
            setPhoneCode={setPhoneCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          />
          {errorMessage && (
            <p className="text-red-500 font-semibold mt-2">{errorMessage}</p>
          )}
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          <PasswordStrengthMeter password={password} />

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r 
          from-green-500 to-emerald-600 text-white font-bold rounded-lg 
          shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none 
          focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 
          transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className=" animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account? {""}
          <Link to={"/signin"} className="text-green-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
