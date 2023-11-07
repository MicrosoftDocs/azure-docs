---
title: Tutorial - Restore a VM with Azure CLI
description: Learn how to restore a disk and create a recover a VM in Azure with Backup and Recovery Services.
ms.topic: tutorial
ms.date: 10/28/2022
ms.custom: mvc, devx-track-azurecli
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore a VM with Azure CLI

Azure Backup creates recovery points that are stored in geo-redundant recovery vaults. When you restore from a recovery point, you can restore the whole VM or individual files. This article explains how to restore a complete VM using CLI. In this tutorial you learn how to:

> [!div class="checklist"]
>
> * List and select recovery points
> * Restore a disk from a recovery point
> * Create a VM from the restored disk

For information on using PowerShell to restore a disk and create a recovered VM, see [Back up and restore Azure VMs with PowerShell](backup-azure-vms-automation.md#restore-an-azure-vm).

Now, you can also use CLI to directly restore the backup content to a VM (original/new), without performing the above steps separately. For more information, see [Restore data to virtual machine using CLI](#restore-data-to-virtual-machine-using-cli).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0.18 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

 - This tutorial requires a Linux VM that has been protected with Azure Backup. To simulate an accidental VM deletion and recovery process, you create a VM from a disk in a recovery point. If you need a Linux VM that has been protected with Azure Backup, see [Back up a virtual machine in Azure with the CLI](quick-backup-vm-cli.md).

## Backup overview

When Azure initiates a backup, the backup extension on the VM takes a point-in-time snapshot. The backup extension is installed on the VM when the first backup is requested. Azure Backup can also take a snapshot of the underlying storage if the VM isn't running when the backup takes place.

By default, Azure Backup takes a file system consistent backup. Once Azure Backup takes the snapshot, the data is transferred to the Recovery Services vault. To maximize efficiency, Azure Backup identifies and transfers only the blocks of data that have changed since the previous backup.

When the data transfer is complete, the snapshot is removed and a recovery point is created.

## List available recovery points

To restore a disk, you select a recovery point as the source for the recovery data. As the default policy creates a recovery point each day and retains them for 30 days, you can keep a set of recovery points that allows you to select a particular point in time for recovery.

To see a list of available recovery points, use [az backup recoverypoint list](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-list). The recovery point **name** is used to recover disks. In this tutorial, we want the most recent recovery point available. The `--query [0].name` parameter selects the most recent recovery point name as follows:

```azurecli-interactive
az backup recoverypoint list \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --backup-management-type AzureIaasVM \
    --container-name myVM \
    --item-name myVM \
    --query [0].name \
    --output tsv
```

## Restore a VM disk

> [!IMPORTANT]
> It's very strongly recommended to use Az CLI version 2.0.74 or later to get all the benefits of a quick restore including managed disk restore. It's best if you always use the latest version.

### Managed disk restore

If the backed-up VM has managed disks and if the intent is to restore managed disks from the recovery point, you first provide an Azure storage account. This storage account is used to store the VM configuration and the deployment template that can be later used to deploy the VM from the restored disks. Then, you also provide a target resource group for the managed disks to be restored into.

1. To create a storage account, use [az storage account create](/cli/azure/storage/account#az-storage-account-create). The storage account name must be all lowercase, and be globally unique. Replace *mystorageaccount* with your own unique name:

    ```azurecli-interactive
    az storage account create \
        --resource-group myResourceGroup \
        --name mystorageaccount \
        --sku Standard_LRS
    ```

2. Restore the disk from your recovery point with [az backup restore restore-disks](/cli/azure/backup/restore#az-backup-restore-restore-disks). Replace *mystorageaccount* with the name of the storage account you created in the preceding command. Replace *myRecoveryPointName* with the recovery point name you obtained in the output from the previous [az backup recoverypoint list](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-list) command. ***Also provide the target resource group to which the managed disks are restored into***.

    ```azurecli-interactive
    az backup restore restore-disks \
        --resource-group myResourceGroup \
        --vault-name myRecoveryServicesVault \
        --container-name myVM \
        --item-name myVM \
        --storage-account mystorageaccount \
        --rp-name myRecoveryPointName \
        --target-resource-group targetRG
    ```

    > [!WARNING]
    > If **target-resource-group** isn't provided, then the managed disks will be restored as unmanaged disks to the given storage account. This will have significant consequences to the restore time since the time taken to restore the disks entirely depends on the given storage account. You'll get the benefit of instant restore only when the target-resource-group parameter is given. If the intention is to restore managed disks as unmanaged then don't provide the **target-resource-group** parameter and instead provide the **restore-as-unmanaged-disk** parameter as shown below. This parameter is available from Azure CLI 3.4.0 onwards.

    ```azurecli-interactive
    az backup restore restore-disks \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --container-name myVM \
    --item-name myVM \
    --storage-account mystorageaccount \
    --rp-name myRecoveryPointName \
    --restore-as-unmanaged-disk
    ```

This will restore managed disks as unmanaged disks to the given storage account and won't be leveraging the 'instant' restore functionality. In future versions of CLI, it will be mandatory to provide either the **target-resource-group** parameter or **restore-as-unmanaged-disk** parameter.

### Restore disks to secondary region

The backup data replicates to the secondary region when you enable cross-region restore on the vault you've protected your VMs. You can use the backup data to perform a restore operation.

To restore disks to the secondary region, use the `--use-secondary-region` flag in the [az backup restore restore-disks](/cli/azure/backup/restore#az-backup-restore-restore-disks) command. Ensure that you specify a target storage account that's located in the secondary region.

```azurecli-interactive
az backup restore restore-disks \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --container-name myVM \
    --item-name myVM \
    --storage-account targetStorageAccountID \
    --rp-name myRecoveryPointName \
    --target-resource-group targetRG
    --use-secondary-region
```

### Cross-zonal restore

You can restore [Azure zone pinned VMs](../virtual-machines/windows/create-portal-availability-zone.md) in any [availability zones](../availability-zones/az-overview.md) of the same region.

To restore a VM to another zone, specify the `TargetZoneNumber` parameter in the [az backup restore restore-disks](/cli/azure/backup/restore#az-backup-restore-restore-disks) command.

```azurecli-interactive
az backup restore restore-disks \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --container-name myVM \
    --item-name myVM \
    --storage-account targetStorageAccountID \
    --rp-name myRecoveryPointName \
    --target-resource-group targetRG
    --target-zone 3
```

Cross-zonal restore is supported only in scenarios where:

- The source VM is zone pinned and is NOT encrypted.
- The recovery point is present in vault tier only. Snapshots only or snapshot and vault tier are not supported.
- The recovery option is to create a new VM or restore disks. Replace disks option replaces source data; therefore, the availability zone option is not applicable.
- Creating VM/disks in the same region when vault's storage redundancy is ZRS. Note that it doesn't work if vault's storage redundancy is GRS, even though the source VM is zone pinned.
- Creating VM/disks in the paired region when vault's storage redundancy is enabled for Cross-Region Restore and if the paired region supports zones.

### Unmanaged disks restore

If the backed-up VM has unmanaged disks and if the intent is to restore disks from the recovery point, you first provide an Azure storage account. This storage account is used to store the VM configuration and the deployment template that can be later used to deploy the VM from the restored disks. By default, the unmanaged disks will be restored to their original storage accounts. If you wish to restore all unmanaged disks to one single place, then the given storage account can also be used as a staging location for those disks too.

In additional steps, the restored disk is used to create a VM.

1. To create a storage account, use [az storage account create](/cli/azure/storage/account#az-storage-account-create). The storage account name must be all lowercase, and be globally unique. Replace *mystorageaccount* with your own unique name:

    ```azurecli-interactive
    az storage account create \
        --resource-group myResourceGroup \
        --name mystorageaccount \
        --sku Standard_LRS
    ```

2. Restore the disk from your recovery point with [az backup restore restore-disks](/cli/azure/backup/restore#az-backup-restore-restore-disks). Replace *mystorageaccount* with the name of the storage account you created in the preceding command. Replace *myRecoveryPointName* with the recovery point name you obtained in the output from the previous [az backup recoverypoint list](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-list) command:

    ```azurecli-interactive
    az backup restore restore-disks \
        --resource-group myResourceGroup \
        --vault-name myRecoveryServicesVault \
        --container-name myVM \
        --item-name myVM \
        --storage-account mystorageaccount \
        --rp-name myRecoveryPointName
    ```

As mentioned above, the unmanaged disks will be restored to their original storage account. This provides the best restore performance. But if all unmanaged disks need to be restored to given storage account, then use the relevant flag as shown below.

```azurecli-interactive
    az backup restore restore-disks \
        --resource-group myResourceGroup \
        --vault-name myRecoveryServicesVault \
        --container-name myVM \
        --item-name myVM \
        --storage-account mystorageaccount \
        --rp-name myRecoveryPointName \
        --restore-to-staging-storage-account
    ```

## Monitor the restore job

To monitor the status of restore job, use [az backup job list](/cli/azure/backup/job#az-backup-job-list):

```azurecli-interactive
az backup job list \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --output table
```

The output is similar to the following example, which shows the restore job is *InProgress*:

```output
Name      Operation        Status      Item Name    Start Time UTC       Duration
--------  ---------------  ----------  -----------  -------------------  --------------
7f2ad916  Restore          InProgress  myvm         2017-09-19T19:39:52  0:00:34.520850
a0a8e5e6  Backup           Completed   myvm         2017-09-19T03:09:21  0:15:26.155212
fe5d0414  ConfigureBackup  Completed   myvm         2017-09-19T03:03:57  0:00:31.191807
```

When the *Status* of the restore job reports *Completed*, the necessary information (VM configuration and the deployment template) has been restored to the storage account.

#### Using managed identity to restore disks

Azure Backup also allows you to use managed identity (MSI) during restore operation to access storage accounts where disks have to be restored to. This option is currently supported only for managed disk restore.

If you wish to use the vault's system assigned managed identity to restore disks, pass an additional flag ***--mi-system-assigned*** to the [az backup restore restore-disks](/cli/azure/backup/restore#az-backup-restore-restore-disks) command. If you wish to use a user-assigned managed identity, pass a parameter ***--mi-user-assigned*** with the Azure Resource Manager ID of the vault's managed identity as the value of the parameter. Refer to [this article](encryption-at-rest-with-cmk.md#enable-managed-identity-for-your-recovery-services-vault) to learn how to enable managed identity for your vaults. 

## Create a VM from the restored disk

The final step is to create a VM from the restored disks. You can use the deployment template downloaded to the given storage account to create the VM.

### Fetch the Job details

The resultant job details give the template URI that can be queried and deployed. Use the job show command to get more details for the triggered restored job.

```azurecli-interactive
az backup job show \
    -v myRecoveryServicesVault \
    -g myResourceGroup \
    -n 1fc2d55d-f0dc-4ca6-ad48-aca0fe5d0414
```

The output of this query will give all details, but we're interested only in the storage account contents. We can use the [query capability](/cli/azure/query-azure-cli) of Azure CLI to fetch the relevant details

```azurecli-interactive
az backup job show \
    -v myRecoveryServicesVault \
    -g myResourceGroup \
    -n 1fc2d55d-f0dc-4ca6-ad48-aca0fe5d0414 \
    --query properties.extendedInfo.propertyBag

{
  "Config Blob Container Name": "myVM-daa1931199fd4a22ae601f46d8812276",
  "Config Blob Name": "config-myVM-1fc2d55d-f0dc-4ca6-ad48-aca0fe5d0414.json",
  "Config Blob Uri": "https://mystorageaccount.blob.core.windows.net/myVM-daa1931199fd4a22ae601f46d8812276/config-appvm8-1fc2d55d-f0dc-4ca6-ad48-aca0519c0232.json",
  "Job Type": "Recover disks",
  "Recovery point time ": "12/25/2019 10:07:11 PM",
  "Target Storage Account Name": "mystorageaccount",
  "Target resource group": "mystorageaccountRG",
  "Template Blob Uri": "https://mystorageaccount.blob.core.windows.net/myVM-daa1931199fd4a22ae601f46d8812276/azuredeploy1fc2d55d-f0dc-4ca6-ad48-aca0519c0232.json"
}
```

### Fetch the deployment template

The template isn't directly accessible since it's under a customer's storage account and the given container. We need the complete URL (along with a temporary SAS token) to access this template.

First, extract the template blob Uri from job details

```azurecli-interactive
az backup job show \
    -v myRecoveryServicesVault \
    -g myResourceGroup \
    -n 1fc2d55d-f0dc-4ca6-ad48-aca0fe5d0414 \
    --query properties.extendedInfo.propertyBag."""Template Blob Uri"""

"https://mystorageaccount.blob.core.windows.net/myVM-daa1931199fd4a22ae601f46d8812276/azuredeploy1fc2d55d-f0dc-4ca6-ad48-aca0519c0232.json"
```

The template blob Uri will be of this format and extract the template name

```https
https://<storageAccountName.blob.core.windows.net>/<containerName>/<templateName>
```

So, the template name from the above example will be ```azuredeploy1fc2d55d-f0dc-4ca6-ad48-aca0519c0232.json``` and the container name is ```myVM-daa1931199fd4a22ae601f46d8812276```

Now get the SAS token for this container and template as detailed [here](../azure-resource-manager/templates/secure-template-with-sas-token.md?tabs=azure-cli#provide-sas-token-during-deployment)

```azurecli-interactive
expiretime=$(date -u -d '30 minutes' +%Y-%m-%dT%H:%MZ)
connection=$(az storage account show-connection-string \
    --resource-group mystorageaccountRG \
    --name mystorageaccount \
    --query connectionString)
token=$(az storage blob generate-sas \
    --container-name myVM-daa1931199fd4a22ae601f46d8812276 \
    --name azuredeploy1fc2d55d-f0dc-4ca6-ad48-aca0519c0232.json \
    --expiry $expiretime \
    --permissions r \
    --output tsv \
    --connection-string $connection)
url=$(az storage blob url \
   --container-name myVM-daa1931199fd4a22ae601f46d8812276 \
    --name azuredeploy1fc2d55d-f0dc-4ca6-ad48-aca0519c0232.json \
    --output tsv \
    --connection-string $connection)
```

### Deploy the template to create the VM

Now deploy the template to create the VM as explained [here](../azure-resource-manager/templates/deploy-cli.md).

```azurecli-interactive
az deployment group create \
  --resource-group ExampleGroup \
  --template-uri $url?$token
```

To confirm that your VM has been created from your recovered disk, list the VMs in your resource group with [az vm list](/cli/azure/vm#az-vm-list) as follows:

```azurecli-interactive
az vm list --resource-group myResourceGroup --output table
```

## Restore data to virtual machine using CLI

You can now directly restore data to original/alternate VM without performing multiple steps.

### Restore data to original VM

```azurecli-interactive
az backup restore restore-disks \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --container-name myVM \
    --item-name myVM \
    --restore-mode OriginalLocation 
    --storage-account mystorageaccount \
    --rp-name myRecoveryPointName \ 
```

```output
Name      Operation        Status      Item Name    Start Time UTC       Duration
--------  ---------------  ----------  -----------  -------------------  --------------
7f2ad916  Restore          InProgress  myVM         2017-09-19T19:39:52  0:00:34.520850
```

The last command triggers an original location restore operation to restore the data in-place in the existing VM.
 

###  Restore data to a newly created VM

```azurecli-interactive
az backup restore restore-disks \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --container-name myVM \
    --item-name myVM \
    --restore-mode AlternateLocation \
    --storage-account mystorageaccount \

--target-resource-group "Target_RG" \
    --rp-name myRecoveryPointName \
    --target-vm-name "TargetVirtualMachineName" \
    --target-vnet-name "Target_VNet" \
    --target-vnet-resource-group "Target_VNet_RG" \
    --target-subnet-name "targetSubNet"
```

```output
Name      Operation        Status      Item Name    Start Time UTC       Duration
--------  ---------------  ----------  -----------  -------------------  --------------
7f2ad916  Restore          InProgress  myVM         2017-09-19T19:39:52  0:00:34.520850
```

The last command triggers an alternate location restore operation to create a new VM in *Target_RG* resource group as per the inputs specified by parameters *TargetVMName*, *TargetVNetName*, *TargetVNetResourceGroup*, *TargetSubnetName*. This ensures the data is restored in the required VM, virtual network, and subnet.

## Next steps

In this tutorial, you restored a disk from a recovery point and then created a VM from the disk. You learned how to:

> [!div class="checklist"]
>
> * List and select recovery points
> * Restore a disk from a recovery point
> * Create a VM from the restored disk

Advance to the next tutorial to learn about restoring individual files from a recovery point.

> [!div class="nextstepaction"]
> [Restore files to a virtual machine in Azure](tutorial-restore-files.md)
