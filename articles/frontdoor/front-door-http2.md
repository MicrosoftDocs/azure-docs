---
title: HTTP/2 support in Azure Front Door
description: Learn how Azure Front Door uses HTTP/2 for client connections and gRPC origin connections, and how multiplexing and compression improve web performance.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/05/2026
---

# HTTP/2 support in Azure Front Door

Azure Front Door supports HTTP/2 for client connections on all configurations. You don't need to take any extra action to enable it.

HTTP/2 is a significant update to HTTP/1.1, offering faster web performance by reducing response times. It retains the familiar HTTP methods, status codes, and semantics of HTTP/1.1 to enhance user experience. Although HTTP/2 works with both HTTP and HTTPS, many web browsers only support HTTP/2 over Transport Layer Security (TLS).

> [!NOTE]
> For routes without gRPC enabled, Azure Front Door uses HTTP/1.1 to communicate with origins. During the public preview, gRPC-enabled routes in Azure Front Door Standard and Premium use HTTPS and HTTP/2 for both client-to-Front Door and Front Door-to-origin connections. For configuration and limitations, see [gRPC support in Azure Front Door (preview)](grpc.md).

## Benefits of HTTP/2

HTTP/2 offers several benefits:

- **Multiplexing and concurrency**: Unlike HTTP/1.1, which requires multiple TCP connections for multiple resource requests, HTTP/2 allows multiple resources to be requested over a single TCP connection, reducing performance costs.

- **Header compression**: Compressing HTTP headers for served resources reduces the amount of data sent over the network.

- **Stream dependencies**: Clients can indicate resource priorities to the server, optimizing resource loading.

## Browser support for HTTP/2

All major browsers support HTTP/2 in their current versions. Browsers that don't support HTTP/2 automatically revert to HTTP/1.1.

| Browser         | Minimum version |
|-----------------|-----------------|
| Microsoft Edge  | 12              |
| Google Chrome   | 43              |
| Mozilla Firefox | 38              |
| Opera           | 32              |
| Safari          | 9               |

## Next steps

To learn more about HTTP/2, visit the following resources:

- [HTTP/2 specification homepage](https://http2.github.io/)
- [Official HTTP/2 FAQ](https://http2.github.io/faq/)
- Learn how to [create an Azure Front Door profile](create-front-door-portal.md)
- Learn [how Front Door works](front-door-routing-architecture.md)
