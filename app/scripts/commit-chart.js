"use strict";

class CommitChart {
	constructor() {

	}

	generateLabels(data) {
		var labels = [];

		var i = data.length;
		var _i = -1;

		for(; i >= 0; i--) {

			_i++;
			var date = moment().subtract(_i, 'weeks');

			if(data[i] > 0) {
				labels.unshift('Week ' + (date.isoWeek() + 1))
			}
		}

		return labels;
	}

	generateDataset(data) {

		var datasets = [];

		datasets.push({
			label: 'Commits per week',
			data: [],
			fill: false,
			lineTension: 0.1,
			backgroundColor: "#f6cfcf",
			borderColor: "#f6cfcf",
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: "#f6cfcf",
			pointBackgroundColor: "#fff",
			pointBorderWidth: 1,
			pointHoverRadius: 5,
			pointHoverBackgroundColor: "#f6cfcf",
			pointHoverBorderColor: "rgba(220,220,220,1)",
			pointHoverBorderWidth: 2,
			pointRadius: 1,
			pointHitRadius: 10
		});


		data.forEach(function (d, i) {
			if(d > 0) {
				datasets[0].data.push(d);
			}
		});

		return datasets;
	}

	_getCurrentWeekNumber(dateObj) {
		var date = new Date(dateObj.getTime());
		date.setHours(0,0,0,0);
		// Thursday in current week decides the year.
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		// January 4 is always in week 1.
		var week1 = new Date(date.getFullYear(), 0, 4);
		// Adjust to Thursday in week 1 and count number of weeks from date to week1.
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
	}
}