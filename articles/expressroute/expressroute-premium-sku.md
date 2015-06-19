<properties 
   pageTitle="How to Enable or Disable ExpressRoute Premium Add-on | Microsoft Azure"
   description="How to enable or disable ExpressRoute Premium add-on for an ExpressRoute circuit. ExpressRoute Premium lets you add up to 10,000 routes for public and private peering and up to 10 virtual networks to your ExpressRoute Circuit. You can also link a virtual network in one region to a ExpressRoute circuit in another."
   services="expressroute"
   documentationCenter="na"
   authors="cherylmc"
   manager="jdial"
   editor="tysonn" />
<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/02/2015"
   ms.author="cherylmc" />

# Configure the ExpressRoute Premium add-on for your ExpressRoute circuit

ExpressRoute Premium is a collection of features listed below:

 - Increased routing table limit from 4000 routes to 10,000 routes for public peering and private peering.
 - Increased number of virtual networks (VNets) that can be connected to the ExpressRoute circuit (default is 10). 
 - Global connectivity over the Microsoft core network. You will now be able to link a VNet in one geopolitical region with an ExpressRoute circuit in another region. **Example:** You can link a VNet created in Europe West to an ExpressRoute circuit created in Silicon Valley.

Refer to the [ExpressRoute FAQ](expressroute-faqs.md) page for more information on ExpressRoute Premium add-on. Refer to the [Pricing Details](http://azure.microsoft.com/pricing/details/expressroute/) page for cost.

These instructions below will help you do the following:

- Create an ExpressRoute circuit with the Premium add-on enabled.
- Update an existing ExpressRoute circuit to enable the Premium add-on.
- Disable the ExpressRoute Premium add-on for a circuit.


## To create an ExpressRoute circuit with Premium add-on features enabled

###  Before you begin

Before you begin configuration, verify that you have the following prerequisites:

- An Azure subscription
- The latest version of Azure PowerShell

###  1. Import the PowerShell module for ExpressRoute

Windows PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. For more information, please refer to the PowerShell documentation in [MSDN](https://msdn.microsoft.com/library/windowsazure/jj156055.aspx).

Use the cmdlets below to import the PowerShell module for ExpressRoute:


	    Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Azure.psd1'
	    Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\ExpressRoute\ExpressRoute.psd1'


### 2. Configure a new ExpressRoute circuit with Premium add-on features enabled

You can create a new ExpressRoute circuit with the Premium add-on enabled at the time of creation. Follow the instructions on how to create ExpressRoute circuits with [NSPs](expressroute-configuring-nsps.md) or [EXPs](expressroute-configuring-exps.md). We have a new optional parameter in the New-AzureDedicatedCircuit cmdlet that lets you specify the SKU. The SKU can either be Standard or Premium. The default value is standard. Passing on the SKU as Premium will enable the circuit with the Premium add-on features.


		New-AzureDedicatedCircuit -CircuitName $CircuitName -ServiceProviderName $ServiceProvider -Bandwidth $Bandwidth -Location $Location -Sku Premium


### 3. Verify the ExpressRoute Premium add-on is enabled
You can check and see if the ExpressRoute Premium add-on is enabled for your circuit.
In the example below, the ExpressRoute circuit does not have ExpressRoute Premium add-on features enabled. The SKU will show up as ***Premium*** if the add-on is enabled.

		PS C:\> Get-AzureDedicatedCircuit -ServiceKey *********************************

		Bandwidth                        : 200
		CircuitName                      : TestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Standard
		Status                           : Enabled




## To enable the ExpressRoute Premium add-on for an existing ExpressRoute circuit
You can enable ExpressRoute Premium add-on features for any ExpressRoute circuit you have already created.


1. **Get details of the ExpressRoute Circuit**

	You can get details of your ExpressRoute circuit using the following PowerShell cmdlet:
		

    	PS C:\> Get-AzureDedicatedCircuit
	
	This command will return a list of all circuits you have created in the subscription. You can use the following command to get details of a specific ExpressRoute circuit if you have the service key with you

		 PS C:\> Get-AzureDedicatedCircuit -ServiceKey <skey>

	Replace the <skey> with the actual service key.
	
		PS C:\> Get-AzureDedicatedCircuit -ServiceKey *********************************

		Bandwidth                        : 200
		CircuitName                      : TestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Standard
		Status                           : Enabled


2. **Enable the ExpressRoute Premium add-on for the circuit**


	You can enable the ExpressRoute Premium add-on for your existing circuit using the following PowerShell cmdlet:
	
		PS C:\> Set-AzureDedicatedCircuitProperties -ServiceKey "*********************************" -Sku Premium
		
		Bandwidth                        : 1000
		CircuitName                      : TestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Premium
		Status                           : Enabled

	Your circuit will now have the ExpressRoute Premium add-on features enabled. Note that we will start billing you for the Premium add-on capability as soon as the command has successfully run.


## To disable the ExpressRoute Premium add-on for an ExpressRoute circuit

You can disable the ExpressRoute Premium add-on for an ExpressRoute circuit that has the Premium add-on enabled.

**Note**: You must make sure that you have stopped using the features listed in the Premium add-on feature list before you do so. We will fail your request to disable the Premium add-on if you have greater than 10 VNets linked to your circuit. You will also see that we will drop our BGP sessions if you advertise greater than 5000 routes to us once you disable the Premium add-on.

1. **Get the details of the ExpressRoute Circuit**

	You can get details of your ExpressRoute circuit using the following PowerShell cmdlet:
		

    	PS C:\> Get-AzureDedicatedCircuit
	
	This command will return a list of all circuits you have created in the subscription. You can use the following command to get details of a specific ExpressRoute circuit if you have the service key with you

		 PS C:\> Get-AzureDedicatedCircuit -ServiceKey <skey>

	Replace the <skey> with the actual service key.
	
		PS C:\> Get-AzureDedicatedCircuit -ServiceKey *********************************

		Bandwidth                        : 200
		CircuitName                      : TestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Premium
		Status                           : Enabled


3. **Disable the ExpressRoute Premium add-on for the circuit**


	You can disable the ExpressRoute Premium add-on for your existing circuit using the following PowerShell cmdlet:
	
		PS C:\> Set-AzureDedicatedCircuitProperties -ServiceKey "*********************************" -Sku Standard
		
		Bandwidth                        : 1000
		CircuitName                      : TestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Premium
		Status                           : Standard

	Your circuit will now have the ExpressRoute Premium add-on disabled.


 