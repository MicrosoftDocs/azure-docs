---
title: Integrate Azure Data Explorer for long-term log retention | Microsoft Docs
description:  Send Azure Sentinel logs to Azure Data Explorer for long-term retention to reduce data storage costs.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/21/2021
ms.author: bagol

---
# Integrate Azure Data Explorer for long-term log retention

<!--Info not included:>

Script - can't xref out to a private github repo from docs
-->

By default, logs ingested into Azure Sentinel are stored in Azure Monitor Log Analytics. This article explains how to reduce retention costs in Azure Sentinel by sending them to Azure Data Explorer (ADX) for long-term retention.

Storing logs in ADX reduces costs while retains your ability to query your data, and is especially useful as your data grows. For example, while security data may lose value over time, you may be required to retain logs for regulatory requirements or to run periodic investigations on older data.

## About Azure Data Explorer

ADX is a big data analytics platform that is highly optimized for log and data analytics. Since ADX uses Kusto Query Language (KQL) as its query language, it's a good alternative for Azure Sentinel data storage. Using ADX for your data storage enables  you to run cross-platform queries and visualize data across both ADX and Azure Sentinel.

For more information, see the ADX [documentation](/azure/data-explorer/) and [blog](https://azure.microsoft.com/en-us/blog/tag/azure-data-explorer/).

### When to integrate with ADX

Azure Sentinel provides full SIEM and SOAR capabilities, quick deployment and configuration, as well as advanced, built-in security features for SOC teams. However, the value of storing security data in Azure Sentinel may drop after a few months, once SOC users don't need to access it as often as they access newer data.

If you only need to access specific tables occasionally, such as for periodic investigations or audits, you may consider that retaining your data in Azure Sentinel is no longer cost-effective. At this point, we recommend storing data in ADX, which costs less, but still enables you to explore using the same KQL queries that you run in Azure Sentinel.

You can access the data in ADX directly from Azure Sentinel using the [Log Analytics ADX proxy feature](//azure/azure-monitor/logs/azure-monitor-data-explorer-proxy). To do so, use cross cluster queries in your log search or workbooks. 

> [!IMPORTANT]
> Core SIEM capabilities, including Analytic rules, UEBA, and the investigation graph, do not support data stored in ADX.
>

> [!NOTE]
> Integrating with ADX can also enable you to have control and granularity in your data. For more information, see [Design considerations](#design-considerations).
> 
## Send data directly to Azure Sentinel and ADX in parallel

You may want to retain any data *with security value* in Azure Sentinel to use in detections, incident investigations, threat hunting, UEBA, and so on. Keeping this data in Azure Sentinel mainly benefits Security Operations Center (SOC) users, where typically, 3-12 months of storage are enough.

You can also configure all of your data, *regardless of its security value,* to be sent to ADX at the same time, where you can store it for longer. While sending data to both Azure Sentinel and ADX at the same time results in some duplication, the cost savings can be significant as you reduce the retention costs in Azure Sentinel.

> [!TIP]
> This option also enables you to correlate data spread across data stores, such as to enrich the security data stored in Azure Sentinel with operational or long-term data stored in ADX. For more information, see [Cross-resource query Azure Data Explorer by using Azure Monitor](/azure/azure-monitor/logs/azure-monitor-data-explorer-proxy).
>

The following image shows how you can retain all of your data in ADX, while sending only your security data to Azure Sentinel for daily use.

:::image type="content" source="media/store-logs-in-adx/store-data-in-sentinel-and-adx-in-parallel.png" alt-text="Store data in ADX and Azure Sentinel in parallel.":::

For more information about implementing this architecture option, see [Azure Data Explorer monitoring](/azure/architecture/solution-ideas/articles/monitor-azure-data-explorer).

## Export data from Log Analytics into ADX

Instead of sending your data directly to ADX, you can choose to export your data from Log Analytics into ADX via an ADX event hub or Azure Data Factory.

### Data export architecture

The following image shows a sample flow of exported data through the Azure Monitor ingestion pipeline. Your data is directed to Log Analytics by default, but you can also configure it to export to an Azure Storage Account or event hub.

:::image type="content" source="media/store-logs-in-adx/export-data-from-azure-monitor.png" alt-text="Export data from Azure Monitor - architecture.":::

When configuring the data export rules, select the types of logs you want to export. Once configured, new data arriving at the Log Analytics ingestion endpoint, and targeted to your workspace for the selected tables, is exported to your Storage Account or Event hub.

When configuring data for export, note the following considerations:

|Consideration  | Details |
|---------|---------|
|**Scope of data exported**     |  Once export is configured for a specific table, all data sent to that table is exported, with no exception. Exported a filtered subset of your data, or limiting the export to specific events, is not supported.       |
|**Location requirements**     |   Both the Azure Monitor / Azure Sentinel workspace, and the destination location (an Azure Storage Account or event hub) must be located in the same geographical region.      |
|**Supported tables**     | Not all tables are supported for export, such as custom log tables, which are not supported. <br><br>For more information, see [Log Analytics workspace data export in Azure Monitor](/azure/azure-monitor/logs/logs-data-export) and the [list of supported tables](/azure/azure-monitor/logs/logs-data-export#supported-tables).         |
|     |         |

### Data export methods and procedures

Use one of the following procedures to export data from Azure Sentinel into ADX:

- **Via an ADX event hub**. Export data from Log Analytics into an event hub, where you can ingest it into ADX. This method stores some data (the first X months) in both Azure Sentinel and ADX.

- **Via Azure Storage and Azure Data Factory**. Export your data from Log Analytics into Azure Blob Storage, then Azure Data Factory is used to run a periodic copy job to further export the data into ADX. This method enables you to copy data from Azure Data Factory only when it nears its retention limit in Azure Sentinel / Log Analytics, avoiding duplication.

### [ADX event hub](#tab/adx-event-hub)

This section describes how to export Azure Sentinel data from Log Analytics into an event hub, where you can ingest it into ADX. Similar to [sending data directly to Azure Sentinel and ADX in parallel](#send-data-directly-to-azure-sentinel-and-adx-in-parallel), this method includes some data duplication as the data is streamed into ADX as it arrives in Log Analytics.

The following image shows a sample flow of exported data into an event hub, from where it's ingested into ADX.

:::image type="content" source="media/store-logs-in-adx/ingest-data-to-adx-via-event-hub.png" alt-text="Export data into ADX via an ADX event hub.":::

The architecture shown in the previous image provides the full Azure Sentinel SIEM experience, including incident management, visual investigations, threat hunting, advanced visualizations, UEBA, and more, for data that must be accessed frequently, every *X* months. At the same time, this architecture also enables you to query long-term data by accessing it directly in ADX, or via Azure Sentinel thanks to the ADX proxy feature. Queries to long-term data storage in ADX can be ported without any changes from Azure Sentinel to ADX.

> [!TIP]
> For more information about this procedure, see [Tutorial: Ingest and query monitoring data in Azure Data Explorer](/azure/data-explorer/ingest-data-no-code).
>

**To export data into ADX via an event hub**:

1. **Configure the Log Analytics data export to an event hub**. For more information, see [Log Analytics workspace data export in Azure Monitor](/azure/azure-monitor/platform/logs-data-export).

1. **Create an ADX cluster and database**. For more information, see:

    - [Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-database-portal)
    - [Select the correct compute SKU for your Azure Data Explorer cluster](/azure/data-explorer/manage-cluster-choose-sku)

1. **Create target tables**. The raw data is first ingested to an intermediate table, where the raw data is stored, manipulated, and expanded.

    An update policy, which is similar to a function applied to all new data, is used to ingest the expanded data into the final table, which has the same schema as the original table in Azure Sentinel.

    Set the retention on the raw table to **0** days. The data is stored only in the properly formatted table, and deleted in the raw table as soon as it's transformed.

    For more information, see [Ingest and query monitoring data in Azure Data Explorer](/azure/data-explorer/ingest-data-no-code?tabs=diagnostic-metrics).

1. <a name="mapping"></a>**Create table mapping**. Map the JSON tables to define how records land in the raw events table as they come in from an event hub. For more information, see [Create the update policy for metric and log data](/azure/data-explorer/ingest-data-no-code?tabs=diagnostic-metrics).

1. **Create an update policy and attach it to the raw records table**. In this step, create a function, called an update policy, and attach it to the destination table so that the data is transformed at ingestion time.

    > [!NOTE]
    > This step is required only when you want to have data tables in ADX with the same schema and format as in Azure Sentinel.
    >

    For more information, see [Connect an event hub to Azure Data Explorer](/azure/data-explorer/ingest-data-no-code?tabs=activity-logs).

1. **Create a data connection between the event hub and the raw data table in ADX**. Configure ADX with details of how to export the data into the event hub.

    Use the instructions in the [Azure Data Explorer documentation](/azure/data-explorer/ingest-data-no-code?tabs=activity-logs) and specify the following details:

    - **Target**. Specify the specific table with the raw data.
    - **Format**. Specify `.json` as the table format.
    - **Mapping to be applied**. Specify the mapping table created in [step 4](#mapping) above.


1. **Modify retention for the target table**. The [default Azure Data Explorer retention policy](/azure/data-explorer/kusto/management/retentionpolicy) may be far longer than you need.

    Use the following command to update the retention policy to one year:

    ```kusto
    .alter-merge table <tableName> policy retention softdelete = 365d recoverability = disabled
    ```
### [Azure Storage / Azure Data Factory](#tab/azure-storage-azure-data-factory)

This section describes how to export Azure Sentinel data from Log Analytics into Azure Storage, where Azure Data Factory can run a regular job to export the data into ADX.

Using Azure Storage and Azure Data Factory enables you to copy data from Azure Storage only when it's close to the retention limit in Azure Sentinel / Log Analytics. There is no data duplication, and ADX is used *only* to access data that's older than the retention limit in Azure Sentinel.

> [!TIP]
> While the architecture for using Azure Storage and Azure Data Factory for your legacy data is more complex, this method can offer larger cost savings overall.
>
The following image shows a sample flow of exported data into an Azure Storage, from where Azure Data Factory runs a regular job to further export it into ADX.

:::image type="content" source="media/store-logs-in-adx/ingest-data-to-adx-via-azure-storage-azure-data-factory.png" alt-text="Export data into ADX via Azure Storage and Azure Data Factory.":::

**To export data into ADX via an Azure Storage and Azure Data Factory**:

1. **Configure the Log Analytics data export to an event hub**. For more information, see [Log Analytics workspace data export in Azure Monitor](/azure/azure-monitor/logs/logs-data-export?tabs=portal#enable-data-export).

1. **Create an ADX cluster and database**. For more information, see:

    - [Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-database-portal)
    - [Select the correct compute SKU for your Azure Data Explorer cluster](/azure/data-explorer/manage-cluster-choose-sku)

1. **Create target tables**. The raw data is first ingested to an intermediate table, where the raw data is stored, manipulated, and expanded.

    An update policy, which is similar to a function applied to all new data, is used to ingest the expanded data into the final table, which has the same schema as the original table in Azure Sentinel.

    Set the retention on the raw table to **0** days. The data is stored only in the properly formatted table, and deleted in the raw table as soon as it's transformed.

    For more information, see [Ingest and query monitoring data in Azure Data Explorer](/azure/data-explorer/ingest-data-no-code?tabs=diagnostic-metrics).

1. <a name="mapping"></a>**Create table mapping**. Map the JSON tables to define how records land in the raw events table as they come in from an event hub. For more information, see [Create the update policy for metric and log data](/azure/data-explorer/ingest-data-no-code?tabs=diagnostic-metrics).

1. **Create an update policy and attach it to the raw records table**. In this step, create a function, called an update policy, and attach it to the destination table so that the data is transformed at ingestion time.

    > [!NOTE]
    > This step is required only when you want to have data tables in ADX with the same schema and format as in Azure Sentinel.
    >

    For more information, see [Connect an event hub to Azure Data Explorer](/azure/data-explorer/ingest-data-no-code?tabs=activity-logs).

1. **Create a data connection between the event hub and the raw data table in ADX**. Configure ADX with details of how to export the data into the event hub.

    Use the instructions in the [Azure Data Explorer documentation](/azure/data-explorer/ingest-data-no-code?tabs=activity-logs) and specify the following details:

    - **Target**. Specify the specific table with the raw data.
    - **Format**. Specify `.json` as the table format.
    - **Mapping to be applied**. Specify the mapping table created in [step 4](#mapping) above.

1. **Set up the Azure Data Factory pipeline**:

    - Create linked services for Azure Storage and Azure Data Explorer. For more information, see:

        - [Copy and transform data in Azure Blob storage by using Azure Data Factory](/azure/data-factory/connector-azure-blob-storage)
        - [Copy data to or from Azure Data Explorer by using Azure Data Factory](/azure/data-factory/connector-azure-data-explorer).

    - Create a dataset from Azure Storage. For more information, see [Datasets in Azure Data Factory](/azure/data-factory/concepts-datasets-linked-services).

    - Create a data pipeline with a copy operation, based on the **LastModifiedDate** properties.

        For more information, see [Copy new and changed files by **LastModifiedDate** with Azure Data Factory](/azure/data-factory/solution-template-copy-new-files-lastmodifieddate).

---

## Design considerations

When storing your Azure Sentinel data in ADX, consider the following elements:

|Consideration  |Description  |
|---------|---------|
|**Cluster size and SKU**     | Plan carefully for the number of nodes and the VM SKU in your cluster. These factors will determine the amount of processing power and the size of your hot cache (SSD and memory). The bigger the cache, the more data you will be able to query at a higher performance. <br><br>We encourage you to visit the [ADX sizing calculator](https://dataexplorer.azure.com/AzureDataExplorerCostEstimator.html), where you can play with different configurations and see the resulting cost. <br><br>ADX also has an autoscale capability that makes intelligent decisions to add/remove nodes as needed based on cluster load. For more information, see [Manage cluster horizontal scaling (scale out) in Azure Data Explorer to accommodate changing demand](/azure/data-explorer/manage-cluster-horizontal-scaling).      |
|**Hot/cold cache**     | ADX provides control over the data tables that are in hot cache, and return results faster. If you have large amounts of data in your ADX cluster, you may want to break down tables by month, so that you have greater granularity on the data that's present in your hot cache. <br><br>For more information, see [Cache policy (hot and cold cache)](/azure/data-explorer/kusto/management/cachepolicy)       |
|**Retention**     |   In ADX, you can configure when data is removed from a database or an individual table, which is also an important part of limiting storage costs. <br><br> For more information, see [Retention policy](/azure/data-explorer/kusto/management/retentionpolicy).       |
|**Security**     |  Several ADX settings can help you protect your data, such as identity management, encryption, and so on. Specifically for role-based access control (RBAC), ADX can be configured to restrict access to databases, tables, or even rows within a table. For more information, see [Security in Azure Data Explorer](/azure/data-explorer/security) and [Row level security](/azure/data-explorer/kusto/management/rowlevelsecuritypolicy).|
|**Data sharing**     |   ADX allows you to make pieces of data available to other parties, such as partners or vendors, and even buy data from other parties. For more information, see [Use Azure Data Share to share data with Azure Data Explorer](/azure/data-explorer/data-share).      |
| **Other cost components** | Consider the other cost components for the following methods: <br><br>**Exporting  data via an ADX event hub**: <br>- Log Analytics data export costs, charged per exported GBs. <br>- Event hub costs, charged by throughput unit.  <br><br>**Export data via Azure Storage and Azure Data Factory**: <br>- Log Analytics data export, charged per exported GBs. <br>- Azure Storage, charged by GBs stored. <br>- Azure Data Factory, charged per copy of activities run.
|     |         |

## Next steps

Regardless of where you store your data, continue hunting and investigating using Azure Sentinel.

For more information, see:

- [Tutorial: Investigate incidents with Azure Sentinel](tutorial-investigate-cases.md)
- [Hunt for threats with Azure Sentinel](hunting.md)
