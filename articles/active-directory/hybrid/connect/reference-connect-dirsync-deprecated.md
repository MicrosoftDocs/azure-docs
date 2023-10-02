---
title: Upgrade from DirSync and Azure AD Sync
description: Describes how to upgrade from DirSync and Azure AD Sync to Microsoft Entra Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.assetid: bd68fb88-110b-4d76-978a-233e15590803
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: reference
ms.date: 01/27/2023
ms.subservice: hybrid
ms.author: billmath
ms.custom: H1Hack27Feb2017
ms.collection: M365-identity-device-management
---

# Upgrade Windows Azure Active Directory Sync and Azure Active Directory Sync
Microsoft Entra Connect is the best way to connect your on-premises directory with Microsoft Entra ID and Microsoft 365. This is a great time to upgrade to Microsoft Entra Connect from Windows Azure Active Directory Sync (DirSync) or Azure AD Sync (AADSync) as these tools are now deprecated and don't work anymore.

The two identity synchronization tools that are deprecated were offered for single forest customers (DirSync) and for multi-forest and other advanced customers (Azure AD Sync). These older tools have been replaced with a single solution that is available for all scenarios: Microsoft Entra Connect. It offers new functionality, feature enhancements, and support for new scenarios. To be able to continue to synchronize your on-premises identity data to Microsoft Entra ID and Microsoft 365, you must upgrade to Microsoft Entra Connect. 

The last release of DirSync was released in July 2014 and the last release of Azure AD Sync was released in May 2015.

<a name='what-is-azure-ad-connect'></a>

## What is Microsoft Entra Connect
Microsoft Entra Connect is the successor to DirSync and Azure AD Sync. It combines all scenarios these two supported. You can read more about it in [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).

## Deprecation schedule
| Date | Comment |
| --- | --- |
| April 13, 2016 |Windows Azure Active Directory Sync (“DirSync”) and Microsoft Azure Active Directory Sync (“Azure AD Sync”) are announced as deprecated. |
| April 13, 2017 |Support ends. Customers will no longer be able to open a support case without upgrading to Microsoft Entra Connect first. |
|December 31, 2017|Microsoft Entra ID may no longer accept communications from Windows Azure Active Directory Sync ("DirSync") and Microsoft Azure Active Directory Sync ("Azure AD Sync").
|April 1st, 2021| Windows Azure Active Directory Sync ("DirSync") and Microsoft Azure Active Directory Sync ("Azure AD Sync") do no longer work |

<a name='how-to-transition-to-azure-ad-connect'></a>

## How to transition to Microsoft Entra Connect
If you're running DirSync, there are two ways you can upgrade: In-place upgrade and parallel deployment. An in-place upgrade is recommended for most customers and if you have a recent operating system and less than 50,000 objects. In other cases, it's recommended to do a parallel deployment where your DirSync configuration is moved to a new server running Microsoft Entra Connect.

| Solution | Scenario |
| --- | --- |
| [Upgrade from DirSync](how-to-dirsync-upgrade-get-started.md) |<li>If you have an existing DirSync server already running.</li> |
| [Upgrade from Azure AD Sync](how-to-upgrade-previous-version.md) |<li>If you're moving from Azure AD Sync.</li> |


## FAQ
**Q: I have received an email notification from the Azure Team and/or a message from the Microsoft 365 message center, but I am using Connect.**  
The notification was also sent to customers using Microsoft Entra Connect with a build number 1.0.\*.0 (using a pre-1.1 release). Microsoft recommends customers to stay current with Microsoft Entra Connect releases. The [automatic upgrade](how-to-connect-install-automatic-upgrade.md) feature introduced in 1.1 makes it easy to always have a recent version of Microsoft Entra Connect installed.

**Q: Will DirSync/Azure AD Sync stop working on April 13, 2017?**  
DirSync/Azure AD Sync will continue to work on April 13, 2017.  However, Microsoft Entra ID may no longer accept communications from DirSync/Azure AD Sync after December 31, 2017. Dirsync and Azure AD Sync will no longer work after April 1st, 2021

**Q: Which DirSync versions can I upgrade from?**  
It's supported to upgrade from any DirSync release currently being used. 

**Q: What about the Microsoft Entra Connector for FIM/MIM?**  
The Microsoft Entra Connector for FIM/MIM has **not** been announced as deprecated. It's at **feature freeze**; no new functionality is added and it receives no bug fixes. Microsoft recommends customers using it to plan to move from it to Microsoft Entra Connect. It's strongly recommended to not start any new deployments using it. This Connector will be announced deprecated in the future.

## Additional Resources
* [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md)
