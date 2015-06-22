<properties 
   pageTitle="Upgrade ExpressRoute Bandwidth Dynamically | Microsoft Azure"
   description="How to dynamically increase the bandwidth size of an ExpressRoute circuit with no downtime. "
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
   ms.date="06/03/2015"
   ms.author="cherylmc" />

# Upgrade your ExpressRoute circuit bandwidth dynamically with no downtime

You can increase the size of an ExpressRoute circuit without any downtime. These instructions will help you update the bandwidth of an ExpressRoute circuit using PowerShell. Refer to the [ExpressRoute FAQ](expressroute-faqs.md) page for more information on limits and limitations. 

##  Configuration prerequisites

Before you begin configuration, verify that you have the following prerequisites:

- An Azure subscription
- The latest version of Azure PowerShell
- An active ExpressRoute circuit that has been configured and is in operation


##  Configuring settings using PowerShell

Windows PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. For more information please refer to the PowerShell documentation in [MSDN](https://msdn.microsoft.com/library/windowsazure/jj156055.aspx).

1. **Import the PowerShell module for ExpressRoute.**

	    Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Azure.psd1'
	    Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\ExpressRoute\ExpressRoute.psd1'

2. **Get the details of the ExpressRoute circuit**

	You can get the details of your ExpressRoute circuit using the following PowerShell Commandlet:
		

    	PS C:\> Get-AzureDedicatedCircuit
	
	This command will return a list of all circuits you have created in the subscription. You can use the following command to get details of a specific ExpressRoute circuit if you have the service key with you:

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


3. **Increase the bandwidth of the ExpressRoute circuit on the Microsoft side**
	
	Check the [ExpressRoute FAQ](expressroute-faqs.md) page for supported bandwidth options for your provider. You can pick any size greater than the size of your existing circuit. Once you decided what size you need, you can use the following command to resize your circuit.

		PS C:\> Set-AzureDedicatedCircuitProperties -ServiceKey ********************************* -Bandwidth 1000
		
		Bandwidth                        : 1000
		CircuitName                      : TestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Standard
		Status                           : Enabled

	Your circuit will have been sized up on the Microsoft side. Note that we will start billing you for the updated bandwidth option from this point on.

4. **Increase the bandwidth of the ExpressRoute circuit on the service provider side**

	Contact your connectivity provider (NSP / EXP) and provided them with information on the updated bandwidth. Follow the order update process prescribed by your service provider to complete the task.

 