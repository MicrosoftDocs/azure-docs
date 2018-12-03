---
title: Troubleshoot problems with Azure Application Insights Profiler | Microsoft Docs
description: This page contains troubleshooting steps and information to help developers who are having trouble enabling or using Application Insights profiler.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.reviewer: cawa
ms.date: 08/06/2018
ms.author: mbullwin
---
# Troubleshoot problems enabling or viewing Application Insights Profiler

## <a id="troubleshooting"></a>General Troubleshooting

### Profiles are only uploaded if there are requests to your application while the profiler is running
Application Insights Profiler collects profiler data for two minutes each hour, or when the [**Profile Now**](app-insights-profiler-settings.md?toc=/azure/azure-monitor/toc.json) button is pressed on the **Configure Application Insights Profiler** page. But the profiling data is only uploaded when it can be attached to a request that happened while the profiler was running. 

The profiler writes trace messages and custom events to your application insights resource. You can use those events to see how the profiler is running. If you think the profiler should be running and capturing traces but you aren't seeing them in the Performance page, you can check how the profiler is running:

1. Search for trace messages and custom events sent by the profiler to your Application Insights resource. You can use this search string to find the relevant data:

    ```
    stopprofiler OR startprofiler OR upload OR ServiceProfilerSample
    ```
    Here is an example from two searches from two different AI resources in the screenshot below. 
    
    * The one on the left is from an application that isn't getting requests while the profiler is running. You can see the message that the upload was canceled because of no activity. 

    * In the example on the right, you can see that the profiler started and sent custom events when it detected requests that happened while the profiler was running. If you see the ServiceProfilerSample custom event, it means the profiler attached a trace to a request and you can view the trace from the Application Insights performance page.

    * If you don't see any telemetry at all, then the profiler is not running. You may need to read the troubleshooting sections for your specific app type on this document below.  

     ![Search Profiler Telemetry][profiler-search-telemetry]

1. If there are requests during the time period the profiler ran, make sure requests are handled by the part of your application that has the profiler enabled. Sometimes applications consist of multiple components but Profiler is only enabled for some, not all, of the components. The Configure Application Insights Profiler page will show the components that have uploaded traces.

### Other things to check:
* Your app is running on .NET Framework 4.6.
* If your web app is an ASP.NET Core application, it must be running at least ASP.NET Core 2.0.
* If the data you are trying to view is older than a couple of weeks, try limiting your time filter and try again. Traces are deleted after seven days.
* Ensure that proxies or a firewall have not blocked access to https://gateway.azureserviceprofiler.net.

### <a id="double-counting"></a>Double counting in parallel threads

In some cases, the total time metric in the stack viewer is more than the duration of the request.

This situation might occur when two or more threads are associated with a request, and they are operating in parallel. In that case, the total thread time is more than the elapsed time. One thread might be waiting on the other to be completed. The viewer tries to detect this situation and omits the uninteresting wait, but it errs on the side of displaying too much information rather than omit what might be critical information.

When you see parallel threads in your traces, determine which threads are waiting so you can ascertain the critical path for the request. In most cases, the thread that quickly goes into a wait state is simply waiting on the other threads. Concentrate on the other threads, and ignore the time in the waiting threads.

### Error report in the profile viewer
Submit a support ticket in the portal. Be sure to include the correlation ID from the error message.

## Troubleshooting Profiler on App Services
### For the profiler to work properly:
* Your web app service plan must be Basic tier or higher.
* Your web app must have Application Insights enabled.
* Your web app must have the **APPINSIGHTS_INSTRUMENTATIONKEY** app setting configured with the same instrumentation key that's used by the Application Insights SDK.
* Your web app must have the **APPINSIGHTS_PROFILERFEATURE_VERSION** app setting defined and set to 1.0.0.
* Your web app must have the **DiagnosticServices_EXTENSION_VERSION** app setting defined and set the value to ~3.
* The **ApplicationInsightsProfiler3** web job must be running. You can check the web job by going to [Kudu](https://blogs.msdn.microsoft.com/cdndevs/2015/04/01/the-kudu-debug-console-azure-websites-best-kept-secret/), and opening the **WebJobs Dashboard** under the Tools menu. As you can see in the screenshots below, by clicking the ApplicationInsightsProfiler2 link, you can see details of the webjob, including the log.

    Here is the link you need to click to see the webjob details: 

    ![profiler-webjob]

    Here is the page that shows the details. You can download the log and send it to our team if you can't figure out why the profiler isn't working for you.
    
    ![profiler-webjob-log]

### Manual installation

When you configure Profiler, updates are made to the web app's settings. You can apply the updates manually if your environment requires it. An example might be that your application is running in a Web Apps environment for PowerApps.

1. In the **Web App Control** pane, open **Settings**.
1. Set **.Net Framework version** to **v4.6**.
1. Set **Always On** to **On**.
1. Add the **APPINSIGHTS_INSTRUMENTATIONKEY** app setting, and set the value to the same instrumentation key that's used by the SDK.
1. Add the **APPINSIGHTS_PROFILERFEATURE_VERSION** app setting, and set the value to 1.0.0.
1. Add the **DiagnosticServices_EXTENSION_VERSION** app setting, and set the value to ~3.

### Too many active profiling sessions

Currently, you can enable Profiler on a maximum of four Azure web apps and deployment slots that are running in the same service plan. If you have more web apps than that running in one app service plan, you may see a Microsoft.ServiceProfiler.Exceptions.TooManyETWSessionException thrown by the profiler. The profiler runs separately for each web app and attempts to start an ETW session for each app. But there are a limited number of ETW sessions that can be active at one time. If the Profiler web job is reporting too many active profiling sessions, move some web apps to a different service plan.

### Deployment error: Directory Not Empty 'D:\\home\\site\\wwwroot\\App_Data\\jobs'

If you are redeploying your web app to a Web Apps resource with Profiler enabled, you might see the following message:

*Directory Not Empty 'D:\\home\\site\\wwwroot\\App_Data\\jobs'*

This error occurs if you run Web Deploy from scripts or from the Azure DevOps Deployment Pipeline. The solution is to add the following additional deployment parameters to the Web Deploy task:

```
-skip:Directory='.*\\App_Data\\jobs\\continuous\\ApplicationInsightsProfiler.*' -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data\\jobs\\continuous$' -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data\\jobs$'  -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data$'
```

These parameters delete the folder that's used by Application Insights Profiler and unblock the redeploy process. They don't affect the Profiler instance that's currently running.

### How do I determine whether Application Insights Profiler is running?

Profiler runs as a continuous web job in the web app. You can open the web app resource in the [Azure portal](https://portal.azure.com). In the **WebJobs** pane, check the status of **ApplicationInsightsProfiler**. If it isn't running, open **Logs** to get more information.

## Troubleshooting problems with Profiler and WAD

There are three things to check to see that the profiler is configured correctly by WAD. First, you need to check that the contents of the WAD configuration that are deployed are what you expect. Second, you need to check WAD passes the proper iKey on the profiler command line. Third, you can check the profiler log file to see if profiler ran but is getting an error. 

To check the settings that were used to configure WAD, you need to log into the VM and open the log file at this location: 
```
c:\logs\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\1.11.3.12\DiagnosticsPlugin.logs  
```
In that file, you can search for the string "WadCfg" and you'll find the settings that were passed to the VM to configure WAD. You can check that iKey used by the profiler sink is correct.

Second, you can check the command line that is used to start the profiler. The following file contains the arguments used to launch the profiler.
```
D:\ProgramData\ApplicationInsightsProfiler\config.json
```
Check that the ikey on the profiler command line is correct. 

Third, using the path found in the config.json file above, check the profiler log file. It will show debug information indicating the settings the profiler is using and status and error messages from the profiler. If the profiler is running while your application is receiving requests, you'll see this message: Activity detected from iKey. When the trace is being uploaded, you'll see this message: Start to upload trace. 


[profiler-search-telemetry]:./media/app-insights-profiler/Profiler-Search-Telemetry.png
[profiler-webjob]:./media/app-insights-profiler/Profiler-webjob.png
[profiler-webjob-log]:./media/app-insights-profiler/Profiler-webjob-log.png








