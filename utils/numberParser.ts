/**
 * Parses a string containing numbers and text, extracting numbers and any associated text
 * @param {string} input - The input string to parse
 * @returns {Array} - Array containing parsed numbers and any associated text
 * 
 * Examples:
 * "100k+" => [100, "k+"]
 * "10+" => [10]
 * "10,000" => [10, ",", 000]
 * "99,9" => [99, ",", 9]
 * "99.9" => [99, ".", 9]
 * "99,9%" => [99, ",", 9, "%"]
 */
function parseNumberAndText(input: string): (number | string)[] {
    // Remove all spaces
    const cleanInput = input.replace(/\s/g, '');
    
    const result: (number | string)[] = [];
    let currentIndex = 0;
    
    while (currentIndex < cleanInput.length) {
        // Find the next number
        const numberMatch = cleanInput.slice(currentIndex).match(/^\d+/);
        
        if (numberMatch) {
            const number = parseInt(numberMatch[0], 10);
            result.push(number);
            currentIndex += numberMatch[0].length;
            
            // Check for decimal separator
            if (currentIndex < cleanInput.length) {
                const nextChar = cleanInput[currentIndex];
                if (nextChar === '.' || nextChar === ',') {
                    result.push(nextChar);
                    currentIndex++;
                    
                    // Get the decimal part
                    const decimalMatch = cleanInput.slice(currentIndex).match(/^\d+/);
                    if (decimalMatch) {
                        const decimal = parseInt(decimalMatch[0], 10);
                        result.push(decimal);
                        currentIndex += decimalMatch[0].length;
                    }
                }
            }
        } else {
            // If no number found, add the character as text
            result.push(cleanInput[currentIndex]);
            currentIndex++;
        }
    }
    
    return result;
}

export default parseNumberAndText;