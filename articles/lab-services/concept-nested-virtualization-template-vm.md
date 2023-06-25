---
title: Nested virtualization on a template VM
titleSuffix: Azure Lab Services
description: In this article, learn about nested virtualization on a template virtual machine in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 01/13/2023
---

# Nested virtualization on a template virtual machine in Azure Lab Services

Azure Lab Services enables you to set up a [template virtual machine](./classroom-labs-concepts.md#template-virtual-machine) in a lab, which serves as a base image for the VMs of your students. Teaching a networking, security or IT class can require an environment with multiple VMs. These VMs also need to communicate with each other.

Nested virtualization enables you to create a multi-VM environment inside a lab's template virtual machine. Publishing the template provides each lab user with a virtual machine that has multiple VMs within it. This article explains the concepts of nested virtualization on a template VM in Azure Lab Services, and how to enable it.

## What is nested virtualization?

Nested virtualization enables you to create virtual machines within a virtual machine. Nested virtualization is done through Hyper-V, and is only available on Windows VMs.

For more information about nested virtualization, see the following articles:

- [How nested virtualization works](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#how-nested-virtualization-works).
- [Nested Virtualization in Azure](https://azure.microsoft.com/blog/nested-virtualization-in-azure/).

## Considerations

Before setting up a lab with nested virtualization, here are a few things to take into consideration.

- Not all VM sizes support nested virtualization. When you create a new lab, select **Medium (Nested virtualization)** or **Large (Nested virtualization)** sizes for the VM size.

- Choose a size that provides good performance for both the host (lab VM) and client VMs (VMs inside the lab VM). Make sure the size you choose can run the host VM and any Hyper-V machines at the same time.

- Client VMs don't have access to Azure resources, such as DNS servers, on the Azure virtual network.

- The host VM requires extra configuration to let the client machines have internet connectivity.

- Hyper-V client VMs are licensed as independent machines. For information about licensing for Microsoft operation systems and products, see [Microsoft Licensing](https://www.microsoft.com/licensing/default). Check licensing agreements for any other software you use, before installing it on the template VM or client VMs.

- Virtualization applications other than Hyper-V are [*not* supported for nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#3rd-party-virtualization-apps). This includes any software that requires hardware virtualization extensions.

## Enable nested virtualization on a template VM

To enable nested virtualization on a template VM, you first connect to the template VM with a remote desktop client. You then make the required configuration changes inside the template VM.

1. Follow these steps to [connect to and update the template machine](./how-to-create-manage-template.md#update-a-template-vm).

1. Next, make the following changes inside the template VM to enable nested virtualization:

    - **Enable the Hyper-V role**. The Hyper-V role must be enabled for the creation and running of VMs inside the template VM.
    - **Enable DHCP**.  When the template VM has the DHCP role enabled, the VMs inside the template VM get an IP address automatically assigned to them.
    - **Create a NAT network for the Hyper-V VMs**. You set up a Network Address Translation (NAT) network to allow the VMs inside the template VM to have internet access and communicate with each other.

    >[!NOTE]
    >The NAT network created on the Lab Services VM will allow a Hyper-V VM to access the internet and other Hyper-V VMs on the same Lab Services VM.  The Hyper-V VM won't be able to access Azure resources, such as DNS servers, on an Azure virtual network.

You can accomplish the tasks listed previously by using a script, or by using Windows tools. Follow these steps to [enable nested virtualization on a template VM](./how-to-enable-nested-virtualization-template-vm-using-script.md).

## Processor compatibility

The nested virtualization VM sizes may use different processors as shown in the following table:

 Size | Series | Processor |
| ---- | ----- |  ----- |
| Medium (nested virtualization) | [Standard_D4s_v4](../virtual-machines/dv4-dsv4-series.md) |  3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel® Xeon® Platinum 8272CL (Cascade Lake) |
| Large (nested virtualization) | [Standard_D8s_v4](../virtual-machines/dv4-dsv4-series.md) | 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel® Xeon® Platinum 8272CL (Cascade Lake) |

Each time that a template VM or a student VM is stopped and started, the underlying processor may change.  To help ensure that nested VMs work consistently across processors, try enabling [processor compatibility mode](/windows-server/virtualization/hyper-v/manage/processor-compatibility-mode-hyper-v) on the nested VMs. It's recommended to enable **Processor Compatibility** mode on the template VM's nested VMs before publishing or exporting the image.

You should also test the performance of the nested VMs with the **Processor Compatibility** mode enabled to ensure performance isn't negatively impacted.  For more information, see [ramifications of using processor compatibility mode](/windows-server/virtualization/hyper-v/manage/processor-compatibility-mode-hyper-v#ramifications-of-using-processor-compatibility-mode).

## Next steps

* Learn how to [enable nested virtualization on a lab VM](./how-to-enable-nested-virtualization-template-vm-using-script.md).
