---
title: Control Azure CDN caching behavior with query strings - standard tier | Microsoft Docs
description: Azure CDN query string caching controls how files are cached when a web request contains a query string. This article describes query string caching in Azure CDN standard products.
services: cdn
documentationcenter: ''
author: mdgattuso
manager: danielgi
editor: ''

ms.assetid: 17410e4f-130e-489c-834e-7ca6d6f9778d
ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/11/2018
ms.author: magattus

---
# Control Azure CDN caching behavior with query strings - standard tier
> [!div class="op_single_selector"]
> * [Standard tier](cdn-query-string.md)
> * [Premium tier](cdn-query-string-premium.md)
> 

## Overview
With Azure Content Delivery Network (CDN), you can control how files are cached for a web request that contains a query string. In a web request with a query string, the query string is that portion of the request that occurs after a question mark (?). A query string can contain one or more key-value pairs, in which the field name and its value are separated by an equals sign (=). Each key-value pair is separated by an ampersand (&). For example, http:\//www.contoso.com/content.mov?field1=value1&field2=value2. If there is more than one key-value pair in a query string of a request, their order does not matter. 

> [!IMPORTANT]
> The Azure CDN standard and premium products provide the same query string caching functionality, but the user interface is different. This article describes the interface for **Azure CDN Standard from Microsoft**, **Azure CDN Standard from Akamai** and **Azure CDN Standard from Verizon**. For query string caching with **Azure CDN Premium from Verizon**, see [Control Azure CDN caching behavior with query strings - premium tier](cdn-query-string-premium.md).

Three query string modes are available:

- **Ignore query strings**: Default mode. In this mode, the CDN point-of-presence (POP) node passes the query strings from the requestor to the origin server on the first request and caches the asset. All subsequent requests for the asset that are served from the POP ignore the query strings until the cached asset expires.

- **Bypass caching for query strings**: In this mode, requests with query strings are not cached at the CDN POP node. The POP node retrieves the asset directly from the origin server and passes it to the requestor with each request.

- **Cache every unique URL**: In this mode, each request with a unique URL, including the query string, is treated as a unique asset with its own cache. For example, the response from the origin server for a request for example.ashx?q=test1 is cached at the POP node and returned for subsequent caches with the same query string. A request for example.ashx?q=test2 is cached as a separate asset with its own time-to-live setting.
   
    >[!IMPORTANT] 
    > Do not use this mode when the query string contains parameters that will change with every request, such as a session ID or a user name, because it will result in a low cache-hit ratio.

## Changing query string caching settings for standard CDN profiles
1. Open a CDN profile, then select the CDN endpoint you want to manage.
   
   ![CDN profile endpoints](./media/cdn-query-string/cdn-endpoints.png)
   
2. In the left pane under Settings, click **Caching rules**.
   
    ![CDN Caching rules button](./media/cdn-query-string/cdn-caching-rules-btn.png)
   
3. In the **Query string caching behavior** list, select a query string mode, then click **Save**.
   
   ![CDN query string caching options](./media/cdn-query-string/cdn-query-string.png)

> [!IMPORTANT]
> Because it takes time for the registration to propagate through Azure CDN, cache string settings changes might not be immediately visible:
> - For **Azure CDN Standard from Microsoft** profiles, propagation usually completes in 10 minutes. 
> - For **Azure CDN Standard from Akamai** profiles, propagation usually completes within one minute. 
> - For **Azure CDN Standard from Verizon** and **Azure CDN Premium from Verizon** profiles, propagation usually completes in 10 minutes. 



