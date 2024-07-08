---
title: Azure Monitor Logs
description: This article explains how Azure Monitor Logs works and how people with different monitoring needs and skills can use the basic and advanced capabilities that Azure Monitor Logs offers.
ms.topic: conceptual
ms.date: 07/07/2024
ms.author: guywild

# Customer intent: As new user or decision-maker evaluating Azure Monitor Logs, I want to understand how Azure Monitor Logs addresses my monitoring and analysis needs.
---

# Azure Monitor Logs overview

Azure Monitor Logs is a managed service that lets you collect, organize, store, and act on any type of log data for any need.

You can collect and manage the data model and costs of different types of data in one [Log Analytics workspace](../logs/log-analytics-workspace-overview.md), the primary Azure Monitor Logs resource. This means you never have to move data or manage additional storage, and you can retain different data types for as long or as little as you need.

This article provides an overview of how Azure Monitor Logs works and explains how it provides value to people with a variety of monitoring requirements and skills within an organization.    

> [!NOTE]
> Azure Monitor Logs is one half of the data platform that supports Azure Monitor. The other is [Azure Monitor Metrics](../essentials/data-platform-metrics.md), which stores numeric data in a time-series database. Numeric data is more lightweight than data in Azure Monitor Logs. Azure Monitor Metrics can support near real time scenarios, so it's useful for alerting and fast detection of issues.
>
> Azure Monitor Metrics can only store numeric data in a particular structure, whereas Azure Monitor Logs can store a variety of data types that have their own structures. You can also perform complex analysis on Azure Monitor Logs data by using log queries, which can't be used for analysis of Azure Monitor Metrics data.

## Manage data storage, consumption, and costs in your Log Analytics workspace    

Azure Monitor Logs stores the data that you collect in a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md), which consists of tables in which you store various types of data. 

To address the unique data collection and analysis needs of the various personas who use the data in the a Log Analytics workspace, you can:

- [Define table plans]() based on your data consumption and cost management needs.
- [Manage low-cost long-term retention and interactive retention](../logs/data-retention-archive.md) for each table.
- [Manage access](../logs/manage-access.md) to the workspace and to specific tables.
- Use summary rules to [aggregate critical data in summary tables](../logs/summary-rules.md). This lets you optimize data for ease of use and actionable insights, and store raw data in a table with a low-cost table plan for however long you need it.
- Create ready-to-run [saved queries](../logs/save-query.md), [visualizations](../visualize/), and [alerts](../alerts/alerts-create-log-alert-rule.md) tailored to specific personas.  

:::image type="content" source="media/data-platform-logs/log-analytics-workspace-for-all-log-data.png" lightbox="edia/data-platform-logs/log-analytics-workspace-for-all-log-data.png" alt-text="A screenshot of a Log Analytics workspace in the Azure portal.":::

You can also configure network isolation, replicate your workspace across regions, and [design a workspace architecture based on your business needs](../logs/workspace-design.md).


## Built-in and custom monitoring experiences based on a powerful query language

You can analyze log data by using a sophisticated query language that's capable of quickly analyzing millions of records. You might perform a simple query that retrieves a specific set of records or perform sophisticated data analysis to identify critical patterns in your monitoring data. Work with log queries and their results interactively by using Log Analytics, use them in alert rules to be proactively notified of issues, or visualize their results in a workbook or dashboard.

Many of Azure Monitor's [ready-to-use, curated Insights experiences](../insights/insights-overview.md) store data in a Azure Monitor Logs, and present this data in an intuitive way so you can monitor the performance and availability of your cloud and hybrid applications and their supporting components.

## Table plans tailored for different data consumption needs


The diagram and table below compare the Analytics, Basic, and Auxiliary table plans. For information about interactive and long-term retention, see [Manage data retention in a Log Analytics workspace](../logs/data-retention-archive.md).

:::image type="content" source="media/basic-logs-configure/azure-monitor-logs-data-plans.png" lightbox="media/basic-logs-configure/azure-monitor-logs-data-plans.png" alt-text="Diagram that presents an overview of the capabilities provided by the Analytics, Basic, and Auxiliary table plans.":::

|                                                        | Analytics                                                    | Basic                                                        | Auxiliary (Preview)                                          |
| ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Best for                                               | High-value data used for continuous monitoring, real-time detection, and performance analytics. | Medium-touch data needed for troubleshooting and incident response. | Low-touch data, such as verbose logs, and data required for auditing and compliance. |
| Supported [table types](../logs/manage-logs-tables.md) | All table types                                              | [Azure tables that support Basic logs](#azure-tables-that-support-the-basic-table-plan) and DCR-based custom tables | DCR-based custom tables                                      |
| [Log queries](../logs/get-started-queries.md)                                            | Full query capabilities.                                     | Full Kusto Query Language (KQL) on a single table, which you can extend with data from an Analytics table using [lookup](/azure/data-explorer/kusto/query/lookup-operator). | Full KQL on a single table, which you can extend with data from an Analytics table using [lookup](/azure/data-explorer/kusto/query/lookup-operator). |
| Query performance                                      | Fast                                                         | Fast                                                         | Slower<br> Good for auditing. Not optimized for real-time analysis.                                                       |
| [Alerts](../alerts/alerts-overview.md)                                                 | ✅                                                            | ❌                                                            | ❌                                                            |
| [Insights](../insights/insights-overview.md)                                             | ✅                                                            |     ❌                                                        |                                             ❌               |
| [Microsoft Sentinel](/azure/sentinel/overview.md)                                             | ✅                                                         |     ✅                                                        |                                             ❌               |
| [Dashboards](../visualize/tutorial-logs-dashboards.md)                                             | ✅                                                            |     ❌                                                        |                                             ❌               |
| [Search jobs](../logs/search-jobs.md)                  | ✅                                                            | ✅                                                            | ✅                                                            |
| [Summary rules](../logs/summary-rules.md)              | ✅                                                            | ✅ KQL limited to a single table                              | ✅ KQL limited to a single table                              |
| [Restore](../logs/restore.md)                          | ✅                                                            | ✅                                                            | ❌                                                            |
| Pricing model                                          | **Ingestion** - Standard cost.<br>**Interactive retention** - 30 days included. Prorated monthly charge for extended interactive retention of up to two years.<br>**Queries** - Unlimited queries included.<br>**Long-term retention** - Prorated monthly long-term retention charge. | **Ingestion** - Reduced cost.<br>**Interactive retention** - 30 days included.<br>**Queries** - Pay per query.<br>**Long-term retention** - Prorated monthly long-term retention charge. | **Ingestion** - Minimal cost.<br>**Interactive retention** - 30 days included.<br>**Queries** - Pay per query.<br>**Long-term retention** - Prorated monthly long-term retention charge. |
| Interactive retention                                  | 30 days (90 days for Microsoft Sentinel and Application Insights).<br> Can be extended to up to two years. | 30 days                                                      | 30 days                                                      |
| Total retention                                        | Up to 12 years                                               | Up to 12 years                                               | Up to 12 years                                               |

> [!NOTE]
> The Basic and Auxiliary table plans aren't available for workspaces in [legacy pricing tiers](cost-logs.md#legacy-pricing-tiers).

## Data collection
After you create a [Log Analytics workspace](#log-analytics-workspaces), you must configure sources to send their data. No data is collected automatically.

This configuration will be different depending on the data source. For example:

- [Create diagnostic settings](../essentials/diagnostic-settings.md) to send resource logs from Azure resources to the workspace.
- [Enable data collection rules](../essentials/data-collection-rule-create-edit.md) to collect data from virtual machines. 

> [!IMPORTANT]
> For most data collection in Logs, you incur ingestion and retention costs. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) before you enable any data collection.


## Log Analytics 
Log Analytics is a tool in the Azure portal. Use it to edit and run log queries and interactively analyze their results. You can then use those queries to support other features in Azure Monitor, such as log search alerts and workbooks. Access Log Analytics from the **Logs** option on the Azure Monitor menu or from most other services in the Azure portal.

For a description of Log Analytics, see [Overview of Log Analytics in Azure Monitor](./log-analytics-overview.md). To walk through using Log Analytics features to create a simple log query and analyze its results, see [Log Analytics tutorial](./log-analytics-tutorial.md).

## Log queries
Data is retrieved from a Log Analytics workspace through a log query, which is a read-only request to process data and return results. Log queries are written in [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/). KQL is the same query language that Azure Data Explorer uses.

You can:

- Write log queries in Log Analytics to interactively analyze their results.
- Use them in alert rules to be proactively notified of issues.
- Include their results in workbooks or dashboards.

Insights include prebuilt queries to support their views and workbooks.

For a list of where log queries are used and references to tutorials and other documentation to get you started, see [Log queries in Azure Monitor](./log-query-overview.md).
<!-- convertborder later -->
:::image type="content" source="media/data-platform-logs/log-analytics.png" lightbox="media/data-platform-logs/log-analytics.png" alt-text="Screenshot that shows queries in Log Analytics." border="false":::

## Relationship to Azure Data Explorer
Azure Monitor Logs is based on Azure Data Explorer. A Log Analytics workspace is roughly the equivalent of a database in Azure Data Explorer. Tables are structured the same, and both use KQL. For information on KQL, see [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/).

The experience of using Log Analytics to work with Azure Monitor queries in the Azure portal is similar to the experience of using the Azure Data Explorer Web UI. You can even [include data from a Log Analytics workspace in an Azure Data Explorer query](/azure/data-explorer/query-monitor-data).

## Relationship to Azure Sentinel and Microsoft Defender for Cloud

[Security monitoring](../best-practices-plan.md#security-monitoring-solutions) in Azure is performed by [Microsoft Sentinel](../../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md).

These services store their data in Azure Monitor Logs so that it can be analyzed with other log data collected by Azure Monitor.

### Learn more

| Service | More information |
|:--------------|:-----------------|
| Azure Sentinel | <ul><li>[Where Microsoft Sentinel data is stored](../../sentinel/geographical-availability-data-residency.md#where-microsoft-sentinel-data-is-stored)</li><li>[Design your Microsoft Sentinel workspace architecture](../../sentinel/design-your-workspace-architecture.md)</li><li>[Design a Log Analytics workspace architecture](./workspace-design.md)</li><li>[Prepare for multiple workspaces and tenants in Microsoft Sentinel](../../sentinel/prepare-multiple-workspaces.md)</li><li>[Enable Microsoft Sentinel on your Log Analytics workspace](../../sentinel/quickstart-onboard.md).</li><li>[Log management in Microsoft Sentinel](../../sentinel/skill-up-resources.md#module-5-log-management)</li><li>[Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/microsoft-sentinel/)</li><li>[Charges for workspaces with Microsoft Sentinel](./cost-logs.md#workspaces-with-microsoft-sentinel)</li></ul> |
| Microsoft Defender for Cloud | <ul><li>[Continuously export Microsoft Defender for Cloud data](../../defender-for-cloud/continuous-export.md)</li><li>[Data consumption](../../defender-for-cloud/data-security.md#data-consumption)</li><li>[Frequently asked questions about Log Analytics workspaces used with Microsoft Defender for Cloud](../../defender-for-cloud/faq-data-collection-agents.yml)</li><li>[Microsoft Defender for Cloud pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/)</li><li>[Charges for workspaces with Microsoft Defender for Cloud](./cost-logs.md#workspaces-with-microsoft-defender-for-cloud)</li></ul> |

## Next steps

- Learn about [log queries](./log-query-overview.md) to retrieve and analyze data from a Log Analytics workspace.
- Learn about [metrics in Azure Monitor](../essentials/data-platform-metrics.md).
- Learn about the [monitoring data available](../data-sources.md) for various resources in Azure.
