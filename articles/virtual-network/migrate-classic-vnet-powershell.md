---
title: Migrate a virtual network from classic to Resource Manager - Azure PowerShell
titlesuffix: Azure Virtual Network
description: Learn about migrating a virtual network from the classic deployment model to the Resource Manager model.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 01/25/2022
ms.custom: template-how-to, devx-track-azurepowershell
---

# Migrate an Azure Virtual Network from classic to Resource Manager using Azure PowerShell

In this article, you'll learn how to migrate from the classic deployment model to the newer Resource Manager deployment model.

Migration from classic to Resource Manager is completed one virtual network at a time. There isn't an additional requirement for tools or prerequisites to migration, other than the Azure PowerShell requirements. The migration is a control plane migration of virtual network resource. There isn't a data path downtime during migration. Existing workloads will continue to function without loss of connectivity during the migration. Any public IP addresses associated with the virtual network don't change during the migration process. 

When the migration is completed, all management operations must be performed using the Resource Manager model. Management operations are only accessible via the Resource Manager deployment model. Subnet or virtual network resource changes will no longer be available via the old deployment model.

When you migrate the virtual network from the classic to Resource Manager model, the supported resources within the virtual network are automatically migrated to the new model.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- The steps and examples in this article use Azure PowerShell Az module. To install the Az modules locally on your computer, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell). To learn more about the new Az module, see [Introducing the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az). PowerShell cmdlets are updated frequently. If you aren’t running the latest version, the values specified in the instructions may fail. To find the installed versions of PowerShell on your system, use the cmdlet Get-Module -ListAvailable Az cmdlet.
- To migrate a virtual network with an application gateway, remove the gateway before you run a prepare operation to move the network. After you complete the migration, reconnect the gateway in Azure Resource Manager.
- Verify that you’ve installed both the classic and Az Azure PowerShell modules locally on your computer. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/).
- Azure ExpressRoute gateways that connect to ExpressRoute circuits in another subscription can't be migrated automatically. In these cases, remove the ExpressRoute gateway, migrate the virtual network, and re-create the gateway.

## Supported scenarios

The following scenarios are supported for a classic to Resource Manager migration:

* Classic Virtual Networks containing virtual machines.

* Classic Virtual Networks with one availability set per cloud service at the most.

* Classic Virtual Networks that contain Azure AD Domain services.

* Classic Virtual Networks with a single VPN gateway or a single Express Route circuit.

## Unsupported scenarios

The following scenarios are unsupported for migration:

* Managing the life cycle of a virtual network from the classic deployment model.

* Azure role-based access control support for the classic deployment model. 

* Virtual Network migration with both ExpressRoute gateway and VPN gateway.

* Migration of Virtual Networks with more than one availability set in a single cloud service.

* Migration of Virtual Networks with one or more availability sets and virtual machines that aren't in an availability set in a single cloud service.

* Application gateway migration from classic to Resource Manager. 

## Register resource provider

In this section, you'll sign in to your subscription using the Resource Manager cmdlets and register the migration resource provider.

1. Sign in to Azure PowerShell:

    ```azurepowershell
    Connect-AzAccount

    ```

2. Register the migration resource provider:

    ```azurepowershell
    Register-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate

    ```

    Wait five minutes for the registration to finish. Check the status of the registration by using the following command:

    ```azurepowershell
    Get-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate

    ```

    Ensure that **RegistrationState** is `Registered` before you proceed.

    > [!NOTE]
    > Registration is a one-time step, but you must do it once before you attempt migration. Without registering, you'll see the following error message:
    >
    > **BadRequest : Subscription is not registered for migration.**

## Retrieve the virtual network name to be migrated

In this section, you'll sign in to the classic deployment model PowerShell and retrieve the name of the virtual network to be migrated.

1. Sign in to the classic deployment PowerShell:

    ```azurepowershell
    Add-AzureAccount

    ```

2. Run the following command to retrieve the classic virtual network name:

    ```azurepowershell
    Get-AzureVnetSite | Select -Property Name

    ```
Make note of the name of the virtual network for the next section.

## Migrate the virtual network

In this section, you'll validate that the migration can proceed and then prepare the migration.

1. Place the name of the virtual network you noted in the previous section into a variable for use by the commands. Replace **myVNet** with the name of the virtual network you retrieved in the previous section:

    ```azurepowershell
    $vnetname = "myVNet"

    ```

2. Validate you can migrate the virtual network by running the following command:

    ```azurepowershell
    Move-AzureVirtualNetwork -Validate -VirtualNetworkName $vnetName

    ```

    The command will display any warnings or errors that block migration. If validation is successful, you can proceed with the following prepare step.

    > [!NOTE]
    > If the virtual network contains web or worker roles, or virtual machines with unsupported configurations, you'll get a validation error message.

3. Run the following command to prepare the virtual network for migration:

    ```azurepowershell
    Move-AzureVirtualNetwork -Prepare -VirtualNetworkName $vnetName

    ```

    If you're not ready for migration and you want to go back to the old state, use the following command:

    ```azurepowershell
    Move-AzureVirtualNetwork -Abort -VirtualNetworkName $vnetName
    ```

## Commit the migration

If everything looks good in the prepared configuration, you can commit the migration by running the following command:

```azurepowershell
Move-AzureVirtualNetwork -Commit -VirtualNetworkName $vnetName

```

## Next steps

For more information on migrating resources in Azure from classic to Resource Manager, see:

- [Overview of platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/migration-classic-resource-manager-overview.md).
- [Review the most frequently asked questions about migrating IaaS resources from classic to Azure Resource Manager](../virtual-machines/migration-classic-resource-manager-faq.yml).
- [Planning for migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/migration-classic-resource-manager-plan.md).
