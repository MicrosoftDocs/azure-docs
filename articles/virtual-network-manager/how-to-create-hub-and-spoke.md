---
title: 'Create a hub and spoke topology with Azure Virtual Network Manager (Preview)'
description: Learn how to create a hub and spoke network topology with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: template-concept, ignite-fall-2021
---

# Create a hub and spoke topology with Azure Virtual Network Manager (Preview)

In this article, you'll learn how to create a hub and spoke network topology with Azure Virtual Network Manager. With this configuration, you select a virtual network to act as a hub and all spoke virtual networks will have bi-directional peering with only the hub by default. You also can enable direct connectivity between spoke virtual networks and enable the spoke virtual networks to use the virtual network gateway in the hub.

> [!IMPORTANT]
> *Azure Virtual Network Manager* is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* Read about [Hub-and-spoke](concept-connectivity-configuration.md#hub-and-spoke-topology) network topology.
* Created a [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md#create-virtual-network-manager).
* Identify virtual networks you want to use in the hub-and-spokes configuration or create new [virtual networks](../virtual-network/quick-create-portal.md). 

## <a name="group"></a> Create a network group

This section will help you create a network group containing the virtual networks you'll be using for the hub-and-spoke network topology.

1. Go to your Azure Virtual Network Manager instance. This how-to guide assumes you've created one using the [quickstart](create-virtual-network-manager-portal.md) guide.

1. Select **Network Groups** under *Settings*, then select **+ Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-network-group-2.png" alt-text="Screenshot of add a network group button.":::

1. On the *Create a network group* page, enter a **Name** for the network group. This example will use the name **myNetworkGroup**. Select **Add** to create the network group.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-basics.png" alt-text="Screenshot of create a network group page.":::

1. You'll see the new network group added to the *Network Groups* page.
    :::image type="content" source="./media/create-virtual-network-manager-portal/network-groups-list.png" alt-text="Screenshot of network group page with list of network groups.":::

1. Once your network group is created, you'll add virtual networks as members. Choose one of the options: *Static membership* or *Dynamic membership* with Azure Policy.
## Define membership for a mesh configuration
Azure Virtual Network manager allows you two methods for adding membership to a network group. Static membership involves manually adding virtual networks, and dynamic membership involves using Azure Policy to dynamically add virtual networks based on conditions. Choose the option below for your mesh membership configuration:
### Static membership option
Using static membership, you'll manually add the virtual networks for your Mesh configuration to your Network Group using the steps below:

1. From the list of network groups, select your network group and select **Add virtual networks** under *Static membership* on the network group page.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-static-member.png" alt-text="Screenshot of add a virtual network.":::

1. On the *Add static members* page, select all the virtual networks created you. Then select **Add** to add the 3 virtual networks to the network group.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-virtual-networks.png" alt-text="Screenshot of add virtual networks to network group page.":::

1. On the **Network Group** page under *Settings*, select **Group Members** to view the membership of the group you manually selected.
    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list-thumb.png" alt-text="Screenshot of group membership under Group Membership." lightbox="media/create-virtual-network-manager-portal/group-members-list.png":::

### Dynamic membership with Azure Policy
Using [Azure Policy](concept-azure-policy-integration.md), you'll define a condition to dynamically add three VNets for your Mesh configuration to your Network Group using the steps below.

1. From the list of network groups, select **myNetworkGroup**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-page.png" alt-text="Screenshot of the network groups page.":::

1. On the **Overview** page, select **Create Azure Policy** under *Create policy to dynamically add members*.

    :::image type="content" source="media/create-virtual-network-manager-portal/define-dynamic-membership.png" alt-text="Screenshot of Create Azure Policy button.":::

1. On the **Create Azure Policy** page, select or enter the following information:

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-conditional.png" alt-text="Screenshot of create a network group conditional statements tab.":::

    | Setting | Value |
    | ------- | ----- |
    | Policy name | Enter **ProdVNets** in the text box. |
    | Scope | Select **Select Scopes** and choose your current subscription. |
    | Criteria |  |
    | Parameter | Select **Tags** from the drop-down.|
    | Operator | Select **Exists** from the drop-down.| 
    | Condition | Enter **NetworkType** to dynamically add the three previously created virtual networks into this network group. |

1. Select **Advanced (JSON) editor** to modify the JSON code.
1. On line 5, replace **exists** with **equals** and set the value to **"Prod"** from **true**.
1. 
    :::image type="content" source="./media/create-virtual-network-manager-portal/json-advanced-editor.png" alt-text="Screenshot of Advanced (JSON) editor.":::

1. Select **Save** to deploy the group membership.

1. On the *Network Group* page under **Settings**, select **Group Members** to view the membership of the group based on the conditions defined in Azure Policy.

    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list-thumb.png" alt-text="Screenshot of group membership under Group Membership." lightbox="media/create-virtual-network-manager-portal/group-members-list.png":::
## Create a hub and spoke connectivity configuration

This section will guide you through how to create a hub-and-spoke configuration with the network group you created in the previous section.

1. Select **Configuration** under *Settings*, then select **+ Add a configuration**.

    :::image type="content" source="./media/how-to-create-hub-and-spoke/configuration-list.png" alt-text="Screenshot of the configurations list.":::

1. Select **Connectivity** from the drop-down menu.

    :::image type="content" source="./media/create-virtual-network-manager-portal/configuration-menu.png" alt-text="Screenshot of configuration drop-down menu.":::

1. On the *Add a connectivity configuration* page, enter, or select the following information:

    :::image type="content" source="./media/how-to-create-hub-and-spoke/connectivity-configuration.png" alt-text="Screenshot of add a connectivity configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a *name* for this configuration. |
    | Description | *Optional* Enter a description about what this configuration will do. |
    | Topology | Select the **Hub and spoke** topology. |
    | Hub | Select a virtual network that will act as the hub virtual network. |
    | Existing peerings | Select this checkbox if you want to remove all previously created VNet peering between virtual networks in the network group defined in this configuration. |

1. Then select **+ Add network groups**. 

1. On the *Add network groups* page, select the network groups you want to add to this configuration. Then select **Add** to save.

1. You'll see the following three options appear next to the network group name under *Spoke network groups*:
    
    :::image type="content" source="./media/how-to-create-hub-and-spoke/spokes-settings.png" alt-text="Screenshot of spoke network groups settings." lightbox="./media/how-to-create-hub-and-spoke/spokes-settings-expanded.png":::

    * *Direct connectivity*: Select **Enable peering within network group** if you want to establish VNet peering between virtual networks in the network group of the same region.
    * *Global Mesh*: Select **Enable mesh connectivity across regions** if you want to establish VNet peering for all virtual networks in the network group across regions.
    * *Gateway*: Select **Use hub as a gateway** if you have a virtual network gateway in the hub virtual network that you want this network group to use to pass traffic to on-premises.

    Select the settings you want to enable for each network group.

1. Finally, select **Add** to create the hub-and-spoke connectivity configuration.

## Deploy the hub and spoke configuration

To have this configuration take effect in your environment, you'll need to deploy the configuration to the regions where your selected virtual network are created.

1. Select **Deployments** under *Settings*, then select **Deploy a configuration**.

1. On the *Deploy a configuration* select the following settings:

    :::image type="content" source="./media/how-to-create-hub-and-spoke/deploy.png" alt-text="Screenshot of deploy a configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Configuration type | Select **Connectivity**. |
    | Configurations | Select the name of the configuration you created in the previous section. |
    | Target regions | Select all the regions that apply to virtual networks you select for the configuration. |

1. Select **Deploy** and then select **OK** to commit the configuration to the selected regions.

1. The deployment of the configuration can take up to 15-20 minutes, select the **Refresh** button to check on the status of the deployment.

## Confirm deployment

1. See [view applied configuration](how-to-view-applied-configurations.md).

1. To test *direct connectivity* between spokes, deploy a virtual machine into each spokes virtual network. Then initiate an ICMP request from one virtual machine to the other.

## Next steps

- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).
