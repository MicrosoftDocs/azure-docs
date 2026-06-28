---
title: Migrate to Trusted Launch or Confidential virtual machines using Azure Migrate
description: Use Azure Migrate to migrate to trusted launch or confidential virtual machines
author: dhananjayanr
ms.author: dhananjayanr
ms.topic: how-to
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 03/16/2026
ms.custom: engagement-fy26
# Customer intent: "As an IT administrator, I want to migrate servers to Azure Trusted Launch Virtual Machines or Confidential Virtual Machines so that I can ensure enhanced security for my Virtual Machines."
---
# Migrate to Trusted Launch or Confidential Virtual machines by using Azure Migrate
Azure Migrate now supports migrating eligible machines to Trusted Launch and Confidential virtual machines in Azure.

## Migrate generation 2 virtual machines to Azure Trusted Launch virtual machines by using Azure Migrate

Azure Migrate now supports migrating generation 2 virtual machines to Azure Virtual Machines with Trusted Launch. This feature is now generally available.
  - Trusted Launch uses UEFI-based Secure Boot and a virtual Trusted Platform Module (vTPM) to establish a trusted boot chain. This trusted boot chain helps ensure that only approved and signed components load during startup, reducing the risk of bootkits, rootkits, and other low-level malware.
  - Trusted Launch is the default security type for supported generation 2 virtual machines and virtual machine scale sets in Azure, where available. [Learn more](/azure/virtual-machines/trusted-launch) about Trusted Launch Virtual Machines.

## Supported operating systems for Trusted Launch virtual machines
Azure Migrate supports all Operating systems that are supported for Trusted Launch in Azure. For more information, See [Azure supported OS list and Virtual Machine sizes](/azure/virtual-machines/trusted-launch#operating-systems-supported).

>[!Note]
>Trusted Launch is a security feature for generation 2 virtual machines. Generation 1 Virtual Machines use BIOS and MBR, and they don't support Secure Boot or vTPM by design. As a result, Generation 1 Virtual Machines can't use Trusted Launch and Azure Migrate doesn't support migrating Gen 1 Virtual Machines to Trusted Launch virtual Machines.

## Secure boot
At the root of Trusted Launch is Secure Boot, 
- Secure Boot is implemented in platform firmware and protects virtual machines from malware such as bootkits and rootkits. It ensures that only signed operating systems and drivers can start by establishing a trusted boot chain for the virtual machine.
- When Secure Boot is enabled, all operating system boot components including the boot loader, kernel, and kernel drivers must be signed by trusted publishers.
- Both Windows and supported Linux distributions support Secure Boot. If Secure Boot can't verify a trusted signature, the virtual machine fails to boot.

>[!Note]
> - You configure Secure Boot as part of the Trusted Launch settings on the target virtual machine. The setting isn't inherited from the source virtual machine.
> - Even if Secure Boot was enabled on the source virtual machine, it's not automatically enabled on the migrated Trusted Launch virtual machine. You must explicitly ensure Secure Boot is enabled in the Trusted Launch configuration during migration.

## Migrate eligible machines to Azure Confidential VMs by using Azure Migrate (Preview)
Azure Migrate now supports the migration of both generation 1 and generation 2 virtual machines (VMs) from on-premises or other cloud platforms to Azure Confidential Virtual machines (CVM).  This feature is available in public preview.
 - Azure Confidential VMs offer strong security and confidentiality for tenants.
 - They create a hardware-enforced boundary between your application and the virtualization stack. You can use them for cloud migrations without modifying your code, and the platform ensures your VM’s state remains protected.
 - For more information on Azure Confidential machines, see [Azure confidential virtual machines](../confidential-computing/confidential-vm-overview.md).
   
## Supported operating systems for confidential virtual machines
Azure Migrate currently supports the migration of the following operating systems to Confidential Virtual Machines (CVMs):
 - Windows Server: 2019, 2022
 - Ubuntu: 20.04 LTS, 22.04 LTS, 24.04 LTS
 - Rocky Linux 9.4
 - RHEL 9.4

>[!Note]
> - Both Generation 1 and Generation 2 virtual machines are supported.
> - Ensure the latest updates are installed for the respective OS at source before beginning migration. Otherwise, migration to confidential compute fails.
> - If you choose confidential virtual machines (CVM) as the target security type during migration, only CVM-eligible VMs are available for selection and the rest are greyed out.

## Confidential encryption for OS disks (optional)
Azure Migrate supports optional confidential encryption for OS disks during migration. This encryption protects all critical partitions of the disk. It also binds disk encryption keys to the virtual machine's TPM and makes the protected disk content accessible only to the VM.
 - Confidential OS disk encryption is **optional**, as this process can lengthen the initial VM creation time. You can choose between:
     - A Confidential VM with Confidential OS disk encryption.
     - A Confidential VM without Confidential OS disk encryption.

 >[!Note]
> - Confidential OS disk encryption is supported only for Windows Server and Ubuntu and isn't supported for Rocky Linux and RHEL.
> - Only customer-managed keys (CMK) are supported for confidential OS disk encryption.
> -  Data disks currently don't support confidential encryption. However, you can secure them by using host-based encryption with customer-managed keys (CMK) or platform-managed keys (PMK).


## Related Links
- [Assess VM for Trusted Launch Virtual Machines](target-right-sizing.md)
- [Migrate VMWare servers](tutorial-migrate-vmware.md)
- [Migrate Hyper V servers](tutorial-migrate-hyper-v.md)
- [Migrate Physical or other cloud servers](tutorial-migrate-physical-virtual-machines.md)




