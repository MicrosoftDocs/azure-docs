---
title: Microsoft Azure Stack Development Kit release notes | Microsoft Docs
description: Improvements, fixes, and known issues for Azure Stack Development Kit.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/11/2018 
ms.author: sethm
ms.reviewer: misainat
ms.lastreviewed: 12/21/2018

---

# ASDK release notes

This article provides information about improvements, fixes, and known issues in the Azure Stack Development Kit (ASDK). If you're not sure which version you're running, you can [use the portal to check](../azure-stack-updates.md#determine-the-current-version).

Stay up-to-date with what's new in the ASDK by subscribing to the [![RSS](./media/asdk-release-notes/feed-icon-14x14.png)](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#) [feed](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#).

## Build 1.1901.x.xx

### New features

This build includes the following improvements and fixes for Azure Stack:  

### Fixed issues

<<<<<<< HEAD
For a list of issues fixed in this release, please see [this section](../azure-stack-update-1901.md#fixed-issues).
=======
<!-- TBD - IS ASDK --> 
- Fixed an issue in which the public IP address usage meter data showed the same **EventDateTime** value for each record instead of the **TimeDate** stamp that shows when the record was created. You can now use this data to perform accurate accounting of public IP address usage.

<!-- 3099544 – IS, ASDK --> 
- Fixed an issue that occurred when creating a new virtual machine (VM) using the Azure Stack portal. Selecting the VM size caused the USD/Month column to display an **Unavailable** message. This column no longer appears; displaying the VM pricing column is not supported in Azure Stack.

<!-- 2930718 - IS ASDK --> 
- Fixed an issue in which the administrator portal, when accessing the details of any user subscription, after closing the blade and clicking on **Recent**, the user subscription name did not appear. The user subscription name now appears.

<!-- 3060156 - IS ASDK --> 
- Fixed an issue in both the administrator and user portals: clicking on the portal settings and selecting **Delete all settings and private dashboards** did not work as expected and an error notification was displayed. 

<!-- 2930799 - IS ASDK --> 
- Fixed an issue in both the administrator and user portals: under **All services**, the asset **DDoS protection plans** was incorrectly listed, while not available in Azure Stack.
 
<!--2760466 – IS  ASDK --> 
- Fixed an issue that occurred when you installed a new Azure Stack environment in which the alert that indicates **Activation Required** did not display. It now correctly displays.

<!--1236441 – IS  ASDK --> 
- Fixed an issue that prevented applying RBAC policies to a user group when using ADFS.

<!--3463840 - IS, ASDK --> 
- Fixed issue with infrastructure backups failing due to inaccessible file server from the public VIP network. This fix moves the infrastructure backup service back to the public infrastructure network. If you applied the  latest Azure Stack hotfix for 1809 that addresses this issue, the 1811 update will not make any further modifications. 

<!-- 2967387 – IS, ASDK --> 
- Fixed an issue in which the account you used to sign in to the Azure Stack admin or user portal displayed as **Unidentified user**. This message was displayed when the account did not have either a *First* or *Last* name specified.   

<!--  2873083 - IS ASDK --> 
- Fixed an issue in which using the portal to create a virtual machine scale set (VMSS), the *instance size* dropdown did not load correctly when using Internet Explorer. This browser now works correctly.  

<!-- 3190553 - IS ASDK -->
- Fixed an issue that generated noisy alerts indicating that an Infrastructure Role Instance was unavailable or Scale Unit Node was offline.
>>>>>>> e1c981740d07703a55c1035723cbb9a89e1eb643

### Known issues

For a list of known issues in this release, please see [this section](../azure-stack-update-1901.md#known-issues-post-installation).

## Build 1.1811.0.101

### New features

This build includes the following improvements and fixes for Azure Stack:  

- There is a set of new minimum and recommended hardware and software requirements for the ASDK. These new recommended specs are documented in [Azure Stack deployment planning considerations](asdk-deploy-considerations.md). As the Azure Stack platform has evolved, more services are now available and more resources may be required. The increased specs reflect these revised recommendations.

### Fixed issues

For a list of issues fixed in this release, please see [this section](../azure-stack-update-1811.md#fixed-issues).

### Known issues

For a list of known issues in this release, please see [this section](../azure-stack-update-1811.md#known-issues-post-installation).

## Build 1.1809.0.90

### New features

This build includes the following improvements and fixes for Azure Stack.  

<!--  2712869   | IS  ASDK -->  
- **Azure Stack syslog client (General Availability)**  This client allows the forwarding of audits, alerts, and security logs related to the Azure Stack infrastructure to a syslog server or security information and event management (SIEM) software external to Azure Stack. The syslog client now supports specifying the port on which the syslog server is listening.

With this release, the syslog client is generally available, and it can be used in production environments.

For more information, see [Azure Stack syslog forwarding](../azure-stack-integrate-security.md).

### Fixed issues

For a list of issues fixed in this release, please see [this section](../azure-stack-update-1809.md#fixed-issues).

### Known issues

For a list of known issues in this release, please see [this section](../azure-stack-update-1809.md#known-issues-post-installation).
