---
title: Move Azure resources to new subscription or resource group | Microsoft Docs
description: Use Azure Resource Manager to move resources to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 06/24/2019
ms.author: tomfitz
---

# Virtual Machines limitations

You can move virtual machines with the managed disks, managed images, managed snapshots, and availability sets with virtual machines that use managed disks. Managed Disks in Availability Zones can't be moved to a different subscription.

## Not supported scenarios

The following scenarios aren't yet supported:

* Managed Disks in Availability Zones can't be moved to a different subscription.
* Virtual Machines with certificate stored in Key Vault can be moved to a new resource group in the same subscription, but not across subscriptions.
* Virtual Machine Scale Sets with Standard SKU Load Balancer or Standard SKU Public IP can't be moved.
* Virtual machines created from Marketplace resources with plans attached can't be moved across resource groups or subscriptions. Deprovision the virtual machine in the current subscription, and deploy again in the new subscription.
* Virtual machines in an existing Virtual Network where the user does not intend to move all resources in the Virtual Network.

## Virtual machines with Azure Backup

To move virtual machines configured with Azure Backup, use the following workaround:

* Find the location of your Virtual Machine.
* Find a resource group with the following naming pattern: `AzureBackupRG_<location of your VM>_1` for example, AzureBackupRG_westus2_1
* If in Azure portal, then check "Show hidden types"
* If in PowerShell, use the `Get-AzResource -ResourceGroupName AzureBackupRG_<location of your VM>_1` cmdlet
* If in CLI, use the `az resource list -g AzureBackupRG_<location of your VM>_1`
* Find the resource with type `Microsoft.Compute/restorePointCollections` that has the naming pattern `AzureBackup_<name of your VM that you're trying to move>_###########`
* Delete this resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.
* After delete is complete, you'll be able to move your Virtual Machine. You can move the vault and virtual machine to the target subscription. After the move, you can continue backups with no loss in data.
* For information about moving Recovery Service vaults for backup, see [Recovery Services limitations](recovery-services-move-limitations.md).
