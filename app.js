(function(window){
	var doc = window.document,
			nav = window.navigator,
			URL = window.URL || window.webkitURL;

	var dropZone = doc.querySelector('#dropZone'),
			uploadBtn = doc.querySelector('#upload'),
			preview = doc.querySelector('#preview');

	dropZone.ondragenter = dropZone.ondragover = function(e){
		e.stopPropagation();
		e.preventDefault();
	};

	dropZone.ondrop = function(e){
		e.stopPropagation();
		e.preventDefault();

		var files = e.dataTransfer.files;
		generatePreview(files);
	};

	uploadBtn.addEventListener('click', function(e){
		var imgs = doc.querySelectorAll('.images');

		for(var i = 0; i < imgs.length; i++){
			var img = imgs[i];
			//var file = img.getAttribute('data-file');
			sendFile(img.file);
			//new FileUpload(img, file); // send as binary data using filereader api
		};
	}, false);

	function generatePreview(files){
		if(!files.length){
			preview.innerHTML = "<p>No files selected</p>";
		} else {
			var list = doc.createElement('ul');
			for(var i = 0; i < files.length; i++){
				var li = doc.createElement('li');
				list.appendChild(li);

				var img = new Image();
				img.classList.add('images');
				//img.setAttribute('data-file', files[i]);
				img.file = files[i];
				li.appendChild(img);

				/** Object URL method **
				img.src = URL.createObjectURL(files[i]);
				img.onload = function(e){
					URL.revokeObjectURL(this.src);
				};
				// End of Object url method
				*/

				/** FileReader Method **/
				var reader = new FileReader();
				reader.onload = (function(img){
					return function(e){
						img.src = e.target.result;
					};
				}(img));
				reader.readAsDataURL(files[i]);
				/** End of file reader method */

				var info = doc.createElement('div');
				info.classList.add('info');
				info.innerHTML = '<strong>' + files[i].name + ":</strong> " + files[i].type + ", <em>" + files[i].size + '</em>';
				li.appendChild(info);
			}

			preview.replaceChild(list, preview.querySelector('p'));
		}
	}

	/** Send as formdata **/
	function sendFile(file){
		var url = 'upload.php',
				xhr = new XMLHttpRequest(),
				formData = new FormData();

		xhr.open("POST", url, true);
		xhr.onreadystatechange = function(e){
			if(xhr.readyState == 4 && xhr.status == 200){
				console.log(xhr.response);
				//preview.appendChild();
			}
		};

		formData.append("myFile", file);
		xhr.send(formData);
	}

	/** Send file as binary ***/
	function FileUpload(img, file){
		var reader = new FileReader();
		this.ctrl = createThrobber(img);
		xhr = new XMLHttpRequest();
		this.xhr = xhr;

		var self = this;
		this,xhr.upload.addEventListener('progress', function(e){
			if(e.lengthComputable){
				var percent = Math.round((e.loaded * 100) / e.total);
				self.ctrl.update(percent);
			}
		}, false);

		xhr.upload.addEventListener('load', function(e){
			self.ctrl.update(100);
			var canvas = self.ctrl.ctx.canvas;
			canvas.parentNode.removeChild(canvas);
		}, false);

		xhr.open("POST", "/upload.php");
		xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
		reader.onload = function(e){
			xhr.sendAsBinary(e.target.result);
		};
		reader.readAsBinaryString(file);
	}

}(this));