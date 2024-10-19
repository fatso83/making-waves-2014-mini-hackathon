(function () {
	function addStyleString (str) {
		var node = document.createElement('style');
		node.innerHTML = str;
		document.body.appendChild(node);
	}

//	addStyleString([
//		".mark {",
//		"width : 16px;",
//		"height: 16px;",
//		"border-radius: 50%;",
//		"background : #bebebe;",
//		"position : absolute;",
//		"left: 467px;",
//		"}"
//	].join("\n")
//	);

	var timeline, timeline_list, ul, element, createMarks;

	//create dot mark for each post
	createMarks = function () {

		var timeline_list = window.document.getElementById('timeline_list'),
			fragment = window.document.createDocumentFragment();

		for (var i = 0; i < timeline_list.children.length; i++) {
			var mark = window.document.createElement('div');

			mark.classList.add('mark');
			mark.style.width = '16px';
			mark.style.height = '16px';
			mark.style.setProperty('border-radius', '50%');
			mark.style.background = '#bebebe';
			mark.style.position = 'absolute';
			mark.style.left = '467px';
			mark.style.top = (timeline_list.children[i].offsetTop + 15) + 'px';

			fragment.appendChild(mark);
		}
		var timeline = window.document.getElementById('timeline');
		timeline.appendChild(fragment);
	};

	timeline = window.document.getElementById('timeline');

	ul = window.document.createElement('ul');
	ul.id = 'timeline_list';
	ul.style.padding = '0px';
	ul.style.margin = '0px';
	timeline.appendChild(ul);

	timeline_list = window.document.getElementById('timeline_list');
	var fragment = document.createDocumentFragment();
	for (var i = 0; i < data.length; i++) {

		element = window.document.createElement('li');
		element.id = 'post-' + i;
//
//		if (i % 2) {
//			window.document.styleSheets[0].insertRule('#post-' + i + ':after { content: "";display: block;position: absolute;top:11px;left: -20px;width: 0;height: 0;border-color: transparent #fff transparent transparent ;border-style: solid;border-width: 10px; }', 0);
//			window.document.styleSheets[0].insertRule('#post-' + i + ':before { content: "";display: block;position: absolute;top: 10px;left: -22px;width: 0;height: 0;border-color: transparent #bebebe transparent transparent ;border-style: solid;border-width: 11px; }', 0);
//		} else {
//			window.document.styleSheets[0].insertRule('#post-' + i + ':after { content: "";display: block;position: absolute;top:11px;right: -20px;width: 0;height: 0;border-color: transparent transparent transparent #fff;border-style: solid;border-width: 10px; }', 0);
//			window.document.styleSheets[0].insertRule('#post-' + i + ':before { content: "";display: block;position: absolute;top: 10px;right: -22px;width: 0;height: 0;border-color: transparent transparent transparent #bebebe;border-style: solid;border-width: 11px; }', 0);
//		}

		element.style.setProperty('box-sizing', 'border-box');
		element.style.setProperty('-moz-box-sizing', 'border-box');
		element.style.setProperty('border-radius', '3px');
		element.style.setProperty('background-color', '#fff');
		element.style.setProperty('font-family', 'lucida grande,tahoma,verdana,arial,sans-serif');
		element.style.setProperty('font-size', '13px');
		element.style.setProperty('list-style', 'none');
		element.style.setProperty('color', 'rgb(55, 64, 78)');
		element.style.setProperty('width', '450px');
		element.style.setProperty('border', '1px ' + 'solid ' + '#bebebe');
		element.style.setProperty('padding', '15px');
		element.style.setProperty('margin', 5 + 'px ' + 0 + 'px ' + 0 + 'px ' + 0 + 'px ');
		element.style.setProperty('clear', 'left');
		element.style.setProperty('position', 'relative');

		if (i % 2) {
			element.style.setProperty('float', 'right');
			element.style.setProperty('clear', 'right');
		} else {
			element.style.setProperty('float', 'left');
			element.style.setProperty('clear', 'left');
		}

		var paragraph = window.document.createElement('p'),
			strong = window.document.createElement('strong'),
			time = window.document.createElement('time'),
			div = window.document.createElement('div'),
			monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
			date = data[i].date.substr(0, 10).split('-');
		d = new Date(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2], 10));

		strong.innerHTML = data[i].owner;
		time.innerHTML = d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
		time.style.display = 'block';

		div.innerHTML = data[i].content;

		paragraph.appendChild(strong);
		paragraph.appendChild(time);

		element.appendChild(paragraph);
		element.appendChild(div);

		// create comments for post
		if (data[i].comments) {
			var comments = window.document.createElement('ul'),
				anchor = window.document.createElement('a');

			anchor.innerHTML = 'comments (' + data[i].comments.length + ')';
			anchor.href = "#";
			anchor.onclick = function (event) {
				if (event.target.nextSibling.style.display === 'none') {
					event.target.nextSibling.style.display = 'block';
				} else {
					event.target.nextSibling.style.display = 'none';
				}

				//remove old dot marks
				var marks = timeline.querySelectorAll('.mark');
				for (var k = 0; k < marks.length; k++) {
					timeline.removeChild(marks[k]);
				}

				// create new marks
				createMarks();
				return false;
			};
			element.appendChild(anchor);

			comments.classList.add('comments');
			comments.style.margin = '20px 0 0 0';
			comments.style.padding = '0';
			comments.style.setProperty('list-style', 'none');
			comments.style.display = 'none';

			for (var j = 0; j < data[i].comments.length; j++) {
				var comment = window.document.createElement('li');
				comment.innerHTML = '<strong>' + data[i].comments[j].owner + '</strong>: ' + data[i].comments[j].content;
				comment.style.padding = '10px 10px 10px 100px';
				comment.style.background = '#f0f0f0';
				comment.style.setProperty('border-top', '1px solid #bebebe');

				comments.appendChild(comment);
			}

			element.appendChild(comments);

		}

		fragment.appendChild(element);
	}
	timeline_list.appendChild(fragment);

	createMarks();

})();
