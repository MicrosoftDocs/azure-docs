---
title: Connectivity Configurations in Azure Virtual Network Manager
description: Connectivity configurations in Azure Virtual Network Manager simplify network management. Learn how to optimize network performance and security today.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 07/11/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:05/08/2025
#customer intent: As an infrastructure architect, I want to understand the differences between mesh and hub-and-spoke topologies, so that I can choose the best option for my organization's needs. And I want to learn how to configure these topologies in Azure Virtual Network Manager using connectivity configurations, so that I can optimize network performance and security.
---

# Connectivity configurations in Azure Virtual Network Manager

Azure Virtual Network Manager simplifies the management of connectivity, security, routing, and more across your Azure network environment. Connectivity configurations, including mesh and hub-and-spoke topologies, help you optimize network performance and connectivity at your organization's scale. This article covers features like high-scale connected groups and global mesh connectivity, along with use cases and settings for each topology.

## Connectivity configuration

With *connectivity configurations*, you can create and maintain different network topologies based on your network needs. You have two topologies to choose from: mesh and hub-and-spoke. Connectivity between your virtual networks is defined by your connectivity configuration's settings. You define the virtual networks for which you want to establish connectivity via [network groups](concept-network-groups.md). Your connectivity configuration then uses the network groups to establish connectivity as described by your desired topology among the virtual networks in the network groups.

If *delete existing peerings* is enabled for your connectivity configuration, any peerings that don't match the contents of this connectivity configuration can be removed, even if these peerings were manually created after this configuration is deployed. If you remove a virtual network from a network group used in the configuration, your Azure Virtual Network Manager instance removes only the connectivity that it created.

When you deploy a connectivity configuration, Azure Virtual Network Manager establishes bi-directional connectivity via virtual network peerings (for hub-and-spoke topologies) or via connected groups (for mesh topologies) between virtual networks. This connectivity is established according to the settings you define and network groups included in your connectivity configuration.

## Mesh topology

A mesh topology defines connectivity between every virtual network in the [network group](concept-network-groups.md). All member virtual networks are connected and can pass traffic bi-directionally to one another.

A common use case of a mesh topology is to allow spoke virtual networks in a hub-and-spoke topology to directly communicate to each other without routing the traffic through the hub virtual network. This approach reduces latency that might otherwise result from routing traffic through a router in the hub. Additionally, you can maintain security and oversight over the direct connections between spoke virtual networks by implementing [security admin rules](concept-security-admins.md) in Azure Virtual Network Manager or [network security group rules](../virtual-network/network-security-groups-overview.md). Traffic can also be monitored and recorded using [virtual network flow logs](concept-virtual-network-flow-logs.md).

By default, the mesh topology defined in your connectivity configuration is a regional mesh, meaning that only virtual networks in the same region can communicate with each other. You can enable a global mesh option in your connectivity configuration to establish connectivity between virtual networks across all Azure regions.

> [!NOTE]
> Virtual network address spaces can overlap in a mesh configuration, unlike in virtual network peerings, but traffic between the subnets with overlapping address spaces is dropped since routing is nondeterministic.

:::image type="content" source="./media/concept-configuration-types/mesh-topology.png" alt-text="Screenshot of a mesh topology diagram showing virtual networks connected in a bi-directional mesh.":::

## Behind the scenes: connected group

When you create a mesh topology or enable direct connectivity in a hub-and-spoke topology, a new connectivity construct exclusive to Azure Virtual Network Manager is created. This construct is called a *connected group*. Virtual networks in a connected group can communicate with each other just like manually connected virtual networks. When you observe the effective routes for a network interface, you'll see a next hop type of *ConnectedGroup*. Virtual networks connected together in a connected group don't have a peering configuration listed under *Peerings* for the virtual network. This connected group is what enables Azure Virtual Network Manager to support a higher scale of virtual network connectivity than traditional virtual network peerings.

> [!NOTE]
> A virtual network can be part of up to two connected groups, meaning it can be part of up to two mesh topologies.

### Enable high-scale private endpoints in Azure Virtual Network Manager connected groups

[!INCLUDE [virtual-network-manager-high-scale-preview](../../includes/virtual-network-manager-high-scale-preview.md)]

Azure Virtual Network Manager's high-scale connected group feature empowers you to extend your network capacity. Use the following steps to enable this feature to support up to 2,000 private endpoints across the connected group.

#### Prepare each virtual network in the connected group

1. Review [Increase Private Endpoint virtual network limits](../private-link/increase-private-endpoint-vnet-limits.md) for detailed guidance on raising these limits. Enabling or disabling this feature initiates a one-time connection reset. We recommend performing these changes during a maintenance window.

2. Register the feature flag of `Microsoft.Network/EnableMaxPrivateEndpointsVia64kPath` for each subscription containing an Azure Virtual Network Manager instance and virtual networks in your connected group.

   > [!IMPORTANT]
   > This registration is essential for unlocking the extended private endpoint capacity. For more information, see [How to enable Azure preview features documentation](../azure-resource-manager/management/preview-features.md).

3. In each virtual network within your connected group, configure the **Private Endpoint Network Policies** to either `Enabled` or `RouteTableEnabled`. This setting ensures your virtual networks are ready to support the high-scale private endpoints functionality. For detailed guidance, see [Increase Private Endpoint virtual network limits](../private-link/increase-private-endpoint-vnet-limits.md).

#### Configure mesh topology for high-scale private endpoints

In this step, you configure the connectivity configuration's mesh topology settings for your connected group to enable high-scale private endpoints. This step involves selecting the appropriate options in the Azure portal and verifying the configuration.

1. In your mesh connectivity configuration, locate and select the checkbox for **Enable private endpoints high scale**. This option activates the high-scale feature for your connected group.

1. Verify every virtual network in your entire mesh (connected group) is configured with high-scale private endpoints. The Azure portal validates the settings across the entire group. If a virtual network without the high-scale configuration is added later, it can't communicate with private endpoints in other virtual networks.

1. After verifying all virtual networks are properly configured, deploy the connectivity configuration. This step finalizes the setup of your high-scale connected group.

## Hub-and-spoke topology

A hub-and-spoke topology defines connectivity between a selected hub virtual network and spoke virtual networks that are members of one or more selected spoke network groups. The hub virtual network gets bi-directionally peered with every spoke network group's virtual network members in the configuration. This topology is useful for isolating a virtual network but still maintaining connectivity to common resources in the hub virtual network.

:::image type="content" source="./media/concept-configuration-types/hub-and-spoke.png" alt-text="Screenshot of a hub-and-spoke topology diagram showing a hub virtual network connected to multiple spoke virtual networks.":::

In this configuration, you have settings you can enable such as *direct connectivity* between spoke virtual networks that belong to the same spoke network group. By default, this connectivity is only established for virtual networks in the same region. To allow connectivity across different Azure regions, you need to enable the *global mesh* setting for the spoke network group. You can also enable *gateway* transit to allow spoke virtual networks to use the VPN or ExpressRoute gateway deployed in the hub virtual network.

### Enable direct connectivity

Enabling direct connectivity for a spoke network group creates a mesh (and thus a [connected group](#behind-the-scenes-connected-group)) across that spoke network group's virtual networks on top of your hub-and-spoke topology. Direct connectivity allows a virtual network to talk directly with other virtual networks within its spoke network group, but does *not* enable connectivity with virtual networks in other spoke network groups.

For example, you create two network groups and include them as spoke network groups in your hub-and-spoke connectivity configuration. You enable direct connectivity for the *Production* network group but not for the *Test* network group. This setup connects the hub virtual network with all of the virtual networks in the *Production* and *Test* network groups, but only allows virtual networks in the *Production* network group to communicate with one another. The *Production* network group's virtual networks don't have connectivity with the *Test* network group's virtual networks, and the *Test* network group's virtual networks don't have connectivity among themselves (unless direct connectivity is also enabled for the *Test* network group).

:::image type="content" source="./media/concept-configuration-types/hub-spoke-connected.png" alt-text="Screenshot of a hub-and-spoke topology with two network groups.":::

When you look at effective routes on a virtual machine, the route between the hub and the spoke virtual networks will have the next hop type of  *VNetPeering* or *GlobalVNetPeering*. Routes between spoke virtual networks will show up with the next hop type of *ConnectedGroup*. With the *Production* and *Test* example, only the *Production* network group would have a *ConnectedGroup* because it has *direct connectivity* enabled.

Direct connectivity between spoke virtual networks can be helpful when you want to have a network virtual appliance (NVA) or a common service in the hub virtual network but the hub doesn't need to be always accessed in order for trusted spoke virtual networks to communicate with each other. Compared to traditional hub-and-spoke networks, this topology improves performance by removing the extra hop through the hub virtual network.

#### Global mesh

As with the [mesh topology](#mesh-topology), a spoke network group with direct connectivity enabled is configured as regional by default. You can enable *global mesh* when you want your spoke network group's virtual networks to communicate with each other across regions. This connectivity is limited to virtual networks in the same network group. To enable this global mesh connectivity for virtual networks across regions, you need to **Enable mesh connectivity across regions** for the network group. Connections created between spoke virtual networks are in a [*connected group*](#behind-the-scenes-connected-group).

#### Use hub as a gateway

Another option you can enable in a hub-and-spoke configuration is to use the hub as a gateway. This setting allows all virtual networks in the spoke network group to use the VPN or ExpressRoute gateway in the hub virtual network to pass traffic. See [Gateways and on-premises connectivity](../virtual-network/virtual-network-peering-overview.md#gateways-and-on-premises-connectivity).

When you deploy a hub-and-spoke topology from the Azure portal, the **Use hub as a gateway** option is enabled by default for the spoke virtual networks in the network group. Azure Virtual Network Manager attempts to create a virtual network peering connection between the hub virtual network and virtual networks in the spoke network groups. If this option is enabled but a gateway doesn't exist in the hub virtual network, then the creation of the peering from the spoke virtual network to the hub fails. The peering connection from the hub to the spoke will still be created without an established connection.

## Discover network group topology with Topology View

To assist you in understanding the topology of your network group, Azure Virtual Network Manager provides a **Topology View** that displays the connectivity between network groups and their member virtual networks. You can view the topology of your connectivity configuration during the [creation of your connectivity configuration](create-virtual-network-manager-portal.md#create-a-configuration) with the following steps:

1. Navigate to the **Configurations** page and create a connectivity configuration.

1. On the **Topology** tab, select your desired topology type, add one or more network groups to the topology, and configure other desired connectivity settings.

1. Select the **View topology** tab to visually review your configuration's current connectivity.

1. Complete the creation of your connectivity configuration.

You can review the current topology of a connectivity configuration by selecting **View topology** under **Settings** in the configuration's details page. The view shows the connectivity between the virtual networks part of this connectivity configuration.

:::image type="content" source="media/concept-configuration-types/network-group-topology.png" alt-text="Screenshot of visualization window showing topology of connectivity configuration.":::

## Next steps

- [Learn how to create a mesh connectivity configuration](how-to-create-mesh-network.md).
- [Learn how to create a hub-and-spoke connectivity configuration](how-to-create-hub-and-spoke.md).
- [Create a secured hub-and-spoke topology in this tutorial](tutorial-create-secured-hub-and-spoke.md).
- [Learn how to deploy a hub-and-spoke topology with Azure Firewall](how-to-deploy-hub-spoke-topology-with-azure-firewall.md).
- [Understand configuration deployments](concept-deployments.md) to effectively manage your network settings.
- [Block unwanted network traffic](how-to-block-network-traffic-portal.md) using security admin configurations.
- [Deploy Azure Virtual Network Manager using Terraform](create-virtual-network-manager-terraform.md) to quickly set up your environment.
