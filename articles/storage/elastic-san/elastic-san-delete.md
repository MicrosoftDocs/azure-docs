---
title: Delete an Azure Elastic SAN
description: Learn how to delete an Azure Elastic SAN and its resources with the Azure portal, Azure PowerShell module, or the Azure CLI.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 05/31/2024
ms.author: rogarana
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Delete an Elastic SAN

Your Elastic storage area network (SAN) resources can be deleted at different resource levels. This article covers the overall deletion process, starting from disconnecting iSCSI connections to volumes, deleting the volumes themselves, deleting a volume group, and deleting an elastic SAN itself. Before you delete your elastic SAN, make sure it's not being used in any running workloads.

## Disconnect volumes from clients

### Windows

You can use the following script to delete your connections. To execute it, you require the following parameters:
- $ResourceGroupName: Resource Group Name
- $ElasticSanName: Elastic SAN Name
- $VolumeGroupName: Volume Group Name
- $VolumeName: List of Volumes to be disconnected (comma separated)

Copy the script from [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/disconnect.ps1) and save it as a .ps1 file, for example, disconnect.ps1. Then execute it with the required parameters. The following is an example of how to run the script:
```
./disconnect.ps1 $ResourceGroupName $ElasticSanName $VolumeGroupName $VolumeName

```

### Linux

You can use the following script to create your connections. To execute it, you'll require the following parameters:

- subscription: Subscription ID
- g: Resource Group Name
- e: Elastic SAN Name
- v: Volume Group Name
- n <vol1, vol2, ...>: Names of volumes 1 and 2 and other volume names that you might require, comma separated

Copy the script from [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/CLI%20(Linux)%20Multi-Session%20Connect%20Scripts/disconnect_for_documentation.py) and save it as a .py file, for example, disconnect.py. Then execute it with the required parameters. The following is an example of how you'd run the script:

```
./disconnect.py --subscription <subid> -g <rgname> -e <esanname> -v <vgname> -n <vol1, vol2>
```

## Delete a SAN

You can delete your SAN by using the Azure portal, Azure PowerShell, or Azure CLI. If you delete a SAN or a volume group, the corresponding child resources are deleted along with it. The delete commands for each of the resource levels are below.


The following commands delete your volumes. These commands use `ForceDelete false`, `-DeleteSnapshot false`, `--x-ms-force-delete false`, and `--x-ms-delete-snapshots false` parameters for PowerShell and CLI, respectively. If you set `ForceDelete` or `--x-ms-force-delete` to `true`, it causes volume deletion to succeed even if you have active iSCSI connections. If you set `-DeleteSnapshot` or `--x-ms-delete-snapshots` to `true`, it deletes all snapshots associated with the volume, and the volume itself.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $volumeGroupName -Name $volumeName -ForceDelete false -DeleteSnapshot false
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume delete -e $sanName -g $resourceGroupName -v $volumeGroupName -n $volumeName --x-ms-force-delete false --x-ms-delete-snapshots false
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

[Plan for deploying an Elastic SAN](elastic-san-planning.md)
