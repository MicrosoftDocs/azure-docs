<properties
   pageTitle="Configure an ExpressRoute circuit using Azure Resource Manager and PowerShell | Microsoft Azure"
   description="This article walks you through the steps for creating and provisioning an ExpressRoute circuit. This article also shows you how to check the status, update, or delete and deprovision your circuit."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="carolz"
   editor=""
   tags="azure-resource-manager"/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/07/2015"
   ms.author="cherylmc"/>

# Create and modify an ExpressRoute circuit using Azure Resource Manager and PowerShell

> [AZURE.SELECTOR]
[PowerShell - Classic](expressroute-howto-circuit-classic.md)
[PowerShell - Resource Manager](expressroute-howto-circuit-arm.md)

This article walks you through the steps to create an ExpressRoute circuit using PowerShell cmdlets and the Azure Resource Manager deployment model. The steps below will also show you how to check the status, update, or delete and deprovision an ExpressRoute circuit. 

[AZURE.INCLUDE [vpn-gateway-sm-rm](../../includes/vpn-gateway-sm-rm-include.md)] 

## Configuration prerequisites

- You will need the latest version of the Azure PowerShell modules, version 1.0 or later. Follow the instructions on the [How to install and configure Azure PowerShell](../powershell-install-configure.md) page for step-by-step guidance on how to configure your computer to use the Azure PowerShell modules. 
- Make sure that you have reviewed the [Prerequisites](expressroute-prerequisites.md) page and the [Workflows](expressroute-workflows.md) page before you begin configuration.

## To create and provision an ExpressRoute circuit

1. **Import the PowerShell module for ExpressRoute.**

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
			


2. **Get the list of providers, locations, and bandwidths supported.**

	Before creating an ExpressRoute circuit, you will need the list of connectivity providers, supported locations, and bandwidth options. The PowerShell cmdlet *Get-AzureRmExpressRouteServiceProvider* returns this information, which you’ll use in later steps.

		PS C:\> Get-AzureRmExpressRouteServiceProvider

	Check to see if your connectivity provider is listed there. Make note of the following as you will need them to create circuits.
	
	- Name
	- PeeringLocations
	- BandwidthsOffered

	You are now ready to create an ExpressRoute circuit.

		
3. **Create an ExpressRoute circuit.**

	You must first create a resource group if you don't already have one before you create your ExpressRoute circuit. You can do so by running the following command.

		New-AzureRmResourceGroup -Name “ExpressRouteResourceGroup” -Location "West US"

	The example below shows how to create a 200 Mbps ExpressRoute circuit through Equinix in Silicon Valley. If you are using a different provider and different settings, substitute that information when making your request.

	Below is an example request for a new service key:

		New-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup" -Location "West US" -SkuTier Standard -SkuFamily MeteredData -ServiceProviderName "Equinix" -PeeringLocation "Silicon Valley" -BandwidthInMbps 200

	Make sure that you specify the right SKU tier and SKU family.
 
	 - SKU tier determines whether ExpressRoute standard or ExpressRoute premium add-on is enabled. You can specify *standard* to get the standard SKU or *premium* for premium add-on
	 - SKU family determines the billing type. You can select *metereddata* for metered data plan and *unlimiteddata" for unlimited data plan. **Note:** You will not be able to change the billing type once a circuit is created. 

	
	The response will contain the service key. You can get detailed descriptions of all the parameters by running the following:

		get-help New-AzureRmExpressRouteCircuit -detailed 

4. **List all ExpressRoute circuits.**

	You can run the *Get-AzureRmExpressRouteCircuit* command to get a list of all ExpressRoute circuits you created.

		#Getting service key
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
		ServiceProviderProvisioningState : NotProvisioned
		ServiceProviderNotes             : 
		ServiceProviderProperties        : {
		                                     "ServiceProviderName": "Equinix",
		                                     "PeeringLocation": "Silicon Valley",
		                                     "BandwidthInMbps": 200
		                                   }
		ServiceKey                       : **************************************
		Peerings                         : []


	You can retrieve this information at any time using the *Get-AzureRmExpressRouteCircuit* cmdlet. Making the call without any parameters will list all circuits. Your Service Key will be listed in the *ServiceKey* field.

		Get-AzureRmExpressRouteCircuit

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
		ServiceProviderProvisioningState : NotProvisioned
		ServiceProviderNotes             : 
		ServiceProviderProperties        : {
		                                     "ServiceProviderName": "Equinix",
		                                     "PeeringLocation": "Silicon Valley",
		                                     "BandwidthInMbps": 200
		                                   }
		ServiceKey                       : **************************************
		Peerings                         : []



	You can get detailed descriptions of all the parameters by running the following:

		get-help Get-AzureRmExpressRouteCircuit -detailed 

5. **Send the Service Key to your connectivity provider for provisioning.**

	When you create a new ExpressRoute circuit, the circuit will be the following state:
	
		ServiceProviderProvisioningState : NotProvisioned
		
		CircuitProvisioningState         : Enabled

	The *ServiceProviderProvisioningState* provides information on the current state of provisioning on the service provider side and the Status provides the state on the Microsoft side. An ExpressRoute circuit must be in the following state for you to be able to use it.

		ServiceProviderProvisioningState : Provisioned
		
		CircuitProvisioningState         : Enabled

	The circuit will go to the following state when the connectivity provider is in the process of enabling it for you. 

		ServiceProviderProvisioningState : Provisioned
		
		Status                           : Enabled



5. **Periodically check the status and the state of the circuit key.**

	This lets you know when your provider has enabled your circuit. Once the circuit has been configured, the *ServiceProviderProvisioningState* will display as *Provisioned* as shown in the example below.

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

6. **Create your routing configuration.**
	
	Refer to the [ExpressRoute circuit routing configuration (create and modify circuit peerings)](expressroute-howto-routing-arm.md) page for step-by-step instructions. 

7. **Link a VNet to an ExpressRoute circuit.** 

	Next, link a VNet to your ExpressRoute circuit. You can use the PowerShell steps in [this article](expressroute-howto-linkvnet-arm.md) to link your VNet.

##  To get the status of an ExpressRoute circuit

You can retrieve this information at any time using the *Get-AzureRmExpressRouteCircuit* cmdlet. Making the call without any parameters will list all circuits. 

		Get-AzureRmExpressRouteCircuit

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

You can get information on a specific ExpressRoute circuit by passing the resource group name and circuit name as a parameter to the call.

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

You can get detailed descriptions of all the parameters by running the following:

		get-help get-azurededicatedcircuit -detailed 

## To modify an ExpressRoute circuit

You can modify certain properties of an ExpressRoute circuit without impacting connectivity. 

You can do the following: 

- Enable / disable ExpressRoute premium add-on for your ExpressRoute circuit without any downtime.
- Increase the bandwidth of your ExpressRoute circuit without any downtime.

Refer to the [ExpressRoute FAQ](expressroute-faqs.md) page for more information on limits and limitations. 

### How to enable the ExpressRoute premium add-on

You can enable the ExpressRoute premium add-on for your existing circuit using the following PowerShell snippet:

		$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

		$ckt.Sku.Name = "Premium"
		$ckt.sku.Name = "Premium_MeteredData"

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
	
		
Your circuit will now have the ExpressRoute premium add-on features enabled. Note that we will start billing you for the premium add-on capability as soon as the command has successfully run.

### How to disable the ExpressRoute premium add-on

You can disable the ExpressRoute premium add-on for your existing circuit using the following PowerShell cmdlet:
	
		$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
		
		$ckt.Sku.Tier = "Standard"
		$ckt.sku.Name = "Standard_MeteredData"
		
		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt


The premium add-on is now disabled for your circuit. 

Note that this operation can fail if you are using resources greater than what is permitted for the standard circuit.

- You must ensure that the number of virtual networks linked to the circuit is less than 10 before you downgrade from premium to standard. If you don't do so, your update request will fail and you will be billed the premium rates.
- You must unlink all virtual networks in other geopolitical regions. If you don't do so, your update request will fail and you will be billed the premium rates.
- Your route table must be less than 4000 routes for private peering. If your route table size is greater than 4000 routes, the BGP session will drop and won't be re-enabled till the number of advertised prefixes goes below 4000.


### How to update the ExpressRoute circuit bandwidth

Check the [ExpressRoute FAQ](expressroute-faqs.md) page for supported bandwidth options for your provider. You can pick any size greater than the size of your existing circuit. Once you decided what size you need, you can use the following command to re-size your circuit.

		$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

		$ckt.ServiceProviderProperties.BandwidthInMbps = 1000

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

Your circuit will have been sized up on the Microsoft side. You must contact your connectivity provider to update configurations on their side to match this change. Note that we will start billing you for the updated bandwidth option from this point on.

>[AZURE.IMPORTANT] You cannot reduce the bandwidth of an ExpressRoute circuit without disruption. Downgrading bandwidth will require you to deprovision the ExpressRoute circuit, and then re-provision a new ExpressRoute circuit.

## To delete and deprovision an ExpressRoute circuit

You can delete your ExpressRoute circuit by running the following command:

		Remove-AzureRmExpressRouteCircuit -ResourceGroupName "ExpressRouteResourceGroup" -Name "ExpressRouteARMCircuit"

Note that you must unlink all virtual networks from the ExpressRoute for this operation to succeed. Check if you have any virtual networks linked to the circuit if this operation fails.

If the ExpressRoute circuit service provider provisioning state is enabled, the status will move to *disabling* from enabled state. You must work with your service provider to deprovision the circuit on their side. We will continue to reserve resources and bill you until the service provider completes deprovisioning the circuit and sends us a notification.

If the service provider has deprovisioned the circuit (the service provider provisioning state is set to *not provisioned*) before you run the above cmdlet, we will deprovision the circuit and stop billing you. 

## Next steps

- [Configure routing](expressroute-howto-routing-arm.md)

