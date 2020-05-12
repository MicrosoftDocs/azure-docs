---
title: Protocol support for HTTP headers in Azure Front Door | Microsoft Docs
description: This article describes HTTP header protocols that Front Door supports.
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

# Protocol support for HTTP headers in Azure Front Door
This article outlines the protocol that Front Door supports with parts of the call path (see image). The following sections provide more information about HTTP headers supported by Front Door.

![Azure Front Door HTTP headers protocol][1]

>[!IMPORTANT]
>Front Door doesn't certify any HTTP headers that aren't documented here.

## Client to Front Door
Front Door accepts most headers from the incoming request without modifying them. Some reserved headers are removed from the incoming request if sent, including headers with the X-FD-* prefix.

## Front Door to backend

Front Door includes headers from an incoming request unless removed because of restrictions. Front Door also adds the following headers:

| Header  | Example and description |
| ------------- | ------------- |
| Via |  Via: 1.1 Azure </br> Front Door adds the client's HTTP version followed by *Azure* as the value for the Via header. This header indicates the client's HTTP version and that Front Door was an intermediate recipient for the request between the client and the backend.  |
| X-Azure-ClientIP | X-Azure-ClientIP: 127.0.0.1 </br> Represents the client IP address associated with the request being processed. For example, a request coming from a proxy might add the X-Forwarded-For header to indicate the IP address of the original caller. |
| X-Azure-SocketIP |  X-Azure-SocketIP: 127.0.0.1 </br> Represents the socket IP address associated with the TCP connection that the current request originated from. A request's client IP address might not be equal to its socket IP address because it can be arbitrarily overwritten by a user.|
| X-Azure-Ref |  X-Azure-Ref: 0zxV+XAAAAABKMMOjBv2NT4TY6SQVjC0zV1NURURHRTA2MTkANDM3YzgyY2QtMzYwYS00YTU0LTk0YzMtNWZmNzA3NjQ3Nzgz </br> A unique reference string that identifies a request served by Front Door. It's used to search access logs and critical for troubleshooting.|
| X-Azure-RequestChain |  X-Azure-RequestChain: hops=1 </br> A header that Front Door uses to detect request loops, and users should not take a dependency on it. |
| X-Forwarded-For | X-Forwarded-For: 127.0.0.1 </br> The X-Forwarded-For (XFF) HTTP header field often identifies the originating IP address of a client connecting to a web server through an HTTP proxy or load balancer. If there's an existing XFF header, then Front Door appends the client socket IP to it or adds the XFF header with the client socket IP. |
| X-Forwarded-Host | X-Forwarded-Host: contoso.azurefd.net </br> The X-Forwarded-Host HTTP header field is a common method used to identify the original host requested by the client in the Host HTTP request header. This is because the host name from Front Door may differ for the backend server handling the request. |
| X-Forwarded-Proto | X-Forwarded-Proto: http </br> The X-Forwarded-Proto HTTP header field is often used to identify the originating protocol of an HTTP request because Front Door, based on configuration, might communicate with the backend by using HTTPS. This is true even if the request to the reverse proxy is HTTP. |
| X-FD-HealthProbe | X-FD-HealthProbe HTTP header field is used to identify the health probe from Front Door. If this header set to 1, the request is health probe. You can use when want to strict access from particular Front Door with X-Forwarded-Host header field. |

## Front Door to client

Any headers sent to Front Door from the backend are also passed through to the client. The following are headers sent from Front Door to clients.

| Header  | Example |
| ------------- | ------------- |
| X-Azure-Ref |  *X-Azure-Ref: 0zxV+XAAAAABKMMOjBv2NT4TY6SQVjC0zV1NURURHRTA2MTkANDM3YzgyY2QtMzYwYS00YTU0LTk0YzMtNWZmNzA3NjQ3Nzgz* </br> This is a unique reference string that identifies a request served by Front Door. This is critical for troubleshooting as it's used to search access logs.|

## Next steps

- [Create a Front Door](quickstart-create-front-door.md)
- [How Front Door works](front-door-routing-architecture.md)

<!--Image references-->
[1]: ./media/front-door-http-headers-protocol/front-door-protocol-summary.png
