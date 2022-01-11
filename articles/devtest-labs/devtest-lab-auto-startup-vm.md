---
title: Configure auto start settings for a VM
description: Learn how to configure auto start settings for VMs in a lab. This setting allows VMs in the lab to be automatically started on a schedule. 
ms.topic: how-to
ms.date: 12/10/2021
---

# Start up lab virtual machines automatically

Auto start allows you to automatically start virtual machines (VMs) in a lab at a scheduled time each day. You first need to create an auto start policy. Then you must select which VMs to follow the policy. The extra step of affirmatively selecting VMs to auto start is meant to prevent the unintentional starting of VMs that result in increased costs.

This article shows you how to configure an auto start policy for a lab. For information on configuring auto shutdown settings, see [Manage auto shutdown policies for a lab in Azure DevTest Labs](devtest-lab-auto-shutdown.md). 

## Configure auto start settings for a lab 

The policy doesn't automatically apply auto start to any VMs in the lab. After configuring the policy, follow the steps from [Enable auto start for a VM in the lab](#enable-auto-start-for-a-vm-in-the-lab).

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your lab in **DevTest Labs**.

1. Under **Settings**, select **Configuration and policies**. 

   :::image type="content" source="./media/devtest-lab-auto-startup-vm/configuration-policies-menu.png" alt-text="Screenshot that shows the 'Configuration and policies' menu in the DevTest Labs.":::

1. On the **Configuration and policies** page, under **Schedules**, select **Auto-start**.

1. For **Allow auto-start**, select **Yes**. Scheduling information will then appear.

    :::image type="content" source="./media/devtest-lab-auto-startup-vm/portal-lab-auto-start.png" alt-text="Screenshot of Auto-start option under Schedules.":::
 
1. Provide the following scheduling information:

    |Property | Description |
    |---|---|
    |Scheduled start| Enter a start time.|
    |Time zone| Select a time zone from the drop-down list.|
    |Days of the week| Select each box next to the day you want the schedule to be applied.|

    :::image type="content" source="./media/devtest-lab-auto-startup-vm/auto-start-configuration.png" alt-text="Screenshot of Autostart schedule settings.":::

1. Select **Save**. 

## Enable auto start for a VM in the lab

These steps continue from the prior section. Now that an auto start policy has been created, select the VMs to apply the policy against.

1. Close the **Configuration and policies** page to return to the **DevTest Labs** page.

1. Under **My virtual machines**, select a VM.

    :::image type="content" source="./media/devtest-lab-auto-startup-vm/select-vm.png" alt-text="Screenshot of Select VM from list under My virtual machines.":::

1. On the **virtual machine** page, under **Operations**, select **Auto-start**. 

1. On the **Auto-start** page, select **Yes**, and then **Save**.

    :::image type="content" source="./media/devtest-lab-auto-startup-vm/select-auto-start.png" alt-text="Screenshot of Select autostart menu.":::

## Next steps

- [Manage auto shutdown policies for a lab in Azure DevTest Labs](devtest-lab-auto-shutdown.md)
