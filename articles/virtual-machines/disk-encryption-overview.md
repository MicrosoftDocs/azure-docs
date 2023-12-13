---
title: Overview of managed disk encryption options
description: Overview of managed disk encryption options
author: msmbaldwin
ms.date: 05/15/2023
ms.topic: conceptual
ms.author: mbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.custom: references_regions
---

# Overview of managed disk encryption options

There are several types of encryption available for your managed disks, including Azure Disk Encryption (ADE), Server-Side Encryption (SSE) and encryption at host.

- **Azure Disk Storage Server-Side Encryption** (also referred to as encryption-at-rest or Azure Storage encryption) is always enabled and automatically encrypts data stored on Azure managed disks (OS and data disks) when persisting on the Storage Clusters. When configured with a Disk Encryption Set (DES), it supports customer-managed keys as well. It doesn't encrypt temp disks or disk caches. For full details, see [Server-side encryption of Azure Disk Storage](./disk-encryption.md).

- **Encryption at host** is a Virtual Machine option that enhances Azure Disk Storage Server-Side Encryption to ensure that all temp disks and disk caches are encrypted at rest and flow encrypted to the Storage clusters. For full details, see [Encryption at host - End-to-end encryption for your VM data](./disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).

- **Azure Disk Encryption** helps protect and safeguard your data to meet your organizational security and compliance commitments. ADE encrypts the OS and data disks of Azure virtual machines (VMs) inside your VMs by using the [DM-Crypt](https://wikipedia.org/wiki/Dm-crypt) feature of Linux or the [BitLocker](https://wikipedia.org/wiki/BitLocker) feature of Windows. ADE is integrated with Azure Key Vault to help you control and manage the disk encryption keys and secrets, with the option to encrypt with a key encryption key (KEK).  For full details, see [Azure Disk Encryption for Linux VMs](./linux/disk-encryption-overview.md) or [Azure Disk Encryption for Windows VMs](./windows/disk-encryption-overview.md).

- **Confidential disk encryption** binds disk encryption keys to the virtual machine's TPM and makes the protected disk content accessible only to the VM. The TPM and VM guest state is always encrypted in attested code using keys released by a secure protocol that bypasses the hypervisor and host operating system. Currently only available for the OS disk. Encryption at host may be used for other disks on a Confidential VM in addition to Confidential Disk Encryption. For full details, see [DCasv5 and ECasv5 series confidential VMs](../confidential-computing/confidential-vm-overview.md#confidential-os-disk-encryption).

Encryption is part of a layered approach to security and should be used with other recommendations to secure Virtual Machines and their disks. For full details, see [Security recommendations for virtual machines in Azure](security-recommendations.md) and [Restrict import/export access to managed disks](disks-enable-private-links-for-import-export-portal.md).

## Comparison

Here's a comparison of Disk Storage SSE, ADE, encryption at host, and Confidential disk encryption.

| &nbsp; | **Azure Disk Storage Server-Side Encryption** | **Encryption at Host**  | **Azure Disk Encryption** | **Confidential disk encryption (For the OS disk only)** |
|--|--|--|--|--|
| Encryption at rest (OS and data disks) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | 
| Temp disk encryption | &#10060; | &#x2705; | &#x2705; | &#10060; |
| Encryption of caches | &#10060; | &#x2705; | &#x2705; | &#x2705; |
| Data flows encrypted between Compute and Storage | &#10060; | &#x2705; | &#x2705; | &#x2705; |
| Customer control of keys | &#x2705; When configured with DES | &#x2705; When configured with DES | &#x2705; When configured with KEK | &#x2705; When configured with DES |
| HSM Support | Azure Key Vault Premium and Managed HSM | Azure Key Vault Premium and Managed HSM | Azure Key Vault Premium | Azure Key Vault Premium and Managed HSM |
| Does not use your VM's CPU | &#x2705; | &#x2705; | &#10060; | &#10060; |
| Works for custom images | &#x2705; | &#x2705; | &#10060; Does not work for custom Linux images | &#x2705; |
| Enhanced Key Protection | &#10060; | &#10060; | &#10060; | &#x2705; |
| Microsoft Defender for Cloud disk encryption status* | Unhealthy | Healthy | Healthy | Not applicable |

> [!IMPORTANT]
> For Confidential disk encryption, Microsoft Defender for Cloud does not currently have a recommendation that is applicable.

\* Microsoft Defender for Cloud has the following disk encryption recommendations:
* [Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0961003e-5a0a-4549-abde-af6a37f2724d) (Only detects Azure Disk Encryption)
* [\[Preview\]: Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f3dc5edcd-002d-444c-b216-e123bbfa37c0) (Detects both Azure Disk Encryption and EncryptionAtHost)
* [\[Preview\]: Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fca88aadc-6e2b-416c-9de2-5a0f01d1693f) (Detects both Azure Disk Encryption and EncryptionAtHost)


## Next steps

- [Azure Disk Encryption for Linux VMs](./linux/disk-encryption-overview.md)
- [Azure Disk Encryption for Windows VMs](./windows/disk-encryption-overview.md)
- [Server-side encryption of Azure Disk Storage](./disk-encryption.md)
- [Encryption at host](./disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data)
- [DCasv5 and ECasv5 series confidential VMs](../confidential-computing/confidential-vm-overview.md#confidential-os-disk-encryption)
- [Azure Security Fundamentals - Azure encryption overview](../security/fundamentals/encryption-overview.md)
