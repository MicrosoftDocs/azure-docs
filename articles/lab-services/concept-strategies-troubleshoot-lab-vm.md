---
title: Labs concepts
titleSuffix: Azure Lab Services
description: Learn the different strategies and tools for troubleshooting lab VMs in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 12/05/2022
---

# Strategies for troubleshooting lab VMs in Azure Lab Services

When you face difficulties to connect to a lab VM in Azure Lab Services, or the lab VM is in an incorrect state, you can use different tools in Azure Lab Services or the operating system to resolve these issues. In this article, you learn about the different tools and strategies for troubleshooting lab VMs. Understand how each approach affects your lab environment and corresponding user data.

## Troubleshooting a lab VM

Use the following process for troubleshooting issues with a lab VM in Azure Lab Services:

1. If you're not able to connect to the lab VM with RDP or SSH:

    1. [Redeploy the lab VM](./how-to-reset-and-redeploy-vm.md#redeploy-vms) to another infrastructure node, while maintaining the user data. Learn more about [redeploying versus resetting a lab VM](#redeploy-versus-reset-a-lab-vm).

    1. If you still can't connect to the lab VM, [reset the lab VM](./how-to-reset-and-redeploy-vm.md#reset-vms). Resetting a lab VM deletes the user data in the VM. Make sure to [store the user data outside the lab VM](#store-user-data-outside-the-lab-vm).

1. The lab VM is an incorrect state. For example, after installing a software component or applying a system configuration.

    1. If the lab VM uses Windows, use the Windows System Restore built-in functionality to apply a previous restore point. For more information, see how to use [System Restore](https://support.microsoft.com/windows/use-system-restore-a5ae3ed9-07c4-fd56-45ee-096777ecd14e).

    1. If the lab VM is still in an incorrect state, [reset the lab VM](./how-to-reset-and-redeploy-vm.md#reset-vms). Resetting a lab VM deletes the user data in the VM. Make sure to [store the user data outside the lab VM](#store-user-data-outside-the-lab-vm).

1. You're blocked at a specific stage of the course:

    - If available, start a new lab for the course, which corresponds with the specific stage. Learn more about [creating multiple labs for a course](#create-multiple-labs-for-a-course).

## Redeploy versus reset a lab VM

Azure Lab Services lets you redeploy, labeled *troubleshooting* in the Azure portal, or reset a lab VM. Both operations are similar, and result in the creation of a new virtual machine instance. However, there are fundamental differences that affect the user data on the lab VM.

When you redeploy a lab VM, Azure Lab Services will shut down the VM, move the VM to a new node in within the Azure infrastructure, and then power it back on. You can think of a redeploy operation as a refresh of the underlying VM for your lab. All data that you saved in the [OS disk](/azure/virtual-machines/managed-disks-overview#os-disk) (usually the C: drive on Windows) of the VM will still be available after the redeploy operation. Any data on the [temporary disk](/azure/virtual-machines/managed-disks-overview#temporary-disk) (usually the D: drive on Windows) is lost after a redeploy operation.

Learn more about how to [redeploy a lab VM in the Azure Lab Services portal](./how-to-reset-and-redeploy-vm.md#redeploy-vms).

When you reset a lab VM, Azure Lab Services will shut down the VM, delete it, and recreate a new lab VM from the original template VM. You can think of a reset as a refresh of the entire lab, including the underlying VM. After you reset a lab VM, all the data that you saved on the OS disk (usually the C: drive on Windows), and the temporary disk (usually the D: drive on Windows), is lost.

Learn more about how to [reset a lab VM in the Azure Lab Services portal](./how-to-reset-and-redeploy-vm.md#reset-vms).

> [!NOTE]
> Redploying a VM is only available for lab VMs that you created in a lab plan. VMs that are connected to a lab account only support the reset operation.

## Store user data outside the lab VM

When you reset a lab VM, all user data on the VM is lost. To avoid losing this data, you have to store the user data outside of the lab VM. You have different options to configure the template VM:

- [Use OneDrive to store user data](./how-to-prepare-windows-template.md#install-and-configure-onedrive).
- [Attach external file storage](./how-to-attach-external-storage.md), such as Azure Files or Azure NetApp Files.

## Create multiple labs for a course

As students use a lab VM to advance through a course, they might get stuck at specific steps. For example, they're unable to install and configure a software component on the lab VM. To unblock students, you can create multiple labs, based off different template VMs, for each of the key stages in the course.

Learn how to [set up a new lab](./tutorial-setup-lab.md#create-a-lab) and how to [create and manage templates](./how-to-create-manage-template.md).





Educator
    Student blocked on installing software components as part of lab -> educator to create multiple labs (using diff templates) for each of the stages in the course



## Next steps
