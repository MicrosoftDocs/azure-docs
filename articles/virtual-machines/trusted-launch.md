---
title: Trusted launch for Azure VMs
description: Learn about trusted launch for Azure virtual machines.
author: Howie425
ms.author: howieasmerom
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: conceptual
ms.date: 10/04/2023
ms.reviewer: mattmcinnes
ms.custom: template-concept; references_regions
---

# Trusted launch for Azure virtual machines

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Azure offers trusted launch as a seamless way to improve the security of [generation 2](generation-2.md) VMs. Trusted launch protects against advanced and persistent attack techniques. Trusted launch is composed of several, coordinated infrastructure technologies that can be enabled independently. Each technology provides another layer of defense against sophisticated threats.

> [!IMPORTANT]
> - You can now enable Trusted Launch on existing [Azure Generation 2 VM](generation-2.md). For more information, see **[Enable Trusted Launch on existing VMs](trusted-launch-existing-vm.md)**
> - Trusted launch requires the creation of new virtual machine scale set (VMSS). You cannot enable trusted launch on existing VMSS that were initially created without it.

## Benefits

- Securely deploy virtual machines with verified boot loaders, OS kernels, and drivers.
- Securely protect keys, certificates, and secrets in the virtual machines.
- Gain insights and confidence of the entire boot chain's integrity.
- Ensure workloads are trusted and verifiable.

## Virtual Machines sizes

| Type | Supported size families | Currently not supported size families | Not supported size families
|:--- |:--- |:--- |:--- |
| [General Purpose](sizes-general.md) |[B-series](sizes-b-series-burstable.md), [DCsv2-series](dcv2-series.md), [DCsv3-series](dcv3-series.md#dcsv3-series), [DCdsv3-series](dcv3-series.md#dcdsv3-series), [Dv4-series](dv4-dsv4-series.md#dv4-series), [Dsv4-series](dv4-dsv4-series.md#dsv4-series), [Dsv3-series](dv3-dsv3-series.md#dsv3-series), [Dsv2-series](dv2-dsv2-series.md#dsv2-series), [Dav4-series](dav4-dasv4-series.md#dav4-series), [Dasv4-series](dav4-dasv4-series.md#dasv4-series), [Ddv4-series](ddv4-ddsv4-series.md#ddv4-series), [Ddsv4-series](ddv4-ddsv4-series.md#ddsv4-series), [Dv5-series](dv5-dsv5-series.md#dv5-series), [Dsv5-series](dv5-dsv5-series.md#dsv5-series), [Ddv5-series](ddv5-ddsv5-series.md#ddv5-series), [Ddsv5-series](ddv5-ddsv5-series.md#ddsv5-series), [Dasv5-series](dasv5-dadsv5-series.md#dasv5-series), [Dadsv5-series](dasv5-dadsv5-series.md#dadsv5-series), [Dlsv5-series](dlsv5-dldsv5-series.md#dlsv5-series), [Dldsv5-series](dlsv5-dldsv5-series.md#dldsv5-series) | [Dpsv5-series](dpsv5-dpdsv5-series.md#dpsv5-series), [Dpdsv5-series](dpsv5-dpdsv5-series.md#dpdsv5-series), [Dplsv5-series](dplsv5-dpldsv5-series.md#dplsv5-series), [Dpldsv5-series](dplsv5-dpldsv5-series.md#dpldsv5-series) | [Av2-series](av2-series.md), [Dv2-series](dv2-dsv2-series.md#dv2-series), [Dv3-series](dv3-dsv3-series.md#dv3-series)
| [Compute optimized](sizes-compute.md) |[FX-series](fx-series.md), [Fsv2-series](fsv2-series.md) | All sizes supported. | No Gen1-Only Size Family.
| [Memory optimized](sizes-memory.md) |[Dsv2-series](dv2-dsv2-series.md#dsv2-series), [Esv3-series](ev3-esv3-series.md#esv3-series), [Ev4-series](ev4-esv4-series.md#ev4-series), [Esv4-series](ev4-esv4-series.md#esv4-series), [Edv4-series](edv4-edsv4-series.md#edv4-series), [Edsv4-series](edv4-edsv4-series.md#edsv4-series), [Eav4-series](eav4-easv4-series.md#eav4-series), [Easv4-series](eav4-easv4-series.md#easv4-series), [Easv5-series](easv5-eadsv5-series.md#easv5-series), [Eadsv5-series](easv5-eadsv5-series.md#eadsv5-series), [Ebsv5-series](ebdsv5-ebsv5-series.md#ebsv5-series),[Ebdsv5-series](ebdsv5-ebsv5-series.md#ebdsv5-series) ,[Edv5-series](edv5-edsv5-series.md#edv5-series), [Edsv5-series](edv5-edsv5-series.md#edsv5-series)  | [Epsv5-series](epsv5-epdsv5-series.md#epsv5-series), [Epdsv5-series](epsv5-epdsv5-series.md#epdsv5-series), [M-series](m-series.md), [Msv2-series](msv2-mdsv2-series.md#msv2-medium-memory-diskless), [Mdsv2 Medium Memory series](msv2-mdsv2-series.md#mdsv2-medium-memory-with-disk), [Mv2-series](mv2-series.md) |[Ev3-series](ev3-esv3-series.md#ev3-series)
| [Storage optimized](sizes-storage.md) | [Lsv2-series](lsv2-series.md), [Lsv3-series](lsv3-series.md), [Lasv3-series](lasv3-series.md) | All sizes supported. | No Gen1-Only Size Family.
| [GPU](sizes-gpu.md) |[NCv2-series](ncv2-series.md), [NCv3-series](ncv3-series.md), [NCasT4_v3-series](nct4-v3-series.md#ncast4_v3-series), [NVv3-series](nvv3-series.md), [NVv4-series](nvv4-series.md), [NDv2-series](ndv2-series.md), [NC_A100_v4-series](nc-a100-v4-series.md#nc-a100-v4-series), [NVadsA10 v5-series](nva10v5-series.md#nvadsa10-v5-series) | [NDasrA100_v4-series](nda100-v4-series.md), [NDm_A100_v4-series](ndm-a100-v4-series.md), [ND-series](nd-series.md) | [NC-series](nc-series.md), [NV-series](nv-series.md), [NP-series](np-series.md)
| [High Performance Compute](sizes-hpc.md) |[HB-series](hb-series.md), [HBv2-series](hbv2-series.md), [HBv3-series](hbv3-series.md), [HBv4-series](hbv4-series.md), [HC-series](hc-series.md), [HX-series](hx-series.md) | All sizes supported. | No Gen1-Only Size Family.

> [!NOTE]
> - Installation of the **CUDA & GRID drivers on Secure Boot enabled Windows VMs** does not require any additional steps.
> - Installation of the **CUDA driver on Secure Boot enabled Ubuntu VMs** requires additional steps documented at [Install NVIDIA GPU drivers on N-series VMs running Linux](./linux/n-series-driver-setup.md#install-cuda-driver-on-ubuntu-with-secure-boot-enabled). Secure Boot should be disabled for installing CUDA Drivers on other Linux VMs.
> - Installation of the  **GRID driver** requires secure boot to be disabled for Linux VMs.
> - **Not Supported** size families do not support [generation 2](generation-2.md) VMs. Change VM Size to equivalent **Supported size families** for enabling Trusted Launch.

## Operating systems supported

| OS | Version |
|:--- |:--- |
| Alma Linux | 8.4, 8.5, 8.6, 8.7, 8.8, 9.0, 9.1, 9.2 |
| Azure Linux | 1.0, 2.0 |
| CentOS | 8.3, 8.4 |
| Debian |11 |
| Oracle Linux |8.3, 8.4, 8.5, 8.6, 9.0 LVM |
| RedHat Enterprise Linux |8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 9.0, 9.1 LVM |
| SUSE Enterprise Linux |15SP3, 15SP4 |
| Ubuntu Server |18.04 LTS, 20.04 LTS, 22.04 LTS |
| Windows 10 |Pro, Enterprise, Enterprise Multi-Session &#42; |
| Windows 11 |Pro, Enterprise, Enterprise Multi-Session &#42; |
| Windows Server |2016, 2019, 2022 &#42; |
| Window Server (Azure Edition) | 2022 |

&#42; Variations of this operating system are supported.

## Additional information

**Regions**:

- All public regions
- All Azure Government regions

**Pricing**:
No additional cost to existing VM pricing.

## Unsupported features

> [!NOTE]
> The following Virtual Machine features are currently not  supported with Trusted Launch.

- [Azure Site Recovery](../site-recovery/site-recovery-overview.md)
- [Azure Automanage](../automanage/overview-about.md)
- [Ultra disk](disks-enable-ultra-ssd.md)
- [Managed Image](capture-image-resource.md) (Customers are encouraged to use [Azure Compute Gallery](trusted-launch-portal.md#trusted-launch-vm-supported-images))
- Nested Virtualization (most v5 VM size families supported)

## Secure boot

At the root of trusted launch is Secure Boot for your VM. This mode, which is implemented in platform firmware, protects against the installation of malware-based rootkits and boot kits. Secure Boot works to ensure that only signed operating systems and drivers can boot. It establishes a "root of trust" for the software stack on your VM. With Secure Boot enabled, all OS boot components (boot loader, kernel, kernel drivers) must be signed by trusted publishers. Both Windows and select Linux distributions support Secure Boot. If Secure Boot fails to authenticate that the image was signed by a trusted publisher, the VM will not be allowed to boot. For more information, see [Secure Boot](/windows-hardware/design/device-experiences/oem-secure-boot).

## vTPM

Trusted launch also introduces vTPM for Azure VMs. This is a virtualized version of a hardware [Trusted Platform Module](/windows/security/information-protection/tpm/trusted-platform-module-overview), compliant with the TPM2.0 spec. It serves as a dedicated secure vault for keys and measurements. Trusted launch provides your VM with its own dedicated TPM instance, running in a secure environment outside the reach of any VM. The vTPM enables [attestation](/windows/security/information-protection/tpm/tpm-fundamentals#measured-boot-with-support-for-attestation) by measuring the entire boot chain of your VM (UEFI, OS, system, and drivers).

Trusted launch uses the vTPM to perform remote attestation by the cloud. This is used for platform health checks and for making trust-based decisions. As a health check, trusted launch can cryptographically certify that your VM booted correctly. If the process fails, possibly because your VM is running an unauthorized component, Microsoft Defender for Cloud will issue integrity alerts. The alerts include details on which components failed to pass integrity checks.

## Virtualization-based security

[Virtualization-based Security](/windows-hardware/design/device-experiences/oem-vbs) (VBS) uses the hypervisor to create a secure and isolated region of memory. Windows uses these regions to run various security solutions with increased protection against vulnerabilities and malicious exploits. Trusted launch lets you enable Hypervisor Code Integrity (HVCI) and Windows Defender Credential Guard.

HVCI is a powerful system mitigation that protects Windows kernel-mode processes against injection and execution of malicious or unverified code. It checks kernel mode drivers and binaries before they run, preventing unsigned files from loading into memory. This ensures such executable code can't be modified once it is allowed to load. For more information about VBS and HVCI, see [Virtualization Based Security (VBS) and Hypervisor Enforced Code Integrity (HVCI)](https://techcommunity.microsoft.com/t5/windows-insider-program/virtualization-based-security-vbs-and-hypervisor-enforced-code/m-p/240571).

With trusted launch and VBS you can enable Windows Defender Credential Guard. This feature isolates and protects secrets so that only privileged system software can access them. It helps prevent unauthorized access to secrets and credential theft attacks, like Pass-the-Hash (PtH) attacks. For more information, see [Credential Guard](/windows/security/identity-protection/credential-guard/credential-guard).

## Microsoft Defender for Cloud integration

Trusted launch is integrated with Microsoft Defender for Cloud to ensure your VMs are properly configured. Microsoft Defender for Cloud will continually assess compatible VMs and issue relevant recommendations.

- **Recommendation to enable Secure Boot** - This Recommendation only applies for VMs that support trusted launch. Microsoft Defender for Cloud will identify VMs that can enable Secure Boot, but have it disabled. It will issue a low severity recommendation to enable it.
- **Recommendation to enable vTPM** - If your VM has vTPM enabled, Microsoft Defender for Cloud can use it to perform Guest Attestation and identify advanced threat patterns. If Microsoft Defender for Cloud identifies VMs that support trusted launch and have vTPM disabled, it will issue a low severity recommendation to enable it.
- **Recommendation to install guest attestation extension** - If your VM has secure boot and vTPM enabled but it doesn't have the guest attestation extension installed, Microsoft Defender for Cloud will issue a low severity recommendation to install the guest attestation extension on it. This extension allows Microsoft Defender for Cloud to proactively attest and monitor the boot integrity of your VMs. Boot integrity is attested via remote attestation.
- **Attestation health assessment or Boot Integrity Monitoring** - If your VM has Secure Boot and vTPM enabled and attestation extension installed, Microsoft Defender for Cloud can remotely validate that your VM booted in a healthy way. This is known as boot integrity monitoring. Microsoft Defender for Cloud issues an assessment, indicating the status of remote attestation.

If your VMs are properly set up with trusted launch, Microsoft Defender for Cloud can detect and alert you of VM health problems.

- **Alert for VM attestation failure:** Microsoft Defender for Cloud will periodically perform attestation on your VMs. This also happens after your VM boots. If the attestation fails, it will trigger a medium severity alert.
    VM attestation can fail for the following reasons:
    - The attested information, which includes a boot log, deviates from a trusted baseline. This can indicate that untrusted modules have been loaded, and the OS may be compromised.
    - The attestation quote could not be verified to originate from the vTPM of the attested VM. This can indicate that malware is present and may be intercepting traffic to the vTPM.

    > [!NOTE]
    >  This alert is available for VMs with vTPM enabled and the Attestation extension installed. Secure Boot must be enabled for attestation to pass. Attestation will fail if Secure Boot is disabled. If you must disable Secure Boot, you can suppress this alert to avoid false positives.

- **Alert for Untrusted Linux Kernel module:** For trusted launch with secure boot enabled, it's possible for a VM to boot even if a kernel driver fails validation and is prohibited from loading. If this happens, Microsoft Defender for Cloud will issue a low severity alert. While there is no immediate threat, because the untrusted driver has not been loaded, these events should be investigated. Consider the following:
    - Which kernel driver failed? Am I familiar with this driver and expect it to be loaded?
    - Is this the exact version of the driver I am expecting? Are the driver binaries intact? If this is a 3rd party driver, did the vendor pass the OS compliance tests to get it signed?

## Next steps

Deploy a [trusted launch VM](trusted-launch-portal.md).
