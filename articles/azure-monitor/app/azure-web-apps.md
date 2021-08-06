---
title: Monitor Azure app services performance .NET | Microsoft Docs
description: Application performance monitoring for Azure app services. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 08/05/2021
ms.custom: "devx-track-js, devx-track-dotnet, devx-track-azurepowershell"
---

# Application Monitoring for Azure App Service

Enabling monitoring on your ASP.NET and ASP.NET Core based web applications running on [Azure App Services](../../app-service/index.yml) is now easier than ever. Whereas previously you needed to manually instrument your app, the latest extension/agent is now built into the App Service image by default. This article will walk you through enabling Azure Monitor application Insights monitoring as well as provide preliminary guidance for automating the process for large-scale deployments.

> [!NOTE]
> For .NET on Windows only: manually adding an Application Insights site extension via **Development Tools** > **Extensions** is deprecated. This method of extension installation was dependent on manual updates for each new version. The latest stable release of the extension is now  [preinstalled](https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions) as part of the App Service image. The files are located in `d:\Program Files (x86)\SiteExtensions\ApplicationInsightsAgent` and are automatically updated with each stable release. If you follow the agent-based instructions to enable monitoring below, it will automatically remove the deprecated extension for you.

## Enable Application Insights

There are two ways to enable application monitoring for Azure App Services hosted applications:

* **Agent-based application monitoring** (ApplicationInsightsAgent).  
    * This method is the easiest to enable, and no code change or advanced configurations are required. It is often referred to as "runtime" monitoring. For Azure App Services we recommend at a minimum enabling this level of monitoring, and then based on your specific scenario you can evaluate whether more advanced monitoring through manual instrumentation is needed.

* **Manually instrumenting the application through code** by installing the Application Insights SDK.

    * This approach is much more customizable, but it requires the following approaches: SDK [for .NET Core](./asp-net-core.md), [.NET](./asp-net.md), [Node.js](./nodejs.md), [Python](./opencensus-python.md), and a standalone agent for [Java](./java-in-process-agent.md). This method, also means you have to manage the updates to the latest version of the packages yourself.

    * If you need to make custom API calls to track events/dependencies not captured by default with agent-based monitoring, you would need to use this method. Check out the [API for custom events and metrics article](./api-custom-events-metrics.md) to learn more. 

> [!NOTE]
> If both agent-based monitoring and manual SDK-based instrumentation is detected, in .NET only the manual instrumentation settings will be honored, while in Java only the agent-based instrumentation will be emitting the telemetry. This is to prevent duplicate data from being sent. To learn more about this, check out the [troubleshooting section](#troubleshooting) below.

> [!NOTE]
> Snapshot debugger and profiler are only available in .NET and .Net Core

## Enable agent-based monitoring

# [ASP.NET](#tab/net)

> [!NOTE]
> The combination of APPINSIGHTS_JAVASCRIPT_ENABLED and urlCompression is not supported. For more info see the explanation in the [troubleshooting section](#appinsights_javascript_enabled-and-urlcompression-is-not-supported).

1. **Select Application Insights** in the Azure control panel for your app service.

    ![Under Settings, choose Application Insights](./media/azure-web-apps/settings-app-insights-01.png)

   * Choose to create a new resource, or select an existing Application Insights resource for this application. 

    > [!NOTE]
    > When you click **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**. 

    >[!div class="mx-imgBorder"]
    >![Instrument your web app](./media/azure-web-apps/ai-create-new.png)

2. After specifying which resource to use, you can choose how you want application insights to collect data per platform for your application. ASP.NET app monitoring is on-by-default with two different levels of collection.

    ![Screenshot shows the Application Insights site extensions page with Create new resource selected.](./media/azure-web-apps/choose-options-new.png)
 
 Below is a summary of data collected for each route:
        
| Data | ASP.NET Basic Collection | ASP.NET Recommended collection |
| --- | --- | --- |
| Adds CPU, memory, and I/O usage trends |Yes |Yes |
| Collects usage trends, and enables correlation from availability results to transactions | Yes |Yes |
| Collects exceptions unhandled by the host process | Yes |Yes |
| Improves APM metrics accuracy under load, when sampling is used | Yes |Yes |
| Correlates micro-services across request/dependency boundaries | No (single-instance APM capabilities only) |Yes |

3. To configure settings like sampling, which you could previously control via the applicationinsights.config file you can now interact with those same settings via Application settings with a corresponding prefix. 

    * For example, to change the initial sampling percentage, you can create an Application setting of: `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_InitialSamplingPercentage` and a value of `100`.

    * For the list of supported adaptive sampling telemetry processor settings, you can consult the [code](https://github.com/microsoft/ApplicationInsights-dotnet/blob/master/BASE/Test/ServerTelemetryChannel.Test/TelemetryChannel.Tests/AdaptiveSamplingTelemetryProcessorTest.cs) and [associated documentation](./sampling.md).

# [ASP.NET Core](#tab/netcore)

### Windows
> [!IMPORTANT]
> The following versions of ASP.NET Core are supported for auto-instrumentation on windows : ASP.NET Core 3.1, and 5.0. Versions 2.0, 2.1, 2.2, and 3.0 have been retired and are no longer supported. Please upgrade to a [supported version](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) of .NET Core for auto-instrumentation to work.


Targeting the full framework from ASP.NET Core is **not supported** in Windows. Use [manual instrumentation](./asp-net-core.md) via code instead.

In Windows, only Framework dependent deployment is supported.

See the [enable monitoring section](#enable-monitoring ) below to begin setting up Application Insights with your App Service resource. 

### Linux 

> [!IMPORTANT]
> The following versions of ASP.NET Core are supported for auto-instrumentation on Linux: ASP.NET Core 3.1, 5.0, and 6.0 (preview). Versions 2.0, 2.1, 2.2, and 3.0 have been retired and are no longer supported. Please upgrade to a [supported version](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) of .NET Core for auto-instrumentation to work.

> [!NOTE]
> Linux auto-instrumentation App Services portal enablement is in Public Preview. These preview versions are provided without a service level agreement. Certain features might not be supported or might have constrained capabilities.

Targeting the full framework from ASP.NET Core is **not supported** in Linux. Use [manual instrumentation](./asp-net-core.md) via code instead.

 In Linux, Framework-dependent deployment and self-contained deployment are supported. 

See the [enable monitoring section](#enable-monitoring ) below to begin setting up Application Insights with your App Service resource. 

### Enable monitoring 

1. **Select Application Insights** in the Azure control panel for your app service.

    ![Under Settings, choose Application Insights](./media/azure-web-apps/settings-app-insights-01.png)

   * Choose to create a new resource, or select an existing Application Insights resource for this application.

    > [!NOTE]
    > When you click **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**. 

    >[!div class="mx-imgBorder"]
    >![Instrument your web app](./media/azure-web-apps/ai-create-new.png)

2. After specifying which resource to use, you can choose how you want Application Insights to collect data per platform for your application. ASP.NET Core offers **Recommended collection** or **Disabled** for ASP.NET Core 3.1.

    ![Choose options per platform.](./media/azure-web-apps/choose-options-new-net-core.png)

---

## Enable client-side monitoring

# [ASP.NET](#tab/net)

Client-side monitoring is opt-in for ASP.NET. To enable client-side monitoring:

* **Settings** **>** **Configuration**
   * Under Application settings, create a **new application setting**:

     Name: `APPINSIGHTS_JAVASCRIPT_ENABLED`

     Value: `true`

   * **Save** the settings and **Restart** your app.

To disable client-side monitoring either remove the associated key value pair from the Application settings, or set the value to false.

# [ASP.NET Core](#tab/netcore)

Client-side monitoring is **enabled by default** for ASP.NET Core apps with **Recommended collection**, regardless of whether the app setting 'APPINSIGHTS_JAVASCRIPT_ENABLED' is present.

If for some reason you would like to disable client-side monitoring:

* **Settings** **>** **Configuration**
   * Under Application settings, create a **new application setting**:

     name: `APPINSIGHTS_JAVASCRIPT_ENABLED`

     Value: `false`

   * **Save** the settings and **Restart** your app.
---

[!INCLUDE [azure-web-apps-automate-monitoring](../includes/azure-web-apps-automate-monitoring.md)]


### Enabling through PowerShell

In order to enable the application monitoring through PowerShell, only the underlying application settings need to be changed. Below is a sample, which enables application monitoring for a website called "AppMonitoredSite" in the resource group "AppMonitoredRG", and configures data to be sent to the "012345678-abcd-ef01-2345-6789abcd" instrumentation key.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

```powershell
$app = Get-AzWebApp -ResourceGroupName "AppMonitoredRG" -Name "AppMonitoredSite" -ErrorAction Stop
$newAppSettings = @{} # case-insensitive hash map
$app.SiteConfig.AppSettings | %{$newAppSettings[$_.Name] = $_.Value} # preserve non Application Insights application settings.
$newAppSettings["APPINSIGHTS_INSTRUMENTATIONKEY"] = "012345678-abcd-ef01-2345-6789abcd"; # set the Application Insights instrumentation key
$newAppSettings["APPLICATIONINSIGHTS_CONNECTION_STRING"] = "InstrumentationKey=012345678-abcd-ef01-2345-6789abcd"; # set the Application Insights connection string
$newAppSettings["ApplicationInsightsAgent_EXTENSION_VERSION"] = "~2"; # enable the ApplicationInsightsAgent
$app = Set-AzWebApp -AppSettings $newAppSettings -ResourceGroupName $app.ResourceGroup -Name $app.Name -ErrorAction Stop
```

## Upgrade monitoring extension/agent - .NET 

### Upgrading from versions 2.8.9 and up

Upgrading from version 2.8.9 happens automatically, without any additional actions. The new monitoring bits are delivered in the background to the target app service, and on application restart they will be picked up.

To check which version of the extension you're running, go to `https://yoursitename.scm.azurewebsites.net/ApplicationInsights`.

![Screenshot of the U R L path to check the version of the extension you are running](./media/azure-web-apps/extension-version.png)

### Upgrade from versions 1.0.0 - 2.6.5

Starting with version 2.8.9 the pre-installed site extension is used. If you are an earlier version, you can update via one of two ways:

* [Upgrade by enabling via the portal](#enable-application-insights). (Even if you have the Application Insights extension for Azure App Service installed, the UI shows only **Enable** button. Behind the scenes, the old private site extension will be removed.)

* [Upgrade through PowerShell](#enabling-through-powershell):

    1. Set the application settings to enable the pre-installed site extension ApplicationInsightsAgent. See [Enabling through PowerShell](#enabling-through-powershell).
    2. Manually remove the private site extension named Application Insights extension for Azure App Service.

If the upgrade is done from a version prior to 2.5.1, check that the ApplicationInsigths dlls are removed from the application bin folder [see troubleshooting steps](#troubleshooting).

## Troubleshooting

Below is our step-by-step troubleshooting guide for extension/agent based monitoring for ASP.NET and ASP.NET Core based applications running on Azure App Services.

# [Windows](#tab/windows)
1. Check that `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of "~2".
2. Browse to `https://yoursitename.scm.azurewebsites.net/ApplicationInsights`.  

    ![Screenshot of https://yoursitename.scm.azurewebsites/applicationinsights results page](./media/azure-web-apps/app-insights-sdk-status.png)
    
    - Confirm that the `Application Insights Extension Status` is `Pre-Installed Site Extension, version 2.8.x.xxxx, is running.` 
    
         If it is not running, follow the [enable Application Insights monitoring instructions](#enable-application-insights).

    - Confirm that the status source exists and looks like: `Status source D:\home\LogFiles\ApplicationInsights\status\status_RD0003FF0317B6_4248_1.json`

         If a similar value is not present, it means the application is not currently running or is not supported. To ensure that the application is running, try manually visiting the application url/application endpoints, which will allow the runtime information to become available.

    - Confirm that `IKeyExists` is `true`
        If it is `false`, add `APPINSIGHTS_INSTRUMENTATIONKEY` and `APPLICATIONINSIGHTS_CONNECTION_STRING` with your ikey guid to your application settings.

    - **For ASP.NET apps only** confirm that there are no entries for `AppAlreadyInstrumented`, `AppContainsDiagnosticSourceAssembly`, and `AppContainsAspNetTelemetryCorrelationAssembly`.

         If any of these entries exist, remove the following packages from your application: `Microsoft.ApplicationInsights`, `System.Diagnostics.DiagnosticSource`, and `Microsoft.AspNet.TelemetryCorrelation`.

    - **For ASP.NET Core apps only**: in case your application refers to any Application Insights packages, for example if you have previously instrumented (or attempted to instrument) your app with the [ASP.NET Core SDK](./asp-net-core.md), enabling the App Service integration may not take effect and the data may not appear in Application Insights. To fix the issue, in portal turn on "Interop with Application Insights SDK" and you will start seeing the data in Application Insights. 
        > [!IMPORTANT]
        > This functionality is in preview 

        ![Enable the setting the existing app](./media/azure-web-apps/netcore-sdk-interop.png)

        The data is now going to be sent using codeless approach even if Application Insights SDK was originally used or attempted to be used.

        > [!IMPORTANT]
        > If the application used Application Insights SDK to send any telemetry, such telemetry will be disabled – in other words, custom telemetry - if any, such as for example any Track*() methods, and any custom settings, such as sampling, will be disabled. 

# [Linux](#tab/linux)

1. Check that `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of "~3".
2. Navigate to */home\LogFiles\ApplicationInsights\status* and open *status_557de146e7fa_27_1.json*.

    Confirm that `AppAlreadyInstrumented` is set to false, `AiHostingStartupLoaded` to true and `IKeyExists` to true.

    Below is an example of the JSON file:

    ```json
        "AppType":".NETCoreApp,Version=v6.0",
                
        "MachineName":"557de146e7fa",
                
        "PID":"27",
                
        "AppDomainId":"1",
                
        "AppDomainName":"dotnet6demo",
                
        "InstrumentationEngineLoaded":false,
                
        "InstrumentationEngineExtensionLoaded":false,
                
        "HostingStartupBootstrapperLoaded":true,
                
        "AppAlreadyInstrumented":false,
                
        "AppDiagnosticSourceAssembly":"System.Diagnostics.DiagnosticSource, Version=6.0.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51",
                
        "AiHostingStartupLoaded":true,
                
        "IKeyExists":true,
                
        "IKey":"00000000-0000-0000-0000-000000000000",
                
        "ConnectionString":"InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://westus-0.in.applicationinsights.azure.com/"
    
    ```
    
    If `AppAlreadyInstrumented` is true this indicates that the extension detected that some aspect of the SDK is already present in the Application, and will back-off.

##### No Data

1. List and identify the process that is hosting an app. Navigate to your terminal and on the command line type `ps ax`. 
    
    The output should be similar to: 

   ```bash
     PID TTY      STAT   TIME COMMAND
    
        1 ?        SNs    0:00 /bin/bash /opt/startup/startup.sh
    
       19 ?        SNs    0:00 /usr/sbin/sshd
    
       27 ?        SNLl   5:52 dotnet dotnet6demo.dll
    
       50 ?        SNs    0:00 sshd: root@pts/0
    
       53 pts/0    SNs+   0:00 -bash
    
       55 ?        SNs    0:00 sshd: root@pts/1
    
       57 pts/1    SNs+   0:00 -bash
   ``` 


1. Then list environment variables from app process. On the command line type `cat /proc/27/environ | tr '\0' '\n`.
    
    The output should be similar to: 

    ```bash
    ASPNETCORE_HOSTINGSTARTUPASSEMBLIES=Microsoft.ApplicationInsights.StartupBootstrapper
    
    DOTNET_STARTUP_HOOKS=/DotNetCoreAgent/2.8.39/StartupHook/Microsoft.ApplicationInsights.StartupHook.dll
    
    APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://westus-0.in.applicationinsights.azure.com/
    
    ```
    

1. Validate that `ASPNETCORE_HOSTINGSTARTUPASSEMBLIES`, `DOTNET_STARTUP_HOOKS` and `APPLICATIONINSIGHTS_CONNECTION_STRING` are set.
---

#### Default website deployed with web apps does not support automatic client-side monitoring

When you create a web app with the `ASP.NET` or `ASP.NET Core` runtimes in Azure App Services it deploys a single static HTML page as a starter website. The static webpage also loads a ASP.NET managed web part in IIS. This allows for testing codeless server-side monitoring, but does not support automatic client-side monitoring.

If you wish to test out codeless server and client-side monitoring for ASP.NET or ASP.NET Core in a Azure App Services web app we recommend following the official guides for [creating a ASP.NET Core web app](../../app-service/quickstart-dotnetcore.md) and [creating an ASP.NET Framework web app](../../app-service/quickstart-dotnetcore.md?tabs=netframework48) and then use the instructions in the current article to enable monitoring.


### PHP and WordPress are not supported

PHP and WordPress sites are not supported. There is currently no officially supported SDK/agent for server-side monitoring of these workloads. However, manually instrumenting client-side transactions on a PHP or WordPress site by adding the client-side JavaScript to your web pages can be accomplished by using the [JavaScript SDK](./javascript.md).

The table below provides a more detailed explanation of what these values mean, their underlying causes, and recommended fixes:

|Problem Value|Explanation|Fix
|---- |----|---|
| `AppAlreadyInstrumented:true` | This value indicates that the extension detected that some aspect of the SDK is already present in the Application, and will back-off. It can be due to a reference to `System.Diagnostics.DiagnosticSource`,  `Microsoft.AspNet.TelemetryCorrelation`, or `Microsoft.ApplicationInsights`  | Remove the references. Some of these references are added by default from certain Visual Studio templates, and older versions of Visual Studio may add references to `Microsoft.ApplicationInsights`.
|`AppAlreadyInstrumented:true` | If the application is targeting ASP.NET Core 2.1 or 2.2, this value indicates that the extension detected that some aspect of the SDK is already present in the Application, and will back-off | Customers on .NET Core 2.1,2.2 are [recommended](https://github.com/aspnet/Announcements/issues/287) to use Microsoft.AspNetCore.App meta-package instead. In addition, turn on "Interop with Application Insights SDK" in portal (see the instructions above).|
|`AppAlreadyInstrumented:true` | This value can also be caused by the presence of the above dlls in the app folder from a previous deployment. | Clean the app folder to ensure that these dlls are removed. Check both your local app's bin directory, and the wwwroot directory on the App Service. (To check the wwwroot directory of your App Service web app: Advanced Tools (Kudu) > Debug console > CMD > home\site\wwwroot).
|`AppContainsAspNetTelemetryCorrelationAssembly: true` | This value indicates that extension detected references to `Microsoft.AspNet.TelemetryCorrelation` in the application, and will back-off. | Remove the reference.
|`AppContainsDiagnosticSourceAssembly**:true`|This value indicates that extension detected references to `System.Diagnostics.DiagnosticSource` in the application, and will back-off.| For ASP.NET remove the reference. 
|`IKeyExists:false`|This value indicates that the instrumentation key is not present in the AppSetting, `APPINSIGHTS_INSTRUMENTATIONKEY`. Possible causes: The values may have been accidentally removed, forgot to set the values in automation script, etc. | Make sure the setting is present in the App Service application settings.

### APPINSIGHTS_JAVASCRIPT_ENABLED and urlCompression is not supported

If you use APPINSIGHTS_JAVASCRIPT_ENABLED=true in cases where content is encoded, you might get errors like: 

- 500 URL rewrite error
- 500.53 URL rewrite module error with message Outbound rewrite rules cannot be applied when the content of the HTTP response is encoded ('gzip'). 

This is due to the APPINSIGHTS_JAVASCRIPT_ENABLED application setting being set to true and content-encoding being present at the same time. This scenario is not supported yet. The workaround is to remove APPINSIGHTS_JAVASCRIPT_ENABLED from your application settings. Unfortunately this means that if client/browser-side JavaScript instrumentation is still required, manual SDK references are needed for your webpages. Follow the [instructions](https://github.com/Microsoft/ApplicationInsights-JS#snippet-setup-ignore-if-using-npm-setup) for manual instrumentation with the JavaScript SDK.

For the latest information on the Application Insights agent/extension, check out the [release notes](https://github.com/MohanGsk/ApplicationInsights-Home/blob/master/app-insights-web-app-extensions-releasenotes.md).


[!INCLUDE [azure-web-apps-footer](../includes/azure-web-apps-footer.md)]