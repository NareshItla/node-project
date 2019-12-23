const { UserService } = require('../services/user-service');

class ProfileController {

  constructor(db) {
    this.userService = new UserService(db);
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  async getUserProfile(req, res, next) {
    try {
      const str = req.headers.authorization
      const token = str.split(" ")[1]
      const result = await this.userService.getUserProfileByToken(token)
      res.status(200).json(result)
    }
    catch (err) {
      res.status(401).json(err)
    }
  }
}

module.exports.ProfileController = ProfileController;
