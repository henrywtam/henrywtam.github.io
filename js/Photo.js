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