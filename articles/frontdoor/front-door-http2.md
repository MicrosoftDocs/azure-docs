---
title: HTTP/2 support in Azure Front Door
description: This article helps you learn about HTTP/2 support in Azure Front Door
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 09/28/2020
ms.author: duau
---

# HTTP/2 support in Azure Front Door

Currently, HTTP/2 support is active for all Azure Front Door configurations. No further action is required from customers.

HTTP/2 is a major revision to HTTP/1.1 that provides you with faster web performance by reducing response time. HTTP/2 maintains the familiar HTTP methods, status codes, and semantics of HTTP/1.1 to improve user experience. Although HTTP/2 is designed to work with HTTP and HTTPS, many client web browsers only support HTTP/2 over Transport Layer Security (TLS).

> [!NOTE]
> HTTP/2 protocol support is available only for requests from clients to Front Door. The communication from Front Door to back ends in the back-end pool happens over HTTP/1.1. 

### HTTP/2 benefits

The benefits of HTTP/2 include:

*   **Multiplexing and concurrency**

    Using HTTP 1.1, making multiple resource requests requires multiple TCP connections, and each connection imposes its own performance cost. HTTP/2 allows multiple resources to be requested on a single TCP connection.

*   **Header compression**

    By compressing the HTTP headers for served resources, significantly less data is sent over the wire.

*   **Stream dependencies**

    Stream dependencies allow the client to indicate to the server which resources have priority.


## HTTP/2 browser support

All of the major browsers have implemented HTTP/2 support in their current versions. Non-supported browsers automatically fall back to HTTP/1.1.

|Browser|Minimum Version|
|-------------|------------|
|Microsoft Edge| 12|
|Google Chrome| 43|
|Mozilla Firefox| 38|
|Opera| 32|
|Safari| 9|

## Next Steps

To learn more about HTTP/2, visit the following resources:

- [HTTP/2 specification homepage](https://http2.github.io/)
- [Official HTTP/2 FAQ](https://http2.github.io/faq/)
- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
