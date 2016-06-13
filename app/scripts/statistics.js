class Statistics {
	constructor(repository) {
		this.baseURL = 'https://statistics.like.st/api/github';
		this.repository = repository;
	}

	getRepositoryStatistics() {
		var url = [
			this.baseURL,
			this.repository].
		join('/');

		var ajaxConfig = {
			url: url
		};

		return $.ajax(ajaxConfig);
	}
}