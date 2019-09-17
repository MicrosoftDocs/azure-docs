---
title: Azure Disk Storage managed disk overview for Linux VMs | Microsoft Docs
description: Overview of Azure managed disks, which handle the storage accounts for you when using Linux VMs
services: "virtual-machines-linux,storage"
author: roygara
ms.service: virtual-machines-linux
ms.tgt_pltfrm: vm-linux
ms.topic: overview
ms.date: 09/24/2019
ms.author: rogarana
ms.subservice: disks
---

# Creating an incremental snapshot

Incremental snapshots consist only of all the changes since the last snapshot. This new capability for managed disk snapshots allows them to be considerably more cost effective, since each individual snapshot no longer requires storing the entire VHD, unless you choose to. Incremental snapshots can still be used to create a full managed disk or, to make another full snapshot in either the same or a different Azure subscription.

There are a few differences between an incremental snapshot and a regular snapshot. Incremental snapshots will always use standard HDDs, irrespective of whatever disk type the source VHD is. Incremental snapshots use ZRS if ZRS is available in the selected region, otherwise LRS is used, this behavior cannot be changed.

Incremental snapshots also offer a unique capability: They enable you to perform a diff to get the changes between two incremental snapshots of the same managed disks.

## Resource Manager template

Create an incremental snapshot for a managed disk by setting the apiVersion as **2019-03-01** and setting the incremental property to true as shown below. 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "diskName": {
      "type": "string",
      "defaultValue": "contosodisk1"
    },
  "diskResourceId": {
    "defaultValue": "<your_managed_disk_resource_ID>",
    "type": "String"
  }
  }, 
  "resources": [
  {
    "type": "Microsoft.Compute/snapshots",
    "name": "[concat( parameters('diskName'),'_snapshot1')]",
    "location": "[resourceGroup().location]",
    "apiVersion": "2019-03-01",
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