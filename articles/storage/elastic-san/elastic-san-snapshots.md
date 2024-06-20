---
title: Backup Azure Elastic SAN volumes (preview)
description: Learn about snapshots (preview) for Azure Elastic SAN, including how to create and use them.
author: roygara
ms.service: azure-elastic-san-storage
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: conceptual
ms.date: 03/11/2024
ms.author: rogarana
---

# Snapshot Azure Elastic SAN volumes (preview)

Azure Elastic SAN volume snapshots (preview) are incremental point-in-time backups of your volumes. The first snapshot you take occupies no space, and every subsequent snapshot consists only of the changes to the Elastic SAN volume since the last snapshot. This is different from a managed disk snapshot, wherein the first snapshot you take will be a full copy of the managed disk and each subsequent snapshot will consist of only the changes to the disk since the last snapshot. Snapshots of your volumes don't have any separate billing, but they reside in your elastic SAN and consume the SAN's capacity. Snapshots can't be used to change the state of an existing volume, you can only use them to either deploy a new volume or export the data to a managed disk snapshot.

You can take as many snapshots of your volumes as you like, as long as there's available capacity in your elastic SAN. Snapshots persist until either the volume itself is deleted or the snapshots are deleted. Snapshots don't persist after the volume is deleted. If you need your data to persist after deleting a volume, [export your volume's snapshot to a managed disk snapshot](#export-volume-snapshot).


## Limitations

- If a volume is larger than 4 TiB, export of a volume snapshot to a disk snapshot is not supported.

## General guidance

You can take a snapshot anytime, but if you’re taking snapshots while the VM is running, keep these things in mind:

When the VM is running, data is still being streamed to the volumes. As a result, snapshots of a running VM might contain partial operations that were in flight.
If there are several volumes attached to a VM, snapshots of different volumes might occur at different times.
In the described scenario, snapshots weren't coordinated. This lack of coordination is a problem for striped volumes whose files might be corrupted if changes were being made during a backup. So the backup process must implement the following steps:

- Freeze all the volumes.
- Flush all the pending writes.
- Create an incremental snapshot for each volume.

Some Windows applications, like SQL Server, provide a coordinated backup mechanism through a volume shadow service to create application-consistent backups. On Linux, you can use a tool like fsfreeze to coordinate disks (this tool provides file-consistent backups, not application-consistent snapshots).

## Create a volume snapshot

You can create snapshots of your volumes snapshots using the Azure portal, the Azure PowerShell module, or the Azure CLI.

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your elastic SAN, select volume snapshots.
1. Select create a snapshot, then fill in the fields.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$vgname = ""
$volname = ""
$volname2 = ""
$snapshotname1 = ""
$snapshotname2 = ""

# Create snapshots 
$vg = New-AzElasticSanVolumeGroup -ResourceGroupName $rgname -ElasticSanName $esname -Name $vgname
$vol = New-AzElasticSanVolume -ResourceGroupName $rgname -ElasticSanName $esname -VolumeGroupName $vgname -Name $volname -SizeGiB 1 
$snapshot = New-AzElasticSanVolumeSnapshot -ResourceGroupName $rgname -ElasticSanName $esname -VolumeGroupName $vgname -Name $snapshotname1 -CreationDataSourceId $vol.Id
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume snapshot create -g "resourceGroupName" -e "san_name" -v "vg_name" -n "snapshot_name" --creation-data '{source-id:"volume_id"}'
```

---

## Create a volume from a volume snapshot

You can use snapshots of elastic SAN volumes to create new volumes using the Azure portal, the Azure PowerShell module, or the Azure CLI. You can't use snapshots to change the state of existing volumes.

# [Portal](#tab/azure-portal)

1. Navigate to your elastic SAN and select **Volumes**.
1. Select **+ Create volume** and fill out the details.
1. For **Source type** select **Volume snapshot** and fill out the details, specifying the snapshot you want to use.
1. Select **Create**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
# create a volume with a snapshot id 
New-AzElasticSanVolume -ElasticSanName $esname -ResourceGroupName $rgname -VolumeGroupName $vgname -Name $volname2 -CreationDataSourceId $snapshot.Id -SizeGiB 1
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume create -g "resourceGroupName" -e "san_name" -v "vg_name" -n "volume_name_2" --size-gib 2 --creation-data '{source-id:"snapshot_id",create-source:VolumeSnapshot}'
```

---

## Create a volume from a managed disk snapshot

You can use snapshots of managed disks to create new elastic SAN volumes using the Azure portal, the Azure PowerShell module, or the Azure CLI.

# [Portal](#tab/azure-portal)

1. Navigate to your elastic SAN and select **Volumes**.
1. Select **+ Create volume** and fill out the details.
1. For **Source type** select **Disk snapshot** and fill out the details, specifying the snapshot you want to use.
1. Select **Create**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzElasticSanVolume -ElasticSanName $esname -ResourceGroupName $rgname -VolumeGroupName $vgname -Name $volname2 -CreationDataSourceId $snapshot.Id -CreationDataCreateSource DiskSnapshot -SizeGiB 1
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume create -g "resourceGroupName" -e "san_name" -v "vg_name" -n "volume_name_2" --size-gib 2 --creation-data '{source-id:"snapshot_id",create-source:VolumeSnapshot}'
```

---

## Delete volume snapshots

You can use the Azure portal, Azure PowerShell module, or Azure CLI to delete individual snapshots. Currently, you can't delete more than an individual snapshot at a time.

# [Portal](#tab/azure-portal)

1. Navigate to your elastic SAN and select **Volume snapshots**.
1. Select a volume group, then select the snapshot you'd like to delete.
1. Select delete.

# [PowerShell](#tab/azure-powershell)

The following script deletes an individual snapshot. Replace the values, then run the command.

```azurepowershell
# remove a snapshot
Remove-AzElasticSanVolumeSnapshot -ResourceGroupName $rgname -ElasticSanName $esname -VolumeGroupName $vgname -Name $snapshotname1
```

# [Azure CLI](#tab/azure-cli)
The following command deletes an individual snapshot. Replace the values, then run the command.

```azurecli
az elastic-san volume snapshot delete -g "resourceGroupName" -e "san_name" -v "vg_name" -n "snapshot_name"
```
---

## Export volume snapshot

Elastic SAN volume snapshots are automatically deleted when the volume is deleted. For your snapshot's data to persist beyond deletion, export them to managed disk snapshots. Exporting a volume snapshot to a managed disk snapshot takes time, how much time it takes depend on the size of the snapshot. You can check how much is left before completion by checking the `CompletionPercentage` property of the managed disk snapshot.

### Billing implications

Elastic SAN snapshots don't have any extra billing associated with them, they only consume your elastic SAN's capacity. Once you export an elastic SAN snapshot to a managed disk snapshot, the managed disk snapshot begins to incur billing charges.

# [Portal](#tab/azure-portal)

1. Navigate to your elastic SAN and select **Volume snapshots**.
1. Select a volume group, then select the snapshot you'd like to export.
1. Select Export and fill out the details, then select **Export**.

# [PowerShell](#tab/azure-powershell)

Replace the variables in the following script, then run it:

```azurepowershell
$elasticSanName = <nameHere>
$volGroupName = <nameHere>
$region = <yourRegion>
$rgName = <yourResourceGroupName>
$elasticSanSnapshotName = <ElasticSanSnapshotName>
$newSnapName = <NameOfNewSnapshot>

$elasticSanVolumeSnapshotResourceId = (Get-AzElasticSanVolumeSnapshot -ElasticSanName $elasticSanName -ResourceGroupName $rgName -VolumeGroupName $volGroupName -name $elasticSanSnapshotName).Id

$snapshotconfig = New-AzSnapshotConfig -Location $region -AccountType Standard_LRS -CreateOption CopyFromSanSnapshot -ElasticSanResourceId $elasticSanVolumeSnapshotResourceId
New-AzSnapshot -ResourceGroupName $rgName -SnapshotName $newSnapName -Snapshot $snapshotconfig;
```


# [Azure CLI](#tab/azure-cli)

Replace the variables in the following script, then run it:

```azurecli
region=<yourRegion>
rgName=<ResourceGroupName>
sanName=<yourElasticSANName>
vgName=<yourVolumeGroupName>
sanSnapName=<yourElasticSANSnapshotName>
diskSnapName=<nameForNewDiskSnapshot>

snapID=$(az elastic-san volume snapshot show -g $rgName -e $sanName -v $vgName -n $sanSnapName --query 'id' |  tr -d \"~)

az snapshot create -g $rgName --name $diskSnapName --elastic-san-id $snapID --location $region
```


---
