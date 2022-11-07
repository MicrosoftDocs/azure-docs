---
title: Azure Front Door - caching | Microsoft Docs
description: This article helps you understand behavior for Front Door with routing rules that have enabled caching.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 03/22/2022
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# Caching with Azure Front Door

::: zone pivot="front-door-standard-premium"

In this article, you'll learn how Azure Front Door Standard and Premium tier routes and Rule set behaves when you have caching enabled. Azure Front Door is a modern Content Delivery Network (CDN) with dynamic site acceleration and load balancing.

## Request methods

Only the GET request method can generate cached content in Azure Front Door. All other request methods are always proxied through the network.

::: zone-end

::: zone pivot="front-door-classic"

The following document specifies behaviors for Azure Front Door (classic) with routing rules that have enabled caching. Front Door is a modern Content Delivery Network (CDN) with dynamic site acceleration and load balancing, it also supports caching behaviors just like any other CDN.

::: zone-end

## Delivery of large files

Azure Front Door delivers large files without a cap on file size. Front Door uses a technique called object chunking. When a large file is requested, Front Door retrieves smaller pieces of the file from the backend. After receiving a full or byte-range file request, the Front Door environment requests the file from the backend in chunks of 8 MB.

After the chunk arrives at the Front Door environment, it's cached and immediately served to the user. Front Door then pre-fetches the next chunk in parallel. This pre-fetch ensures that the content stays one chunk ahead of the user, which reduces latency. This process continues until the entire file gets downloaded (if requested) or the client closes the connection.

For more information on the byte-range request, read [RFC 7233](https://www.rfc-editor.org/info/rfc7233).
Front Door caches any chunks as they're received so the entire file doesn't need to be cached on the Front Door cache. Ensuing requests for the file or byte ranges are served from the cache. If the chunks aren't all cached, pre-fetching is used to request chunks from the backend. This optimization relies on the backend's ability to support byte-range requests. If the backend doesn't support byte-range requests, this optimization isn't effective.

## File compression

::: zone pivot="front-door-standard-premium"

Refer to [improve performance by compressing files](standard-premium/how-to-compression.md) in Azure Front Door.

::: zone-end

::: zone pivot="front-door-classic"

Azure Front Door (classic) can dynamically compress content on the edge, resulting in a smaller and faster response time to your clients. In order for a file to be eligible for compression, caching must be enabled and the file must be of a MIME type to be eligible for compression. Currently, Front Door (classic) doesn't allow this list to be changed. The current list is:
- "application/eot"
- "application/font"
- "application/font-sfnt"
- "application/javascript"
- "application/json"
- "application/opentype"
- "application/otf"
- "application/pkcs7-mime"
- "application/truetype"
- "application/ttf",
- "application/vnd.ms-fontobject"
- "application/xhtml+xml"
- "application/xml"
- "application/xml+rss"
- "application/x-font-opentype"
- "application/x-font-truetype"
- "application/x-font-ttf"
- "application/x-httpd-cgi"
- "application/x-mpegurl"
- "application/x-opentype"
- "application/x-otf"
- "application/x-perl"
- "application/x-ttf"
- "application/x-javascript"
- "font/eot"
- "font/ttf"
- "font/otf"
- "font/opentype"
- "image/svg+xml"
- "text/css"
- "text/csv"
- "text/html"
- "text/javascript"
- "text/js", "text/plain"
- "text/richtext"
- "text/tab-separated-values"
- "text/xml"
- "text/x-script"
- "text/x-component"
- "text/x-java-source"

Additionally, the file must also be between 1 KB and 8 MB in size, inclusive.

These profiles support the following compression encodings:
- [Gzip (GNU zip)](https://en.wikipedia.org/wiki/Gzip)
- [Brotli](https://en.wikipedia.org/wiki/Brotli)

If a request supports gzip and Brotli compression, Brotli compression takes precedence.</br>
When a request for an asset specifies compression and the request results in a cache miss, Azure Front Door (classic) does compression of the asset directly on the POP server. Afterward, the compressed file is served from the cache. The resulting item is returned with a transfer-encoding: chunked.
If the origin uses Chunked Transfer Encoding (CTE) to send compressed data to the Azure Front Door POP, then response sizes greater than 8 MB aren't supported.

::: zone-end

> [!NOTE]
> Range requests may be compressed into different sizes. Azure Front Door requires the content-length values to be the same for any GET HTTP request. If clients send byte range requests with the `accept-encoding` header that leads to the Origin responding with different content lengths, then Azure Front Door will return a 503 error. You can either disable compression on the Origin or create a Rules Set rule to remove `accept-encoding` from the request for byte range requests.

## Query string behavior

With Azure Front Door, you can control how files are cached for a web request that contains a query string. In a web request with a query string, the query string is that portion of the request that occurs after a question mark (?). A query string can contain one or more key-value pairs, in which the field name and its value are separated by an equals sign (=). Each key-value pair is separated by an ampersand (&). For example, `http://www.contoso.com/content.mov?field1=value1&field2=value2`. If there's more than one key-value pair in a query string of a request then their order doesn't matter.

* **Ignore query strings**: In this mode, Azure Front Door passes the query strings from the requestor to the backend on the first request and caches the asset. All ensuing requests for the asset that are served from the Front Door environment ignore the query strings until the cached asset expires.

* **Cache every unique URL**: In this mode, each request with a unique URL, including the query string, is treated as a unique asset with its own cache. For example, the response from the backend for a request for `www.example.ashx?q=test1` is cached at the Front Door environment and returned for ensuing caches with the same query string. A request for `www.example.ashx?q=test2` is cached as a separate asset with its own time-to-live setting.

::: zone pivot="front-door-standard-premium"

* **Specify cache key query string** behavior, to include, or exclude specified parameters when cache key gets generated. For example, the default cache key is: /foo/image/asset.html, and the sample request is `https://contoso.com//foo/image/asset.html?language=EN&userid=100&sessionid=200`. There's a rule set rule to exclude query string 'userid'. Then the query string cache-key would be `/foo/image/asset.html?language=EN&sessionid=200`.

Configure the query string behavior on the Front Door route.

::: zone-end

## Cache purge

::: zone pivot="front-door-standard-premium"

See [Cache purging in Azure Front Door](standard-premium/how-to-cache-purge.md) to learn how to configure cache purge.

::: zone-end

::: zone pivot="front-door-classic"

Azure Front Door caches assets until the asset's time-to-live (TTL) expires. Whenever a client requests an asset with expired TTL, the Front Door environment retrieves a new updated copy of the asset to serve the request and then stores the refreshed cache.

The best practice to make sure your users always obtain the latest copy of your assets is to version your assets for each update and publish them as new URLs. Front Door will immediately retrieve the new assets for the next client requests. Sometimes you may wish to purge cached content from all edge nodes and force them all to retrieve new updated assets. The reason could be because of updates to your web application, or to quickly update assets that contain incorrect information.

:::image type="content" source=".\media\front-door-caching\cache-purge.png" alt-text="Screenshot of the cache purge button and page." lightbox=".\media\front-door-caching\cache-purge-expanded.png":::

Select the assets you want to purge from the edge nodes. To clear all assets, select **Purge all**. Otherwise, in **Path**, enter the path of each asset you want to purge.

These formats are supported in the lists of paths to purge:

- **Single path purge**: Purge individual assets by specifying the full path of the asset (without the protocol and domain), with the file extension, for example, /pictures/strasbourg.png;
- **Wildcard purge**: Asterisk (\*) may be used as a wildcard. Purge all folders, subfolders, and files under an endpoint with /\* in the path or purge all subfolders and files under a specific folder by specifying the folder followed by /\*, for example, /pictures/\*.
- **Root domain purge**: Purge the root of the endpoint with "/" in the path.

> [!NOTE]
> **Purging wildcard domains**: Specifying cached paths for purging as discussed in this section doesn't apply to any wildcard domains that are associated with the Front Door. Currently, we don't support directly purging wildcard domains. You can purge paths from specific subdomains by specifying that specfic subdomain and the purge path. For example, if my Front Door has `*.contoso.com`, I can purge assets of my subdomain `foo.contoso.com` by typing `foo.contoso.com/path/*`. Currently, specifying host names in the purge content path is limited to subdomains of wildcard domains, if applicable.
>

Cache purges on the Front Door are case-insensitive. Additionally, they're query string agnostic, meaning purging a URL will purge all query-string variations of it. 

::: zone-end

## Cache expiration

The following order of headers is used to determine how long an item will be stored in our cache:</br>
1. Cache-Control: s-maxage=\<seconds>
2. Cache-Control: max-age=\<seconds>
3. Expires: \<http-date>

Cache-Control response headers that indicate that the response won't be cached such as Cache-Control: private, Cache-Control: no-cache, and Cache-Control: no-store are honored.  If no Cache-Control is present, the default behavior is that Front Door will cache the resource for X amount of time where X gets randomly picked between 1 to 3 days.

> [!NOTE]
> Cache expiration can't be greater than **366 days**.
> 

## Request headers

The following request headers won't be forwarded to a backend when using caching.
- Content-Length
- Transfer-Encoding
- Accept
- Accept-Charset
- Accept-Language

## Response headers

The following response headers will be stripped if the origin response is cacheable. For example, Cache control header has max-age value.

- Set-Cookie

## Cache behavior and duration

::: zone pivot="front-door-standard-premium"

Cache behavior and duration can be configured in Rules Engine. Rules Engine caching configuration will always override the route configuration.

* When *caching* is **disabled**, Azure Front Door doesn’t cache the response contents, irrespective of origin response directives.

* When *caching* is **enabled**, the cache behavior is different based on the cache behavior value selected.
   * **Honor origin**: Azure Front Door will always honor origin response header directive. If the origin directive is missing, Azure Front Door will cache contents anywhere from 1 to 3 days.  
   * **Override always**: Azure Front Door will always override with the cache duration, meaning that it will cache the contents for the cache duration ignoring the values from origin response directives.
   * **Override if origin missing**: If the origin doesn’t return caching TTL values, Azure Front Door will use the specified cache duration. This behavior will only be applied if the response is cacheable. 

> [!NOTE]
> * Azure Front Door makes no guarantees about the amount of time that the content is stored in the cache. Cached content may be removed from the edge cache before the content expiration if the content is not frequently used. Front Door might be able to serve data from the cache even if the cached data has expired. This behavior can help your site to remain partially available when your backends are offline.
> * Origins may specify not to cache specific responses using the Cache-Control header with a value of no-cache, private, or no-store. When used in an HTTP response from the origin server to the Azure Front Door POPs, Azure Front Door supports Cache-control directives and honors caching behaviors for Cache-Control directives in [RFC 7234 - Hypertext Transfer Protocol (HTTP/1.1): Caching (ietf.org)](https://www.rfc-editor.org/rfc/rfc7234#section-5.2.2.8). 

::: zone-end

::: zone pivot="front-door-classic"

Cache behavior and duration can be configured in both the Front Door designer routing rule and in Rules Engine. Rules Engine caching configuration will always override the Front Door designer routing rule configuration.

* When *caching* is **disabled**, Azure Front Door (classic) doesn’t cache the response contents, irrespective of origin response directives.

* When *caching* is **enabled**, the cache behavior is different for different values of *Use cache default duration*.
    * When *Use cache default duration* is set to **Yes**, Azure Front Door (classic) will always honor origin response header directive. If the origin directive is missing, Front Door will cache contents anywhere from 1 to 3 days.
    * When *Use cache default duration* is set to **No**, Azure Front Door (classic) will always override with the *cache duration* (required fields), meaning that it will cache the contents for the cache duration ignoring the values from origin response directives. 

> [!NOTE]
> * Azure Front Door (classic) makes no guarantees about the amount of time that the content is stored in the cache. Cached content may be removed from the edge cache before the content expiration if the content is not frequently used. Azure Front Door (classic) might be able to serve data from the cache even if the cached data has expired. This behavior can help your site to remain partially available when your backends are offline.
> * The *cache duration* set in the Front Door designer routing rule is the **minimum cache duration**. This override won't work if the cache control header from the backend has a greater TTL than the override value.
> 

::: zone-end

## Next steps

::: zone pivot="front-door-classic"

- Learn how to [create an Azure Front Door (classic)](quickstart-create-front-door.md).
- Learn [how Azure Front Door (classic) works](front-door-routing-architecture.md).

::: zone-end

::: zone pivot="front-door-standard-premium"

* Learn more about [Rule set match conditions](standard-premium/concept-rule-set-match-conditions.md)
* Learn more about [Rule set actions](front-door-rules-engine-actions.md)

::: zone-end
