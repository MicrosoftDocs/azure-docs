---
title: Overview - Azure Files identity-based authentication
description: Azure Files supports identity-based authentication over SMB (Server Message Block) with Active Directory Domain Services (AD DS), Microsoft Entra Domain Services, and Microsoft Entra Kerberos for hybrid identities.
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 11/13/2024
ms.author: kendownie
---

# Overview of Azure Files identity-based authentication options for SMB access

This article explains how you can use domain services, either on-premises or in Azure, to enable identity-based access to Azure file shares over SMB. Just like Windows file servers, you can grant permissions to an identity at the share, directory, or file level. There's no additional service charge to enable identity-based authentication on your storage account.

Identity-based authentication isn't supported with Network File System (NFS) shares. However, Linux clients can use Kerberos authentication over SMB.

> [!IMPORTANT]
> Our recommended security best practice is to never share your storage account keys and to use identity-based authentication instead.

## How it works

Azure file shares use the Kerberos protocol to authenticate with an identity source. When an identity associated with a user or application running on a client attempts to access data in Azure file shares, the request is sent to the identity source to authenticate the identity. If authentication is successful, the identity source returns a Kerberos token. The client then sends a request that includes the Kerberos token, and the Azure Files service uses that token to authorize the request. Azure Files only receives the Kerberos token, not the user's access credentials.

## Common use cases

Identity-based authentication with SMB Azure file shares can be useful in a variety of scenarios:

### Replace on-premises file servers

Replacing scattered on-premises file servers is a common problem that every enterprise encounters in their IT modernization journey. Using identity-based authentication with Azure Files provides a seamless migration experience, allowing end users to continue to access their data with the same credentials.

### Lift and shift applications to Azure

When you lift and shift applications to the cloud, you'll likely want to keep the same authentication model for file share access. Identity-based authentication eliminates the need to change your directory service, expediting cloud adoption.

### Backup and disaster recovery (DR)

If you're keeping your primary file storage on-premises, Azure file shares can serve as an ideal storage for backup or DR, to improve business continuity. You can use Azure file shares to back up your data from existing file servers while preserving Windows discretionary access control lists (DACLs). For DR scenarios, you can configure an authentication option to support proper access control enforcement at failover.

## Choose an identity source for your storage account

Before you enable identity-based authentication on your storage account, you need to know what identity source you're going to use. It's likely that you already have one, as most companies and organizations have some type of domain environment already configured. Consult your Active Directory (AD) or IT admin to be sure. If you don't already have an identity source, you'll need to configure one before you can enable identity-based authentication.

You can enable identity-based authentication over SMB using one of three identity sources: **On-premises Active Directory Domain Services (AD DS)**, **Microsoft Entra Domain Services**, or **Microsoft Entra Kerberos (hybrid identities only)**. You can only use one identity source for file access authentication per storage account, and it applies to all file shares in the account.

- **On-premises AD DS:** On-premises AD DS-joined or Microsoft Entra Domain Services-joined clients and virtual machines (VMs) can access Azure file shares with on-premises Active Directory credentials that are synched to Microsoft Entra ID over SMB. To use this method, your client must have unimpeded network connectivity to your AD DS. If you already have AD DS set up on-premises or on a VM in Azure where your devices are domain-joined to your AD, you should choose AD DS.
- **Microsoft Entra Kerberos for hybrid identities:** You can use Microsoft Entra ID to authenticate [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md), allowing end users to access Azure file shares without requiring network connectivity to domain controllers. Cloud-only identities aren't currently supported using this method.
- **Microsoft Entra Domain Services:** Cloud-based VMs that are joined to Microsoft Entra Domain Services can access Azure file shares with Microsoft Entra credentials. In this solution, Microsoft Entra ID runs a traditional Windows Server AD domain on behalf of the customer, which is a child of the customer's Microsoft Entra tenant.

## Enable a identity source

Once you've chosen a identity source, you must enable it on your storage account.

### AD DS

For AD DS authentication, you must domain-join your client machines or VMs. You can host your AD domain controllers on Azure VMs or on-premises. Either way, your domain-joined clients must have unimpeded network connectivity to the domain controller, so they must be within the corporate network or virtual network (VNET) of your domain service.

The following diagram depicts on-premises AD DS authentication to Azure file shares over SMB. The on-premises AD DS must be synced to Microsoft Entra ID using Microsoft Entra Connect Sync or Microsoft Entra Connect cloud sync. Only [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md) that exist in both on-premises AD DS and Microsoft Entra ID can be authenticated and authorized for Azure file share access. This is because the share-level permission is configured against the identity represented in Microsoft Entra ID, whereas the directory/file-level permission is enforced with that in AD DS. Make sure that you configure the permissions correctly against the same hybrid user.

:::image type="content" source="media/storage-files-active-directory-overview/files-ad-ds-auth-diagram.png" alt-text="Diagram that depicts on-premises AD DS authentication to Azure file shares over SMB.":::

To learn how to enable AD DS authentication, first read [Overview - on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-ad-ds-overview.md) and then see [Enable AD DS authentication for Azure file shares](storage-files-identity-ad-ds-enable.md).

<a name='azure-ad-kerberos-for-hybrid-identities'></a>

### Microsoft Entra Kerberos for hybrid identities

Enabling and configuring Microsoft Entra ID for authenticating [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md) allows Microsoft Entra users to access Azure file shares using Kerberos authentication. This configuration uses Microsoft Entra ID to issue the necessary Kerberos tickets to access the file share with the industry-standard SMB protocol. This means your end users can access Azure file shares over the internet without requiring network connectivity to domain controllers from Microsoft Entra hybrid joined and Microsoft Entra joined VMs. However, configuring directory and file-level permissions for users and groups requires unimpeded network connectivity to the on-premises domain controller.

> [!IMPORTANT]
> Microsoft Entra Kerberos authentication only supports hybrid user identities; it doesn't support cloud-only identities. A traditional AD DS deployment is required, and it must be synced to Microsoft Entra ID using Microsoft Entra Connect Sync or Microsoft Entra Connect cloud sync. Clients must be Microsoft Entra joined or [Microsoft Entra hybrid joined](../../active-directory/devices/hybrid-join-plan.md). Microsoft Entra Kerberos isn't supported on clients joined to Microsoft Entra Domain Services or joined to AD only.

:::image type="content" source="media/storage-files-active-directory-overview/files-microsoft-entra-kerberos-diagram.png" alt-text="Diagram of configuration for Microsoft Entra Kerberos authentication for hybrid identities over SMB.":::

To learn how to enable Microsoft Entra Kerberos authentication for hybrid identities, see [Enable Microsoft Entra Kerberos authentication for hybrid identities on Azure Files](storage-files-identity-auth-hybrid-identities-enable.md).

You can also use this feature to store FSLogix profiles on Azure file shares for Microsoft Entra joined VMs. For more information, see [Create a profile container with Azure Files and Microsoft Entra ID](../../virtual-desktop/create-profile-container-azure-ad.yml).

<a name='azure-ad-ds'></a>

### Microsoft Entra Domain Services

For Microsoft Entra Domain Services authentication, you must enable Microsoft Entra Domain Services and domain-join the VMs you plan to access file data from. Your domain-joined VM must reside in the same VNET as your Microsoft Entra Domain Services hosted domain.

The following diagram represents the workflow for Microsoft Entra Domain Services authentication to Azure file shares over SMB. It follows a similar pattern to on-premises AD DS authentication, but there are two major differences:

1. You don't need to create an identity in Microsoft Entra Domain Services to represent the storage account. This is performed by the enablement process in the background.

2. All users that exist in Microsoft Entra ID can be authenticated and authorized. The user can be cloud-only or hybrid. The sync from Microsoft Entra ID to Microsoft Entra Domain Services is managed by the platform without requiring any user configuration. However, the client must be joined to the Microsoft Entra Domain Services hosted domain. It can't be Microsoft Entra joined or registered. Microsoft Entra Domain Services doesn't support non-Azure clients (i.e. user laptops, workstations, VMs in other clouds, etc.) being domain-joined to the Microsoft Entra Domain Services hosted domain. However, it's possible to mount a file share from a non-domain-joined client by providing explicit credentials such as DOMAINNAME\username or using the fully qualified domain name (username@FQDN).

:::image type="content" source="media/storage-files-active-directory-overview/files-microsoft-entra-domain-services-auth-diagram.png" alt-text="Diagram of configuration for Microsoft Entra Domain Services authentication with Azure Files over SMB.":::

To learn how to enable Microsoft Entra Domain Services authentication, see [Enable Microsoft Entra Domain Services authentication on Azure Files](storage-files-identity-auth-domain-services-enable.md).

## Access control

Azure Files enforces authorization on user access at both the share level and the directory/file levels. Share-level permission assignment can be performed on Microsoft Entra users or groups managed through Azure RBAC. With Azure RBAC, the credentials you use for file access should be available or synced to Microsoft Entra ID. You can assign Azure built-in roles like **Storage File Data SMB Share Reader** to users or groups in Microsoft Entra ID to grant access to an Azure file share.

At the directory/file level, Azure Files supports preserving, inheriting, and enforcing [Windows ACLs](/windows/win32/secauthz/access-control-lists). You can choose to keep Windows ACLs when copying data over SMB between your existing file share and your Azure file shares. Whether you plan to enforce authorization or not, you can use Azure file shares to back up ACLs along with your data.

### Configure share-level permissions

Once you've enabled an identity source on your storage account, you must do one of the following to access the file share:

- Set a default share-level permission that applies to all authenticated users and groups
- Assign built-in Azure RBAC roles to users and groups, or 
- Configure custom roles for Microsoft Entra identities and assign access rights to file shares in your storage account.

The assigned share-level permission allows the granted identity to get access to the share only, nothing else, not even the root directory. You still need to separately configure directory and file-level permissions.

> [!NOTE]
> You can't assign share-level permissions to computer accounts (machine accounts) using Azure RBAC, because computer accounts can't be synced to an identity in Microsoft Entra ID. If you want to allow a computer account to access Azure file shares using identity-based authentication, [use a default share-level permission](storage-files-identity-assign-share-level-permissions.md#share-level-permissions-for-all-authenticated-identities) or consider using a service logon account instead.

### Configure directory or file-level permissions

Azure file shares enforce standard Windows ACLs at both the directory and file level, including the root directory. Configuration of directory or file-level permissions is supported over both SMB and REST. Mount the target file share from your VM and configure permissions using Windows File Explorer, Windows [icacls](/windows-server/administration/windows-commands/icacls), or the [Set-ACL](/powershell/module/microsoft.powershell.security/get-acl) command.

### Preserve directory and file ACLs when importing data to Azure Files

Azure Files supports preserving directory or file-level ACLs when copying data to Azure file shares. You can copy ACLs on a directory or file to Azure file shares using either Azure File Sync or common file movement toolsets. For example, you can use [robocopy](/windows-server/administration/windows-commands/robocopy) with the `/copy:s` flag to copy data as well as ACLs to an Azure file share. ACLs are preserved by default, so you don't need to enable identity-based authentication on your storage account to preserve ACLs.

## Glossary

It's helpful to understand some key terms relating to identity-based authentication for Azure file shares:

-   **Kerberos authentication**

    Kerberos is an authentication protocol that's used to verify the identity of a user or host. For more information on Kerberos, see [Kerberos Authentication Overview](/windows-server/security/kerberos/kerberos-authentication-overview).

-  **Server Message Block (SMB) protocol**

    SMB is an industry-standard network file-sharing protocol. For more information on SMB, see [Microsoft SMB Protocol and CIFS Protocol Overview](/windows/desktop/FileIO/microsoft-smb-protocol-and-cifs-protocol-overview).

-   **Microsoft Entra ID**

    Microsoft Entra ID (formerly Azure AD) is Microsoft's multi-tenant cloud-based directory and identity management service. Microsoft Entra ID combines core directory services, application access management, and identity protection into a single solution. 

-   **Microsoft Entra Domain Services**

    Microsoft Entra Domain Services provides managed domain services such as domain join, group policies, LDAP, and Kerberos/NTLM authentication. These services are fully compatible with Active Directory Domain Services. For more information, see [Microsoft Entra Domain Services](../../active-directory-domain-services/overview.md).

-   **On-premises Active Directory Domain Services (AD DS)**

    AD DS is commonly adopted by enterprises in on-premises environments or on cloud-hosted VMs, and AD DS credentials are used for access control. For more information, see [Active Directory Domain Services Overview](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview).

-   **Azure role-based access control (Azure RBAC)**

    Azure RBAC enables fine-grained access management for Azure. Using Azure RBAC, you can manage access to resources by granting users the fewest permissions needed to perform their jobs. For more information, see [What is Azure role-based access control?](../../role-based-access-control/overview.md)

-   **Hybrid identities**

    [Hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md) are identities in AD DS that are synced to Microsoft Entra ID using either the on-premises [Microsoft Entra Connect Sync](../../active-directory/hybrid/whatis-azure-ad-connect.md) application or [Microsoft Entra Connect cloud sync](../../active-directory/cloud-sync/what-is-cloud-sync.md), a lightweight agent that can be installed from the Microsoft Entra Admin Center.

## Next steps

For more information about Azure Files and identity-based authentication over SMB, see these resources:

- [Overview - on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-ad-ds-overview.md)
- [Enable Microsoft Entra Domain Services authentication on Azure Files](storage-files-identity-auth-domain-services-enable.md)
- [Enable Microsoft Entra Kerberos authentication for hybrid identities on Azure Files](storage-files-identity-auth-hybrid-identities-enable.md)
- [Enable AD Kerberos authentication for Linux clients](storage-files-identity-auth-linux-kerberos-enable.md)
- [FAQ](storage-files-faq.md#identity-based-authentication)
