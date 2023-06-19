---
title: URL Redirect
titleSuffix: Azure Front Door
description: This article helps you understand how Azure Front Door supports URL redirection for their routing rules.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 04/04/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# URL redirect

Azure Front Door can redirect traffic at each of the following levels: protocol, hostname, path, query string. These functionalities can be configured for individual microservices since the redirection is path-based. This setup can simplify application configuration by optimizing resource usage, and supports new redirection scenarios including global and path-based redirection.

::: zone pivot="front-door-standard-premium"

In Azure Front Door Standard/Premium tier, you can configure URL redirect using a Rule Set.

:::image type="content" source="./media/front-door-url-redirect/front-door-url-redirect-rule-set.png" alt-text="Screenshot of creating url redirect with Rule Set." lightbox="./media/front-door-url-redirect/front-door-url-redirect-expanded.png":::

::: zone-end

::: zone pivot="front-door-classic"

:::image type="content" source="./media/front-door-url-redirect/front-door-url-redirect.png" alt-text="Azure Front Door URL Redirect":::

::: zone-end

## Redirection types

A redirect type sets the response status code for the clients to understand the purpose of the redirect. The following types of redirection are supported:

- **301 (Moved permanently)**: Indicates that the target resource has been assigned a new permanent URI. Any future references to this resource use one of the enclosed URIs. Use 301 status code for HTTP to HTTPS redirection. 
- **302 (Found)**: Indicates that the target resource is temporarily under a different URI. Since the redirection can change on occasion, the client should continue to use the effective request URI for future requests.
- **307 (Temporary redirect)**: Indicates that the target resource is temporarily under a different URI. The user agent MUST NOT change the request method if it does an automatic redirection to that URI. Since the redirection can change over time, the client ought to continue using the original effective request URI for future requests.
- **308 (Permanent redirect)**: Indicates that the target resource has been assigned a new permanent URI. Any future references to this resource should use one of the enclosed URIs.

## Redirection protocol
You can set the protocol that is used for redirection. The most common use cases of the redirect feature are to set HTTP to HTTPS redirection.

- **HTTPS only**: Set the protocol to HTTPS only, if you're looking to redirect the traffic from HTTP to HTTPS. Azure Front Door recommends that you should always set the redirection to HTTPS only.
- **HTTP only**: Redirects the incoming request to HTTP. Use this value only if you want to keep your traffic HTTP that is, nonencrypted.
- **Match request**: This option keeps the protocol used by the incoming request. So, an HTTP request remains HTTP and an HTTPS request remains HTTPS post redirection.

## Destination host
As part of configuring a redirect routing, you can also change the hostname or domain for the redirect request. You can set this field to change the hostname in the URL for the redirection or otherwise preserve the hostname from the incoming request. So, using this field you can redirect all requests sent on `https://www.contoso.com/*` to `https://www.fabrikam.com/*`.

## Destination path
For cases where you want to replace the path segment of a URL as part of redirection, you can set this field with the new path value. Otherwise, you can choose to preserve the path value as part of redirect. So, using this field, you can redirect all requests sent to `https://www.contoso.com/\*` to  `https://www.contoso.com/redirected-site`.

## Query string parameters
You can also replace the query string parameters in the redirected URL. To replace any existing query string from the incoming request URL, set this field to 'Replace' and then set the appropriate value. Otherwise, you can keep the original set of query strings by setting the field to 'Preserve'. As an example, using this field, you can redirect all traffic sent to `https://www.contoso.com/foo/bar` to `https://www.contoso.com/foo/bar?&utm_referrer=https%3A%2F%2Fwww.bing.com%2F`. 

## Destination fragment
The destination fragment is the portion of URL after '#', which is used by the browser to land on a specific section of a web page. You can set this field to add a fragment to the redirect URL.

## Next steps

* Learn how to [create a Front Door](quickstart-create-front-door.md).
* Learn more about [Azure Front Door Rule Set](front-door-rules-engine.md).
* Learn [how Front Door works](front-door-routing-architecture.md).
