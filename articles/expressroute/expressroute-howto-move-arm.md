---
title: 'Move ExpressRoute circuits from classic to Resource Manager: PowerShell: Azure | Microsoft Docs'
description: This page describes how to move a classic circuit to the Resource Manager deployment model using PowerShell.
documentationcenter: na
services: expressroute
author: ganesr
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 08152836-23e7-42d1-9a56-8306b341cd91
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/03/2017
ms.author: ganesr;cherylmc

---
# Move ExpressRoute circuits from the classic to the Resource Manager deployment model using PowerShell

To use an ExpressRoute circuit for both the classic and Resource Manager deployment models, you must move the circuit to the Resource Manager deployment model. The following sections will walk you through the steps to move your circuit by using PowerShell.

## Before you begin
* Verify that you have the latest version of the Azure PowerShell modules (at least version 1.0). For more information, see [How to install and configure Azure PowerShell](/powershell/azure/overview).
* Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.
* Review the information that is provided under [Moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md). Make sure that you fully understand the limits and limitations.
* Verify that the circuit is fully operational in the classic deployment model.
* Ensure that you have a resource group that was created in the Resource Manager deployment model.

## Move an ExpressRoute circuit

### Step 1: Gather circuit details from the classic deployment model
Sign in to the Azure classic environment and gather the service key.

1. Sign in to your Azure account.

    	Add-AzureAccount

2. Select the appropriate Azure subscription.

    	Select-AzureSubscription "<Enter Subscription Name here>"

3. Import the PowerShell modules for Azure and ExpressRoute.

    	Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Azure.psd1'
    	Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\ExpressRoute\ExpressRoute.psd1'

4. Use the cmdlet below to get the service keys for all of your ExpressRoute circuits. After retrieving the keys, copy the **service key** of the circuit that you want to move to the Resource Manager deployment model.

    	Get-AzureDedicatedCircuit

### Step 2: Sign in and create a resource group
Sign in to the Resource Manager environment and create a new resource group.

1. Sign in to your Azure Resource Manager environment.

    	Login-AzureRmAccount

2. Select the appropriate Azure subscription.

    	Get-AzureRmSubscription -SubscriptionName "<Enter Subscription Name here>" | Select-AzureRmSubscription

3. Modify the snippet below to create a new resource group if you don't already have a resource group.

		New-AzureRmResourceGroup -Name "DemoRG" -Location "West US"

### Step 3: Move the ExpressRoute circuit to the Resource Manager deployment model
You are now ready to move your ExpressRoute circuit from the classic deployment model to the Resource Manager deployment model. Before proceeding, review the information provided in [Moving an ExpressRoute circuit from the classic to the Resource Manager deployment model](expressroute-move.md).

To move your circuit, modify and run the following snippet:

    Move-AzureRmExpressRouteCircuit -Name "MyCircuit" -ResourceGroupName "DemoRG" -Location "West US" -ServiceKey "<Service-key>"

> [!NOTE]
> After the move has finished, the new name that is listed in the previous cmdlet will be used to address the resource. The circuit will essentially be renamed.
> 

## Modify circuit access

### To enable ExpressRoute circuit access for both deployment models
After moving your classic ExpressRoute circuit to the Resource Manager deployment model, you can enable access to both deployment models. Run the following cmdlets to enable access to both deployment models:

1. Get the circuit details.

    	$ckt = Get-AzureRmExpressRouteCircuit -Name "DemoCkt" -ResourceGroupName "DemoRG"

2. Set "Allow Classic Operations" to TRUE.

    	$ckt.AllowClassicOperations = $true

3. Update the circuit. After this operation has finished successfully, you will be able to view the circuit in the classic deployment model.

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

4. Run the following cmdlet to get the details of the ExpressRoute circuit. You must be able to see the service key listed. 

		get-azurededicatedcircuit

5. You can now manage links to the ExpressRoute circuit using the classic deployment model commands for classic VNets, and the Resource Manager commands for Resource Manager VNets. The following articles will walk you through how to manage links to the ExpressRoute circuit:

	* [Link your virtual network to your ExpressRoute circuit in the Resource Manager deployment model](expressroute-howto-linkvnet-arm.md)
	* [Link your virtual network to your ExpressRoute circuit in the classic deployment model](expressroute-howto-linkvnet-classic.md)

### To disable ExpressRoute circuit access to the classic deployment model
Run the following cmdlets to disable access to the classic deployment model.

1. Get details of the ExpressRoute circuit.

		$ckt = Get-AzureRmExpressRouteCircuit -Name "DemoCkt" -ResourceGroupName "DemoRG"

2. Set "Allow Classic Operations" to FALSE.

		$ckt.AllowClassicOperations = $false

3. Update the circuit. After this operation has finished successfully, you will not be able to view the circuit in the classic deployment model.

		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt

## Next steps

* [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-arm.md)
* [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)

