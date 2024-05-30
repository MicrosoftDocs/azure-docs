---
title: Monitoring cost for Container insights
description: This article describes the monitoring cost for metrics and inventory data collected by Container insights to help customers manage their usage and associated costs. 
ms.topic: conceptual
ms.date: 03/02/2023
ms.reviewer: viviandiec
---

# Optimize monitoring costs for Container insights

This article provides guidance on how to reduce your costs for Azure Monitor Container insights. Kubernetes clusters generate a large amount of log data. You can collect all of this data in Container insights, but since you're charged for the ingestion and retention of this data, that may result in charges for data that you don't use. You can significantly reduce your monitoring costs by filtering out data that you don't need and also by optimizing the configuration of the Log Analytics workspace where you're storing your data.



### Analyzing your data ingestion

To identify your best opportunities for cost savings, analyze the amount of data being collected in different tables. This information will help you identify which tables are consuming the most data and help you make informed decisions about how to reduce costs.

You can visualize how much data is ingested in each workspace by using the **Data Usage** runbook, which is available from the **Reports** tab of Container insights. The report will let you view the data usage by different categories such as table, namespace, and log source.

:::image type="content" source="media/container-insights-cost/workbooks-dropdown.png" lightbox="media/container-insights-cost/workbooks-dropdown.png" alt-text="Screenshot that shows the View Workbooks dropdown list.":::



Select the option to open the query in Log Analytics where you can perform more detailed analysis including viewing the individual records being collected. See [Query logs from Container insights
](./container-insights-log-query.md) for additional queries you can use to analyze your collected data.



## Filtering options
Once you've analyzed your collected data and determined if there's any data that you're collecting that you don't require, use the guidance in [Configure and filter log collection in Container insights](./container-insights-data-collection-configure.md) to filter any data that you don't want to collect. This includes selecting from a set of predefined cost configurations and filtering out specific namespaces that you don't require.

## Transformations
[Ingestion time transformations](../essentials/data-collection-transformations.md) allow you to apply a KQL query to filter and transform data in the [Azure Monitor pipeline](../essentials/pipeline-overview.md) before it's stored in the Log Analytics workspace. Add a transformation to the DCR created by Container insights to perform any additional filtering that you cannot perform with the standard options. This includes filtering data using more detailed logic, removing columns in the data that you don't require, or even sending data to multiple tables. 


See [Data transformations in Container insights](./container-insights-transformations.md)

## Configure Basic Logs
[Basic Logs in Azure Monitor](../logs/basic-logs-configure.md) offer a significant cost discount for ingestion of data in your Log Analytics workspace for data that that you primarily use for debugging, troubleshooting, and auditing. [ContainerLogV2 ](container-insights-logs-schema.md) can be configured for basic logs.




## Next steps

To help you understand what the costs are likely to be based on recent usage patterns from data collected with Container insights, see [Analyze usage in a Log Analytics workspace](../logs/analyze-usage.md).
