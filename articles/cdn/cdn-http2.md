---
title: HTTP/2 support in Azure CDN | Microsoft Docs
description: Learn about HTTP/2 and CDN support.
services: cdn
documentationcenter: ''
author: lichard
manager: erikre
editor: ''

ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 5/04/2017
ms.author: ril

---

# HTTP/2 Support in Azure CDN

HTTP/2 is a major revision to HTTP/1.1\. It provides faster web performance, reduced response time, and improved user experience, while maintaining the familiar HTTP methods, status codes, and semantics. Though HTTP/2 is designed to work with HTTP and HTTPS, many client web browsers only support HTTP/2 over TLS.

### HTTP/2 Benefits

The benefits of HTTP/2 include:

*   **Multiplexing and concurrency**

    Using HTTP 1.1, making multiple resource requests requires multiple TCP connections, and each connection has performance overhead associated with it. HTTP/2 allows multiple resources to be requested on a single TCP connection.

*   **Header compression**

    By compressing the HTTP headers for served resources, time on the wire is reduced significantly.

*   **Stream dependencies**

    Stream dependencies allow the client to indicate to the server which resources have priority.


## HTTP/2 Browser Support

All of the major browsers have implemented HTTP/2 support in their current versions. Non-supported browsers automatically fallback to HTTP/1.1.

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

To see the benefits of HTTP/2 in action, see [this demo from Akamai](https://http2.akamai.com/demo).

To learn more about HTTP/2, visit the following resources:

*   [HTTP/2 specification homepage](https://http2.github.io/)
*   [Official HTTP/2 FAQ](https://http2.github.io/faq/)
*   [Akamai HTTP/2 information](https://http2.akamai.com/)

To learn more about Azure CDN's available features, see the [Azure CDN Overview](https://azure.microsoft.com/documentation/articles/cdn-overview/).