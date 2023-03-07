---
title: Enable nested virtualization on a template VM in Azure Lab Services | Microsoft Docs
description: In this article, learn how to set up nested virtualization on a template machine in Azure Lab Services. 
ms.topic: how-to
ms.date: 01/04/2022
---

# Enable nested virtualization on a template virtual machine in Azure Lab Services

Azure Lab Services enables you to set up one template virtual machine in a lab and make a single copy available to each of your students. Teaching a networking, security of IT class can require an environment with multiple VMs.  The VMs also need to communicate with each other.  

Nested virtualization enables you to create a multi-VM environment inside a lab's template virtual machine. Publishing the template will provide each user in the lab with a virtual machine set up with multiple VMs within it.  This article covers how to set up nested virtualization on a template machine in Azure Lab Services.

## What is nested virtualization?

Nested virtualization enables you to create virtual machines within a virtual machine. Nested virtualization is done through Hyper-V, and is only available on Windows VMs.

For more information about nested virtualization, see the following articles:

- [Nested Virtualization in Azure](https://azure.microsoft.com/blog/nested-virtualization-in-azure/)
- [How to enable nested virtualization in an Azure VM](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization)

## Considerations

Before setting up a lab with nested virtualization, here are a few things to take into consideration.

- When creating a new lab, select **Medium (Nested virtualization)** or **Large (Nested virtualization)** sizes for the virtual machine size.
- Choose a size that will provide good performance for both the host and client virtual machines.  Make sure the size you choose can run the host VM and any Hyper-V machines at the same time.
- Client virtual machines won't have access to Azure resources, such as DNS servers, on the Azure virtual network.
- The host virtual machine requires setup to allow for the client machine to have internet connectivity.
- Hyper-V client virtual machines are licensed as independent machines. For information about licensing for Microsoft operation systems and products, see [Microsoft Licensing](https://www.microsoft.com/licensing/default). Check licensing agreements for any other software being used before installing it on the template virtual machine or client virtual machines.

## Enable nested virtualization on a template VM

This article assumes that you've created a lab account/lab plan and lab.  For more information about creating a new lab plan, see [Tutorial: Set up a lab plan](tutorial-setup-lab-plan.md). For more information how to create lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md).

>[!IMPORTANT]
>Select **Large (nested virtualization)** or **Medium (nested virtualization)** for the virtual machine size when creating the lab.  Nested virtualization will not work otherwise.  

To connect to the template machine, see [Create and manage a template in Azure Lab Services](how-to-create-manage-template.md).

To enable nested virtualization, there are a few tasks to accomplish.  

- **Enable Hyper-V role**. Hyper-V role must be enabled for the creation and running of Hyper-V virtual machines.
- **Enable DHCP**.  When the Lab Services virtual machine has the DHCP role enabled, the Hyper-V virtual machines can automatically be assigned an IP address.
- **Create NAT network for Hyper-V VMs**.  The NAT network is set up to allow the Hyper-V virtual machines to have internet access.  The Hyper-V virtual machines can communicate with each other.

>[!NOTE]
>The NAT network created on the Lab Services VM will allow a Hyper-V VM to access the internet and other Hyper-V VMs on the same Lab Services VM.  The Hyper-V VM won't be able to access Azure resources, such as DNS servers, on an Azure virtual network.

Accomplishing the tasks listed above can be done using a script or using Windows tools.  Read the sections below for further details.

### Using script to enable nested virtualization

To use the automated setup for nested virtualization with Windows Server 2016 or Windows Server 2019, see [Enable nested virtualization on a template virtual machine in Azure Lab Services using a script](how-to-enable-nested-virtualization-template-vm-using-script.md). You'll use scripts from [Lab Services Hyper-V scripts](https://aka.ms/azlabs/scripts/hyperV) to install the Hyper-V role.  The scripts will also set up networking so the Hyper-V virtual machines can have internet access.

### Using Windows tools to enable nested virtualization

To configure nested virtualization for Windows Server 2016 or 2019 manually, see [Enable nested virtualization on a template virtual machine in Azure Lab Services manually](how-to-enable-nested-virtualization-template-vm-ui.md).  Instructions will also cover configuring networking so the Hyper-V VMs have internet access.

### Processor compatibility

The nested virtualization VM sizes may use different processors as shown in the following table:

 Size | Series | Processor |
| ---- | ----- |  ----- |
| Medium (nested virtualization) | [Standard_D4s_v4](../virtual-machines/dv4-dsv4-series.md) |  3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel® Xeon® Platinum 8272CL (Cascade Lake) |
| Large (nested virtualization) | [Standard_D8s_v4](../virtual-machines/dv4-dsv4-series.md) | 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel® Xeon® Platinum 8272CL (Cascade Lake) |

Each time that a template VM or a student VM is stopped and started, the underlying processor may change.  To help ensure that nested VMs work consistently across processors, try enabling [processor compatibility mode](/windows-server/virtualization/hyper-v/manage/processor-compatibility-mode-hyper-v) on the nested VMs.  It's recommended to enable **Processor Compatibility** mode on the template VM's nested VMs before publishing or exporting the image.  You should also test the performance of the nested VMs with the **Processor Compatibility** mode enabled to ensure performance isn't negatively impacted.  For more information, see [ramifications of using processor compatibility mode](/windows-server/virtualization/hyper-v/manage/processor-compatibility-mode-hyper-v#ramifications-of-using-processor-compatibility-mode).
