---
title: HTTP headers | Microsoft Docs
description: This article describes how HTTP headers work.
services: cdn
documentationcenter: ''
author: dksimpson
manager: akucer
editor: ''

ms.assetid: 
ms.service: cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/12/2018
ms.author: rli

---
# HTTP headers
When you use a client, such as a web browser, to fetch a CDN resource from a point-of-presence (POP) server or origin server, you make a request by using the HTTP protocol. The origin server interprets the request message and returns the appropriate response message, which is either the resource you requested or an error message. Included in these requests and responses are HTTP headers, which are name-value pairs used to transmit information between client and server. An HTTP header consists of a case-insensitive name followed by a colon (:) and its value. Azure CDN uses these HTTP headers in various ways as described in the following sections.

## Verizon-specific HTTP request headers

For **Azure CDN Premium from Verizon** products, when an HTTP request is sent to the origin server, the POP can add one or more reserved headers (or proxy special headers) in the client request to the CDN POP. These headers are in addition to the standard forwarding headers received. For information about standard request headers, see [Request fields](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_fields).

To prevent one of these reserved headers from being added in the CDN POP request to the origin server, you must create a rule with the Proxy Special Headers feature in the rules engine. In this rule, add a list of all the headers except the one you wish to remove. If you've enabled the Debug Cache Response Headers feature, be sure to add the necessary  `X-EC-Debug` headers. 

For example, to remove the `Via` header, the headers field of the rule should contain the following list of headers: *X-Forwarded-For, X-Forwarded-Proto, X-Host, X-Midgress, X-Gateway-List, X-EC-Name, Host*. 

![Proxy Special Headers rule](./media/cdn-http-headers/cdn-proxy-special-header-rule.png)

The following table describes the headers that can be added by the Verizon CDN POP in the request:

Request header | Description | Example
---------------|-------------|--------
[Via](#via-request-header) | Identifies the POP server that proxied the request to an origin server. | HTTP/1.1 ECS (dca/1A2B)
X-Forwarded-For | Indicates the requester's IP address.| 10.10.10.10
X-Forwarded-Proto | Indicates the request's protocol. | http
X-Host | Indicates the request's hostname. | cdn.mydomain.com
X-Midgress | Indicates whether the request was proxied through an additional CDN server (for example, POP server-to-origin shield server or POP server-to-ADN gateway server). <br />This header is added to the request only when midgress traffic takes place. In this case, the header is set to 1 to indicate that the request was proxied through an additional CDN server.| 1
[Host](#host-request-header) | Identifies the host and the port where the requested content may be found. | marketing.mydomain.com:80
[X-Gateway-List](#x-gateway-list-request-header) | ADN: Identifies the failover list of ADN Gateway servers assigned to a customer origin. <br />Origin shield: Indicates the set of origin shield servers assigned to a customer origin. | icn1,hhp1,hnd1
X-EC-_&lt;name&gt;_ | Request headers that begin with *X-EC* (for example, X-EC-Tag, [X-EC-Debug](#x-ec-debug-headers)) are reserved for use by the CDN.| waf-production

### Via request header
The format through which the `Via` request header identifies a POP server is specified by the following syntax:

`Via: Protocol from Platform (POP/ID)` 

The terms used in the syntax are defined as follows:
- Protocol: Indicates the version of the protocol (for example, HTTP/1.1) used to proxy the request. 

- Platform: Indicates the platform on which the content was requested. The following codes are valid for this field: 
    Code | Platform
    -----|---------
    ECAcc | HTTP Large
    ECS   | HTTP Small
    ECD   | Application delivery network (ADN)

- POP: Indicates the [POP](cdn-pop-abbreviations.md) that handled the request. 

- ID: For internal use only.

**Example Via request header**

`Via: HTTP/1.1 ECD (dca/1A2B)`

### Host request header
The POP servers will overwrite the `Host` header when both of the following conditions are true:
- The source for the requested content is a customer origin server.
- The corresponding customer origin's HTTP Host Header option is not blank.

The `Host` request header will be overwritten to reflect the value defined in the HTTP Host Header option.
If the customer origin's HTTP Host Header option is set to blank, then the `Host` request header submitted by the requester will be forwarded to that customer's origin server.

### X-Gateway-List request header
A POP server will add/overwrite the `X-Gateway-List request header when either of the following conditions are met:
- The request points to the ADN platform.
- The request is forwarded to a customer origin server that is protected by the Origin Shield feature.

### X-EC-Debug headers
The debug cache request header, `X-EC-Debug`, provides additional information about the cache policy applied to the requested asset. 

#### Usage
The response sent from the POP servers to a user includes the `X-EC-Debug header only when the following conditions are true:

- The Debug Cache Response Headers feature has been enabled on the desired request.
- The above request defines the set of debug cache response headers that will be included in the response.

#### Requesting debug cache information
Use the following directives in the desired request to define the debug cache information that will be included in the response:

Request header | Description |
---------------|-------------|
X-EC-Debug: x-ec-cache | [Cache status code](#cache-status-code-information)
X-EC-Debug: x-ec-cache-remote | [Cache status code](#cache-status-code-information)
X-EC-Debug: x-ec-check-cacheable | [Cacheable](#cacheable-response-header)
X-EC-Debug: x-ec-cache-key | [Cache-key](#cache-key-response-header)
X-EC-Debug: x-ec-cache-state | [Cache state](#cache-state-response-header)

**Syntax**

Debug cache response headers may be requested by including the following header and the desired directives in the request:

`X-EC-Debug: Directive1,Directive2,DirectiveN`

**Example**

`X-EC-Debug: x-ec-cache,x-ec-check-cacheable,x-ec-cache-key,x-ec-cache-state`

#### Cache status code information
The X-EC-Debug response header can identify a server and how it handled the response through the following directives:

Header | Description
-------|------------
X-EC-Debug: x-ec-cache | This header is reported whenever content is routed through the CDN. It identifies the POP server that fulfilled the request.
X-EC-Debug: x-ec-cache-remote | This header is reported only when the requested content was cached on an origin shield server or ADN Gateway server.

**Response header format**

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


**Sample response headers**

The following sample headers provide cache status code information for a request:

- `X-EC-Debug: x-ec-cache: TCP_HIT from ECD (lga/0FE8)`

- `X-EC-Debug: X-ec-cache-remote: TCP_HIT from ECD (dca/EF00)`

#### Cacheable response header
The `X-EC-Debug: x-ec-check-cacheable` response header indicates whether the requested content could have been cached.

This response header does not indicate whether caching took place. Rather, it indicates whether the request was eligible for caching.

**Response header format**

The `X-EC-Debug` response header reporting whether a request could have been cached is in the following format:

`X-EC-Debug: x-ec-check-cacheable: <cacheable status>`

The term used in the above response header syntax is defined as follows:

Value  | Description
-------| --------
YES    | Indicates that the requested content was eligible for caching.
NO     | Indicates that the requested content was ineligible for caching. This status may be due to one of the following reasons: <br /> - Customer-Specific Configuration: A configuration specific to your account can prevent the pop servers from caching an asset. For example, Rules Engine can prevent an asset from being cached by enabling the Bypass Cache feature for qualifying requests.<br /> - Cache Response Headers: The requested asset's Cache-Control and Expires headers can prevent the POP servers from caching it.
UNKNOWN | Indicates that the servers were unable to assess whether the requested asset was cacheable. This status typically occurs when the request is denied due to token-based authentication.

**Sample response header**

The following sample response header indicates whether the requested content could have been cached:

`X-EC-Debug: x-ec-check-cacheable: YES`

#### Cache-Key response header
The `X-EC-Debug: x-ec-cache-key` response header indicates the physical cache-key associated with the requested content. A physical cache-key consists of a path that identifies an asset for the purposes of caching. In other words, the servers will check for a cached version of an asset according to its path as defined by its cache-key.

This physical cache-key starts with a double forward slash (//) followed by the protocol used to request the content (HTTP or HTTPS). This protocol is followed by the relative path to the requested asset, which starts with the content access point (for example, _/000001/_).

By default, HTTP platforms are configured to use *standard-cache*, which means that query strings are ignored by the caching mechanism. This type of configuration prevents the cache-key from including query string data.

If a query string is recorded in the cache-key, it's converted to its hash equivalent and then inserted between the name of the requested asset and its file extension (for example, asset&lt;hash value&gt;.html).

**Response header format**

The `X-EC-Debug` response header reports physical cache-key information in the following format:

`X-EC-Debug: x-ec-cache-key: CacheKey`

**Sample response header**

The following sample response header indicates the physical cache-key for the requested content:

`X-EC-Debug: x-ec-cache-key: //http/800001/origin/images/foo.jpg`

#### Cache state response header
The `X-EC-Debug: x-ec-cache-state` response header indicates the cache state of the requested content at the time it was requested.

**Response header format**

The `X-EC-Debug` response header reports cache state information in the following format:

`X-EC-Debug: x-ec-cache-state: max-age=MASeconds (MATimePeriod); cache-ts=UnixTime (ddd, dd MMM yyyy HH:mm:ss GMT); cache-age=CASeconds (CATimePeriod); remaining-ttl=RTSeconds (RTTimePeriod); expires-delta=ExpiresSeconds`

The terms used in the above response header syntax are defined as follows:

- MASeconds: Indicates the max-age (in seconds) as defined by the requested content's Cache-Control headers.

- MATimePeriod: Converts the max-age value (that is, MASeconds) to the approximate equivalent of a larger unit (for example, days). 

- UnixTime: Indicates the cache timestamp of the requested content in Unix time (a.k.a. POSIX time or Unix epoch). The cache timestamp indicates the starting date/time from which an asset's TTL will be calculated. 

    If the origin server does not utilize a third-party HTTP caching server or if that server does not return the Age response header, then the cache timestamp will always be the date/time when the asset was retrieved or revalidated. Otherwise, the POP servers will use the Age field to calculate the asset's TTL as follows: Retrieval/RevalidateDateTime - Age.

- ddd, dd MMM yyyy HH:mm:ss GMT: Indicates the cache timestamp of the requested content. For more information, please see the UnixTime term above.

- CASeconds: Indicates the number of seconds that have elapsed since the cache timestamp.

- RTSeconds: Indicates the number of seconds remaining for which the cached content will be considered fresh. This value is calculated as follows: RTSeconds = max-age - cache age.

- RTTimePeriod: Converts the remaining TTL value (that is, RTSeconds) to the approximate equivalent of a larger unit (for example, days).

- ExpiresSeconds: Indicates the number of seconds remaining before the date/time specified in the `Expires` response header. If the `Expires` response header was not included in the response, then the value of this term is *none*.

**Sample response header**

The following sample response header indicates the cache state of the requested content at the time that it was requested:

```X-EC-Debug: x-ec-cache-state: max-age=604800 (7d); cache-ts=1341802519 (Mon, 09 Jul 2012 02:55:19 GMT); cache-age=0 (0s); remaining-ttl=604800 (7d); expires-delta=none```