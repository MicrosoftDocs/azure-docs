---
title: Azure Monitor workbooks data sources | Microsoft docs
description: Simplify complex reporting with prebuilt and custom parameterized Azure Monitor Workbooks built from multiple data sources 
services: azure-monitor
documentationcenter: ''
manager: carmonm

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/29/2020
---

# Azure Monitor workbooks data sources

Workbooks are compatible with a large number of data sources. This article will walk you through data sources which are currently available for Azure Monitor workbooks.

## Logs

Workbooks allow querying logs from the following sources:

* Azure Monitor Logs (Application Insights Resources and Log Analytics Workspaces.)
* Resource-centric data (Activity logs)

Workbook authors can use KQL queries that transform the underlying resource data to select a result set that can visualized as text, charts, or grids.

![Screenshot of workbooks logs report interface](./media/workbooks-data-sources/logs.png)

Workbook authors can easily query across multiple resources creating a truly unified rich reporting experience.

## Metrics

Azure resources emit [metrics](../essentials/data-platform-metrics.md) that can be accessed via workbooks. Metrics can be accessed in workbooks through a specialized control that allows you to specify the target resources, the desired metrics, and their aggregation. This data can then be plotted in charts or grids.

![Screenshot of workbook metrics charts of cpu utilization](./media/workbooks-data-sources/metrics-graph.png)

![Screenshot of workbook metrics interface](./media/workbooks-data-sources/metrics.png)

## Azure Resource Graph

Workbooks support querying for resources and their metadata using Azure Resource Graph (ARG). This functionality is primarily used to build custom query scopes for reports. The resource scope is expressed via a KQL-subset that ARG supports – which is often sufficient for common use cases.

To make a query control use this data source, use the Query type drop-down to choose Azure Resource Graph and select the subscriptions to target. Use the Query control to add the ARG KQL-subset that selects an interesting resource subset.

![Screenshot of Azure Resource Graph KQL query](./media/workbooks-data-sources/azure-resource-graph.png)

## Azure Resource Manager

Workbook supports Azure Resource Manager REST operations. This allows the ability to query management.azure.com endpoint without the need to provide your own authorization header token.

To make a query control use this data source, use the Data source drop-down to choose Azure Resource Manager. Provide the appropriate parameters such as Http method, url path, headers, url parameters and/or body.

> [!NOTE]
> Only `GET`, `POST`, and `HEAD` operations are currently supported.

## Azure Data Explorer

Workbooks now have support for querying from [Azure Data Explorer](/azure/data-explorer/) clusters with the powerful [Kusto](/azure/kusto/query/index) query language.

![Screenshot of Kusto query window](./media/workbooks-data-sources/data-explorer.png)

## Workload health

Azure Monitor has functionality that proactively monitors the availability and performance of Windows or Linux guest operating systems. Azure Monitor models key components and their relationships, criteria for how to measure the health of those components, and which components alert you when an unhealthy condition is detected. Workbooks allow users to use this information to create rich interactive reports.

To make a query control use this data source, use the **Query type** drop-down to choose Workload Health and select subscription, resource group or VM resources to target. Use the health filter drop downs to select an interesting subset of health incidents for your analytic needs.

![Screenshot of alerts query](./media/workbooks-data-sources/workload-health.png)

## Azure resource health

Workbooks support getting Azure resource health and combining it with other data sources to create rich, interactive health reports

To make a query control use this data source, use the **Query type** drop-down to choose Azure health and select the resources to target. Use the health filter drop downs to select an interesting subset of resource issues for your analytic needs.

![Screenshot of alerts query that shows the health filter lists.](./media/workbooks-data-sources/resource-health.png)

## Change Analysis (preview)

To make a query control using [Application Change Analysis](../app/change-analysis.md) as the data source, use the *Data source* drop down and choose *Change Analysis (preview)* and select a single resource. Changes for up to the last 14 days can be shown. The *Level* drop down can be used to filter between "Important", "Normal", and "Noisy" changes, and this drop down supports workbook parameters of type [drop down](workbooks-dropdowns.md).

> [!div class="mx-imgBorder"]
> ![A screenshot of a workbook with Change Analysis](./media/workbooks-data-sources/change-analysis-data-source.png)

## Merge data from different sources

It is often necessary to bring together data from different sources that enhance the insights experience. An example is augmenting active alert information with related metric data. This allows users to see not just the effect (an active alert), but also potential causes (for example, high CPU usage). The monitoring domain has numerous such correlatable data sources that are often critical to the triage and diagnostic workflow.

Workbooks allows not just the querying of different data sources, but also provides simple controls that allow you to merge or join the data to provide rich insights. The `merge` control is the way to achieve it.

The example below combines alerting data with log analytics VM performance data to get a rich insights grid.

> [!div class="mx-imgBorder"]
> ![A screenshot of a workbook with a merge control that combines alert and log analytics data](./media/workbooks-data-sources/merge-control.png)

Workbooks support a variety of merges:

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

## JSON

The JSON provider allows you to create a query result from static JSON content. It is most commonly used in Parameters to create dropdown parameters of static values. Simple JSON arrays or objects will automatically be converted into grid rows and columns.  For more specific behaviors, you can use the Results tab and JSONPath settings to configure columns.

This provider supports [JSONPath](workbooks-jsonpath.md).

## Alerts (preview)

> [!NOTE]
> The suggested way to query for Azure Alert information is by using the [Azure Resource Graph](#azure-resource-graph) data source, by querying the `AlertsManagementResources` table.
>
> See the [Azure Resource Graph table reference](../../governance/resource-graph/reference/supported-tables-resources.md), or the [Alerts template](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Azure%20Resources/Alerts/Alerts.workbook) for examples.
>
> The Alerts data source will remain available for a period of time while authors transition to using ARG. Use of this data source in templates is discouraged. 

Workbooks allow users to visualize the active alerts related to their resources. 
Limitations: the alerts data source requires read access to the Subscription in order to query resources, and may not show newer kinds of alerts. 

To make a query control use this data source, use the _Data source_ drop-down to choose _Alerts (preview)_ and select the subscriptions, resource groups, or resources to target. Use the alert filter drop downs to select an interesting subset of alerts for your analytic needs.

## Custom endpoint

Workbooks support getting data from any external source. If your data lives outside Azure you can bring it to Workbooks by using this data source type.

To make a query control use this data source, use the _Data source_ drop-down to choose _Custom Endpoint_. Provide the appropriate parameters such as `Http method`, `url`, `headers`, `url parameters` and/or `body`. Make sure your data source supports [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) otherwise the request will fail.

To avoid automatically making calls to untrusted hosts when using templates, the user needs to mark the used hosts as trusted. This can be done by either clicking on the _Add as trusted_ button, or by adding it as a trusted host in Workbook settings. These settings will be saved in [browsers that support IndexDb with web workers](https://caniuse.com/#feat=indexeddb).

> [!NOTE]
> Do not write any secrets in any of the fields (`headers`, `parameters`, `body`, `url`), since they will be visible to all of the Workbook users.

This provider supports [JSONPath](workbooks-jsonpath.md).

## Next steps

* [Get started](./workbooks-overview.md#visualizations) learning more about workbooks many rich visualizations options.
* [Control](./workbooks-access-control.md) and share access to your workbook resources.
* [Log Analytics query optimization tips](../logs/query-optimization.md)