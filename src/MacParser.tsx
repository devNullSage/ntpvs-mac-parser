import { useState, useMemo } from 'react';

const MacParser = () => {
  const [macAddress, setMacAddress] = useState('');
  const [flashingItem, setFlashingItem] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const parsedFormats = useMemo(() => {
    if (!macAddress.trim()) {
      setIsValid(null);
      return null;
    }

    const cleanedMac = macAddress.replace(/[^0-9a-fA-F]/g, '');
    
    if (cleanedMac.length !== 12) {
      setIsValid(false);
      return null;
    }

    setIsValid(true);

    const upperMac = cleanedMac.toUpperCase();
    const lowerMac = cleanedMac.toLowerCase();
    
    const formats: Record<string, string> = {
      colon: upperMac.match(/.{1,2}/g)?.join(':')!,
      windows: `${upperMac.substring(0, 4)}-${upperMac.substring(4, 8)}-${upperMac.substring(8, 12)}`,
      hyphen: upperMac.match(/.{1,2}/g)?.join('-')!,
      dot: `${upperMac.substring(0, 4)}.${upperMac.substring(4, 8)}.${upperMac.substring(8, 12)}`,
    };

    // Add upper/lower only if they're different
    if (upperMac !== lowerMac) {
      formats.upper = upperMac;
      formats.lower = lowerMac;
    } else {
      formats.plain = upperMac;
    }

    return formats;
  }, [macAddress]);

  const handleMacAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMacAddress(event.target.value);
    setFlashingItem('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setFlashingItem(text);
      setTimeout(() => setFlashingItem(''), 300);
    });
  };

  return (
    <div className="mac-parser">
      <h2>🔧 Парсер MAC-адресов</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Введите MAC-адрес в любом формате"
          value={macAddress}
          onChange={handleMacAddressChange}
          className={isValid === false ? 'invalid' : isValid === true ? 'valid' : ''}
        />
        {isValid === false && <div className="error-message">❌ Неверный формат MAC-адреса</div>}
      </div>
      {parsedFormats && (
        <div className="formats">
          <h3>📋 Форматы (нажмите для копирования):</h3>
          <ul>
            {Object.entries(parsedFormats).map(([, format]) => (
              <li 
                key={format} 
                onClick={() => copyToClipboard(format!)}
                className={flashingItem === format ? 'flash' : ''}
              >
                <span>{format}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="footer">💙 С любовью для НТПВС</div>
    </div>
  );
};

export default MacParser;
