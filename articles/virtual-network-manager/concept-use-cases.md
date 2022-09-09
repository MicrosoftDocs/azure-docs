---
title: Common use cases for Azure Virtual Network Manager
description: This article covers common use cases for customers using AVNM
author: mbender-ms
ms.author: mbender
ms.topic: overview 
ms.date: 07/06/2022
ms.custom: template-overview
ms.service: virtual-network-manager
# Customer Intent: As a network admin, I need to know when I should use Azure Virtual Network Manager in my orginization for managing virtual networks across my organization in a scalable, flexible, and secure manner with minimal administrative overhead.
---

# Common use cases for Azure Virtual Network Manager

Learn about use cases for Azure Virtual Network Manager including managing connectivity of virtual networks, and securing network traffic.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Creating topology and connectivity
Connectivity configuration allows you to create different network topologies based on your network needs. You create a connectivity configuration by adding new or existing virtual networks into [network groups](concept-network-groups.md) and creating a topology that meets your needs. The connectivity configuration offers three topology options: mesh, hub and spoke, or hub and spoke with direct connectivity between spoke virtual networks.

### Mesh topology
When a [mesh topology](concept-connectivity-configuration.md#mesh-network-topology) is deployed, all virtual networks have direct connectivity with each other. They don't need to go through other hops on the network to communicate. Mesh topology is useful when all the virtual networks need to communicate directly with each other.

### Hub and spoke topology
[Hub and spoke topology](concept-connectivity-configuration.md#hub-and-spoke-topology) is recommended when you're deploying central infrastructure services in a hub virtual network that are shared by spoke virtual networks. This topology can be more efficient than having these common components in all spoke virtual networks. 

### Hub and spoke topology with direct connectivity
This topology combines the two above topologies. It's recommended when you have common central infrastructure in the hub, and you want direct communication between all spokes. [Direct connectivity](concept-connectivity-configuration.md#direct-connectivity) helps you reduce the latency caused by extra network hops when going through a hub.

### Maintaining virtual network topology
AVNM automatically maintains the desired topology you defined in the connectivity configuration when changes are made to your infrastructure. For example, when you add new spoke to the topology, AVNM can handle the changes necessary to create the connectivity to the spoke and its virtual networks.

## Security

With Azure Virtual Network Manager, you create [security admin rules](concept-security-admins.md) to enforce security policies across virtual networks in your organization. Security admin rules take precedence over rules defined by network security groups, and they're applied first when analyzing traffic as seen in the following diagram:
:::image type="content" source="media/concept-use-cases/sec-admin-rule-evaluation.png" alt-text="This diagram shows the order of network traffic evaluation when using network admin rules and network security group rules.":::
Common uses include:

- Create standard rules that must be applied and enforced on all existing VNets and newly created VNets.
- Create security rules that can't be modified and enforce company/organizational level rules.
- Enforce security protection to prevent users from opening high-risk ports.
- Create default rules for everyone in the company/organization so that administrators can prevent security threats caused by NSG misconfiguration or forgetting to put necessary NSGs.
- Create security boundaries using security admin rules as an administrator and let the owners of the virtual networks configure their NSGs so the NSGs won’t break company policies.
- Force-allow the traffic from and to critical services so that other users can't accidentally block the necessary traffic, such as program updates.

For a walk-through of use cases, see [Securing Your Virtual Networks with Azure Virtual Network Manager - Microsoft Tech Community](https://techcommunity.microsoft.com/t5/azure-networking-blog/securing-your-virtual-networks-with-azure-virtual-network/ba-p/3353366).

## Next steps
- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
- Learn more about [network groups](concept-network-groups.md) in Azure Virtual Network Manager.
- Learn what you can do with a [connectivity configuration](concept-connectivity-configuration.md).
- Learn more about [security admin configurations](concept-security-admins.md).

