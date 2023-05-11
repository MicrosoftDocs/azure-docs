---
title: Dynamically schedule updates at scale.
description: In this tutorial, you learn how to group machines, dynamically apply the updates at scale.
ms.service: update-management-center
ms.date: 02/08/2023
ms.topic: tutorial 
author: SnehaSudhirG
ms.author: sudhirsneha
#Customer intent: As an IT admin, I want dynamically apply patches on the machines as per a schedule.
---

# Tutorial: Dynamically schedule updates at scale

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.
 
This tutorial explains how you can dynamically schedule updates at scale.

Using the dynamic grouping feature, you can group machines to schedule and apply patches based on the criteria. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create groups
> - Create criteria 
> - Provide consent
> - Create schedule

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- Patch Orchestration must be set to Azure orchestration
- Set the Bypass platform safety checks on user schedule = *True*
- Associate a Schedule with a VM

## Dynamically schedule updates at scale

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview).
1. Select **Overview** > **Schedule updates** > **Create new schedule**
1. In the **Create a maintenance configuration** page, go to **Machines** > select **Add a group** to group of machines based on the criteria.
1. In the **Add a group to update** page, provide a group name, and select subscriptions.
1. In **Other criteria**, choose **Select** and in the **Select other criteria**, specify the Resource group, Resource type, Location, Tags, and OS type and then select  **Select**.
1.  In the **Preview of machines based on above criteria**, you can view the list of machines for the selected criteria at that time and then select **Add**.
1. In **Prerequisite for schedule updates**, select **Continue with supported machines only** option to confirm that:

   - *Patch Orchestration is set to Azure orchestration*
   - *Set the Bypass platform safety checks on user schedule = True*.

1. Select **Continue to schedule updates** to update the patch mode as **Azure-orchestrated** to enable the scheduled patching for the VMs after obtaining the consent.
1. In the **Machines** tab, review the list of machines to update and select **Next Updates**.
1. In **Updates** tab, select the security, critical, Update rollups or security packs that you want to include and select **Add**.
1. In the **Define or select from dynamic group** > **Machines** tab, select the group.
1. Provide the tags in **Tags** tab.
1. Select  **Review + Create**.

   A notification appears that the deployment of maintenance configuration of automatic updates is successful.

## Next steps
Learn about [managing multiple machines](manage-multiple-machines.md).
 