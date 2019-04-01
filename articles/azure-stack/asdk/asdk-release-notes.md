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
ms.date: 03/18/2019
ms.author: sethm
ms.reviewer: misainat
ms.lastreviewed: 03/18/2019

---

# ASDK release notes

This article provides information about changes, fixes, and known issues in the Azure Stack Development Kit (ASDK). If you're not sure which version you're running, you can [use the portal to check](../azure-stack-updates.md#determine-the-current-version).

Stay up-to-date with what's new in the ASDK by subscribing to the [![RSS](./media/asdk-release-notes/feed-icon-14x14.png)](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#) [feed](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#).

## Build 1.1902.0.69

### New features

- The 1902 build introduces a new user interface on the Azure Stack Administrator portal for creating plans, offers, quotas, and add-on plans. For more information, including screenshots, see [Create plans, offers, and quotas](../azure-stack-create-plan.md).

- For a list of other changes and improvements in this release, see [this section](../azure-stack-update-1902.md#improvements) in the Azure Stack release notes.

<!-- ### New features

- For a list of new features in this release, see [this section](../azure-stack-update-1902.md#new-features) of the Azure Stack release notes.

### Fixed and known issues

- For a list of issues fixed in this release, see [this section](../azure-stack-update-1902.md#fixed-issues) of the Azure Stack release notes. For a list of known issues, see [this section](../azure-stack-update-1902.md#known-issues-post-installation).
- Note that [available Azure Stack hotfixes](../azure-stack-update-1902.md#azure-stack-hotfixes) are not applicable to the Azure Stack ASDK. -->

### Known issues

- An issue has been identified in which packets over 1450 bytes to an Internal Load Balancer (ILB) are dropped. The issue is due to the MTU setting on the host being too low to accommodate VXLAN encapsulated packets that traverse the role, which as of 1901 has been moved to the host. There are at least two scenarios that you might encounter in which we have seen this issue manifest itself:

  - SQL queries to SQL Always-On that is behind an Internal Load Balancer (ILB), and are over 660 bytes.
  - Kubernetes deployments fail if you attempt to enable multiple masters.  

  The issue occurs when you have communication between a VM and an ILB in the same virtual network but on different subnets. You can work around this issue by running the following commands in an elevated command prompt on the ASDK host:

  ```shell
  netsh interface ipv4 set sub "hostnic" mtu=1660
  netsh interface ipv4 set sub "management" mtu=1660
  ```

## Build 1.1901.0.95

See the [important build information in the Azure Stack release notes](../azure-stack-update-1901.md#build-reference).

### Changes

This build includes the following improvements for Azure Stack:

- BGP and NAT components are now deployed on the physical host. This eliminates the need to have two public or corporate IP addresses for deploying the ASDK, and also simplifies deployment.
- Azure Stack integrated systems backups can now [be validated](asdk-validate-backup.md) using the **asdk-installer.ps1** PowerShell script.

### New features

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
