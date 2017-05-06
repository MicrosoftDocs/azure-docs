---
title: 'Reset an Azure VPN gateway to reestablish IPsec tunnels | Microsoft Docs'
description: This article walks you through resetting your Azure VPN Gateway to reestablish IPsec tunnels. The article applies to VPN gateways in both the classic, and the Resource Manager deployment models.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 79d77cb8-d175-4273-93ac-712d7d45b1fe
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/12/2017
ms.author: cherylmc

---
# Reset a VPN Gateway

Resetting the Azure VPN gateway is helpful if you lose cross-premises VPN connectivity on one or more Site-to-Site VPN tunnels. In this situation, your on-premises VPN devices are all working correctly, but are not able to establish IPsec tunnels with the Azure VPN gateways. This article walks you through resetting your Azure VPN Gateway. 

Each Azure VPN gateway is a virtual network gateway that is composed of two VM instances running in an active-standby configuration. When you reset the gateway, it reboots the gateway, and then reapplies the cross-premises configurations to it. The gateway keeps the public IP address it already has. This means you won’t need to update the VPN router configuration with a new public IP address for Azure VPN gateway.  

Once the command is issued, the current active instance of the Azure VPN gateway is rebooted immediately. There will be a brief gap during the failover from the active instance (being rebooted), to the standby instance. The gap should be less than one minute.

If the connection is not restored after the first reboot, issue the same command again to reboot the second VM instance (the new active gateway). If the two reboots are requested back to back, there will be a slightly longer period where both VM instances (active and standby) are being rebooted. This will cause a longer gap on the VPN connectivity, up to 2 to 4 minutes for VMs to complete the reboots.

After two reboots, if you are still experiencing cross-premises connectivity problems, please open a support request from the Azure portal.

## Before you begin
Before you reset your gateway, verify the key items listed below for each IPsec Site-to-Site (S2S) VPN tunnel. Any mismatch in the items will result in the disconnect of S2S VPN tunnels. Verifying and correcting the configurations for your on-premises and Azure VPN gateways saves you from unnecessary reboots and disruptions for the other working connections on the gateways.

Verify the following items before resetting your gateway:

* The Internet IP addresses (VIPs) for both the Azure VPN gateway and the on-premises VPN gateway are configured correctly in both the Azure and the on-premises VPN policies.
* The pre-shared key must be the same on both Azure and on-premises VPN gateways.
* If you apply specific IPsec/IKE configuration, such as encryption, hashing algorithms, and PFS (Perfect Forward Secrecy), ensure both the Azure and on-premises VPN gateways have the same configurations.

## Reset a VPN Gateway using the Azure portal

You can reset a Resource Manager VPN gateway using the Azure portal. If you want to reset a classic gateway, see the [PowerShell](#resetclassic) steps.

### Resource Manager deployment model

1. Open the Azure portal and navigate to the Resource Manager virtual network gateway that you want to reset.
2. On the blade for the virtual network gateway, click 'Reset'.

	![Reset VPN Gateway blade](./media/vpn-gateway-howto-reset-gateway/reset-vpn-gateway-portal.png)

3. On the Reset blade, click the ![Reset VPN Gateway blade](./media/vpn-gateway-howto-reset-gateway/reset-button.png) button.


## Reset a VPN Gateway using PowerShell

### Resource Manager deployment model

You'll need the latest version of the PowerShell cmdlets. See [How to install and configure Azure PowerShell](/powershell/azure/overview) for more information. The PowerShell Resource Manager cmdlet for resetting gateway is `Reset-AzureRmVirtualNetworkGateway`. The following example resets the Azure VPN gateway, "VNet1GW", in resource group "TestRG1".

```powershell
$gw = Get-AzureRmVirtualNetworkGateway -Name VNet1GW -ResourceGroup TestRG1
Reset-AzureRmVirtualNetworkGateway -VirtualNetworkGateway $gw
```

### <a name="resetclassic"></a>Classic deployment model

You'll need the latest version of the PowerShell cmdlets. See [How to install and configure Azure PowerShell](/powershell/azure/overview) for more information. The PowerShell cmdlet for resetting Azure VPN gateway is **Reset-AzureVNetGateway**. The following example resets the Azure VPN gateway for the virtual network called "ContosoVNet".

```powershell
Reset-AzureVNetGateway –VnetName “ContosoVNet”
``` 

Result:

    Error          :
    HttpStatusCode : OK
    Id             : f1600632-c819-4b2f-ac0e-f4126bec1ff8
    Status         : Successful
    RequestId      : 9ca273de2c4d01e986480ce1ffa4d6d9
    StatusCode     : OK


