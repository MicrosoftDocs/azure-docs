---
title: include file
description: include file
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 01/16/2024
ms.author: anfdocs
ms.custom: include file

# azure-netapp-files-create-volumes.md
# azure-netapp-files-create-volumes-smb.md
# create-volumes-dual-protocol.md
[!INCLUDE [File path uniqueness preview registration](../includes/file-path-uniqueness.md)]

---

\*The ability to create volumes with the same file path in different availability zones is in preview. You need to register the feature before using it for the first time. After registration, the feature is enabled and works in the background. No UI control is required.

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFFilePathUniquenessInAz
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is **Registered** before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFFilePathUniquenessInAz
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 
