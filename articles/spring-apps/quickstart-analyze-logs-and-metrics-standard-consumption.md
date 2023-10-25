---
title: Quickstart - Analyze logs and metrics in the Azure Spring Apps Standard consumption and dedicated plan
description: Learn how to analyze logs and metrics in the Azure Spring Apps Standard consumption and dedicated plan.
author: KarlErickson
ms.author: shiqiu
ms.service: spring-apps
ms.topic: quickstart
ms.date: 06/21/2023
ms.custom: devx-track-java
---

# Quickstart: Analyze logs and metrics in the Azure Spring Apps Standard consumption and dedicated plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ❌ Basic/Standard ❌ Enterprise

This article shows you how to analyze logs and metrics in the Azure Spring Apps Standard consumption and dedicated plan.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- An Azure Spring Apps Standard consumption and dedicated plan service instance. For more information, see [Quickstart: Provision an Azure Spring Apps Standard consumption and dedicated plan service instance](quickstart-provision-standard-consumption-service-instance.md).
- A Spring app deployed to Azure Spring Apps. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md).

## Analyze logs

The following sections describe various tools in Azure that you can use to analyze your consumption and dedicated plan usage.

### Configure logging options

You can configure logging options in the Azure Container Apps environment where you deploy your Azure Spring Apps instance. You can choose between the following log destinations:

- **Log Analytics** - Azure Monitor Log Analytics is the default storage and viewing option. Your logs are stored in a Log Analytics workspace where you can view and analyze them using Log Analytics queries.

- **Azure Monitor** - Azure Monitor routes logs to one or more of the following destinations:

  - A Log Analytics workspace for viewing and analysis.
  - An Azure storage account to archive.
  - An Azure event hub for data ingestion and analytic services.
  - An Azure partner monitoring solution such as Datadog, Elastic, Logz.io, and others.

- **None** - You can disable the storage of log data.

You can enable logs in Azure Spring Apps in the following ways:

- When you select **Log Analytics** as the logging option.
- When you select **Azure Monitor** as the logging option, with the **Spring App console logs** category selected in the **Diagnostic** setting.

For more information, see [Log storage and monitoring options in Azure Container Apps](../container-apps/log-options.md).

### Query logs by using Log Analytics

Log Analytics is a tool in the Azure portal that you can use to view and analyze log data. By using Log Analytics, you can write Kusto queries and then sort, filter, and visualize the results in charts to spot trends and identify issues. You can work interactively with the query results or use them with other features such as alerts, dashboards, and workbooks.

The following sections describe various methods to view logs.

#### Use logs

Use the following steps to query log data.

1. In the Azure portal, go to your Azure Spring Apps instance.
1. Select **Logs** from the navigation pane.
1. In the **New Query 1** settings, enter a query such as the following example:

   ```sql
   AppEnvSpringAppConsoleLogs_CL
   | limit 50
   ```

1. Select **Run**.

#### Use Log Analytics

Use the following steps to perform analytics on log data.

1. In the Azure portal, go to your Azure Spring Apps instance.
1. Select **Log Analytics** in the navigation pane.
1. Select the Log Analytics workspace where you chose to store the logs.
1. To open the **Log Search** pane, select **Logs**.
1. To view logs, in the **Tables** search box, enter a query such as the following example:

   ```sql
   AppEnvSpringAppConsoleLogs_CL
   | limit 50
   ```

1. To view the search result, select **Run**.
1. You can search the logs of the specific application, deployment, or instance by setting a filter condition, as shown in the following example:

   ```sql
   AppEnvSpringAppConsoleLogs_CL
   | where ContainerAppName_s == "YourAppName" and RevisionName_s has "YourDeploymentName" and ContainerGroupName_s == "YourInstanceName"
   | limit 50
   ```

   > [!NOTE]
   > `==` is case sensitive, but `=~` isn't.

To learn more about the query language used in Log Analytics, see [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/). To query all your Log Analytics logs from a centralized client, see [Query data in Azure Monitor using Azure Data Explorer](/azure/data-explorer/query-monitor-data).

## Analyze metrics

Azure Monitor collects metric data from your Azure Spring Apps instance at regular intervals to help you gain insights into the performance and health of your Spring apps.

To visualize the data, select **Metrics** in the navigation pane in your Azure Spring Apps instance. You can also retrieve raw metric data through the [Azure CLI](/cli/azure/monitor/metrics) and Azure [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric).

### Available metrics

Azure Spring Apps provides the metrics described in the following table:

| Title                    | Description                                               | Metric ID         | Unit      |
|--------------------------|-----------------------------------------------------------|-------------------|-----------|
| CPU usage nanocores      | CPU usage in nanocores (1,000,000,000 nanocores = 1 core) | `UsageNanoCores`  | nanocores |
| Memory working set bytes | Working set memory used in bytes                          | `WorkingSetBytes` | bytes     |
| Network in bytes         | Network received bytes                                    | `RxBytes`         | bytes     |
| Network out bytes        | Network transmitted bytes                                 | `TxBytes`         | bytes     |
| Requests                 | Requests processed                                        | `Requests`        | n/a       |
| Restart count            | Restart count of Spring App                               | `RestartCount`    | n/a       |

### Use metrics explorer

The Azure Monitor metrics explorer enables you to create charts from metric data to help you analyze your Azure Spring Apps resource and network usage over time. You can pin charts to a dashboard or in a shared workbook.

1. Open the metrics explorer in the Azure portal by selecting **Metrics** in the navigation pane on the overview page of your Azure Spring Apps instance. To learn more about metrics explorer, see [Getting started with metrics explorer](../azure-monitor/essentials/metrics-getting-started.md).

1. Create a chart by selecting a metric in the **Metric** dropdown menu. You can modify the chart by changing the aggregation, adding more metrics, changing time ranges and intervals, adding filters, and applying splitting.

#### Add filters

Optionally, you can create filters to limit the data shown based on application name and instance name. Use the following steps to create a filter:

1. Select **Add filter**.
1. Select **App** or **Instance** from the **Property** list.
1. Select values from the **Value** list.

## Next steps

> [!div class="nextstepaction"]
> [How to enable your own persistent storage in Azure Spring Apps with the Standard consumption and dedicated plan](./how-to-custom-persistent-storage-with-standard-consumption.md)
