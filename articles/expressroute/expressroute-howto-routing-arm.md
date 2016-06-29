<properties
   pageTitle="How to configure routing for an ExpressRoute circuit | Microsoft Azure"
   description="This article walks you through the steps for creating and provisioning the private, public and Microsoft peering of an ExpressRoute circuit. This article also shows you how to check the status, update, or delete peerings for your circuit."
   documentationCenter="na"
   services="expressroute"
   authors="ganesr"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="hero-article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/29/2016"
   ms.author="ganesr"/>

# Create and modify routing for an ExpressRoute circuit


> [AZURE.SELECTOR]
[Azure Portal - Resource Manager](expressroute-howto-routing-portal-resource-manager.md)
[PowerShell - Resource Manager](expressroute-howto-routing-arm.md)
[PowerShell - Classic](expressroute-howto-routing-classic.md)



This article walks you through the steps to create and manage routing configuration for an ExpressRoute circuit using PowerShell and the Azure Resource Manager deployment model.  The steps below will also show you how to check the status, update, or delete and deprovision peerings for an ExpressRoute circuit. 


**About Azure deployment models**

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

## Configuration prerequisites

- You will need the latest version of the Azure PowerShell modules, version 1.0 or later. 
- Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md) page, the [routing requirements](expressroute-routing.md) page, and the [workflows](expressroute-workflows.md) page before you begin configuration.
- You must have an active ExpressRoute circuit. Follow the instructions to [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have the circuit enabled by your connectivity provider before you proceed. The ExpressRoute circuit must be in a provisioned and enabled state for you to be able to run the cmdlets described below.

These instructions only apply to circuits created with service providers offering Layer 2 connectivity services. If you are using a service provider offering managed Layer 3 services (typically an IPVPN, like MPLS), your connectivity provider will configure and manage routing for you.

>[AZURE.IMPORTANT] We currently do not advertise peerings configured by service providers through the service management portal. We are working on enabling this capability soon. Please check with your service provider before configuring BGP peerings.

You can configure one, two, or all three peerings (Azure private, Azure public and Microsoft) for an ExpressRoute circuit. You can configure peerings in any order you choose. However, you must make sure that you complete the configuration of each peering one at a time. 

## Azure private peering

This section provides instructions on how to create, get, update, and delete the Azure private peering configuration for an ExpressRoute circuit. 

### To create Azure private peering

1. Import the PowerShell module for ExpressRoute.
	
 	You must install the latest PowerShell installer from [PowerShell Gallery](http://www.powershellgallery.com/) and import the Azure Resource Manager modules into the PowerShell session in order to start using the ExpressRoute cmdlets. You will need to run PowerShell as an Administrator.

	    Install-Module AzureRM

		Install-AzureRM

	Import all of the AzureRM.* modules within the known semantic version range

		Import-AzureRM

	You can also just import a select module within the known semantic version range 
		
		Import-Module AzureRM.Network 

	Logon to your account

		Login-AzureRmAccount

	Select the subscription you want to create ExpressRoute circuit
		
		Select-AzureRmSubscription -SubscriptionId "<subscription ID>"

2. Create an ExpressRoute circuit.
	
	Follow the instructions to create an [ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have it provisioned by the connectivity provider. 

	If your connectivity provider offers managed Layer 3 services, you can request your connectivity provider to enable Azure private peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider does not manage routing for you, after creating your circuit, follow the instructions below. 

3. Check the ExpressRoute circuit to ensure it is provisioned.

	You must first check to see if the ExpressRoute circuit is Provisioned and also Enabled. See the example below.

		Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

	The response will be something similar to the example below:

		Name                             : ExpressRouteARMCircuit
		ResourceGroupName                : ExpressRouteResourceGroup
		Location                         : westus
		Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
		Etag                             : W/"################################"
		ProvisioningState                : Succeeded
		Sku                              : {
		                                     "Name": "Standard_MeteredData",
		                                     "Tier": "Standard",
		                                     "Family": "MeteredData"
		                                   }
		CircuitProvisioningState         : Enabled
		ServiceProviderProvisioningState : Provisioned
		ServiceProviderNotes             : 
		ServiceProviderProperties        : {
		                                     "ServiceProviderName": "Equinix",
		                                     "PeeringLocation": "Silicon Valley",
		                                     "BandwidthInMbps": 200
		                                   }
		ServiceKey                       : **************************************
		Peerings                         : []


4. Configure Azure private peering for the circuit.

	Make sure that you have the following items before you proceed with the next steps:

	- A /30 subnet for the primary link. This must not be part of any address space reserved for virtual networks.
	- A /30 subnet for the secondary link. This must not be part of any address space reserved for virtual networks.
	- A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
	- AS number for peering. You can use both 2-byte and 4-byte AS numbers. You can use a private AS number for this peering. Ensure that you are not using 65515.
	- An MD5 hash if you choose to use one. **This is optional**.
	
	You can run the following cmdlet to configure Azure private peering for your circuit.

		Add-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -Circuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "10.0.0.0/30" -SecondaryPeerAddressPrefix "10.0.0.4/30" -VlanId 200

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

	You can use the cmdlet below if you choose to use an MD5 hash.

		Add-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -Circuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "10.0.0.0/30" -SecondaryPeerAddressPrefix "10.0.0.4/30" -VlanId 200  -SharedKey "A1B2C3D4"

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

	>[AZURE.IMPORTANT] Ensure that you specify your AS number as peering ASN, not customer ASN.

### To view Azure private peering details

You can get configuration details using the following cmdlet

		$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

		Get-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -Circuit $ckt	


### To update Azure private peering configuration

You can update any part of the configuration using the following cmdlet. In the example below, the VLAN ID of the circuit is being updated from 100 to 500.

	Set-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -Circuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "10.0.0.0/30" -SecondaryPeerAddressPrefix "10.0.0.4/30" -VlanId 200

	Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt


### To delete Azure private peering

You can remove your peering configuration by running the following cmdlet.

>[AZURE.WARNING] You must ensure that all virtual networks are unlinked from the ExpressRoute circuit before running this cmdlet. 

	Remove-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -Circuit $ckt
	Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt



## Azure public peering

This section provides instructions on how to create, get, update and delete the Azure public peering configuration for an ExpressRoute circuit.

### To create Azure public peering

1. Import the PowerShell module for ExpressRoute.
	
 	You must install the latest PowerShell installer from [PowerShell Gallery](http://www.powershellgallery.com/) and import the Azure Resource Manager modules into the PowerShell session in order to start using the ExpressRoute cmdlets. You will need to run PowerShell as an Administrator.

	    Install-Module AzureRM

		Install-AzureRM

	Import all of the AzureRM.* modules within the known semantic version range

		Import-AzureRM

	You can also just import a select module within the known semantic version range 
		
		Import-Module AzureRM.Network 

	Logon to your account

		Login-AzureRmAccount

	Select the subscription you want to create ExpressRoute circuit
		
		Select-AzureRmSubscription -SubscriptionId "<subscription ID>"

2. Create an ExpressRoute circuit.
	
	Follow the instructions to create an [ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have it provisioned by the connectivity provider. 

	If your connectivity provider offers managed Layer 3 services, you can request your connectivity provider to enable Azure public peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider does not manage routing for you, after creating your circuit, follow the instructions below.

3. Check ExpressRoute circuit to ensure it is provisioned.

	You must first check to see if the ExpressRoute circuit is Provisioned and also Enabled. See the example below.

		Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

	The response will be something similar to the example below:

		Name                             : ExpressRouteARMCircuit
		ResourceGroupName                : ExpressRouteResourceGroup
		Location                         : westus
		Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
		Etag                             : W/"################################"
		ProvisioningState                : Succeeded
		Sku                              : {
		                                     "Name": "Standard_MeteredData",
		                                     "Tier": "Standard",
		                                     "Family": "MeteredData"
		                                   }
		CircuitProvisioningState         : Enabled
		ServiceProviderProvisioningState : Provisioned
		ServiceProviderNotes             : 
		ServiceProviderProperties        : {
		                                     "ServiceProviderName": "Equinix",
		                                     "PeeringLocation": "Silicon Valley",
		                                     "BandwidthInMbps": 200
		                                   }
		ServiceKey                       : **************************************
		Peerings                         : []	

4. Configure Azure public peering for the circuit.

	Ensure that you have the following information before you proceed further.

	- A /30 subnet for the primary link. This must be a valid public IPv4 prefix.
	- A /30 subnet for the secondary link. This must be a valid public IPv4 prefix.
	- A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
	- AS number for peering. You can use both 2-byte and 4-byte AS numbers.
	- An MD5 hash if you choose to use one. **This is optional**.
	
	You can run the following cmdlet to configure Azure public peering for your circuit

		Add-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -Circuit $ckt -PeeringType AzurePublicPeering -PeerASN 100 -PrimaryPeerAddressPrefix "12.0.0.0/30" -SecondaryPeerAddressPrefix "12.0.0.4/30" -VlanId 100

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

	You can use the cmdlet below if you choose to use an MD5 hash

		Add-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -Circuit $ckt -PeeringType AzurePublicPeering -PeerASN 100 -PrimaryPeerAddressPrefix "12.0.0.0/30" -SecondaryPeerAddressPrefix "12.0.0.4/30" -VlanId 100  -SharedKey "A1B2C3D4"

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt


	>[AZURE.IMPORTANT] Ensure that you specify your AS number as peering ASN and not customer ASN.

### To view Azure public peering details

You can get configuration details using the following cmdlet

		$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

		Get-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -Circuit $ckt


### To update Azure public peering configuration

You can update any part of the configuration using the following cmdlet

	Set-AzureRmExpressRouteCircuitPeeringConfig  -Name "MicrosoftPeering" -Circuit $ckt -PeeringType MicrosoftPeering -PeerASN 100 -PrimaryPeerAddressPrefix "123.0.0.0/30" -SecondaryPeerAddressPrefix "123.0.0.4/30" -VlanId 600 

	Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

The VLAN ID of the circuit is being updated from 200 to 600 in the above example.

### To delete Azure public peering

You can remove your peering configuration by running the following cmdlet

	Remove-AzureRmExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -Circuit $ckt
	Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

## Microsoft peering

This section provides instructions on how to create, get, update and delete the Microsoft peering configuration for an ExpressRoute circuit. 

### To create Microsoft peering

1. Import the PowerShell module for ExpressRoute.
	
 	You must install the latest PowerShell installer from [PowerShell Gallery](http://www.powershellgallery.com/) and import the Azure Resource Manager modules into the PowerShell session in order to start using the ExpressRoute cmdlets. You will need to run PowerShell as an Administrator.

	    Install-Module AzureRM

		Install-AzureRM

	Import all of the AzureRM.* modules within the known semantic version range

		Import-AzureRM

	You can also just import a select module within the known semantic version range 
		
		Import-Module AzureRM.Network 

	Logon to your account

		Login-AzureRmAccount

	Select the subscription you want to create ExpressRoute circuit
		
		Select-AzureRmSubscription -SubscriptionId "<subscription ID>"

2. Create an ExpressRoute circuit.
	
	Follow the instructions to create an [ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have it provisioned by the connectivity provider. 

	If your connectivity provider offers managed Layer 3 services, you can request your connectivity provider to enable Azure private peering for you. In that case, you won't need to follow instructions listed in the next sections. However, if your connectivity provider does not manage routing for you, after creating your circuit, follow the instructions below.

3. Check ExpressRoute circuit to ensure it is provisioned.

	You must first check to see if the ExpressRoute circuit is Provisioned and also Enabled. See the example below.

		Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

	The response will be something similar to the example below:

		Name                             : ExpressRouteARMCircuit
		ResourceGroupName                : ExpressRouteResourceGroup
		Location                         : westus
		Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
		Etag                             : W/"################################"
		ProvisioningState                : Succeeded
		Sku                              : {
		                                     "Name": "Standard_MeteredData",
		                                     "Tier": "Standard",
		                                     "Family": "MeteredData"
		                                   }
		CircuitProvisioningState         : Enabled
		ServiceProviderProvisioningState : Provisioned
		ServiceProviderNotes             : 
		ServiceProviderProperties        : {
		                                     "ServiceProviderName": "Equinix",
		                                     "PeeringLocation": "Silicon Valley",
		                                     "BandwidthInMbps": 200
		                                   }
		ServiceKey                       : **************************************
		Peerings                         : []	
4. Configure Microsoft peering for the circuit.

	Make sure that you have the following information before you proceed.

	- A /30 subnet for the primary link. This must be a valid public IPv4 prefix owned by you and registered in an RIR / IRR.
	- A /30 subnet for the secondary link. This must be a valid public IPv4 prefix owned by you and registered in an RIR / IRR.
	- A valid VLAN ID to establish this peering on. Ensure that no other peering in the circuit uses the same VLAN ID.
	- AS number for peering. You can use both 2-byte and 4-byte AS numbers.
	- Advertised prefixes: You must provide a list of all prefixes you plan to advertise over the BGP session. Only public IP address prefixes are accepted. You can send a comma separated list if you plan to send a set of prefixes. These prefixes must be registered to you in an RIR / IRR.
	- Customer ASN: If you are advertising prefixes that are not registered to the peering AS number, you can specify the AS number to which they are registered. **This is optional**.
	- Routing Registry Name: You can specify the RIR / IRR against which the AS number and prefixes are registered.
	- A MD5 hash, if you choose to use one. **This is optional.**
	
	You can run the following cmdlet to configure Microsoft peering for your circuit

		Add-AzureRmExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -Circuit $ckt -PeeringType MicrosoftPeering -PeerASN 100 -PrimaryPeerAddressPrefix "123.0.0.0/30" -SecondaryPeerAddressPrefix "123.0.0.4/30" -VlanId 300 -MicrosoftConfigAdvertisedPublicPrefixes "123.1.0.0/24" -MicrosoftConfigCustomerAsn 23 -MicrosoftConfigRoutingRegistryName "ARIN"

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt


### To get Microsoft peering details

You can get configuration details using the following cmdlet.

		$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

		Get-AzureRmExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -Circuit $ckt


### To update Microsoft peering configuration

You can update any part of the configuration using the following cmdlet.

		Set-AzureRmExpressRouteCircuitPeeringConfig  -Name "MicrosoftPeering" -Circuit $ckt -PeeringType MicrosoftPeering -PeerASN 100 -PrimaryPeerAddressPrefix "123.0.0.0/30" -SecondaryPeerAddressPrefix "123.0.0.4/30" -VlanId 300 -MicrosoftConfigAdvertisedPublicPrefixes "124.1.0.0/24" -MicrosoftConfigCustomerAsn 23 -MicrosoftConfigRoutingRegistryName "ARIN"

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
		

### To delete Microsoft peering

You can remove your peering configuration by running the following cmdlet.

	Remove-AzureRmExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -Circuit $ckt

	Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

## Next steps

Next step, [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md).

-  For more information about ExpressRoute workflows, see [ExpressRoute workflows](expressroute-workflows.md).

-  For more information about circuit peering, see [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md).

-  For more information about working with virtual networks, see [Virtual network overview](../virtual-network/virtual-networks-overview.md).

