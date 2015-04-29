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
	ms.date="04/25/2015" 
	ms.author="stepsic"/>

# Receive alert notifications

You can receive an alert based on monitoring metrics for, or events on, your Azure services. 

For an alert rule on a metric value, when the value of a specified metric crosses a threshold assigned, the alert rule becomes active and can send a notification. For an alert rule on events, a rule can send a notification on *every* event, or, only when a certain number of events happen.

When you create an alert rule, you can select options to send an email notification to the service administrator and co-administrators or to another administrator that you can specify. A notification email is sent when the rule becomes active, and when an alert condition is resolved.

You can use the [REST API](https://msdn.microsoft.com/library/azure/dn931945.aspx) or [.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Insights/) to configure and get information about alert rules programmatically.

## Create an alert rule

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

After you click **Save**, within a few minutes you will be informed whenever the metric you choose exceeds the threshold. 

## Managing your alert rules

Once you have created an alert rule, you can view  a preview of your alert threshold compared the metric from the previous day. 

![Events](./media/insights-receive-alert-notifications/Insights_EditAlert.png)


You can of course edit this alert rule, and **Disable** or **Enable** it if you want to temporarily stop receiving notifications about it. 

## Next steps

* [Monitor service metrics](insights-how-to-customize-monitoring.md) to make sure your service is available and responsive.
* [Enable monitoring and diagnostics](insights-how-to-use-diagnostics.md) to collect detailed high-frequency metrics on your service.
* [Monitor availability and responsiveness of any web page](app-insights-monitor-web-app-availability.md) with Application Insights so you can find out if your page is down.
* [Monitor application performance](insights-perf-analytics.md) if you want to understand exactly how your code is performing in the cloud.
* [View events and audit logs](insights-debugging-with-events.md) to learn everything that has happened in your service.
* [Track service health](insights-service-health.md) to find out when Azure has experienced performance degradation or service interruptions.
