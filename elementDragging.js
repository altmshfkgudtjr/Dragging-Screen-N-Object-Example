const dragElement = (e) => {
	const MAX_WIDTH = 5000, MAX_HEIGHT = 5000;
	const MAX_SPEED = 20;
	const canvas = document.querySelector('#window');
	let elmnt = e.target;

	let posX = 0, posY = 0, originX = 0, originY = 0, x = 0, y = 0, scrollX = 0, scrollY = 0;
	let isEdge = false;			// Event 좌표가 가장자리인지 여부
	let scrolling = false;	// Auto Scroll 함수 진입 여부

	mouseDown(e);

	/*---------------------------------------------------------------------------------------------------*/
	
	function mouseDown(e) {
		e = e || window.event;
		if (e.button !== 0) return;

		if (e.type === 'touchstart'
				 && ('ontouchstart'  in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)) {
			originX = e.touches[0].clientX;
			originY = e.touches[0].clientY;
			document.addEventListener('touchend', moueUp, {'passive': false});
			document.addEventListener('touchmove', mouseMove, {'passive': false});
		} else {
			e.preventDefault();
			originX = e.clientX;
			originY = e.clientY;
			document.onmouseup = moueUp;
			document.onmousemove = mouseMove;
		}
	}

	/*---------------------------------------------------------------------------------------------------*/

	function mouseMove(e) {
		e = e || window.event;
		/*---------------------------------------------------------------------------------------------------*/
		// ♥: [X|Y]의 별칭
		// Scroll♥: Element가 현재 Screen 가장자리 영역에 들어가면 Auto Scroll을 위해서 설정
		// isEdge 시작 지점으로부터 멀어질 수록 Scroll Speed 증가 [Speed는 Max보다 이하로 작동]

		if (e.clientX < 100) {
			scrollX = (100 - e.clientX) / 4 > MAX_SPEED
				? -MAX_SPEED
				: (100 - e.clientX) / -4;
			isEdge = true;
		} else if (e.clientX > window.innerWidth - 100) {
			scrollX = (e.clientX - (window.innerWidth - 100)) / 4 > MAX_SPEED
				? MAX_SPEED
				: (e.clientX - (window.innerWidth - 100)) / 4;
			isEdge = true;
		} else {
			scrollX = 0;
		}

		if (e.clientY < 100) {
			scrollY = (100 - e.clientY) / 4 >  MAX_SPEED
				? -MAX_SPEED
				: (100 - e.clientY) / -4;
			isEdge = true;
		} else if (e.clientY > window.innerHeight - 100) {
			scrollY = (e.clientY - (window.innerHeight - 100)) / 4 > MAX_SPEED
				? MAX_SPEED
				: (e.clientY - (window.innerHeight - 100)) / 4;
			isEdge = true;
		} else {
			scrollY = 0;
		}

		/*---------------------------------------------------------------------------------------------------*/
		// pos♥: MouseDown된 Event의 Origin 좌표에 대한 MouseMove된 Event의 Origin 좌표의 차이
		// ♥: Element가 화면 0 ~ MAX 사이에만 이동이 가능하도록 설정
		// scroll♥: Element가 화면 0 ~ MAX 를 초과한다면 0으로 설정

		if (e.type === 'touchmove'
				 && ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)) {
			e.preventDefault();
			posX = e.touches[0].clientX - originX;
			posY = e.touches[0].clientY - originY;
		} else {
			e.preventDefault();
			posX = e.clientX - originX;
			posY = e.clientY - originY;
		}

		if ((elmnt.offsetLeft + posX) >= 0 && (elmnt.offsetLeft + posX + elmnt.offsetWidth) <= MAX_WIDTH) {
			x = posX;
		} else {
			scrollX = 0;
		}

		if ((elmnt.offsetTop + posY) >= 0 && (elmnt.offsetTop + posY + elmnt.offsetHeight) <= MAX_HEIGHT) {
			y = posY;
		} else {
			scrollY = 0;
		}

		if (scrollX === 0 && scrollY === 0) {
			isEdge = false;
		}

		/*---------------------------------------------------------------------------------------------------*/

		function keepScrolling() {
			if (!(function() {
				return isEdge && scrolling;
			})()) {
				scrolling = false;
				return;
			}

			if (elmnt.offsetLeft + x + scrollX >= 0 && elmnt.offsetLeft + x + scrollX + elmnt.offsetWidth <= MAX_WIDTH) {
				canvas.scrollLeft += Math.floor(scrollX);
				x += Math.floor(scrollX);
				originX -= Math.floor(scrollX);
			}

			if ((elmnt.offsetTop + y + scrollY) >= 0 && (elmnt.offsetTop + y + scrollY + elmnt.offsetHeight) <= MAX_HEIGHT) {
				canvas.scrollTop += Math.floor(scrollY);
				y += Math.floor(scrollY);
				originY -= Math.floor(scrollY);
			}

			elmnt.style.transform = `translate(${x}px, ${y}px)`;

			window.requestAnimationFrame(keepScrolling);
		}

		/*---------------------------------------------------------------------------------------------------*/

		if (isEdge && !scrolling) {
			scrolling = true;
			window.requestAnimationFrame(keepScrolling);
		} else {
			elmnt.style.transform = `translate(${x}px, ${y}px)`;
		}
	}

	/*---------------------------------------------------------------------------------------------------*/

	/* Draggable 종료 함수 */
	function moueUp() {
		scrolling = false;
		isEdge = false;

		elmnt.style.transform = ``;
		elmnt.style.left = `${elmnt.offsetLeft + x}px`;
		elmnt.style.top = `${elmnt.offsetTop + y}px`;
		
		document.removeEventListener('touchend', moueUp);
		document.removeEventListener('touchmove', mouseMove);
		document.onmouseup = null;
		document.onmousemove = null;
	}
}