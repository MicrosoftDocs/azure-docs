---
title: Choose a secure network topology
description: Learn how you can use a decision tree to help choose the best topology to secure your network.
ms.author: mbender
author: mbender-ms
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 08/05/2026
# Customer intent: As a network administrator, I want to use a decision tree to select a secure network topology, so that I can ensure optimal security and routing for my organization’s workloads.
---

# Choose a secure network topology

A network topology defines the basic routing and traffic flow architecture for your workload. However, you must consider security with the network topology. To simplify the initial decision to formulate a direction, there are some simple paths that can be used to help define the secure topology.  This includes whether the workload is a globally distributed workload or a single region-based workload. You also must consider plans to use third-party network virtual appliances (NVA’s) to handle both routing and security.

[Azure Virtual WAN](../virtual-wan/virtual-wan-about.md) is a networking service that brings many networking, security, and routing functionalities together to provide a single operational interface.

[Azure Virtual Network Manager](../virtual-network-manager/overview.md) is a management service that enables you to group, configure, deploy, and manage virtual networks globally across subscriptions. [Security admin rules](../virtual-network-manager/concept-security-admins.md) can be applied to the virtual network to control access to the network and the resources within the network.

## Decision tree

The following decision tree helps you choose a network topology that meets your security requirements. It works through the considerations described earlier in this article, such as whether your workload spans multiple regions and whether you plan to use network virtual appliances for routing and security.

Use the resulting topology as an initial direction for your architecture. Because routing and security requirements differ for every workload, evaluate the recommendation in more detail before you commit to a topology.

:::image type="content" source="media/secure-network-topology/secure-network-topology-decision-tree.png" alt-text="Secure network topology decision tree.":::

## Next steps

- [Choose a secure application delivery service](secure-application-delivery.md)
- [Learn more about Azure network security](security/index.yml)
