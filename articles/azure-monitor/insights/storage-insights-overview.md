---
title: Monitor Azure Storage with Azure Monitor for Storage | Microsoft Docs
description: This article describes the Azure Monitor for Storage feature that provides storage admins with a quick understanding of performance and utilization issues with their Azure Storage accounts.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/12/2019
ms.author: magoedte
---

## Review capacity and utilization with Azure Monitor for Storage

Azure Monitor for Storage provides comprehensive monitoring of Azure Storage accounts by delivering a holistic view of their health and performance that you would otherwise view from [Service Health](../../service-health/service-health-overview.md) and Storage metrics in [Azure Monitor](../../storage/common/storage-metrics-in-azure-monitor.md). Combined it delivers:

* **At scale perspective** showing a snapshot view of their availability based on the health of the storage service or the API operation, utilization showing total number of requests that the storage service receives, and latency showing the average time the storage service or API operation type is taking to process requests. You can also view capacity broken for each data service by blob, file, table, and queues.
* **Drill down analysis** of a particular storage account to help diagnose issues or perform detailed analysis by category - availability, performance, failures, and capacity. Selecting any one of those options provides an in-depth view of metrics tailored to that scoped report.  
* **Customizable** where you can change which metrics you want to see, modify or set thresholds that align with your limits, and save as your own report. Charts in the report can be pinned to Azure dashboard.  

Azure Monitor for Storage is an Azure Monitor workbook, which combines text, [log queries](../log-query/query-language.md), metrics, and parameters into rich interactive reports. Workbooks are editable by any other team members who have access to the same Azure resources.

This feature does not require you to enable or configure anything, the metrics are already collected by default. If you are unfamiliar with the comprehensive set of metrics available with Azure Storage and need a description of their purpose and how to interpret their values, review [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](../../storage/common/storage-monitoring-diagnosing-troubleshooting.md).

## Multi-subscription view

To view the utilization and availability of your Storage accounts across all of your subscriptions, perform the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Monitor** from the left-hand pane in the Azure portal, and under the **Insights** section, select **Storage Accounts (preview)**.

    ![Multiple storage accounts view](./media/storage-insights-overview/multiple-storage-accounts-view-01.png)

On the Overview page, for the subscription selected the table displays interactive storage metrics and service health state for up to ten storage accounts grouped by the subscription. You can scope the results based on the options you select within the following drop-down lists:

1. Subscriptions - only subscriptions that have storage accounts are listed.  

2. Storage Accounts - by default, only ten storage accounts are selected.

3. Time Range - by default, displays the last four hours of information based on the corresponding selections made.

The counter rolls-up the total number of storage accounts in the subscription and reflects how many of the total are selected.  

Selecting any one of the values under the columns open a report tailored to a specific type of storage KPIs. Specifically:

* **Availability** open the **Availability** report. It shows the current health state of Azure Storage service, a table showing the available health state of each object categorized by data service defined in the storage account with a trend line representing the time range selected, and an availability trend chart for each data service in the account.  

    ![Availability report example](./media/storage-insights-overview/storage-account-availability-01.png)

* **E2E Latency** and **Server Latency** open the **Performance** report. It includes a rollup status indicator showing E2E latency and server latency, a performance chart of E2E versus server latency, and a table breaking down latency of successful calls by API categorized by data service defined in the storage account.

    ![Performance report example](./media/storage-insights-overview/storage-account-performance-01)

* **ClientOtherError/Errors** open the **Failure** report. The report shows a rollup of all other client-side errors except described ones and successful requests, a performance chart for the transaction **Response Type** dimension metric specific to ClientOtherError attribute, and two tables - **Transactions by API name** and **Transactions by Response type**.

   ![Failure report example](./media/storage-insights-overview/storage-account-failure-01.png)

When you select a storage account from the list in the table, you drill down to the **Overview** report. This report focuses specifically on key performance indicators (KPIs) that helps you quickly assess:

1. Health of the Storage service to see immediately if an issue outside of your control is affecting the Storage service in the region it is deployed to, which is stated under the **Summarized** column.  

2.Interactive performance charts showing the most essential details related to storage capacity, availability, transactions, and latency.  

3. Rollup status indicators highlighting service availability, total count of transactions to the storage service, E2E latency, and server latency.

![Storage account overview report](./media/storage-insights-overview/storage-account-overview-01.png)

