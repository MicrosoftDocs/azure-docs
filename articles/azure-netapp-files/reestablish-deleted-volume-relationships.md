---
title: Re-establish deleted volume replication relationships in Azure NetApp Files
description: You can re-establish the replication relationship between volumes.
services: azure-netapp-files
author: b-ahibbard
ms.author: anfdocs
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 02/21/2025
# Customer intent: As a cloud administrator, I want to re-establish replication relationships for deleted volumes in Azure NetApp Files, so that I can ensure data continuity and maintain operational efficiency without losing previous snapshot states.
---
# Re-establish deleted volume replication relationships in Azure NetApp Files (preview)

Azure NetApp Files enables you to re-establish a replication relationship between two volumes if you previously deleted it. This condition occurs if the source volume becomes unavailable and you're replicating a source volume to two destination volumes with cross-zone-region replication. While reversing the replication direction, the second replication relationship can't continue to exist and needs to be deleted. After the source volume is available again, and the reverse resync completes, you can return to normal operation and re-establish the relationship from the destination volume.

If the destination volume remains operational and no snapshots are deleted or lost, the replication reestablish operation uses the last common snapshot. The operation incrementally synchronizes the destination volume based on the last known good snapshot. In this condition, a baseline transfer isn't required.

## Considerations

The re-establish replication operation requires the following conditions:

* A common replication snapshot exists on both the source and destination volumes. Typically, this snapshot is previously replicated from the source volume.
* The destination volume is in a clean replication state, meaning that the last replication update completed successfully.
* If backups exist on the destination volume, the re-establish operation can't proceed. In this case, delete the destination backups before attempting to re-establish the replication relationship.
* If no common replication snapshot exists between the source and destination volumes, the replication relationship can't be re-established. To resume replication, delete the existing destination replication volume and create a new replication relationship, which initiates a new baseline transfer.


## Re-establish the relationship

1. From the **Volumes** menu under **Storage service**, select the volume that was formerly the _destination_ volume in the replication relationship you want to re-establish. Then select the **Replication** tab. 
1. In the **Replication** tab, select the **Re-establish** button. 
    :::image type="content" source="./media/reestablish-deleted-volume-relationships/reestablish-button.png" alt-text="Screenshot of volume menu that depicts no existing volume relationships. A red box surrounds the re-establish button." lightbox="./media/reestablish-deleted-volume-relationships/reestablish-button.png":::
1. A dropdown list appears with a selection of all volumes that formerly had either a source or destination replication relationship with the selected volume. From the dropdown menu, select the volume you want to reestablish a relationship with. Select **OK** to reestablish the relationship.
    :::image type="content" source="./media/reestablish-deleted-volume-relationships/reestablish-confirm.png" alt-text="Screenshot of a dropdown menu with available volume relationships to restore." lightbox="./media/reestablish-deleted-volume-relationships/reestablish-confirm.png":::

## Next steps  

* [Understand Azure NetApp Files replication](replication.md)
* [Requirements and considerations for using cross-region replication](replication-requirements.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Troubleshoot cross-region-replication](troubleshoot-cross-region-replication.md)
