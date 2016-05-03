<properties
	pageTitle="Azure Active Directory Domain Services preview: Getting Started | Microsoft Azure"
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
	ms.date="04/11/2016"
	ms.author="maheshu"/>

# Azure AD Domain Services *(Preview)* - Getting started

## Step 5: Enable password synchronization
Once you have enabled Azure AD Domain Services for your Azure AD tenant, the next step is to enable synchronization of passwords. This enables users to sign in to the domain using their corporate credentials.

The steps involved are different based on whether your organization is a cloud-only Azure AD tenant or is set to synchronize with your on-premises directory using Azure AD Connect.

### Cloud-only tenants - Enable NTLM and Kerberos credential hash generation in Azure AD
If your organization is a cloud-only Azure AD tenant, users that need to use Azure AD Domain Services will need to change their passwords. This step causes the credential hashes required by Azure AD Domain Services for Kerberos and NTLM authentication to be generated in Azure AD. You can either expire passwords for all users in the tenant that need to use Azure AD Domain Services or instruct these users to change their passwords.

Here are instructions you need to provide users, in order to change their passwords:

1. Navigate to the Azure AD Access Panel page for your organization. This is typically available at [http://myapps.microsoft.com](http://myapps.microsoft.com).
2. Select the **profile** tab on this page.
3. Click on the **Change password** tile on this page to initiate a password change.

    ![Create a virtual network for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/user-change-password.png)

4. This brings up the **change password** page. Users can enter their existing (old) password and proceed to change their password.

    ![Create a virtual network for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/user-change-password2.png)

After users have changed their password, the new password will be usable in Azure AD Domain Services shortly. After a few minutes, users can sign in to computers joined to the managed domain using their newly changed password.


### Synced tenants - Enable synchronization of NTLM and Kerberos credential hashes to Azure AD
If the Azure AD tenant for your organization is set to synchronize with your on-premises directory using Azure AD Connect, you will need to configure Azure AD Connect to synchronize credential hashes required for NTLM and Kerberos authentication. These hashes are not synchronized to Azure AD by default and the following steps will enable you to enable synchronization of the hashes to your Azure AD tenant.

#### Install or update Azure AD Connect

You will need to install the latest recommended release of Azure AD Connect on a domain joined computer. If you have an existing instance of Azure AD Connect setup, you will need to update it to use the Azure AD Connect GA build. Ensure you use the latest version of Azure AD Connect, in order to avoid known issues/bugs.

**[Download Azure AD Connect](http://www.microsoft.com/download/details.aspx?id=47594)**

Minimum recommended version: **1.0.9131** - published on December 3, 2015.

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
