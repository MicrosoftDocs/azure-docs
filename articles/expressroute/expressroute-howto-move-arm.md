<properties
   pageTitle="Moving ExpressRoute circuits from Classic to Resource Manager | Microsoft Azure"
   description="This page describes how to move a classiccircuit to the Resource Manager environment."
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

# Moving ExpressRoute circuits from Classic to Resource Manager Environment

## Configuration prerequisites

- You will need the latest version of the Azure PowerShell modules, version 1.0 or later. 
- Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md) page, [routing requirements](expressroute-routing.md) page and the [workflows](expressroute-workflows.md) page before you begin configuration.
-** Review information provided under [moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md) before proceeding further. Ensure that you have fully understood the limits and limitations of what's possible.**
- If you wish to move an ExpressRoute circuit from classic to Resource Manager environment, you must have the circuit fully configured and operational in the classic environment.
- Ensure that you have a Resource Group created in the Resource Manager environment. 

## Moving the ExpressRoute circuit from Classic to Resource Manager environment

You must move an ExpressRoute circuit to the Resource environment for you to be able to use it across both the classic and Resource Manager environments. You can accomplish the task by running the following PowerShell commands.

**Step 1. Gather Circuit details from the classic environment**

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
	    
Copy over the **service key** of the circuit you wish to move over to the Resource Manager environment.

**Step 2. Log in to the Resource Manager environment and create a new Resource Group**

You can create a new Resource Group using the following snippet. 

	# Log in to your Azure RM environment
	Login-AzureRmAccount
	
	# Select the appropriate Azure subscription
	Get-AzureRmSubscription -SubscriptionName "<Enter Subscription Name here>" | Select-AzureRmSubscription
	 
	#Create a new Resource Group if you don't already have one.
	New-AzureRmResourceGroup -Name "DemoRG" -Location "West US" 

You can also use an Existing Resouece Group if you already have one.

**Step 3. Move the ExpressRoute circuit to Resource Manager environment**

You are now ready to move over your ExpressRoute circuit from classic to Resource Manager environment. Review information provided under [moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md) before proceeding further.

You can accomplish this task by running the following snippet.

	Move-AzureRmExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "DemoRG" -Location "West US" -ServiceKey "<Service-key>"

>[AZURE.NOTE] Once the move is completed the new name listed in the above cmdlet will be used to address the resource going forward. The circuit will essentially be renamed.


## Enabling an ExpressRoute circuit to be configured from both Classic and Resource Manager Environments

You must move your ExpressRoute circuit to the Resource Manager environment before controlling access to environment.

Run the following cmdlet to enable access to both environments

    # Get details of the ExpressRoute circuit
    $ckt = Get-AzureRmExpressRouteCircuit -Name "DemoCkt" -ResourceGroupName "DemoRG"
    
    #Set "Allow Classic Operations" to TRUE
    $ckt.AllowClassicOperations = $true
    
    # Update Circuit
    Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
    
Once this operation is completed successfully, you will be able to view the circuit in the classic environment.

Run the following to get details of the ExpressRoute circuit.

    get-azurededicatedcircuit

You must be able to see the service key listed. You can now manage links to the ExpressRoute circuit. The following articles will walk you through how to manage links to the ExpressRoute circuit

- [Link your virtual network to your ExpressRoute circuit in Resource Manager environment](expressroute-howto-linkvnet-portal-arm.md)
- [Link your virtual network to your ExpressRoute circuit in Classic environment](expressroute-howto-linkvnet-portal-classic.md)


## Disabling the ExpressRoute circuit to be configured from both Classic and Resource Manager Environments

Run the following cmdlet to disable access to the classic environment

    # Get details of the ExpressRoute circuit
    $ckt = Get-AzureRmExpressRouteCircuit -Name "DemoCkt" -ResourceGroupName "DemoRG"
    
    #Set "Allow Classic Operations" to FALSE
    $ckt.AllowClassicOperations = $false
    
    # Update Circuit
    Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
    
Once this operation is completed successfully, you will not be able to view the circuit in the classic environment.

## Next steps

After you create your circuit, make sure that you do the following:

- [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-portal-arm.md)
- [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-portal-arm.md)