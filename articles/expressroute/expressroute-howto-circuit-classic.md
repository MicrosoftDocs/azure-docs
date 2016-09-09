<properties
   pageTitle="Create and modify an ExpressRoute circuit by using the classic deployment model and PowerShell| Microsoft Azure"
   description="This article walks you through the steps for creating and provisioning an ExpressRoute circuit. This article also shows you how to check the status, update, or delete and deprovision your circuit."
   documentationCenter="na"
   services="expressroute"
   authors="ganesr"
   manager="carmonm"
   editor=""
   tags="azure-service-management"/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/19/2016"
   ms.author="ganesr"/>

# Create and modify an ExpressRoute circuit

> [AZURE.SELECTOR]
[Azure Portal - Resource Manager](expressroute-howto-circuit-portal-resource-manager.md)
[PowerShell - Resource Manager](expressroute-howto-circuit-arm.md)
[PowerShell - Classic](expressroute-howto-circuit-classic.md)

This article walks you through the steps to create an Azure ExpressRoute circuit by using PowerShell cmdlets and the classic deployment model. This article will also show you how to check the status, update, or delete and deprovision an ExpressRoute circuit.

**About Azure deployment models**

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)]


## Before you begin

- You need the latest version of the Azure PowerShell modules. You can download the latest PowerShell modules from the PowerShell section of the [Azure Downloads page](https://azure.microsoft.com/downloads/). Follow the instructions in [How to install and configure Azure PowerShell](../powershell-install-configure.md) for step-by-step guidance on how to configure your computer to use the Azure PowerShell modules.

- Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.

## Create and provision an ExpressRoute circuit

### 1. Import the PowerShell modules for ExpressRoute

 You must import the Azure and ExpressRoute modules into the PowerShell session in order to start using the ExpressRoute cmdlets. To do this, run the following commands:  

	Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Azure.psd1'
	Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\ExpressRoute\ExpressRoute.psd1'

### 2. Get the list of supported providers, locations, and bandwidths

Before you create an ExpressRoute circuit, you need the list of supported connectivity providers, locations, and bandwidth options.

The PowerShell cmdlet `Get-AzureDedicatedCircuitServiceProvider` returns this information, which you’ll use in later steps:

	Get-AzureDedicatedCircuitServiceProvider

Check to see if your connectivity provider is listed there. Make a note of the following information because you'll need it later when you create a circuit:

- Name

- PeeringLocations

- BandwidthsOffered

You're now ready to create an ExpressRoute circuit. 		

### 3. Create an ExpressRoute circuit

The following example shows how to create a 200-Mbps ExpressRoute circuit through Equinix in Silicon Valley. If you're using a different provider and different settings, substitute that information when you make your request.

>[AZURE.IMPORTANT] Your ExpressRoute circuit will be billed from the moment a service key is issued. Ensure that you perform this operation when the connectivity provider is ready to provision the circuit.


The following is an example request for a new service key:

	$Bandwidth = 200
	$CircuitName = "MyTestCircuit"
	$ServiceProvider = "Equinix"
	$Location = "Silicon Valley"

	New-AzureDedicatedCircuit -CircuitName $CircuitName -ServiceProviderName $ServiceProvider -Bandwidth $Bandwidth -Location $Location -sku Standard -BillingType MeteredData

Or, if you want to create an ExpressRoute circuit with the premium add-on, use the following example. Refer to the [ExpressRoute FAQ](expressroute-faqs.md) for more details about the premium add-on.

	New-AzureDedicatedCircuit -CircuitName $CircuitName -ServiceProviderName $ServiceProvider -Bandwidth $Bandwidth -Location $Location -sku Premium - BillingType MeteredData


The response will contain the service key. You can get detailed descriptions of all the parameters by running the following:

	get-help new-azurededicatedcircuit -detailed

### 4. List all the ExpressRoute circuits

You can run the `Get-AzureDedicatedCircuit` command to get a list of all the ExpressRoute circuits that you created:


	Get-AzureDedicatedCircuit

The response will be something similar to the following example:

	Bandwidth                        : 200
	CircuitName                      : MyTestCircuit
	Location                         : Silicon Valley
	ServiceKey                       : *********************************
	ServiceProviderName              : equinix
	ServiceProviderProvisioningState : NotProvisioned
	Sku                              : Standard
	Status                           : Enabled

You can retrieve this information at any time by using the `Get-AzureDedicatedCircuit` cmdlet. Making the call without any parameters lists all the circuits. Your service key will be listed in the *ServiceKey* field.

	Get-AzureDedicatedCircuit

	Bandwidth                        : 200
	CircuitName                      : MyTestCircuit
	Location                         : Silicon Valley
	ServiceKey                       : *********************************
	ServiceProviderName              : equinix
	ServiceProviderProvisioningState : NotProvisioned
	Sku                              : Standard
	Status                           : Enabled

You can get detailed descriptions of all the parameters by running the following:

	get-help get-azurededicatedcircuit -detailed

### 5. Send the service key to your connectivity provider for provisioning


*ServiceProviderProvisioningState* provides information on the current state of provisioning on the service-provider side. *Status* provides the state on the Microsoft side. For more information about circuit provisioning states, see the [Workflows](expressroute-workflows.md#expressroute-circuit-provisioning-states) article.

When you create a new ExpressRoute circuit, the circuit will be in the following state:

	ServiceProviderProvisioningState : NotProvisioned
	Status                           : Enabled


The circuit will go to the following state when the connectivity provider is in the process of enabling it for you:

	ServiceProviderProvisioningState : Provisioning
	Status                           : Enabled

An ExpressRoute circuit must be in the following state for you to be able to use it:

	ServiceProviderProvisioningState : Provisioned
	Status                           : Enabled


### 6. Periodically check the status and the state of the circuit key

This lets you know when your provider has enabled your circuit. After the circuit has been configured, *ServiceProviderProvisioningState* will display as *Provisioned* as shown in the following example:

	Get-AzureDedicatedCircuit

	Bandwidth                        : 200
	CircuitName                      : MyTestCircuit
	Location                         : Silicon Valley
	ServiceKey                       : *********************************
	ServiceProviderName              : equinix
	ServiceProviderProvisioningState : Provisioned
	Sku                              : Standard
	Status                           : Enabled

### 7. Create your routing configuration

Refer to the [ExpressRoute circuit routing configuration (create and modify circuit peerings)](expressroute-howto-routing-classic.md) article for step-by-step instructions.

>[AZURE.IMPORTANT] These instructions only apply to circuits that are created with service providers that offer layer 2 connectivity services. If you're using a service provider that offers managed layer 3 services (typically an IP VPN, like MPLS), your connectivity provider will configure and manage routing for you.

### 8. Link a virtual network to an ExpressRoute circuit

Next, link a virtual network to your ExpressRoute circuit. Refer to [Linking ExpressRoute circuits to virtual networks](expressroute-howto-linkvnet-classic.md) for step-by-step instructions. If you need to create a virtual network by using the classic deployment model for ExpressRoute, see [Create a virtual network for ExpressRoute](expressroute-howto-vnet-portal-classic.md) for instructions.

## Getting the status of an ExpressRoute circuit

You can retrieve this information at any time by using the `Get-AzureCircuit` cmdlet. Making the call without any parameters lists all the circuits.

	Get-AzureDedicatedCircuit

	Bandwidth                        : 200
	CircuitName                      : MyTestCircuit
	Location                         : Silicon Valley
	ServiceKey                       : *********************************
	ServiceProviderName              : equinix
	ServiceProviderProvisioningState : Provisioned
	Sku                              : Standard
	Status                           : Enabled

	Bandwidth                        : 1000
	CircuitName                      : MyAsiaCircuit
	Location                         : Singapore
	ServiceKey                       : #################################
	ServiceProviderName              : equinix
	ServiceProviderProvisioningState : Provisioned
	Sku                              : Standard
	Status                           : Enabled

You can get information on a specific ExpressRoute circuit by passing the service key as a parameter to the call:

	Get-AzureDedicatedCircuit -ServiceKey "*********************************"

	Bandwidth                        : 200
	CircuitName                      : MyTestCircuit
	Location                         : Silicon Valley
	ServiceKey                       : *********************************
	ServiceProviderName              : equinix
	ServiceProviderProvisioningState : Provisioned
	Sku                              : Standard
	Status                           : Enabled


You can get detailed descriptions of all the parameters by running the following:

	get-help get-azurededicatedcircuit -detailed

## Modifying an ExpressRoute circuit

You can modify certain properties of an ExpressRoute circuit without impacting connectivity.

You can do the following with no downtime:

- Enable or disable an ExpressRoute premium add-on for your ExpressRoute circuit.
- Increase the bandwidth of your ExpressRoute circuit. Note that downgrading the bandwidth of a circuit is not supported.
- Change the metering plan from Metered Data to Unlimited Data. Note that changing the metering plan from Unlimited Data to Metered Data is not supported.
- You can enable and disable *Allow Classic Operations*.

Refer to the [ExpressRoute FAQ](expressroute-faqs.md) for more information on limits and limitations.

### To enable the ExpressRoute premium add-on

You can enable the ExpressRoute premium add-on for your existing circuit by using the following PowerShell cmdlet:

	Set-AzureDedicatedCircuitProperties -ServiceKey "*********************************" -Sku Premium

	Bandwidth                        : 1000
	CircuitName                      : TestCircuit
	Location                         : Silicon Valley
	ServiceKey                       : *********************************
	ServiceProviderName              : equinix
	ServiceProviderProvisioningState : Provisioned
	Sku                              : Premium
	Status                           : Enabled

Your circuit will now have the ExpressRoute premium add-on features enabled. Note that we will start billing you for the premium add-on capability as soon as the command has successfully run.

### To disable the ExpressRoute premium add-on

>[AZURE.IMPORTANT] This operation can fail if you're using resources that are greater than what is permitted for the standard circuit.

Note the following:

- You must ensure that the number of virtual networks linked to the circuit is less than 10 before you downgrade from premium to standard. If you don't do this, your update request will fail, and you'll be billed the premium rates.

- You must unlink all virtual networks in other geopolitical regions. If you don't do this, your update request will fail, and you'll be billed the premium rates.

- Your route table must be less than 4,000 routes for private peering. If your route table size is greater than 4,000 routes, the BGP session will drop and won't be reenabled until the number of advertised prefixes goes below 4,000.

You can disable the ExpressRoute premium add-on for your existing circuit by using the following PowerShell cmdlet:

	Set-AzureDedicatedCircuitProperties -ServiceKey "*********************************" -Sku Standard

	Bandwidth                        : 1000
	CircuitName                      : TestCircuit
	Location                         : Silicon Valley
	ServiceKey                       : *********************************
	ServiceProviderName              : equinix
	ServiceProviderProvisioningState : Provisioned
	Sku                              : Standard
	Status                           : Enabled



### To update the ExpressRoute circuit bandwidth

Check the [ExpressRoute FAQ](expressroute-faqs.md) for supported bandwidth options for your provider. You can pick any size that is greater than the size of your existing circuit.

>[AZURE.IMPORTANT] You cannot reduce the bandwidth of an ExpressRoute circuit without disruption. Downgrading bandwidth will require you to deprovision the ExpressRoute circuit and then reprovision a new ExpressRoute circuit.

After you decide what size you need, you can use the following command to resize your circuit:

	Set-AzureDedicatedCircuitProperties -ServiceKey ********************************* -Bandwidth 1000

	Bandwidth                        : 1000
	CircuitName                      : TestCircuit
	Location                         : Silicon Valley
	ServiceKey                       : *********************************
	ServiceProviderName              : equinix
	ServiceProviderProvisioningState : Provisioned
	Sku                              : Standard
	Status                           : Enabled

Your circuit will have been sized up on the Microsoft side. You must contact your connectivity provider to update configurations on their side to match this change. Note that we will start billing you for the updated bandwidth option from this point on.

## Deleting and deprovisioning an ExpressRoute circuit

Note the following:

- You must unlink all virtual networks from the ExpressRoute circuit for this operation to succeed. Check to see if you have any virtual networks that are linked to the circuit if this operation fails.

- If the ExpressRoute circuit service provider provisioning state is enabled, the status will move to *Disabling* from the enabled state. You must work with your service provider to deprovision the circuit on their side. We will continue to reserve resources and bill you until the service provider completes deprovisioning the circuit and sends us a notification.

- If the service provider has deprovisioned the circuit (the service provider provisioning state is set to *Not provisioned*) before you run the above cmdlet, we will deprovision the circuit and stop billing you.

You can delete your ExpressRoute circuit by running the following command:

	Remove-AzureDedicatedCircuit -ServiceKey "*********************************"



## Next steps

After you create your circuit, make sure that you do the following:

- [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-classic.md)
- [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-classic.md)
