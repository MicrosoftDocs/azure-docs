---
title: Health models in Azure Monitor (preview)
description: Overview of health models in Azure Monitor that allow you to track the health of your Azure resources and workloads.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2023
---

# Health models in Azure Monitor (preview)

Azure Monitor health models enables you to track the health of your Azure resources and workloads. Each health model defines a distinct workload, including the Azure resources it depends on and the relationship between those resources. You use a graphical tool to add resources to the model and to connect those resources that depend on each other. In addition to actual resources, you can add entities to represent business processes and custom groupings to aggregate the health of related entities.

:::image type="content" source="media/overview/sample-health-model.png" lightbox="media/overview/sample-health-model.png" alt-text="Screenshot of an example health model including several entities. ":::

## Health state
Health models calculate the health of included resources using data that's already collected by Azure Monitor. This includes platform metrics and resource logs for Azure resources in addition to any data being collected by features such as Prometheus metrics and VM insights. Any data stored in Log Analytics workspaces and Azure Monitor workspaces can be used in health calculations.

The health of each resource is determined by one or more signals unique to that particular resource type. A signal can be comparison of a metric value to a threshold or the results of a log query. The health of each resource rolls up to any resources that depend on it. For example, if an application depends on a storage account with a degraded health state, the application's health state is also degraded. The health of all the components of the health model roll up to a single root entity that provides a health state for the overall workflow.

:::image type="content" source="media/overview/sample-health-model.png" lightbox="media/overview/sample-health-model.png" alt-text="Screenshot of an example health model including several entities. ":::


## Alerts
Health models adds a new signal to Azure Monitor alerts based on health state. In addition to existing Azure Monitor alert rules that fire on metric thresholds and log queries, you can alert on the health state of any of the entities in a health model or on the health state of the root entity. This allows you to reduce the total number of alerts that you generate and to ensure that you're only firing alerts when the performance of the workload is actually degraded or unhealthy.

:::image type="content" source="media/overview/sample-alert-rule.png" lightbox="media/overview/sample-alert-rule.png" alt-text="Screenshot of an example alert rules on an Azure resource in a health model. ":::

## Service level
Set a service level for the health model to define your commitment to your customers. Azure Monitor will track the availability of the workflow based on the health state of the root entity. You can view the availability of the workflow over time and compare it to the service level you set.

:::image type="content" source="media/overview/sample-service-level.png" lightbox="media/overview/sample-service-level.png" alt-text="Screenshot of service level view for an example health model. ":::

## Next steps

- [Create a health model](./create-model.md).