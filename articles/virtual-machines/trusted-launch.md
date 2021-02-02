---
title: Trusted Launch for Azure VMs
description: Learn about Trusted Launch for Azure virtual machines.
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.subservice: security
ms.topic: conceptual
ms.date: 02/02/2021
ms.reviewer: 
---

## Trusted Launch for Azure virtual machines

Azure offers Trusted Launch as a seamless way to bolster the security of generation 2 VMs. Designed to protect against advanced and persistent attack techniques, Trusted Launch is comprised of several, coordinated infrastructure technologies.
The underlying principle   behind Trusted Launch is ease of use. Each of the features above can be enabled independently of the others, usually with just a few clicks. Each provides an additional layer of defense against sophisticated threat actors.
Please note that using Trusted Launch requires the creation of new virtual machines. You can't enable Trusted Launch on existing virtual machines that were initially created without it.

## Secure boot
At the root of Trusted Launch is Secure Boot for your VM. This mode, which is implemented in platform firmware, protects against the installation of malware-based rootkits and bootkits. Secure Boot works to ensure that only signed OSes and drivers can boot. It establishes a “root of trust” for the software stack on your VM. With Secure Boot enabled, all OS boot components (boot loader, kernel, kernel drivers) must be signed by trusted publishers. Both Windows and select Linux distrubutions support Secure Boot. If Secure Boot fails to authenticate that the image was signed by a trusted publisher, the VM is prevented from booting. Read more about Secure Boot here.

## vTPM
Trusted Launch also introduces s vTPM for Azure VMs. This is a virtualized version of a hardware [Trusted Platform Module](/windows/security/information-protection/tpm/trusted-platform-module-overview) (compliant with the TPM2.0 spec). It serves as a dedicated secure vault for keys and measurements. Specifically, Trusted Launch provides your VM with its own dedicated TPM instance running in a secure environment outside the reach of any VM. Among other things, this vTPM enables [attestation](/windows/security/information-protection/tpm/tpm-fundamentals#measured-boot-with-support-for-attestation) by measuring the entire boot chain of your VM (UEFI, OS, system, and drivers). 
Trusted Launch can leverage vTPM to perform remote attestation by the cloud. This is used for platform health checks and for making trust-based decisions. As a health check, Trusted Launch can cryptographically certify that your VM booted correctly. If for any reason process fails, perhaps because your VM is running an unauthorized component, Azure Security Center will issue integrity alerts. The alerts include details on which components failed to pass integrity checks.

## Virtualization-based Security
In addition, Trusted Launch brings the benefits of VBS (Virtualization-based Security) to Azure Windows VMs. VBS uses the hypervisor to create a secure and isolated region of memory. Windows uses these regions to run various security solutions with increased protection against vulnerabilities and malicious exploits. In particular, Trusted Launch lets you enable HVCI (Hypervisor Code Integrity) and Windows Defender Credential Guard.
HVCI is a powerful system mitigation that protects Windows kernel-mode processes against injection and execution of malicious or unverified code. It checks kernel mode drivers and binaries before they run, which prevents unsigned files from loading into memory. This ensures such executable code can’t be modified once it is allowed to load. Read more about HVCI here.
Lastly, with Trusted Launch and VBS you can enable Windows Defender Credential Guard. This feature isolates and protects secrets so that only privileged system software can access them. It helps prevent unauthorized access to secrets as well as credential theft attacks, such as Pass-the-Hash (PtH) attacks. Read more about it here.
