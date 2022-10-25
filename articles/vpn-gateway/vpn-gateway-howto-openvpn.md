---
title: 'How to enable OpenVPN for P2S VPN gateways'
titleSuffix: Azure VPN Gateway
description: Learn how to enable OpenVPN Protocol on VPN gateways for point-to-site configurations.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 05/16/2022
ms.author: cherylmc

---
# Configure OpenVPN for Point-to-Site VPN gateways

This article helps you set up **OpenVPN® Protocol** on Azure VPN Gateway. This article contains both Azure portal and PowerShell instructions.

## Prerequisites

* The article steps assume that you already have a working point-to-site environment. If you don't, you can create one using one of the following methods. When you create your gateway, don't use the Basic SKU. The Basic SKU doesn't support the OpenVPN tunnel type.

  * [Portal - Create point-to-site](vpn-gateway-howto-point-to-site-resource-manager-portal.md)

  * [PowerShell - Create point-to-site](vpn-gateway-howto-point-to-site-rm-ps.md)

* If you already have a VPN gateway, verify that it doesn't use the Basic SKU. The Basic SKU isn't supported for OpenVPN. For more information about SKUs, see [VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md). To resize a Basic SKU, see [Resize a legacy gateway](vpn-gateway-about-skus-legacy.md#resource-manager).

## Portal

1. In the portal, navigate to your **Virtual network gateway -> Point-to-site configuration**.
1. For **Tunnel type**, select **OpenVPN (SSL)** from the dropdown.

   :::image type="content" source="./media/vpn-gateway-howto-openvpn/portal.png" alt-text="Select OpenVPN SSL from the dropdown":::
1. Save your changes and continue with **Next steps**.

## PowerShell

1. Enable OpenVPN on your gateway using the following example, adjusting the values as necessary.

   ```azurepowershell-interactive
   $gw = Get-AzVirtualNetworkGateway -ResourceGroupName TestRG1 -name VNet1GW
   Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -VpnClientProtocol OpenVPN
   ```
1. Continue with **Next steps**.

## Next steps

To configure clients for OpenVPN, see Configure OpenVPN clients for [Windows](point-to-site-vpn-client-cert-windows.md), [macOS and IOS](point-to-site-vpn-client-cert-mac.md), and [Linux](point-to-site-vpn-client-cert-linux.md).

**"OpenVPN" is a trademark of OpenVPN Inc.**
