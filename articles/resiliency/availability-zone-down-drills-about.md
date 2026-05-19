---
title: About Availability Zone Down Drills in Infrastructure Resiliency Manager
description: Learn about Availability Zone Down Drills in Infrastructure Resiliency Manager (preview) and how it helps you assess cross-zone resiliency for your applications.
ms.topic: overview
ms.date: 06/03/2026
ms.service: resiliency
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud administrator, I want to understand how Availability Zone Down Drills in Infrastructure Resiliency Manager (preview) can help me simulate zone outages and assess cross-zone resiliency for my applications, so that I can identify and address potential weaknesses in my infrastructure before an actual outage occurs."
---

# About Availability Zone Down Drills in Infrastructure Resiliency Manager (preview)

Infrastructure Resiliency Manager allows you to assess the resiliency of Service Group resources by simulating zone outages on individual resources. You can evaluate the performance of cross-zone resiliency solutions for your applications and identify resources that require Resiliency improvements to support application continuity.

An Availability Zone Down Drill templates provide Azure-recommended faults for supported resource types and allow you to override them with custom logic through Azure Runbooks. After fault injection, you can perform failover and reprotection for resources configured with active-passive solutions by using integrated Recovery Plans. You can also measure application downtime during outages. You can also monitor Service Group and resource health in real time during drill execution through integrated metrics.

## Key components for Availability Zone Down Drill

The following table lists the core components you use in Availability Zone Down Drills:

| **Component**  | **Description**  |
|----|----|
| Service Group  | A logical group of Azure resources that represent an application or workload.  |
| Zone Down Drill  | Template that simulates an availability zone outage on Service Group resources to evaluate cross-zone resiliency. |
| Fault Injection  | The process of introducing controlled failures to simulate zone outages.  |
| Recovery Plan  | A defined sequence of Failover and Reprotection operations to recover resources after fault injection.  |
| Fault Designer  | The interface to review and edit the faults applied to each resource in the drill. |
| Health Monitoring  | Integrated metrics experience to track resource health in real time during drill execution. |

## Drill execution lifecycle

The following sequence outlines each stage in the drill lifecycle and the actions performed at each step.

1. **Fault Injection**: Apply controlled faults to resources in the selected availability zone.

2. **Failover**: Trigger failover for resources configured with active-passive solutions by using the associated Recovery Plan.

3. **Reprotect**: Enable replication for failed-over resources to re-establish redundancy.

4. **Failover (Reverse)**: Fail resources back from the target zone to the source zone. 

5. **Reprotect (Reverse)**: Re-enable replication in the original direction to restore the baseline configuration.

### Related content

[Support matrix for Availability Zone Down Drills in Infrastructure Resiliency Manager (preview)](availability-zone-down-drills-support-matrix.md).