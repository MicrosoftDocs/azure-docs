---
title: Configure cloud trust between AD DS and Microsoft Entra ID
description: Learn how to enable identity-based Kerberos authentication for hybrid user identities over Server Message Block (SMB) for Azure Files by establishing a cloud trust between on-premises Active Directory Domain Services (AD DS) and Microsoft Entra ID. Your users can then access Azure file shares by using their on-premises credentials.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 09/20/2024
ms.author: kendownie
recommendations: false
---

# Configure a cloud trust between on premises AD DS and Microsoft Entra ID for accessing Azure Files

Many organizations want to use identity-based authentication for SMB Azure file shares in environments that span both on-premises Active Directory Domain Services (AD DS) and Microsoft Entra, but don't meet the necessary [prerequisites to use Microsoft Entra Kerberos](storage-files-identity-auth-hybrid-identities-enable.md#prerequisites). In such scenarios, customers can establish a cloud trust between their on-premises AD DS and Microsoft Entra ID ([formerly Azure Active Directory](/entra/fundamentals/new-name)) to access SMB file shares using their on-premises credentials. This article explains how a cloud trust works, and provides instructions for setup and validation. It also includes steps to rotate a Kerberos key for your service account in Microsoft Entra ID and Trusted Domain Object, and steps to remove a Trusted Domain Object and all Kerberos settings, if desired.

This article focuses on authenticating [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md), which are on-premises AD DS identities that are synced to Microsoft Entra ID. **Cloud-only identities aren't currently supported for Azure Files**.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Scenarios

The following are examples of scenarios in which you might want to configure a cloud trust:

- You have a traditional on premises AD DS, but you're not able to use it for authentication because you don't have unimpeded network connectivity to the domain controllers.

- You've started migrating to the cloud but currently have applications still running on traditional on-premises AD DS.

- Some or all of your client machines don't meet the operating system requirements for Microsoft Entra Kerberos authentication.

## Permissions

To complete the steps outlined in this article, you'll need:

- An on-premises Active Directory administrator username and password
- Microsoft Entra Global Administrator account username and password

## Prerequisites

Before implementing the incoming trust-based authentication flow, ensure that the following prerequisites are met:

| **Prerequisite** | **Description** |
| --- | --- |
| Client must run Windows 10, Windows Server 2012, or a higher version of Windows. | |
| Clients must be joined to Active Directory (AD). The domain must have a functional level of Windows Server 2012 or higher. | You can determine if the client is joined to AD by running the [dsregcmd command](/azure/active-directory/devices/troubleshoot-device-dsregcmd): `dsregcmd.exe /status` |
| A Microsoft Entra tenant. | A Microsoft Entra Tenant is an identity security boundary that's under the control of your organization’s IT department. It's an instance of Microsoft Entra ID in which information about a single organization resides. |
| An Azure subscription under the same Microsoft Entra tenant you plan to use for authentication. | |
| [Microsoft Entra Connect](/azure/active-directory/hybrid/whatis-azure-ad-connect) must be installed. | [Hybrid environments](../../active-directory/hybrid/whatis-hybrid-identity.md) where identities exist both in Microsoft Entra ID and AD. |
| [Enable Microsoft Entra Kerberos authentication](storage-files-identity-auth-hybrid-identities-enable.md) on the storage account | This will enable any client machines that meet the Microsoft Entra Kerberos prerequisites to mount the file share. |

## Create and configure the Microsoft Entra Kerberos Trusted Domain Object

To create and configure the Microsoft Entra Kerberos Trusted Domain Object, you'll use the [Azure AD Hybrid Authentication Management](https://www.powershellgallery.com/packages/AzureADHybridAuthenticationManagement/) PowerShell module. This module enables hybrid identity organizations (those with Active Directory on-premises) to use modern credentials for their applications and enables Azure AD to become the trusted source for both cloud and on-premises authentication.

### Set up the Trusted Domain Object

You'll use the Azure AD Hybrid Authentication Management PowerShell module to set up a Trusted Domain Object in the on-premises AD domain and register trust information with Microsoft Entra ID. This creates an in-bound trust relationship into the on-premises AD, which enables Microsoft Entra ID to trust on-premises AD.

#### Install the Azure AD Hybrid Authentication Management PowerShell module

1. Start a Windows PowerShell session with the **Run as administrator** option.

1. Install the Azure AD Hybrid Authentication Management PowerShell module using the following script. The script:

    - Enables TLS 1.2 for communication.
    - Installs the NuGet package provider.
    - Registers the PSGallery repository.
    - Installs the PowerShellGet module.
    - Installs the Azure AD Hybrid Authentication Management PowerShell module.
        - The Azure AD Hybrid Authentication Management PowerShell uses the AzureADPreview module, which provides advanced Microsoft Entra management feature.
        - To protect against unnecessary installation conflicts with the Azure AD PowerShell module, this command includes the –AllowClobber option flag.

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Install-PackageProvider -Name NuGet -Force

if (@(Get-PSRepository | ? {$_.Name -eq "PSGallery"}).Count -eq 0){
    Register-PSRepository -DefaultSet-PSRepository -Name "PSGallery" -InstallationPolicy Trusted
}

Install-Module -Name PowerShellGet -Force

Install-Module -Name AzureADHybridAuthenticationManagement -AllowClobber
```

## Next step

For more information, see:

- [Overview of Azure Files identity-based authentication support for SMB access](storage-files-active-directory-overview.md)
