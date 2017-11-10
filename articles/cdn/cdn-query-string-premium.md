---
title: Control Azure CDN caching behavior with query strings - Premium | Microsoft Docs
description: Azure CDN query string caching controls how files are to be cached when they contain query strings.
services: cdn
documentationcenter: ''
author: zhangmanling
manager: erikre
editor: ''

ms.assetid: 99db4a85-4f5f-431f-ac3a-69e05518c997
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/09/2017
ms.author: mazha

---
# Control Azure CDN caching behavior with query strings - Premium
> [!div class="op_single_selector"]
> * [Standard](cdn-query-string.md)
> * [Azure CDN Premium from Verizon](cdn-query-string-premium.md)
> 
> 

## Overview
Query string caching controls how files are cached when a request contains query strings. For example, http:\//www.domain.com/content.mov?data=true. If there is more than one query string in a request, the order of the query strings does not matter.

> [!IMPORTANT]
> The standard and premium CDN products provide the same query string caching functionality, but the user interface differs.  This article describes the interface for **Azure CDN Premium from Verizon**.  For query string caching with **Azure CDN Standard from Akamai** and **Azure CDN Standard from Verizon**, see [Controlling caching behavior of CDN requests with query strings](cdn-query-string.md).
>

Three query string modes are available:

- **standard-cache**: Default mode. In this mode, the CDN edge node passes the query strings from the requestor to the origin on the first request and caches the asset. All subsequent requests for the asset that are served from the edge node ignore the query strings until the cached asset expires.
- **no-cache**: In this mode, requests with query strings are not cached at the CDN edge node. The edge node retrieves the asset directly from the origin and passes it to the requestor with each request.
- **unique-cache**: This mode treats each request with query strings as a unique asset with its own cache. For example, the response from the origin for a request for *foo.ashx?q=bar* is cached at the edge node and returned for subsequent caches with the same query strings. A request for *foo.ashx?q=somethingelse* is cached as a separate asset with its own time-to-live setting.

## Changing query string caching settings for premium CDN profiles
1. From the CDN profile blade, click **Manage**.
   
    ![CDN profile Manage button](./media/cdn-query-string-premium/cdn-manage-btn.png)
   
    The CDN management portal opens.
2. Hover over the **HTTP Large** tab, then hover over the **Cache Settings** flyout. Click **Query-String Caching**.
   
    Query string caching options are displayed.
   
    ![CDN query string caching options](./media/cdn-query-string-premium/cdn-query-string.png)
3. Select a query string mode, then click **Update**.

> [!IMPORTANT]
> Because it takes time for the registration to propagate through the CDN, cache string settings changes might not be immediately visible. For **Azure CDN Premium from Verizon** profiles, propagation usually completes within 90 minutes, but in some cases can take longer.
 

