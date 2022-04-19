---
title: Overview of managed disk encryption options
description: Overview of managed disk encryption options
author: msmbaldwin
ms.date: 02/14/2022
ms.topic: conceptual
ms.author: mbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.custom: references_regions
---

# Overview of managed disk encryption options

There are several types of encryption available for your managed disks, including Azure Disk Encryption (ADE), Server-Side Encryption (SSE) and encryption at host.

- **Azure Disk Encryption** helps protect and safeguard your data to meet your organizational security and compliance commitments. ADE encrypts the OS and data disks of Azure virtual machines (VMs) inside your VMs using the CPU of your VMs through the use of feature [DM-Crypt](https://wikipedia.org/wiki/Dm-crypt) of Linux or the [BitLocker](https://wikipedia.org/wiki/BitLocker) feature of Windows. ADE is integrated with Azure Key Vault to help you control and manage the disk encryption keys and secrets.  For full details, see [Azure Disk Encryption for Linux VMs](./linux/disk-encryption-overview.md) or [Azure Disk Encryption for Windows VMs](./windows/disk-encryption-overview.md).

- **Server-Side Encryption** (also referred to as encryption-at-rest or Azure Storage encryption) automatically encrypts data stored on Azure managed disks (OS and data disks) when persisting on the Storage Clusters.  For full details, see [Server-side encryption of Azure Disk Storage](./disk-encryption.md).

- **Encryption at host** ensures that data stored on the VM host hosting your VM is encrypted at rest and flows encrypted to the Storage clusters. For full details, see [Encryption at host - End-to-end encryption for your VM data](./disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).

Encryption is part of a layered approach to security and should be used with other recommendations to secure Virtual Machines and their disks. For full details, see [Security recommendations for virtual machines in Azure](security-recommendations.md) and [Restrict import/export access to managed disks](disks-enable-private-links-for-import-export-portal.md).

## Comparison

Here is a comparison of SSE, ADE, and encryption at host.

| | Encryption at rest (OS and data disks) | Temp disk encryption | Encryption of caches | Data flows encrypted between Compute and Storage | Customer control of keys | Does not use your VM's CPU | Works for custom images | Microsoft Defender for Cloud disk encryption status |
|--|--|--|--|--|--|--|--|--|
| **Encryption at rest with platform-managed key (SSE+PMK)** | &#x2705; | &#10060; | &#10060; | &#10060; | &#10060; | &#x2705; | &#x2705; | Unhealthy, not applicable if exempt |
| **Encryption at rest with customer-managed key (SSE+CMK)** | &#x2705; | &#10060; | &#10060; | &#10060; | &#x2705; | &#x2705; | &#x2705; | Unhealthy, not applicable if exempt |
| **Azure Disk Encryption** | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |&#10060; | &#10060; Does not work for custom Linux images | Healthy |
| **Encryption at Host**  | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; | Unhealthy, not applicable if exempt |

> [!Important]
> For Encryption at Host, Microsoft Defender for Cloud does not detect the encryption state. We are in the process of updating Microsoft Defender

## Next steps

- [Azure Disk Encryption for Linux VMs](./linux/disk-encryption-overview.md)
- [Azure Disk Encryption for Windows VMs](./windows/disk-encryption-overview.md)
- [Server-side encryption of Azure Disk Storage](./disk-encryption.md)
- [Encryption at host](./disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data)
- [Azure Security Fundamentals - Azure encryption overview](../security/fundamentals/encryption-overview.md)
