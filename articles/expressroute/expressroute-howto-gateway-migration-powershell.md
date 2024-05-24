---
title: Migrate to an availability zone-enabled ExpressRoute virtual network gateway using PowerShell
titleSuffix: Azure ExpressRoute
description: This article explains how to seamlessly migrate from Standard/HighPerf/UltraPerf SKUs to ErGw1/2/3AZ SKUs using PowerShell.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom: ignite-2023, devx-track-azurepowershell
ms.topic: how-to
ms.date: 04/26/2024
ms.author: duau
---

# Migrate to an availability zone-enabled ExpressRoute virtual network gateway using PowerShell

When you create an ExpressRoute virtual network gateway, you need to choose the [gateway SKU](expressroute-about-virtual-network-gateways.md#gateway-types). If you choose a higher-level SKU, more CPUs and network bandwidth are allocated to the gateway. As a result, the gateway can support higher network throughput and more dependable network connections to the virtual network. 

The following SKUs are available for ExpressRoute virtual network gateways:

* Standard
* HighPerformance
* UltraPerformance
* ErGw1Az
* ErGw2Az
* ErGw3Az
* ErGwScale (Preview)

## Prerequisites

- Review the [Gateway migration](gateway-migration.md) article before you begin.
- You must have an existing [ExpressRoute Virtual network gateway](expressroute-howto-add-gateway-portal-resource-manager.md) in your Azure subscription.

### Working with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

## Migrate to a new gateway in using PowerShell

Here are the steps to migrate to a new gateway using PowerShell.

### Clone the script

1. Clone the setup script from GitHub.

   ```azurepowershell-interactive
   git clone https://github.com/Azure-Samples/azure-docs-powershell-samples/ 
   ```

1. Change to the directory where the script is located.

   ```azurepowershell-interactive
   CD azure-docs-powershell-samples/expressroute-gateway/
   ```
### Prepare the migration

This script creates a new ExpressRoute virtual network gateway on the same gateway subnet and connects it to your existing ExpressRoute circuits.

1. Identify the resource ID of the gateway that will be migrated. 

    ```azurepowershell-interactive
   $resourceId = Get-AzResource -Name {virtual network gateway name}
   $resourceId.Id
    ```
1. Run the **PrepareMigration.ps1** script to prepare the migration. 

    ```azurepowershell-interactive
   gateway-migration/preparemigration.ps1
    ```
1. Enter the resource ID of your gateway.
1. The gateway subnet needs two or more address prefixes for the migration. If you have only one prefix, you're prompted to enter an additional prefix. 
1. Choose a name for your new resources, the new resource name will be added to the existing name. For example: existingresourcename_newname.
1. Enter an availability zone for your new gateway. 


### Run the migration

This script transfers the configuration from the old gateway to the new one.

1. Identify the resource ID of your new post-migration gateway. Use the resource name you given for this gateway in the previous step. 

    ```azurepowershell-interactive
   $resourceId = Get-AzResource -Name {virtual network gateway name}
   $resourceId.Id
    ```
1.  Run the **Migration.ps1** script to perform the migration. 

    ```azurepowershell-interactive
    gateway-migration/migration.ps1
    ```
1. Enter the resource ID of your premigration gateway.
1. Enter the resource ID of your post-migration gateway.

### Commit the migration

This script deletes the old gateway and its connections.

1. Run the **CommitMigration.ps1** script to complete the migration. 

    ```azurepowershell-interactive
   gateway-migration/commitmigration.ps1
    ```
1. Enter the resource ID of the premigration gateway.

    >[!IMPORTANT]
    > - Before running this step, verify that the new virtual network gateway has a working ExpressRoute connection.
    > - When migrating your gateway, you can expect possible interruption for a maximum of 30 seconds.




## Next steps

* Learn more about [designing for high availability](designing-for-high-availability-with-expressroute.md).
* Plan for [disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md) and [using VPN as a backup](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).
