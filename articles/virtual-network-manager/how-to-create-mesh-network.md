---
title: 'Create a mesh network topology with Azure Virtual Network Manager'
description: Learn how to create a mesh network topology with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 07/11/2025
ms.custom: engagement-fy23
---

# Create a mesh topology with Azure Virtual Network Manager

In this article, you learn how to create a mesh topology using Azure Virtual Network Manager. With this configuration, all the virtual networks of the same region in the network groups included in this configuration can communicate with one another. You can enable cross-region connectivity by enabling the *global mesh* setting in the connectivity configuration.

## Prerequisites

* Read about the [Mesh](concept-connectivity-configuration.md#mesh-topology) network topology.
* Create an [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md#create-a-virtual-network-manager-instance).
* Identify the virtual networks you want to use in the mesh configuration or create new [virtual networks](../virtual-network/quick-create-portal.md).

## <a name="group"></a> Create a network group

This section helps you create a network group containing the virtual networks you're using for the mesh topology.

> [!NOTE]
> This how-to guide assumes you created an Azure Virtual Network Manager instance using the [quickstart](create-virtual-network-manager-portal.md) guide.

[!INCLUDE [virtual-network-manager-create-network-group](../../includes/virtual-network-manager-create-network-group.md)]

## Define network group members

Azure Virtual Network Manager provides you with two methods for adding membership to a network group. You can manually add virtual networks or use Azure Policy to conditionally add virtual networks to the network group. This how-to [manually adds membership](concept-network-groups.md#static-membership). For information on defining group membership with Azure Policy, see [Define network group membership with Azure Policy](concept-network-groups.md#dynamic-membership).

### Manually adding members

To manually add the desired virtual networks to your network group for use in your connectivity configuration, follow these steps:

1. From the list of network groups, select your network group and select **Add virtual networks** under *Manually add members* on the network group page.

1. On the *Manually add members* pane, select all desired virtual networks and select **Add**.

1. To review the network group membership that you manually added, select **Group Members** on the *Network Group* page under **Settings**.

## Create a mesh connectivity configuration

This section guides you through creating a mesh configuration with the network group you created in the previous section.

1. Select **Configurations** under *Settings*, then select **+ Create**.

1. Select **Connectivity configuration** from the drop-down menu to begin creating a connectivity configuration.

1. On the **Basics** page, enter the following information, and select **Next: Topology >**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a *name* for this configuration. |
    | Description | *Optional* Enter a description about what this configuration does. |

1. On the **Topology** tab, select the **Mesh** topology if not already selected, and leave the **Enable mesh connectivity across regions** unchecked. Cross-region connectivity isn't required for this setup since all the virtual networks in the network group are in the same region.

1. On the *Add network groups* page, select the network group you want to add to this configuration. Then select **Select** to save.

    > [!IMPORTANT]
    > You can add multiple network groups to a mesh connectivity configuration to establish connectivity between all the member virtual networks of all the selected network groups in the same regions by default. *Enable mesh connectivity across regions* connects all virtual networks of all selected network groups across all regions.

1. Select **Review + create** and then **Create** to create the mesh connectivity configuration.

## Deploy the mesh configuration

To have this configuration take effect in your environment, you need to deploy the configuration to the regions in which your selected virtual networks reside.

1. Select **Deployments** under *Settings*, then select **Deploy configuration**.

1. On the *Deploy a configuration* page, select the following settings:

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select **Include connectivity configurations in your goal state**. |
    | Connectivity Configurations | Select the name of the configuration you created in the previous section. |
    | Target regions | Select all the regions that apply to virtual networks you select for the configuration. You might choose to select a subset of regions at a time if you want to gradually roll out this configuration. |

1. Select **Next** and then select **Deploy** to complete the deployment.

1. The deployment displays in the list for the selected region. The deployment of the configuration can take a few minutes to complete. Select the **Refresh** button to check on the status of the deployment.

## Confirm deployment

1. See [view applied configurations](how-to-view-applied-configurations.md).

1. To test connectivity between virtual networks, deploy a test virtual machine into each virtual network and start an ICMP request between them.

## Next steps

- [Learn how to create a hub-and-spoke connectivity configuration](how-to-create-hub-and-spoke.md).
- [Create a secured hub-and-spoke topology in this tutorial](tutorial-create-secured-hub-and-spoke.md).
- [Learn how to deploy a hub-and-spoke topology with Azure Firewall](how-to-deploy-hub-spoke-topology-with-azure-firewall.md).
- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to block network traffic with a [Security admin configuration](how-to-block-network-traffic-portal.md).
