---
title: URL Rewrite
titleSuffix: Azure Front Door
description: This article helps you understand how URL rewrites works in Azure Front Door.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 06/01/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# URL rewrite 

::: zone pivot="front-door-standard-premium"

Azure Front Door supports URL rewrite to change the request path being routed to your origin. URL rewrite allows you to set conditions to make sure the URL or the specified headers gets rewritten only when certain conditions get met. These conditions are based on the request and response information.

With this feature, you can redirect your end users to a different origin based on their device types, or the type of file requested. The URL rewrite action can be found in a rule set configuration.

:::image type="content" source="./media/front-door-url-rewrite/front-door-url-rewrite.png" alt-text="Screenshot of URL rewrite action in a rule set configuration.":::

## Source pattern

The **source pattern** is the URL path in the initial request you want to replace. Currently, source pattern uses a prefix-based match. To match all URL paths, you can define a forward slash (`/`) as the source pattern value.

For the source pattern in a URL rewrite action, only the path after the *patterns to match* in the route configuration is considered. For example, you have the following incoming URL format `contoso.com/patten-to-match/source-pattern`, only `/source-pattern` gets considered by the rule set as the source pattern to be rewritten. The format of the out going URL after URL rewrite gets applied is `contoso.com/pattern-to-match/destination`.

For situation, when you need to remove the `/patterns-to-match` segment of the URL, set the **origin path** for the origin group in route configuration to `/`.

## Destination

The destination path used to replace the source pattern. For example, if the request URL path is `contoso.com/foo/1.jpg`, the source pattern is `/foo/`, and the destination is `/bar/`, the content gets served from `contoso.com/bar/1.jpg` from the origin.

## Preserve unmatched path

Preserve unmatched path allows you to append the remaining path after the source pattern to the new path. When preserve unmatched path is set to **No** (default), the remaining path after the source pattern gets removed.

| Preserve unmatched path | Source pattern | Destination | Incoming request | Content served from origin |
|--|--|--|--|--|
| Yes | / | /foo/ | contoso.com/sub/1.jpg | /foo/sub/1.jpg |
| Yes | /sub/ | /foo/ | contoso.com/sub/image/1.jpg | /foo/image/1.jpg |
| No | /sub/ | /foo/2.jpg | contoso.com/sub/image/1.jpg | /foo/2.jpg |

::: zone-end

::: zone pivot="front-door-classic"

Azure Front Door (classic) supports URL rewrite by configuring a **Custom forwarding path** when configuring the forward routing type rule. By default, if only a forward slash (`/*`) is defined, Front Door copies the incoming URL path to the URL used in the forwarded request. The host header used in the forwarded request is as configured for the selected backend. For more information, see [Backend host header](origin.md#origin-host-header).

The robust part of URL rewrite is the custom forwarding path copies any part of the incoming path that matches the wildcard path to the forwarded path.

The following table shows an example of an incoming request and the corresponding forwarded path when using a custom forwarding path of `/fwd/` for a match path with a wildcard. The **a/b/c** part of the path represents the portion replacing the wildcard.

| Incoming URL path | Match path | Custom forwarding path | Forwarded path |
|--|--|--|--|
| /foo/a/b/c | /foo/* | /fwd/ |  /fwd/a/b/c |

## URL rewrite example

Consider a routing rule with the following combination of frontend hosts and paths are configured:

| Hosts | Paths |
|--|--|
| www\.contoso.com | /\* |
|  | /foo |
|  | /foo/\* |
|  | /foo/bar/\* |

The first column in the following table shows examples of incoming requests and the second column shows what would be the **most-specific** matching route defined. The next three columns in the table are examples of *Custom forwarding paths*.

For example, the second row reads, for an incoming request of `www.contoso.com/sub`, if the custom forwarding path is `/`, then the forwarded path would be `/sub`. If the custom forwarding path was `/fwd/`, then the forwarded path is `/fwd/sub`. The **emphasized** parts of the paths represent the portions that are part of the wildcard match.

| Incoming request | Most-specific match path | / | /fwd/ | /foo/ | /foo/bar/ |
|--|--|--|--|--|--|
| www\.contoso.com/ | /\* | / | /fwd/ | /foo/ | /foo/bar/ |
| www\.contoso.com/**sub** | /\* | /**sub** | /fwd/**sub** | /foo/**sub** | /foo/bar/**sub** |
| www\.contoso.com/**a/b/c** | /\* | /**a/b/c** | /fwd/**a/b/c** | /foo/**a/b/c** | /foo/bar/**a/b/c** |
| www\.contoso.com/foo | /foo | / | /fwd/ | /foo/ | /foo/bar/ |
| www\.contoso.com/foo/ | /foo/\* | / | /fwd/ | /foo/ | /foo/bar/ |
| www\.contoso.com/foo/**bar** | /foo/\* | /**bar** | /fwd/**bar** | /foo/**bar** | /foo/bar/**bar** |

> [!NOTE]
> Azure Front Door (classic) only supports URL rewrite from a static path to another static path. Preserve unmatched path is supported with Azure Front Door Standard and Premium. For more information, see [Preserve unmatched path](front-door-url-rewrite.md#preserve-unmatched-path).
> 

## Optional settings

There are extra optional settings you can also specify for any given routing rule settings:

* **Cache configuration** - If disabled or not specified, requests that match to this routing rule doesn't attempt to use cached content and instead always fetch from the backend. For more information, see [caching with Azure Front Door](front-door-caching.md).

::: zone-end

## Next steps

- Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
- Learn more about [Azure Front Door rule set](front-door-rules-engine.md)
- Learn about [Azure Front Door routing architecture](front-door-routing-architecture.md).
