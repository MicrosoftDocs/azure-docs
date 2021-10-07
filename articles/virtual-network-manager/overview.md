---
title: 'What is Azure Virtual Network Manager (Preview)?'
description: Learn how Azure Virtual Network Manager can simplify management and scalability of your virtual networks.
services: virtual-network-manager
author: duongau
ms.service: virtual-network-manager
ms.topic: overview
ms.date: 11/02/2021
ms.author: duau
ms.custom: references_regions
#Customer intent: As an IT administrator, I want to learn about Azure Virtual Network Manager and what I can use it for.
---

# What is Azure Virtual Network Manager (Preview)?

Azure Virtual Network Manager is a management service that enables you to group, configure, deploy, and manage virtual network configurations globally across subscriptions. With Virtual Network Manager you can define network groups to identify and segment your virtual networks. Then you can determine the connectivity and security configuration you want and apply them across all the selected virtual networks at once. 

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How does Azure Virtual Network Manager work?

:::image type="content" source="./media/overview/management-group.png" alt-text="Diagram of management group in Virtual Network Manager.":::

During the creation process you define the scope for what your Azure Virtual Network Manager will manage. The scope can defined be at the subscription, [management group](../governance/management-groups/overview.md), or  [tenant](../active-directory/develop/quickstart-create-new-tenant.md) level. After defining the scope, you enable features such as *Connectivity* and/or *SecurityAdmin* role for your Virtual Network Manager.

After you deploy the Virtual Network Manager instance, you then create a *network group* by selecting specific virtual networks (Static group membership). You can also use conditional statements to select virtual networks by name, tags or IDs (Dynamic group membership). You then create a connectivity or a security configuration targeting those network groups based on your network and security needs. 

A connectivity configuration enables you to create a full mesh or a hub and spoke network by selecting the topology you want for the target network groups. A security configuration allows you to define a collection of rules that you can apply to one or more network groups at the global level. Once you've created the network groups and configurations, you commit the deployment of configurations to any region of your choosing.

## Key benefits:

* Centrally manage connectivity and security policies globally across regions and subscriptions.

* Enables transitive communication between spokes in a hub and spoke configuration without complexity of managing a mesh network.

* Highly scalable and highly available service with redundancy and replication across the globe.

* Ability to enable global network security rules that overrides network security groups.

* Low-latency and high bandwidth between resources in different virtual networks using virtual network peering.

* Ability to roll out network changes through specific region sequence or frequency of your choosing.

## Public preview regions

* North Central US

* West US

* West US 2

* East US

* East US 2

* North Europe

* West Europe

* France Central

## Next step

- Create an [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md) instance using the Azure portal.
- Learn more about [security admin configurations](concept-security-admins.md).
