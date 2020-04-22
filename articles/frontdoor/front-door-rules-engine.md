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
ms.author: megan-beatty
# customer intent: As an IT admin, I want to learn about Front Door and what the Rules Engine feature does. 
---

# What is Rules Engine for Azure Front Door? 

Rules Engine allows you to customize how http requests are handled at the edge and have more control of your web application behavior. Rules Engine for Azure Front Door comprises several key features, including:

- Enforce HTTPS at the edge and keep your application more secure. 
- Header-based routing – route requests based on the patterns in the contents of both request and response headers. 
- Parameter-based routing – take advantage of a series of match conditions including post args, query strings, and request methods, to route requests based on HTTP request parameters. 
- Route configurations overrides - use redirect capabilities to return 301/302/307/308 redirects to the client to redirect to new hostnames, paths, and protocols. Additionally, use forwarding capabilities to rewrite the request URL path without doing a traditional redirect. 


## Architecture 

Rules engine handles requests at the edge. Once configuring Rules Engine, when a request hits your Front Door endpoint, WAF will continue to be executed first, followed by the Rules Engine configuration associated with your Frontend/ Domain. Rules Engine follows the “best match” policy, meaning the rule that is executed for the request is the one that most closely matches the patterns you outlined in the configuration. If a request matches none of the rules in your Rule Engine configuration, then the default Routing Rule is executed. 

For example, in the configuration below, a Rules Engine is configured to append a response header which changes the max age of the cache control if the match condition is met. 

![response header action](./media/front-door-rules-engine/rules-engine-architecture-3.png)

In another example, we see that Rules Engine is configured to send a user to a mobile version of the site if the match condition, device type, is true. 

![route configuration override](./media/front-door-rules-engine/rules-engine-architecture-1.png)

In both of these examples, when none of the match conditions are met, the specified Route Rule is what is executed. 

## Terminology 

With AFD Rules Engine, you can create a series of Rules Engine configurations, each composed of a set of rules. The following outlines some helpful terminology you will come across when configuring your rules engine. 

- *Rules Engine Configuration*: A set of rules that are applied to single Route Rule. Each configuration is limited to 5 rules. You can create up to 10 configurations. 
- *Rules Engine Rule*: A rule composed of up to 10 match conditions and 5 actions.
- *Match Condition*: There are numerous match conditions that can be utilized to parse your incoming requests. A rule can contain up to 10 match conditions. A full list of match conditions can  be found [here](front-door-match-conditions.md). 
- *Action*: Actions dictate what happens to your incoming requests - request/ response header actions, forwarding, redirects, and rewrites are all available today. A rule can contain up to 5 actions; however, a rule may only contain 1 route configuration override.  A full list of actions can be found [here](front-door-actions.md).


## Next steps

- Learn how to set up your first [Rules Engine configuration](front-door-tutorial-rules-engine.md). 
- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
