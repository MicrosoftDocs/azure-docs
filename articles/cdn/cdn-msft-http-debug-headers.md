---
title:  Debug HTTP headers for Azure CDN from Microsoft
description: Debug cache request headers provide additional information about the cache policy applied to the requested asset. These headers are specific to Azure CDN from Microsoft.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: article
ms.date: 03/20/2024
ms.author: duau
---

# Debug HTTP header for Azure CDN from Microsoft

The debug response header, `X-Cache`, provides details as to what layer of the CDN stack the content was served from. This header is specific to Azure CDN from Microsoft.

### Response header format

Header | Description
-------|------------
X-Cache: TCP_HIT | This header is returned when the content is served from the CDN edge cache.
X-Cache: TCP_REMOTE_HIT | This header is returned when the content is served from the CDN regional cache (Origin shield layer)
X-Cache: TCP_MISS | This header is returned when there's a cache miss, and the content is served from the Origin.
X-Cache: PRIVATE_NOSTORE | This header is returned when the request can't be cached as Cache-Control response header is set to either private or no-store.
X-Cache: CONFIG_NOCACHE | This header is returned when the request is configured not to cache in the CDN profile.
X-Cache: N/A | This header is returned when a request gets denied by Signed URL and Rules Set.

For more information on HTTP headers supported in Azure CDN, see [Azure Front Door to backend](../frontdoor/front-door-http-headers-protocol.md#from-the-front-door-to-the-backend).
