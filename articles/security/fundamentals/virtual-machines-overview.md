---
title: Security features used with Azure VMs
titleSuffix: Azure security
description: This article provides an overview of the core Azure security features that can be used with Azure Virtual Machines.
services: security
author: msmbaldwin
ms.assetid: 467b2c83-0352-4e9d-9788-c77fb400fe54
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 01/12/2026
ms.author: mbaldwin
---

# Azure Virtual Machines security overview

This article provides an overview of core Azure security features for virtual machines.

Azure Virtual Machines lets you deploy a wide range of computing solutions in an agile way. The service supports Microsoft Windows, Linux, Microsoft SQL Server, Oracle, IBM, SAP, and Azure BizTalk Services. You can deploy any workload and any language on nearly any operating system.

Azure VMs provide the flexibility of virtualization without buying and maintaining physical hardware. You can build and deploy applications with the assurance that your data is protected in highly secure datacenters.

By using Azure, you can build security-enhanced, compliant solutions that:

* Protect virtual machines from viruses and malware
* Encrypt sensitive data
* Secure network traffic
* Identify and detect threats
* Meet compliance requirements

## Trusted launch

[Trusted launch](/azure/virtual-machines/trusted-launch) is the default for newly created Generation 2 Azure VMs and Virtual Machine Scale Sets. Trusted launch protects against advanced and persistent attack techniques including boot kits, rootkits, and kernel-level malware.

Trusted launch provides:

* **Secure Boot**: Protects against installation of malware-based rootkits and boot kits by ensuring only signed operating systems and drivers can boot
* **vTPM (virtual Trusted Platform Module)**: A dedicated secure vault for keys and measurements that enables attestation and boot integrity verification
* **Boot Integrity Monitoring**: Uses attestation through Microsoft Defender for Cloud to verify boot chain integrity and alert on failures

You can enable trusted launch on existing VMs and Virtual Machine Scale Sets. For more information, see [Trusted launch for Azure virtual machines](/azure/virtual-machines/trusted-launch).

## Confidential computing

[Azure confidential computing](/azure/confidential-computing/overview) protects data while in use through hardware-based trusted execution environments. Confidential VMs use AMD SEV-SNP technology to create a hardware-enforced boundary between your application and the virtualization stack.

Confidential VMs provide:

* **Hardware-based isolation**: Between virtual machines, hypervisor, and host management code.
* **Confidential OS disk encryption**: Binds disk encryption keys to the VM's TPM, making disk content accessible only to the VM.
* **Secure key release**: Cryptographic binding between platform attestation and VM encryption keys.
* **Attestation**: Customizable policies to ensure host compliance before deployment.

For more information, see [Azure confidential VMs](/azure/confidential-computing/confidential-vm-overview).

## Virtual machine disk encryption

[!INCLUDE [Azure Disk Encryption retirement notice](~/reusable-content/ce-skilling/azure/includes/security/azure-disk-encryption-retirement.md)]

Azure provides several encryption options for managed disks:

- **Server-side encryption (SSE)**: Also called encryption at rest or Azure Storage encryption, SSE is always enabled and automatically encrypts data on Azure managed disks (OS and data disks) when persisting to storage clusters. Data is encrypted transparently using 256-bit AES encryption, which is FIPS 140-2 compliant. SSE doesn't affect disk performance and has no extra cost. However, SSE doesn't encrypt temp disks or disk caches.

- **Encryption at host**: Enhances SSE by encrypting temp disks and disk caches at rest, with data flowing encrypted to storage clusters. This encryption provides end-to-end encryption for your VM data. Encryption at host doesn't use your VM's CPU and doesn't affect performance. Temp disks and ephemeral OS disks are encrypted with platform-managed keys. OS and data disk caches are encrypted with either customer-managed or platform-managed keys, depending on the disk encryption type.

- **Confidential disk encryption**: For confidential VMs, this encryption binds disk encryption keys to the VM's TPM, making protected disk content accessible only to the VM.

By default, managed disks use platform-managed keys with no additional configuration required. For customer-managed keys, you can use Azure Key Vault, Azure Key Vault Managed HSM, or Azure Cloud HSM to control and manage your own encryption keys.

For more information, see [Overview of managed disk encryption options](/azure/virtual-machines/disk-encryption-overview) and [Server-side encryption of Azure Disk Storage](/azure/virtual-machines/disk-encryption).

## Key management

[Azure Key Vault](/azure/key-vault/general/overview) provides secure storage for cryptographic keys, secrets, and certificates. Azure offers multiple key management solutions with different security levels:

- **Azure Key Vault Standard**: FIPS 140-2 Level 1 validated, multitenant service with software-protected keys.
- **Azure Key Vault Premium**: FIPS 140-3 Level 3 validated, multitenant service with HSM-protected keys.
- **Azure Key Vault Managed HSM**: FIPS 140-3 Level 3 validated, single-tenant service that provides full customer control over the HSM and key sovereignty.

For virtual machines, these services can store:

- **Disk encryption keys**: Customer-managed keys for encrypting managed disks through disk encryption sets.
- **SQL Server encryption keys**: Keys for [transparent data encryption](/sql/relational-databases/security/encryption/transparent-data-encryption) on SQL Server VMs.
- **Application secrets**: Keys and secrets used by applications running on your VMs.

You manage permissions and access to protected items through [Microsoft Entra ID](/entra/fundamentals/whatis). You can audit key usage and retain full control over your encryption keys.

For more information, see [What is Azure Key Vault?](/azure/key-vault/general/overview), [What is Azure Key Vault Managed HSM?](/azure/key-vault/managed-hsm/overview), and [Key management in Azure](key-management.md).

## Virtual machine backup

[Azure Backup](/azure/backup/backup-overview) is a scalable solution that protects your VM data with zero capital investment and minimal operating costs. Application errors can corrupt your data, and human errors can introduce bugs. With Azure Backup, your virtual machines running Windows and Linux are protected.

Azure Backup provides:

- **Independent and isolated backups**: Backups are stored in a Recovery Services vault, which provides built-in management of recovery points and guards against accidental destruction of data
- **Application-consistent recovery points**: Captures the state of the application data at the time of backup for running VMs
- **No explicit outbound connectivity required**: All communication and data transfer happens on the Azure backbone network
- **Soft delete protection**: Deleted backup data is retained for 14 additional days, allowing recovery with no data loss
- **Cross Region Restore**: Restore Azure VMs in a secondary Azure paired region for disaster recovery scenarios

For more information, see [What is Azure Backup?](/azure/backup/backup-overview) and [Azure Backup service FAQ](/azure/backup/backup-azure-backup-faq).

## Azure Site Recovery

[Azure Site Recovery](/azure/site-recovery/site-recovery-overview) helps orchestrate replication, failover, and recovery of workloads and apps so they're available from a secondary location if your primary location goes down.

Site Recovery:

* **Simplifies BCDR strategy**: Makes it easy to handle replication, failover, and recovery of multiple business workloads and apps from a single location
* **Provides flexible replication**: Replicate workloads running on Hyper-V VMs, VMware VMs, and Windows/Linux physical servers
* **Supports failover and recovery**: Provides test failovers for disaster recovery drills without affecting production environments
* **Eliminates secondary datacenters**: Replicate to Azure, eliminating the cost and complexity of maintaining a secondary site

For more information, see [What is Azure Site Recovery?](/azure/site-recovery/site-recovery-overview), [How does Azure Site Recovery work?](/azure/site-recovery/azure-to-azure-architecture), and [What workloads are protected by Azure Site Recovery?](/azure/site-recovery/site-recovery-workload).

## Virtual networking

Virtual machines require network connectivity. Azure requires virtual machines to be connected to an Azure virtual network.

An Azure virtual network is a logical construct built on top of the physical Azure network fabric. Each logical Azure virtual network is isolated from all other Azure virtual networks. This isolation helps ensure that network traffic in your deployments is not accessible to other Microsoft Azure customers.

For more information, see [Azure network security overview](/azure/security/fundamentals/network-overview) and [Virtual Network overview](/azure/virtual-network/virtual-networks-overview).

## Security policy management

[Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction) helps you prevent, detect, and respond to threats. Defender for Cloud gives you increased visibility into, and control over, the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions.

Defender for Cloud helps you optimize and monitor VM security by:

* Providing security recommendations for virtual machines
* Monitoring the state of your virtual machines
* Providing Microsoft Defender for Servers with advanced threat protection

Microsoft Defender for Servers includes:

* Microsoft Defender for Endpoint integration for endpoint detection and response
* Vulnerability assessment for identifying security weaknesses
* Just-in-time VM access to reduce attack surface
* File integrity monitoring to detect changes to critical files
* Adaptive application controls for approved applications

For more information, see [Introduction to Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction), [Microsoft Defender for Servers](/azure/defender-for-cloud/defender-for-servers-introduction), and [Microsoft Defender for Cloud frequently asked questions](/azure/defender-for-cloud/faq-general).

## Compliance

Azure Virtual Machines is certified for FISMA, FedRAMP, HIPAA, PCI DSS Level 1, and other key compliance programs. This certification makes it easier for your Azure applications to meet compliance requirements and for your business to address domestic and international regulatory requirements.

For more information, see [Microsoft Trust Center: Compliance](https://www.microsoft.com/trust-center/compliance/compliance-overview) and [Azure compliance documentation](/azure/compliance/).

## Next steps

Learn about [security best practices](/azure/security/fundamentals/iaas) for VMs and operating systems.
