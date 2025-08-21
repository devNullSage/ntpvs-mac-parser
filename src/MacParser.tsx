import { useState, useMemo } from 'react';

const MacParser = () => {
  const [macAddress, setMacAddress] = useState('');
  const [copied, setCopied] = useState('');

  const parsedFormats = useMemo(() => {
    const cleanedMac = macAddress.replace(/[^0-9a-fA-F]/g, '');
    if (cleanedMac.length !== 12) {
      return null;
    }

    const upperMac = cleanedMac.toUpperCase();

    return {
      colon: upperMac.match(/.{1,2}/g)?.join(':'),
      hyphen: upperMac.match(/.{1,2}/g)?.join('-'),
      dot: `${upperMac.substring(0, 4)}.${upperMac.substring(4, 8)}.${upperMac.substring(8, 12)}`,
      lowerNoSeparator: cleanedMac.toLowerCase(),
      upperNoSeparator: upperMac,
    };
  }, [macAddress]);

  const handleMacAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMacAddress(event.target.value);
    setCopied('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  return (
    <div className="mac-parser">
      <h2>MAC Address Parser</h2>
      <input
        type="text"
        placeholder="Enter MAC address"
        value={macAddress}
        onChange={handleMacAddressChange}
      />
      {parsedFormats && (
        <div className="formats">
          <h3>Parsed Formats:</h3>
          <ul>
            {Object.values(parsedFormats).map((format) => (
              <li key={format} onClick={() => copyToClipboard(format!)}>
                {format}
                {copied === format && ' ✅'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MacParser;
