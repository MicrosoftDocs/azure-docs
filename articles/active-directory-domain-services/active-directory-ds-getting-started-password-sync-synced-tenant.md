<properties
	pageTitle="Azure AD Domain Services: Enable password synchronization | Microsoft Azure"
	description="Getting started with Azure Active Directory Domain Services"
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="07/06/2016"
	ms.author="maheshu"/>

# Azure AD Domain Services *(Preview)* - Enable password synchronization to Azure AD Domain Services

## Task 5: Enable password synchronization to AAD Domain Services for a synced Azure AD tenant
Once you have enabled Azure AD Domain Services for your Azure AD directory, the next task is to enable synchronization of passwords to Azure AD Domain Services. This enables users to sign in to the domain using their corporate credentials.

The steps involved are different based on whether your organization has a cloud-only Azure AD directory or is set to synchronize with your on-premises directory using Azure AD Connect.

<br>

> [AZURE.SELECTOR]
- [Cloud-only Azure AD directory](active-directory-ds-getting-started-password-sync.md)
- [Synced Azure AD directory](active-directory-ds-getting-started-password-sync-synced-tenant.md)

<br>

### Synced tenants - Enable synchronization of NTLM and Kerberos credential hashes to Azure AD
If the Azure AD tenant for your organization is set to synchronize with your on-premises directory using Azure AD Connect, you will need to configure Azure AD Connect to synchronize credential hashes required for NTLM and Kerberos authentication. These hashes are not synchronized to Azure AD by default and the following steps will enable you to enable synchronization of the hashes to your Azure AD tenant.

#### Install or update Azure AD Connect

You will need to install the latest recommended release of Azure AD Connect on a domain joined computer. If you have an existing instance of Azure AD Connect setup, you will need to update it to use the Azure AD Connect GA build. Ensure you use the latest version of Azure AD Connect, in order to avoid known issues/bugs that may have already been fixed.

**[Download Azure AD Connect](http://www.microsoft.com/download/details.aspx?id=47594)**

Recommended version: **1.1.189.0** - published on June 3, 2016.

  > [AZURE.WARNING] You MUST install the latest recommended release of Azure AD Connect in order to enable legacy password credentials (required for NTLM and Kerberos authentication) to synchronize to your Azure AD tenant. This functionality is not available in prior releases of Azure AD Connect or with the legacy DirSync tool.

Installation instructions for Azure AD Connect are available in the following article - [Getting started with Azure AD Connect](../active-directory/active-directory-aadconnect.md)


#### Force full password synchronization to Azure AD

In order to force full password synchronization and enable all on-premises users’ password hashes (including the credential hashes required for NTLM/Kerberos authentication) to sync to your Azure AD tenant, execute the following PowerShell script on each AD forest.

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

Depending on the size of your directory (number of users, groups etc.), synchronization of credentials to Azure AD will take time. The passwords will be usable on the Azure AD Domain Services managed domain shortly after the credential hashes have synchronized to Azure AD.


<br>

## Related Content

- [Enable password synchronization to AAD Domain Services for a cloud-only Azure AD directory](active-directory-ds-getting-started-password-sync.md)

- [Administer an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-administer-domain.md)

- [Join a Windows virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-windows-vm.md)

- [Join a Red Hat Enterprise Linux virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-rhel-linux-vm.md)
