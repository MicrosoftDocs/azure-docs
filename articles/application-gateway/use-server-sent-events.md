---
title: Using Server-sent events with Application Gateway (Preview)
description: This article provides guidance for using Server-sent events with your Azure Application Gateway.
services: application-gateway
author: jaesoni
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 05/15/2025
ms.author: jaysoni
# Customer intent: "As a cloud architect, I want to configure Server-sent events on Azure Application Gateway, so that I can enable real-time streaming of event data between backend servers and clients efficiently."
---

# Using Server-sent events with Application Gateway (Preview)

Azure Application Gateway offers support for Server-sent events (SSE). This document provides guidelines to ensure the seamless operation of this feature when used with Azure Application Gateway.

> [!Note]
> - The SSE support with Azure Application Gateway is currently in Preview phase.
> - The response time recorded in [Access logs](monitor-application-gateway-reference.md#resource-logs) represents the total duration for which the connection was established. Multiple event streams may pass through during this connection period. 

## Configuring Application Gateway

### Response Buffer 

The [Response Buffers on Application Gateway resource](proxy-buffers.md) should be disabled. This configuration enables your application gateway resource to send responses to clients as streams from the backend server are received.

### Backend Setting - Request timeout 

Ensure that the [Request time-out (seconds) in Backend Settings](configuration-http-settings.md?tabs=backendhttpsettings#request-timeout) is configured to exceed the idle time between events. Otherwise, your application gateway resource terminates the connection prematurely.


## Configuring backend server

The backend server should send the following Response headers to ensure proper stream handling by the clients and any intermediaries. Note, these headers aren't a requirement for Application Gateway as a proxy.

### Content-Type: text/event-stream
This header notifies the client that the response will be a stream of events, enabling them to correctly handle the Server-sent events (SSE) protocol.

### Connection: keep-alive
This header maintains the TCP connection, allowing the backend server to send events to the client continuously.

### Transfer-Encoding: chunked 
This header allows the server to send responses in chunks without requiring a Content-Length header. It's necessary for streaming responses through SSE when the total size can't be determined in advance.

### Cache-Control: no-cache 
It's advisable to use this header to prevent intermediaries like CDNs from caching the SSE response.

## Next steps
Learn about [Request and Response Proxy Buffers](proxy-buffers.md) in Application Gateway.
