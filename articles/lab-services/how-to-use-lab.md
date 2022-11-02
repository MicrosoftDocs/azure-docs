---
title: How to access a lab in Azure Lab Services | Microsoft Docs
description: Learn how to register to a lab.  Also learn how to view, start, stop, and connect to all the lab VMs assigned to you. 
ms.topic: how-to
ms.date: 02/01/2022
---

# How to access a lab in Azure Lab Services

Learn how to register for a lab.  Also learn how to view, start, stop, and connect to all the lab VMs assigned to you.

## Register to the lab

1. Navigate to the **registration URL** that you received from the educator. You don't need to use the registration URL after you complete the registration. Instead, use the URL: [https://labs.azure.com](https://labs.azure.com).

    :::image type="content" source="./media/how-to-use-lab/register-lab.png" alt-text="Screenshot of registration link for lab.":::

1. Sign in to the service using your school account to complete the registration.

    > [!NOTE]
    > A Microsoft account is required for using Azure Lab Services unless using Canvas.  If you are trying to use your non-Microsoft account such as Yahoo or Google accounts to sign in to the portal, follow instructions to create a Microsoft account that will be linked to your non-Microsoft account. Then, follow the steps to complete the registration process.
1. Once registered, confirm that you see the virtual machine for the lab you have access to.
    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/accessible-vms.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services.":::
1. Wait until the virtual machine is ready. On the VM tile, notice the following fields:
    1. At the top of the tile, you see the **name of the lab**.
    1. To its right, you see the icon representing the **operating system (OS)** of the VM. In this example, it's Windows OS.
    1. You see icons/buttons at the bottom of the tile to start/stop the VM, and connect to the VM.
    1. To the right of the buttons, you see the status of the VM. Confirm that you see the status of the VM is **Stopped**.
        :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-in-stopped-state.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services. The status toggle and Stopped label are highlighted.":::

## Start or stop the VM

1. **Start** the VM by selecting the first button as shown in the following image. This process takes some time.  
    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/start-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services. The status toggle and Starting label on the VM tile are highlighted.":::
1. Confirm that the status of the VM is set to **Running**.
    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-running.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services. The Running label on the VM tile is highlighted.":::

    Notice that the status toggle is in the on position.  Select the status toggle again to **stop** the VM.

Using the [Azure Lab Services portal](https://labs.azure.com/virtualmachines) is the preferred method for a student to stop their lab VM.  However, with the [April 2022 Updates](lab-services-whats-new.md), Azure Lab Services will detect when a student shuts down their VM using the OS shutdown command.  After a long delay to ensure the VM wasn't being restarted, the lab VM will be marked as stopped and billing will discontinue.  

## Connect to the VM

For OS-specific instructions to connect to your lab VM, see [Connect to a lab VM](connect-virtual-machine.md).

## Progress bar

The progress bar on the tile shows the number of hours used against the number of [quota hours](how-to-configure-student-usage.md#set-quotas-for-users) assigned to you. This time is the extra time allotted to you in outside of the scheduled time for the lab. The color of the progress bar and the text under the progress bar varies.  Let's cover the scenarios you might see.

- If a class is in progress (within the schedule of the class), progress bar is grayed out to represent quota hours aren't being used.
    <br/>:::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-class-in-progress.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when VM has been started by a schedule.":::
- If a quota isn't assigned (zero hours), the text **Available during classes only** is shown in place of the progress bar.
    <br/>:::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/available-during-class.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when no quota has been assigned.":::
- If you ran **out of quota**, the color of the progress bar is **red**.
    <br/>:::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-red-color.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when quota has been used.":::
- The color of the progress bar is **blue** when it's outside the scheduled time for the lab and some of the quota time has been used.
    <br/>:::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-blue-color.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when quota has been partially used.":::

## Next steps

See the following articles:

- [As an admin, create and manage lab plans](how-to-manage-lab-plans.md)
- [As a lab owner, create and manage labs](how-to-manage-labs.md)
- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
