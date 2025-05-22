---
title: Connectivity Configurations in Azure Virtual Network Manager
description: Connectivity configurations in Azure Virtual Network Manager simplify network management. Learn how to optimize network performance and security today.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 05/08/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:05/08/2025
#customer intent: As an infrastructure architect, I want to understand the differences between mesh and hub-and-spoke topologies, so that I can choose the best option for my organization's needs. And I want to learn how to configure these topologies in Azure Virtual Network Manager using connectivity configurations, so that I can optimize network performance and security.
---

# Connectivity configurations in Azure Virtual Network Manager

Azure Virtual Network Manager simplifies the management of virtual network connectivity and security across your Azure environment. Connectivity configurations, including mesh and hub-and-spoke topologies, help you optimize network performance and security. This article covers features like high-scale connected groups and global mesh connectivity, along with use cases and configuration steps for each topology.

## Connectivity configuration

With *Connectivity* configurations, you can create different network topologies based on your network needs. You have two topologies to choose from: a mesh network and a hub and spoke network. Connectivity between virtual networks is defined within the configuration settings.

## Mesh network topology

A mesh network is a topology in which all the virtual networks in the [network group](concept-network-groups.md) are connected to each other. All virtual networks are connected and can pass traffic bi-directionally to one another.

A common use case of a mesh network topology is to allow some spoke virtual networks in a hub and spoke topology to directly communicate to each other without the traffic going through the hub virtual network. This approach reduces latency that might otherwise result from routing traffic through a router in the hub. Additionally, you can maintain security and oversight over the direct connections between spoke networks by implementing Network Security Groups rules or security administrative rules in Azure Virtual Network Manager. Traffic can also be monitored and recorded using virtual network flow logs.

By default, the mesh is a regional mesh, therefore only virtual networks in the same region can communicate with each other. Global mesh can be enabled to establish connectivity of virtual networks across all Azure regions. A virtual network can be part of up to two connected groups. Virtual network address spaces can overlap in a mesh configuration, unlike in virtual network peerings. However, traffic to the specific overlapping subnets is dropped, since routing is nondeterministic.

:::image type="content" source="./media/concept-configuration-types/mesh-topology.png" alt-text="Screenshot of a mesh network topology diagram showing virtual networks connected in a bi-directional mesh.":::

## Connected group

When you create a mesh topology or direct connectivity in the hub and spoke topology, a new connectivity construct is created called *Connected group*. Virtual networks in a connected group can communicate with each other just like manually connected virtual networks. When you look at the effective routes for a network interface, you'll see a next hop type of *ConnectedGroup*. Virtual networks connected together in a connected group don't have a peering configuration listed under *Peerings* for the virtual network.

> [!NOTE]
> If you have conflicting subnets in two or more virtual networks, resources in those subnets *can't* communicate with each other even if they're part of the same mesh network.
> A virtual network can be part of up to **two** mesh configurations.

### Enable high scale private endpoints connected groups in Azure Virtual Network Manager

[!INCLUDE [virtual-network-manager-high-scale-preview](../../includes/virtual-network-manager-high-scale-preview.md)]

Azure Virtual Network Manager's high scale connected group feature allows you to extend your network capacity. Use the following steps to enable this feature to support up to 20,000 private endpoints across the connected group:

#### Prepare each virtual network in the connected group

1. Review [Increase Private Endpoint virtual network limits](../private-link/increase-private-endpoint-vnet-limits.md) for detailed guidance on increasing Private Endpoint virtual network limits. Enabling or disabling this feature initiates a one-time connection reset. It's recommended to perform these changes during a maintenance window.

2. Register the feature flag of `Microsoft.Network/EnableMaxPrivateEndpointsVia64kPath` for each subscription containing an Azure Virtual Network Manager instance or a virtual network in your connected group.

   > [!IMPORTANT]
   > This registration is essential for unlocking the extended private endpoint capacity. For more information, see [How to enable Azure preview features documentation](../azure-resource-manager/management/preview-features.md).

3. In each virtual network within your connected group, configure the **Private Endpoint Network Policies** to either `Enabled` or `RouteTableEnabled`. This setting ensures your virtual networks are ready to support the high scale private endpoints functionality. For detailed guidance, see [Increase Private Endpoint virtual network limits](..//private-link/increase-private-endpoint-vnet-limits.md).

#### Configure mesh connectivity for high scale private endpoints

In this step, you configure the mesh connectivity settings for your connected group to enable high scale private endpoints. This step involves selecting the appropriate options in the Azure portal and verifying the configuration.

1. In your mesh connectivity configuration, locate and select the checkbox for **Enable private endpoints high scale**. This option activates the high scale feature for your connected group.

1. Verify every virtual network in your connected group is configured with high scale private endpoints. The Azure portal validates the settings across the entire group. If a virtual network without the high scale configuration is added later, it can't communicate with private endpoints in other virtual networks.

1. After verifying all virtual networks are properly configured, deploy the settings. This finalizes the setup of your high scale connected group.

## Hub and spoke topology

A hub-and-spoke is a network topology in which you have a virtual network selected as the hub virtual network. This virtual network gets bi-directionally peered with every spoke virtual network in the configuration. This topology is useful for when you want to isolate a virtual network but still want it to have connectivity to common resources in the hub virtual network.

:::image type="content" source="./media/concept-configuration-types/hub-and-spoke.png" alt-text="Screenshot of a hub and spoke topology diagram showing a hub virtual network connected to multiple spoke networks.":::

In this configuration, you have settings you can enable such as *direct connectivity* between spoke virtual networks. By default, this connectivity is only for virtual networks in the same region. To allow connectivity across different Azure regions, you need to enable *Global mesh*. You can also enable *Gateway* transit to allow spoke virtual networks to use the VPN or ExpressRoute gateway deployed in the hub.

If checked, any peerings that don't match the contents of this configuration can be removed, even if these peerings were manually created after this configuration is deployed. If you remove a virtual network from a network group used in the configuration, your virtual manager removes only peerings it created.

### Enable direct connectivity

Enabling Direct connectivity creates an overlay of a [connected group](#connected-group) on top of your hub and spoke topology, which contains spoke virtual networks of a given group. Direct connectivity allows a spoke virtual network to talk directly to other VNets in its spoke group, but not to VNets in other spokes.

For example, you create two network groups. You enable direct connectivity for the *Production* network group but not for the *Test* network group. This set up only allows virtual networks in the *Production* network group to communicate with one another but not the ones in the *Test* network group.

:::image type="content" source="./media/concept-configuration-types/hub-spoke-connected.png" alt-text="Screenshot of a hub and spoke topology with two network groups.":::

When you look at effective routes on a virtual machine, the route between the hub and the spoke virtual networks will have the next hop type of  *VNetPeering* or *GlobalVNetPeering*. Routes between spokes virtual networks will show up with the next hop type of *ConnectedGroup*. With the *Production/Test* example, only the *Production* network group would have a *ConnectedGroup* because it has *Direct connectivity* enabled.

### Discover network group topology with Topology View

To assist you in understanding the topology of your network group, Azure Virtual Network Manager provides a **Topology View** that shows the connectivity between network groups and their member virtual networks. You can view the topology of your network group during the [creation of your connectivity configuration](create-virtual-network-manager-portal.md#create-a-configuration) with the following steps:

1. Navigate to the **Configurations** page and create a connectivity configuration.

1. On the **Topology** tab, select your desired topology type, add one or more network groups to the topology, and configure other desired connectivity settings.

1. Select the **Preview Topology** tab to test out the Topology View and review your configuration's current connectivity.

1. Complete the creation of your connectivity configuration.

You can review the current topology of a network group by selecting **Visualization** under **Settings** in the network group's details page. The view shows the connectivity between the  member virtual networks in the network group.

:::image type="content" source="media/concept-configuration-types/network-group-topology.png" alt-text="Screenshot of visualization window showing topology of network group.":::

### Use cases

Enabling direct connectivity between spokes virtual networks can be helpful when you want to have a network virtual appliance (NVA) or a common service in the hub virtual network but the hub doesn't need to be always accessed. But rather you need your spoke virtual networks in the network group to communicate with each other. Compared to traditional hub and spoke networks, this topology improves performance by removing the extra hop through the hub virtual network.

#### Global mesh

Like mesh, these spoke connected groups can be configured as regional or global. Global mesh is required when you want your spoke virtual networks to communicate with each other across regions. This connectivity is limited to virtual network in the same network group. To enable connectivity for virtual networks across regions, you need to **Enable mesh connectivity across regions** for the network group. Connections created between spokes virtual networks are in a [*Connected group*](#connected-group).

#### Use hub as a gateway

Another option you can enable in a hub-and-spoke configuration is to use the hub as a gateway. This setting allows all virtual networks in the network group to use the VPN or ExpressRoute gateway in the hub virtual network to pass traffic. See [Gateways and on-premises connectivity](../virtual-network/virtual-network-peering-overview.md#gateways-and-on-premises-connectivity).

When you deploy a hub and spoke topology from the Azure portal, the **Use hub as a gateway** is enabled by default for the spoke virtual networks in the network group. Azure Virtual Network Manager attempts to create a virtual network peering connection between the hub and the spokes virtual network in the resource group. If the gateway doesn't exist in the hub virtual network, then the creation of the peering from the spoke virtual network to the hub fails. The peering connection from the hub to the spoke will still be created without an established connection.

## Next steps

- [Deploy Azure Virtual Network Manager using Terraform](create-virtual-network-manager-terraform.md) to quickly set up your environment.
- [Understand configuration deployments](concept-deployments.md) to effectively manage your network settings.
- [Block unwanted network traffic](how-to-block-network-traffic-portal.md) using security admin configurations.
