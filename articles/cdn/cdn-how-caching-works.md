---
title: How caching works in the Azure Content Delivery Network | Microsoft Docs
description: 'Caching is the process of storing data locally so that future requests for that data can be accessed more quickly.'
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
# How caching works

This article provides an overview of general caching concepts and how the Azure Content Delivery Network (CDN) uses caching to improve performance. If you’d like to learn about how to customize caching behavior on your CDN endpoint, see [Control Azure CDN caching behavior with caching rules](cdn-caching-rules.md) and [Control Azure CDN caching behavior with query strings](cdn-query-string.md).

## Introduction to caching

Caching is the process of storing data locally so that future requests for that data can be accessed more quickly. In the most common type of caching, web browser caching, a web browser stores copies of static data locally on a local hard drive. By using caching, the web browser can avoid making multiple round-trips to the server and instead access the same data locally, thus saving time and resources. Caching is well-suited for locally managing small, static data such as static images, CSS files, and JavaScript files.

Similarly, caching is used by a content delivery network on edge servers close to the user to avoid requests traveling back to the origin and reducing end-user latency. Unlike a web browser cache, which is used only for a single user, the CDN has a shared cache. In a CDN shared cache, a file that is requested by one user can be accessed later by other users, which greatly decreases the number of requests to the origin server.

Dynamic resources that change frequently or are unique to an individual user cannot be cached. Those types of resources, however, can take advantage of dynamic site acceleration (DSA) optimization on the Azure Content Delivery Network for performance improvements.

Caching can occur at multiple levels between the origin server and the end user:

- Web server: Uses a shared cache (for multiple users).
- Content delivery network: Uses a shared cache (for multiple users).
- Internet service provider (ISP): Uses a shared cache (for multiple users).
- Web browser: Uses a private cache (for one user).

Each cache typically manages its own resource freshness and performs validation when a file is stale. This behavior is defined in the HTTP caching specification, [RFC 7234](https://tools.ietf.org/html/rfc7234).

### Resource freshness

Because a cached resource can potentially be out-of-date, or stale (as compared to the corresponding resource on the origin server), it is important for any caching mechanism to control when content is refreshed. To save time and bandwidth consumption, a cached resource is not compared to the version on the origin server every time it is accessed. Instead, as long as a cached resource is considered to be fresh, it is assumed to be the most current version and is sent directly to the client. A cached resource is considered to be fresh when its age is less than the age or period defined by a cache setting. For example, when a browser reloads a web page, it verifies that each cached resource on your hard drive is fresh and loads it. If the resource is not fresh (stale), an up-to-date copy is loaded from the server.

### Validation

If a resource is considered to be stale, the origin server is asked to validate it, that is, determine whether the data in the cache still matches what’s on the origin server. If the file has been modified on the origin server, the cache updates its version of the resource. Otherwise, if the resource is fresh, the data is delivered directly from the cache without validating it first.

### CDN caching

Caching is integral to the way a CDN operates to speed up delivery and reduce origin load for static assets such as images, fonts, and videos. In CDN caching, static resources are selectively stored on strategically placed servers that are more local to a user and offers the following advantages:

- Because most web traffic is static (for example, images, fonts, and videos), CDN caching reduces network latency by moving content closer to the user, thus reducing the distance that data travels.

- By offloading work to a CDN, caching can reduce network traffic and the load on the origin server. Doing so reduces cost and resource requirements for the application, even when there are large numbers of users.

Similar to a web browser, you can control how CDN caching is performed by sending cache-directive headers. Cache-directive headers are HTTP headers, which are typically added by the origin server. Although most of these headers were originally designed to address caching in client browsers, they are now also used by all intermediate caches, such as CDNs. Two headers can be used to define cache freshness: `Cache-Control` and `Expires`. `Cache-Control` is more current and takes precedence over `Expires`, if both exist. There are also two types of headers used for validation (called validators): `ETag` and `Last-Modified`. `ETag` is more current and takes precedence over `Last-Modified`, if both are defined.  

## Cache-directive headers

Azure CDN supports the following HTTP cache-directive headers, which define cache duration and cache sharing: 

`Cache-Control`  
- Introduced in HTTP 1.1 to give web publishers more control over their content and to address the limitations of the `Expires` header.
- Overrides the `Expires` header if both it and `Cache-Control` are defined.
- When used in a request header: Ignored by Azure CDN, by default.
- When used in a response header: Azure CDN honors the following `Cache-Control` directives when it is using general web delivery, large file download, and general/video-on-demand media streaming optimizations:  
   - `max-age`: A cache can store the content for the number of seconds specified. For example, `Cache-Control: max-age=5`. This directive specifies the maximum amount of time the content is considered to be fresh.
   - `private`: The content is for a single user only; don’t store content that the shared caches, such as CDN.
   - `no-cache`: Cache the content, but must validate the content every time before delivering it from the cache. Equivalent to `Cache-Control: max-age=0`.
   - `no-store`: Never cache the content. Remove content if it has been previously stored.

`Expires` 
- Legacy header introduced in HTTP 1.0; supported for backwards compatibility.
- Uses a date-based expiration time with second precision. 
- Similar to `Cache-Control: max-age`.
- Used when `Cache-Control` doesn't exist.

`Pragma` 
   - By default, not honored by Azure CDN.
   - Legacy header introduced in HTTP 1.0; supported for backwards compatibility.
   - Used as a client request header with the following directive: `no-cache`. This directive instructs the server to deliver a fresh version of the resource.
   - `Pragma: no-cache` is equivalent to `Cache-Control: no-cache`.

By default, DSA optimizations ignore these headers. You can adjust how the Azure CDN treats these headers by using CDN caching rules. For more information, see [Control Azure CDN caching behavior with caching rules](cdn-caching-rules.md).

## Validators

When the cache is stale, HTTP cache validators are used to compare the cached version of a file with the version on the origin server. **Azure CDN from Verizon** supports both ETag and Last-Modified validators by default, while **Azure CDN from Akamai** supports only Last-Modified by default.

`ETag`
- **Azure CDN from Verizon** uses `ETag` by default while **Azure CDN from Akamai** does not.
- `ETag` defines a string that is unique for every file and version of a file. For example, `ETag: "17f0ddd99ed5bbe4edffdd6496d7131f"`.
- Introduced in HTTP 1.1 and is more current than `Last-Modified`. Useful when the last modified date is difficult to determine.
- Supports both strong validation and weak validation; however, Azure CDN supports only strong validation. For strong validation, the two resource representations must be byte-for-byte identical. 
- A cache validates a file that uses `ETag` by sending an `If-None-Match` header with one or more `ETag` validators in the request. For example, `If-None-Match: "17f0ddd99ed5bbe4edffdd6496d7131f"`. If the server’s version matches an `ETag` validator on the list, it sends status code 304 (Not Modified) in its response. If the version is different, the server responds with status code 200 (OK) and the updated resource.

`Last-Modified`
- For **Azure CDN from Verizon only**, Last-Modified is used if ETag is not part of the HTTP response. 
- Specifies the date and time that the origin server has determined the resource was last modified. For example, `Last-Modified: Thu, 19 Oct 2017 09:28:00 GMT`.
- A cache validates a file using `Last-Modified` by sending an `If-Modified-Since` header with a date and time in the request. The origin server compares that date with the `Last-Modified` header of the latest resource. If the resource has not been modified since the specified time, the server returns status code 304 (Not Modified) in its response. If the resource has been modified, the server returns status code 200 (OK) and the updated resource.

## Determining which files can be cached

Not all resources can be cached. The following table shows what resources can be cached, based on the type of HTTP response. Resources delivered with HTTP responses that don't meet all of these conditions cannot be cached. For **Azure CDN from Verizon Premium** only, you can use the Rules Engine to customize some of these conditions.

|                   | Azure CDN from Verizon | Azure CDN from Akamai            |
|------------------ |------------------------|----------------------------------|
| HTTP status codes | 200                    | 200, 203, 300, 301, 302, and 401 |
| HTTP method       | GET                    | GET                              |
| File size         | 300 GB                 | <ul><li>General web delivery optimization: 1.8 GB</li> <li>Media streaming optimizations: 1.8 GB</li> <li>Large file optimization: 150 GB</li> |

## Default caching behavior

The following table describes the default caching behavior for the Azure CDN products and their optimizations.

|                    | Verizon - general web delivery | Verizon – dynamic site acceleration | Akamai - general web delivery | Akamai - dynamic site acceleration | Akamai - large file download | Akamai - general or video-on-demand media streaming |
|--------------------|--------|------|-----|----|-----|-----|
| **Honor origin**   | Yes    | No   | Yes | No | Yes | Yes |
| **CDN cache duration** | 7 days | None | 7 days | None | 1 day | 1 year |

**Honor origin**: Specifies whether to honor the [supported cache-directive headers](#http-cache-directive-headers) if they exist in the HTTP response from the origin server.

**CDN cache duration**: Specifies the amount of time for which a resource is cached on the Azure CDN. However, if **Honor origin** is Yes and the HTTP response from the origin server includes the cache-directive header `Expires` or `Cache-Control: max-age`, Azure CDN uses the duration value specified by the header instead. 

## Next steps

- To learn how to customize and override the default caching behavior on the CDN through caching rules, see [Control Azure CDN caching behavior with caching rules](cdn-caching-rules.md). 
- To learn how to use query strings to control caching behavior, see [Control Azure CDN caching behavior with query strings](cdn-query-string.md).



