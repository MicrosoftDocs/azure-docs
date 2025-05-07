---
title: 'Azure ExpressRoute: Migrate classic VNets to Resource Manager'
description: This page describes how to migrate ExpressRoute-associated virtual networks to Resource Manager after moving your circuit.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 12/28/2023
ms.author: duau

---
# Migrate ExpressRoute-associated virtual networks from classic to Resource Manager

This article explains how to migrate ExpressRoute-associated virtual networks from the classic deployment model to the Azure Resource Manager deployment model after moving your ExpressRoute circuit. 

## Before you begin

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

* Verify that you have the latest versions of the Azure PowerShell modules. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/). To install the PowerShell classic deployment model module (which is needed for the classic deployment model), see [Installing the Azure PowerShell classic deployment model Module](/powershell/azure/servicemanagement/install-azure-ps).
* Make sure that you review the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.
* Review the information that is provided under [Moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md). Make sure that you fully understand the limits and limitations.
* Verify that the circuit is fully operational in the classic deployment model.
* Ensure that you have a resource group that was created in the Resource Manager deployment model.
* Review the following resource-migration documentation:

	* [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-overview)
	* [Technical deep dive on platform-supported migration from classic to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-deep-dive)
	* [FAQs: Platform-supported migration of IaaS resources from classic to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-faq)
	* [Review most common migration errors and mitigations](/azure/virtual-machines/migration-classic-resource-manager-errors?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

## Supported and unsupported scenarios

* An ExpressRoute circuit can be moved from the classic to the Resource Manager environment without any downtime. You can move any ExpressRoute circuit from the classic to the Resource Manager environment with no downtime. Follow the instructions in [moving ExpressRoute circuits from the classic to the Resource Manager deployment model using PowerShell](expressroute-howto-move-arm.md).
* Virtual networks, gateways, and associated deployments within the virtual network that are attached to an ExpressRoute circuit in the same subscription can be migrated to the Resource Manager environment without any downtime. You can follow the steps described later to migrate resources such as virtual networks, gateways, and virtual machines deployed within the virtual network. You must ensure that the virtual networks are configured correctly before they're migrated. 
* Virtual networks, gateways, and associated deployments within the virtual network that aren't in the same subscription as the ExpressRoute circuit require some downtime to complete the migration. The last section of the document describes the steps to be followed to migrate resources.
* A virtual network with both ExpressRoute Gateway and VPN Gateway can't be migrated.
* ExpressRoute circuit cross-subscription migration isn't supported. For more information, see [Microsoft.Network move support](../azure-resource-manager/management/move-support-resources.md#microsoftnetwork).

## Move an ExpressRoute circuit from classic to Resource Manager
You must move an ExpressRoute circuit from the classic to the Resource Manager environment before you try to migrate resources that are attached to the ExpressRoute circuit. To accomplish this task, see the following articles:

* Review the information that is provided under [Moving an ExpressRoute circuit from classic to Resource Manager](expressroute-move.md).
* [Move a circuit from classic to Resource Manager using Azure PowerShell](expressroute-howto-move-arm.md).
* Use the Azure classic deployment model portal. You can follow the workflow to [create a new ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and select the import option. 

This operation doesn't involve downtime. You can continue to transfer data between your premises and Microsoft while the migration is in progress.

## Migrate virtual networks, gateways, and associated deployments

The steps you follow to migrate depend on whether your resources are in the same subscription, different subscriptions, or both.

### Migrate virtual networks, gateways, and associated deployments in the same subscription as the ExpressRoute circuit
This section describes the steps to be followed to migrate a virtual network, gateway, and associated deployments in the same subscription as the ExpressRoute circuit. No downtime is associated with this migration. You can continue to use all resources through the migration process. The management plane is locked while the migration is in progress. 

1. Ensure that the ExpressRoute circuit migrated from the classic to the Resource Manager environment.
2. Ensure that the virtual network gets prepared appropriately for the migration.
3. Register your subscription for resource migration. To register your subscription for resource migration, use the following PowerShell snippet:

   ```powershell 
   Select-AzSubscription -SubscriptionName <Your Subscription Name>
   Register-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
   Get-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
   ```
4. Validate, prepare, and migrate. To move the virtual network, use the following PowerShell snippet:

   ```powershell
   Move-AzureVirtualNetwork -Validate -VirtualNetworkName $vnetName
   Move-AzureVirtualNetwork -Prepare -VirtualNetworkName $vnetName
   Move-AzureVirtualNetwork -Commit -VirtualNetworkName $vnetName
   ```

   You can also abort migration by running the following PowerShell cmdlet:

   ```powershell
   Move-AzureVirtualNetwork -Abort $vnetName
   ```

## Next steps
* [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-overview)
* [Technical deep dive on platform-supported migration from classic to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-deep-dive)
* [FAQs: Platform-supported migration of IaaS resources from classic to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-faq)
* [Review most common migration errors and mitigations](/azure/virtual-machines/migration-classic-resource-manager-errors?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)