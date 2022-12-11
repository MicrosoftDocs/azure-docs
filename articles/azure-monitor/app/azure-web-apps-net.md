---
title: Monitor Azure app services performance ASP.NET | Microsoft Docs
description: Application performance monitoring for Azure app services using ASP.NET. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 08/24/2022
ms.devlang: javascript
ms.custom: devx-track-dotnet
ms.reviewer: abinetabate
---

# Application Monitoring for Azure App Service and ASP.NET 

Enabling monitoring on your ASP.NET based web applications running on [Azure App Services](../../app-service/index.yml) is now easier than ever. Whereas previously you needed to manually instrument your app, the latest extension/agent is now built into the App Service image by default. This article will walk you through enabling Azure Monitor application Insights monitoring as well as provide preliminary guidance for automating the process for large-scale deployments.

> [!NOTE]
> Manually adding an Application Insights site extension via **Development Tools** > **Extensions** is deprecated. This method of extension installation was dependent on manual updates for each new version. The latest stable release of the extension is now  [preinstalled](https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions) as part of the App Service image. The files are located in `d:\Program Files (x86)\SiteExtensions\ApplicationInsightsAgent` and are automatically updated with each stable release. If you follow the auto-instrumentation instructions to enable monitoring below, it will automatically remove the deprecated extension for you.

> [!NOTE]
> If both auto-instrumentation monitoring and manual SDK-based instrumentation are detected, only the manual instrumentation settings will be honored. This is to prevent duplicate data from being sent. To learn more about this, check out the [troubleshooting section](#troubleshooting) below.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Enable auto-instrumentation monitoring

For a complete list of supported auto-instrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

> [!NOTE]
> The combination of APPINSIGHTS_JAVASCRIPT_ENABLED and urlCompression is not supported. For more info see the explanation in the [troubleshooting section](#appinsights_javascript_enabled-and-urlcompression-isnt-supported).

1. **Select Application Insights** in the Azure control panel for your app service, then select **Enable**.

    :::image type="content"source="./media/azure-web-apps/enable.png" alt-text="Screenshot of Application Insights tab with enable selected."::: 

2. Choose to create a new resource, or select an existing Application Insights resource for this application. 

    > [!NOTE]
    > When you click **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**. 

     :::image type="content"source="./media/azure-web-apps/change-resource.png" alt-text="Screenshot of Change your resource dropdown."::: 

3. After specifying which resource to use, you can choose how you want application insights to collect data per platform for your application. ASP.NET app monitoring is on-by-default with two different levels of collection.

    :::image type="content"source="./media/azure-web-apps-net/instrument-net.png" alt-text="Screenshot shows the Application Insights site extensions page with Create new resource selected."::: 
 
     Below is a summary of data collected for each route:
            
    | Data | ASP.NET Basic Collection | ASP.NET Recommended collection |
    | --- | --- | --- |
    | Adds CPU, memory, and I/O usage trends |No |Yes |
    | Collects usage trends, and enables correlation from availability results to transactions | Yes |Yes |
    | Collects exceptions unhandled by the host process | Yes |Yes |
    | Improves APM metrics accuracy under load, when sampling is used | Yes |Yes |
    | Correlates micro-services across request/dependency boundaries | No (single-instance APM capabilities only) |Yes |

4. To configure sampling, which you could previously control via the applicationinsights.config file you can now interact with it via Application settings with the corresponding prefix `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor`. 

    - For example, to change the initial sampling percentage, you can create an Application setting of: `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_InitialSamplingPercentage` and a value of `100`.
    - To disable sampling, set `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_MinSamplingPercentage` to a value of `100`.
    - Supported settings include:
        - `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_InitialSamplingPercentage`
        - `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_MinSamplingPercentage`
        - `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_EvaluationInterval`
        - `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_MaxTelemetryItemsPerSecond`
        
    - For the list of supported adaptive sampling telemetry processor settings and definitions, you can consult the [code](https://github.com/microsoft/ApplicationInsights-dotnet/blob/master/BASE/Test/ServerTelemetryChannel.Test/TelemetryChannel.Tests/AdaptiveSamplingTelemetryProcessorTest.cs) and [sampling documentation](./sampling.md#configuring-adaptive-sampling-for-aspnet-applications).


## Enable client-side monitoring

Client-side monitoring is opt-in for ASP.NET. To enable client-side monitoring:

* **Settings** **>** **Configuration**
   * Under Application settings, create a **new application setting**:

     Name: `APPINSIGHTS_JAVASCRIPT_ENABLED`

     Value: `true`

   * **Save** the settings and **Restart** your app.

To disable client-side monitoring either remove the associated key value pair from the Application settings, or set the value to false.

## Automate monitoring

In order to enable telemetry collection with Application Insights, only the Application settings need to be set:

:::image type="content"source="./media/azure-web-apps-net/application-settings-net.png" alt-text="Screenshot of App Service Application Settings with Application Insights settings."::: 

### Application settings definitions

|App setting name |  Definition | Value |
|-----------------|:------------|-------------:|
|ApplicationInsightsAgent_EXTENSION_VERSION | Main extension, which controls runtime monitoring. | `~2` |
|XDT_MicrosoftApplicationInsights_Mode |  In default mode, only essential features are enabled in order to ensure optimal performance. | `default` or `recommended`. |
|InstrumentationEngine_EXTENSION_VERSION | Controls if the binary-rewrite engine `InstrumentationEngine` will be turned on. This setting has performance implications and impacts cold start/startup time. | `~1` |
|XDT_MicrosoftApplicationInsights_BaseExtensions | Controls if SQL & Azure table text will be captured along with the dependency calls. Performance warning: application cold startup time will be affected. This setting requires the `InstrumentationEngine`. | `~1` |

[!INCLUDE [azure-web-apps-arm-automation](../../../includes/azure-monitor-app-insights-azure-web-apps-arm-automation.md)]


## Upgrade monitoring extension/agent - .NET 

### Upgrade from versions 2.8.9 and up

Upgrading from version 2.8.9 happens automatically, without any extra actions. The new monitoring bits are delivered in the background to the target app service, and on application restart they'll be picked up.

To check which version of the extension you're running, go to `https://scm.yoursitename.azurewebsites.net/ApplicationInsights`.

:::image type="content"source="./media/azure-web-apps/extension-version.png" alt-text="Screenshot of the URL path to check the version of the extension you're running." border="false"::: 

### Upgrade from versions 1.0.0 - 2.6.5

Starting with version 2.8.9 the pre-installed site extension is used. If you're an earlier version, you can update via one of two ways:

* [Upgrade by enabling via the portal](#enable-auto-instrumentation-monitoring). (Even if you have the Application Insights extension for Azure App Service installed, the UI shows only **Enable** button. Behind the scenes, the old private site extension will be removed.)

* [Upgrade through PowerShell](#enable-through-powershell):

    1. Set the application settings to enable the pre-installed site extension ApplicationInsightsAgent. See [Enable through PowerShell](#enable-through-powershell).
    2. Manually remove the private site extension named Application Insights extension for Azure App Service.

If the upgrade is done from a version prior to 2.5.1, check that the ApplicationInsigths dlls are removed from the application bin folder [see troubleshooting steps](#troubleshooting).

## Troubleshooting

> [!NOTE]
> When you create a web app with the `ASP.NET` runtimes in Azure App Services it deploys a single static HTML page as a starter website. It is **not** recommended to troubleshoot an issue with default template. Deploy an application before troubleshooting an issue.

Below is our step-by-step troubleshooting guide for extension/agent based monitoring for ASP.NET based applications running on Azure App Services.

1. Check that `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of "~2".
2. Browse to `https://scm.yoursitename.azurewebsites.net/ApplicationInsights`.  

    :::image type="content"source="./media/azure-web-apps/app-insights-sdk-status.png" alt-text="Screenshot of the link above results page."border ="false"::: 
    
    - Confirm that the `Application Insights Extension Status` is `Pre-Installed Site Extension, version 2.8.x.xxxx, is running.` 
    
         If it isn't running, follow the [enable Application Insights monitoring instructions](#enable-auto-instrumentation-monitoring).

    - Confirm that the status source exists and looks like: `Status source D:\home\LogFiles\ApplicationInsights\status\status_RD0003FF0317B6_4248_1.json`

         If a similar value isn't present, it means the application isn't currently running or isn't supported. To ensure that the application is running, try manually visiting the application url/application endpoints, which will allow the runtime information to become available.

    - Confirm that `IKeyExists` is `true`
        If not, add `APPINSIGHTS_INSTRUMENTATIONKEY` and `APPLICATIONINSIGHTS_CONNECTION_STRING` with your ikey guid to your application settings.

    - Confirm that there are no entries for `AppAlreadyInstrumented`, `AppContainsDiagnosticSourceAssembly`, and `AppContainsAspNetTelemetryCorrelationAssembly`.

         If any of these entries exist, remove the following packages from your application: `Microsoft.ApplicationInsights`, `System.Diagnostics.DiagnosticSource`, and `Microsoft.AspNet.TelemetryCorrelation`.

### Default website deployed with web apps does not support automatic client-side monitoring

When you create a web app with the `ASP.NET` runtimes in Azure App Services it deploys a single static HTML page as a starter website. The static webpage also loads a ASP.NET managed web part in IIS. This allows for testing codeless server-side monitoring, but doesn't support automatic client-side monitoring.

If you wish to test out codeless server and client-side monitoring for ASP.NET  in an Azure App Services web app, we recommend following the official guides for [creating an ASP.NET Framework web app](../../app-service/quickstart-dotnetcore.md?tabs=netframework48) and then use the instructions in the current article to enable monitoring.

### APPINSIGHTS_JAVASCRIPT_ENABLED and urlCompression isn't supported

If you use APPINSIGHTS_JAVASCRIPT_ENABLED=true in cases where content is encoded, you might get errors like:

- 500 URL rewrite error
- 500.53 URL rewrite module error with message Outbound rewrite rules can't be applied when the content of the HTTP response is encoded ('gzip').

This is due to the APPINSIGHTS_JAVASCRIPT_ENABLED application setting being set to true and content-encoding being present at the same time. This scenario isn't supported yet. The workaround is to remove APPINSIGHTS_JAVASCRIPT_ENABLED from your application settings. Unfortunately this means that if client/browser-side JavaScript instrumentation is still required, manual SDK references are needed for your webpages. Follow the [instructions](https://github.com/Microsoft/ApplicationInsights-JS#snippet-setup-ignore-if-using-npm-setup) for manual instrumentation with the JavaScript SDK.

For the latest information on the Application Insights agent/extension, check out the [release notes](https://github.com/MohanGsk/ApplicationInsights-Home/blob/master/app-insights-web-app-extensions-releasenotes.md).

[!INCLUDE [azure-web-apps-troubleshoot](../../../includes/azure-monitor-app-insights-azure-web-apps-troubleshoot.md)]

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

### PHP and WordPress are not supported

PHP and WordPress sites are not supported. There is currently no officially supported SDK/agent for server-side monitoring of these workloads. However, manually instrumenting client-side transactions on a PHP or WordPress site by adding the client-side JavaScript to your web pages can be accomplished by using the [JavaScript SDK](./javascript.md).

The table below provides a more detailed explanation of what these values mean, their underlying causes, and recommended fixes:

|Problem Value|Explanation|Fix
|---- |----|---|
| `AppAlreadyInstrumented:true` | This value indicates that the extension detected that some aspect of the SDK is already present in the Application, and will back-off. It can be due to a reference to `System.Diagnostics.DiagnosticSource`,  `Microsoft.AspNet.TelemetryCorrelation`, or `Microsoft.ApplicationInsights`  | Remove the references. Some of these references are added by default from certain Visual Studio templates, and older versions of Visual Studio may add references to `Microsoft.ApplicationInsights`.
|`AppAlreadyInstrumented:true` | This value can also be caused by the presence of the above dlls in the app folder from a previous deployment. | Clean the app folder to ensure that these dlls are removed. Check both your local app's bin directory, and the wwwroot directory on the App Service. (To check the wwwroot directory of your App Service web app: Advanced Tools (Kudu) > Debug console > CMD > home\site\wwwroot).
|`AppContainsAspNetTelemetryCorrelationAssembly: true` | This value indicates that extension detected references to `Microsoft.AspNet.TelemetryCorrelation` in the application, and will back-off. | Remove the reference.
|`AppContainsDiagnosticSourceAssembly**:true`|This value indicates that extension detected references to `System.Diagnostics.DiagnosticSource` in the application, and will back-off.| For ASP.NET remove the reference. 
|`IKeyExists:false`|This value indicates that the instrumentation key isn't present in the AppSetting, `APPINSIGHTS_INSTRUMENTATIONKEY`. Possible causes: The values may have been accidentally removed, forgot to set the values in automation script, etc. | Make sure the setting is present in the App Service application settings.

### System.IO.FileNotFoundException after 2.8.44 upgrade

2.8.44 version of auto instrumentation upgrades Application Insights SDK to 2.20.0. Application Insights SDK has an indirect reference to `System.Runtime.CompilerServices.Unsafe.dll` through `System.Diagnostics.DiagnosticSource.dll`. If application has [binding redirect](https://learn.microsoft.com/dotnet/framework/configure-apps/file-schema/runtime/bindingredirect-element) for `System.Runtime.CompilerServices.Unsafe.dll` and if this library is not present in application folder it may throw `System.IO.FileNotFoundException`.

To resolve this issue, remove the binding redirect entry for `System.Runtime.CompilerServices.Unsafe.dll` from web.config file. If the application wanted to use `System.Runtime.CompilerServices.Unsafe.dll` then set the binding redirect as below.

```  
<dependentAssembly>
	<assemblyIdentity name="System.Runtime.CompilerServices.Unsafe" publicKeyToken="b03f5f7f11d50a3a" culture="neutral" />
	<bindingRedirect oldVersion="0.0.0.0-4.0.4.1" newVersion="4.0.4.1" />
</dependentAssembly>
```

As a temporary workaround, you could set the app setting, ApplicationInsightsAgent_EXTENSION_VERSION to a value of 2.8.37. This will trigger App Service to use the old Application Insights extension. Please note that temporary mitigations should only be used as an interim.

## Release notes

For the latest updates and bug fixes [consult the release notes](web-app-extension-release-notes.md).

## Next steps

* [Run the profiler on your live app](./profiler.md).
* [Monitor Azure Functions with Application Insights](monitor-functions.md).
* [Enable Azure diagnostics](../agents/diagnostics-extension-to-application-insights.md) to be sent to Application Insights.
* [Monitor service health metrics](../data-platform.md) to make sure your service is available and responsive.
* [Receive alert notifications](../alerts/alerts-overview.md) whenever operational events happen or metrics cross a threshold.
* Use [Application Insights for JavaScript apps and web pages](javascript.md) to get client telemetry from the browsers that visit a web page.
* [Set up Availability web tests](monitor-web-app-availability.md) to be alerted if your site is down.
