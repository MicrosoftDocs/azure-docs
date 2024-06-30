---
title: Monitoring Azure Operator Insights
description: Start here to learn how to monitor Azure Operator Insights
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: conceptual
ms.custom: horz-monitor
ms.date: 12/15/2023
---

<!-- VERSION 2.3 2022_05_17
Template for the main monitoring article for Azure services. -->

# Monitoring Azure Operator Insights

When you have critical applications and business processes relying on Azure resources, you want to monitor those resources for their availability, performance, and operation. 

Azure Operator Insights Data Products use [Azure Monitor](/azure/azure-monitor/overview). They collect the same kinds of monitoring data as other Azure resources that are described in [Monitoring data from Azure resources](/azure/azure-monitor/essentials/monitor-azure-resource#monitoring-data-from-Azure-resources). See [Monitoring Azure Operator Insights data reference](monitor-operator-insights-data-reference.md) for detailed information on the monitoring data created by Data Products.

> [!TIP]
> If you're unfamiliar with the features of Azure Monitor common to all Azure services that use it, read [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).

Ingestion agents also collect monitoring data that you or Microsoft Support can use for troubleshooting.

## Metrics for Data Products: Overview, collection and analysis

Azure Operator Insights doesn't provide metrics in Azure Monitor.

## Activity logs for Data Products: Overview, collection and analysis

The [Activity log](/azure/azure-monitor/essentials/activity-log) is a type of platform log in Azure that provides insight into subscription-level events. For Azure Operator Insights, the Activity log includes activities like creating a Data Product or changing its settings.

The Activity log is collected and stored automatically by Azure. You can:

- View the Activity log in the **Activity Log** for your Data Product.
- Route the Activity Log to a Log Analytics workspace, which offers a rich query interface. See [Send to Log Analytics workspace](../azure-monitor/essentials/activity-log.md#send-to-log-analytics-workspace).
- Route the Activity Log to other locations or download it. See [Azure Monitor activity log](../azure-monitor/essentials/activity-log.md).

## Resource logs for Data Products: Overview, collection and analysis

Resource logs provide an insight into operations that were performed within an Azure resource. This is known as the *data plane*. For Data Products, resource logs include ingestion (activity on files uploaded to Azure Operator Insights), transformation (processing the data in those files), and management of the processed data.

Resource logs aren't collected and stored until you create a *diagnostic setting* that routes them to one or more locations. We recommend routing them to a Log Analytics workspace, which stores the logs in [Azure Monitor Logs](../azure-monitor/logs/data-platform-logs.md). Log Analytics allows you to analyze the logs of all your Azure resources together in Azure Monitor Logs and take advantage of all the features available to Azure Monitor Logs including [log queries](../azure-monitor/logs/log-query-overview.md) and [log alerts](../azure-monitor/alerts/alerts-log.md).

For instructions on using getting started with Log Analytics and creating a diagnostic setting, see [Get started with resource logs for Data Products](#get-started-with-resource-logs-for-data-products). For more information about the data available, see [Data Product information in Azure Monitor Logs](#data-product-information-in-azure-monitor-logs).

### Get started with resource logs for Data Products

To start monitoring a Data Product with Azure Monitor Logs and Log Analytics:

1. Create a Log Analytics workspace by following [Create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md).
1. In the **Diagnostic setting** view of your Data Product, create a diagnostic setting that routes the logs that you want to collect to the Log Analytics workspace. To use the example query in this procedure, include **Database Query** (in addition to any other category of logs that you want to collect).
    - For instructions, see [Create diagnostic setting to collect platform logs and metrics in Azure](/azure/azure-monitor/platform/diagnostic-settings). You can use the Azure portal, CLI, or PowerShell.
    - The categories of logs for Azure Operator Insights are listed in [Azure Operator Insights monitoring data reference](monitor-operator-insights-data-reference.md#resource-logs).
1. To use the example query in this procedure, run a query on the data in your Data Product by following [Query data in the Data Product](data-query.md). This step ensures that Azure Monitor Logs has some data for your Data Product.
1. Return to your Data Product resource and select **Logs** from the Azure Operator Insights menu to access Log Analytics.
1. Run the following query to view the log for the query that you ran on your Data Product, replacing _username@example.com_ with the email address you used when you ran the query. You can also adapt the sample queries in [Sample Kusto queries](#sample-kusto-queries).
    ```kusto
    AOIDatabaseQuery
    | where User has_cs "username@example.com"
    | take 100
    ```

> [!IMPORTANT]
> When you select **Logs** from the Azure Operator Insights menu, Log Analytics is opened with the query scope set to the current Data Product. This means that log queries will only include data from that resource. If you want to run a query that includes data from other Data Products or data from other Azure services, select **Logs** from the **Azure Monitor** menu. See [Log query scope and time range in Azure Monitor Log Analytics](/azure/azure-monitor/logs/scope) for details.

### Data Product information in Azure Monitor Logs

For a full list of the types of resource logs collected for Azure Operator Insights, see [Monitoring Azure Operator Insights data reference: Resource logs](monitor-operator-insights-data-reference.md#resource-logs).

Data in Azure Monitor Logs is stored in tables where each table has its own set of unique properties. For a list of the Azure Operator Insights tables used by Azure Monitor Logs and queryable by Log Analytics, see [Monitoring Azure Operator Insights data reference: Azure Monitor Logs tables](monitor-operator-insights-data-reference.md#azure-monitor-logs-tables). 

All resource logs in Azure Monitor have the same fields followed by service-specific fields. The common schema is outlined in [Azure Monitor resource log schema](/azure/azure-monitor/essentials/resource-logs-schema) The schemas for Azure Operator Insights resource logs are found in the [Azure Operator Insights Data Reference: Schemas](monitor-operator-insights-data-reference.md#schemas).

### Sample Kusto queries

You can use the following example queries in a Log Analytics workspace to help you monitor your Data Products:

- Get all logs about rows that weren't digested successfully:

    ```kusto
    AOIDigestion
    | where Message startswith_cs "Failed to decode row"
    | take 100
    ```

- Get a breakdown of the number of files that weren't digested, grouped by the top-level directory that they were uploaded to (typically the SiteId):

    ```kusto
    AOIDigestion
    | where Message startswith_cs "Failed to digest file"
    | parse FilePath with Source:string "/" *
    | summarize count() by Source
    ```

- List all the queries run on a Quality of Experience - MCC Data Product by a particular user:

    ```kusto
    AOIDatabaseQuery
    | where DatabaseName has_cs "edrdp" and User has_cs "username@example.com"
    | take 100
    ```

- List all the ingestion operations performed on input storage of a Data Product:

    ```kusto
    AOIStorage
    | where Category has_cs "Ingestion"
    | take 100
    ```

- List all delete operations performed on input storage of a Data Product:

    ```kusto
    AOIStorage
    | where Category has_cs "IngestionDelete"
    | take 100
    ```

- List all Read operations performed on storage of a Data Product:

    ```kusto
    AOIStorage
    | where Category has_cs "ReadStorage"
    | take 100
    ```

For a list of common queries for Azure Operator Insights, see the [Log Analytics queries interface](/azure/azure-monitor/logs/queries).

## Monitoring for ingestion agents

Azure Operator Insights also requires ingestion agents deployed in your network.

Ingestion agents that we provide automatically collect metrics and logs for troubleshooting. Metrics and logs are stored on the VM on which you installed the agent, and aren't uploaded to Azure Monitor. For details, see [Monitor and troubleshoot ingestion agents for Azure Operator Insights](monitor-troubleshoot-ingestion-agent.md).

## Next steps

- For a reference of the Azure Monitor data created by Azure Operator Insights, see [Monitoring Azure Operator Insights data reference](monitor-operator-insights-data-reference.md).
- For more information about metrics and logs for MCC EDR ingestion agents, see [Monitor and troubleshoot MCC EDR Ingestion Agents for Azure Operator Insights](troubleshoot-mcc-edr-agent.md).
- For more information about metrics and logs for SFTP ingestion agents, see [Monitor and troubleshoot SFTP Ingestion Agents for Azure Operator Insights](troubleshoot-sftp-agent.md).
- For background on Azure Monitor, see [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) .