---
title: 'Advertise custom routes for point-to-site VPN Gateway clients'
titleSuffix: Azure VPN Gateway
description: Learn how to advertise custom routes to your VPN Gateway point-to-site clients. This article includes steps for VPN client forced tunneling.
author: cherylmc
ms.service: vpn-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cherylmc
---

# Advertise custom routes for P2S VPN clients

You may want to advertise custom routes to all of your point-to-site VPN clients. For example, when you have enabled storage endpoints in your VNet and want the remote users to be able to access these storage accounts over the VPN connection. You can advertise the IP address of the storage end point to all your remote users so that the traffic to the storage account goes over the VPN tunnel, and not the public Internet. You can also use custom routes in order to configure [forced tunneling](#forced-tunneling) for VPN clients.

:::image type="content" source="./media/vpn-gateway-p2s-advertise-custom-routes/custom-routes.png" alt-text="Diagram of advertising custom routes.":::

## <a name="portal"></a>Azure portal

You can advertise custom routes using the Azure portal on the point-to-site configuration page. You can also view and modify/delete custom routes as needed using these steps. If you want to configure forced tunneling, see the [Forced tunneling](#forced-tunneling) section in this article.

:::image type="content" source="./media/vpn-gateway-p2s-advertise-custom-routes/additional-routes.png" alt-text="Screenshot showing additional routes in the portal." lightbox= "./media/vpn-gateway-p2s-advertise-custom-routes/additional-routes.png":::

1. Go to the virtual network gateway.
1. Select **Point-to-site configuration** in the left pane.
1. On the Point-to-site configuration page, add the routes. Don't use any spaces.
1. Select **Save** at the top of the page.

## <a name="powershell"></a>PowerShell

To advertise custom routes, use the `Set-AzVirtualNetworkGateway cmdlet`. The following example shows you how to advertise the IP for the [Contoso storage account tables](https://contoso.table.core.windows.net).

1. Ping *contoso.table.core.windows.net* and note the IP address. For example:

    ```cmd
    C:\>ping contoso.table.core.windows.net
    Pinging table.by4prdstr05a.store.core.windows.net [13.88.144.250] with 32 bytes of data:
    ```

1. Run the following PowerShell commands:

    ```azurepowershell-interactive
    $gw = Get-AzVirtualNetworkGateway -Name <name of gateway> -ResourceGroupName <name of resource group>
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -CustomRoute 13.88.144.250/32
    ```

1. To add multiple custom routes, use a comma and spaces to separate the addresses. For example:

    ```azurepowershell-interactive
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -CustomRoute x.x.x.x/xx , y.y.y.y/yy
    ```

### <a name="view"></a>View custom routes

Use the following example to view custom routes:

  ```azurepowershell-interactive
  $gw = Get-AzVirtualNetworkGateway -Name <name of gateway> -ResourceGroupName <name of resource group>
  $gw.CustomRoutes | Format-List
  ```

### <a name="delete"></a>Delete custom routes

Use the following example to delete custom routes:

  ```azurepowershell-interactive
  $gw = Get-AzVirtualNetworkGateway -Name <name of gateway> -ResourceGroupName <name of resource group>
  Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -CustomRoute @0
  ```

## <a name="forced-tunneling"></a>Forced tunneling

You can direct all traffic to the VPN tunnel by advertising 0.0.0.0/1 and 128.0.0.0/1 as custom routes to the clients. The reason for breaking 0.0.0.0/0 into two smaller subnets is that these smaller prefixes are more specific than the default route that may already be configured on the local network adapter and, as such, will be preferred when routing traffic.

> [!NOTE]
> Internet connectivity is not provided through the VPN gateway. As a result, all traffic bound for the Internet is dropped.
>

To enable forced tunneling, use the following commands:

```azurepowershell-interactive
$gw = Get-AzVirtualNetworkGateway -Name <name of gateway> -ResourceGroupName <name of resource group>
Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -CustomRoute 0.0.0.0/1 , 128.0.0.0/1
```

## Next steps

For more P2S routing information, see [About point-to-site routing](vpn-gateway-about-point-to-site-routing.md).
