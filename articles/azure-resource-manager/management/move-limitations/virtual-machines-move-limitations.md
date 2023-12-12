---
title: Special cases to move Azure VMs to new subscription or resource group
description: Use Azure Resource Manager to move virtual machines to a new resource group or subscription.
ms.topic: conceptual
ms.date: 10/30/2023 
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template
---

# Handling special cases when moving virtual machines to resource group or subscription

This article describes special cases that require extra steps when moving a virtual machine to a new resource group or Azure subscription. If your virtual machine uses disk encryption, a Marketplace plan, or Azure Backup, you must use one of the workarounds described in this article. For all other scenarios, move the virtual machine with the standard operations for [Azure portal](../move-resource-group-and-subscription.md#use-the-portal), [Azure CLI](../move-resource-group-and-subscription.md#use-azure-cli), or [Azure PowerShell](../move-resource-group-and-subscription.md#use-azure-powershell). For Azure CLI, use the [az resource move](/cli/azure/resource#az-resource-move) command. For Azure PowerShell, use the [Move-AzResource](/powershell/module/az.resources/move-azresource) command.

If you want to move a virtual machine to a new region, see [Tutorial: Move Azure VMs across regions](../../../resource-mover/tutorial-move-region-virtual-machines.md).

## Scenarios not supported

The following scenarios aren't yet supported:

* Virtual Machine Scale Sets with Standard SKU Load Balancer or Standard SKU Public IP can't be moved.
* Virtual machines in an existing virtual network can be moved to a new subscription only when the virtual network and all of its dependent resources are also moved.
* Virtual machines created from Marketplace resources with plans attached can't be moved across subscriptions. For a potential workaround, see [Virtual machines with Marketplace plans](#virtual-machines-with-marketplace-plans).
* Low-priority virtual machines and low-priority virtual machine scale sets can't be moved across resource groups or subscriptions.
* Virtual machines in an availability set can't be moved individually.

## Azure disk encryption

A virtual machine that is integrated with a key vault to implement [Azure Disk Encryption for Linux VMs](../../../virtual-machines/linux/disk-encryption-overview.md) or [Azure Disk Encryption for Windows VMs](../../../virtual-machines/windows/disk-encryption-overview.md) can be moved to another resource group when it is in deallocated state. 

However, to move such virtual machine to another subscription, you must disable encryption.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az vm encryption disable --resource-group demoRG --name myVm1 --volume-type all
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Disable-AzVMDiskEncryption -ResourceGroupName demoRG -VMName myVm1 -VolumeType all
```

---

## Virtual machines with Marketplace plans

Virtual machines created from Marketplace resources with plans attached can't be moved across subscriptions. To work around this limitation, you can deprovision the virtual machine in the current subscription, and deploy it again in the new subscription. The following steps help you recreate the virtual machine in the new subscription. However, they might not work for all scenarios. If the plan is no longer available in the Marketplace, these steps won't work.

1. Get information about the plan.

    # [Azure CLI](#tab/azure-cli)
    
    ```azurecli
    az vm show --resource-group demoRG --name myVm1 --query plan
    ```
    
    # [PowerShell](#tab/azure-powershell)
    
    ```azurepowershell
    $vm = get-AzVM -ResourceGroupName demoRG -Name myVm1
    $vm.Plan
    ```
    
    ---

1. Check that the offering still exists in the Marketplace.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az vm image list-skus --publisher Fabrikam --offer LinuxServer --location centralus
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell
    Get-AzVMImageSku -Location "Central US" -PublisherName "Fabrikam" -Offer "LinuxServer"
    ```

    ---

1. Either clone the OS disk to the destination subscription, or move the original disk after deleting the virtual machine from source subscription.

1. In the destination subscription, accept the Marketplace terms for your plan. You can accept the terms by running the following PowerShell command:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az vm image terms accept --publisher {publisher} --offer {product/offer} --plan {name/SKU}
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell
    Get-AzMarketplaceTerms -Publisher {publisher} -Product {product/offer} -Name {name/SKU} | Set-AzMarketplaceTerms -Accept
    ```

    ---

    Or, you can create a new instance of a virtual machine with the plan through the portal. You can delete the virtual machine after accepting the terms in the new subscription.

1. In the destination subscription, recreate the virtual machine from the cloned OS disk using PowerShell, CLI, or an Azure Resource Manager template. Include the marketplace plan that's attached to the disk. The information about the plan should match the plan you purchased in the new subscription. For more information, see [Create the VM](../../../virtual-machines/marketplace-images.md#create-the-vm).

For more information, see [Move a Marketplace Azure Virtual Machine to another subscription](../../../virtual-machines/azure-cli-change-subscription-marketplace.md).

## Virtual machines with Azure Backup

To move virtual machines configured with Azure Backup, you must delete the restore points collections (snapshots) from the vault. Restore points already copied to the vault can be retained and moved.

If [soft delete](../../../backup/soft-delete-virtual-machines.md) is enabled for your virtual machine, you can't move the virtual machine while those restore points are kept. Either [disable soft delete](../../../backup/backup-azure-security-feature-cloud.md#enabling-and-disabling-soft-delete) or wait 14 days after deleting the restore points.

### Portal

1. Temporarily stop the backup and keep backup data.
2. To move virtual machines configured with Azure Backup, do the following steps:

   1. Find the resource group that contains your backups. If you used the default resource group, it has the following naming pattern: `AzureBackupRG_<VM location>_1`. For example, the name is in the format of *AzureBackupRG_westus2_1*. 
   
      If you created a custom resource group, select that resource group. If you can't find the resource group, search for **Restore Point Collections** in the portal. Look for the collection with the naming pattern `AzureBackup_<VM name>_###########`.
   1. Select the resource with type **Restore Point Collection** that has the naming pattern `AzureBackup_<VM name>_###########`.
   1. Delete this resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.
   1. After the delete operation is complete, you can move your virtual machine.

3. Move the VM to the target resource group.
4. Reconfigure the backup.

### Script

1. Find the resource group that contains your backups. If you used the default resource group, it has the following naming pattern: `AzureBackupRG_<VM location>_1`. For example, the name is in the format of *AzureBackupRG_westus2_1*.

   If you created a custom resource group, find that resource group. If you can't find the resource group, use the following command and provide the name of the virtual machine.

   # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    az resource list --resource-type Microsoft.Compute/restorePointCollections --query "[?starts_with(name, 'AzureBackup_<vm-name>')].resourceGroup"
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    (Get-AzResource -ResourceType Microsoft.Compute/restorePointCollections -Name AzureBackup_<vm-name>*).ResourceGroupName
    ```

    ---

1. If you're moving only one virtual machine, get the restore point collection for that virtual machine.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    RESTOREPOINTCOL=$(az resource list -g AzureBackupRG_<VM location>_1 --resource-type Microsoft.Compute/restorePointCollections --query "[?starts_with(name, 'AzureBackup_<VM name>')].id" --output tsv)
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    $restorePointCollection = Get-AzResource -ResourceGroupName AzureBackupRG_<VM location>_1 -name AzureBackup_<VM name>* -ResourceType Microsoft.Compute/restorePointCollections
    ```

    ---

    Delete this resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    az resource delete --ids $RESTOREPOINTCOL
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    Remove-AzResource -ResourceId $restorePointCollection.ResourceId -Force
    ```

    ---

1. If you're moving all the virtual machines with back ups in this location, get the restore point collections for those virtual machines.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    RESTOREPOINTCOL=$(az resource list -g AzureBackupRG_<VM location>_1 --resource-type Microsoft.Compute/restorePointCollections)
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    $restorePointCollection = Get-AzResource -ResourceGroupName AzureBackupRG_<VM location>_1 -ResourceType Microsoft.Compute/restorePointCollections
    ```

    ---

    Delete each resource. This operation deletes only the instant recovery points, not the backed-up data in the vault.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    az resource delete --ids $RESTOREPOINTCOL
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    foreach ($restorePoint in $restorePointCollection)
    {
      Remove-AzResource -ResourceId $restorePoint.ResourceId -Force
    }
    ```

    ---

## Next steps

* For commands to move resources, see [Move resources to new resource group or subscription](../move-resource-group-and-subscription.md).

* For information about moving Recovery Service vaults for backup, see [Recovery Services limitations](../../../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json).
