---
title: Configure auto-start settings for a VM
description: Learn how to configure auto-start settings for VMs in a lab. This setting allows VMs in the lab to be automatically started on a schedule. 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Automatically start lab VMs with auto-start in Azure DevTest Labs

This article shows how to configure and apply an auto-start policy for Azure DevTest Labs virtual machines (VMs). Auto-start automatically starts up lab VMs at specified times and days.

To implement auto-start, you configure an auto-start policy for the lab first. Then, you can enable the policy for individual lab VMs. Requiring individual VMs to enable auto-start helps prevent unnecessary startups that could increase costs.

You can also configure auto-shutdown policies for lab VMs. For more information, see [Manage auto shutdown policies for a lab in Azure DevTest Labs](devtest-lab-auto-shutdown.md).

## Configure auto-start for the lab

To configure auto-start policy for a lab, follow these steps. After configuring the policy, [enable auto-start](#add-vms-to-the-auto-start-schedule) for each VM that you want to auto-start.

1. On your lab **Overview** page, select **Configuration and policies** under **Settings** in the left navigation.

   :::image type="content" source="./media/devtest-lab-auto-startup-vm/configuration-policies-menu.png" alt-text="Screenshot that shows selecting Configuration and policies in the left navigation menu.":::

1. On the **Configuration and policies** page, select **Auto-start** under **Schedules** in the left navigation.

1. Select **Yes** for **Allow auto-start**.

    :::image type="content" source="./media/devtest-lab-auto-startup-vm/portal-lab-auto-start.png" alt-text="Screenshot of Auto-start option under Schedules.":::
 
1. Enter a **Scheduled start** time, select a **Time zone**, and select the checkboxes next to the **Days of the week** that you want to apply the schedule.

1. Select **Save**.

   :::image type="content" source="./media/devtest-lab-auto-startup-vm/auto-start-configuration.png" alt-text="Screenshot of auto-start schedule settings.":::

## Add VMs to the auto-start schedule

After you configure the auto-start policy, follow these steps for each VM that you want to auto-start.

1. On your lab **Overview** page, select the VM under **My virtual machines**.

   :::image type="content" source="./media/devtest-lab-auto-startup-vm/select-vm.png" alt-text="Screenshot of selecting a VM from the list under My virtual machines.":::

1. On the VM's **Overview** page, select **Auto-start** under **Operations** in the left navigation.

1. On the **Auto-start** page, select **Yes** for **Allow this virtual machine to be scheduled for automatic start**, and then select **Save**.

   :::image type="content" source="./media/devtest-lab-auto-startup-vm/select-auto-start.png" alt-text="Screenshot of selecting Yes on the Auto-start page.":::

1. On the VM Overview page, your VM shows **Opted-in** status for auto-start.
 
   :::image type="content" source="media/devtest-lab-auto-startup-vm/vm-overview-auto-start.png" alt-text="Screenshot showing vm with opted-in status for auto-start checked." lightbox="media/devtest-lab-auto-startup-vm/vm-overview-auto-start.png":::

   You can also see the auto-start status for the VM on the lab Overview page.   

   :::image type="content" source="media/devtest-lab-auto-startup-vm/lab-overview-auto-start-status.png" alt-text="Screenshot showing the lab overview page, with VM auto-start set to Yes." lightbox="media/devtest-lab-auto-startup-vm/lab-overview-auto-start-status.png":::

## Next steps

- [Manage auto shutdown policies for a lab in Azure DevTest Labs](devtest-lab-auto-shutdown.md)
- [Use command lines to start and stop DevTest Labs virtual machines](use-command-line-start-stop-virtual-machines.md)