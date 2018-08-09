---
title: 'Azure Active Directory Domain Services: Troubleshoot alerts | Microsoft Docs'
description: Troubleshoot alerts for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: eringreenlee
manager:
editor:

ms.assetid: 54319292-6aa0-4a08-846b-e3c53ecca483
ms.service: active-directory
ms.component: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/28/2018
ms.author: ergreenl

---
# Azure AD Domain Services - Troubleshoot alerts
This article provides troubleshooting guides for any alerts you may experience on your managed domain.


Pick the troubleshooting steps that correspond to the ID or message in the alert.

| **Alert ID** | **Alert Message** | **Resolution** |
| --- | --- | :--- |
| AADDS001 | *Secure LDAP over the internet is enabled for the managed domain. However, access to port 636 is not locked down using a network security group. This may expose user accounts on the managed domain to password brute-force attacks.* | [Incorrect secure LDAP configuration](active-directory-ds-troubleshoot-ldaps.md) |
| AADDS100 | *The Azure AD directory associated with your managed domain may have been deleted. The managed domain is no longer in a supported configuration. Microsoft cannot monitor, manage, patch, and synchronize your managed domain.* | [Missing directory](#aadds100-missing-directory) |
| AADDS101 | *Azure AD Domain Services cannot be enabled in an Azure AD B2C Directory.* | [Azure AD B2C is running in this directory](#aadds101-azure-ad-b2c-is-running-in-this-directory) |
| AADDS102 | *A Service Principal required for Azure AD Domain Services to function properly has been deleted from your Azure AD directory. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.* | [Missing Service Principal](active-directory-ds-troubleshoot-service-principals.md) |
| AADDS103 | *The IP address range for the virtual network in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch and synchronize your managed domain.* | [Address is in a public IP range](#aadds103-address-is-in-a-public-ip-range) |
| AADDS104 | *Microsoft is unable to reach the domain controllers for this managed domain. This may happen if a network security group (NSG) configured on your virtual network blocks access to the managed domain. Another possible reason is if there is a user defined route that blocks incoming traffic from the internet.* | [Network Error](active-directory-ds-troubleshoot-nsg.md) |
| AADDS105 | *The service principal with the application ID “d87dcbc6-a371-462e-88e3-28ad15ec4e64” was deleted and then recreated. The recreation leaves behind inconsistent permissions on Azure AD Domain Services resources needed to service your managed domain. Synchronization of passwords on your managed domain could be affected.* | [The password synchronization application is out of date](active-directory-ds-troubleshoot-service-principals.md#alert-aadds105-password-synchronization-application-is-out-of-date) |
| AADDS500 | *The managed domain was last synchronized with Azure AD on [date]. Users may be unable to sign-in on the managed domain or group memberships may not be in sync with Azure AD.* | [Synchronization hasn't happened in a while](#aadds500-synchronization-has-not-completed-in-a-while) |
| AADDS501 | *The managed domain was last backed up on [date].* | [A backup hasn't been taken in a while](#aadds501-a-backup-has-not-been-taken-in-a-while) |
| AADDS502 | *The secure LDAP certificate for the managed domain will expire on [date]].* | [Expiring secure LDAP certificate](active-directory-ds-troubleshoot-ldaps.md#aadds502-secure-ldap-certificate-expiring) |
| AADDS503 | *The managed domain is suspended because the Azure subscription associated with the domain is not active.* | [Suspension due to disabled subscription](#aadds503-suspension-due-to-disabled-subscription) |
| AADDS504 | *The managed domain is suspended due to an invalid configuration. The service has been unable to manage, patch, or update the domain controllers for your managed domain for a long time.* | [Suspension due to an invalid configuration](#aadds504-suspension-due-to-an-invalid-configuration) |


## AADDS100: Missing directory
**Alert message:**

*The Azure AD directory associated with your managed domain may have been deleted. The managed domain is no longer in a supported configuration. Microsoft cannot monitor, manage, patch, and synchronize your managed domain.*

**Resolution:**

This error is usually caused by incorrectly moving your Azure subscription to a new Azure AD directory and deleting the old Azure AD directory that is still associated with Azure AD Domain Services.

This error is unrecoverable. To resolve, you must [delete your existing managed domain](active-directory-ds-disable-aadds.md) and recreate it in your new directory. If you are having trouble deleting, contact the Azure Active Directory Domain Services product team [for support](active-directory-ds-contact-us.md).

## AADDS101: Azure AD B2C is running in this directory
**Alert message:**

*Azure AD Domain Services cannot be enabled in an Azure AD B2C Directory.*

**Resolution:**

>[!NOTE]
>In order to continue to use Azure AD Domain Services, you must recreate your Azure AD Domain Services instance in a non-Azure AD B2C directory.

To restore your service, follow these steps:

1. [Delete your managed domain](active-directory-ds-disable-aadds.md) from your existing Azure AD directory.
2. Create a new directory that is not an Azure AD B2C directory.
3. Follow the [Getting Started](active-directory-ds-getting-started.md) guide to recreate a managed domain.

## AADDS103: Address is in a public IP range

**Alert message:**

*The IP address range for the virtual network in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch and synchronize your managed domain.*

**Resolution:**

> [!NOTE]
> To address this issue, you must delete your existing managed domain and re-create it in a virtual network with a private IP address range. This process is disruptive.

Before you begin, read the **private IP v4 address space** section in [this article](https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces).

Inside the virtual network, machines may make requests to Azure resources that are in the same IP address range as those configured for the subnet. However, since the virtual network is configured for this range, those requests will be routed within the virtual network and will not reach the intended web resources. This configuration can lead to unpredictable errors with Azure AD Domain Services.

**If you own the IP address range in the internet that is configured in your virtual network, this alert can be ignored. However, Azure AD Domain Services cannot commit to the [SLA](https://azure.microsoft.com/support/legal/sla/active-directory-ds/v1_0/)] with this configuration since it can lead to unpredictable errors.**


1. [Delete your managed domain](active-directory-ds-disable-aadds.md) from your directory.
2. Fix the IP address range for the subnet
  1. Navigate to the [Virtual Networks page on the Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_AAD_DomainServices=preview#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FvirtualNetworks).
  2. Select the virtual network you plan to use for Azure AD Domain Services.
  3. Click on **Address Space** under Settings
  4. Update the address range by clicking on the existing address range and editing it or adding an additional address range. Make sure the new address range is in a private IP range. Save your changes.
  5. Click on **Subnets** in the left-hand navigation.
  6. Click on the subnet you wish to edit in the table.
  7. Update the address range and save your changes.
3. Follow [the Getting Started Using Azure AD Domain Services guide](active-directory-ds-getting-started.md) to recreate your managed domain. Ensure that you pick a virtual network with a private IP address range.
4. To domain-join your virtual machines to your new domain, follow [this guide](active-directory-ds-admin-guide-join-windows-vm-portal.md).
8. To ensure the alert is resolved, check your domain's health in two hours.

## AADDS500: Synchronization has not completed in a while

**Alert message:**

*The managed domain was last synchronized with Azure AD on [date]. Users may be unable to sign-in on the managed domain or group memberships may not be in sync with Azure AD.*

**Resolution:**

[Check your domain's health](active-directory-ds-check-health.md) for any alerts that might indicate problems in your configuration of your managed domain. Sometimes, problems with your configuration can block Microsoft's ability to synchronize your managed domain. If you are able to resolve any alerts, wait two hours and check back to see if the synchronization has completed.

Here are some common reasons why synchronization stops on managed domains:
- Network connection is blocked on the managed domain. To learn more about checking your network for problems, read how to [troubleshoot Network Security Groups](active-directory-ds-troubleshoot-nsg.md) and [network requirements for Azure AD Domain Services](active-directory-ds-networking.md).
-  Password synchronization was never set up or completed. To set up password synchronization, read [this article](active-directory-ds-getting-started-password-sync.md).

## AADDS501: A backup has not been taken in a while

**Alert message:**

*The managed domain was last backed up on [date].*

**Resolution:**

[Check your domain's health](active-directory-ds-check-health.md) for any alerts that might indicate problems in your configuration of your managed domain. Sometimes, problems with your configuration can block Microsoft's ability to synchronize your managed domain. If you are able to resolve any alerts, wait two hours and check back to see if the synchronization has completed.


## AADDS503: Suspension due to disabled subscription

**Alert message:**

*The managed domain is suspended because the Azure subscription associated with the domain is not active.*

**Resolution:**

> [!WARNING]
> If your managed domain is suspended for an extended period of time, it is in danger of being deleted. It is best to address the suspension as quickly as possible. To read more, visit [this article](active-directory-ds-suspension.md).

To restore your service, [renew your Azure subscription](https://docs.microsoft.com/azure/billing/billing-subscription-become-disable) associated with your managed domain.

## AADDS504: Suspension due to an invalid configuration

**Alert message:**

*The managed domain is suspended due to an invalid configuration. The service has been unable to manage, patch, or update the domain controllers for your managed domain for a long time.*

**Resolution:**

> [!WARNING]
> If your managed domain is suspended for an extended period of time, it is in danger of being deleted. It is best to address the suspension as quickly as possible. To read more, visit [this article](active-directory-ds-suspension.md).

[Check your domain's health](active-directory-ds-check-health.md) for any alerts that might indicate problems in your configuration of your managed domain. If you can resolve any of these alerts, do so. After, contact support to re-enable your subscription.


## Contact us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
