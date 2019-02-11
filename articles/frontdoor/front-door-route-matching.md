---
title: Azure Front Door Service - Routing rule matching monitoring | Microsoft Docs
description: This article helps you understand how Azure Front Door Service matches which routing rule to use for an incoming request
services: front-door
documentationcenter: ''
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/10/2018
ms.author: sharadag
---

# ​​How Front Door matches requests to a routing rule

After establishing a connection and doing an SSL handshake, when a request lands on a Front Door environment one of the first things that Front Door does is determining from all the configurations, which particular routing rule to match the request to and then taking the defined action. The following document explains how Front Door determines which Route configuration to use when processing an HTTP request.

## Structure of a Front Door route configuration
A Front Door routing rule configuration is composed of two major parts: a "left-hand side" and a "right-hand side". We match the incoming request to the left-hand side of the route while the right-hand side defines how we process the request.

### Incoming match (left-hand side)
The following properties determine whether the incoming request matches the routing rule (or left-hand side):

* **HTTP Protocols** (HTTP/HTTPS)
* **Hosts** (for example, www.foo.com, \*.bar.com)
* **Paths** (for example, /\*, /users/\*, /file.gif)

These properties are expanded out internally so that every combination of Protocol/Host/Path is a potential match set.

### Route data (right-hand side)
The decision of how to process the request, depends on whether caching is enabled or not for the specific route. So, if we don't have a cached response for the request, we'll forward the request to the appropriate backend in the configured backend pool.

## Route matching
This section will focus on how we match to a given Front Door routing rule. The basic concept is that we always match to the **most-specific match first** looking only at the "left-hand side".  We first match based on HTTP protocol, then Frontend host, then the Path.

### Frontend host matching
When matching Frontend hosts, we use the logic as below:

1. Look for any routing with an exact match on the host.
2. If no exact frontend hosts match, reject the request and send a 400 Bad Request error.

To explain this process further, let's look at an example configuration of Front Door routes (left-hand side only):

| Routing rule | Frontend hosts | Path |
|-------|--------------------|-------|
| A | foo.contoso.com | /\* |
| B | foo.contoso.com | /users/\* |
| C | www.fabrikam.com, foo.adventure-works.com  | /\*, /images/\* |

If the following incoming requests were sent to Front Door, they would match against the following routing rules from above:

| Incoming frontend host | Matched routing rule(s) |
|---------------------|---------------|
| foo.contoso.com | A, B |
| www.fabrikam.com | C |
| images.fabrikam.com | Error 400: Bad Request |
| foo.adventure-works.com | C |
| contoso.com | Error 400: Bad Request |
| www.adventure-works.com | Error 400: Bad Request |
| www.northwindtraders.com | Error 400: Bad Request |

### Path matching
After determining the specific frontend host and filtering possible routing rules to just the routes with that frontend host, Front Door then filters the routing rules based on the request path. We use a similar logic as frontend hosts:

1. Look for any routing rule with an exact match on the Path
2. If no exact match Paths, look for routing rules with a wildcard Path that matches
3. If no routing rules are found with a matching Path, then reject the request and return a 400: Bad Request error HTTP response.

>[!NOTE]
> Any Paths without a wildcard are considered to be exact-match Paths. Even if the Path ends in a slash, it's still considered exact match.

To explain further, let's look at another set of examples:

| Routing rule | Frontend host    | Path     |
|-------|---------|----------|
| A     | www.contoso.com | /        |
| B     | www.contoso.com | /\*      |
| C     | www.contoso.com | /ab      |
| D     | www.contoso.com | /abc     |
| E     | www.contoso.com | /abc/    |
| F     | www.contoso.com | /abc/\*  |
| G     | www.contoso.com | /abc/def |
| H     | www.contoso.com | /path/   |

Given that configuration, the following example matching table would result:

| Incoming Request    | Matched Route |
|---------------------|---------------|
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
Once we've matched to a single Front Door routing rule, we then need to choose how to process the request. If for the matched routing rule, Front Door has a cached response available then the same gets served back to the client. Otherwise, the next thing that gets evaluated is whether you have configured [URL Rewrite (custom forwarding path)](front-door-url-rewrite.md) for the matched routing rule or not. If there isn't a custom forwarding path defined, then the request gets forwarded to the appropriate backend in the configured backend pool as is. Else, the request path is updated as per the [custom forwarding path](front-door-url-rewrite.md) defined and then forward to the backend.

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
