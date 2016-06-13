"use strict";

class CommitChart {
	constructor() {

	}

	generateLabels(data) {
		var labels = [];

		data.forEach(function (d, i) {
			if(d > 0) {
				labels.push(i + 1);
			}
		});


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
}