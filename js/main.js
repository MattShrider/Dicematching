$(function() {
  var rollAmount = 0;
  var rollMatches = {};

  var $type = $('#die-type');
  var $order = $('#order-matters');
  var $amount = $('#rolltotal span');
  var $rolls = $('#rolls');
  var $first = $('#first-amount');
  var $second = $('#second-amount');
  var $bulk = $('#bulk-amount');

  var orderMatters;
  var dieType;
  var isStopped = true;
  $('#start').on('click', startSim);
  $('#stop').on('click', stopSim);
  $('#bulk').on('click', bulkRoll);



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

  function bulkRoll() {
    var rollFirst = $first.val();
    var rollSecond = $second.val();
    orderMatters = $order.is(':checked');
    dieType = $type.val();
    rollMatches = {};

    createDom(rollFirst, rollSecond);

    for (var i = 0; i < $bulk.val(); i++) {
      roll(dieType, rollFirst, rollSecond, (i < $bulk.val() - 1));
    }
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

  function roll(max, first, second, skipDomUpdate) {
    skipDomUpdate = skipDomUpdate === undefined ? false : skipDomUpdate;
    var thisPass = {
      first: [],
      second: []
    };

    var matched;
    var missed;

    for (var i = 0; i < first; i++) {
      thisPass.first.push(getRandomInt(1, max))
    }

    for (var i = 0; i < second; i++) {
      thisPass.second.push(getRandomInt(1, max))
    }

    if (orderMatters) {
      matched = getMatchesWithOrder(thisPass.first, thisPass.second);
    } else {
      matched = getMatches(thisPass.first, thisPass.second);
    }

    rollMatches.total++;
    rollMatches[matched].amount++;
    if (!skipDomUpdate) {
      updateDom(first);
    }
  }

  function updateDom(amount) {
    $amount.text(rollMatches.total);

    for (var i=0; i <= amount; i++) {
      rollMatches[i].$amount.text(rollMatches[i].amount);
      rollMatches[i].$percent.text((rollMatches[i].amount / rollMatches.total * 100).toFixed(2));
    }
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

  function getMatches(first, second) {
    var matched = false;
    var amount = 0;
    do {
      matched = false;
      for (var i = 0; i < first.length; i++) {
        for (var j = 0; j < second.length; j++) {
          if (first[i] === second[j]) {
            matched = true;
            amount++;
            second.splice(j, 1);
            first.splice(i, 1);
            break;
          } else {
            matched = false;
          }
        }
        if (matched) {
          break;
        }
      }
    } while(matched);

    return amount;
  }

  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

});

