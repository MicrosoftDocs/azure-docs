---
title:  X-EC-Debug HTTP headers for Azure CDN rules engine | Microsoft Docs
description: The X-EC-Debug debug cache request header provides additional information about the cache policy that is applied to the requested asset. These headers are specific to Verizon.
services: cdn
documentationcenter: ''
author: asudbring
manager: danielgi
editor: ''

ms.assetid: 
ms.service: azure-cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/12/2018
ms.author: allensu

---
# X-EC-Debug HTTP headers for Azure CDN rules engine
The debug cache request header, `X-EC-Debug`, provides additional information about the cache policy that is applied to the requested asset. These headers are specific to **Azure CDN Premium from Verizon** products.

## Usage
The response sent from the POP servers to a user includes the `X-EC-Debug` header only when the following conditions are met:

- The [Debug Cache Response Headers feature](https://docs.vdms.com/cdn/Content/HRE/F/Debug-Cache-Response-Headers.htm) has been enabled on the rules engine for the specified request.
- The specified request defines the set of debug cache response headers that will be included in the response.

## Requesting debug cache information
Use the following directives in the specified request to define the debug cache information that will be included in the response:

Request header | Description |
---------------|-------------|
X-EC-Debug: x-ec-cache | [Cache status code](#cache-status-code-information)
X-EC-Debug: x-ec-cache-remote | [Cache status code](#cache-status-code-information)
X-EC-Debug: x-ec-check-cacheable | [Cacheable](#cacheable-response-header)
X-EC-Debug: x-ec-cache-key | [Cache-key](#cache-key-response-header)
X-EC-Debug: x-ec-cache-state | [Cache state](#cache-state-response-header)

### Syntax

Debug cache response headers may be requested by including the following header and the specified directives in the request:

`X-EC-Debug: Directive1,Directive2,DirectiveN`

### Sample X-EC-Debug header

`X-EC-Debug: x-ec-cache,x-ec-check-cacheable,x-ec-cache-key,x-ec-cache-state`

## Cache status code information
The X-EC-Debug response header can identify a server and how it handled the response through the following directives:

Header | Description
-------|------------
X-EC-Debug: x-ec-cache | This header is reported whenever content is routed through the CDN. It identifies the POP server that fulfilled the request.
X-EC-Debug: x-ec-cache-remote | This header is reported only when the requested content was cached on an origin shield server or an ADN gateway server.

### Response header format

The X-EC-Debug header reports cache status code information in the following format:

- `X-EC-Debug: x-ec-cache: <StatusCode from Platform (POP/ID)>`

- `X-EC-Debug: x-ec-cache-remote: <StatusCode from Platform (POP/ID)>`

The terms used in the above response header syntax are defined as follows:
- StatusCode: Indicates how the requested content was handled by the CDN, which is represented through a cache status code.
    
    The TCP_DENIED status code may be reported instead of NONE when an unauthorized request is denied due to Token-Based Authentication. However, the NONE status code will continue to be used when viewing Cache Status reports or raw log data.

- Platform: Indicates the platform on which the content was requested. The following codes are valid for this field:

    Code  | Platform
    ------| --------
    ECAcc | HTTP Large
    ECS   | HTTP Small
    ECD   | Application Delivery Network (ADN)

- POP: Indicates the [POP](cdn-pop-abbreviations.md) that handled the request. 

### Sample response headers

The following sample headers provide cache status code information for a request:

- `X-EC-Debug: x-ec-cache: TCP_HIT from ECD (lga/0FE8)`

- `X-EC-Debug: x-ec-cache-remote: TCP_HIT from ECD (dca/EF00)`

## Cacheable response header
The `X-EC-Debug: x-ec-check-cacheable` response header indicates whether the requested content could have been cached.

This response header does not indicate whether caching took place. Rather, it indicates whether the request was eligible for caching.

### Response header format

The `X-EC-Debug` response header reporting whether a request could have been cached is in the following format:

`X-EC-Debug: x-ec-check-cacheable: <cacheable status>`

The term used in the above response header syntax is defined as follows:

Value  | Description
-------| --------
YES    | Indicates that the requested content was eligible for caching.
NO     | Indicates that the requested content was ineligible for caching. This status may be due to one of the following reasons: <br /> - Customer-Specific Configuration: A configuration specific to your account can prevent the pop servers from caching an asset. For example, Rules Engine can prevent an asset from being cached by enabling the Bypass Cache feature for qualifying requests.<br /> - Cache Response Headers: The requested asset's Cache-Control and Expires headers can prevent the POP servers from caching it.
UNKNOWN | Indicates that the servers were unable to assess whether the requested asset was cacheable. This status typically occurs when the request is denied due to token-based authentication.

### Sample response header

The following sample response header indicates whether the requested content could have been cached:

`X-EC-Debug: x-ec-check-cacheable: YES`

## Cache-Key response header
The `X-EC-Debug: x-ec-cache-key` response header indicates the physical cache-key associated with the requested content. A physical cache-key consists of a path that identifies an asset for the purposes of caching. In other words, the servers will check for a cached version of an asset according to its path as defined by its cache-key.

This physical cache-key starts with a double forward slash (//) followed by the protocol used to request the content (HTTP or HTTPS). This protocol is followed by the relative path to the requested asset, which starts with the content access point (for example, _/000001/_).

By default, HTTP platforms are configured to use *standard-cache*, which means that query strings are ignored by the caching mechanism. This type of configuration prevents the cache-key from including query string data.

If a query string is recorded in the cache-key, it's converted to its hash equivalent and then inserted between the name of the requested asset and its file extension (for example, asset&lt;hash value&gt;.html).

### Response header format

The `X-EC-Debug` response header reports physical cache-key information in the following format:

`X-EC-Debug: x-ec-cache-key: CacheKey`

### Sample response header

The following sample response header indicates the physical cache-key for the requested content:

`X-EC-Debug: x-ec-cache-key: //http/800001/origin/images/foo.jpg`

## Cache state response header
The `X-EC-Debug: x-ec-cache-state` response header indicates the cache state of the requested content at the time it was requested.

### Response header format

The `X-EC-Debug` response header reports cache state information in the following format:

`X-EC-Debug: x-ec-cache-state: max-age=MASeconds (MATimePeriod); cache-ts=UnixTime (ddd, dd MMM yyyy HH:mm:ss GMT); cache-age=CASeconds (CATimePeriod); remaining-ttl=RTSeconds (RTTimePeriod); expires-delta=ExpiresSeconds`

The terms used in the above response header syntax are defined as follows:

- MASeconds: Indicates the max-age (in seconds) as defined by the requested content's Cache-Control headers.

- MATimePeriod: Converts the max-age value (that is, MASeconds) to the approximate equivalent of a larger unit (for example, days). 

- UnixTime: Indicates the cache timestamp of the requested content in Unix time (also known as POSIX time or Unix epoch). The cache timestamp indicates the starting date/time from which an asset's TTL will be calculated. 

    If the origin server does not utilize a third-party HTTP caching server or if that server does not return the Age response header, then the cache timestamp will always be the date/time when the asset was retrieved or revalidated. Otherwise, the POP servers will use the Age field to calculate the asset's TTL as follows: Retrieval/RevalidateDateTime - Age.

- ddd, dd MMM yyyy HH:mm:ss GMT: Indicates the cache timestamp of the requested content. For more information, please see the UnixTime term above.

- CASeconds: Indicates the number of seconds that have elapsed since the cache timestamp.

- RTSeconds: Indicates the number of seconds remaining for which the cached content will be considered fresh. This value is calculated as follows: RTSeconds = max-age - cache age.

- RTTimePeriod: Converts the remaining TTL value (that is, RTSeconds) to the approximate equivalent of a larger unit (for example, days).

- ExpiresSeconds: Indicates the number of seconds remaining before the date/time specified in the `Expires` response header. If the `Expires` response header was not included in the response, then the value of this term is *none*.

### Sample response header

The following sample response header indicates the cache state of the requested content at the time that it was requested:

```X-EC-Debug: x-ec-cache-state: max-age=604800 (7d); cache-ts=1341802519 (Mon, 09 Jul 2012 02:55:19 GMT); cache-age=0 (0s); remaining-ttl=604800 (7d); expires-delta=none```

