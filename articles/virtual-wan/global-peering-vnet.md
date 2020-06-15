---
title: 'Configure Global VNet peering for Azure Virtual WAN | Microsoft Docs'
description: Connect a VNet in a different region to your Virtual WAN hub.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 11/04/2019
ms.author: cherylmc

---

# Configure Global VNet peering (cross-region VNet) for Virtual WAN

You can connect a VNet in a different region to your Virtual WAN hub.

## Before you begin

Verify that you have met the following criteria:

* The cross-region VNet (spoke) is not connected to another Virtual WAN hub. A spoke can only be connected to one virtual hub.
* The VNet (spoke) does not contain a virtual network gateway (for example, an Azure VPN Gateway or ExpressRoute virtual network gateway). If the VNet contains a virtual network gateway, you must remove the gateway before connecting the spoke VNet to the hub.

## <a name="register"></a>Register this feature

You can register for this feature using PowerShell. If you select "Try It" from the example below, Azure Cloud-Shell opens and you won't need to install the PowerShell cmdlets locally to your computer. If necessary, you can change subscriptions using the 'Select-AzSubscription -SubscriptionId <subid>' cmdlet.

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName AllowCortexGlobalVnetPeering -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace 'Microsoft.Network'
```

## <a name="verify"></a>Verify registration

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName AllowCortexGlobalVnetPeering -ProviderNamespace Microsoft.Network
```

## <a name="hub"></a>Connect a VNet to the hub

In this step, you create the peering connection between your hub and the cross-region VNet. Repeat these steps for each VNet that you want to connect.

1. On the page for your virtual WAN, click **Virtual network connections**.
2. On the virtual network connection page, click **+Add connection**.
3. On the **Add connection** page, fill in the following fields:

    * **Connection name** - Name your connection.
    * **Hubs** - Select the hub you want to associate with this connection.
    * **Subscription** - Verify the subscription.
    * **Virtual network** - Select the virtual network you want to connect to this hub. The virtual network cannot have an already existing virtual network gateway.
4. Click **OK** to create the peering connection.

## Next steps

To learn more about Virtual WAN, see [Virtual WAN Overview](virtual-wan-about.md).