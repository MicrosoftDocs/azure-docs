---
title: Caching with Azure Front Door
description: This article helps you understand Front Door behavior when enabling caching in routing rules.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 11/08/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# Caching with Azure Front Door

Azure Front Door is a modern content delivery network (CDN), with dynamic site acceleration and load balancing capabilities. When caching is configured on your route, the edge site that receives each request checks its cache for a valid response. Caching helps to reduce the amount of traffic sent to your origin server. If no cached response is available, the request is forwarded to the origin.

Each Front Door edge site manages its own cache, and requests might get served by different edge sites. As a result, you might still see some traffic reach your origin, even if you served cached responses.

Caching can significantly decrease latency and reduce the load on origin servers. However, not all types of traffic can benefit from caching. Static assets such as images, CSS, and JavaScript files are ideal for caching. While dynamic assets, such as authenticated API endpoints, shouldn't be cached to prevent the leakage of personal information. It's recommended to have separate routes for static and dynamic assets, with caching disabled for the latter. 

> [!WARNING]
> Before you enable caching, thoroughly review the public documentation, and test all possible scenarios before enabling caching. As noted previously, with misconfiguration you can inadvertently cache user specific data that can be shared by multiple users resulting privacy incidents.

## Request methods

Only requests that use the `GET` request method are cacheable. All other request methods are always proxied through the network.

## Delivery of large files

Azure Front Door delivers large files without a cap on file size. If caching is enabled, Front Door uses a technique called *object chunking*. When a large file is requested, Front Door retrieves smaller pieces of the file from the origin. After Front Door receives a full file request or byte-range file request, the Front Door environment requests the file from the origin in chunks of 8 MB.

After the chunk arrives at the Azure Front Door environment, it's cached and immediately served to the user. Front Door then prefetches the next chunk in parallel. This prefetch ensures that the content stays one chunk ahead of the user, which reduces latency. This process continues until the entire file gets downloaded (if requested) or the client closes the connection. For more information on the byte-range request, read [RFC 7233](https://www.rfc-editor.org/info/rfc7233).

Front Door caches any chunks as they're received so the entire file doesn't need to be cached on the Front Door cache. Subsequent requests for the file or byte ranges are served from the cache. If the chunks aren't all cached, prefetching is used to request chunks from the origin.

This optimization relies on the origin's ability to support byte-range requests. If the origin doesn't support byte-range requests, or if it doesn't handle range requests correctly, then this optimization isn't effective.

When your origin responds to a request with a `Range` header, it must respond in one of the following ways:

- **Return a ranged response.** The response must use HTTP status code 206. Also, the `Content-Range` response header must be present, and must match the actual length of the content that your origin returns. If your origin doesn't send the correct response headers with valid values, Azure Front Door doesn't cache the response, and you might see inconsistent behavior.

  > [!TIP]
  > If your origin compresses the response, ensure that the `Content-Range` header value matches the actual length of the compressed response.

- **Return a non-ranged response.** If your origin can't handle range requests, it can ignore the `Range` header and return a nonranged response. Ensure that the origin returns a response status code other than 206. For example, the origin might return a 200 OK response.

If the origin uses Chunked Transfer Encoding (CTE) to send data to the Azure Front Door POP, response sizes greater than 8 MB aren't supported.

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

If a request supports gzip and Brotli compression, Brotli compression takes precedence.

When a request for an asset specifies compression and the request results in a cache miss, Azure Front Door (classic) does compression of the asset directly on the POP server. Afterward, the compressed file is served from the cache. The resulting item is returned with a `Transfer-Encoding: chunked` response header.

If the origin uses Chunked Transfer Encoding (CTE) to send compressed data to the Azure Front Door PoP, then response sizes greater than 8 MB aren't supported.

> [!NOTE]
> Range requests may be compressed into different sizes. Azure Front Door requires the content-length values to be the same for any GET HTTP request. If clients send byte range requests with the `Accept-Encoding` header that leads to the Origin responding with different content lengths, then Azure Front Door will return a 503 error. You can either disable compression on the origin, or create a Rules Engine rule to remove the `Accept-Encoding` header from the request for byte range requests.

::: zone-end

## Query string behavior

With Azure Front Door, you can control how files are cached for a web request that contains a query string.

In a web request with a query string, the query string is that portion of the request that occurs after a question mark (`?`). A query string can contain one or more key-value pairs, in which the field name and its value are separated by an equals sign (`=`). Each key-value pair is separated by an ampersand (&).

For example, the URL `http://www.contoso.com/content.mov?field1=value1&field2=value2` contains two query strings:
- `field1`, with a value of `value1`.
- `field2`, with a value of `value2`.

If there's more than one key-value pair in a query string of a request then their order doesn't matter.

When you configure caching, you specify how the cache should handle query strings. The following behaviors are supported:

* **Ignore Query String**: In this mode, Azure Front Door passes the query strings from the client to the origin on the first request and caches the asset. Future requests for the asset that are served from the Front Door environment ignore the query strings until the cached asset expires.

* **Use Query String**: In this mode, each request with a unique URL, including the query string, is treated as a unique asset with its own cache. For example, the response from the origin for a request for `www.example.ashx?q=test1` is cached at the Front Door environment and returned for ensuing caches with the same query string. A request for `www.example.ashx?q=test2` is cached as a separate asset with its own time-to-live setting.

  The order of the query string parameters doesn't matter. For example, if the Azure Front Door environment includes a cached response for the URL `www.example.ashx?q=test1&r=test2`, then a request for `www.example.ashx?r=test2&q=test1` is also served from the cache.

::: zone pivot="front-door-standard-premium"

* **Ignore Specified Query Strings** and **Include Specified Query Strings**: In this mode, you can configure Azure Front Door to include or exclude specified parameters when the cache key is generated.

  For example, suppose that the default cache key is `/foo/image/asset.html`, and a request is made to the URL `https://contoso.com/foo/image/asset.html?language=EN&userid=100&sessionid=200`. If there's a rules engine rule to exclude the `userid` query string parameter, then the query string cache key would be `/foo/image/asset.html?language=EN&sessionid=200`.

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

Cache purges on the Front Door are case-insensitive. Additionally, they're query string agnostic, which means that purging a URL purges all query string variations of it. 

::: zone-end

## Cache expiration

The following order of headers is used to determine how long an item gets stored in our cache:

1. `Cache-Control: s-maxage=<seconds>`
1. `Cache-Control: max-age=<seconds>`
1. `Expires: <http-date>`

Some `Cache-Control` response header values indicate that the response isn't cacheable. These values include `private`, `no-cache`, and `no-store`. Front Door honors these header values and doesn't cache the responses, even if you override the caching behavior by using the Rules Engine.

If the `Cache-Control` header isn't present on the response from the origin, by default Front Door randomly determines a cache duration between one and three days.

> [!NOTE]
> Cache expiration can't be greater than **366 days**.
> 

## Request headers

The following request headers don't get forwarded to the origin when caching is enabled:

- `Content-Length`
- `Transfer-Encoding`
- `Accept`
- `Accept-Charset`
- `Accept-Language`

## Response headers

If the origin response is cacheable, then the `Set-Cookie` header is removed before the response is sent to the client. If an origin response isn't cacheable, Front Door doesn't strip the header. For example, if the origin response includes a `Cache-Control` header with a `max-age` value indicates to Front Door that the response is cacheable, and the `Set-Cookie` header is stripped.

In addition, Front Door attaches the `X-Cache` header to all responses. The `X-Cache` response header includes one of the following values:

- `TCP_HIT` or `TCP_REMOTE_HIT`: The first 8-MB chunk of the response is a cache hit, and the content is served from the Front Door cache.
- `TCP_MISS`: The first 8-MB chunk of the response is a cache miss, and the content is fetched from the origin.
- `PRIVATE_NOSTORE`: Request can't be cached because the *Cache-Control* response header is set to either *private* or *no-store*.
- `CONFIG_NOCACHE`: Request is configured to not cache in the Front Door profile.

## Logs and reports

::: zone pivot="front-door-standard-premium"

The [access log](front-door-diagnostics.md#access-log) includes the cache status for each request. Also, [reports](standard-premium/how-to-reports.md#caching-report) include information about how Azure Front Door's cache is used in your application.

::: zone-end

::: zone pivot="front-door-classic"

The [access log](front-door-diagnostics.md#access-log) includes the cache status for each request.

::: zone-end

## Cache behavior and duration

::: zone pivot="front-door-standard-premium"

Cache behavior and duration can be configured in Rules Engine. Rules Engine caching configuration always overrides the route configuration.

* **When caching is disabled**, Azure Front Door doesn’t cache the response contents, irrespective of the origin response directives.

* **When caching is enabled**, the cache behavior is different depending on the cache behavior value applied by the Rules Engine:

   * **Honor origin**: Azure Front Door always honors origin response header directive. If the origin directive is missing, Azure Front Door caches contents anywhere from one to three days.  
   * **Override always**: Azure Front Door always overrides with the cache duration, meaning that it caches the contents for the cache duration ignoring the values from origin response directives. This behavior only applies if the response is cacheable.
   * **Override if origin missing**: If the origin doesn’t return caching TTL values, Azure Front Door uses the specified cache duration. This behavior only applies if the response is cacheable. 

> [!NOTE]
> * Azure Front Door makes no guarantees about the amount of time that the content is stored in the cache. Cached content may be removed from the edge cache before the content expiration if the content is not frequently used. Front Door might be able to serve data from the cache even if the cached data has expired. This behavior can help your site to remain partially available when your origins are offline.
> * Origins may specify not to cache specific responses using the Cache-Control header with a value of no-cache, private, or no-store. When used in an HTTP response from the origin server to the Azure Front Door POPs, Azure Front Door supports Cache-control directives and honors caching behaviors for Cache-Control directives in [RFC 7234 - Hypertext Transfer Protocol (HTTP/1.1): Caching (ietf.org)](https://www.rfc-editor.org/rfc/rfc7234#section-5.2.2.8). 

::: zone-end

::: zone pivot="front-door-classic"

Cache behavior and duration can be configured in both the Front Door designer routing rule and in Rules Engine. Rules Engine caching configuration always overrides the Front Door designer routing rule configuration.

* **When caching is disabled**, Azure Front Door (classic) doesn’t cache the response contents, irrespective of origin response directives.

* **When caching is enabled**, the cache behavior is different for different values of *Use cache default duration*.
    * When *Use cache default duration* is set to **Yes**, Azure Front Door (classic) always honor origin response header directive. If the origin directive is missing, Front Door caches contents anywhere from one to three days.
    * When *Use cache default duration* is set to **No**, Azure Front Door (classic) always override with the *cache duration* (required fields), meaning that it caches the contents for the cache duration ignoring the values from origin response directives. 

> [!NOTE]
> * Azure Front Door (classic) makes no guarantees about the amount of time that the content is stored in the cache. Cached content may be removed from the edge cache before the content expiration if the content is not frequently used. Azure Front Door (classic) might be able to serve data from the cache even if the cached data has expired. This behavior can help your site to remain partially available when your origins are offline.
> * The *cache duration* set in the Front Door designer routing rule is the **minimum cache duration**. This override won't work if the cache control header from the origin has a greater TTL than the override value.
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
