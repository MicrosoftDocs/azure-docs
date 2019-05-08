---
title: Use Powershell to set alerts in Application Insights | Microsoft Docs
description: Automate configuration of Application Insights to get emails about metric changes.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.assetid: 05d6a9e0-77a2-4a35-9052-a7768d23a196
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 10/31/2016
ms.author: mbullwin
---
# Use PowerShell to set alerts in Application Insights

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

You can automate the configuration of [alerts](../../azure-monitor/app/alerts.md) in [Application Insights](../../azure-monitor/app/app-insights-overview.md).

In addition, you can [set webhooks to automate your response to an alert](../../azure-monitor/platform/alerts-webhooks.md).

> [!NOTE]
> If you want to create resources and alerts at the same time, consider [using an Azure Resource Manager template](powershell.md).

## One-time setup
If you haven't used PowerShell with your Azure subscription before:

Install the Azure Powershell module on the machine where you want to run the scripts.

* Install [Microsoft Web Platform Installer (v5 or higher)](https://www.microsoft.com/web/downloads/platform.aspx).
* Use it to install Microsoft Azure Powershell

## Connect to Azure
Start Azure PowerShell and [connect to your subscription](/powershell/azure/overview):

```powershell

    Add-AzAccount
```


## Get alerts
    Get-AzAlertRule -ResourceGroup "Fabrikam" [-Name "My rule"] [-DetailedOutput]

## Add alert
    Add-AzMetricAlertRule  -Name "{ALERT NAME}" -Description "{TEXT}" `
     -ResourceGroup "{GROUP NAME}" `
     -ResourceId "/subscriptions/{SUBSCRIPTION ID}/resourcegroups/{GROUP NAME}/providers/microsoft.insights/components/{APP RESOURCE NAME}" `
     -MetricName "{METRIC NAME}" `
     -Operator GreaterThan  `
     -Threshold {NUMBER}   `
     -WindowSize {HH:MM:SS}  `
     [-SendEmailToServiceOwners] `
     [-CustomEmails "EMAIL1@X.COM","EMAIL2@Y.COM" ] `
     -Location "East US" // must be East US at present
     -RuleType Metric



## Example 1
Email me if the server's response to HTTP requests, averaged over 5 minutes, is slower than 1 second. My Application Insights resource is called IceCreamWebApp, and it is in resource group Fabrikam. I am the owner of the Azure subscription.

The GUID is the subscription ID (not the instrumentation key of the application).

    Add-AzMetricAlertRule -Name "slow responses" `
     -Description "email me if the server responds slowly" `
     -ResourceGroup "Fabrikam" `
     -ResourceId "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Fabrikam/providers/microsoft.insights/components/IceCreamWebApp" `
     -MetricName "request.duration" `
     -Operator GreaterThan `
     -Threshold 1 `
     -WindowSize 00:05:00 `
     -SendEmailToServiceOwners `
     -Location "East US" -RuleType Metric

## Example 2
I have an application in which I use [TrackMetric()](../../azure-monitor/app/api-custom-events-metrics.md#trackmetric) to report a metric named "salesPerHour." Send an email to my colleagues if "salesPerHour" drops below 100, averaged over 24 hours.

    Add-AzMetricAlertRule -Name "poor sales" `
     -Description "slow sales alert" `
     -ResourceGroup "Fabrikam" `
     -ResourceId "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Fabrikam/providers/microsoft.insights/components/IceCreamWebApp" `
     -MetricName "salesPerHour" `
     -Operator LessThan `
     -Threshold 100 `
     -WindowSize 24:00:00 `
     -CustomEmails "satish@fabrikam.com","lei@fabrikam.com" `
     -Location "East US" -RuleType Metric

The same rule can be used for the metric reported by using the [measurement parameter](../../azure-monitor/app/api-custom-events-metrics.md#properties) of another tracking call such as TrackEvent or trackPageView.

## Metric names
| Metric name | Screen name | Description |
| --- | --- | --- |
| `basicExceptionBrowser.count` |Browser exceptions |Count of uncaught exceptions thrown in the browser. |
| `basicExceptionServer.count` |Server exceptions |Count of unhandled exceptions thrown by the app |
| `clientPerformance.clientProcess.value` |Client processing time |Time between receiving the last byte of a document until the DOM is loaded. Async requests may still be processing. |
| `clientPerformance.networkConnection.value` |Page load network connect time |Time the browser takes to connect to the network. Can be 0 if cached. |
| `clientPerformance.receiveRequest.value` |Receiving response time |Time between browser sending request to starting to receive response. |
| `clientPerformance.sendRequest.value` |Send request time |Time taken by browser to send request. |
| `clientPerformance.total.value` |Browser page load time |Time from user request until DOM, stylesheets, scripts and images are loaded. |
| `performanceCounter.available_bytes.value` |Available memory |Physical memory immediately available for a process or for system use. |
| `performanceCounter.io_data_bytes_per_sec.value` |Process IO Rate |Total bytes per second read and written to files, network and devices. |
| `performanceCounter.number_of_exceps_thrown_per_sec.value` |exception rate |Exceptions thrown per second. |
| `performanceCounter.percentage_processor_time.value` |Process CPU |The percentage of elapsed time of all process threads used by the processor to execution instructions for the applications process. |
| `performanceCounter.percentage_processor_total.value` |Processor time |The percentage of time that the processor spends in non-Idle threads. |
| `performanceCounter.process_private_bytes.value` |Process private bytes |Memory exclusively assigned to the monitored application's processes. |
| `performanceCounter.request_execution_time.value` |ASP.NET request execution time |Execution time of the most recent request. |
| `performanceCounter.requests_in_application_queue.value` |ASP.NET requests in execution queue |Length of the application request queue. |
| `performanceCounter.requests_per_sec.value` |ASP.NET request rate |Rate of all requests to the application per second from ASP.NET. |
| `remoteDependencyFailed.durationMetric.count` |Dependency failures |Count of failed calls made by the server application to external resources. |
| `request.duration` |Server response time |Time between receiving an HTTP request and finishing sending the response. |
| `request.rate` |Request rate |Rate of all requests to the application per second. |
| `requestFailed.count` |Failed requests |Count of HTTP requests that resulted in a response code >= 400 |
| `view.count` |Page views |Count of client user requests for a web page. Synthetic traffic is filtered out. |
| {your custom metric name} |{Your metric name} |Your metric value reported by [TrackMetric](../../azure-monitor/app/api-custom-events-metrics.md#trackmetric) or in the [measurements parameter of a tracking call](../../azure-monitor/app/api-custom-events-metrics.md#properties). |

The metrics are sent by different telemetry modules:

| Metric group | Collector module |
| --- | --- |
| basicExceptionBrowser,<br/>clientPerformance,<br/>view |[Browser JavaScript](../../azure-monitor/app/javascript.md) |
| performanceCounter |[Performance](../../azure-monitor/app/configuration-with-applicationinsights-config.md) |
| remoteDependencyFailed |[Dependency](../../azure-monitor/app/configuration-with-applicationinsights-config.md) |
| request,<br/>requestFailed |[Server request](../../azure-monitor/app/configuration-with-applicationinsights-config.md) |

## Webhooks
You can [automate your response to an alert](../../azure-monitor/platform/alerts-webhooks.md). Azure will call a web address of your choice when an alert is raised.

## See also
* [Script to configure Application Insights](powershell-script-create-resource.md)
* [Create Application Insights and web test resources from templates](powershell.md)
* [Automate coupling Microsoft Azure Diagnostics to Application Insights](powershell-azure-diagnostics.md)
* [Automate your response to an alert](../../azure-monitor/platform/alerts-webhooks.md)
