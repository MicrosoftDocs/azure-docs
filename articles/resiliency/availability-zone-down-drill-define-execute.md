---
title: Define and Execute a Zone Down Drill in Azure
description: Learn how to define and execute a Zone Down Drill in Azure. Configure Chaos Workspaces, manage identities, design faults, and verify Service Group readiness.
#customer intent: As a site reliability engineer, I want to define and execute a Zone Down Drill so that I can validate my service group's resiliency to zonal failures.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 06/02/2026
ms.topic: how-to
ms.service: resiliency
---

# Define and execute a Zone Down Drill (preview)

This article describes how to define and execute a Zone Down Drill (preview) in Azure Resiliency. This capability simulates an Availability Zone failure and validates application resiliency. It also covers configuring Chaos Workspaces, managing identities, designing faults, and verifying Service Group readiness for zonal failures.

## Prerequisites

Before you define a zone down drill, ensure that you review the following prerequisites:

- Check that you have an existing service group with the required resources.
- Set up an Azure role-based access control (Azure RBAC) permissions. See the [Support Matrix](availability-zone-down-drills-support-matrix.md#required-roles-and-permissions).
- Set up a Recovery Plan for your Service Group.
- Register the `Microsoft.Chaos`, `Microsoft.Insights`, `Microsoft.OperationalInsights`, and `Microsoft.Automation` resource providers in the subscription where the Chaos Workspace gets created.

## Register the resource provider namespaces

You need to register the resource provider namespaces `Microsoft.Chaos`, `Microsoft.Insights`, `Microsoft.OperationalInsights`, and `Microsoft.Automation` in the subscription. These configurations allow you to enable drill design, execution, monitoring, and the required monitoring setup creation.
To register a resource provider namespace, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Subscriptions** and select the subscription where you want to register the resource providers.
1. On the **Subscriptions** pane, select **Settings** > **Resource providers**.
1. On the **Resource providers** pane, search for the resource provider namespace (for example **Microsoft.Chaos**), select it from the list, and select **Register**.

Wait for approximately 15-20 minutes for the registration to complete.

## Create an Availability Zone down drill definition

Drill definition allows you to set parameters for a Zone Down Drill and prepare for execution. You can configure included resources, design faults for supported resources, and confirm readiness before execution.

To define an Availability Zone Down simulation drill, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Service groups** and select the service group for which you want to define the drill.

1. On the selected service group pane, select **Resiliency** > **Drills**.

1. On the **Drills** pane, select **+ Create drill**.

1. On the **Create Availability Zone Down Drill** pane, on the **Basics** tab, enter a name for the drill instance. Select the **Subscription** and **Region** to associate with the Chaos Workspace and Log Analytics Workspace.

   The subscription and region don't need to match the Service Group's subscriptions or regions.

1. On the **Permissions** tab, select **System-assigned identity** or **User-assigned identity** that allows you to securely fetch Service Group resources, execute Recovery Plans, and manage metrics.

   You can use the same identity for fault injection, or select a different one.

1. On the **Review + create** tab, review the configuration, and select **Create** to confirm creation.

The drill instance is created. Review the summary widgets on the **Overview** pane and identify parameters that need attention before execution.

>[!NOTE]
>You can associate each service group with a single drill instance.

## Review and configure resources for the drill

This section helps you verify and configure drill resources. You can review permissions, validate resource inclusion, assess metrics readiness, and include required resources to ensure successful drill execution.

To review and configure resources for the drill, follow these steps:

1. On the selected service group pane, select **Resiliency** > **Drills**.

1.  On the **Drills** pane, select the drill instance you created.

### Review drill role assignment status

To review drill role assignment status, follow these steps:

1. On the selected drill instance pane, select **Settings** > **Identity and permissions**.

1. On the **Identity and permissions** pane, under **Role assignment status**, select **View details**.

1. On the **Drill role assignment** pane, review the list of identities and their corresponding role assignment status.

If there are errors in Drills Role Assignment status,  reassess the status by selecting **Assess role assignment readiness**.

### Review the resources included in the drill

The zone down drill allows you to review the resources included in the drill. The drill does the following actions:

- Includes resources with a native zonal resiliency solution by default; these resources qualify for fault injection.
- Associates a Recovery Plan with the Service Group for resources that require manual failover (for example, Virtual Machines with Azure Site Recovery).
- Excludes resources that lack native zonal resiliency, aren't part of a Recovery Plan, or don't support zonal resiliency detection for the resource type.

To include resources in the drill, follow these steps:

1. On the selected drill instance pane, select **Settings** > **Drills scope**.
1. On the **Drill scope** pane, on the **Resiliency solutions** tab, under **Resources excluded from drill**, select **View details**.
1. On the **View details and include resources** pane, to add an excluded resource, select the resource from the list, and select **Include resources**.

### Review the metrics

To review the metrics for drill execution, follow these steps:

1. On the selected drill instance pane, select **Settings** > **Monitoring**.
1. On the **Monitoring** pane, review the list of resources and their corresponding metrics readiness status for drill execution.


## Design faults for supported and unsupported resources

To design faults for supported and unsupported resources in the drill, follow these steps:

1. On the selected drill instance pane, select **Settings** > **Drills scope**.
1. On the **Drills scope** pane, on the **Fault designer** tab, to review or modify the corresponding fault design status of resources, select a resource from the list and select **Edit fault**.

1. For unsupported resource types fault details configuration, on the **Fault details** pane, define custom fault logic using Azure Runbooks and select **Save**.

1. To complete the role assignment, on the **Fault designer** tab, select a resource type from the list and select **Include and prepare for fault injection** or **Exclude from fault injection**.

>[!NOTE]
>All resources appear in the **Needs Attention** state by default. To troubleshoot readiness issues, select **Needs Attention** corresponding to each resource. You can set the Fault duration for the fault injection time configuration (default time is 10 minutes).

### Verify readiness and fix configuration drifts

After the fault design is complete, review readiness across all summary widgets.

To review and fix configuration drifts, follow these steps:

1. On the selected drill instance pane, select **Overview** > **Resync and check readiness**.

1. If the **Drill execution readiness** status shows **Not Ready**, select the status.

1. On the **Drill execution readiness state** pane, change the status to **Ready**.

>[!NOTE]
>Refresh the drill instance after every edit operation.

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

After executing all drill operations, you can end the drill execution process. Ending the drill execution allows you to attest the final status of the drill and review notes added during execution.

To end the drill execution, follow these steps:

1. On the **Drill run details** pane, select **OK**.

1. On the **End execution and complete attestation** pane, select **End execution**. 

## Related content

[About Availability Zone Down Drills in Infrastructure Resiliency Manager (preview)](availability-zone-down-drills-about.md)