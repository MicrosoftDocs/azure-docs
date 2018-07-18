---
title: 'Azure Active Directory Domain Services: Suspended Domains | Microsoft Docs'
description: Managed domain suspension and deletion
services: active-directory-ds
documentationcenter: ''
author: eringreenlee
manager: mtillman
editor: curtand

ms.assetid: 95e1d8da-60c7-4fc1-987d-f48fde56a8cb
ms.service: active-directory
ms.component: domains
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/18/2018
ms.author: ergreenl

---
# Suspended domains
When Azure AD Domain Services is unable to service a managed domain for a long period of time, the managed domain is put into a suspended state. This article explains why managed domains are suspended, and how to remediate a suspended domain.


## States your managed domain can be in

![Suspended domain timeline](media\active-directory-domain-services-suspension\suspension-timeline.PNG)

The preceding graphic outlines the possible states an Azure AD Domain Services managed domain can be in.

### 'Running' state
A managed domain that is configured correctly and operating regularly is in the **Running** state.

**What you can expect:**
* Microsoft can regularly monitor the health of your managed domain.
* Domain controllers for your managed domain are patched and updated regularly.
* Changes from Azure Active Directory are regularly synchronized to your managed domain.
* Regular backups are taken for your managed domain.


### 'Needs Attention' state
A managed domain is in the **Needs Attention** state, if one or more issues require an administrator to take action. The health page of your managed domain will list one or more alerts in this state. For example, if you've configured a restrictive NSG for your virtual network, Microsoft may be unable to update and monitor your managed domain. This invalid configuration results in an alert being generated and your managed domain is put in the 'Needs Attention' state.

Each alert has a set of resolution steps. Some alerts are transient and will get automatically resolved by the service. You can resolve some other alerts by following the instructions in the corresponding resolution steps for that alert. To resolve some critical alerts, you need to contact Microsoft support.

For more information, see [how to troubleshoot alerts on a managed domain](active-directory-ds-troubleshoot-alerts.md).

**What you can expect:**

In some instances (for example, if you have an invalid network configuration), the domain controllers for your managed domain may be unreachable. Microsoft can't guarantee your managed domain is monitored, patched, updated, or backed-up on a regular basis in this state.

* Your managed domain is in an unhealthy state and ongoing health monitoring may stop, until the alert is resolved.
* Domain controllers for your managed domain may not be patched or updated.
* Changes from Azure Active Directory may not be synchronized to your managed domain.
* Backups for your managed domain may be taken, if possible.
* If you resolve the alerts impacting your managed domain, it may be possible to restore your managed domain to the 'Running' state.
* Critical alerts are triggered for configuration issues where Microsoft is unable to reach your domain controllers. If such alerts aren't resolved within 15 days, your managed domain will be put in the 'Suspended' state.


### 'Suspended' state
A managed domain is put in the **Suspended** state for the following reasons:
* One or more critical alerts haven't been resolved in 15 days. Critical alerts can be caused by a misconfiguration that blocks access to resources needed by Azure AD Domain Services.
    * For example, if the managed domain has alert [AADDS104: Network Error](active-directory-ds-troubleshoot-nsg.md) unresolved for over 15 days.
* There's a billing issue with your Azure subscription or your Azure subscription has expired.

Managed domains are suspended when Microsoft is unable to manage, monitor, patch, or backup the domain on an ongoing basis.

**What you can expect:**
* Domain controllers for your managed domain are de-provisioned and aren't reachable within the virtual network.
* Secure LDAP access to the managed domain over the internet (if enabled) stops working.
* You notice failures in authenticating to the managed domain, logging on to domain joined virtual machines, and connecting over LDAP/LDAPS.
* Backups for your managed domain are no longer taken.
* Synchronization with Azure AD stops.
* Resolve the alert causing your managed domain to be in the 'Suspended' state and then contact support.
* Support may restore your managed domain, only if a backup that is less than 30 days old exists.

The managed domain will only stay in a suspended state for 15 days. To recover your managed domain, Microsoft recommends you resolve critical alerts immediately.


### 'Deleted' state
A managed domain that stays in the 'Suspended' state for 15 days is **Deleted**.

**What you can expect:**
* All resources and backups for the managed domain are deleted.
* You can't restore the managed domain and need to create a new managed domain to use Azure AD Domain Services.
* Once deleted, you aren't billed for the managed domain.


## How do you know if your managed domain is suspended?
You see an [alert](active-directory-ds-troubleshoot-alerts.md) on the Azure AD Domain Services Health page in the Azure portal that declares the domain suspended. The state of the domain also shows "Suspended".


## Restore a suspended domain
To restore a domain in the 'Suspended' state, complete the following steps:

1. Navigate to the [Azure AD Domain Services page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.AAD%2FdomainServices) on the Azure portal
2. Click on the managed domain.
3. On the left-hand navigation, click **Health**.
4. Click on the alert. The alert ID will be either AADDS503 or AADDS504, depending on the cause of suspension.
5. Click on the resolution link provided in the alert and follow the steps to resolve the alert.

Your managed domain can only be restored to the date of last backup. The date of your last backup is displayed on the Health page of your managed domain. Any changes that occurred after the last backup won't be restored. Backups for a managed domain are stored for up to 30 days. Backups older than 30 days are deleted.


## Next steps
- [Resolve alerts on your managed domain](active-directory-ds-troubleshoot-alerts.md)
- [Read more about Azure AD Domain Services](active-directory-ds-overview.md)
- [Contact the product team](active-directory-ds-contact-us.md)

## Contact Us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
