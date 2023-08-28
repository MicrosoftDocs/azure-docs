---
title: Re-establish deleted volume replication relationships in Azure NetApp Files
description: You can re-establish the replication relationship between volumes. 
services: azure-netapp-files
author: b-ahibbard
ms.author: anfdocs
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 02/21/2023
---
# Re-establish deleted volume replication relationships in Azure NetApp Files (preview)

Azure NetApp Files allows you to re-establish a replication relationship between two volumes in case you had previously deleted it. You can only re-establish the relationship from the destination volume. 

If the destination volume remains operational and no snapshots were deleted, the replication re-establish operation uses the last common snapshot. The operation incrementally synchronizes the destination volume based on the last known good snapshot. A baseline snapshot isn't required. 

## Considerations

* You can only re-establish relationships when there's an existing snapshot generated either [manually](azure-netapp-files-manage-snapshots.md) or by a [snapshot policy](snapshots-manage-policy.md). 

## Register the feature 

The re-establish deleted volume replication relationships capability is currently in preview. If you're using this feature for the first time, you need to register the feature first.

1.  Register the feature by running the following commands:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFReestablishReplication
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFReestablishReplication
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Re-establish the relationship

1. From the **Volumes** menu under **Storage service**, select the volume that was formerly the _destination_ volume in the replication relationship you want to restore. Then select the **Replication** tab. 
1. In the **Replication** tab, select the **Re-establish** button. 
    :::image type="content" source="./media/reestablish-deleted-volume-relationships/reestablish-button.png" alt-text="Screenshot of volume menu that depicts no existing volume relationships. A red box surrounds the re-establish button." lightbox="./media/reestablish-deleted-volume-relationships/reestablish-button.png":::
1. A dropdown list appears with a selection of all volumes that formerly had either a source or destination replication relationship with the selected volume. From the dropdown menu, select the volume you want to reestablish a relationship with. Select **OK** to reestablish the relationship.
    :::image type="content" source="./media/reestablish-deleted-volume-relationships/reestablish-confirm.png" alt-text="Screenshot of a dropdown menu with available volume relationships to restore." lightbox="./media/reestablish-deleted-volume-relationships/reestablish-confirm.png":::

## Next steps  

* [Cross-region replication](cross-region-replication-introduction.md)
* [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Troubleshoot cross-region-replication](troubleshoot-cross-region-replication.md)
