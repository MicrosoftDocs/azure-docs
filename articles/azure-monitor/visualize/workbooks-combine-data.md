---
title: Combine data from different sources in your Azure Workbook
description: Learn how to combine data from different sources in your Azure Workbook.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/30/2022
ms.reviewer: gardnerjr 
---

# Combine data from different sources

It is often necessary to bring together data from different sources that enhance the insights experience. An example is augmenting active alert information with related metric data. This allows users to see not just the effect (an active alert), but also potential causes (for example, high CPU usage). The monitoring domain has numerous such correlatable data sources that are often critical to the triage and diagnostic workflow.

Workbooks allow not just the querying of different data sources, but also provides simple controls that allow you to merge or join the data to provide rich insights. The `merge` control is the way to achieve it.

The example below combines alerting data with log analytics VM performance data to get a rich insights grid.

> ![A screenshot of a workbook with a merge control that combines alert and log analytics data.](./media/workbooks-data-sources/merge-control.png)

Workbooks support various merges:

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
> The suggested way to query for Azure Alert information is by using the Azure Resource Graph data source, by querying the `AlertsManagementResources` table.
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

## Next Steps
 - [Getting started with Azure Workbooks](workbooks-getting-started.md) learning more about workbooks many rich visualizations options.
 - [Azure workbooks data sources](workbooks-data-sources.md).