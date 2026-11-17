---
title: Workload health observability - Azure Workload Center for SAP
description: Workload Health Observability gives you at-a-glance insights into workload health using AI-powered summaries and graphs. Learn how it works today.
ms.date: 11/06/2026
ms.topic: concept-article
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: references_regions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---

# Workload health observability in Azure Workload Center for SAP

Workload Health Observability provides an at-a-glance view of the health of your workload, its components, and underlying infrastructure. It helps you quickly detect issues and identify what's impacted. Through AI-powered health summaries, timeline and graph views, you can gain deeper insights into workload health, understand when and where issues occurred, and identify the signals contributing to unhealthy states. This information accelerates issue triage and investigation while reducing manual effort.

You can configure health-based alerts at the workload or component level, rather than relying on individual metric alerts across resources. This approach helps reduce alert noise and focus on issues that matter to your workload.

Workload health is powered by [Azure Monitor health models](/azure/azure-monitor/health-models/overview), which are set up when you onboard your workload. They include predefined health definitions, metrics, and thresholds tailored to your workload. As your environment evolves, changes such as the addition or removal of workload components and resources are automatically reflected in the health model. This process keeps it aligned with your workload without requiring manual maintenance.

You also have the flexibility to customize what healthy means for your workload by adjusting metrics, thresholds, and health definitions, or incorporating application-level signals from monitoring solutions such as [Azure Monitor for SAP solutions](../monitor/about-azure-monitor-sap-solutions.md). The health model preserves these customizations as it is maintained, giving you the benefits of an out-of-the-box experience without sacrificing flexibility.

## Workload Health Observability and Azure Monitor health models concepts

When you enable workload health on your WVI, Azure Monitor creates a health model that represents the infrastructure health of the workload. The model covers workload components and Azure infrastructure resources. The following concepts apply to the health model and are configured on your behalf:

### Entities

Entities are the building blocks of a health model. Each entity represents either an abstract workload concept, workload component, or an Azure resource. There are different types of entities:

:::image type="content" source="media/workload-health-observability/health-model-entity-types-diagram.png" alt-text="Diagram of health model hierarchy with root, generic, and Azure resource entities." lightbox="media/workload-health-observability/health-model-entity-types-diagram.png":::

**Root entity**

Every health model has a single root entity that represents the overall health of the WVI. All other entities connect to the root directly or through other entities.

**Azure resource entity**

An Azure resource entity represents an Azure resource such as a virtual machine but isn't the resource itself. Its health state comes from signals evaluated against that resource's platform metrics. If the resource is represented by multiple entities in the same or different models, the signals for each entity are evaluated separately, and each has its own independent health state.

**Generic (Logical) entity**

A generic entity represents a concept rather than an Azure resource or can be used to represent aggregation of other entities to help you quickly identify what part of the workload is impacted. A generic entity can have its own signals, although it might just have a health state determined by the health of its child entities.

**Relationship**

A relationship represents the dependency of one entity on another, or it might represent the aggregation of multiple entities into a single entity. An entity can have multiple child entities and multiple parent entities. The primary function of relationships is to support health propagation as described in health states.

### Signals

The health state of an entity in an Azure Monitor health model comes from one or more *signals*. A signal is a value from a metric or query that's periodically compared to threshold values associated with each health state for that entity. The health model doesn't perform the data collection that signals rely on, but it instead samples or queries data that's already being collected.

For every entity, you can configure signals from three data sources: Azure platform metrics, Log Analytics workspaces, and Azure Monitor workspaces. Azure platform metrics only apply if there's a linked Azure resource. Since these metrics are automatically collected for all Azure resources, you just need to configure the relevant metrics that determine health state. The service configures these metrics on your behalf when you enable workload health, and you can customize them. You can also add application metrics through other signals like Log Analytics workspaces. For more information, see the Manage and customize health models section.

### Health states

The *health state* of an entity represents its ability to perform its required tasks. It might be fully functional and performing within an expected range, or it might have limited functionality or degraded performance, or it might not be functional at all. Signals associated with an entity determine its health state. The health states of any child entities can affect it. You can view the most current health state of your workload and its components in addition to tracking the health of the model over time.

Health models use the health states in the following table to represent the health of each entity in the model. The configured thresholds determine the health state of the entity.

| **Icon**                                                                                        | **State** | **Description**                                                                                   |
|-------------------------------------------------------------------------------------------------|-----------|---------------------------------------------------------------------------------------------------|
| :::image type="icon" source="media/workload-health-observability/healthy-state-icon.png":::         | Healthy   | The entity is working as expected.                                                                |
| :::image type="icon" source="media/workload-health-observability/degraded-health-state-icon.png":::  | Degraded  | The entity is working but with diminished functionality or performance.                           |
| :::image type="icon" source="media/workload-health-observability/unhealthy-state-icon.png"::: | Unhealthy | The entity is not working or is working with unacceptable performance.                            |
| :::image type="icon" source="media/workload-health-observability/unknown-health-state-icon.png":::   | Unknown   | The health state of the entity can't be determined due to insufficient data or a lack of signals. |

For example, each metric signal for an Azure resource entity has a defined range for degraded and unhealthy states. When the value of each signal is outside of the degraded threshold, the health state of the entity is healthy to match all its signals. When the value of a signal is within the degraded or unhealthy threshold, then that signal is set to the corresponding health state, and the entity is set to the **worst state** of all its signals.

The default metric signals and thresholds and the corresponding health states for SAP workloads are defined in the *Default health and signal definitions for SAP* section.

### Health propagation

In addition to its own signals, the health state of an entity is affected by its child entities. This relationship typically represents the dependency of one entity in your health model on other entities. For instance, the health of a workload component is determined by the health state of child entities (infrastructure resources) that roll up to it.

:::image type="content" source="media/workload-health-observability/health-model-propagation-tree.png" alt-text="Diagram of health model showing unhealthy m40app1 causing degraded application and test-hm states." lightbox="media/workload-health-observability/health-model-propagation-tree.png":::

**Dependencies Configuration**: You can specify how the health state of dependent entities affects the parent entity. In other words, you can define how to compute an aggregate health state for a parent entity from the health states of its children. These configurations include:

:::image type="content" source="media/workload-health-observability/dependencies-configuration-minimum-healthy.png" alt-text="Screenshot of Dependencies configuration panel with Minimum healthy selected and unhealthy threshold set to 50%." lightbox="media/workload-health-observability/dependencies-configuration-minimum-healthy.png":::

**Aggregation type**

- **Worst of**: The parent takes the worst health among eligible children. Severity order is Unhealthy (worst), then Degraded, then Healthy, and then Unknown. Unknown state only determines parent health in Worst of if all children are in Unknown state.

- **Minimum healthy**: Parent health is derived from how many children are healthy. It becomes degraded or unhealthy when the number of healthy children or dependencies falls to or below the specified thresholds.

- **Maximum not healthy**: Parent health is derived from how many children are not healthy (Degraded or Unhealthy, or Unknown only when Ignore Unknown is not checked or False). It becomes degraded or unhealthy when the number of not healthy children or dependencies reaches or exceeds the specified thresholds.

**Unit Types**

- **Absolute**: Thresholds and computed values are raw counts (for example, number of healthy children).

- **Percentage**: Thresholds and computed values are percentages in the range 0–100.

**Ignore Unknown**

The configuration Ignore Unknown controls whether children with Unknown state participate in aggregation:

- **If Ignore Unknown = true or checked**, Unknown children are excluded from counts and percentages and from `WORST_OF` comparisons. However, if all children are unknown, the parent result is also Unknown.

- **If Ignore Unknown = false or unchecked**, Unknown children are included in counts and percentages in Minimum healthy and Maximum not healthy aggregations. In `Worst of` aggregation, Unknown is not treated as worse than Healthy, Degraded, or Unhealthy. It is the lowest-severity state. Therefore, Unknown only determines the parent state in `Worst of` when all considered children are Unknown. If any child is Degraded or Unhealthy, that worse state takes precedence for the parent.

You can also determine how the health state of an entity propagates to its parent through Impact configuration. Options include Standard, Limited, and Suppressed. Standard is the default value where the health state propagates as it is. Limited doesn't propagate a degraded state and propagates an unhealthy state as degraded so the parent never receives an unhealthy state from this entity. Suppressed doesn't propagate this entity's health state; the parent's state is still determined by its own signals and any other contributing child entities.

For default aggregation logic for SAP, see the *Default health and signal definitions for SAP* section.

For other concepts that aren't covered, such as setting health objectives and alerts, see the [AHM documentation](/azure/azure-monitor/health-models/concepts#health-objective).

### Region mapping

The following mapping shows the region for the health model based on the region you choose to deploy your WVI in:

| **WVI Region**       | **Azure Monitor Health Model Location** |
|----------------------|-----------------------------------------|
| Central US           | Central US                              |
| Italy North          | Italy North                             |
| Korea Central        | Japan West                              |
| North Europe         | North Europe                            |
| West Europe          | West Europe                             |
| Germany West Central | Germany West Central                    |
| East US              | Central US                              |
| East US 2            | Central US                              |
| South Central US     | Central US                              |
| Japan East           | Japan West                              |
| Australia East       | Australia East                          |

### Pricing

Azure Monitor health models is a paid service. However, during limited preview, you don't pay for health models that Azure Monitor creates when you onboard your workload as a WVI.

## Next steps

- [View workload health](view-workload-virtual-instance-health.md).
- [Manage and customize health](manage-customize-health.md).
