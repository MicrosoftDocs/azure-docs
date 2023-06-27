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

# Tutorial: Dynamically schedule updates at scale

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.
 
This tutorial explains how you can create and manage Dynamic scopes and enable schedule patching on them.

Using the dynamic grouping feature, you can group machines to schedule and apply patches based on the criteria. 

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
1. Select **Dynamic Scopes** and then select **Add a Dynamic scope** to group of machines based on the criteria.
1. In the **Add a dynamic scope** page, select subscriptions which is the mandatory field for creating a scope.
    1. In **Filter by**, choose **Select** and in **Select filter by**, which are the optional fields, specify the Resource group, Resource type, Location, Tags, and OS type and then select  **Ok**.
    1.  In the **Preview of machines based on above scope**, you can view the list of machines for the selected criteria and then select **Save**. Here, the list of the machines may be different at run time.
1. In **Configure Azure VMs for schedule patching** page, you provide your consent and it does one of the following: 
    1. select **Change the required options to ensure schedule supportability** option to confirm that you want to update the patch orchestration from the existing option to *Customer Managed Schedules (Preview)*: This updates the following two properties on your behalf:
    
       - *Patch mode = AutomaticByPlatform*
       - *Set the BypassPlatformSafetyChecksOnUserSchedule = True*.

    1. Select **Continue with supported machines only** option to confirm that you want to proceed with only the machines that already have **Patch orchestration** set to *Customer Managed Schedules (Preview)*.
    
    >[!NOTE]
    > The page will show only if there are machines in the **Preview of machines based on above scope** page that don't have the **Patch orchestration** set to *Customer Managed Schedules (Preview)*. 

1. Select **Save** to go to the **Dynamic Scopes** tab to view and edit the Dynamic scope you created.
    
1. In **Machines** tab, select **Add machines** to add any individual machines to the maintenance configuration and select **Updates**.
1. In the **Updates** tab, select the patch classification that you want to include/exclude and select **Tags**.
1. Provide the tags in **Tags** tab.
1. Select  **Review** and then **Review + Create**.


## Next steps
Learn about [managing multiple machines](manage-multiple-machines.md).
 
