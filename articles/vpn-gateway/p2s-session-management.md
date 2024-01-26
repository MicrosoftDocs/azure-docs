---
title: 'Point-to-site VPN session management'
titleSuffix: Azure VPN Gateway
description: Learn how to view and disconnect Point-to-Site VPN sessions.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 11/27/2023
ms.author: cherylmc

---

# Point-to-site VPN session management

VPN Gateway provides an easy way to view and disconnect current point-to-site VPN sessions. This article helps you view and disconnect current sessions. The session status is updated every 5 minutes. It isn't updated immediately.

Because this feature allows the disconnection of VPN clients, Reader permissions on the VPN gateway resource aren't sufficient. The Contributor role is needed to visualize point-to-site VPN sessions correctly.

## Portal

> [!NOTE]
> Connection source info is provided for IKEv2 and OpenVPN connections only.
>

To view and disconnect a session in the portal:

1. Navigate to the VPN gateway.
1. Under the **Monitoring** section, select **Point-to-site Sessions**.

   :::image type="content" source="./media/p2s-session-management/portal.png" alt-text="Portal example":::
1. You can view all current sessions in the windowpane.
1. Select **"…"** for the session you want to disconnect, then select **Disconnect**.

Currently, you can't use this feature in the portal for VpnGw4 and VpnGw5 SKUs. If you have one of these gateways, use the PowerShell method that's described in the next section.

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

For more information about point-to-site connections, see [About Point-to-site VPN](point-to-site-about.md).
