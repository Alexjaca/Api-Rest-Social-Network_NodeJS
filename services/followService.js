const Follow = require("../models/follow.js");

const followUserIds = async (identityUserId) => {
  try {
    //SACAR INFORMACIONN DE SEGUIMIENTO
    let following = await Follow.find({ "user": identityUserId })
      .select({"followed": 1, _id: 0 })
      .exec();

    let followers = await Follow.find({ "followed": identityUserId })
    //.select({"followed": 1, _id: 0 })
    .exec();

    //PROCESAR ARRAY DE IDENTIFICADORES
    let followingClean = [];

    following.forEach(follow =>{
        followingClean.push(follow.followed);
    });

    let followersClean = [];

    followers.forEach(follow =>{
        followersClean.push(follow.user);
    });

    return {
      following: followingClean,
      followers: followersClean
    };
  } catch (err) {
    return {};
  }
};

const followThisUser = async (identityUserId, profileUserId) => {};

module.exports = {
  followUserIds,
  followThisUser,
};
