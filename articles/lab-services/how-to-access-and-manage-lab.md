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

# Access a lab in Azure Lab Services

This article describes how you can access labs in Azure Lab Services. Use Teams, Canvas, or the Lab Services website to view, start, stop, and connect to a lab.

Before you can access a lab in Azure Lab Services, you need to first register to the lab. In this article, you learn how to register for a lab, connect to a lab virtual machine (VM), start and stop the lab VM, and how to monitor your quota hours.

## Prerequisites

- To register for a lab, you need a lab registration link.
- To view, start, stop, and connect to a lab VM, you need to register for the lab and have an assigned lab VM.

## Access a lab

# [Lab Services website](#tab/als-website)

You can access your labs by navigating to the Azure Lab Services website (https://labs.azure.com).

Depending on how the lab creator has assigned you to the lab, you might have to register for the lab with your email address before you can access your lab.

### Register for the lab

[!INCLUDE [Register for a lab](./includes/lab-services-register-for-lab.md)]

1. After the registration finishes, confirm that you see the lab virtual machine in **My virtual machines**.

### User account types

Azure Lab Services supports different email account types when registering for a lab:

- An organizational email account that's provided by your Azure Active Directory instance.
- A Microsoft-domain email account, such as *outlook.com*, *hotmail.com*, *msn.com*, or *live.com*.
- A non-Microsoft email account, such as one provided by Yahoo! or Google. You need to link your account with a Microsoft account.
- A GitHub account. You need to link your account with a Microsoft account.

#### Use a non-Microsoft email account

You can use non-Microsoft email accounts to register and sign in to a lab.  However, the registration requires that you first create a Microsoft account that's linked to your non-Microsoft email address.

You might already have a Microsoft account that's linked to your non-Microsoft email address. For example, users already have a Microsoft account if you've used this email address with other Microsoft products or services, such as Office, Skype, OneDrive, or Windows.

When you use the lab registration link to sign into a lab, you're prompted for your email address and password. If you sign in with a non-Microsoft account that's not linked to a Microsoft account, you receive the following error message:

:::image type="content" source="./media/how-to-access-and-manage-lab/cant-find-account.png" alt-text="Screenshot that shows the sign-in error message for the Azure Lab Services website." lightbox="./media/how-to-access-and-manage-lab/cant-find-account.png":::

Follow these steps to [sign up for a new Microsoft account](https://signup.live.com).

#### Use a GitHub account

You can use an existing GitHub account to register and sign into a lab. If you already have a Microsoft account that's linked to your GitHub account, you can sign in and continue the lab registration process.

To link your GitHub account to a Microsoft account:

1. Select the **Sign-in options** link:

    :::image type="content" source="./media/how-to-access-and-manage-lab/signin-options.png" alt-text="Screenshot that shows the Microsoft sign in window, highlighting the Sign-in options link.":::

1. In the **Sign-in options** window, select **Sign in with GitHub**.

    :::image type="content" source="./media/how-to-access-and-manage-lab/signin-github.png" alt-text="Screenshot that shows the Microsoft sign-in options window, highlighting the option to sign in with GitHub.":::

    At the prompt, you then create a Microsoft account that's linked to your GitHub account. The linking happens automatically when you select **Next**. You're then immediately signed in and connected to the lab.

# [Teams](#tab/teams)

When you access a lab in Microsoft Teams, you're automatically registered for the lab, based on your team membership in Microsoft Teams. 

To access your lab in Teams:

1. Sign into Microsoft Teams with your organizational account.
1. Go to the Teams channel, and then select the **Azure Lab Services** tab.

    :::image type="content" source="./media/how-to-access-and-manage-lab/published-lab.png" alt-text="Screenshot of lab in Teams after it's published.":::

You might see a message that the lab isn't available if the lab isn't published yet by the lab creator, or if the Teams membership information still needs to synchronize.

:::image type="content" source="./media/how-to-access-and-manage-lab/not-published-lab.png" alt-text="Screenshot of lab before it's published." lightbox="./media/media/how-to-access-and-manage-lab/not-published-lab.png":::

# [Canvas](#tab/canvas)

When you access a lab in [Canvas](https://www.instructure.com/canvas), you're automatically registered for the lab, based on your course membership in Canvas. Azure Lab Services supports test users in Canvas and the ability for the educator to act as another user.

To access your lab in Canvas:

1. Sign into Canvas by using your Canvas credentials.

1. Go to the course, and then open the **Azure Lab Services** app.

    :::image type="content" source="./media/how-to-access-and-manage-lab/canvas-view-lab.png" alt-text="Screenshot of a lab in the Canvas portal.":::

You might see a message that the lab isn't available if the lab isn't published yet by the lab creator, or if the Teams membership information still needs to synchronize.

:::image type="content" source="./media/how-to-access-and-manage-lab/troubleshooting-lab-isnt-available-yet.png" alt-text="Screenshot that shows the lab isn't available yet.":::

---

## View the lab virtual machines

You can view all your assigned lab virtual machines to you in the Azure Lab Services website. Alternately, if your organization uses Azure Lab Services with Microsoft Teams or Canvas, learn how you can [access your lab VMs in Microsoft Teams](./how-to-access-vm-for-students-within-teams.md) or [access your lab VMs in Canvas](./how-to-access-vm-for-students-within-canvas.md).

1. Go to the [Azure Lab Services website](https://labs.azure.com).

1. The page has a tile for each lab VM that you have access to. The VM tile shows the VM details and provides access to functionality for controlling the lab VM:

    - In the top-left, notice the name of the lab. The lab creator specifies the lab name when creating the lab.
    - In the top-right, you can see an icon that represents the operating system (OS) of the VM.
    - In the center, you can see a progress bar that shows your [quota hours consumption](#view-quota-hours).
    - In the bottom-left, you can see the status of the lab VM and a control to [start or stop the VM](#start-or-stop-the-lab-vm).
    - In the bottom-right, you have the control to [connect to the lab VM](./connect-virtual-machine.md) with remote desktop (RDP) or secure shell (SSH).
    - Also in the bottom-right, you can [reset or troubleshoot the lab VM](./how-to-reset-and-redeploy-vm.md), if you experience problems with the VM.

    :::image type="content" source="./media/how-to-access-and-manage-lab/lab-services-virtual-machine-tile.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the VM tile sections.":::

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

## Start or stop the lab VM

As a lab user, you can start or stop a lab VM from the Azure Lab Services website. Alternately, you can also stop a lab VM by using the operating system shutdown command from within the lab VM. The preferred method to stop a lab VM is to use the [Azure Lab Services website](https://labs.azure.com) to avoid incurring additional costs.

> [!TIP]
> With the [April 2022 Updates](lab-services-whats-new.md), Azure Lab Services will detect when a lab user shuts down a lab VM using the OS shutdown command. After a long delay to ensure the VM wasn't being restarted, the lab VM will be marked as stopped and billing will discontinue.

To start or stop a lab VM in the Azure Lab Services website:

1. Go to the [Azure Lab Services website](https://labs.azure.com).

1. Use the toggle control in the bottom-left of the VM tile to start or stop the lab VM.

    Depending on the current status of the lab VM, the toggle control starts or stops the VM. When the VM is in progress of starting or stopping, the control is inactive.

    Starting or stopping the lab VM might take some time to complete.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/start-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the status toggle and status label on the VM tile.":::

1. After the operation finishes, confirm that the lab VM status is correct.

    :::image type="content" source="./media/tutorial-connect-vm-in-classroom-lab/vm-running.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the status label on the VM tile.":::

## Connect to the lab VM

Depending on the lab VM operating system configuration, you can use remote desktop (RDP) or secure shell (SSH) to connect to your lab VM. Learn more about how to [connect to a lab VM](connect-virtual-machine.md).

## Next steps

See the following articles:

- [As an admin, create and manage lab plans](how-to-manage-lab-plans.md)
- [As a lab owner, create and manage labs](how-to-manage-labs.md)
- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
