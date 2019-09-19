---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/20/2019
 ms.author: rogarana
 ms.custom: include file
---

# Creating an incremental snapshot

Incremental snapshots are snapshots that, when taken, consist only of all the changes since the last snapshot. When you attempt to download or otherwise use an incremental snapshot, the full VHD is used. This new capability for managed disk snapshots potentially allows them to be considerably more cost effective, since each individual snapshot no longer requires storing the entire VHD, unless you choose to. Just like regular snapshots, incremental snapshots can be used to create a full managed disk or, to make a regular snapshot in either the same or a different Azure subscription.

There are a few differences between an incremental snapshot and a regular snapshot. Incremental snapshots will always use standard HDDs, irrespective of whatever disk type the source VHD is, whereas regular snapshots can use premium SSDs. Additionally, if ZRS is available in the selected region, an incremental snapshot will use ZRS automatically. If ZRS is not available in the region, then the snapshot will default to LRS. You can override this behavior and select one manually but, we do not recommend that. In contrast, only LRS is available for regular snapshots.

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