---
title: 'Create a mesh network topology with Azure Virtual Network Manager (Preview)'
description: Learn how to create a mesh network topology with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 05/02/2022
ms.custom: ignite-fall-2021
---

# Create a mesh network topology with Azure Virtual Network Manager (Preview)

In this article, you'll learn how to create a mesh network topology using Azure Virtual Network Manager. With this configuration, all the virtual networks of the same region in the same network group can communicate with one another. You can enable cross region connectivity by enabling the global mesh setting in the connectivity configuration.

> [!IMPORTANT]
> *Azure Virtual Network Manager* is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

* Read about [mesh](concept-connectivity-configuration.md#mesh-network-topology) network topology.
* Created a [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md#create-virtual-network-manager).
* Identify virtual networks you want to use in the mesh configuration or create new [virtual networks](../virtual-network/quick-create-portal.md).

## <a name="group"></a> Create a network group

This section will help you create a network group containing the virtual networks you'll be using for the hub-and-spoke network topology.

1. Go to your Azure Virtual Network Manager instance. This how-to guide assumes you've created one using the [quickstart](create-virtual-network-manager-portal.md) guide.

1. Select **Network Groups** under *Settings*, then select **+ Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-network-group-2.png" alt-text="Screenshot of add a network group button.":::

1. On the *Create a network group* page, enter a **Name** for the network group. This example will use the name **myNetworkGroup**. Select **Add** to create the network group.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-basics.png" alt-text="Screenshot of create a network group page.":::

1. You'll see the new network group added to the *Network Groups* page.
    :::image type="content" source="./media/create-virtual-network-manager-portal/network-groups-list.png" alt-text="Screenshot of network group page with list of network groups.":::

1. Once your network group is created, you'll add virtual networks as members. Choose one of the options: *[Manually add membership](concept-network-groups.md#static-membership)* or *[Create policy to dynamically add members](concept-network-groups.md#dynamic-membership)*.

## Define network group members
Azure Virtual Network manager allows you two methods for adding membership to a network group. You can manually add virtual networks or use Azure Policy to dynamically add virtual networks based on conditions. Choose the option below for your mesh membership configuration:

### Manually adding members
To manually add the desired virtual networks for your Mesh configuration to your Network Group, follow the steps below:

1. From the list of network groups, select your network group and select **Add virtual networks** under *Manually add members* on the network group page.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-static-member.png" alt-text="Screenshot of add a virtual network.":::

1. On the *Manually add members* page, select all the virtual networks and select **Add**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-virtual-networks.png" alt-text="Screenshot of add virtual networks to network group page.":::

1. To review the network group membership manually added, select **Group Members** on the *Network Group* page under **Settings**.
    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list-thumb.png" alt-text="Screenshot of group membership under Group Membership." lightbox="media/create-virtual-network-manager-portal/group-members-list.png":::

### Dynamic membership with Azure Policy
To dynamically add members using [Azure Policy](concept-azure-policy-integration.md), follow the steps below:

1. From the list of network groups, select your network group and select **Create Azure Policy** under *Create policy to dynamically add members*.

    :::image type="content" source="media/create-virtual-network-manager-portal/define-dynamic-membership.png" alt-text="Screenshot of Create Azure Policy button.":::

1. On the **Create Azure Policy** page, create a conditional statement to populate your network group. You can choose different conditional parameters including *Name* and *Tags*.
    
    :::image type="content" source="media/how-to-create-hub-and-spoke/create-azure-policy.png" alt-text="Screenshot of Create Azure Policy page with conditional parameters displayed.":::

1. To review the network group membership based on the conditions defined in Azure Policy, select **Group Members** on the *Network Group* page under **Settings**
## Create a mesh connectivity configuration

This section will guide you through how to create a mesh configuration with the network group you created in the previous section.

1. Select **Configurations** under *Settings*, then select **+ Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-configuration.png" alt-text="Screenshot of the configurations list.":::

1. Select **Connectivity configuration** from the drop-down menu.

    :::image type="content" source="./media/create-virtual-network-manager-portal/configuration-menu.png" alt-text="Screenshot of configuration drop-down menu.":::

1. On the *Add a connectivity configuration* page, enter the following information:

    :::image type="content" source="media/how-to-create-mesh-network/add-config-name.png" alt-text="Screenshot of add a connectivity configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a *name* for this configuration. |
    | Description | *Optional* Enter a description about what this configuration will do. |

1. Select **Next: Topology >** and select **Mesh** as the topology. Then select **+ Add** under *Network groups*.

    :::image type="content" source="media/how-to-create-mesh-network/add-connectivity-config.png" alt-text="Screenshot of Add a connectivity configuration page and options.":::

1. On the *Add network groups* page, select the network groups you want to add to this configuration. Then select **Select** to save.

1. Select **Review + create** and then **Create** to create the mesh connectivity configuration.

## Deploy the mesh configuration

To have this configuration take effect in your environment, you'll need to deploy the configuration to the regions where your selected virtual networks are created.

1. Select **Deployments** under *Settings*, then select **Deploy configuration**.

1. On the *Deploy a configuration* page, select the following settings:

    :::image type="content" source="media/how-to-create-mesh-network/deploy-config.png" alt-text="Screenshot of deploy a configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select **Include connectivity configurations in your goal state**. |
    | Connectivity Configurations | Select the name of the configuration you created in the previous section. |
    | Target regions | Select all the regions where the configuration will be applied to virtual networks. |

1. Select **Next** and then select **Deploy** to commit the configuration to the selected regions.

1. The deployment of the configuration can take several minutes, select the **Refresh** button to check on the status of the deployment.

## Confirm deployment

1. See [view applied configurations](how-to-view-applied-configurations.md).

1. To test connectivity between virtual networks, deploy a test virtual machine into each virtual network and start an ICMP request between them.

## Next steps

- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).
