---
title: 'How to configure OpenVPN for Azure VPN Gateway'
description: Learn how to enable OpenVPN Protocol on Azure VPN Gateway for a point-to-site environment.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 02/05/2021
ms.author: cherylmc

---
# Configure OpenVPN for Point-to-Site VPN gateways

This article helps you set up **OpenVPN® Protocol** on Azure VPN Gateway. You can use either the portal, or the PowerShell instructions.

## Prerequisites

* The article assumes that you already have a working point-to-site environment. If you don't, create one using one of the following methods.

  * [Portal - Create point-to-site](vpn-gateway-howto-point-to-site-resource-manager-portal.md)

  * [PowerShell - Create point-to-site](vpn-gateway-howto-point-to-site-rm-ps.md)

* Verify that your VPN gateway does not use the Basic SKU. The Basic SKU is not supported for OpenVPN.

## Portal

1. In the portal, navigate to your **Virtual network gateway -> Point-to-site configuration**.
1. For **Tunnel type**, select **OpenVPN (SSL)** from the dropdown.

   :::image type="content" source="./media/vpn-gateway-howto-openvpn/portal.png" alt-text="Select OpenVPN SSL from the dropdown":::
1. Save your changes and continue with **Next steps**.

## PowerShell

1. Enable OpenVPN on your gateway using the following example:

   ```azurepowershell-interactive
   $gw = Get-AzVirtualNetworkGateway -ResourceGroupName $rgname -name $name
   Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -VpnClientProtocol OpenVPN
   ```
1. Continue with **Next steps**.

## Next steps

To configure clients for OpenVPN, see [Configure OpenVPN clients](vpn-gateway-howto-openvpn-clients.md).

**"OpenVPN" is a trademark of OpenVPN Inc.**
