<properties 
   pageTitle="Linking virtual networks to ExpressRoute circuits | Microsoft Azure"
   description="This document provides an overview of how to link virtual networks (VNets) to ExpressRoute circuits."
   services="expressroute"
   documentationCenter="na"
   authors="cherylmc"
   manager="carolz"
   editor=""
   tags="azure-service-management"/>
<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/16/2016"
   ms.author="cherylmc" />

# Linking Virtual Network to ExpressRoute circuits

> [AZURE.SELECTOR]
- [PowerShell - Classic](expressroute-howto-linkvnet-classic.md)
- [PowerShell - Resource Manager] (expressroute-howto-linkvnet-arm.md)  
- [Template - Azure Resource Manager](https://github.com/Azure/azure-quickstart-templates/tree/ecad62c231848ace2fbdc36cbe3dc04a96edd58c/301-expressroute-circuit-vnet-connection)

This article gives you an overview of how to link virtual networks (VNets) to ExpressRoute circuits. Virtual networks can either be in the same subscription, or be part of another subscription. This article applies to VNets deployed using the Classic deployment model. If you want to link a virtual network that was deployed using the Azure Resource Manager deployment model, see [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md).

[AZURE.INCLUDE [vpn-gateway-sm-rm](../../includes/vpn-gateway-sm-rm-include.md)] 

## Configuration prerequisites

- You will need the latest version of the Azure PowerShell modules. You can download the latest PowerShell module from the PowerShell section of the [Azure Downloads page](https://azure.microsoft.com/downloads/). Follow the instructions on the [How to install and configure Azure PowerShell](../powershell-install-configure.md) page for step-by-step guidance on how to configure your computer to use the Azure PowerShell modules. 
- Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md) page, the  [routing requirements](expressroute-routing.md) page and the [workflows](expressroute-workflows.md) page before you begin configuration.
- You must have an active ExpressRoute circuit. 
	- Follow the instructions to [create an ExpressRoute circuit](expressroute-howto-circuit-classic.md) and have the circuit enabled by your connectivity provider. 
	- Ensure that you have Azure private peering configured for your circuit. See the [configure routing](expressroute-howto-routing-classic.md) article for routing instructions. 
	- Azure private peering must be configured and the BGP peering between your network and Microsoft must be up for you to enable end-to-end connectivity.

You can link up to 10 VNets to an ExpressRoute circuit. All ExpressRoute circuits must be in the same geopolitical region. You can link a larger number of virtual networks to your ExpressRoute circuit if you enabled the ExpressRoute premium add-on. Check out the [FAQ](expressroute-faqs.md) for more details on the premium add-on. 

## Linking a VNet in the same Azure subscription to an ExpressRoute circuit

Yon can link a virtual network to an ExpressRoute circuit using the following cmdlet. Make sure that the virtual network gateway is created and is ready for linking before you run the cmdlet.

	C:\> New-AzureDedicatedCircuitLink -ServiceKey "*****************************" -VNetName "MyVNet"
	Provisioned

## Linking a VNet in a different Azure subscription to an ExpressRoute circuit

An ExpressRoute circuit can be shared across multiple subscriptions. The figure below shows a simple schematic of how sharing ExpressRoute circuits across multiple subscriptions works. Each of the smaller clouds within the large cloud is used to represent subscriptions belonging to different departments within an organization. Each of the departments within the organization can use their own subscription for deploying their services but can share a single ExpressRoute circuit to connect back to your on-premises network. A single department (in this example: IT) can own the ExpressRoute circuit. Other subscriptions within the organization can use the ExpressRoute circuit.

>[AZURE.NOTE] Connectivity and bandwidth charges for the dedicated circuit will be applied to the ExpressRoute circuit owner. All virtual networks share the same bandwidth.

![Cross-subscription connectivity](./media/expressroute-howto-linkvnet-classic/cross-subscription.png)

### Administration

The *circuit owner* is the administrator/co-administrator of the subscription in which the ExpressRoute circuit is created. The circuit owner can authorize administrators/co-administrators of other subscriptions (referred to as *circuit user* in the workflow diagram) to use the dedicated circuit they own. Circuit users authorized to use the organization's ExpressRoute circuit can link VNet in their subscription to the ExpressRoute circuit once they are authorized.

The circuit owner has the power to modify and revoke authorizations at any time. Revoking an authorization will result in all links being deleted from the subscription whose access was revoked.

### Circuit owner operations 

#### Creating an authorization
	
The circuit owner authorizes the administrators of other subscriptions to use the specified circuit. In the example below, the administrator of the circuit (Contoso IT) enables the administrator of another subscription (Dev-Test), by specifying their Microsoft ID, to link up to 2 VNETs to the circuit. The cmdlet doesn't send email to the specified Microsoft ID. The circuit owner need to explicitly notify the other subscription owner that the authorization is complete.

		PS C:\> New-AzureDedicatedCircuitLinkAuthorization -ServiceKey "**************************" -Description "Dev-Test Links" -Limit 2 -MicrosoftIds 'devtest@contoso.com'
		
		Description         : Dev-Test Links 
		Limit               : 2 
		LinkAuthorizationId : ********************************** 
		MicrosoftIds        : devtest@contoso.com 
		Used                : 0

#### Reviewing authorizations

The circuit owner can review all authorizations issued on a particular circuit by running the following cmdlet.

	PS C:\> Get-AzureDedicatedCircuitLinkAuthorization -ServiceKey: "**************************"
	
	Description         : EngineeringTeam 
	Limit               : 3 
	LinkAuthorizationId : #################################### 
	MicrosoftIds        : engadmin@contoso.com 
	Used                : 1 
	
	Description         : MarketingTeam 
	Limit               : 1 
	LinkAuthorizationId : @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
	MicrosoftIds        : marketingadmin@contoso.com 
	Used                : 0 
	
	Description         : Dev-Test Links 
	Limit               : 2 
	LinkAuthorizationId : &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& 
	MicrosoftIds        : salesadmin@contoso.com 
	Used                : 2 
	

#### Updating authorizations

The circuit owner can modify authorizations using the following cmdlet.

	PS C:\> set-AzureDedicatedCircuitLinkAuthorization -ServiceKey "**************************" -AuthorizationId "&&&&&&&&&&&&&&&&&&&&&&&&&&&&"-Limit 5
		
	Description         : Dev-Test Links 
	Limit               : 5 
	LinkAuthorizationId : &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& 
	MicrosoftIds        : devtest@contoso.com 
	Used                : 0


#### Deleting authorizations

The circuit owner can revoke/delete authorizations to the user by running the following cmdlet.

	PS C:\> Remove-AzureDedicatedCircuitLinkAuthorization -ServiceKey "*****************************" -AuthorizationId "###############################"


### Circuit user operations

#### Reviewing authorizations

The circuit user can review authorizations using the following cmdlet.

	PS C:\> Get-AzureAuthorizedDedicatedCircuit
		
	Bandwidth                        : 200
	CircuitName                      : ContosoIT
	Location                         : Washington DC
	MaximumAllowedLinks              : 2
	ServiceKey                       : &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
	ServiceProviderName              : equinix
	ServiceProviderProvisioningState : Provisioned
	Status                           : Enabled
	UsedLinks                        : 0

#### Redeeming link authorizations

The circuit user can run the following cmdlet to redeem a link authorization.

	PS C:\> New-AzureDedicatedCircuitLink –servicekey "&&&&&&&&&&&&&&&&&&&&&&&&&&" –VnetName 'SalesVNET1' 
		
	State VnetName 
	----- -------- 
	Provisioned SalesVNET1

## Next steps

For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).

