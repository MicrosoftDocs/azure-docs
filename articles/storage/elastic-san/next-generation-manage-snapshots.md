---
title: Manage Azure Elastic SAN Next Generation Preview snapshots
description: Learn how to create, restore, export, and delete Azure Elastic SAN Next Generation Preview volume snapshots.
author: normesta
ms.service: azure-elastic-san
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: how-to
ms.date: 08/31/2026
ms.author: normesta
# Customer intent: "As a cloud administrator, I want to create and manage snapshots of Azure Elastic SAN Next Generation volumes so that I can quickly restore data when needed."
---

# Create and manage Azure Elastic SAN next generation snapshots

This article explains how to create an Azure Elastic SAN Next Generation Preview volume snapshot, create a new volume from a snapshot, export a snapshot to a managed disk snapshot, and delete a snapshot. To learn how snapshots work, including their instant-access, retention, capacity, billing, consistency, and deletion behavior, see [Azure Elastic SAN Next Generation Preview snapshots overview](next-generation-snapshots-overview.md).

> [!IMPORTANT]
> Azure Elastic SAN Next Generation is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Before you begin, review the [Elastic SAN next generation snapshot limitations](next-generation-snapshots-overview.md#limitations).

## Take a stable snapshot

You can create a snapshot while a client is writing data to the volume. However, the snapshot might contain partial operations that were in progress when the snapshot was created. Snapshots of multiple volumes aren't coordinated and might represent different points in time.

Before you create snapshots of volumes used by the same workload:

1. Freeze writes to all the volumes.
1. Flush pending writes.
1. Create a snapshot of each volume.
1. Resume writes after the snapshot operations begin.

For application-consistent backups, use the coordination mechanism provided by your application. For example, Windows applications such as SQL Server can use Volume Shadow Copy Service. On Linux, you can use a tool such as `fsfreeze` to create file-system-consistent snapshots.

## Create a volume snapshot

You can create a snapshot by using the Azure portal, Azure PowerShell, or Azure CLI. Instant access and the background copy are enabled automatically.

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to your Elastic SAN Next Generation resource and select **Volume snapshots**.
1. Select **Create a snapshot**.
1. Select the source volume, enter a name for the snapshot, and then create the snapshot.

# [PowerShell](#tab/azure-powershell)

Set the variables, and then run [New-AzElasticSanVolumeSnapshot](/powershell/module/az.elasticsan/new-azelasticsanvolumesnapshot):

```azurepowershell
$resourceGroupName = "<resource-group-name>"
$elasticSanName = "<elastic-san-name>"
$volumeGroupName = "<volume-group-name>"
$volumeName = "<volume-name>"
$snapshotName = "<snapshot-name>"

$volume = Get-AzElasticSanVolume `
    -ResourceGroupName $resourceGroupName `
    -ElasticSanName $elasticSanName `
    -VolumeGroupName $volumeGroupName `
    -Name $volumeName

New-AzElasticSanVolumeSnapshot `
    -ResourceGroupName $resourceGroupName `
    -ElasticSanName $elasticSanName `
    -VolumeGroupName $volumeGroupName `
    -Name $snapshotName `
    -CreationDataSourceId $volume.Id
```

# [Azure CLI](#tab/azure-cli)

Set the variables, and then run [az elastic-san volume snapshot create](/cli/azure/elastic-san/volume/snapshot#az-elastic-san-volume-snapshot-create):

```azurecli
resourceGroupName="<resource-group-name>"
elasticSanName="<elastic-san-name>"
volumeGroupName="<volume-group-name>"
volumeName="<volume-name>"
snapshotName="<snapshot-name>"

volumeId=$(az elastic-san volume show \
    --resource-group $resourceGroupName \
    --elastic-san-name $elasticSanName \
    --volume-group-name $volumeGroupName \
    --name $volumeName \
    --query id \
    --output tsv)

az elastic-san volume snapshot create \
    --resource-group $resourceGroupName \
    --elastic-san-name $elasticSanName \
    --volume-group-name $volumeGroupName \
    --name $snapshotName \
    --creation-data source-id=$volumeId
```

---

After the operation finishes, confirm that the snapshot appears under **Volume snapshots** for the source volume group.

## Create a volume from a volume snapshot

You can't use a snapshot to modify or overwrite an existing volume. To restore snapshot data, use the snapshot to create a new volume. During the five-hour instant-access period, you can use the snapshot to instantly create a new volume. Volumes created from instant access snapshots rapidly hydrate with minimal performance impact and you can attach them to a running VM immediately.

After the instant-access period ends, you can create a volume only after the snapshot's background copy finishes. A new volume must be at least as large as the source volume represented by the snapshot.

# [Portal](#tab/azure-portal)

1. Go to your Elastic SAN Next Generation resource and select **Volumes**.
1. Select **Create volume** and enter the volume details.
1. For **Source type**, select **Volume snapshot**.
1. Select the source snapshot, and then create the volume.

# [PowerShell](#tab/azure-powershell)

Get the snapshot, and then pass its resource ID to [New-AzElasticSanVolume](/powershell/module/az.elasticsan/new-azelasticsanvolume):

```azurepowershell
$resourceGroupName = "<resource-group-name>"
$elasticSanName = "<elastic-san-name>"
$volumeGroupName = "<volume-group-name>"
$snapshotName = "<snapshot-name>"
$newVolumeName = "<new-volume-name>"
$newVolumeSizeGiB = "<volume-size>"

$snapshot = Get-AzElasticSanVolumeSnapshot `
    -ResourceGroupName $resourceGroupName `
    -ElasticSanName $elasticSanName `
    -VolumeGroupName $volumeGroupName `
    -Name $snapshotName

New-AzElasticSanVolume `
    -ResourceGroupName $resourceGroupName `
    -ElasticSanName $elasticSanName `
    -VolumeGroupName $volumeGroupName `
    -Name $newVolumeName `
    -SizeGiB $newVolumeSizeGiB `
    -CreationDataSourceId $snapshot.Id `
    -CreationDataCreateSource VolumeSnapshot
```

# [Azure CLI](#tab/azure-cli)

Get the snapshot resource ID, and then pass it to [az elastic-san volume create](/cli/azure/elastic-san/volume#az-elastic-san-volume-create):

```azurecli
resourceGroupName="<resource-group-name>"
elasticSanName="<elastic-san-name>"
volumeGroupName="<volume-group-name>"
snapshotName="<snapshot-name>"
newVolumeName="<new-volume-name>"
newVolumeSizeGiB="<volume-size>"

snapshotId=$(az elastic-san volume snapshot show \
    --resource-group $resourceGroupName \
    --elastic-san-name $elasticSanName \
    --volume-group-name $volumeGroupName \
    --name $snapshotName \
    --query id \
    --output tsv)

az elastic-san volume create \
    --resource-group $resourceGroupName \
    --elastic-san-name $elasticSanName \
    --volume-group-name $volumeGroupName \
    --name $newVolumeName \
    --size-gib $newVolumeSizeGiB \
    --creation-data source-id=$snapshotId create-source=VolumeSnapshot
```

---

After the operation finishes, confirm that the new volume appears under **Volumes** in the volume group where you created it.

## Export volume snapshot

You can export an Azure Elastic SAN Next Generation volume snapshot to a managed disk snapshot. The export can only start when volume snapshot background copy finishes. Use the `CompletionPercent` property to check the status of the background copy. 

### Limitations

- When you resize a volume, any incremental snapshots that are under background copy fail.
- The first snapshot you take after resizing a volume is a full snapshot, and the following snapshots are incremental snapshots.

# [Portal](#tab/azure-portal)

1. Go to your Elastic SAN Next Generation resource and select **Volume snapshots**.
1. Select a volume group, and then select the snapshot you want to export.
1. Select **Export**, enter a name and resource group for the managed disk snapshot, and then select **Export**.

# [PowerShell](#tab/azure-powershell)

The following script uses [Get-AzElasticSanVolumeSnapshot](/powershell/module/az.elasticsan/get-azelasticsanvolumesnapshot), [New-AzSnapshotConfig](/powershell/module/az.compute/new-azsnapshotconfig), and [New-AzSnapshot](/powershell/module/az.compute/new-azsnapshot) to export an Azure Elastic SAN Next Generation volume snapshot. Replace the placeholder values before you run the script.

```azurepowershell
$resourceGroupName = "<resource-group-name>"
$elasticSanName = "<elastic-san-name>"
$volumeGroupName = "<volume-group-name>"
$elasticSanSnapshotName = "<elastic-san-snapshot-name>"
$managedDiskSnapshotName = "<managed-disk-snapshot-name>"
$region = "<region>"

$elasticSanVolumeSnapshotResourceId = (Get-AzElasticSanVolumeSnapshot -ResourceGroupName $resourceGroupName -ElasticSanName $elasticSanName -VolumeGroupName $volumeGroupName -Name $elasticSanSnapshotName).Id

$snapshotConfig = New-AzSnapshotConfig -Location $region -AccountType Standard_LRS -CreateOption CopyFromSanSnapshot -ElasticSanResourceId $elasticSanVolumeSnapshotResourceId
New-AzSnapshot -ResourceGroupName $resourceGroupName -SnapshotName $managedDiskSnapshotName -Snapshot $snapshotConfig
```

# [Azure CLI](#tab/azure-cli)

The following script uses [az elastic-san volume snapshot show](/cli/azure/elastic-san/volume/snapshot#az-elastic-san-volume-snapshot-show) to retrieve the Azure Elastic SAN Next Generation volume snapshot ID and [az snapshot create](/cli/azure/snapshot#az-snapshot-create) to create a managed disk snapshot. Replace the placeholder values before you run the script.

```azurecli
resourceGroupName="<resource-group-name>"
elasticSanName="<elastic-san-name>"
volumeGroupName="<volume-group-name>"
elasticSanSnapshotName="<elastic-san-snapshot-name>"
managedDiskSnapshotName="<managed-disk-snapshot-name>"
region="<region>"

snapshotId=$(az elastic-san volume snapshot show --resource-group $resourceGroupName --elastic-san-name $elasticSanName --volume-group-name $volumeGroupName --name $elasticSanSnapshotName --query id --output tsv)
az snapshot create --resource-group $resourceGroupName --name $managedDiskSnapshotName --elastic-san-id $snapshotId --location $region
```

---

After the export starts, confirm that the managed disk snapshot appears in the destination resource group. Monitor `CompletionPercent` in Azure PowerShell or `completionPercent` in Azure CLI to track the export.

## Delete a volume snapshot

You can delete Azure Elastic SAN Next Generation volume snapshots individually by using the Azure portal, Azure PowerShell, or Azure CLI. Deleting an individual snapshot doesn't change its source volume. However, force-deleting a source volume, volume group, or Azure Elastic SAN Next Generation resource can preserve or delete snapshot data depending on whether snapshot hardening is complete. Before you delete a snapshot or a resource that contains snapshots, review [Snapshot retention and source-resource deletion](next-generation-snapshots-overview.md#snapshot-retention-and-source-resource-deletion).

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to your Elastic SAN Next Generation resource and select **Volume snapshots**.
1. Select the volume group, and then select the snapshot that you want to delete.
1. Select **Delete**.

# [PowerShell](#tab/azure-powershell)

The following script uses [Remove-AzElasticSanVolumeSnapshot](/powershell/module/az.elasticsan/remove-azelasticsanvolumesnapshot) to delete one snapshot. Replace the placeholder values before you run the script.

```azurepowershell
$resourceGroupName = "<resource-group-name>"
$elasticSanName = "<elastic-san-name>"
$volumeGroupName = "<volume-group-name>"
$snapshotName = "<snapshot-name>"

Remove-AzElasticSanVolumeSnapshot `
    -ResourceGroupName $resourceGroupName `
    -ElasticSanName $elasticSanName `
    -VolumeGroupName $volumeGroupName `
    -Name $snapshotName
```

# [Azure CLI](#tab/azure-cli)

The following script uses [az elastic-san volume snapshot delete](/cli/azure/elastic-san/volume/snapshot#az-elastic-san-volume-snapshot-delete) to delete one snapshot. Replace the placeholder values before you run the script.

```azurecli
resourceGroupName="<resource-group-name>"
elasticSanName="<elastic-san-name>"
volumeGroupName="<volume-group-name>"
snapshotName="<snapshot-name>"

az elastic-san volume snapshot delete \
    --resource-group $resourceGroupName \
    --elastic-san-name $elasticSanName \
    --volume-group-name $volumeGroupName \
    --name $snapshotName \
    --yes
```

---

After the operation finishes, confirm that the snapshot no longer appears under **Volume snapshots** for the volume group.

## Next steps

- [Azure Elastic SAN Next Generation Preview snapshots overview](next-generation-snapshots-overview.md)
