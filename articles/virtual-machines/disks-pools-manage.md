---
title: Manage an Azure disk pool
description: Learn how to manage an Azure disk pool.
author: roygara
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 06/10/2021
ms.author: rogarana
ms.subservice: disks
---

# Manage a disk pool

Once you've deployed a disk pool, there are two management actions available to you. You can:
- Add or remove a disk to or from a disk pool
- Disable iSCSI support on a disk

## Add/Remove a disk to/from a pool

Your disk must meet the following requirements in order to be added to the disk pool:
- Must be either a premium SSD or an ultra disk in the same region and availability zone as the disk pool, or use ZRS.
    - Ultra disks must have a disk sector size of 512 bytes.
- Must be a shared disk, with a maxShares value of two or greater.
- Your disk pool resource provider must have the necessary RBAC permissions.

# [PowerShell](#tab/azure-powershell)

PowerShell content

# [Azure CLI](#tab/azure-cli)

```azurecli
#Initialize input parameters 
resourceGroupName='yuemlu-avs-rg'
diskName='disk-1tb-1'
diskPoolName='yuemlu-eastus-diskpool'
targetName='target1'
lunName='lun-0'

#Add the disk to disk pool
diskId=$(az disk show --name $diskName --resource-group $resourceGroupName --query "id" -o json)
diskId="${diskId%\"}"
diskId="${diskId#\"}"
az disk-pool update --name $diskPoolName --resource-group $resourceGroupName --disks $diskId

#Expose disks added in the Disk Pool as iSCSI Lun
az disk-pool iscsi-target update --name $targetName \
 --disk-pool-name $diskPoolName \
 --resource-group $resourceGroupName \
 --luns name=$lunName managed-disk-azure-resource-id=$diskId
```

---

## Disable iSCSI on a disk and remove it from the pool

iSCSI support can be disabled or enabled on each individual disk in a disk pool by updating the iSCSI configuration. Before you disable iSCSI support on a disk, confirm there is no outstanding iSCSI connection to the iSCSI lun the disk is exposed as. When the disk is removed from the disk pool, it isn't deleted to ensure there is no data loss. You must manually delete the disk if you don't want to incur further charges for having the disk.