---
title: HTTP/2 support in Azure Front Door
description: This article helps you learn about HTTP/2 support in Azure Front Door
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/18/2024
ms.author: duau
---

# HTTP/2 support in Azure Front Door

Currently, HTTP/2 support is enabled for all Azure Front Door configurations, requiring no extra actions.

HTTP/2 is a significant update to HTTP/1.1, offering faster web performance by reducing response times. It retains the familiar HTTP methods, status codes, and semantics of HTTP/1.1 to enhance user experience. Although HTTP/2 works with both HTTP and HTTPS, many web browsers only support HTTP/2 over Transport Layer Security (TLS).

> [!NOTE]
> HTTP/2 protocol support is available only for requests from clients to Front Door. Communication from Front Door to back ends in the back-end pool uses HTTP/1.1.

### Benefits of HTTP/2

HTTP/2 offers several benefits:

* **Multiplexing and concurrency**: Unlike HTTP/1.1, which requires multiple TCP connections for multiple resource requests, HTTP/2 allows multiple resources to be requested over a single TCP connection, reducing performance costs.

* **Header compression**: Compressing HTTP headers for served resources reduces the amount of data sent over the network.

* **Stream dependencies**: Clients can indicate resource priorities to the server, optimizing resource loading.

## Browser Support for HTTP/2

All major browsers support HTTP/2 in their current versions. Browsers that don't support HTTP/2 automatically revert to HTTP/1.1.

| Browser         | Minimum Version |
|-----------------|-----------------|
| Microsoft Edge  | 12              |
| Google Chrome   | 43              |
| Mozilla Firefox | 38              |
| Opera           | 32              |
| Safari          | 9               |

## Next Steps

To learn more about HTTP/2, visit the following resources:

- [HTTP/2 specification homepage](https://http2.github.io/)
- [Official HTTP/2 FAQ](https://http2.github.io/faq/)
- Learn how to [create a Front Door](quickstart-create-front-door.md)
- Learn [how Front Door works](front-door-routing-architecture.md)
