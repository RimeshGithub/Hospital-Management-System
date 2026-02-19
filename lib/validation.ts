export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true };
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 255;
}

export function validateContactInfo(contact: string): boolean {
  return contact.trim().length > 0 && contact.trim().length <= 255;
}

export function validateSpecialization(spec: string): boolean {
  return spec.trim().length > 0 && spec.trim().length <= 255;
}

export function validateFees(fees: any): boolean {
  const num = parseFloat(fees);
  return !isNaN(num) && num >= 0;
}

export function validateGender(gender: string): boolean {
  return ['Male', 'Female', 'Other'].includes(gender);
}

export function validateDate(date: string): boolean {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

export function validateTime(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}
