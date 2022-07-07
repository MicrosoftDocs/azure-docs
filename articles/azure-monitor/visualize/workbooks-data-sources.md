---
title: Azure Workbooks data sources | Microsoft docs
description: Simplify complex reporting with prebuilt and custom parameterized Azure Workbooks built from multiple data sources.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 07/05/2022
ms.reviewer: gardnerjr
---

# Azure Workbooks data sources

Workbooks can extract data from these data sources:

 - [Logs](#logs)
 - [Metrics](#metrics)
 - [Azure Resource Graph](#azure-resource-graph)
 - [Azure Resource Manager](#azure-resource-manager)
 - [Azure Data Explorer](#azure-data-explorer)
 - [JSON](#json)
 - [Merge](#merge)
 - [Custom endpoint](#custom-endpoint)
 - [Workload health](#workload-health)
 - [Azure resource health](#azure-resource-health)
 - [Azure RBAC](#azure-rbac)
 - [Change Analysis (preview)](#change-analysis-preview)
## Logs

Workbooks allow querying logs from the following sources:

* Azure Monitor Logs (Application Insights Resources and Log Analytics Workspaces.)
* Resource-centric data (Activity logs)

Workbook authors can use KQL queries that transform the underlying resource data to select a result set that can visualized as text, charts, or grids.

![Screenshot of workbooks logs report interface.](./media/workbooks-data-sources/logs.png)

Workbook authors can easily query across multiple resources creating a truly unified rich reporting experience.

## Metrics

Azure resources emit [metrics](../essentials/data-platform-metrics.md) that can be accessed via workbooks. Metrics can be accessed in workbooks through a specialized control that allows you to specify the target resources, the desired metrics, and their aggregation. This data can then be plotted in charts or grids.

![Screenshot of workbook metrics charts of cpu utilization.](./media/workbooks-data-sources/metrics-graph.png)

![Screenshot of workbook metrics interface.](./media/workbooks-data-sources/metrics.png)

## Azure Resource Graph

Workbooks support querying for resources and their metadata using Azure Resource Graph (ARG). This functionality is primarily used to build custom query scopes for reports. The resource scope is expressed via a KQL-subset that ARG supports – which is often sufficient for common use cases.

To make a query control use this data source, use the Query type drop-down to choose Azure Resource Graph and select the subscriptions to target. Use the Query control to add the ARG KQL-subset that selects an interesting resource subset.

![Screenshot of Azure Resource Graph KQL query.](./media/workbooks-data-sources/azure-resource-graph.png)

## Azure Resource Manager

Workbook supports Azure Resource Manager REST operations. This allows the ability to query management.azure.com endpoint without the need to provide your own authorization header token.

To make a query control use this data source, use the Data source drop-down to choose Azure Resource Manager. Provide the appropriate parameters such as Http method, url path, headers, url parameters and/or body.

> [!NOTE]
> Only GET, POST, and HEAD operations are currently supported.

## Azure Data Explorer

Workbooks now have support for querying from [Azure Data Explorer](/azure/data-explorer/) clusters with the powerful [Kusto](/azure/kusto/query/index) query language.
For the **Cluster Name** field, you should add the region name following the cluster name. For example: *mycluster.westeurope*.

![Screenshot of Kusto query window.](./media/workbooks-data-sources/data-explorer.png)

## JSON

The JSON provider allows you to create a query result from static JSON content. It is most commonly used in Parameters to create dropdown parameters of static values. Simple JSON arrays or objects will automatically be converted into grid rows and columns.  For more specific behaviors, you can use the Results tab and JSONPath settings to configure columns.

> [!NOTE]
> Do not include any sensitive information in any fields (headers, parameters, body, url), since they will be visible to all of the Workbook users.

This provider supports [JSONPath](workbooks-jsonpath.md).

## Merge

Merging data from different sources can enhance the insights experience. An example is augmenting active alert information with related metric data. This allows users to see not just the effect (an active alert), but also potential causes (for example, high CPU usage). The monitoring domain has numerous such correlatable data sources that are often critical to the triage and diagnostic workflow.

Workbooks allow not just the querying of different data sources, but also provides simple controls that allow you to merge or join the data to provide rich insights. The **merge** control is the way to achieve it.

### Combining alerting data with Log Analytics VM performance data

The example below combines alerting data with Log Analytics VM performance data to get a rich insights grid.

![Screenshot of a workbook with a merge control that combines alert and log analytics data.](./media/workbooks-data-sources/merge-control.png)

### Using merge control to combine Azure Resource Graph and Log Analytics data

Here is a tutorial on using the merge control to combine Azure Resource Graph and Log Analytics data:

[![Combining data from different sources in workbooks](https://img.youtube.com/vi/7nWP_YRzxHg/0.jpg)](https://www.youtube.com/watch?v=7nWP_YRzxHg "Video showing how to combine data from different sources in workbooks.")

Workbooks support these merges:

* Inner unique join
* Full inner join
* Full outer join
* Left outer join
* Right outer join
* Left semi-join
* Right semi-join
* Left anti-join
* Right anti-join
* Union
* Duplicate table

## Custom endpoint

Workbooks support getting data from any external source. If your data lives outside Azure you can bring it to Workbooks by using this data source type.

To make a query control use this data source, use the **Data source** drop-down to choose **Custom Endpoint**. Provide the appropriate parameters such as **Http method**, **url**, **headers**, **url parameters**, and/or **body**. Make sure your data source supports [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) otherwise the request will fail.

To avoid automatically making calls to untrusted hosts when using templates, the user needs to mark the used hosts as trusted. This can be done by either selecting the **Add as trusted** button, or by adding it as a trusted host in Workbook settings. These settings will be saved in [browsers that support IndexDb with web workers](https://caniuse.com/#feat=indexeddb).

This provider supports [JSONPath](workbooks-jsonpath.md).
## Workload health

Azure Monitor has functionality that proactively monitors the availability and performance of Windows or Linux guest operating systems. Azure Monitor models key components and their relationships, criteria for how to measure the health of those components, and which components alert you when an unhealthy condition is detected. Workbooks allow users to use this information to create rich interactive reports.

To make a query control use this data source, use the **Query type** drop-down to choose Workload Health and select subscription, resource group or VM resources to target. Use the health filter drop downs to select an interesting subset of health incidents for your analytic needs.

![Screenshot of alerts query.](./media/workbooks-data-sources/workload-health.png)

## Azure resource health

Workbooks support getting Azure resource health and combining it with other data sources to create rich, interactive health reports

To make a query control use this data source, use the **Query type** drop-down to choose Azure health and select the resources to target. Use the health filter drop downs to select an interesting subset of resource issues for your analytic needs.

![Screenshot of alerts query that shows the health filter lists.](./media/workbooks-data-sources/resource-health.png)

## Azure RBAC
The Azure RBAC provider allows you to check permissions on resources. It is most commonly used in parameter to check if the correct RBAC are set up. A use case would be to create a parameter to check deployment permission and then notify the user if they don't have deployment permission. Simple JSON arrays or objects will automatically be converted into grid rows and columns or text with a 'hasPermission' column with either true or false. The permission is checked on each resource and then either 'or' or 'and' to get the result. The [operations or actions](../../role-based-access-control/resource-provider-operations.md) can be a string or an array.

  **String:**
   ```
   "Microsoft.Resources/deployments/validate/action"
   ```

   **Array:**
   ```
   ["Microsoft.Resources/deployments/read","Microsoft.Resources/deployments/write","Microsoft.Resources/deployments/validate/action","Microsoft.Resources/operations/read"]
   ```

## Change Analysis (preview)

To make a query control using [Application Change Analysis](../app/change-analysis.md) as the data source, use the **Data source** drop-down and choose *Change Analysis (preview)* and select a single resource. Changes for up to the last 14 days can be shown. The *Level* drop-down can be used to filter between "Important", "Normal", and "Noisy" changes, and this drop down supports workbook parameters of type [drop down](workbooks-dropdowns.md).

> [!div class="mx-imgBorder"]
> ![A screenshot of a workbook with Change Analysis.](./media/workbooks-data-sources/change-analysis-data-source.png)

## Next steps

 - [Getting started with Azure Workbooks](workbooks-getting-started.md)
 - [Create an Azure Workbook](workbooks-create-workbook.md).
