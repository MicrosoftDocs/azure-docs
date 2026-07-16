---
title: Create and configure a Recovery Orchestration Plan in Resiliency
description: Learn how to create and configure a Recovery Orchestration Plan for zonal resiliency in Azure, including resource protection, groups, and group actions.
ms.topic: how-to
ms.date: 06/02/2026
ms.service: resiliency
author: shsangal
ms.author: shsangal
# Customer intent: "As a cloud administrator, I want to create and configure a Recovery Orchestration Plan so that I can orchestrate zonal failover across multiple resources in my application."
---

# Create and configure a Recovery Orchestration Plan (preview)

This article describes how to create a Recovery Orchestration Plan (preview) within a Service Group. It also covers how to configure resource protection, define recovery groups, and add group actions to automate failover operations.

## Create a Recovery Orchestration Plan

For a Recovery Plan creation in a Service Group, you need either the **Azure Resilience Management Recovery Contributor** or **Azure Resilience Management Recovery Administrator** role.

To create a new Recovery Orchestration Plan within a Service Group, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to your **Service Group**.
1. Select **Recovery Plans** from the left menu under **Resiliency**.
1. Select **Create recovery plan**.
1. On the **Basics** tab, provide the following details:
   - **Plan name**: A descriptive name for your recovery plan.
   - **Plan type**: Zonal resiliency (set by default).
   - **Description**: A brief description of the plan's purpose.
1. On the **Management** tab, select the managed identity type. By default, **System-assigned** identity is selected. You can also choose **User-assigned** if you prefer a specific managed identity.
1. Select **Review + create**. Review the summary of your selections and select **Create**.

After creation, the plan appears in the **Recovery Plans** list pane showing the plan name, associated service group, plan status, and plan type.


## Configure the Recovery Plan

After the plan creation completes, you can open the plan from the **Recovery Plans** list. The plan is initially in the **Warning** state, indicating that resources require attention. The **Configure plan** tab shows the following key sections - **Manage resource protection** and **Plan readiness check**.

### View resource protection

To view and manage the protection status of resources in your plan, follow these steps:

1. Select the **Configure Plan** tab.
1. Select **Manage resource protection**.

   The **Resource protection** pane shows all resources in the Service Group with the following columns:
   - **Resource name**: The name of the Azure resource
   - **Protection Status**: The protection solution, which is configured on the resource, for example, Azure Site Recovery, or zone-redundant storage with `(HA)` suffix for High Availability (HA) solutions.
   - **Active Location**: The region where the resource is currently active.
   - **Active physical zone**: The physical zone where the resource is currently active.
   - **Recovery Location**: The disaster recovery or high availability target location
   - **Inclusion State**: Protection state of the Azure resource - **Included**, **Excluded**, or **State not selected**.
   - **Needs Attention**: Shows the reason code if the resource has issues, otherwise shows **No**.

### Include a resource in the plan

Resources aren't automatically included in the plan. You must explicitly include each resource.

To include a resource in the plan, follow these steps:

1. Open the plan from the **Recovery Plans** list.  
1. On the **Configure plan** tab, select **Manage resource protection**.
1. On the **Manage resource protection** pane, locate the resource with the inclusion state as **State not selected**.
1. Select **State not selected** for that resource. 
1. On the **Edit protection solution** pane, select **Include**.
1. Choose the appropriate protection solution from the dropdown (for example, **Azure Site Recovery**).
1. Provide mandatory parameters required for orchestration. For example, for an Azure Site Recovery-protected virtual machine, you must provide the **cache storage account** parameter needed for reprotect.
1. Select **Ok** to confirm.

> [!NOTE]
> Inclusion changes are only saved after you select **Update** on the **Review + Update** tab at the end of the configuration flow.

### Exclude a resource from the plan

Exclude a resource from failover orchestration when it doesn't need to be part of the recovery plan.
To exclude a resource in the plan, follow these steps:

1. Open the plan from the Recovery Plans list.  
1. On the **Configure plan** tab, select **Manage resource protection**. 
1. On the **Manage resource protection** pane, locate the resource you want to exclude.
1. Select the inclusion state for that resource.
1. On the **Edit protection solution** pane, select **Exclude** and then select **Ok**.

> [!NOTE]
> Resources protected by Highly Available (HA) solutions can only be excluded. If an HA-enabled resource gets detected during plan creation or readiness check, the feature automatically excludes it from the plan since HA resources handle failover independently.

After managing all resource inclusions and exclusions, select **Next** to proceed to the **Start group order** tab.

## Create and order groups

Groups define the order of resource recovery during failover. Resources in the same group failover in parallel, while groups execute sequentially. Group 2 starts only after all Group 1 resources completed failover. By default, a **Default Group** is created.

To create and order groups, follow these steps:

1. On the **Manage resource protection** pane, on the **Start group order** tab, select **Manage groups**. 
1. On the **Manage groups** pane, to create a new group, select **Add New Group** and provide a group name.
1. To reorder groups, use the up/down arrow buttons next to each group.
1. To rename a group, select the group name and edit it.
1. To move a resource between groups, select the more icon (**...**) corresponding to the resource in the main view and choose the target group from the menu.
1. On the **Start group order** tab, select **Next** to proceed to the **Group action** tab.

## Add group actions

Automate group-level actions that execute during failover. The supported action types are: automation scripts (Azure Automation Runbooks) and manual steps.

### Add an automation script

To add an automation script for the recovery orchestration plan, follow these steps:
1. On **Manage resource protection** pane, on the **Group action** tab, select the more icon (**...**) for the group you want to configure.
1. Select **Add Script**. 
1. On the **Edit Group Action** pane, provide a **name** for the action.
1. Select the **subscription**, **automation account**, and **runbook script**.
1. Set a **timeout** value (default: 60 minutes). If the script exceeds this timeout, the action is marked as failed.
1. Choose the script type: **Pre-script** (runs before group failover) or **Post-script** (runs after group failover).
1. Select **Ok**.

> [!NOTE]
> The Recovery Plan's managed-identity requires the **Automation Job Operator** role on the Automation Account to run automation scripts.

### Add a manual step

To add a manual step for the recovery orchestration, plan, follow these steps:

1. On **Manage resource protection** pane, on the **Group action** tab, select the more icon (**...**) for the group.
1. Select **Add Manual Step**. 
1. On the **Edit Group Action** pane, provide a **name** for the step and **action instructions** describing what needs to be done manually.
1. Choose the step type: **Pre-step** (runs before group failover) or **Post-step** (runs after group failover).
1. Select **Ok**.

During failover, manual actions pause the failover job. The job remains paused until you go to the Recovery Plan execution pane and manually acknowledge and resume the action.

## Review and update the plan

To update the plan, follow the steps:

1. On **Manage resource protection** pane, on **Group action** tab, select **Next** to navigate to the **Review + update** tab.
1. Review the Summary: number of resources included and excluded, the start group order with resources in each group, and any configured group actions (scripts and manual steps).
1. Select **Update** to save all your configuration changes.


## Related content

- [Execute failover and reprotect operations (preview)](recovery-orchestration-plan-execute.md).
- [Support matrix for Recovery Orchestration Plan (preview)](recovery-orchestration-plan-support-matrix.md).
