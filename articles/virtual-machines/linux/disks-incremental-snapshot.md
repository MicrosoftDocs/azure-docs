---
title: Azure Disk Storage managed disk overview for Linux VMs | Microsoft Docs
description: Overview of Azure managed disks, which handles the storage accounts for you when using Linux VMs
services: "virtual-machines-linux,storage"
author: roygara
ms.service: virtual-machines-linux
ms.tgt_pltfrm: vm-linux
ms.topic: overview
ms.date: 07/24/2019
ms.author: rogarana
ms.subservice: disks
---

# Creating an incremental snapshot

A regular snapshot is a full, read-only copy of a virtual hard drive (VHD). You can take a snapshot of an OS or data disk VHD to use as a backup or to troubleshoot virtual machine (VM) issues. An incremental snapshot, is a snapshot which consists only of the changes that occured between the last snapshot. It is billed only for that difference in space, is stored on zone redundant storage (ZRS) standard HDDS where it is supported, and is stored on local redundant storage (LRS) standard HDDs where ZRS is not supported.

## ARM template

Create an incremental snapshot for a managed disk by setting the apiVersion as 2019-03-01 and setting the incremental property to true as shown below. 

```
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "diskName": {
      "type": "string",
      "defaultValue": "contosodisk1"
    },
  "diskResourceId": {
    "defaultValue": "/subscriptions/204d16fb-6c8c-4f53-9296-e73ead084f96/resourceGroups/contoso/providers/Microsoft.Compute/disks/ contosodisk1",
    "type": "String"
  }
  }, 
  "resources": [
  {
    "type": "Microsoft.Compute/snapshots",
    "name": "[concat( parameters('diskName'),'_snapshot1')]",
    "location": "[resourceGroup().location]",
    "apiVersion": "2019-03-01",
    "sku": {
      "name": "Standard_LRS"
    },
    "properties": {
      "creationData": {
        "createOption": "Copy",
        "sourceResourceId": "[parameters('diskResourceId')]"
      },
      "incremental": true
    }
  }
  ]
}
```

## Next steps

Now that you've created an incremental snapshot, you can use it to get the differences between the current and last snapshot.

See our sample for details.