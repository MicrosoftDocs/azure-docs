---
title: How requests get matched to a route configuration
titleSuffix: Azure Front Door
description: This article helps you understand how Azure Front Door matches incoming requests to a route configuration.
services: front-door
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/13/2024
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# How requests get matched to a route configuration

::: zone pivot="front-door-standard-premium"

A *route* in Azure Front Door defines how traffic is handled when an incoming request arrives at the Azure Front Door edge. The route settings establish an association between a domain and an origin group. By using advanced features such as *Pattern to Match* and *Rule sets*, you can have granular control over traffic to your backend resources.

> [!NOTE]
> When you use the [Front Door rule sets](front-door-rules-engine.md), you can configure a rule to [override the origin group](front-door-rules-engine-actions.md#RouteConfigurationOverride) for a request. The origin group set by the rule set overrides the routing process described in this article.

::: zone-end

::: zone pivot="front-door-classic"

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

When a request arrives at the Azure Front Door (classic) edge, one of the first steps is to determine how to route the matching request to a backend resource and then take a defined action in the routing configuration. This document explains how Front Door determines which route configuration to use when processing a request.

::: zone-end

## Structure of a Front Door route configuration

A Front Door routing rule consists of two major parts: the "left-hand side" and the "right-hand side". Front Door matches the incoming request to the left-hand side of the route, while the right-hand side defines how the request is processed.

### Incoming match (left-hand side)

The following properties determine whether the incoming request matches the routing rule (left-hand side):

* **HTTP Protocols** - HTTP or HTTPS
* **Domain** - For example: www\.foo.com, \*.bar.com
* **Paths** - For example: /\*, /users/\*, /file.gif

These properties are expanded internally so that every combination of Protocol/Domain/Path is a potential match set.

### Routing decision (right-hand side)

The decision on how to process the request depends on whether caching is enabled for the route. If a cached response isn't available, the request is forwarded to the appropriate origin.

## Route matching

This section explains how Front Door matches requests to routing rules. The basic principle is that Front Door always matches to the **most-specific request** by evaluating the "left-hand side" properties: protocol, domain, and path, in that order.

### Frontend host matching

Azure Front Door uses the following steps to match frontend hosts:

1. Check for routes with an exact match on the frontend host.
2. If no exact match is found, the request is rejected with a 404: Bad Request error.

The following tables illustrate three different routing rules with their frontend hosts and paths:

| Routing rule | Frontend hosts                            | Path            |
|--------------|-------------------------------------------|-----------------|
| A            | foo.contoso.com                           | /\*             |
| B            | foo.contoso.com                           | /users/\*       |
| C            | www.fabrikam.com, foo.adventure-works.com | /\*, /images/\* |

The following table shows the matching results for the routing rules in the previous table:

| Incoming frontend host   | Matched routing rules |
|--------------------------|-------------------------|
| foo.contoso.com          | A, B                    |
| www.fabrikam.com         | C                       |
| images.fabrikam.com      | Error 404: Bad Request  |
| foo.adventure-works.com  | C                       |
| contoso.com              | Error 404: Bad Request  |
| www.adventure-works.com  | Error 404: Bad Request  |
| www.northwindtraders.com | Error 404: Bad Request  |

### Path matching

After Azure Front Door determine the specific frontend host and filtering possible routing rules, it selects the routing rules based on the request path. The following logic is used:

1. Check for routing rules with an exact match to the request path.
2. If no exact match is found, look for a routing rule with a wildcard path that matches.
3. If no matching path is found, the request is rejected with a 404: Bad Request error.

::: zone pivot="front-door-standard-premium"

> [!NOTE]
> The wildcard character `*` is only valid for paths that don't have any other characters after it. Additionally, the wildcard character `*` must be preceded by a slash `/`. Paths without a wildcard are considered exact-match paths. A path that ends in a slash `/` is also an exact-match path. Ensure that your paths follow these rules to avoid errors.

::: zone-end

::: zone pivot="front-door-classic"

> [!NOTE]
> * Paths without a wildcard are considered exact-match paths. A path ending with a `/` is also an exact match.
> * Path patterns are case insensitive. For example, `/FOO` and `/foo` are treated as duplicates and are not allowed in the Patterns to match setting.

::: zone-end

The following table lists routing rules with their frontend host and path combinations:

| Routing rule | Frontend host    | Path    |
|--------------|------------------|---------|
| A            | www.contoso.com  | /       |
| B            | www.contoso.com  | /\*     |
| C            | www.contoso.com  | /ab     |
| D            | www.contoso.com  | /abc    |
| E            | www.contoso.com  | /abc/   |
| F            | www.contoso.com  | /abc/\* |
| G            | www.contoso.com  | /abc/def|
| H            | www.contoso.com  | /path/  |

The following table shows which routing rule matches an incoming request at the Azure Front Door edge:

| Incoming Request            | Matched Route |
|-----------------------------|---------------|
| www.contoso.com/            | A             |
| www.contoso.com/a           | B             |
| www.contoso.com/ab          | C             |
| www.contoso.com/abc         | D             |
| www.contoso.com/abzzz       | B             |
| www.contoso.com/abc/        | E             |
| www.contoso.com/abc/d       | F             |
| www.contoso.com/abc/def     | G             |
| www.contoso.com/abc/defzzz  | F             |
| www.contoso.com/abc/def/ghi | F             |
| www.contoso.com/path        | B             |
| www.contoso.com/path/       | H             |
| www.contoso.com/path/zzz    | B             |

> [!WARNING]
> If there are no routing rules for an exact-match frontend host without a catch-all route path (/*), no routing rule will be matched.
>
> Example configuration:
>
> | Route | Host                | Path    |
> |-------|---------------------|---------|
> | A     | profile.contoso.com | /api/\* |
>
> Matching table:
>
> | Incoming request         | Matched Route |
> |--------------------------|---------------|
> | profile.domain.com/other | None. Error 404: Bad Request |

### Routing decision

Once Azure Front Door matches a routing rule, it decides how to process the request. If a cached response is available, it gets served back to the client.

::: zone pivot="front-door-standard-premium"

If a [rule set](front-door-rules-engine.md) is configured for the matched routing rule, it gets processed in order. Rule sets can [override a route](front-door-rules-engine-actions.md#RouteConfigurationOverride) by directing traffic to a specific origin group. If no rule set is defined, the request is forwarded to the origin group without changes.

::: zone-end

::: zone pivot="front-door-classic"

If Azure Front Door (classic) doesn't have a cached response, it checks for a [URL rewrite](front-door-url-rewrite.md) configuration. If no custom forwarding path is defined, the request is forwarded to the appropriate backend in the configured backend pool. If a custom forwarding path is defined, the request path is updated accordingly and then forwarded to the backend.

::: zone-end

## Next steps

::: zone pivot="front-door-standard-premium"

- [Create an Azure Front Door](standard-premium/create-front-door-portal.md).
- Learn about the [Azure Front Door routing architecture](front-door-routing-architecture.md).

::: zone-end

::: zone pivot="front-door-classic"

- [Create an Azure Front Door (classic)](quickstart-create-front-door.md).
- Learn about the [Azure Front Door routing architecture](front-door-routing-architecture.md).

::: zone-end
