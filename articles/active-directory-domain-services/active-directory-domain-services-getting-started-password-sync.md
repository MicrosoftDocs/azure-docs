<properties
	pageTitle="Azure Active Directory Domain Services preview: Getting Started | Microsoft Azure"
	description="Getting started with Azure Active Directory Domain Services"
	services="active-directory-domain-services"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="udayh"
	editor="femila"/>

<tags
	ms.service="active-directory-domain-services"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/29/2015"
	ms.author="mahesh-unnikrishnan"/>

# Azure AD Domain Services *(Preview)*

## Getting started

### Step 5: Enable password synchronization
Once you have enabled Azure AD Domain Services for your Azure AD tenant, the next step is to enable synchronization of passwords. This enables users to sign in to the domain using their corporate credentials.

The steps involved are different based on whether your organization is a cloud-only Azure AD tenant or is set to synchronize with your on-premises directory using Azure AD Connect.

#### Enable password synchronization for cloud-only tenants
If your organization is a cloud-only Azure AD tenant, users that need to use Azure AD Domain Services will need to change their passwords. This step causes the credential hashes required by Azure AD Domain Services for Kerberos and NTLM authentication to be generated in Azure AD. You can either expire passwords for all users in the tenant that need to use Azure AD Domain Services or instruct these end-users to change their passwords.

Here are instructions you need to provide end users in order to change their passwords:
- Navigate to the Azure AD Access Panel page for your organization. This is typically at http://myapps.microsoft.com.
- Select the **profile** tab on this page.
- Click on the **Change password** tile on this page to initiate a password change.

- This brings up the **change password** page. The user can then enter their existing (old) password and proceed to change their password.

After users have changed their password, the new password will be synchronized to Azure AD Domain Services shortly. After the password sync is complete, users can then login to the domain using their newly changed password.


#### Enable password synchronization for synced tenants
If the Azure AD tenant for your organization is set to synchronize with your on-premises directory using Azure AD Connect, you will need to configure Azure AD Connect to synchronize credential hashes required for NTLM and Kerberos authentication. These hashes are not synchronized to Azure AD by default and the following steps will enable you to enable synchronization of the hashes to your Azure AD tenant.

**Step 1: Install Azure Connect (GA release)**

You will need to install the GA release of Azure AD Connect on a domain joined computer. If you have an existing instance of Azure AD Connect setup, you will need to update it to use the Azure AD Connect GA build.

*Download Azure AD Connect – (GA release only):* Download the GA release of Azure AD Connect from the following link: "http://download.microsoft.com/download/B/0/0/B00291D0-5A83-4DE7-86F5-980BC00DE05A/AzureADConnect.msi"

> [AZURE.NOTE] You MUST install the GA release of Azure AD Connect in order to enable legacy password credentials (required for NTLM and Kerberos authentication) to sync to your Azure AD tenant. This functionality is not available in prior releases of Azure AD COnnect.

Installation instructions for Azure AD Connect are available in the following MSDN article - https://msdn.microsoft.com/en-us/library/azure/dn832695.aspx



**Step 2: Enable synchronization of legacy credentials to Azure AD**

Enable synchronization of legacy credentials required for NTLM authentication in Azure AD Domain Services. You can do this by creating the following registry key on the machine where Azure AD Connect was installed.

Create the following DWORD registry key and set it to 1.
```
“HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\MSOLCoExistence\PasswordSync\EnableWindowsLegacyCredentialsSync”

Set its value to 1.
```

**Step 3: Force full password synchronization**

In order to force full password synchronization and enable all on-premises users’ passwords to sync to your Azure AD tenant, execute the following PowerShell script on each AD forest.

```
$adConnector = "<CASE SENSITIVE AD CONNECTOR NAME>"  
$aadConnector = “<CASE SENSITIVE AAD CONNECTOR NAME>”  
Import-Module adsync  
$c = Get-ADSyncConnector -Name $adConnector  
$p = New-Object Microsoft.IdentityManagement.PowerShell.ObjectModel.ConfigurationParameter “Microsoft.Synchronize.ForceFullPasswordSync”, String, ConnectorGlobal, $null, $null, $null  
$p.Value = 1  
$c.GlobalParameters.Remove($p.Name)  
$c.GlobalParameters.Add($p)  
$c = Add-ADSyncConnector -Connector $c  
Set-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector -TargetConnector $aadConnector -Enable $false   
Set-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector -TargetConnector $aadConnector -Enable $true  
```
