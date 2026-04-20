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
    https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}/poolChange?api-version=2026-01-01

    Body:
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Length: 0"

    ```



## Next steps  

* [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](understand-guidelines-active-directory-domain-service-site.md)
* [Modify Active Directory connections](modify-active-directory-connections.md)
* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume](create-volumes-dual-protocol.md)
* [Configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md)
* [Install a new Active Directory forest using Azure CLI](/windows-server/identity/ad-ds/deploy/virtual-dc/adds-on-azure-vm) 
* [Enable Active Directory Domain Services (AD DS) LDAP authentication for NFS volumes](configure-ldap-over-tls.md)
* [AD DS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md)
