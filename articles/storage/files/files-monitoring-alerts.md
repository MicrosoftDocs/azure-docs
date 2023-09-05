---
title: Monitoring Azure Files - Create alerts
description: Use Azure Monitor to create alerts on throttling, capacity, and egress. Learn how to create an alert on high server latency.
author: khdownie
services: storage
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 09/05/2023
ms.author: kendownie
ms.custom: monitoring
---

# Monitoring Azure Files - Create alerts

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. You can set alerts on [metrics](../../azure-monitor/alerts/alerts-metric-overview.md), [logs](../../azure-monitor/alerts/alerts-unified-log.md), and the [activity log](../../azure-monitor/alerts/activity-log-alerts.md). 

To learn more about how to create an alert, see [Create or edit an alert rule](../../azure-monitor/alerts/alerts-create-new-alert-rule.md).

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

## How to create an alert if a file share is throttled

To create an alert that will notify you if a file share is being throttled, follow these steps.

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](../../azure-monitor/alerts/alerts-create-new-alert-rule.md).

2. In the **Condition** tab, select the **Transactions** metric.

3. In the **Dimension name** drop-down list, select **Response type**. 

4. In the **Dimension values** drop-down list, select the appropriate response types for your file share.

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
   > If the file share is a standard file share, the **File Share** dimension won't list the file share(s) because per-share metrics aren't available for standard file shares. Throttling alerts for standard file shares will be triggered if any file share within the storage account is throttled, and the alert will not identify which file share was throttled. Since per-share metrics aren't available for standard file shares, the recommendation is to have one file share per storage account.

6. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.

7. Define the alert parameters (threshold value, operator, lookback period, and frequency of evaluation). 

    > [!TIP]
    > If you are using a static threshold, the metric chart can help determine a reasonable threshold value if the file share is currently being throttled. If you're using a dynamic threshold, the metric chart will display the calculated thresholds based on recent data.

8. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.

9. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity. 

10. Select **Review + create** to create the alert.

## How to create an alert if the Azure file share size is 80% of capacity

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](../../azure-monitor/alerts/alerts-create-new-alert-rule.md).

2. In the **Condition** tab of the **Create an alert rule** dialog box, select the **File Capacity** metric.

3. For **premium file shares**, select the **Dimension name** drop-down list, and then select **File Share**. For **standard file shares**, skip to step 5.

   > [!NOTE]
   > If the file share is a standard file share, the **File Share** dimension will not list the file share(s) because per-share metrics are not available for standard file shares. Alerts for standard file shares are based on all file shares in the storage account. Since per-share metrics are not available for standard file shares, the recommendation is to have one file share per storage account.

4. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.

5. Enter the **Threshold value** in bytes. For example, if the file share size is 100 TiB and you want to receive an alert when the file share size is 80% of capacity, the threshold value in bytes is 87960930222080.

6. Define the alert parameters (threshold value, operator, lookback period, and frequency of evaluation).

7. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.

8. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity. 

9. Select **Review + create** to create the alert.

## How to create an alert if the Azure file share egress has exceeded 500 GiB in a day

1. Open the **Create an alert rule** dialog box. For more information, see [Create or edit an alert rule](../../azure-monitor/alerts/alerts-create-new-alert-rule.md).

2. In the **Condition** tab of the **Create an alert rule** dialog box, select the **Egress** metric.

3. For **premium file shares**, select the **Dimension name** drop-down list and select **File Share**. For **standard file shares**, skip to step 5.

   > [!NOTE]
   > If the file share is a standard file share, the **File Share** dimension will not list the file share(s) because per-share metrics aren't available for standard file shares. Alerts for standard file shares are based on all file shares in the storage account. Since per-share metrics aren't available for standard file shares, the recommendation is to have one file share per storage account.

4. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.

5. Enter **536870912000** bytes for Threshold value. 

6. From the **Check every** drop-down list, select the frequency of evaluation.

7. Select the **Actions** tab to add an action group (email, SMS, etc.) to the alert. You can select an existing action group or create a new action group.

8. Select the **Details** tab to fill in the details of the alert such as the alert name, description, and severity. 

9. Select **Review + create** to create the alert.

## Next steps

- [Azure Files monitoring data reference](storage-files-monitoring-reference.md)
- [Monitor Azure resources with Azure Monitor](../../azure-monitor/essentials/monitor-azure-resource.md)
- [Azure Storage metrics migration](../common/storage-metrics-migration.md)
