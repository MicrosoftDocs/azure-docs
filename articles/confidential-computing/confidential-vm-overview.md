---
title: About Azure confidential VMs
description: Learn about Azure confidential virtual machines. These series are for tenants with high security and confidentiality requirements.
author: ju-shim
ms.author: mmcrey
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.custom:
  - ignite-2023
ms.topic: overview
ms.date: 11/14/2023
---

# About Azure confidential VMs 

Azure confidential VMs offer strong security and confidentiality for tenants. They create a hardware-enforced boundary between your application and the virtualization stack. You can use them for cloud migrations without modifying your code, and the platform ensures your VM’s state remains protected.

> [!IMPORTANT]
> Protection levels differ based on your configuration and preferences. For example, Microsoft can own or manage encryption keys for increased convenience at no additional cost.

## Microsoft Mechanics

> [!VIDEO https://www.youtube.com/embed/mkCSGGNtwmc]

## Confidential VMs Benefits

- Robust hardware-based isolation between virtual machines, hypervisor, and host management code.
- Customizable attestation policies to ensure the host's compliance before deployment.
- Cloud-based Confidential OS disk encryption before the first boot.
- VM encryption keys that the platform or the customer (optionally) owns and manages.
- Secure key release with cryptographic binding between the platform's successful attestation and the VM's encryption keys.
- Dedicated virtual [Trusted Platform Module (TPM)](/windows/security/information-protection/tpm/trusted-platform-module-overview) instance for attestation and protection of keys and secrets in the virtual machine.
- Secure boot capability similar to [Trusted launch for Azure VMs](../virtual-machines/trusted-launch.md)

## Confidential OS disk encryption

Azure confidential VMs offer a new and enhanced disk encryption scheme. This scheme protects all critical partitions of the disk. It also binds disk encryption keys to the virtual machine's TPM and makes the protected disk content accessible only to the VM. These encryption keys can securely bypass Azure components, including the hypervisor and host operating system. To minimize the attack potential, a dedicated and separate cloud service also encrypts the disk during the initial creation of the VM.

If the compute platform is missing critical settings for your VM's isolation, [Azure Attestation](../attestation/index.yml) will not attest to the platform's health during boot, and will instead prevent the VM from starting. This scenario happens if you haven't enabled SEV-SNP, for example.

Confidential OS disk encryption is optional, as this process can lengthen the initial VM creation time. You can choose between:

- A confidential VM with Confidential OS disk encryption before VM deployment that uses platform-managed keys (PMK) or a customer-managed key (CMK).
- A confidential VM without Confidential OS disk encryption before VM deployment.

For further integrity and protection, confidential VMs offer [Secure Boot](/windows-hardware/design/device-experiences/oem-secure-boot) by default when confidential OS disk encryption is selected.

With Secure Boot, trusted publishers must sign OS boot components (including the boot loader, kernel, and kernel drivers). All compatible confidential VM images support Secure Boot.

## Confidential temp disk encryption

You can also extend the protection of confidential disk encryption to the temp disk. We enable this by leveraging an in-VM symmetric key encryption technology, after the disk is attached to the CVM.

The temp disk provides fast, local, and short-term storage for applications and processes. It is intended to only store data such as page files, log files, cached data, and other types of temporary data. Temp disks on CVMs contain the page file, also known as swap file, that can contain sensitive data. Without encryption, data on these disks may be accessible to the host. After enabling this feature, data on the temp disks is no longer exposed to the host.

This feature can be enabled through an opt-in process. To learn more, read [the documentation](https://aka.ms/CVM-tdisk-encrypt).

### Encryption pricing differences

Azure confidential VMs use both the OS disk and a small encrypted virtual machine guest state (VMGS) disk of several megabytes. The VMGS disk contains the security state of the VM's components. Some components include the vTPM and UEFI bootloader. The small VMGS disk might incur a monthly storage cost.

From July 2022, encrypted OS disks will incur higher costs. For more information, see [the pricing guide for managed disks](https://azure.microsoft.com/pricing/details/managed-disks/).

## Attestation and TPM

Azure confidential VMs boot only after successful attestation of the platform's critical components and security settings. The attestation report includes:

- A signed attestation report 
- Platform boot settings
- Platform firmware measurements
- OS measurements

You can initialize an attestation request inside of a confidential VM to verify that your confidential VMs are running a hardware instance with either AMD SEV-SNP, or Intel TDX enabled processors. For more information, see [Azure confidential VM guest attestation](https://aka.ms/CVMattestation).

Azure confidential VMs feature a virtual TPM (vTPM) for Azure VMs. The vTPM is a virtualized version of a hardware TPM, and complies with the TPM 2.0 spec. You can use a vTPM as a dedicated, secure vault for keys and measurements. Confidential VMs have their own dedicated vTPM instance, which runs in a secure environment outside the reach of any VM. 

## Limitations

The following limitations exist for confidential VMs. For frequently asked questions, see [FAQ about confidential VMs](./confidential-vm-faq.yml).

### Size support

Confidential VMs support the following VM sizes:

- General Purpose without local disk: DCasv5-series, DCesv5-series
- General Purpose with local disk: DCadsv5-series, DCedsv5-series
- Memory Optimized without local disk: ECasv5-series, ECesv5-series
- Memory Optimized with local disk: ECadsv5-series, ECedsv5-series

### OS support
Confidential VMs support the following OS options:

| Linux                                                                                    | Windows Client                                   | Windows Server                |
|------------------------------------------------------------------------------------------|--------------------------------------------------|-------------------------------|
| **Ubuntu**                                                                               | **Windows 11**                                   | **Windows Server Datacenter** |
| 20.04 <span class="pill purple">LTS</span> (AMD SEV-SNP Only)                            | 22H2 Pro                                         | 2019 Server Core              |
| 22.04 <span class="pill purple">LTS</span>                                               | 22H2 Pro <span class="pill red">ZH-CN</span>     |                               |
|                                                                                          | 22H2 Pro N                                       | 2022 Server Core              |
| **RHEL**                                                                                 | 22H2 Enterprise                                  | 2022 Azure Edition            |
| 9.3 <span class="pill purple">(AMD SEV-SNP Only)</span>                                  | 22H2 Enterprise N                                | 2022 Azure Edition Core       |
| [9.3 <span class="pill purple">Preview (Intel TDX Only)](https://aka.ms/tdx-rhel-93-preview)</span>                       | 22H2 Enterprise Multi-session                    |                               |
|                                                                                          |                                                  |                               |
| **SUSE (Tech Preview)**                                                                                 |                                                  |                               |
| [15 SP5 <span class="pill purple">(Intel TDX, AMD SEV-SNP)](https://aka.ms/cvm-sles-preview)</span>            |                                                  |                               |
| [15 SP5 for SAP <span class="pill purple">(Intel TDX, AMD SEV-SNP)](https://aka.ms/cvm-sles-preview)</span>    |                                                  |                               |

### Regions

Confidential VMs run on specialized hardware available in specific [VM regions](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).
 
### Pricing

Pricing depends on your confidential VM size. For more information, see the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

### Feature support

Confidential VMs *don't support*:

- Azure Batch
- Azure Backup
- Azure Site Recovery
- Azure Dedicated Host 
- Microsoft Azure Virtual Machine Scale Sets with Confidential OS disk encryption enabled
- Limited Azure Compute Gallery support
- Shared disks
- Ultra disks
- Accelerated Networking
- Live migration
- Screenshots under boot diagnostics


## Next steps

> [!div class="nextstepaction"]
> [Deploy a confidential VM from the Azure portal](quick-create-confidential-vm-portal.md)

For more information see our [Confidential VM FAQ](confidential-vm-faq.yml).
