---
title: Choose a secure application delivery service
description: Learn how you can use a decision tree to help choose a secure application delivery service.
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 11/15/2023
ms.author: victorh
---

# Choose a secure application delivery service

Choosing a topology for web application ingress has a few different options, so this decision tree helps identify the initial pattern to start with when considering a web application flow for your workload. The key consideration is whether you're using a globally distributed web-based pattern with Web Application Firewall (WAF). Patterns in this classification are better served at the Azure edge versus within your specific virtual network. 

Azure Front Door, for example,  sits at the edge, supports WAF, and additionally includes application acceleration capabilities. Azure Front Door can be used in combination with Application Gateway for more layers of protection and more granular rules per application. If you aren't distributed, then an Application Gateway also works with WAF and can be used to manage web based traffic with TLS inspection. Finally, if you have media based workloads then the Verizon Media Streaming service delivered via Azure is the best option you.

## Decision tree

The following decision tree helps you to choose an application delivery service. The decision tree guides you through a set of key decision criteria to reach a recommendation.

Treat this decision tree as a starting point. Every deployment has unique requirements, so use the recommendation as a starting point. Then perform a more detailed evaluation.

:::image type="content" source="media\secure-application-delivery\secure-application-delivery-decision-tree.png" alt-text="Application delivery service decision tree.":::

## Next steps

- [Choose a secure network topology](secure-network-topology.md)