---
title: Manage various operations of Dynamic Scoping.
description: This article describes how to manage Dynamic Scoping operations 
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 11/20/2023
ms.topic: how-to
---

# Manage a Dynamic scope

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to view, add, edit and delete a dynamic scope.

[!INCLUDE [dynamic-scope-prerequisites.md](includes/dynamic-scope-prerequisites.md)]

## Add a Dynamic scope
To add a Dynamic scope to an existing configuration, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Azure Update Manager**. 
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**. 
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to add a Dynamic scope. 
1. In the given maintenance configuration page > select **Dynamic scopes** > **Add a dynamic scope**.
1. In the **Add a dynamic scope** page, select **subscriptions**(mandatory).
1. In **Filter by**, choose **Select** and in the **Select Filter by**, specify the Resource group, Resource type, Location, Tags and OS type and then select **Ok**. These filters are optional fields.
1. In the **Preview of machines based on above scope**, you can view the list of machines for the selected criteria and then select **Add**.
   > [!NOTE]
   > The list of machines may be different at run time.
1. In the **Configure Azure VMs for schedule updates** page, select any one of the following options to provide your consent:
    1. **Change the required options to ensure schedule supportability** - this option confirms that you want to update the patch orchestration from existing option to *Customer Managed Schedules*: This updates the following two properties on your behalf:
    
       - *Patch mode = AutomaticByPlatform*
       - *Set the BypassPlatformSafetyChecksOnUserSchedule = True*.
   1. **Continue with supported machines only** - this option confirms that you want to proceed with only the machines that already have patch orchestration set to *Customer Managed Schedules*.
   
   > [!NOTE]
   > In the **Preview of machines based on above scope** page, you can view only the machines that don't have patch orchestration set to *Customer Managed Schedules*.

1. Select **Save** to go back to the Dynamic scopes tab. In this tab, you can view and edit the Dynamic scope that you have created.

## View Dynamic scope
To view the list of Dynamic scopes associated to a given maintenance configuration, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Azure Update Manager**.
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**.
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to view the Dynamic scope.
1. In the given maintenance configuration page, select **Dynamic scopes** to view all the Dynamic scopes that are associated with the maintenance configuration.

> [!NOTE]
> The schedules associated to dynamic scopes aren’t displayed in the following two areas by design:
>
>  - **Update manager** > **Machines** > **Associated schedules** column
>  - In your virtual machine home page > **Updates** > **Scheduling** tab.
>
> To view the VMs that are associated to the schedule, go to the existing schedule and view under **Dynamic scopes** tab.

## Edit a Dynamic scope

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Azure Update Manager**. 
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**. 
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to edit an existing Dynamic scope. 
1. In the given maintenance configuration page > select **Dynamic scopes** and select the scope you want to edit. Under **Actions** column, select the edit icon.
1. In the **Edit Dynamic scope**, select the edit icon in the **Filter By** to edit the filters as needed and select **Ok**.
   > [!NOTE]
   > Subscription is mandatory for the creation of dynamic scope and you can't edit it after the dynamic scope is created.
1. Select **Save**.

## Delete a Dynamic scope

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Azure Update Manager**. 
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**. 
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to edit an existing Dynamic scope. 
1. In the given maintenance configuration page > select **Dynamic scopes** and select the scope you want to delete. Select **Remove dynamic scope** and then select **Ok**.

## View patch history of a Dynamic scope

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Azure Update Manager**. 
1. Select **History** > **Browse maintenance configurations** > **Maintenance configurations** to view the patch history of a dynamic scope.

## Provide consent to apply updates

Obtaining consent to apply updates is an important step in the workflow of dynamic scoping and listed are the various ways to provide consent.

#### [From Virtual Machine](#tab/vm)

1. In [Azure portal](https://portal.azure.com), go to **+Create a resource** > **Virtual machine** > **Create**. 
1. In **Create a virtual machine**, select **Management** tab and under the **Guest OS Updates**, in **Patch orchestration options**, you can do the following: 
    1. Select **Azure-orchestrated with user managed schedules (Preview)** to confirm that:

       - Patch Orchestration is set to *Azure orchestration*
       - Set the Bypass platform safety checks on user schedule = *True*.

       The selection allows you to provide consent to apply the update settings, ensures that auto patching isn't applied and that patching on the VM(s) runs as per the schedule you've defined.

1. Complete the details under **Monitoring**, **Advanced** and **Tags** tabs.
1. Select **Review + Create** and under the **Management** you can view the values as **Periodic assessment** - *Off* and **Patch orchestration options** - *Azure-orchestrated with user managed schedules (Preview)*.
1. Select **Create**.
   

#### [From Schedule updates tab](#tab/sc)

1. Follow the steps from 1 to 5 listed in [Add a Dynamic scope](#add-a-dynamic-scope).
1. In **Machines** tab, select **Add machine**, In **Select resources** page, select the machines and select **Add**
1. In **Configure Azure VMs for schedule updates**, select **Continue  to schedule updates** option to confirm that:

   - Patch Orchestration is set to *Azure orchestration*
   - Set the Bypass platform safety checks on user schedule = *True*.

1. Select **Continue to schedule updates** to update the patch mode as **Azure-orchestrated** and enable the scheduled patching for the VMs after obtaining the consent.

#### [From Update Settings](#tab/us)

1. In **Azure Update Manager**, go to **Overview** > **Update settings**.
1. In **Change Update settings**, select **+Add machine** to add the machines.
1. In the list of machines sorted as per the operating system, go to the **Patch orchestration** option and select **Azure-orchestrated with user managed schedules (Preview)** to confirm that:

   - Patch Orchestration is set to *Azure orchestration* 
   - Set the Bypass platform safety checks on user schedule = *True*
1. Select **Save**.

   The selection made in this workflow automatically applies the update settings and no consent is explicitly obtained.  
---

## Next steps

* [View updates for single machine](view-updates.md)
* [Deploy updates now (on-demand) for single machine](deploy-updates.md)
* [Schedule recurring updates](scheduled-patching.md)
* [Manage update settings via Portal](manage-update-settings.md)
* [Manage multiple machines using update Manager](manage-multiple-machines.md)