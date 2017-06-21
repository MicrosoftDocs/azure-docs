---
title: Troubleshoot Azure Site-to-Site VPN connection cannot connect problem| Microsoft Docs
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
ms.date: 06/21/2017
ms.author: genli
---

# Troubleshoot Azure Site-to-Site VPN connection cannot connect and stops working problem

You configure the Site-to-Site VPN connection between the on-premises network and Microsoft Azure virtual network. The VPN connection suddenly stopped working and cannot be reconnected. This article provides troubleshoot steps to help you resolve the problem. 

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting steps

To resolve the issue, first try to [reset the Azure virtual network Gateway](vpn-gateway-resetgw-classic.md) and reset the Tunnel from the on-premises VPN device. If the problem is not resolved, follow these steps to identify the cause of the problem.

### Prerequisite step

Check the type of Azure  virtual network gateway:

1. Go to [Azure portal](https://portal.azure.com).
2. In the **Overview** page of the virtual network gateway, you can find the type information.
    
    ![The overview of the gateway](media\vpn-gateway-troubleshoot-site-to-site-cannot-connect\gatewayoverview.png)

### Step 1 Check if the on-premises VPN device is validated

1. Check if you are using a [validated VPN device and OS version](vpn-gateway-about-vpn-devices.md#a-namedevicetableavalidated-vpn-devices-and-device-configuration-guides). If it is not a validated VPN device, you may need to contact device manufacturer to see if there is any compatibility issue.
2. Make sure that the VPN device is in a correctly configured. For more information, see [Editing device configuration samples](/vpn-gateway-about-vpn-devices.md#editing).

### Step 2 Verify the Shared Key(PSK)

Compare the **Shared Key** from on-premises VPN device and the virtual network VPN to ensure the key matches. 

To view the PSK for the Azure VPN connection, use one of the following methods：

**Azure portal**

1. Go to virtual network gateway > Site to site connection you created.
2. In the **Settings** section, click **Shared Key**.
    
    ![Shared Key](media/vpn-gateway-troubleshoot-site-to-site-cannot-connect/sharedkey.png)

**Azure PowerShell**

For Resource Manager mode

    Get-AzureRmVirtualNetworkGatewayConnectionSharedKey -Name <Connection name> -ResourceGroupName <Resource group name>

For Classic

    Get-AzureVNetGatewayKey -VNetName -LocalNetworkSiteName

### Step 3 Verify the VPN Peer IPs

-	The IP definition in **Local Network Gateway** object in Azure should match the on-premises device IP.
-	The Azure Gateway IP definition set on the on-premises device should match the Azure gateway IP.

### Step 4 NSG and UDR on Gateway Subnet

Check for and remove User Defined Routing (UDR) or Network Security Groups (NSG)on the Gateway Subnet and test. If resolved, validate correctness of NSG or UDR applied.

### Step 5 Check on-premises VPN device external interface address

- If the Internet facing IP address of the VPN device is included within the **Local network** definition in Azure, you may experience sporadic disconnects.
- The device external interface must be directly on Internet. There should be no Network Address Translation or firewall between the Internet and the device.
-  If you configure Firewall Clustering with virtual IP, you must break the cluster and expose the VPN appliance directly to a public interface that the gateway can interface with.

### Step 6 Validate Subnets Match Exactly (Azure Policy-Based Gateways)

-	Between Azure Virtual Network and on-premises definitions for the Azure Virtual Network.
-	Between 'Local Network Gateway' and on-premises definitions for on-premises network.

### Step 5 Verify Azure Gateway health probe

1. Browse to https://&lt;YourVirtualNetworkGatewayIP&gt;:8081/healthprobe
2. Click through certificate warning.
3. If you receive a response, the virtual network gateway is considered healthy. If you do not receive a response, the gateway may not be healthy or there is a NSG on the gateway subnet that causes the issue. The following text is a sample of the response:

    &lt;?xml version="1.0"?>
    <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">Primary Instance: GatewayTenantWorker_IN_1 GatewayTenantVersion: 14.7.24.6</string&gt;

### Step 7 Check if the on-premises VPN device has Perfect forward Secrecy (PFS) feature enabled

The Perfect forward Secrecy feature can cause the disconnection problems. If the VPN device has Perfect forward Secrecy enabled, disable the feature. Then update the virtual network gateway IPsec policy.


