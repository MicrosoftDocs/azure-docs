---
title: Troubleshoot Azure Stream Analytics using resource logs
description: Learn how to troubleshoot Azure Stream Analytics jobs by using resource logs, including how to enable diagnostic logging and analyze activity and resource logs.
ms.service: azure-stream-analytics
ms.topic: how-to
ms.date: 06/10/2026
ms.custom: sfi-image-nochange
ai-usage: ai-assisted
---
# Troubleshoot Azure Stream Analytics by using resource logs

Occasionally, an Azure Stream Analytics job unexpectedly stops processing. Failures can be caused by an unexpected query result, by connectivity to devices, or by an unexpected service outage. The resource logs in Azure Stream Analytics can help you identify the cause of these failures and reduce recovery time.

Enable resource logs for all Stream Analytics jobs to help with debugging and monitoring.

## Stream Analytics log types

Stream Analytics offers two types of logs:

* [Activity logs](/azure/azure-monitor/essentials/platform-logs-overview) (always on), which give insights into operations performed on jobs.

* [Resource logs](/azure/azure-monitor/essentials/platform-logs-overview) (configurable), which provide richer insights into everything that happens with a job. Resource logs start when the job is created and end when the job is deleted. They cover events when the job is updated and while it’s running.

> [!NOTE]
> You can use services like Azure Storage, Azure Event Hubs, and Azure Monitor logs to analyze nonconforming data. You're charged based on the pricing model for those services.

[!INCLUDE [azure-monitor-log-analytics-rebrand](~/reusable-content/ce-skilling/azure/includes/azure-monitor-log-analytics-rebrand.md)]

## Debug Stream Analytics jobs by using activity logs

Activity logs are on by default and give high-level insights into operations performed by your Stream Analytics job. Information present in activity logs might help find the root cause of the issues impacting your job. To use activity logs in Stream Analytics, follow these steps:

1. Sign in to the Azure portal and select **Activity log** under **Overview**.

   :::image type="content" source="./media/stream-analytics-job-diagnostic-logs/stream-analytics-menu.png" alt-text="Screenshot of the Activity log page for a Stream Analytics job in the Azure portal.":::

1. You can see a list of operations that have been performed. Any operation that caused your job to fail has a red info bubble.

1. Select an operation to see its summary view. Information here is often limited. To learn more details about the operation, select **JSON**.

   :::image type="content" source="./media/stream-analytics-job-diagnostic-logs/operation-summary.png" alt-text="Screenshot of the operation summary view in the Activity log for a Stream Analytics job.":::

1. Scroll down to the **Properties** section of the JSON, which provides details of the error that caused the failed operation. In this example, the failure was due to a runtime error from out-of-bound latitude values. A discrepancy in data that a Stream Analytics job processes causes a data error. You can learn about different [input and output data errors and why they occur](./data-errors.md).

   :::image type="content" source="./media/stream-analytics-job-diagnostic-logs/error-details.png" alt-text="Screenshot of the JSON Properties section that shows error details for a failed operation.":::

1. Take corrective actions based on the error message in JSON. In this example, add checks to ensure the latitude value is between -90 degrees and 90 degrees.

1. If the error message in the Activity logs isn't helpful in identifying the root cause, enable resource logs and use Azure Monitor logs.

## Send Stream Analytics diagnostics to Azure Monitor logs

Turn on resource logs and send them to Azure Monitor logs. Resource logs are **off** by default.

1.  Create a Log Analytics workspace if you don't already have one. Place your Log Analytics workspace in the same region as your Stream Analytics job.

1.  Sign in to the Azure portal, and navigate to your Stream Analytics job. Under **Monitoring**, select **Diagnostics logs**. Then select **Turn on diagnostics**.

    :::image type="content" source="./media/stream-analytics-job-diagnostic-logs/diagnostic-logs-monitoring.png" alt-text="Screenshot that shows the navigation to resource logs.":::

1.  Provide a **Name** in **Diagnostic settings name** and check the boxes for **Execution** and **Authoring** under **log**, and **AllMetrics** under **metric**. Then select **Send to Log Analytics** and choose your workspace. Select **Save**.

    :::image type="content" source="./media/stream-analytics-job-diagnostic-logs/logs-setup.png" alt-text="Screenshot of the diagnostic settings page for configuring resource logs in a Stream Analytics job.":::

1. When your Stream Analytics job starts, resource logs are routed to your Log Analytics workspace. To view resource logs for your job, select **Logs** under the **Monitoring** section.

   :::image type="content" source="./media/stream-analytics-job-diagnostic-logs/diagnostic-logs.png" alt-text="Screenshot that shows the General menu with Logs selected.":::

1. Stream Analytics provides predefined queries that allow you to easily search for the logs that you're interested in. You can select any predefined queries on the left pane and then select **Run**. You'll see the results of the query in the bottom pane. 

   :::image type="content" source="./media/stream-analytics-job-diagnostic-logs/logs-example.png" alt-text="Screenshot that shows the Logs page for a Stream Analytics job.":::

## Stream Analytics resource log categories

[!INCLUDE [resource-logs](./includes/resource-logs.md)]

All logs are stored in JSON format. To learn about the schema for resource logs, see [Resource logs schema](monitor-azure-stream-analytics-reference.md#resource-logs-schema).

## Next steps

* [Stream Analytics data errors](./data-errors.md)
* [Stream Analytics query language reference](/stream-analytics-query/stream-analytics-query-language-reference)
