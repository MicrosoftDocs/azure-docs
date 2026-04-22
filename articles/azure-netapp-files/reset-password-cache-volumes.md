---
title: Reset SMB password for an Azure NetApp Files cache volume
description: This article shows you how to reset SMB password for cache volumes.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 04/10/2026
ms.author: anfdocs

---
# Reset SMB password for an Azure NetApp Files cache volume

If you accidentally reset the password of the AD computer account on the AD server or the AD server is unreachable, you can safely reset the computer account password to preserve connectivity to your cache volumes. A reset affects all cache volumes on the SMB server. 

### Register the feature

The reset Active Directory computer account password feature is currently in public preview. If you're using this feature for the first time, you need to register the feature first.

1. Register the **reset Active Directory computer account password** feature:   
    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFResetADAccountForVolume
    ```
2. Check the status of the feature registration. The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is `Registered` before continuing.
    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFResetADAccountForVolume
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status.  

### Steps

1. Run the following command to reset SMB password for Azure NetApp Files cache volumes:

    ```
    POST 
    https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}/resetSmbPassword?api-version=2026-01-01

    Body:
    {}

    ```
