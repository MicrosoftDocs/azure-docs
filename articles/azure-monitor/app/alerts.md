---
title: Set Alerts in Azure Application Insights | Microsoft Docs
description: Get notified about slow response times, exceptions, and other performance or usage changes in your web app.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.reviewer: lagayhar
ms.assetid: f8ebde72-f819-4ba5-afa2-31dbd49509a5
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 01/23/2019
ms.author: mbullwin

---
# Set Alerts in Application Insights
[Azure Application Insights][start] can alert you to changes in performance or usage metrics in your web app. 

Application Insights monitors your live app on a [wide variety of platforms][platforms] to help you diagnose performance issues and understand usage patterns.

There are multiple types of alerts:

* [**Metric alerts**](../../azure-monitor/platform/alerts-metric-overview.md) tell you when a metric crosses a threshold value for some period - such as response times, exception counts, CPU usage, or page views.
* [**Log Alerts**](../../azure-monitor/platform/alerts-unified-log.md) is used to describe alerts where the alert signal is based on a custom Kusto query.
* [**Web tests**][availability] tell you when your site is unavailable on the internet, or responding slowly. [Learn more][availability].
* [**Proactive diagnostics**](../../azure-monitor/app/proactive-diagnostics.md) are configured automatically to notify you about unusual performance patterns.

## Set a Metric alert
Open the Alert rules tab, and then use the add button.

![In the Alert rules tab, choose Add Alert. Set your app as the resource to measure, provide a name for the alert, and choose a metric.](./media/alerts/01-set-metric.png)

* Set the resource before the other properties. **Choose the "(components)" resource** if you want to set alerts on performance or usage metrics.
* The name that you give to the alert must be unique within the resource group (not just your application).
* Be careful to note the units in which you're asked to enter the threshold value.
* If you check the box "Email owners...", alerts are sent by email to everyone who has access to this resource group. To expand this set of people, add them to the [resource group or subscription](../../azure-monitor/app/resources-roles-access-control.md) (not the resource).
* If you specify "Additional emails", alerts are sent to those individuals or groups (whether or not you checked the "email owners..." box). 
* Set a [webhook address](../../azure-monitor/platform/alerts-webhooks.md) if you have set up a web app that responds to alerts. It is called both when the alert is Activated and when it is Resolved. (But note that at present, query parameters are not passed through as webhook properties.)
* You can Disable or Enable the alert: see the buttons at the top.

*I don't see the Add Alert button.*

* Are you using an organizational account? You can set alerts if you have owner or contributor access to this application resource. Take a look at the Access Control tab. [Learn about access control][roles].

> [!NOTE]
> In the alerts blade, you see that there's already an alert set up: [Proactive Diagnostics](../../azure-monitor/app/proactive-failure-diagnostics.md). The automatic alert monitors one particular metric, request failure rate. Unless you decide to disable the proactive alert, you don't need to set your own alert on request failure rate.
> 
> 

## See your alerts
You get an email when an alert changes state between inactive and active. 

The current state of each alert is shown in the Alert rules tab.

There's a summary of recent activity in the alerts drop-down:

![Alerts drop-down](./media/alerts/010-alert-drop.png)

The history of state changes is in the Activity Log:

![On the Overview tab, click Settings, Audit logs](./media/alerts/09-alerts.png)

## How alerts work
* An alert has three states: "Never activated", "Activated", and "Resolved." Activated means the condition you specified was true, when it was last evaluated.
* A notification is generated when an alert changes state. (If the alert condition was already true when you created the alert, you might not get a notification until the condition goes false.)
* Each notification generates an email if you checked the emails box, or provided email addresses. You can also look at the Notifications drop-down list.
* An alert is evaluated each time a metric arrives, but not otherwise.
* The evaluation aggregates the metric over the preceding period, and then compares it to the threshold to determine the new state.
* The period that you choose specifies the interval over which metrics are aggregated. It doesn't affect how often the alert is evaluated: that depends on the frequency of arrival of metrics.
* If no data arrives for a particular metric for some time, the gap has different effects on alert evaluation and on the charts in metric explorer. In metric explorer, if no data is seen for longer than the chart's sampling interval, the chart shows a value of 0. But an alert based on the same metric is not be reevaluated, and the alert's state remains unchanged. 
  
    When data eventually arrives, the chart jumps back to a non-zero value. The alert evaluates based on the data available for the period you specified. If the new data point is the only one available in the period, the aggregate is based just on that data point.
* An alert can flicker frequently between alert and healthy states, even if you set a long period. This can happen if the metric value hovers around the threshold. There is no hysteresis in the threshold: the transition to alert happens at the same value as the transition to healthy.

## What are good alerts to set?
It depends on your application. To start with, it's best not to set too many metrics. Spend some time looking at your metric charts while your app is running, to get a feel for how it behaves normally. This practice helps you find ways to improve its performance. Then set up alerts to tell you when the metrics go outside the normal zone. 

Popular alerts include:

* [Browser metrics][client], especially Browser **page load times**, are good for web applications. If your page has many scripts, you should look for **browser exceptions**. In order to get these metrics and alerts, you have to set up [web page monitoring][client].
* **Server response time** for the server side of web applications. As well as setting up alerts, keep an eye on this metric to see if it varies disproportionately with high request rates: variation might indicate that your app is running out of resources. 
* **Server exceptions** - to see them, you have to do some [additional setup](../../azure-monitor/app/asp-net-exceptions.md).

Don't forget that [proactive failure rate diagnostics](../../azure-monitor/app/proactive-failure-diagnostics.md) automatically monitor the rate at which your app responds to requests with failure codes.

## How to set an exception alert using custom log search

In this section, we will go through how to set a query based exception alert. For this example, let's say we want an alert when the failed rate is greater than 10% in the last 24 hours.

1. Go to your Application Insight resource in the Azure portal.
2. On the left, under configure click on **Alert**.

    ![On the left under configure click alert](./media/alerts/1appinsightalert.png)

3. At the top of the alert tab select **New alert rule**.

     ![At the top of the alert tab click new alert rule](./media/alerts/2createalert.png)

4. Your resource should be auto selected. To set a condition, click **Add condition**.

    ![Click add condition](./media/alerts/3addcondition.png)

5. In the configure signal logic tab select **Custom log search**

    ![Click custom log search](./media/alerts/4customlogsearch.png)

6. In the custom log search tab, enter your query in the "Search query" box. For this example, we will use the below Kusto query.
	```kusto
    let percentthreshold = 10;
    let period = 24h;
    requests
    | where timestamp >ago(period)
    | summarize requestsCount = sum(itemCount)
    | project requestsCount, exceptionsCount = toscalar(exceptions | where timestamp >ago(period) | summarize sum(itemCount))
    | extend exceptionsRate = toreal(exceptionsCount)/toreal(requestsCount) * 100
    | where exceptionsRate > percentthreshold

    ```

    ![Type query in search query box](./media/alerts/5searchquery.png)
	
    > [!NOTE]
    > You can also apply these steps to other types of query-based alerts. You can learn more about the Kusto query language from this  [Kusto getting started doc](https://docs.microsoft.com/azure/kusto/concepts/) or this [SQL to Kusto cheat sheet](https://docs.microsoft.com/azure/kusto/query/sqlcheatsheet)

7. Under "Alert logic", choose whether it's based on number of results or metric measurement. Then pick the condition (greater than, equal to, less than) and a threshold. While you are changing these values, you may notice the condition preview sentence changes. In this example we are using "equal to".

    ![Under Alert logic choose from the options provided for based on and condition, then type a threshold](./media/alerts/6alertlogic.png)

8. Under "Evaluated based on", set the period and frequency. The period here must match the value that we put for period in the query above. Then click **done**.

    ![Set period and frequency at the bottom and then click done](./media/alerts/7evaluate.png)

9. We now see the condition we created with the estimated monthly cost. Below under ["Action Groups"](../platform/action-groups.md) you can create a new group or select an existing one. If you want, you can customize the actions.

    ![click on the select or create buttons under action group](./media/alerts/8actiongroup.png)

10. Finally add your alert details (alert rule name, description, severity). When you are done, click **Create alert rule** at the bottom.

    ![Under alert detail type your alert rule name, write a description and pick a severity](./media/alerts/9alertdetails.png)

## How to unsubscribe from classic alert e-mail notifications

This section applies to **classic availability alerts**, **classic Application Insights metric alerts**, and to **classic failure anomalies alerts**.

You are receiving e-mail notifications for these classic alerts if any of the following applies:

* Your e-mail address is listed in the Notification e-mail recipients field in the alert rule settings.

* The option to send e-mail notifications to users holding certain roles for the subscription is activated, and you hold a respective role for that particular Azure subscription.

![Alert notification screenshot](./media/alerts/alert-notification.png)

To better control your security and privacy we generally recommend that you explicitly specify the notification recipients for your classic alerts in the **Notification email recipients** field. The option to notify all users holding certain roles is provided for backward compatibility.

To unsubscribe from e-mail notifications generated by a certain alert rule, remove your e-mail address from the **Notification email recipients** field.

If your email address is not listed explicitly, we recommend that you disable the option to notify all members of certain roles automatically, and instead list all user e-mails who need to receive notifications for that alert rule in the Notification e-mail recipients field.

## Who receives the (classic) alert notifications?

This section only applies to classic alerts and will help you optimize your alert notifications to ensure that only your desired recipients receive notifications. To understand more about the difference between [classic alerts](../platform/alerts-classic.overview.md) and the new alerts experience, refer to the [alerts overview article](../platform/alerts-overview.md). To control alert notification in the new alerts experience, use [action groups](../platform/action-groups.md).

* We recommend the use of specific recipients for classic alert notifications.

* For alerts on any Application Insights metrics (including availability metrics), the **bulk/group** check-box option, if enabled, sends to users with owner, contributor, or reader roles in the subscription. In effect, _all_ users with access to the subscription the Application Insights resource are in scope and will receive notifications.

> [!NOTE]
> If you currently use the **bulk/group** check-box option, and disable it, you will not be able to revert the change.

Use the new alert experience/near-realtime alerts if you need to notify users based on their roles. With [action groups](../platform/action-groups.md), you can configure email notifications to users with any of the contributor/owner/reader roles (not combined together as a single option).

## Automation
* [Use PowerShell to automate setting up alerts](../../azure-monitor/app/powershell-alerts.md)
* [Use webhooks to automate responding to alerts](../../azure-monitor/platform/alerts-webhooks.md)

## See also
* [Availability web tests](../../azure-monitor/app/monitor-web-app-availability.md)
* [Automate setting up alerts](../../azure-monitor/app/powershell-alerts.md)
* [Proactive diagnostics](../../azure-monitor/app/proactive-diagnostics.md) 

<!--Link references-->

[availability]: ../../azure-monitor/app/monitor-web-app-availability.md
[client]: ../../azure-monitor/app/javascript.md
[platforms]: ../../azure-monitor/app/platforms.md
[roles]: ../../azure-monitor/app/resources-roles-access-control.md
[start]: ../../azure-monitor/app/app-insights-overview.md

