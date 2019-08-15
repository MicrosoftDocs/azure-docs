---
title: Move Azure Virtual Machines to new subscription or resource group | Microsoft Docs
description: Use Azure Resource Manager to move virtual machines to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 07/09/2019
ms.author: tomfitz
---

# Move guidance for virtual machines

This article describes the scenarios that aren't currently supported and the steps to move virtual machines with backup.

## Scenarios not supported

The following scenarios aren't yet supported:

* Managed Disks in Availability Zones can't be moved to a different subscription.
* Virtual Machines with certificate stored in Key Vault can be moved to a new resource group in the same subscription, but not across subscriptions.
* Virtual Machine Scale Sets with Standard SKU Load Balancer or Standard SKU Public IP can't be moved.
* Virtual machines created from Marketplace resources with plans attached can't be moved across resource groups or subscriptions. Deprovision the virtual machine in the current subscription, and deploy again in the new subscription.
* Virtual machines in an existing virtual network but you aren't moving all resources in the virtual network.

## Virtual machines with Azure Backup

To move virtual machines configured with Azure Backup, use the following workaround:

* Find the location of your Virtual Machine.
* Find a resource group with the following naming pattern: `AzureBackupRG_<location of your VM>_1` for example, AzureBackupRG_westus2_1
* If in Azure portal, then check "Show hidden types"
* If in PowerShell, use the `Get-AzResource -ResourceGroupName AzureBackupRG_<location of your VM>_1` cmdlet
* If in CLI, use the `az resource list -g AzureBackupRG_<location of your VM>_1`
* Find the resource with type `Microsoft.Compute/restorePointCollections` that has the naming pattern `AzureBackup_<name of your VM that you're trying to move>_###########`
* Delete this resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.
* After delete is complete, you can move the vault and virtual machine to the target subscription. After the move, you can continue backups with no loss in data.
* For information about moving Recovery Service vaults for backup, see [Recovery Services limitations](../../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json).

## Next steps

For commands to move resources, see [Move resources to new resource group or subscription](../resource-group-move-resources.md).
