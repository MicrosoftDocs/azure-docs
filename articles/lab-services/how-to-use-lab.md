---
title: How to access and manage a lab VM
titleSuffix: Azure Lab Services
description: Learn how to register to a lab.  Also learn how to view, start, stop, and connect to all the lab VMs assigned to you. 
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 02/01/2023
---

# Access a lab in Azure Lab Services

Before you can access a lab in Azure Lab Services, you need to first register to the lab. In this article, you learn how to register for a lab, connect to a lab virtual machine (VM), start and stop the lab VM, and how to monitor your quota hours.

## Prerequisites

- To register for a lab, you need a lab registration link.
- To view, start, stop, and connect to a lab VM, you need to register for the lab and have an assigned lab VM.

## Register to the lab

To get access to a lab and connect to the lab VM from the Azure Lab Services website, you first need to register for the lab by using a lab registration link. The lab creator can [provide the registration link for the lab](./how-to-configure-student-usage.md#send-invitations-to-users).

To register for a lab by using the registration link:

1. Open the lab registration URL in a browser. 

    After you complete the lab registration, you no longer need the registration link. Instead, you can navigate to the Azure Lab Services website (https://labs.azure.com) to access your labs.

    :::image type="content" source="./media/how-to-use-lab/register-lab.png" alt-text="Screenshot of registration link for lab.":::

1. Sign in to the service using your organizational or school account to complete the registration.

    > [!NOTE]
    > You need a Microsoft account to use Azure Lab Services, unless you're using Canvas. If you try to use your non-Microsoft account, such as Yahoo or Google accounts, to sign in to the portal, follow the instructions to create a Microsoft account that's linked to your non-Microsoft account. Then, follow the steps to complete the lab registration process.

1. After the registration finishes, confirm that you see the lab virtual machine in **My virtual machines**.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/accessible-vms.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services.":::

## View your lab virtual machines

You can view all your assigned lab virtual machines to you in the Azure Lab Services website. Alternately, if your organization uses Azure Lab Services with Microsoft Teams or Canvas, learn how you can [access your lab VMs in Microsoft Teams](./how-to-access-vm-for-students-within-teams.md) or [access your lab VMs in Canvas](./how-to-access-vm-for-students-within-canvas.md).

1. Go to the [Azure Lab Services website](https://labs.azure.com).

1. The page has a tile for each lab VM that you have access to. The VM tile shows the VM details and provides access to functionality for controlling the lab VM:

    - In the top-left, notice the name of the lab. The lab creator specifies the lab name when creating the lab.
    - In the top-right, you can see an icon that represents the operating system (OS) of the VM.
    - In the center, you can see a progress bar that shows your [quota hours consumption](#view-quota-hours).
    - In the bottom-left, you can see the status of the lab VM and a control to [start or stop the VM](#start-or-stop-the-vm).
    - In the bottom-right, you have the control to [connect to the lab VM](./connect-virtual-machine.md) with remote desktop (RDP) or secure shell (SSH).
    - Also in the bottom-right, you can [reset or troubleshoot the lab VM](./how-to-reset-and-redeploy-vm.md), if you experience problems with the VM.

    :::image type="content" source="./media/how-to-use-lab/lab-services-virtual-machine-tile.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the VM tile sections.":::

## Start or stop the VM

As a lab user, you can start or stop a lab VM from the Azure Lab Services website. Alternately, you can also stop a lab VM by using the operating system shutdown command from within the lab VM. The preferred method to stop a lab VM is to use the [Azure Lab Services website](https://labs.azure.com) to avoid incurring additional costs.

> [!TIP]
> With the [April 2022 Updates](lab-services-whats-new.md), Azure Lab Services will detect when a lab user shuts down their VM using the OS shutdown command. After a long delay to ensure the VM wasn't being restarted, the lab VM will be marked as stopped and billing will discontinue.

To start or stop a lab VM in the Azure Lab Services website:

1. Go to the [Azure Lab Services website](https://labs.azure.com).

1. Use the toggle control in the bottom-left of the VM tile to start or stop the lab VM.

    Depending on the current status of the lab VM, the toggle control starts or stops the VM. When the VM is in progress of starting or stopping, the control is inactive.

    Starting or stopping the lab VM might take some time to complete.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/start-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the status toggle and status label on the VM tile.":::

1. After the operation finishes, confirm that the lab VM status is correct.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-running.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the status label on the VM tile.":::

## Connect to the VM

Depending on the lab VM operating system configuration, you can use remote desktop (RDP) or secure shell (SSH) to connect to your lab VM. Learn more about how to [connect to a lab VM](connect-virtual-machine.md).

## View quota hours

On the lab VM tile in the [Azure Lab Services website](https://labs.azure.com), you can view your consumption of [quota hours](how-to-configure-student-usage.md#set-quotas-for-users) in the progress bar. Quota hours are the extra time allotted to you outside of the [scheduled time](./classroom-labs-concepts.md#schedule) for the lab. For example, the time outside of classroom time, to complete homework.

The color of the progress bar and the text under the progress bar changes depending on the scenario:

- A class is in progress, according to the lab schedules: the progress bar is grayed out to represent that you didn't use quota hours.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-class-in-progress.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when a schedule started the VM.":::

- The lab has no quota (zero hours): the text **Available during classes only** shows in place of the progress bar.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/available-during-class.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when there's no quota.":::

- You ran out of quota: the color of the progress bar is **red**.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-red-color.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when there's quota usage.":::

- No class is in progress, according to the lab schedules: the color of the progress bar is **blue** to indicate that it's outside the scheduled time for the lab, and some of the quota time was used.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-blue-color.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when quota has been partially used.":::

## Next steps

See the following articles:

- [As an admin, create and manage lab plans](how-to-manage-lab-plans.md)
- [As a lab owner, create and manage labs](how-to-manage-labs.md)
- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
