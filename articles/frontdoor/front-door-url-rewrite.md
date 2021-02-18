---
title: Azure Front Door - URL Rewrite | Microsoft Docs
description: This article helps you understand how Azure Front Door does URL Rewrite for your routes, if configured.
services: front-door
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/28/2020
ms.author: duau
---

# URL rewrite (custom forwarding path)
Azure Front Door supports URL rewrite by configuring an optional **Custom Forwarding Path** to use when constructing the request to forward to the backend. By default, if a custom forwarding path isn't provided, the Front Door will copy the incoming URL path to the URL used in the forwarded request. The Host header used in the forwarded request is as configured for the selected backend. Read [Backend Host Header](front-door-backend-pool.md#hostheader) to learn what it does and how you can configure it.

The powerful part of URL rewrite is that the custom forwarding path will copy any part of the incoming path that matches to a wildcard path to the forwarded path (these path segments are the **green** segments in the example below):
</br>

:::image type="content" source="./media/front-door-url-rewrite/front-door-url-rewrite-example.jpg" alt-text="Azure Front Door URL Rewrite":::

## URL rewrite example
Consider a routing rule with the following combination of frontend hosts and paths configured:

| Hosts      | Paths       |
|------------|-------------|
| www\.contoso.com | /\*   |
|            | /foo        |
|            | /foo/\*     |
|            | /foo/bar/\* |

The first column of the table below shows examples of incoming requests and the second column shows what would be the "most-specific" matching route 'Path'.  The third and ensuing columns of the table are examples of configured **Custom Forwarding Paths**.

For example, if we read across the second row, it's saying that for incoming request `www.contoso.com/sub`, if the custom forwarding path was `/`, then the forwarded path would be `/sub`. If the custom forwarding path was `/fwd/`, then the forwarded path would be `/fwd/sub`. And so forth, for the remaining columns. The **emphasized** parts of the paths below represent the portions that are part of the wildcard match.

| Incoming request       | Most-specific match path | /          | /fwd/          | /foo/          | /foo/bar/          |
|------------------------|--------------------------|------------|----------------|----------------|--------------------|
| www\.contoso.com/            | /\*                      | /          | /fwd/          | /foo/          | /foo/bar/          |
| www\.contoso.com/**sub**     | /\*                      | /**sub**   | /fwd/**sub**   | /foo/**sub**   | /foo/bar/**sub**   |
| www\.contoso.com/**a/b/c**   | /\*                      | /**a/b/c** | /fwd/**a/b/c** | /foo/**a/b/c** | /foo/bar/**a/b/c** |
| www\.contoso.com/foo         | /foo                     | /          | /fwd/          | /foo/          | /foo/bar/          |
| www\.contoso.com/foo/        | /foo/\*                  | /          | /fwd/          | /foo/          | /foo/bar/          |
| www\.contoso.com/foo/**bar** | /foo/\*                  | /**bar**   | /fwd/**bar**   | /foo/**bar**   | /foo/bar/**bar**   |

## Optional settings
There are additional optional settings you can also specify for any given routing rule settings:

* **Cache Configuration** - If disabled or not specified, requests that match to this routing rule won't attempt to use cached content and instead will always fetch from the backend. Read more about [Caching with Front Door](front-door-caching.md).

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
