class IpLookup {
	constructor(){
		this.url = 'https://nstack.io/api/v1/geographic/ip-address';
		this.appId = 'u1tpiqjsw9723OinSJCm0eb1iuddcKgcxb6J';
		this.apiKey = '3vILZNUK8bt4IIUDJHf3IMqtCzJ6inBWgFV7';
	};

	getIp(ip) {
		return $.ajax({
			url: this.url,
			headers: {
				'X-Application-Id': this.appId,
				'X-Rest-Api-Key': this.apiKey
			},
			data: {
				ip: ip
			}
		});
	}
}