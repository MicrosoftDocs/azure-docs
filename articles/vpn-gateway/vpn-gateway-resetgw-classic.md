<properties
   pageTitle="Reset an Azure VPN Gateway | Microsoft Azure"
   description="This article walks you through resetting your Azure VPN Gateway. The article applies to VPN gateways created using the classic deployment model."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-service-management"/>

<tags
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/13/2016"
   ms.author="cherylmc"/>

# Reset an Azure VPN Gateway using PowerShell


This article will walk you through resetting your Azure VPN Gateway using PowerShell cmdlets. These instructions apply to the classic deployment model.  We do not yet have a cmdlet or REST API to reset a VPN gateway for virtual networks created using the Resource Manager deployment model. These are in process. You can tell if your VPN gateway was created using the classic deployment model by viewing your virtual network in the Azure Portal. Virtual networks that were created using the classic deployment model are shown in the Virtual Network (classic) portion of the Azure Portal.

Resetting the Azure VPN gateway is helpful if you lose cross-premises VPN connectivity on one or more S2S VPN tunnels. In this situation, your on-premises VPN devices are all working correctly, but are not able to establish IPsec tunnels with the Azure VPN gateways. When you use the *Reset-AzureVNetGateway* cmdlet, it will reboot the gateway, and then re-apply the cross-premises configurations to it. The gateway will keep the public IP address it already has. This means you won’t need to update the VPN router configuration with a new public IP address for Azure VPN gateway.  


Before you reset your gateway, verify the key items listed below for each IPsec site-to-site (S2S) VPN tunnel. Any mismatch in the items will result in the disconnect of S2S VPN tunnels. Verifying and correcting the configurations for your on-premises and Azure VPN gateways will save you from unnecessary reboots and disruptions for the other working connections on the gateways.

Verify the following items before resetting your gateway.

- The Internet IP addresses (VIPs) for both the Azure VPN gateway and the on-premises VPN gateway are configured correctly in both the Azure and the on-premises VPN policies.
- The pre-shared key must be the same on both Azure and on-premises VPN gateways.
- If you apply specific IPsec/IKE configuration, such as encryption, hashing algorithms, and PFS (Perfect Forward Secrecy), please ensure both the Azure and on-premises VPN gateways have the same configurations.


## Reset a VPN Gateway using PowerShell

The PowerShell cmdlet for resetting Azure VPN gateway is *Reset-AzureVNetGateway*. Each Azure VPN gateway is composed of two VM instances running in an active-standby configuration. Once the command is issued, the current active instance of the Azure VPN gateway will be rebooted immediately. There will be a brief gap during the failover from the active instance (being rebooted) to the standby instance. The gap should be less than one minute. 

The following example will reset the Azure VPN gateway for the virtual network called "ContosoVNet".
 
		Reset-AzureVNetGateway –VnetName “ContosoVNet” 

	 	Error          :
	 	HttpStatusCode : OK
	 	Id             : f1600632-c819-4b2f-ac0e-f4126bec1ff8
	 	Status         : Successful
		RequestId      : 9ca273de2c4d01e986480ce1ffa4d6d9
		StatusCode     : OK


If the connection is not restored after the first reboot, issue the same command again to reboot the second VM instance (the new active gateway). If the two reboots are requested back to back, there will be a slightly longer period where both VM instances (active and standby) are being rebooted. This case will cause a longer gap on the VPN connectivity, up to 2 to 4 minutes for VMs to complete the reboots.

After two reboots, if you are still experiencing cross-premises connectivity problems, please open a support ticket from the Azure Classic Portal to contact Microsoft Azure Support.

## Next steps
	
See the [PowerShell reference](https://msdn.microsoft.com/library/azure/mt270366.aspx) for more information about this cmdlet.






