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

For a list of issues fixed in this release, please see [this section](../azure-stack-update-1901.md#fixed-issues).

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
