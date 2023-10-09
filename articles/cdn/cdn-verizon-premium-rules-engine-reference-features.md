---
title: Azure CDN from Edgio Premium rules engine features
description: Reference documentation for Azure CDN from Edgio Premium rules engine features.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: article
ms.date: 02/27/2023
ms.author: duau

---

# Azure CDN from Edgio Premium rules engine features

This article lists detailed descriptions of the available features for Azure Content Delivery Network (CDN) [Rules Engine](cdn-verizon-premium-rules-engine.md).

The third part of a rule is the feature. A feature defines the type of action that is applied to the request type that gets identified by a set of match conditions.

## <a name="top"></a>Azure CDN from Edgio Premium rules engine features reference

The available types of features are:

* [Access](#access)
* [Caching](#caching)
* [Comment](#comment)
* [Headers](#headers)
* [Logs](#logs)
* [Optimize](#optimize)
* [Origin](#origin)
* [Specialty](#specialty)
* [URL](#url)

### <a name="access"></a>Access

These features are designed to control access to content.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [Deny Access (403)](https://docs.vdms.com/cdn/Content/HRE/F/Deny-Access-403.htm) | Determines whether all requests are rejected with a 403 Forbidden response. |
| [Token Auth](https://docs.vdms.com/cdn/Content/HRE/F/Token-Auth.htm) | Determines whether Token-Based Authentication gets applied to a request. |
| [Token Auth Denial Code](https://docs.vdms.com/cdn/Content/HRE/F/Token-Auth-Denial-Code.htm) | Determines the type of response that gets returned to a user when a request is denied due to Token-Based Authentication. |
| [Token Auth Ignore URL Case](https://docs.vdms.com/cdn/Content/HRE/F/Token-Auth-Ignore-URL-Case.htm) | Determines whether URL comparisons made by Token-Based Authentication are case-sensitive. |
| [Token Auth Parameter](https://docs.vdms.com/cdn/Content/HRE/F/Token-Auth-Parameter.htm) | Determines whether the Token-Based Authentication query string parameter should be renamed. |

**[Back to the top](#top)**

### <a name="caching"></a>Caching

These features are designed to customize when and how content is cached.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [Bandwidth Parameters](https://docs.vdms.com/cdn/Content/HRE/F/Bandwidth-Parameters.htm) | Determines whether bandwidth throttling parameters (for example, ec_rate and ec_prebuf) are active. |
| [Bandwidth Throttling](https://docs.vdms.com/cdn/Content/HRE/F/Bandwidth-Throttling.htm) | Throttles the bandwidth for the response provided by our edge servers. |
| [Bypass Cache](https://docs.vdms.com/cdn/Content/HRE/F/Bypass-Cache.htm) | Determines whether the request can use our caching technology. |
| [Cache-Control Header Treatment](https://docs.vdms.com/cdn/Content/HRE/F/Cache-Control-Header-Treatment.htm) |  Controls the generation of Cache-Control headers by the edge server when External Max-Age feature is active. |
| [Cache-Key Query String](https://docs.vdms.com/cdn/Content/HRE/F/Cache-Key-Query-String.htm) | Determines whether the **cache-key*** gets included or excluded query string parameters associated with a request. <br> _* A relative path that uniquely identifies an asset for caching.  Our edge servers use this relative path when checking for cached content.  By default, a cache-key doesn't contain query string parameters._ |
| [Cache-Key Rewrite](https://docs.vdms.com/cdn/Content/HRE/F/Cache-Key-Rewrite.htm) | Rewrites the cache-key associated with a request. |
| [Complete Cache Fill](https://docs.vdms.com/cdn/Content/HRE/F/Complete-Cache-Fill.htm) | Determines what happens when a request results in a partial cache miss on an edge server. |
| [Compress File Types](https://docs.vdms.com/cdn/Content/HRE/F/Compress-File-Types.htm) | Defines the file formats that get compressed on the server. | 
| [Default Internal Max-Age](https://docs.vdms.com/cdn/Content/HRE/F/Default-Internal-Max-Age.htm) | Determines the default max-age interval for edge server to origin server cache revalidation. |
| [Expires Header Treatment](https://docs.vdms.com/cdn/Content/HRE/F/Expires-Header-Treatment.htm) | Controls the generation of Expires headers by an edge server when the External Max-Age feature is active. |
| [External Max-Age](https://docs.vdms.com/cdn/Content/HRE/F/External-Max-Age.htm) | Determines the max-age interval for browser to edge server cache revalidation. |
| [Force Internal Max-Age](https://docs.vdms.com/cdn/Content/HRE/F/Force-Internal-Max-Age.htm) | Determines the max-age interval for edge server to origin server cache revalidation. |
| [H.264 Support (HTTP Progressive Download)](https://docs.vdms.com/cdn/Content/HRE/F/H.264-Support-HPD.htm) | Determines the types of H.264 file formats that may be used to stream content. |
| [H.264 Support Video Seek Params](https://docs.vdms.com/cdn/Content/HRE/F/H.264-Support-VSP-HPD.htm) | Overrides the names assigned to parameters that control seeking through H.264 media when using HTTP Progressive Download. |
| [Honor No-Cache Request](https://docs.vdms.com/cdn/Content/HRE/F/Honor-No-Cache-Request.htm) | Determines whether an HTTP client's no-cache requests gets forwarded to the origin server. |
| [Ignore Origin No-Cache](https://docs.vdms.com/cdn/Content/HRE/F/Ignore-Origin-No-Cache.htm) | Determines whether our CDN ignores certain directives served from an origin server. |
| [Ignore Unsatisfiable Ranges](https://docs.vdms.com/cdn/Content/HRE/F/Ignore-Unsatisfiable-Ranges.htm) | Determines the response that is returned to clients when a request generates a 416 Requested Range Not Satisfiable status code. |
| [Internal Max-Stale](https://docs.vdms.com/cdn/Content/HRE/F/Internal-Max-Stale.htm) | Controls how long past the normal expiration time a cached asset may be served from an edge server when the edge server is unable to revalidate the cached asset with the origin server. |
| [Partial Cache Sharing](https://docs.vdms.com/cdn/Content/HRE/F/Partial-Cache-Sharing.htm) | Determines whether a request can generate partially cached content. |
| [Prevalidate Cached Content](https://docs.vdms.com/cdn/Content/HRE/F/Prevalidate-Cached-Content.htm) | Determines whether cached content is eligible for early revalidation before its TTL expires. |
| [Refresh Zero-Byte Cache Files](https://docs.vdms.com/cdn/Content/HRE/F/Refresh-Zero-Byte-Cache-Files.htm) | Determines how an HTTP client's request for a 0-byte cache asset gets handled by our edge servers. |
| [Set Cacheable Status Codes](https://docs.vdms.com/cdn/Content/HRE/F/Set-Cacheable-Status-Codes.htm) | Defines the set of status codes that can result in cached content. |
| [Stale Content Delivery on Error](https://docs.vdms.com/cdn/Content/HRE/F/Stale-Content-Delivery-on-Error.htm) | Determines whether expired cached content is delivered when an error occurs during cache revalidation or when retrieving the requested content from the customer origin server. | 
| [Stale While Revalidate](https://docs.vdms.com/cdn/Content/HRE/F/Stale-While-Revalidate.htm) | Improves performance by allowing our edge servers to serve stale client to the requester while revalidation takes place. |

**[Back to the top](#top)**

### <a name="comment"></a>Comment

The Comment feature allows a note to be added within a rule.

**[Back to the top](#top)**

### <a name="headers"></a>Headers

These features are designed to add, modify, or delete headers from the request or response.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [Age Response Header](https://docs.vdms.com/cdn/Content/HRE/F/Age-Response-Header.htm) | Determines whether an Age response header is included in the response sent to the requester. |
| [Debug Cache Response Headers](https://docs.vdms.com/cdn/Content/HRE/F/Debug-Cache-Response-Headers.htm) | Determines whether a response may include the [X-EC-Debug response header](https://docs.vdms.com/cdn/Content/Knowledge_Base/X_EC_Debug.htm) which provides information on the cache policy for the requested asset. |
| [Modify Client Request Header](https://docs.vdms.com/cdn/Content/HRE/F/Modify-Client-Request-Header.htm) | Overwrites, appends, or deletes a header from a request. |
| [Modify Client Response Header](https://docs.vdms.com/cdn/Content/HRE/F/Modify-Client-Response-Header.htm) | Overwrites, appends, or deletes a header from a response. |
| [Set Client IP Custom Header](https://docs.vdms.com/cdn/Content/HRE/F/Set-Client-IP-Custom-Header.htm) | Allows the IP address of the requesting client to be added to the request as a custom request header. |

**[Back to the top](#top)**

### <a name="logs"></a>Logs

These features are designed to customize the data stored in raw log files.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [Custom Log Field 1](https://docs.vdms.com/cdn/Content/HRE/F/Custom-Log-Field-1.htm) | Determines the format and the content that is assigned to the custom log field in a raw log file. |
| [Log Query String](https://docs.vdms.com/cdn/Content/HRE/F/Log-Query-String.htm) | Determines whether a query string is stored along with the URL in access logs. |

**[Back to the top](#top)**

### <a name="optimize"></a>Optimize

These features determine whether a request undergoes the optimizations provided by Edge Optimizer.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| Edge Optimizer | Determines whether Edge Optimizer can be applied to a request. |
| Edge Optimizer – Instantiate Configuration | Instantiates or activates the Edge Optimizer configuration associated with a site. |

**[Back to the top](#top)**

### <a name="origin"></a>Origin

These features are designed to control how the CDN communicates with an origin server.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [Maximum Keep-Alive Requests](https://docs.vdms.com/cdn/Content/HRE/F/Maximum-Keep-Alive-Requests.htm) | Defines the maximum number of requests for a Keep-Alive connection before it's closed. |
| [Proxy Special Headers](https://docs.vdms.com/cdn/Content/HRE/F/Proxy-Special-Headers.htm) | Defines the set of [CDN-specific request headers](https://docs.vdms.com/cdn/Content/Knowledge_Base/Request-Format.htm#RequestHeaders) that gets forwarded from an edge server to an origin server. |

**[Back to the top](#top)**

### <a name="specialty"></a>Specialty

These features provide advanced functionality and should get used by advanced users.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [Cacheable HTTP Methods](https://docs.vdms.com/cdn/Content/HRE/F/Cacheable-HTTP-Methods.htm) | Determines the set of extra HTTP methods that can be cached on our network. |
| [Cacheable Request Body Size](https://docs.vdms.com/cdn/Content/HRE/F/Cacheable-Request-Body-Size.htm) | Defines the threshold for determining whether a POST response can be cached. |
| [QUIC](https://docs.vdms.com/cdn/Content/HRE/F/QUIC.htm) | Determines whether the client is informed that our CDN service supports QUIC. |
| [Streaming Optimization](https://docs.vdms.com/cdn/Content/HRE/F/Streaming-Optimization.htm) | Tunes your caching configuration to optimize performance for live streams and to reduce the load on the origin server. |
| [User Variable](https://docs.vdms.com/cdn/Content/HRE/F/User-Variable.htm) | Assigns a value to a user-defined variable that is passed to your bespoke traffic processing solution. |

**[Back to the top](#top)**

### <a name="url"></a>URL

These features allow a request to be redirected or rewritten to a different URL.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [Follow Redirects](https://docs.vdms.com/cdn/Content/HRE/F/Follow-Redirects.htm) | Determines whether requests can be redirected to the hostname defined in the Location header returned by a customer origin server. |
| [URL Redirect](https://docs.vdms.com/cdn/Content/HRE/F/URL-Redirect.htm) | Redirects requests via the Location header. |
| [URL Rewrite](https://docs.vdms.com/cdn/Content/HRE/F/URL-Rewrite.htm) | Rewrites the request URL. |

**[Back to the top](#top)**

For the most recent features, see the [Edgio Rules Engine documentation](https://docs.vdms.com/cdn/index.html#Quick_References/HRE_QR.htm#Actions).

## Next steps

- [Rules engine reference](cdn-verizon-premium-rules-engine-reference.md)
- [Rules engine conditional expressions](cdn-verizon-premium-rules-engine-reference-conditional-expressions.md)
- [Rules engine match conditions](cdn-verizon-premium-rules-engine-reference-match-conditions.md)
- [Override HTTP behavior using the rules engine](cdn-verizon-premium-rules-engine.md)
- [Azure CDN overview](cdn-overview.md)
