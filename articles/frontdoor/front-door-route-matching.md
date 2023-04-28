---
title: Routing rule matching
titleSuffix: Azure Front Door
description: This article helps you understand how Azure Front Door matches incoming requests to a routing rule.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/08/2022
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# How requests are matched to a routing rule

::: zone pivot="front-door-standard-premium"

In Azure Front Door a route defines how the traffic gets handled when the incoming request arrives at the Azure Front Door environment. Through the route settings, an association is defined between a domain and a backend origin group. By turning on advance features such as Pattern to Match and Rule set, you can have more granular control over traffic to your backend resources.

> [!NOTE]
> When you use the [Front Door rules engine](front-door-rules-engine.md), you can configure a rule to [override the origin group](front-door-rules-engine-actions.md#RouteConfigurationOverride) for a request. The origin group set by the rules engine overrides the routing process described in this article.

::: zone-end

::: zone pivot="front-door-classic"

After an established connection and a complete TLS handshake, when a request lands on the Azure Front Door (classic) environment, one of the first things that Front Door does is determine which routing rule to match the request to and then take the defined action in the configuration. The following document explains how Front Door determines which Route configuration to use when processing an HTTP request.

::: zone-end

## Structure of a Front Door route configuration

A Front Door routing rule configuration is composed of two major parts: a "left-hand side" and a "right-hand side". We match the incoming request to the left-hand side of the route while the right-hand side defines how we process the request.

### Incoming match (left-hand side)
The following properties determine whether the incoming request matches the routing rule (or left-hand side):

* **HTTP Protocols** (HTTP/HTTPS)
* **Hosts** (for example, www\.foo.com, \*.bar.com)
* **Paths** (for example, /\*, /users/\*, /file.gif)

These properties are expanded out internally so that every combination of Protocol/Host/Path is a potential match set.

### Route data (right-hand side)

The decision of how to process the request, depends on whether caching is enabled or not for the Route. If a cached response isn't available, then the request is forwarded to the appropriate backend.

## Route matching

This section will focus on how we match to a given Front Door routing rule. The basic concept is that we always match to the **most-specific match first** looking only at the "left-hand side".  We first match based on HTTP protocol, then Frontend host, then the Path.

### Frontend host matching
When matching Frontend hosts, we use the logic defined below:

1. Look for any routing with an exact match on the host.
2. If no exact frontend hosts match, reject the request and send a 400 Bad Request error.

To explain this process further, let's look at an example configuration of Front Door routes (left-hand side only):

| Routing rule | Frontend hosts | Path |
|-------|--------------------|-------|
| A | foo.contoso.com | /\* |
| B | foo.contoso.com | /users/\* |
| C | www\.fabrikam.com, foo.adventure-works.com  | /\*, /images/\* |

If the following incoming requests were sent to Front Door, they would match against the following routing rules from above:

| Incoming frontend host | Matched routing rule(s) |
|---------------------|---------------|
| foo.contoso.com | A, B |
| www\.fabrikam.com | C |
| images.fabrikam.com | Error 400: Bad Request |
| foo.adventure-works.com | C |
| contoso.com | Error 400: Bad Request |
| www\.adventure-works.com | Error 400: Bad Request |
| www\.northwindtraders.com | Error 400: Bad Request |

### Path matching

After Azure Front Door determines the specific frontend host and filtering possible routing rules to just the routes with that frontend host, Front Door then filters the routing rules based on the request path. We use a similar logic as frontend hosts:

1. Look for any routing rule with an exact match on the Path.
1. If no exact match Paths, look for routing rules with a wildcard Path that matches.
1. If no routing rules are found with a matching Path, then reject the request and return a 400: Bad Request error HTTP response.

::: zone pivot="front-door-standard-premium"

>[!NOTE]
> * Any Paths without a wildcard are considered to be exact-match Paths. Even if the Path ends in a slash, it's still considered exact match.

::: zone-end


::: zone pivot="front-door-classic"

>[!NOTE]
> * Any Paths without a wildcard are considered to be exact-match Paths. Even if the Path ends in a slash, it's still considered exact match.
> * Patterns to match paths are case insensitive, meaning paths with different casings are treated as duplicates. For example, you have the same host using the same protocol with paths `/FOO` and `/foo`. These paths are considered duplicates which is not allowed in the Patterns to match setting.
> 

::: zone-end

To explain further, let's look at another set of examples:

| Routing rule | Frontend host    | Path     |
|-------|---------|----------|
| A     | www\.contoso.com | /        |
| B     | www\.contoso.com | /\*      |
| C     | www\.contoso.com | /ab      |
| D     | www\.contoso.com | /abc     |
| E     | www\.contoso.com | /abc/    |
| F     | www\.contoso.com | /abc/\*  |
| G     | www\.contoso.com | /abc/def |
| H     | www\.contoso.com | /path/   |

Given that configuration, the following example matching table would result:

| Incoming Request    | Matched Route |
|---------------------|---------------|
| www\.contoso.com/            | A             |
| www\.contoso.com/a           | B             |
| www\.contoso.com/ab          | C             |
| www\.contoso.com/abc         | D             |
| www\.contoso.com/abzzz       | B             |
| www\.contoso.com/abc/        | E             |
| www\.contoso.com/abc/d       | F             |
| www\.contoso.com/abc/def     | G             |
| www\.contoso.com/abc/defzzz  | F             |
| www\.contoso.com/abc/def/ghi | F             |
| www\.contoso.com/path        | B             |
| www\.contoso.com/path/       | H             |
| www\.contoso.com/path/zzz    | B             |

>[!WARNING]
> </br> If there are no routing rules for an exact-match frontend host with a catch-all route Path (`/*`), then there will not be a match to any routing rule.
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

::: zone pivot="front-door-standard-premium"

Once Azure Front Door Standard/Premium has matched to a single routing rule, it then needs to choose how to process the request. If Azure Front Door Standard/Premium has a cached response available for the matched routing rule, then the request gets served back to the client.

Finally, Azure Front Door Standard/Premium evaluates whether or not you have a [rule set](front-door-rules-engine.md) for the matched routing rule. If there's no rule set defined, then the request gets forwarded to the origin group as-is. Otherwise, the rule sets get executed in the order they're configured. [Rule sets can override the route](front-door-rules-engine-actions.md#RouteConfigurationOverride), forcing traffic to a specific origin group.

::: zone-end

::: zone pivot="front-door-classic"

After you've matched to a single Front Door routing rule, choose how to process the request. If Front Door has a cached response available for the matched routing rule, the cached response is served back to the client. If Front Door doesn't have a cached response for the matched routing rule, the thing that gets evaluated is whether you have configured [URL rewrite](front-door-url-rewrite.md) for the matched routing rule. If there's no custom forwarding path, the request gets forwarded to the appropriate backend in the configured backend pool as-is. If a custom forwarding path has been defined, the request path gets updated per the defined [custom forwarding path](front-door-url-rewrite.md) and then forwarded to the backend.

::: zone-end

## Next steps

::: zone pivot="front-door-standard-premium"

Learn how to [create a Front Door Standard/Premium](standard-premium/create-front-door-portal.md).

::: zone-end

::: zone pivot="front-door-classic"

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).

::: zone-end
