---
title: Azure Front Door Service - HTTP headers protocol support | Microsoft Docs
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

# Azure Front Door Service - HTTP headers protocol support
This document outlines the protocol that Azure Front Door Service supports with various parts of the call path as outlined by the image below. The sections below provide more insight into the HTTP Headers that Front Door supports.

![Azure Front Door Service HTTP headers protocol][1]

>[!WARNING]
>Azure Front Door Service does not provide guarantees on any HTTP headers that are not documented here.

## 1. Client to Front Door

The following headers will be parsed by Front Door. For any other headers, Front Door will act as a pass through and send the headers to the application backend.

| Header  | Example and description |
| ------------- | ------------- |
| X-MSEdge-IG  | *X-MSEdge-IG: 2BC2B67F49ED47DFA47FBE2E962AC81F* </br> A GUID that identifies one or more HTTP requests made to render a single web page. Front Door will forward the GUID to the backend using X-FD-ImpressionGuid header. </br> If the client doesn’t send this header, Front Door will automatically generate a new GUID and send it to the backend. |

## 2. Front Door to backend

The following headers will be sent from Front Door to the application backend.

| Header  | Example and description |
| ------------- | ------------- |
| X-MS-Ref |  *X-FD-Ref: 0WrHgWgAAAACFupORp/8MS6vxhG/WUvawV1NURURHRTAzMjEARWRnZQ==* </br> The ID to identify a request served by Front Door. This header value is the most critical information for troubleshooting. This ID can be used to search for the access logs. Front Door will send the same header to both the client and the backend. |
| X-FD-ClientHttpVersion | *X-FD-ClientHttpVersion: 1.1* </br>The HTTP protocol version between the client and Front Door. Possible values are: 1.1, 2.0, etc. |
| X-FD-ClientIP | *X-FD-ClientIP: 131.107.192.35* </br>The "client" Internet Protocol address associated with the request being processed |
| X-FD-EdgeEnvironment | *X-FD-EdgeEnvironment: Edge-Prod-WSTr3* </br>The specific Front Door node that handled the request. This header can be logged by backend to aid in debugging efforts. However, no dependence on Front Door naming conventions, traffic distribution between Front Door nodes, or availability of specific individual node should be taken. |
| X-FD-EventID | *X-FD-EventId: FB805145C0124400915BE0E180F3A159* </br>A unique identifier (GUID) created at the beginning of request processing. Any access logs created while processing this request will be associated with the same GUID. |
| X-FD-ImpressionGuid | *X-FD-ImpressionGuid: 2BC2B67F49ED47DFA47FBE2E962AC81F* </br>A GUID that identifies one or more HTTP requests made to render a single web page. The client side can specify this GUID by: </br>- Sending in the *X-MSEdge-IG* request header. For example: X-MSEdge-IG: 2BC2B67F49ED47DFA47FBE2E962AC81F </br>- Sending in the “ig” query string. For example: *?ig=2BC2B67F49ED47DFA47FBE2E962AC81F*. If the client doesn’t send a GUID, Front Door will generate a new one. |
| X-FD-OriginalURL | *X-FD-OriginalURL: http://www.contoso.com:80/* </br> The URL of the original request made by the client. |
| X-FD-Partner | *X-FD-Partner: ARM-contoso.azurefd.net_Default* </br>Identifier for which Front Door profile that the request is being handled for. Can be used by the backends that host multiple applications for different Front Doors as a way of determining which Front Door configuration they are serving the current request for. |
| X-FD-RequestHadClientId | Reserved |
| X-FD-ResponseHasClientId | Reserved |
| X-FD-SocketIP | *X-FD-SocketIP: 131.107.192.35* </br>The same as X-FD-ClientIP above |

## 3. Front Door to client

Following are the headers that are sent from Front Door to clients. Any headers sent to Front Door from the backend are passed through to the client as well.

| Header  | Example |
| ------------- | ------------- |
| X-MS-Ref  | *X-FD-Ref: 0WrHgWgAAAACFupORp/8MS6vxhG/WUvawV1NURURHRTAzMjEARWRnZQ==* </br>The ID to identify a request served by the Front Door. This header value is the most critical information for troubleshooting. This ID can be used to search for the access logs. Front Door will send the same header to both the client and the backend. |

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).

<!--Image references-->
[1]: ./media/front-door-http-headers-protocol/front-door-protocol-summary.png