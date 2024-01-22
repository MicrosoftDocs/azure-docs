---
title: 'What is Azure Virtual Network Manager?'
description: Learn how Azure Virtual Network Manager can simplify management and scalability of your virtual networks.
services: virtual-network-manager
author: mbender-ms
ms.service: virtual-network-manager
ms.topic: overview
ms.date: 3/22/2023
ms.author: mbender
ms.custom: references_regions
#Customer intent: As an IT administrator, I want to learn about Azure Virtual Network Manager and what I can use it for.
---

# What is Azure Virtual Network Manager?

Azure Virtual Network Manager is a management service that enables you to group, configure, deploy, and manage virtual networks globally across subscriptions. With Virtual Network Manager, you can define network groups to identify and logically segment your virtual networks. Then you can determine the connectivity and security configurations you want and apply them across all the selected virtual networks in network groups at once.

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## How does Azure Virtual Network Manager work?

:::image type="content" source="./media/overview/management-group.png" alt-text="Diagram of management group in Virtual Network Manager.":::

During the creation process, you define the scope for what your Azure Virtual Network Manager manages. Your Network Manager only has the delegated access to apply configurations within this scope boundary. Defining a scope can be done directly on a list of subscriptions. However it's recommended to use [management groups](../governance/management-groups/overview.md) to define your scope. Management groups provide hierarchical organization to your subscriptions. After defining the scope, you deploy configuration types including *Connectivity* and the *SecurityAdmin rules* for your Virtual Network Manager.

After you deploy the Virtual Network Manager instance, you create a *network group*, which serves as a logical container of networking resources to apply configurations at scale. You can manually select individual virtual networks to be added to your network group, known as static membership. Or you can use Azure Policy to define conditions that govern your group membership dynamically, or dynamic membership. For more information about Azure Policy initiatives, see [Azure Virtual Network Manager and Azure Policy](concept-network-groups.md#network-groups-and-azure-policy).  

Next, you create connectivity and/or security configuration(s) applied to those network groups based on your topology and security needs. A [connectivity configuration](concept-connectivity-configuration.md) enables you to create a mesh or a hub-and-spoke network topology. A [security configuration](concept-security-admins.md) allows you to define a collection of rules that you can apply to one or more network groups at the global level. Once you've created your desired network groups and configurations, you can deploy the configurations to any region of your choosing.

## Key benefits

- Centrally manage connectivity and security policies globally across regions and subscriptions.

- Enable direct connectivity between spokes in a hub-and-spoke configuration without the complexity of managing a mesh network.

- Highly scalable and highly available service with redundancy and replication across the globe.

- Ability to create network security rules that override network security group rules.

- Low latency and high bandwidth between resources in different virtual networks using virtual network peering.

- Roll out network changes through a specific region sequence and frequency of your choosing.

For current information on the regions where Azure Virtual Network Manager is available, see [Azure Virtual Network Manager regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=virtual-network-manager).

## Next steps

- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
- Deploy an [Azure Virtual Network Manager](create-virtual-network-manager-terraform.md) instance using Terraform.
- Learn more about [network groups](concept-network-groups.md) in Azure Virtual Network Manager.
- Learn what you can do with a [connectivity configuration](concept-connectivity-configuration.md).
- Learn more about [security admin configurations](concept-security-admins.md).
