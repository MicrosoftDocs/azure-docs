---
title: 'Configure an Always-On VPN tunnel'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Always On VPN device tunnel for Virtual WAN.
services: virtual-wan
author: cherylmc

ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 08/24/2023
ms.author: cherylmc

---
# Configure an Always On VPN device tunnel for Virtual WAN

[!INCLUDE [intro](../../includes/vpn-gateway-vwan-always-on-intro.md)]

## Prerequisites

You must create a point-to-site configuration and edit the virtual hub assignment. See the following sections for instructions:

* [Create a P2S configuration](virtual-wan-point-to-site-portal.md#p2sconfig)
* [Create hub with P2S gateway](virtual-wan-point-to-site-portal.md#hub)

## Configure the device tunnel

[!INCLUDE [device tunnel](../../includes/vpn-gateway-vwan-always-on-device.md)]

## To remove a profile

To remove the profile, run the following command:

![Screenshot shows a PowerShell window that runs the command Remove-VpnConnection -Name MachineCertTest.](./media/howto-always-on-device-tunnel/cleanup.png)

## Next steps

For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).