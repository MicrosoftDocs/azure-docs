---
title: What is Azure Front Door Standard/Premium Route?
description: This article helps you understand how Azure Front Door Standard/Premium matches which routing rule to use for an incoming request.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: duau
---

# What is Azure Front Door Standard/Premium (Preview) Route?

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

Azure Front Door Standard/Premium Route defines how the traffic is handled when the incoming request arrives at the Azure Front Door environment. Through the Route settings, an association is defined between a domain and a backend origin group. By turning on the advance features such as Pattern to Mach, Rule set, more granular control over the traffic is achievable.

A Front Door Standard/Premium routing configuration is composed of two major parts: "left-hand side"  and "right-hand side". We match the incoming request to the left-hand side of the route and the right-hand side defines how we process the request.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

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

After Azure Front Door Standard/Premium determines the specific frontend host and filtering possible routing rules to just the routes with that frontend host. Front Door then filters the routing rules based on the request path. We use a similar logic as frontend hosts:

1. Look for any routing rule with an exact match on the Path
2. If no exact match Paths, look for routing rules with a wildcard Path that matches
3. If no routing rules are found with a matching Path, then reject the request and return a 400: Bad Request error HTTP response.

>[!NOTE]
> Any Paths without a wildcard are considered to be exact-match Paths. Even if the Path ends in a slash, it's still considered exact match.

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

Once Azure Front Door Standard/Premium has matched to a single routing rule, it then needs to choose how to process the request. If Azure Front Door Standard/Premium has a cached response available for the matched routing rule, then the request gets served back to the client. The next thing Azure Front Door Standard/Premium evaluates is whether or not you have a Rule Set for the matched routing rule. If there isn't a Rule Set defined, then the request gets forwarded to the backend pool as is. Otherwise, the Rule Set gets executed in the order as they're configured.

## Next steps

Learn how to [create a Front Door Standard/Premium](create-front-door-portal.md).
