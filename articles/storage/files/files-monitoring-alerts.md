---
title: Monitor Azure Files by Creating Alerts
description: Learn how to use Azure Monitor to create alerts on metrics and logs for Azure Files. Monitor throttling, capacity, and egress. Create an alert on high server latency.
author: khdownie
services: storage
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 06/29/2026
ms.author: kendownie
ms.custom: monitoring
# Customer intent: As a cloud administrator, I want to create monitoring alerts for Azure Files metrics and logs, so that I can proactively identify and resolve issues before they impact users.
---

# Create monitoring alerts for Azure Files

:heavy_check_mark: **Applies to:** Classic SMB and NFS file shares created with the Microsoft.Storage resource provider

:heavy_multiplication_x: **Doesn't apply to:** File shares created with the Microsoft.FileShares resource provider

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They help you identify and address issues in your system before your customers notice them. You can set alerts on [metrics](/azure/azure-monitor/alerts/alerts-metric-overview), [logs](/azure/azure-monitor/alerts/alerts-unified-log), and the [activity log](/azure/azure-monitor/alerts/activity-log-alerts). 

This article shows you how to create alerts on throttling, capacity, egress, and high server latency. To learn more about creating alerts, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

For more information about alert types and alerts, see [Monitor Azure Files](storage-files-monitoring.md#alerts).

## Metrics to use for alerts

The following table lists some example scenarios to monitor and the proper metric to use for the alert:

> [!TIP]  
> If you create an alert and it's too noisy, adjust the threshold value and alert logic.

| Scenario | Metric to use for alert |
|-|-|
| File share is throttled. | Metric: Transactions<br>Dimension name: Response type <br>Dimension name: File Share (provisioned file shares only) |
| File share size exceeds 80% of capacity. | Metric: Percentage File Share Utilization<br>Dimension name: File Share (provisioned file shares only) |
| File share bandwidth utilization exceeds 80%. | Metric: Percentage File Share Bandwidth Utilization<br>Dimension  name: File Share (provisioned file shares only) |
| File share IOPS utilization exceeds 80%. | Metric: Percentage File Share IOPS Utilization<br>Dimension name: File  Share (provisioned file shares only) |
| File share egress exceeds 500 GiB in one day. | Metric: Egress<br>Dimension name: File Share (provisioned file shares only) |
| File share availability is less than 99.9%. | Metric: Availability<br>Dimension name: File Share (provisioned file shares only) |

## How to create an alert if a file share is throttled

To create an alert that notifies you if a file share is throttled, follow these steps:

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

1. In the **Scope** tab, select the **Select Scope** dialog box.

1. In the **Select a resource** pane, expand the storage account, check the **file** resource, and select **Apply**.

1. In the **Condition** tab, select the **Transactions** metric.

1. In the **Dimension name** drop-down list, select **Response type**. 

1. In the **Dimension values** drop-down list, select the appropriate response types for your file share.

   For pay-as-you-go file shares, select the following response types:

   - `SuccessWithShareIopsThrottling`
   - `SuccessWithThrottling`
   - `ClientShareIopsThrottlingError`

   For provisioned file shares, select the following response types:

   - `SuccessWithShareEgressThrottling`
   - `SuccessWithShareIngressThrottling`
   - `SuccessWithShareIopsThrottling`
   - `ClientShareEgressThrottlingError`
   - `ClientShareIngressThrottlingError`
   - `ClientShareIopsThrottlingError`

   > [!NOTE]
   > If the response types don't appear in the **Dimension values** drop-down, the resource isn't throttled. To add the dimension values, next to the **Dimension values** drop-down, select **Add custom value**, enter the response type (for example, **SuccessWithThrottling**), select **OK**, and then repeat these steps to add all applicable response types for your file share.

1. For **provisioned file shares**, select the **Dimension name** drop-down and select **File Share**. For **pay-as-you-go file shares**, skip to the next step.

   > [!NOTE]
   > If the file share is a pay-as-you-go file share, the **File Share** dimension doesn't list the file shares because per share metrics aren't available for pay-as-you-go file shares. Throttling alerts for pay-as-you-go file shares trigger if any file share within the storage account is throttled, and the alert doesn't identify which file share was throttled. Because per share metrics aren't available for pay-as-you-go file shares, use the provisioned v2 model instead of the pay-as-you-go model.

1. Select the **Dimension values** drop-down and select the file shares that you want to alert on.

1. Define the alert parameters (threshold value, operator, lookback period, and frequency of evaluation). If you're using a static threshold, the metric chart can help determine a reasonable threshold value if the file share is currently being throttled. If you're using a dynamic threshold, the metric chart displays the calculated thresholds based on recent data.

1. Select the **Actions** tab to add an action group (email, SMS, and so on) to the alert. You can select an existing action group or create a new action group.

1. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity.

1. Select **Review + create**, and then select **Create** to create the alert.

## How to create an alert if the file share size exceeds 80% of capacity

Follow these steps to create an alert if the file share size exceeds 80% of provisioned capacity.

1. Go to the storage account that contains the file shares you want to alert on.

1. From the service menu, select **Monitoring** > **Metrics**, and then select **+ Add metric**.

1. Under **Metric Namespace**, select **File**. Under **Metric**, select **Percentage File Share Utilization**. You can either view the average utilization for the storage account, or select **Apply splitting** to view the metric for individual file shares.

1. Select **New alert rule**. On the **Condition** tab of the **Create an alert rule** dialog box, under **Signal name**, you see **Percentage File Share Utilization**.

1. Under **Alert logic**, enter the **Threshold** value as a percentage. For example, if you want to receive an alert when the file share size exceeds 80% of capacity, enter a threshold value of 80, and under **Value is**, select **Greater than**.

1. For provisioned file shares, select the **Dimension name** drop-down list, and then select **File Share**. For pay-as-you-go file shares, skip to the next step.

   > [!NOTE]
   > If the file share is a pay-as-you-go file share, the **File Share** dimension doesn't list the file shares because per share metrics aren't available for pay-as-you-go file shares. Throttling alerts for pay-as-you-go file shares trigger if any file share within the storage account is throttled, and the alert doesn't identify which file share was throttled. If you want per share metrics, use the provisioned v2 model instead of the pay-as-you-go model.

1. Select the **Dimension values** drop-down and select the file shares that you want to alert on.

1. Under **When to evaluate**, specify the desired evaluation frequency and lookback period.

1. Select the **Details** tab and provide a name for the alert rule as well as a severity level and optional description.

1. Optional: Select the **Actions** tab to add an action group (email, SMS, and so on) to the alert. Select an existing action group or create a new action group.

1. Select **Review + create**, then select **Create** to create the alert.

## How to create an alert if the file share bandwidth utilization exceeds 80%

Follow these steps to create an alert if the file share bandwidth utilization exceeds 80% of provisioned bandwidth.

1. Go to the storage account that contains the file shares you want to alert on.

1. From the service menu, select **Monitoring** > **Metrics**, and then select **+ Add metric**.

1. Under **Metric Namespace**, select **File**. Under **Metric**, select **Percentage File Share Bandwidth Utilization**. You can either view the average utilization for the storage account, or select **Apply splitting** to view the metric for individual file shares. Leave **Aggregation** set to **Avg** unless you want to catch brief peaks that push the share to its limit, in which case you should set **Aggregation** to **Max**.

1. Select **New alert rule**. On the **Condition** tab of the **Create an alert rule** dialog box, under **Signal name**, you see **Percentage File Share Bandwidth Utilization**.

1. Under **Alert logic**, enter the **Threshold** value as a percentage. For example, if you want to receive an alert when the file share consistently uses more than 80% of its provisioned bandwidth, enter a threshold value of 80, and under **Value is**, select **Greater than**.

1. For provisioned file shares, select the **Dimension name** drop-down list, and then select **File Share**. For pay-as-you-go file shares, skip to the next step.

    > [!NOTE]
    > If the file share is a pay-as-you-go file share, the **File Share** dimension doesn't list the file shares because per share metrics aren't available for pay-as-you-go file shares. If you want per share metrics, use the  provisioned v2 model instead of the pay-as-you-go model.

1. Select the **Dimension values** drop-down and select the provisioned file shares that you want to alert on. The drop-down only lists file shares that have recent activity for this metric. Because **Percentage File Share Bandwidth Utilization** is calculated from underlying usage metrics, a share that hasn't recently consumed bandwidth doesn't emit data points and won't appear in the list. If an expected file share is missing, do the following:
   - Confirm the share has had recent traffic, or generate some I/O against it, then wait a few minutes and reopen the drop-down.
   - Widen the metric time range (for example, the last hour instead of the last few minutes) so that it includes a period when the share was active.

1. Under **When to evaluate**, specify the desired evaluation frequency and lookback period. Because bandwidth usage is often bursty, consider using a longer lookback period (for example, 15 to 30 minutes) so that brief, expected spikes don't trigger the alert.

1. Select the **Details** tab and provide a name for the alert rule as well as a severity level and optional description.

1. Optional: Select the **Actions** tab to add an action group (email, SMS, and so on) to the alert. Select an existing action group or create a new action group.

1. Select **Review + create**, then select **Create** to create the alert.

## How to create an alert if the file share IOPS utilization exceeds 80%

Follow these steps to create an alert if the file share IOPS utilization exceeds 80% of provisioned IOPS.

1. Go to the storage account that contains the file shares you want to alert on.

1. From the service menu, select **Monitoring** > **Metrics**, and then select **+ Add metric**.

1. Under **Metric Namespace**, select **File**. Under **Metric**, select **Percentage File Share IOPS  Utilization**. You can either view the average utilization for the storage account, or select **Apply splitting** to view the metric for individual file shares. Leave **Aggregation** set to **Avg** unless you want to catch brief peaks that push the share to its limit, in which case you should set **Aggregation** to **Max**.

1. Select **New alert rule**. On the **Condition** tab of the **Create an alert rule** dialog box, under **Signal name**, you see **Percentage File Share IOPS Utilization**.

1. Under **Alert logic**, enter the **Threshold** value as a percentage. For example, if you want to receive an alert when the file share consistently uses more than 80% of its provisioned IOPS, enter a threshold value of 80, and under **Value is**, select **Greater than**.

1. For provisioned file shares, select the **Dimension name** drop-down list, and then select **File Share**. For pay-as-you-go file shares, skip to the next step.

    > [!NOTE]
    > If the file share is a pay-as-you-go file share, the **File Share** dimension doesn't list the file shares  because per share metrics aren't available for pay-as-you-go file shares. If you want per share metrics, use the  provisioned v2 model instead of the pay-as-you-go model.

1. Select the **Dimension values** drop-down and select the provisioned file shares that you want to alert on. The drop-down only lists file shares that have recent activity for this metric. Because **Percentage File Share IOPS Utilization** is calculated from underlying usage metrics, a share that hasn't recently consumed IOPS doesn't emit data points and won't appear in the list. If an expected file share is missing, do the following:
   - Confirm the share has had recent traffic, or generate some I/O against it, then wait a few minutes and reopen the drop-down.
   - Widen the metric time range (for example, the last hour instead of the last few minutes) so that it includes a period when the share was active.

1. Under **When to evaluate**, specify the desired evaluation frequency and lookback period. Because IOPS usage is often bursty, consider using a longer lookback period (for example, 15 to 30 minutes) so that brief, expected  spikes don't trigger the alert.

1. Select the **Details** tab and provide a name for the alert rule as well as a severity level and optional description.

1. Optional: Select the **Actions** tab to add an action group (email, SMS, and so on) to the alert. Select an existing action group or create a new action group.

1. Select **Review + create**, then select **Create** to create the alert.

## How to create an alert if the file share egress exceeds 500 GiB in a day

Follow these steps to create an alert if the file share egress exceeds 500 GiB in a day.

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

1. In the **Scope** tab, select the **Select Scope** dialog box.

1. In the **Select a resource** pane, expand the storage account, check the **file** resource, and select **Apply**.

1. In the **Condition** tab of the **Create an alert rule** dialog box, select the **Egress** metric.

1. For **provisioned file shares**, select the **Dimension name** drop-down list and select **File Share**. For **pay-as-you-go file shares**, skip to the next step.

   > [!NOTE]
   > If the file share is a pay-as-you-go file share, the **File Share** dimension doesn't list the file shares because per share metrics aren't available for pay-as-you-go file shares. Throttling alerts for pay-as-you-go file shares trigger if any file share within the storage account is throttled, and the alert doesn't identify which file share was throttled. Because per share metrics aren't available for pay-as-you-go file shares, use the provisioned v2 model instead of the pay-as-you-go model.

1. Select the **Dimension values** drop-down and select the file shares that you want to alert on.

1. Enter **536870912000** bytes for Threshold value. 

1. From the **Check every** drop-down list, select the frequency of evaluation.

1. Select the **Actions** tab to add an action group (email, SMS, and so on) to the alert. You can select an existing action group or create a new action group.

1. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity.

1. Select **Review + create**, and then select **Create** to create the alert.

## How to create an alert for high server latency

To create an alert for high server latency (average), follow these steps.

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

1. In the **Scope** tab, select the **Select Scope** dialog box.

1. In the **Select a resource** pane, expand the storage account, check the **file** resource, and select **Apply**.

1. In the **Condition** tab of the **Create an alert rule** dialog box, select the **Success Server Latency** metric.

1. Select the **Dimension values** drop-down and select the file shares that you want to alert on.

   > [!NOTE]
   > To alert on the overall latency experience, leave **Dimension values** unchecked. To alert on the latency of specific transactions, select the API Name in the drop-down list. For example, selecting the Read and Write API names with the equal operator only displays latency for data transactions. Selecting the Read and Write API name with the not equal operator only displays latency for metadata transactions.

1. Define the **Alert Logic** by selecting either Static or Dynamic. For Static, select **Average** Aggregation, **Greater than** Operator, and Threshold value. For Dynamic, select **Average** Aggregation, **Greater than** Operator, and Threshold Sensitivity. If you're using a static threshold, the metric chart can help determine a reasonable threshold value if the file share is currently experiencing high latency. If you're using a dynamic threshold, the metric chart displays the calculated thresholds based on recent data. Use the Dynamic logic with Medium threshold sensitivity and adjust as needed. To learn more, see [Understanding dynamic thresholds](/azure/azure-monitor/alerts/alerts-dynamic-thresholds#understand-dynamic-thresholds-charts).

1. Define the lookback period and frequency of evaluation.

1. Select the **Actions** tab to add an action group (email, SMS, and so on) to the alert. Select an existing action group or create a new action group.

1. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity.

1. Select **Review + create**, and then select **Create** to create the alert.

## How to create an alert if the file share availability is less than 99.9%

Follow these steps to create an alert if the file share availability is less than 99.9%.

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

1. In the **Scope** tab, select the **Select Scope** dialog box.

1. In the **Select a resource** pane, expand the **storage account**, check the **file** resource, and select **Apply**.

1. In the **Condition** tab, select the **Availability** metric.

1. In the **Alert logic** section, enter the following values:
   - **Threshold** = **Static** 
   - **Aggregation type** = **Average**
   - **Operator** = **Less than**
   - **Threshold value** = **99.9**

1. In the **Split by dimensions** section:
   - Select the **Dimension name** drop-down and select **File Share**.
   - Select the **Dimension values** drop-down and select the file shares that you want to alert on.

   > [!NOTE]
   > If the file share is a pay-as-you-go file share, the **File Share** dimension doesn't list the file shares because per share metrics aren't available for pay-as-you-go file shares. Availability alerts for pay-as-you-go file shares are at the storage account level. If possible, use the provisioned v2 model instead of the pay-as-you-go model.

1. In the **When to evaluate** section, select the following values:
   - **Check every** = **5 minutes**
   - **Lookback period** = **1 hour**

1. Select **Next** to go to the **Actions** tab and add an action group (email, SMS, and so on) to the alert. Select an existing action group or create a new action group.

1. Select **Next** to go to the **Details** tab and fill in the details of the alert such as the alert name, description, and severity.

1. Select **Review + create**, and then select **Create** to create the alert.

## Related content

- [Monitor Azure Files](storage-files-monitoring.md)
- [Azure Files monitoring data reference](storage-files-monitoring-reference.md)
- [Analyze Azure Files metrics](analyze-files-metrics.md)
- [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)
- [Azure Storage metrics migration](../common/storage-metrics-migration.md)
