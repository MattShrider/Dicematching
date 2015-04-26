$(function() {
  var rollAmount = 0;
  var rollMatches = {};

  var $type = $('#die-type');
  var $order = $('#order-matters');
  var $amount = $('#rolltotal span');
  var $rolls = $('#rolls');
  var $first = $('#first-amount');
  var $second = $('#second-amount');

  var orderMatters;
  var dieType;
  var isStopped = true;
  $('#start').on('click', startSim);
  $('#stop').on('click', stopSim);



  function startSim() {
    if (!isStopped) {
      return;
    }
    var rollFirst = $first.val();
    var rollSecond = $second.val();
    orderMatters = $order.is(':checked');
    dieType = $type.val();
    isStopped = false;
    rollMatches = {};

    createDom(rollFirst, rollSecond);

    interval(dieType, rollFirst, rollSecond);
  }

  function interval(dieType, rollFirst, rollSecond) {
    roll(dieType, rollFirst, rollSecond);
    if (!isStopped) {
      setTimeout(function() {interval(dieType, rollFirst, rollSecond);}, 3);
    }
  }

  function stopSim() {
    isStopped = true;
  }

  function clearInputs() {
    $amount.html('');
    $rolls.html('');
  }

  function createDom(first, second) {
    $amount.html('');
    $rolls.html('');
    rollMatches.total = 0;
    for (var i = 0; i <= first; i++) {
      var dom = $('<div>Matched ' + i + ': <span class="matched">0</span> (<span class="percent">0</span>%)</div>').appendTo($rolls);
      rollMatches[i] = {
        $dom: dom,
        $amount: dom.find('.matched'),
        $percent: dom.find('.percent'),
        amount: 0
      };
    }
  }

  function roll(max, first, second) {
    var thisPass = {
      first: [],
      second: []
    };

    var matched;
    var missed;

    for (var i = 0; i < first; i++) {
      thisPass.first.push(Math.floor((Math.random() * max) + 1));
    }

    for (var i = 0; i < second; i++) {
      thisPass.second.push(Math.floor((Math.random() * max) + 1));
    }

    if (orderMatters) {
      matched = getMatchesWithOrder(thisPass.first, thisPass.second);
    } else {
      matched = 0;
    }

    rollMatches.total++;
    rollMatches[matched].amount++;
    $amount.text(rollMatches.total);
    rollMatches[matched].$amount.text(rollMatches[matched].amount);
    rollMatches[matched].$percent.text((rollMatches[matched].amount / rollMatches.total * 100).toFixed(2));
  }

  function getMatchesWithOrder(first, second) {
    var matched = true;
    var iteration = 0;
    do {
      matched = false;
      for (var i = 0; i < second.length; i++) {
        if (second[i] === first[iteration]) {
          iteration++;
          matched = true;
          second.splice(i, 1);
          break;
        } else {
          matched = false;
        }
      }
    }while(matched);

    return iteration;
  }

});
