---
title: Execute Zone Down Drill in Infrastructure Resiliency Manager (preview)
description: Learn how to execute a Zone Down Drill in Infrastructure Resiliency Manager (preview). Configure Chaos Workspaces, manage identities, design faults, and verify Service Group readiness.
#customer intent: As a site reliability engineer, I want to execute a Zone Down Drill so that I can validate my service group's resiliency to zonal failures.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 06/02/2026
ms.topic: how-to
ms.service: resiliency
---

# Execute a Zone Down Drill in Infrastructure Resiliency Manager (preview)

This article describes how to execute a Zone Down Drill (preview) in Infrastructure Resiliency Manager. This capability simulates an Availability Zone failure and validates application resiliency. It also covers tracking drill execution progress, analyzing resource health, and ending the drill execution process.

## Prerequisites

Before you execute the down drill operation, ensure that you [define a Zone Down Drill (preview)](availability-zone-down-drill-define.md).

## Execute the drill

When the Drill execution readiness shows the status as **Ready**, you can execute the drill. 

To execute the drill, follow these steps: 

1. On the selected drill instance pane, select **Overview** > **Execute drill**.

1. On the **Drill execution** pane, after completion of Recovery Plan readiness, select the source region and zone on which you want to execute the fault injection and failover operation.

1. Select **Execute fault injection** to confirm execution.

## Track the drill execution progress

When you start the drill execution, the **Drill run details** pane opens and shows the progress of a single job. This job includes the execution of Fault Injection, Failover, and Reprotection.

To proceed through the drill and review the system state, follow these steps:

1. After each stage (Fault Injection, Failover, or Reprotection) completes, select **Mark step as complete** to move to the next stage.

   During each stage, review the Service Group health status to understand the current system state.


1. To analyze resource-level health and downtime, select **View details** next to the **Service Group health status**.

   The **Service Group health details** pane shows individual metrics and the downtime for each resource across Fault Injection, Failover, and Reprotection steps.

## End the drill execution process

After executing all drill operations, you can end the drill execution process. Ending the drill execution allows you to attest the final status of the drill, and review notes added during execution.

To end the drill execution, follow these steps:

1. On the **Drill run details** pane, select **OK**.

1. On the **End execution and complete attestation** pane, select **End execution**. 

## Related content

[About Availability Zone Down Drills in Infrastructure Resiliency Manager (preview)](availability-zone-down-drills-about.md).