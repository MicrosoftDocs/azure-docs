---
title: How requests get matched to a route configuration
titleSuffix: Azure Front Door
description: This article helps you understand how Azure Front Door matches incoming requests to a route configuration.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 06/01/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# How requests get matched to a route configuration

::: zone pivot="front-door-standard-premium"

A *route* in Azure Front Door defines how traffic gets handled when the incoming request arrives at the Azure Front Door edge. Through the route settings, an association is defined between a domain and an origin group. By using advance features such as *Pattern to Match* and *Rule sets*, you can have granular control over traffic to your backend resources.

> [!NOTE]
> When you use the [Front Door rule sets](front-door-rules-engine.md), you can configure a rule to [override the origin group](front-door-rules-engine-actions.md#RouteConfigurationOverride) for a request. The origin group set by the rule set overrides the routing process described in this article.

::: zone-end

::: zone pivot="front-door-classic"

When a request arrives Azure Front Door (classic) edge, one of the first things that Front Door does is determine how to route the matching request to a backend resource and then take a defined action in the routing configuration. The following document explains how Front Door determines which route configuration to use when processing a request.

::: zone-end

## Structure of a Front Door route configuration

A Front Door routing rule is composed of two major parts, the "left-hand side" and the "right-hand side". Front Door matches the incoming request to the left-hand side of the route while the right-hand side defines how the request gets processed.

### Incoming match (left-hand side)

The following properties determine whether the incoming request matches the routing rule (or left-hand side):

* **HTTP Protocols** - HTTP or HTTPS
* **Domain** - For example: www\.foo.com, \*.bar.com
* **Paths** - For example: /\*, /users/\*, /file.gif

These properties are expanded out internally so that every combination of Protocol/Domain/Path is a potential match set.

### Routing decision (right-hand side)

The decision of how to process the request depends on whether caching is enabled for the route. If a cached response isn't available, then the request is forwarded to the appropriate origin.

## Route matching

This section focuses on how Front Door matches to a routing rule. The basic concept is that Front Door always matches to the **most-specific request** looking only at the "left-hand side". Front Door first match based on protocol, then domain, and last the path.

### Frontend host matching

Azure Front Door uses the following logic to match frontend hosts:

1. Determine if there are any routes with an exact match on the frontend host.
2. If there are no exact frontend hosts match, the request get rejected and a 400: Bad Request error gets sent.

The following tables show three different routing rules with frontend host and paths:

| Routing rule | Frontend hosts | Path |
|--|--|--|
| A | foo.contoso.com | /\* |
| B | foo.contoso.com | /users/\* |
| C | www\.fabrikam.com, foo.adventure-works.com | /\*, /images/\* |

The following table shows the matching results for the above routing rules:

| Incoming frontend host | Matched routing rule(s) |
|--|--|
| foo.contoso.com | A, B |
| www\.fabrikam.com | C |
| images.fabrikam.com | Error 400: Bad Request |
| foo.adventure-works.com | C |
| contoso.com | Error 400: Bad Request |
| www\.adventure-works.com | Error 400: Bad Request |
| www\.northwindtraders.com | Error 400: Bad Request |

### Path matching

After Front Door determines the specific frontend host and filters for possible routing rules, Front Door then selects the routing rules based on the request path. A similar logic to frontend hosts is used to match the request path:

1. Determine if there are any routing rules with an exact match to the request path.
1. If there isn't an exact matching path, then Front Door looks for a routing rule with a wildcard path that matches.
1. If there are no routing rules found with a matching path, then request gets rejected and a 400: Bad Request error gets set sent.

::: zone pivot="front-door-standard-premium"

>[!NOTE]
> * Any paths without a wildcard are considered to be exact-match paths. If a path ends in a `/`, this is considered an exact match.

::: zone-end

::: zone pivot="front-door-classic"

>[!NOTE]
> * Any paths without a wildcard are considered to be exact-match paths. If a path ends in a `/`, this is considered an exact match.
> * Patterns to match paths are case insensitive, meaning paths with different casings are treated as duplicates. For example, you have the same host using the same protocol with paths `/FOO` and `/foo`. These paths are considered duplicates which is not allowed in the Patterns to match setting.
> 

::: zone-end

The following table is a list of routing rules, frontend host and path combination:

| Routing rule | Frontend host | Path |
|--|--|--|
| A | www\.contoso.com | / |
| B | www\.contoso.com | /\* |
| C | www\.contoso.com | /ab |
| D | www\.contoso.com | /abc |
| E | www\.contoso.com | /abc/ |
| F | www\.contoso.com | /abc/\* |
| G | www\.contoso.com | /abc/def |
| H | www\.contoso.com | /path/ |

The following table shows which routing rule the incoming request gets matched to when arriving at the Front Door edge:

| Incoming Request | Matched Route |
|--|--|
| www\.contoso.com/ | A |
| www\.contoso.com/a | B |
| www\.contoso.com/ab | C |
| www\.contoso.com/abc | D |
| www\.contoso.com/abzzz | B |
| www\.contoso.com/abc/ | E |
| www\.contoso.com/abc/d | F |
| www\.contoso.com/abc/def | G |
| www\.contoso.com/abc/defzzz | F |
| www\.contoso.com/abc/def/ghi | F |
| www\.contoso.com/path | B |
| www\.contoso.com/path/ | H |
| www\.contoso.com/path/zzz | B |

>[!WARNING]
> If there are no routing rules for an exact-match frontend host with a catch-all route Path (`/*`), then there will not be a match to any routing rule.
>
> Example configuration:
>
> | Route | Host             | Path    |
> |-------|------------------|---------|
> | A     | profile.contoso.com | /api/\* |
>
> Matching table:
>
> | Incoming request       | Matched Route |
> |------------------------|---------------|
> | profile.domain.com/other | None. Error 400: Bad Request |

### Routing decision

Once Front Door has matched to a single routing rule, it then needs to choose how to process the request. If your Azure Front Door has a cached response available for the matched routing rule, then the request gets served back to the client.

::: zone pivot="front-door-standard-premium"

Lastly, Azure Front Door evaluates whether or not you have a [rule set](front-door-rules-engine.md) configured for the matched routing rule. If no rule set gets defined, then the request gets forwarded to the origin group without any changes. Otherwise, the rule sets get processed in the order configured. [Rule sets can override a route](front-door-rules-engine-actions.md#RouteConfigurationOverride) by forcing traffic to a specific origin group.

::: zone-end

::: zone pivot="front-door-classic"

If Front Door (classic) doesn't have a cached response for the matched routing rule, it evaluates whether [URL rewrite](front-door-url-rewrite.md) is configured for the matched routing rule. If there's no custom forwarding path, the request gets forwarded to the appropriate backend in the configured backend pool without changes. If a custom forwarding path has been defined, the request path gets updated as defined in [custom forwarding path](front-door-url-rewrite.md) and then gets forwarded to the backend.

::: zone-end

## Next steps

::: zone pivot="front-door-standard-premium"

- Learn how to [create an Azure Front Door](standard-premium/create-front-door-portal.md).
- Learn about [Azure Front Door routing architecture](front-door-routing-architecture.md).

::: zone-end

::: zone pivot="front-door-classic"

- Learn how to [create an Azure Front Door (classic)](quickstart-create-front-door.md).
- Learn about [Azure Front Door routing architecture](front-door-routing-architecture.md).

::: zone-end
