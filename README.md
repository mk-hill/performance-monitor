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
-

### Monitor

Node client which sends local performance data to the server.

#### Customization:

- SERVER_URL: defaults to localhost
- UPDATE_INTERVAL: interval between each update sent to server in ms, defaults to 1000
- MONITOR_KEY: not required unless set in server, see details below

### Dashboard

React client to view status of all connected devices.
