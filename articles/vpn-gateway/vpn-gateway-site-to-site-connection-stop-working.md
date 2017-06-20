---
title: Troubleshoot Azure Site-to-Site VPN connection stops working problem| Microsoft Docs
description: Learn how to troubleshoot the problem in which the Site-to-Site VPN connection suddenly stopped working and cannot be reonnected anymore. 
services: vpn-gateway
documentationcenter: na
author: genlin
manager: willchen
editor: ''
tags: ''

ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/16/2017
ms.author: genli
---

# Troubleshoot Azure Site-to-Site VPN connection stops working problem

You configure the Site-to-Site VPN connection between the on-premises network and Microsoft Azure virtual network. The VPN connection suddenly stopped working and cannot be reconnected. This article provides troubleshoot steps to help you resolve the problem. 

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting steps

To resolve the issue, first try to [reset the Azure VPN Gateway](vpn-gateway-resetgw-classic.md) and reset the Tunnel from the on-premises VPN device. If the problem is not resolved, follow these steps to identify the cause of the problem.

### Step 1 Check if the on-premises VPN device is validated

Check if you are using a [validated VPN device and OS version](vpn-gateway-about-vpn-devices.md#a-namedevicetableavalidated-vpn-devices-and-device-configuration-guides). If it is not a validated VPN device, you may need to contact device manufacturer to see if there is any compatibility issue.

### Step 2 Check if the Shared Key(PSK) matches

Compare the **Shared Key** from on-premises VPN device and the virtual network VPN to ensure the key matches. 

To view the PSK for the Azure VPN connection, use one of the following methods：

**Azure portal**

1. Go to virtual network gateway >site to site conection you created.
2. In the **Settings** section, click **Shared Key**.

**Azure PowerShell**

For Resource Manager mode

    Get-AzureRmVirtualNetworkGatewayConnectionSharedKey -Name <Connection name> -ResourceGroupName <Resource group name>

For Classic

    Get-AzureVNetGatewayKey -VNetName -LocalNetworkSiteName

### Step 3 Validate VPN Peer IPs

