---
title: Trusted launch for Azure VMs
description: Learn about trusted launch for Azure virtual machines.
author: Howie425
ms.author: howieasmerom
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: conceptual
ms.date: 04/25/2023
ms.reviewer: mattmcinnes
ms.custom: template-concept; references_regions
---

# Trusted launch for Azure virtual machines

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Azure offers trusted launch as a seamless way to improve the security of [generation 2](generation-2.md) VMs. Trusted launch protects against advanced and persistent attack techniques. Trusted launch is composed of several, coordinated infrastructure technologies that can be enabled independently. Each technology provides another layer of defense against sophisticated threats.

> [!IMPORTANT]
> Trusted launch requires the creation of new virtual machines. You can't enable trusted launch on existing virtual machines that were initially created without it.

## Benefits

- Securely deploy virtual machines with verified boot loaders, OS kernels, and drivers.
- Securely protect keys, certificates, and secrets in the virtual machines.
- Gain insights and confidence of the entire boot chain's integrity.
- Ensure workloads are trusted and verifiable.

## Virtual machines sizes

| Type | Virtual machines sizes supported | Sizes not supported yet.
|:--- |:--- |:--- |
| [General Purpose](sizes-general.md) |B-series, DCsv2-series, DCsv3-series, DCdsv3-series, Dv4-series, Dsv4-series, Dsv3-series, Dsv2-series, Dav4-series, Dasv4-series, Ddv4-series, Ddsv4-series, Dv5-series, Dsv5-series, Ddv5-series, Ddsv5-series, Dasv5-series, Dadsv5-series, Dlsv5-series, Dldsv5-series | Dpsv5-series, Dpdsv5-series, Dplsv5-series, Dpldsv5-series
| [Compute optimized](sizes-compute.md) |FX-series, Fsv2-series | All sizes supported.
| [Memory optimized](sizes-memory.md) |Dsv2-series, Esv3-series, Ev4-series, Esv4-series, Edv4-series, Edsv4-series, Eav4-series, Easv4-series, Easv5-series, Eadsv5-series, Ebsv5-series, Edv5-series, Edsv5-series, Ebdsv5-series | Epsv5-series, Epdsv5-series, M-series, Msv2-series and Mdsv2 Medium Memory series, Mv2-series
| [Storage optimized](sizes-storage.md) |Ls-series, Lsv2-series, Lsv3-series, Lasv3-series | All sizes supported.
| [GPU](sizes-gpu.md) |NCv2-series, NCv3-series, NCasT4_v3-series, NVv3-series, NVv4-series, NDv2-series, NC_A100_v4-series, NCadsA10 v4-series, NVadsA10 v5-series | NDasrA100_v4-series, NDm_A100_v4-series, ND-series
| [High Performance Compute](sizes-hpc.md) |HB-series, HBv2-series, HBv3-series, HC-series, HBv4-series, HX-series | All sizes supported.

> [!NOTE]
> - Installation of the **CUDA & GRID drivers on Secure Boot enabled Windows VMs** does not require any additional steps.
> - Installation of the **CUDA driver on Secure Boot enabled Ubuntu VMs** requires additional steps documented at [Install NVIDIA GPU drivers on N-series VMs running Linux](./linux/n-series-driver-setup.md#install-cuda-driver-on-ubuntu-with-secure-boot-enabled). Secure Boot should be disabled for installing CUDA Drivers on other Linux VMs.
> - Installation of the  **GRID driver** requires secure boot to be disabled for Linux VMs.

## Operating systems supported

| OS | Version |
|:--- |:--- |
| Azure Linux | 1.0, 2.0 |
| CentOS | 8.3, 8.4 |
| Debian |11 |
| Oracle Linux |8.3, 8.4, 8.5, 8.6, 9.0 LVM |
| RedHat Enterprise Linux |8.3, 8.4, 8.5, 8.6, 9.0, 9.1 LVM |
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
- Azure Site Recovery
- Azure Automanage
- Ultra disk, Premium SSD v2
- Managed Image
- Nested Virtualization (most v5 VM sizes supported)

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

## FAQ

Frequently asked questions about trusted launch.

### Why should I use trusted launch? What does trusted launch guard against?

Trusted launch guards against boot kits, rootkits, and kernel-level malware. These sophisticated types of malware run in kernel mode and remain hidden from users. For example:
- Firmware rootkits: these kits overwrite the firmware of the virtual machine's BIOS, so the rootkit can start before the OS.
- Boot kits: these kits replace the OS's bootloader so that the virtual machine loads the boot kit before the OS.
- Kernel rootkits: these kits replace a portion of the OS kernel so the rootkit can start automatically when the OS loads.
- Driver rootkits: these kits pretend to be one of the trusted drivers that OS uses to communicate with the virtual machine's components.

### What are the differences between secure boot and measured boot?

In secure boot chain, each step in the boot process checks a cryptographic signature of the subsequent steps. For example, the BIOS will check a signature on the loader, and the loader will check signatures on all the kernel objects that it loads, and so on. If any of the objects are compromised, the signature won't match, and the VM will not boot. For more information, see [Secure Boot](/windows-hardware/design/device-experiences/oem-secure-boot). Measured boot does not halt the boot process, it measures or computes the hash of the next objects in the chain and stores the hashes in the Platform Configuration Registers (PCRs) on the vTPM. Measured boot records are used for boot integrity monitoring.

### What happens when an integrity fault is detected?

Trusted launch for Azure virtual machines is monitored for advanced threats. If such threats are detected, an alert is triggered. Alerts are only available if [Defender for Cloud's enhanced security features](../security-center/enable-enhanced-security.md) are enabled.

Microsoft Defender for Cloud periodically performs attestation. If the attestation fails, a medium severity alert is triggered. Trusted launch attestation can fail for the following reasons:
- The attested information, which includes a log of the Trusted Computing Base (TCB), deviates from a trusted baseline (like when Secure Boot is enabled). This can indicate that untrusted modules have been loaded and the OS may be compromised.
- The attestation quote could not be verified to originate from the vTPM of the attested VM. This can indicate that malware is present and may be intercepting traffic to the TPM.
- The attestation extension on the VM is not responding. This can indicate a denial-of-service attack by malware, or an OS admin.

### How does trusted launch compare to Hyper-V Shielded VM?

Hyper-V Shielded VM is currently available on Hyper-V only. [Hyper-V Shielded VM](/windows-server/security/guarded-fabric-shielded-vm/guarded-fabric-and-shielded-vms) is typically deployed in conjunction with Guarded Fabric. A Guarded Fabric consists of a Host Guardian Service (HGS), one or more guarded hosts, and a set of Shielded VMs. Hyper-V Shielded VMs are intended for use in fabrics where the data and state of the virtual machine must be protected from both fabric administrators and untrusted software that might be running on the Hyper-V hosts. Trusted launch on the other hand can be deployed as a standalone virtual machine or Virtual Machine Scale Sets on Azure without additional deployment and management of HGS. All of the trusted launch features can be enabled with a simple change in deployment code or a checkbox on the Azure portal.

### Does trusted launch support Azure Compute Gallery?

Trusted launch now allows images to be created and shared through the Azure Compute Gallery (formerly Shared Image Gallery). The image source can be an existing Azure VM which is either generalized or specialized, an existing managed disk or a snapshot, a VHD or an image version from another gallery. To deploy a Trusted Launch VM from an Azure Compute Gallery image version see [trusted launch VM](https://aka.ms/trusted-launch-azurecomputegallery).

### Does trusted launch support Azure Backup?

Trusted launch now supports Azure Backup. For more information, see  [Support matrix for Azure VM backup](../backup/backup-support-matrix-iaas.md#vm-compute-support).

### Does trusted launch support ephemeral OS disks?

Trusted launch supports ephemeral OS disks. Note that, while using ephemeral disks for Trusted Launch VMs, keys and secrets generated or sealed by the vTPM after the creation of the VM may not be persisted across operations like reimaging and platform events like service healing. For more information, see [Trusted Launch for Ephemeral OS disks (Preview)](https://aka.ms/ephemeral-os-disks-support-trusted-launch).

### How can I find VM sizes that support Trusted launch?

See the list of [Generation 2 VM sizes supporting Trusted launch](trusted-launch.md#virtual-machines-sizes).

The following commands can be used to check if a [Generation 2 VM Size](../virtual-machines/generation-2.md#generation-2-vm-sizes) does not support Trusted launch.

#### CLI

```azurecli
subscription="<yourSubID>"
region="westus"
vmSize="Standard_NC12s_v3"

az vm list-skus --resource-type virtualMachines  --location $region --query "[?name=='$vmSize'].capabilities" --subscription $subscription
```

#### PowerShell

```azurepowershell
$region = "southeastasia"
$vmSize = "Standard_M64"
(Get-AzComputeResourceSku | where {$_.Locations.Contains($region) -and ($_.Name -eq $vmSize) })[0].Capabilities
```

The response is similar to the following form. `TrustedLaunchDisabled True` in the output indicates that the Generation 2 VM size does not support Trusted launch. If it's a Generation 2 VM size and `TrustedLaunchDisabled` is not part of the output, it implies that Trusted launch is supported for that VM size.

```
Name                                         Value
----                                         -----
MaxResourceVolumeMB                          8192000
OSVhdSizeMB                                  1047552
vCPUs                                        64
MemoryPreservingMaintenanceSupported         False
HyperVGenerations                            V1,V2
MemoryGB                                     1000
MaxDataDiskCount                             64
CpuArchitectureType                          x64
MaxWriteAcceleratorDisksAllowed              8
LowPriorityCapable                           True
PremiumIO                                    True
VMDeploymentTypes                            IaaS
vCPUsAvailable                               64
ACUs                                         160
vCPUsPerCore                                 2
CombinedTempDiskAndCachedIOPS                80000
CombinedTempDiskAndCachedReadBytesPerSecond  838860800
CombinedTempDiskAndCachedWriteBytesPerSecond 838860800
CachedDiskBytes                              1318554959872
UncachedDiskIOPS                             40000
UncachedDiskBytesPerSecond                   1048576000
EphemeralOSDiskSupported                     True
EncryptionAtHostSupported                    True
CapacityReservationSupported                 False
TrustedLaunchDisabled                        True
AcceleratedNetworkingEnabled                 True
RdmaEnabled                                  False
MaxNetworkInterfaces                         8
```

### What is VM Guest State (VMGS)?  

VM Guest State (VMGS) is specific to Trusted Launch VM. It is a blob that is managed by Azure and contains the unified extensible firmware interface (UEFI) secure boot signature databases and other security information. The lifecycle of the VMGS blob is tied to that of the OS Disk.

## Next steps

Deploy a [trusted launch VM](trusted-launch-portal.md).
