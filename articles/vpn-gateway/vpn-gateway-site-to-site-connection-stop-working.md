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

### Step 2 Verify the Shared Key(PSK)

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

### Step 3 Verify the VPN Peer IPs

Make sure that the virtual network, subnets and, ranges in the **Local network** definition in the virtual network gateway matches the configuration on the on-premises VPN device.

### Step 4 Check on-premises VPN device external interface address

- If the Internet facing IP address of the VPN device is included within the **Local network** definition in Azure, you may experience sporadic disconnects.
- The device external interface must be directly on Internet. There should be no Network Address Translation or firewall between the Internet and the device.
-  If you configure Firewall Clustering with virtual IP, you must break the cluster and expose the VPN appliance directly to a public interface that the gateway can interface with.

### Step 5 Verify Azure Gateway health probe

1. Browse to https://<VirtualNetworkGatewayIP>:8081/healthprobe
2. Click through certificate warning.
3. If you receive a response, the virtual network gateway is considered healthy. If you do not receive a response, the gateway may not be healthy or there is an network security group on the gateway subnet. The following text is a sample of the response:

    `<?xml version="1.0"?>
    <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">Primary Instance: GatewayTenantWorker_IN_1 GatewayTenantVersion: 14.7.24.6</string>`

### Step 6 Check if the virtual network gateway is over utilized

Check CPU and Bandwidth Utilization of the virtual network gateway instances:

- Network and CPU utilization on Gateway instances
- Site-to-Site Tunnel Bandwidth

### Step 7 Check if the on-premises VPN device has Perfect forward Secrecy (PFS) feature enabled

The Perfect forward Secrecy feature can cause the disconnection problems. If the VPN device has Perfect forward Secrecy enabled, disable the feature. Then update the virtual network gateway IPsec policy.


