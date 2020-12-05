let target = null;
let mouseDown = false;
let startX, startY, scrollLeft, scrollTop;

const mousedownEvent = (e)=> {
	// 마우스 휠 클릭이 아니라면 종료.
	if (e.button !== 1) return;
	
	e.preventDefault();				// 기존 Event 중지
	e.stopImmediatePropagation();	// 끌기 기능 중지

	target.addEventListener("mousemove", mousemoveEvent);	// 드래깅 이벤트 등록
	target.classList.add('screenMouseDragging');

	mouseDown = true;
	startX = e.pageX - target.offsetLeft;
	startY = e.pageY - target.offsetTop;
	scrollLeft = target.scrollLeft;
	scrollTop = target.scrollTop;
}

const mouseupEvent = (e)=> {
	mouseDown = false;
	target.removeEventListener("mousemove", mousemoveEvent);
	target.classList.remove('screenMouseDragging');
}

const mousemoveEvent = (e)=> {
	if (!mouseDown) return;
	e.preventDefault();

	setTimeout(function() {
		const x = e.pageX - target.offsetLeft;
		const y = e.pageY - target.offsetTop;
		target.scrollLeft = scrollLeft - (x - startX)*2;
		target.scrollTop = scrollTop - (y - startY)*2;
	}, 0);
}

/* Export */
const screenDragMovingEvent = (t)=> {
	target = t;
	target.addEventListener("mousedown", mousedownEvent);
	target.addEventListener("mouseup", mouseupEvent);
}

const screenDragMovingRemove = (t)=> {
	target = t;
	target.removeEventListener("mousedown", mousedownEvent);
	target.removeEventListener("mouseup", mouseupEvent);
}
