---
title: Troubleshoot the Application Insights Profiler
description: Walk through troubleshooting steps and information to enable and use Azure Application Insights Profiler.
ms.topic: conceptual
ms.date: 07/21/2022
ms.reviewer: charles.weininger
---

# Troubleshoot the Application Insights Profiler

## Make sure you're using the appropriate Profiler Endpoint

Currently, the only regions that require endpoint modifications are [Azure Government](../../azure-government/compare-azure-government-global-azure.md#application-insights) and [Azure China](/azure/china/resources-developer-guide).

|App Setting    | US Government Cloud | China Cloud |   
|---------------|---------------------|-------------|
|ApplicationInsightsProfilerEndpoint         | `https://profiler.monitor.azure.us`    | `https://profiler.monitor.azure.cn` |
|ApplicationInsightsEndpoint | `https://dc.applicationinsights.us` | `https://dc.applicationinsights.azure.cn` |

## Make sure your app is running on the right versions

Profiler is supported on the [.NET Framework later than 4.6.2](https://dotnet.microsoft.com/download/dotnet-framework).

If your web app is an ASP.NET Core application, it must be running on the [latest supported ASP.NET Core runtime](https://dotnet.microsoft.com/en-us/download/dotnet/6.0).

## Make sure you're using the right Azure service plan

Profiler isn't currently supported on free or shared app service plans. Upgrade to one of the basic plans for Profiler to start working.

## Make sure you're searching for Profiler data within the right timeframe

If the data you're trying to view is older than a couple of weeks, try limiting your time filter and try again. Traces are deleted after seven days.

## Make sure you can access the gateway

Check that proxies or a firewall isn't blocking your access to https://gateway.azureserviceprofiler.net.

## Make sure the Profiler is running

Profiling data is uploaded only when it can be attached to a request that happened while Profiler was running. The Profiler collects data for two minutes each hour. You can also trigger the Profiler by [starting a profiling session](./profiler-settings.md#profile-now).

Profiler writes trace messages and custom events to your Application Insights resource. You can use these events to see how Profiler is running.

Search for trace messages and custom events sent by Profiler to your Application Insights resource. 

1. In your Application Insights resource, select **Search** from the top menu bar. 

   :::image type="content" source="./media/profiler-troubleshooting/search-trace-messages.png" alt-text="Screenshot of selecting the search button from the Application Insights resource.":::

1. Use the following search string to find the relevant data:

   ```
   stopprofiler OR startprofiler OR upload OR ServiceProfilerSample
   ```

   :::image type="content" source="./media/profiler-troubleshooting/search-results.png" alt-text="Screenshot of the search results from aforementioned search string.":::
   
   The search results above include two examples of searches from two AI resources: 
    
   - If the application isn't receiving requests while Profiler is running, the message explains that the upload was canceled because of no activity. 
   
   - Profiler started and sent custom events when it detected requests that happened while Profiler was running. If the `ServiceProfilerSample` custom event is displayed, it means that a profile was captured and is available in the **Application Insights Performance** pane.
   
   If no records are displayed, Profiler isn't running. Make sure you've [enabled Profiler on your Azure service](./profiler.md).  

## Double counting in parallel threads

When two or more parallel threads are associated with a request, the total time metric in the stack viewer may be more than the duration of the request. In that case, the total thread time is more than the actual elapsed time. 

For example, one thread might be waiting on the other to be completed. The viewer tries to detect this situation and omits the uninteresting wait. In doing so, it errs on the side of displaying too much information, rather than omitting what might be critical information.

When you see parallel threads in your traces, determine which threads are waiting so that you can identify the hot path for the request. Usually, the thread that quickly goes into a wait state is simply waiting on the other threads. Concentrate on the other threads, and ignore the time in the waiting threads.


## Troubleshoot Profiler on your specific Azure service

### Azure App Service

For Profiler to work properly, make sure:

- Your web app has [Application Insights enabled](./profiler.md) with the [right settings](./profiler.md#for-application-insights-and-app-service-in-different-subscriptions)

- The [**ApplicationInsightsProfiler3** WebJob]() is running. To check the webjob:
   1. Go to [Kudu](https://github.com/projectkudu/kudu/wiki/Accessing-the-kudu-service). From the Azure portal:
      1. In your App Service, select **Advanced Tools** from the left side menu.
      1. Select **Go**.
   1. In the top menu, select **Tools** > **WebJobs dashboard**.  
      The **WebJobs** pane opens. 
   
      :::image type="content" source="./media/profiler-troubleshooting/profiler-web-job.png" alt-text="Screenshot of the WebJobs pane, which displays the name, status, and last run time of jobs.":::

   1. To view the details of the webjob, including the log, select the **ApplicationInsightsProfiler3** link.  
     The **Continuous WebJob Details** pane opens.

      :::image type="content" source="./media/profiler-troubleshooting/profiler-web-job-log.png" alt-text="Screenshot of the Continuous WebJob Details pane.":::

If Profiler still isn't working for you, you can download the log and [send it to our team](mailto:serviceprofilerhelp@microsoft.com).

#### Check the Diagnostic Services site extension' status page

If Profiler was enabled through the [Application Insights pane](profiler.md) in the portal, it was enabled by the Diagnostic Services site extension. You can check the status page of this extension by going to the following url:
`https://{site-name}.scm.azurewebsites.net/DiagnosticServices`

> [!NOTE]
> The domain of the status page link will vary depending on the cloud. This domain will be the same as the Kudu management site for App Service.

The status page shows the installation state of the Profiler and [Snapshot Debugger](../snapshot-debugger/snapshot-debugger.md) agents. If there was an unexpected error, it will be displayed and show how to fix it.

You can use the Kudu management site for App Service to get the base url of this status page:
1. Open your App Service application in the Azure portal.
2. Select **Advanced Tools**.
3. Select **Go**.
4. Once you are on the Kudu management site:
   1. Append `/DiagnosticServices` to the URL.
   1. Press enter.

It will end like this: `https://<kudu-url>/DiagnosticServices`.

It will display a status page similar to:

![Diagnostic Services Status Page](../app/media/diagnostic-services-site-extension/status-page.png)

> [!NOTE]
> Codeless installation of Application Insights Profiler follows the .NET Core support policy. For more information about supported runtimes, see [.NET Core Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).

#### Manual installation

When you configure Profiler, updates are made to the web app's settings. If necessary, you can [apply the updates manually](./profiler.md#verify-always-on-setting-is-enabled). 

#### Too many active profiling sessions

You can enable Profiler on a maximum of four Web Apps that are running in the same service plan. If you've more than four, Profiler might throw the following error:

*Microsoft.ServiceProfiler.Exceptions.TooManyETWSessionException*. 

To solve it, move some web apps to a different service plan.

#### Deployment error: Directory Not Empty 'D:\\home\\site\\wwwroot\\App_Data\\jobs'

If you're redeploying your web app to a Web Apps resource with Profiler enabled, you might see the following message:

*Directory Not Empty 'D:\\home\\site\\wwwroot\\App_Data\\jobs'*

This error occurs if you run Web Deploy from scripts or from the Azure Pipelines. Resolve by adding the following deployment parameters to the Web Deploy task:

```
-skip:Directory='.*\\App_Data\\jobs\\continuous\\ApplicationInsightsProfiler.*' -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data\\jobs\\continuous$' -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data\\jobs$'  -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data$'
```

These parameters delete the folder used by Application Insights Profiler and unblock the redeploy process. They don't affect the Profiler instance that's currently running.

#### Is the Profiler running?

Profiler runs as a continuous webjob in the web app. You can open the web app resource in the [Azure portal](https://portal.azure.com). In the **WebJobs** pane, check the status of **ApplicationInsightsProfiler**. If it isn't running, open **Logs** to get more information.

### VMs and Cloud Services

To see whether Profiler is configured correctly by Azure Diagnostics:
 
1. Verify that the content of the Azure Diagnostics configuration deployed is what you expect. 

1. Make sure the Azure Diagnostics passes the proper iKey on the Profiler command line. 

1. Check the Profiler log file to see whether Profiler ran but returned an error. 

To check the settings that were used to configure Azure Diagnostics:

1. Sign in to the virtual machine (VM).

1. Open the log file at this location. The plugin version may be newer on your machine.
    
    For VMs:
    ```
    c:\WindowsAzure\logs\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\1.11.3.12\DiagnosticsPlugin.log
    ```
    
    For Cloud Services:
    ```
    c:\logs\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\1.11.3.12\DiagnosticsPlugin.log  
    ```

1. In the file, search for the string `WadCfg` to find the settings that were passed to the VM to configure Azure Diagnostics.

1. Check to see whether the iKey used by the Profiler sink is correct.

1. Check the command line that's used to start Profiler. The arguments that are used to launch Profiler are in the following file (the drive could be `c:` or `d:` and the directory may be hidden):

    For VMs:
    ```
    C:\ProgramData\ApplicationInsightsProfiler\config.json
    ```
    
    for Cloud Services:
    ```
    D:\ProgramData\ApplicationInsightsProfiler\config.json
    ```

1. Make sure that the iKey on the Profiler command line is correct. 

1. Using the path found in the preceding *config.json* file, check the Profiler log file, called `BootstrapN.log`. It displays:
   - The debug information that indicates the settings that Profiler is using. 
   - Status and error messages from Profiler.  

    You can find the file:

    For VMs:
    ```
    C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\1.17.0.6\ApplicationInsightsProfiler
    ```

    For Cloud Services:
    ```
    C:\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\1.17.0.6\ApplicationInsightsProfiler
    ```

1. If Profiler is running while your application is receiving requests, the following message is displayed: *Activity detected from iKey*. 

1. When the trace is being uploaded, the following message is displayed: *Start to upload trace*. 

### Edit network proxy or firewall rules

If your application connects to the Internet via a proxy or a firewall, you may need to update the rules to communicate with the Profiler service.

The IPs used by Application Insights Profiler are included in the Azure Monitor service tag. For more information, see [Service Tags documentation](../../virtual-network/service-tags-overview.md).

## If all else fails...

Submit a support ticket in the Azure portal. Include the correlation ID from the error message.


