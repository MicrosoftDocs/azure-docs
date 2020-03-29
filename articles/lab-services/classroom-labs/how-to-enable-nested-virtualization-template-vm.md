---
title: Enable nested virtualization on a template VM in Azure Lab Services | Microsoft Docs
description: Learn how to create a template VM with multiple VMs inside.  In other words, enable nested virtualization on a template VM in Azure Lab Services. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/04/2019
ms.author: spelluru

---
# Enable nested virtualization on a template virtual machine in Azure Lab Services

Currently, Azure Lab Services enables you to set up one template virtual machine in a lab and make a single copy available to each of your users. If you are a professor teaching networking, security, or IT classes, you may need to provide each of your students with an environment in which multiple virtual machines can talk to each other over a network.

Nested virtualization enables you to create a multi-VM environment inside a lab's template virtual machine. Publishing the template will provide each user in the lab with a virtual machine set up with multiple VMs within it.  This article covers how to set up nested virtualization on a template machine in Azure Lab Services.

## What is nested virtualization?

Nested virtualization enables you to create virtual machines within a virtual machine. Nested virtualization is done through Hyper-V, and is only available on Windows VMs.

For more information about nested virtualization, see the following articles:

- [Nested Virtualization in Azure](https://azure.microsoft.com/blog/nested-virtualization-in-azure/)
- [How to enable nested virtualization in an Azure VM](../../virtual-machines/windows/nested-virtualization.md)

## Considerations

Before setting up a lab with nested virtualization, here are a few things to take into consideration.

- When creating a new lab, select **Medium (Nested virtualization)** or **Large (Nested virtualization)** sizes for the virtual machine size. These virtual machine sizes support nested virtualization.
- Choose a size that will provide good performance for both the host and client virtual machines.  Remember, when using virtualization, the size you choose must be adequate for not just one machine, but the host as well as any client machines that must be run concurrently.
- Client virtual machines will not have access to Azure resources, such as DNS servers on the Azure virtual network.
- Host virtual machine requires setup to allow for the client machine to have internet connectivity.
- Client virtual machines are licensed as independent machines. See [Microsoft Licensing](https://www.microsoft.com/licensing/default) for information about licensing for Microsoft operation systems and products. Check licensing agreements for any other software being used before setting up the template machine.

## Enable nested virtualization on a template VM

This article assumes that you have created a lab account and lab.  For more information about creating a new lab account, see [tutorial to set up a Lab Account](tutorial-setup-lab-account.md). For more information how to create  lab, see [set up a classroom lab tutorial](tutorial-setup-classroom-lab.md).

>[!IMPORTANT]
>Select **Large (nested virtualization)** or **Medium (nested virtualization)** for the virtual machine size when creating the lab.  Nested virtualization will not work otherwise.  

To connect to the template machine, see [create and manage a classroom template](how-to-create-manage-template.md).

### Using script to enable nested virtualization

To use the automated setup for nested virtualization with Windows Server 2016 or Windows Server 2019, see [Enable nested virtualization on a template virtual machine in Azure Lab Services using a script](how-to-enable-nested-virtualization-template-vm-using-script.md). You will use scripts from [Lab Services Hyper-V scripts](https://github.com/Azure/azure-devtestlab/tree/master/samples/ClassroomLabs/Scripts/HyperV) to install the Hyper-V role.  The scripts will also set up networking so the Hyper-V virtual machines can have internet access.

### Using Windows tools to enable nested virtualization

The setup nested virtualization for Windows Server 2016 or Windows Server 2019 using Windows roles and administrative tools, see [Enable nested virtualization on a template virtual machine in Azure Lab Services manually](how-to-enable-nested-virtualization-template-vm-ui.md).  Instructions will also cover how to set up networking so the Hyper-V virtual machines can have internet access.
