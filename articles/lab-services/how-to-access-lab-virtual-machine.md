---
title: Access a lab
titleSuffix: Azure Lab Services
description: Learn how to access a lab in Azure Lab Services. Use Teams, Canvas, or the Lab Services website to view, start, stop, and connect to a lab.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 06/29/2023
---

# Access a lab virtual machine in Azure Lab Services

This article describes how you can access your lab virtual machines in Azure Lab Services. Use Teams, Canvas, or the Azure Lab Services website to view, start, stop, and connect to a lab virtual machine.

## Prerequisites

- To register for a lab, you need a lab registration link.
- To view, start, stop, and connect to a lab VM, you need to register for the lab and have an assigned lab VM.

## Access a lab virtual machine

# [Lab Services website](#tab/lab-services-website)

In the Azure Lab Services website, you can view and manage your assigned lab virtual machines. To access the Azure Lab Services website:

1. Go to the Azure Lab Services website (https://labs.azure.com) in a web browser.

1. Sign in with the email address that was granted access to the lab by the lab creator.

> [!IMPORTANT]
> If you have received a lab registration link from the lab creator, you first need to go through a one-time registration process before you can access your labs. The registration process depends on how the lab creator configured the lab.

### Register for the lab

[!INCLUDE [Register for a lab](./includes/lab-services-register-for-lab.md)]

After the registration finishes, confirm that you see the lab virtual machine in **My virtual machines**.

### User account types

Azure Lab Services supports different email account types when registering for a lab:

- An organizational email account that's provided by your Azure Active Directory instance.
- A Microsoft-domain email account, such as *outlook.com*, *hotmail.com*, *msn.com*, or *live.com*.
- A non-Microsoft email account, such as one provided by Yahoo! or Google. You need to link your account with a Microsoft account.

#### Use a non-Microsoft email account

[!INCLUDE [Use non-Microsoft account](./includes/lab-services-non-microsoft-account.md)]

# [Teams](#tab/teams)

When you access a lab in Microsoft Teams, you're automatically registered for the lab, based on your team membership in Microsoft Teams. 

To access your lab in Teams:

1. Sign into Microsoft Teams with your organizational account.

1. Select the team and channel that contain the lab.

1. Select the **Azure Lab Services** tab to view your lab virtual machines.

    :::image type="content" source="./media/how-to-access-lab-virtual-machine/teams-view-lab.png" alt-text="Screenshot of lab in Teams after it's published.":::

    You might see a message that the lab isn't available. This error can occur when the lab isn't published yet by the lab creator, or if the Teams membership information still needs to synchronize.

# [Canvas](#tab/canvas)

When you access a lab in [Canvas](https://www.instructure.com/canvas), you're automatically registered for the lab, based on your course membership in Canvas. Azure Lab Services supports test users in Canvas and the ability for the educator to act as another user.

To access your lab in Canvas:

1. Sign into Canvas by using your Canvas credentials.

1. Go to the course, and then open the **Azure Lab Services** app.

    :::image type="content" source="./media/how-to-access-lab-virtual-machine/canvas-view-lab.png" alt-text="Screenshot of a lab in the Canvas portal.":::

    You might see a message that the lab isn't available. This error can occur when the lab isn't published yet by the lab creator, or if the Canvas course membership still needs to synchronize.

---

## View lab VM details

When you access your lab, either through the Azure Lab Services website, Microsoft Teams, or Canvas, you get the list of lab virtual machines that are assigned to you.

:::image type="content" source="./media/how-to-access-lab-virtual-machine/lab-services-virtual-machine-tile.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services.":::

For each lab VM, you can view the following information:

- Lab name: this name is assigned by the lab creator when creating the lab.
- Operating system: an icon represents the operating system of the lab VM.
- Quota hours: a progress bar shows your assigned and consumed number of quota hours. Learn more about the [quota hours](#view-quota-hours).
- Lab VM status: indicates whether the lab VM is starting, running, or stopped.

In addition, you can also perform specific actions on the lab VM:

- Start or stop the lab VM: learn more about [starting and stopping a lab VM](#start-or-stop-the-lab-vm).
- Connect to the lab VM: select the computer icon to connect to the lab VM with remote desktop or SSH. Learn more about [connecting to the lab VM](./connect-virtual-machine.md).
- Redeploy or reimage the lab VM: learn more how you [redeploy or reimage the lab VM](./how-to-reset-and-redeploy-vm.md) when you experience problems.

## View quota hours

Quota hours are the extra time allotted to you outside of the [scheduled time](./classroom-labs-concepts.md#schedule) for the lab. For example, the time outside of classroom time, to complete homework.

On the lab VM tile, you can view your consumption of [quota hours](how-to-manage-lab-users.md#set-quotas-for-users) in the progress bar. The progress bar color and the message give an indication of the usage:

| Status    | Description |
| --------- | ----------- |
| The progress bar is grayed out | A class is in progress, based on the lab schedule. You don't consume any quota hours during scheduled hours.<br/><br/>:::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-class-in-progress.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when a schedule started the VM."::: | 
| The progress bar is red | You've consumed all your quota hours. If there's a lab schedule, then you can only access the lab VM during the scheduled hours.<br/><br/>:::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-red-color.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when there's quota usage."::: |
| The progress bar is blue | No class is currently in progress and you still have quota hours available to access the lab VM.<br/><br/> :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/progress-bar-blue-color.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when quota has been partially used."::: |
| The text **Available during classes only** is shown | There are no quota hours allocated to the lab. You can only access the lab VM during the scheduled hours for the lab.<br/><br/>:::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/available-during-class.png" alt-text="Screenshot of lab VM tile in Azure Lab Services when there's no quota."::: |

## Start or stop the lab VM

You can start and stop a lab virtual machine from the **My virtual machines** page. If the lab creator configured a lab schedule, the lab VM is automatically started and stopped during the scheduled hours.

Alternately, you can also stop a lab VM by using the operating system shutdown command from within the lab VM. The preferred method to stop a lab VM is to use the **My virtual machines** page to avoid incurring additional costs.

> [!WARNING]
> If you use the OS shutdown command inside the lab VM, you might still incur costs. The preferred method is to use the stop action on the **My virtual machines** page. When you use lab plans, Azure Lab Services will detect when the lab VM is shut down, marks the lab VM as stopped, and billing stops.

To start or stop a lab VM:

1. Go to the **My virtual machines** page in Teams, Canvas, or the [Azure Lab Services website](https://labs.azure.com).

1. Use the toggle control next to the lab VM status to start or stop the lab VM.

    When the VM is in progress of starting or stopping, the control is inactive.

    Starting or stopping the lab VM might take some time to complete.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/start-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the status toggle and status label on the VM tile.":::

1. After the operation finishes, confirm that the lab VM status is correct.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-running.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the status label on the VM tile.":::

## Connect to the lab VM

When the lab virtual machine is running, you can remotely connect to the VM. Depending on the lab VM operating system configuration, you can connect by using remote desktop (RDP) or secure shell (SSH).

If there are no quota hours available, you can't start the lab VM outside the scheduled lab hours and can't connect to the lab VM.

Learn more about how to [connect to a lab VM](connect-virtual-machine.md).

## Next steps

- Learn how to [change your lab VM password](./how-to-set-virtual-machine-passwords-student.md)
- Learn how to [redeploy or reimage your lab VM](./how-to-reset-and-redeploy-vm.md)
- Learn about [key concepts in Azure Lab Services](./classroom-labs-concepts.md), such as quota hours or lab schedules.
