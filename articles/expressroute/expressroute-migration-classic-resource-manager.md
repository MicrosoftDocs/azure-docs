---
title: 'Migrate ExpressRoute circuits and associated virtual networks from classic to Resource Manager: Azure | Microsoft Docs'
description: This page describes how to migrate a classic circuit and associated virtual networks to Resource Manager.
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
ms.date: 03/22/2017
ms.author: ganesr;cherylmc

---
# Migrate ExpressRoute circuits and associated virtual networks from the classic to the Resource Manager deployment model

This article explains how to migrate ExpressRoute circuits and associated virtual networks from the classic to resource manager deployment model. 


## Before you begin
* Verify that you have the latest version of the Azure PowerShell modules. For more information, see [how to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).
* Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.
* Review the information that is provided under [moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md). Make sure that you fully understand the limits and limitations.
* Verify that the circuit is fully operational in the classic deployment model.
* Ensure that you have a resource group that was created in the Resource Manager deployment model.


Review documentation on resource migration

* [Platform supported migration of IaaS resources from Classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager.md).
* [Technical Deep Dive on Platform supported migration from Classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager-deep-dive.md)
* [FAQs: Platform supported migration of IaaS resources from Classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager.md)
* [Review most common migration errors](../virtual-machines/virtual-machines-migration-errors.md)

## Supported and Unsupported scenarios

* **An ExpressRoute circuit can be migrated from classic to resource manager environment without any down time** - You can move any ExpressRoute circuit from classic to Resource manager environment with no down time. Follow instructions on [moving ExpressRoute circuits from the classic to the Resource Manager deployment model using PowerShell](expressroute-howto-move-arm.md). This is a prerequisite to move resources connected to the virtual network.
* **Virtual networks, gateways and associated deployments within the virtual network attached to an ExpressRoute in the same subscription can be migrated to the resource manager environment without any downtime** - You can follow steps described in the document below to migrate resources such as virtual networks, gateways and virtual machines deployed within the virtual network. You must ensure that the virtual networks are configured correctly before they are migrated. 
* **Virtual networks, gateways and associated deployments within the virtual network that is not in the same subscription as the ExpressRoute circuit will require some downtime to complete the migration** - The last section of the document describes the steps to be followed in order to migrate resources.

## Move an ExpressRoute circuit from classic to Resource Manager
You must move an expressRoute circuit from classic to resource manager environment before trying to migrate resources that are attached to the ExpressRoute circuit. You can follow the articles below to accomplish this task.

* Review the information that is provided under [moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md).
* [Move a circuit from classic to Resource Manager using Azure PowerShell](expressroute-howto-move-arm.md)
* **Using the Azure Service management portal** - You can follow the workflow to [create a new ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and select the import option. 

This operation does not involve any down time. You can continue to transfer data between your premises and Microsoft while the migration is in progress.

## Prepare your virtual network for migration
You must ensure that thee network of your virtual network to be migrated does not have any unnecessary artifacts. You can run the PowerShell cmdlet below to download your virtual network configuration and update it as needed.

	Add-AzureAccount
	Select-AzureSubscription -SubscriptionName <VNET Subscription>
	Get-AzureVNetConfig -ExportToFile C:\virtualnetworkconfig.xml
      
You must ensure that all references to <ConnectionsToLocalNetwork> are removed from the virtual networks that must be migrated. The snippet below shows you a sample network configuration.

	<VirtualNetworkSite name="MyVNet" Location="East US">
		<AddressSpace>
			<AddressPrefix>10.0.0.0/8</AddressPrefix>
		</AddressSpace>
		<Subnets>
			<Subnet name="Subnet-1">
				<AddressPrefix>10.0.0.0/11</AddressPrefix>
	        </Subnet>
	        <Subnet name="GatewaySubnet">
	        	<AddressPrefix>10.32.0.0/28</AddressPrefix>
	        </Subnet>
	    </Subnets>
	    <Gateway>
	    	<ConnectionsToLocalNetwork>
	        </ConnectionsToLocalNetwork>
		</Gateway>
	</VirtualNetworkSite>
 
If <ConnectionsToLocalNetwork> is not empty, you must delete the references under it and resubmit your network configuration. You can do so by running the following PowerShell cmdlet.

	Set-AzureVNetConfig -ConfigurationPath c:\virtualnetworkconfig.xml

## Migrate Virtual Networks, gateways and associated deployments in the same subscription as the ExpressRoute circuit
This section destribes the steps to be followed to migrate a virtual network, gateway and associated deployments in the same subscription as the ExpressRoute circuit. There will be no down time associated with this migration. You can continue to use all resources through the migration process. The management plane will be locked while the migration is in progress. 

1. **Ensure that the ExpressRoute circuit has been moved from classic to resource manager environment**
2. **Ensure that the virtual network has been prepared appropriately for the migration**
3. **Register your subscription for resource migration** - You can use the PowerShell snippet below to register your subscription for resource migration

		Select-AzureRmSubscription -SubscriptionName <Your Subscription Name>
		Register-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
		Get-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate

4. **Validate, prepare and migrate** - You can use the PowerShell snippet below to move the virtual network.

		Move-AzureVirtualNetwork -Prepare $vnetName  
		Move-AzureVirtualNetwork -Commit $vnetName

	You may also abort migration by running the following PowerShell cmdlet.

		Move-AzureVirtualNetwork -Abort $vnetName
 
## Migrate Virtual Networks, gateways and associated deployments in a different subscription from that of the ExpressRoute circuit


1. **Ensure that the ExpressRoute circuit has been moved from classic to resource manager environment**
2. **Ensure that the virtual network has been prepared appropriately for the migration**
3. **Ensure that the Expressroute circuit can operate in both classic and resource manager environment** - You can use the PowerShell script to allow the circuit to be used both in classic and resource manager environments. 

		Login-AzureRmAccount
		Select-AzureRmSubscription -SubscriptionName <My subscription>
		$circuit = Get-AzureRmExpressRouteCircuit -Name <CircuitName> -ResourceGroupName <ResourceGroup Name> 
		$circuit.AllowClassicOperations = $true
		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $circuit

4. **Create Authorizations in Resource Manager Environment** - You can follow instructions on how to create authorizations in the article that describes [how to link Virtual networks to ExpressRoute circuits](expressroute-howto-linkvnet-arm.md). The PowerShell snippet below lets you create an authorization.


		circuit = Get-AzureRmExpressRouteCircuit -Name <CircuitName> -ResourceGroupName <ResourceGroup Name> 
		Add-AzureRmExpressRouteCircuitAuthorization -ExpressRouteCircuit $circuit -Name "AuthorizationForMigration"
		Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $circuit
		$circuit = Get-AzureRmExpressRouteCircuit -Name MigrateCircuit -ResourceGroupName MigrateRGWest
		
		$id = $circuit.id 
		$auth1 = Get-AzureRmExpressRouteCircuitAuthorization -ExpressRouteCircuit $circuit -Name "AuthorizationForMigration"
		
		$key=$auth1.AuthorizationKey 

	Note the circuit ID and authorization key. These will be used to connect the circuit to virtual network once migration is complete.
  
5. **Delete the dedicated circuit link associated with the virtual network** -  The following cmdlet will let you remove the circuit link in the classic environment. 

		$skey = Get-AzureDedicatedCircuit | select ServiceKey
		Remove-AzureDedicatedCircuitLink -ServiceKey $skey -VNetName $vnetName  

6. **Register your subscription for resource migration** - You can use the PowerShell snippet below to register your subscription for resource migration

		Select-AzureRmSubscription -SubscriptionName <Your Subscription Name>
		Register-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
		Get-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate

7. **Validate, prepare and migrate** - You can use the PowerShell snippet below to move the virtual network.

		Move-AzureVirtualNetwork -Prepare $vnetName  
		Move-AzureVirtualNetwork -Commit $vnetName

	You may also abort migration by running the following PowerShell cmdlet.

		Move-AzureVirtualNetwork -Abort $vnetName

8. **Connect the Virtual network back to the ExpressRoute circuit** - The following PowerShell snipped is run in the context of the subscription in which the virtual network is created. You must not run this snippet in the subscription where the circuit is created. Use the circuit ID as PeerID and authorization key noted in step #4.

	Select-AzureRMSubscription –SubscriptionName <customer subscription>  
	$gw = Get-AzureRmVirtualNetworkGateway -Name $vnetName-Default-Gateway -ResourceGroupName ($vnetName + "-Migrated")
	$vnet = Get-AzureRmVirtualNetwork -Name $vnetName -ResourceGroup  ($vnetName + "-Migrated")  

	New-AzureRmVirtualNetworkGatewayConnection -Name  ($vnetName + "-GwConn") -ResourceGroupName ($vnetName + "-Migrated")  -Location $vnet.Location -VirtualNetworkGateway1 $gw -PeerId $id -ConnectionType ExpressRoute -AuthorizationKey $key

## Next Steps
* [Platform supported migration of IaaS resources from Classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager.md).
* [Technical Deep Dive on Platform supported migration from Classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager-deep-dive.md)
* [FAQs: Platform supported migration of IaaS resources from Classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager.md)
* [Review most common migration errors](../virtual-machines/virtual-machines-migration-errors.md)