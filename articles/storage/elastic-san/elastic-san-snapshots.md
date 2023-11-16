---
title: Backup Azure Elastic SAN Preview volumes
description: Learn about snapshots for Azure Elastic SAN Preview, including how to create and use them.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: rogarana
---

# Snapshot Azure Elastic SAN Preview volumes

Azure Elastic SAN Preview volume snapshots are incremental point-in-time backups of your volumes. The first snapshot you take is a full copy of your volume but every subsequent snapshot consists only of the changes since the last snapshot. Snapshots of your volumes don't have any separate billing, but they reside in your elastic SAN and consume the SAN's capacity. Snapshots can't be used to change the state of an existing volume, you can only use them to either deploy a new volume or export the data to a managed disk snapshot.

You can take as many snapshots of your volumes as you like, as long as there's available capacity in your elastic SAN. Snapshots persist until either the volume itself is deleted or the snapshots are deleted. Snapshots don't persist after the volume is deleted. If you need your data to persist after deleting a volume, [export your volume's snapshot to a managed disk snapshot](#export-volume-snapshot).

## General guidance

You can take a snapshot anytime, but if you’re taking snapshots while the VM is running, keep these things in mind:

When the VM is running, data is still being streamed to the volumes. As a result, snapshots of a running VM might contain partial operations that were in flight.
If there are several disks involved in a VM, snapshots of different disks might occur at different times.
In the described scenario, snapshots weren't coordinated. This lack of coordination is a problem for striped volumes whose files might be corrupted if changes were being made during a backup. So the backup process must implement the following steps:

- Freeze all the disks.
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

The following command will create a 1 GiB

```azurepowershell
New-AzElasticSanVolume -ElasticSanName $esname -ResourceGroupName $rgname -VolumeGroupName $vgname -Name $volname2 -CreationDataSourceId $snapshot.Id -SizeGiB 1
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

Elastic SAN volume snapshots are automatically deleted when the volume is deleted. If you need your snapshot's data to persist beyond deletion, export them to managed disk snapshots. Once you export an elastic SAN snapshot to a managed disk snapshot, the managed disk snapshot begins to incur billing charges. Elastic SAN snapshots don't have any extra billing associated with them, they only consume your elastic SAN's capacity.

Currently, you can only export snapshots using the Azure portal. The Azure PowerShell module and the Azure CLI can't be used to export snapshots.

1. Navigate to your elastic SAN and select **Volume snapshots**.
1. Select a volume group, then select the snapshot you'd like to export.
1. Select Export and fill out the details, then select **Export**.


## Create volumes from disk snapshots

Currently, you can only use the Azure portal to create Elastic SAN volumes from managed disks snapshots. The Azure PowerShell module and the Azure CLI can't be used to create Elastic SAN volumes from managed disk snapshots. Managed disk snapshots must be in the same region as your elastic SAN to create volumes with them.

1. Navigate to your SAN and select **volumes**.
1. Select **Create volume**.
1. For **Source type** select **Disk snapshot** and fill out the rest of the values.
1. Select **Create**.