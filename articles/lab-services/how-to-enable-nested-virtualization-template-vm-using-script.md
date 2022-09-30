---
title: Enable nested virtualization on a template VM in Azure Lab Services (Script) | Microsoft Docs
description: Learn how to create a template VM with multiple VMs inside by using a script.  In other words, enable nested virtualization on a template VM in Azure Lab Services. 
ms.topic: how-to
ms.date: 06/26/2020
---

# Enable nested virtualization on a template virtual machine in Azure Lab Services using a script

Nested virtualization enables you to create a multi-VM environment inside a lab's template virtual machine. Publishing the template will provide each user in the lab with a virtual machine set up with multiple VMs within it.  For more information about nested virtualization and Azure Lab Services, see [Enable nested virtualization on a template virtual machine in Azure Lab Services](how-to-enable-nested-virtualization-template-vm.md).

The steps in this article focus on setting up nested virtualization for Windows Server 2016, Windows Server 2019, or Windows 10. You will use a script to set up template machine with Hyper-V.  The following steps will guide you through how to use the [Lab Services Hyper-V scripts](https://github.com/Azure/LabServices/tree/main/General_Scripts/PowerShell/HyperV).

>[!IMPORTANT]
>Select **Large (nested virtualization)** or **Medium (nested virtualization)** for the virtual machine size when creating the lab.  Nested virtualization will not work otherwise.  

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
