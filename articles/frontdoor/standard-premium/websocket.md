---
title: WebSocket
titleSuffix: Azure Front Door 
description: This article describes how WebSocket work on Azure Front Door for real-time bidirectional communication between a server and client over a long running TCP connection.
author: halkazwini
ms.author: yuajia
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 07/17/2026
---

# Azure Front Door WebSocket

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Azure Front Door supports WebSocket on both Standard and Premium tiers without requiring any extra configurations. WebSocket, standardized in [RFC6455](https://tools.ietf.org/html/rfc6455), is a TCP-based protocol that facilitates full-duplex communication between a server and a client over a long-running TCP connection. It eliminates the need for polling as required in HTTP and avoids some of the overhead of HTTP. It can reuse the same TCP connection for multiple requests or responses, resulting in a more efficient utilization of resources. This efficiency enables more interactive and real-time scenarios.

WebSocket is ideal for applications needing real-time updates or continuous data streams, such as chat apps, dashboards, financial updates, GPS, online education, live streaming, and gaming. For instance, a trading website can use WebSocket to push and update pricing data in real-time.

> [!Note]
> Front Door doesn't support Server-Sent Events (SSE).

## Use WebSocket on Azure Front Door

When using WebSocket on Azure Front Door, consider the following points:

- After upgrading a connection to WebSocket, Azure Front Door transmits data between clients and the origin server without performing any inspections or manipulations during the established connection.
- Web Application Firewall (WAF) inspections are applied during the WebSocket establishment phase. After the connection is established, the WAF doesn't perform further inspections.
- Azure Front Door uses the HTTP protocol to probe the health of origins.
- Disable caching for WebSocket routes. For routes with caching enabled, Azure Front Door doesn't forward the WebSocket Upgrade header to the origin and treats it as an HTTP request, disregarding cache rules. This behavior results in a failed WebSocket upgrade request.
- The idle timeout is five minutes. If Azure Front Door doesn't detect any data transmission from the origin or the client within the past five minutes, the connection is considered idle and is closed.
- Currently, WebSocket connections on Azure Front Door remain open for no longer than two hours. The WebSocket connection can be dropped due to underlying server upgrades or other maintenance activities. Implement retry logic in your application.
- Currently, each Azure Front Door profile supports up to 3,000 concurrent global connections. For more information, see [Azure Front Door Standard and Premium service limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-standard-and-premium-service-limits).

## How the WebSocket protocol works

WebSocket protocols use port 80 for standard WebSocket connections and port 443 for WebSocket connections over TLS/SSL. As a stateful protocol, the connection between clients and the server remains active until terminated by either party. WebSocket connections begin as an HTTP Upgrade request with the `ws:` or `wss:` scheme. You establish these connections by upgrading an HTTP request/response using the `Connection: Upgrade`, `Upgrade: websocket`, `Sec-WebSocket-Key`, and `Sec-WebSocket-Version` headers, as shown in the request header examples.

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

The server responds with a `101 Switching Protocols` status code to indicate that it's switching to the WebSocket protocol as requested by the client. The response includes the `Connection: Upgrade` and `Upgrade: websocket` headers, confirming the protocol switch. The `Sec-WebSocket-Accept` header is returned to validate that the connection was successfully upgraded.

The handshake from the server looks as follows:

```
    HTTP/1.1 101 Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
    Sec-WebSocket-Protocol: chat
```

After the client receives the server response, the WebSocket connection is open to start transmitting data. If the WebSocket connection gets disconnected by the client or server, or by a network disruption, the client application is expected to reinitiate the connection with the server.

## Related content

- [Create an Azure Front Door profile](../create-front-door-portal.md)
- [Routing architecture overview](../front-door-routing-architecture.md?pivots=front-door-standard-premium)
- [Health probes](../health-probes.md)

