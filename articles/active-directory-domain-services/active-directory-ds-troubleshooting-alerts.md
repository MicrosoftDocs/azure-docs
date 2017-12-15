---
title: 'Azure Active Directory Domain Services: Troubleshooting Alerts | Microsoft Docs'
description: Troubleshooting Alerts for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: eringreenlee
manager: mahesh-unnikrishnan
editor: curtand

ms.assetid: 54319292-6aa0-4a08-846b-e3c53ecca483
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/12/2017
ms.author: ergreenl

---
# Azure AD Domain Services - Troubleshooting Alerts
This article provides troubleshooting guides for any alerts you may experience on your managed domain.


Pick the troubleshooting steps that correspond to the error message or alert ID you encounter.

| **Alert ID** | **Error Message** | **Resolution** |
| --- | --- | :--- |
| AADDS001 | *The IP address range for the virtual network %VIRTUAL_NETWORK% in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.* | [Address is in a public IP range](#address-is-in-a-public-ip-range) |
| AADDS001 | *We have identified that the subnet of the virtual network in this domain may not have sufficient IP addresses. Azure AD Domain Services needs at-least two available IP addresses within the subnet it is enabled in. We recommend having at-least 3-5 spare IP addresses within the subnet. This may have occurred if other virtual machines are deployed within the subnet, thus exhausting the number of available IP addresses or if there is a restriction on the number of available IP addresses in the subnet.* | [Insufficient amount of IP addresses available](#insufficient-amount-of-ip-addresses-available) |
| AADDS001 | *error* | [Missing tenant](#missing-tenant) |
| AADDS001 | *Azure AD Domain Services cannot reach the network or does not have outbound internet access. This error is usually caused by an incorrect NSG configuration.* | [Network Error](#network-error) |



### Address is in a public IP range
**Error message:**

*The IP address range for the virtual network %VIRTUAL_NETWORK% in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.*

**Remediation:**

> [!NOTE]
> To address this issue, you must delete your existing managed domain and re-create it in a virtual network with a private IP address range. This process is disruptive.

Before you begin, read the **private IP v4 address space** section in [this article](https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces).

1. Delete your managed domain from your tenant.
  1. Navigate to [Azure AD Domain Services on the Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_AAD_DomainServices=preview#blade/HubsExtension/Resources/resourceType/Microsoft.AAD%2FdomainServices).
  2. Find your domain in the table and open the context menu by clicking the "..." button on the far right of the row.
  3. Select **Delete** and follow the remaining steps.
2. Fix the IP address range for the subnet
  1. Navigate to the [Virtual Networks page on the Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_AAD_DomainServices=preview#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FvirtualNetworks).
  2. Select the virtual network you plan to use for Azure AD Domain Services.
  3. Click on **Address Space** under Settings
  4. Update the address range by clicking on the existing address range and editing it or adding an additional address range. Save your changes.
  5. Click on **Subnets** in the left-hand navigation.
  6. Click on the subnet you wish to edit in the table.
  7. Update the address range and save your changes.
3. Follow [the Getting Started Using Azure AD Domain Services guide](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-getting-started) to recreate your managed domain. Ensure that you pick a virtual network with a private IP address range.
4. To domain-join your virtual machines to your new domain, follow [this guide](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-admin-guide-join-windows-vm-portal).

### Insufficient amount of IP addresses available
**Error message:**

*We have identified that the subnet of the virtual network in this domain may not have sufficient IP addresses. Azure AD Domain Services needs at-least two available IP addresses within the subnet it is enabled in. We recommend having at-least 3-5 spare IP addresses within the subnet. This may have occurred if other virtual machines are deployed within the subnet, thus exhausting the number of available IP addresses or if there is a restriction on the number of available IP addresses in the subnet.*

**Remediation:**

> [!NOTE]
> To address this issue, you must delete your existing managed domain and re-create it in a subnet with a sufficient number of IP addresses. This process is disruptive.


1. Delete your managed domain from your tenant.
  1. Navigate to [Azure AD Domain Services on the Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_AAD_DomainServices=preview#blade/HubsExtension/Resources/resourceType/Microsoft.AAD%2FdomainServices).
  2. Find your domain in the table and open the context menu by clicking the "..." button on the far right of the row.
  3. Select **Delete** and follow the remaining steps.
2. Fix the IP address range for the subnet
  1. Navigate to the [Virtual Networks page on the Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_AAD_DomainServices=preview#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FvirtualNetworks).
  2. Select the virtual network you plan to use for Azure AD Domain Services.
  3. Click on **Address Space** under Settings
  4. Update the address range by clicking on the existing address range and editing it or adding an additional address range. Save your changes.
  5. Click on **Subnets** in the left-hand navigation.
  6. Click on the subnet you wish to edit in the table.
  7. Update the address range and save your changes.
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

*Azure AD Domain Services cannot reach the network or does not have outbound internet access. This error is usually caused by an incorrect NSG configuration or user-defined route table error.*

**Remediation:**

To restore your service, use the [Troubleshooting Secure LDAP and NSG Configuration](active-directory-ds-troubleshoot-ldaps) article.

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
