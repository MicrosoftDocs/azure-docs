---
title: Using Azure Front Door Standard/Premium with Cross-Origin Resource Sharing
description: Learn how to use the Azure Front Door (AFD) to with Cross-Origin Resource Sharing (CORS).
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/18/2021
ms.author: qixwang
---

# Using Azure Front Door Standard/Premium with Cross-Origin Resource Sharing (CORS)

> [!Note]
> This documentation is for Azure Front Door Standard/Premium. Looking for information on Azure Front Door? View [here](../front-door-overview.md).

## What is CORS?

CORS (Cross Origin Resource Sharing) is an HTTP feature that enables a web application running under one domain to access resources in another domain. To reduce the possibility of cross-site scripting attacks, all modern web browsers implement a security restriction known as [same-origin policy](https://www.w3.org/Security/wiki/Same_Origin_Policy). This prevents a web page from calling APIs in a different domain.  CORS provides a secure way to allow one origin (the origin domain) to call APIs in another origin.

## How it works

There are two types of CORS requests, *simple requests* and *complex requests.*

### For simple requests:

1. The browser sends the CORS request with another **Origin** HTTP request header. The value of this header is the origin that served the parent page, which is defined as the combination of *protocol,* *domain,* and *port.*  When a page from https\://www.contoso.com attempts to access a user's data in the fabrikam.com origin, the following request header would be sent to fabrikam.com:

   `Origin: https://www.contoso.com`

2. The server may respond with any of the following:

   * An **Access-Control-Allow-Origin** header in its response indicating which origin site is allowed. For example:

     `Access-Control-Allow-Origin: https://www.contoso.com`

   * An HTTP error code such as 403 if the server doesn't allow the cross-origin request after checking the Origin header

   * An **Access-Control-Allow-Origin** header with a wildcard that allows all origins:

     `Access-Control-Allow-Origin: *`

### For complex requests:

A complex request is a CORS request where the browser is required to send a *preflight request* (that is, a preliminary probe) before sending the actual CORS request. The preflight request asks the server permission if the original CORS request can continue and is an `OPTIONS` request to the same URL.

> [!TIP]
> For more details on CORS flows and common pitfalls, view the [Guide to CORS for REST APIs](https://www.moesif.com/blog/technical/cors/Authoritative-Guide-to-CORS-Cross-Origin-Resource-Sharing-for-REST-APIs/).
>
>

## Wildcard or single origin scenarios
CORS on Azure Front Door will work automatically with no extra configuration when the **Access-Control-Allow-Origin** header is set to wildcard (*) or a single origin.  Azure Front Door will cache the first response and ensuing requests will use the same header.

If requests have already been made to the Azure Front Door before CORS being set on your origin, you'll need to purge content on your endpoint content to reload the content with the **Access-Control-Allow-Origin** header.

## Multiple origin scenarios
If you need to allow a specific list of origins to be allowed for CORS, things get a little more complicated. The problem occurs when the CDN caches the **Access-Control-Allow-Origin** header for the first CORS origin.  When a different CORS origin makes another request, the CDN will serve the cached **Access-Control-Allow-Origin** header, which won't match. There are several ways to correct this problem.

### Azure Front Door Rule Set

On Azure Front Door, you can create a rule in the Azure Front Door [Rules Set](../front-door-rules-engine.md) to check the **Origin** header on the request. If it's a valid origin, your rule will set the **Access-Control-Allow-Origin** header with the correct value. In this case, the **Access-Control-Allow-Origin** header from the file's origin server is ignored and the AFD's rules engine completely manages the allowed CORS origins.

:::image type="content" source="../media/troubleshooting-cross-origin-resource-sharing/cross-origin-resource.png" alt-text="Screenshot of rules example with rule set.":::

> [!TIP]
> You can add additional actions to your rule to modify additional response headers, such as **Access-Control-Allow-Methods**.
> 

## Next steps

* Learn how to [create a Front Door](create-front-door-portal.md).
