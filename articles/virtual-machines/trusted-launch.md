---
title: "Preview: Trusted Launch for Azure VMs"
description: Learn about Trusted Launch for Azure virtual machines.
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.subservice: security
ms.topic: conceptual
ms.date: 02/24/2021
ms.reviewer: 
ms.custom: template-concept
---

# Trusted Launch for Azure virtual machines (preview)

Azure offers Trusted Launch as a seamless way to bolster the security of [generation 2](generation-2.md) VMs. Designed to protect against advanced and persistent attack techniques, Trusted Launch is composed of several, coordinated infrastructure technologies. Each of the features can be enabled independently of the others. Each provides an additional layer of defense against sophisticated threats.

Trusted Launch requires the creation of new virtual machines. You can't enable Trusted Launch on existing virtual machines that were initially created without it.

## Secure boot
At the root of Trusted Launch is Secure Boot for your VM. This mode, which is implemented in platform firmware, protects against the installation of malware-based rootkits and boot kits. Secure Boot works to ensure that only signed operating systems and drivers can boot. It establishes a “root of trust” for the software stack on your VM. With Secure Boot enabled, all OS boot components (boot loader, kernel, kernel drivers) must be signed by trusted publishers. Both Windows and select Linux distributions support Secure Boot. If Secure Boot fails to authenticate that the image was signed by a trusted publisher, the VM is prevented from booting. Read more about Secure Boot here.

## vTPM
Trusted Launch also introduces s vTPM for Azure VMs. This is a virtualized version of a hardware [Trusted Platform Module](/windows/security/information-protection/tpm/trusted-platform-module-overview) (compliant with the TPM2.0 spec). It serves as a dedicated secure vault for keys and measurements. Specifically, Trusted Launch provides your VM with its own dedicated TPM instance running in a secure environment outside the reach of any VM. Among other things, this vTPM enables [attestation](/windows/security/information-protection/tpm/tpm-fundamentals#measured-boot-with-support-for-attestation) by measuring the entire boot chain of your VM (UEFI, OS, system, and drivers). 
Trusted Launch uses the vTPM to perform remote attestation by the cloud. This is used for platform health checks and for making trust-based decisions. As a health check, Trusted Launch can cryptographically certify that your VM booted correctly. If for any reason process fails, perhaps because your VM is running an unauthorized component, Azure Security Center will issue integrity alerts. The alerts include details on which components failed to pass integrity checks.

## Virtualization-based security

In addition, Trusted Launch brings the benefits of [VBS](/windows-hardware/design/device-experiences/oem-vbs) (Virtualization-based Security) to Azure Windows VMs. VBS uses the hypervisor to create a secure and isolated region of memory. Windows uses these regions to run various security solutions with increased protection against vulnerabilities and malicious exploits. In particular, Trusted Launch lets you enable HVCI (Hypervisor Code Integrity) and Windows Defender Credential Guard.

HVCI is a powerful system mitigation that protects Windows kernel-mode processes against injection and execution of malicious or unverified code. It checks kernel mode drivers and binaries before they run, which prevents unsigned files from loading into memory. This ensures such executable code can’t be modified once it is allowed to load. Read more about HVCI [here](https://techcommunity.microsoft.com/t5/windows-insider-program/virtualization-based-security-vbs-and-hypervisor-enforced-code/m-p/240571).

With Trusted Launch and VBS you can enable Windows Defender Credential Guard. This feature isolates and protects secrets so that only privileged system software can access them. It helps prevent unauthorized access to secrets as well as credential theft attacks, such as Pass-the-Hash (PtH) attacks. Read more about it [here](/windows/security/identity-protection/credential-guard/credential-guard).

## Benefits 

- Securely deploy virtual machines with verified boot loaders, OS kernels, and drivers. 
- Securely protect keys, certificates, and secrets in the virtual machines.
- Gain insights and confidence of the entire boot chain’s integrity.
- Ensure workloads are trusted and verifiable. 

## Public preview limitations

Size support:
- All [Generation 2](generation-2.md) VM sizes 

OS support:
- Redhat Enterprise Linux 8.3
- SUSE 15 SP2
- Ubuntu 20.04 LTS
- Ubuntu 18.04 LTS
- Windows Server 2019
- Windows Server 2016
- Windows 10 Pro
- Windows 10 Enterprise

Regions: 
- South Central US
- North Europe



Pricing:
No additional cost to existing VM pricing.

## Security Center integration

Trusted Launch is integrated with Azure Security Center, to ensure your VMs are properly configured. Azure Security Center will continually assess compatible VMs, and issue relevant recommendations.

- Recommendation to enable Secure Boot - This Recommendation only applies for VMs that support Trusted Launch. Azure Security Center will identify VMs that can enable Secure Boot, but have it disabled. It will issue a low severity recommendation to enable it.
- Recommendation to enable vTPM - If your VM has vTPM enabled, Azure Security Center can use it to perform Guest Attestation and identify advanced threat patterns. If Azure Security Center identifies VMs that support Trusted Launch and have vTPM disabled, it will issue a low severity recommendation to enable it. 
- Remote Attestation - If your VM has vTPM enabled, an extension of Azure Security Center can remotely validate that your VM booted in a healthy way. This is known as Remote Attestation. If your VM supports Remote Attestation, but the extension is not present, Azure Security Center will issue a low severity recommendation to install the extension.

## Azure Defender integration

If your VMs are properly set up with Trusted Launch, Azure Defender can detect and alert you of VM health problems.

- Alert for  VM attestation failure - Azure Defender will periodically perform attestation on your VMs. This also happens after your VM boots. If the attestation fails, it will trigger a medium severity alert.
    VM attestation can fail for the following reasons:
    - The attested information, which includes a boot log, deviates from a trusted baseline. This can indicate that untrusted modules have been loaded, and the OS may be compromised.
    - The attestation quote could not be verified to originate from the vTPM of the attested VM. This can indicate that malware is present and may be intercepting traffic to the vTPM.
    - The Attestation extension on the VM is not responding. This can indicate a denial-of-service attack by malware, or an OS admin.

> [!NOTE]
>  This alert is available for VMs with vTPM enabled and the Attestation extension installed. Keeping Secure Boot enabled is needed for attestation to pass. Attestation will fail if Secure Boot is disabled. If you must disable Secure Boot, you may choose to suppress this alert to avoid false positives.



## FAQ

Frequently asked questions about Trusted Launch.

### Why should I use Trusted Launch? What does Trusted Launch guard against?

Trusted Launch guards against boot kits, rootkits, and kernel-level malware. These sophisticated types of malware run in kernel mode and remain hidden from users. For example:
- Firmware rootkits: these kits overwrite the firmware of the virtual machine’s BIOS, so the rootkit can start before the OS. 
- Boot kits: these kits replace the OS’s bootloader so that the virtual machine loads the boot kit before the OS.
- Kernel rootkits: these kits replace a portion of the OS kernel so the rootkit can start automatically when the OS loads.
- Driver rootkits: these kits pretend to be one of the trusted drivers that OS uses to communicate with the virtual machine’s components.

### What are the differences between secure boot and measured boot?

In secure boot chain, each step in the boot process checks a cryptographic signature of the subsequent steps. For example, the BIOS will check a signature on the loader, and the loader will check signatures on all the kernel objects that it loads, and so on. If any of the objects are compromised, the signature won’t match, and the VM will not boot. For more information on secure boot, refer to [this page](/windows-hardware/design/device-experiences/oem-secure-boot). On the other hand, measured boot does not halt the boot process but rather measures or computes the hash of the next objects in the chain and stores the hashes in the Platform Configuration Registers (PCRs) on vTPM. Measured boot records are used for boot integrity monitoring.

###	What happens when an integrity fault is detected?

Trusted launch for Azure virtual machines is monitored for advanced threats. If such threats are detected, an alert will be triggered. Alerts are only available in the [Standard Tier](/azure/security-center/security-center-pricing) of Azure Security Center.
Azure Security Center periodically performs attestation. If the attestation fails, a medium severity alert will be triggered. Trusted launch attestation can fail for the following reasons: 
- The attested information, which includes a log of the Trusted Computing Base (TCB), deviates from a trusted baseline (i.e. when Secure Boot is enabled). This can indicate that untrusted modules have been loaded and hence the OS may be compromised.
- The attestation quote could not be verified to originate from the vTPM of the attested VM. This can indicate that malware is present and may be intercepting traffic to the TPM. 
- The attestation extension on the VM is not responding. This can indicate a denial-of-service attack by malware, or an OS admin.
In addition, for trusted launch with secure boot enabled, it’s possible for boot to complete even if a kernel driver fails validation and is thus prohibited from loading. If this happens, Azure Security Center will issue a low severity alert. While there is no immediate threat because the untrusted driver has not been loaded, such event merits investigation. If this happens, please consider the following:
- Which kernel driver failed? Am I familiar with this driver and expect it to be loaded?
- Is this the exact version of the driver I am expecting? Are the driver binaries intact? If the driver originates with a 3rd party, did the vendor pass the OS compliance tests to get it signed?
  
### How does Trusted Launch compared to Hyper-V Shielded VM?
Hyper-V Shielded VM is currently available on Hyper-V only. [Hyper-V Shielded VM](/windows-server/security/guarded-fabric-shielded-vm/guarded-fabric-and-shielded-vms) is typically deployed in conjunction with Guarded Fabric. A Guarded Fabric consists of a Host Guardian Service (HGS), one or more guarded hosts, and a set of Shielded VMs. Hyper-V Shielded VMs are intended for use in fabrics where the data and state of the virtual machine must be protected from both fabric administrators and untrusted software that might be running on the Hyper-V hosts. Trusted launch on the other hand can be deployed as a standalone virtual machine or virtual machine scale sets on Azure without additional deployment and management of HGS. All of the trusted launch features can be enabled with a simple change in deployment code or a checkbox on the Azure portal.  

### How can I convert existing VMs to Trusted Launch?
For Generation 2 VM, migration path to convert to trusted launch is targeted at general availability (GA).

## Next steps

Deploy a [Trusted Launch VM using the portal](trusted-launch-portal.md).