---
title: 'Connectivity configuration in Azure Virtual Network Manager (Preview)'
description: Learn about different types network topology you can create with a connectivity configuration in Azure Virtual Network Manager.
author: duongau
ms.author: duau
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: template-concept
---

# Connectivity configuration in Azure Virtual Network Manager (Preview)

In this article you will learn about the different types of configurations you can create and deploy using Azure Virtual Network Manager. The two types of configurations currently available are *Connectivity* and *Security Admins*. 

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Connectivity configuration

*Connectivity* configurations allows you to create different network topologies based on your network needs. You have the option between a *mesh network* and a *hub and spoke* topology. Connectivity between your virtual network are defined within the configuration.

## Mesh network topology

A mesh network is a topology in which all the virtual networks in the network group are connected to each other. All virtual networks will be peered and can pass traffic bi-directionally to one another. **Global mesh** can be enabled to establish connectivity of virtual networks across all Azure regions. Virtual networks selected for a mesh network configuration are not allowed to be members in a different mesh configuration. Virtual network address spaces can't overlap in this configuration or else your resources will not be able to communicate with one another due to network conflicts.

:::image type="content" source="./media/concept-configuration-types/mesh-topology.png" alt-text="Diagram of a mesh network topology.":::

###<a name="connectedgroup"></a> Connected group

When you establish a mesh topology, a new connectivity construct is created called *Connected group*. Virtual networks in a connected group can communicate to each other just like if you were to peer virtual networks together manually. When you look at the effective routes for a network interface you'll see a next hop type of **ConnectedGroup**. Virtual network connected together in a connected group won't have a peering config listed under *Peerings* for the virtual network.

> [!NOTE]
> * If subnets in a virtual network have the same address space, resources in those subnets *won't* be able to communicate to each other even if they're part of the same mesh network.
> * A virtual network can only be part of up to **five** mesh configuration.

## Hub and spoke topology

A hub-and-spoke network is a topology in which you have a virtual network selected as the hub virtual network and is bi-directionally peered with every other virtual network in the selected group. This topology is useful for when you want to isolate a virtual network but still want it to have connectivity to the hub virtual network. 

In this configuration you have the option to enable *Transitivity* between spoke virtual networks, meaning virtual networks belonging to the same network group can will be peered with each other. See example diagram below:

:::image type="content" source="./media/concept-configuration-types/hub-and-spoke.png" alt-text="Diagram of a hub and spoke topology with two network groups.":::

### Transitivity

You can create two network groups: one for production and the hub virtual network and another for testing and the hub virtual network. Transitivity is enabled for the *Production* network group and not for the *Test* network group. This set up allows for all the virtual networks in the production network group to be able to communicate with one another but not those in the test network group. Transitivity only enables connectivity for virtual networks in the same region. To enable connectivity for virtual networks across regions, you will need to **Enable mesh connectivity across regions** for the network group. Connections created between spokes virtual networks are in a [*Connected group*](#connectedgroup).

#### Use cases

Enabling direct connectivity between spokes virtual networks can be helpful when you want to have an NVA or a common service in the hub virtual network but the hub doesn't need to be always accessed in the case where spoke virtual networks in the network group wish to communicate with each other. Compared to traditional hub and spoke networks, this topology improves performance by removing the additional hop through the hub virtual network.

### Use hub as a gateway

The last functionality in the hub and spoke configuration is to deploy a virtual network gateway or and ExpressRoute gateway in the hub virtual network and enabled **Use hub as a gateway** for a network group. This set up will allow all virtual networks in the designated network group to use the remote gateway of the hub virtual network to pass traffic using VPN or ExpressRoute.

## Next steps

- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance.
- Learn about [configuration deployments](concept-deployments.md) in Azure Virtual Network Manager.
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).