---
title: Overview of managed disk encryption options
description: Overview of managed disk encryption options
author: msmbaldwin
ms.date: 06/05/2021
ms.topic: conceptual
ms.author: mbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.custom: references_regions
---

# Overview of managed disk encryption options

By default, OS and data disks are encrypted-at-rest using platform-managed keys; temp disks and data caches are not encrypted by default, and data is not encrypted when flowing between Compute and Storage.

Azure Disk Encryption and encryption-at-host encrypt temp disks, disk caches, and data flows encrypted between Compute and Storage. Your VM is marked unhealthy because Azure Security Center does not detect Azure Disk Encryption is enabled.  

Azure Security Center does not have the ability to detect encryption-at-host on your VM.  

Use Azure Disk Encryption to encrypt OS, data disks, temp disks, disk caches and data flows between Compute and Storage with customer-managed keys. If you have encryption-at-host enabled, or server-side encryption on Managed Disks meets your security requirements, you can disregard this recommendation.

For more information on disk encryption options and remediation steps, see the table below or see the documentation here.

| | Encryption at rest (OS and data disks) | Temp disk encryption | Encryption of caches | Data flows encrypted between Compute and Storage | Customer control of keys | ASC disk encryption status |
|--|--|--|--|--|--|--|
| **Encryption at rest with platform-managed key (SSE+PMK)** | &#10004; | &#10060; | &#10060; | &#10060; | &#10060; | Unhealthy, not applicable if exempt |
| **Encryption at rest with customer-managed key (SSE+CMK)** | &#10004; | &#10060; | &#10060; | &#10060; | &#10004; | Unhealthy, not applicable if exempt |
| **Encryption at Host***  | &#10004; | &#10004; | &#10004; | &#10004; | &#10004; | Unhealthy, not applicable if exempt |
| **Azure Disk Encryption** | &#10004; | &#10004; | &#10004; | &#10004; | &#10004; | Healthy |

*For Encryption at Host, Azure Security Center does not detect the encryption state.