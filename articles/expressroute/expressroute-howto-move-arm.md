<properties
   pageTitle="Move ExpressRoute circuits from classic to Resource Manager | Microsoft Azure"
   description="This page describes how to move a classic circuit to the Resource Manager deployment model."
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
   ms.date="07/19/2016"
   ms.author="ganesr"/>


# Move ExpressRoute circuits from the classic to the Resource Manager deployment model

## Configuration prerequisites

- You need the latest version of the Azure PowerShell modules (at least version 1.0).
- Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.
- Before preceding further, review information that is provided under [Moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md). Ensure that you have fully understood the limits and limitations of what's possible.
- If you want to move an Azure ExpressRoute circuit from the classic deployment model to the Azure Resource Manager deployment model, you must have the circuit fully configured and operational in the classic deployment model.
- Ensure that you have a resource group that was created in the Resource Manager deployment model.

## Move the ExpressRoute circuit to the Resource Manager deployment model

You must move an ExpressRoute circuit to the Resource Manager deployment model so that you can use it across both the classic and the Resource Manager deployment models. You can do this by running the following PowerShell commands.

### Step 1: Gather circuit details from the classic deployment model

You need to gather information about your ExpressRoute circuit first.

Sign in to the Azure classic environment, and gather the service key. You can use the following PowerShell snippet to gather the information:

	# Sign in to your Azure account
	Add-AzureAccount

	# Select the appropriate Azure subscription
	Select-AzureSubscription "<Enter Subscription Name here>"

	# Import the PowerShell modules for Azure and ExpressRoute
	Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Azure.psd1'
	Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\ExpressRoute\ExpressRoute.psd1'

	# Get the service keys of all your ExpressRoute circuits
	Get-AzureDedicatedCircuit

Copy the **service key** of the circuit that you want to move over to the Resource Manager deployment model.

### Step 2: Sign in to the Resource Manager environment, and create a new resource group

You can create a new resource group by using the following snippet:

	# Sign in to your Azure Resource Manager environment
	Login-AzureRmAccount

	# Select the appropriate Azure subscription
	Get-AzureRmSubscription -SubscriptionName "<Enter Subscription Name here>" | Select-AzureRmSubscription

	#Create a new resource group if you don't already have one
	New-AzureRmResourceGroup -Name "DemoRG" -Location "West US"

You can also use an existing resource group if you already have one.

### Step 3: Move the ExpressRoute circuit to the Resource Manager deployment model

You are now ready to move over your ExpressRoute circuit from the classic to the Resource Manager deployment model. Review the information provided under [Moving an ExpressRoute circuit from the classic to the Resource Manager deployment model](expressroute-move.md) before proceeding further.

You can do this by running the following snippet:

	Move-AzureRmExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "DemoRG" -Location "West US" -ServiceKey "<Service-key>"

>[AZURE.NOTE] After the move has finished, the new name that is listed in the previous cmdlet will be used to address the resource. The circuit will essentially be renamed.

## Enable an ExpressRoute circuit for both deployment models

You must move your ExpressRoute circuit to the Resource Manager deployment model before controlling access to the deployment model.

Run the following cmdlet to enable access to both deployment models:

    # Get details of the ExpressRoute circuit
    $ckt = Get-AzureRmExpressRouteCircuit -Name "DemoCkt" -ResourceGroupName "DemoRG"

    #Set "Allow Classic Operations" to TRUE
    $ckt.AllowClassicOperations = $true

    # Update circuit
    Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

After this operation has finished successfully, you will be able to view the circuit in the classic deployment model.

Run the following to get the details of the ExpressRoute circuit:

    get-azurededicatedcircuit

You must be able to see the service key listed. You can now manage links to the ExpressRoute circuit using your standard classic deployment model commands for classic VNets and your standard ARM commands for ARM VNETs. The following articles will walk you through how to manage links to the ExpressRoute circuit:

- [Link your virtual network to your ExpressRoute circuit in the Resource Manager deployment model](expressroute-howto-linkvnet-arm.md)
- [Link your virtual network to your ExpressRoute circuit in the classic deployment model](expressroute-howto-linkvnet-classic.md)


## Disable the ExpressRoute circuit to the classic deployment model

Run the following cmdlet to disable access to the classic deployment model:

    # Get details of the ExpressRoute circuit
    $ckt = Get-AzureRmExpressRouteCircuit -Name "DemoCkt" -ResourceGroupName "DemoRG"

    #Set "Allow Classic Operations" to FALSE
    $ckt.AllowClassicOperations = $false

    # Update circuit
    Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

After this operation has finished successfully, you will not be able to view the circuit in the classic deployment model.

## Next steps

After you create your circuit, make sure that you do the following:

- [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-arm.md)
- [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
