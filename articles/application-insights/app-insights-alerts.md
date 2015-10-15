<properties 
	pageTitle="Set Alerts in Application Insights" 
	description="Get emails about crashes, exceptions, metric changes." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/23/2015" 
	ms.author="awills"/>
 
# Set Alerts in Application Insights

[Visual Studio Application Insights][start] can alert you to changes in performance or usage metrics in your app. 

Application Insights monitors your live app on a [wide variety of platforms][platforms] to help you diagnose performance issues and understand usage patterns.

There are two kinds of alerts:
 
* **Web tests** tell you when your site is unavailable on the internet, or responding slowly. [Learn more][availability].
* **Metric alerts** tell you when any metric crosses a threshold value for some period - such as failure counts, memory, or page views. 

There's a [separate page about web tests][availability], so we'll focus on metric alerts here.

## Metric alerts

If you haven't set up Application Insights for your app, [do that first][start].

To get an email when a metric crosses a threshold, start either from Metrics Explorer, or from the Alert rules tile on the overview blade.

![In the Alert rules blade, choose Add Alert. Set the your app as the resource to measure, provide a name for the alert, and choose a metric.](./media/app-insights-alerts/01-set-metric.png)

Set the resource before the other properties. **Choose the "(components)" resource** if you want to set alerts on performance or usage metrics.

Be careful to note the units in which you're asked to enter the threshold value.

The name that you give to the alert must be unique within the resource group (not just your application).

*I don't see the Add Alert button.* - Are you using an organizational account? You can set alerts if you have owner or contributor access to this application resource. Take a look at Settings -> Users. [Learn about access control][roles].

## See your alerts

You get an email when an alert changes state between inactive and active. 

The current state of each alert is shown in the Alert rules blade.

There's a summary of recent activity in the alerts drop-down:

![](./media/app-insights-alerts/010-alert-drop.png)

The history of state changes is in the Operations Events log:

![On the Overview blade, near the bottom, click 'Events in the past week'](./media/app-insights-alerts/09-alerts.png)

*Are these "events" related to telemetry events or custom events?*

* No. These operational events are just a log of things that have happened to this application resource. 


## How alerts work

* An alert has two states: "alert" and "healthy". 

* An email is sent when an alert changes state.

* An alert is evaluated each time a metric arrives, but not otherwise.

* The evaluation aggregates the metric over the preceding period, and then compares it to the threshold to determine the new state.

* The period that you choose specifies the interval over which metrics are aggregated. It doesn't affect how often the alert is evaluated: that depends on the frequency of arrival of metrics.

* If no data arrives for a particular metric for some time, the gap has different effects on alert evaluation and on the charts in metric explorer. In metric explorer, if no data is seen for longer than the chart's sampling interval, the chart will show a value of 0. But an alert based on the same metric will not be re-evaluated, and the alert's state will remain unchanged. 

    When data eventually arrives, the chart will jump back to a non-zero value. The alert will evaluate based on the data available for the period you specified. If the new data point is the only one available in the period, the aggregate will be based just on that.

* An alert can flicker frequently between alert and healthy states, even if you set a long period. This can happen if the metric value hovers around the threshold. There is no hysteresis in the threshold: the transition to alert happens at the same value as the transition to healthy.



## Availability alerts

You can set up web tests that test any web site from points around the world. [Learn more][availability].

## What are good alerts to set?

It depends on your application. To start with, it's best not to set too many metrics. Spend some time looking at your metric charts while your app is running, to get a feel for how it behaves normally. This will help you find ways to improve its performance. Then set up alerts to tell you when the metrics go outside the normal zone. 

Popular alerts include:

* [Web tests][availability] are important if your application is a website or web service that is visible on the public internet. They tell you if your site goes down or responds slowly - even if it's the carrier's problem rather than your app. But they're synthetic tests, so they don't measure your users' actual experience.
* [Browser metrics][client], especially Browser **page load times**, are good for web applications. If your page has a lot of scripts, you'll want to look out for **browser exceptions**. In order to get these metrics and alerts, you have to set up [web page monitoring][client].
* **Server response time** and **Failed requests** for the server side of web applications. As well as setting up alerts, keep an eye on these metrics to see if they vary disproportionately with high request rates: that might indicate that your app is running out of resources.
* **Server exceptions** - to see them, you have to do some [additional setup](app-insights-asp-net-exceptions.md).

## Set alerts by using PowerShell

For most purposes, it's sufficient to set alerts manually. But if you want to create metric alerts automatically, you can do so by using PowerShell.

#### One-time setup

If you haven't used PowerShell with your Azure subscription before:

Install the Azure Powershell module on the machine where you want to run the scripts. 
 * Install [Microsoft Web Platform Installer (v5 or higher)](http://www.microsoft.com/web/downloads/platform.aspx).
 * Use it to install Microsoft Azure Powershell


#### Connect to Azure

Start Azure PowerShell and [connect to your subscription](powershell-install-configure.md):

    ```
    Add-AzureAccount
    Switch-AzureMode AzureResourceManager
    ```


#### Get alerts

    Get-AlertRule -ResourceGroup "Fabrikam" [-Name "My rule"] [-DetailedOutput]

#### Add alert


    Add-AlertRule  -Name "{ALERT NAME}" -Description "{TEXT}" `
     -ResourceGroup "{GROUP NAME}" `
     -ResourceId "/subscriptions/{SUBSCRIPTION ID}/resourcegroups/{GROUP NAME}/providers/microsoft.insights/components/{APP RESOURCE NAME}" `
     -MetricName "{METRIC NAME}" `
     -Operator GreaterThan  `
     -Threshold {NUMBER}   `
     -WindowSize {HH:MM:SS}  `
     [-SendEmailToServiceOwners] `
     [-CustomEmails "EMAIL1@X.COM","EMAIL2@Y.COM" ] `
     -Location "East US"
     -RuleType Metric



#### Example 1

Email me if the server's response to HTTP requests, averaged over 5 minutes, is slower than 1 second. My Application Insights resource is called IceCreamWebApp, and it is in resource group Fabrikam. I am the owner of the Azure subscription.

The GUID is the subscription ID (not the instrumentation key of the application).

    Add-AlertRule -Name "slow responses" `
     -Description "email me if the server responds slowly" `
     -ResourceGroup "Fabrikam" `
     -ResourceId "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Fabrikam/providers/microsoft.insights/components/IceCreamWebApp" `
     -MetricName "request.duration" `
     -Operator GreaterThan `
     -Threshold 1 `
     -WindowSize 00:05:00 `
     -SendEmailToServiceOwners `
     -Location "East US" -RuleType Metric

#### Example 2

I have an application in which I use [TrackMetric()](app-insights-api-custom-events-metrics.md#track-metric) to report a metric named "salesPerHour." Send an email to my colleagues if "salesPerHour" drops below 100, averaged over 24 hours.

    Add-AlertRule -Name "poor sales" `
     -Description "slow sales alert" `
     -ResourceGroup "Fabrikam" `
     -ResourceId "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Fabrikam/providers/microsoft.insights/components/IceCreamWebApp" `
     -MetricName "salesPerHour" `
     -Operator LessThan `
     -Threshold 100 `
     -WindowSize 24:00:00 `
     -CustomEmails "satish@fabrikam.com","lei@fabrikam.com" `
     -Location "East US" -RuleType Metric

The same rule can be used for the metric reported by using the [measurement parameter](app-insights-api-custom-events-metrics.md#properties) of another tracking call such as TrackEvent or trackPageView.

#### Metric names

Metric name | Screen name | Description
---|---|---
`basicExceptionBrowser.count`|Browser exceptions|Count of uncaught exceptions thrown in the browser.
`basicExceptionServer.count`|Server exceptions|Count of unhandled exceptions thrown by the app
`clientPerformance.clientProcess.value`|Client processing time|Time between receiving the last byte of a document until the DOM is loaded. Async requests may still be processing.
`clientPerformance.networkConnection.value`|Page load network connect time| Time the browser takes to connect to the network. Can be 0 if cached.
`clientPerformance.receiveRequest.value`|Receiving response time| Time between browser sending request to starting to receive response.
`clientPerformance.sendRequest.value`|Send request time| Time taken by browser to send request.
`clientPerformance.total.value`|Browser page load time|Time from user request until DOM, stylesheets, scripts and images are loaded.
`performanceCounter.available_bytes.value`|Available memory|Physical memory immediately available for a process or for system use.
`performanceCounter.io_data_bytes_per_sec.value`|Process IO Rate|Total bytes per second read and written to files, network and devices.
`performanceCounter.number_of_exceps_thrown_per_sec`|exception rate|Exceptions thrown per second.
`performanceCounter.percentage_processor_time.value`|Process CPU|The percentage of elapsed time of all process threads used by the processor to execution instructions for the applications process.
`performanceCounter.percentage_processor_total.value`|Processor time|The percentage of time that the processor spends in non-Idle threads.
`performanceCounter.process_private_bytes.value`|Process private bytes|Memory exclusively assigned to the monitored application's processes.
`performanceCounter.request_execution_time.value`|ASP.NET request execution time|Execution time of the most recent request.
`performanceCounter.requests_in_application_queue.value`|ASP.NET requests in execution queue|Length of the application request queue.
`performanceCounter.requests_per_sec`|ASP.NET request rate|Rate of all requests to the application per second from ASP.NET.
`remoteDependencyFailed.durationMetric.count`|Dependency failures|Count of failed calls made by the server application to external resources.
`request.duration`|Server response time|Time between receiving an HTTP request and finishing sending the response.
`request.rate`|Request rate|Rate of all requests to the application per second.
`requestFailed.count`|Failed requests|Count of HTTP requests that resulted in a response code >= 400 
`view.count`|Page views|Count of client user requests for a web page. Synthetic traffic is filtered out.
{your custom metric name}|{Your metric name}|Your metric value reported by [TrackMetric](app-insights-api-custom-events-metrics.md#track-metric) or in the [measurements parameter of a tracking call](app-insights-api-custom-events-metrics.md#properties).

The metrics are sent by different telemetry modules:

Metric group | Collector module
---|---
basicExceptionBrowser,<br/>clientPerformance,<br/>view | [Browser JavaScript](app-insights-javascript.md)
performanceCounter | [Performance](app-insights-configuration-with-applicationinsights-config.md#nuget-package-3)
remoteDependencyFailed| [Dependency](app-insights-configuration-with-applicationinsights-config.md#nuget-package-1)
request,<br/>requestFailed|[Server request](app-insights-configuration-with-applicationinsights-config.md#nuget-package-2)


<!--Link references-->

[availability]: app-insights-monitor-web-app-availability.md
[client]: app-insights-javascript.md
[platforms]: app-insights-platforms.md
[roles]: app-insights-resources-roles-access-control.md
[start]: app-insights-overview.md

 