---
title:  Analyze logs and metric
titleSuffix: Azure Spring Apps Basic/Standard tier
description: Learn how to analyze logs and metrics in Azure Spring Apps Standard Consumption plan.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 3/1/2023
ms.custom: 
---

# Analyze logs and metrics

This article shows you how to analyze logs and metrics in Azure Spring Apps Standard Consumption plan.

## Logs

There are a variety of tools in Azure to analyze your consumption plan.

### Configure logging options

Logging options are configured in your Container Apps environment where you deploy the Spring Apps instance. You can choose between these logs destinations:

* **Log Analytics** - Azure Monitor Log Analytics is the default storage and viewing option.  Your logs are stored in a Log Analytics workspace where they can be viewed and analyzed using Log Analytics queries.

* **Azure Monitor** - Azure Monitor routes logs to one or more destinations:

  * Log Analytics workspace for viewing and analysis.
  * Azure storage account to archive.
  * Azure event hub for data ingestion and analytic services.
  * Azure partner monitoring solution such as, Datadog, Elastic, Logz.io and others.

* **None** - You can disable the storage of log data.

Logs are enabled in Azure Spring Apps in two ways:

* When you select Log Analytics as the logging option.
* When you select Azure Monitor as the logging option, with the following following categories selected in the Diagnostic setting:
  * Spring App console logs
  * Spring App system logs

For more information, see [Log storage and monitoring options in Azure Container Apps](../container-apps/log-options.md).

### Query Log with Log Analytics

Log Analytics is a tool in the Azure portal that you can use to view and analyze log data. By using Log Analytics, you can write Kusto queries and then sort, filter, and visualize the results in charts to spot trends and identify issues. You can work interactively with the query results or use them with other features such as alerts, dashboards, and workbooks.

There are various methods to view logs as described under the following headings.

#### Use the Logs blade

1. In the Azure portal, go to your Azure Spring Apps instance.
1. To open the **Log Search** pane, select **Logs**.
1. In the **Tables** search box, to view logs, enter a simple query such as:

   ```sql
    AppEnvSpringAppConsoleLogs_CL
    | limit 50
   ```

1. To view the search result, select **Run**.

#### Use Log Analytics

1. In the Azure portal, in the left pane, select **Log Analytics**.
1. Select the Log Analytics workspace that you chose to store the logs.
1. To open the **Log Search** pane, select **Logs**.
1. In the **Tables** search box, to view logs, enter a simple query such as:

   ```sql
    AppEnvSpringAppConsoleLogs_CL
    | limit 50
   ```

1. To view the search result, select **Run**.
1. You can search the logs of the specific application, deployment or instance by setting a filter condition:

   ```sql
    AppEnvSpringAppConsoleLogs_CL
    | where ContainerAppName_s == "YourAppName" and RevisionName_s has "YourDeploymentName" and ContainerGroupName_s == "YourInstanceName"
    | limit 50
   ```

    > [!NOTE]
    > `==` is case sensitive, but `=~` is not.

To learn more about the query language that's used in Log Analytics, see [Azure Monitor log queries](/azure/data-explorer/kusto/query/). To query all your Log Analytics logs from a centralized client, see [Azure Data Explorer](/azure/data-explorer/query-monitor-data).

## Metrics

Azure Monitor collects metric data from your Spring Apps instance at regular interval to help you gain insights into the performance and health of your Spring Apps.

The metrics explorer in the Azure portal allows you to visualize the data. You can also retrieve raw metric data through the [Azure CLI](/cli/azure/monitor/metrics) and Azure [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric).

### Available metrics

Spring Apps provides these metrics.

| Title                    | Description                                               | Metric ID       | Unit      |
|---------------------------|------------------------------------------------------------|------------------|------------|
| CPU usage nanocores      | CPU usage in nanocores (1,000,000,000 nanocores = 1 core) | UsageNanoCores  | nanocores |
| Memory working set bytes | Working set memory used in bytes                          | WorkingSetBytes | bytes     |
| Network in bytes         | Network received bytes                                    | RxBytes         | bytes     |
| Network out bytes        | Network transmitted bytes                                 | TxBytes         | bytes     |
| Requests                 | Requests processed                                        | Requests        | n/a       |
| Restart count            | Restart count of Spring App                               | RestartCount    | n/a       |

### Using metrics explorer

The Azure Monitor metrics explorer enables you to create charts from metric data to help you analyze your Azure Spring Apps resource and network usage over time. You can pin charts to a dashboard or in a shared workbook.

1. Open the metrics explorer in the Azure portal by selecting **Metrics** in the navigation pane on your Azure Spring Apps overview page. To learn more about metrics explorer, see [Getting started with metrics explorer](../azure-monitor/essentials/metrics-getting-started.md).

1. Create a chart by selecting **Metric**.  You can modify the chart by changing aggregation, adding more metrics, changing time ranges and intervals, adding filters, and applying splitting.

#### Add filters

Optionally, you can create filters to limit the data shown based on application name and instance name.  To create a filter:

1. Select **Add filter**.
1. Select App or Instance from the **Property** list.
1. Select values from the **Value** list.

## Next steps


