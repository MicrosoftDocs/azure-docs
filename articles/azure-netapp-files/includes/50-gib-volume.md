---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 08/08/2024
ms.author: anfdocs
ms.custom: include file

# azure-netapp-files-create-volumes-smb
# create-volumes-dual-protocol
# azure-netapp-files-create-volumes
# azure-netapp-files-resize-capacity-pools-or-volumes.md
---

The ability to set a volume quota between 50 and 100 GiB is currently in preview. You must register for the feature before you can create a 50 GiB volume. 

1. Register the feature:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANF50GiBVolumeSize
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANF50GiBVolumeSize
    ```
    
    You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 