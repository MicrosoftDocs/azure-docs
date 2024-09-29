---
title: URL Rewrite
titleSuffix: Azure Front Door
description: This article helps you understand how URL rewrites works in Azure Front Door.
services: front-door
author: duongau
ms.service: azure-frontdoor
ms.topic: conceptual
ms.date: 08/12/2024
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# URL rewrite 

::: zone pivot="front-door-standard-premium"

Azure Front Door provides support for URL rewrite, enabling you to modify the request path that is being routed to your origin. This powerful feature allows you to define conditions that determine when the URL or specified headers should be rewritten. These conditions are based on the information present in the request and response.

By using URL rewrite, you have the ability to redirect your end users to different origins based on factors such as their device type or the type of file they're requesting. The URL rewrite action can be easily configured within the rule set, providing you with fine-grained control over your routing behavior.

:::image type="content" source="./media/front-door-url-rewrite/front-door-url-rewrite.png" alt-text="Screenshot of URL rewrite action in a rule set configuration.":::

## Source pattern

The **source pattern** represents the URL path in the initial request that you wish to replace. Currently, the source pattern utilizes a prefix-based matching approach. To match all URL paths, you can specify a forward slash (`/`) as the value for the source pattern.

In the context of a URL rewrite action, only the path after the *patterns to match* in the route configuration is taken into consideration for the source pattern. For instance, the rule set considers only `/source-pattern` as the source pattern to be rewritten if you have an incoming URL format of `contoso.com/pattern-to-match/source-pattern`. After the URL rewrite is applied, the outgoing URL format will be `contoso.com/pattern-to-match/destination`.

In cases where you need to remove the `/pattern-to-match` segment of the URL, you can set the **origin path** for the origin group in the route configuration to `/`.

## Destination

The destination path represents the path that replaces the source pattern. For instance, if the request URL path is `contoso.com/foo/1.jpg`, and the source pattern is `/foo/`, specifying the destination as `/bar/` results in the content being served from `contoso.com/bar/1.jpg` from the origin.

## Preserve unmatched path

Preserve unmatched path allows you to control how the remaining path after the source pattern is handled. By setting preserve unmatched path to **Yes**, the remaining path is appended to the new path. On the other hand, setting it to **No** (default) will remove the remaining path after the source pattern.

Here's an example showcasing the behavior of preserve unmatched path:

| Preserve unmatched path | Source pattern | Destination | Incoming request | Content served from origin |
|--|--|--|--|--|
| Yes | / | /foo/ | contoso.com/sub/1.jpg | /foo/sub/1.jpg |
| Yes | /sub/ | /foo/ | contoso.com/sub/image/1.jpg | /foo/image/1.jpg |
| No | /sub/ | /foo/2.jpg | contoso.com/sub/image/1.jpg | /foo/2.jpg |

::: zone-end

::: zone pivot="front-door-classic"

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

Azure Front Door (classic) provides support for URL rewrite by configuring a **Custom forwarding path** when setting up the forward routing type rule. By default, if only a forward slash (`/*`) is defined, Front Door replicates the incoming URL path in the forwarded request. The host header used in the forwarded request is based on the configuration of the selected backend. For more detailed information, see the [Backend host header](origin.md#origin-host-header) documentation.

The key aspect of URL rewrite lies in the ability to copy any matching part of the incoming path to the forwarded path when using a custom forwarding path with a wildcard match. The following table illustrates an example of an incoming request and the corresponding forwarded path when utilizing a custom forwarding path of `/fwd/`. The section denoted as **a/b/c** represents the portion that replaces the wildcard match.

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

The following table illustrates examples of incoming requests and their corresponding most-specific matching routes. It also provides examples of custom forwarding paths and the resulting forwarded paths.

For instance, consider the second row of the table. If the incoming request is `www.contoso.com/sub`, and the custom forwarding path is set to `/`, then the forwarded path would be `/sub`. However, if the custom forwarding path is set to `/fwd/`, then the forwarded path would be `/fwd/sub`. The emphasized parts of the paths indicate the portions that are part of the wildcard match.


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

**Cache configuration** - If disabled or not specified, requests that match to this routing rule doesn't attempt to use cached content and instead always fetch from the backend. For more information, see [caching with Azure Front Door](front-door-caching.md).

::: zone-end

## Next steps

- Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
- Learn more about [Azure Front Door rule set](front-door-rules-engine.md)
- Learn about [Azure Front Door routing architecture](front-door-routing-architecture.md).
