---
title: Configure ADDS LDAP with extended groups for Azure NetApp Files NFS volume access | Microsoft Docs
description: Describes the considerations and steps for enabling LDAP with extended groups when you create an NFS volume by using Azure NetApp Files.  
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 03/23/2021
ms.author: b-juche
---
# Configure ADDS LDAP with extended groups for NFS volume access

When you [create an NFS volume](azure-netapp-files-create-volumes.md), you have the option to enable the LDAP with extended groups feature (the **LDAP** option) for the volume. This feature enables Active Directory LDAP users and extended groups (up to 1024 groups) to access the volume.  

This article explains the considerations and steps for enabling LDAP with extended groups when you create an NFS volume.  

## Considerations

* LDAP over TLS must *not* be enabled if you are using Azure Active Directory Domain Services (AADDS).  

* If you enable the LDAP with extended groups feature, LDAP-enabled [Kerberos volumes](configure-kerberos-encryption.md) will not correctly display the file ownership for LDAP users. A file or directory created by an LDAP user will default to `root` as the owner instead of the actual LDAP user. However, the `root` account can manually change the file ownership by using the command `chown <username> <filename>`. 

* You cannot modify the LDAP option setting (enabled or disabled) after you have created the volume.  

## Steps

1.	Follow steps in [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md) to create an NFS volume. During the volume creation process, under the **Protocol** tab, enable the **LDAP** option.   

    ![Screenshot that shows Create a Volume page with LDAP option.](../media/azure-netapp-files/create-nfs-ldap.png)  

2. The LDAP with extended groups feature is currently in preview. Before using this feature for the first time, you need to register the feature:  

    1. Register the feature:   

        ```azurepowershell-interactive
        Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLdapExtendedGroups
        ```

    2. Check the status of the feature registration: 

        > [!NOTE]
        > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is `Registered` before continuing.

        ```azurepowershell-interactive
        Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLdapExtendedGroups
        ```
        
    You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

3. LDAP volumes require an Active Directory configuration for LDAP server settings. Follow instructions in [Requirements for Active Directory connections](create-active-directory-connections.md#requirements-for-active-directory-connections) and [Create an Active Directory connection](create-active-directory-connections.md#create-an-active-directory-connection) to configure Active Directory connections on the Azure portal.  

4. Ensure that the Active Directory LDAP server is up and running on the Active Directory. You can do so by installing and configuring the [Active Directory Lightweight Directory Services (AD LDS)](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/hh831593(v=ws.11)) role on the AD machine.

5. LDAP NFS users need to have certain POSIX attributes on the LDAP server. Follow [Manage LDAP POSIX Attributes](create-volumes-dual-protocol.md#manage-ldap-posix-attributes) to set the required attributes.  

6. If you want to configure an LDAP-integrated Linux client, see [Configure an NFS client for Azure NetApp Files](configure-nfs-clients.md).

7. You can enable local NFS client users not present on the Windows LDAP server to access an NFS volume that has LDAP with extended groups enabled. To do so, enable the **Allow local NFS users with LDAP** option as follows:
    1. Click **Active Directory connections**.  On an existing Active Directory connection, click the context menu (the three dots `…`), and select **Edit**.  
    2. On the **Edit Active Directory settings** window that appears, select the **Allow local NFS users with LDAP** option.  

    ![Screenshot that shows the Allow local NFS users with LDAP option](../media/azure-netapp-files/allow-local-nfs-users-with-ldap.png)  

## Next steps  

* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create and manage Active Directory connections](create-active-directory-connections.md)
* [Troubleshoot LDAP volume issues](troubleshoot-ldap-volumes.md)
