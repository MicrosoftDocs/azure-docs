---
title: Enable cross-subscription replication
description: Describes how to enable cross-subscription replication for Azure NetApp Files.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 03/09/2026
ms.author: anfdocs
ms.custom:

---
# Enable cross-subscription replication for Azure NetApp Files

Cross-subscription replication is supported in all regions that support [availability zones](/azure/reliability/regions-list) and is subject to the regional pairings for [cross-region replication](replication.md#supported-region-pairs).

## Register for cross-subscription replication 

Before using cross-subscription replication, you must register for the feature. Feature registration can take up to 60 minutes to complete.

1. Register the feature

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCrossSubscriptionReplication
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** might remain in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCrossSubscriptionReplication
    ```

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 