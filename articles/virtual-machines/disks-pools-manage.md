---
title: Manage an Azure disk pool (preview)
description: Learn how to add managed disks to an Azure disk pool or disable iSCSI support on a disk.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: rogarana
ms.subservice: disks
ms.custom: ignite-fall-2021, devx-track-azurecli
---

# Manage an Azure disk pool (preview)

This article covers how to add a managed disk to an Azure disk pool (preview) and how to disable iSCSI support on a disk that has been added to a disk pool.

## Add a disk to a pool

Your disk must meet the following requirements in order to be added to the disk pool:
- Must be either a premium SSD, standard SSD, or an ultra disk in the same region and availability zone as the disk pool.
    - Ultra disks must have a disk sector size of 512 bytes.
- Must be a shared disk, with a maxShares value of two or greater.
- You must [provide the StoragePool resource provider RBAC permissions to the disks that will be added to the disk pool](disks-pools-deploy.md#assign-storagepool-resource-provider-permissions).

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your disk pool, and select **Disks** under **Settings**.
1. Select **Attach existing disk** and select your disks.
1. When you have chosen all the disks you'd like to attach, select **Save**.

    :::image type="content" source="media/disk-pools-manage/manage-disk-pool-add.png" alt-text="Screenshot of the disks blade for your disk pool.":::

    Now that you've attached your disk, you must enable their LUNS.

1. Select **iSCSI** under **Settings**.
1. Select **Add LUN** under **Disks enabled for iSCSI**.
1. Select the disk you attached earlier.
1. Select **Save**.

    :::image type="content" source="media/disk-pools-manage/enable-disk-luns.png" alt-text="Screenshot of iSCSI blade, disk luns added and enabled.":::

Now that you've attached your disk and enabled the LUN, you must create and attach it as an iSCSI datastore to your Azure VMware Solution private cloud. See [Attach the iSCSI LUN](../azure-vmware/attach-disk-pools-to-azure-vmware-solution-hosts.md#attach-the-iscsi-lun) for details.

# [PowerShell](#tab/azure-powershell)

### Prerequisites

Install [version 6.1.0 or newer](/powershell/module/az.diskpool/?view=azps-6.1.0&preserve-view=true) of the Azure PowerShell module.

Install the disk pool module using the following command:

```azurepowershell
Install-Module -Name Az.DiskPool -RequiredVersion 0.3.0 -Repository PSGallery
```

### Add a disk pool

The following script adds an additional disk to the disk pool and exposes it over iSCSI. It keeps the existing disks in the disk pool without any change.

```azurepowershell
#Initialize input parameters
$resourceGroupName ="<yourResourceGroupName>"
$diskPoolName = "<yourDiskPoolName>"
$iscsiTargetName = "<youriSCSITargetName>"
$diskName ="<yourDiskName>" #Provide the name of the disk you want to add
$lunName ='<LunName>' #Provide the Lun name of the added disk
$diskIds = @()

#Add the disk to disk pool
$DiskPool = Get-AzDiskPool -Name $diskPoolName -ResourceGroupName $resourceGroupName
$DiskPoolDiskIDs = $DiskPool.Disk.Id
foreach ($Id in $DiskPoolDiskIDs)
{
$diskIds += ($Id)
}

$disk = Get-AzDisk -ResourceGroupName $resourceGroupName -DiskName $diskName
$diskIds += ,($disk.Id)
Update-AzDiskPool -ResourceGroupName $resourceGroupName -Name $diskPoolName -DiskId $diskIds

#Get the existing iSCSI LUNs and add the new disk
$target = Get-AzDiskPoolIscsiTarget -name $iscsiTargetName -DiskPoolName $diskPoolName -ResourceGroupName $resourceGroupName
$existingLuns = $target.Lun
$luns = @()
foreach ($lun in $existingLuns)
{
$tmpLunName = $lun.Name
$tmpId = $lun.ManagedDiskAzureResourceId
$tmplun = New-AzDiskPoolIscsiLunObject -ManagedDiskAzureResourceId $tmpId -Name $tmpLunName
$luns += ,($tmplun)
}

$newlun = New-AzDiskPoolIscsiLunObject -ManagedDiskAzureResourceId $disk.Id -Name $lunName
$luns += ,($newlun)
Update-AzDiskPoolIscsiTarget -Name $iscsiTargetName -DiskPoolName $diskPoolName -ResourceGroupName $resourceGroupName -Lun $luns
```

Now that you've attached your disk and enabled the LUN, you must create and attach it as an iSCSI datastore to your Azure VMware Solution private cloud. See [Attach the iSCSI LUN](../azure-vmware/attach-disk-pools-to-azure-vmware-solution-hosts.md#attach-the-iscsi-lun) for details.

# [Azure CLI](#tab/azure-cli)

### Prerequisites

Install [the latest version](/cli/azure/disk-pool) of the Azure CLI.

If you haven't already, install the disk pool extension using the following command:

```azurecli
az extension add -n diskpool
```

### Add a disk pool - CLI

The following script adds an additional disk to the disk pool and exposes it over iSCSI. It keeps the existing disks in the disk pool without any change.

```azurecli
# Add a disk to a disk pool

# Initialize parameters
resourceGroupName="<yourResourceGroupName>"
diskPoolName="<yourDiskPoolName>"
iscsiTargetName="<youriSCSITargetName>"
diskName="<yourDiskName>"
lunName="<LunName>"

diskPoolUpdateArgs=("$@")
diskPoolUpdateArgs+=(--resource-group $resourceGroupName --Name $diskPoolName)

diskIds=$(echo $(az disk-pool show --name $diskPoolName --resource-group $resourceGroupName --query disks[].id -o json) | sed -e 's/\[ //g' -e 's/\ ]//g' -e 's/\,//g')
for disk in $diskIds; do
    diskPoolUpdateArgs+=(--disks $(echo $disk | sed 's/"//g'))
done

diskId=$(az disk show --resource-group $resourceGroupName --name $diskName --query id | sed 's/"//g')
diskPoolUpdateArgs+=(--disks $diskId)

az disk-pool update "${diskPoolUpdateArgs[@]}"

# Get existing iSCSI LUNs and expose added disk as a new LUN
targetUpdateArgs=("$@")
targetUpdateArgs+=(--resource-group $resourceGroupName --disk-pool-name $diskPoolName --name $iscsiTargetName)

luns=$(az disk-pool iscsi-target show --name $iscsiTargetName --disk-pool-name $diskPoolName --resource-group $resourceGroupName --query luns)
lunsCounts=$(echo $luns | jq length)

for (( i=0; i < $lunCounts; i++ )); do
    tmpLunName=$(echo $luns | jq .[$i].name | sed 's/"//g')
    tmpLunId=$(echo $luns | jq .[$i].managedDiskAzureResourceId | sed 's/"//g')
    targetUpdateArgs+=(--luns name=$tmpLunName managed-disk-azure-resource-id=$tmpLunId)
done

targetUpdateArgs+=(--luns name=$lunName managed-disk-azure-resource-id=$diskId)

az disk-pool iscsi-target update "${targetUpdateArgs[@]}"
```

Now that you've attached your disk and enabled the LUN, you must create and attach it as an iSCSI datastore to your Azure VMware Solution private cloud. See [Attach the iSCSI LUN](../azure-vmware/attach-disk-pools-to-azure-vmware-solution-hosts.md#attach-the-iscsi-lun) for details.

---

## Disable iSCSI on a disk and remove it from the pool

Before you disable iSCSI support on a disk, confirm there is no outstanding iSCSI connections to the iSCSI LUN the disk is exposed as. When a disk is removed from the disk pool, it isn't automatically deleted. This prevents any data loss but you will still be billed for storing data. If you don't need the data stored in a disk, you can manually delete the disk. This will delete the disk and all data stored on it and will prevent further charges.

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your disk pool and select **iSCSI** under **Settings**.
1. Under **Disks enabled for iSCSI** select the disks you'd like to remove and select **Remove LUN**.
1. Select **Save** and wait for the operation to complete.

    :::image type="content" source="media/disk-pools-manage/remove-disk-lun.png" alt-text="Screenshot of the disk pool iSCSI blade, removing disk LUNs.":::

    Now that you've disabled the LUN, you can remove your disks from the disk pool.

1. Select **Disks** under **Settings**.
1. Select **Remove disk from disk pool** and select your disks.
1. Select **Save**.

When the operation completes, your disk will have been completely removed from the disk pool.

:::image type="content" source="media/disk-pools-manage/remove-disks-from-pool.png" alt-text="Screenshot of disk pool's disk's blade. Disks being removed from pool.":::

# [PowerShell](#tab/azure-powershell)

```azurepowershell
#Initialize input parameters
$resourceGroupName ="<yourResourceGroupName>"
$diskPoolName = "<yourDiskPoolName>"
$iscsiTargetName = "<youriSCSITargetName>"
$diskName ="<NameOfDiskYouWantToRemove>" #Provide the name of the disk you want to remove
$lunName ='<LunForDiskYouWantToRemove>' #Provide the Lun name of the disk you want to remove
$diskIds = @()

#Get the existing iSCSI LUNs and remove it from iSCS target
$target = Get-AzDiskPoolIscsiTarget -name $iscsiTargetName -DiskPoolName $diskPoolName -ResourceGroupName $resourceGroupName
$existingLuns = $target.Lun
$luns = @()
foreach ($lun in $existingLuns)
{
if ($lun.Name -notlike $lunName)
{
$tmpLunName = $lun.Name
$tmpId = $lun.ManagedDiskAzureResourceId
$tmplun = New-AzDiskPoolIscsiLunObject -ManagedDiskAzureResourceId $tmpId -Name $tmpLunName
$luns += ,($tmplun)
}
}

Update-AzDiskPoolIscsiTarget -Name $iscsiTargetName -DiskPoolName $diskPoolName -ResourceGroupName $resourceGroupName -Lun $luns

#Remove the disk from disk pool
$disk = Get-AzDisk -ResourceGroupName $resourceGroupName -DiskName $diskName
$DiskPool = Get-AzDiskPool -Name $diskPoolName -ResourceGroupName $resourceGroupName
$DiskPoolDiskIDs = $DiskPool.Disk.Id
foreach ($Id in $DiskPoolDiskIDs)
{
if ($Id -notlike $disk.Id)
{
$diskIds += ($Id)
}
}

Update-AzDiskPool -ResourceGroupName $resourceGroupName -Name $diskPoolName -DiskId $diskIds
```

# [Azure CLI](#tab/azure-cli)

```azurecli
# Disable iSCSI on a disk and remove it from the pool

# Initialize parameters
resourceGroupName="<yourResourceGroupName>"
diskPoolName="<yourDiskPoolName>"
iscsiTargetName="<youriSCSITargetName>"
diskName="<yourDiskName>"
lunName="<LunName>"

# Get existing iSCSI LUNs and remove it from iSCSI target
targetUpdateArgs=("$@")
targetUpdateArgs+=(--resource-group $resourceGroupName --disk-pool-name $diskPoolName --name $iscsiTargetName)

luns=$(az disk-pool iscsi-target show --name $iscsiTargetName --disk-pool-name $diskPoolName --resource-group $resourceGroupName --query luns)
lunCounts=$(echo $luns | jq length)

for (( i=0; i < $lunCounts; i++ )); do
    tmpLunName=$(echo $luns | jq .[$i].name | sed 's/"//g')
    if [ $tmpLunName != $lunName ]; then
        tmpLunId=$(echo $luns | jq .[$i].managedDiskAzureResourceId | sed 's/"//g')
        targetUpdateArgs+=(--luns name=$tmpLunName managed-disk-azure-resource-id=$tmpLunId)
    fi
done

az disk-pool iscsi-target update "${targetUpdateArgs[@]}"

# Remove disk from pool
diskId=$(az disk show --resource-group $resourceGroupName --name $diskName -- query id | sed 's/"//g')

diskPoolUpdateArgs=("$@")
diskPoolUpdateArgs+=(--resource-group $resourceGroupName --name $diskPoolName)

diskIds=$(az disk-pool show --name $diskPoolName --resource-group $resourceGroupName --query disks[].id -o json)
diskLength=$(echo diskIds | jq length)

for (( i=0; i < $diskLength; i++ )); do
    tmpDiskId=$(echo $diskIds | jq .[$i] | sed 's/"//g')

    if [ $tmpDiskId != $diskId ]; then
        diskPoolUpdateArgs+=(--disks $tmpDiskId)
    fi
done

az disk-pool update "${diskPoolUpdateArgs[@]}"
```

---
## Next steps

- To learn how to move a disk pool to another subscription, see [Move a disk pool to a different subscription](disks-pools-move-resource.md).
- To learn how to deprovision a disk pool, see [Deprovision an Azure disk pool](disks-pools-deprovision.md).
