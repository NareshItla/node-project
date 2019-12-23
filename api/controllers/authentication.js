const { UserService } = require('../services/user-service');
const { InputValidator } = require('../validators/input-validator');

class AuthenticationController {
  constructor(db) {
    this.userService = new UserService(db);
    this.registerUser = this.registerUser.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  // Validate Email
  // Validate Password
  // Save User
  async registerUser(req, res, next) {
    try {
      if(req){
        const email = await InputValidator.validateEmail(req.body.email)
        const password = await InputValidator.validatePassword(req.body.password)
        const name = req.body.name
        const token = await this.userService.registerUser(name,email,password);
        res.status(201).json(token)
      }
    }
    catch (err) {
      res.status(400).json(err);
    }
  }

  async logIn(req, res, next) {
    try {
      if(req){
        const email = await InputValidator.validateEmail(req.body.email)
        const password = await InputValidator.validatePassword(req.body.password)
        const token = await this.userService.logIn(email,password)
        res.status(200).json(token)
      }
    }
    catch (err) {
      res.status(400).json(err);
    }
  }

    async logOut(req, res, next) {
      try {
        if(req){
          const str = req.headers.authorization
          const token = str.split(" ")[1]
          const result = this.userService.logOut(token)
          res.status(200).json(result)
        }
      }
      catch (err) {
        res.status(400).json(err);
      }
    }
  }

module.exports.AuthenticationController = AuthenticationController;
