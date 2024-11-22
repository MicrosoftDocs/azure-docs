---
title: Configure Virtual Machines - Virtual Trusted Platform Module (vTPM)
description: Learn how to configure Virtual Machines - Virtual Trusted Platform Module (vTPM).
ms.topic: how-to
ms.service: azure-vmware
ms.date: 11/22/2024
ms.custom: engagement-fy25
---

# Configure Virtual Trusted Platform Module (vTPM) on Virtual Machines with Azure VMware Solution

This article demonstrates how to enable the virtual Trusted Platform Module (vTPM) in a VMware vSphere virtual machine (VM) running in the Azure VMware Solution.  

A virtual Trusted Platform Module (vTPM) in VMware vSphere is a virtual counterpart of a physical TPM 2.0 chip, utilizing VM Encryption. It provides the same functionalities as a physical TPM but operates within VMs. Each VM can have its own unique and isolated vTPM, which helps secure sensitive information and maintain system integrity. This setting enables VMs to apply security features like BitLocker disk encryption and authenticate virtual hardware devices, creating a more secure virtual environment. 

## Pre-requisites

Before configuring vTPM on a VM in Azure VMware Solution, ensure the following pre-requisites are met:

- The virtual machine must use EFI firmware.
- The virtual machine must be at hardware version 14 or later.
- Guest OS support: Linux, Windows Server 2008 and later, Windows 7 and later.

>[!IMPORTANT]
>Customers do not need to configure a key provider to use vTPM with Azure VMware Solution. Azure VMware Solution already provides and manages key providers for each environment.

## How to Configure vTPM

To configure vTPM on a VM in Azure VMware Solution, follow these steps:

1. Connect to vCenter Server using the vSphere Client.

2. In the inventory, right-click the virtual machine you want to modify and select "Edit Settings".  

:::image type="content" source="./media/enable-virtual-trusted-platform-module-on-virtual-machine.png" alt-text="Diagram showing how to enable vTPM on a virtual machine in Azure VMware Solution." border="false" lightbox="./media/enable-virtual-trusted-platform-module-on-virtual-machine.png":::

3. In the Edit Settings dialog box, click "Add New Device" and choose "Trusted Platform Module".  

4. Click "OK". The virtual machine Summary tab displays the Virtual Trusted Platform Module in the VM Hardware pane. 

>[!IMPORTANT]
>On VMware vSphere 7, cloning a virtual machine creates an exact replica of both the VM and the vTPM. VMware vSphere 8 introduces options to either copy or replace the TPM, allowing for better handling of different use cases. 

## Unsupported scenarios 

Migration of VMs with vTPM may not be supported by some tools. Check the documentation of the migration tool. If it is not supported, you can follow VMware documentation to safely disable vTPM and re-enable it post-migration. 

## More information
[Securing Virtual Machines with Virtual Trusted Platform Module](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.vm_admin.doc/GUID-A43B6914-E5F9-4CB1-9277-448AC9C467FB.html)
[What Is a Virtual Trusted Platform Module](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-6F811A7A-D58B-47B4-84B4-73391D55C268.html)
[vSphere Virtual TPM (vTPM)
 Questions & Answers](https://www.vmware.com/docs/vsphere-virtual-tpm-vtpm-questions-answers)
