API_key = "44f97a9319af01c8ed8107fc731c7aac";

(function() {

	function Slackr() {
		this.album = document.getElementById("slackr"),
		this.slideshow = document.getElementById("slideshow"),
		this.currentSlideImg = document.getElementById("slide-img"),
		this.currentSlideTitle = document.getElementById("slide-title"),
		this.currentSlideIndex,
		this.photosArr = [], // Array of photo ids to keep order
		this.photosMap = {} // Map of photo ids to photo objs

		this.init();
	}

	Slackr.prototype = {
		init: function(searchTerm) {
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
		getJSON: function(url) {
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open("GET", url);

				request.onload = function() {
					if (request.status == 200) {
						resolve(request.response);
					} else {
						reject(Error(request.statusText));
					}
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
		},
		buildApilUrl: function(searchTerm) {
			searchTerm = searchTerm || "puppies";
			return `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_key}&tags=${searchTerm}&per_page=10&format=json&nojsoncallback=?`;
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
			paragraph.innerText = photo.title;

			div.appendChild(img);
			div.appendChild(paragraph);
			return div;
		},
		openModal: function(photoId) {
			var currentPhoto = this.photosMap[photoId];
			this.currentSlideImg.src = currentPhoto.buildSlideImageUrl();
			this.currentSlideTitle.innerText = currentPhoto.title;
			this.currentSlideIndex = this.photosArr.indexOf(photoId);
			this.slideshow.style.display = "block";
		},
		closeModal: function() {
			this.currentSlideImg.src = "";
			this.currentSlideTitle.innerText = "";
			this.slideshow.style.display = "none";
		},
		nextSlide: function() {
			this.currentSlideIndex++;
			if (this.currentSlideIndex == this.photosArr.length) this.currentSlideIndex = 0;

			var nextPhoto = this.photosMap[this.photosArr[this.currentSlideIndex]];
			this.currentSlideImg.src = nextPhoto.buildSlideImageUrl();
			this.currentSlideTitle.innerText = nextPhoto.title;
		},
		prevSlide: function() {
			this.currentSlideIndex--;
			if (this.currentSlideIndex == -1) this.currentSlideIndex = this.photosArr.length - 1;

			var prevPhoto = this.photosMap[this.photosArr[this.currentSlideIndex]];
			this.currentSlideImg.src = prevPhoto.buildSlideImageUrl();
			this.currentSlideTitle.innerText = prevPhoto.title;
		}
	};

	function Photo(photo) {
		this.id = photo.id;
		this.farm = photo.farm;
		this.server = photo.server;
		this.secret = photo.secret;
		this.title = photo.title;
	}

	Photo.prototype = {
		buildAlbumImageUrl: function() {
			return `https://farm${this.farm}.staticflickr.com/${this.server}/${this.id}_${this.secret}_q.jpg`;
		},
		buildSlideImageUrl: function() {
			return `https://farm${this.farm}.staticflickr.com/${this.server}/${this.id}_${this.secret}_b.jpg`;
		}
	}

	document.addEventListener("DOMContentLoaded", function() {
		var slackr = new Slackr();

		slackr.album.addEventListener("click", function() {
			var photoId = event.srcElement.getAttribute("data-id");

			if (photoId) {
				slackr.openModal(photoId);
			}
		});

		slackr.slideshow.addEventListener("click", function() {
			var classList = event.target.classList;

			if (classList.contains("next-button")) {
				slackr.nextSlide();
			} else if (classList.contains("prev-button")) {
				slackr.prevSlide();
			} else if (classList.contains("slide-img") || classList.contains("slide-title")) {
				return;
			} else {
				slackr.closeModal();
			}
		})
	});

})();