---
title:  Debug HTTP headers for Azure CDN from Microsoft | Microsoft Docs
description: Debug cache request headers provides additional information about the cache policy applied to the requested asset. These headers are specific to Azure CDN from Microsoft.
services: cdn
documentationcenter: ''
author: duongau
manager: danielgi
editor: ''

ms.assetid: 
ms.service: azure-cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 07/31/2019
ms.author: duau

---
# Debug HTTP header for Azure CDN from Microsoft
The debug response header, `X-Cache`, provides details as to what layer of the CDN stack the content was served from. This header is specific to Azure CDN from Microsoft.

### Response header format

Header | Description
-------|------------
X-Cache: TCP_HIT | This header is returned when the content is served from the CDN edge cache. 
X-Cache: TCP_REMOTE_HIT | This header is returned when the content is served from the CDN regional cache (Origin shield layer)
X-Cache: TCP_MISS | This header is returned when there is a cache miss, and the content is served from the Origin.
X-Cache: PRIVATE_NOSTORE | This header is returned when the request cannot be cached as Cache-Control response header is set to either private or no-store.
X-Cache: CONFIG_NOCACHE | This header is returned when the request is configured not to cache in the CDN profile.
X-Cache: N/A | This header is returned when the request that was denied by Signed URL and Rules Set.

For additional information on HTTP headers supported in Azure CDN, see [Front Door to backend](../frontdoor/front-door-http-headers-protocol.md#from-the-front-door-to-the-backend).
