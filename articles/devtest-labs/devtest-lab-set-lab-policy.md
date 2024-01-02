---
title: Control costs with lab policies
description: Learn how to define lab policies such as VM sizes, maximum VMs per user, and shutdown automation.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Manage lab policies to control costs in Azure DevTest Labs

This article describes how you can manage Azure DevTest Labs policies to control lab costs and minimize waste. Lab policies you can set to control costs include:

- Allowed virtual machine (VM) sizes
- Maximum VMs per user
- Maximum VMs per lab
- Auto-shutdown settings
- Auto-shutdown policy settings
- Autostart settings

## Access lab Configuration and policies

1. In the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040), on the **Overview** page for your lab, select **Configuration and policies** from the left navigation.

   :::image type="content" source="./media/devtest-lab-set-lab-policy/configuration-policies-menu.png" alt-text="Screenshot that shows the Configuration and policies menu for a lab.":::

1. On the **Configuration and policies** page, select the policy you want to configure from the left navigation.
   
   :::image type="content" source="./media/devtest-lab-set-lab-policy/policies-menu.png" alt-text="Screenshot that shows a lab's Configuration and Policies options.":::

## Set allowed virtual machine sizes

This policy specifies the VM sizes that users can create in the lab.

1. On the lab's **Configuration and policies** page, select **Allowed virtual machines sizes** from the left navigation.
   
1. On the **Allowed virtual machines sizes** screen, select **Yes** or **No** to enable or disable the policy.

1. If you enable the policy, select the VM sizes to allow in the lab.

1. Select **Save**.

   :::image type="content" source="./media/devtest-lab-set-lab-policy/allowed-vm-sizes.png" alt-text="Screenshot showing Allowed virtual machines sizes.":::

## Set virtual machines per user

This policy specifies the maximum number of VMs that an individual lab user can own.

1. On the lab's **Configuration and policies** page, select **Virtual machines per user** from the left navigation.

1. On the **Virtual machines per user** screen, under **Limit the number of virtual machines**, select **On** or **Off** to enable or disable the policy.

1. If you enable the policy, under **What is the limit**, enter the maximum number of VMs that a user can own.

1. Under **Limit the number of virtual machines using premium OS disks**, select **On** or **Off** to enable or disable limiting the number of a user's VMs that use premium solid-state disks (SSDs).

1. If you selected **On**, enter the maximum number of VMs using premium disks that a user can own.

   > [!NOTE]
   > This policy applies only to Premium SSDs. The limitation doesn't apply to Standard SSDs.

1. Select **Save**.

   :::image type="content" source="./media/devtest-lab-set-lab-policy/max-vms-per-user.png" alt-text="Screenshot showing Virtual machines per user.":::

If a user tries to create or claim a VM when the user limit has been met, an error message indicates that the user can't exceed their VM limit.

:::image type="content" source="./media/devtest-lab-set-lab-policy/error.png" alt-text="Screenshot showing the error that the user can't exceed their VM limit.":::

## Set virtual machines per lab

This policy specifies the maximum number of VMs that all users can create or claim in the current lab.

1. On the lab's **Configuration and policies** page, select **Virtual machines per lab** from the left navigation.

1. On the **Virtual machines per user** screen, under **Limit the number of virtual machines**, select **On** or **Off** to enable or disable the policy.

1. If you enable the policy, under **What is the limit**, enter the maximum number of VMs that can be created or claimed.

1. Under **Limit the number of virtual machines using premium OS disks**, select **On** or **Off** to enable or disable limiting the number of VMs that use premium SSDs.

1. If you selected **On**, enter the maximum number of VMs that can use premium disks.

1. Select **Save**.

   :::image type="content" source="./media/devtest-lab-set-lab-policy/max-vms-per-lab.png" alt-text="Screenshot showing Virtual machines per lab.":::

If a user tries to create or claim a VM when the lab limit has been met, an error message indicates that the VM can't be created or claimed.

## Set auto-shutdown

Auto-shutdown helps minimize lab waste by shutting down lab VMs at a specific time of day.

1. On the lab's **Configuration and policies** page, select **Auto-shutdown** from the left navigation.

1. On the **Auto-shutdown** screen, for **Enabled**, select **On** or **Off** to enable or disable the policy.

1. For **Scheduled shutdown** and **Time zone**, if you enabled auto-shutdown, specify the time and time zone to shut down all lab VMs.

1. For **Send notification before auto-shutdown**, select **Yes** or **No** for the option to send a notification before the specified auto-shutdown time.

   If you choose **Yes**, enter a webhook URL endpoint under **Webhook URL** or semicolon-separated email addresses under **Email address** where you want to post or send the notification.

1. Select **Save**.

   :::image type="content" source="./media/devtest-lab-set-lab-policy/auto-shutdown.png" alt-text="Screenshot showing Auto shutdown.":::

By default, auto-shutdown applies to all lab VMs. If allowed by policy, lab users can override auto-shutdown settings for their individual lab VMs. To access auto-shutdown settings for individual VMs:

1. Select the VM from **My virtual machines** on the lab **Overview** page.
1. On the home page for the VM, in the **Operations** section of the left navigation, select **Auto-shutdown**.

For more information about auto-shutdown and sending notifications, see [Configure auto shutdown for labs and VMs in DevTest Labs](devtest-lab-auto-shutdown.md).

## Set auto-shutdown policy

Lab owners can configure auto-shutdown on all lab VMs centrally, and set a policy to let lab users override the settings for their own VMs. You can set auto-shutdown policy to allow lab users full control, partial control, or no control over their own VMs' auto-shutdown activity.

> [!IMPORTANT]
> Auto-shutdown policy changes apply only to new lab VMs, not to already-existing VMs.

1. On the lab's **Configuration and policies** page, select **Auto shutdown policy** from the left navigation.

1. Select one of the following options:

   - **User sets a schedule and can opt out**: Lab users can override or opt out of lab auto-shutdown. Lab users can override the lab schedule, and they don't have to set any auto-shutdown for their VMs.

   - **User sets a schedule and cannot opt out**: Lab users can override the lab schedule for their VMs, but they can't opt out of auto-shutdown. This option ensures that every VM in the lab is on some auto-shutdown schedule.

   - **User has no control over the schedule set by lab administrator**: Lab users can't override or opt out of the lab auto-shutdown schedule. Lab users can set up auto-shutdown notifications for their own VMs.

1. Select **Save**.

   :::image type="content" source="./media/devtest-lab-set-lab-policy/auto-shutdown-policy-options.png" alt-text="Screenshot showing Auto-shutdown policy options.":::

For more information and details about auto-shutdown policy, see [Configure lab auto shutdown policy](devtest-lab-auto-shutdown.md#configure-lab-auto-shutdown-policy).

## Set autostart

Autostart policy helps you minimize waste by specifying a specific time of day and days of the week to start up all lab VMs.

1. On the lab's **Configuration and policies** page, select **Auto-start** from the left navigation.

1. Select **Yes** or **No** to enable or disable the policy.

1. If you enable this policy, specify the **Scheduled start**, **Time zone**, and **Days of the week** to start up the lab VMs.

1. Select **Save**.

   :::image type="content" source="./media/devtest-lab-set-lab-policy/auto-start.png" alt-text="Screenshot showing the Autostart selection.":::

> [!NOTE]
> This policy isn't automatically applied to current VMs in the lab. To apply this setting to current VMs, open the VM's page and change its **Auto-start** setting.

For more information and details about autostart policy, see [Start up lab virtual machines automatically](devtest-lab-auto-startup-vm.md).

## Next steps

Besides setting policies, here are more ways to control and manage DevTest Labs costs:

- [Set a VM expiration date](devtest-lab-use-resource-manager-template.md#set-vm-expiration-date) when you create the VM.
- [Delete labs or lab VMs](devtest-lab-delete-lab-vm.md) when you're finished with them.
- [View and manage lab costs](devtest-lab-configure-cost-management.md), trends, and targets.

