---
title: Autoscale in Azure Event Grid namespaces (preview)
description: Learn how Autoscale automatically adjusts throughput units in Azure Event Grid namespaces based on real-time event traffic and resource utilization.
#customer intent: As an architect, I want to understand how Autoscale works in Event Grid namespaces so that I can automatically scale my namespace capacity based on traffic demands.
ms.topic: concept-article
ms.date: 05/14/2026
ai-usage: ai-assisted
# Customer intent: As an architect or developer, I want to understand how Autoscale works in Event Grid namespaces so that I can automatically scale my namespace capacity based on traffic demands.
---

# Autoscale in Azure Event Grid namespaces (preview)

Azure Event Grid namespaces use throughput units (TUs) to define the capacity for your workloads. Autoscale is a built-in capability that automatically adjusts the number of TUs assigned to a namespace in response to real-time event traffic and resource utilization. You can enable Autoscale on any Event Grid namespace in the **Standard** tier.

When you enable Autoscale, Event Grid continuously monitors key performance indicators such as event ingress rate, event egress rate, MQTT connection counts, and message throughput. When utilization crosses defined thresholds, Event Grid scales the number of TUs up or down within the minimum and maximum limits you configure. This behavior helps maintain consistent performance during traffic spikes and reduces cost during low-activity periods, without requiring manual intervention.

> [!NOTE]
> Autoscale is available only for Event Grid namespaces in the **Standard** tier. For more information about tiers, see [Choose the right Event Grid tier for your solution](choose-right-tier.md).

## Why use Autoscale

Event-driven and IoT workloads are often unpredictable. Connection counts, message throughput, and event delivery rates can fluctuate significantly based on business activity, time of day, or external triggers. Fixed-capacity provisioning can lead to two problems:

- **Under-provisioning**: When traffic exceeds the allocated capacity, events might be throttled, leading to increased latency or dropped messages.
- **Over-provisioning**: When traffic is low, you pay for capacity you don't use.

Autoscale addresses both problems by automatically right-sizing your namespace capacity. It's especially valuable for:

- **MQTT workloads** where message fan-out and subscription growth can change rapidly as devices connect and disconnect.
- **Event broker workloads** with bursty ingress patterns, such as periodic batch uploads or demand-driven spikes.
- **Multi-tenant applications** where subscriber count and delivery volume shift across tenants.

## Enable autoscale

Autoscale is a fully managed experience. You enable it on the namespace and specify the minimum and maximum number of TUs. Event Grid handles all scaling decisions internally. You don't need to configure individual scaling rules, thresholds, or cooldown periods.

You can enable autoscale by using the Azure portal, Azure Resource Manager template, or REST API. For more information, see [Enable autoscale for an Event Grid namespace](namespace-enable-autoscale.md). 

When you enable autoscale, Event Grid continuously evaluates utilization across all scaling categories. The system aggregates usage data over a lookback window and compares the highest utilization across categories against internal thresholds. Based on this evaluation, Event Grid automatically increases or decreases TUs within your configured bounds.

## Scaling categories and per-TU capacity

The following table shows the capacity provided by each throughput unit. Autoscale evaluates utilization as a percentage of these limits across both event broker and MQTT workloads.

| Category | Capacity per TU |
|---|---|
| Event ingress (count) | 1,000 events/second |
| Event ingress (throughput) | 1 MB/second |
| Event egress (count) | 2,000 events/second |
| Event egress (throughput) | 2 MB/second |
| MQTT inbound publish (count) | 1,000 messages/second |
| MQTT inbound publish (throughput) | 1 MB/second |
| MQTT outbound publish (count) | 1,000 messages/second |
| MQTT outbound publish (throughput) | 1 MB/second |
| MQTT registered client resources | 10,000 clients |
| MQTT active connections | 10,000 connections |
| MQTT Retain Messages Count | 100/s messages |
| MQTT Connect Count | 200 requests/second |

For the full list of namespace limits, see [Azure Event Grid quotas and limits](quotas-limits.md).

## Scaling behavior and thresholds

### Scale-up behavior

A scale-up operation starts when any single category exceeds maximum utilization threshold during the lookback window. When a scale-up starts, Event Grid calculates the number of TUs required to normalize the utilization. The TU increase is constrained by the maximum TU limit you configured on the namespace.

### Scale-down behavior

A scale-down operation starts when all categories consistently drop below the minimum utilization threshold. When Event Grid triggers a scale-down, it calculates the number of TUs needed to normalize the utilization. The TU decrease follows the minimum TU limit you set.

### Cooldown periods

After a scaling operation finishes, a cooldown period applies before more scaling can happen. The cooldown period prevents rapid switching between scale-up and scale-down actions, so it gives the system time to stabilize under the new capacity.


## Scaling example

Consider a namespace currently allocated at 12 TUs with the following observed traffic over the lookback window:

- Event ingress: 11,000 events/second
- Event ingress throughput: 3.6 MB/second

### Step 1: Calculate utilization per category

| Category | Calculation | Utilization |
|---|---|---|
| Event ingress (count) | 11,000 / (12 x 1,000) | 91.7% |
| Event ingress (throughput) | 3.6 / (12 x 1) | 30.0% |

### Step 2: Determine the highest utilization

The maximum utilization across all categories is 91.7% (event ingress count). 

### Step 3: Trigger scale up operation 
Because 91.7% exceeds the scale-up utilization threshold, a scale-up operation is triggered.

### Step 4: Apply namespace bounds

If the namespace maximum is set to 15 TUs, the final value is clamped to 15 TUs.

If the scale-up operation requires raising the TU count to 15 but the namespace maximum is set to 20 TUs, the final TU count after the scale-up operation is 15 TUs.

**Result:**

The namespace scales from 12 TUs to 15 TUs.

> [!TIP]
> In subsequent evaluation cycles, the system re-evaluates utilization at 15 TUs. This process continues until utilization falls below the threshold or the maximum TU limit is reached.

## Limits and considerations

- Autoscale is available only in the Standard tier.
- The maximum number of TUs per namespace is 40. To request an increase beyond 40 TUs, contact Microsoft support. 
- The minimum TU value for Autoscale is 1.
- Autoscale evaluates all categories together. If only one category has high utilization, a scale-up is still triggered. Plan your minimum and maximum TU values to accommodate the highest expected demand across all categories.
- During a cooldown period, no scaling operations are performed, even if utilization changes. Size your minimum TU allocation to handle expected baseline load without requiring immediate scale-up.
- Scaling operations are performed asynchronously. There might be a brief period between when a scaling decision is made and when the new capacity takes effect.

## Related content

- [Enable Autoscale for an Event Grid namespace](namespace-enable-autoscale.md)
- [Azure Event Grid quotas and limits](quotas-limits.md)
- [Azure Event Grid namespace concepts](concepts-event-grid-namespaces.md)

