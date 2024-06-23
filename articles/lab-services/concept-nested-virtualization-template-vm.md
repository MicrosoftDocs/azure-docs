---
title: Nested virtualization in Azure Lab Services
description: Learn about considerations and recommendations for configuring nested virtualization in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: conceptual
ms.date: 03/07/2024
#customer intent: As a lab administrator, I want to create networks within a virtual lab in order to cover scenarios where multiple virtual machines interact within or across networks.
---

# Nested virtualization in Azure Lab Services

Nested virtualization enables you to create a lab in Azure Lab Services that contains multiple virtual machines (VMs). You can create and run a virtual machine (*guest VM*) within a virtual machine (*host VM*). You can use nested virtualization to provide lab users with multiple, related virtual machines as part of the lab.

Nested virtualization is enabled through Hyper-V. It's only available on Windows-based lab VMs. You can run both Windows-based and Linux-based guest VMs inside the lab VM. This article explains the concepts, considerations, and recommendations for nested virtualization in Azure Lab Services.

## Use cases

With nested virtualization, you can support multiple VMs that communicate with each other. You might use such labs for the following purposes:

- [Networking with GNS3](./class-type-networking-gns3.md)
- IT administration
- [Ethical hacking](./class-type-ethical-hacking.md)

For more information about nested virtualization, see the following articles:

- [How nested virtualization works](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#how-nested-virtualization-works)
- [Nested Virtualization in Azure](https://azure.microsoft.com/blog/nested-virtualization-in-azure/)

## Enable nested virtualization for a lab

Enable nested virtualization and create nested Hyper-V VMs on the template VM. When you publish the lab, each lab user has a lab VM that already contains the nested virtual machines.

To enable nested virtualization for a lab:

1. Connect to the template VM by using a remote desktop client.
1. Enable Hyper-V feature and tools on the template VM.
1. If you use Windows Server, create a Network Address Translation (NAT) network to allow the VMs inside the template VM to communicate with each other.

    > [!NOTE]
    > The NAT network created on the Lab Services VM will allow a Hyper-V VM to access the internet and other Hyper-V VMs on the same Lab Services VM. The Hyper-V VM won't be able to access Azure resources, such as DNS servers, on an Azure virtual network.

1. Use Hyper-V manager to create the nested virtual machines inside the template VM.  
1. Verify nested virtual machines have internet access.

Follow these steps to [enable nested virtualization on a template VM](./how-to-enable-nested-virtualization-template-vm-using-script.md).

## Recommendations

Keep the following recommendations in mind when you configure nested virtualization.

### Non-admin user

You might choose to create a user without admin privileges when you create a lab. Consider the following issues when you use nested virtualization with such an account.

- To be able to start or stop VMs, the user must belong to the **Hyper-V Administrators** group.
- The user can't mount drives.
- The Hyper-V VM files must be saved in a location accessible to the user.

### Processor compatibility

The nested virtualization VM sizes might use different processors as shown in the following table:

| Size | Series | Processor |
| ---- | ----- |  ----- |
| Medium (nested virtualization) | [Standard_D4s_v4](/azure/virtual-machines/dv4-dsv4-series) |  3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel® Xeon® Platinum 8272CL (Cascade Lake) |
| Large (nested virtualization) | [Standard_D8s_v4](/azure/virtual-machines/dv4-dsv4-series) | 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel® Xeon® Platinum 8272CL (Cascade Lake) |

Each time that a template VM or a lab VM is stopped and started, the underlying processor type might change. To help ensure that nested VMs work consistently across processors, enable [processor compatibility mode](/windows-server/virtualization/hyper-v/manage/processor-compatibility-mode-hyper-v) on the nested VMs. We recommend that you enable **Processor Compatibility** mode on the template VM's nested VMs before publishing or exporting the image.

You should also test the performance of the nested VMs with the **Processor Compatibility** mode enabled to ensure performance isn't negatively impacted. For more information, see [ramifications of using processor compatibility mode](/windows-server/virtualization/hyper-v/manage/processor-compatibility-mode-hyper-v#ramifications-of-using-processor-compatibility-mode).

### Automatically shut down nested VMs

To avoid data corruption in the nested virtual machines when the lab VM shuts down, configure the nested VMs to shut down automatically when the lab VM shuts down.

Learn how you can use the `Set-VM` PowerShell command to [configure the shutdown auto stop action for a nested VM](/powershell/module/hyper-v/set-vm#example-1).

### Use VHDX disk format for nested VMs

When you create the nested virtual machines, choose the [VHDX file format](/openspecs/windows_protocols/ms-vhdx/83f6b700-6216-40f0-aa99-9fcb421206e2) for the virtual hard disks to save disk space on the lab VM.

### Configure the number of vCPUs for nested VMs

By default, when you create the nested virtual machine, only one virtual CPU (vCPU) is assigned. Depending on the operating system and software of the nested VM, you might have to increase the number of vCPUs. For more information about managing and setting nested VM CPU resources, see [Hyper-V processor performance](/windows-server/administration/performance-tuning/role/hyper-v-server/processor-performance) or [Set-VM](/powershell/module/hyper-v/set-vm) PowerShell cmdlet.

### Configure the assigned memory for nested VMs

When you create the nested virtual machine, the minimum assigned memory might not be sufficient for the operating system and installed software. You might have to increase the minimum amount of assigned memory for the nested VM. For more information about managing and setting nested VM CPU resources, see [Hyper-V Host CPU Resource Management](/windows-server/virtualization/hyper-v/manage/manage-hyper-v-minroot-2016) or [Set-VM](/powershell/module/hyper-v/set-vm) PowerShell cmdlet.

### Best practices for running Linux on Hyper-V

The following resources provide best practices for running Linux or FreeBSD on Hyper-V:

- [Best Practices for running Linux on Hyper-V](/windows-server/virtualization/hyper-v/best-practices-for-running-linux-on-hyper-v)

- [Best Practices for running FreeBSD on Hyper-V](/windows-server/virtualization/hyper-v/best-practices-for-running-freebsd-on-hyper-v)

## Known issues

Before you set up a lab with nested virtualization, here are a few things to consider.

- Not all VM sizes support nested virtualization. When you create a new lab, select the **Medium (Nested virtualization)** or **Large (Nested virtualization)** VM size for your lab.

- Choose a size that provides good performance for both the host (lab VM) and guest VMs (VMs inside the lab VM). Make sure that the size you choose can run the host VM and any Hyper-V machines at the same time.

- If using Windows Server, the host VM requires extra configuration to let the guest machines have internet connectivity.

- Guest VMs don't have access to Azure resources, such as DNS servers, on the Azure virtual network.

- Hyper-V guest VMs are licensed as independent machines. For information about licensing for Microsoft operation systems and products, see [Microsoft Licensing](https://www.microsoft.com/licensing/default). Check licensing agreements for any other software you use before you install it on the template VM or guest VMs.

- Virtualization applications other than Hyper-V aren't [supported for nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#3rd-party-virtualization-apps). These applications include any software that requires hardware virtualization extensions.

## Related content

- [Enable nested virtualization on a template VM](./how-to-enable-nested-virtualization-template-vm-using-script.md)
