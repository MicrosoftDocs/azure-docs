---
title: About Azure Recovery Orchestration Plan
description: Learn about Azure Recovery Orchestration Plan (preview) and how it can help you orchestrate recovery across multiple resources within an application for zone resilience in Azure.
ms.topic: overview
ms.service: resiliency
ms.date: 10/12/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud administrator, I want to understand how Azure Recovery Orchestration Plan can help me orchestrate recovery across multiple resources within an application for zone resilience."
---


# About Azure Recovery Orchestration Plan (preview)

Azure Recovery Orchestration Plan performs efficient and seamless recovery by orchestrating recovery across multiple resources within an application for zone resilience. The capability integrates with Azure Service Groups to provide application-level recovery orchestration.

Recovery Orchestration Plans are an advanced capability and require the service group to be enrolled in a usage plan. The usage plan identifies the Azure subscription to use for billing when pricing for advanced capabilities takes effect once they're generally available. Usage plans don't have tiers.

## Key benefits of Azure Recovery Orchestration Plan

With Recovery Orchestration Plan, you can:

- Define the order of recovery for resources within your application using customizable groups.
- Perform automated readiness checks to detect drift in your applications, increasing the chances of successful recovery.
- Execute zone failover operations across multiple resource types.
- Automate group-level actions using Azure Automation runbooks.
- Reprotect resources after failover to maintain ongoing protection.

>[!NOTE]
>The Recovery Orchestration Plan orchestrates recovery and doesn't protect individual resources. To protect resources, configure Azure Site Recovery for Virtual Machines (VMs) or use Highly Available (HA) solutions for other resources. This capability supports only zone recovery and doesn't support regional recovery.

## Understand recovery plan components and actions

This section defines how recovery plans organize resources, track states, and execute operations for coordinated recovery.

### Recovery plan and service groups

Create a Recovery Orchestration Plan within a service group. A service group represents your application and contains the Azure resources that make up your application. The recovery plan orchestrates the failover of these resources in a defined order.

### Plan status

The following plan statuses indicate the readiness for failover:

- **Ready**: The plan meets all requirements for failover. No resources have **Needs Attention** status.
- **Warning**: Some resources require attention, but you can still initiate failover if at least one included resource doesn’t have a **Needs Attention** status.

### Groups and recovery order

Groups define the order of resource recovery. By default, a Default Group is created. You can create other groups and move resources between them.

Resources within the same group fail over in parallel. Resources in different groups fail over sequentially - Group 2 starts only after all Group 1 resources complete failover.

### Resource protection and inclusion status

Each resource has a protection status and an inclusion status:

- **Protection status**: Azure Site Recovery, Highly Available (HA) solutions, or Not protected.
- **Included**: Resources actively part of the plan, orchestrated during failover.
- **Excluded**: Resources not included. HA resources are automatically excluded.
- **State not selected**: Default state for unprotected or non-HA resources. You must explicitly include or exclude the resources.

### Resources with Needs Attention status

Resources with issues preventing failover orchestration are marked **Needs Attention** with an appropriate reason. Resolve all **Needs Attention** items to move the plan to **Ready** state.

### Readiness checks

Automated readiness checks run every 24 hours. The readiness checks are categorized as:

- **Application Modification check**: Detects resources added to or removed from a Service Group.
- **Protection health check**: Validates protection solution and health for each resource.

You can also run readiness checks on demand from the **Execute** menu.

### Execution operations

The execution operations for plan orchestration are categorized as:

- **Failover**: Orchestrates failover from the active zone to the recovery zone.
- **Reprotect**: Reprotects resources after failover for continued replication.
- **Readiness check**: Runs on-demand readiness assessments.

### Group actions

Add Azure Automation runbooks as prescripts and postscripts. You can also add manual steps.

- **Pre-scripts**: Runs before group resources begin failover.
- **Post-scripts**: Runs after group resources complete failover.
- **Manual actions**: Allows resuming the failover job when it’s paused.

## Role-based access control

To create and manage a Recovery Plan, you need one of the following roles:

- Azure Resilience Management Recovery Contributor
- Azure Resilience Management Recovery Administrator

## Related content

- [Support matrix for Azure Recovery Orchestration Plan (preview)](recovery-orchestration-plan-support-matrix.md).
- [Create and configure a Recovery Orchestration Plan (preview)](recovery-orchestration-plan-create-configure.md).
- [Execute failover and reprotect operations (preview)](recovery-orchestration-plan-execute.md).
