---
title: Overview - Azure Files identity-based authorization
description: Azure Files supports identity-based authentication over SMB (Server Message Block) through Azure Active Directory Domain Services (AD DS) and Active Directory. Your domain-joined Windows virtual machines (VMs) can then access Azure file shares using Azure AD credentials. 
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: conceptual
ms.date: 05/29/2020
ms.author: rogarana
---

# Overview of Azure Files identity-based authentication options for SMB access
[!INCLUDE [storage-files-aad-auth-include](../../../includes/storage-files-aad-auth-include.md)]

To learn how to enable on-premises Active Directory Domain Services authentication for Azure file shares, see [Enable on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-auth-active-directory-enable.md).

To learn how to enable Azure AD DS authentication for Azure file shares, see [Enable Azure Active Directory Domain Services authentication on Azure Files](storage-files-identity-auth-active-directory-domain-service-enable.md).

## Glossary 
It's helpful to understand some key terms relating to Azure AD Domain Service authentication over SMB for Azure file shares:

-   **Kerberos authentication**

    Kerberos is an authentication protocol that is used to verify the identity of a user or host. For more information on Kerberos, see [Kerberos Authentication Overview](https://docs.microsoft.com/windows-server/security/kerberos/kerberos-authentication-overview).

-  **Server Message Block (SMB) protocol**

    SMB is an industry-standard network file-sharing protocol. SMB is also known as Common Internet File System or CIFS. For more information on SMB, see [Microsoft SMB Protocol and CIFS Protocol Overview](https://docs.microsoft.com/windows/desktop/FileIO/microsoft-smb-protocol-and-cifs-protocol-overview).

-   **Azure Active Directory (Azure AD)**

    Azure Active Directory (Azure AD) is Microsoft's multi-tenant cloud-based directory and identity management service. Azure AD combines core directory services, application access management, and identity protection into a single solution. Azure AD-joined Windows virtual machines (VMs) can access Azure file shares with your Azure AD credentials. For more information, see [What is Azure Active Directory?](../../active-directory/fundamentals/active-directory-whatis.md)

-   **Azure Active Directory Domain Services (Azure AD DS)**

    Azure AD DS provides managed domain services such as domain join, group policies, LDAP, and Kerberos/NTLM authentication. These services are fully compatible with Active Directory Domain Services. For more information, see [Azure Active Directory Domain Services](../../active-directory-domain-services/overview.md).

- **On-premises Active Directory Domain Services (AD DS)**

    On-premises Active Directory Domain Services (AD DS) integration with Azure Files provides the methods for storing directory data while making it available to network users and administrators. Security is integrated with AD DS through logon authentication and access control to objects in the directory. With a single network logon, administrators can manage directory data and organization throughout their network, and authorized network users can access resources anywhere on the network. AD DS is commonly adopted by enterprises in on-premises environments and AD DS credentials are used as the identity for access control. For more information, see [Active Directory Domain Services Overview](https://docs.microsoft.com/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview).

-   **Azure Role Based Access Control (RBAC)**

    Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure. Using RBAC, you can manage access to resources by granting users the fewest permissions needed to perform their jobs. For more information on RBAC, see [What is role-based access control (RBAC) in Azure?](../../role-based-access-control/overview.md).

## Common use cases

Identity-based authentication and support for Windows ACLs on Azure Files is best leveraged for the following use cases:

### Replace on-premises file servers

Deprecating and replacing scattered on-premises file servers is a common problem that every enterprise encounters in their IT modernization journey. Azure file shares with on-premises AD DS authentication is the best fit here, when you can migrate the data to Azure Files. A complete migration will allow you to take advantage of the high availability and scalability benefits while also minimizing the client-side changes. It provides a seamless migration experience to end users, so they can continue to access their data with the same credentials using their existing domain joined machines.

### Lift and shift applications to Azure

When you lift and shift applications to the cloud, you want to keep the same authentication model for your data. As we extend the identity-based access control experience to Azure file shares, it eliminates the need to change your application to modern auth methods and expedite cloud adoption. Azure file shares provide the option to integrate with either Azure AD DS or on-premises AD DS for authentication. If your plan is to be 100% cloud native and minimize the efforts managing cloud infrastructures, Azure AD DS would be a better fit as a fully managed domain service. If you need full compatibility with AD DS capabilities, you may want to consider extending your AD DS environment to cloud by self-hosting domain controllers on VMs. Either way, we provide the flexibility to choose the domain services that suits your business needs.

### Backup and disaster recovery (DR)

If you are keeping your primary file storage on-premises, Azure file shares can serve as an ideal storage for backup or DR, to improve business continuity. You can use Azure file shares to back up your data from existing file servers, while preserving Windows DACLs. For DR scenarios, you can configure an authentication option to support proper access control enforcement at failover.

## Supported scenarios

The following table summarizes the supported Azure file shares authentication scenarios for Azure AD DS and on-premises AD DS. We recommend selecting the domain service that you adopted for your client environment for integration with Azure Files. If you have AD DS already setup on-premises or in Azure where your devices are domain joined to your AD, you should choose to leverage AD DS for Azure file shares authentication. Similarly, if you've already adopted Azure AD DS, you should use that for authenticating to Azure file shares.


|Azure AD DS authentication  | On-premises AD DS authentication  |
|---------|---------|
|Azure AD DS-joined Windows machines can access Azure file shares with Azure AD credentials over SMB.     |On-premises AD DS-joined or Azure AD DS-joined Windows machines can access Azure file shares with on-premises Active Directory credentials that are synched to Azure AD over SMB. Your client must have line of sight to your AD DS.        |

### Restrictions

- Azure AD DS and on-premises AD DS authentication do not support authentication against computer accounts. You can consider using a service logon account instead.
- Neither Azure AD DS authentication nor on-premises AD DS authentication is supported against Azure AD-joined devices or Azure AD-registered devices.
- Azure file shares only support identity-based authentication against one of the following domain services, either [Azure Active Directory Domain Services (Azure AD DS)](#azure-ad-ds) or [on-premises Active Directory Domain Services (AD DS)](#ad-ds).

## Advantages of identity-based authentication
Identity-based authentication for Azure Files offers several benefits over using Shared Key authentication:

-   **Extend the traditional identity-based file share access experience to the cloud with on-premises AD DS and Azure AD DS**  
    If you plan to lift and shift your application to the cloud, replacing traditional file servers with Azure file shares, then you may want your application to authenticate with either on-premises AD DS or Azure AD DS credentials to access file data. Azure Files supports using both on-premises AD DS or Azure AD DS credentials to access Azure file shares over SMB from either on-premises AD DS or Azure AD DS domain-joined VMs.

-   **Enforce granular access control on Azure file shares**  
    You can grant permissions to a specific identity at the share, directory, or file level. For example, suppose that you have several teams using a single Azure file share for project collaboration. You can grant all teams access to non-sensitive directories, while limiting access to directories containing sensitive financial data to your Finance team only. 

-   **Back up Windows ACLs (also known as NTFS) along with your data**  
    You can use Azure file shares to back up your existing on-premises file shares. Azure Files preserves your ACLs along with your data when you back up a file share to Azure file shares over SMB.

## How it works

Azure file shares leverages Kerberos protocol for authenticating with either on-premises AD DS or Azure AD DS. When an identity associated with a user or application running on a client attempts to access data in Azure file shares, the request is sent to the domain service, either AD DS or Azure AD DS, to authenticate the identity. If authentication is successful, it returns a Kerberos token. The client sends a request that includes the Kerberos token and Azure file shares use that token to authorize the request. Azure file shares only receive the Kerberos token, not access credentials.

Before you can enable identity-based authentication on Azure file shares, you must first set up your domain environment.

### AD DS

For on-premises AD DS authentication, you must set up your AD domain controllers and domain join your machines or VMs. You can host your domain controllers on Azure VMs or on-premises. Either way, your domain joined clients must have line of sight to the domain service, so they must be within the corporate network or virtual network (VNET) of your domain service.

The following diagram depicts on-premises AD DS authentication to Azure file shares over SMB. The on-prem AD DS must be synced to Azure AD using Azure AD Connect sync. Only hybrid users that exist in both on-premises AD DS and Azure AD can be authenticated and authorized for Azure file share access. This is because the share level permission is configured against the identity represented in Azure AD where the directory/file level permission is enforced with that in AD DS. Make sure that you configure the permissions correctly against the same hybrid user.

:::image type="content" source="media/storage-files-active-directory-overview/Files-on-premises-AD-DS-Diagram.png" alt-text="Diagram":::

### Azure AD DS

For Azure AD DS authentication, you should enable Azure AD Domain Services and domain join the VMs you plan to access file data from. Your domain-joined VM must reside in the same virtual network (VNET) as your Azure AD DS. 

The following diagram represents the workflow for Azure AD DS authentication to Azure file shares over SMB. It follows a similar pattern to on-prem AD DS authentication to Azure file shares. There are two major differences:

- First, you don’t need to create the identity in Azure AD DS to represent the storage account. This is performed by the enablement process in the background.

- Second, all users exist in Azure AD can be authenticated and authorized. The user can be cloud only or hybrid. The sync from Azure AD to Azure AD DS is managed by the platform without requiring any user configuration. However, the client must be domain joined to Azure AD DS, it cannot be Azure AD joined or registered. 

:::image type="content" source="media/storage-files-active-directory-overview/Files-Azure-AD-DS-Diagram.png" alt-text="Diagram":::

### Enable identity-based authentication

You can enable identity-based authentication with either Azure AD DS or on-premises AD DS for Azure file shares on your new and existing storage accounts. Only one domain service can be used for file access authentication on the storage account, which applies to all file shares in the account. Detailed guidance on setting up your file shares for authentication with Azure AD DS in our article [Enable Azure Active Directory Domain Services authentication on Azure Files](storage-files-identity-auth-active-directory-domain-service-enable.md) and guidance for on-premises AD DS in our other article, [Enable on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-auth-active-directory-enable.md).

### Configure share-level permissions for Azure Files

Once either Azure AD DS or on-premises AD DS authentication is enabled, you can use built-in RBAC roles or configure custom roles for Azure AD identities and assign access rights to any file shares in your storage accounts. The assigned permission allows the granted identity to get access to the share only, nothing else, not even the root directory. You still need to separately configure directory or file-level permissions for Azure file shares.

### Configure directory or file-level permissions for Azure Files

Azure file shares enforce standard Windows file permissions at both the directory and file level, including the root directory. Configuration of directory or file-level permissions is supported over both SMB and REST. Mount the target file share from your VM and configure permissions using Windows File Explorer, Windows [icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls), or the [Set-ACL](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/get-acl?view=powershell-6) command.

### Use the storage account key for superuser permissions

A user with the storage account key can access Azure file shares with superuser permissions. Superuser permissions bypass all access control restrictions.

> [!IMPORTANT]
> Our recommended security best practice is to avoid sharing your storage account keys and leverage identity-based authentication whenever possible.

### Preserve directory and file ACLs when importing data to Azure file shares

Azure Files supports preserving directory or file level ACLs when copying data to Azure file shares. You can copy ACLs on a directory or file to Azure file shares using either Azure File Sync or common file movement toolsets. For example, you can use [robocopy](https://docs.microsoft.com/windows-server/administration/windows-commands/robocopy) with the `/copy:s` flag to copy data as well as ACLs to an Azure file share. ACLs are preserved by default, you are not required to enable identity-based authentication on your storage account to preserve ACLs.

## Pricing
There is no additional service charge to enable identity-based authentication over SMB on your storage account. For more information on pricing, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/) and [Azure AD Domain Services pricing](https://azure.microsoft.com/pricing/details/active-directory-ds/).

## Next steps
For more information about Azure Files and identity-based authentication over SMB, see these resources:

- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Enable on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-auth-active-directory-enable.md)
- [Enable Azure Active Directory Domain Services authentication on Azure Files](storage-files-identity-auth-active-directory-domain-service-enable.md)
- [FAQ](storage-files-faq.md)
