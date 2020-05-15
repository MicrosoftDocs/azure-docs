---
title: Azure Front Door - URL Redirect | Microsoft Docs
description: This article helps you understand how Azure Front Door supports URL redirection for their routes, if configured.
services: front-door
documentationcenter: ''
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/08/2019
ms.author: sharadag
---

# URL redirect
You can use Azure Front Door to redirect traffic. You can redirect traffic at multiple levels (protocol, hostname, path, query string) and all of the functionality can be configured for individual microservices as the redirection is path-based. This simplifies application configuration, optimizes the resource usage, and supports new redirection scenarios including global and path-based redirection.
</br>

![Azure Front Door URL Redirect][1]

## Redirection types
A redirect type sets the response status code for the clients to understand the purpose of the redirect. The following types of redirection are supported:

- **301 (Moved permanently)**: Indicates that the target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs. Use 301 status code for HTTP to HTTPS redirection. 
- **302 (Found)**: Indicates that the target resource resides temporarily under a different URI. Since the redirection might be altered on occasion, the client ought to continue to use the effective request URI for future requests.
- **307 (Temporary redirect)**: Indicates that the target resource resides temporarily under a different URI and the user agent MUST NOT change the request method if it performs an automatic redirection to that URI. Since the redirection can change over time, the client ought to continue using the original effective request URI for future requests.
- **308 (Permanent redirect)**: Indicates that the target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs. Clients with link editing capabilities, ought to automatically relink references to the effective request URI to one or more of the new references sent by the server, where possible.

## Redirection protocol
You can set the protocol that will be used for redirection. This allows for one of the most common use cases of redirect feature, that is to set HTTP to HTTPS redirection.

- **HTTPS only**: Set the protocol to HTTPS only, if you are looking to redirect the traffic from HTTP to HTTPS. Azure Front Door recommends that you should always set the redirection to HTTPS only.
- **HTTP only**: This redirects the incoming request to HTTP. Use this value only if you want to keep your traffic HTTP that is, non-encrypted.
- **Match request**: This option retains the protocol used by the incoming request. So, an HTTP request remains HTTP and an HTTPS request remains HTTPS post redirection.

## Destination host
As part of configuring a redirect routing, you can also change the hostname or domain for the redirect request. You can set this field to change the hostname in the URL for the redirection or otherwise preserve the hostname from the incoming request. So, using this field you can redirect all requests sent on `https://www.contoso.com/*` to `https://www.fabrikam.com/*`.

## Destination path
For cases where you want to replace the path segment of a URL as part of redirection, you can set this field with the new path value. Otherwise, you can choose to preserve the path value as part of redirect. So, using this field, you can redirect all requests sent to `https://www.contoso.com/\*` to  `https://www.contoso.com/redirected-site`.

## Query string parameters
You can also replace the query string parameters in the redirected URL. In order to replace any existing query string from the incoming request URL, set this field to 'Replace' and then set the appropriate value. Otherwise, you can retain the original set of query strings by setting the field to 'Preserve'. As an example, using this field, you can redirect all traffic sent to `https://www.contoso.com/foo/bar` to `https://www.contoso.com/foo/bar?&utm_referrer=https%3A%2F%2Fwww.bing.com%2F`. 

## Destination fragment
The destination fragment is the portion of URL after '#', normally used by browsers to land on a specific section on a page. You can set this field to add a fragment to the redirect URL.

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).

<!--Image references-->
[1]: ./media/front-door-url-redirect/front-door-url-redirect.png