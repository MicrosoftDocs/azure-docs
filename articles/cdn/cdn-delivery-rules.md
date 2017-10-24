---
title: Control Azure CDN caching behavior with Delivery Rules | Microsoft Docs
description: 'You can use CDN Delivery Rules to set or modify default cache expiration behavior both globally and with conditions, such as a URL path and file extensions.'
services: cdn
documentationcenter: ''
author: dksimpson
manager: 
editor: ''

ms.assetid: 
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/23/2017
ms.author: v-deasim

---

# Control Azure CDN caching behavior with Delivery Rules

> [!NOTE] 
> Delivery Rules are available only for **Azure CDN from Verizon Standard** and **Azure CDN from Akamai Standard**. For **Azure CDN from Verizon Premium**, you can use the [Azure CDN rules engine](cdn-rules-engine.md) in the **Manage** portal for similar functionality.
 
Azure CDN offers two ways to control how your files are cached: 

- Delivery rules caching: This article describes how you can use CDN Delivery Rules to set or modify default cache expiration behavior both globally and with conditions, such as a URL path and file extensions. 

- Query string caching: You can adjust how Azure CDN treats caching for requests with query strings. For information, see Query string caching. The Query string caching setting has no effect if the file is not cacheable, based on Delivery Rules and CDN default behaviors.

For information about default caching behavior and caching directive headers, see [How caching works](cdn-how-caching-works.md).

## TUTORIAL

How to set a cache rule:

1. Open the Azure portal, select a CDN profile, then select an endpoint.
2. Click the **Cache** tab.
3. Set the Global Cache Rule to **Set if missing** and the value to 10 days. 
The Global Cache Rule affects all requests to the endpoint. This rule honors the origin cache directives if they exist (Cache-Control or Expires); otherwise, if the directives are not specified, it sets the cache to 10 days. 
4. Create a Custom Cache Rule as follows:
    a. Set the condition to **URL Path** and its value to `/images/*.jpg`.
    b. Set the action to **Override** and its value to 30 days.
    This action sets a cache duration of 30 days on any `.jpg` image files in the `/images` folder of your endpoint and overrides any Cache-Control or Expires headers sent by the origin server.
 

> [!NOTE] 
> Files that are cached before a rule change maintain their origin cache duration setting. To reset their cache durations, you must [purge the file](cdn-purge-endpoint.md). For **Azure CDN from Verizon** endpoints, it can take up to 90 minutes for rules to take effect.

## Reference

### Cache action types
Three action types are available:

- **Override**: Do not honor origin-provided cache directives; use the provided cache duration instead.
- **Set if missing**: Honor the origin-provided cache directives, if they exist. Otherwise, use the provided time.
- **Bypass**: Do not cache and ignore origin-provided cache directives.

For **Override** and **Set if missing** action types, valid cache expiration duration values range between 0 seconds to 1 year. For a value of 0 seconds, the CDN caches the content, but must revalidate each request with the origin.

### Conditions
For custom cache rules via the Azure portal, two match conditions are available:
 
- **URL Path**: This condition matches the path of the URL, excluding the domain name, and supports the wildcard symbol (\*). For example, `/myfile.html`, `/my/folder/*`, and `/my/images/*.jpg`.

- **File Extension**: This condition matches the file extension of the requested file. You can provide a list of comma-separated file extensions to match. For example, `.jpg`, `.mp3`, or `.png`. 

### Rule processing order
Caching rules are processed in the following order:

- Global cache rules take precedence over the default CDN behavior. 

- Custom cache rules take precedence over global cache rules, where they apply. Custom cache rules are processed in a top-down order. That is, if a request matches both conditions, rules at the bottom of the list take precedence over rules at the top of the list. Therefore, you should place more specific rules lower in the list.

**Example**:
- Global rule: 
   - Action setting: **Override**
   - Action value: 1 day

- Custom cache rule #1:
   - Condition setting: **URL Path**
   - Condition value: `/home/*`
   - Action setting: **Override**
   - Action value: 2 days

- Custom cache rule #2:
   - Condition setting: **File Extension**
   - Condition value: `.html`
   - Action setting: **Set if missing**
   - Action value: 3 days

When these rules are set, a request for `<endpoint>.azureedge.net/home/index.html` triggers custom cache rule #2, which is set to: **Set if missing**, “3 days”. Therefore, if the index.html file has Cache-Control or Expires headers, they are honored; otherwise if these headers are not set, the file is cached for 3 days.

