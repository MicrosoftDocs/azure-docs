---
title: How caching works in Azure Content Delivery Network
description: Caching is the process of storing data locally so that future requests for that data can be accessed more quickly.
services: cdn
author: halkazwini
ms.author: halkazwini
manager: kumud
ms.service: azure-cdn
ms.topic: concept-article
ms.date: 03/31/2025
ROBOTS: NOINDEX
---

# How caching works

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

This article provides an overview of general caching concepts and how [Azure Content Delivery Network](cdn-overview.md) uses caching to improve performance. If you'd like to learn about how to customize caching behavior on your content delivery network endpoint, see [Control Azure Content Delivery Network caching behavior with caching rules](cdn-caching-rules.md) and [Control Azure Content Delivery Network caching behavior with query strings](cdn-query-string.md).

## Introduction to caching

Caching is the process of storing data locally so that future requests for that data can be accessed more quickly. In the most common type of caching, web browser caching, a web browser stores copies of static data locally on a local hard drive. By using caching, the web browser can avoid making multiple round-trips to the server and instead access the same data locally, thus saving time and resources. Caching is well-suited for locally managing small, static data such as static images, CSS files, and JavaScript files.

Similarly, caching is used by a content delivery network on edge servers close to the user to avoid requests traveling back to the origin and reducing end-user latency. Unlike a web browser cache, which is used only for a single user, the content delivery network has a shared cache. In a content delivery network shared cache, a file request by a user can be used by another user, which greatly decreases the number of requests to the origin server.

Dynamic resources that change frequently or are unique to an individual user can't be cached. Those types of resources, however, can take advantage of dynamic site acceleration (DSA) optimization on the Azure content delivery network for performance improvements.

Caching can occur at multiple levels between the origin server and the end user:

- Web server: Uses a shared cache (for multiple users).
- Content delivery network: Uses a shared cache (for multiple users).
- Internet service provider (ISP): Uses a shared cache (for multiple users).
- Web browser: Uses a private cache (for one user).

Each cache typically manages its own resource freshness and performs validation when a file is stale. This behavior is defined in the HTTP caching specification, [RFC 7234](https://tools.ietf.org/html/rfc7234).

### Resource freshness

Since a cached resource can potentially be out-of-date, or stale (as compared to the corresponding resource on the origin server), it's important for any caching mechanism to control when content gets a refresh. To save time and bandwidth consumption, a cached resource isn't compared to the version on the origin server every time it's accessed. Instead, as long as a cached resource is considered to be fresh, it's assumed to be the most current version and is sent directly to the client. A cached resource is considered to be fresh when its age is less than the age or period defined by a cache setting. For example, when a browser reloads a web page, it verifies that each cached resource on your hard drive is fresh and loads it. If the resource isn't fresh (stale), an up-to-date copy is loaded from the server.

### Validation

If a resource is considered stale, the origin server gets asked to validate it to determine whether the data in the cache still matches what's on the origin server. If the file has been modified on the origin server, the cache updates its version of the resource. Otherwise, if the resource is fresh, the data is delivered directly from the cache without validating it first.

<a name='cdn-caching'></a>

### Content delivery network caching

Caching is integral to the way a content delivery network operates to speed up delivery and reduce origin load for static assets such as images, fonts, and videos. In content delivery network caching, static resources are selectively stored on strategically placed servers that are more local to a user and offers the following advantages:

- Because most web traffic is static (for example, images, fonts, and videos), content delivery network caching reduces network latency by moving content closer to the user, thus reducing the distance that data travels.

- By offloading work to a content delivery network, caching can reduce network traffic and the load on the origin server. Doing so reduces cost and resource requirements for the application, even when there are large numbers of users.

Similar to how caching is implemented in a web browser, you can control how caching is performed in a content delivery network by sending cache-directive headers. Cache-directive headers are HTTP headers, which are typically added by the origin server. Although most of these headers were originally designed to address caching in client browsers, they're now also used by all intermediate caches, such as content delivery networks.

Two headers can be used to define cache freshness: `Cache-Control` and `Expires`. `Cache-Control` is more current and takes precedence over `Expires`, if both exist. There are also two types of headers used for validation (called validators): `ETag` and `Last-Modified`. `ETag` is more current and takes precedence over `Last-Modified`, if both are defined.

## Cache-directive headers

Azure Content Delivery Network supports the following HTTP cache-directive headers, which define cache duration and cache sharing.

**Cache-Control:**
- Introduced in HTTP 1.1 to give web publishers more control over their content and to address the limitations of the `Expires` header.
- Overrides the `Expires` header, if both it and `Cache-Control` are defined.
- When used in an HTTP request from the client to the content delivery network POP, `Cache-Control` gets ignored by all Azure Content Delivery Network profiles, by default.
- When used in an HTTP response from the origin server to the content delivery network POP, `Cache-Control` is honored by all Azure Content Delivery Network profiles, by default. Azure CDN also honors caching behaviors for Cache-Control directives in [RFC 7234 - Hypertext Transfer Protocol (HTTP/1.1): Caching (ietf.org)](https://tools.ietf.org/html/rfc7234#section-5.2.2.8).

**Expires:**
- Legacy header introduced in HTTP 1.0; supported for backward compatibility.
- Uses a date-based expiration time with second precision.
- Similar to `Cache-Control: max-age`.
- Used when `Cache-Control` doesn't exist.

**Pragma:**
   - Not honored by Azure Content Delivery Network, by default.
   - Legacy header introduced in HTTP 1.0; supported for backward compatibility.
   - Used as a client request header with the following directive: `no-cache`. This directive instructs the server to deliver a fresh version of the resource.
   - `Pragma: no-cache` is equivalent to `Cache-Control: no-cache`.

## Validators

When the cache is stale, HTTP cache validators are used to compare the cached version of a file with the version on the origin server. **Azure CDN Standard from Microsoft** supports only `Last-Modified`.

> [!NOTE]
> **Azure CDN from Microsoft (classic)** doesn't support `ETag`. 

**Last-Modified:**
- Specifies the date and time that the origin server has determined the resource was last modified. For example, `Last-Modified: Thu, 19 Oct 2017 09:28:00 GMT`.
- For content larger than 8 MB, origin backend servers should maintain consistent `Last-Modified` timestamps per asset. Returning inconsistent `Last-Modified` times from backend servers will cause validator mismatch errors and result in HTTP 5XX failures. Azure Storage may not support consistent `Last-Modified` timestamps across replicas, which can cause similar validator mismatch errors.
- A cache validates a file using `Last-Modified` by sending an `If-Modified-Since` header with a date and time in the request. The origin server compares that date with the `Last-Modified` header of the latest resource. If the resource hasn't been modified since the specified time, the server returns status code 304 (Not Modified) in its response. If the resource has been modified, the server returns status code 200 (OK) and the updated resource.

## Determining which files can be cached

Not all resources can be cached. The following table shows what resources can be cached, based on the type of HTTP response. Resources delivered with HTTP responses that don't meet all of these conditions can't be cached.

| Conditions | Value |
|--|--|
| **HTTP status codes** | 200, 203, 206, 300, 301, 410, 416 |
| **HTTP methods** | GET, HEAD |
| **File size limits** | 300 GB |

For caching to work on a resource, the origin server must support any HEAD and GET HTTP requests and the content-length values must be the same for any HEAD and GET HTTP responses for the asset. For a HEAD request, the origin server must support the HEAD request, and must respond with the same headers as if it received a GET request.

> [!NOTE]
> Requests that include authorization header will not be cached.

## Default caching behavior

The default caching behavior for Azure CDN is to **Honor origin** and cache content for two days.

**Honor origin**: This setting specifies whether to respect the cache-directive headers (`Cache-Control` or `Expires`) if they are present in the HTTP response from the origin server.

**CDN cache duration**: This setting specifies the duration for which a resource is cached on the Azure CDN. If **Honor origin** is enabled and the HTTP response from the origin server includes the `Cache-Control: max-age` or `Expires` header, Azure CDN will use the duration specified by these headers instead of the default two-day period.

> [!NOTE]
> Azure CDN makes no guarantees about minimum amount of time that the object will be stored in the cache. Cached contents might be evicted from the content delivery network cache before they are expired if the contents are not requested as frequently to make room for more frequently requested contents.
>

## Next steps

- To learn how to customize and override the default caching behavior on the content delivery network through caching rules, see [Control Azure Content Delivery Network caching behavior with caching rules](cdn-caching-rules.md).
- To learn how to use query strings to control caching behavior, see [Control Azure Content Delivery Network caching behavior with query strings](cdn-query-string.md).
