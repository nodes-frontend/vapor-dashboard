class VisitorMarker {
	constructor() {}

	create(map, data) {
		var html = [
			'<svg class="ripple" height="100" width="100">',
			'<circle class="circle circle-1" cx="50" cy="50" r="0" stroke-width="2" fill="transparent"></circle>',
			'<circle class="circle circle-2" cx="50" cy="50" r="0" stroke-width="2" fill="transparent"></circle>',
			'<circle class="circle circle-3" cx="50" cy="50" r="0" stroke-width="2" fill="transparent"></circle>',
			'</svg>'].
		join('');

		var markerPosition = new google.maps.LatLng(data.lat, data.lng);

		return new RichMarker({
			map: map,
			position: markerPosition,
			content: html,
			shadow: false,
			flat: true,
			clickable: false,
			draggable: false,
			anchor: RichMarkerPosition.MIDDLE
		});
	}
}