---
title: 'Azure Active Directory Domain Services: Troubleshooting Guide | Microsoft Docs'
description: Troubleshooting guide for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: daveba
editor: curtand

ms.assetid: 4bc8c604-f57c-4f28-9dac-8b9164a0cf0b
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/22/2019
ms.author: iainfou

---
# Azure AD Domain Services - Troubleshooting guide
This article provides troubleshooting hints for issues you may encounter when setting up or administering Azure Active Directory (AD) Domain Services.

## You cannot enable Azure AD Domain Services for your Azure AD directory
This section helps you troubleshoot errors when you try to enable Azure AD Domain Services for your directory.

Pick the troubleshooting steps that correspond to the error message you encounter.

| **Error Message** | **Resolution** |
| --- |:--- |
| *The name contoso100.com is already in use on this network. Specify a name that is not in use.* |[Domain name conflict in the virtual network](troubleshoot.md#domain-name-conflict) |
| *Domain Services could not be enabled in this Azure AD tenant. The service does not have adequate permissions to the application called 'Azure AD Domain Services Sync'. Delete the application called 'Azure AD Domain Services Sync' and then try to enable Domain Services for your Azure AD tenant.* |[Domain Services does not have adequate permissions to the Azure AD Domain Services Sync application](troubleshoot.md#inadequate-permissions) |
| *Domain Services could not be enabled in this Azure AD tenant. The Domain Services application in your Azure AD tenant does not have the required permissions to enable Domain Services. Delete the application with the application identifier d87dcbc6-a371-462e-88e3-28ad15ec4e64 and then try to enable Domain Services for your Azure AD tenant.* |[The Domain Services application is not configured properly in your tenant](troubleshoot.md#invalid-configuration) |
| *Domain Services could not be enabled in this Azure AD tenant. The Microsoft Azure AD application is disabled in your Azure AD tenant. Enable the application with the application identifier 00000002-0000-0000-c000-000000000000 and then try to enable Domain Services for your Azure AD tenant.* |[The Microsoft Graph application is disabled in your Azure AD tenant](troubleshoot.md#microsoft-graph-disabled) |

### Domain Name conflict
**Error message:**

*The name contoso100.com is already in use on this network. Specify a name that is not in use.*

**Remediation:**

Ensure that you do not have an existing domain with the same domain name available on that virtual network. For instance, assume you have a domain called 'contoso.com' already available on the selected virtual network. Later, you try to enable an Azure AD Domain Services managed domain with the same domain name (that is, 'contoso.com') on that virtual network. You encounter a failure when trying to enable Azure AD Domain Services.

This failure is due to name conflicts for the domain name on that virtual network. In this situation, you must use a different name to set up your Azure AD Domain Services managed domain. Alternately, you can de-provision the existing domain and then proceed to enable Azure AD Domain Services.

### Inadequate permissions
**Error message:**

*Domain Services could not be enabled in this Azure AD tenant. The service does not have adequate permissions to the application called 'Azure AD Domain Services Sync'. Delete the application called 'Azure AD Domain Services Sync' and then try to enable Domain Services for your Azure AD tenant.*

**Remediation:**

Check to see if there is an application with the name 'Azure AD Domain Services Sync' in your Azure AD directory. If this application exists, delete it and then re-enable Azure AD Domain Services.

Perform the following steps to check for the presence of the application and to delete it, if the application exists:

1. Navigate to the **Applications** section of your Azure AD directory in the [Azure portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/).
2. Select **All Applications** in the **Show** dropdown. Select **Any** in the **Applications status** dropdown. Select **Any** in the **Application visibility** dropdown.
3. Type **Azure AD Domain Services Sync** in the search box. If the application exists, click on it and click the **Delete** button in the toolbar to delete it.
4. Once you have deleted the application, try to enable Azure AD Domain Services once again.

### Invalid configuration
**Error message:**

*Domain Services could not be enabled in this Azure AD tenant. The Domain Services application in your Azure AD tenant does not have the required permissions to enable Domain Services. Delete the application with the application identifier d87dcbc6-a371-462e-88e3-28ad15ec4e64 and then try to enable Domain Services for your Azure AD tenant.*

**Remediation:**

Check to see if you have an application with the name 'AzureActiveDirectoryDomainControllerServices' (with an application identifier of d87dcbc6-a371-462e-88e3-28ad15ec4e64) in your Azure AD directory. If this application exists, you need to delete it and then re-enable Azure AD Domain Services.

Use the following PowerShell script to find the application and delete it.

> [!NOTE]
> This script uses **Azure AD PowerShell version 2** cmdlets. For a full list of all available cmdlets and to download the module, read the [AzureAD PowerShell reference documentation](https://msdn.microsoft.com/library/azure/mt757189.aspx).
>
>

```powershell
$InformationPreference = "Continue"
$WarningPreference = "Continue"

$aadDsSp = Get-AzureADServicePrincipal -Filter "AppId eq 'd87dcbc6-a371-462e-88e3-28ad15ec4e64'" -ErrorAction Ignore
if ($aadDsSp -ne $null)
{
    Write-Information "Found Azure AD Domain Services application. Deleting it ..."
    Remove-AzureADServicePrincipal -ObjectId $aadDsSp.ObjectId
    Write-Information "Deleted the Azure AD Domain Services application."
}

$identifierUri = "https://sync.aaddc.activedirectory.windowsazure.com"
$appFilter = "IdentifierUris eq '" + $identifierUri + "'"
$app = Get-AzureADApplication -Filter $appFilter
if ($app -ne $null)
{
    Write-Information "Found Azure AD Domain Services Sync application. Deleting it ..."
    Remove-AzureADApplication -ObjectId $app.ObjectId
    Write-Information "Deleted the Azure AD Domain Services Sync application."
}

$spFilter = "ServicePrincipalNames eq '" + $identifierUri + "'"
$sp = Get-AzureADServicePrincipal -Filter $spFilter
if ($sp -ne $null)
{
    Write-Information "Found Azure AD Domain Services Sync service principal. Deleting it ..."
    Remove-AzureADServicePrincipal -ObjectId $sp.ObjectId
    Write-Information "Deleted the Azure AD Domain Services Sync service principal."
}
```
<br>

### Microsoft Graph disabled
**Error message:**

Domain Services could not be enabled in this Azure AD tenant. The Microsoft Azure AD application is disabled in your Azure AD tenant. Enable the application with the application identifier 00000002-0000-0000-c000-000000000000 and then try to enable Domain Services for your Azure AD tenant.

**Remediation:**

Check to see if you have disabled an application with the identifier 00000002-0000-0000-c000-000000000000. This application is the Microsoft Azure AD application and provides Graph API access to your Azure AD tenant. Azure AD Domain Services needs this application to be enabled to synchronize your Azure AD tenant to your managed domain.

To resolve this error, enable this application and then try to enable Domain Services for your Azure AD tenant.


## Users are unable to sign in to the Azure AD Domain Services managed domain
If one or more users in your Azure AD tenant are unable to sign in to the newly created managed domain, perform the following troubleshooting steps:

* **Sign-in using UPN format:** Try to sign in using the UPN format (for example, 'joeuser@contoso.com') instead of the SAMAccountName format ('CONTOSO\joeuser'). The SAMAccountName may be automatically generated for users whose UPN prefix is overly long or is the same as another user on the managed domain. The UPN format is guaranteed to be unique within an Azure AD tenant.

> [!NOTE]
> We recommend using the UPN format to sign in to the Azure AD Domain Services managed domain.
>
>

* Ensure that you have [enabled password synchronization](active-directory-ds-getting-started-password-sync.md) in accordance with the steps outlined in the Getting Started guide.
* **External accounts:** Ensure that the affected user account is not an external account in the Azure AD tenant. Examples of external accounts include Microsoft accounts (for example, 'joe@live.com') or user accounts from an external Azure AD directory. Since Azure AD Domain Services does not have credentials for such user accounts, these users cannot sign in to the managed domain.
* **Synced accounts:** If the affected user accounts are synchronized from an on-premises directory, verify that:

  * You have deployed or updated to the [latest recommended release of Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594).
  * You have configured Azure AD Connect to [perform a full synchronization](active-directory-ds-getting-started-password-sync.md).
  * Depending on the size of your directory, it may take a while for user accounts and credential hashes to be available in Azure AD Domain Services. Ensure you wait long enough before retrying authentication.
  * If the issue persists after verifying the preceding steps, try restarting the Microsoft Azure AD Sync Service. From your sync machine, launch a command prompt and execute the following commands:

    1. net stop 'Microsoft Azure AD Sync'
    2. net start 'Microsoft Azure AD Sync'
* **Cloud-only accounts**: If the affected user account is a cloud-only user account, ensure that the user has changed their password after you enabled Azure AD Domain Services. This step causes the credential hashes required for Azure AD Domain Services to be generated.

## There are one or more alerts on your managed domain

See how to resolve alerts on your managed domain by visiting the [Troubleshoot Alerts](troubleshoot-alerts.md) article.

## Users removed from your Azure AD tenant are not removed from your managed domain
Azure AD protects you from accidental deletion of user objects. When you delete a user account from your Azure AD tenant, the corresponding user object is moved to the Recycle Bin. When this delete operation is synchronized to your managed domain, it causes the corresponding user account to be marked disabled. This feature helps you recover or undelete the user account later.

The user account remains in the disabled state in your managed domain, even if you re-create a user account with the same UPN in your Azure AD directory. To remove the user account from your managed domain, you need to forcibly delete it from your Azure AD tenant.

To remove the user account fully from your managed domain, delete the user permanently from your Azure AD tenant. Use the `Remove-MsolUser` PowerShell cmdlet with the `-RemoveFromRecycleBin` option, as described in this [MSDN article](/previous-versions/azure/dn194132(v=azure.100)).


## Contact us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](contact-us.md).
