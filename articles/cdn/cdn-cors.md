---
title: Using Azure CDN with CORS
description: Learn how to use the Azure Content Delivery Network (CDN) to with Cross-Origin Resource Sharing (CORS).
services: cdn
author: halkazwini
ms.author: halkazwini
manager: kumud
ms.assetid: 86740a96-4269-4060-aba3-a69f00e6f14e
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/31/2025
ROBOTS: NOINDEX
# Customer intent: As a web developer, I want to implement CORS with Azure CDN, so that I can securely allow my web applications to access resources across different domains without facing security restrictions.
---

# Using Azure CDN with CORS

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

## What is CORS?

CORS (cross-origin resource sharing) is an HTTP feature that enables a web application running under one domain to access resources in another domain. In order to reduce the possibility of cross-site scripting attacks, all modern web browsers implement a security restriction known as [same-origin policy](https://www.w3.org/Security/wiki/Same_Origin_Policy). This restriction prevents a web page from calling APIs in a different domain. CORS provides a secure way to allow one origin (the origin domain) to call APIs in another origin.

## How it works

There are two types of CORS requests, *simple requests* and *complex requests.*

### For simple requests:

1. The browser sends the CORS request with an extra **Origin** HTTP request header. The value of the request header is the origin that served the parent page, which is defined as the combination of *protocol,* *domain,* and *port.*  When a page from HTTPS\://www.contoso.com attempts to access a user's data in the fabrikam.com origin, the following request header would be sent to fabrikam.com:

   `Origin: https://www.contoso.com`

2. The server might respond with any of the following headers:

   - An **Access-Control-Allow-Origin** header in its response indicating which origin site is allowed. For example:

     `Access-Control-Allow-Origin: https://www.contoso.com`

   - An HTTP error code such as 403 if the server doesn't allow the cross-origin request after checking the Origin header

   - An **Access-Control-Allow-Origin** header with a wildcard that allows all origins:

     `Access-Control-Allow-Origin: *`

### For complex requests:

A complex request is a CORS request where the browser is required to send a *preflight request* (that is, a preliminary probe) before sending the actual CORS request. The preflight request asks the server permission if the original CORS request can proceed and is an `OPTIONS` request to the same URL.

> [!TIP]
> For more details on CORS flows and common pitfalls, view the [Guide to CORS for REST APIs](https://www.moesif.com/blog/technical/cors/Authoritative-Guide-to-CORS-Cross-Origin-Resource-Sharing-for-REST-APIs/).
>
>

## Wildcard or single origin scenarios

CORS on Azure CDN works automatically without extra configurations when the **Access-Control-Allow-Origin** header is set to wildcard (*) or a single origin. CDN cache the first response and subsequent requests use the same header.

If requests have already been made to the CDN prior to CORS being set on your origin, you need to purge content on your endpoint content to reload the content with the **Access-Control-Allow-Origin** header.
