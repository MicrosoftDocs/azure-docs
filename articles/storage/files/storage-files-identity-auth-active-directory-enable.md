---
title: Enable Active Directory authentication over SMB for Azure Files
description: Learn how to enable identity-based authentication over SMB for Azure file shares through Active Directory. Your domain-joined Windows virtual machines (VMs) can then access Azure file shares by using AD credentials. 
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: conceptual
ms.date: 04/20/2020
ms.author: rogarana
---

# Enable on-premises Active Directory Domain Services authentication over SMB for Azure file shares

[Azure Files](storage-files-introduction.md) supports identity-based authentication over Server Message Block (SMB) through two types of Domain Services: Azure Active Directory Domain Services (Azure AD DS) and on-premises Active Directory Domain Services (AD DS) (preview). This article focuses on the newly introduced (preview) support of leveraging Active Directory Domain Service for authentication to Azure file shares. If you are interested in enabling Azure AD DS authentication for Azure file shares, refer to [our article on the subject](storage-files-identity-auth-active-directory-domain-service-enable.md).

## Limitations

- AD DS identities used for Azure file share authentication must be synced to Azure AD. Password hash synchronization is optional. 
- AD DS authentication does not support authentication against computer accounts created in AD DS. 
- AD DS authentication can only be supported against one AD forest where the storage account is registered to. You can only access Azure file shares with the AD DS credentials from a single forest by default. If you need to access your Azure file share from a different forest, make sure that you have the proper forest trust configured, see [FAQ](https://docs.microsoft.com/azure/storage/files/storage-files-faq#security-authentication-and-access-control) for details.
- AD DS authentication for SMB access and ACL persistence is supported for Azure file shares managed by Azure File Sync.
- Azure Files supports Kerberos authentication with AD with RC4-HMAC encryption. AES Kerberos encryption is not yet supported.
- AD DS authentication over SMB for Azure file shares is only supported on machines or VMs running on OS versions newer than Windows 7 or Windows Server 2008 R2. 

When you enable AD DS for Azure file shares over SMB, your AD DS-joined machines can mount Azure file shares using your existing AD DS credentials. This capability can be enabled with an AD DS environment hosted either in on-prem machines or hosted in Azure.

> [!NOTE]
> To help you setup Azure Files AD authentication for some common use cases, we published [two videos](https://docs.microsoft.com/azure/storage/files/storage-files-introduction#videos) with step by step guidance:
> - Replacing on-premises file servers with Azure Files (including setup on private link for files and AD authentication)
> - Using Azure Files as the profile container for Windows Virtual Desktop (including setup on AD authentication and FsLogix configuration)

## Prerequisites 

Before you enable AD DS authentication for Azure file shares, make sure you have completed the following prerequisites: 

- Select or create your AD DS environment and [sync it to Azure AD](../../active-directory/hybrid/how-to-connect-install-roadmap.md). 

    You can enable the feature on a new or existing on-premises AD DS environment. Identities used for access must be synced to Azure AD. The Azure AD tenant and the file share that you are accessing must be associated with the same subscription. 

    To set up an AD domain environment, refer to [Active Directory Domain Services Overview](https://docs.microsoft.com/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview). If you have not synced your AD to your Azure AD, follow the guidance in [Azure AD Connect and Azure AD Connect Health installation roadmap](../../active-directory/hybrid/how-to-connect-install-roadmap.md) to configure and set up Azure AD Connect. 

- Domain-join an on-premises machine or an Azure VM to on-premises AD DS. 

    To access a file share by using AD credentials from a machine or VM, your device must be domain-joined to AD DS. For information about how to domain-join, refer to [Join a Computer to a Domain](https://docs.microsoft.com/windows-server/identity/ad-fs/deployment/join-a-computer-to-a-domain). 

- Select or create an Azure storage account in [a supported region](#regional-availability). 

    Make sure that the storage account containing your file shares is not already configured for Azure AD DS Authentication. If Azure Files Azure AD DS authentication is enabled on the storage account, it needs to be disabled before changing to use on-premises AD DS. This implies that existing ACLs configured in Azure AD DS environment will need to be reconfigured for proper permission enforcement.
    
    For information about creating a new file share, see [Create a file share in Azure Files](storage-how-to-create-file-share.md).
    
    For optimal performance, we recommend that you deploy the storage account in the same region as the VM from which you plan to access the share. 

- Verify connectivity by mounting Azure file shares using your storage account key. 

    To verify that your device and file share are properly configured, try [mounting the file share](storage-how-to-use-files-windows.md) using your storage account key. If you experience issues in connecting to Azure Files, please refer to [the troubleshooting tool we published for Azure Files mounting errors on Windows](https://gallery.technet.microsoft.com/Troubleshooting-tool-for-a9fa1fe5). We also provide [guidance](https://docs.microsoft.com/azure/storage/files/storage-files-faq#on-premises-access) to work around scenarios when port 445 is blocked. 

## Regional availability

Azure Files authentication with AD DS (preview) is available in [all Public regions and Azure Gov regions](https://azure.microsoft.com/global-infrastructure/locations/).

## Overview

If you plan to enable any networking configurations on your file share, we recommend you to evaluate the [networking consideration](https://docs.microsoft.com/azure/storage/files/storage-files-networking-overview) and complete the related configuration first before enabling AD DS authentication.

AD DS authentication for Azure file shares, represents two 

Next, follow the steps below to set up Azure Files for AD DS authentication: 

1. Enable Azure Files AD DS authentication on your storage account. 

2. Assign access permissions for a share to the Azure AD identity (a user, group, or service principal) that is in sync with the target AD identity. 

3. Configure ACLs over SMB for directories and files. 
 
4. Mount an Azure file share to a VM joined to your AD DS. 

5. Update the password of your storage account identity in AD DS.

The following diagram illustrates the end-to-end workflow for enabling Azure AD authentication over SMB for Azure file shares. 

![Files AD workflow diagram](media/storage-files-active-directory-domain-services-enable/diagram-files-ad.png)

Identities used to access Azure file shares must be synced to Azure AD to enforce share level file permissions through the [role-based access control (RBAC)](../../role-based-access-control/overview.md) model. [Windows-style DACLs](https://docs.microsoft.com/previous-versions/technet-magazine/cc161041(v=msdn.10)?redirectedfrom=MSDN) on files/directories carried over from existing file servers will be preserved and enforced. This feature offers seamless integration with your enterprise AD DS environment. As you replace on-prem file servers with Azure file shares, existing users can access Azure file shares from their current clients with a single sign-on experience, without any change to the credentials in use.  

You have now successfully enabled AD DS authentication over SMB and assigned a custom role that provides access to an Azure file share with an AD DS identity. To grant additional users access to your file share, follow the instructions in the [Assign access permissions](#2-assign-access-permissions-to-an-identity) to use an identity and [Configure NTFS permissions over SMB](#3-configure-ntfs-permissions-over-smb) sections.


## Next steps

For more information about Azure Files and how to use AD over SMB, see these resources:

[1. Enable AD DS authentication for your account](storage-files-identity-ad-ds-enable.md)