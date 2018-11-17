---
title: Azure Front Door Service - HTTP2 support | Microsoft Docs
description: This article helps you learn about HTTP/2 support in Azure Front Door Service
services: frontdoor
documentationcenter: ''
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/10/2018
ms.author: sharadag
---

# HTTP/2 support in Azure Front Door Service
HTTP/2 is a major revision to HTTP/1.1. It provides faster web performance, reduced response time, and improved user experience, while maintaining the familiar HTTP methods, status codes, and semantics. Though HTTP/2 is designed to work with HTTP and HTTPS, many client web browsers only support HTTP/2 over Transport Layer Security (TLS).

### HTTP/2 benefits

The benefits of HTTP/2 include:

*   **Multiplexing and concurrency**

    Using HTTP 1.1, making multiple resource requests requires multiple TCP connections, and each connection has performance overhead associated with it. HTTP/2 allows multiple resources to be requested on a single TCP connection.

*   **Header compression**

    By compressing the HTTP headers for served resources, time on the wire is reduced significantly.

*   **Stream dependencies**

    Stream dependencies allow the client to indicate to the server which resources have priority.


## HTTP/2 browser support

All of the major browsers have implemented HTTP/2 support in their current versions. Non-supported browsers automatically fallback to HTTP/1.1.

|Browser|Minimum Version|
|-------------|------------|
|Microsoft Edge| 12|
|Google Chrome| 43|
|Mozilla Firefox| 38|
|Opera| 32|
|Safari| 9|

## Enabling HTTP/2 support in Azure Front Door Service

Currently, HTTP/2 support is active for all Front Door configurations. No further action is required from customers.

## Next Steps

To learn more about HTTP/2, visit the following resources:

- [HTTP/2 specification homepage](https://http2.github.io/)
- [Official HTTP/2 FAQ](https://http2.github.io/faq/)
- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
