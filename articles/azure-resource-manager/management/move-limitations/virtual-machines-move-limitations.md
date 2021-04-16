---
title: Move Azure VMs to new subscription or resource group
description: Use Azure Resource Manager to move virtual machines to a new resource group or subscription.
ms.topic: conceptual
ms.date: 12/01/2020
---

# Move guidance for virtual machines

This article describes the scenarios that aren't currently supported and the steps to move virtual machines with backup.

## Scenarios not supported

The following scenarios aren't yet supported:

* Virtual Machine Scale Sets with Standard SKU Load Balancer or Standard SKU Public IP can't be moved.
* Virtual machines in an existing virtual network can't be moved to a new subscription when you aren't moving all resources in the virtual network.
* Virtual machines created from Marketplace resources with plans attached can't be moved across subscriptions. For a potential workaround, see [Virtual machines with Marketplace plans](#virtual-machines-with-marketplace-plans).
* Low priority virtual machines and low priority virtual machine scale sets can't be moved across resource groups or subscriptions.
* Virtual machines in an availability set can't be moved individually.

## Azure disk encryption

You can't move a virtual machine that is integrated with a key vault to implement [Azure Disk Encryption for Linux VMs](../../../virtual-machines/linux/disk-encryption-overview.md) or [Azure Disk Encryption for Windows VMs](../../../virtual-machines/windows/disk-encryption-overview.md). To move the VM, you must disable encryption.

```azurecli-interactive
az vm encryption disable --resource-group demoRG --name myVm1
```

```azurepowershell-interactive
Disable-AzVMDiskEncryption -ResourceGroupName demoRG -VMName myVm1
```

## Virtual machines with Marketplace plans

Virtual machines created from Marketplace resources with plans attached can't be moved across subscriptions. To work around this limitation, you can de-provision the virtual machine in the current subscription, and deploy it again in the new subscription. The following steps help you recreate the virtual machine in the new subscription. However, they might not work for all scenarios. If the plan is no longer available in the Marketplace, these steps won't work.

1. Copy information about the plan.

1. Either clone the OS disk to the destination subscription, or move the original disk after deleting the virtual machine from source subscription.

1. In the destination subscription, accept the Marketplace terms for your plan. You can accept the terms by running the following PowerShell command:

   ```azurepowershell
   Get-AzMarketplaceTerms -Publisher {publisher} -Product {product/offer} -Name {name/SKU} | Set-AzMarketplaceTerms -Accept
   ```

   Or, you can create a new instance of a virtual machine with the plan through the portal. You can delete the virtual machine after accepting the terms in the new subscription.

1. In the destination subscription, recreate the virtual machine from the cloned OS disk using PowerShell, CLI, or an Azure Resource Manager template. Include the marketplace plan that's attached to the disk. The information about the plan should match the plan you purchased in the new subscription.

## Virtual machines with Azure Backup

To move virtual machines configured with Azure Backup, you must delete the restore points from the vault.

If [soft delete](../../../backup/soft-delete-virtual-machines.md) is enabled for your virtual machine, you can't move the virtual machine while those restore points are kept. Either [disable soft delete](../../../backup/backup-azure-security-feature-cloud.md#enabling-and-disabling-soft-delete) or wait 14 days after deleting the restore points.

### Portal

1. Temporarily stop the backup and keep backup data.
2. To move virtual machines configured with Azure Backup, do the following steps:

   1. Find the location of your virtual machine.
   2. Find a resource group with the following naming pattern: `AzureBackupRG_<VM location>_1`. For example, the name is in the format of *AzureBackupRG_westus2_1*.
   3. In the Azure portal, check **Show hidden types**.
   4. Find the resource with type **Microsoft.Compute/restorePointCollections** that has the naming pattern `AzureBackup_<VM name>_###########`.
   5. Delete this resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.
   6. After the delete operation is complete, you can move your virtual machine.

3. Move the VM to the target resource group.
4. Resume the backup.

### PowerShell

1. Find the location of your virtual machine.

1. Find a resource group with the naming pattern - `AzureBackupRG_<VM location>_1`. For example, the name might be `AzureBackupRG_westus2_1`.

1. If you're moving only one virtual machine, get the restore point collection for that virtual machine.

   ```azurepowershell-interactive
   $restorePointCollection = Get-AzResource -ResourceGroupName AzureBackupRG_<VM location>_1 -name AzureBackup_<VM name>* -ResourceType Microsoft.Compute/restorePointCollections
   ```

   Delete this resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.

   ```azurepowershell-interactive
   Remove-AzResource -ResourceId $restorePointCollection.ResourceId -Force
   ```

1. If you're moving all the virtual machines with back ups in this location, get the restore point collections for those virtual machines.

   ```azurepowershell-interactive
   $restorePointCollection = Get-AzResource -ResourceGroupName AzureBackupRG_<VM location>_1 -ResourceType Microsoft.Compute/restorePointCollections
   ```

   Delete each resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.

   ```azurepowershell-interactive
   foreach ($restorePoint in $restorePointCollection)
   {
     Remove-AzResource -ResourceId $restorePoint.ResourceId -Force
   }
   ```

### Azure CLI

1. Find the location of your virtual machine.

1. Find a resource group with the naming pattern - `AzureBackupRG_<VM location>_1`. For example, the name might be `AzureBackupRG_westus2_1`.

1. If you're moving only one virtual machine, get the restore point collection for that virtual machine.

   ```azurecli-interactive
   RESTOREPOINTCOL=$(az resource list -g AzureBackupRG_<VM location>_1 --resource-type Microsoft.Compute/restorePointCollections --query "[?starts_with(name, 'AzureBackup_<VM name>')].id" --output tsv)
   ```

   Delete this resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.

   ```azurecli-interactive
   az resource delete --ids $RESTOREPOINTCOL
   ```

1. If you're moving all the virtual machines with back ups in this location, get the restore point collections for those virtual machines.

   ```azurecli-interactive
   RESTOREPOINTCOL=$(az resource list -g AzureBackupRG_<VM location>_1 --resource-type Microsoft.Compute/restorePointCollections)
   ```

   Delete each resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.

   ```azurecli-interactive
   az resource delete --ids $RESTOREPOINTCOL
   ```

## Next steps

* For commands to move resources, see [Move resources to new resource group or subscription](../move-resource-group-and-subscription.md).

* For information about moving Recovery Service vaults for backup, see [Recovery Services limitations](../../../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json).
