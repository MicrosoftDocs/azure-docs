---
title: Choose a secure application delivery service
description: Learn how you can use a decision tree to help choose a secure application delivery service.
ms.author: mbender
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 08/05/2026
# Customer intent: "As a system architect, I want to utilize a decision tree for selecting an application delivery service, so that I can ensure the security and performance of web applications based on specific deployment needs."
---

# Choose a secure application delivery service

Choosing a topology for web application ingress has a few different options, so this decision tree helps identify the initial pattern to start with when considering a web application flow for your workload. The key consideration is whether you're using a globally distributed web-based pattern with Web Application Firewall (WAF). Patterns in this classification are better served at the Azure edge versus within your specific virtual network. 

[Azure Front Door](../frontdoor/front-door-overview.md), for example,  sits at the edge, supports WAF, and additionally includes application acceleration capabilities. Azure Front Door can be used in combination with [Application Gateway](../application-gateway/overview.md) for more layers of protection and more granular rules per application. If you aren't distributed, then an Application Gateway also works with WAF and can be used to manage web based traffic with TLS inspection. Finally, if you have media based workloads then the Verizon Media Streaming service delivered via Azure is the best option you.

## Decision tree

The following decision tree helps you choose an application delivery service. It works through the ingress considerations described earlier in this article, such as whether your workload is globally distributed and whether it needs a web application firewall.

Use the resulting service as an initial ingress pattern. Because traffic profiles and protection requirements differ for every web application, evaluate the recommendation in more detail before you build your design around it.

:::image type="content" source="media\secure-application-delivery\secure-application-delivery-decision-tree.png" alt-text="Application delivery service decision tree.":::

## Next steps

- [Choose a secure network topology](secure-network-topology.md)
- [Learn more about Azure network security](security/index.yml)
