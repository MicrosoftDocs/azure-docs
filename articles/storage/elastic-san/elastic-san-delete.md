---
title: Delete an Azure Elastic SAN Preview
description: Learn how to delete an Azure Elastic SAN Preview with the Azure portal, Azure PowerShell module, or the Azure CLI.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 02/22/2023
ms.author: rogarana
ms.custom: ignite-2022, devx-track-azurecli, devx-track-azurepowershell
---

# Delete an Elastic SAN Preview

Your Elastic Storage Area Network (SAN) resources can be deleted at different resource levels. Here. we will be providing you with commands to delete all your resources at each level, starting from deleting iSCSI connections to volumes, to deleting the volumes themselves, to deleting a volume group, and finally, to delete the Elastic SAN itself. To start off with, we strongly recommend that before you delete your SAN, you disconnect every volume in your Elastic SAN Preview from any connected hosts so that all active connections are dropped.

## Disconnect volumes from clients

### Windows

To delete iSCSI connections to volumes, you'll need to get **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort** from your Azure Elastic SAN volume.

Run the following commands to get these values:

```azurepowershell
# Get the target name and iSCSI portal name to connect a volume to a client 
$connectVolume = Get-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $searchedVolumeGroup -Name $searchedVolume
$connectVolume.storagetargetiqn
$connectVolume.storagetargetportalhostname
$connectVolume.storagetargetportalport
```

Note down the values for **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort**, you'll need them for the next commands.

In your compute client, retrieve the sessionID for the Elastic SAN volumes you'd like to disconnect using `iscsicli SessionList`.

Replace **yourStorageTargetIQN**, **yourStorageTargetPortalHostName**, and **yourStorageTargetPortalPort** with the values you kept, then run the following commands from your compute client to disconnect an Elastic SAN volume.

```
iscsicli RemovePersistentTarget ROOT\ISCSIPRT\0000_0 $yourStorageTargetIQN -1 $yourStorageTargetPortalPort $yourStorageTargetPortalHostName

iscsicli LogoutTarget <sessionID>

```

### Linux

To delete iSCSI connections to volumes, you'll need to get **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort** from your Azure Elastic SAN volume.

Run the following command to get these values:

```azurecli
az elastic-san volume-group list -e $sanName -g $resourceGroupName -v $searchedVolumeGroup -n $searchedVolume
```

Note down the values for **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort**, you'll need them for the next commands.

Replace **yourStorageTargetIQN**, **yourStorageTargetPortalHostName**, and **yourStorageTargetPortalPort** with the values you kept, then run the following commands from your compute client to connect an Elastic SAN volume.

```
iscsiadm --mode node --target **yourStorageTargetIQN** --portal **yourStorageTargetPortalHostName**:**yourStorageTargetPortalPort** --logout
```

## Delete a SAN

When your SAN has no active connections to any clients, you may delete it using the Azure portal or Azure PowerShell module. If you delete a SAN or a volume group, the corresponding child resources will be deleted along with it. The delete commands for each of the resource levels are below.

One thing to note about the SAN deletion process is that if you have not deleted all the volumes that have active iSCSI connections, the delete operation will delete all the volumes that don't have iSCSI connections but will fail on those volumes that do, and the SAN, volume groups, and volumes with active iSCSI connections will remain. Similarly, deleting volumes that have active iSCSI connections will cause the delete operation to fail. If you want to delete a volume, you must delete any active iSCSI connections it may have.

To delete volumes, run the below commands.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $volumeGroupName -Name $volumeName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume delete -e $sanName -g $resourceGroupName -v $volumeGroupName -n $volumeName
```
---

To delete volume groups, run the below commands. Volume group deletion will fail if there are volumes with active iSCSI connections, i.e., it will clean up the volumes that don't have active connections but will fail upon encountering any volume that does.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSanVolumeGroup -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -Name $volumeGroupName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume-group delete -e $sanName -g $resourceGroupName -n $volumeGroupName
```
---

To delete the Elastic SAN itself, run the below commands.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSan -ResourceGroupName $resourceGroupName -Name $sanName
```
# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san delete -n $sanName -g $resourceGroupName
```
---

## Next steps

[Plan for deploying an Elastic SAN Preview](elastic-san-planning.md)
