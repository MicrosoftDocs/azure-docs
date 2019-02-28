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
Front Door accepts most headers from the incoming request (without modifying them), however, there are some reserved headers that will be removed from the incoming request if they are sent. This includes headers with the following prefixes:
 - X-FD*
 - X-MS*

## 2. Front Door to backend

Front Door will include the headers from the incoming request, unless they were removed due to the restrictions mentioned above. Front Door will also add the following headers:

| Header  | Example and description |
| ------------- | ------------- |
| X-MS-Ref |  *X-MS-Ref: 0WrHgWgAAAACFupORp/8MS6vxhG/WUvawV1NURURHRTAzMjEARWRnZQ==* </br> This is a unique reference string that identifies a request served by Front Door. It is critical for troubleshooting as it is used to search the access logs.|
| X-MS-RequestChain |  *X-MS-RequestChain: hops=1* </br> This is a header that Front Door uses to detect request loops and users should not take a dependency on it. |
| X-MS-Via |  *X-MS-Via: Azure* </br> This is added by Front Door to indicate that Azure/Front Door was an intermediate recipient for the request between the client and the backend. |

## 3. Front Door to client

Following are the headers that are sent from Front Door to clients. Any headers sent to Front Door from the backend are passed through to the client as well.

| Header  | Example |
| ------------- | ------------- |
| X-MS-Ref |  *X-MS-Ref: 0WrHgWgAAAACFupORp/8MS6vxhG/WUvawV1NURURHRTAzMjEARWRnZQ==* </br> This is a unique reference string that identifies a request served by Front Door. It is critical for troubleshooting as it is used to search the access logs.|

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).

<!--Image references-->
[1]: ./media/front-door-http-headers-protocol/front-door-protocol-summary.png