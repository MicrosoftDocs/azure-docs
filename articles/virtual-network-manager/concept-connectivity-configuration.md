---
title: 'Connectivity configuration in Azure Virtual Network Manager'
description: Learn about different types network topology you can create with a connectivity configuration in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 3/22/2023
ms.custom: template-concept, ignite-fall-2021
---

# Connectivity configuration in Azure Virtual Network Manager

In this article, you learn about the different types of configurations you can create and deploy using Azure Virtual Network Manager. There are two types of configurations currently available: *Connectivity* and *Security Admins*. 

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## Connectivity configuration

*Connectivity* configurations allow you to create different network topologies based on your network needs. You have two topologies to choose from, a *mesh network* and a *hub and spoke*. Connectivity between virtual networks is defined within the configuration settings.

## Mesh network topology

A mesh network is a topology in which all the virtual networks in the [network group](concept-network-groups.md) are connected to each other. All virtual networks are connected and can pass traffic bi-directionally to one another. By default, the mesh is a regional mesh, therefore only virtual networks in the same region can communicate with each other. **Global mesh** can be enabled to establish connectivity of virtual networks across all Azure regions. A virtual network can be part of up to two connected groups. Virtual network address spaces can overlap in a mesh configuration, unlike in virtual network peerings. However, traffic to the specific overlapping subnets is dropped, since routing is non-deterministic.

:::image type="content" source="./media/concept-configuration-types/mesh-topology.png" alt-text="Diagram of a mesh network topology.":::

### Connected group

When you create a mesh topology, a new connectivity construct is created called *Connected group*. Virtual networks in a connected group can communicate to each other just like if you were to connect virtual networks together manually. When you look at the effective routes for a network interface, you'll see a next hop type of **ConnectedGroup**. Virtual networks connected together in a connected group don't have a peering configuration listed under *Peerings* for the virtual network.

> [!NOTE]
> * If you have conflicting subnets in two or more virtual networks, resources in those subnets *won't* be able to communicate to each other even if they're part of the same mesh network.
> * A virtual network can be part of up to **two** mesh configurations.

## Hub and spoke topology

A hub-and-spoke is a network topology in which you have a virtual network selected as the hub virtual network. This virtual network gets bi-directionally peered with every spoke virtual network in the configuration. This topology is useful for when you want to isolate a virtual network but still want it to have connectivity to common resources in the hub virtual network. 

:::image type="content" source="./media/concept-configuration-types/hub-and-spoke.png" alt-text="Diagram of a hub and spoke topology.":::

In this configuration, you have settings you can enable such as *direct connectivity* between spoke virtual networks. By default, this connectivity is only for virtual networks in the same region. To allow connectivity across different Azure regions, you need to enable *Global mesh*. You can also enable *Gateway* transit to allow spoke virtual networks to use the VPN or ExpressRoute gateway deployed in the hub.

### Direct connectivity

Enabling *Direct connectivity* creates an overlay of a [*connected group*](#connected-group) on top of your hub and spoke topology, which contains spoke virtual networks of a given group. Direct connectivity allows a spoke VNet to talk directly to other VNets in its spoke group, but not to VNets in other spokes.


For example, you create two network groups. You enable direct connectivity for the *Production* network group but not for the *Test* network group. This set up only allows virtual networks in the *Production* network group to communicate with one another but not the ones in the *Test* network group. 

:::image type="content" source="./media/concept-configuration-types/hub-spoke-connected.png" alt-text="Diagram of a hub and spoke topology with two network groups.":::

When you look at effective routes on a VM, the route between the hub and the spoke virtual networks will have the next hop type of  *VNetPeering* or *GlobalVNetPeering*. Routes between spokes virtual networks will show up with the next hop type of *ConnectedGroup*. With the example above, only the *Production* network group would have a *ConnectedGroup* because it has *Direct connectivity* enabled.

### Discovering network group topology with Topology View

To assist you in understanding the topology of your network group, Azure Virtual Network Manager provides a **Topology View** that shows the connectivity between network groups and their member virtual networks.  You can view the topology of your network group during the [creation of your connectivity configuration](create-virtual-network-manager-portal.md#create-a-configuration) with the following steps:

  1. Navigate to the **Configurations** page and create a connectivity configuration.
  1. On the **Topology** tab, select your desired topology type, add one or more network groups to the topology, and configure other desired connectivity settings.
  1. Select the **Preview Topology** tab to test out the Topology View and review your configuration's current connectivity.
  1. Complete the creation of your connectivity configuration.

> [!NOTE]
> The Topology View is only available during the creation of your connectivity configuration in the Azure portal. Once the configuration is created, you can no longer view the topology.

### Use cases

Enabling direct connectivity between spokes virtual networks can be helpful when you want to have an NVA or a common service in the hub virtual network but the hub doesn't need to be always accessed. But rather you need your spoke virtual networks in the network group to communicate with each other. Compared to traditional hub and spoke networks, this topology improves performance by removing the extra hop through the hub virtual network.

#### Global mesh

Like mesh, these spoke connected groups can be configured as regional or global. Global mesh is required when you want your spoke virtual networks to communicate with each other across regions. This connectivity is limited to virtual network in the same network group. To enable connectivity for virtual networks across regions, you need to **Enable mesh connectivity across regions** for the network group. Connections created between spokes virtual networks are in a [*Connected group*](#connected-group). 

#### Use hub as a gateway

Another option you can enable in a hub-and-spoke configuration is to use the hub as a gateway. This setting allows all virtual networks in the network group to use the VPN or ExpressRoute gateway in the hub virtual network to pass traffic. See [Gateways and on-premises connectivity](../virtual-network/virtual-network-peering-overview.md#gateways-and-on-premises-connectivity).

When you deploy a hub and spoke topology from the Azure portal, the **Use hub as a gateway** is enabled by default for the spoke virtual networks in the network group. Azure Virtual Network Manager attempts to create a virtual network peering connection between the hub and the spokes virtual network in the resource group. If the gateway doesn't exist in the hub virtual network, then the creation of the peering from the spoke virtual network to the hub fails. The peering connection from the hub to the spoke will still be created without an established connection. 

## Next steps

- Deploy an [Azure Virtual Network Manager](create-virtual-network-manager-terraform.md) instance using Terraform.
- Learn about [configuration deployments](concept-deployments.md) in Azure Virtual Network Manager.
- Learn how to block network traffic with a [security admin configuration](how-to-block-network-traffic-portal.md).
