---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 12/06/2022
 ms.author: rogarana
 ms.custom: include file
---
1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to the disk you'd like to snapshot.
1. On your disk, select **Create a Snapshot**

    :::image type="content" source="media/virtual-machines-disks-incremental-snapshots-portal/create-snapshot-button-incremental.png" alt-text="Screenshot. Your disk's blade, with **+Create snapshot** highlighted, as that is what you must select.":::

1. Select the resource group you'd like to use and enter a name.
1. Select **Incremental** and select **Review + Create**

    :::image type="content" source="media/virtual-machines-disks-incremental-snapshots-portal/incremental-snapshot-create-snapshot-blade.png" alt-text="Screenshot. Create a snapshot blade, fill in the name and select incremental, then create your snapshot.":::

1. Select **Create**

    :::image type="content" source="media/virtual-machines-disks-incremental-snapshots-portal/create-incremental-snapshot-validation.png" alt-text="Screenshot. Validation page for your snapshot, confirm your selections then create the snapshot.":::
