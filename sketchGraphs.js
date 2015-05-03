// returns array of points rounded to integer
// between points [x1,y1] and [x2, y2] inclusive
var pointsBetween = function(x1,y1,x2,y2) {
	var ans = [];
	var total, slope;
	if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
		if (x1 > x2) {
			var x = x1, y = y1;
			x1 = x2; y1 = y2;
			x2 = x; y2 = y
		}
		total = x2 - x1;
		slope = (y2 - y1)/(x2 - x1);
		for (var x = x1; x <= x2; x++) {
			ans.push([x, Math.round(y1 + slope*(x - x1))]);
		}
	} else {
		if (y1 > y2) {
			var x = x1, y = y1;
			x1 = x2; y1 = y2;
			x2 = x; y2 = y
		}
		total = y2 - y1;
		slope = (x2 - x1)/(y2 - y1);
		for (var y = y1; y <= y2; y++) {
			ans.push([x1 + Math.round(slope*(y - y1)), y]);
		}
	}
	return ans;
};

function SketchInterface(kerberosHash, problemID, refDiv, width, height, answerElement, userXAxis, userYAxis, imageURL) {
	this.kerberosHash = kerberosHash;
	this.problemID = problemID;
	this.refDiv = refDiv;
	this.imageCanvas = null;
	this.guidelineCanvas = null;
	this.canvas = null;
	this.xAxisCanvas = null;
	this.yAxisCanvas = null;
	this.width = width;
	this.height = height;
	this.canvasImageData = null;
	this.guidelineImageData = null;
	this.recordingArray = [];
	this.pencilRadio = null;
	this.eraserRadio = null;
	this.resetButton = null;
	this.postForm = null;
	this.submitButton = null;
	this.toggleAnswer = null;
	this.loadingImage = null;
	this.userXAxis = userXAxis;
	this.userYAxis = userYAxis;
	this.axisForm = null;
	this.setAxesButton = null;
	this.answerElement = answerElement;
	this.xmin = null;
	this.xmax = null;
	this.xstep = null;
	this.ymin = null;
	this.ymax = null;
	this.ystep = null;
	this.xlabel = "";
	this.ylabel = "";

	this.makeElements = function() {
		this.showAnswer(false);
		this.refDiv.style.width = String(this.width + 70) + 'px';
		this.refDiv.style.height = String(this.height + 100) + 'px';
		this.refDiv.style.position = 'relative'
		
		//canvases
		//possible image to place
		if (imageURL != undefined) {
			this.imageCanvas = document.createElement('canvas');
			this.imageCanvas.width = this.width;
			this.imageCanvas.height = this.height;
			this.imageCanvas.style.position = 'absolute';
			this.imageCanvas.style.left = String(10 + 40) + "px";
			this.imageCanvas.style.top = String(10) + "px";
			this.imageCanvas.style['pointer-events'] = 'none';
			this.refDiv.appendChild(this.imageCanvas);
			var img = new Image();
			img.src = imageURL;
			var ctx = this.imageCanvas.getContext('2d');
			var that = this;
			img.onload = function() {
				ctx.drawImage(img, that.width/2 - img.width/2, that.height/2 - img.height/2);
			};
		}
		this.guidelineCanvas = document.createElement('canvas');
		this.guidelineCanvas.width = this.width;
		this.guidelineCanvas.height = this.height;
		this.guidelineCanvas.style.position = 'absolute';
		this.guidelineCanvas.style.left = String(10 + 40) + "px";
		this.guidelineCanvas.style.top = String(10) + "px";
		this.guidelineCanvas.style['pointer-events'] = 'none';
		this.refDiv.appendChild(this.guidelineCanvas);

		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.style.position = 'absolute';
		this.canvas.style.left = String(10 + 40) + 'px';
		this.canvas.style.top = String(10) + 'px';
		this.refDiv.appendChild(this.canvas);

		this.xAxisCanvas = document.createElement('canvas');
		this.xAxisCanvas.width = this.width;
		this.xAxisCanvas.height = 40;
		this.xAxisCanvas.style.position = 'absolute';
		this.xAxisCanvas.style.left = String(10 + 40) + 'px';
		this.xAxisCanvas.style.top = String(this.height + 10) + 'px';
		this.refDiv.appendChild(this.xAxisCanvas);

		this.yAxisCanvas = document.createElement('canvas');
		this.yAxisCanvas.width = 40;
		this.yAxisCanvas.height = this.height;
		this.yAxisCanvas.style.position = 'absolute';
		this.yAxisCanvas.style.left = String(10) + 'px';
		this.yAxisCanvas.style.top = String(10) + 'px';
		this.refDiv.appendChild(this.yAxisCanvas);

		//tool form
		this.pencilRadio = document.createElement('input');
		this.pencilRadio.type = 'radio';
		this.pencilRadio.name = 'tool';
		this.pencilRadio.checked = true;
		var pencilLabel = document.createElement('label');
		pencilLabel.innerHTML = 'Pencil';

		this.eraserRadio = document.createElement('input');
		this.eraserRadio.type = 'radio';
		this.eraserRadio.name = 'tool';
		var eraserLabel = document.createElement('label');
		eraserLabel.innerHTML = 'Eraser ';

		this.resetButton = document.createElement('input');
		this.resetButton.type = 'button';
		this.resetButton.value = 'Clear';

		var form = document.createElement('form');
		form.appendChild(this.pencilRadio);
		form.appendChild(pencilLabel);
		form.appendChild(this.eraserRadio);
		form.appendChild(eraserLabel);
		form.appendChild(this.resetButton);
		form.style.position = 'absolute';
		form.style.left = String(10) + 'px';
		form.style.top = String(this.height + 50) + 'px';
		this.refDiv.appendChild(form);
		
		//set Axis form
		if (this.userXAxis || this.userYAxis) {
			this.axisForm = document.createElement('form');
			var maxNumber = "999999";
			var minNumber = "-999999";
			var textWidth = "30px";
			if (this.userXAxis) {
				var minLabel = document.createElement('span');
				minLabel.textContent = "xmin: ";
				this.axisForm.appendChild(minLabel);
				var xMin = document.createElement('input');
				xMin.type = "number";
				xMin.min = minNumber;
				xMin.max = maxNumber;
				xMin.name = "xMin";
				xMin.style.width = textWidth;
				this.axisForm.appendChild(xMin);
				var maxLabel = document.createElement('span');
				maxLabel.textContent = " xmax: ";
				this.axisForm.appendChild(maxLabel);
				var xMax = document.createElement('input');
				xMax.min = minNumber;
				xMax.max = maxNumber;
				xMax.name = 'xMax';
				xMax.style.width = textWidth;
				this.axisForm.appendChild(xMax);
				var stepLabel = document.createElement('span');
				stepLabel.textContent = " xstep: ";
				this.axisForm.appendChild(stepLabel);
				var xStep = document.createElement('input');
				xStep.min = minNumber;
				xStep.max = maxNumber;
				xStep.name = 'xStep';
				xStep.style.width = textWidth;
				this.axisForm.appendChild(xStep);

			}
			if (this.userYAxis) {
				var minLabel = document.createElement('span');
				minLabel.textContent = "ymin: ";
				this.axisForm.appendChild(minLabel);
				var yMin = document.createElement('input');
				yMin.min = minNumber;
				yMin.max = maxNumber;
				yMin.name = "yMin";
				yMin.style.width = textWidth;
				this.axisForm.appendChild(yMin);
				var maxLabel = document.createElement('span');
				maxLabel.textContent = " ymax: ";
				this.axisForm.appendChild(maxLabel);
				var yMax = document.createElement('input');
				yMax.min = maxNumber;
				yMax.max = minNumber;
				yMax.name = 'yMax';
				yMax.style.width = textWidth;
				this.axisForm.appendChild(yMax);
				var stepLabel = document.createElement('span');
				stepLabel.textContent = " ystep: ";
				this.axisForm.appendChild(stepLabel);
				var yStep = document.createElement('input');
				yStep.min = minNumber;
				yStep.max = maxNumber;
				yStep.name = 'yStep';
				yStep.style.width = textWidth;
				this.axisForm.appendChild(yStep);
			}
			this.setAxesButton = document.createElement('input');
			this.setAxesButton.type = 'button';
			this.setAxesButton.value = "Set Axes";
			this.axisForm.appendChild(this.setAxesButton);

			this.axisForm.style.position = 'absolute';
			this.axisForm.style.left = String(10) + 'px';
			this.axisForm.style.top = String(this.height + 80) + 'px';
			this.refDiv.appendChild(this.axisForm);
		}

		// post stuff
		this.postForm = document.createElement('form');
		this.submitButton = document.createElement('input');
		this.submitButton.type = 'button';
		this.submitButton.value = 'Submit';
		this.submitButton.disabled = true;
		this.postForm.appendChild(this.submitButton);
		this.toggleAnswer = document.createElement('input');
		this.toggleAnswer.type = 'button';
		this.toggleAnswer.value = "Show Answer";
		this.postForm.appendChild(this.toggleAnswer);
		this.loadingImage = document.createElement('img');
		this.loadingImage.src = 'images/loading.gif';
		this.loadingImage.style.height = "15px";
		this.postForm.appendChild(this.loadingImage);
		this.showSaving(false);
		this.postForm.style.position = 'absolute';
		this.postForm.style.left = String(this.width - 100) + 'px';
		this.postForm.style.top = String(this.height + 50) + 'px';
		this.refDiv.appendChild(this.postForm);
	};

	this.showAnswer = function(show) {
		if (show) {
			this.answerElement.style.display = "inline";
		} else {
			this.answerElement.style.display = "none";
		}
	}

	this.showSaving = function(show) {
		if (show) {
			this.loadingImage.style.display = "inline";
		} else {
			this.loadingImage.style.display = "none";
		}
	}

	this.setUpCanvas = function() {
		var lastX = 0;
		var lastY = 0;
		var isSketching = false;
		var isErasing = false;
		var ctx = this.canvas.getContext("2d");

		this.canvasImageData = ctx.createImageData(this.canvas.width, this.canvas.height);
		ctx = this.guidelineCanvas.getContext("2d");
		this.guidelineImageData = ctx.createImageData(this.guidelineCanvas.width, this.guidelineCanvas.height);

		var that = this;
		this.canvas.onmousedown = function(e) {
			if (that.pencilRadio.checked) {
				isSketching = true;
				isErasing = false;
			} else {
				isErasing = true;
				isSketching = false;
			}
			
			
			lastX = e.layerX;
			lastY = e.layerY;
		};

		this.canvas.onmouseup = function(e) {
			isSketching = false;
			isErasing = false;
		};

		this.canvas.onmouseleave = function(e) {
			isSketching = false;
			isErasing = false;
		};

		this.canvas.onmousemove = function(e) {
			if (isSketching) {
				var inBetween = pointsBetween(lastX, lastY, e.layerX, e.layerY);
				for (var i = 0; i < inBetween.length; i++) {
					var x = inBetween[i][0], y = inBetween[i][1];
					that.setPixel(that.canvasImageData,x, y,0,0,0);
				}
				that.record(inBetween, 'pencil');
				that.refreshCanvases();
				lastX = e.layerX;
				lastY = e.layerY;
				that.submitButton.disabled = false;
			} else if (isErasing) {
				mouseX = e.pageX - this.offsetLeft;
				mouseY = e.pageY - this.offsetTop;
				var inBetween = pointsBetween(lastX, lastY, e.layerX, e.layerY);
				for (var i = 0; i < inBetween.length; i++) {
					var x = inBetween[i][0], y = inBetween[i][1];
					that.eraseArea(x, y, 10);
				}
				that.record(inBetween, 'eraser');
				that.refreshCanvases();
				lastX = e.layerX;
				lastY = e.layerY;
				that.submitButton.disabled = false;
			}
		}
		
		$.post("receiveData.py", {
				'kerberosHash':that.kerberosHash,
				'problemID':that.problemID
			}, function(data, status) {
			if (status == 'success') {
				that.extractServerData(data);
			} else {
				console.log('error retrieving data');
			}
		});
	};

	this.extractServerData = function(string) {
		var j = JSON.parse(string);
		if (j == null) {
			return; // do nothing
		}
		this.recording = j.recording;
		var totalEntries = this.width*this.height*4;
		for (var i = 0; i < this.width*this.height*4; i++) {
			this.canvasImageData.data[i] = j.cData.data[i];
		}
		this.refreshCanvases();
		this.xmin = j.axes[0];
		this.xmax = j.axes[1];
		this.xstep = j.axes[2];
		this.ymin = j.axes[3];
		this.ymax = j.axes[4];
		this.ystep = j.axes[5];
		this.setAxes(this.xmin, this.xmax, this.xstep, this.ymin, this.ymax, this.ystep);
	};

	this.setUpForm = function() {
		var that = this;
		this.submitButton.addEventListener("click", function(event) {
			that.showSaving(true);
			this.disabled = true;
			var saveData = JSON.stringify({cData: that.canvasImageData, recording: that.recordingArray, axes:[that.xmin, that.xmax,that.xstep,that.ymin,that.ymax,that.ystep]});
			$.post("sendData.py", {
				kerberosHash: that.kerberosHash,
				problemID: that.problemID,
				saveData: saveData
			},
			function(data, status){
				console.log(" Status: " + status + " for problemID: " + that.problemID);
				that.showSaving(false);
			});
			console.log('doing swell');
		});

		this.resetButton.addEventListener("click", function(event) {
			that.submitButton.disabled = false;
			var ctx = that.canvas.getContext('2d');
			ctx.clearRect(0,0,that.canvas.width, that.canvas.height);
			that.canvasImageData = ctx.createImageData(that.canvas.width, that.canvas.height);
		});
		
		this.toggleAnswer.addEventListener("click", function(event) {
			if (this.value == "Show Answer") {
				this.value = "Hide Answer";
				that.showAnswer(true);
			} else {
				this.value = "Show Answer";
				that.showAnswer(false);
			}
		});
		
		if (userXAxis || userYAxis) {	
			this.setAxesButton.addEventListener("click", function(event) {
				var c = confirm("Any drawings you made will not scale. Are you sure you want to set the axes?");
				if (c) {
					var names = {};
					$.each($(that.axisForm).find('input'), function () {
						names[this.name] = this.value;
					});
					// check that it contains valid values
					var xmin = Number(names["xMin"]);
					var xmax = Number(names["xMax"]);
					var xstep = Number(names["xStep"]);
					if (typeof xmin == "number" && typeof xmax == "number" && typeof xstep == "number" && xmax > xmin && xstep > 0) {
						that.xmin = xmin - xstep/4;
						that.xmax = xmax + xstep/4;
						that.xstep = xstep;
					}
					var ymin = Number(names["yMin"]);
					var ymax = Number(names["yMax"]);
					var ystep = Number(names["yStep"]);
					if (typeof ymin == "number" && typeof ymax == "number" && typeof ystep == "number" && ymax > ymin && ystep > 0) {
						that.ymin = ymin - ystep/4;
						that.ymax = ymax + ystep/4;
						that.ystep = ystep;
					}
					that.setAxes(that.xmin, that.xmax, that.xstep, that.ymin, that.ymax, that.ystep);
					that.recordChangeAxes(xmin, xmax, xstep, ymin, ymax, ystep);
				}
			});
		}
	}


	this.setPixel = function (imageData, x,y,r,g,b,a) {
		a = typeof a !== 'undefined' ? a : 256;
		var index = (x+y*this.canvasImageData.width) *4;
		imageData.data[index+0] = r; //r
		imageData.data[index+1] = g; //g
		imageData.data[index+2] = b; //b
		imageData.data[index+3] = a; //a
	};

	this.eraseArea = function(x,y,radius) {
		for (var i = x-radius; i <= x + radius; i++) {
			for (var j = y - radius; j < y + radius; j++) {
				this.setPixel(this.canvasImageData,i,j,256,256,256,0);
			}
		}
	}

	this.record = function(points, toolType) {
		var d = new Date();
		var t = d.getTime();
		for (var i = 0; i < points.length; i++) {
			var x = points[i][0];
			var y = points[i][1];
			var newObj = {x:x, y:y, time:t, tool:toolType};
			this.recordingArray.push(newObj);
		}
	}

	this.recordChangeAxes = function(xmin, xmax, xstep, ymin, ymax, ystep) {
		var d = new Date();
		var t = d.getTime();
		var newObj = {xmin:xmin, xmax:xmax, xstep:xstep,
				ymin:ymin, ymax:ymax, ystep:ystep};
		this.recordingArray.push(newObj);
	}

	this.refreshCanvases = function() {
		this.guidelineCanvas.getContext('2d').putImageData(this.guidelineImageData, 0, 0);
		this.canvas.getContext('2d').putImageData(this.canvasImageData, 0, 0);
		}

	this.drawVerticalGuideline = function(x, r, g, b, a) {
		for (y = 0; y <= this.height; y++ ) {
			this.setPixel(this.guidelineImageData,x,y,r,g,b,a);
		}
	}

	this.drawHorizontalGuideline = function(y, r, g, b, a) {
		for (x = 0; x <= this.width; x++ ) {
			this.setPixel(this.guidelineImageData,x,y,r,g,b,a);
		}
	}

	this.drawXAxisNumber = function(canvasX, realX) {
		realX = (Math.round(realX/this.xstep)*this.xstep)
		var ctx = this.xAxisCanvas.getContext('2d');
		ctx.textAlign = 'center';
		ctx.textBaseline = "hanging";
		ctx.fillText("" + realX, canvasX, 5);
	}
	
	this.drawYAxisNumber = function(canvasY, realY) {
		realY = (Math.round(realY/this.ystep)*this.ystep)
		var ctx = this.yAxisCanvas.getContext('2d');
		ctx.textAlign = 'right';
		ctx.textBaseline = 'middle';
		ctx.fillText("" + realY, this.yAxisCanvas.width - 5, canvasY);
	}

	this.setXAxis = function(xmin, xmax, xstep) {
		var ctx = this.xAxisCanvas.getContext('2d');		

		var w = this.guidelineCanvas.width;
		var numXLines = (xmax-xmin)/xstep;
		var cXStep = w/numXLines;
		var cXorigin = -xmin*w/(xmax-xmin);
		var x, corX;
		if (cXorigin > 1 && cXorigin < w-1) {
			for (x = cXorigin - 1; x < cXorigin + 2; x++) {
				corX = Math.round(x);
				this.drawVerticalGuideline(corX, 0, 200, 200, 256);
			}
			for (x = cXorigin + cXStep; x < w; x += cXStep) {
				corX = Math.round(x);
				this.drawVerticalGuideline(corX, 0, 200, 200, 256);
				this.drawXAxisNumber(corX, (x-cXorigin)/cXStep*xstep);
			}
			for (x = cXorigin - cXStep; x > 0; x -= cXStep) {
				corX = Math.round(x);
				this.drawVerticalGuideline(corX, 0, 200, 200, 256);
				this.drawXAxisNumber(corX, (x-cXorigin)/cXStep*xstep);
			}
		} else {

			for (x = 0; x <= w; x += cXStep) {
				this.drawVerticalGuideline(x, 0, 200, 200, 256);
				this.drawXAxisNumber(x, (x-cXorigin)/cXStep*xstep);
			}
		}
	}

	this.setYAxis = function(ymin, ymax, ystep) {
		var h = this.guidelineCanvas.height;
		var numYLines = (ymax-ymin)/ystep;
		var cYStep = h/numYLines;
		var cYorigin = ymax*h/(ymax-ymin);
		var y, corY;
		if (cYorigin > 1 && cYorigin < h-1) {
			for (y = cYorigin - 1; y < cYorigin +2; y++) {
				corY = Math.round(y);
				this.drawHorizontalGuideline(corY, 50, 50, 50, 80);
			}
			for (y = cYorigin + cYStep; y < h; y += cYStep) {
				corY = Math.round(y);
				this.drawHorizontalGuideline(corY, 50, 50, 50, 80);
				this.drawYAxisNumber(corY, (cYorigin-y)/cYStep*ystep);
			}
			for (y = cYorigin - cYStep; y > 0; y -= cYStep) {
				corY = Math.round(y);
				this.drawHorizontalGuideline(corY, 50, 50, 50, 80);
				this.drawYAxisNumber(corY, (cYorigin-y)/cYStep*ystep);
			}
		} else {
			for (y = 0; y <= h; y += cYStep) {
				corY = Math.round(y);
				this.drawHorizontalGuideline(corY, 50, 50, 50, 80);
				this.drawYAxisNumber(corY, (cYorigin-y)/cYStep*ystep);
			}
		}
	}

	this.setAxes = function(xmin, xmax, xstep, ymin, ymax, ystep) {
		//x axes
		this.xmin = xmin;
		this.xmax = xmax;
		this.xstep = xstep;
		this.ymin = ymin;
		this.ymax = ymax;
		this.ystep = ystep;
		
		var ctx = this.yAxisCanvas.getContext('2d');
		ctx.clearRect(0, 0, this.yAxisCanvas.width, this.yAxisCanvas.height);
		ctx = this.xAxisCanvas.getContext('2d');
		ctx.clearRect(0, 0, this.xAxisCanvas.width, this.xAxisCanvas.height);

		ctx = this.guidelineCanvas.getContext('2d');
		ctx.clearRect(0, 0, this.guidelineCanvas.width, this.guidelineCanvas.height);
		this.guidelineImageData = ctx.createImageData(this.guidelineCanvas.width, this.guidelineCanvas.height);

		this.setYAxis(ymin, ymax, ystep);
		this.setXAxis(xmin, xmax, xstep);
		this.labelAxes(this.xlabel, this.ylabel, 12);
		this.refreshCanvases();
	}

	this.labelAxes = function(xLabel, yLabel, fontSize) {
		this.xlabel = xLabel;
		this.ylabel = yLabel;
		fontSize = typeof fontSize !== 'undefined' ? fontSize : 14;
		fontSize = String(fontSize) + "px serif";
		var ctx = this.xAxisCanvas.getContext('2d');
		ctx.textAlign = 'center';
		ctx.textBaseline = 'bottom';
		ctx.font = fontSize;
		ctx.fillText(xLabel, this.xAxisCanvas.width/2, this.xAxisCanvas.height);
		ctx = this.yAxisCanvas.getContext('2d');
		ctx.save();
		ctx.rotate(Math.PI/2);
		ctx.textAlign = 'center';
		ctx.font = fontSize;
		ctx.textBaseline = 'bottom';
		ctx.fillText(yLabel, this.yAxisCanvas.height/2, 0);
		ctx.restore();
	};

	//initialize
	this.makeElements();
	this.setUpCanvas();
	this.setUpForm();
}
