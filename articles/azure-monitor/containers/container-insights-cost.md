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

### Filter tables

- DCR
  - Cost presets
  - Streams

### Filter by namespace

- DCR
- ConfigMap

### Annotation filtering

- ConfigMap

## Transformations
[Ingestion time transformations](../essentials/data-collection-transformations.md) allow you to apply a KQL query to filter and transform data in the [Azure Monitor pipeline](../essentials/pipeline-overview.md) before it's stored in the Log Analytics workspace. Add a transformation to the Container insights DCR to perform any additional filtering that you cannot perform with the standard options. This includes filtering data using more detailed logic, removing columns in the data that you don't require, or even sending data to multiple tables. 

For example, you may want to use a transformation to filter on the `LogLevel` column of the `ContainerLogV2` table to only include `ERROR` or `CRITICAL` log entries. These are the entries that you use for alerting and identifying issues in the cluster. Collecting and storing other levels such as `INFO` and `DEBUG` generate cost without significant value.

You can filter out these records using the following log query in the transformation. The table name `source` is used here since this represents the incoming stream in the DCR.

```kusto
source | where LogLevel in ('ERROR', 'CRITICAL')
```

:::image type="content" source="media/container-insights-cost/transformation-sample.png" lightbox="media/container-insights-cost/transformation-sample.png" alt-text="Diagram that shows filtering container logs using a transformation.":::

The following sample shows this transformation added to the Container insights DCR.

```kusto
{
    "properties": {
        "location": "eastus2",
        "kind": "Linux",
        "dataSources": {
            "syslog": [],
            "extensions": [
                {
                    "streams": [
                        "Microsoft-ContainerLogV2",
                        "Microsoft-KubeEvents",
                        "Microsoft-KubePodInventory"
                    ],
                    "extensionName": "ContainerInsights",
                    "extensionSettings": {
                        "dataCollectionSettings": {
                            "interval": "1m",
                            "namespaceFilteringMode": "Off",
                            "enableContainerLogV2": true
                        }
                    },
                    "name": "ContainerInsightsExtension"
                }
            ]
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace",
                    "workspaceId": "00000000-0000-0000-0000-000000000000",
                    "name": "ciworkspace"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Microsoft-KubeEvents",
                    "Microsoft-KubePodInventory"
                ],
                "destinations": [
                    "ciworkspace"
                ],
            },
            {
                "streams": [
                    "Microsoft-ContainerLogV2"
                ],
                "destinations": [
                    "ciworkspace"
                ],
                "transformKql": "source | where LogLevel in ('ERROR', 'CRITICAL')"
            }
        ],
    },
}
```



## Configure Log Analytics workspace tiers

[Basic Logs in Azure Monitor](../logs/basic-logs-configure.md) offer a significant cost discount for ingestion of data in your Log Analytics workspace for data that that you primarily use for debugging, troubleshooting, and auditing. Tables configured for basic logs offer a significant cost discount for data ingestion in exchange for a cost for log queries. You can reduce your monitoring cost for container logs by configuring [ContainerLogV2](container-insights-logs-schema.md) for basic logs if you query the data infrequently.

If you only use a subset of container logs regularly, you can use a transformation to send data to different tables. In the example above, only records with a `LogLevel` of `ERROR` or `CRITICAL` are collected. An alternate strategy instead of not collecting these records at all is to save them to an alternate table configured for basic logs. 

:::image type="content" source="media/container-insights-cost/transformation-sample-basic-logs.png" lightbox="media/container-insights-cost/transformation-sample-basic-logs.png" alt-text="Diagram that shows filtering container logs using a transformation that sends some data to analytics table and other data to basic logs.":::


## Next steps

To help you understand what the costs are likely to be based on recent usage patterns from data collected with Container insights, see [Analyze usage in a Log Analytics workspace](../logs/analyze-usage.md).
