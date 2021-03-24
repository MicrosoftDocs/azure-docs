---
title: 'URL redirect and URL rewrite with Azure Front Door Standard/Premium (Preview)'
description: This article helps you understand how Azure Front Door supports URL redirection and URL rewrite using Azure Front Door Rule Set. 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.date: 02/18/2021
ms.author: yuajia
---

# URL redirect and URL rewrite with Azure Front Door Standard/Premium (Preview)

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

This article helps you understand how Azure Front Door Standard/Premium supports URL redirect and URL rewrite used in a Rule Set.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## URL redirect

Azure Front Door can redirect traffic at each of the following levels: protocol, hostname, path, query string, and fragment. These functionalities can be configured for individual micro-service since the redirection is path-based. With URL redirect you can simplify application configuration by optimizing resource usage, and supports new redirection scenarios including global and path-based redirection.

You can configure URL redirect via Rule Set.

:::image type="content" source="../media/concept-url-redirect-and-rewrite/front-door-url-redirect.png" alt-text="Screenshot of creating url redirect with Rule Set." lightbox="../media/concept-url-redirect-and-rewrite/front-door-url-redirect-expanded.png":::

### Redirection types
A redirect type sets the response status code for the clients to understand the purpose of the redirect. The following types of redirection are supported:

* **301 (Moved permanently)**: Indicates that the target resource has been assigned a new permanent URI. Any future references to this resource will use one of the enclosed URIs. Use 301 status code for HTTP to HTTPS redirection.
* **302 (Found)**: Indicates that the target resource is temporarily under a different URI. Since the redirection can change on occasion, the client should continue to use the effective request URI for future requests.
* **307 (Temporary redirect)**: Indicates that the target resource is temporarily under a different URI. The user agent MUST NOT change the request method if it does an automatic redirection to that URI. Since the redirection can change over time, the client ought to continue using the original effective request URI for future requests.
* **308 (Permanent redirect)**: Indicates that the target resource has been assigned a new permanent URI. Any future references to this resource should use one of the enclosed URIs.

### Redirection protocol
You can set the protocol that will be used for redirection. The most common use cases of the redirect feature, is to set HTTP to HTTPS redirection.

* **HTTPS only**: Set the protocol to HTTPS only, if you're looking to redirect the traffic from HTTP to HTTPS. Azure Front Door recommends that you should always set the redirection to HTTPS only.
* **HTTP only**: Redirects the incoming request to HTTP. Use this value only if you want to keep your traffic HTTP that is, non-encrypted.
* **Match request**: This option keeps the protocol used by the incoming request. So, an HTTP request remains HTTP and an HTTPS request remains HTTPS post redirection.

### Destination host
As part of configuring a redirect routing, you can also change the hostname or domain for the redirect request. You can set this field to change the hostname in the URL for the redirection or otherwise preserve the hostname from the incoming request. So, using this field you can redirect all requests sent on `https://www.contoso.com/*` to `https://www.fabrikam.com/*`.

### Destination path
For cases where you want to replace the path segment of a URL as part of redirection, you can set this field with the new path value. Otherwise, you can choose to preserve the path value as part of redirect. So, using this field, you can redirect all requests sent to `https://www.contoso.com/\*` to  `https://www.contoso.com/redirected-site`.

### Query string parameters
You can also replace the query string parameters in the redirected URL. To replace any existing query string from the incoming request URL, set this field to 'Replace' and then set the appropriate value. Otherwise, you can keep the original set of query strings by setting the field to 'Preserve'. As an example, using this field, you can redirect all traffic sent to `https://www.contoso.com/foo/bar` to `https://www.contoso.com/foo/bar?&utm_referrer=https%3A%2F%2Fwww.bing.com%2F`. 

### Destination fragment
The destination fragment is the portion of URL after '#', which is used by the browser to land on a specific section of a web page. You can set this field to add a fragment to the redirect URL.

## URL rewrite

Azure Front Door supports URL rewrite to rewrite the path of a request that's en route to your origin. URL rewrite allows you to add conditions to ensure that the URL or the specified headers get rewritten only when certain conditions get met. These conditions are based on the request and response information.

With this feature, you can redirect users to different origins based on scenario, device type, and requested file type.

You can configure URL redirect via Rule Set.

:::image type="content" source="../media/concept-url-redirect-and-rewrite/front-door-url-rewrite.png" alt-text="Screenshot of creating url rewrite with Rule Set." lightbox="../media/concept-url-redirect-and-rewrite/front-door-url-rewrite-expanded.png":::

### Source pattern

Source pattern is the URL path in the source request to replace. Currently, source pattern uses a prefix-based match. To match all URL paths, use a forward slash (/) as the source pattern value.

### Destination

You can define the destination path to use in the rewrite. The destination path overwrites the source pattern.

### Preserve unmatched path

Preserve unmatched path allows you to append the remaining path after the source pattern to the new path.

For example, if I set **Preserve unmatched path to Yes**.
* If the incoming request is `www.contoso.com/sub/1.jpg`, the source pattern gets set to `/`, the destination get set to `/foo/`, and the content get served from `/foo/sub/1`.jpg from the origin.

* If the incoming request is `www.contoso.com/sub/image/1.jpg`, the source pattern gets set to `/sub/`, the destination get set to `/foo/`, the content get served from `/foo/image/1.jpg` from the origin.

For example, if I set **Preserve unmatched path to No**.
* If the incoming request is `www.contoso.com/sub/image/1.jpg`, the source pattern gets set to `/sub/`, the destination get set to `/foo/2.jpg`, the content will always be served from `/foo/2.jpg` from the origin no matter what paths followed in `wwww.contoso.com/sub/`.

## Next steps

* Learn more about [Azure Front Door Standard/Premium Rule Set](concept-rule-set.md).
