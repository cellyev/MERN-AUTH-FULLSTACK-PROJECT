const PhoneNumberInput = ({
  icon: Icon,
  phoneCode,
  setPhoneCode,
  phoneNumber,
  setPhoneNumber,
}) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-green-500" />
      </div>
      <div className="flex">
        <select
          value={phoneCode}
          onChange={(e) => setPhoneCode(e.target.value)}
          className="w-2/4 pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-l-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
        >
          <option value="+62">+62 (IDN)</option>
          <option value="+1">+1 (USA)</option>
          <option value="+91">+91 (IND)</option>
          <option value="+44">+44 (UK)</option>
          {/* Tambahkan opsi lainnya jika diperlukan */}
        </select>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          className="w-3/4 pl-3 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-r-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
        />
      </div>
    </div>
  );
};

export default PhoneNumberInput;
