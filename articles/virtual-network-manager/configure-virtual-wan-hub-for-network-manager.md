---
title: Configure Virtual WAN Hub for Azure Virtual Network Manager
description: "Configure hub-and-spoke with Virtual WAN: Step-by-step instructions to specify a Virtual WAN hub as the hub in your Azure Virtual Network Manager topology."
#customer intent: As a network admin, I want to specify a Virtual WAN hub as the central hub in a hub-and-spoke topology so that I can centralize connectivity for my virtual networks.
author: mbender-ms
ms.author: mbender
ms.reviewer: mbender
ms.date: 05/15/2026
ms.topic: article
ms.service: azure-virtual-network-manager
---
# Configure Azure Virtual WAN hub for Azure Virtual Network Manager

In this article, you learn how to specify an Azure Virtual WAN hub as the central hub in an Azure Virtual Network Manager (Azure Virtual Network Manager) hub-and-spoke connectivity configuration.

In environments that use Azure Virtual WAN, the central network transit point is a Virtual WAN hub rather than a hub virtual network. Azure Virtual Network Manager lets you use that existing Virtual WAN hub as the connectivity target for spoke virtual networks that belong to your network groups — so you can centralize and manage connectivity without duplicating your network infrastructure.

For more information, see [**Virtual WAN and Virtual Network manager use cases**](../virtual-wan/virtual-network-manager-integration.md#use-cases) and [**known issues and limitations**](../virtual-wan/virtual-network-manager-integration.md#known-issues).

[!INCLUDE [virtual-network-manager-virtual-wan-hub-preview-includes](../networking/includes/azure-virtual-network-manager/virtual-network-manager-virtual-wan-hub-preview-includes.md)]

## Prerequisites

Before you begin, make sure you have:

- An existing Azure Virtual Network Manager instance
- An existing Azure Virtual WAN and Virtual WAN hub
- One or more virtual networks to add as spoke members in your hub-and-spoke configuration

## Configuration steps

### Create a network group

Azure Virtual Network Manager provides two methods for adding membership to a network group:[static membership](concept-network-groups.md#static-membership) and [dynamic membership](concept-network-groups.md#dynamic-membership) with Azure Policy. Use network managers to manage connectivity to Virtual WAN for network group members.

### Manually add virtual networks

To manually add the desired virtual networks to your network group for use in your connectivity configuration, follow these steps:

1.  From the list of network groups, select your network group and select **Add virtual networks** under *Manually add members* on the network group page.

1.  On the *Manually add members* pane, select all desired virtual networks and select **Add**.

1.  To review the network group membership that you manually added, select **Group Members** on the *Network Group* page under **Settings**.

### Create connectivity configuration

This section guides you through creating a hub-and-spoke configuration with the network group you created in the previous section.

1.  Select **Configurations** under **Settings**, and then select **+ Create**.

1.  Select **Connectivity configuration** from the drop-down menu to begin creating a connectivity configuration.

1.  On the **Basics** page, enter the following information:
    | **Setting** | **Value** |
    | ------- | ----- |
    | **Name** | Enter a *name* for this configuration. |
    | **Network Group** | Select the network group you created in the previous section. The network group connects to Virtual WAN. |
    | **Direct connectivity within network group** | Enable if traffic between virtual networks in the network group should be routed directly, bypassing the Virtual WAN hub router. |

1.  Select **Connect network group to a hub**, and then select hub type **Virtual WAN Hub**.

1.  Select a **Virtual WAN hub** and then a *connection policy*. You can use an existing connection policy created under the selected Virtual WAN hub or create a new connection policy.

1.  Select **Next** to go to advanced. Virtual WAN hubs currently **don’t** support high-scale private endpoints. For more information about the maximum number of private endpoints supported by a Virtual WAN hub, see [private link with Virtual WAN](/azure/virtual-wan/howto-private-link).

1.  Select **Next** to go **review and create**. Select **create** to finalize your selections.

### Deploy the hub and spoke configuration

To have this configuration take effect in your environment, deploy the configuration to the regions in which your selected virtual networks reside.

1.  Select **Deployments** under *Settings*, and then select **Deploy a configuration**.

1.  On the **Deploy a configuration** page, select the following settings:

    | **Setting** | **Value** |
    |----|----|
    | **Configurations** | Select **Include connectivity configurations in your goal state**. |
    | **Connectivity configurations** | Select the name of the configuration you created in the previous section. |
    | **Target regions** | Select all the regions that apply to virtual networks you select for the configuration. To gradually roll out this configuration, select a subset of regions. |

1.  Select **Next** and then select **Deploy** to complete the deployment.

### Modify Virtual WAN routing properties

Use Virtual Network Manager to change the connection policy that governs the Virtual WAN routing behavior of network group members.

1.  Select **Configurations** under **Settings**.

1.  Select the connectivity configuration you want to modify.

1.  Under **Essentials** -> **Virtual WAN connection policy**, select **Edit** to create a new connection policy or switch to a different connection policy associated to the same Virtual Hub.

1.  Re-deploy the configuration to apply the new connection policy to the network group members.

### Move a network group from one Virtual WAN hub to another

> [!NOTE] 
>Moving a network group from one Virtual WAN hub to another is a disruptive operation. All virtual networks that are members of the network group disconnect from the old Virtual WAN hub and reconnect to the new Virtual WAN hub. Plan for this operation and schedule it during a maintenance window.

Use Virtual Network Manager to change the connection policy that governs the Virtual WAN routing behavior of network group members.

1.  Select **Configurations** under **Settings**.

1.  Select the connectivity configuration you want to modify.

1.  Under **Essentials** -> **Hub**, select **Edit** to select a new Virtual WAN hub. Create a new connection policy or assign an existing connection policy associated to the new Virtual WAN hub.

1.  Re-deploy the configuration to migrate the network group members to the new Virtual WAN hub and apply the new connection policy.

### Confirm configuration deployment

Go to your Virtual WAN to check whether network group members are connected to the correct Virtual WAN hub.

## Next steps

- [Common uses cases for Azure Virtual Network Manager](concept-use-cases.md)