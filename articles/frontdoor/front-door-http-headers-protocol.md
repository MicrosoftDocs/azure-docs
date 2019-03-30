---
title: Azure Front Door Service - HTTP headers support | Microsoft Docs
description: This article helps you understand the supported HTTP header protocols by Front Door
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

# Azure Front Door Service - HTTP headers support
This document outlines the protocol that Azure Front Door Service supports with various parts of the call path as outlined by the image below. The sections below provide more insight into the HTTP Headers that Front Door supports.

![Azure Front Door Service HTTP headers protocol][1]

>[!WARNING]
>Azure Front Door Service does not provide guarantees on any HTTP headers that are not documented here.

## 1. Client to Front Door
Front Door accepts most headers from the incoming request (without modifying them), however, there are some reserved headers that will be removed from the incoming request if they are sent. This includes headers with the following prefixes:
 - X-FD-*

## 2. Front Door to backend

Front Door will include the headers from the incoming request, unless they were removed due to the restrictions mentioned above. Front Door will also add the following headers:

| Header  | Example and description |
| ------------- | ------------- |
| Via |  *Via: 1.1 Azure* </br> Front Door adds the client's HTTP version followed by 'Azure' as the value for Via header. It is added to indicate the client's HTTP version and that Azure Front Door was an intermediate recipient for the request between the client and the backend.  |
| X-Azure-ClientIP | *X-Azure-ClientIP: 127.0.0.1* </br> Represents the "client" Internet Protocol address associated with the request being processed. For example, a request coming from a proxy may add the X-Forwarded-For header to indicate the IP address of the original caller. |
| X-Azure-SocketIP | *X-Azure-SocketIP: 127.0.0.1* </br> Represents the socket Internet Protocol address associated with the TCP connection, the current request originated from. A request's Client IP address may not be equal to its Socket IP address because it can be arbitrarily overwritten by an end user.|
| X-Azure-Ref | *X-Azure-Ref: 0zxV+XAAAAABKMMOjBv2NT4TY6SQVjC0zV1NURURHRTA2MTkANDM3YzgyY2QtMzYwYS00YTU0LTk0YzMtNWZmNzA3NjQ3Nzgz* </br> This is a unique reference string that identifies a request served by Front Door. It is critical for troubleshooting as it is used to search the access logs.|
| X-Azure-RequestChain |  *X-Azure-RequestChain: hops=1* </br> This is a header that Front Door uses to detect request loops and users should not take a dependency on it. |
| X-Forwarded-For | *X-Forwarded-For: 127.0.0.1* </br> The X-Forwarded-For (XFF) HTTP header field is a common method for identifying the originating IP address of a client connecting to a web server through an HTTP proxy or load balancer. If there was an existing XFF header, then Front Door appends the client socket IP to it else adds the XFF header with the client socket IP. |
| X-Forwarded-Host | *X-Forwarded-Host: contoso.azurefd.net* </br> The X-Forwarded-Host HTTP header field is a common method for identifying the original host requested by the client in the Host HTTP request header, since the host name from Front Door may differ for the backend server handling the request. |
| X-Forwarded-Proto | *X-Forwarded-Proto: http* </br> The X-Forwarded-Proto HTTP header field is a common method for identifying the originating protocol of an HTTP request, since depending on the configuration Front Door may communicate with the backend using HTTPS even if the request to the reverse proxy is HTTP. |

## 3. Front Door to client

Following are the headers that are sent from Front Door to clients. Any headers sent to Front Door from the backend are passed through to the client as well.

| Header  | Example |
| ------------- | ------------- |
| X-Azure-Ref |  *X-Azure-Ref: 0zxV+XAAAAABKMMOjBv2NT4TY6SQVjC0zV1NURURHRTA2MTkANDM3YzgyY2QtMzYwYS00YTU0LTk0YzMtNWZmNzA3NjQ3Nzgz* </br> This is a unique reference string that identifies a request served by Front Door. It is critical for troubleshooting as it is used to search the access logs.|

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).

<!--Image references-->
[1]: ./media/front-door-http-headers-protocol/front-door-protocol-summary.png