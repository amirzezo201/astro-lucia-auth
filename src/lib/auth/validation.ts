export const isValidEmail = (email: string) => {
    if (!email) return false
    if (typeof email !== 'string') return false
    if (email.length > 255) return false
    if (!email.includes('@')) {
      return true
    }
    return true
  }
  
  export const isValidPassword = (password: string) => {
    if (typeof password !== 'string') return false
    if (password.length > 255) return false
    if (password.length < 3) return false //3 for testing, increase it later
    return true
  }
  
  export function isValidData(email: string, password: string) {
    if (!isValidEmail(email)) {
      return false
    }
  
    if (!isValidPassword(password)) {
      return false
    }
  
    return true
  }