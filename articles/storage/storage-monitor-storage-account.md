<properties
	pageTitle="How to monitor a storage account | Microsoft Azure"
	description="Learn how to monitor a storage account in Azure by using the Azure Portal."
	services="storage"
	documentationCenter=""
	authors="robinsh"
	manager="carmonm"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/09/2016"
	ms.author="robinsh"/>

# Monitor a storage account in the Azure Portal

## Overview

You can monitor your storage account from the [Azure Portal](https://portal.azure.com). When you configure your storage account for monitoring through the portal, Azure Storage uses [Storage Analytics](http://msdn.microsoft.com/library/azure/hh343270.aspx) to track metrics for your account and log request data.

> [AZURE.NOTE] Additional costs are associated with examining monitoring data in the [Azure Portal](https://portal.azure.com). For more information, see <a href="http://msdn.microsoft.com/library/azure/hh360997.aspx">Storage Analytics and Billing</a>. <br />

> Azure File storage currently supports Storage Analytics metrics, but does not yet support logging. You can enable metrics for Azure File storage via the [Azure Portal](https://portal.azure.com).

> Storage accounts with a replication type of Zone-Redundant Storage (ZRS) do not have the metrics or logging capability enabled at this time. 

> For an in-depth guide on using Storage Analytics and other tools to identify, diagnose, and troubleshoot Azure Storage-related issues, see [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](storage-monitoring-diagnosing-troubleshooting.md).


## How to: Configure monitoring for a storage account

1. In the [Azure Portal](https://portal.azure.com), click **Storage**, and then click the storage account name to open the dashboard.

2. Click **Configure**, and scroll down to the **monitoring** settings for the blob, table, and queue services.

	![MonitoringOptions](./media/storage-monitor-storage-account/Storage_MonitoringOptions.png)

3. In **monitoring**, set the level of monitoring and the data retention policy for each service:

	-  To set the monitoring level, select one of the following:

      **Minimal** - Collects metrics such as ingress/egress, availability, latency, and success percentages, which are aggregated for the blob, table, and queue services.

      **Verbose** - In addition to the minimal metrics, collects the same set of metrics for each storage operation in the Azure Storage Service API. Verbose metrics enable closer analysis of issues that occur during application operations.

      **Off** - Turns off monitoring. Existing monitoring data is persisted through the end of the retention period.

- To set the data retention policy, in **Retention (in days)**, type the number of days of data to retain from 1 to 365 days. If you do not want to set a retention policy, enter zero. If there is no retention policy, it is up to you to delete the monitoring data. We recommend setting a retention policy based on how long you want to retain storage analytics data for your account so that old and unused analytics data can be deleted by system at no cost.

4. When you finish the monitoring configuration, click **Save**.

You should start seeing monitoring data on the dashboard and the **Monitor** page after about an hour.

Until you configure monitoring for a storage account, no monitoring data is collected, and the metrics charts on the dashboard and **Monitor** page are empty.

After you set the monitoring levels and retention policies, you can choose which of the available metrics to monitor in the [Azure Portal](https://portal.azure.com), and which metrics to plot on metrics charts. A default set of metrics are displayed at each monitoring level. You can use **Add Metrics** to add or remove metrics from the metrics list.

Metrics are stored in the storage account in four tables named $MetricsTransactionsBlob, $MetricsTransactionsTable, $MetricsTransactionsQueue, and $MetricsCapacityBlob. For more information, see [About Storage Analytics Metrics](http://msdn.microsoft.com/library/azure/hh343258.aspx).


## How to: Customize the dashboard for monitoring

On the dashboard, you can choose up to six metrics to plot on the metrics chart from nine available metrics. For each service (blob, table, and queue), the Availability, Success Percentage, and Total Requests metrics are available. The metrics available on the dashboard are the same for minimal or verbose monitoring.

1. In the [Azure Portal](https://portal.azure.com), click **Storage**, and then click the name of the storage account to open the dashboard.

2. To change the metrics that are plotted on the chart, take one of the following actions:

	- To add a new metric to the chart, click the colored check box next to the metric header in the table below the chart.

	- To hide a metric that is plotted on the chart, clear the colored check box next to the metric header.

		![Monitoring_nmore](./media/storage-monitor-storage-account/storage_Monitoring_nmore.png)

3. By default, the chart shows trends, displaying only the current value of each metric (the **Relative** option at the top of the chart). To display a Y axis so you can see absolute values, select **Absolute**.

4. To change the time range the metrics chart displays, select 6 hours, 24 hours, or 7 days at the top of the chart.


## How to: Customize the Monitor page

On the **Monitor** page, you can view the full set of metrics for your storage account.

- If your storage account has minimal monitoring configured, metrics such as ingress/egress, availability, latency, and success percentages are aggregated from the blob, table, and queue services.

- If your storage account has verbose monitoring configured, the metrics are available at a finer resolution of individual storage operations in addition to the service-level aggregates.

Use the following procedures to choose which storage metrics to view in the metrics charts and table that are displayed on the **Monitor** page. These settings do not affect the collection, aggregation, and storage of monitoring data in the storage account.

## How to: Add metrics to the metrics table


1. In the [Azure Portal](https://portal.azure.com), click **Storage**, and then click the name of the storage account to open the dashboard.

2. Click **Monitor**.

	The **Monitor** page opens. By default, the metrics table displays a subset of the metrics that are available for monitoring. The illustration shows the default Monitor display for a storage account with verbose monitoring configured for all three services. Use **Add Metrics** to select the metrics you want to monitor from all available metrics.

	![Monitoring_VerboseDisplay](./media/storage-monitor-storage-account/Storage_Monitoring_VerboseDisplay.png)

	> [AZURE.NOTE] Consider costs when you select the metrics. There are transaction and egress costs associated with refreshing monitoring displays. For more information, see [Storage Analytics and Billing](http://msdn.microsoft.com/library/azure/hh360997.aspx).

3. Click **Add Metrics**.

	The aggregate metrics that are available in minimal monitoring are at the top of the list. If the check box is selected, the metric is displayed in the metrics list.

	![AddMetricsInitialDisplay](./media/storage-monitor-storage-account/Storage_AddMetrics_InitialDisplay.png)

4. Hover over the right side of the dialog box to display a scrollbar that you can drag to scroll additional metrics into view.

	![AddMetricsScrollbar](./media/storage-monitor-storage-account/Storage_AddMetrics_Scrollbar.png)


5. Click the down arrow by a metric to expand a list of operations the metric is scoped to include. Select each operation that you want to view in the metrics table in the [Azure Portal](https://portal.azure.com).

	In the following illustration, the AUTHORIZATION ERROR PERCENTAGE metric has been expanded.

	![ExpandCollapse](./media/storage-monitor-storage-account/Storage_AddMetrics_ExpandCollapse.png)


6. After you select metrics for all services, click OK (checkmark) to update the monitoring configuration. The selected metrics are added to the metrics table.

7. To delete a metric from the table, click the metric to select it, and then click **Delete Metric**.

	![DeleteMetric](./media/storage-monitor-storage-account/Storage_DeleteMetric.png)

## How to: Customize the metrics chart on the Monitor page

1. On the **Monitor** page for the storage account, in the metrics table, select up to 6 metrics to plot on the metrics chart. To select a metric, click the check box on its left side. To remove a metric from the chart, clear the check box.

2. To switch the chart between relative values (final value only displayed) and absolute values (Y axis displayed), select **Relative** or **Absolute** at the top of the chart.

3.	To change the time range the metrics chart displays, select **6 hours**, **24 hours**, or **7 days** at the top of the chart.



## How to: Configure logging

For each of the storage services available with your storage account (blob, table, and queue), you can save diagnostics logs for Read Requests, Write Requests, and/or Delete Requests, and can set the data retention policy for each of the services.

1. In the [Azure Portal](https://portal.azure.com), click **Storage**, and then click the name of the storage account to open the dashboard.

2. Click **Configure**, and use the Down arrow on the keyboard to scroll down to **logging**.

	![Storagelogging](./media/storage-monitor-storage-account/Storage_LoggingOptions.png)


3. For each service (blob, table, and queue), configure the following:

	- The types of request to log: Read Requests, Write Requests, and Delete Requests.

	- The number of days to retain the logged data. Enter zero is if you do not want to set a retention policy. If you do not set a retention policy, it is up to you to delete the logs.

4. Click **Save**.

The diagnostics logs are saved in a blob container named $logs in your storage account. For information about accessing the $logs container, see [About Storage Analytics Logging](http://msdn.microsoft.com/library/azure/hh343262.aspx).
