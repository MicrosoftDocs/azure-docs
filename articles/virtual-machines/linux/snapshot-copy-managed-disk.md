---
title: Copy an Azure Managed Disk for Back up | Microsoft Docs
description: Learn how to create a copy of an Azure Managed Disk to use for back up or troubleshooting disk issues.
documentationcenter: ''
author: squillace
manager: timlt
editor: ''
tags: azure-resource-manager
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 2/6/2017
ms.author: rasquill

---
# Create a copy of a VHD stored as an Azure Managed Disk by using Managed Snapshots
Take a snapshot of a Managed disk for backup or create a Managed Disk from the snapshot and attach it to a test virtual machine to troubleshoot. A Managed Snapshot is a full point-in-time copy of a VM Managed Disk. It creates a read-only copy of your VHD and, by default, stores it as a Standard Managed Disk. 

For information about pricing, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/managed-disks/). <!--Add link to topic or blog post that explains managed disks. -->

Use either the Azure portal or the Azure CLI 2.0 to take a snapshot of the Managed Disk.

## Use Azure CLI 2.0 to take a snapshot

> [!NOTE] 
> The following example requires the Azure CLI 2.0 installed and logged into your Azure account.

The following steps show how to obtain and take a snapshot of a managed OS disk using the `az snapshot create` command with the `--source-disk` parameter. The following example assumes that there is a VM called `myVM` created with a managed OS disk in the `myResourceGroup` resource group.

```azure-cli
# take the disk id with which to create a snapshot
osDiskId=$(az vm show -g myResourceGroup -n myVM --query "storageProfile.osDisk.managedDisk.id" -o tsv)
az snapshot create -g myResourceGroup --source "$osDiskId" --name osDisk-backup
```

The output should look something like:

```json
{
  "accountType": "Standard_LRS",
  "creationData": {
    "createOption": "Copy",
    "imageReference": null,
    "sourceResourceId": null,
    "sourceUri": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/osdisk_6NexYgkFQU",
    "storageAccountId": null
  },
  "diskSizeGb": 30,
  "encryptionSettings": null,
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/osDisk-backup",
  "location": "westus",
  "name": "osDisk-backup",
  "osType": "Linux",
  "ownerId": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "tags": null,
  "timeCreated": "2017-02-06T21:27:10.172980+00:00",
  "type": "Microsoft.Compute/snapshots"
}
```

## Use Azure portal to take a snapshot 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Starting in the upper-left, click **New** and search for **snapshot**.
3. In the Snapshot blade, click **Create**.
4. Enter a **Name** for the snapshot.
5. Select an existing [Resource group](../../azure-resource-manager/resource-group-overview.md#resource-groups) or type the name for a new one. 
6. Select an Azure datacenter Location.  
7. For **Source disk**, select the Managed Disk to snapshot.
8. Select the **Account type** to use to store the snapshot. We recommend **Standard_LRS** unless you need it stored on a high performing disk.
9. Click **Create**.

If you plan to use the snapshot to create a Managed Disk and attach it a VM that needs to be high performing, use the parameter `--sku Premium_LRS` with the `az snapshot create` command. This creates the snapshot so that it is stored as a Premium Managed Disk. Premium Managed Disks perform better because they are solid-state drives (SSDs), but cost more than Standard disks (HDDs).


