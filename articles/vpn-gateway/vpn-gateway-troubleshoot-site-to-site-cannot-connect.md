---
title: Troubleshoot an Azure site-to-site VPN connection that cannot connect| Microsoft Docs
description: Learn how to troubleshoot a site-to-site VPN connection that suddenly stops working and cannot be reconnected. 
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

# Troubleshooting: An Azure site-to-site VPN connection cannot connect and stops working

After you configure a site-to-site VPN connection between an on-premises network and an Azure virtual network, the VPN connection suddenly stops working and cannot be reconnected. This article provides troubleshooting steps to help you resolve this problem. 

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting steps

To resolve the problem, first try to [reset the Azure VPN gateway](vpn-gateway-resetgw-classic.md) and reset the tunnel from the on-premises VPN device. If the problem persists, follow these steps to identify the cause of the problem.

### Prerequisite step

Check the type of the Azure virtual network gateway.

1. Go to the [Azure portal](https://portal.azure.com).

2. Check the **Overview** page of the virtual network gateway for the type information.
    
    ![The overview of the gateway](media\vpn-gateway-troubleshoot-site-to-site-cannot-connect\gatewayoverview.png)

### Step 1. Check whether the on-premises VPN device is validated

1. Check whether you are using a [validated VPN device and operating system version](vpn-gateway-about-vpn-devices.md#a-namedevicetableavalidated-vpn-devices-and-device-configuration-guides). If the device is not a validated VPN device, you might have to contact the device manufacturer to see if there is a compatibility issue.

2. Make sure that the VPN device is correctly configured. For more information, see [Editing device configuration samples](/vpn-gateway-about-vpn-devices.md#editing).

### Step 2. Verify the shared key

Compare the shared key for the on-premises VPN device to the Azure Virtual Network VPN to make sure that the keys match. 

To view the shared key for the Azure VPN connection, use one of the following methods：

**Azure portal**

1. Go to the VPN gateway site-to-site connection that you created.

2. In the **Settings** section, click **Shared key**.
    
    ![Shared key](media/vpn-gateway-troubleshoot-site-to-site-cannot-connect/sharedkey.png)

**Azure PowerShell**

For the Azure Resource Manager deployment model:

    Get-AzureRmVirtualNetworkGatewayConnectionSharedKey -Name <Connection name> -ResourceGroupName <Resource group name>

For the classic deployment model:

    Get-AzureVNetGatewayKey -VNetName -LocalNetworkSiteName

### Step 3. Verify the VPN peer IPs

-	The IP definition in the **Local Network Gateway** object in Azure should match the on-premises device IP.
-	The Azure gateway IP definition that is set on the on-premises device should match the Azure gateway IP.

### Step 4. Check UDR and NSGs on the gateway subnet

Check for and remove user-defined routing (UDR) or Network Security Groups (NSGs) on the gateway subnet, and then test the result. If the problem is resolved, validate the settings that UDR or NSG applied.

### Step 5. Check the on-premises VPN device external interface address

- If the Internet-facing IP address of the VPN device is included in the **Local network** definition in Azure, you might experience sporadic disconnections.
- The device's external interface must be directly on the Internet. There should be no network address translation or firewall between the Internet and the device.
-  To configure firewall clustering to have a virtual IP, you must break the cluster and expose the VPN appliance directly to a public interface that the gateway can interface with.

### Step 6. Verify that the subnets match exactly (Azure policy-based gateways)

-	Verify that the subnets match exactly between the Azure virtual network and on-premises definitions for the Azure virtual network.
-	Verify that the subnets match exactly between the **Local Network Gateway** and on-premises definitions for the on-premises network.

### Step 7. Verify the Azure gateway health probe

1. Go to the [health probe](https://&lt;YourVirtualNetworkGatewayIP&gt;:8081/healthprobe).

2. Click through the certificate warning.
3. If you receive a response, the VPN gateway is considered healthy. If you don't receive a response, the gateway might not be healthy or an NSG on the gateway subnet is causing the problem. The following text is a sample response:

    &lt;?xml version="1.0"?>
    <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">Primary Instance: GatewayTenantWorker_IN_1 GatewayTenantVersion: 14.7.24.6</string&gt;

### Step 8. Check whether the on-premises VPN device has the perfect forward secrecy feature enabled

The perfect forward secrecy feature can cause disconnection problems. If the VPN device has perfect forward secrecy enabled, disable the feature. Then update the VPN gateway IPsec policy.

## Next steps

-	[Configure a site-to-site connection to a virtual network](vpn-gateway-howto-site-to-site-resource-manager-portal.md)
-	[Configure an IPsec/IKE policy for site-to-site VPN connections](vpn-gateway-ipsecikepolicy-rm-powershell.md)
