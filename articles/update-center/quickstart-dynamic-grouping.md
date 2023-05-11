---
title: Quickstart - configure update settings for groups using update management center in the Azure portal.
description: This quickstart helps you to configure update settings using the Azure portal.
ms.service: update-management-center
ms.date: 01/25/2023
author: SnehaSudhirG
ms.author: sudhirsneha
ms.topic: quickstart
---

# Quickstart: Schedule updates for groups

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Dynamic grouping allows you to include VMs based on the scope and schedule updates at scale. You can modify the scope at any time and the patching requirements are applied at scale without any changes to the deployment schedule.

This quickstart details how to configure schedule updates on a group of Azure virtual machine(s) or Arc-enabled server(s)on-premises or in cloud environments.

## Permissions

Ensure that you have write permissions to create or modify a schedule for a dynamic group.

## Prerequisites

- An Azure account with an active subscription. If you don't have one yet, sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Patch Orchestration must be set to Azure orchestration to enable Auto patching on the VM, else the schedule updates wouldn't be applied.
- Set the Bypass platform safety checks on user schedule = *True* allows you to define your own patching methods such as time, duration, and type of patching. This VM property ensures that auto patching isn't applied and that patching on the VM(s) runs as per the schedule you've defined.
- Associate a Schedule with a VM suppresses the auto patching to ensure that patching on the VM(s) runs as per the schedule you've defined.


## Create groups

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center.
1. Select **Overview** > **Schedule updates**.
1. In the **Create a maintenance configuration** page, go to **Machines** and under **Group to update**, select **Add a group**.
1. In the **Add a group to update** page, provide a group name, and select subscriptions.
1. In **Other criteria**, choose **Select** and in the **Select other criteria** page, specify the Resource group, Resource type, Location, Tags, and OS type and then select **Select**.

    > [!NOTE]
    > Before you create a group, you can edit, preview, and delete the group. However, after the group is created, you can only edit the scope and not the subscription. To edit the scope, go to **Browse maintenance configuration** > select the schedule. In **Maintenance configuration**, go to **Settings** > **Schedule** to edit it.  

1. In the **Preview of machines based on above criteria**, you can view the list of machines for the selected criteria at that current time and select **Add**.
   > [!NOTE]
   > If the new machines that you add later match the selected criteria, the scheduled updates are automatically applied to them.

## Provide consent
Obtaining consent to apply updates is an important step in the workflow of scheduled patching and listed are the various ways to provide consent.

#### [From Virtual Machine](#tab/vm)

1. In **Azure portal**, go to **+Create a resource** > **Virtual machine** > **Create**. 
1. In **Create a virtual machine**, select **Management** tab.
1. Under **Guest OS Updates**, in **Patch orchestration options**, select **Azure-orchestrated with user managed schedules (preview)** to confirm that:
   - *Patch Orchestration is set to Azure orchestration*
   - *Set the Bypass platform safety checks on user schedule = True*.

    The selection allows you to provide consent to apply the update settings, ensures that auto patching isn't applied and that patching on the VM(s) runs as per the schedule you've defined.

1. Complete the details under **Monitoring**, **Advanced** and **Tags** tabs.
1. Select **Review + Create**.
   

#### [From Schedule updates](#tab/sc)

1. Follow the steps from 1 to 5 listed in [Create groups](#create-groups).
1. In **Prerequisite for schedule updates**, select **Continue with supported machines only** option to confirm that:

   - *Patch Orchestration is set to Azure orchestration*
   - *Set the Bypass platform safety checks on user schedule = True*.

1. Select **Continue to schedule updates** to update the patch mode as **Azure-orchestrated** and enable the scheduled patching for the VMs after obtaining the consent.

#### [From Update Settings](#tab/us)

1. In **Update management center**, go to **Overview** > **Update settings**.
1. In **Change Update settings**, select **+Add machine** to add the machines.
1. In the list of machines sorted as per the operating system, go to the **Patch orchestration** option and select **Azure-orchestrated with user managed schedules (Preview)** to confirm that:

   - *Patch Orchestration is set to Azure orchestration* 
   - *Set the Bypass platform safety checks on user schedule = True*
1. Select **Save**.

   The selection made in this workflow automatically applies the update settings and no consent is explicitly obtained.  
---

## Create schedule

>[!NOTE]
>You can use one schedule to link to a single machine or a multiple dynamic groups or a combination of dynamic and static groups. However, one dynamic group cannot have more than one schedule.

To define a dynamic group, follow these steps:
1. Follow the procedure from step 1 to 4 listed in [Provide consent](#provide-consent) > **From Schedule Updates** tab.
1. In the **Create maintenance configuration** > **Machines** tab, review the list of machines to update and select **Next Updates**.
1. In **Updates** tab, select the updates to include and select **Add**.
1. In the **Define or select from dynamic group** > **Machines** tab, select the group.
1. Complete the details   **Tags** tabs.
1. Select  **Review + Create**.

## Next steps

  Learn about [managing multiple machines](manage-multiple-machines.md).