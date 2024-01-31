---
title: Choose a secure network topology
description: Learn how you can use a decision tree to help choose the best topology to secure your network.
author: vhorne
ms.service: virtual-network
ms.topic: article
ms.date: 11/29/2023
ms.author: victorh
---

# Choose a secure network topology

A network topology defines the basic routing and traffic flow architecture for your workload. However, you must consider security with the network topology. To simplify the initial decision to formulate a direction, there are some simple paths that can be used to help define the secure topology.  This includes whether the workload is a globally distributed workload or a single region-based workload. You also must consider plans to use third-party network virtual appliances (NVA’s) to handle both routing and security.

[Azure Virtual WAN](../virtual-wan/virtual-wan-about.md) is a networking service that brings many networking, security, and routing functionalities together to provide a single operational interface.

[Azure Virtual Network Manager](../virtual-network-manager/overview.md) is a management service that enables you to group, configure, deploy, and manage virtual networks globally across subscriptions. [Security admin rules](../virtual-network-manager/concept-security-admins.md) can be applied to the virtual network to control access to the network and the resources within the network.

## Decision tree

The following decision tree helps you to choose a network topology for your security requirements. The decision tree guides you through a set of key decision criteria to reach a recommendation.

Treat this decision tree as a starting point. Every deployment has unique requirements, so use the recommendation as a starting point. Then perform a more detailed evaluation.

:::image type="content" source="media/secure-network-topology/secure-network-topology-decision-tree.png" alt-text="Secure network topology decision tree.":::

## Next steps

- [Choose a secure application delivery service](secure-application-delivery.md)
- [Learn more about Azure network security](security/index.yml)