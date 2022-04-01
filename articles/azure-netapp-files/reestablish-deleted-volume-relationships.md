---
title: Re-establish deleted volume replication relationships | Microsoft Docs
description: You can reestablish the replication relationship between volumes if it has been deleted. 
services: azure-netapp-files
author: b-ahibbard
ms.author: anfdocs
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 04/01/2022
---
# Re-established deleted volume replication relationships in Azure NetApp Files

If you have deleted the cross-region replication relationship between two volumes, Azure NetApp Files allows you to re-establish the relationship. Re-establishing the relationship can only be performed from the destination volume. 

## Register the feature 

The network features capability is currently in public preview. If you are using this feature for the first time, you need to register the feature first.

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

## Reestablish the Relationship
1. From the **Volumes** menu, select the volume that was formerly the destination volume in the replication relationship you want to restore. Then select the **Replication** tab. 
1. In the **Replication** tab, select the **Re-establish** button. 
    :::image type="content" source="../media/azure-netapp-files/alert-config-signal-logic.png" alt-text="Screenshot of the Azure interface that shows the configure signal logic step with a backdrop of the Create alert rule page." lightbox="../media/azure-netapp-files/alert-config-signal-logic.png":::
1. The side menu that appears will present a dropdown menu with a selection of all volumes that formerly had either a source or destination replication relationship with the selected volume. From the dropdown menu, select the volume you want to reestablish a relationship with. Select **OK** to reestablish the relationship.
    :::image type="content" source="../media/azure-netapp-files/alert-config-signal-logic.png" alt-text="Screenshot of the Azure interface that shows the configure signal logic step with a backdrop of the Create alert rule page." lightbox="../media/azure-netapp-files/alert-config-signal-logic.png":::