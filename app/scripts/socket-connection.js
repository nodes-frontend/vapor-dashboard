class SocketConnection {
	constructor(socketUrl) {
		this.socketUrl = socketUrl;
		this.connection = null;
	}
	
	connect() {
		this.connection = new WebSocket(this.socketUrl);
	}
}