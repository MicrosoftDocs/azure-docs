---
title: Deprovision an Azure disk pool
description: Azure Storage protects your data by encrypting it at rest before persisting it to Storage clusters. You can use customer-managed keys to manage encryption with your own keys, or you can rely on Microsoft-managed keys for the encryption of your managed disks.
author: roygara
ms.date: 06/16/2021
ms.topic: conceptual
ms.author: rogarana
ms.service: virtual-machines
ms.subservice: disks
---

# Deprovision an Azure disk pool

This article covers the deletion process for a disk pool, as well as how to disable iSCSI support.

## Delete a disk pool

When you delete a disk pool, all the resources in the managed resource group are also deleted. If there are outstanding iSCSI connections to the disk pool, you cannot delete the disk pool. You must disconnect all clients with iSCSI connections to the disk pool first. Disks that have been added to the disk pool are not deleted.

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal.
1. Search for **Disk pool** and select it, then select the disk pool you want to delete.
1. Select **Delete** at the top of the blade.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzDiskPool -Name "myDiskpoolName" -ResourceGroupName "myRGName"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az disk-pool delete --name "myDiskPool" --resource-group "myResourceGroup"
```

---

## Disable iSCSI support

If you disable iSCSI support on a disk pool, you effectively can no longer use a disk pool.

When you first enable iSCSI support on a disk pool, an iSCSI target is created as the endpoint for the iSCSI connection. You can disable iSCSI support on the disk pool by deleting the iSCSI target. Each disk pool can only have one iSCSI target configured.

You can re-enable iSCSI support on an existing disk pool. iSCSI support cannot be disabled on the disk pool if there are outstanding iSCSI connections to the disk pool.

# [Portal](#tab/azure-portal)

1. Search for **Disk pool** and select your disk pool.
1. Select **iSCSI** under **Settings**.
1. Uncheck **Enable iSCSI** and select **Save**.    

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzDiskPoolIscsiTarget -DiskPoolName "myDiskpoolName" -Name "myiSCSITargetName" -ResourceGroupName "myRGName"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az disk-pool iscsi-target delete --disk-pool-name "myDiskPool" --name "myIscsiTarget" --resource-group "myResourceGroup"
```

---

## Next steps