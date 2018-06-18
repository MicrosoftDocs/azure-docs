---
title: Azure Files access with Azure AD credentials over SMB (Preview) | Microsoft Docs
description: Azure Files access with Azure AD credentials over SMB (Preview)
services: storage
author: tamram
manager: twooley

ms.service: storage
ms.topic: article
ms.date: 06/05/2018
ms.author: tamram
---

# Azure Files access with Azure AD credentials over SMB (Preview)

Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard [Server Message Block (SMB) protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) (also known as Common Internet File System or CIFS). Azure Files supports integration with Azure Active Directory (Azure AD) leveraging [Azure Active Directory Domain Services](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-overview)
in preview. Azure AD integration enables access to Azure Files shares over SMB from Windows Virtual Machines (VMs). Azure Files supports preserving and enforcing [NTFS DACLs](https://technet.microsoft.com/library/2006.01.howitworksntfs.aspx) on all files and directories under a file share.

## Glossary 

-   **Azure Active Directory (Azure AD)**

    Azure Active Directory (Azure AD) is Microsoft’s multi-tenant, cloud-based
    directory, and identity management service that combines core directory
    services, application access management, and identity protection into a
    single solution.

-   **Azure AD Domain Services**

    Azure AD Domain Services provides managed domain services such as domain
    join, group policy, LDAP, Kerberos/NTLM authentication that are fully
    compatible with Windows Server Active Directory.

-   **Azure Role Based Access Control (RBAC)**

    Azure Role-Based Access Control (RBAC) enables fine-grained access
    management for Azure. Using RBAC, you can grant only the amount of access
    that users need to perform their jobs. This article helps you get up and
    running with RBAC in the Azure portal.

-   **Kerberos Authentication**

    Kerberos is an authentication protocol that is used to verify the identity
    of a user or host.

## Advantages of using Azure AD integration with Azure Files

-   Extend the traditional identity based file share access experience to cloud
    with Azure AD

    If you have lift and shift your application to cloud replacing traditional
    file servers with Azure Files, you would likely want to have the similar
    share access experience with identity based authentication. With Azure AD
    integration, we support the same workflow for your Azure domain joined VMs
    to access Azure Files using Azure AD credentials. You can choose to sync all of
    your on-prem Active Directory objects to Azure AD to preserve the same usernames,
    passwords and other group assignments.

-   Enforce granular access control on Azure File shares

    When there are multiple applications using single Azure File share as the
    shared data store, you might want to impose restrictions on data access on
    share, directory or file level to specific applications for better data
    management. For example, you can store checkpoint data in one Azure File
    Share for a HA solution. At one timestamp, only the primary VMs have read
    and write access to the share where secondary VMs can read the data. Now,
    you can enforce access control on data path to any specific user at all
    granular levels.

-   Backup ACLs along with your data

    Azure Files can be used as a backup for your existing file shares.
    Previously when your files are imported to Azure Files, we only copy over
    the data not the ACLs. You will loss all access assignments when you restore
    from Azure Files. We now complete the backup story by preserving the ACLs
    along with the data when copied over SMB.

## How Azure AD integration for Azure Files works

Azure Files leverages Azure AD Domain Services to support Kerberos authentication for SMB access with Azure AD credentials. Before you can use Azure AD with Azure Files, you must first enable Azure AD Domain Services and join the domain from the VMs where you plan to access Azure Files. Your domain-joined Azure VM resides in same virtual network (VNET) as Azure AD Domain Services. 

When you try to access Azure Files, the request will be sent to Azure AD Domain Services. Azure AD Domain Services will perform the authentication of the Azure AD credentials. If the authentication is
successful, it will return a Kerberos ticket for the VM to direct the request to Azure Files. Azure Files will then validate if the user as the required
permissions to access the share and requested directory/file. Azure Files only enforces the authorization and do not persist any Azure AD credentials.

![Screen shot showing diagram of Azure AD integration with Azure Files](media/storage-files-aad-overview/files-aad-overview.png)

## Supported Scenarios 

-   Azure AD Domain Services Domain Joined Windows VM access Azure Files using Azure AD credentials over SMB protocol

-   Access permission configuration and enforcement on Azure Files share, directory, and file level

-   Inherit or preserve NTFS ACLs on directories and files imported to Azure File share over SMB protocol based on user specification

## Scenarios planned for GA

-   Access Azure Files using Azure Active Directory (Azure AD) credentials from AAD
    DS domain joined Azure Linux VM

-   Access Azure Files using Active Directory (AD) credentials from AD domain
    joined on-premises machines or Azure VMs, even if AD is fully synced to Azure AD

## Out of Scope Scenarios

-   Access Azure Files using Azure Active Directory (Azure AD) credentials from Azure AD
    joined or Azure AD registered on-premises machines, devices, or Azure VMs.

## Capabilities 

### Enable Azure Files Azure AD Integration

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
