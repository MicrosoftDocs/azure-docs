---
title: Migrate Generation 2 Virtual Machines to Azure Trusted Launch Virtual Machines with Azure Migrate
description: Use Azure Migrate to migrate on premises Generation 2 Virtual Machines to Azure Trusted Launch Virtual Machines
author: dhananjayanr
ms.author: dhananjayanr
ms.topic: how-to
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 03/16/2026
ms.custom: engagement-fy26
# Customer intent: "As an IT administrator, I want to migrate servers to Azure Trusted Launch Virtual Machines so that I can ensure enhanced security for my Virtual Machines."
---

# Migrate generation 2 virtual machines to Azure trusted launch virtual machines using Azure Migrate

Azure Migrate now supports migrating Generation 2 virtual machines to Azure Virtual Machines with Trusted Launch. Trusted Launch uses UEFI-based Secure Boot and a virtual Trusted Platform Module (vTPM) to establish a trusted boot chain. This helps ensure that only approved and signed components are loaded during startup, reducing the risk of bootkits, rootkits, and other low-level malware.

Trusted Launch is the default security type for supported Generation 2 Virtual Machines and virtual machine scale sets in Azure, where available. [Learn more](/azure/virtual-machines/trusted-launch) about Trusted Launch Virtual Machines.

## Supported operating systems
Azure Migrate supports all Operating systems that are supported for Trusted Launch in Azure. For more information, See [Azure supported OS list and Virtual Machine sizes](/azure/virtual-machines/trusted-launch#operating-systems-supported).

>[!Note]
>Trusted Launch is a security feature for Generation 2 Virtual Machines. Generation 1 Virtual Machines use BIOS and MBR, and they do not support Secure Boot or vTPM by design. As a result, Generation 1 Virtual Machines cannot use Trusted Launch and Azure migrate does not support migrating Gen 1 Virtual Machines to Trusted Launch virtual Machines.

## Secure boot
At the root of Trusted Launch is Secure Boot. Secure Boot is implemented in platform firmware and protects virtual machines from malware such as bootkits and rootkits. Secure Boot ensures that only signed operating systems and drivers can start. It establishes a trusted boot chain for the virtual machine. When Secure Boot is enabled, all operating system boot components—including the boot loader, kernel, and kernel drivers—must be signed by trusted publishers. Both Windows and supported Linux distributions support Secure Boot. If Secure Boot can't verify a trusted signature, the virtual machine fails to boot.

>[!Note]
>Secure Boot is configured as part of the Trusted Launch settings on the target Virtual Machine and isn’t inherited from the source Virtual Machine. Even if Secure Boot was enabled on the source Virtual Machine, it isn’t automatically enabled on the migrated Trusted Launch Virtual Machine. You must explicitly enable Secure Boot in the Trusted Launch configuration during migration.

## Related Links
- [Assess VM for Trusted Launch Virtual Machines](target-right-sizing.md).
- [Migrate VMWare VMs to Trusted Launch VMs](tutorial-migrate-vmware.md).
- [Migrate Hyper V VM to Trusted Launch VM](tutorial-migrate-hyper-v.md).
- [Migrate Physical or other cloud servers to Trusted Launch VM](tutorial-migrate-physical-virtual-machines.md).




