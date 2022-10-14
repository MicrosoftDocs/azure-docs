---
title: Overview - On-premises AD DS authentication to Azure file shares
description: Learn about Active Directory Domain Services (AD DS) authentication to Azure file shares. This article goes over support scenarios, availability, and explains how the permissions work between your AD DS and Azure Active Directory. 
author: khdownie
ms.service: storage
ms.subservice: files
ms.topic: how-to
ms.date: 10/04/2022
ms.author: kendownie
---

# Overview - on-premises Active Directory Domain Services authentication over SMB for Azure file shares
[!INCLUDE [storage-files-aad-auth-include](../../../includes/storage-files-aad-auth-include.md)]

We strongly recommend that you review the [How it works section](./storage-files-active-directory-overview.md#how-it-works) to select the right AD source for authentication. The setup is different depending on the domain service you choose. This article focuses on enabling and configuring on-premises AD DS for authentication with Azure file shares.

If you're new to Azure Files, we recommend reading our [planning guide](storage-files-planning.md) before reading the following series of articles.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Supported scenarios and restrictions

- AD DS identities used for Azure Files on-premises AD DS authentication must be synced to Azure AD or use a default share-level permission. Password hash synchronization is optional. 
- Supports Azure file shares managed by Azure File Sync.
- Supports Kerberos authentication with AD with [AES 256 encryption](./storage-troubleshoot-windows-file-connection-problems.md#azure-files-on-premises-ad-ds-authentication-support-for-aes-256-kerberos-encryption) (recommended) and RC4-HMAC. AES 128 Kerberos encryption is not yet supported.
- Supports single sign-on experience.
- Only supported on clients running OS versions Windows 8/Windows Server 2012 or newer.
- Only supported against the AD forest that the storage account is registered to. You can only access Azure file shares with the AD DS credentials from a single forest by default. If you need to access your Azure file share from a different forest, make sure that you have the proper forest trust configured, see the [FAQ](storage-files-faq.md#ad-ds--azure-ad-ds-authentication) for details.
- Doesn't support authentication against computer accounts created in AD DS.
- Doesn't support authentication against Network File System (NFS) file shares.
- Doesn't support using CNAME to mount file shares.

When you enable AD DS for Azure file shares over SMB, your AD DS-joined machines can mount Azure file shares using your existing AD DS credentials. This capability can be enabled with an AD DS environment hosted either in on-premises machines or hosted on a virtual machine (VM) in Azure.

## Videos

To help you set up identity-based authentication for some common use cases, we published two videos with step-by-step guidance for the following scenarios:

| Replacing on-premises file servers with Azure Files (including setup on private link for files and AD authentication) | Using Azure Files as the profile container for Azure Virtual Desktop (including setup on AD authentication and FSLogix configuration)  |
|-|-|
| [![Screencast of the replacing on-premises file servers video - click to play.](./media/storage-files-identity-auth-active-directory-enable/replace-on-prem-server-thumbnail.png)](https://www.youtube.com/watch?v=jd49W33DxkQ) | [![Screencast of the Using Azure Files as the profile container video - click to play.](./media/storage-files-identity-auth-active-directory-enable/files-ad-ds-fslogix-thumbnail.png)](https://www.youtube.com/watch?v=9S5A1IJqfOQ) |


## Prerequisites 

Before you enable AD DS authentication for Azure file shares, make sure you've completed the following prerequisites: 

- Select or create your [AD DS environment](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) and [sync it to Azure AD](../../active-directory/hybrid/how-to-connect-install-roadmap.md) with Azure AD Connect. 

    You can enable the feature on a new or existing on-premises AD DS environment. Identities used for access must be synced to Azure AD or use a default share-level permission. The Azure AD tenant and the file share that you're accessing must be associated with the same subscription.

- Domain-join an on-premises machine or an Azure VM to on-premises AD DS. For information about how to domain-join, refer to [Join a Computer to a Domain](/windows-server/identity/ad-fs/deployment/join-a-computer-to-a-domain).

    If your machine isn't domain joined to an AD DS, you may still be able to leverage AD credentials for authentication if your machine has line of sight to the AD domain controller.

- Select or create an Azure storage account.  For optimal performance, we recommend that you deploy the storage account in the same region as the client from which you plan to access the share. Then, [mount the Azure file share](storage-how-to-use-files-windows.md) with your storage account key. Mounting with the storage account key verifies connectivity.

    Make sure that the storage account containing your file shares isn't already configured for identity-based authentication. If an AD source is already enabled on the storage account, you must disable it before enabling on-premises AD DS.

    If you experience issues in connecting to Azure Files, refer to [the troubleshooting tool we published for Azure Files mounting errors on Windows](https://azure.microsoft.com/blog/new-troubleshooting-diagnostics-for-azure-files-mounting-errors-on-windows/).

- Make any relevant networking configuration prior to enabling and configuring AD DS authentication to your Azure file shares. See [Azure Files networking considerations](storage-files-networking-overview.md) for more information.

## Regional availability

Azure Files authentication with AD DS is available in [all Azure Public, China and Gov regions](https://azure.microsoft.com/global-infrastructure/locations/).

## Overview

If you plan to enable any networking configurations on your file share, we recommend you read the [networking considerations](./storage-files-networking-overview.md) article and complete the related configuration before enabling AD DS authentication.

Enabling AD DS authentication for your Azure file shares allows you to authenticate to your Azure file shares with your on-premises AD DS credentials. Further, it allows you to better manage your permissions to allow granular access control. Doing this requires synching identities from on-premises AD DS to Azure AD with AD Connect. You assign share-level permissions to hybrid identities synced to Azure AD while managing file/directory level access using Windows ACLs.

Follow these steps to set up Azure Files for AD DS authentication: 

1. [Part one: enable AD DS authentication on your storage account](storage-files-identity-ad-ds-enable.md)

1. [Part two: assign share-level permissions to the Azure AD identity (a user, group, or service principal) that is in sync with the target AD identity](storage-files-identity-ad-ds-assign-permissions.md)

1. [Part three: configure Windows ACLs over SMB for directories and files](storage-files-identity-ad-ds-configure-permissions.md)
 
1. [Part four: mount an Azure file share to a VM joined to your AD DS](storage-files-identity-ad-ds-mount-file-share.md)

1. [Update the password of your storage account identity in AD DS](storage-files-identity-ad-ds-update-password.md)

The following diagram illustrates the end-to-end workflow for enabling AD DS authentication over SMB for Azure file shares. 

![Files AD workflow diagram](media/storage-files-active-directory-domain-services-enable/diagram-files-ad.png)

Identities used to access Azure file shares must be synced to Azure AD to enforce share-level file permissions through the [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) model. Alternatively, you can use a default share-level permission. [Windows-style DACLs](/previous-versions/technet-magazine/cc161041(v=msdn.10)) on files/directories carried over from existing file servers will be preserved and enforced. This offers seamless integration with your enterprise AD DS environment. As you replace on-premises file servers with Azure file shares, existing users can access Azure file shares from their current clients with a single sign-on experience, without any change to the credentials in use.  

## Next steps

To enable on-premises AD DS authentication for your Azure file share, continue to the next article:

[Part one: enable AD DS authentication for your account](storage-files-identity-ad-ds-enable.md)
