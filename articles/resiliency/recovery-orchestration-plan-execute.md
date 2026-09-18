---
title: Execute failover and reprotect operations in Recovery Orchestration Plan in Resiliency
description: Learn how to execute failover, reprotect resources, and run on-demand readiness checks in Azure Recovery Orchestration Plan.
ms.topic: how-to
ms.date: 06/02/2026
ms.service: resiliency
author: shsangal
ms.author: shsangal
# Customer intent: "As a cloud administrator, I want to execute failover and reprotect operations using a Recovery Orchestration Plan so that I can recover my application during a zonal outage."
---

# Execute failover and reprotect operation using Recovery Orchestration Plan (preview)

This article describes how to execute failover, reprotect resources after failover, and run on-demand readiness checks in your Recovery Orchestration Plan (preview).

## Prerequisites

Before you execute failover and reprotect operations, review the following prerequisites:

- Check if a **Recovery Orchestration Plan** in **Ready** or **Warning** status.
- Verify that at least one resource included in the plan has no **Needs Attention** status.
- Ensure that the Azure Resilience Management Recovery Contributor or Azure Resilience Management Recovery Administrator role is assigned.
- Ensure that resources protected using Azure Site Recovery have healthy replication status.

## Execute failover

Perform a zonal failover operation to recover your application resources from the affected zone.

To execute a failover operation, follow these steps:

1. On the **Recovery Plan** pane, select **Execute** > **Failover**.
1. Select the **active location** (region) under which you want to fail over the resources.
1. Select the **active physical zone** in the selected region. To determine the correct physical zone, select **Review zone mapping** to check the subscription-wise mapping of logical zones to physical zones.

   Resources are categorized in the following tabs:

   - **Resources qualified for operation**: Resources that meet all criteria for failover.
   - **Resources skipped for operation**: Resources that don't qualify appear with a skip reason.

1. On the **Resources qualified for operation** tab, select the resources you want to fail over. You can select all or a subset.
1. Select the confirmation checkbox: **I understand and agree to perform operations on only the qualified resources.**
1. Select **Execute** to start the failover.

### Resources Failover Qualification

A resource qualifies for failover if it meets all of the following criteria:

- Is protected by a non-HA solution (for example, Azure Site Recovery).
- Is included in the recovery plan (not excluded or in **State not selected**).
- Is present in the selected active location and zone.
- Doesn't have a **Needs Attention** status.
- Has valid recovery points available for failover.

The following table lists the common reasons for which resource might be skipped from failover execution:

| Skip reason | Description |
|---|---|
| Resource not in the plan | The resource is excluded or not yet included. |
| Resource is Highly Available | HA resources handle failover automatically. |
| Resource not protected | No protection solution is configured. |
| Resource needs attention | The resource has an unresolved Needs Attention code. |
| Resource not in the active location | The resource isn't in the selected region. |
| Resource not in the active zone | The resource isn't in the selected physical zone. |
| Failover not allowed for the resource | The resource might already be in a failed-over state or lacks recovery points. |

### Understand failover execution

After failover starts, the following actions and behaviors define how resources and tasks execute during the failover process:

- Resources fail over in the order defined by your groups. Group 1 resources must all complete before Group 2 begins.
- Resources within the same group failover in parallel.
- **Prescripts** execute before the group's resources begin failover. **Post-scripts** execute after all resources in the group complete.
- **Manual actions** pause the failover job. To view the manual step instructions, complete the required action, and resume the failover, go to the Recovery Plan execution pane.

> [!NOTE]
> After failover completes, the Recovery Plan automatically adds the failed-over resource to the Service Group and Recovery Plan when the managed identity has sufficient permissions. If permissions are insufficient, the system marks the resource with the **Needs Attention** code *`FailedOverResourceNeedsToBeAddedToServiceGroupAndRecoveryPlan`*.

## Reprotect resources after failover

After failover completes, reprotect your resources to resume active replication and restore protection against future zone failures. Complete reprotect at the earliest to minimize the duration of unprotected state. If a resource isn’t qualified for reprotect, verify that failover succeeds and add the resource back to the plan.

To reprotect resources, follow these steps:

1. On the **Recovery Plan** pane, select **Execute** > **Reprotect**. You can view all the resources that successfully complete failover and are eligible for reprotection.
1. On the **Re-protect** pane, under **Resources qualified for operation**, select the resources you want to reprotect.
1. Select the confirmation checkbox: **I understand and agree to perform operations on only the qualified resources.**
1. Select **Execute** to start the Reprotect operation.


## Run an on-demand readiness check

Readiness checks run automatically every 24 hours to assess the recovery readiness of your application. The following validations occur during the readiness check:

- **Application Modification check**: Detects if new resource is added to or removed from the Service Group since the last check. Newly added resources appear with "State not selected" inclusion state (or are automatically excluded if HA-protected).
- **Protection health check**: Validates the protection solution and health status for each resource. If a resource's protection health is degraded or the protection solution changed, the resource is marked with an appropriate **Needs Attention** reason.

To run an on-demand readiness check, follow these steps:

1. On the **Recovery Plan** pane, select **Execute** > **Plan readiness check (on demand)**.
   Review the description of checks.
1. Select **Execute** to run the checks.

After the readiness check completes, to review any new **Needs Attention** items and resolve them to maintain the plan in **Ready** state, go to **Configure Plan** > **Manage resource protection**.

## Related content

- [Create and configure a Recovery Orchestration Plan (preview)](recovery-orchestration-plan-create-configure.md).
