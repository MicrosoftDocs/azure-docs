---
title: VPN client disconnects Azure virtual network randomly| Microsoft Docs
description: Learn how to troubleshoot Azure VPN disconnection problems.
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

# Troubleshoot Azure Site-to-Site VPN disconnection problems

You configure the Site-to-Site VPN connection between the on-premise network and Microsoft Azure virtual network. You may find the connection between VPN clients and Azure virtual network is not reliably. It disconnects randomly. This article provides troubleshoot steps to help you identify the cause of the problem.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting steps

### Step 1 Check if the on-premise VPN device is validated

1. Check if you are using a [validated VPN device and OS version](vpn-gateway-about-vpn-devices.md#a-namedevicetableavalidated-vpn-devices-and-device-configuration-guides). If it is not a validated VPN device, you may need to contact device manufacturer to see if there is any compatibility issue.
2. Make sure that the VPN device is in a correct configuration. For more information, see [Editing device configuration samples](vpn-gateway-about-vpn-devices.md#editing).

### Step 2 Check the Security Association settings(for policy-based Azure virtual network gateways)

1. Make sure that the virtual network, subnets and, ranges in the **Local network** definition in Microsoft Azure are same as the configuration on the on-premises VPN device.
2. Make sure that the Security Association settings are matching.

### Step 3 Check the "one VPN Tunnel per Subnet Pair" setting (for policy-based virtual network gateways)

Make sure that the VPN device is set to have **one VPN tunnel per subnet pair** for policy-based virtual network gateways.

### Step 4 Check for Security Association Limitation (for policy-based virtual network gateways)

The Policy-based virtual network gateway has limit of 200 subnet Security Association pairs. If the number of Azure virtual network subnets multiplied times the number of local subnets is greater than 200, you will see sporadic subnets disconnecting.

### Step 5 Check on-premises VPN device external interface address

- If the Internet facing IP address of the VPN device is included within the **Local network** definition in Azure, you may experience sporadic disconnects.
- The device external interface must be directly on Internet. There should be no Network Address Translation or firewall between the Internet and the device.
-  If you configure Firewall Clustering with virtual IP, you must break the cluster and expose the VPN appliance directly to a public interface that the gateway can interface with.

### Step 6 Check if the virtual network gateway is Over utilized

Check CPU and Bandwidth Utilization of the virtual network gateway instances:

- Network and CPU utilization on VM instances
- Site-to-Site Tunnel Bandwidth
- With high utilization, it may resolve to resize to [higher SKU gateway](vpn-gateway-about-vpngateways.md#gwsku).

### Step 7 Check virtual network gateway upgrade

If the VPN connection disconnects just one time, but then immediately comes back on. It may be caused by thevirtual network gateway upgrade.

 ### Step 8 Check if the on-premises VPN device has Perfect forward Secrecy enabled

The **Perfect forward Secrecy** feature can cause the disconnection problems. If the VPN device has **Perfect forward Secrecy** enabled, disable the feature. Then [update the virtual network gateway IPsec policy](vpn-gateway-ipsecikepolicy-rm-powershell.md).

### Step 9 Check for User-Defined Routes or Network Security Groups on Gateway Subnet

A User-defined route on the gateway subnet may be restricting some traffic and allowing other traffic giving the appearance that the VPN connection is unreliable for some traffic and ok for others. 

## Need help? Contact support. 

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly. 

