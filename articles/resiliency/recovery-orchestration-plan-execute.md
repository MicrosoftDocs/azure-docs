---
title: Execute failover and reprotect operations in Recovery Orchestration Plan
description: Learn how to execute failover, reprotect resources, and run on-demand readiness checks in Azure Recovery Orchestration Plan.
ms.topic: how-to
ms.date: 05/18/2026
ms.service: resiliency
author: shsangal
ms.author: shsangal
# Customer intent: "As a cloud administrator, I want to execute failover and reprotect operations using a Recovery Orchestration Plan so that I can recover my application during a zonal outage."
---

# Execute failover and reprotect operations

In this article, you execute failover, reprotect resources after failover, and run on-demand readiness checks in your Recovery Orchestration Plan.

## Prerequisites

- A Recovery Orchestration Plan in **Ready** or **Warning** state.
- At least one resource included in the plan with no Needs Attention status.
- Azure Resilience Management Recovery Contributor or Azure Resilience Management Recovery Administrator role.
- Resources protected using Azure Site Recovery with healthy replication status.

## Execute failover

Perform a zonal failover operation to recover your application resources from the affected zone.

1. From the Recovery Plan page, select **Execute** > **Failover**.
1. Select the **active location** (region) whose resources you want to fail over.
1. Select the **active physical zone** in the selected region. To determine the correct physical zone, select **Review zone mapping** to see the subscription-wise mapping of logical zones to physical zones.

After you selected the location and zone, resources are categorized into two tabs:

- **Resources qualified for operation**: Resources that meet all criteria for failover.
- **Resources skipped for operation**: Resources that don't qualify, with a skip reason displayed for each.

A resource qualifies for failover if it meets all of the following criteria:

- Is protected by a non-HA solution (for example, Azure Site Recovery).
- Is included in the recovery plan (not excluded or in "State not selected").
- Is present in the selected active location and zone.
- Doesn't have a Needs Attention status.
- Has valid recovery points available for failover.

Common reasons a resource might be skipped:

| Skip reason | Description |
|---|---|
| Resource not in the plan | The resource is excluded or not yet included. |
| Resource is Highly Available | HA resources handle failover automatically. |
| Resource not protected | No protection solution is configured. |
| Resource needs attention | The resource has an unresolved Needs Attention code. |
| Resource not in the active location | The resource isn't in the selected region. |
| Resource not in the active zone | The resource isn't in the selected physical zone. |
| Failover not allowed for the resource | The resource might already be in a failed-over state or lacks recovery points. |

4. In the **Resources qualified for operation** tab, select the resources you want to fail over. You can select all or a subset.
1. Check the confirmation checkbox: **"I understand and agree to perform operations on only the qualified resources."**
1. Select **Execute** to start the failover.

### Failover execution behavior

Once failover starts:

- Resources fail over in the order defined by your groups. Group 1 resources must all complete before Group 2 begins.
- Resources within the same group failover in parallel.
- **Pre-scripts** execute before the group's resources begin failover. **Post-scripts** execute after all resources in the group complete.
- **Manual actions** pause the failover job. Navigate to the Recovery Plan execution page to view the manual step instructions, complete the required action, and resume the failover.

> [!NOTE]
> After failover completes, the Recovery Plan automatically adds the failed-over resource back to the Service Group and plan (if the managed identity has sufficient permissions). If permissions are insufficient, the resource is marked with the Needs Attention code `FailedOverResourceNeedsToBeAddedToServiceGroupAndRecoveryPlan`.

## Reprotect resources after failover

After failover completes, reprotect your resources to ensure they resume active replication and are protected for any future zone failure.

1. From the Recovery Plan page, select **Execute** > **Re-protect**.
1. The reprotect page shows resources under **Resources qualified for operation**—resources that successfully completed failover and are eligible for Reprotect.
1. Select the resources you want to Reprotect.
1. Check the confirmation checkbox.
1. Select **Execute** to start the Reprotect operation.

> [!NOTE]
> Complete reprotect as soon as possible after failover to minimize the window during which resources are unprotected. If a resource doesn't appear as qualified for reprotect, verify that failover completed successfully and the resource are added back to the plan.

## Run an on-demand readiness check

Readiness checks run automatically every 24 hours to assess the recovery readiness of your application. You can also run them on demand.

1. From the Recovery Plan page, select **Execute** > **Plan readiness check (on demand)**.
1. Review the description of checks.
1. Select **Execute** to run the checks.

### Types of readiness checks

The following checks are performed:

- **Application Modification check**: Detects if new resource is added to or removed from the Service Group since the last check. Newly added resources appear with "State not selected" inclusion state (or are automatically excluded if HA-protected).
- **Protection health check**: Validates the protection solution and health status for each resource. If a resource's protection health is degraded or the protection solution changed, the resource is marked with an appropriate Needs Attention code.

After the readiness check completes, review any new Needs Attention items in the **Configure Plan** > **Manage resource protection** page and resolve them to maintain the plan in **Ready** state.

## Related content

- [Create and configure a Recovery Orchestration Plan](recovery-orchestration-plan-create-configure.md)