---
title: Azure Files access with Azure AD credentials over SMB (Preview) | Microsoft Docs
description: Azure Files access with Azure AD credentials over SMB (Preview)
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 07/03/2018
ms.author: tamram
---

# Azure Files access with Azure AD credentials over SMB (Preview)

[!INCLUDE [storage-files-aad-integration-include](../../../includes/storage-files-aad-integration-include.md)]

## Glossary 

It's helpful to understand some key terms relating to Azure AD integration with Azure Files:

-   **Azure Active Directory (Azure AD)**

    Azure Active Directory (Azure AD) is Microsoft’s multi-tenant, cloud-based directory and identity management service that combines core directory services, application access management, and identity protection into a single solution. For more information, see [What is Azure Active Directory?](../../active-directory/fundamentals/active-directory-whatis.md).

-   **Azure AD Domain Services**

    Azure AD Domain Services provides managed-domain services such as domain join, group policies, LDAP, and Kerberos/NTLM authentication. These services are fully
    compatible with Windows Server Active Directory.

-   **Azure Role Based Access Control (RBAC)**

    Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure. Using RBAC, you can grant users the fewest permissions needed to perform their jobs.

-   **Kerberos Authentication**

    Kerberos is an authentication protocol that is used to verify the identity of a user or host.

## Advantages of using Azure AD integration with Azure Files

Azure AD integration with Azure Files provides several benefits over using Shared Key authentication for authorizing requests:

-   **Extend the traditional identity-based file share access experience to the cloud with Azure AD**

    If you plan to lift and shift your application to cloud, replacing traditional file servers with Azure Files, then you may prefer to offer a share access experience with identity-based authentication. With Azure AD integration, Azure Files supports the same workflow for your Azure DS domain-joined VMs to access Azure Files using Azure AD credentials. You can choose to sync all of your on-prem Active Directory objects to Azure AD to preserve the same usernames, passwords, and other group assignments.

-   **Enforce granular access control on Azure Files shares**

    With Azure AD integration for Azure Files, you can grant permissions to a specific user to Azure Files data at the share, directory, or file level. For example,suppose that you have multiple teams using a single Azure Files share that stores checkpoint data for high availability solutions. You can permit all teams to access non-sensitive directories and limit access to directories containing sensitive financial data related to your Finance team only. 

-   **Back up ACLs along with your data**

    You can use Azure Files to back up your existing on-premises file shares. Previously when your files were imported to Azure Files, only the data was copied, not the ACLs. All access assignments would be lost when you restored your existing file shares from Azure Files. Azure Files can now preserve your ACLs along with your data when you back up a file share to Azure Files over SMB.

## How Azure AD integration for Azure Files works

Azure Files leverages Azure AD Domain Services to support Kerberos authentication for SMB access with Azure AD credentials. Before you can use Azure AD with Azure Files, you must first enable Azure AD Domain Services and join the domain from the VMs where you plan to access Azure Files. Your domain-joined VM resides in same virtual network (VNET) as Azure AD Domain Services. 

When a user attempts to access data in Azure Files, the request is sent to Azure AD Domain Services. Azure AD Domain Services authenticates the user. If  authentication is successful, Azure AD Domain Services returns a Kerberos token. Azure Files uses this token to authorize the request sent by the VM. Azure Files  receives the token only and does not persist any Azure AD credentials.

![Screen shot showing diagram of Azure AD integration with Azure Files](media/storage-files-aad-overview/files-aad-overview.png)

## Capabilities 

### Enable Azure AD integration with Azure Files

You can enable Azure AD integration for Azure Files on your new and existing storage accounts. When the feature is enabled, you can configure role-based access control (RBAC) for your Azure AD users and security groups, assigning access to any file shares in the storage account. 

Before enabling Azure AD integration, make sure that Azure AD Domain Services is deployed for the primary Azure AD tenant with which your storage account is associated. If you have not yet setup Azure AD Domain Services, follow the step by step guidance provided in [Enable Azure Active Directory Domain Services using the Azure portal](../../active-directory-domain-services/active-directory-ds-getting-started.md).

Azure AD Domain Services deployment generally takes 10 to 15 minutes. After Azure AD Domain Services has been deployed, you can enable Azure AD integration for Azure Files. For more information, see [Enable Azure Active Directory integration for Azure Files SMB access](storage-files-aad-enable.md). 

### Configure share-level permissions for Azure Files

To permit users to access to an Azure Files share, grant them share-level permissions to the share using RBAC.

When a user tries to mount an Azure Files file share or access a directory or file in that share, the user's credentials are verified to ensure the proper share-level permissions and NTFS permissions. Follow this article to configure your share level permission.

???what article???

### Configure Azure Files Directory/File Level Permission

Azure Files enforce standard NTFS file permission on the directory and file level including the root directory. Directory/File level permission
configuration is only support over SMB protocol. You will need to mount the target File Share to your VM and configure the permission using
[icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls) command tool. NTFS permission configuration through Windows File Explorer is not supported in the preview release.

### Continue to Support Storage Account Key for Super Users Experience 

Mounting Azure Files shares using storage account key will continue to be supported. Using storage account key is considered as accessing with super user
permission which will surpass all access control restrictions configured on share/directory/file level. We recommend that you avoid sharing your storage
access keys with anyone else and leverage Azure AD permission whenever possible.

### Preserve Directory/File ACLs for data import to Azure Files shares

Azure AD integration with Azure Files supports preserving directory or file ACLs when you import data to Azure Files shares. For the preview release, you have the option to copy the ACLs on your directory or file through SMB. For example, you can use [robocopy](https://docs.microsoft.com/windows-server/administration/windows-commands/robocopy)
with flag `/copy:s`.

## Billing

There is no additional service charge to enable Azure AD integration on your storage account. For more information on pricing, see [Azure File Storage pricing](https://azure.microsoft.com/pricing/details/storage/files/) and [Azure AD Domain Service pricing](https://azure.microsoft.com/pricing/details/active-directory-ds/) pages.

## Next Steps

See these links for more information about Azure Files.

-   Introduction to Azure Files
-   Planning for an Azure Files deployment
-   Enable Azure AD integration for Azure Files SMB access and mount an Azure Files share using Azure AD credentials
-   FAQ
-   Troubleshooting
