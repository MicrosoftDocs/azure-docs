---
title: Azure Front Door | Microsoft Docs
description: This article provides an overview of Azure Front Door. Find out if it is the right choice for load-balancing user traffic for your application.
services: frontdoor
documentationcenter: ''
author: megan-beatty
editor: ''
ms.service: frontdoor
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 4/30/2020
ms.author: mebeatty
# customer intent: As an IT admin, I want to learn about Front Door and what the Rules Engine feature does. 
---

# What is Rules Engine for Azure Front Door? 

Rules Engine allows you to customize how HTTP requests are handled at the edge and provides more control of the behavior of your web application. Rules Engine for Azure Front Door comprises several key features, including:

- Header-based routing – route requests based on the patterns in the contents of request headers, cookies, and query strings.
- Parameter-based routing – take advantage of a series of match conditions including post args, query strings, cookies, and request methods, to route requests based on HTTP request parameters. 
- Route configurations overrides: 
    - Use redirect capabilities to return 301/302/307/308 redirects to the client to redirect to new hostnames, paths, and protocols. 
    - Use forwarding capabilities to rewrite the request URL path without doing a traditional redirect and forward the request to the appropriate backend in your configured backend pool. 
    - Customize your caching configuration and dynamically change a route from forwarding to caching based on match conditions. 

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Architecture 

Rules engine handles requests at the edge. Once configuring Rules Engine, when a request hits your Front Door endpoint, WAF will be executed first, followed by the Rules Engine configuration associated with your Frontend/ Domain. When a Rules Engine configuration is executed, it means that the parent routing rule is already a match. Whether all of the actions in each of the rules within the Rules Engine configuration are executed is subject to all of the match conditions within that rule being satisfied. If a request matches none of the conditions in your Rule Engine configuration, then the default Routing Rule is executed. 

For example, in the configuration below, a Rules Engine is configured to append a response header which changes the max-age of the cache control if the match condition is met. 

![response header action](./media/front-door-rules-engine/rules-engine-architecture-3.png)

In another example, we see that Rules Engine is configured to send a user to a mobile version of the site if the match condition, device type, is true. 

![route configuration override](./media/front-door-rules-engine/rules-engine-architecture-1.png)

In both of these examples, when none of the match conditions are met, the specified Route Rule is what gets executed. 

## Terminology 

With AFD Rules Engine, you can create a series of Rules Engine configurations, each composed of a set of rules. The following outlines some helpful terminology you will come across when configuring your Rules Engine. 

- *Rules Engine Configuration*: A set of rules that are applied to single Route Rule. Each configuration is limited to 5 rules. You can create up to 10 configurations. 
- *Rules Engine Rule*: A rule composed of up to 10 match conditions and 5 actions.
- *Match Condition*: There are numerous match conditions that can be utilized to parse your incoming requests. A rule can contain up to 10 match conditions. Match conditions are evaluated with an **AND** operator. A full list of match conditions can  be found [here](front-door-rules-engine-match-conditions.md). 
- *Action*: Actions dictate what happens to your incoming requests - request/ response header actions, forwarding, redirects, and rewrites are all available today. A rule can contain up to 5 actions; however, a rule may only contain 1 route configuration override.  A full list of actions can be found [here](front-door-rules-engine-actions.md).


## Next steps

- Learn how to set up your first [Rules Engine configuration](front-door-tutorial-rules-engine.md). 
- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
