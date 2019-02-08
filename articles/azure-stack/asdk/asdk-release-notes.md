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
ms.date: 02/09/2019
ms.author: sethm
ms.reviewer: misainat
ms.lastreviewed: 02/09/2019

---

# ASDK release notes

This article provides information about changes, fixes, and known issues in the Azure Stack Development Kit (ASDK). If you're not sure which version you're running, you can [use the portal to check](../azure-stack-updates.md#determine-the-current-version).

Stay up-to-date with what's new in the ASDK by subscribing to the [![RSS](./media/asdk-release-notes/feed-icon-14x14.png)](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#) [feed](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#).

## Build 1.1901.0.95

### New features

This build includes the following improvements and fixes for Azure Stack:  

### Fixed issues

For a list of issues fixed in this release, please see [this section](../azure-stack-update-1901.md#fixed-issues).

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

This build includes the following improvements for Azure Stack:

- BGP and NAT components are now deployed on the physical host. This eliminates the need to have two public or corporate IP addresses for deploying the ASDK, and also simplifies deployment.
- Azure Stack integrated systems backups can now [be validated](asdk-validate-backup.md) using the **asdk-installer.ps1** PowerShell script.

### New features

<!-- 3190553 - IS ASDK -->
- Fixed an issue that generated noisy alerts indicating that an Infrastructure Role Instance was unavailable or Scale Unit Node was offline.
- For a list of new features in this release, see [this section](../azure-stack-update-1901.md#new-features) of the Azure Stack release notes.

### Fixed and known issues

- For a list of issues fixed in this release, see [this section](../azure-stack-update-1901.md#fixed-issues) of the Azure Stack release notes. For a list of known issues, see [this section](../azure-stack-update-1901.md#known-issues-post-installation).
- Note that [available Azure Stack hotfixes](../azure-stack-update-1901.md#azure-stack-hotfixes) are not applicable to the Azure Stack ASDK.

## Build 1.1811.0.101

### Changes

This build includes the following improvements for Azure Stack:  

- There is a set of new minimum and recommended hardware and software requirements for the ASDK. These new recommended specs are documented in [Azure Stack deployment planning considerations](asdk-deploy-considerations.md). As the Azure Stack platform has evolved, more services are now available and more resources may be required. The increased specs reflect these revised recommendations.

### New features

For a list of new features in this release, see [this section](../azure-stack-update-1811.md#new-features) of the Azure Stack release notes.

### Fixed and known issues

For a list of issues fixed in this release, see [this section](../azure-stack-update-1811.md#fixed-issues) of the Azure Stack release notes. For a list of known issues, see [this section](../azure-stack-update-1811.md#known-issues-post-installation).

## Build 1.1809.0.90

### New features

For a list of new features in this release, see [this section](../azure-stack-update-1809.md#new-features) of the Azure Stack release notes.

### Fixed issues

For a list of issues fixed in this release, see [this section](../azure-stack-update-1809.md#fixed-issues).

### Known issues

For a list of known issues in this release, see [this section](../azure-stack-update-1809.md#known-issues-post-installation).
