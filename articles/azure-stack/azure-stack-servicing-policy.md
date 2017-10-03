---
title: Azure Stack servicing policy | Microsoft Docs
description: Learn about the Azure Stack servicing policy, and how to keep an integrated system in a supported state.
services: azure-stack
documentationcenter: ''
author: twooley
manager: byronr
editor: ''

ms.assetid: caac3d2f-11cc-4ff2-82d6-52b58fee4c39
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: twooley

---
# Azure Stack servicing policy

*Applies to: Azure Stack integrated systems*

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

To receive support for your system, you must keep your Azure Stack updated within a specific time interval. Our policy for deferral of Microsoft software updates is three months. If your system is more than three months out of date, you’re considered out of compliance. You must update the system to at least the minimum supported version to receive support. 

Microsoft software update packages are non-cumulative, and require the previous update package as a prerequisite. If you decide to defer one or more updates, consider the overall runtime if you want to get to the latest version.

The following table shows example update package releases, their prerequisite, and the minimum supported version that your system must be at to maintain support. The table is based on the initial release of Azure Stack integrated systems (build 1708), with the first update package release (1709) in September 2017. 

| Latest Update Package (*example*) | Prerequisite | Minimum Supported Version |
| -- | -- | -- |
| 1709 | Build 1708 | N/A |
| 1710 | 1709 | N/A |
| 1711 | 1710 | N/A |
| 1712 | 1711 | 1709 |
| 1801 | 1712 | 1710 |
| 1802 | 1801 | 1711 |
| 1803 | 1802 | 1712 |
| 1804 | 1803 | 1801 |
| | | 

## Next steps

- [Manage updates in Azure Stack](azure-stack-updates.md)


