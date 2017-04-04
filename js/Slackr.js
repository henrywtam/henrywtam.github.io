const API_key = "44f97a9319af01c8ed8107fc731c7aac";

(function() {

	function Slackr() {
		this.initProps();
		this.loadPhotos();
		this.addEventListeners();
	}

	Slackr.prototype = {
		initProps: function() {
			this.spinner = document.getElementById("spinner"),
			this.album = document.getElementById("album"),
			this.slideshow = document.getElementById("slideshow"),
			this.currentSlide = document.getElementById("slide"),
			this.currentSlideImg = document.getElementById("slide-img"),
			this.currentSlideTitle = document.getElementById("slide-title"),
			this.currentSlideIndex,
			this.photosArr = [], // Array of photo ids to keep order
			this.photosMap = {} // Map of photo ids to photo objs
		},
		loadPhotos: function(searchTerm) {
			var self = this,
				url = this.buildApilUrl(searchTerm);

			this.getJSON(url)
				.then(function(result) {
					var photos = JSON.parse(result).photos.photo;
					self.setUp(photos);
				})
				.catch(function(error) {
					throw error;
				});
		},
		addEventListeners: function() {
			this.album.addEventListener("click", function(event) {
				var photoId = event.srcElement.getAttribute("data-id");
				if (photoId) this.openModal(photoId);
			}.bind(this));

			this.slideshow.addEventListener("click", function(event) {
				var classList = event.target.classList;

				if (classList.contains("next-button")) {
					this.nextSlide();
				} else if (classList.contains("prev-button")) {
					this.prevSlide();
				} else if (classList.contains("slide-img") || classList.contains("slide-title")) {
					return;
				} else {
					this.closeModal();
				}
			}.bind(this));

			document.onkeydown = function(event) {
				switch (event.keyCode) {
					case 37:
						if (this.currentSlideIndex != undefined) this.prevSlide();
						break;
					case 39:
						if (this.currentSlideIndex != undefined) this.nextSlide();
						break;
					case 27:
						if (this.currentSlideIndex != undefined) this.closeModal();
						break;
				}
			}.bind(this);
		},
		getJSON: function(url) {
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open("GET", url);

				request.onload = function() {
					request.status == 200 ? resolve(request.response) : reject(Error(request.statusText));
				}

				request.onerror = function() { reject(Error("Network Error")); }
				request.send();
			});
		},
		setUp: function(photos) {
			for (var photo of photos) {
				var photoObj = new Photo(photo);
				this.photosArr.push(photoObj.id);
				this.photosMap[photoObj.id] = photoObj;

				var polaroid = this.buildPolaroid(photoObj);
				this.album.appendChild(polaroid);
			};
			setTimeout(function(){
				this.spinner.style.display = "none";
				this.album.style.display = "block";
			}, 2000);
		},
		buildApilUrl: function(searchTerm) {
			searchTerm = searchTerm || "puppies";
			return `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_key}&tags=${searchTerm}&per_page=50&format=json&nojsoncallback=?`;
		},
		buildPolaroid: function(photo) {
			var div = document.createElement("div");
			div.classList.add("polaroid");
			div.addEventListener("mouseenter", function() { this.classList.toggle("hovering"); });
			div.addEventListener("mouseout", function() { this.classList.toggle("hovering"); });

			var img = document.createElement("img");
			img.src = photo.buildAlbumImageUrl();
			img.dataset.id = photo.id;

			var paragraph = document.createElement("p");
			paragraph.dataset.title = photo.title;

			div.appendChild(img);
			div.appendChild(paragraph);
			return div;
		},
		openModal: function(photoId) {
			var currentPhoto = this.photosMap[photoId];
			this.currentSlideImg.src = currentPhoto.buildSlideImageUrl();
			this.currentSlideTitle.innerText = currentPhoto.title;
			this.currentSlideIndex = this.photosArr.indexOf(photoId);
			setTimeout(function() { this.slideshow.style.display = "block"; }, 250);
		},
		closeModal: function() {
			this.currentSlideIndex = undefined;
			this.currentSlideImg.src = "";
			this.currentSlideTitle.innerText = "";
			this.slideshow.style.display = "none";
		},
		nextSlide: function() {
			this.hideSlide();
			this.currentSlideIndex++;
			if (this.currentSlideIndex == this.photosArr.length) { this.currentSlideIndex = 0; }

			var nextPhoto = this.photosMap[this.photosArr[this.currentSlideIndex]];
			this.showSlide(nextPhoto);
		},
		prevSlide: function() {
			this.hideSlide();
			this.currentSlideIndex--;
			if (this.currentSlideIndex == -1) { this.currentSlideIndex = this.photosArr.length - 1; }

			var prevPhoto = this.photosMap[this.photosArr[this.currentSlideIndex]];
			this.showSlide(prevPhoto);
		},
		hideSlide: function() {
			this.currentSlide.style.display = "none";
			this.spinner.style.display = "block";
		},
		showSlide: function(photo) {
			this.currentSlideImg.src = photo.buildSlideImageUrl();
			this.currentSlideTitle.innerText = photo.title;
			setTimeout(function() {
				this.currentSlide.style.display = "block";
				this.spinner.style.display = "none";
			}.bind(this), 750);
		}
	};

	document.addEventListener("DOMContentLoaded", function() {
		var slackr = new Slackr();
	});
})();