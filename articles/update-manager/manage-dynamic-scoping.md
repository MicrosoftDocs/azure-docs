---
title: Manage various operations of Dynamic Scoping.
description: This article describes how to manage Dynamic Scoping operations 
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 02/03/2024
ms.topic: how-to
---

# Manage a Dynamic scope

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to view, add, edit and delete a dynamic scope.

[!INCLUDE [dynamic-scope-prerequisites.md](includes/dynamic-scope-prerequisites.md)]

## Add a Dynamic scope
To add a Dynamic scope to an existing configuration, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Azure Update Manager**. 
1. Select **Machines** > **Maintenance configurations**. 
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to add a Dynamic scope. 
1. In the given maintenance configuration page > select **Dynamic scopes** > **Add a dynamic scope**.
1. In the **Add a dynamic scope** page, select **subscriptions** (mandatory).
1. In **Filter by**, choose **Select** and in the **Select Filter by**, specify the Resource group, Resource type, Location, Tags and OS type and then select **Ok**. These filters are optional fields.
1. In the **Preview of machines based on above scope**, you can view the list of machines for the selected criteria and then select **Save**.
   > [!NOTE]
   > The list of machines may be different at run time.
1. In the **Configure Azure VMs for schedule updates** page, select any one of the following options to provide your consent:
    1. **Change the required options to ensure schedule supportability** ensures that the machines are patched as per schedule and not autopatched. By selecting this option, you are confirming that you want to update the patch orchestration to *Customer Managed Schedules*: This updates the following two properties on your behalf:
    
       - *Patch mode = AutomaticByPlatform*
       - *Set the BypassPlatformSafetyChecksOnUserSchedule = True*.
   1. **Continue with supported machines only** - this option confirms that you want to proceed with only the machines that already have patch orchestration set to *Customer Managed Schedules*.
   
   > [!NOTE]
   > In the **Preview of machines based on above scope** page, you can view only the machines that don't have patch orchestration set to *Customer Managed Schedules*.

1. Select **Save**. Notification confirms that the Dynamic scopes are successfully applied.
1. In the **Maintenance configuration | Dynamic scopes** page, you can view and edit the Dynamic scopes that were created.

## View Dynamic scope
To view the list of Dynamic scopes associated to a given maintenance configuration, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Azure Update Manager**.
1. Select **Machines** >  **Maintenance configurations**.
1. In the **Maintenance configurations** page, select the name of the maintenance configuration for which you want to view the Dynamic scope.
1. In the given maintenance configuration page, select **Dynamic scopes** to view all the Dynamic scopes that are associated with the maintenance configuration.
1. The schedules associated to dynamic scopes are displayed in the following two areas:
    - **Update manager** > **Machines** > **Associated schedules** column
    - In your virtual machine home page > **Updates** > **Scheduling** tab.
    - To view the VMs that are associated to the schedule, go to the existing schedule and view under **Dynamic scopes** tab.

## Edit a Dynamic scope

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Azure Update Manager**. 
1. Select **Machines** > **Maintenance configurations**. 
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
1. Select **History** to view the patch history of a dynamic scope.

## Provide consent to apply updates

Obtaining consent to apply updates is an important step in the workflow of dynamic scoping and listed are the various ways to provide consent.

>[!NOTE]
> There are no prerequisites for  Arc-enabled VMs. 

#### [From Virtual Machine](#tab/vm)

1. In [Azure portal](https://portal.azure.com), go to **+Create a resource** > **Virtual machine** > **Create**. 
1. In **Create a virtual machine**, select **Management** tab and under the **Guest OS Updates**, in **Patch orchestration options**, select **Azure-orchestrated**. It sets the following properties:

   - Patch mode is set to *AutomaticByPlatform* 
   - Set the BypassPlatformSafetyChecksOnUserSchedule = *True*

1. Complete the details under **Monitoring**, **Advanced** and **Tags** tabs.
1. Select **Review + Create** and under the **Management** you can view the values as **Periodic assessment** - *Off* and **Patch orchestration options** - *Azure-orchestrated*.
1. Select **Create**.
   

#### [From Schedule updates tab](#tab/sc)

1. Follow the steps from 1 to 5 listed in [Add a Dynamic scope](#add-a-dynamic-scope).
1. In **Configure Azure VMs for schedule updates**, page select **Change the required options to ensure schedule supportability** option to confirm that **patch orchestration** is set as **Customer Managed Schedules**. It sets the following properties:

    - Patch mode is set to *AutomaticByPlatform*
    - Set the BypassPlatformSafetyChecksOnUserSchedule = *True*.

   The selection allows you to provide consent to apply the update settings, ensures that auto patching isn't applied and that patching on the VM(s) runs as per the schedule you've defined.

1. Select **Save**.

#### [From Update Settings](#tab/us)

1. In **Azure Update Manager**, go to **Overview** > **Settings** > **Update settings**.
1. In **Change Update settings**, select **+Add machine** to add the machines.
1. In the list of machines sorted as per the operating system, go to the **Patch orchestration** option and select **Customer Managed Schedules**. It sets the following properties:

   - Patch mode is set to *AutomaticByPlatform* 
   - Set the BypassPlatformSafetyChecksOnUserSchedule = *True*

1. Select **Save**.

   The selection made in this workflow automatically applies the update settings and no consent is explicitly obtained.  
---

## Next steps

* Learn more about how to [Configure schedule patching on Azure VMs for business continuity](prerequsite-for-schedule-patching.md).
* Learn more about [Dynamic scope](dynamic-scope-overview.md), an advanced capability of schedule patching.
* Learn on how to [automatically installs the updates according to the created schedule both for a single VM and at scale](scheduled-patching.md).
* Learn about [pre and post events](pre-post-scripts-overview.md) to automatically perform tasks before and after a scheduled maintenance configuration.
