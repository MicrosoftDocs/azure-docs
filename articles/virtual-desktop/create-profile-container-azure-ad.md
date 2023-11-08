---
title: Create a profile container with Azure Files and Microsoft Entra ID
description: Set up an FSLogix profile container on an Azure file share in an existing Azure Virtual Desktop host pool with your Microsoft Entra domain.
services: virtual-desktop
author: Heidilohr
manager: femila
ms.service: virtual-desktop
ms.topic: how-to
ms.date: 04/28/2023
ms.author: helohr
---
# Create a profile container with Azure Files and Microsoft Entra ID

In this article, you'll learn how to create and configure an Azure Files share for Microsoft Entra Kerberos authentication. This configuration allows you to store FSLogix profiles that can be accessed by hybrid user identities from Microsoft Entra joined or Microsoft Entra hybrid joined session hosts without requiring network line-of-sight to domain controllers. Microsoft Entra Kerberos enables Microsoft Entra ID to issue the necessary Kerberos tickets to access the file share with the industry-standard SMB protocol.

This feature is supported in the Azure Public, Azure US Gov, and Azure operated by 21Vianet.

## Prerequisites

Before deploying this solution, verify that your environment [meets the requirements](../storage/files/storage-files-identity-auth-azure-active-directory-enable.md#prerequisites) to configure Azure Files with Microsoft Entra Kerberos authentication.

When used for FSLogix profiles in Azure Virtual Desktop, the session hosts don't need to have network line-of-sight to the domain controller (DC). However, a system with network line-of-sight to the DC is required to configure the permissions on the Azure Files share.

## Configure your Azure storage account and file share

To store your FSLogix profiles on an Azure file share: 

1. [Create an Azure Storage account](../storage/files/storage-how-to-create-file-share.md#create-a-storage-account) if you don't already have one.

    > [!NOTE]
    > Your Azure Storage account can't authenticate with both Microsoft Entra ID and a second method like Active Directory Domain Services (AD DS) or Microsoft Entra Domain Services. You can only use one authentication method.

2. [Create an Azure Files share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share) under your storage account to store your FSLogix profiles if you haven't already.

3. [Enable Microsoft Entra Kerberos authentication on Azure Files](../storage/files/storage-files-identity-auth-azure-active-directory-enable.md) to enable access from Microsoft Entra joined VMs.

    - When configuring the directory and file-level permissions, review the recommended list of permissions for FSLogix profiles at [Configure the storage permissions for profile containers](/fslogix/fslogix-storage-config-ht).
    - Without proper directory-level permissions in place, a user can delete the user profile or access the personal information of a different user. It's important to make sure users have proper permissions to prevent accidental deletion from happening.

## Configure the session hosts

To access Azure file shares from a Microsoft Entra joined VM for FSLogix profiles, you must configure the session hosts. To configure session hosts:

1. Enable the Microsoft Entra Kerberos functionality using one of the following methods.

    - Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the session host: [Kerberos/CloudKerberosTicketRetrievalEnabled](/windows/client-management/mdm/policy-csp-kerberos#kerberos-cloudkerberosticketretrievalenabled).
    
       > [!NOTE]
       > Windows multi-session client operating systems don't support Policy CSP as they only support the [settings catalog](/mem/intune/configuration/settings-catalog), so you'll need to use one of the other methods. Learn more at [Using Azure Virtual Desktop multi-session with Intune](/mem/intune/fundamentals/azure-virtual-desktop-multi-session).
    
    - Enable this Group policy on session hosts. The path will be one of the following, depending on the version of Windows you use on your session hosts:
       - `Administrative Templates\System\Kerberos\Allow retrieving the cloud kerberos ticket during the logon`
       - `Administrative Templates\System\Kerberos\Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon`
    
    - - Create the following registry value on the session host: `reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 1`

2. When you use Microsoft Entra ID with a roaming profile solution like FSLogix, the credential keys in Credential Manager must belong to the profile that's currently loading. This will let you load your profile on many different VMs instead of being limited to just one. To enable this setting, create a new registry value by running the following command:

    ```
    reg add HKLM\Software\Policies\Microsoft\AzureADAccount /v LoadCredKeyFromProfile /t REG_DWORD /d 1
    ```

> [!NOTE]
> The session hosts don't need network line-of-sight to the domain controller.

### Configure FSLogix on the session host

This section will show you how to configure a VM with FSLogix. You'll need to follow these instructions every time you configure a session host. There are several options available that ensure the registry keys are set on all session hosts. You can set these options in an image or configure a group policy.

To configure FSLogix:

1. [Update or install FSLogix](/fslogix/install-ht) on your session host, if needed. 
    > [!NOTE]
    > If the session host is created using the Azure Virtual Desktop service, FSLogix should already be pre-installed.

2. Follow the instructions in [Configure profile container registry settings](/fslogix/configure-profile-container-tutorial#configure-profile-container-registry-settings) to create the **Enabled** and **VHDLocations** registry values. Set the value of **VHDLocations** to `\\<Storage-account-name>.file.core.windows.net\<file-share-name>`.

## Test your deployment

Once you've installed and configured FSLogix, you can test your deployment by signing in with a user account that's been assigned to an application group on the host pool. The user account you sign in with must have permission to use the file share.

If the user has signed in before, they'll have an existing local profile that the service will use during this session. To avoid creating a local profile, either create a new user account to use for tests or use the configuration methods described in [Tutorial: Configure profile container to redirect user profiles](/fslogix/configure-profile-container-tutorial/) to enable the *DeleteLocalProfileWhenVHDShouldApply* setting.

Finally, verify the profile created in Azure Files after the user has successfully signed in:

1. Open the Azure portal and sign in with an administrative account.

2. From the sidebar, select **Storage accounts**.

3. Select the storage account you configured for your session host pool.

4. From the sidebar, select **File shares**.

5. Select the file share you configured to store the profiles.

6. If everything's set up correctly, you should see a directory with a name that's formatted like this: `<user SID>_<username>`.

## Next steps

- To troubleshoot FSLogix, see [this troubleshooting guide](/fslogix/fslogix-trouble-shooting-ht).
