---
title: Monitor Azure Files by creating alerts
description: Learn how to use Azure Monitor to create alerts on metrics and logs for Azure Files. Monitor throttling, capacity, and egress. Create an alert on high server latency.
author: khdownie
services: storage
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 05/08/2024
ms.author: kendownie
ms.custom: monitoring
---

# Create monitoring alerts for Azure Files

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. You can set alerts on [metrics](/azure/azure-monitor/alerts/alerts-metric-overview), [logs](/azure/azure-monitor/alerts/alerts-unified-log), and the [activity log](/azure/azure-monitor/alerts/activity-log-alerts). 

This article shows you how to create alerts on throttling, capacity, egress, and high server latency. To learn more about creating alerts, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

For more information about alert types and alerts, see [Monitor Azure Files](storage-files-monitoring.md#alerts).

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Metrics to use for alerts

The following table lists some example scenarios to monitor and the proper metric to use for the alert:

> [!TIP]  
> If you create an alert and it's too noisy, adjust the threshold value and alert logic.

| Scenario | Metric to use for alert |
|-|-|
| File share is throttled. | Metric: Transactions<br>Dimension name: Response type <br>Dimension name: FileShare (premium file share only) |
| File share size is 80% of capacity. | Metric: File Capacity<br>Dimension name: FileShare (premium file share only) |
| File share egress has exceeded 500 GiB in one day. | Metric: Egress<br>Dimension name: FileShare (premium file share only) |
| File share availability is less than 99.9%. | Metric: Availability<br>Dimension name: FileShare (premium file share only) |

## How to create an alert if a file share is throttled

To create an alert that will notify you if a file share is being throttled, follow these steps.

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

2. In the **Scope** tab, select the **Select Scope** dialog box.

3. In the **Select a resource** blade, expand the **storage account** and check the **file** resource and press apply.

4. In the **Condition** tab, select the **Transactions** metric.

5. In the **Dimension name** drop-down list, select **Response type**. 

6. In the **Dimension values** drop-down list, select the appropriate response types for your file share.

    For standard file shares, select the following response types:

    - `SuccessWithShareIopsThrottling`
    - `SuccessWithThrottling`
    - `ClientShareIopsThrottlingError`

    For premium file shares, select the following response types:

    - `SuccessWithShareEgressThrottling`
    - `SuccessWithShareIngressThrottling`
    - `SuccessWithShareIopsThrottling`
    - `ClientShareEgressThrottlingError`
    - `ClientShareIngressThrottlingError`
    - `ClientShareIopsThrottlingError`

   > [!NOTE]
   > If the response types aren't listed in the **Dimension values** drop-down, this means the resource hasn't been throttled. To add the dimension values, next to the **Dimension values** drop-down list, select **Add custom value**, enter the response type (for example, **SuccessWithThrottling**), select **OK**, and then repeat these steps to add all applicable response types for your file share.

5. For **premium file shares**, select the **Dimension name** drop-down and select **File Share**. For **standard file shares**, skip to step 7.

   > [!NOTE]
   > If the file share is a standard file share, the **File Share** dimension won't list the file share(s) because per-share metrics aren't available for standard file shares. Throttling alerts for standard file shares will be triggered if any file share within the storage account is throttled, and the alert won't identify which file share was throttled. Because per-share metrics aren't available for standard file shares, the recommendation is to have one file share per storage account.

6. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.

7. Define the alert parameters (threshold value, operator, lookback period, and frequency of evaluation). 

    > [!TIP]
    > If you're using a static threshold, the metric chart can help determine a reasonable threshold value if the file share is currently being throttled. If you're using a dynamic threshold, the metric chart will display the calculated thresholds based on recent data.

8. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.

9. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity. 

10. Select **Review + create** to create the alert.

## How to create an alert if the Azure file share size is 80% of capacity

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

2. In the **Scope** tab, select the **Select Scope** dialog box.

3. In the **Select a resource** blade, expand the **storage account** and check the **file** resource and press apply.

4. In the **Condition** tab of the **Create an alert rule** dialog box, select the **File Capacity** metric.

5. For **premium file shares**, select the **Dimension name** drop-down list, and then select **File Share**. For **standard file shares**, skip to step 5.

   > [!NOTE]
   > If the file share is a standard file share, the **File Share** dimension won't list the file share(s) because per-share metrics aren't available for standard file shares. Alerts for standard file shares are based on all file shares in the storage account. Because per-share metrics aren't available for standard file shares, the recommendation is to have one file share per storage account.

6. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.

7. Enter the **Threshold value** in bytes. For example, if the file share size is 100 TiB and you want to receive an alert when the file share size is 80% of capacity, the threshold value in bytes is 87960930222080.

8. Define the alert parameters (threshold value, operator, lookback period, and frequency of evaluation).

9. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.

10. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity. 

11. Select **Review + create** to create the alert.

## How to create an alert if the Azure file share egress has exceeded 500 GiB in a day

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

2. In the **Scope** tab, select the **Select Scope** dialog box.

3. In the **Select a resource** blade, expand the **storage account** and check the **file** resource and press apply.

4. In the **Condition** tab of the **Create an alert rule** dialog box, select the **Egress** metric.

5. For **premium file shares**, select the **Dimension name** drop-down list and select **File Share**. For **standard file shares**, skip to step 5.

   > [!NOTE]
   > If the file share is a standard file share, the **File Share** dimension won't list the file share(s) because per-share metrics aren't available for standard file shares. Alerts for standard file shares are based on all file shares in the storage account. Because per-share metrics aren't available for standard file shares, the recommendation is to have one file share per storage account.

4. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.

5. Enter **536870912000** bytes for Threshold value. 

6. From the **Check every** drop-down list, select the frequency of evaluation.

7. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.

8. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity. 

9. Select **Review + create** to create the alert.

## How to create an alert for high server latency

To create an alert for high server latency (average), follow these steps.

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

2. In the **Scope** tab, select the **Select Scope** dialog box.

3. In the **Select a resource** blade, expand the **storage account** and check the **file** resource and press apply.

4. In the **Condition** tab of the **Create an alert rule** dialog box, select the **Success Server Latency** metric.

5. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.

   > [!NOTE]
   > To alert on the overall latency experience, leave **Dimension values** unchecked. To alert on the latency of specific transactions, select the API Name in the drop-down list. For example, selecting the Read and Write API names with the equal operator will only display latency for data transactions. Selecting the Read and Write API name with the not equal operator will only display latency for metadata transactions.

6. Define the **Alert Logic** by selecting either Static or Dynamic. For Static, select **Average** Aggregation, **Greater than** Operator, and Threshold value. For Dynamic, select **Average** Aggregation, **Greater than** Operator, and Threshold Sensitivity.

   > [!TIP]
   > If you're using a static threshold, the metric chart can help determine a reasonable threshold value if the file share is currently experiencing high latency. If you're using a dynamic threshold, the metric chart will display the calculated thresholds based on recent data. We recommend using the Dynamic logic with Medium threshold sensitivity and further adjust as needed. To learn more, see [Understanding dynamic thresholds](/azure/azure-monitor/alerts/alerts-dynamic-thresholds#understand-dynamic-thresholds-charts).

7. Define the lookback period and frequency of evaluation.

8. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.

9. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity.

10. Select **Review + create** to create the alert.

## How to create an alert if the Azure file share availability is less than 99.9%

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-new-alert-rule).

2. In the **Scope** tab, select the **Select Scope** dialog box.

3. In the **Select a resource** blade, expand the **storage account** and check the **file** resource and press apply.

4. In the **Condition** tab, select the **Availability** metric.

5. In the **Alert logic** section, provide the following:
   - **Threshold** = **Static** 
   - **Aggregation type** = **Average**
   - **Operator** = **Less than**
   - **Threshold value** enter **99.9**

6. In the **Split by dimensions** section:
   - Select the **Dimension name** drop-down and select **File Share**.
   - Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.

    > [!NOTE]
    > If the file share is a standard file share, the **File Share** dimension won't list the file share(s) because per-share metrics aren't available for standard file shares. Availability alerts for standard file shares will be at the storage account level.

7. In the **When to evaluate** section, select the following:
   - **Check every** = **5 minutes**
   - **Lookback period** = **1 hour**

8. Click **Next** to go to the **Actions** tab and add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.

9. Click **Next** to go to the **Details** tab and fill in the details of the alert such as the alert name, description, and severity.

10. Select **Review + create** to create the alert.

## Related content

- [Monitor Azure Files](storage-files-monitoring.md)
- [Azure Files monitoring data reference](storage-files-monitoring-reference.md)
- [Analyze Azure Files metrics](analyze-files-metrics.md)
- [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)
- [Azure Storage metrics migration](../common/storage-metrics-migration.md)
