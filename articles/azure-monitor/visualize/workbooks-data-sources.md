---
title: Azure Workbooks data sources | Microsoft docs
description: Simplify complex reporting with prebuilt and custom parameterized workbooks built from multiple data sources.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 08/14/2024
ms.reviewer: gardnerjr
---

# Azure Workbooks data sources

Workbooks can extract data from these data sources:

 - [Logs (Analytics Tables), Application Insights](#logs-analytics-tables-application-insights)
 - [Logs (Basic, Auxiliary)](#logs-basic-and-auxiliary-tables)
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
 - [Change Analysis](#change-analysis)
 - [Prometheus](#prometheus)

## Logs (Analytics Tables), Application Insights

With workbooks, you can query logs from the following sources:

* Azure Monitor Logs (Application Insights resources and Log Analytics workspaces analytics tables)
* Resource-centric data (activity logs)

You can use Kusto query language (KQL) queries that transform the underlying resource data to select a result set that can be visualized as text, charts, or grids.
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-data-sources/logs.png" lightbox="./media/workbooks-data-sources/logs.png" alt-text="Screenshot that shows a workbook logs report interface." border="false":::

You can easily query across multiple resources to create a unified rich reporting experience.

See also: [Log Analytics query optimization tips](../logs/query-optimization.md)

See also: [Workbooks best practices and hints for logs queries](workbooks-create-workbook.md#best-practices-for-querying-logs)

Tutorial: [Making resource centric log queries in workbooks](workbooks-create-workbook.md#tutorial---resource-centric-logs-queries-in-workbooks)

## Logs (Basic and Auxiliary Tables)

Workbooks also supports querying Log Analytics Basic and Auxiliary tables through a separate "Logs (basic)" data source. Basic and Auxiliary logs tables reduce the cost of ingesting high-volume verbose logs and let you query the data they store with some limitations. 


> [!NOTE]
> Basic and Auxiliary logs and the workbook data source has limitations compared to the Log (Analytics) data source, most notably
>  * *Extra cost*, including per-query costs. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for details.
> * Basic logs does not support the full KQL language
> * Basic logs only operates on single Log Analyics Workspace, it does not have cross-resource or resource centric query support.
> * Basic logs does not support "set in query" style time ranges, an explicit time range (or parameter) must be specified.

For a full list of details and limitations, see [Query data in a Basic and Auxiliary table in Azure Monitor Logs](../logs/basic-logs-query.md)

See also: [Log Analytics query optimization tips](../logs/query-optimization.md)

## Metrics

Azure resources emit [metrics](../essentials/data-platform-metrics.md) that can be accessed via workbooks. Metrics can be accessed in workbooks through a specialized control that allows you to specify the target resources, the desired metrics, and their aggregation. You can then plot this data in charts or grids.
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-data-sources/metrics-graph.png" lightbox="./media/workbooks-data-sources/metrics-graph.png" alt-text="Screenshot that shows workbook metrics charts of CPU utilization." border="false":::
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-data-sources/metrics.png" lightbox="./media/workbooks-data-sources/metrics.png" alt-text="Screenshot that shows a workbook metrics interface." border="false":::

## Azure Resource Graph

Workbooks support querying for resources and their metadata by using Azure Resource Graph. This functionality is primarily used to build custom query scopes for reports. The resource scope is expressed via a KQL subset that Resource Graph supports, which is often sufficient for common use cases.

To make a query control that uses this data source, use the **Query type** dropdown and select **Azure Resource Graph**. Then select the subscriptions to target. Use **Query control** to add the Resource Graph KQL subset that selects an interesting resource subset.
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-data-sources/azure-resource-graph.png" lightbox="./media/workbooks-data-sources/azure-resource-graph.png" alt-text="Screenshot that shows an Azure Resource Graph KQL query." border="false":::

## Azure Resource Manager

Azure Workbooks supports Azure Resource Manager REST operations so that you can query the management.azure.com endpoint without providing your own authorization header token.

To make a query control that uses this data source, use the **Data source** dropdown and select **Azure Resource Manager**. Provide the appropriate parameters, such as **Http method**, **url path**, **headers**, **url parameters**, and **body**. Azure Resource Manager data source is intended to be used as a data source to power data *visualizations*; as such, it does not support `PUT` or `PATCH` operations. The data source supports the following HTTP methods, with these expecations and limitations:

* `GET` - the most common operation for visualization, execute a query and parse the `JSON` result using settings in the "Result Settings" tab. 
* `GETARRAY` - for ARM APIs that may return multiple "pages" of results using the ARM standard `nextLink` or `@odata.nextLink` style response (See [Async operations, throttling, and paging](/rest/api/azure/#async-operations-throttling-and-paging), this method makes followup calls to the API for each `nextLink` result, and merge those results into an array of results.
* `POST` - This method is used for APIs that pass information in a POST body.
  
> [!NOTE]
> The Azure Resource Manager data source only supports results that return a 200 `OK` response, indicating the result is synchronous. APIs returning asynchronous results with 202 `ACCEPTED` asynchronous result and a header with a result URL are not supported.

## Azure Data Explorer

Workbooks now have support for querying from [Azure Data Explorer](/azure/data-explorer/) clusters with the powerful [Kusto](/azure/kusto/query/index) query language.
For the **Cluster Name** field, add the region name following the cluster name. An example is *mycluster.westeurope*.
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-data-sources/data-explorer.png" lightbox="./media/workbooks-data-sources/data-explorer.png" alt-text="Screenshot that shows Kusto query window." border="false":::

See also: [Azure Data Explorer query best practices](/azure/data-explorer/kusto/query/best-practices)

## JSON

The JSON provider allows you to create a query result from static JSON content. It's most commonly used in parameters to create dropdown parameters of static values. Simple JSON arrays or objects are converted into grid rows and columns. For more specific behaviors, you can use the **Results** tab and JSONPath settings to configure columns.

> [!NOTE]
> Do *not* include sensitive information in fields like headers, parameters, body, and URL, because they'll be visible to all the workbook users.

This provider supports [JSONPath](workbooks-jsonpath.md).

## Merge

Merging data from different sources can enhance the insights experience. An example is augmenting active alert information with related metric data. Merging data allows users to see not just the effect (an active alert) but also potential causes, for example, high CPU usage. The monitoring domain has numerous such correlatable data sources that are often critical to the triage and diagnostic workflow.

With workbooks, you can query different data sources. Workbooks also provide simple controls that you can use to merge or join data to provide rich insights. The *merge* control is the way to achieve it. A single merge data source can do many merges in one step. For example, a *single* merge data source can merge results from a step using Azure Resource Graph with Azure Metrics, and then merge that result with another step using the Azure Resource Manager data source in one query item.

> [!NOTE]
> Although hidden query and metrics steps run if they're referenced by a merge step, hidden query items that use the merge data source don't run while hidden.
> A step that uses merge and attempts to reference a hidden step by using merge data source won't run until that hidden step becomes visible.
> A single merge step can merge many data sources at once. There's rarely a case where a merge data source will reference another merge data source.


### Combine alerting data with Log Analytics Virtual Machine (VM) performance data

The following example combines alerting data with Log Analytics VM performance data to get a rich insights grid.
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-data-sources/merge-control.png" lightbox="./media/workbooks-data-sources/merge-control.png" alt-text="Screenshot that shows a workbook with a merge control that combines alert and Log Analytics data." border="false":::

### Use merge control to combine Resource Graph and Log Analytics data

Watch this tutorial on using the merge control to combine Resource Graph and Log Analytics data:

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

### Merge examples

[Using the Duplicate Table option to reuse queried data](workbooks-commonly-used-components.md#reuse-query-data-in-different-visualizations)

## Custom endpoint

Workbooks support getting data from any external source. If your data lives outside Azure, you can bring it to workbooks by using this data source type.

To make a query control that uses this data source, use the **Data source** dropdown and select **Custom Endpoint**. Provide the appropriate parameters, such as **Http method**, **url**, **headers**, **url parameters**, and **body**. Make sure your data source supports [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). Otherwise, the request will fail.

To avoid automatically making calls to untrusted hosts when you use templates, you need to mark the used hosts as trusted. You can either select **Add as trusted** or add it as a trusted host in workbook settings. These settings are saved locally in [browsers that support IndexDb with web workers](https://caniuse.com/#feat=indexeddb).

This provider supports [JSONPath](workbooks-jsonpath.md).

## Workload health

Azure Monitor has functionality that proactively monitors the availability and performance of Windows or Linux guest operating systems. Azure Monitor models key components and their relationships, criteria for how to measure the health of those components, and can alert you when an unhealthy condition is detected. With workbooks, you can use this information to create rich interactive reports.

To make a query control that uses this data source, use the **Query type** dropdown to select **Workload Health**. Then select subscription, resource group, or VM resources to target. Use the health filter dropdowns to select an interesting subset of health incidents for your analytic needs.
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-data-sources/workload-health.png" lightbox="./media/workbooks-data-sources/workload-health.png" alt-text="Screenshot that shows an alerts query." border="false":::

## Azure resource health

Workbooks support getting Azure resource health and combining it with other data sources to create rich, interactive health reports.

To make a query control that uses this data source, use the **Query type** dropdown and select **Azure health**. Then select the resources to target. Use the health filter dropdowns to select an interesting subset of resource issues for your analytic needs.
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-data-sources/resource-health.png" lightbox="./media/workbooks-data-sources/resource-health.png" alt-text="Screenshot that shows an alerts query that shows the health filter lists." border="false":::

## Azure RBAC

The Azure role-based access control (RBAC) provider allows you to check permissions on resources. It's can be used in parameters to check if the correct RBACs are set up. A use case would be to create a parameter to check deployment permission and then notify the user if they don't have deployment permission.

Simple JSON arrays or objects are converted into grid rows and columns or text with a `hasPermission` column with either true or false. The permission is checked on each resource and then either `or` or `and` to get the result. The [operations or actions](../../role-based-access-control/resource-provider-operations.md) can be a string or an array.

  **String:**
   ```
   "Microsoft.Resources/deployments/validate/action"
   ```

   **Array:**
   ```
   ["Microsoft.Resources/deployments/read","Microsoft.Resources/deployments/write","Microsoft.Resources/deployments/validate/action","Microsoft.Resources/operations/read"]
   ```

## Change Analysis

To make a query control that uses [Application Change Analysis](../app/change-analysis.md) as the data source, use the **Data source** dropdown and select **Change Analysis**. Then select a single resource. Changes for up to the last 14 days can be shown. Use the **Level** dropdown to filter between **Important**, **Normal**, and **Noisy** changes. This dropdown supports workbook parameters of the type [drop down](workbooks-dropdowns.md).
<!-- convertborder later -->
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/workbooks-data-sources/change-analysis-data-source.png" lightbox="./media/workbooks-data-sources/change-analysis-data-source.png" alt-text="A screenshot that shows a workbook with Change Analysis." border="false":::


## Prometheus

With [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md), you can collect Prometheus metrics for your Kubernetes clusters. To query Prometheus metrics, select **Prometheus** from the data source dropdown, followed by where the metrics are stored in [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md) and the [Prometheus query type](https://prometheus.io/docs/prometheus/latest/querying/api/) for the PromQL query.

<!-- convertborder later; border-bottom is missing, so applying the Learn formatting border -->
:::image type="content" source="./media/workbooks-data-sources/prometheus-query.png" lightbox="./media/workbooks-data-sources/prometheus-query.png" alt-text="Screenshot that shows sample PromQL query.":::

> [!NOTE]
> Querying from an Azure Monitor workspace is a data plane action and requires an explicit role assignment of Monitoring Data Reader, which is not assigned by default
> Learn more about [Azure control and data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md) 

## Next steps

 - [Get started with Azure Workbooks](workbooks-overview.md)
 - [Create an Azure workbook](workbooks-create-workbook.md)
