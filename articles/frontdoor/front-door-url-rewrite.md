---
title: URL Rewrite
titleSuffix: Azure Front Door
description: This article helps you understand how URL rewrites works in Azure Front Door.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/22/2022
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# URL rewrite 

::: zone pivot="front-door-standard-premium"

Azure Front Door supports URL rewrite to change the path of a request that is being routed to your origin. URL rewrite also allows you to add conditions to make sure that the URL or the specified headers gets rewritten only when certain conditions get met. These conditions are based on the request and response information.

With this feature, you can redirect users to different origins based on scenarios, device types, or the requested file type.

URL rewrite settings can be found in the Rule set configuration.

:::image type="content" source="./media/front-door-url-rewrite/front-door-url-rewrite.png" alt-text="Screenshot of creating url rewrite with Rule Set." lightbox="./media/front-door-url-rewrite/front-door-url-rewrite-expanded.png":::

## Source pattern

Source pattern is the URL path in the source request to replace. Currently, source pattern uses a prefix-based match. To match all URL paths, use a forward slash (/) as the source pattern value.

For URL rewrite source pattern, only the path after the route configuration “patterns to match” is considered. For example, you have the following incoming URL format `<Frontend-domain>/<route-patterns-to-match-path>/<Rule-URL-Rewrite-Source-pattern>`, only `/<Rule-URL-Rewrite-Source-pattern>` will be considered by the rule engine as the source pattern to be rewritten. Therefore, when you have a URL rewrite rule using source pattern match, the format for the outgoing URL will be `<Frontend-domain>/<route-patterns-to-match-path>/<Rule-URL-Rewrite-destination>`.

For scenarios, where `/<route-patterns-to-match-path` segment of the URL path must be removed, set the Origin path of the Origin group in route configuration to `/`.

## Destination

You can define the destination path to use in the rewrite. The destination path overwrites the source pattern.

## Preserve unmatched path

Preserve unmatched path allows you to append the remaining path after the source pattern to the new path.

For example, if I set **Preserve unmatched path to Yes**.
* If the incoming request is `www.contoso.com/sub/1.jpg`, the source pattern gets set to `/`, the destination gets set to `/foo/`, and the content gets served from `/foo/sub/1.jpg` from the origin.

* If the incoming request is `www.contoso.com/sub/image/1.jpg`, the source pattern gets set to `/sub/`, the destination gets set to `/foo/`, and the content gets served from `/foo/image/1.jpg` from the origin.

For example, if I set **Preserve unmatched path to No**.
* If the incoming request is `www.contoso.com/sub/image/1.jpg`, the source pattern gets set to `/sub/`, the destination gets set to `/foo/2.jpg`, and the content will always be served from `/foo/2.jpg` from the origin no matter what paths followed in `wwww.contoso.com/sub/`.

::: zone-end

::: zone pivot="front-door-classic"

Azure Front Door (classic) supports URL rewrite by configuring an optional **Custom Forwarding Path** to use when constructing the request to forward to the backend. By default, if a custom forwarding path isn't provided, the Front Door will copy the incoming URL path to the URL used in the forwarded request. The Host header used in the forwarded request is as configured for the selected backend. Read [Backend Host Header](front-door-backend-pool.md#hostheader) to learn what it does and how you can configure it.

The robust part of URL rewrite is that the custom forwarding path will copy any part of the incoming path that matches the wildcard path to the forwarded path.

For example, if you have a **match path** of `/foo/*` and configured `/fwd/` for the **custom forwarding path**, any path segment from the wildcard onward will be copied to the forwarding path, shown in orange in the diagram below. In this example, when the **incoming URL path** is `/foo/a/b/c` you'll have a **forwarded path** of `/fwd/a/b/c`. Noticed that the `a/b/c` path segment will replace the wildcard, which is show in green in the below diagram.

:::image type="content" source="./media/front-door-url-rewrite/url-rewrite-example.png" alt-text="Diagram of a URL path rewrite in Azure Front Door":::

## URL rewrite example

Consider a routing rule with the following combination of frontend hosts and paths configured:

| Hosts | Paths |
|--|--|
| www\.contoso.com | /\* |
|  | /foo |
|  | /foo/\* |
|  | /foo/bar/\* |

The first column of the table below shows examples of incoming requests and the second column shows what would be the "most-specific" matching route 'Path'.  The third and ensuing columns of the table are examples of configured **Custom Forwarding Paths**.

For example, if we read across the second row, it's saying that for incoming request `www.contoso.com/sub`, if the custom forwarding path was `/`, then the forwarded path would be `/sub`. If the custom forwarding path was `/fwd/`, then the forwarded path would be `/fwd/sub`. And so forth, for the remaining columns. The **emphasized** parts of the paths below represent the portions that are part of the wildcard match.

| Incoming request | Most-specific match path | / | /fwd/ | /foo/ | /foo/bar/ |
|--|--|--|--|--|--|
| www\.contoso.com/ | /\* | / | /fwd/ | /foo/ | /foo/bar/ |
| www\.contoso.com/**sub** | /\* | /**sub** | /fwd/**sub** | /foo/**sub** | /foo/bar/**sub** |
| www\.contoso.com/**a/b/c** | /\* | /**a/b/c** | /fwd/**a/b/c** | /foo/**a/b/c** | /foo/bar/**a/b/c** |
| www\.contoso.com/foo | /foo | / | /fwd/ | /foo/ | /foo/bar/ |
| www\.contoso.com/foo/ | /foo/\* | / | /fwd/ | /foo/ | /foo/bar/ |
| www\.contoso.com/foo/**bar** | /foo/\* | /**bar** | /fwd/**bar** | /foo/**bar** | /foo/bar/**bar** |

> [!NOTE]
> Azure Front Door only supports URL rewrite from a static path to another static path. Preserve unmatched path is supported with Azure Front Door Standard and Premium tier. For more information, see [Preserve unmatched path](front-door-url-rewrite.md#preserve-unmatched-path).
> 

## Optional settings

There are extra optional settings you can also specify for any given routing rule settings:

* **Cache Configuration** - If disabled or not specified, requests that match to this routing rule won't attempt to use cached content and instead will always fetch from the backend. Read more about [Caching with Azure Front Door](front-door-caching.md).

::: zone-end

## Next steps

- Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
- Learn more about [Azure Front Door Rule set](front-door-rules-engine.md)
- Learn about [Azure Front Door routing architecture](front-door-routing-architecture.md).
