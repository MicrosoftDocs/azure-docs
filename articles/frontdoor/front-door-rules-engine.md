---
title: What is a rule set?
titleSuffix: Azure Front Door
description: This article provides an overview of the Azure Front Door Rule sets feature. 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.custom: devx-track-arm-template
ms.date: 05/15/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# What is a rule set in Azure Front Door? 

::: zone pivot="front-door-standard-premium"

A rule set is a customized rules engine that groups a combination of rules into a single set. You can associate a rule set with multiple routes. A Rule set allows you to customize how requests get processed and handled at the Azure Front Door edge.

## Common supported scenarios

* Implementing security headers to prevent browser-based vulnerabilities like HTTP Strict-Transport-Security (HSTS), X-XSS-Protection, Content-Security-Policy, X-Frame-Options, and Access-Control-Allow-Origin headers for Cross-Origin Resource Sharing (CORS) scenarios. Security-based attributes can also be defined with cookies.

* Route requests to mobile or desktop versions of your application based on the client device type.

* Using redirect capabilities to return 301, 302, 307, and 308 redirects to the client to direct them to new hostnames, paths, query strings, or protocols.

* Dynamically modify the caching configuration of your route based on the incoming requests.

* Rewrite the request URL path and forwards the request to the appropriate origin in your configured origin group.

* Add, modify, or remove request/response header to hide sensitive information or capture important information through headers.

* Support server variables to dynamically change the request header, response headers or URL rewrite paths/query strings. For example, when a new page load or when a form gets posted. Server variable is currently supported in **[rule set actions](front-door-rules-engine-actions.md)** only.

## Architecture

Rule sets handle requests at the Front Door edge. When a request arrives at your Front Door endpoint, WAF is processed first, followed by the settings configured in route. Those settings include the rule set associated to the route. Rule sets are processed in the order they appear under the routing configuration. Rules in a rule set also get processed in the order they appear. In order for all the actions in each rule to run, all the match conditions within a rule have to be met. If a request doesn't match any of the conditions in your rule set configuration, then only the default route settings get applied.

If the **Stop evaluating remaining rules** is selected, then any remaining rule sets associated with the route don't get ran.  

### Example

In the following diagram, WAF policies get processed first. Then the rule set configuration appends a response header. The header changes the max-age of the cache control if the match condition is true.

:::image type="content" source="./media/front-door-rules-engine/front-door-rule-set-architecture-1.png" alt-text="Diagram showing how a rule set can change response header for a request going through a Front Door endpoint." lightbox="./media/front-door-rules-engine/front-door-rule-set-architecture-1-expanded.png":::

## Terminology

With a Front Door rule set, you can create any combination of configurations, each composed of a set of rules. The following out lines some helpful terminologies you come across when configuring your rule set.

* *Rule set*: A set of rules that gets associated to one or multiple [routes](front-door-route-matching.md).

* *Rule set rule*: A rule composed of up to 10 match conditions and 5 actions. Rules are local to a rule set and can't be exported to use across other rule sets. You can create the same rule in different rule sets.

* *Match condition*: There are many match conditions that you can configure to parse an incoming request. A rule can contain up to 10 match conditions. Match conditions are evaluated with an **AND** operator. *Regular expression is supported in conditions*. A full list of match conditions can be found in [Rule set match conditions](rules-match-conditions.md).

* *Action*: An action dictates how Front Door handles the incoming requests based on the matching conditions. You can modify caching behaviors, modify request headers, response headers, set URL rewrite and URL redirection. *Server variables are supported with Action*. A rule can contain up to five actions. A full list of actions can be found in [Rule set actions](front-door-rules-engine-actions.md).

## ARM template support

Rule sets can be configured using Azure Resource Manager templates. For an example, see [Front Door Standard/Premium with rule set](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-rule-set). You can customize the behavior by using the JSON or Bicep snippets included in the documentation examples for [match conditions](rules-match-conditions.md) and [actions](front-door-rules-engine-actions.md).

## Limitations

For information about quota limits, refer to [Front Door limits, quotas and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-standard-and-premium-service-limits).

## Next steps

* Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
* Learn how to configure your first [rule set](standard-premium/how-to-configure-rule-set.md).

::: zone-end

::: zone pivot="front-door-classic"

A Rules engine configuration allows you to customize how HTTP requests get handled at the Front Door edge and provides controlled behavior to your web application. Rules Engine for Azure Front Door (classic) has several key features, including:

* Enforces HTTPS to ensure all your end users interact with your content over a secure connection.
* Implements security headers to prevent browser-based vulnerabilities like HTTP Strict-Transport-Security (HSTS), X-XSS-Protection, Content-Security-Policy, X-Frame-Options, and Access-Control-Allow-Origin headers for Cross-Origin Resource Sharing (CORS) scenarios. Security-based attributes can also be defined with cookies.
* Route requests to mobile or desktop versions of your application based on the patterns of request headers contents, cookies, or query strings.
* Use redirect capabilities to return 301, 302, 307, and 308 redirects to the client to direct to new hostnames, paths, or protocols.
- Dynamically modify the caching configuration of your route based on the incoming requests.
- Rewrite the request URL path and forward the request to the appropriate backend in your configured backend pool.

## Architecture 

Rules engine handles requests at the edge. When a request enters your Azure Front Door (classic) endpoint, WAF is processed first, followed by the Rules engine configuration associated with your frontend domain. If a Rules engine configuration gets processed, that means a match condition has been met. In order for all actions in each rule to be processed, all the match conditions within a rule has to be met. If a request doesn't match any of the conditions in your Rules engine configuration, then the default routing configuration is processed. 

For example, in the following diagram, a Rules engine is configured to append a response header. The header changes the max-age of the cache control if the request file has an extension of *.jpg*. 

:::image type="content" source="./media/front-door-rules-engine/rules-engine-architecture-3.png" alt-text="Diagram showing Rules engine changing the cache max-age in the response header if the file requested has an extension of .jpg.":::

In this second example, you see Rules engine is configured to redirect users to a mobile version of the website if the requesting device is of type *Mobile*.

:::image type="content" source="./media/front-door-rules-engine/rules-engine-architecture-1.png" alt-text="Diagram showing rules engine redirecting users to the mobile version of a website if requesting device is of type mobile.":::

In both of these examples, when none of the match conditions are met, the specified routing rule is what gets processed. 

## Terminology 

In Azure Front Door (classic) you can create Rules engine configurations of many combinations, each composed of a set of rules. The following outlines some helpful terminology you come across when configuring your Rules Engine. 

- *Rules engine configuration*: A set of rules that are applied to single route. Each configuration is limited to 25 rules. You can create up to 10 configurations. 
- *Rules engine rule*: A rule composed of up to 10 match conditions and 5 actions.
- *Match condition*: There are many match conditions that can be utilized to parse your incoming requests. A rule can contain up to 10 match conditions. Match conditions are evaluated with an **AND** operator. For a full list of match conditions, see [Rules match conditions](rules-match-conditions.md). 
- *Action*: Actions dictate what happens to your incoming requests - request/response header actions, forwarding, redirects, and rewrites are all available today. A rule can contain up to five actions; however, a rule may only contain one route configuration override. For a full list of actions, see [Rules actions](front-door-rules-engine-actions.md).

## Next steps

- Learn how to configure your first [Rules engine configuration](front-door-tutorial-rules-engine.md). 
- Learn how to [create an Azure Front Door (classic) profile](quickstart-create-front-door.md).
- Learn about [Azure Front Door (classic) routing architecture](front-door-routing-architecture.md).

::: zone-end
