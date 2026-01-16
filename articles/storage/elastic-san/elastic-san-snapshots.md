---
title: Backup Azure Elastic SAN volumes 
description: Learn about snapshots for Azure Elastic SAN, including their best uses, how to create them, and how to use them to create new volumes or export to a managed disk.
author: roygara
ms.service: azure-elastic-san-storage
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: concept-article
ms.date: 01/08/2026
ms.author: rogarana
# Customer intent: "As a cloud administrator, I want to create and manage snapshots of Azure Elastic SAN volumes, so that I can efficiently back up data and restore volumes as needed for development and testing without incurring extra costs."
---

# Snapshot Azure Elastic SAN volumes

Azure Elastic SAN volume snapshots are incremental point-in-time backups of your volumes. The first snapshot you take doesn't occupy any space, and every subsequent snapshot consists only of the changes to the Elastic SAN volume since the last snapshot. This approach is different from a managed disk snapshot. The first snapshot you take for a managed disk is a full copy of the managed disk and each subsequent snapshot consists of only the changes to the disk since the last snapshot. Snapshots of your Elastic SAN volumes don't incur any separate billing. However, they reside in your Elastic SAN and consume the SAN's capacity. You can't use snapshots to change the state of an existing volume. You can only use them to either deploy a new volume or export the data to a managed disk snapshot.

You can take up to 200 snapshots per volume at a rate of seven snapshots every five minutes. Snapshots persist until either the volume itself is deleted or the snapshots are deleted. Snapshots don't persist after the volume is deleted. If you need your data to persist after deleting a volume, [export your volume's snapshot to a managed disk snapshot](#export-volume-snapshot). You can only export your volume snapshots to the same region via Elastic SAN. The redundancy type of the snapshot (LRS or ZRS) is determined by the redundancy type of the SAN.


## General guidance

Use Elastic SAN volume snapshots when you want to restore volumes quickly, like when you have dev/test workloads. Volumes created from volume snapshots are available instantly for use, while the rehydration happens in the background. Don't consider volume snapshots when hardening your backups.

Use managed disk snapshots when you either want to create a managed disk from your Elastic SAN volume or if you want to keep a long term backup of your Elastic SAN volumes. Managed disk snapshots are useful when you require durable checkpoints or version control for your Elastic SAN volumes, and you don't need to restore a volume backup instantly. Volumes created from managed disk snapshots are available instantly, but it takes time for the rehydration to happen in the background, and you might experience slightly degraded performance. You can create volumes from volume snapshots or disk snapshots that were taken from a different volume group in the same SAN or even from within a different SAN as long as they are in the same region. You can't create a volume from a managed disk snapshot in a different region.  

### Take a stable snapshot

You can take a snapshot anytime. However, if you take snapshots while the VM is running, keep these things in mind:

When the VM is running, data is still streaming to the volumes. As a result, snapshots of a running VM might contain partial operations that are in flight.
If several volumes are attached to a VM, snapshots of different volumes might occur at different times.
In the described scenario, snapshots aren't coordinated. This lack of coordination is a problem for striped volumes whose files might be corrupted if changes were being made during a backup. So the backup process must implement the following steps:

- Freeze all the volumes.
- Flush all the pending writes.
- Create an incremental snapshot for each volume.

Some Windows applications, like SQL Server, provide a coordinated backup mechanism through a volume shadow service to create application-consistent backups. On Linux, you can use a tool like fsfreeze to coordinate disks. This tool provides file-consistent backups, not application-consistent snapshots.

## Create a volume snapshot

You can create snapshots of your volumes using the Azure portal, the Azure PowerShell module, or the Azure CLI.

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your elastic SAN and select **Volume snapshots**.
1. Select **Create a snapshot**, and then fill in the fields.

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

You can use snapshots of elastic SAN volumes to create new volumes by using the Azure portal, the Azure PowerShell module, or the Azure CLI. You can't use snapshots to change the state of existing volumes.

# [Portal](#tab/azure-portal)

1. Navigate to your elastic SAN and select **Volumes**.
1. Select **+ Create volume** and enter the details.
1. For **Source type**, select **Volume snapshot** and fill out the details, specifying the snapshot you want to use.
1. Select **Create**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
# create a volume with a snapshot id 
New-AzElasticSanVolume -ElasticSanName $esname -ResourceGroupName $rgname -VolumeGroupName $vgname -Name $volname2 -CreationDataSourceId $snapshot.Id -CreationDataCreateSource VolumeSnapshot -SizeGiB 1
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume create -g "resourceGroupName" -e "san_name" -v "vg_name" -n "volume_name_2" --size-gib 2 --creation-data '{source-id:"snapshot_id",create-source:VolumeSnapshot}'
```

---

## Create a volume from a managed disk snapshot

You can use snapshots of managed disks to create new elastic SAN volumes by using the Azure portal, the Azure PowerShell module, or the Azure CLI.

# [Portal](#tab/azure-portal)

1. Navigate to your elastic SAN and select **Volumes**.
1. Select **+ Create volume** and enter the details.
1. For **Source type**, select **Disk snapshot** and enter the details, specifying the snapshot you want to use.
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
1. Select a volume group, then select the snapshot you want to delete.
1. Select **Delete**.

# [PowerShell](#tab/azure-powershell)

The following script deletes an individual snapshot. Replace the values, and then run the command.

```azurepowershell
# remove a snapshot
Remove-AzElasticSanVolumeSnapshot -ResourceGroupName $rgname -ElasticSanName $esname -VolumeGroupName $vgname -Name $snapshotname1
```

# [Azure CLI](#tab/azure-cli)
The following command deletes an individual snapshot. Replace the values, and then run the command.

```azurecli
az elastic-san volume snapshot delete -g "resourceGroupName" -e "san_name" -v "vg_name" -n "snapshot_name"
```
---

## Export volume snapshot

Elastic SAN volume snapshots are automatically deleted when you delete the volume. To make your snapshot data persist beyond deletion, export the snapshots to managed disk snapshots. Exporting a volume snapshot to a managed disk snapshot takes time. How much time it takes depends on the size of the snapshot. You can check how much is left before completion by checking the `CompletionPercentage` property of the managed disk snapshot.

### Billing implications

Elastic SAN snapshots don't have any extra billing associated with them. They only consume your elastic SAN's capacity. Once you export an elastic SAN snapshot to a managed disk snapshot, the managed disk snapshot begins to incur billing charges.

# [Portal](#tab/azure-portal)

1. Navigate to your elastic SAN and select **Volume snapshots**.
1. Select a volume group, and then select the snapshot you want to export.
1. Select **Export**, enter the details, and then select **Export**.

# [PowerShell](#tab/azure-powershell)

Replace the variables in the following script, and then run it.

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

Replace the variables in the following script, and then run it.

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
