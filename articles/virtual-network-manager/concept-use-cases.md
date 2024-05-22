---
title: Common use cases for Azure Virtual Network Manager
description: This article covers common use cases for customers who use Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: overview 
ms.date: 03/15/2024
ms.custom: template-overview
ms.service: virtual-network-manager
# Customer Intent: As a network admin, I need to know when I should use Azure Virtual Network Manager in my organization for managing virtual networks across my organization in a scalable, flexible, and secure manner with minimal administrative overhead.
---

# Common use cases for Azure Virtual Network Manager

Learn about use cases for Azure Virtual Network Manager, including managing the connectivity of virtual networks and helping to secure network traffic.

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## Connectivity configuration

You can use a connectivity configuration to create various network topologies based on your network needs. You create a connectivity configuration by adding new or existing virtual networks into [network groups](concept-network-groups.md) and creating a topology that meets your needs. A connectivity configuration offers three topology options: mesh, hub-and-spoke, or hub-and-spoke with direct connectivity between spoke virtual networks.

### Mesh topology (preview)

When you deploy a [mesh topology](concept-connectivity-configuration.md#mesh-network-topology), all virtual networks have direct connectivity with each other. They don't need to go through other hops on the network to communicate. A mesh topology is useful when all the virtual networks need to communicate directly with each other.

### Hub-and-spoke topology

We recommend a [hub-and-spoke topology](concept-connectivity-configuration.md#hub-and-spoke-topology) when you're deploying central infrastructure services in a hub virtual network that are shared by spoke virtual networks. This topology can be more efficient than having these common components in all spoke virtual networks.

### Hub-and-spoke topology with direct connectivity

A hub-and-spoke topology with direct connectivity combines the two preceding topologies. We recommend it when you have common central infrastructure in the hub, and you want direct communication between all spokes. [Direct connectivity](concept-connectivity-configuration.md#direct-connectivity) helps you reduce the latency that extra network hops cause when they're going through a hub.

### Maintaining a virtual network topology

When you make changes to your infrastructure, Azure Virtual Network Manager automatically maintains the topology that you defined in the connectivity configuration. For example, when you add a new spoke to the topology, Azure Virtual Network Manager can handle the changes that are necessary to create the connectivity to the spoke and its virtual networks.

> [!NOTE]
> You can deploy and manage Azure Virtual Network Manager through the [Azure portal](./create-virtual-network-manager-portal.md), the [Azure CLI](./create-virtual-network-manager-cli.md), [Azure PowerShell](./create-virtual-network-manager-powershell.md), or [Terraform](./create-virtual-network-manager-terraform.md).

## Security

With Azure Virtual Network Manager, you create [security admin rules](concept-security-admins.md) to enforce security policies across virtual networks in your organization. Security admin rules take precedence over rules that network security groups define. Security admin rules are applied first in traffic analysis, as shown in the following diagram:

:::image type="content" source="media/concept-security-admins/traffic-evaluation.png" alt-text="Diagram that shows the order of evaluation for network traffic with security admin rules and network security rules.":::

Common uses include:

- Create standard rules that must be applied and enforced on all existing virtual networks and newly created virtual networks.
- Create security rules that can't be modified, and enforce organizational-level rules.
- Enforce security protection to prevent users from opening high-risk ports.
- Create default rules for everyone in the organization so that administrators can prevent security threats caused by misconfiguration of network security groups (NSGs) or failure to create necessary NSGs.
- Create security boundaries by using security admin rules as an administrator, and let the owners of the virtual networks configure their NSGs so that the NSGs don't break company policies.
- Force-allow the traffic from and to critical services so that other users can't accidentally block the necessary traffic, such as monitoring services and program updates.

For a walkthrough of use cases, see the blog post [Securing Your Virtual Networks with Azure Virtual Network Manager](https://techcommunity.microsoft.com/t5/azure-networking-blog/securing-your-virtual-networks-with-azure-virtual-network/ba-p/3353366).

## Next steps

- Create an [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md) by using the Azure portal.
- Deploy an [Azure Virtual Network Manager instance](create-virtual-network-manager-terraform.md) by using Terraform.
- Learn more about [network groups](concept-network-groups.md) in Azure Virtual Network Manager.
- Learn what you can do with a [connectivity configuration](concept-connectivity-configuration.md).
- Learn more about [security admin configurations](concept-security-admins.md).
