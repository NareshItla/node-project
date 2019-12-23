const uuid = require('uuid');
const crypto = require('crypto');
const q = require('q')

function hash(str) {
  const hmac = crypto.createHmac('sha256', process.env.HASH_SECRET || 'test-secret');
  hmac.update(str);
  return hmac.digest('hex');
}

function createToken() {
  return 'token.' + uuid.v4().split('-').join('');
}

class UserService {
  constructor(db) {
    this.db = db;
    this.getUserProfileByToken = this.getUserProfileByToken.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  /**
   * Registers a user and returns it's token
   * @param {String} name
   * @param {String} email
   * @param {String} password
   * @return {Promise} resolves to user's token or rejects with Error that has statusCodes
   */
  registerUser(name, email, password) {
    const deferred = q.defer()
    const token = createToken()
    const userData = {
      email : email,
      password : password,
      name : name
    }
    this.db.collection("user_data").findOne({email : userData.email})
    .then((data) => {
      if(!data){
        return this.db.collection("user_data").insert(userData)
      }
      else{
        deferred.reject({'message' : "Email is used"})
      }
    })
    .then((data) => {
      deferred.resolve({'token':token})
    })
    .catch((err) => {
      deferred.reject(err)
    })
    return deferred.promise
  }

  /**
   * Gets a user profile by token
   * @param {String} token
   * @return {Promise} that resolves to object with email and name of user or rejects with error
   */
  getUserProfileByToken(token) {
    const deferred = q.defer()
    const findObj = {
      tokens : token
    }
    this.db.collection("user_data").findOne(findObj)
    .then((data) => {
      deferred.resolve({email : data.email})
    })
    .catch((err) => {
      deferred.reject(err)
    })
    return deferred.promise
  }

  /**
   * Log in a user to get his token
   * @param {String} email
   * @param {String} password
   * @return {Promise} resolves to token or rejects to error
   */
  logIn(email, password) {
    const deferred = q.defer()
    const token = createToken()
    const userData = {
      email : email,
      password : password
    }
    this.db.collection("user_data").findOne(userData)
    .then((data) => {
      if(data){
        return this.db.collection("user_data").update(userData,{'$push' : {'tokens' : token}})
      }
    })
    .then((data) => {
      if(data){
        deferred.resolve({'token':token})
      }
    })
    .catch((err) => {
      deferred.reject(err)
    })
    return deferred.promise
  }

  logOut(token) {
    const deferred = q.defer()
    this.db.collection.update({token : token},{'$pull' : {'tokens' : token}})
    .then((data) => {
      if(data.nModified){
        deferred.resolve({message:"Logged out successfully"})
      }
      else{
        deffered.resolve({message:"There is No user found with this token"})
      }
    })
    .catch((err) => {
      deferred.reject(err)
    })
    return deferred.promise
  }
}

module.exports.UserService = UserService;


