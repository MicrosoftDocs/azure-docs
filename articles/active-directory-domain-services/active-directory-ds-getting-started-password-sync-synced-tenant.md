---
title: 'Azure AD Domain Services: Enable password synchronization | Microsoft Docs'
description: Getting started with Azure Active Directory Domain Services
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: stevenpo
editor: curtand

ms.assetid: 8731f2b2-661c-4f3d-adba-2c9e06344537
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/17/2017
ms.author: maheshu

---
# Enable password synchronization to Azure AD Domain Services
In preceding tasks, you enabled Azure AD Domain Services for your Azure AD tenant. The next task is to enable synchronization of passwords to Azure AD Domain Services. Once credential synchronization is set up, users can sign in to the managed domain using their corporate credentials.

The steps involved are different based on whether your organization has a cloud-only Azure AD tenant or is set to synchronize with your on-premises directory using Azure AD Connect.

<br>

> [!div class="op_single_selector"]
> * [Cloud-only Azure AD tenant](active-directory-ds-getting-started-password-sync.md)
> * [Synced Azure AD tenant](active-directory-ds-getting-started-password-sync-synced-tenant.md)
>
>

<br>

## Task 5: Enable password synchronization to AAD Domain Services for a synced Azure AD tenant
A synced Azure AD tenant is set to synchronize with your organization's on-premises directory using Azure AD Connect. Azure AD Connect does not synchronize NTLM and Kerberos credential hashes to Azure AD by default. To use Azure AD Domain Services, you need to configure Azure AD Connect to synchronize credential hashes required for NTLM and Kerberos authentication. 

> [!WARNING]
> You MUST enable password synchronization to AAD Domain Services every time you enable Azure AD Domain Services. You may have previously enabled Azure AD Domain Services for your Azure AD directory and then turned if off. However, you must still enable password synchronization the next time you enable Azure AD Domain Services for the directory.
>
>

The following steps enable synchronization of the required credential hashes to your Azure AD tenant.

### Install or update Azure AD Connect
Install the latest recommended release of Azure AD Connect on a domain joined computer. If you have an existing instance of Azure AD Connect setup, you need to update it to use the latest version of Azure AD Connect. To avoid known issues/bugs that may have already been fixed, ensure you always use the latest version of Azure AD Connect.

**[Download Azure AD Connect](http://www.microsoft.com/download/details.aspx?id=47594)**

Recommended version: **1.1.281.0** - published on September 7, 2016.

> [!WARNING]
> You MUST install the latest recommended release of Azure AD Connect to enable the legacy password credentials (required for NTLM and Kerberos authentication) to synchronize to your Azure AD tenant. This functionality is not available in prior releases of Azure AD Connect or with the legacy DirSync tool.
>
>

Installation instructions for Azure AD Connect are available in the following article - [Getting started with Azure AD Connect](../active-directory/active-directory-aadconnect.md)

### Enable synchronization of NTLM and Kerberos credential hashes to Azure AD
Execute the following PowerShell script on each AD forest, to force full password synchronization, and enable all on-premises users’ credential hashes to sync to your Azure AD tenant. This script enables the credential hashes required for NTLM/Kerberos authentication to be synchronized to your Azure AD tenant.

```
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
