---
title: Backup Azure Elastic SAN volumes 
description: Learn about snapshots for Azure Elastic SAN, including their best uses, how to create them, and how to use them to create new volumes or export to a managed disk.
author: roygara
ms.service: azure-elastic-san
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: concept-article
ms.date: 08/25/2026
ms.author: rogarana
# Customer intent: "As a cloud administrator, I want to create and manage snapshots of Azure Elastic SAN volumes, so that I can efficiently back up data and restore volumes as needed for development and testing without incurring extra costs."
---

# Snapshot Azure Elastic SAN volumes

Azure Elastic SAN volume snapshots are incremental point-in-time backups of your volumes. The first snapshot you take doesn't occupy any space, and every subsequent snapshot consists only of the changes to the Elastic SAN volume since the last snapshot. This approach is different from a managed disk snapshot. The first snapshot you take for a managed disk is a full copy of the managed disk and each subsequent snapshot consists of only the changes to the disk since the last snapshot. Snapshots of your Elastic SAN volumes don't incur any separate billing. However, they reside in your Elastic SAN and consume the SAN's capacity. You can't use snapshots to change the state of an existing volume. You can only use them to either deploy a new volume or export the data to a managed disk snapshot.

You can take up to 200 snapshots per volume at a rate of seven snapshots every five minutes. Snapshots persist until either the volume itself is deleted or the snapshots are deleted. Snapshots don't persist after the volume is deleted. If you need your data to persist after deleting a volume, [export your volume's snapshot to a managed disk snapshot](#export-volume-snapshot). You can only export your volume snapshots to the same region via Elastic SAN. The redundancy type of the snapshot (LRS or ZRS) is determined by the redundancy type of the SAN.


## Choose how to retain a snapshot

First, create an Elastic SAN volume snapshot. You can use that snapshot for fast volume recovery, or export it to a managed disk snapshot for independent retention. Use the following comparison to decide whether to keep only the volume snapshot or also export it to a managed disk snapshot.

| Requirement | Keep the Elastic SAN volume snapshot | Export to a managed disk snapshot |
| --- | --- | --- |
| Primary use | Quickly restore development and test volumes | Retain a long-term backup or create a managed disk |
| Availability of a new volume | Available immediately while rehydration occurs in the background | Available immediately, but performance might be reduced while rehydration occurs |
| Retention | Deleted when you delete the source volume | Persists independently of the source Elastic SAN volume |
| Billing | No separate charge, but consumes Elastic SAN capacity | Incurs managed disk snapshot charges |
| Region | You can create a volume in any volume group in the same region, whether the volume group is in the same Azure Elastic SAN or a different one | You can create a volume in a volume group only when its Azure Elastic SAN is in the same region as the managed disk snapshot |

Elastic SAN volume snapshots aren't durable backups because deleting the source volume also deletes its snapshots. When you need to retain the backup, export the volume snapshot to a managed disk snapshot before deleting the source volume.

## Take a stable snapshot

You can take an Elastic SAN volume snapshot at any time. However, a snapshot taken while a virtual machine (VM) is running might be only crash-consistent. Consider the following risks:

- Data continues to stream to the volumes, so the snapshot might contain incomplete in-flight operations.
- Snapshots of multiple volumes attached to one VM might occur at different times.
- Uncoordinated snapshots can leave striped volumes or application data in an inconsistent state.

To create a file-consistent snapshot across multiple volumes:

- Freeze all the volumes.
- Flush all the pending writes.
- Create an incremental snapshot for each volume.

Some Windows applications, such as SQL Server, use Volume Shadow Copy Service (VSS) to coordinate application-consistent backups. On Linux, you can use fsfreeze to coordinate disks and create file-consistent backups, fsfreeze doesn't create application-consistent snapshots.

## Create a volume snapshot

You can create an Elastic SAN volume snapshot by using the Azure portal, Azure PowerShell, or Azure CLI. Before you begin, identify the source Elastic SAN volume.

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to your Azure Elastic SAN and select **Volume snapshots**.
1. Select **Create a snapshot**.
1. Select the source volume group and source volume, enter a snapshot name, and then select **Create**.

# [PowerShell](#tab/azure-powershell)

The following script uses [Get-AzElasticSanVolume](/powershell/module/az.elasticsan/get-azelasticsanvolume) to retrieve the source volume and [New-AzElasticSanVolumeSnapshot](/powershell/module/az.elasticsan/new-azelasticsanvolumesnapshot) to create the snapshot. Replace the placeholder values before you run the script.

```azurepowershell
$resourceGroupName = "<resource-group-name>"
$elasticSanName = "<elastic-san-name>"
$volumeGroupName = "<volume-group-name>"
$sourceVolumeName = "<source-volume-name>"
$snapshotName = "<snapshot-name>"

$sourceVolume = Get-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $elasticSanName -VolumeGroupName $volumeGroupName -Name $sourceVolumeName
New-AzElasticSanVolumeSnapshot -ResourceGroupName $resourceGroupName -ElasticSanName $elasticSanName -VolumeGroupName $volumeGroupName -Name $snapshotName -CreationDataSourceId $sourceVolume.Id
```

# [Azure CLI](#tab/azure-cli)

The following script uses [az elastic-san volume show](/cli/azure/elastic-san/volume#az-elastic-san-volume-show) to retrieve the source volume ID and [az elastic-san volume snapshot create](/cli/azure/elastic-san/volume/snapshot#az-elastic-san-volume-snapshot-create) to create the snapshot. Replace the placeholder values before you run the script.

```azurecli
resourceGroupName="<resource-group-name>"
elasticSanName="<elastic-san-name>"
volumeGroupName="<volume-group-name>"
sourceVolumeName="<source-volume-name>"
snapshotName="<snapshot-name>"

sourceVolumeId=$(az elastic-san volume show --resource-group $resourceGroupName --elastic-san-name $elasticSanName --volume-group-name $volumeGroupName --name $sourceVolumeName --query id --output tsv)
az elastic-san volume snapshot create --resource-group $resourceGroupName --elastic-san-name $elasticSanName --volume-group-name $volumeGroupName --name $snapshotName --creation-data source-id=$sourceVolumeId
```

---

After the operation finishes, confirm that the snapshot appears under **Volume snapshots** for the source volume group.

## Create a volume from a volume snapshot

You can use an Elastic SAN volume snapshot to create a new volume by using the Azure portal, Azure PowerShell, or Azure CLI. The snapshot and the Azure Elastic SAN where you create the new volume must be in the same region. You can't use snapshots to change the state of existing volumes.

# [Portal](#tab/azure-portal)

1. Go to the Azure Elastic SAN where you want to create the volume, and then select **Volumes**.
1. Select **+ Create volume** and enter the volume name, volume group, and size.
1. For **Source type**, select **Volume snapshot**, and then select the source snapshot.
1. Select **Create**.

# [PowerShell](#tab/azure-powershell)

The following script uses [Get-AzElasticSanVolumeSnapshot](/powershell/module/az.elasticsan/get-azelasticsanvolumesnapshot) to retrieve the source snapshot and [New-AzElasticSanVolume](/powershell/module/az.elasticsan/new-azelasticsanvolume) to create the volume. Replace the placeholder values before you run the script.

```azurepowershell
$resourceGroupName = "<resource-group-name>"
$elasticSanName = "<elastic-san-name>"
$volumeGroupName = "<volume-group-name>"
$snapshotName = "<snapshot-name>"
$newVolumeName = "<new-volume-name>"

$snapshot = Get-AzElasticSanVolumeSnapshot -ResourceGroupName $resourceGroupName -ElasticSanName $elasticSanName -VolumeGroupName $volumeGroupName -Name $snapshotName
New-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $elasticSanName -VolumeGroupName $volumeGroupName -Name $newVolumeName -CreationDataSourceId $snapshot.Id -CreationDataCreateSource VolumeSnapshot -SizeGiB 2
```

# [Azure CLI](#tab/azure-cli)

The following script uses [az elastic-san volume snapshot show](/cli/azure/elastic-san/volume/snapshot#az-elastic-san-volume-snapshot-show) to retrieve the source snapshot ID and [az elastic-san volume create](/cli/azure/elastic-san/volume#az-elastic-san-volume-create) to create the volume. Replace the placeholder values before you run the script.

```azurecli
resourceGroupName="<resource-group-name>"
elasticSanName="<elastic-san-name>"
volumeGroupName="<volume-group-name>"
snapshotName="<snapshot-name>"
newVolumeName="<new-volume-name>"

snapshotId=$(az elastic-san volume snapshot show --resource-group $resourceGroupName --elastic-san-name $elasticSanName --volume-group-name $volumeGroupName --name $snapshotName --query id --output tsv)
az elastic-san volume create --resource-group $resourceGroupName --elastic-san-name $elasticSanName --volume-group-name $volumeGroupName --name $newVolumeName --size-gib 2 --creation-data source-id=$snapshotId create-source=VolumeSnapshot
```

---

After the operation finishes, confirm that the new volume appears under **Volumes** in the volume group where you created it.

## Create a volume from a managed disk snapshot

You can use a managed disk snapshot to create a new Elastic SAN volume by using the Azure portal, Azure PowerShell, or Azure CLI. The managed disk snapshot and the Azure Elastic SAN where you create the new volume must be in the same region.

# [Portal](#tab/azure-portal)

1. Go to the Azure Elastic SAN where you want to create the volume, and then select **Volumes**.
1. Select **+ Create volume** and enter the volume name, volume group, and size.
1. For **Source type**, select **Disk snapshot**, and then select the managed disk snapshot.
1. Select **Create**.

# [PowerShell](#tab/azure-powershell)

The following script uses [Get-AzSnapshot](/powershell/module/az.compute/get-azsnapshot) to retrieve the managed disk snapshot and [New-AzElasticSanVolume](/powershell/module/az.elasticsan/new-azelasticsanvolume) to create the volume. Replace the placeholder values before you run the script.

```azurepowershell
$resourceGroupName = "<resource-group-name>"
$elasticSanName = "<elastic-san-name>"
$volumeGroupName = "<volume-group-name>"
$managedDiskSnapshotName = "<managed-disk-snapshot-name>"
$newVolumeName = "<new-volume-name>"

$snapshot = Get-AzSnapshot -ResourceGroupName $resourceGroupName -SnapshotName $managedDiskSnapshotName
New-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $elasticSanName -VolumeGroupName $volumeGroupName -Name $newVolumeName -CreationDataSourceId $snapshot.Id -CreationDataCreateSource DiskSnapshot -SizeGiB 2
```

# [Azure CLI](#tab/azure-cli)

The following script uses [az snapshot show](/cli/azure/snapshot#az-snapshot-show) to retrieve the managed disk snapshot ID and [az elastic-san volume create](/cli/azure/elastic-san/volume#az-elastic-san-volume-create) to create the volume. Replace the placeholder values before you run the script.

```azurecli
resourceGroupName="<resource-group-name>"
elasticSanName="<elastic-san-name>"
volumeGroupName="<volume-group-name>"
managedDiskSnapshotName="<managed-disk-snapshot-name>"
newVolumeName="<new-volume-name>"

snapshotId=$(az snapshot show --resource-group $resourceGroupName --name $managedDiskSnapshotName --query id --output tsv)
az elastic-san volume create --resource-group $resourceGroupName --elastic-san-name $elasticSanName --volume-group-name $volumeGroupName --name $newVolumeName --size-gib 2 --creation-data source-id=$snapshotId create-source=DiskSnapshot
```

---

After the operation finishes, confirm that the new volume appears under **Volumes** in the volume group where you created it.

## Delete volume snapshots

You can use the Azure portal, Azure PowerShell, or Azure CLI to delete Elastic SAN volume snapshots. You can delete only one snapshot at a time.

# [Portal](#tab/azure-portal)

1. Go to your Azure Elastic SAN and select **Volume snapshots**.
1. Select a volume group, and then select the snapshot that you want to delete.
1. Select **Delete**.

# [PowerShell](#tab/azure-powershell)

The following script uses [Remove-AzElasticSanVolumeSnapshot](/powershell/module/az.elasticsan/remove-azelasticsanvolumesnapshot) to delete one snapshot. Replace the placeholder values before you run the script.

```azurepowershell
$resourceGroupName = "<resource-group-name>"
$elasticSanName = "<elastic-san-name>"
$volumeGroupName = "<volume-group-name>"
$snapshotName = "<snapshot-name>"

Remove-AzElasticSanVolumeSnapshot -ResourceGroupName $resourceGroupName -ElasticSanName $elasticSanName -VolumeGroupName $volumeGroupName -Name $snapshotName
```

# [Azure CLI](#tab/azure-cli)

The following script uses [az elastic-san volume snapshot delete](/cli/azure/elastic-san/volume/snapshot#az-elastic-san-volume-snapshot-delete) to delete one snapshot. Replace the placeholder values before you run the script.

```azurecli
resourceGroupName="<resource-group-name>"
elasticSanName="<elastic-san-name>"
volumeGroupName="<volume-group-name>"
snapshotName="<snapshot-name>"

az elastic-san volume snapshot delete --resource-group $resourceGroupName --elastic-san-name $elasticSanName --volume-group-name $volumeGroupName --name $snapshotName --yes
```

---

After the operation finishes, confirm that the snapshot no longer appears under **Volume snapshots** for the volume group.

## Export volume snapshot

Elastic SAN volume snapshots are automatically deleted when you delete the source volume. To retain the snapshot data independently, export an Elastic SAN volume snapshot to a managed disk snapshot. Export time depends on the snapshot size. Monitor the `CompletionPercentage` property of the managed disk snapshot to track the export.

### Limitations

The first snapshot that you take after resizing a volume isn't incremental, and its export might fail.

### Billing implications

Elastic SAN volume snapshots don't incur a separate charge, but they consume Azure Elastic SAN capacity. After you export an Elastic SAN volume snapshot, the resulting managed disk snapshot incurs managed disk snapshot charges.

# [Portal](#tab/azure-portal)

1. Go to your Azure Elastic SAN and select **Volume snapshots**.
1. Select a volume group, and then select the snapshot you want to export.
1. Select **Export**, enter a name and resource group for the managed disk snapshot, and then select **Export**.

# [PowerShell](#tab/azure-powershell)

The following script uses [Get-AzElasticSanVolumeSnapshot](/powershell/module/az.elasticsan/get-azelasticsanvolumesnapshot), [New-AzSnapshotConfig](/powershell/module/az.compute/new-azsnapshotconfig), and [New-AzSnapshot](/powershell/module/az.compute/new-azsnapshot) to export an Elastic SAN volume snapshot. Replace the placeholder values before you run the script.

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

The following script uses [az elastic-san volume snapshot show](/cli/azure/elastic-san/volume/snapshot#az-elastic-san-volume-snapshot-show) to retrieve the Elastic SAN volume snapshot ID and [az snapshot create](/cli/azure/snapshot#az-snapshot-create) to create a managed disk snapshot. Replace the placeholder values before you run the script.

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

After the export starts, confirm that the managed disk snapshot appears in the destination resource group. Monitor its `CompletionPercentage` property to track the export.
