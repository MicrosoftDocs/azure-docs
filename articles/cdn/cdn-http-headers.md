---
title: HTTP headers | Microsoft Docs
description: This article describes how HTTP headers work in a request and a response.
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
ms.date: 03/20/2018
ms.author: rli

---
# HTTP headers
When you use a client, such as a web browser, to fetch a CDN resource from a point-of-presence (POP) edge server or origin server, you make a request by using the HTTP protocol. The origin server interprets the request message and returns the appropriate response message, which is either the resource you requested or an error message. Included in these requests and responses are HTTP headers, which are name-value pairs used to transmit information between client and server. An HTTP header consists of a case-insensitive name followed by a colon (:) and its value. Azure CDN uses these HTTP headers in various ways as described in the following sections.

## HTTP request headers
Included in a client request is an HTTP method (such as GET), which indicates the action to be performed on the resource specified in the URL, and one or more HTTP request headers. By default, all HTTP request headers can be forwarded to the origin server. For more information about request headers, see [Request fields](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_fields).

The following table describes the most common request headers:

Request header | Description | Example
---------------|-------------|--------
[Via](#via-request-header) | Identifies the POP edge server that proxied the request to an origin server. | HTTP/1.1 ECS (dca/1A2B)
X-Forwarded-For | Indicates the requester's IP address.| 10.10.10.10
X-Forwarded-Proto | Indicates the request's protocol. | http
X-Host | Indicates the request's hostname. | cdn.mydomain.com
X-Midgress | Indicates whether the request was proxied through an additional CDN server (for example, POP edge server-to-origin shield server or POP edge server-to-ADN gateway server). <br />This header will only be added to the request when midgress traffic takes place.| 1
[Host](#host-request-header) | Identifies the host and the port where the requested content may be found. | marketing.mydomain.com:80
[X-Gateway-List](#x-gateway-list-request-header) | ADN: Identifies the failover list of ADN Gateway servers assigned to a customer origin. <br />Origin shield: Indicates the set of origin shield servers assigned to a customer origin. | icn1,hhp1,hnd1
X-EC-_&lt;name&gt;_ | Request headers that start with *X-EC* (for example, *X-EC-Tag*) are reserved for use by the CDN.| waf-production

### Via request header
The format through which the Via request header identifies a POP edge server is specified by the following syntax:
`Via: Protocol from Platform (POP/ID)` 

The terms used in the syntax are defined as follows:
- Protocol: Indicates the version of the protocol (e.g., HTTP/1.1) used to proxy the request. 
- Platform: Indicates the platform on which the content was requested. The following codes are valid for this field: 
    Code | Platform
    -----|---------
    ECAcc | HTTP Large
    ECS   | HTTP Small
    ECD   | Application delivery network (ADN)

- POP: Indicates the [POP](cdn-pop-abbreviations.md) that handled the request. 
- ID: For internal use only.

Example Via request header: `Via: HTTP/1.1 ECD (dca/1A2B)`

### Host request header

The POP edge servers will overwrite the Host header when both of the following conditions are true:
- The source for the requested content is a customer origin server.
- The corresponding customer origin's HTTP Host Header option is not blank.

The Host request header will be overwritten to reflect the value defined in the HTTP Host Header option.
If the customer origin's HTTP Host Header option is set to blank, then the Host request header submitted by the requester will be forwarded to that customer's origin server.

### X-Gateway-List request Header

A POP edge server will add/overwrite the X-Gateway-List request header when either of the following conditions are met:
- The request points to the ADN platform.
- The request is forwarded to a customer origin server that is protected by the Origin Shield feature.

## HTTP request body

Requests that are proxied through the network to an origin server will include a request body, unless either of the following conditions are true:
- A GET request is submitted.
- The request is redirected due to the Follow Redirects feature. 


## HTTP response headers
When you make a request for content, the server generates and returns an HTTP response. If the request is successful, the  response includes the response body, which contains the requested resource. In addition, the response includes a status code and one or more HTTP response headers. For more information about response headers, see [Response fields](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Response_fields).

The following table describes the most common response headers:

Response header | Description
----------------|------------
Accept-Ranges | Indicates whether a server can accept range requests. </br />Default value: bytes
Cache-Control: max-age | Indicates the maximum length of time that a request is considered fresh. A POP can serve fresh content directly from cache without having to perform a revalidation with the origin server. <br />Default value: 604800 (7 days)


### Viewing response headers
You can view the response headers in an HTTP response by using a variety of developer tools, such as:
- [Chrome DevTools](https://developer.chrome.com/devtools)
- [Firefox Developer Tools] (https://developer.mozilla.org/en-US/docs/Tools)
- [Fiddler](https://www.telerik.com/fiddler)
- [Wget](https://www.gnu.org/software/wget/)
- [curl](https://curl.haxx.se/)