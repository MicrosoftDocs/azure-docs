---
title: Delete an Azure Elastic SAN
description: Learn how to delete an Azure Elastic SAN with the Azure portal, Azure PowerShell module, or the Azure CLI.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 08/05/2022
ms.author: rogarana
ms.subservice: elastic-san
---

# Delete an Elastic SAN

In order to delete an elastic SAN, you first need to disconnect every volume in your SAN from any connected hosts.

You can disconnect a volume from a connected host with the following iSCSI commands:

example cmd 1

example cd 2

When your SAN has no active connections, you may delete it using the Azure portal or Azure PowerShell module.

First, delete each volume.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSanVolumeGroup -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -GroupName $volumeGroupName -Name $volumeName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san delete -e $sanName -g $resourceGroupName -v $volumeGroupName -n $volumeName
```
---

Then, delete each volume group.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSanVolumeGroup -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -GroupName $volumeGroupName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san delete -e $sanName -g $resourceGroupName -n $volumeGroupName
```
---

Finally, delete the elastic SAN itself.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSan -ResourceGroupName $resourceGroupName -Name $sanName
```
# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san delete -n $sanName -g $resourceGroupName
```
---