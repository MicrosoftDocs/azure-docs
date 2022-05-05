---
title: 'Create a hub and spoke topology with Azure Virtual Network Manager (Preview)'
description: Learn how to create a hub and spoke network topology with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 05/03/2022
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

1. Select **Network groups** under *Settings*, and then select **+ Create** to create a new network group.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-network-group.png" alt-text="Screenshot of Create a network group button.":::

1. On the *Create a network group* page, enter a **Name** and a **Description** for the network group. Then select **Add** to create the network group.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-basics.png" alt-text="Screenshot of create a network group page.":::

1. You'll see the new network group added to the *Network Groups* page.
    :::image type="content" source="./media/create-virtual-network-manager-portal/network-groups-list.png" alt-text="Screenshot of network group page with list of network groups.":::

1. From the list of network groups, select **myNetworkGroup** to manage the network group memberships.

    :::image type="content" source="media/how-to-create-mesh-network/manage-group-membership.png" alt-text="Screenshot of manage group memberships page.":::

1. To add a virtual network manually, select the **Add** button under *Static membership*, and select the virtual networks to add. Then select **Add** to save the static membership. For more information, see [static members](concept-network-groups.md#static-membership).

    :::image type="content" source="./media/how-to-create-hub-and-spoke/add-static-members.png" alt-text="Screenshot of add virtual networks to network group page.":::

1. To add virtual networks dynamically, select the **Define** button under *Define dynamic membership*, and then enter the conditional statements for membership. Select **Save** to save the dynamic membership conditions. For more information, see [dynamic membership](concept-network-groups.md#dynamic-membership).

    :::image type="content" source="media/how-to-create-mesh-network/define-dynamic-members.png" alt-text="Screenshot of Define dynamic membership page.":::
 
## Create a hub and spoke connectivity configuration

This section will guide you through how to create a hub-and-spoke configuration with the network group you created in the previous section.

1. Select **Configuration** under *Settings*, then select **+ Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-configuration.png" alt-text="Screenshot of the configurations list.":::

1. Select **Connectivity configuration** from the drop-down menu.

    :::image type="content" source="./media/create-virtual-network-manager-portal/configuration-menu.png" alt-text="Screenshot of configuration drop-down menu.":::

1. On the *Add a connectivity configuration* page, enter the following information:

    :::image type="content" source="media/how-to-create-mesh-network/add-config-name.png" alt-text="Screenshot of add a connectivity configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a *name* for this configuration. |
    | Description | *Optional* Enter a description about what this configuration will do. |

1. Select **Next: Topology >**. Select **Hub and Spoke** under the **Topology** setting. This selection will reveal more settings.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/hub-configuration.png" alt-text="Screenshot of selecting a hub for the connectivity configuration.":::

1.  Select **Select a hub** under **Hub** setting. Then, select the virtual network to serve as your network hub and click **Select**.

    :::image type="content" source="media/tutorial-create-secured-hub-and-spoke/select-hub.png" alt-text="Screenshot of Select a hub configuration.":::

1. Under **Spoke network groups**, select **+ add**. Then, select your network group and click **Select**.

    :::image type="content" source="media/how-to-create-hub-and-spoke/add-network-group.png" alt-text="Screenshot of Add network groups page.":::

1. You'll see the following three options appear next to the network group name under **Spoke network groups**:

    :::image type="content" source="./media/how-to-create-hub-and-spoke/spokes-settings.png" alt-text="Screenshot of spoke network groups settings." lightbox="./media/how-to-create-hub-and-spoke/spokes-settings-expanded.png":::

    | Setting | Value |
    | ------- | ----- |
    | Direct connectivity | Select **Enable peering within network group** if you want to establish VNet peering between virtual networks in the network group of the same region. |
    | Gateway | Select **Hub as a gateway** if you have a virtual network gateway in the hub virtual network that you want this network group to use to pass traffic to on-premises. This option won't be available unless a virtual network gateway is deployed in the hub virtual network. |
    | Global Mesh | Select **Enable mesh connectivity across regions** if you want to establish VNet peering for all virtual networks in the network group across regions. This option requires you select **Enable peering within network group** first.  |

    Select the settings you want to enable for each network group.

1. Finally, Select **Next: Review + create >** and then **Create** to create the hub-and-spoke connectivity configuration.

## Deploy the hub and spoke configuration

To have this configuration take effect in your environment, you'll need to deploy the configuration to the regions where your selected virtual networks are created.

> [!NOTE]
> Make sure the virtual network gateway has been successfully deployed before deploying the connectivity configuration. If you deploy a hub and spoke configuration with **Use the hub as a gateway** enabled and there's no gateway, the deployment will fail. For more information, see [use hub as a gateway](concept-connectivity-configuration.md#use-hub-as-a-gateway). 
>

1. Select **Deployments** under *Settings*, then select **Deploy configuration**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployments.png" alt-text="Screenshot of deployments page in Network Manager.":::


1. On the *Deploy a configuration* select the following settings:

    :::image type="content" source="./media/how-to-create-hub-and-spoke/deploy.png" alt-text="Screenshot of deploy a configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select elect **Include connectivity configurations in your goal state**. This will reveal more options. |
    | Connectivity Configurations | Select the name of the connectivity configuration you created in the previous section. |
    | Target regions | Select all the regions that include virtual networks you need configuration applied to. |

1. Select **Deploy**. You'll see the deployment shows up in the list for those regions. The deployment of the configuration can take several minutes to complete. You can select the **Refresh** button to check on the status of the deployment.

    :::image type="content" source="./media/how-to-create-hub-and-spoke/deploy-status.png" alt-text="Screenshot of deployment status screen." lightbox="./media/how-to-create-hub-and-spoke/deploy-status-expanded.png":::

## Confirm deployment

1. Go to one of the virtual networks in the portal and select **Peerings** under *Settings*. You should see a new peering connection created between the hub and the spokes virtual network with *ANM* in the name.

1. To test *direct connectivity* between spokes, deploy a virtual machine into each spokes virtual network. Then initiate an ICMP request from one virtual machine to the other.

1. See [view applied configuration](how-to-view-applied-configurations.md).

## Next steps

- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).
