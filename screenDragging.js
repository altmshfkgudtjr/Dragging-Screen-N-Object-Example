const dragScreen = (target) => {
	const SPEED = 2;
	const screen = target;
	let originX = 0, originY = 0, scrollLeft = 0, scrollTop = 0;

	function mouseDown(e) {
		if (e.button !== 1) return;

		e.preventDefault();
		originX = e.pageX - target.offsetLeft;
		originY = e.pageY - target.offsetTop;
		scrollLeft = target.scrollLeft;
		scrollTop = target.scrollTop;
		target.onmouseup = mouseUp;
		target.onmousemove = mouseMove;
		document.body.style.cursor = 'grabbing';
	}

	function mouseMove(e) {
		e.preventDefault();

		const x = e.pageX - target.offsetLeft;
		const y = e.pageY - target.offsetTop;
		target.scrollLeft = scrollLeft - (x - originX) * SPEED;
		target.scrollTop = scrollTop -  (y - originY) * SPEED;
	}

	function mouseUp(e) {
		target.onmouseup = null;
		target.onmousemove = null;
		document.body.style.cursor = '';
	}

	target.onmousedown = mouseDown;
}