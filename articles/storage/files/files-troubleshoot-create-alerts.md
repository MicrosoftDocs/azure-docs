---
title: Azure Files performance troubleshooting - creating alerts
description: Troubleshoot performance issues with SMB Azure file shares by receiving alerts if a share is being throttled or is about to be throttled.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 02/23/2023
ms.author: kendownie
ms.subservice: files
#Customer intent: As a system admin, I want to troubleshoot performance issues with Azure file shares to improve performance for applications and users.
---
# Troubleshoot Azure Files by creating alerts

This article explains how to create and receive alerts if an Azure file share is being throttled or is about to be throttled. Requests are throttled when the I/O operations per second (IOPS), ingress, or egress limits for a file share are reached.

> [!IMPORTANT]
> For standard storage accounts with large file shares (LFS) enabled, throttling occurs at the account level. For premium files shares and standard file shares without LFS enabled, throttling occurs at the share level.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Create an alert if a file share is being throttled

1. Go to your **storage account** in the **Azure portal**.
2. In the **Monitoring** section, click **Alerts**, and then click **+ New alert rule**.
3. Click **Edit resource**, select the **File resource type** for the storage account and then click **Done**. For example, if the storage account name is `contoso`, select the `contoso/file` resource.
4. Click **Add condition** to add a condition.
5. You'll see a list of signals supported for the storage account, select the **Transactions** metric.
6. On the **Configure signal logic** blade, click the **Dimension name** drop-down and select **Response type**.
7. Click the **Dimension values** drop-down and select the appropriate response types for your file share.

    For standard file shares that don't have large file shares enabled, select the following response types (requests are throttled at the share level):

    - SuccessWithThrottling
    - SuccessWithShareIopsThrottling
    - ClientShareIopsThrottlingError

    For standard file shares that have large file shares enabled, select the following response types (requests are throttled at the storage account level):

    - ClientAccountRequestThrottlingError
    - ClientAccountBandwidthThrottlingError

    For premium file shares, select the following response types (requests are throttled at the share level):

    - SuccessWithShareEgressThrottling
    - SuccessWithShareIngressThrottling
    - SuccessWithShareIopsThrottling
    - ClientShareEgressThrottlingError
    - ClientShareIngressThrottlingError
    - ClientShareIopsThrottlingError

   > [!NOTE]
   > If the response types aren't listed in the **Dimension values** drop-down, this means the resource hasn't been throttled. To add the dimension values, next to the **Dimension values** drop-down list, select **Add custom value**, enter the response type (for example, **SuccessWithThrottling**), select **OK**, and then repeat these steps to add all applicable response types for your file share.

8. For **premium file shares**, click the **Dimension name** drop-down and select **File Share**. For **standard file shares**, skip to **step #10**.

   > [!NOTE]
   > If the file share is a standard file share, the **File Share** dimension won't list the file share(s) because per-share metrics aren't available for standard file shares. Throttling alerts for standard file shares will be triggered if any file share within the storage account is throttled, and the alert won't identify which file share was throttled. Because per-share metrics aren't available for standard file shares, we recommend having only one file share per storage account.

9. Select the **Dimension values** drop-down and select the file share(s) that you want to alert on.
10. Define the **alert parameters** (threshold value, operator, aggregation granularity and frequency of evaluation) and select **Done**.

    > [!TIP]
    > If you're using a static threshold, the metric chart can help determine a reasonable threshold value if the file share is currently being throttled. If you're using a dynamic threshold, the metric chart will display the calculated thresholds based on recent data.

11. Select **Add action groups** to add an **action group** (email, SMS, etc.) to the alert either by selecting an existing action group or creating a new action group.
12. Fill in the **Alert details** like **Alert rule name**, **Description**, and **Severity**.
13. Select **Create alert rule** to create the alert.

## Create alert if a premium file share is close to being throttled

1. In the Azure portal, go to your storage account.
2. In the **Monitoring** section, select **Alerts**, and then select **New alert rule**.
3. Select **Edit resource**, select the **File resource type** for the storage account, and then select **Done**. For example, if the storage account name is *contoso*, select the contoso/file resource.
4. Select **Select Condition** to add a condition.
5. In the list of signals that are supported for the storage account, select the **Egress** metric.

   > [!NOTE]
   > You have to create three separate alerts to be alerted when the ingress, egress, or transaction values exceed the thresholds you set. This is because an alert is triggered only when all conditions are met. For example, if you put all the conditions in one alert, you would be alerted only if ingress, egress, and transactions exceed their threshold amounts.

6. Scroll down. In the **Dimension name** drop-down list, select **File Share**.
7. In the **Dimension values** drop-down list, select the file share or shares that you want to alert on.
8. Define the alert parameters by selecting values in the **Operator**, **Threshold value**, **Aggregation granularity**, and **Frequency of evaluation** drop-down lists, and then select **Done**.

   Egress, ingress, and transactions metrics are expressed per minute, though you're provisioned egress, ingress, and I/O per second. Therefore, for example, if your provisioned egress is 90&nbsp; MiB/s and you want your threshold to be 80&nbsp;percent of provisioned egress, select the following alert parameters: 
   - For **Threshold value**: *75497472* 
   - For **Operator**: *greater than or equal to*
   - For **Aggregation type**: *average*
   
   Depending on how noisy you want your alert to be, you can also select values for **Aggregation granularity** and **Frequency of evaluation**. For example, if you want your alert to look at the average ingress over the time period of 1 hour, and you want your alert rule to be run every hour, select the following:
   - For **Aggregation granularity**: *1 hour*
   - For **Frequency of evaluation**: *1 hour*

9. Select **Add action groups**, and then add an action group (for example, email or SMS) to the alert either by selecting an existing action group or by creating a new one.
10. Enter the alert details, such as **Alert rule name**, **Description**, and **Severity**.
11. Select **Create alert rule** to create the alert.

    > [!NOTE]
    > - To be notified that your premium file share is close to being throttled *because of provisioned ingress*, follow the preceding instructions, but with the following change:
    >    - In step 5, select the **Ingress** metric instead of **Egress**.
    >
    > - To be notified that your premium file share is close to being throttled *because of provisioned IOPS*, follow the preceding instructions, but with the following changes:
    >    - In step 5, select the **Transactions** metric instead of **Egress**.
    >    - In step 10, the only option for **Aggregation type** is *Total*. Therefore, the threshold value depends on your selected aggregation granularity. For example, if you want your threshold to be 80&nbsp;percent of provisioned baseline IOPS and you select *1 hour* for **Aggregation granularity**, your **Threshold value** would be your baseline IOPS (in bytes) &times;&nbsp;0.8 &times;&nbsp;3600. 

## See also
- [Troubleshoot Azure Files](files-troubleshoot.md)
- [Troubleshoot Azure Files Performance](files-troubleshoot-performance.md)
- [Understand Azure Files performance](understand-performance.md)
- [Overview of alerts in Microsoft Azure](../../azure-monitor/alerts/alerts-overview.md)

