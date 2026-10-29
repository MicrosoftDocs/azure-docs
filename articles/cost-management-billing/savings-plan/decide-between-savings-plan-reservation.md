---
title: Decide between a savings plan and a reservation
titleSuffix: Microsoft Cost Management
description: Learn how to decide between a savings plan and a reservation.
author: nwokolo
ms.author: onwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: concept-article
ms.date: 10/29/2026
---

# Decide between a savings plan and a reservation

Azure provides you with two ways to save on your usage by committing for one or three years. You have the freedom to choose the savings options that best align with your workload patterns.

## Compare reservations with savings plans

Reservations and savings plans can help you save on eligible compute and database usage. With a reservation, you commit to a specific resource product or configuration for a set period. The applicable resource attributes, such as instance family and region, depend on the reservation product. For a compute example, you might commit to using a D2v4 virtual machine in the Japan East region for one year.

With a savings plan, you commit to a fixed hourly spend on eligible services across Azure regions for a set period. For example, you might commit to spending $5.00 per hour for three years. Eligibility depends on the selected plan type: a compute savings plan applies to eligible compute usage, and a database savings plan applies to eligible database usage. Each plan's benefits apply to eligible usage within its benefit scope, up to its hourly commitment.

### Choose a reservation

Choose reservations for compute or database workloads that run continuously and are highly stable, with no anticipated changes to the resource attributes required by the reservation, such as instance type, instance family, or region. When fully utilized, reservations can provide greater savings than savings plans for these workloads.

### Choose a savings plan

Choose savings plans when your compute or database workloads are dynamic or evolving, particularly if they use multiple eligible services or run in different Azure regions. Select a compute savings plan for eligible compute usage or a database savings plan for eligible database usage. Each plan provides flexible benefit application across the eligible services and regions for that plan type, with automatic optimization.

## How to optimize cost savings using both reservations and savings plans
To improve savings and limit unused commitments, consider the following sequence:
 
1. Right‑size first – Remove unused or oversized resources before buying any discounts. Discounts reduce rates, not waste.
2. Exchange underutilized reservations – If workloads changed, reassign existing reservations to better‑fit configurations instead of letting value go unused.
3. Trade‑in underutilized reservations for savings plans – When usage is variable, convert rigid reservations into more flexible, spend‑based savings plans.
4. Purchase new reservations – Commit only for stable, well‑understood workloads where usage and configuration are unlikely to change.
5. Purchase new savings plans – Finally, add flexible, spend‑based commitments sized to a clean, optimized baseline.

This sequence removes waste first, optimizes existing commitments next, and only then adds new commitments. It helps you achieve actual savings, not just theoretical discounts.

## Related content

For general information about savings plans, see [What are savings plans?](savings-plan-overview.md)
