---
title: Nested virtualization in Azure Lab Services
description: Learn about considerations and recommendations for configuring nested virtualization in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 06/27/2023
---

# Nested virtualization in Azure Lab Services

Nested virtualization enables you to create a lab in Azure Lab Services that contains a multi-VM environment. You can use nested virtualization to provide lab users with multiple, related virtual machines as part of a lab. For example, running a lab about [networking with GNS3](./class-type-networking-gns3.md), IT administration, or [ethical hacking](./class-type-ethical-hacking.md) might require multiple VMs that can communicate with each other. This article explains the concepts, considerations, and recommendations for nested virtualization in Azure Lab Services.

## What is nested virtualization?

Nested virtualization enables you to create and run virtual machines (*guest VM*) within a virtual machine (*host VM*). Nested virtualization is enabled through Hyper-V, and is only available on Windows-based lab VMs. You can run both Windows-based and Linux-based guest VMs inside the lab VM.

For more information about nested virtualization, see the following articles:

- [How nested virtualization works](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#how-nested-virtualization-works).
- [Nested Virtualization in Azure](https://azure.microsoft.com/blog/nested-virtualization-in-azure/).

## Considerations

Before setting up a lab with nested virtualization, here are a few things to take into consideration.

- Not all VM sizes support nested virtualization. When you create a new lab, select the **Medium (Nested virtualization)** or **Large (Nested virtualization)** VM size for your lab.

- Choose a size that provides good performance for both the host (lab VM) and guest VMs (VMs inside the lab VM). Make sure the size you choose can run the host VM and any Hyper-V machines at the same time.

- By default, guest VMs don't have access to Azure resources, such as DNS servers, on the Azure virtual network. The host VM requires extra configuration to let the guest machines have internet connectivity.

- Hyper-V guest VMs are licensed as independent machines. For information about licensing for Microsoft operation systems and products, see [Microsoft Licensing](https://www.microsoft.com/licensing/default). Check licensing agreements for any other software you use, before installing it on the template VM or guest VMs.

- Virtualization applications other than Hyper-V are [*not* supported for nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#3rd-party-virtualization-apps). This includes any software that requires hardware virtualization extensions.

## Recommendations

### Processor compatibility

The nested virtualization VM sizes may use different processors as shown in the following table:

| Size | Series | Processor |
| ---- | ----- |  ----- |
| Medium (nested virtualization) | [Standard_D4s_v4](/azure/virtual-machines/dv4-dsv4-series) |  3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel® Xeon® Platinum 8272CL (Cascade Lake) |
| Large (nested virtualization) | [Standard_D8s_v4](/azure/virtual-machines/dv4-dsv4-series) | 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel® Xeon® Platinum 8272CL (Cascade Lake) |

Each time that a template VM or a lab VM is stopped and started, the underlying processor type might change.  To help ensure that nested VMs work consistently across processors, try enabling [processor compatibility mode](/windows-server/virtualization/hyper-v/manage/processor-compatibility-mode-hyper-v) on the nested VMs. It's recommended to enable **Processor Compatibility** mode on the template VM's nested VMs before publishing or exporting the image.

You should also test the performance of the nested VMs with the **Processor Compatibility** mode enabled to ensure performance isn't negatively impacted.  For more information, see [ramifications of using processor compatibility mode](/windows-server/virtualization/hyper-v/manage/processor-compatibility-mode-hyper-v#ramifications-of-using-processor-compatibility-mode).

### Automatically shut down nested VMs

To avoid data corruption in the nested virtual machines when the lab VM shuts down, configure the nested VMs to automatically shut down when the lab VM shuts down.

Learn how you can use the `Set-VM` PowerShell command to [configure the shutdown auto stop action for a nested VM](/powershell/module/hyper-v/set-vm#example-1).

### Use VHDX disk format for nested VMs

When you create the nested virtual machines, choose the [VHDX file format](/openspecs/windows_protocols/ms-vhdx/83f6b700-6216-40f0-aa99-9fcb421206e2) for the virtual hard disks to save disk space on the lab VM.

### Configure the number of vCPUs for nested VMs

By default, when you create the nested virtual machine, only one virtual CPU (*vCPU*) is assigned. Depending on the operating system, and software of the nested VM, you might have to increase the number of vCPUs.

### Configure the assigned memory for nested VMs

When you create the nested virtual machine, the minimum assigned memory might not be sufficient for the operating system and installed software of the nested VM. You might have to increase the minimum amount of assigned memory for the nested VM.

### Best practices for running Linux on Hyper-V

The following resources provide more best practices for running Linux or FreeBSD on Hyper-V:

- [Best Practices for running Linux on Hyper-V](/windows-server/virtualization/hyper-v/best-practices-for-running-linux-on-hyper-v)

- [Best Practices for running FreeBSD on Hyper-V](/windows-server/virtualization/hyper-v/best-practices-for-running-freebsd-on-hyper-v)

## Enable nested configuration in a lab

To avoid that lab users need to enable nested virtualization on their lab VM and install the nested VMs inside it, you can prepare a lab template. When you publish the lab, each lab user has a lab VM that already contains the nested virtual machines.

When you create a lab that requires nested virtualization, make sure to select the option to create a template virtual machine during the creation process.

To enable nested virtualization for the lab, you then connect to the template VM by using a remote desktop client and make the required configuration changes inside the template VM.

1. Enable nested virtualization on the template VM operating system.

    - Enable the Hyper-V role: the Hyper-V role must be enabled for the creation and running of VMs inside the template VM.
    - Enable DHCP: when the template VM has the DHCP role enabled, the VMs inside the template VM get an IP address automatically assigned to them.
    - Create a NAT network for the nested VMs: set up a Network Address Translation (NAT) network to allow the VMs inside the template VM to have internet access and communicate with each other.

        >[!NOTE]
        >The NAT network created on the Lab Services VM will allow a Hyper-V VM to access the internet and other Hyper-V VMs on the same Lab Services VM.  The Hyper-V VM won't be able to access Azure resources, such as DNS servers, on an Azure virtual network.

1. Use Hyper-V manager to create the nested virtual machines inside the template VM.

## Next steps

Follow these steps to [enable nested virtualization on a template VM](./how-to-enable-nested-virtualization-template-vm-using-script.md). You can accomplish the tasks listed previously by using a script, or by using Windows tools.
