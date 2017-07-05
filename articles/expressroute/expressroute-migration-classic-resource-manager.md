---
title: 'Migrate ExpressRoute associated virtual networks from classic to Resource Manager: Azure: PowerShell | Microsoft Docs'
description: This page describes how to migrate associated virtual networks to Resource Manager after moving your circuit.
documentationcenter: na
services: expressroute
author: ganesr
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/02/2017
ms.author: ganesr;cherylmc

---
# Migrate ExpressRoute associated virtual networks from classic to Resource Manager

This article explains how to migrate Azure ExpressRoute associated virtual networks from the classic deployment model to the Azure Resource Manager deployment model after moving your ExpressRoute circuit. 


## Before you begin
* Verify that you have the latest version of the Azure PowerShell modules. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/overview).
* Make sure that you have reviewed the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.
* Review the information that is provided under [Moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md). Make sure that you fully understand the limits and limitations.
* Verify that the circuit is fully operational in the classic deployment model.
* Ensure that you have a resource group that was created in the Resource Manager deployment model.
* Review the following resource-migration documentation:

	* [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager.md)
	* [Technical deep dive on platform-supported migration from classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager-deep-dive.md)
	* [FAQs: Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager.md)
	* [Review most common migration errors and mitigations](../virtual-machines/windows/migration-classic-resource-manager-errors.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

## Supported and unsupported scenarios

* An ExpressRoute circuit can be moved from the classic to the Resource Manager environment without any downtime. You can move any ExpressRoute circuit from the classic to the Resource Manager environment with no downtime. Follow the instructions in [moving ExpressRoute circuits from the classic to the Resource Manager deployment model using PowerShell](expressroute-howto-move-arm.md). This is a prerequisite to move resources connected to the virtual network.
* Virtual networks, gateways, and associated deployments within the virtual network that are attached to an ExpressRoute circuit in the same subscription can be migrated to the Resource Manager environment without any downtime. You can follow the steps described later to migrate resources such as virtual networks, gateways, and virtual machines deployed within the virtual network. You must ensure that the virtual networks are configured correctly before they are migrated. 
* Virtual networks, gateways, and associated deployments within the virtual network that are not in the same subscription as the ExpressRoute circuit require some downtime to complete the migration. The last section of the document describes the steps to be followed to migrate resources.
* A virtual network with both ExpressRoute Gateway and VPN Gateway can't be migrated.

## Move an ExpressRoute circuit from classic to Resource Manager
You must move an ExpressRoute circuit from the classic to the Resource Manager environment before you try to migrate resources that are attached to the ExpressRoute circuit. To accomplish this task, see the following articles:

* Review the information that is provided under [Moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md).
* [Move a circuit from classic to Resource Manager using Azure PowerShell](expressroute-howto-move-arm.md).
* Use the Azure Service Management portal. You can follow the workflow to [create a new ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and select the import option. 

This operation does not involve downtime. You can continue to transfer data between your premises and Microsoft while the migration is in progress.

## Prepare your virtual network for migration
You must ensure that the network of your virtual network to be migrated does not have unnecessary artifacts. To download your virtual network configuration and update it as needed, run the following PowerShell cmdlet:

```powershell
Add-AzureAccount
Select-AzureSubscription -SubscriptionName <VNET Subscription>
Get-AzureVNetConfig -ExportToFile C:\virtualnetworkconfig.xml
```
      
You must ensure that all references to `<ConnectionsToLocalNetwork>` are removed from the virtual networks to be migrated. A sample network configuration is shown in the following snippet. Notice that there are no references between the `<ConnectionsToLocalNetwork>` lines:

```
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
```
 
If `<ConnectionsToLocalNetwork>` is not empty, delete the references under it and resubmit your network configuration. You can do so by running the following PowerShell cmdlet:

```powershell
Set-AzureVNetConfig -ConfigurationPath c:\virtualnetworkconfig.xml
```

## Migrate virtual networks, gateways, and associated deployments

The steps you follow to migrate depend on whether your resources are in the same subscription, different subscriptions, or both.

### Migrate virtual networks, gateways, and associated deployments in the same subscription as the ExpressRoute circuit
This section describes the steps to be followed to migrate a virtual network, gateway, and associated deployments in the same subscription as the ExpressRoute circuit. No downtime is associated with this migration. You can continue to use all resources through the migration process. The management plane is locked while the migration is in progress. 

1. Ensure that the ExpressRoute circuit has been moved from the classic to the Resource Manager environment.
2. Ensure that the virtual network has been prepared appropriately for the migration.
3. Register your subscription for resource migration. To register your subscription for resource migration, use the following PowerShell snippet:

  ```powershell 
  Select-AzureRmSubscription -SubscriptionName <Your Subscription Name>
  Register-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
  Get-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
  ```
4. Validate, prepare, and migrate. To move the virtual network, use the following PowerShell snippet:

  ```powershell
  Move-AzureVirtualNetwork -Prepare $vnetName  
  Move-AzureVirtualNetwork -Commit $vnetName
  ```

  You can also abort migration by running the following PowerShell cmdlet:

  ```powershell
  Move-AzureVirtualNetwork -Abort $vnetName
  ```

### Migrate virtual networks, gateways, and associated deployments in a different subscription from that of the ExpressRoute circuit

1. Ensure that the ExpressRoute circuit has been moved from the classic to the Resource Manager environment.
2. Ensure that the virtual network has been prepared appropriately for the migration.
3. Ensure that the ExpressRoute circuit can operate in both the classic and the Resource Manager environment. To allow the circuit to be used in both classic and Resource Manager environments, use the following PowerShell script:

  ```powershell
  Login-AzureRmAccount
  Select-AzureRmSubscription -SubscriptionName <My subscription>
  $circuit = Get-AzureRmExpressRouteCircuit -Name <CircuitName> -ResourceGroupName <ResourceGroup Name> 
  $circuit.AllowClassicOperations = $true
  Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $circuit
  ```
4. Create authorizations in the Resource Manager environment. To learn how to create authorizations, see [how to link virtual networks to ExpressRoute circuits](expressroute-howto-linkvnet-arm.md). To create an authorization, use the following PowerShell snippet:

  ```powershell
  circuit = Get-AzureRmExpressRouteCircuit -Name <CircuitName> -ResourceGroupName <ResourceGroup Name> 
  Add-AzureRmExpressRouteCircuitAuthorization -ExpressRouteCircuit $circuit -Name "AuthorizationForMigration"
  Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $circuit
  $circuit = Get-AzureRmExpressRouteCircuit -Name MigrateCircuit -ResourceGroupName MigrateRGWest

  $id = $circuit.id 
  $auth1 = Get-AzureRmExpressRouteCircuitAuthorization -ExpressRouteCircuit $circuit -Name "AuthorizationForMigration"

  $key=$auth1.AuthorizationKey 
 ```

	Note the circuit ID and authorization key. These elements are used to connect the circuit to the virtual network after the migration is complete.
  
5. Delete the dedicated circuit link that's associated with the virtual network. To remove the circuit link in the classic environment, use the following cmdlet:

  ```powershell
  $skey = Get-AzureDedicatedCircuit | select ServiceKey
  Remove-AzureDedicatedCircuitLink -ServiceKey $skey -VNetName $vnetName
  ```  

6. Register your subscription for resource migration. To register your subscription for resource migration, use the following PowerShell snippet:

  ```powershell
  Select-AzureRmSubscription -SubscriptionName <Your Subscription Name>
  Register-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
  Get-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
  ```
7. Validate, prepare, and migrate. To move the virtual network, use the following PowerShell snippet:

  ```powershell
  Move-AzureVirtualNetwork -Prepare $vnetName  
  Move-AzureVirtualNetwork -Commit $vnetName
  ```

	You can also abort migration by running the following PowerShell cmdlet:

  ```powershell
  Move-AzureVirtualNetwork -Abort $vnetName
  ```
8. Connect the virtual network back to the ExpressRoute circuit. The following PowerShell snippet is run in the context of the subscription in which the virtual network is created. You must not run this snippet in the subscription where the circuit is created. Use the circuit ID as PeerID and authorization key noted in step 4.

  ```powershell
  Select-AzureRMSubscription –SubscriptionName <customer subscription>  
  $gw = Get-AzureRmVirtualNetworkGateway -Name $vnetName-Default-Gateway -ResourceGroupName ($vnetName + "-Migrated")
  $vnet = Get-AzureRmVirtualNetwork -Name $vnetName -ResourceGroup  ($vnetName + "-Migrated")  

  New-AzureRmVirtualNetworkGatewayConnection -Name  ($vnetName + "-GwConn") -ResourceGroupName ($vnetName + "-Migrated")  -Location $vnet.Location -VirtualNetworkGateway1 $gw -PeerId $id -ConnectionType ExpressRoute -AuthorizationKey $key
  ```

## Next steps
* [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager.md)
* [Technical deep dive on platform-supported migration from classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager-deep-dive.md)
* [FAQs: Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/virtual-machines-windows-migration-classic-resource-manager.md)
* [Review most common migration errors and mitigations](../virtual-machines/windows/migration-classic-resource-manager-errors.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
