---
title: 'Remove a VNet Connection to a Virtual WAN hub - portal'
titleSuffix: Azure Virtual WAN
description: Learn how to remove a Virtual Network Connection to a Virtual WAN hub using the portal.
author: flapinski
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/20/2026
ms.author: flapinski

---
# Remove a virtual network connection from a Virtual WAN hub - portal

This article helps you disconnect your virtual network from your virtual hub using the Azure portal. In this example, we remove the WUS2-VNet connection from the WestUS2-Hub Virtual WAN hub. Repeat these steps for each VNet connection that you want to remove.

:::image type="content" source="./media/howto-remove-virtual-network-connection/vwan-delete-overview.png" alt-text="Diagram that shows architecture of example Virtual WAN." lightbox="./media/howto-remove-virtual-network-connection/vwan-delete-overview.png":::

Before you remove a connection, be aware of the following considerations:

* Removing a virtual network connection doesn't delete the Virtual Network resource itself.
* If you want to completely remove the virtual network from your subscription, you must separately delete the Virtual Network resource after removing the connection.
* Removing the connection terminates any traffic flowing between the Virtual Network and the Virtual WAN hub.
* This method is for VNet connections in the same tenant as the Virtual WAN. Review the documentation for [cross-tenant VNet connections](cross-tenant-vnet.md) for more information on cross-tenant VNet Connections.

> [!IMPORTANT]
> Ensure that no critical workloads depend on this connection before proceeding with removal.
> Delete the Virtual Network Connection via the Virtual WAN portal experience. Deleting via the Virtual Network portal experience may not remove the connection from the Virtual WAN portal and can cause issues with the Virtual WAN hub.

## Remove a connection
1. Navigate to your Virtual WAN resource in the Azure portal.
2. Under **Connectivity**, select **Virtual network connections**.
3. In the list of connections, locate **WUS2-VNet-Connection** connected to the **WestUS2-Hub**.
:::image type="content" source="./media/howto-remove-virtual-network-connection/portal-vnet-conn-overview-delete-vnet-conn.png" alt-text="Diagram that shows an overview of the Virtual WAN VNet Connections." lightbox="./media/howto-remove-virtual-network-connection/portal-vnet-conn-overview-delete-vnet-conn.png":::
4. Select the drop-down next to **Virtual networks** for the Hub you wan to delete the connection for. Select the **"..."** menu for the connection you want to remove and select **"Delete virtual network connection"**.
6. In the confirmation dialog, write **yes** to remove the virtual network connection from the Virtual WAN hub.

Once removed, the West-US2-VNet will no longer be connected to the WestUS2 hub.

## Verify the removal
You can verify the connection is removed by checking:
1. The list of Virtual Network connections under the Virtual WAN resource. The WUS2-VNet-Connection should no longer be listed. 
2. The **Activity Log** to ensure the connection was successfully deleted. Look for a **"Deletes a HubVirtualNetworkConnection"** event with a status of **"Succeeded"** for the specific connection you removed.
3. The Virtual Network Peerings for the WUS2-VNet. The peering to the Virtual WAN hub should be removed. </br></br>If the connection still exists, the Virtual WAN Hub Peering will have "RemoteVnetToHubPeering" in the **Name** and the name of the Virtual WAN Hub as part of the **Remote virtual network name**.


> [!NOTE]
>
> * To fully clean up resources, you must delete both the virtual network connection and the Virtual Network resource separately.

## Next steps

For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).

