'use strict';
/* eslint-env browser */
(function () {
	'use strict';

	// Check to make sure service workers are supported in the current browser,
	// and that the current page is accessed from a secure origin. Using a
	// service worker from an insecure origin will trigger JS console errors. See
	// http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
	var isLocalhost = Boolean(window.location.hostname === 'localhost' || 
	// [::1] is the IPv6 localhost address.
	window.location.hostname === '[::1]' || 
	// 127.0.0.1/8 is considered localhost for IPv4.
	window.location.hostname.match(
	/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));

	if ('serviceWorker' in navigator && (
	window.location.protocol === 'https:' || isLocalhost)) {
		navigator.serviceWorker.register('service-worker.js').
		then(function (registration) {
			// updatefound is fired if service-worker.js changes.
			registration.onupdatefound = function () {
				// updatefound is also fired the very first time the SW is installed,
				// and there's no need to prompt for a reload at that point.
				// So check here to see if the page is already controlled,
				// i.e. whether there's an existing service worker.
				if (navigator.serviceWorker.controller) {
					// The updatefound event implies that registration.installing is set:
					// https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
					var installingWorker = registration.installing;

					installingWorker.onstatechange = function () {
						switch (installingWorker.state) {
							case 'installed':
								// At this point, the old content will have been purged and the
								// fresh content will have been added to the cache.
								// It's the perfect time to display a "New content is
								// available; please refresh." message in the page's interface.
								break;

							case 'redundant':
								throw new Error('The installing ' + 
								'service worker became redundant.');

							default:
							// Ignore
						}};}};}).



		catch(function (e) {
			console.error('Error during service worker registration:', e);});}



	/**
	 * Set up Vapor Dashboard Application
	 */
	$(document).ready(function () {

		var mapStyle = [
		{
			"featureType": "administrative",
			"elementType": "geometry.fill",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "administrative",
			"elementType": "labels",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "administrative.country",
			"elementType": "geometry.stroke",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "administrative.province",
			"elementType": "geometry.stroke",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "landscape",
			"elementType": "geometry",
			"stylers": [
			{
				"visibility": "on" },

			{
				"color": "#dbe1e6" }] },



		{
			"featureType": "landscape.natural",
			"elementType": "labels",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "poi",
			"elementType": "all",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "road",
			"elementType": "all",
			"stylers": [
			{
				"color": "#cccccc" },

			{
				"visibility": "off" }] },



		{
			"featureType": "road",
			"elementType": "labels",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "transit",
			"elementType": "labels.icon",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "transit.line",
			"elementType": "geometry",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "transit.line",
			"elementType": "labels.text",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "transit.station.airport",
			"elementType": "geometry",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "transit.station.airport",
			"elementType": "labels",
			"stylers": [
			{
				"visibility": "off" }] },



		{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
			{
				"color": "#FFFFFF" }] },



		{
			"featureType": "water",
			"elementType": "labels",
			"stylers": [
			{
				"visibility": "off" }] }];

		// Create a LatLng object for the Google map.
		var mapCenter = new google.maps.LatLng(0, 0);

		// Configure Google Maps map instance
		var map = new google.maps.Map(document.getElementById('map'), {
			center: mapCenter,
			zoom: 1,
			disableDefaultUI: true,
			styles: mapStyle
		});


		// "import" Classes
		var socketConnection = new SocketConnection('ws://vapor-dashboard.herokuapp.com/updates');
		var ipLookup = new IpLookup();
		var visitorMarker = new VisitorMarker();
		var githubStatistics = new Statistics('vapor');
		var commitChart = new CommitChart();

		// Connect to the websocket server
		socketConnection.connect();

		// Start listening for events sent from the server
		socketConnection.connection.onmessage = function(e) {

			console.info(JSON.parse(e.data));

			var msg = JSON.parse(e.data);

			switch (msg.type) {
				case 'stars':
					_setStargazers(msg.count);
					break;
				case 'visit':
					_createVisitorMarker(map, msg, msg.ip);
					break;
			}
		};

		githubStatistics.getRepositoryStatistics()
			.done(function (response) {
				var data = response.data;
				_setStargazers(data.stars);
				_setWatchers(data.watchers);
				_setLatestRelease(data.latest_release.tag_name, data.latest_release.published);
				_createChart(data.commits_per_week);
			})
			.fail(function (error) {
				console.error(error);
			});

		// Set up the Chart
		var chartCtx = $('#commits');
		var chart;
		// Configure global chart options
		$.extend(Chart.defaults.global, {
			defaultFontColor: '#777777',
			defaultFontFamily: 'Quicksand',
			maintainAspectRatio: false,
			legend: {
				display: false
			}
		});

		// Helper methods
		function _setStargazers(count) {
			$('#starGazers .output').text(count);
			if ($('#starGazers .output').hasClass('loading')) {
				$('#starGazers .output').removeClass('loading');
			}
		}

		function _setWatchers(count) {
			$('#watchers .output').text(count);
			if ($('#watchers .output').hasClass('loading')) {
				$('#watchers .output').removeClass('loading');
			}
		}

		function _setLatestRelease(tagName, publishedDate) {

			var date = _formatDate(new Date(publishedDate));

			$('#latestRelease .output').text(tagName);
			$('#latestRelease .dateOutput').text(date);

			if ($('#latestRelease .output').hasClass('loading')) {
				$('#latestRelease .output').removeClass('loading');
			}
		}



		function _createChart(dataset) {
			var labels = commitChart.generateLabels(dataset);
			var data = commitChart.generateDataset(dataset);

			chart = new Chart(chartCtx, {
				type: 'line',
				data: {
					labels: labels,
					datasets: data
				}
			});
		}

		function _createVisitorMarker(map, data, ip) {

			ipLookup.getIp(ip)
				.done(function (result) {
					var m = visitorMarker.create(map, result.data);
					setTimeout(() => {

						m.setMap(null);
						m = undefined;

					}, 9000);
				});
		}

		function _formatDate(date) {
			var d = date.getDate();
			var m = date.getMonth() + 1;
			var y = date.getFullYear();
			return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
		}
		
	});
})();