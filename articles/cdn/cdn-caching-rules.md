---
title: Control Azure Content Delivery Network caching behavior with caching rules | Microsoft Docs
description: 'You can use CDN caching rules to set or modify default cache expiration behavior both globally and with conditions, such as a URL path and file extensions.'
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

# Control Azure Content Delivery Network caching behavior with caching rules

> [!NOTE] 
> Caching rules are available only for **Azure CDN from Verizon Standard** and **Azure CDN from Akamai Standard**. For **Azure CDN from Verizon Premium**, you can use the [Azure CDN rules engine](cdn-rules-engine.md) in the **Manage** portal for similar functionality.
 
Azure Content Delivery Network offers two ways to control how your files are cached: 

- Caching rules: This article describes how you can use content deliver network (CDN) caching rules to set or modify default cache expiration behavior both globally and with custom conditions, such as a URL path and file extension. Azure CDN provides two types of caching rules:
   - Global caching rules: You can set one global caching rule for each endpoint in your profile, which affects all requests to the endpoint. The global caching rule overrides any HTTP cache-directive headers, if set.
   - Custom caching rules: You can set one or more custom caching rules for each endpoint in your profile. Custom caching rules match specific paths and file extensions, are processed in order, and override the global caching rule, if set. 

- Query string caching: You can adjust how the Azure CDN treats caching for requests with query strings. For information, see [Control Azure CDN caching behavior with query strings](cdn-query-string.md). If the file is not cacheable, the query string caching setting has no effect, based on caching rules and CDN default behaviors.

For information about default caching behavior and caching directive headers, see [How caching works](cdn-how-caching-works.md).

## Tutorial

How to set CDN caching rules:

1. Open the Azure portal, select a CDN profile, then select an endpoint.
2. In the left pane under Settings, click **Cache**.
3. Create a global caching rule as follows:
   1. Under **Global caching rules**, set **Query string caching behavior** to **Ignore query strings**.
   2. Set **Caching behavior** to **Set if missing**.
   3. For **Cache expiration duration**, enter 10 in the **Days** field.

       The global caching rule affects all requests to the endpoint. This rule honors the origin cache-directive headers, if they exist (`Cache-Control` or `Expires`); otherwise, if they are not specified, it sets the cache to 10 days. 

4. Create a custom caching rule as follows:
    1. Under **Custom caching rules**, set **Match condition** to **Path** and **Match value** to `/images/*.jpg`.
    2. Set **Caching behavior** to **Override** and enter 30 in the **Days** field.
       
       This custom caching rule sets a cache duration of 30 days on any `.jpg` image files in the `/images` folder of your endpoint. It overrides any `Cache-Control` or `Expires` HTTP headers that are sent by the origin server.

  ![Caching rules dialog](./media/cdn-caching-rules/cdn-caching-rules-dialog.png)

> [!NOTE] 
> Files that are cached before a rule change maintain their origin cache duration setting. To reset their cache durations, you must [purge the file](cdn-purge-endpoint.md). For **Azure CDN from Verizon** endpoints, it can take up to 90 minutes for caching rules to take effect.

## Reference

### Caching behavior settings
For global and custom caching rules, you can specify the following **Caching behavior** settings:

- **Bypass cache**: Do not cache and ignore origin-provided cache-directive headers.
- **Override**: Ignore origin-provided cache-directive headers; use the provided cache duration instead.
- **Set if missing**: Honor origin-provided cache-directive headers, if they exist; otherwise, use the provided cache duration.

### Cache expiration duration
For global and custom caching rules, you can specify the cache expiration duration in days, hours, minutes, and seconds:

- For the **Override** and **Set if missing** **Caching behavior** settings, valid cache durations range between 0 seconds and 366 days. For a value of 0 seconds, the CDN caches the content, but must revalidate each request with the origin server.
- For the **Bypass cache** setting, the cache duration is automatically set to 0 seconds and cannot be changed.

### Custom caching rules match conditions

For custom cache rules, two match conditions are available:
 
- **Path**: This condition matches the path of the URL, excluding the domain name, and supports the wildcard symbol (\*). For example, `/myfile.html`, `/my/folder/*`, and `/my/images/*.jpg`. The maximum length is 260 characters.

- **Extension**: This condition matches the file extension of the requested file. You can provide a list of comma-separated file extensions to match. For example, `.jpg`, `.mp3`, or `.png`. The maximum number of extensions is 50 and the maximum number of characters per extension is 16. 

### Global and custom rule processing order
Global and custom caching rules are processed in the following order:

- Global caching rules take precedence over the default CDN caching behavior (HTTP cache-directive header settings). 

- Custom caching rules take precedence over global caching rules, where they apply. Custom caching rules are processed in order from top to bottom. That is, if a request matches both conditions, rules at the bottom of the list take precedence over rules at the top of the list. Therefore, you should place more specific rules lower in the list.

**Example**:
- Global caching rule: 
   - Caching behavior: **Override**
   - Cache expiration duration: 1 day

- Custom caching rule #1:
   - Match condition: **Path**
   - Match value: `/home/*`
   - Caching behavior: **Override**
   - Cache expiration duration: 2 days

- Custom caching rule #2:
   - Match condition: **Extension**
   - Match value: `.html`
   - Caching behavior: **Set if missing**
   - Cache expiration duration: 3 days

When these rules are set, a request for `<endpoint>.azureedge.net/home/index.html` triggers custom caching rule #2, which is set to: **Set if missing** and 3 days. Therefore, if the `index.html` file has `Cache-Control` or `Expires` HTTP headers, they are honored; otherwise, if these headers are not set, the file is cached for 3 days.

