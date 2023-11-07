---
title: Troubleshoot lab VM access
titleSuffix: Azure Lab Services
description: Learn the different approaches for troubleshooting lab VMs in Azure Lab Services. Understand how each approach affects user data.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: troubleshooting
ms.date: 12/05/2022
---

# Troubleshoot accessing lab VMs in Azure Lab Services

In this article, you learn about the different approaches for troubleshooting lab VMs. Understand how each approach affects your lab environment and user data on the lab VM. There can be different reasons why you're unable to connect to a lab VM in Azure Lab Services, or why you're stuck to complete a course. For example, the underlying VM is experiencing issues, your organization's firewall settings have changed, or a software change in the lab VM operating system.

## Prerequisites

- To change settings for the lab plan, your Azure account needs the Owner or Contributor role on the lab plan. Learn more about the [Azure Lab Services built-in roles](./concept-lab-services-role-based-access-control.md).

- To redeploy or reimage a lab VM, you need to be either the lab user that is assigned to the VM, or your Azure account has the Owner, Contributor, Lab Creator, or Lab Contributor role. Learn more about the [Azure Lab Services built-in roles](./concept-lab-services-role-based-access-control.md).

## Symptoms

To use and access a lab VM, you connect to it by using Remote Desktop (RDP) or Secure Shell (SSH). You may experience difficulties to access your lab VM:

- You're unable to connect to the lab VM from your computer by using RDP or SSH. There might be a problem with the underlying VM, or a network or firewall configuration might prevent you from connecting.

- You're unable to login to the lab VM.

- After connecting to the lab VM, the VM is not working correctly.

## Troubleshooting steps

### Unable to connect to the lab VM with Remote Desktop (RDP) or Secure Shell (SSH)

1. [Redeploy your lab VM](./how-to-reset-and-redeploy-vm.md#redeploy-a-lab-vm) to another infrastructure node, while maintaining the user data. 

    This approach might help resolve issues with the underlying virtual machine. Learn more about [redeploying versus reimaging a lab VM](#redeploy-versus-reimage-a-lab-vm) and how they affect your user data.

1. [Verify your organization's firewall settings for your lab](./how-to-configure-firewall-settings.md) with the educator and IT admin.

    A change in the organization's firewall or network settings might prevent your computer to connect to the lab VM.

1. If you still can't connect to the lab VM, [reimage the lab VM](./how-to-reset-and-redeploy-vm.md#reimage-a-lab-vm).

    > [!IMPORTANT]
    > Reimaging a lab VM deletes the user data in the VM. Make sure to [store the user data outside the lab VM](#store-user-data-outside-the-lab-vm).

### Unable to login with the credentials you used for creating the lab

When you create a new lab from an exported lab VM image, perform the following steps:

1. Reuse the same credentials that were used in the original, exported, template VM.

1. After the lab creation finishes, you can [reset the password](./how-to-set-virtual-machine-passwords.md).

### After logging in, the lab VM is not working correctly

The lab VM might be malfunctioning as a result of installing a software component, or making a change to the operating system configuration.

1. If the lab VM uses Windows, you might use the Windows System Restore built-in functionality to undo a previous change to the operating system. Verify with an educator or IT admin how to use [System Restore](https://support.microsoft.com/windows/use-system-restore-a5ae3ed9-07c4-fd56-45ee-096777ecd14e).

1. If the lab VM is still in an incorrect state, [reimage the lab VM](./how-to-reset-and-redeploy-vm.md#reimage-a-lab-vm).

    > [!IMPORTANT]
    > Reimaging a lab VM deletes the user data in the VM. Make sure to [store the user data outside the lab VM](#store-user-data-outside-the-lab-vm).

## Redeploy versus reimage a lab VM

Azure Lab Services lets you redeploy or reimage a lab VM. Both operations are similar, and result in the creation of a new virtual machine instance. However, there are fundamental differences that affect the user data on the lab VM.

When you redeploy a lab VM, Azure Lab Services will shut down the VM, move the VM to a new node in within the Azure infrastructure, and then power it back on. You can think of a redeploy operation as a refresh of the underlying VM for your lab. All data that you saved in the [OS disk](/azure/virtual-machines/managed-disks-overview#os-disk) (usually the C: drive on Windows) of the VM will still be available after the redeploy operation. Any data on the [temporary disk](/azure/virtual-machines/managed-disks-overview#temporary-disk) (usually the D: drive on Windows) is lost after a redeploy operation and after a VM shutdown.

Learn more about how to [redeploy a lab VM in the Azure Lab Services website](./how-to-reset-and-redeploy-vm.md#redeploy-a-lab-vm).

When you reimage a lab VM, Azure Lab Services will shut down the VM, delete it, and recreate a new lab VM from the original template VM. You can think of a reimage as a refresh of the entire VM. After you reimage a lab VM, all the data that you saved on the OS disk (usually the C: drive on Windows), and the temporary disk (usually the D: drive on Windows), is lost. To avoid losing data on the VM, [store the user data outside the lab VM](#store-user-data-outside-the-lab-vm).

Learn more about how to [reimage a lab VM in the Azure Lab Services website](./how-to-reset-and-redeploy-vm.md#reimage-a-lab-vm).

> [!NOTE]
> Redeploying a VM is only available for lab VMs that you created in a lab plan. VMs that are connected to a lab account only support the reimage operation.

## Store user data outside the lab VM

When you reimage a lab VM, all user data on the VM is lost. To avoid losing this data, you have to store the user data outside of the lab VM. You have different options to configure the template VM:

- [Use OneDrive to store user data](./how-to-prepare-windows-template.md#install-and-configure-onedrive).
- [Attach external file storage](./how-to-attach-external-storage.md), such as Azure Files or Azure NetApp Files.

## Create multiple labs for a course

As students use a lab VM to advance through a course, they might get stuck at specific steps. For example, they're unable to install and configure a software component on the lab VM. To unblock students, you can create multiple labs, based off different template VMs, for each of the key stages in the course.

Learn how to [set up a new lab](./tutorial-setup-lab.md#create-a-lab) and how to [create and manage templates](./how-to-create-manage-template.md).

## Advanced troubleshooting

[!INCLUDE [contact Azure support](includes/lab-services-contact-azure-support.md)]

## Next steps

- As a lab user, learn how to [reimage or redeploy lab VMs](./how-to-reset-and-redeploy-vm.md).
- As an admin or educator, [attach external file storage to a lab](./how-to-attach-external-storage.md).
- As a lab creator, [use OneDrive to store user data](./how-to-prepare-windows-template.md#install-and-configure-onedrive).
