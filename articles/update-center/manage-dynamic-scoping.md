---
title: Manage various operations of dynamic scoping (preview).
description: This article describes how to manage dynamic scoping (preview) operations 
ms.service: update-management-center
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 06/27/2023
ms.topic: how-to
---

# Manage a Dynamic scope

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to view, add, edit and delete a dynamic scope (preview).

## Add a Dynamic scope (preview)
To add a Dynamic scope to an existing configuration, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview). 
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**. 
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to add a Dynamic scope. 
1. In the given maintenance configuration page > select **Dynamic scopes** > **Add a dynamic scope**.
1. In the **Add a dynamic scope** page, select **subscriptions**(mandatory).
1. In **Filter by**, choose **Select** and in the **Select Filter by**, specify the Resource group, Resource type, Location, Tags and OS type and then select **Ok**. These filters are optional fields.
1. In the **Preview of machines based on above scope**, you can view the list of machines for the selected criteria and then select **Add**.
   > [!NOTE]
   > The list of machines may be different at run time.
1. In the **Configure Azure VMs for schedule updates** page, select any one of the following options to provide your consent:
    1. **Change the required options to ensure schedule supportability** - this option confirms that you want to update the patch orchestration from existing option to *Customer Managed Schedules (Preview)*: This updates the following two properties on your behalf:
    
       - *Patch mode = AutomaticByPlatform*
       - *Set the BypassPlatformSafetyChecksOnUserSchedule = True*.
   1. **Continue with supported machines only** - this option confirms that you want to proceed with only the machines that already have patch orchestration set to *Customer Managed Schedules (Preview)*.
   
    > [!NOTE]
    > In the **Preview of machines based on above scope** page, you can view only the machines that don't have patch orchestration set to *Customer Managed Schedules (Preview)*.

1. Select **Save** to go back to the Dynamic scopes tab. In this tab, you can view and edit the Dynamic scope that you have created.

## View Dynamic scope (preview)

To view the list of Dynamic scopes (preview) associated to a given maintenance configuration, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Update management center (preview)**.
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**.
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to view the Dynamic scope.
1. In the given maintenance configuration page, select **Dynamic scopes** to view all the Dynamic scopes that are associated with the maintenance configuration.

## Edit a Dynamic scope (preview)

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview). 
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**. 
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to edit an existing Dynamic scope. 
1. In the given maintenance configuration page > select **Dynamic scopes** and select the scope you want to edit. Under **Actions** column, select the edit icon.
1. In the **Edit Dynamic scope**, select the edit icon in the **Filter By** to edit the filters as needed and select **Ok**.
   > [!NOTE]
   > After you create the dynamic scope, you can't edit the subscription.
1. Select **Save**.

## Delete a Dynamic scope (preview)

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview). 
1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**. 
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to edit an existing Dynamic scope. 
1. In the given maintenance configuration page > select **Dynamic scopes** and select the scope you want to delete. Select **Remove dynamic scope** and then select **Ok**.

## View patch history of a Dynamic scope (preview)

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview). 
1. Select **History** > **Browse maintenance configurations** > **Maintenance configurations** to view the patch history of a dynamic scope.


## Next steps

* [View updates for single machine](view-updates.md)
* [Deploy updates now (on-demand) for single machine](deploy-updates.md)
* [Schedule recurring updates](scheduled-patching.md)
* [Manage update settings via Portal](manage-update-settings.md)
* [Manage multiple machines using update management center](manage-multiple-machines.md)