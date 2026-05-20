---
title: Create and configure a Recovery Orchestration Plan
description: Learn how to create and configure a Recovery Orchestration Plan for zonal resiliency in Azure, including resource protection, groups, and group actions.
ms.topic: how-to
ms.date: 05/18/2026
ms.service: resiliency
author: shsangal
ms.author: shsangal
# Customer intent: "As a cloud administrator, I want to create and configure a Recovery Orchestration Plan so that I can orchestrate zonal failover across multiple resources in my application."
---

# Create and configure a Recovery Orchestration Plan

In this article, you create a Recovery Orchestration Plan within a Service Group, configure resource protection, define recovery groups, and add group actions to automate failover operations.

## Create a Recovery Orchestration Plan

Create a new Recovery Orchestration Plan within a Service Group by completing the following steps.

1. In the Azure portal, navigate to your Service Group.
1. Select **Recovery Plans** from the left menu.
1. Select **Create recovery plan**.
1. On the **Basics** tab, provide the following details:
   - **Plan name**: A descriptive name for your recovery plan.
   - **Plan type**: Zonal resiliency (automatically set).
   - **Description**: A brief description of the plan's purpose.
1. On the **Management** tab, select the managed identity type. By default, **System-assigned** identity is selected. You can also choose **User-assigned** if you prefer a specific managed identity.
1. Select **Review + create**. Review the summary of your selections and select **Create**.

After creation, the plan appears in the Recovery Plans list page showing the plan name, associated service group, plan status, and plan type.

> [!NOTE]
> To create a Recovery Plan within a Service Group, you need either the **Azure Resilience Management Recovery Contributor** or **Azure Resilience Management Recovery Administrator** role.

## Configure the Recovery Plan

After creating the plan, navigate to it from the Recovery Plans list. The plan is initially in the **Warning** state, indicating that resources require attention. The **Configure plan** tab shows two key sections: **Manage resource protection** and **Plan readiness check**.

### Manage resource protection

View and manage the protection status of resources in your plan.

1. Select the **Configure Plan** tab.
1. Select **Manage resource protection**.
1. The resource protection page displays all resources in the Service Group with the following columns:
   - **Resource name**: The name of the Azure resource
   - **Protection Status**: The protection solution which is configured on the resource (for example, Azure Site Recovery, or zone-redundant storage with "(HA)" suffix for HA solutions)
   - **Active Location**: The region where the resource is currently active
   - **Active physical zone**: The physical zone where the resource is currently active.
   - **Recovery Location**: The disaster recovery or high availability target location
   - **Inclusion State**: Whether the resource is **Included**, **Excluded**, or **State not selected**
   - **Needs Attention**: Shows the reason code if the resource has issues, otherwise shows "No"

### Include a resource in the plan

Resources aren't automatically included in the plan. You must explicitly include each resource.

1. In the **Manage resource protection** page, locate the resource with **State not selected** inclusion state.
1. Select **State not selected** for that resource. The **Edit protection solution** pane opens.
1. Select **Include**.
1. Choose the appropriate protection solution from the dropdown (for example, **Azure Site Recovery**).
1. Provide mandatory parameters required for orchestration. For example, for an Azure Site Recovery-protected virtual machine, you must provide the **cache storage account** parameter needed for reprotect.
1. Select **Ok** to confirm.

> [!NOTE]
> Inclusion changes are only saved after you select **Update** on the **Review + Update** tab at the end of the configuration flow.

### Exclude a resource from the plan

Exclude a resource from failover orchestration when it doesn't need to be part of the recovery plan.

1. In the **Manage resource protection** page, locate the resource you want to exclude.
1. Select the inclusion state for that resource. The **Edit protection solution** pane opens.
1. Select **Exclude** and then select **Ok**.

> [!NOTE]
> Resources protected by HA solutions can only be excluded. If an HA-enabled resource is detected during plan creation or readiness check, it's automatically excluded from the plan since HA resources handle failover independently.

After managing all resource inclusions and exclusions, select **Next** to proceed to the **Start group order** tab.

## Create and order groups

Groups define the order of resource recovery during failover. Resources in the same group failover in parallel, while groups execute sequentially. Group 2 starts only after all Group 1 resources completed failover. By default, a **Default Group** is created.

1. In the **Start group order** tab, select **Manage groups**. The **Manage groups** pane opens.
1. To create a new group, select **Add New Group** and provide a group name.
1. To reorder groups, use the up/down arrow buttons next to each group.
1. To rename a group, select the group name and edit it.
1. To move a resource between groups, select the three dots (**...**) next to the resource in the main view and choose the target group from the menu.
1. After managing groups, select **Next** to proceed to the **Group action** tab.

## Add group actions

Automate group-level actions that execute during failover. Two types of actions are supported: automation scripts (Azure Automation Runbooks) and manual steps.

### Add an automation script

1. In the **Group action** tab, select the three dots (**...**) for the group you want to configure.
1. Select **Add Script**. The **Edit Group Action** pane opens.
1. Provide a **name** for the action.
1. Select the **subscription**, **automation account**, and **runbook script**.
1. Set a **timeout** value (default: 60 minutes). If the script exceeds this timeout, the action is marked as failed.
1. Choose the script type: **Pre-script** (runs before group failover) or **Post-script** (runs after group failover).
1. Select **Ok**.

> [!NOTE]
> The Recovery Plan's Managed Identity requires the **Automation Job Operator** role on the Automation Account to run automation scripts.

### Add a manual step

1. In the **Group action** tab, select the three dots (**...**) for the group.
1. Select **Add Manual Step**. The **Edit Group Action** pane opens.
1. Provide a **name** for the step and **action instructions** describing what needs to be done manually.
1. Choose the step type: **Pre-step** (runs before group failover) or **Post-step** (runs after group failover).
1. Select **Ok**.

During failover, manual actions pause the failover job. The job remains paused until you navigate to the Recovery Plan execution page and manually acknowledge and resume the action.

## Review and update the plan

Save your configuration changes after completing resource protection, group order, and group actions.

1. Select **Next** to navigate to the **Review + update** tab.
1. Review the Summary: number of resources included and excluded, the start group order with resources in each group, and any configured group actions (scripts and manual steps).
1. Select **Update** to save all your configuration changes.

After a successful update, the plan transitions to the **Ready** state if no resources have Needs Attention status. If any resource still has Needs Attention, the plan remains in **Warning** state—review the Needs Attention reasons and resolve them.

## Related content

- [Execute failover and reprotect operations](recovery-orchestration-plan-execute.md)
- [Support matrix for Recovery Orchestration Plan](recovery-orchestration-plan-support-matrix.md)
