const validator = require('validator');

const validateEmail = (email) => {
    return validator.isEmail(email);
};

const validatePhone = (phone) => {
    return validator.isMobilePhone(phone);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateCreditCard = (cardNumber) => {
    return validator.isCreditCard(cardNumber);
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return validator.escape(input.trim());
};

const validateAddress = (address) => {
    const required = ['street', 'city', 'state', 'zipCode', 'country'];
    for (const field of required) {
        if (!address[field] || address[field].trim() === '') {
            return false;
        }
    }
    return true;
};

module.exports = {
    validateEmail,
    validatePhone,
    validatePassword,
    validateCreditCard,
    sanitizeInput,
    validateAddress
};