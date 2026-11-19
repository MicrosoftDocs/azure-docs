---
title: Workload health observability
titleSuffix: Azure Workload Center for Oracle
description: Learn how workload health observability models the health of an Oracle workload with entities, signals, and health states.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: concept-article
ms.custom: references_regions
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Workload health observability

Workload health observability gives you an at-a-glance view of the health of your Oracle workload, its components, and its Azure resources. An AI summary, a timeline, and a graph show when and where a problem started and which signals caused it, so you can triage faster.

Workload health uses [Azure Monitor health models](/azure/azure-monitor/health-models/overview). Azure Workload Center for Oracle sets up the health model when you enroll an Oracle system. The health model comes with predefined health definitions, metrics, and thresholds for Oracle workloads.

When you add or remove components and resources, the health model changes with them. You can also set up health-based alerts at the workload or component level, instead of separate metric alerts on each resource.

You can change the metrics, thresholds, and health definitions to match what healthy means for your workload. Your changes stay in place when the health model updates.

## Entities

Entities are the building blocks of a health model.

- **Root entity**: Represents the overall health of the WVI. A health model has one root entity. All other entities connect to it directly or through other entities.

- **Generic entity**: Represents a workload component or another group of entities, such as Database Services. Its health usually comes from its child entities. It can also have its own signals.

- **Azure resource entity**: Represents an Azure resource, such as an Exadata VM cluster, a CDB, or a VM. It isn't the resource itself. Its health comes from signals on the metrics of that resource. If several entities represent the same resource, each entity has its own signals and health state.

- **Relationship**: Connects a parent entity to a child entity, so that health can roll up. An entity can have several children and several parents.

:::image type="content" source="media/workload-health-observability/health-model-entities.png" alt-text="Diagram that shows a health model with a root entity, a generic entity, and two Azure resource entities connected by relationships." lightbox="media/workload-health-observability/health-model-entities.png":::

## Signals

A signal is a value from a metric or a query that the health model compares with thresholds. A signal can come from Azure platform metrics, a Log Analytics workspace, or an Azure Monitor workspace.

The health model doesn't collect data. It reads data that Azure Monitor already collects. Azure Workload Center for Oracle sets up the platform metric signals for you.

## Health states

| **State** | **What it means**                                                  |
|-----------|--------------------------------------------------------------------|
| Healthy   | The entity works as expected                                       |
| Degraded  | The entity works, but with reduced function or performance         |
| Unhealthy | The entity doesn't work, or its performance isn't acceptable       |
| Unknown   | The health can't be determined because data or signals are missing |

Each signal has a Degraded threshold and an Unhealthy threshold. For example, the CPU utilization signal of an Exadata VM cluster is Degraded above 85% and Unhealthy above 95%. At 90%, the signal is Degraded. An entity takes the worst state of its signals

## Health propagation

The health of an entity also depends on its child entities. For example, the health of the Database Services component depends on the health of the Exadata VM cluster and its databases

You can change how a parent entity calculates its health from the health of its children. The dependencies configuration of the parent sets the aggregation type, the unit type, and whether Unknown children count.

### Aggregation type

| **Aggregation type** | **How the parent health is calculated** | **Example** |
|---|---|---|
| Worst of (default) | The parent takes the worst state of its children. Unhealthy is the worst, then Degraded, then Healthy. Unknown is the least severe state | The Exadata VM cluster is Degraded, and the other resources of the Database Services component are Healthy. The component is Degraded |
| Minimum healthy | The parent becomes Degraded or Unhealthy when the number of Healthy children falls to or below the thresholds that you set | The Application Services component has four VMs. The Degraded threshold is 3 and the Unhealthy threshold is 1. When one VM is Unhealthy, three VMs are Healthy, so the component is Degraded |
| Maximum not healthy | The parent becomes Degraded or Unhealthy when the number of children that aren't Healthy reaches or exceeds the thresholds that you set | The Application Services component has four VMs. The unit type is Percentage, the Degraded threshold is 25, and the Unhealthy threshold is 50. When one VM is Unhealthy (25%), the component is Degraded. When two VMs are Unhealthy (50%), the component is Unhealthy |

For Maximum not healthy, Degraded and Unhealthy children count as not healthy. Unknown children also count when Ignore Unknown is off.

### Unit type

The unit type sets how the thresholds of Minimum healthy and Maximum not healthy are measured:

- **Absolute**: The number of children, for example 3 VMs

- **Percentage**: The share of children, from 0 to 100

### Ignore Unknown

**Ignore Unknown** sets whether children in the Unknown state count in the calculation:

- **On**: Unknown children are left out of the counts, the percentages, and the Worst of comparison. If all children are Unknown, the parent is Unknown

- **Off**: Unknown children count in Minimum healthy and Maximum not healthy. In Worst of, Unknown is the least severe state, so it decides the parent state only when all children are Unknown

### Impact

The impact setting of a child entity controls which state the child passes to its parent:

| **Impact**         | **What the parent receives**                                                                                         | **Example**                                                                        |
|--------------------|----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| Standard (default) | The state of the child as it is                                                                                      | An Unhealthy application VM passes Unhealthy to the Application Services component |
| Limited            | Degraded isn't passed on. Unhealthy is passed on as Degraded, so the parent never receives Unhealthy from this child | An Unhealthy application VM passes only Degraded to the component                  |
| Suppressed         | No state. The child doesn't affect the health of its parent                                                          | An Unhealthy application VM doesn't change the health of the component             |

For health objectives, alerts, and other options, see [Azure Monitor health models concepts](/azure/azure-monitor/health-models/concepts)

## Region mapping

Azure Monitor health models aren't available in every region. The region of the WVI determines the region of its health model.

| **WVI region**                                   | **Health model region** |
|--------------------------------------------------|-------------------------|
| Central US, East US, East US 2, South Central US | Central US              |
| Italy North                                      | Italy North             |
| North Europe                                     | North Europe            |
| West Europe                                      | West Europe             |
| Germany West Central                             | Germany West Central    |
| Korea Central, Japan East                        | Japan West              |
| Australia East                                   | Australia East          |

## Pricing

Azure Monitor health models is a paid service. Health models that Azure Workload Center for Oracle creates when you enroll an Oracle system aren't billed during the preview.
