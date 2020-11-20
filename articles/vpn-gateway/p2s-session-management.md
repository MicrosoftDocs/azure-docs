---
title: 'Azure VPN Gateway: Point-to-site VPN session management'
description: This article helps you view and disconnect Point-to-site VPN sessions.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 09/23/2020
ms.author: cherylmc

---

# Point-to-site VPN session management

Azure virtual network gateways provide an easy way to view and disconnect current Point-to-site VPN sessions. This article helps you view and disconnect current sessions.

>[!NOTE]
>The session status is updated every 5 minutes. It is not updated immediately.
>

## Portal

To view and disconnect a session in the portal:

1. Navigate to the VPN gateway.
1. Under the **Monitoring** section, select **Point-to-site Sessions**.

   :::image type="content" source="./media/p2s-session-management/portal.png" alt-text="Portal example":::
1. You can view all current sessions in the windowpane.
1. Select **"…"** for the session you want to disconnect, then select **Disconnect**.

## PowerShell

To view and disconnect a session using PowerShell:

1. Run the following PowerShell command to list active sessions:

   ```azurepowershell-interactive
   Get-AzVirtualNetworkGatewayVpnClientConnectionHealth -VirtualNetworkGatewayName <name of the gateway>  -ResourceGroupName <name of the resource group>
   ```
1. Copy the **VpnConnectionId** of the session that you want to disconnect.

   :::image type="content" source="./media/p2s-session-management/powershell.png" alt-text="PowerShell example":::
1. To disconnect the session, run the following command:

   ```azurepowershell-interactive
   Disconnect-AzVirtualNetworkGatewayVpnConnection -VirtualNetworkGatewayName <name of the gateway> -ResourceGroupName <name of the resource group> -VpnConnectionId <VpnConnectionId of the session>
   ```

## Next steps

For more information about Point-to-site connections, see [About Point-to-site VPN](point-to-site-about.md).
