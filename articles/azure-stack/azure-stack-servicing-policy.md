---
title: Azure Stack servicing policy | Microsoft Docs
description: Learn about the Azure Stack servicing policy, and how to keep an integrated system in a supported state.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: caac3d2f-11cc-4ff2-82d6-52b58fee4c39
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/03/2018
ms.author: mabrigg

---
# Azure Stack servicing policy
This article describes the servicing policy for Azure Stack integrated systems, and what you must do to keep your system in a supported state. 

## Update package types

There are two types of update packages for integrated systems; Microsoft software updates, and updates that are specific to your original equipment manufacturer (OEM) hardware vendor, such as drivers and firmware. These updates are delivered as separate Azure Stack update packages, and are independently managed.

- **Microsoft software updates**. Microsoft is responsible for the end-to-end servicing lifecycle for the Microsoft software update packages. These packages can include the latest Windows Server security updates, non-security updates, and Azure Stack feature updates. You can download theses update packages directly from Microsoft.
- **OEM hardware vendor-provided updates**. Azure Stack hardware partners are responsible for the end-to-end servicing lifecycle (including guidance) for the hardware-related firmware and driver update packages. In addition, Azure Stack hardware partners own and maintain guidance for all software and hardware on the hardware lifecycle host. The OEM hardware vendor hosts these update packages on their own download site.

## Update package release cadence

Microsoft expects to release software update packages on a monthly cadence. However, it’s possible to have multiple, or no update releases in a month. OEM hardware vendors release their updates on an as-needed basis.

A Microsoft update package has the following naming convention to help you easily identify the release date:

*MajorProductVersion.MinorProductVersion.YYMMDD.BuildNumber*

For example, a Microsoft software update released on June 15, 2017 would have the version "1.0.170615.1".

## Keep your system under support
To continue to receive support, you must keep your Azure Stack deployment current. The policy for deferral of updates is that for Azure Stack to remain in support, it must run the most recently released update version or run either of the two preceding major update versions.  Hotfixes are not considered major update versions.  If your Azure Stack cloud is behind by *more than two updates*, it is considered out of compliance and must update to at least the minimum supported version to receive support. 

For example, if the most recently available update version is 1805, and the previous two update packages were versions 1804 and 1803, both 1803 and 1804 remain in support. However, 1802 is out of support. The policy holds true when there is no release for a month or two. For example, if the current release is 1805 and there was no 1804 release, the previous two update packages of 1803 and 1802 would remain in support.

Microsoft software update packages are non-cumulative and require the previous update package as a prerequisite. If you decide to defer one or more updates, consider the overall runtime if you want to get  to the latest version. 


## Next steps

- [Manage updates in Azure Stack](azure-stack-updates.md)


