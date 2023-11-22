---
title: Overview - Azure Files identity-based authentication
description: Azure Files supports identity-based authentication over SMB (Server Message Block) with Active Directory Domain Services (AD DS), Microsoft Entra Domain Services, and Microsoft Entra Kerberos for hybrid identities.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 11/21/2023
ms.author: kendownie
ms.custom: engagement-fy23
---

# Overview of Azure Files identity-based authentication options for SMB access

This article explains how Azure file shares can use domain services, either on-premises or in Azure, to support identity-based access to Azure file shares over SMB. Enabling identity-based access for your Azure file shares allows you to replace existing file servers with Azure file shares without replacing your existing directory service, maintaining seamless user access to shares.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

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

    On-premises Active Directory Domain Services (AD DS) integration with Azure Files provides the methods for storing directory data while making it available to network users and administrators. Security is integrated with AD DS through logon authentication and access control to objects in the directory. With a single network logon, administrators can manage directory data and organization throughout their network, and authorized network users can access resources anywhere on the network. AD DS is commonly adopted by enterprises in on-premises environments or on cloud-hosted VMs, and AD DS credentials are used for access control. For more information, see [Active Directory Domain Services Overview](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview).

-   **Azure role-based access control (Azure RBAC)**

    Azure RBAC enables fine-grained access management for Azure. Using Azure RBAC, you can manage access to resources by granting users the fewest permissions needed to perform their jobs. For more information, see [What is Azure role-based access control?](../../role-based-access-control/overview.md)

-   **Hybrid identities**

    [Hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md) are identities in AD DS that are synced to Microsoft Entra ID using either the on-premises [Microsoft Entra Connect Sync](../../active-directory/hybrid/whatis-azure-ad-connect.md) application or [Microsoft Entra Connect cloud sync](../../active-directory/cloud-sync/what-is-cloud-sync.md), a lightweight agent that can be installed from the Microsoft Entra Admin Center.

## Supported authentication scenarios

Azure Files supports identity-based authentication over SMB through the following methods. You can only use one method per storage account.

- **On-premises AD DS authentication:** On-premises AD DS-joined or Microsoft Entra Domain Services-joined Windows machines can access Azure file shares with on-premises Active Directory credentials that are synched to Microsoft Entra ID over SMB. Your client must have unimpeded network connectivity to your AD DS. If you already have AD DS set up on-premises or on a VM in Azure where your devices are domain-joined to your AD, you should use AD DS for Azure file shares authentication.
- **Microsoft Entra Domain Services authentication:** Cloud-based, Microsoft Entra Domain Services-joined Windows VMs can access Azure file shares with Microsoft Entra credentials. In this solution, Microsoft Entra ID runs a traditional Windows Server AD domain on behalf of the customer, which is a child of the customer’s Microsoft Entra tenant. 
- **Microsoft Entra Kerberos for hybrid identities:** Using Microsoft Entra ID for authenticating [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md) allows Microsoft Entra users to access Azure file shares using Kerberos authentication. This means your end users can access Azure file shares over the internet without requiring network connectivity to domain controllers from Microsoft Entra hybrid joined and Microsoft Entra joined VMs. Cloud-only identities aren't currently supported.
- **AD Kerberos authentication for Linux clients:** Linux clients can use Kerberos authentication over SMB for Azure Files using on-premises AD DS or Microsoft Entra Domain Services.

## Restrictions

- None of the authentication methods support assigning share-level permissions to computer accounts (machine accounts) using Azure RBAC, because computer accounts can't be synced to an identity in Microsoft Entra ID. If you want to allow a computer account to access Azure file shares using identity-based authentication, [use a default share-level permission](storage-files-identity-ad-ds-assign-permissions.md#share-level-permissions-for-all-authenticated-identities) or consider using a service logon account instead.
- Identity-based authentication isn't supported with Network File System (NFS) shares.

## Common use cases

Identity-based authentication with Azure Files can be useful in a variety of scenarios:

### Replace on-premises file servers

Deprecating and replacing scattered on-premises file servers is a common problem that every enterprise encounters in their IT modernization journey. Azure file shares with on-premises AD DS authentication is the best fit here, when you can migrate the data to Azure Files. A complete migration will allow you to take advantage of the high availability and scalability benefits while also minimizing the client-side changes. It provides a seamless migration experience to end users, so they can continue to access their data with the same credentials using their existing domain-joined machines.

### Lift and shift applications to Azure

When you lift and shift applications to the cloud, you want to keep the same authentication model for your data. As we extend the identity-based access control experience to Azure file shares, it eliminates the need to change your application to modern auth methods and expedite cloud adoption. Azure file shares provide the option to integrate with either Microsoft Entra Domain Services or on-premises AD DS for authentication. If your plan is to be 100% cloud native and minimize the efforts managing cloud infrastructures, Microsoft Entra Domain Services might be a better fit as a fully managed domain service. If you need full compatibility with AD DS capabilities, you might want to consider extending your AD DS environment to cloud by self-hosting domain controllers on VMs. Either way, we provide the flexibility to choose the domain service that best suits your business needs.

### Backup and disaster recovery (DR)

If you're keeping your primary file storage on-premises, Azure file shares can serve as an ideal storage for backup or DR, to improve business continuity. You can use Azure file shares to back up your data from existing file servers while preserving Windows discretionary access control lists (DACLs). For DR scenarios, you can configure an authentication option to support proper access control enforcement at failover.

## Advantages of identity-based authentication
Identity-based authentication for Azure Files offers several benefits over using Shared Key authentication:

-   **Extend the traditional identity-based file share access experience to the cloud**  
    If you plan to lift and shift your application to the cloud, replacing traditional file servers with Azure file shares, then you might want your application to authenticate with either on-premises AD DS or Microsoft Entra Domain Services credentials to access file data. Azure Files supports using either on-premises AD DS or Microsoft Entra Domain Services credentials to access Azure file shares over SMB from either on-premises AD DS or Microsoft Entra Domain Services domain-joined VMs.

-   **Enforce granular access control on Azure file shares**  
    You can grant permissions to a specific identity at the share, directory, or file level. For example, suppose that you have several teams using a single Azure file share for project collaboration. You can grant all teams access to non-sensitive directories, while limiting access to directories containing sensitive financial data to your finance team only. 

-   **Back up Windows ACLs (also known as NTFS permissions) along with your data**  
    You can use Azure file shares to back up your existing on-premises file shares. Azure Files preserves your ACLs along with your data when you back up a file share to Azure file shares over SMB.

## How it works

Azure file shares use the Kerberos protocol to authenticate with an AD source. When an identity associated with a user or application running on a client attempts to access data in Azure file shares, the request is sent to the AD source to authenticate the identity. If authentication is successful, it returns a Kerberos token. The client sends a request that includes the Kerberos token, and Azure file shares use that token to authorize the request. Azure file shares only receive the Kerberos token, not the user's access credentials.

You can enable identity-based authentication on your new and existing storage accounts using one of three AD sources: AD DS, Microsoft Entra Domain Services, or Microsoft Entra Kerberos (hybrid identities only). Only one AD source can be used for file access authentication on the storage account, which applies to all file shares in the account. Before you can enable identity-based authentication on your storage account, you must first set up your domain environment. 

### AD DS

For on-premises AD DS authentication, you must set up your AD domain controllers and domain-join your machines or VMs. You can host your domain controllers on Azure VMs or on-premises. Either way, your domain-joined clients must have line of sight to the domain controller, so they must be within the corporate network or virtual network (VNET) of your domain service.

The following diagram depicts on-premises AD DS authentication to Azure file shares over SMB. The on-premises AD DS must be synced to Microsoft Entra ID using Microsoft Entra Connect Sync or Microsoft Entra Connect cloud sync. Only [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md) that exist in both on-premises AD DS and Microsoft Entra ID can be authenticated and authorized for Azure file share access. This is because the share-level permission is configured against the identity represented in Microsoft Entra ID, whereas the directory/file-level permission is enforced with that in AD DS. Make sure that you configure the permissions correctly against the same hybrid user.

:::image type="content" source="media/storage-files-active-directory-overview/files-ad-ds-auth-diagram.png" alt-text="Diagram that depicts on-premises AD DS authentication to Azure file shares over SMB.":::

To learn how to enable AD DS authentication, first read [Overview - on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-auth-active-directory-enable.md) and then see [Enable AD DS authentication for Azure file shares](storage-files-identity-ad-ds-enable.md).

<a name='azure-ad-ds'></a>

### Microsoft Entra Domain Services

For Microsoft Entra Domain Services authentication, you should enable Microsoft Entra Domain Services and domain-join the VMs you plan to access file data from. Your domain-joined VM must reside in the same virtual network (VNET) as your Microsoft Entra Domain Services. 

The following diagram represents the workflow for Microsoft Entra Domain Services authentication to Azure file shares over SMB. It follows a similar pattern to on-premises AD DS authentication, but there are two major differences:

1. You don't need to create the identity in Microsoft Entra Domain Services to represent the storage account. This is performed by the enablement process in the background.

2. All users that exist in Microsoft Entra ID can be authenticated and authorized. The user can be cloud-only or hybrid. The sync from Microsoft Entra ID to Microsoft Entra Domain Services is managed by the platform without requiring any user configuration. However, the client must be joined to the Microsoft Entra Domain Services hosted domain. It can't be Microsoft Entra joined or registered. Microsoft Entra Domain Services doesn't support non-Azure clients (i.e. user laptops, workstations, VMs in other clouds, etc.) being domain-joined to the Microsoft Entra Domain Services hosted domain. However, it's possible to mount a file share from a non-domain-joined client by providing explicit credentials such as DOMAINNAME\username or using the fully qualified domain name (username@FQDN).

:::image type="content" source="media/storage-files-active-directory-overview/files-azure-ad-ds-auth-diagram.png" alt-text="Diagram of configuration for Microsoft Entra Domain Services authentication with Azure Files over SMB.":::

To learn how to enable Microsoft Entra Domain Services authentication, see [Enable Microsoft Entra Domain Services authentication on Azure Files](storage-files-identity-auth-domain-services-enable.md).

<a name='azure-ad-kerberos-for-hybrid-identities'></a>

### Microsoft Entra Kerberos for hybrid identities

Enabling and configuring Microsoft Entra ID for authenticating [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md) allows Microsoft Entra users to access Azure file shares using Kerberos authentication. This configuration uses Microsoft Entra ID to issue the necessary Kerberos tickets to access the file share with the industry-standard SMB protocol. This means your end users can access Azure file shares over the internet without requiring a line-of-sight to domain controllers from Microsoft Entra hybrid joined and Microsoft Entra joined VMs. However, configuring directory and file-level permissions for users and groups requires line-of-sight to the on-premises domain controller.

> [!IMPORTANT]
> Microsoft Entra Kerberos authentication only supports hybrid user identities; it doesn't support cloud-only identities. A traditional AD DS deployment is required, and it must be synced to Microsoft Entra ID using Microsoft Entra Connect Sync or Microsoft Entra Connect cloud sync. Clients must be Microsoft Entra joined or [Microsoft Entra hybrid joined](../../active-directory/devices/hybrid-join-plan.md). Microsoft Entra Kerberos isn’t supported on clients joined to Microsoft Entra Domain Services or joined to AD only.

:::image type="content" source="media/storage-files-active-directory-overview/files-azure-ad-kerberos-diagram.png" alt-text="Diagram of configuration for Microsoft Entra Kerberos authentication for hybrid identities over SMB.":::

To learn how to enable Microsoft Entra Kerberos authentication for hybrid identities, see [Enable Microsoft Entra Kerberos authentication for hybrid identities on Azure Files](storage-files-identity-auth-hybrid-identities-enable.md).

You can also use this feature to store FSLogix profiles on Azure file shares for Microsoft Entra joined VMs. For more information, see [Create a profile container with Azure Files and Microsoft Entra ID](../../virtual-desktop/create-profile-container-azure-ad.md).

## Access control
Azure Files enforces authorization on user access to both the share level and the directory/file levels. Share-level permission assignment can be performed on Microsoft Entra users or groups managed through Azure RBAC. With Azure RBAC, the credentials you use for file access should be available or synced to Microsoft Entra ID. You can assign Azure built-in roles like **Storage File Data SMB Share Reader** to users or groups in Microsoft Entra ID to grant access to an Azure file share.

At the directory/file level, Azure Files supports preserving, inheriting, and enforcing [Windows ACLs](/windows/win32/secauthz/access-control-lists) just like any Windows file server. You can choose to keep Windows ACLs when copying data over SMB between your existing file share and your Azure file shares. Whether you plan to enforce authorization or not, you can use Azure file shares to back up ACLs along with your data.

### Configure share-level permissions for Azure Files

Once you've enabled an AD source on your storage account, you must do one of the following to access the file share:

- Set a default share-level permission that applies to all authenticated users and groups
- Assign built-in Azure RBAC roles to users and groups, or 
- Configure custom roles for Microsoft Entra identities and assign access rights to file shares in your storage account.

The assigned share-level permission allows the granted identity to get access to the share only, nothing else, not even the root directory. You still need to separately configure directory and file-level permissions.

### Configure directory or file-level permissions for Azure Files

Azure file shares enforce standard Windows ACLs at both the directory and file level, including the root directory. Configuration of directory or file-level permissions is supported over both SMB and REST. Mount the target file share from your VM and configure permissions using Windows File Explorer, Windows [icacls](/windows-server/administration/windows-commands/icacls), or the [Set-ACL](/powershell/module/microsoft.powershell.security/get-acl) command.

### Use the storage account key for superuser permissions

A user with the storage account key can access Azure file shares with superuser permissions. Superuser permissions bypass all access control restrictions.

> [!IMPORTANT]
> Our recommended security best practice is to avoid sharing your storage account keys and leverage identity-based authentication whenever possible.

### Preserve directory and file ACLs when importing data to Azure file shares

Azure Files supports preserving directory or file level ACLs when copying data to Azure file shares. You can copy ACLs on a directory or file to Azure file shares using either Azure File Sync or common file movement toolsets. For example, you can use [robocopy](/windows-server/administration/windows-commands/robocopy) with the `/copy:s` flag to copy data as well as ACLs to an Azure file share. ACLs are preserved by default, so you don't need to enable identity-based authentication on your storage account to preserve ACLs.

## Pricing
There's no additional service charge to enable identity-based authentication over SMB on your storage account. For more information on pricing, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/) and [Microsoft Entra Domain Services pricing](https://azure.microsoft.com/pricing/details/active-directory-ds/).

## Next steps
For more information about Azure Files and identity-based authentication over SMB, see these resources:

- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Overview - on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-auth-active-directory-enable.md)
- [Enable Microsoft Entra Domain Services authentication on Azure Files](storage-files-identity-auth-domain-services-enable.md)
- [Enable Microsoft Entra Kerberos authentication for hybrid identities on Azure Files](storage-files-identity-auth-hybrid-identities-enable.md)
- [Enable AD Kerberos authentication for Linux clients](storage-files-identity-auth-linux-kerberos-enable.md)
- [FAQ](storage-files-faq.md)
