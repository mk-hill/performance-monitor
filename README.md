# Performance Monitor

Monitor network connection, uptime, and resource usage for multiple devices from one dashboard. Customize setup using environment variables or leave as-is to test locally.

<p align="center">
  <img src="./demo.gif" alt="demo"/>
</p>

## How to use

TLDR:

- Install dependencies
- Run monitor on device(s) you want to monitor
- Run server wherever you please
- Deploy dashboard and view from anywhere

### Monitor

Node client which sends local performance data to the server. `npm start` on devices you want to monitor.

Customization:

- UPDATE_INTERVAL: interval between each update sent to server in ms, defaults to 1000
- SERVER_URL: defaults to localhost, change if you've deployed the server elsewhere
- MONITOR_KEY: not required unless set in server, see details below

Dependencies:

- [socket.io-client](https://www.npmjs.com/package/socket.io-client)

### Dashboard

React client to view status of all connected devices. `npm build` and deploy using your [preferred](https://www.netlify.com/) [service](https://surge.sh/), or `npm start` to test locally.

Will display all monitors the server has received data from (and authenticated, if applicable) since the start of the session. Devices which go offline will be labeled, and will automatically resume updating when they come online again.

Customization:

- REACT_APP_TIMEOUT: number of ms to allow for latency before a device is presumed offline, defaults to 2000
- REACT_APP_SERVER_URL: assumes localhost unless specified otherwise
- REACT_APP_DASHBOARD_KEY: not required unless set in server, see details below

Dependencies:

- [react](https://www.npmjs.com/package/react)
  - [react-dom](https://www.npmjs.com/package/react-dom)
  - [react-scripts](https://www.npmjs.com/package/react-scripts)
- [socket.io-client](https://www.npmjs.com/package/socket.io-client)
- [styled-components](https://www.npmjs.com/package/styled-components)

### Server

Receives performance data from all (authenticated) monitors, sends to all (authenticated) dashboards. `npm start` on desired machine. Uses Node.js [Clusters](https://nodejs.org/api/cluster.html#cluster_cluster) to take advantage of multiple cores and allow handling of large numbers of Monitors and/or Dashboards.

Will allow all Dashboard and Monitor connections by default. Set keys and match them in your respective clients for rudimentary authentication.

Customization:

- PORT: port number the server will listen on. 8080 by default.
- MONITOR_KEY: set a string to use for Monitor authentication if desired
- DASHBOARD_KEY: as above, for Dashboard connection attempts

Dependencies:

- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [express](https://www.npmjs.com/express)
- [farmhash](https://www.npmjs.com/farmhash)
- [mongoose](https://www.npmjs.com/mongoose)
- [socket.io](https://www.npmjs.com/socket.io)
- [socket.io-redis](https://www.npmjs.com/socket.io-redis)
