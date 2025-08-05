---
title: 'Create a hub-and-spoke topology in Azure - Portal'
description: Learn how to create a hub-and-spoke network topology for multiple virtual networks with Azure Virtual Network Manager using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 07/11/2025
ms.custom: template-concept, engagement-fy23
---

# Create a hub-and-spoke topology in Azure - Portal

In this article, you learn how to create a hub-and-spoke topology with Azure Virtual Network Manager. With this configuration, you select a virtual network to act as a hub and all spoke virtual networks have bi-directional peering with only the hub by default. You also can enable direct connectivity between spoke virtual networks in the same spoke network group and enable the spoke virtual networks to use the gateway in the hub virtual network.

## Prerequisites

* Read about the [Hub-and-spoke](concept-connectivity-configuration.md#hub-and-spoke-topology) network topology.
* Create an [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md#create-a-virtual-network-manager-instance).
* Identify the virtual networks you want to use in the hub-and-spoke configuration or create new [virtual networks](../virtual-network/quick-create-portal.md). 

## <a name="group"></a> Create a network group

This section helps you create a network group containing the virtual networks you're using as the spokes for the hub-and-spoke topology.

> [!NOTE]
> This how-to guide assumes you created an Azure Virtual Network Manager instance using the [quickstart](create-virtual-network-manager-portal.md) guide.

[!INCLUDE [virtual-network-manager-create-network-group](../../includes/virtual-network-manager-create-network-group.md)]

## Define network group members

Azure Virtual Network Manager provides you with two methods for adding membership to a network group. You can manually add virtual networks or use Azure Policy to conditionally add virtual networks to the network group. This how-to [manually adds membership](concept-network-groups.md#static-membership). For information on defining group membership with Azure Policy, see [Define network group membership with Azure Policy](concept-network-groups.md#dynamic-membership).

### Manually adding virtual networks

To manually add the desired virtual networks to your network group for use in your connectivity configuration, follow these steps:

1. From the list of network groups, select your network group and select **Add virtual networks** under *Manually add members* on the network group page.

1. On the *Manually add members* pane, select all desired virtual networks and select **Add**.

1. To review the network group membership that you manually added, select **Group Members** on the *Network Group* page under **Settings**.

## Create a hub-and-spoke connectivity configuration

This section guides you through creating a hub-and-spoke configuration with the network group you created in the previous section.

1. Select **Configurations** under *Settings*, then select **+ Create**.

1. Select **Connectivity configuration** from the drop-down menu to begin creating a connectivity configuration.

1. On the **Basics** page, enter the following information, and select **Next: Topology >**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a *name* for this configuration. |
    | Description | *(Optional)* Enter a description about what this configuration does. |

1. On the **Topology** tab, select the **Hub and spoke** topology under *Topology*.

1. Select the **Delete existing peerings** checkbox if you want to remove all previously created virtual network peerings between virtual networks in the network groups included in this configuration. Then select **Select a hub**.

1. On the **Select a hub** pane, select the virtual network intended as the hub virtual network and select **Select**.
    
1. Select **+ Add network groups**. 

1. On the **Add network groups** page, select the network groups you want to add to this configuration as spokes. Then select **Add** to save.

1. Select the settings you want to enable for each spoke network group. The following three options appear next to each network group name under **Spoke network groups**:

    - *Direct connectivity*: Select **Enable peering within network group** if you want to establish connectivity between virtual networks in the network group. By default, this connectivity will only be established between virtual networks in this network group that belong to the same region.
    - *Global Mesh*: This option is only selectable if *direct connectivity* is enabled. Select **Enable mesh connectivity across regions** if you want to establish connectivity across regions for all virtual networks in this network group.
    - *Gateway*: Select **Use hub as a gateway** if you have a virtual network gateway in the hub virtual network that you want the virtual networks of this spoke network group to use to pass traffic to on-premises.

1. Select **Review + Create > Create** to create the hub-and-spoke connectivity configuration.

## Deploy the hub-and-spoke configuration

To have this configuration take effect in your environment, you need to deploy the configuration to the regions in which your selected virtual networks reside.

1. Select **Deployments** under *Settings*, then select **Deploy a configuration**.

1. On the **Deploy a configuration** page, select the following settings:

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select **Include connectivity configurations in your goal state** . |
    | Connectivity configurations | Select the name of the configuration you created in the previous section. |
    | Target regions | Select all the regions that apply to virtual networks you select for the configuration. You might choose to select a subset of regions at a time if you want to gradually roll out this configuration. |

1. Select **Next** and then select **Deploy** to complete the deployment.

1. The deployment displays in the list for the selected region. The deployment of the configuration can take a few minutes to complete. Select the **Refresh** button to check on the status of the deployment.

    :::image type="content" source="./media/how-to-create-hub-and-spoke/deployment-succeeded.png" alt-text="Screenshot of configuration deployment in progress status.":::

> [!NOTE]
> If you're currently using virtual network peerings created outside of Azure Virtual Network Manager and want to manage your topology and connectivity with Azure Virtual Network Manager, you have a few options for deployment to eliminate or minimize downtime to your network:
> 1. **Deploy Azure Virtual Network Manager connectivity configurations on top of existing peerings.** Connectivity configurations are fully compatible with preexisting manual peerings. When you deploy a connectivity configuration, by default Azure Virtual Network Manager reuses existing peerings that achieve the connectivity described in the configuration and establishes additional connectivity as needed. This means that you aren't required to delete any existing peerings between the hub and spoke virtual networks.
> 2. **Fully manage connectivity with Azure Virtual Network Manager.** If you want to fully manage connectivity from a single control plane, you can opt to *Delete existing peerings* to remove all previously created peerings from the network groups' virtual networks targeted in this configuration upon deployment.

## Confirm configuration deployment

1. See [view applied configurations](how-to-view-applied-configurations.md).

1. To test *direct connectivity* between spoke virtual networks, deploy a virtual machine into each spoke virtual network. Then initiate an ICMP request from one virtual machine to the other.

## Next steps

- [Create a secured hub-and-spoke topology in this tutorial](tutorial-create-secured-hub-and-spoke.md).
- [Learn how to deploy a hub-and-spoke topology with Azure Firewall](how-to-deploy-hub-spoke-topology-with-azure-firewall.md).
- [Learn how to create a mesh connectivity configuration](how-to-create-mesh-network.md).
- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to block network traffic with a [Security admin configuration](how-to-block-network-traffic-portal.md).
