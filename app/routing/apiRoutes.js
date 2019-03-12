// ===============================================================================
// LOAD DATA
// ===============================================================================

// These data sources hold arrays of information on friendData.
var friendData = require("../data/friendData");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // API GET Requests
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function (req, res) {
    res.json(friendData);
  });

  // API POST Requests
  // ---------------------------------------------------------------------------

  app.post("/api/friends", function (req, res) {
    // Calculate matching compatibility based on absolute value of
    // total score difference between current user's
    // other users in friendArray.

    // Parse scores to int and update req.body.scores
    var userScore = req.body.scores.map(function(score) {
      return parseInt(score, 10);
    });
    req.body.scores = userScore;

    // Define function sum
    var arrSum = function (arr) {
      return arr.reduce(function(accumulator, x) {
        return accumulator + x;
      })
    };

    // Calculate sum of current user's score
    var userTotalScore = arrSum(userScore);

    // Find min difference and best match
    // Default value of minDiff to max possible score difference
    var minDiff = 40;
    var bestMatch;

    // Loop through friendData and compare user's score vs other users
    for (var i = 0; i < friendData.length; i++) {
      if (Math.abs(userTotalScore - arrSum(friendData[i].scores)) < minDiff) {
        minDiff = Math.abs(userTotalScore - arrSum(friendData[i].scores))
        bestMatch = friendData[i];
      }
    };

    // Add current user to friend array
    friendData.push(req.body);

    // Return best match
    return res.json(bestMatch);
  });
};
