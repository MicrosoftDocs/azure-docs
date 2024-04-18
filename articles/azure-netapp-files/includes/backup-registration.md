---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 03/20/2024
ms.author: anfdocs

# backup-configure-policy-based.md
# backup-configure-manual.md 
---

## Register the feature

Azure NetApp Files backup is currently in preview. You must register the feature before using it for the first time. 

1.  Register the feature

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFBackupPreview
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFBackupPreview
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 
