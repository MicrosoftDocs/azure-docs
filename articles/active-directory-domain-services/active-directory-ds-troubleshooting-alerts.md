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
ms.date: 01/08/2018
ms.author: ergreenl

---
# Azure AD Domain Services - Troubleshooting Alerts
This article provides troubleshooting guides for any alerts you may experience on your managed domain.


Pick the troubleshooting steps that correspond to the error message or alert ID you encounter.

| **Alert ID** | **Error Message** | **Resolution** |
| --- | --- | :--- |
| AADDS001 | *Secure LDAP over the internet is enabled for the managed domain. However, access to port 636 is not locked down using a network security group. This may expose user accounts on the managed domain to password brute-force attacks.* | [Incorrect secure LDAP configuration](active-directory-ds-troubleshoot-ldaps.md) |
| AADDS100 | *Azure AD Domain Services could not reach the tenant for this domain. This could be caused by accidentally deleting the original tenant this subscription was associated with.* | [Missing tenant](#aadds100-missing-tenant) |
| AADDS101 | *Azure AD Domain Services and Azure AD B2C cannot be run concurrently on the same tenant. To restore your Azure AD Domain Services instance, disable Azure AD B2C and re-enable Azure AD DS.* | [Azure B2C is enabled on the tenant](#aadds101-azure-b2c-is-enabled-on-the-tenant) |
| AADDS102 | *The Service Principal %SERVICE_PRINCIPAL% required for Azure AD Domain Services to function properly has been deleted from your Azure AD tenant. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.* | [Missing Service Principal](active-directory-ds-troubleshoot-service-principals.md) |
| AADDS103 | *The IP address range for the virtual network %VIRTUAL_NETWORK% in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.* | [Address is in a public IP range](#aadds103-address-is-in-a-public-ip-range) |
| AADDS104 | *Azure AD Domain Services cannot reach the network or does not have outbound internet access. This error is usually caused by an incorrect NSG configuration.* | [Network Error](active-directory-ds-troubleshoot-nsg.md) |

### AADDS100: Missing tenant
**Error message:**

*Azure AD Domain Services could not reach the tenant for this domain. This could be caused by accidentally deleting the original tenant this subscription was associated with.*

**Remediation:**

This is an unrecoverable error. To resolve, you must [delete your existing managed domain](active-directory-ds-disable-aadds.md). If you are having trouble deleting, contact the Azure Active Directory Domain Services product team [for support](active-directory-ds-contact-us.md).

### AADDS101: Azure B2C is enabled on the tenant
**Error message:**

*Azure AD Domain Services and Azure AD B2C cannot be run concurrently on the same tenant. To restore your Azure AD Domain Services instance, disable Azure AD B2C and reenable Azure AD DS.*

**Remediation:**

>[!NOTE]
>In order to continue to use Azure AD Domain Services, you must recreate your Azure AD Domain Services instance in a non-Azure AD B2C tenant.

To restore your service, follow these steps:

1. [Delete your managed domain](active-directory-ds-disable-aadds.md) from your existing Azure AD directory.
2. Create a new directory that is not an Azure AD B2C directory.
3. Follow our [Getting Started](active-directory-ds-getting-started.md) guide to recreate a managed domain.

### AADDS103: Address is in a public IP range

**Error message:**

*The IP address range for the virtual network %VIRTUAL_NETWORK% in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.*

**Remediation:**

> [!NOTE]
> To address this issue, you must delete your existing managed domain and re-create it in a virtual network with a private IP address range. This process is disruptive.

Before you begin, read the **private IP v4 address space** section in [this article](https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces).

1. [Delete your managed domain](active-directory-ds-disable-aadds.md) from your tenant.
2. Fix the IP address range for the subnet
  1. Navigate to the [Virtual Networks page on the Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_AAD_DomainServices=preview#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FvirtualNetworks).
  2. Select the virtual network you plan to use for Azure AD Domain Services.
  3. Click on **Address Space** under Settings
  4. Update the address range by clicking on the existing address range and editing it or adding an additional address range. Make sure the new address range is in a private IP range. Save your changes.
  5. Click on **Subnets** in the left-hand navigation.
  6. Click on the subnet you wish to edit in the table.
  7. Update the address range and save your changes.
3. Follow [the Getting Started Using Azure AD Domain Services guide](#active-directory-ds-getting-started.md) to recreate your managed domain. Ensure that you pick a virtual network with a private IP address range.
4. To domain-join your virtual machines to your new domain, follow [this guide](active-directory-ds-admin-guide-join-windows-vm-portal.md).
8. Check your domain's health in two hours to ensure that you have completed the steps correctly.


## Contact Us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
