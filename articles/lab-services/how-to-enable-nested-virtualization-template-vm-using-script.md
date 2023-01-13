---
title: Enable nested virtualization on a template VM
titleSuffix: Azure Lab Services
description: Learn how to enable nested virtualization on a template VM in Azure Lab Services by using a script. Nested virtualization enables you to create a lab with multiple VMs inside it.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 01/13/2023
---

# Enable nested virtualization on a template virtual machine in Azure Lab Services by using a script

Nested virtualization enables you to create a multi-VM environment inside a lab's template virtual machine. Publishing the template will provide each user in the lab with a virtual machine set up with multiple VMs within it. For more information about nested virtualization and Azure Lab Services, see [Enable nested virtualization on a template virtual machine in Azure Lab Services](how-to-enable-nested-virtualization-template-vm.md).

The steps in this article focus on setting up nested virtualization for Windows Server 2016, Windows Server 2019, or Windows 10. You will use a script to set up a template VM with Hyper-V. The following steps will guide you through how to use the [Lab Services Hyper-V scripts](https://github.com/Azure/LabServices/tree/main/ClassTypes/PowerShell/HyperV).

>[!IMPORTANT]
>Select **Large (nested virtualization)** or **Medium (nested virtualization)** for the virtual machine size when creating the lab. Nested virtualization will not work otherwise. 

## Prerequisites

- A lab plan and one or more labs. Learn how to [Set up a lab plan](tutorial-setup-lab-plan.md) and [Set up a lab](tutorial-setup-lab.md).
- Permission to edit the lab. Learn how to [Add a user to the Lab Creator role](tutorial-setup-lab-plan.md#add-a-user-to-the-lab-creator-role). For more role options, see [Lab Services built-in roles](administrator-guide.md#rbac-roles).

## Run script

1. Launch **PowerShell** in **Administrator** mode.
1. You may have to change the execution policy to successfully run the script. Run the following command:

    ```powershell
    Set-ExecutionPolicy bypass -force
    ```

1. Download and run the script:

    ```powershell
    Invoke-WebRequest 'https://aka.ms/azlabs/scripts/hyperV-powershell' -Outfile SetupForNestedVirtualization.ps1
    .\SetupForNestedVirtualization.ps1
    ```

    > [!NOTE]
    > The script may require the machine to be restarted. Follow instructions from the script and re-run the script until **Script completed** is seen in the output.
1. Don't forget to reset the execution policy. Run the following command:

    ```powershell
    Set-ExecutionPolicy default -force
    ```

## Conclusion

Now your template machine is ready to create Hyper-V virtual machines. See [Create a Virtual Machine in Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v) for instructions on how to create Hyper-V virtual machines. Also, see [Microsoft Evaluation Center](https://www.microsoft.com/evalcenter/) to check out available operating systems and software. 

## Next steps

Next steps are common to setting up any lab.

- [Add users](tutorial-setup-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)
