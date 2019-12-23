class InputValidator {

  static validateName(name) {
    return Promise.reject({ statusCode: 400, message: 'Name must be a valid non empty string.' });
  }

  static validateEmail(email) {
    if(email){
      return Promise.resolve(email);
    }
    return Promise.reject({ statusCode: 400, message: `${email} is not a valid email` });
  }

  static validatePassword(password) {
    if(password){
      return Promise.resolve(password);
    }
    return Promise.reject({ statusCode: 400, message: 'password must be a valid non empty string ' });
  }
}

module.exports.InputValidator = InputValidator;
