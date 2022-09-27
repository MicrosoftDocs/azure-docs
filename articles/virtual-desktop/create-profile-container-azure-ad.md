---
title: Create a profile container with Azure Files and Azure Active Directory (preview)
description: Set up an FSLogix profile container on an Azure file share in an existing Azure Virtual Desktop host pool with your Azure Active Directory domain (preview).
services: virtual-desktop
author: Heidilohr
manager: femila
ms.service: virtual-desktop
ms.topic: how-to
ms.date: 08/29/2022
ms.author: helohr
---
# Create a profile container with Azure Files and Azure Active Directory (preview)

> [!IMPORTANT]
> Storing FSLogix profiles on Azure Files for Azure Active Directory-joined VMs is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you'll learn how to create an Azure Files share to store FSLogix profiles that can be accessed by hybrid user identities authenticated with Azure Active Directory (Azure AD). Azure AD users can now access an Azure file share using Kerberos authentication. This configuration uses Azure AD to issue the necessary Kerberos tickets to access the file share with the industry-standard SMB protocol. Your end-users can access Azure file shares over the internet without requiring a line-of-sight to domain controllers from Hybrid Azure AD-joined and Azure AD-joined VMs.

This feature is currently supported in the Azure Public, Azure Government, and Azure China clouds.

## Configure your Azure storage account and file share

To store your FSLogix profiles on an Azure file share: 

1. [Create an Azure Storage account](../storage/files/storage-how-to-create-file-share.md#create-a-storage-account) if you don't already have one.

    > [!NOTE]
    > Your Azure Storage account can't authenticate with both Azure AD and a second method like Active Directory Domain Services (AD DS) or Azure AD DS. You can only use one authentication method.

2. [Create an Azure Files share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share) under your storage account to store your FSLogix profiles if you haven't already.

3. [Enable Azure Active Directory Kerberos authentication on Azure Files](../storage/files/storage-files-identity-auth-azure-active-directory-enable.md) to enable access from Azure AD-joined VMs.

    - When configuring the directory and file-level permissions, review the recommended list of permissions for FSLogix profiles at [Configure the storage permissions for profile containers](/fslogix/fslogix-storage-config-ht).
    - Without proper directory-level permissions in place, a user can delete the user profile or access the personal information of a different user. It's important to make sure users have proper permissions to prevent accidental deletion from happening.

## Configure the session hosts

To access Azure file shares from an Azure AD-joined VM for FSLogix profiles, you must configure the session hosts. To configure session hosts:

1. Enable the Azure AD Kerberos functionality using one of the following methods.

    - Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the session host: [Kerberos/CloudKerberosTicketRetrievalEnabled](/windows/client-management/mdm/policy-csp-kerberos#kerberos-cloudkerberosticketretrievalenabled)
    - Configure this Group policy on the session host: `Administrative Templates\System\Kerberos\Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon`
    - Create the following registry value on the session host: `reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 1`

2. When you use Azure AD with a roaming profile solution like FSLogix, the credential keys in Credential Manager must belong to the profile that's currently loading. This will let you load your profile on many different VMs instead of being limited to just one. To enable this setting, create a new registry value by running the following command:

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
