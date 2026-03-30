---
title: Analyze changes to your Azure resources with Change Analysis
description: Learn to use the Azure Resource Graph Change Analysis tool to explore and analyze changes in your resources.
author: iancarter-msft
ms.author: daphnema
ms.date: 10/23/2025
ms.topic: concept-article

---

# Analyze changes to your Azure resources

Resources change through the course of daily use, reconfiguration, and even redeployment. While most change is by design, sometimes it can break your application. With the power of Azure Resource Graph, you can find when a resource changed due to a [control plane operation](../../../azure-resource-manager/management/control-plane-and-data-plane.md) sent to the Azure Resource Manager URL.

Change Analysis goes beyond standard monitoring solutions, alerting you to live site issues, outages, or component failures and explaining the causes behind them.

## How it works 

Change Analysis ingests data into Resource Graph for queries and to power the portal experience. Change Analysis data can be accessed using:

- The `POST Microsoft.ResourceGraph/resources` API _(preferred)_ for querying across tenants and subscriptions.
- The following APIs _(under a specific scope, such as `LIST` changes and snapshots for a specific virtual machine):_
   - `GET/LIST Microsoft.Resources/Changes`
   - `GET/LIST Microsoft.Resources/Snapshots`

When a resource is created, updated, or deleted via the Azure Resource Manager control plane, Resource Graph uses its [Change Actor functionality](./get-resource-changes.md) to identify the changes.

> [!NOTE]
> Currently, Azure Resource Graph doesn't:
>
> - Observe changes made to a resource's data plane API, such as writing data to a table in a storage account.
> - Support file and configuration changes over App Service.

## Change Analysis in the portal 

Change Analysis experiences across the Azure portal are powered using the Azure Resource Graph [`Microsoft.ResourceGraph/resources` API](/rest/api/azureresourcegraph/resourcegraph/resources/resources). You can query this API for changes made to many of the Azure resources you interact with, including App Services (`Microsoft.Web/sites`) or Virtual Machines (`Microsoft.Compute/virtualMachines`).

The Azure Resource Graph Change Analysis portal experience provides:

- An onboarding-free experience, giving all subscriptions and resources access to change history.
- Tenant-wide querying, rather than select subscriptions.
- Change history summaries aggregated into cards at the top of the new Resource Graph Change Analysis.
- More extensive filtering capabilities.
- Improved accuracy and relevance of _changed by_ information, using _Change Actor_ functionality.

[Learn how to view the new Change Analysis experience in the portal.](./view-resource-changes.md)

## Supported resource types

Change Analysis supports changes to resource types from the following Resource Graph tables:
- [`resources`](../reference/supported-tables-resources.md#resources)
- [`resourcecontainers`](../reference/supported-tables-resources.md#resourcecontainers)
- [`healthresources`](../reference/supported-tables-resources.md#healthresources)

You can compose and join tables to project change data any way you want.

## Data retention

Changes are queryable for 14 days. For longer retention, you can [integrate your Resource Graph query with Azure Logic Apps](../tutorials/logic-app-calling-arg.md) and manually export query results to any of the Azure data stores like [Log Analytics](/azure/azure-monitor/logs/log-analytics-overview) for your desired retention.

## Cost

You can use Azure Resource Graph Change Analysis at no extra cost.

## Send feedback for more data

Submit feedback via [the Change Analysis experience](./view-resource-changes.md) in the Azure portal.

## Next steps

> [!div class="nextstepaction"]
> [Get resource changes](../how-to/get-resource-changes.md)
