---
title: Control Azure CDN caching behavior with query strings | Microsoft Docs
description: Azure CDN query string caching controls how files are cached when they contain query strings.
services: cdn
documentationcenter: ''
author: zhangmanling
manager: erikre
editor: ''

ms.assetid: 17410e4f-130e-489c-834e-7ca6d6f9778d
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/09/2017
ms.author: mazha

---
# Control Azure Content Delivery Network caching behavior with query strings
> [!div class="op_single_selector"]
> * [Standard](cdn-query-string.md)
> * [Azure CDN Premium from Verizon](cdn-query-string-premium.md)
> 

## Overview
With Azure Content Delivery Network (CDN), you can control how files are cached for a web request that contains a query string. In a web request with a query string, the query string is that portion of the request that occurs after the `?` character. A query string can contain one or more parameters, which are separated by a `&` character. For example, `http://www.domain.com/content.mov?data1=true&data2=false`. If there is more than one query string parameter in a request, the order of the parameters does not matter. 

> [!IMPORTANT]
> The standard and premium CDN products provide the same query string caching functionality, but the user interface is different.  This article describes the interface for **Azure CDN Standard from Akamai** and **Azure CDN Standard from Verizon**. For query string caching with **Azure CDN Premium from Verizon**, see [Controlling caching behavior of CDN requests with query strings - Premium](cdn-query-string-premium.md).

Three query string modes are available:

- **Ignore query strings**: Default mode. In this mode, the CDN edge node passes the query strings from the requestor to the origin on the first request and caches the asset. All subsequent requests for the asset that are served from the edge node ignore the query strings until the cached asset expires.
- **Bypass caching for query strings**: In this mode, requests with query strings are not cached at the CDN edge node. The edge node retrieves the asset directly from the origin and passes it to the requestor with each request.
- **Cache every unique URL**: In this mode, each request with a unique URL, including the query string, is treated as a unique asset with its own cache. For example, the response from the origin for a request for `example.ashx?q=test1` is cached at the edge node and returned for subsequent caches with the same query string. A request for `example.ashx?q=test2` is cached as a separate asset with its own time-to-live setting.

## Changing query string caching settings for standard CDN profiles
1. Open a CDN profile, then select the CDN endpoint you want to manage.
   
   ![CDN profile endpoints](./media/cdn-query-string/cdn-endpoints.png)
   
2. Under Settings, click **Cache**.
   
    ![CDN profile Cache button](./media/cdn-query-string/cdn-cache-btn.png)
   
3. In the **Query string caching behavior** list, select a query string mode, then click **Save**.
   
  <!--- Replace screen shot after general caching goes live ![CDN query string caching options](./media/cdn-query-string/cdn-query-string.png) --->

> [!IMPORTANT]
> Because it takes time for the registration to propagate through the CDN, cache string settings changes might not be immediately visible. For **Azure CDN from Akamai** profiles, propagation usually completes within one minute. For **Azure CDN from Verizon** profiles, propagation usually completes within 90 minutes, but in some cases can take longer.


