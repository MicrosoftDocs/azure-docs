<properties 
	pageTitle="Receive alert notifications" 
	description="Be notified when alert rules conditions are met." 
	authors="stepsic-microsoft-com" 
	manager="ronmart" 
	editor="" 
	services="azure-portal" 
	documentationCenter="na"/>

<tags 
	ms.service="azure-portal" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="stepsic"/>

# Receive alert notifications

You can receive an alert based on monitoring metrics for, or events on, your Azure services. 

For an alert rule on a metric value, when the value of a specified metric crosses a threshold assigned, the alert rule becomes active and can send a notification. For an alert rule on events, a rule can send a notification on *every* event, or, only when a certain number of events happen.

When you create an alert rule, you can select options to send an email notification to the service administrator and co-administrators or to another administrator that you can specify. A notification email is sent when the rule becomes active, and when an alert condition is resolved.

## Create an alert rule on metrics

1. In the [portal](https://portal.azure.com/), click **Browse**, and then a resource you're interested in monitoring.

2. Click on the  **Alert rules** tile in the **Operations** lens.

3. Click the **Add alert** command.
    ![Add alert](./media/insights-receive-alert-notifications/Insights_AddAlert.png)

4. You can name your alert rule, and choose a description that will show up in the notification email.

5. When you select **Metrics** you'll choose a condition and threshold Value for the metric. This is the period of time that Azure uses to monitor and plot alert activity.
    ![Condition and threshold](./media/insights-receive-alert-notifications/Insights_ConditionAndThreshold.png)

6. You can also choose **Events**, and get a notification when a certain event happens. 
    ![Events](./media/insights-receive-alert-notifications/Insights_Events.png)

7. Finally, you can choose to send email notification to responsible administrators.

## Managing your alert rules

Once you have created an alert rule, you can view 
