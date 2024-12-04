---
title: Configure Virtual Machines - Virtual Trusted Platform Module (vTPM)
description: Learn how to configure Virtual Machines - Virtual Trusted Platform Module (vTPM).
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/04/2024
ms.custom: engagement-fy25
---

# Configure Virtual Trusted Platform Module (vTPM) on Virtual Machines with Azure VMware Solution

This article demonstrates how to enable the virtual Trusted Platform Module (vTPM) in a VMware vSphere virtual machine (VM) running in the Azure VMware Solution.  

A virtual Trusted Platform Module (vTPM) in VMware vSphere is a virtual counterpart of a physical TPM 2.0 chip, utilizing VM Encryption. It provides the same functionalities as a physical TPM but operates within VMs. Each VM can have its own unique and isolated vTPM, which helps secure sensitive information and maintain system integrity. This setting enables VMs to apply security features like BitLocker disk encryption and authenticate virtual hardware devices, creating a more secure virtual environment. 

## Prerequisites

Before configuring vTPM on a VM in Azure VMware Solution, ensure the following prerequisites are met:

- The virtual machine must use EFI firmware.
- The virtual machine must be at hardware version 14 or later.
- Guest OS support: Linux, Windows Server 2008 and later, Windows 7 and later.

>[!IMPORTANT]
>Customers do not need to configure a key provider to use vTPM with Azure VMware Solution. Azure VMware Solution already provides and manages key providers for each environment.

## Trusted Launch for Azure VMware Solution

Trusted Launch is a comprehensive security solution that encompasses three key components: Secure Boot, Virtual Trusted Platform Module (vTPM), and Virtualization-based security (VBS). Each of these components plays a vital role in fortifying the security posture of VMs.

## Benefits

•	Securely deploy VMs with verified boot loaders, operating system (OS) kernels, and drivers.

•	Securely protect keys, certificates, and secrets in the VMs.
•	Gain insights and confidence of the entire boot chain's integrity.

•	Ensure that workloads are trusted and verifiable. 

### Secure Boot

Secure Boot is the first line of defense in Trusted Launch. It establishes a "root of trust" for VMs by ensuring that only signed operating systems and drivers are allowed to boot. This prevents the installation of malware-based rootkits and bootkits, which can compromise the security of the entire system. With Secure Boot enabled, every aspect of the boot process, from the boot loader to the kernel and kernel drivers, must be digitally signed by trusted publishers. This creates a robust shield against unauthorized modifications and ensures that the VM starts in a secure and trusted state.
 
## Virtual Trusted Platform Module (vTPM) 

The vTPM is a virtualized version of a hardware Trusted Platform Module (TPM) 2.0 device. It serves as a dedicated secure vault for storing keys, certificates, and secrets. What sets vTPM apart is its ability to operate in a secure environment outside the reach of any VM, making it tamper-resistant and highly secure. One of the key functions of vTPM is attestation. It measures the entire boot chain of a VM, including UEFI, OS, system components, and drivers, to certify that the VM booted securely. This attestation mechanism is invaluable for verifying the integrity of VMs and ensuring that they haven't been compromised.
 
## Virtualization-based Security (VBS) 

VBS is the final piece of the Trusted Launch puzzle. It leverages the hypervisor to create isolated, secure memory regions within the VM. VBS uses virtualization to enhance system security by creating an isolated, hypervisor-restricted, specialized subsystem. It provides protection against unauthorized access of credential, prevents malware from running on windows system and ensures only trusted code runs from bootloader onwards.

## How to Configure vTPM

To configure vTPM on a VM in Azure VMware Solution, follow these steps:

1. Connect to vCenter Server using the vSphere Client.

2. In the inventory, right-click the virtual machine you want to modify and select "Edit Settings".  

:::image type="content" source="./media/enable-virtual-trusted-platform-module-on-virtual-machine-highres.png" alt-text="Diagram showing how to enable vTPM on a virtual machine in Azure VMware Solution." border="false" lightbox="./media/enable-virtual-trusted-platform-module-on-virtual-machine-highres.png":::

3. In the Edit Settings dialog box, click "Add New Device" and choose "Trusted Platform Module".  

4. Click "OK". The virtual machine Summary tab displays the Virtual Trusted Platform Module in the VM Hardware pane. 

>[!IMPORTANT]
>On VMware vSphere 7, cloning a virtual machine creates an exact replica of both the VM and the vTPM. VMware vSphere 8 introduces options to either copy or replace the TPM, allowing for better handling of different use cases. 

## Unsupported scenarios 

Migration of VMs with vTPM might not be supported by some tools. Check the documentation of the migration tool. If it isn't supported, you can follow VMware documentation to safely disable vTPM and re-enable it post-migration. 

## More information
[Securing Virtual Machines with Virtual Trusted Platform Module](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.vm_admin.doc/GUID-A43B6914-E5F9-4CB1-9277-448AC9C467FB.html)
[What Is a Virtual Trusted Platform Module](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-6F811A7A-D58B-47B4-84B4-73391D55C268.html)
[vSphere Virtual TPM (vTPM)
 Questions & Answers](https://www.vmware.com/docs/vsphere-virtual-tpm-vtpm-questions-answers)
