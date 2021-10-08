---
title: Azure confidential virtual machines (CVM)
description: Azure confidential virtual machines
services: virtual-machines
author: edcohen
ms.service: container-service
ms.subservice: confidential-computing
ms.topic: overview
ms.date: 10/08/2021
ms.author: edcohen
 
---

# Azure confidential VMs based on AMD processors

Azure is now offering confidential VMs (CVMs) based on AMD processors with SEV-SNP technology. These VMs are designed for tenants with especially high security and confidentiality requirements. Confidential VMs offer a lift-and-shift migration experience with no changes to code. This added flexibility provides customers with a powerful tool for meeting their desired security posture. The VM in its entirety benefits from a strong hardware-enforced boundary. The platform is designed, deployed, and operated to prevent anyone other than the customer -including Microsoft— from reading or modifying a confidential VM’s state. 

> Note: Protection levels differ based on user configuration and preferences. For example, encryption keys can be owned and managed by Microsoft for increased convenience and at no additional cost.

## Benefits 

- Robust hardware-based isolation between virtual machines, hypervisor, and host management code.
- Customizable attestation policy for ensuring the compliance of the host before deploying a confidential VM.
- Cloud-based full-disk encryption prior to first boot.
- VM encryption keys that are owned and managed by the platform or customer (optional). 
- Secure key release with cryptographic binding between the platform's successful attestation and the VM's encryption keys.
- Dedicated virtual TPM instance for attestation and protection of keys and secrets in the virtual machine.

## Full-disk encryption

Azure confidential VMs introduce a new and enhanced disk encryption scheme. In this optional mode, all critical partitions of the disk are protected, including root and boot. In addition, disk encryption keys are bound to the virtual machine's TPM and made accessible only to the AMD processor. This scheme allows encryption keys to securely bypass Azure components including the hypervisor and host operating system. To further minimize the attack potential, disk encryption is performed by a dedicated and separate cloud service as part of the VM initial creation process. 

Once your VM disk is encrypted, if critical settings for your VM's isolation are missing (for example, SEV-SNP is not enabled), attestation would fail to release disk encryption keys. In other words, successfully “starting up” your confidential VM is strong proof that your operating system and data-at-rest are not tampered.

Because full-disk encryption can lengthen the initial VM creation time, we have made it optional. We offer two modes:

 - CVM with full OS disk encryption before VM deployment using Platform-Managed Key (PMK)
 - CVM without OS disk encryption before VM deployment

> Disk encryption using a Customer-Managed Key will be available soon.

For further integrity and protection, confidential VMs offer [Secure Boot](https://docs.microsoft.com/en-us/windows-hardware/design/device-experiences/oem-secure-boot) by default. 
With Secure Boot enabled, all OS boot components (boot loader, kernel, kernel drivers) must be signed by trusted publishers. All compatible confidential VM images support Secure Boot. 

## Customizable attestation policies

Azure confidential VMs are designed to boot only after successful attestation of the platform's critical components and security settings. This includes a signed attestation report issued by AMD [SEV-SNP](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf), platform boot settings, and operating system measurements. 

Attestation is performed by [Microsoft Azure Attestation](https://azure.microsoft.com/en-us/services/azure-attestation/) according to an attestation policy. As a user of Azure confidential VMs, you can customize this policy. This lets you define compliance parameters necessary for starting up and trusting your VM. For example, you can define a valid range of Security Version Numbers for the processor microcode, or whether Secure Boot must be enabled. For more options, refer to the Resources section below.

Trusted launch also introduces vTPM for Azure VMs. vTPM is a virtualized version of a hardware [Trusted Platform Module](/windows/security/information-protection/tpm/trusted-platform-module-overview), compliant with the TPM2.0 spec. It serves as a dedicated secure vault for keys and measurements. Trusted launch provides your VM with its own dedicated TPM instance, running in a secure environment outside the reach of any VM. The vTPM enables [attestation](/windows/security/information-protection/tpm/tpm-fundamentals#measured-boot-with-support-for-attestation) by measuring the entire boot chain of your VM (UEFI, OS, system, and drivers). 

Trusted launch uses the vTPM to perform remote attestation by the cloud. This is used for platform health checks and for making trust-based decisions. As a health check, trusted launch can cryptographically certify that your VM booted correctly. If the process fails, possibly because your VM is running an unauthorized component, Azure Security Center will issue integrity alerts. The alerts include details on which components failed to pass integrity checks.

## User attestable platform reports (coming soon)

In addition to boot-time attestation performed by Azure, users can independently attest their Azure confidential VMs. Tenants can add this as a runtime check to establish that a VM's state can be trusted to process confidential data. Attestation reports can then be validated directly with [Microsoft Azure Attestation](https://azure.microsoft.com/en-us/services/azure-attestation/), or any independent attestation service, either local or centralized.

More information will be provided when this feature is released.

## Public preview limitations

**Size support**:
- DCasv5-series, DCadsv5-series 
- ECasv5-series, ECadsv5-series

**OS support**:
- Ubuntu 20.04 LTS
- Windows Server 2019
- Windows Server 2022

**Regions**: 
- West US
- North Europe

**Pricing**:
Depending on your confidential VM size. Refer to the [Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/).

**The following features are not currently supported in the preview**:
- Virtual machine scale sets
- VM resize
- Azure Batch
- Backup
- Azure Site Recovery
- Capturing a VM
- Shared Image Gallery
- Ephemeral OS disk
- Shared disk
- Azure Dedicated Host 
- User attestable platform reports
- Live Migration
- Customer-managed keys for OS disk pre-encryption

## Next Steps

[Deploy a DCasv5-series virtual machine through Azure Portal](./quick-create-portal-cvm.md)

## Resources

[Frequently asked questions on Azure confidential VMs with AMD processors](./virtual-machine-amd-faq.yml)

[Deployment options for Azure confidential VMs with AMD processors](./virutal-machine-solutions-amd.md)

[Attestation policies for Azure confidential VMs with AMD processors](../amd-secure-key-release.md)
