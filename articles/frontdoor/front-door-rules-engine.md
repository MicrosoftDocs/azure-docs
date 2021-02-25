---
title: Rules Engine for Azure Front Door architecture and terminology
description: This article provides an overview of the Azure Front Door Rules Engine feature. 
services: frontdoor
documentationcenter: ''
author: duongau
editor: ''
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 9/29/2020
ms.author: duau
# customer intent: As an IT admin, I want to learn about Front Door and what the Rules Engine feature does. 
---

# What is Rules Engine for Azure Front Door? 

Rules Engine allows you to customize how HTTP requests gets handled at the edge and provides a more controlled behavior to your web application. Rules Engine for Azure Front Door has several key features, including:

* Enforces HTTPS to ensure all your end users interact with your content over a secure connection.
* Implements security headers to prevent browser-based vulnerabilities like HTTP Strict-Transport-Security (HSTS), X-XSS-Protection, Content-Security-Policy, X-Frame-Options, and Access-Control-Allow-Origin headers for Cross-Origin Resource Sharing (CORS) scenarios. Security-based attributes can also be defined with cookies.
* Route requests to mobile or desktop versions of your application based on the patterns of request headers contents, cookies, or query strings.
* Use redirect capabilities to return 301, 302, 307, and 308 redirects to the client to direct to new hostnames, paths, or protocols.
- Dynamically modify the caching configuration of your route based on the incoming requests.
- Rewrite the request URL path and forward the request to the appropriate backend in your configured backend pool.

## Architecture 

Rules engine handles requests at the edge. When a request hits your Front Door endpoint, WAF is executed first, followed by the Rules Engine configuration associated with your Frontend/Domain. If a Rules Engine configuration is executed, the means the parent routing rule is already a match. In order for all the actions in each rule to get executed, all the match conditions within a rule has to be satisfied. If a request doesn't match any of the conditions in your Rule Engine configuration, then the default Routing Rule is executed. 

For example, in the following diagram, a Rules Engine gets configured to append a response header. The header changes the max-age of the cache control if the match condition gets met. 

![response header action](./media/front-door-rules-engine/rules-engine-architecture-3.png)

In another example, we see that Rules Engine is configured to send a user to a mobile version of the site if the match condition, device type, is true. 

![route configuration override](./media/front-door-rules-engine/rules-engine-architecture-1.png)

In both of these examples, when none of the match conditions are met, the specified Route Rule is what gets executed. 

## Terminology 

With AFD Rules Engine, you can create a combination of Rules Engine configurations, each composed of a set of rules. The following outlines some helpful terminology you will come across when configuring your Rules Engine. 

- *Rules Engine Configuration*: A set of rules that are applied to single Route Rule. Each configuration is limited to 25 rules. You can create up to 10 configurations. 
- *Rules Engine Rule*: A rule composed of up to 10 match conditions and 5 actions.
- *Match Condition*: There are many match conditions that can be utilized to parse your incoming requests. A rule can contain up to 10 match conditions. Match conditions are evaluated with an **AND** operator. A full list of match conditions can  be found [here](front-door-rules-engine-match-conditions.md). 
- *Action*: Actions dictate what happens to your incoming requests - request/response header actions, forwarding, redirects, and rewrites are all available today. A rule can contain up to five actions; however, a rule may only contain one route configuration override.  A full list of actions can be found [here](front-door-rules-engine-actions.md).


## Next steps

- Learn how to configure your first [Rules Engine configuration](front-door-tutorial-rules-engine.md). 
- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
