function zeroPad(number, length) {
	number = number.toString();
	length -= number.length;
	while (length-- > 0)
		number = '0' + number;
	return number;
}

$(function() {
	// Blog feed
	$('#feed')
		.css('display', 'block')
		.find('h3').addClass('ajax-loading');

	$.ajax({
		url			: 'http://rotorz.com/blog/category/capri/?feed=json&jsonp=capriFeed',
		dataType	: 'jsonp'
	});

	// Twitter feed
	$('#twitter-feed')
		.css('display', 'block')
		.find('h3').addClass('ajax-loading');

	$.ajax({
		url			: 'http://twitter.com/status/user_timeline/rotorzlimited.json?count=3&callback=twitterFeed',
		dataType	: 'jsonp'
	});
});

function capriFeed(feed) {
	feed = Array.prototype.reverse.apply(feed);

	var feedWrap = $('#feed');
	var el = feedWrap.find('ul');

	feedWrap.find('h3').removeClass('ajax-loading');

	for (var i = 0; i < Math.min(5, feed.length); ++i) {
		var item = feed[i];
		var li = $('<li></li>');
		li.appendTo(el);

		var stamp = new Date(item.date);

		$('<span class="timestamp"></span>')
			.text(zeroPad(stamp.getDay(), 2) + '-' + zeroPad(stamp.getMonth(), 2) + '-' + stamp.getFullYear())
			.appendTo(li);

		$('<a></a>')
			.attr('href', item.permalink)
			.text(item.title)
			.appendTo(li);

		$('<div></div>')
			.css('clear', 'left')
			.css('padding-left', '14pt')
			.html(item.content.length > 94 ? item.content.substr(0, 94) + '...' : item.content)
			.appendTo(li);
	}
}

function twitterFeed(feed) {
	feed = Array.prototype.slice.apply(feed);

	var feedWrap = $('#twitter-feed');
	var el = feedWrap.find('ul');

	feedWrap.find('h3').removeClass('ajax-loading');

	for (var i = 0; i < feed.length; ++i) {
		var item = feed[i];
		var li = $('<li></li>');
		li.appendTo(el);

		var stamp = new Date(item.created_at);
		// Make links clickable
		var text = item.text.replace(/(http|ftp)s?:\/\/[^\s]+/g, function(match) {
			return '<a href="' + match + '">' + match + '</a>';
		});

		$('<span class="timestamp"></span>')
			.text(zeroPad(stamp.getDay(), 2) + '-' + zeroPad(stamp.getMonth(), 2) + '-' + stamp.getFullYear() + ' at ' + zeroPad(stamp.getHours(), 2) + ':' + zeroPad(stamp.getMinutes(), 2) + ':' + zeroPad(stamp.getSeconds(), 2))
			.appendTo(li);

		$('<div></div>')
			.css('clear', 'left')
			.css('padding-left', '14pt')
			.html(text)
			.appendTo(li);
	}
}