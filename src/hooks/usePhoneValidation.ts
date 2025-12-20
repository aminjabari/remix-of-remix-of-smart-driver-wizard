import { useState, useCallback } from 'react';
import { 
  validateIranianMobile, 
  sanitizeIranianPhone,
  convertPersianToEnglishNumbers 
} from '@/lib/phoneValidation';

interface UsePhoneValidationReturn {
  phone: string;
  error: string | undefined;
  isValid: boolean;
  handlePhoneChange: (value: string) => void;
  validatePhone: () => boolean;
  sanitizedPhone: string;
}

export function usePhoneValidation(initialValue: string = ''): UsePhoneValidationReturn {
  const [phone, setPhone] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();
  const [isValid, setIsValid] = useState(false);

  const handlePhoneChange = useCallback((value: string) => {
    // تبدیل آنی اعداد فارسی به انگلیسی
    const converted = convertPersianToEnglishNumbers(value);
    // حذف کاراکترهای غیرعددی به جز + در ابتدا
    const cleaned = converted.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    
    setPhone(cleaned);
    
    // اعتبارسنجی در زمان تایپ
    if (cleaned.length > 0) {
      const result = validateIranianMobile(cleaned);
      if (cleaned.length >= 11) {
        setError(result.error);
        setIsValid(result.isValid);
      } else {
        // هنوز در حال تایپ است
        setError(undefined);
        setIsValid(false);
      }
    } else {
      setError(undefined);
      setIsValid(false);
    }
  }, []);

  const validatePhone = useCallback((): boolean => {
    const result = validateIranianMobile(phone);
    setError(result.error);
    setIsValid(result.isValid);
    return result.isValid;
  }, [phone]);

  const sanitizedPhone = sanitizeIranianPhone(phone);

  return {
    phone,
    error,
    isValid,
    handlePhoneChange,
    validatePhone,
    sanitizedPhone,
  };
}
