---
title: Migrate to an availability zone-enabled ExpressRoute virtual network gateway using PowerShell
titleSuffix: Azure ExpressRoute
description: Learn how to migrate from Standard, HighPerformance, or UltraPerformance SKUs to availability zone-enabled SKUs (ErGw1Az, ErGw2Az, ErGw3Az) using PowerShell.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 11/06/2025
ms.author: duau
---

# Migrate to an availability zone-enabled ExpressRoute virtual network gateway using PowerShell

This article shows you how to migrate an ExpressRoute virtual network gateway from Standard, HighPerformance, or UltraPerformance SKUs to availability zone-enabled SKUs (ErGw1Az, ErGw2Az, ErGw3Az) using PowerShell. Higher-level SKUs provide more CPUs and network bandwidth, resulting in higher network throughput and more dependable connections to your virtual network. 

## Prerequisites

Before you begin, make sure you have:

- Reviewed the [Gateway migration](gateway-migration.md) article for important migration considerations.
- An existing [ExpressRoute virtual network gateway](expressroute-howto-add-gateway-portal-resource-manager.md) using Standard, HighPerformance, or UltraPerformance SKU.
- Azure PowerShell installed. For more information, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

### Working with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

## Migrate to a new gateway using PowerShell

The migration process uses PowerShell scripts to create a new gateway, transfer the configuration, and remove the old gateway.

### Clone the migration scripts

1. Clone the migration scripts from the Azure samples repository:

   ```azurepowershell-interactive
   git clone https://github.com/Azure-Samples/azure-docs-powershell-samples/ 
   ```

1. Navigate to the ExpressRoute gateway migration directory:

   ```azurepowershell-interactive
   cd azure-docs-powershell-samples/expressroute-gateway/gateway-migration/
   ```

### Prepare the migration

The PrepareMigration script creates a new ExpressRoute virtual network gateway on the same gateway subnet and connects it to your existing ExpressRoute circuits.

1. Get the resource ID of your existing gateway:

    ```azurepowershell-interactive
   $resource = Get-AzResource -Name <gateway-name>
   $resource.Id
    ```

   Replace `<gateway-name>` with the name of your virtual network gateway.

1. Run the **PrepareMigration.ps1** script:

    ```azurepowershell-interactive
   .\PrepareMigration.ps1
    ```

1. When prompted, enter the following information:
   - Resource ID of your gateway
   - Name suffix for your new resources (this name is appended to the existing name, for example: `existingresourcename_newname`)
   - Availability zone for your new gateway 

### Run the migration

The migration script transfers the configuration from the old gateway to the new gateway.

1. Get the resource ID of your new gateway using the name you specified in the prepare step:

    ```azurepowershell-interactive
   $resource = Get-AzResource -Name <new-gateway-name>
   $resource.Id
    ```

   Replace `<new-gateway-name>` with the name of your new virtual network gateway.

1. Run the **Migration.ps1** script:

    ```azurepowershell-interactive
    .\Migration.ps1
    ```

1. When prompted, enter the following information:
   - Resource ID of your original gateway
   - Resource ID of your new gateway

### Commit the migration

The commit script removes the old gateway and its connections after you verify that the new gateway is working correctly.

> [!IMPORTANT]
> Before you run this step, verify that your new virtual network gateway has a working ExpressRoute connection. The migration process can cause a brief interruption of up to 3 minutes.

1. Run the **CommitMigration.ps1** script:

    ```azurepowershell-interactive
    .\CommitMigration.ps1
    ```

1. When prompted, enter the resource ID of your original gateway.

## Related content

- [About ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md)
- [Gateway migration overview](gateway-migration.md)
