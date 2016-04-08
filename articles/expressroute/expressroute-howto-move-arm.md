<properties
   pageTitle="Moving ExpressRoute circuits from Classic to Resource Manager | Microsoft Azure"
   description="This page describes how to move a classiccircuit to the Resource Manager deployment model."
   documentationCenter="na"
   services="expressroute"
   authors="ganesr"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/01/2016"
   ms.author="ganesr"/>

# Moving ExpressRoute circuits from Classic to Resource Manager deployment model

## Configuration prerequisites

- You will need the latest version of the Azure PowerShell modules, version 1.0 or later. 
- Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md) page, [routing requirements](expressroute-routing.md) page and the [workflows](expressroute-workflows.md) page before you begin configuration.
-** Review information provided under [moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md) before proceeding further. Ensure that you have fully understood the limits and limitations of what's possible.**
- If you wish to move an ExpressRoute circuit from classic to Resource Manager deployment model, you must have the circuit fully configured and operational in the classic deployment model.
- Ensure that you have a Resource Group created in the Resource Manager deployment model. 

## Moving the ExpressRoute circuit to Resource Manager deployment model

You must move an ExpressRoute circuit to the Resource Manager deployment model for you to be able to use it across both the classic and Resource Manager deployment models. You can accomplish the task by running the following PowerShell commands.

**Step 1. Gather Circuit details from the classic deployment model**

You must gather information on your ExpressRoute circuit first. 

Logon to the Azure Classic environment and gather the service key. You can use the following PowerShell snippet to gather the information.

	# Log in to your Azure Account
	Add-AzureAccount

	# Select the appropriate Azure subscription
	Select-AzureSubscription "<Enter Subscription Name here>"
	
	# Import the PowerShell modules for Azure and ExpressRoute
	Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Azure.psd1'
	Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\ExpressRoute\ExpressRoute.psd1'
	    
	# Get the service keys of all your ExpressRoute circuits
	Get-AzureDedicatedCircuit
	    
Copy over the **service key** of the circuit you wish to move over to the Resource Manager deployment model.

**Step 2. Log in to the Resource Manager environment and create a new Resource Group**

You can create a new Resource Group using the following snippet. 

	# Log in to your Azure Resource Manager deployment model
	Login-AzureRmAccount
	
	# Select the appropriate Azure subscription
	Get-AzureRmSubscription -SubscriptionName "<Enter Subscription Name here>" | Select-AzureRmSubscription
	 
	#Create a new Resource Group if you don't already have one.
	New-AzureRmResourceGroup -Name "DemoRG" -Location "West US" 

You can also use an Existing Resouece Group if you already have one.

**Step 3. Move the ExpressRoute circuit to Resource Manager deployment model**

You are now ready to move over your ExpressRoute circuit from classic to Resource Manager deployment model. Review information provided under [moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md) before proceeding further.

You can accomplish this task by running the following snippet.

	Move-AzureRmExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "DemoRG" -Location "West US" -ServiceKey "<Service-key>"

>[AZURE.NOTE] Once the move is completed the new name listed in the above cmdlet will be used to address the resource going forward. The circuit will essentially be renamed.

## Enabling an ExpressRoute circuit for both deployment models

You must move your ExpressRoute circuit to the Resource Manager deployment model before controlling access to deployment model.

Run the following cmdlet to enable access to both deployment models

    # Get details of the ExpressRoute circuit
    $ckt = Get-AzureRmExpressRouteCircuit -Name "DemoCkt" -ResourceGroupName "DemoRG"
    
    #Set "Allow Classic Operations" to TRUE
    $ckt.AllowClassicOperations = $true
    
    # Update Circuit
    Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
    
Once this operation is completed successfully, you will be able to view the circuit in the classic deployment model.

Run the following to get details of the ExpressRoute circuit.

    get-azurededicatedcircuit

You must be able to see the service key listed. You can now manage links to the ExpressRoute circuit. The following articles will walk you through how to manage links to the ExpressRoute circuit

- [Link your virtual network to your ExpressRoute circuit in Resource Manager deployment model](expressroute-howto-linkvnet-arm.md)
- [Link your virtual network to your ExpressRoute circuit in Classic deployment model](expressroute-howto-linkvnet-classic.md)


## Disabling the ExpressRoute circuit to Classic deployment model

Run the following cmdlet to disable access to the classic deployment model

    # Get details of the ExpressRoute circuit
    $ckt = Get-AzureRmExpressRouteCircuit -Name "DemoCkt" -ResourceGroupName "DemoRG"
    
    #Set "Allow Classic Operations" to FALSE
    $ckt.AllowClassicOperations = $false
    
    # Update Circuit
    Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
    
Once this operation is completed successfully, you will not be able to view the circuit in the classic deployment model.

## Next steps

After you create your circuit, make sure that you do the following:

- [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-arm.md)
- [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
