---
title: "Preview: Trusted launch for Azure VMs"
description: Learn about trusted launch for Azure virtual machines.
author: khyewei
ms.author: khwei
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: conceptual
ms.date: 02/26/2021
ms.reviewer: cynthn
ms.custom: template-concept; references_regions
---

# Trusted launch for Azure virtual machines (preview)

Azure offers trusted launch as a seamless way to improve the security of [generation 2](generation-2.md) VMs. Trusted launch protects against advanced and persistent attack techniques. Trusted launch is composed of several, coordinated infrastructure technologies that can be enabled independently. Each technology provides another layer of defense against sophisticated threats.

> [!IMPORTANT]
> Trusted launch requires the creation of new virtual machines. You can't enable trusted launch on existing virtual machines that were initially created without it.
>
> Trusted launch is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Benefits 

- Securely deploy virtual machines with verified boot loaders, OS kernels, and drivers.
- Securely protect keys, certificates, and secrets in the virtual machines.
- Gain insights and confidence of the entire boot chain’s integrity.
- Ensure workloads are trusted and verifiable.

## Public preview limitations

**Size support**:
- B-series
- Dav4-series, Dasv4-series
- DCsv2-series
- Dv4-series, Dsv4-series, Dsv3-series, Dsv2-series
- Ddv4-series, Ddsv4-series
- Fsv2-series
- Eav4-series, Easv4-series
- Ev4-series, Esv4-series, Esv3-series
- Edv4-series, Edsv4-series
- Lsv2-series

**OS support**:
- Redhat Enterprise Linux 8.3
- SUSE 15 SP2
- Ubuntu 20.04 LTS
- Ubuntu 18.04 LTS
- Windows Server 2019
- Windows Server 2016
- Windows 10 Pro
- Windows 10 Enterprise
- Windows 10 Enterprise multi-session

**Regions**: 
- Central US
- East US
- East US 2
- North Central US
- South Central US
- West US
- West US 2
- North Europe
- West Europe
- Japan East
- South East Asia

**Pricing**:
No additional cost to existing VM pricing.

**The following features are not supported in this preview**:
- Backup
- Azure Site Recovery
- Shared Image Gallery
- Ephemeral OS disk
- Shared disk
- Managed image
- Azure Dedicated Host 

## Secure boot

At the root of trusted launch is Secure Boot for your VM. This mode, which is implemented in platform firmware, protects against the installation of malware-based rootkits and boot kits. Secure Boot works to ensure that only signed operating systems and drivers can boot. It establishes a "root of trust" for the software stack on your VM. With Secure Boot enabled, all OS boot components (boot loader, kernel, kernel drivers) must be signed by trusted publishers. Both Windows and select Linux distributions support Secure Boot. If Secure Boot fails to authenticate that the image was signed by a trusted publisher, the VM will not be allowed to boot. For more information, see [Secure Boot](/windows-hardware/design/device-experiences/oem-secure-boot).

## vTPM

Trusted launch also introduces vTPM for Azure VMs. This is a virtualized version of a hardware [Trusted Platform Module](/windows/security/information-protection/tpm/trusted-platform-module-overview), compliant with the TPM2.0 spec. It serves as a dedicated secure vault for keys and measurements. Trusted launch provides your VM with its own dedicated TPM instance, running in a secure environment outside the reach of any VM. The vTPM enables [attestation](/windows/security/information-protection/tpm/tpm-fundamentals#measured-boot-with-support-for-attestation) by measuring the entire boot chain of your VM (UEFI, OS, system, and drivers). 

Trusted launch uses the vTPM to perform remote attestation by the cloud. This is used for platform health checks and for making trust-based decisions. As a health check, trusted launch can cryptographically certify that your VM booted correctly. If the process fails, possibly because your VM is running an unauthorized component, Azure Security Center will issue integrity alerts. The alerts include details on which components failed to pass integrity checks.

## Virtualization-based security

[Virtualization-based Security](/windows-hardware/design/device-experiences/oem-vbs) (VBS) uses the hypervisor to create a secure and isolated region of memory. Windows uses these regions to run various security solutions with increased protection against vulnerabilities and malicious exploits. Trusted launch lets you enable Hypervisor Code Integrity (HVCI) and Windows Defender Credential Guard.

HVCI is a powerful system mitigation that protects Windows kernel-mode processes against injection and execution of malicious or unverified code. It checks kernel mode drivers and binaries before they run, preventing unsigned files from loading into memory. This ensures such executable code can't be modified once it is allowed to load. For more information about VBS and HVCI, see [Virtualization Based Security (VBS) and Hypervisor Enforced Code Integrity (HVCI)](https://techcommunity.microsoft.com/t5/windows-insider-program/virtualization-based-security-vbs-and-hypervisor-enforced-code/m-p/240571).

With trusted launch and VBS you can enable Windows Defender Credential Guard. This feature isolates and protects secrets so that only privileged system software can access them. It helps prevent unauthorized access to secrets and credential theft attacks, like Pass-the-Hash (PtH) attacks. For more information, see [Credential Guard](/windows/security/identity-protection/credential-guard/credential-guard).


## Security Center integration

Trusted launch is integrated with Azure Security Center to ensure your VMs are properly configured. Azure Security Center will continually assess compatible VMs and issue relevant recommendations.

- **Recommendation to enable Secure Boot** - This Recommendation only applies for VMs that support trusted launch. Azure Security Center will identify VMs that can enable Secure Boot, but have it disabled. It will issue a low severity recommendation to enable it.
- **Recommendation to enable vTPM** - If your VM has vTPM enabled, Azure Security Center can use it to perform Guest Attestation and identify advanced threat patterns. If Azure Security Center identifies VMs that support trusted launch and have vTPM disabled, it will issue a low severity recommendation to enable it. 
- **Attestation health assessment** - If your VM has vTPM enabled, an extension of Azure Security Center can remotely validate that your VM booted in a healthy way. This is known as remote attestation. Azure Security Center issues an assessment, indicating the status of remote attestation.

## Azure Defender integration

If your VMs are properly set up with trusted launch, Azure Defender can detect and alert you of VM health problems.

- **Alert for VM attestation failure** - Azure Defender will periodically perform attestation on your VMs. This also happens after your VM boots. If the attestation fails, it will trigger a medium severity alert.
    VM attestation can fail for the following reasons:
    - The attested information, which includes a boot log, deviates from a trusted baseline. This can indicate that untrusted modules have been loaded, and the OS may be compromised.
    - The attestation quote could not be verified to originate from the vTPM of the attested VM. This can indicate that malware is present and may be intercepting traffic to the vTPM.
    - The Attestation extension on the VM is not responding. This can indicate a denial-of-service attack by malware, or an OS admin.

    > [!NOTE]
    >  This alert is available for VMs with vTPM enabled and the Attestation extension installed. Secure Boot must be enabled for attestation to pass. Attestation will fail if Secure Boot is disabled. If you must disable Secure Boot, you can suppress this alert to avoid false positives.

- **Alert for Untrusted Linux Kernel module** - For trusted launch with secure boot enabled, it’s possible for a VM to boot even if a kernel driver fails validation and is prohibited from loading. If this happens, Azure Defender will issue a low severity alert. While there is no immediate threat, because the untrusted driver has not been loaded, these events should be investigated. Consider the following:
    - Which kernel driver failed? Am I familiar with this driver and expect it to be loaded?
    - Is this the exact version of the driver I am expecting? Are the driver binaries intact? If this is a 3rd party driver, did the vendor pass the OS compliance tests to get it signed?


## FAQ

Frequently asked questions about trusted launch.

### Why should I use trusted launch? What does trusted launch guard against?

Trusted launch guards against boot kits, rootkits, and kernel-level malware. These sophisticated types of malware run in kernel mode and remain hidden from users. For example:
- Firmware rootkits: these kits overwrite the firmware of the virtual machine’s BIOS, so the rootkit can start before the OS. 
- Boot kits: these kits replace the OS’s bootloader so that the virtual machine loads the boot kit before the OS.
- Kernel rootkits: these kits replace a portion of the OS kernel so the rootkit can start automatically when the OS loads.
- Driver rootkits: these kits pretend to be one of the trusted drivers that OS uses to communicate with the virtual machine’s components.

### What are the differences between secure boot and measured boot?

In secure boot chain, each step in the boot process checks a cryptographic signature of the subsequent steps. For example, the BIOS will check a signature on the loader, and the loader will check signatures on all the kernel objects that it loads, and so on. If any of the objects are compromised, the signature won’t match, and the VM will not boot. For more information, see [Secure Boot](/windows-hardware/design/device-experiences/oem-secure-boot). Measured boot does not halt the boot process, it measures or computes the hash of the next objects in the chain and stores the hashes in the Platform Configuration Registers (PCRs) on the vTPM. Measured boot records are used for boot integrity monitoring.

###	What happens when an integrity fault is detected?

Trusted launch for Azure virtual machines is monitored for advanced threats. If such threats are detected, an alert will be triggered. Alerts are only available in the [Standard Tier](../security-center/security-center-pricing.md) of Azure Security Center.
Azure Security Center periodically performs attestation. If the attestation fails, a medium severity alert will be triggered. Trusted launch attestation can fail for the following reasons: 
- The attested information, which includes a log of the Trusted Computing Base (TCB), deviates from a trusted baseline (like when Secure Boot is enabled). This can indicate that untrusted modules have been loaded and the OS may be compromised.
- The attestation quote could not be verified to originate from the vTPM of the attested VM. This can indicate that malware is present and may be intercepting traffic to the TPM. 
- The attestation extension on the VM is not responding. This can indicate a denial-of-service attack by malware, or an OS admin.

  
### How does trusted launch compared to Hyper-V Shielded VM?
Hyper-V Shielded VM is currently available on Hyper-V only. [Hyper-V Shielded VM](/windows-server/security/guarded-fabric-shielded-vm/guarded-fabric-and-shielded-vms) is typically deployed in conjunction with Guarded Fabric. A Guarded Fabric consists of a Host Guardian Service (HGS), one or more guarded hosts, and a set of Shielded VMs. Hyper-V Shielded VMs are intended for use in fabrics where the data and state of the virtual machine must be protected from both fabric administrators and untrusted software that might be running on the Hyper-V hosts. Trusted launch on the other hand can be deployed as a standalone virtual machine or virtual machine scale sets on Azure without additional deployment and management of HGS. All of the trusted launch features can be enabled with a simple change in deployment code or a checkbox on the Azure portal.  

### How can I convert existing VMs to trusted launch?
For Generation 2 VM, migration path to convert to trusted launch is targeted at general availability (GA).

## Next steps

Deploy a [trusted launch VM using the portal](trusted-launch-portal.md).
