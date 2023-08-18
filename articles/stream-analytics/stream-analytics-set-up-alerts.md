---
title: Set up monitoring alerts for Azure Stream Analytics jobs
description: This article describes how to use the Azure portal to set up monitoring and alerts for Azure Stream Analytics jobs.
author: ajetasin
ms.author: ajetasi
ms.service: stream-analytics
ms.topic: how-to
ms.custom: contperf-fy21q1
ms.date: 07/12/2022
---
# Set up alerts for Azure Stream Analytics jobs

It's important to monitor your Azure Stream Analytics job to ensure the job is running continuously without any problems. This article describes how to set up alerts for common scenarios that should be monitored. 

You can define rules on metrics from Operation Logs data through the portal, as well as [programmatically](https://code.msdn.microsoft.com/windowsazure/Receive-Email-Notifications-199e2c9a).

## Set up alerts in the Azure portal
### Get alerted when a job stops unexpectedly

The following example demonstrates how to set up alerts for when your job enters a failed state. This alert is recommended for all jobs.

1. In the Azure portal, open the Stream Analytics job you want to create an alert for.

2. On the **Job** page, navigate to the **Monitoring** section.  

3. Select **Metrics**, and then **New alert rule**.

   ![Azure portal Stream Analytics alerts setup](./media/stream-analytics-set-up-alerts/stream-analytics-set-up-alerts.png)  

4. Your Stream Analytics job name should automatically appear under **RESOURCE**. Click **Add condition**, and select **All Administrative operations** under **Configure signal logic**.

   ![Select signal name for Stream Analytics alert](./media/stream-analytics-set-up-alerts/stream-analytics-condition-signal.png)  

5. Under **Configure signal logic**, change **Event Level** to **All** and change **Status** to **Failed**. Leave **Event initiated by** blank and select **Done**.

   ![Configure signal logic for Stream Analytics alert](./media/stream-analytics-set-up-alerts/stream-analytics-configure-signal-logic.png) 

6. Select an existing action group or create a new group. In this example, a new action group called **TIDashboardGroupActions** was created with an **Emails** action that sends an email to users with the **Owner** Azure Resource Manager Role.

   ![Setting up an alert for an Azure Streaming Analytics job](./media/stream-analytics-set-up-alerts/stream-analytics-add-group-email-action.png)

7. The **RESOURCE**, **CONDITION**, and **ACTION GROUPS** should each have an entry. Note that in order for the alerts to fire, the conditions defined need to be met. For example, you can measure a metric's average value of over the last 15 minutes, every 5 minutes.

   ![Screenshot shows the Create rule dialog box with RESOURCE, CONDITION, and ACTION GROUP.](./media/stream-analytics-set-up-alerts/stream-analytics-create-alert-rule-2.png)

   Add an **Alert rule name**, **Description**, and your **Resource Group** to the **ALERT DETAILS** and click **Create alert rule** to create the rule for your Stream Analytics job.

   ![Screenshot shows the Create rule dialog box with ALERT DETAILS.](./media/stream-analytics-set-up-alerts/stream-analytics-create-alert-rule.png)

## Next steps

* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
