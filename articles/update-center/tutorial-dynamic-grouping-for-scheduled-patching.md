---
title: Schedule updates using Dynamic scoping (preview).
description: In this tutorial, you learn how to group machines, dynamically apply the updates at scale.
ms.service: update-management-center
ms.date: 06/27/2023
ms.topic: tutorial 
author: SnehaSudhirG
ms.author: sudhirsneha
#Customer intent: As an IT admin, I want dynamically apply patches on the machines as per a schedule.
---

# Tutorial: Dynamically schedule updates on a group of VMs

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.
 
This tutorial explains how you can create a group, and enable schedule updates on them at scale.

Using the dynamic scope feature, you can group machines to schedule and apply patches based on the criteria. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create and edit groups
> - Associate with a schedule


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- Patch Orchestration must be set to Customer Managed Schedules (Preview)/ (Sets patch mode to AutomaticByPlatform).
- Set the **BypassPlatformSafetyChecksOnUserSchedule** = *True*.
- Associate a Schedule with the VM.

## Create a Dynamic scope

To create a dynamic scope, follow the steps:

>[!NOTE]
> A dynamic scope cannot exist without a schedule.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview).
1. Select **Overview** > **Schedule updates** > **Create a maintenance configuration**.
1. In the **Create a maintenance configuration** page, enter the details in the **Basics** tab and select **Maintenance scope** as *Guest* (Azure VM, Arc-enabled VMs/servers).
1. Select **Dynamic Scopes** and follow the steps to [Add Dynamic scope](manage-dynamic-scoping.md#add-a-dynamic-scope-preview). 
1. In **Machines** tab, select **Add machines** to add any individual machines to the maintenance configuration and select **Updates**.
1. In the **Updates** tab, select the patch classification that you want to include/exclude and select **Tags**.
1. Provide the tags in **Tags** tab.
1. Select  **Review** and then **Review + Create**.

## Provide consent
Obtaining consent to apply updates is an important step in the workflow of scheduled patching and follow the steps on various ways to [provide consent](manage-dynamic-scoping.md#provide-consent).

## Create schedule

>[!NOTE]
>You can use one schedule to link to a single machine or a multiple dynamic groups or a combination of dynamic and static groups. However, one dynamic group cannot have more than one schedule.

To define a dynamic group, follow these steps:
1. Follow the procedure from step 1 to 4 listed in [provide consent](manage-dynamic-scoping.md#provide-consent) > **From Schedule Updates** tab.
1. In the **Create maintenance configuration** > **Machines** tab, review the list of machines to update and select **Next Updates**.
1. In **Updates** tab, select the updates to include and select **Add**.
1. In the **Define or select from dynamic group** > **Machines** tab, select the group.
1. Complete the details   **Tags** tabs.
1. Select  **Review + Create**.


## Next steps
Learn about [managing multiple machines](manage-multiple-machines.md).
 
