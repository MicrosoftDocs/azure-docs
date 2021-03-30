---
title: 'Azure Front Door: Rule set'
description: This article provides an overview of the Azure Front Door Standard/Premium Rules Set feature. 
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 02/18/2021
ms.author: yuajia
---

# What is a Rule Set for Azure Front Door Standard/Premium (Preview)?

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

A Rule Set is a customized rule engine that groups a combination of rules into a single set that you can associate with multiple routes. The Rule Set allows you to customize how requests get processed at the edge and how Azure Front Door handles those requests.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Common supported scenarios

* Implementing security headers to prevent browser-based vulnerabilities like HTTP Strict-Transport-Security (HSTS), X-XSS-Protection, Content-Security-Policy, X-Frame-Options, and Access-Control-Allow-Origin headers for Cross-Origin Resource Sharing (CORS) scenarios. Security-based attributes can also be defined with cookies.

* Route requests to mobile or desktop versions of your application based on the client device type.

* Using redirect capabilities to return 301, 302, 307, and 308 redirects to the client to direct them to new hostnames, paths, query string, or protocols.

* Dynamically modify the caching configuration of your route based on the incoming requests.

* Rewrite the request URL path and forwards the request to the appropriate origin in your configured origin group.

* Add, modify, or remove request/response header to hide sensitive information or capture important information through headers.

* Support server variables to dynamically change the request/response headers or URL rewrite paths/query strings, for example, when a new page load or when a form is posted. Server variable is currently supported on **[Rule Set actions](concept-rule-set-actions.md)** only.

## Architecture

Rule Set handles requests at the edge. When a request arrives at your Azure Front Door Standard/Premium endpoint, WAF is executed first, followed by the settings configured in Route. Those settings include the Rule Set associated to the Route. Rule Sets are processed from top to bottom in the Route. The same applies to rules within a Rule Set. In order for all the actions in each rule to get executed, all the match conditions within a rule has to be satisfied. If a request doesn't match any of the conditions in your Rule Set configuration, then only configurations in Route will be executed.

If **Stop evaluating remaining rules** gets checked, then all of the remaining Rule Sets associated with the Route aren't executed.  

### Example

In the following diagram, WAF policies get executed first. A Rule Set gets configured to append a response header. Then the header changes the max-age of the cache control if the match condition gets met.

:::image type="content" source="../media/concept-rule-set/front-door-rule-set-architecture-1.png" alt-text="Diagram that shows architecture of Rule Set." lightbox="../media/concept-rule-set/front-door-rule-set-architecture-1-expanded.png":::

## Terminology

With Azure Front Door Rule Set, you can create a combination of Rules Set configuration, each composed of a set of rules. The following out lines some helpful terminologies you'll come across when configuring your Rule Set.

For more quota limit, refer to [Azure subscription and service limits, quotas and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).

* *Rules set*: A set of rules that gets associated to one or multiple [Routes](concept-route.md). Each configuration is limited to 25 rules. You can create up to 10 configurations.

* *Rules Set Rule*: A rule composed of up to 10 match conditions and 5 actions. Rules are local to a Rule Set and cannot be exported to use across Rule Sets. Users can create the same rule in multiple Rule Sets.

* *Match Condition*: There are many match conditions that can be utilized to parse your incoming requests. A rule can contain up to 10 match conditions. Match conditions are evaluated with an **AND** operator. *Regular expression is supported in conditions*. A full list of match conditions can  be found in [Rule Set Condition](concept-rule-set-match-conditions.md).

* *Action*: Actions dictate how AFD handles the incoming requests based on the matching conditions. You can modify caching behaviors, modify request headers/response headers, do URL rewrite and URL redirection. *Server variables are supported on Action*. A rule can contain up to 10 match conditions. A full list of actions can be found [Rule Set Actions](concept-rule-set-actions.md).

## Next steps

* Learn how to [create a Front Door Standard/Premium](create-front-door-portal.md).
* Learn how to configure your first [Rule Set](how-to-configure-rule-set.md).
 
