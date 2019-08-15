---
title: Azure Front Door Service - caching | Microsoft Docs
description: This article helps you understand how Azure Front Door Service monitors the health of your backends
services: frontdoor
documentationcenter: ''
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/10/2018
ms.author: sharadag
---

# Caching with Azure Front Door Service
The following document specifies behavior for Front Door with routing rules that have enabled caching.

## Delivery of large files
Azure Front Door Service delivers large files without a cap on file size. Front Door uses a technique called object chunking. When a large file is requested, Front Door retrieves smaller pieces of the file from the backend. After receiving a full or byte-range file request, a Front Door environment requests the file from the backend in chunks of 8 MB.

</br>After the chunk arrives at the Front Door environment, it is cached and immediately served to the user. Front Door then pre-fetches the next chunk in parallel. This pre-fetch ensures that the content stays one chunk ahead of the user, which reduces latency. This process continues until the entire file is downloaded (if requested), all byte ranges are available (if requested), or the client terminates the connection.

</br>For more information on the byte-range request, read [RFC 7233](https://web.archive.org/web/20171009165003/http://www.rfc-base.org/rfc-7233.html).
Front Door caches any chunks as they're received and so the entire file doesn't need to be cached on the Front Door cache. Subsequent requests for the file or byte ranges are served from the cache. If not all the chunks are cached, pre-fetching is used to request chunks from the backend. This optimization relies on the ability of the backend to support byte-range requests; if the backend doesn't support byte-range requests, this optimization isn't effective.

## File compression
Front Door can dynamically compress content on the edge, resulting in a smaller and faster response to your clients. All files are eligible for compression. However, a file must be of a MIME type that eligible for compression list. Currently, Front Door does not allow this list to be changed. The current list is:</br>
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
When a request for an asset specifies compression and the request results in a cache miss, Front Door performs compression of the asset directly on the POP server. Afterward, the compressed file is served from the cache. The resulting item is returned with a transfer-encoding: chunked.

## Query string behavior
With Front Door, you can control how files are cached for a web request that contains a query string. In a web request with a query string, the query string is that portion of the request that occurs after a question mark (?). A query string can contain one or more key-value pairs, in which the field name and its value are separated by an equals sign (=). Each key-value pair is separated by an ampersand (&). For example, http://www.contoso.com/content.mov?field1=value1&field2=value2. If there is more than one key-value pair in a query string of a request, their order does not matter.
- **Ignore query strings**: Default mode. In this mode, Front Door passes the query strings from the requestor to the backend on the first request and caches the asset. All subsequent requests for the asset that are served from the Front Door environment ignore the query strings until the cached asset expires.

- **Cache every unique URL**: In this mode, each request with a unique URL, including the query string, is treated as a unique asset with its own cache. For example, the response from the backend for a request for `www.example.ashx?q=test1` is cached at the Front Door environment and returned for subsequent caches with the same query string. A request for `www.example.ashx?q=test2` is cached as a separate asset with its own time-to-live setting.

## Cache purge
Front Door will cache assets until the asset's time-to-live (TTL) expires. After the asset's TTL expires, when a client requests the asset, the Front Door environment will retrieve a new updated copy of the asset to serve the client request and store refresh the cache.
</br>The best practice to make sure your users always obtain the latest copy of your assets is to version your assets for each update and publish them as new URLs. Front Door will immediately retrieve the new assets for the next client requests. Sometimes you may wish to purge cached content from all edge nodes and force them all to retrieve new updated assets. This might be due to updates to your web application, or to quickly update assets that contain incorrect information.

</br>Select what assets you wish to purge from the edge nodes. If you wish to clear all assets, click the Purge all checkbox. Otherwise, type the path of each asset you wish to purge in the Path textbox. Below formats are supported in the path.
1. **Single URL purge**: Purge individual asset by specifying the full URL, with the file extension, for example, /pictures/strasbourg.png;
2. **Wildcard purge**: Asterisk (\*) may be used as a wildcard. Purge all folders, subfolders and files under an endpoint with /\* in the path or purge all subfolders and files under a specific folder by specifying the folder followed by /\*, for example, /pictures/\*.
3. **Root domain purge**: Purge the root of the endpoint with "/" in the path.

Cache purges on the Front Door are case-insensitive. Additionally, they are query string agnostic, meaning purging a URL will purge all query-string variations of it. 

## Cache expiration
The following order of headers is used in order to determine how long an item will be stored in our cache:</br>
1. Cache-Control: s-maxage=\<seconds>
2. Cache-Control: max-age=\<seconds>
3. Expires: \<http-date>

Cache-Control response headers that indicate that the response won’t be cached such as Cache-Control: private, Cache-Control: no-cache, and Cache-Control: no-store are honored. However, if there are multiple requests in-flight at a POP for the same URL, they may share the response. If no Cache-Control is present the default behavior is that AFD will cache the resource for X amount of time where X is randomly picked between 1 to 3 days.


## Request headers

The following request headers will not be forwarded to a backend when using caching.
- Authorization
- Content-Length
- Transfer-Encoding

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
