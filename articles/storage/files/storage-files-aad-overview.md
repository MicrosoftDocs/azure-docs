---
title: Azure Files access with Azure AD credentials over SMB (Preview) | Microsoft Docs
description: Azure Files access with Azure AD credentials over SMB (Preview)
services: storage
author: tamram
manager: twooley

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

    Azure Active Directory (Azure AD) is Microsoft’s multi-tenant, cloud-based
    directory, and identity management service that combines core directory
    services, application access management, and identity protection into a
    single solution.

-   **Azure AD Domain Services**

    Azure AD Domain Services provides managed-domain services such as domain join, group policies, LDAP, and Kerberos/NTLM authentication. These services are fully
    compatible with Windows Server Active Directory.

-   **Azure Role Based Access Control (RBAC)**

    Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure. Using RBAC, you can grant only the amount of access
    that users need to perform their jobs. This article helps you get started with RBAC in the Azure portal.

-   **Kerberos Authentication**

    Kerberos is an authentication protocol that is used to verify the identity of a user or host.

## Advantages of using Azure AD integration with Azure Files

Azure AD integration with Azure Files provides several benefits over using Shared Key authentication or shared access signatures for authorizing requests:

-   **Extend the traditional identity-based file share access experience to the cloud with Azure AD**

    If you have "lifted and shifted" your application to cloud, replacing traditional file servers with Azure Files, then you may prefer to offer a share access experience with identity-based authentication. With Azure AD integration, Azure Files supports the same workflow for your Azure domain-joined VMs to access Azure Files using Azure AD credentials. You can choose to sync all of your on-prem Active Directory objects to Azure AD to preserve the same usernames, passwords, and other group assignments.

-   **Enforce granular access control on Azure File shares**

    With Azure AD integration for Azure Files, you can grant permissions to a specific user to Azure Files data at the share, directory, or file level. For example, suppose that you have multiple applications using a single Azure File share that stores checkpoint data for high availability solutions. At one timestamp, primary VMs have read and write access to the share, while secondary VMs have read access only. 

-   **Back up ACLs along with your data**

    You can use Azure Files to back up your existing on-premises file shares. Previously when your files were imported to Azure Files, only the data was copied, not the ACLs. All access assignments would be lost when you restored your existing file shares from Azure Files. Azure Files now preserves your ACLs along with your data when you back up a file share to Azure Files.

## How Azure AD integration for Azure Files works

Azure Files leverages Azure AD Domain Services to support Kerberos authentication for SMB access with Azure AD credentials. Before you can use Azure AD with Azure Files, you must first enable Azure AD Domain Services and join the domain from the VMs where you plan to access Azure Files. Your domain-joined VM resides in same virtual network (VNET) as Azure AD Domain Services. 

When a user attempts to access data in Azure Files, the request is sent to Azure AD Domain Services. Azure AD Domain Services authenticates the user. If  authentication is successful, Azure AD Domain Services returns a Kerberos token. Azure Files uses this token to authorize the request sent by the VM. Azure Files  receives the token only and does not persist any Azure AD credentials.

![Screen shot showing diagram of Azure AD integration with Azure Files](media/storage-files-aad-overview/files-aad-overview.png)

## Capabilities 

### Enable Azure AD integration with Azure Files

You can enable Azure Files Azure AD integration on your new and existing storage accounts. When the feature is enabled, all file shares under the storage account
can configure the access controls with Azure AD users and security groups. Before enabling Azure AD integration, you need to make sure that Azure AD Domain Services is deployed for the
primary Azure AD tenant which your storage account is associated with. If you have not yet setup Azure AD Domain Services, you can follow the step by step guidance: [Enable Azure Active Directory Domain Services using the Azure portal](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-getting-started).
Azure AD Domain Services deployment generally takes 10 to 15 minutes. If your Azure AD Domain Services is set up properly, then you can then enable Azure Files Azure AD integration referring to the instruction here.

???what instruction???

### Configure Azure Files Share Level Permission

Similar to traditional Windows file sharing schema, you need to give authorized users share level permissions to access an Azure File Share. To mount the file
share or access any specific directory or files, the user credential is verified against its share level permission and NTFS permissions. Follow this article to configure your share level permission.

### Configure Azure Files Directory/File Level Permission

Azure Files enforce standard NTFS file permission on the directory and file level including the root directory. Directory/File level permission
configuration is only support over SMB protocol. You will need to mount the target File Share to your VM and configure the permission using
[icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls) command tool. We will support NTFS permission configuration through Windows File Explorer by GA.

### Continue to Support Storage Account Key for Super Users Experience 

Mounting Azure File Shares using storage account key will continue to be supported. Using storage account key is considered as accessing with super user
permission which will surpass all access control restrictions configured on share/directory/file level. We recommend that you avoid sharing your storage
access keys with anyone else and leverage Azure AD permission whenever possible.

### Preserve Directory/File ACLs for data import to Azure File Shares

We support preserving Directory/File ACLs for data import to Azure File Shares. For Preview, you have the option to copy the ACLs on your directory/file through
SMB using tools like [robocopy](https://docs.microsoft.com/windows-server/administration/windows-commands/robocopy)
with flag /sec. By GA, we will extend the capability to support ACL copy using AzCopy, Azure File Sync and other Azure Storage toolsets through REST protocol.

## Billing

There is no additional service charge to enable Azure AD integration on your storage account. For more information on pricing, please refer to [Azure File Storage pricing](https://azure.microsoft.com/pricing/details/storage/files/) and [Azure AD Domain Service pricing](https://azure.microsoft.com/pricing/details/active-directory-ds/) pages.

## Next Steps

See these links for more information about Azure Files.

-   Introduction to Azure Files
-   Planning for an Azure Files deployment
-   Enable Azure AD integration for Azure Files SMB access and mount an Azure File Share using Azure AD credentials
-   FAQ
-   Troubleshooting
