---
title: 'Azure Front Door WebSocket'
description: This article describes how WebSocket work on Azure Front Door for real-time bidirectional communication between a server and client over a long running TCP connection.
services: front-door
author: jessie-jyy
ms.author: duau
manager: KumudD
ms.date: 11/05/2023
ms.topic: Conceptual
ms.service: azure-frontdoor
---

# Azure Front Door WebSocket

Azure Front Door supports WebSocket on Standard and Premium SKUs without customer configurations.

WebSocket, standardized in [RFC6455](https://tools.ietf.org/html/rfc6455), is a TCP-based protocol that facilitates full-duplex communication between a server and a client over a long running TCP connection. 

It eliminate the needs for polling as required in HTTP and avoids some of the overhead of HTTP, and can reuse the same TCP connection for multiple request/responses resulting in a more efficient utilization of resources. This enables more interactive and real-time scenarios.

WebSocket can be used for apps or websites which require real-time updates/communications or continuous streams of data, such as chats, dashboard, finance stock info update, GPS, online education, live streaming and game apps. For example, in a trading website, pricing fluctuation and movement data is constantly pushed and updated by the server to the clients via WebSocket.

## Use WebSocket on Azure Front Door

WebSocket is natively support on Azure Front Door Standard and Premium without extra configurations. To use WebSocket on Azure Front Door, take the following into considerations.

- After a connection is upgraded to WebSocket, Azure Front Door simply send the data from clients to origin server or vice versa. It doesn't perform any inspections or manipulations during the establsihed connection.
- WAF inspections are applied in the WebSocket establishment phase, once a connection has been established the WAF does not perform any further inspections.
- Health probes to origins originate using HTTP protocol.
- Please disable cache for WebSocket routes. For routes with caching enabled, Azure Front Door will not forward the WebSocket Upgrade header to the origin and treat it as an HTTP request to origin without honoring cache rules. The request will fail as WebSocket upgrade fails. 
- Idle Timeout is 5 min. If Front Door hasn’t detected any bytes sent from the origin or the client within the past 5 minutes, the connection is assumed to be idle and is closed.
- Currently WebSocket connections on Front Door remain open no longer than 4 hours. The WebSocket connection might be dropped due to underlying server upgrade and other maintenance reasons. It is highly recommended to have retry logic in the client behavior.


## How the WebSocket protocol works

WebSocket protocols are uses port 80 for WebSocket connections and port 443 for WebSocket connections over TLS/SSL. 

It is a stateful protocol, which means the connection between clients and server will stay alive until it is terminated by one party.

WebSocket begins its life as an HTTP Upgrade request with ws: or wss: scheme. WebSocket connections are established by upgrading an HTTP request/response using the `Connection:Upgrade` and `Upgrade:websocket`, `Sec-WebSocket-Key` and `Sec-webSocket-Version` headers in the above request header examples. 

The handshake from the client looks as follows:

```
    GET /chat HTTP/1.1
    Host: server.example.com
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
    Origin: http://example.com
    Sec-WebSocket-Protocol: chat, superchat
    Sec-WebSocket-Version: 13
```

The handshake from the server returns the status code `101 Switching Protocols` to indicate it is switching to the protocol the client has requested over the Upgrade request header. The server also returns the `Connection:Upgrade` and `Upgrade:websocket`, and the `Sec-WebSocket-Accept` headers to validate the connection was successfully upgraded.  

The handshake from the server looks as follows:
```
    HTTP/1.1 101 Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
    Sec-WebSocket-Protocol: chat
```
After the client receives the server response, the WebSocket connection is open to start transmitting data.

If the WebSocket connection is disconnected by the client or server, or by a network disruption, client applications are expected to re-initiate the connection with the server.