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

Your Elastic storage area network (SAN) resources can be deleted at different resource levels. This article covers the overall deletion process, starting from disconnecting iSCSI connections to volumes, deleting the volumes themselves, deleting a volume group, and deleting an elastic SAN itself. Before you delete your elastic SAN, make sure it's not being used in any running workloads.

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


To delete volumes, run the following commands.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $volumeGroupName -Name $volumeName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume delete -e $sanName -g $resourceGroupName -v $volumeGroupName -n $volumeName
```
---

To delete volume groups, run the following commands.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSanVolumeGroup -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -Name $volumeGroupName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume-group delete -e $sanName -g $resourceGroupName -n $volumeGroupName
```
---

To delete the Elastic SAN itself, run the following commands.

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
