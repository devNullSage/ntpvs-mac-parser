import { useState, useMemo, useCallback } from 'react';

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
    
    const hexPairs = upperMac.match(/.{2}/g)!;
    const formats: Record<string, string> = {
      colon: hexPairs.join(':'),
      windows: `${upperMac.substring(0, 4)}-${upperMac.substring(4, 8)}-${upperMac.substring(8, 12)}`,
      hyphen: hexPairs.join('-'),
      dot: `${upperMac.substring(0, 4)}.${upperMac.substring(4, 8)}.${upperMac.substring(8, 12)}`,
    };

    // Add upper/lower only if they're different
    if (upperMac !== lowerMac) {
      formats.upper = upperMac;
      formats.lower = lowerMac;
    }

    return formats;
  }, [macAddress]);

  const handleMacAddressChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMacAddress(event.target.value);
    setFlashingItem('');
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setFlashingItem(text);
      setTimeout(() => setFlashingItem(''), 300);
    }).catch((err) => {
      console.error('Failed to copy to clipboard:', err);
    });
  }, []);

  return (
    <div className="mac-parser">
      <h2>🔧 Парсер MAC-адресов</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Введите MAC-адрес"
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
