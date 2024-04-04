---
title: Analyze changes to your Azure resources
description: Learn to use the Resource Graph Change Analysis tool to explore and analyze changes in your resources.
author: iancarter-msft
ms.author: iancarter
ms.date: 03/19/2024
ms.topic: conceptual
---

# Analyze changes to your Azure resources

Resources change through the course of daily use, reconfiguration, and even redeployment. While most change is by design, sometimes it can break your application. With the power of Azure Resource Graph, Change Analysis goes beyond standard monitoring solutions, alerting you to live site issues, outages, or component failures and explaining the causes behind them. 

Change Analysis helps you:

- Find when a resource changed due to a [control plane operation](../../../azure-resource-manager/management/control-plane-and-data-plane.md) sent to the Azure Resource Manager URL.
- View property change details.
- Query changes at scale across your subscriptions, management group, or tenant.

## Change Analysis data sources

Change Analysis experiences across the Azure portal are powered using the Azure Resource Graph [`Microsoft.ResourceGraph/resources` API](/rest/api/azureresourcegraph/resourcegraph/resources/resources). You can query this API for changes made to many of the Azure resources you interact with, including App Services (`Microsoft.Web/sites`) or Virtual Machines (`Microsoft.Compute/virtualMachines`). 

Change Analysis also provides some data using the following APIs:
- `GET/LIST Microsoft.Resources/Changes`
- `GET/LIST Microsoft.Resources/Snapshots`

## Supported resource types

Change Analysis supports changes to resource types from the following Resource Graph tables:
- [`resources`](../reference/supported-tables-resources.md#resources) 
- [`resourcecontainers`](../reference/supported-tables-resources.md#resourcecontainers) 
- [`healthresources`](../reference/supported-tables-resources.md#healthresources). 

Azure Resource Graph Change Analysis supports both the _push_ and _pull_ models. When a resource is created, updated, or deleted via the Azure Resource Manager control plane, resource providers:
- Configure the resource types from which Azure Resource Graph pulls data, if the resource provider supports `LIST` APIs for a given type (pull)
- Updates their resources to push data to Azure Resource Graph, which shows changes in real-time (push)

You can compose and join tables to project change data any way you want.

## Data retention

Changes are queryable for 14 days. For longer retention, you can [integrate your Resource Graph query with Azure Logic Apps](../tutorials/logic-app-calling-arg.md) and manually export query results to any of the Azure data stores like [Log Analytics](../../../azure-monitor/logs/log-analytics-overview.md) for your desired retention.

> [!NOTE]
> **Send feedback for more data**  
>  
> Visit [the Change Analysis (Preview) experience](./view-resource-changes.md) on the Azure portal and submit feedback for data you'd like to see in Change Analysis and the `Microsoft.ResourceGraph/resources` API.

## Cost

You can use Azure Resource Graph Change Analysis at no extra cost. 

## Next steps

> [!div class="nextstepaction"]
> [Get resource changes](../how-to/get-resource-changes.md)