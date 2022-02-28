;(function(){
  var route = {}
	$(document).on('click', 'a, button', function(e){
		var tmp = $(this).attr('href') || '';
		if(0 === tmp.indexOf('http')){ return }
		e.preventDefault();
		r(tmp);
	});
	function r(href){
		if(!href){ return }
		if(href[0] == '#'){ href = href.slice(1) }
		var h = href.split('/')[0];
		$('.page').hide();
		$('#' + h).show();
		if(r.on === h){ return }
		location.hash = href;
		(r.page[h] || {on:function(){}}).on();
		r.on = h;
		return r;
	};
	r.page = function(h, cb){
		r.page[h] = r.page[h] || {on: cb};
		return r;
	}
	r.render = function(id, model, onto, data){
		var $data = $(
			$('#' + id).get(0) ||
			$('.model').find(model).clone(true).attr('id', id).appendTo(onto)
		);
		$.each(data, function(field, val){
			if($.isPlainObject(val)){ return }
			$data.find("[name='" + field + "']").val(val).text(val);
		});
		return $data;
	}
	window.onhashchange = function(){ r(location.hash.slice(1)) };
	if(window.route){
		route = r;
	} else {
		$.route = r;
    window.route = r;
	}
}());
