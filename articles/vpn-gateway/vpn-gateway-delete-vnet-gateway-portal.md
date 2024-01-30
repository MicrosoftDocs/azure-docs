---
title: 'Delete a virtual network gateway: portal'
titleSuffix: Azure VPN Gateway
description: Learn how to delete a virtual network gateway using the Azure portal.
author: cherylmc
ms.service: vpn-gateway
ms.date: 08/22/2023
ms.author: cherylmc
ms.topic: how-to
---
# Delete a virtual network gateway using the portal

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-delete-vnet-gateway-portal.md)
> * [PowerShell](vpn-gateway-delete-vnet-gateway-powershell.md)
> * [PowerShell (classic - legacy gateways)](vpn-gateway-delete-vnet-gateway-classic-powershell.md)

This article helps you delete a virtual network gateway. There are a couple of different approaches you can take when you want to delete a gateway for a VPN gateway configuration.

* If you want to delete everything and start over, as in the case of a test environment, you can delete the resource group. When you delete a resource group, it deletes all the resources within the group. This method is only recommended if you don't want to keep any of the resources in the resource group. You can't selectively delete only a few resources using this approach.

* If you want to keep some of the resources in your resource group, deleting a virtual network gateway becomes slightly more complicated. Before you can delete the virtual network gateway, you must first delete any resources that are dependent on the gateway. The steps you follow depend on the type of connections that you created and the dependent resources for each connection.

> [!IMPORTANT]
> The steps in this article apply to the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md). To delete a VPN gateway deployed using the classic deployment model, use the steps in the [Delete a gateway: classic](vpn-gateway-delete-vnet-gateway-classic-powershell.md) article.

## Delete a VPN gateway

To delete a virtual network gateway, you must first delete each resource that pertains to the virtual network gateway. Resources must be deleted in a certain order due to dependencies.

[!INCLUDE [delete gateway](../../includes/vpn-gateway-delete-vnet-gateway-portal-include.md)]

At this point, the virtual network gateway is deleted.

### To delete additional resources

The following steps help you delete any resources that are no longer being used.

#### To delete the local network gateway

1. In **All resources**, locate local network gateways that were associated with each connection.
1. On the **Overview** blade for the local network gateway, click **Delete**.

#### To delete the Public IP address resource for the gateway

1. In **All resources**, locate the Public IP address resource that was associated to the gateway. If the virtual network gateway was active-active, you'll see two Public IP addresses.
1. On the **Overview** page for the Public IP address, click **Delete**, then **Yes** to confirm.

#### To delete the gateway subnet

1. In **All resources**, locate the virtual network. 
1. On the **Subnets** blade, click the **GatewaySubnet**, then click **Delete**. 
1. Click **Yes** to confirm that you want to delete the gateway subnet.

## <a name="deleterg"></a>Delete a VPN gateway by deleting the resource group

If you aren't concerned about keeping any of your resources in the resource group and you just want to start over, you can delete an entire resource group. This is a quick way to remove everything. The following steps apply only to the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md).

1. In **All resources**, locate the resource group and click to open the blade.
1. Click **Delete**. On the Delete blade, view the affected resources. Make sure that you want to delete all of these resources. If not, use the steps in Delete a VPN gateway at the top of this article.
1. To proceed, type the name of the resource group that you want to delete, then click **Delete**.

## Next steps

For FAQ information, see the [Azure VPN Gateway FAQ](vpn-gateway-vpn-faq.md).
