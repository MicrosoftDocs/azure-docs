---
title: Manage a Dynamic Scope
description: This article describes how to manage various operations of dynamic scoping.
ms.service: azure-update-manager
author: habibaum
ms.author: v-uhabiba
ms.date: 01/09/2025
ms.topic: how-to
# Customer intent: As a system administrator, I want to manage dynamic scopes in Azure Update Manager so that I can efficiently control patch orchestration settings across various virtual machines and maintain compliance with update schedules.
---

# Manage a dynamic scope

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to view, add, edit, and delete a dynamic scope that's associated with a maintenance configuration in Azure Update Manager.

You can create a dynamic scope at either the subscription level or the resource group level. A subscription or resource group is mandatory for the creation of a dynamic scope, and you can't edit it after the dynamic scope is created.

Resources eligible to be attached to a dynamic scope are determined by the level at which you create the scope. If you set the scope at the resource group level (for example, RG1), resources from other groups (for example, RG2) will be unassigned if they're attached to the dynamic scope created under RG1. Those resources from other groups will be reassigned even if they're under the same subscription.

[!INCLUDE [dynamic-scope-prerequisites.md](includes/dynamic-scope-prerequisites.md)]

## Add a dynamic scope

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.

1. Select **Machines** > **Maintenance configurations**.

1. On the **Maintenance configurations** pane, select the name of the maintenance configuration for which you want to add a dynamic scope.

1. On the page for the chosen maintenance configuration, select **Dynamic scopes** > **Add a dynamic scope**.

1. On the **Add a dynamic scope** pane, select **subscriptions** (mandatory).

   > [!NOTE]
   > You should create subscription-level dynamic scope assignments with an empty location, because a subscription isn't associated with any specific region.

1. In **Filter by**, choose **Select**. In **Select Filter by**, specify the resource group, resource type, location, tags, and OS type. Then select **Ok**. These filters are optional fields.

1. In **Preview of machines based on above scope**, you can view the list of machines for the selected criteria. When you finish, select **Save**.

   > [!NOTE]
   > The list of machines might be different at run time.

1. On the **Configure Azure VMs for schedule updates** pane, select one of the following options to provide your consent:

    - **Change the required options to ensure schedule supportability** ensures that the machines are patched according to the schedule and not automatically patched. By selecting this option, you're confirming that you want to update the patch orchestration to **Customer Managed Schedules**. This setting updates the following two properties on your behalf:

       - `Patch mode = AutomaticByPlatform`
       - `BypassPlatformSafetyChecksOnUserSchedule = True`

    - **Continue with supported machines only** confirms that you want to proceed with only the machines that already have patch orchestration set to **Customer Managed Schedules**.

       In **Preview of machines based on above scope**, you can view only the machines that don't have patch orchestration set to **Customer Managed Schedules**.

1. Select **Save**. A notification confirms that the dynamic scopes are successfully applied.

## View a dynamic scope

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.

1. Select **Machines** > **Maintenance configurations**.

1. On the **Maintenance configurations** pane, select the name of the maintenance configuration for which you want to view the dynamic scope.

1. On the pane for the chosen maintenance configuration, select **Dynamic scopes** to view all the dynamic scopes that are associated with that configuration.

1. The schedules associated with dynamic scopes appear in the following two areas:

    - **Azure Update Manager** > **Machines** > **Associated schedules** column
    - Virtual machine (VM) home page > **Updates** > **Scheduling** tab

   To view the VMs that are associated with the schedule, go to the existing schedule and then select the **Dynamic scopes** tab.

## Edit a dynamic scope

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.

1. Select **Machines** > **Maintenance configurations**.

1. On the **Maintenance configurations** pane, select the name of the maintenance configuration for which you want to edit an existing dynamic scope.

1. On the pane for the chosen maintenance configuration, select **Dynamic scopes**, and then select the scope that you want to edit. In the **Actions** column, select the edit icon.

1. On the **Edit Dynamic scope** pane, in **Filter By**, select the edit icon. Edit the filters as needed, and then select **Ok**.

1. Select **Save**.

## Delete a dynamic scope

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.

1. Select **Machines** > **Browse maintenance configurations** > **Maintenance configurations**.

1. On the **Maintenance configurations** pane, select the name of the maintenance configuration for which you want to edit an existing dynamic scope.

1. On the pane for the chosen maintenance configuration, select **Dynamic scopes**, and then select the scope that you want to delete. Select **Remove dynamic scope**, and then select **Ok**.

## View the patch history of a dynamic scope

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.

1. Select **History** to view the patch history of a dynamic scope.

## Provide consent to apply updates

Obtaining consent to apply updates is an important step in the workflow of dynamic scoping. The following tabs describe the various ways to provide consent.

> [!NOTE]
> There are no prerequisites for Azure Arc-enabled VMs.

#### [From a virtual machine](#tab/vm)

1. In the [Azure portal](https://portal.azure.com), go to **+Create a resource** > **Virtual machine** > **Create**.

1. On the **Create a virtual machine** pane, select the **Management** tab. Under **Guest OS Updates**, in **Patch orchestration options**, select **Azure-orchestrated**. It sets the following properties:

   - `Patch mode = AutomaticByPlatform`
   - `BypassPlatformSafetyChecksOnUserSchedule = True`

1. Complete the details on the **Monitoring**, **Advanced**, and **Tags** tabs.

1. Select **Review + Create**. Under **Management**, you can view the **Periodic assessment** value as **Off** and the **Patch orchestration options** value as **Azure-orchestrated**.

1. Select **Create**.

#### [From the tab for scheduled updates](#tab/sc)

1. Follow the steps from 1 to 5 in the [earlier procedure for adding a dynamic scope](#add-a-dynamic-scope).

1. On the **Configure Azure VMs for schedule updates** pane, select the **Change the required options to ensure schedule supportability** option. Confirm that **Patch orchestration** is set as **Customer Managed Schedules**. It sets the following properties:

    - `Patch mode = AutomaticByPlatform`
    - `BypassPlatformSafetyChecksOnUserSchedule = True`

   The selection allows you to provide consent to apply the update settings. It also ensures that automatic patching isn't applied and that patching on the VMs runs according to the schedule that you defined.

1. Select **Save**.

#### [From update settings](#tab/us)

1. In **Azure Update Manager**, go to **Overview** > **Settings** > **Update settings**.

1. On the **Change Update settings** pane, select **+Add machine** to add the machines.

1. In the list of machines sorted according to the operating system, go to the **Patch orchestration** option and select **Customer Managed Schedules**. It sets the following properties:

   - `Patch mode = AutomaticByPlatform`
   - `BypassPlatformSafetyChecksOnUserSchedule = True`

1. Select **Save**.

   The selection that you made in this workflow automatically applies the update settings, and no consent is explicitly obtained.

---

## Related content

- Learn more about [dynamic scoping](dynamic-scope-overview.md), an advanced capability of scheduled patching.
- Learn [how to automatically install updates according to the created schedule for a single VM and at scale](scheduled-patching.md).
- Learn about [pre-maintenance and post-maintenance events](pre-post-scripts-overview.md) to automatically perform tasks before and after a scheduled maintenance configuration.
