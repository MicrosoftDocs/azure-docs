---
title: 'Azure Active Directory Domain Services: Troubleshooting Guide | Microsoft Docs'
description: Troubleshooting guide for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: stevenpo
editor: curtand

ms.assetid: 4bc8c604-f57c-4f28-9dac-8b9164a0cf0b
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/16/2017
ms.author: maheshu

---
# Azure AD Domain Services - Troubleshooting guide
This article provides troubleshooting hints for issues you may encounter when setting up or administering Azure Active Directory (AD) Domain Services.

## You cannot enable Azure AD Domain Services for your Azure AD directory
This section helps you troubleshoot errors when you try to enable Azure AD Domain Services for your directory and it fails or gets toggled back to 'Disabled'.

Pick the troubleshooting steps that correspond to the error message you encounter.

| **Error Message** | **Resolution** |
| --- |:--- |
| *The name contoso100.com is already in use on this network. Specify a name that is not in use.* |[Domain name conflict in the virtual network](active-directory-ds-troubleshooting.md#domain-name-conflict) |
| *Domain Services could not be enabled in this Azure AD tenant. The service does not have adequate permissions to the application called 'Azure AD Domain Services Sync'. Delete the application called 'Azure AD Domain Services Sync' and then try to enable Domain Services for your Azure AD tenant.* |[Domain Services does not have adequate permissions to the Azure AD Domain Services Sync application](active-directory-ds-troubleshooting.md#inadequate-permissions) |
| *Domain Services could not be enabled in this Azure AD tenant. The Domain Services application in your Azure AD tenant does not have the required permissions to enable Domain Services. Delete the application with the application identifier d87dcbc6-a371-462e-88e3-28ad15ec4e64 and then try to enable Domain Services for your Azure AD tenant.* |[The Domain Services application is not configured properly in your tenant](active-directory-ds-troubleshooting.md#invalid-configuration) |
| *Domain Services could not be enabled in this Azure AD tenant. The Microsoft Azure AD application is disabled in your Azure AD tenant. Enable the application with the application identifier 00000002-0000-0000-c000-000000000000 and then try to enable Domain Services for your Azure AD tenant.* |[The Microsoft Graph application is disabled in your Azure AD tenant](active-directory-ds-troubleshooting.md#microsoft-graph-disabled) |
| *Azure AD Domain Services and Azure AD B2C cannot be run concurrently on the same tenant. To restore your Azure AD Domain Services instance, disable Azure AD B2C and re-enable Azure AD DS.* | [Azure B2C is enabled in your tenant](active-directory-ds-troubleshooting.md#azure-b2c-conflict) |
| *The IP address range for the virtual network %VIRTUAL_NETWORK% in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.* | [Address is in a public IP range](active-directory-ds-troubleshooting.md#address-is-in-a-public-ip-range) |
| *We have identified that the subnet of the virtual network in this domain may not have sufficient IP addresses. Azure AD Domain Services needs at-least two available IP addresses within the subnet it is enabled in. We recommend having at-least 3-5 spare IP addresses within the subnet. This may have occurred if other virtual machines are deployed within the subnet, thus exhausting the number of available IP addresses or if there is a restriction on the number of available IP addresses in the subnet.* | [Insufficient amount of IP addresses available](active-directory-ds-troubleshooting.md#insufficient-amount-of-ip-addresses-available) |
| *error* | [Missing tenant](active-directory-ds-troubleshooting.md#missing-tenant) |
| *Azure AD Domain Services cannot reach the network or does not have outbound internet access. This error is usually caused by an incorrect NSG configuration.* | [Network Error](active-directory-ds-troubleshooting.md#network-error) |

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

1. Navigate to the **Azure classic portal** ([https://manage.windowsazure.com](https://manage.windowsazure.com)).
2. Select the **Active Directory** node on the left pane.
3. Select the Azure AD tenant (directory) for which you would like to enable Azure AD Domain Services.
4. Navigate to the **Applications** tab.
5. Select the **Applications my company owns** option in the dropdown.
6. Check for an application called **Azure AD Domain Services Sync**. If the application exists, proceed to delete it.
7. Once you have deleted the application, try to enable Azure AD Domain Services once again.

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

```
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

### Azure B2C conflict
**Error message:**

*Azure AD Domain Services and Azure AD B2C cannot be run concurrently on the same tenant. To restore your Azure AD Domain Services instance, disable Azure AD B2C and re-enable Azure AD DS.*

**Remediation:**

To restore your service, follow these steps:

1. Navigate to the Azure portal (https://portal.azure.com/)
2. Click on **More Services** within the left-hand navigation.
3. Search for **Azure AD B2C**
4. Click on **Overview**
5. **?????**

### Address is in a public IP range
**Error message:**

*The IP address range for the virtual network %VIRTUAL_NETWORK% in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.*

**Remediation:**

> [!NOTE]
> To address this issue, you must delete your existing managed domain and re-create it in a virtual network with a private IP address range. This process is disruptive.

Before you begin, read the **private IP v4 address space** section in [this article](https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces).

1. Delete your managed domain from your tenant.
  1. Navigate to the Azure portal (https://portal.azure.com/)
  2. Select **Azure AD Domain Services** from the left-hand navigation.
  3. Find your domain in the table and open the context menu by clicking the "..." button on the far right of the row.
  4. Select **Delete** and follow the remaining steps.
2. Follow [the Getting Started Using Azure AD Domain Services guide](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-getting-started) to recreate your managed domain. Ensure that you pick a virtual network with a private IP address range.
3. To domain-join your virtual machines to your new domain, follow [this guide](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-admin-guide-join-windows-vm-portal).

### Insufficient amount of IP addresses available
**Error message:**

*We have identified that the subnet of the virtual network in this domain may not have sufficient IP addresses. Azure AD Domain Services needs at-least two available IP addresses within the subnet it is enabled in. We recommend having at-least 3-5 spare IP addresses within the subnet. This may have occurred if other virtual machines are deployed within the subnet, thus exhausting the number of available IP addresses or if there is a restriction on the number of available IP addresses in the subnet.*

**Remediation:**

> [!NOTE]
> To address this issue, you must delete your existing managed domain and re-create it in a subnet with a sufficient number of IP addresses. This process is disruptive.


1. Delete your managed domain from your tenant.
  1. Navigate to the Azure portal (https://portal.azure.com/)
  2. Select **Azure AD Domain Services** from the left-hand navigation.
  3. Find your domain in the table and open the context menu by clicking the "..." button on the far right of the row.
  4. Select **Delete** and follow the remaining steps.
2. Fix the IP address range for the subnet
  1. Navigate to the Azure portal (https://portal.azure.com/)
  2. Select **Virtual Networks** from the left-hand navigation.
  3. Select the virtual network you plan to use for Azure AD Domain Services.
  4. Click on **Address Space** under Settings
  5. Update the address range by clicking on the existing address range and editing it or adding an additional address range. Save your changes.
  6. *UPDATE SUBNET?????*
3. Follow [the Getting Started Using Azure AD Domain Services guide](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-getting-started) to recreate your managed domain. Ensure that you pick a virtual network with a private IP address range.
4. To domain-join your virtual machines to your new domain, follow [this guide](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-admin-guide-join-windows-vm-portal).


### Missing tenant
**Error message:**

*error message here*

**Remediation:**

To restore your service, follow these steps:

1. Navigate to the Azure portal (https://portal.azure.com/)
2. C
3. S
4. C

### Network Error
**Error message:**

*Azure AD Domain Services cannot reach the network or does not have outbound internet access. This error is usually caused by an incorrect NSG configuration.*

**Remediation:**

To restore your service, use the

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

  * You have deployed or updated to the [latest recommended release of Azure AD Connect](https://www.microsoft.com/en-us/download/details.aspx?id=47594).
  * You have configured Azure AD Connect to [perform a full synchronization](active-directory-ds-getting-started-password-sync.md).
  * Depending on the size of your directory, it may take a while for user accounts and credential hashes to be available in Azure AD Domain Services. Ensure you wait long enough before retrying authentication.
  * If the issue persists after verifying the preceding steps, try restarting the Microsoft Azure AD Sync Service. From your sync machine, launch a command prompt and execute the following commands:

    1. net stop 'Microsoft Azure AD Sync'
    2. net start 'Microsoft Azure AD Sync'
* **Cloud-only accounts**: If the affected user account is a cloud-only user account, ensure that the user has changed their password after you enabled Azure AD Domain Services. This step causes the credential hashes required for Azure AD Domain Services to be generated.

## Users removed from your Azure AD tenant are not removed from your managed domain
Azure AD protects you from accidental deletion of user objects. When you delete a user account from your Azure AD tenant, the corresponding user object is moved to the Recycle Bin. When this delete operation is synchronized to your managed domain, it causes the corresponding user account to be marked disabled. This feature helps you recover or undelete the user account later.

The user account remains in the disabled state in your managed domain, even if you re-create a user account with the same UPN in your Azure AD directory. To remove the user account from your managed domain, you need to force delete it from your Azure AD tenant.

To remove the user account fully from your managed domain, delete the user permanently from your Azure AD tenant. Use the Remove-MsolUser PowerShell cmdlet with the '-RemoveFromRecycleBin' option, as described in this [MSDN article](https://msdn.microsoft.com/library/azure/dn194132.aspx).

## Contact Us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
