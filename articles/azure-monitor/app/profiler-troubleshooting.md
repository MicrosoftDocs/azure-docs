---
title: Troubleshoot problems with Azure Application Insights Profiler
description: This article presents troubleshooting steps and information to help developers who are having trouble enabling or using Application Insights Profiler.
ms.topic: conceptual
author: cweining
ms.author: cweining
ms.date: 08/06/2018

ms.reviewer: mbullwin
---

# Troubleshoot problems enabling or viewing Application Insights Profiler

## Active issues

* Profiling for ASP.NET Core 3.x applications is supported now on Azure App Services.

## <a id="troubleshooting"></a>General troubleshooting

### Profiles are uploaded only if there are requests to your application while Profiler is running

Azure Application Insights Profiler collects profiling data for two minutes each hour. It also collects data when you select the **Profile Now** button in the **Configure Application Insights Profiler** pane. But the profiling data is uploaded only when it can be attached to a request that happened while Profiler was running. 

Profiler writes trace messages and custom events to your Application Insights resource. You can use these events to see how Profiler is running. If you think Profiler should be running and capturing traces, but they're not displayed in the **Performance** pane, you can check to see how Profiler is running:

1. Search for trace messages and custom events sent by Profiler to your Application Insights resource. You can use this search string to find the relevant data:

    ```
    stopprofiler OR startprofiler OR upload OR ServiceProfilerSample
    ```
    The following image displays two examples of searches from two AI resources: 
    
   * At the left, the application isn't receiving requests while Profiler is running. The message explains that the upload was canceled because of no activity. 

   * At the right, Profiler started and sent custom events when it detected requests that happened while Profiler was running. If the ServiceProfilerSample custom event is displayed, it means that Profiler attached a trace to a request and you can view the trace in the **Application Insights Performance** pane.

     If no telemetry is displayed, Profiler is not running. To troubleshoot, see the troubleshooting sections for your specific app type later in this article.  

     ![Search Profiler telemetry][profiler-search-telemetry]

1. If there were requests while Profiler ran, make sure that the requests are handled by the part of your application that has Profiler enabled. Although applications sometimes consist of multiple components, Profiler is enabled for only some of the components. The **Configure Application Insights Profiler** pane displays the components that have uploaded traces.

### Other things to check
* Make sure that your app is running on .NET Framework 4.6.
* If your web app is an ASP.NET Core application, it must be running at least ASP.NET Core 2.0.
* If the data you're trying to view is older than a couple of weeks, try limiting your time filter and try again. Traces are deleted after seven days.
* Make sure that proxies or a firewall have not blocked access to https://gateway.azureserviceprofiler.net.
* Profiler isn't supported on free or shared app service plans. If you're using one of those plans, try scaling up to one of the basic plans and Profiler should start working.

### <a id="double-counting"></a>Double counting in parallel threads

In some cases, the total time metric in the stack viewer is more than the duration of the request.

This situation might occur when two or more threads are associated with a request and they are operating in parallel. In that case, the total thread time is more than the elapsed time. One thread might be waiting on the other to be completed. The viewer tries to detect this situation and omits the uninteresting wait. In doing so, it errs on the side of displaying too much information rather than omit what might be critical information.

When you see parallel threads in your traces, determine which threads are waiting so that you can ascertain the critical path for the request. Usually, the thread that quickly goes into a wait state is simply waiting on the other threads. Concentrate on the other threads, and ignore the time in the waiting threads.

### Error report in the profile viewer
Submit a support ticket in the portal. Be sure to include the correlation ID from the error message.

## Troubleshoot Profiler on Azure App Service
For Profiler to work properly:
* Your web app service plan must be Basic tier or higher.
* Your web app must have Application Insights enabled.
* Your web app must have the following app settings:

    |App Setting    | Value    |
    |---------------|----------|
    |APPINSIGHTS_INSTRUMENTATIONKEY         | iKey for your Application Insights resource    |
    |APPINSIGHTS_PROFILERFEATURE_VERSION | 1.0.0 |
    |DiagnosticServices_EXTENSION_VERSION | ~3 |


* The **ApplicationInsightsProfiler3** webjob must be running. To check the webjob:
   1. Go to [Kudu](https://blogs.msdn.microsoft.com/cdndevs/2015/04/01/the-kudu-debug-console-azure-websites-best-kept-secret/).
   1. In the **Tools** menu, select **WebJobs Dashboard**.  
      The **WebJobs** pane opens. 
   
      ![profiler-webjob]   
   
   1. To view the details of the webjob, including the log, select the **ApplicationInsightsProfiler3** link.  
     The **Continuous WebJob Details** pane opens.

      ![profiler-webjob-log]

If you can't figure out why Profiler isn't working for you, you can download the log and send it to our team for assistance, serviceprofilerhelp@microsoft.com. 
    
### Manual installation

When you configure Profiler, updates are made to the web app's settings. If your environment requires it, you can apply the updates manually. An example might be that your application is running in a Web Apps environment for PowerApps. To apply updates manually:

1. In the **Web App Control** pane, open **Settings**.

1. Set **.NET Framework version** to **v4.6**.

1. Set **Always On** to **On**.
1. Create these app settings:

    |App Setting    | Value    |
    |---------------|----------|
    |APPINSIGHTS_INSTRUMENTATIONKEY         | iKey for your Application Insights resource    |
    |APPINSIGHTS_PROFILERFEATURE_VERSION | 1.0.0 |
    |DiagnosticServices_EXTENSION_VERSION | ~3 |

### Too many active profiling sessions

Currently, you can enable Profiler on a maximum of four Azure web apps and deployment slots that are running in the same service plan. If you have more than four web apps running in one app service plan, Profiler might throw a *Microsoft.ServiceProfiler.Exceptions.TooManyETWSessionException*. Profiler runs separately for each web app and attempts to start an Event Tracing for Windows (ETW) session for each app. But a limited number of ETW sessions can be active at one time. If the Profiler webjob reports too many active profiling sessions, move some web apps to a different service plan.

### Deployment error: Directory Not Empty 'D:\\home\\site\\wwwroot\\App_Data\\jobs'

If you're redeploying your web app to a Web Apps resource with Profiler enabled, you might see the following message:

*Directory Not Empty 'D:\\home\\site\\wwwroot\\App_Data\\jobs'*

This error occurs if you run Web Deploy from scripts or from the Azure DevOps deployment pipeline. The solution is to add the following additional deployment parameters to the Web Deploy task:

```
-skip:Directory='.*\\App_Data\\jobs\\continuous\\ApplicationInsightsProfiler.*' -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data\\jobs\\continuous$' -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data\\jobs$'  -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data$'
```

These parameters delete the folder that's used by Application Insights Profiler and unblock the redeploy process. They don't affect the Profiler instance that's currently running.

### How do I determine whether Application Insights Profiler is running?

Profiler runs as a continuous webjob in the web app. You can open the web app resource in the [Azure portal](https://portal.azure.com). In the **WebJobs** pane, check the status of **ApplicationInsightsProfiler**. If it isn't running, open **Logs** to get more information.

## Troubleshoot VMs and Cloud Services

>**The bug in the profiler that ships in the WAD for Cloud Services has been fixed.** The latest version of WAD (1.12.2.0) for Cloud Services works with all recent versions of the App Insights SDK. Cloud Service hosts will upgrade WAD automatically, but it isn't immediate. To force an upgrade, you can redeploy your service or reboot the node.

To see whether Profiler is configured correctly by Azure Diagnostics, do the following three things: 
1. First, check to see whether the contents of the Azure Diagnostics configuration that are deployed are what you expect. 

1. Second, make sure that Azure Diagnostics passes the proper iKey on the Profiler command line. 

1. Third, check the Profiler log file to see whether Profiler ran but returned an error. 

To check the settings that were used to configure Azure Diagnostics:

1. Sign in to the virtual machine (VM), and then open the log file at this location. The plugin version may be newer on your machine.
    
    For VMs:
    ```
    c:\WindowsAzure\logs\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\1.11.3.12\DiagnosticsPlugin.log
    ```
    
    For Cloud Services:
    ```
    c:\logs\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\1.11.3.12\DiagnosticsPlugin.log  
    ```

1. In the file, you can search for the string **WadCfg** to find the settings that were passed to the VM to configure Azure Diagnostics. You can check to see whether the iKey used by the Profiler sink is correct.

1. Check the command line that's used to start Profiler. The arguments that are used to launch Profiler are in the following file. (The drive could be c: or d: and the directory may be hidden.)

    For VMs:
    ```
    C:\ProgramData\ApplicationInsightsProfiler\config.json
    ```
    
    for Cloud Services:
    ```
    D:\ProgramData\ApplicationInsightsProfiler\config.json
    ```

1. Make sure that the iKey on the Profiler command line is correct. 

1. Using the path found in the preceding *config.json* file, check the Profiler log file, called **BootstrapN.log**. It displays the debug information that indicates the settings that Profiler is using. It also displays status and error messages from Profiler.  

    For VMs, the file is usually here:
    ```
    C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\1.17.0.6\ApplicationInsightsProfiler
    ```

    For Cloud Services:
    ```
    C:\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\1.17.0.6\ApplicationInsightsProfiler
    ```

    If Profiler is running while your application is receiving requests, the following message is displayed: *Activity detected from iKey*. 

    When the trace is being uploaded, the following message is displayed: *Start to upload trace*. 


## Edit network proxy or firewall rules

If your application connects to the Internet via a proxy or a firewall, you may need to edit the rules to allow your application to communicate with the Application Insights Profiler service. The IPs used by Application Insights Profiler are included in the Azure Monitor service tag.


[profiler-search-telemetry]:./media/profiler-troubleshooting/Profiler-Search-Telemetry.png
[profiler-webjob]:./media/profiler-troubleshooting/Profiler-webjob.png
[profiler-webjob-log]:./media/profiler-troubleshooting/Profiler-webjob-log.png








