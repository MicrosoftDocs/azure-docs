---
title: 'Delete a virtual network gateway: Azure portal: Resource Manager | Microsoft Docs'
description: Delete a virtual network gateway using the Azure portal in the Resource Manager deployment model.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: vpn-gateway
ms.devlang: na
ms.topic: 
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/20/2017
ms.author: cherylmc

---
# Delete a virtual network gateway using the portal
> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-delete-vnet-gateway-portal.md)
> * [PowerShell](vpn-gateway-delete-vnet-gateway-powershell.md)
> * [PowerShell (classic)](vpn-gateway-delete-vnet-gateway-classic-powershell.md)
>
>

There are a couple of different approaches you can take when you want to delete a virtual network gateway for a VPN gateway configuration.

- If you want to delete everything and start over, as in the case of a test environment, you can delete the resource group. When you delete a resource group, it deletes all the resources within the group. This is method is only recommended if you don't want to keep any of the resources in the resource group. You can't selectively delete only a few resources using this approach.

- If you want to keep some of the resources in your resource group, deleting a virtual network gateway becomes slightly more complicated. Before you can delete the virtual network gateway, you must first delete any resources that are dependent on the gateway. The steps you follow depend on the type of connections that you created and the dependent resources for each connection.

## <a name="deletegw"></a>Delete a VPN gateway

To delete a virtual network gateway, you must first delete each resource that pertains to the virtual network gateway. Resources must be deleted in a certain order due to dependencies.

### Step 1: Navigate to the virtual network gateway

1. In the [Azure portal](https://portal.azure.com), navigate to **All resources**. 
2. Click the virtual network gateway that you want to delete.

  The graphic for a virtual network gateway is:

  ![Locate virtual network gateway](./media/vpn-gateway-delete-vnet-gateway-portal/gw.png)

### Step 2: Delete connections

1. On the blade for your virtual network gateway, click **Connections** to view all connections to the gateway.
2. Click the **'...'** on the row of the name of the connection, then select **Delete** from the dropdown.
3. Click **Yes** to confirm that you want to delete the connection. If you have multiple connections, delete each connection.

### Step 3: Delete the virtual network gateway

1. In **All resources**, locate the virtual network gateway that you want to delete.
2. On the **Overview** blade, click **Delete** to delete the gateway.

>[!NOTE]
> If you have a P2S configuration to this VNet in addition to your S2S configuration, deleting the virtual network gateway will automatically disconnect all P2S clients without warning.
>

At this point, the virtual network gateway is deleted. The next steps help you delete any resources that are no longer being used.

### To delete the local network gateway

1. In **All resources**, locate the local network gateways that were associated with each connection.

  The graphic for a local network gateway is:

  ![Locate local network gateway](./media/vpn-gateway-delete-vnet-gateway-portal/lng.png)
2. On the **Overview** blade for the local network gateway, click **Delete**.

### To delete the Public IP address resource for the gateway

1. In **All resources**, locate the Public IP address resource that was associated to the gateway. If the virtual network gateway was active-active, you will see two Public IP addresses. 

  The graphic for a Public IP address is:

  ![Public IP address](./media/vpn-gateway-delete-vnet-gateway-portal/pip.png)

2. On the **Overview** page for the Public IP address, click **Delete**, then **Yes** to confirm.

### To delete the gateway subnet

1. In **All resources**, locate the virtual network. 
2. On the **Subnets** blade, click the **GatewaySubnet**, then click **Delete**. 
3. Click **Yes** to confirm that you want to delete the gateway subnet.

## <a name="deleterg"></a>Delete a VPN gateway by deleting the resource group

If you are not concerned about keeping any of your resources in the resource group and you just want to start over, you can delete an entire resource group. This is a quick way to remove everything. The following steps apply only to the Resource Manager deployment model.

1. In **All resources**, locate the resource group and click to open the blade.
2. Click **Delete**. On the Delete blade, view the affected resources. Make sure that you want to delete all of these resources. If not, use the steps in [Delete a VPN gateway](#deletegw) at the top of this article.
3. To proceed, type the name of the resource group that you want to delete, then click **Delete**.