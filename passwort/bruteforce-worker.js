self.onmessage = function(event) {
    const { inputPassword, passwordLength, includeNumbers, includeLetters, includeSymbols } = event.data;
  
    const numbers = '0123456789';
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    
    let charset = '';
    if (includeNumbers) charset += numbers;
    if (includeLetters) charset += letters;
    if (includeSymbols) charset += symbols;
  
    if (charset === '') {
      self.postMessage({ type: 'error', data: 'Kein gültiger Zeichensatz ausgewählt.' });
      return;
    }
  
    const totalCombinations = Math.pow(charset.length, passwordLength);
    let attempts = 0;
    let found = false;
  
    function generateNextPassword(index, length, charset) {
      let result = '';
      let base = charset.length;
      for (let i = 0; i < length; i++) {
        result = charset[index % base] + result;
        index = Math.floor(index / base);
      }
      return result.padStart(length, charset[0]);
    }
  
    function bruteForce() {
      while (attempts < totalCombinations && !found) {
        let guess = generateNextPassword(attempts, passwordLength, charset);
        
        if (guess === inputPassword) {
          self.postMessage({ type: 'success', data: { password: guess, attempts } });
          found = true;
          return;
        }
  
        if (attempts % 1000 === 0) {
          self.postMessage({ type: 'progress', data: { progress: (attempts / totalCombinations) * 100, attempt: guess } });
        }
  
        attempts++;
      }
    }
  
    bruteForce();
  };
  