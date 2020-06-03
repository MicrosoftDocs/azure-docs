---
title: Azure CDN from Verizon Premium rules engine features | Microsoft Docs
description: Reference documentation for Azure CDN from Verizon Premium rules engine features.
services: cdn
author: asudbring

ms.service: azure-cdn
ms.topic: article
ms.date: 05/26/2020
ms.author: allensu

---

# Azure CDN from Verizon Premium rules engine features

This article lists detailed descriptions of the available features for Azure Content Delivery Network (CDN) [Rules Engine](cdn-verizon-premium-rules-engine.md).

The third part of a rule is the feature. A feature defines the type of action that is applied to the request type that is identified by a set of match conditions.

## <a name="top"></a>Azure CDN from Verizon Premium rules engine features reference

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
* [Web Application Firewall](#waf)

### <a name="access"></a>Access

These features are designed to control access to content.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [Deny Access (403)](https://docs.vdms.com/cdn/Content/HRE/F/Deny-Access-403.htm) | Determines whether all requests are rejected with a 403 Forbidden response. |
| [Token Auth](https://docs.vdms.com/cdn/Content/HRE/F/Token-Auth.htm) | Determines whether Token-Based Authentication will be applied to a request. |
| [Token Auth Denial Code](https://docs.vdms.com/cdn/Content/HRE/F/Token-Auth-Denial-Code.htm) | Determines the type of response that will be returned to a user when a request is denied due to Token-Based Authentication. |
| [Token Auth Ignore URL Case](https://docs.vdms.com/cdn/Content/HRE/F/Token-Auth-Ignore-URL-Case.htm) | Determines whether URL comparisons made by Token-Based Authentication will be case-sensitive. |
| [Token Auth Parameter](https://docs.vdms.com/cdn/Content/HRE/F/Token-Auth-Parameter.htm) | Determines whether the Token-Based Authentication query string parameter should be renamed. |

**[Back to the top](#top)**

### <a name="caching"></a>Caching

These features are designed to customize when and how content is cached.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [Bandwidth Parameters](https://docs.vdms.com/cdn/Content/HRE/F/Bandwidth-Parameters.htm) | Determines whether bandwidth throttling parameters (i.e., ec_rate and ec_prebuf) will be active. |
| [Bandwidth Throttling](https://docs.vdms.com/cdn/Content/HRE/F/Bandwidth-Throttling.htm) | Throttles the bandwidth for the response provided by our edge servers. |
| [Bypass Cache](https://docs.vdms.com/cdn/Content/HRE/F/Bypass-Cache.htm) | Determines whether the request can leverage our caching technology. |
| [Cache-Control Header Treatment](https://docs.vdms.com/cdn/Content/HRE/F/Cache-Control-Header-Treatment.htm) |  Controls the generation of Cache-Control headers by the edge server when External Max-Age feature is active. |
| [Cache-Key Query String](https://docs.vdms.com/cdn/Content/HRE/F/Cache-Key-Query-String.htm) | Determines whether the **cache-key*** will include or exclude query string parameters associated with a request. <br> _* A relative path that uniquely identifies an asset for the purpose of caching.  Our edge servers use this relative path when checking for cached content.  By default, a cache-key will not contain query string parameters._ |
| [Cache-Key Rewrite](https://docs.vdms.com/cdn/Content/HRE/F/Cache-Key-Rewrite.htm) | Rewrites the cache-key associated with a request. |
| [Complete Cache Fill](https://docs.vdms.com/cdn/Content/HRE/F/Complete-Cache-Fill.htm) | Determines what happens when a request results in a partial cache miss on an edge server. |
| [Compress File Types](https://docs.vdms.com/cdn/Content/HRE/F/Compress-File-Types.htm) | Defines the file formats that will be compressed on the server. | 
| [Default Internal Max-Age](https://docs.vdms.com/cdn/Content/HRE/F/Default-Internal-Max-Age.htm) | Determines the default max-age interval for edge server to origin server cache revalidation. |
| [Expires Header Treatment](https://docs.vdms.com/cdn/Content/HRE/F/Expires-Header-Treatment.htm) | Controls the generation of Expires headers by an edge server when the External Max-Age feature is active. |
| [External Max-Age](https://docs.vdms.com/cdn/Content/HRE/F/External-Max-Age.htm) | Determines the max-age interval for browser to edge server cache revalidation. |
| [Force Internal Max-Age](https://docs.vdms.com/cdn/Content/HRE/F/Force-Internal-Max-Age.htm) | Determines the max-age interval for edge server to origin server cache revalidation. |
| [H.264 Support (HTTP Progressive Download)](https://docs.vdms.com/cdn/Content/HRE/F/H.264-Support-HPD.htm) | Determines the types of H.264 file formats that may be used to stream content. |
| [H.264 Support Video Seek Params](https://docs.vdms.com/cdn/Content/HRE/F/H.264-Support-VSP-HPD.htm) | Overrides the names assigned to parameters that control seeking through H.264 media when using HTTP Progressive Download. |
| [Honor No-Cache Request](https://docs.vdms.com/cdn/Content/HRE/F/Honor-No-Cache-Request.htm) | Determines whether an HTTP client's no-cache requests will be forwarded to the origin server. |
| 


For the most recent features, see the [Verizon Rules Engine documentation](https://docs.vdms.com/cdn/index.html#Quick_References/HRE_QR.htm#Actions).

## Next steps

- [Rules engine reference](cdn-verizon-premium-rules-engine-reference.md)
- [Rules engine conditional expressions](cdn-verizon-premium-rules-engine-reference-conditional-expressions.md)
- [Rules engine match conditions](cdn-verizon-premium-rules-engine-reference-match-conditions.md)
- [Override HTTP behavior using the rules engine](cdn-verizon-premium-rules-engine.md)
- [Azure CDN overview](cdn-overview.md)
