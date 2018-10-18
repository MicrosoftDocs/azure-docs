---
title: 'Azure AD Domain Services: Enable password synchronization | Microsoft Docs'
description: Getting started with Azure Active Directory Domain Services
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: 8731f2b2-661c-4f3d-adba-2c9e06344537
ms.service: active-directory
ms.component: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 11/15/2017
ms.author: maheshu

---
# Enable password synchronization to Azure Active Directory Domain Services
In preceding tasks, you enabled Azure Active Directory Domain Services for your Azure Active Directory (Azure AD) tenant. The next task is to enable synchronization of credential hashes required for NT LAN Manager (NTLM) and Kerberos authentication to Azure AD Domain Services. After you've set up credential synchronization, users can sign in to the managed domain with their corporate credentials.

The steps involved are different for cloud-only user accounts vs user accounts that are synchronized from your on-premises directory using Azure AD Connect.

<br>
| **Type of user account** | **Steps to perform** |
| --- | --- |
| **User accounts synchronized from an on-premises directory** |**&#x2713;** [Follow the instructions in this article](active-directory-ds-getting-started-password-sync-synced-tenant.md#task-5-enable-password-synchronization-to-your-managed-domain-for-user-accounts-synced-with-your-on-premises-ad) | 
| **Cloud user accounts created in Azure AD** |**&#x2713;** [Synchronize passwords for cloud-only user accounts to your managed domain](active-directory-ds-getting-started-password-sync.md) |
<br>

> [!TIP]
> **You may need to complete both sets of steps.**
> If your Azure AD tenant has a combination of cloud only users and users from your on-premises AD, you need to complete both sets of steps.
>

## Task 5: enable password synchronization to your managed domain for user accounts synced with your on-premises AD
A synced Azure AD tenant is set to synchronize with your organization's on-premises directory using Azure AD Connect. By default, Azure AD Connect does not synchronize NTLM and Kerberos credential hashes to Azure AD. To use Azure AD Domain Services, you need to configure Azure AD Connect to synchronize credential hashes required for NTLM and Kerberos authentication. The following steps enable synchronization of the required credential hashes from your on-premises directory to your Azure AD tenant.

> [!NOTE]
> **If your organization has user accounts that are synchronized from your on-premises directory, you must enable synchronization of NTLM and Kerberos hashes in order to use the managed domain.** A synced user account is an account that was created in your on-premises directory and is synchronized to your Azure AD tenant using Azure AD Connect.
>
>

### Install or update Azure AD Connect
Install the latest recommended release of Azure AD Connect on a domain joined computer. If you have an existing instance of Azure AD Connect setup, you need to update it to use the latest version of Azure AD Connect. To avoid known issues/bugs that may have already been fixed, always use the latest version of Azure AD Connect.

**[Download Azure AD Connect](http://www.microsoft.com/download/details.aspx?id=47594)**

Recommended version: **1.1.614.0** - published on September 5, 2017.

> [!WARNING]
> You MUST install the latest recommended release of Azure AD Connect to enable the legacy password credentials (required for NTLM and Kerberos authentication) to synchronize to your Azure AD tenant. This functionality is not available in prior releases of Azure AD Connect or with the legacy DirSync tool.
>
>

Installation instructions for Azure AD Connect are available in the following article - [Getting started with Azure AD Connect](../active-directory/hybrid/whatis-hybrid-identity.md)

### Enable synchronization of NTLM and Kerberos credential hashes to Azure AD
Execute the following PowerShell script on each AD forest. The script enables all on-premises users' NTLM and Kerberos password hashes to be synchronized to your Azure AD tenant. The script also initiates a full synchronization in Azure AD Connect.

```powershell
$adConnector = "<CASE SENSITIVE AD CONNECTOR NAME>"  
$azureadConnector = "<CASE SENSITIVE AZURE AD CONNECTOR NAME>"  
Import-Module adsync  
$c = Get-ADSyncConnector -Name $adConnector  
$p = New-Object Microsoft.IdentityManagement.PowerShell.ObjectModel.ConfigurationParameter "Microsoft.Synchronize.ForceFullPasswordSync", String, ConnectorGlobal, $null, $null, $null
$p.Value = 1  
$c.GlobalParameters.Remove($p.Name)  
$c.GlobalParameters.Add($p)  
$c = Add-ADSyncConnector -Connector $c  
Set-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector -TargetConnector $azureadConnector -Enable $false   
Set-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector -TargetConnector $azureadConnector -Enable $true  
```

Depending on the size of your directory (number of users, groups etc.), synchronization of credential hashes to Azure AD takes time. The passwords will be usable on the Azure AD Domain Services managed domain shortly after the credential hashes have synchronized to Azure AD.

<br>

## Related Content
* [Enable password synchronization to AAD Domain Services for a cloud-only Azure AD directory](active-directory-ds-getting-started-password-sync.md)
* [Administer an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-administer-domain.md)
* [Join a Windows virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-windows-vm.md)
* [Join a Red Hat Enterprise Linux virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-rhel-linux-vm.md)
