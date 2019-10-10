---
title: Control Azure CDN caching behavior with query strings - premium tier | Microsoft Docs
description: Azure CDN query string caching controls how files are cached when a web request contains a query string. This article describes query string caching in the Azure CDN Premium from Verizon product.
services: cdn
documentationcenter: ''
author: mdgattuso
manager: danielgi
editor: ''

ms.assetid: 99db4a85-4f5f-431f-ac3a-69e05518c997
ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/11/2018
ms.author: magattus

---
# Control Azure CDN caching behavior with query strings - premium tier
> [!div class="op_single_selector"]
> * [Standard tier](cdn-query-string.md)
> * [Premium tier](cdn-query-string-premium.md)
> 

## Overview
With Azure Content Delivery Network (CDN), you can control how files are cached for a web request that contains a query string. In a web request with a query string, the query string is that portion of the request that occurs after a question mark (?). A query string can contain one or more key-value pairs, in which the field name and its value are separated by an equals sign (=). Each key-value pair is separated by an ampersand (&). For example, http:\//www.contoso.com/content.mov?field1=value1&field2=value2. If there is more than one key-value pair in a query string of a request, their order does not matter. 

> [!IMPORTANT]
> The standard and premium CDN products provide the same query string caching functionality, but the user interface is different. This article describes the interface for **Azure CDN Premium from Verizon**. For query string caching with Azure CDN standard products, see [Control Azure CDN caching behavior with query strings - standard tier](cdn-query-string.md).
>


Three query string modes are available:

- **standard-cache**: Default mode. In this mode, the CDN point-of-presence (POP) node passes the query strings from the requestor to the origin server on the first request and caches the asset. All subsequent requests for the asset that are served from the POP server ignore the query strings until the cached asset expires.

    >[!IMPORTANT] 
    > If token authorization is enabled for any path on this account, standard-cache mode is the only mode that can be used. 

- **no-cache**: In this mode, requests with query strings are not cached at the CDN POP node. The POP node retrieves the asset directly from the origin server and passes it to the requestor with each request.

- **unique-cache**: In this mode, each request with a unique URL, including the query string, is treated as a unique asset with its own cache. For example, the response from the origin server for a request for example.ashx?q=test1 is cached at the POP node and returned for subsequent caches with the same query string. A request for example.ashx?q=test2 is cached as a separate asset with its own time-to-live setting.
   
    >[!IMPORTANT] 
    > Do not use this mode when the query string contains parameters that will change with every request, such as a session ID or a user name, because it will result in a low cache-hit ratio.

## Changing query string caching settings for premium CDN profiles
1. Open a CDN profile, then click **Manage**.
   
    ![CDN profile Manage button](./media/cdn-query-string-premium/cdn-manage-btn.png)
   
    The CDN management portal opens.
2. Hover over the **HTTP Large** tab, then hover over the **Cache Settings** flyout menu. Click **Query-String Caching**.
   
    Query string caching options are displayed.
   
    ![CDN query string caching options](./media/cdn-query-string-premium/cdn-query-string.png)
3. Select a query string mode, then click **Update**.

> [!IMPORTANT]
> Because it takes time for the registration to propagate through the CDN, cache string settings changes might not be immediately visible. Propagation usually completes in 10 minutes.
 

