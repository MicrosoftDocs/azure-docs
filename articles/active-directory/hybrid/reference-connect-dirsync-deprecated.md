---
title: Upgrade from DirSync and Azure AD Sync | Microsoft Docs
description: Describes how to upgrade from DirSync and Azure AD Sync to Azure AD Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''

ms.assetid: bd68fb88-110b-4d76-978a-233e15590803
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 07/13/2017
ms.subservice: hybrid
ms.author: billmath
ms.custom: H1Hack27Feb2017
ms.collection: M365-identity-device-management
---

# Upgrade Windows Azure Active Directory Sync and Azure Active Directory Sync
Azure AD Connect is the best way to connect your on-premises directory with Azure AD and Office 365. This is a great time to upgrade to Azure AD Connect from Windows Azure Active Directory Sync (DirSync) or Azure AD Sync as these tools are now deprecated and are no longer supported as of April 13, 2017.

The two identity synchronization tools that are deprecated were offered for single forest customers (DirSync) and for multi-forest and other advanced customers (Azure AD Sync). These older tools have been replaced with a single solution that is available for all scenarios: Azure AD Connect. It offers new functionality, feature enhancements, and support for new scenarios. To be able to continue to synchronize your on-premises identity data to Azure AD and Office 365, we strongly recommend that you upgrade to Azure AD Connect. Microsoft does not guarantee these older versions to work after December 31, 2017.

The last release of DirSync was released in July 2014 and the last release of Azure AD Sync was released in May 2015.

## What is Azure AD Connect
Azure AD Connect is the successor to DirSync and Azure AD Sync. It combines all scenarios these two supported. You can read more about it in [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).

## Deprecation schedule
| Date | Comment |
| --- | --- |
| April 13, 2016 |Windows Azure Active Directory Sync (“DirSync”) and Microsoft Azure Active Directory Sync (“Azure AD Sync”) are announced as deprecated. |
| April 13, 2017 |Support ends. Customers will no longer be able to open a support case without upgrading to Azure AD Connect first. |
|December 31, 2017|Azure AD may no longer accept communications from Windows Azure Active Directory Sync ("DirSync") and Microsoft Azure Active Directory Sync ("Azure AD Sync").

## How to transition to Azure AD Connect
If you are running DirSync, there are two ways you can upgrade: In-place upgrade and parallel deployment. An in-place upgrade is recommended for most customers and if you have a recent operating system and less than 50,000 objects. In other cases, it is recommended to do a parallel deployment where your DirSync configuration is moved to a new server running Azure AD Connect.

| Solution | Scenario |
| --- | --- |
| [Upgrade from DirSync](how-to-dirsync-upgrade-get-started.md) |<li>If you have an existing DirSync server already running.</li> |
| [Upgrade from Azure AD Sync](how-to-upgrade-previous-version.md) |<li>If you are moving from Azure AD Sync.</li> |

If you want to see how to do an in-place upgrade from DirSync to Azure AD Connect, then see this Channel 9 video:

> [!VIDEO https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Azure-Active-Directory-Connect-in-place-upgrade-from-legacy-tools/player]
>
>

## FAQ
**Q: I have received an email notification from the Azure Team and/or a message from the Office 365 message center, but I am using Connect.**  
The notification was also sent to customers using Azure AD Connect with a build number 1.0.\*.0 (using a pre-1.1 release). Microsoft recommends customers to stay current with Azure AD Connect releases. The [automatic upgrade](how-to-connect-install-automatic-upgrade.md) feature introduced in 1.1 makes it easy to always have a recent version of Azure AD Connect installed.

**Q: Will DirSync/Azure AD Sync stop working on April 13, 2017?**  
DirSync/Azure AD Sync will continue to work on April 13, 2017.  However, Azure AD may no longer accept communications from DirSync/Azure AD Sync after December 31, 2017.

**Q: Which DirSync versions can I upgrade from?**  
It is supported to upgrade from any DirSync release currently being used. 

**Q: What about the Azure AD Connector for FIM/MIM?**  
The Azure AD Connector for FIM/MIM has **not** been announced as deprecated. It is at **feature freeze**; no new functionality is added and it receives no bug fixes. Microsoft recommends customers using it to plan to move from it to Azure AD Connect. It is strongly recommended to not start any new deployments using it. This Connector will be announced deprecated in the future.

## Additional Resources
* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md)
