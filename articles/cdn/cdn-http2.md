---
title: HTTP/2 support in Azure Content Delivery Network
description: Azure Content Delivery Network supports HTTP/2, which has benefits over HTTP/1, such as multiplexing and concurrency, header compression, and stream dependencies.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: article
ms.date: 03/20/2024
ms.author: duau
---

# HTTP/2 Support in Azure Content Delivery Network

HTTP/2 is a major revision to HTTP/1.1\. This technology delivers enhanced web performance, diminished response time, and an elevated user experience, all the while preserving the customary HTTP methods, status codes, and semantics. Though HTTP/2 is designed to work with HTTP and HTTPS, many client web browsers only support HTTP/2 over TLS (Transport Layer Security).

### HTTP/2 Benefits

The benefits of HTTP/2 include:

- **Multiplexing and concurrency**

    Using HTTP 1.1, making multiple resource requests requires multiple TCP connections, and each connection has performance overhead associated with it. HTTP/2 allows multiple resources to be requested on a single TCP connection.

- **Header compression**

    By compressing the HTTP headers for served resources, time on the wire is reduced significantly.

- **Stream dependencies**

    Stream dependencies allow the client to indicate to the server which resources have priority.

## HTTP/2 Browser Support

All major browsers implement HTTP/2 support in their current versions. Browsers that don't support it automatically falls back to HTTP/1.1.

|Browser|Minimum Version|
|-------------|------------|
|Microsoft Edge| 12|
|Google Chrome| 43|
|Mozilla Firefox| 38|
|Opera| 32|
|Safari| 9|

## Enabling HTTP/2 Support in Azure CDN

Currently, HTTP/2 support is active for all Azure CDN profiles. No further action is required from customers.

## Next Steps

To learn more about HTTP/2, visit the following resources:

- [HTTP/2 specification homepage](https://http2.github.io/)
- [Official HTTP/2 FAQ](https://http2.github.io/faq/)

To learn more about Azure CDN's available features, see the [Azure CDN Overview](./cdn-overview.md).
