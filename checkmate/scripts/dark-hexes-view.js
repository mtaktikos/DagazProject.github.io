(function() {

Dagaz.Model.invisible    = [];
Dagaz.Model.invisibleOld = [];

var doneFlag = false;

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "dark-hexes-view") {
      checkVersion(design, name, value);
  }
}

var checkPawnShift = function(design, board, player, pos, dir, visible) {
  var p = design.navigate(player, pos, dir);
  if (p === null) return;
  var piece = board.getPiece(p);
  if (design.inZone(1, player, p)) {
      if (piece !== null) {
          if (piece.player != player) {
              visible.push(p);
          }
          return;
      }
      if (player == 1) visible.push(p);
      p = design.navigate(player, p, dir);
      if (p === null) return;
      piece = board.getPiece(p);
  }
  var piece = board.getPiece(p);
  if (piece === null) {
     if (player == 1) visible.push(p);
  } else {
     if (piece.player != player) visible.push(p);
  }
}

var checkStep = function(design, board, player, pos, dir, visible) {
  var p = design.navigate(player, pos, dir);
  if (p === null) return;
  var piece = board.getPiece(p);
  if (piece === null) {
     if (player == 1) visible.push(p);
  } else {
     if (piece.player != player) visible.push(p);
  }
}

var checkKnightJump = function(design, board, player, pos, o, d, visible) {
  var p = design.navigate(player, pos, o);
  if (p === null) return;
  p = design.navigate(player, p, d);
  if (p === null) return;
  var piece = board.getPiece(p);
  if (piece === null) {
     if (player == 1) visible.push(p);
  } else {
     if (piece.player != player) visible.push(p);
  }
}

var checkSlide = function(design, board, player, pos, dir, visible) {
  var p = design.navigate(player, pos, dir);
  while (p !== null) {
      var piece = board.getPiece(p);
      if (piece !== null) {
          if (piece.player != player) {
              visible.push(p);
          }
          return;
      }
      if (player == 1) visible.push(p);
      p = design.navigate(player, p, dir);
  }
}

Dagaz.Model.Done = function(design, board) {
  var visible = [];
  var n  = design.getDirection("n");  var w  = design.getDirection("w");
  var s  = design.getDirection("s");  var e  = design.getDirection("e");
  var nw = design.getDirection("nw"); var sw = design.getDirection("sw");
  var ne = design.getDirection("ne"); var se = design.getDirection("se");
  var nnw = design.getDirection("nnw"); var ssw = design.getDirection("ssw");
  var nne = design.getDirection("nne"); var sse = design.getDirection("sse");
  _.each(design.allPositions(), function(pos) {
      var piece = board.getPiece(pos);
      if (piece !== null) {
          if (piece.type == 0) { // Pawn
              checkPawnShift(design, board, piece.player, pos, n, visible);
              checkStep(design, board, piece.player, pos, nw, visible);
              checkStep(design, board, piece.player, pos, ne, visible);
              checkStep(design, board, piece.player, pos, nnw, visible);
              checkStep(design, board, piece.player, pos, nne, visible);
          }
          if ((piece.type == 3) || (piece.type == 4)) { // Rook, Queen
              checkSlide(design, board, piece.player, pos, n, visible);
              checkSlide(design, board, piece.player, pos, s, visible);
              checkSlide(design, board, piece.player, pos, nw, visible);
              checkSlide(design, board, piece.player, pos, ne, visible);
              checkSlide(design, board, piece.player, pos, sw, visible);
              checkSlide(design, board, piece.player, pos, se, visible);
          }
          if (piece.type == 2) { // Knight
              checkKnightJump(design, board, piece.player, pos, e, ne, visible);
              checkKnightJump(design, board, piece.player, pos, e, se, visible);
              checkKnightJump(design, board, piece.player, pos, w, nw, visible);
              checkKnightJump(design, board, piece.player, pos, w, sw, visible);
              checkKnightJump(design, board, piece.player, pos, nnw, n, visible);
              checkKnightJump(design, board, piece.player, pos, nnw, nw, visible);
              checkKnightJump(design, board, piece.player, pos, nne, n, visible);
              checkKnightJump(design, board, piece.player, pos, nne, ne, visible);
              checkKnightJump(design, board, piece.player, pos, ssw, sw, visible);
              checkKnightJump(design, board, piece.player, pos, ssw, s, visible);
              checkKnightJump(design, board, piece.player, pos, sse, se, visible);
              checkKnightJump(design, board, piece.player, pos, sse, s, visible);
          }
          if ((piece.type == 1) || (piece.type == 4)) { // Bishop, Queen
              checkSlide(design, board, piece.player, pos, nnw, visible);
              checkSlide(design, board, piece.player, pos, nne, visible);
              checkSlide(design, board, piece.player, pos, ssw, visible);
              checkSlide(design, board, piece.player, pos, sse, visible);
              checkSlide(design, board, piece.player, pos, w, visible);
              checkSlide(design, board, piece.player, pos, e, visible);
          }
          if (piece.type == 5) { // King
              checkStep(design, board, piece.player, pos, n, visible);
              checkStep(design, board, piece.player, pos, s, visible);
              checkStep(design, board, piece.player, pos, nw, visible);
              checkStep(design, board, piece.player, pos, ne, visible);
              checkStep(design, board, piece.player, pos, sw, visible);
              checkStep(design, board, piece.player, pos, se, visible);
              checkStep(design, board, piece.player, pos, e, visible);
              checkStep(design, board, piece.player, pos, w, visible);
              checkStep(design, board, piece.player, pos, nnw, visible);
              checkStep(design, board, piece.player, pos, nne, visible);
              checkStep(design, board, piece.player, pos, ssw, visible);
              checkStep(design, board, piece.player, pos, sse, visible);
          }
      }
  });
  Dagaz.Model.invisibleOld = [];
  _.each(Dagaz.Model.invisible, function(p) {
      if (board.getPiece(p) === null) {
          Dagaz.Model.invisibleOld.push(p);
      }
  });
  Dagaz.Model.invisible = [];
  _.each(design.allPositions(), function(pos) {
      var piece = board.getPiece(pos);
      if ((piece !== null) && (_.indexOf(visible, pos) < 0)) {
          Dagaz.Model.invisible.push(pos);
      }
  });
  var ko = [];
  _.each(design.allPositions(), function(pos) {
      if (_.indexOf(visible, pos) >= 0) return;
      var piece = board.getPiece(pos);
      if ((piece !== null) && (piece.player == 1)) return;
      if (design.isKilledPos(pos)) return;
      ko.push(pos);
  });
  if (ko.length > 0) {
      board.ko = ko;
  }
}

Dagaz.Controller.Done = function(board) {
  board.ko = [];
  doneFlag = true;
}

Dagaz.View.showPiece = function(view, ctx, frame, pos, piece, model, x, y, setup) {
  var isSaved = false;
  if (!doneFlag && (_.indexOf(_.union(Dagaz.Model.invisible, Dagaz.Model.invisibleOld), setup.pos) >= 0)) {
      ctx.save();
      if (model.player == 1) {
          ctx.globalAlpha = 0.7;
      } else {
          ctx.globalAlpha = 0;
      }
      isSaved = true;
  }
  ctx.drawImage(piece.h, x, y, piece.dx, piece.dy);
  if (isSaved) {
      ctx.restore();
  }
}

})();
