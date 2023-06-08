---
title: Schedule updates on Dynamic scope.
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
 
This tutorial explains how you can create and manage Dynamic groups and enable schedule patching on them.

Using the dynamic grouping feature, you can group machines to schedule and apply patches based on the criteria. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create and edit groups
> - Associate with a schedule


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- Patch Orchestration must be set to Customer Managed Schedules (Preview)/(Sets patch mode to AutomaticByPlatform).
- Set the **BypassPlatformSafetyChecksOnUserSchedule** = *True*.
- Associate a Schedule with the VM.

## Create a Dynamic scope

To create a dynamic scope, follow the steps:

>[!NOTE]
> A dynamic scope cannot exist without a schedule.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview).
1. Select **Overview** > **Schedule updates** > **Create a maintenance configuration**.
1. In the **Create a maintenance configuration** page, enter the details in the **Basics** tab and select **Maintenance scope** as *Guest* (Azure VM, Arc-enabled VMs/servers).
1. Select **DynamicScopes** and then select **Add a Dynamic scope** to group of machines based on the criteria.
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

## Manage a Dynamic scope

### View Dynamic scopes.

To view the list of Dynamic scopes associated to a given maintenance configuration, follow these steps:

1. Sign in to the Azure portal and navigate to Update management center (Preview).
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**.
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to view the Dynamic scope.
1. In the given maintenance configuration page, select **Dynamic scopes to view all the Dynamic scopes that are associated to the maintenance configuration.


### Add a Dynamic scope
To add a Dynamic scope to an existing configuration, follow the steps:

1. Sign in to the Azure portal and navigate to Update management center (preview). 
1. Select **Machines> **Browse maintenance configurations** > **Maintenance configurations**. 
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to add a Dynamic scope. 
1. In the given maintenance configuration page > select **Dynamic scopes** > **Add a dynamic scope**.
1. In the **Add a dynamic scope** page, select **subscriptions** This is a mandatory field for creating a scope.
1. In **Filter by**, choose **Select** and in the **Select Filter by**, specify the Resource group, Resource type, Location, Tags and OS type and select **Ok**. These filters are optional fields.
1. In the **Preview of machines based on above scope**, you can view the list of machines for the selected criteria and then select **Save**.
   > [!NOTE]
   > The list of machines may be different at run time.
1. In **Configure Azure VMs for schedule patching** page, you provide your consent and it does one of the following:
    1. Select **Change the required options to ensure schedule supportability** option to confirm that you want to update the patch orchestration from existing option to *Customer Managed Schedules (Preview)*: This updates the following two properties on your behalf:
    
       - *Patch mode = AutomaticByPlatform*
       - *Set the BypassPlatformSafetyChecksOnUserSchedule = True*.
   1. Select **Continue with supported machines only** option to confirm that you want to proceed with only the machines that already have patch orchestration set to *Customer Managed Schedules (Preview)*.
   
    > [!NOTE]
    > The page displays only if there are machines in the **Preview of machines based on above scope** page that don't have patch orchestration set to *Customer Managed Schedules (Preview)*.
1. Select **Save** to go back to the Dynamic scopes tab. In this tab, you can view and edit the Dynamic scope that you have created.

### Edit a Dynamic scope

1. Sign in to the Azure portal and navigate to Update management center (preview). 
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**. 
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to edit an existing Dynamic scope. 
1. In the given maintenance configuration page > select **Dynamic scopes** and select the scope you want to edit. Under **Actions** column, select the edit icon.
1. In the **Edit Dynamic scope**, select the edit icon in the **Filter By** to edit the filters as needed and select **Ok**.
   > [!NOTE]
   > After you create the dynamic scope, you can't edit the subscription.
1. Select **Save**.

### Delete a Dynamic scope

1. Sign in to the Azure portal and navigate to Update management center (preview). 
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**. 
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to edit an existing Dynamic scope. 
1. In the given maintenance configuration page > select **Dynamic scopes** and select the scope you want to delete. Select **Remove dynamic scope** and then select **Ok**.

### View patch history of a Dynamic scope

1. Sign in to the Azure portal and navigate to Update management center (preview). 
1. Select **History** > **Browse maintenance configurations** > **Maintenance configurations** to view the patch history of a dynamic scope.

## Next steps
Learn about [managing multiple machines](manage-multiple-machines.md).
 
