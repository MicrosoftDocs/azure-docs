---
title:  Debug HTTP headers for Azure CDN from Microsoft | Microsoft Docs
description: Debug cache request headers provides additional information about the cache policy applied to the requested asset. These headers are specific to Azure CDN from Microsoft.
services: cdn
documentationcenter: ''
author: asudbring
manager: danielgi
editor: ''

ms.assetid: 
ms.service: azure-cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/31/2019
ms.author: allensu

---
# Debug HTTP header for Azure CDN from Microsoft
The debug response header, `X-Cache`, provides details as to what layer of the CDN stack the content was served from. This header is specific to Azure CDN from Microsoft.

### Response header format

Header | Description
-------|------------
X-Cache: TCP_HIT | This header is returned when the content is served from the CDN edge cache. 
X-Cache: TCP_REMOTE_HIT | This header is returned when the content is served from the CDN regional cache (Origin shield layer)
X-Cache: TCP_MISS | This header is returned when there is a cache miss, and the content is served from the Origin. 


