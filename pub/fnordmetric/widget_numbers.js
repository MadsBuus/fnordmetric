FnordMetric.css('/fnordmetric/fnordmetric.css', function(){});
FnordMetric.js('/jquery-1.6.1.min.js', function(){  

  drawLayout();
  updateDataAndValues();

  window.setInterval(updateDataAndValues, 3000);

  function drawLayout(){
    for(n in widget_config.metrics){
      $('body').append(container=$('<div></div>').attr('class', 'numbers_container').attr('rel', widget_config.metrics[n]));
      container.append($('<div></div>').addClass('title').html(widget_config.metrics[n]));
      for(var k in widget_config.intervals){
        var u = FnordMetric.p+"/metric/"+widget_config.metrics[n]+'?'+widget_config.intervals[k];
        container.append($('<div></div>').addClass('number').attr('rel', u).attr('data',0).append(
          $('<span></span>').addClass('value').html(0)
        ).append(
          $('<span></span>').addClass('desc').html(k)
        ));
      } 
    }
  }

  function updateDataAndValues(){
    for(n in widget_config.metrics){
      $.get(FnordMetric.p+'/metric/'+widget_config.metrics[n], updateSingleNumber(widget_config.metrics[n]));
    }
  }

  function updateSingleNumber(metric_name){
    return function(json){
      $('.number:first', $('.numbers_container[rel="'+metric_name+'"]')).attr('data', json.value);
      updateValues(4);
    };
  }

  function formatValue(value){
    if(value < 10){ return value.toFixed(2); }
    if(value > 1000){ return (value/1000.0).toFixed(1) + "k"; }
    return value.toFixed(0); 
  }

  function updateValues(diff_factor){
    var still_running = false;
    $('.number').each(function(){
      var target_val = parseFloat($(this).attr('data'));
      var current_val = parseFloat($('.value', this).html());
      var diff = (target_val-current_val)/diff_factor; 
      if(diff < 1){ diff=1; }
      if(target_val > current_val){ 
        still_running = true;
        var new_val = current_val+diff;
        if(new_val > target_val){ new_val = target_val; }
        $('.value', this).html(formatValue(new_val));
      }
    });
    if(still_running){ 
      (function(df){
        window.setTimeout(function(){ updateValues(df); }, 30);
      })(diff_factor);
    }
  }



});