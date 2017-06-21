---
title: Troubleshoot Azure Point-to-Site VPN disconnecting intermittently| Microsoft Docs
description: Learn how to troubleshoot the problem in which the Site-to-Site VPN connection disconnected regularly. 
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
ms.date: 06/21/2017
ms.author: genli
---

# Troubleshoot Azure Point-to-Site VPN disconnecting intermittently

You might expereince the problem that a new or existing Microsoft Azure Point-to-Site VPN connection is not stable or disconnects regularly. This article provides troubleshoot steps to help you identify and resolve the cause of the problem. 

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting steps

### Prerequisite step

Check the type of Azure  virtual network gateway:

1. Go to [Azure portal](https://portal.azure.com).
2. In the **Overview** page of the virtual network gateway, you can find the type information.
    
    ![The overview of the gateway](media\vpn-gateway-troubleshoot-point-to-site-disconnected-intermittently\gatewayoverview.png)

### Step 1 Check if the on-premises VPN device is validated

1. Check if you are using a [validated VPN device and OS version](vpn-gateway-about-vpn-devices.md#a-namedevicetableavalidated-vpn-devices-and-device-configuration-guides). If it is not a validated VPN device, you may need to contact device manufacturer to see if there is any compatibility issue.
2. Make sure that the VPN device is correctly configured. For more information, see [Editing device configuration samples](vpn-gateway-about-vpn-devices.md#editing).

### Step 2 Check the Security Association settings(for policy-based Azure virtual network gateways)

1. Make sure that the virtual network, subnets and, ranges in the **Local network gateway** definition in Microsoft Azure are same as the configuration on the on-premises VPN device.
2. Validate the Security Association settings are matching.

### Step 3 Check for User-Defined Routes or Network Security Groups on Gateway Subnet

A User-defined route on the gateway subnet may be restricting some traffic and allowing other traffic giving the appearance that the VPN connection is unreliable for some traffic and ok for others. 

### Step 4 Check the "one VPN Tunnel per Subnet Pair" setting (for policy-based virtual network gateways)

Make sure that the on-premises VPN device is set to have **one VPN tunnel per subnet pair** for policy-based virtual network gateways.

### Step 5 Check for Security Association Limitation (for policy-based virtual network gateways)

The Policy-based virtual network gateway has limit of 200 subnet Security Association pairs. If the number of Azure virtual network subnets multiplied times the number of local subnets is greater than 200, you will see sporadic subnets disconnecting.

### Step 6 Check on-premises VPN device external interface address

- If the Internet facing IP address of the VPN device is included within the **Local network gateway** definition in Azure, you may experience sporadic disconnects.
- The device's external interface must be directly on Internet. There should be no Network Address Translation (NAT) or firewall between the Internet and the device.
-  If you configure Firewall Clustering with virtual IP, you must break the cluster and expose the VPN appliance directly to a public interface that the gateway can interface with.

 ### Step 7 Check if the on-premises VPN device has Perfect forward Secrecy enabled

The **Perfect forward Secrecy** feature can cause the disconnection problems. If the VPN device has **Perfect forward Secrecy** enabled, disable the feature. Then [update the virtual network gateway IPsec policy](vpn-gateway-ipsecikepolicy-rm-powershell.md#managepolicy).

## Next steps

- [Configure a Site-to-Site connection to a virtual network](vpn-gateway-howto-site-to-site-resource-manager-portal.md)
- [Configure IPsec/IKE policy for Site-to-Site VPN connections](vpn-gateway-ipsecikepolicy-rm-powershell.md)

