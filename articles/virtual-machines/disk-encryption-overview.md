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

There are several types of encryption available for your managed disks, including Azure Disk Encryption (ADE), Server-Side Encryption (SSE) and encryption at host.

- **Azure Disk Encryption** helps protect and safeguard your data to meet your organizational security and compliance commitments. ADE provides volume encryption for the OS and data disks of Azure virtual machines (VMs) through the use of feature of Linux or the [BitLocker](https://en.wikipedia.org/wiki/BitLocker) feature of Windows. ADE is integrated with Azure Key Vault to help you control and manage the disk encryption keys and secrets.  For full details, see [Azure Disk Encryption for Linux VMs](./linux/disk-encryption-overview.md) or [Azure Disk Encryption for Windows VMs](./windows/disk-encryption-overview.md).

- **Server-Side Encryption** (also referred to as encryption-at-rest or Azure Storage encryption) automatically encrypts data stored on Azure managed disks (OS and data disks) when persisting it to the cloud.  For full details, see [Server-side encryption of Azure Disk Storage](./disk-encryption.md).

- **Encryption at host** ensures that data stored on the VM host is encrypted at rest and flows encrypted to the Storage service. Disks with encryption at host enabled are not encrypted with SSE; instead, the server hosting your VM provides the encryption for your data, and that encrypted data flows into Azure Storage.For full details, see [Encryption at host - End-to-end encryption for your VM data](./disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).

## Comparison

Here is a comparison of SSE, ADE, and encryption at host.

| | Encryption at rest (OS and data disks) | Temp disk encryption | Encryption of caches | Data flows encrypted between Compute and Storage | Customer control of keys | Azure Security Center disk encryption status |
|--|--|--|--|--|--|--|
| **Encryption at rest with platform-managed key (SSE+PMK)** | &#x2705; | &#10060; | &#10060; | &#10060; | &#10060; | Unhealthy, not applicable if exempt |
| **Encryption at rest with customer-managed key (SSE+CMK)** | &#x2705; | &#10060; | &#10060; | &#10060; | &#x2705; | Unhealthy, not applicable if exempt |
| **Azure Disk Encryption** | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; | Healthy |
| **Encryption at Host**  | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; | Unhealthy, not applicable if exempt |

> [!Important]
> For Encryption at Host, Azure Security Center does not detect the encryption state.

## Next steps

- [Azure Disk Encryption for Linux VMs](./linux/disk-encryption-overview.md)
- [Azure Disk Encryption for Windows VMs](./windows/disk-encryption-overview.md)
- [Server-side encryption of Azure Disk Storage](./disk-encryption.md)
- [Encryption at host](./disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data)
- [Azure Security Fundamentals - Azure encryption overview](../security/fundamentals/encryption-overview.md)