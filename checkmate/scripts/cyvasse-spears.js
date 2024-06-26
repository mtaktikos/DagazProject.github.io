(function() {

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "cyvasse-spears") {
      checkVersion(design, name, value);
  }
}

var getFrom = function(move) {
  for (var i = 0; i < move.actions.length; i++) {
       var a = move.actions[i];
       if ((a[0] !== null) && (a[1] !== null)) return a[0][0];
  }
  return null;
}

var getTo = function(move) {
  for (var i = 0; i < move.actions.length; i++) {
       var a = move.actions[i];
       if (a[0] !== null) {
           if (a[1] !== null) {
               return a[1][0];
           } else {
               return a[0][0];
           }
       }
  }
  return null;
}

var CheckInvariants = Dagaz.Model.CheckInvariants;

Dagaz.Model.CheckInvariants = function(board) {
  var design = Dagaz.Model.design;
  _.each(board.moves, function(move) {
      if (move.isSimpleMove()) {
          var pos = move.actions[0][0][0];
          var piece = board.getPiece(pos);
          if ((piece !== null) && (piece.type == 2)) {
              var dir = design.findDirection(pos, move.actions[0][1][0]);
              if (dir !== null) {
                  if (board.player == 1) {
                      if (_.indexOf([0, 1], dir) >= 0) move.failed = true;
                  } else {
                      if (_.indexOf([4, 5], dir) >= 0) move.failed = true;
                  }
              }
          }
      }
      if (move.mode < 2) return;
      var from = getFrom(move);
      if (from === null) return;
      var piece = board.getPiece(from);
      if (piece === null) return;
      if (piece.type == 7) return;
      var dir = move.mode - 2;
      var to = getTo(move);
      if (to === null) return;
      var p = design.navigate(board.player, from, dir);
      while ((p !== null) && (p != to)) {
          if (Dagaz.Model.isDefended(design, board, p)) {
              move.failed = true;
              return;
          }
          p = design.navigate(board.player, p, dir);
      }
  });
  CheckInvariants(board);
}

})();
