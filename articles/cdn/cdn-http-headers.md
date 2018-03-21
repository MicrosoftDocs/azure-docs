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
----------------|----------------------
Via | Identifies the POP that proxied the request to an origin server. | HTTP/1.1 ECS (dca/1A2B)


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