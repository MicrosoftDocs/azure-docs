---
title: Monitor Azure app services performance ASP.NET | Microsoft Docs
description: Learn about application performance monitoring for Azure app services by using ASP.NET. Chart load and response time and dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 03/22/2023
ms.devlang: javascript
ms.custom: devx-track-dotnet
ms.reviewer: abinetabate
---

# Application monitoring for Azure App Service and ASP.NET

Enabling monitoring on your ASP.NET-based web applications running on [Azure App Service](../../app-service/index.yml) is now easier than ever. Previously, you needed to manually instrument your app. Now the latest extension/agent is built into the App Service image by default. This article will walk you through enabling Azure Monitor Application Insights monitoring and provide preliminary guidance for automating the process for large-scale deployments.

> [!NOTE]
> Manually adding an Application Insights site extension via **Development Tools** > **Extensions** is deprecated. This method of extension installation was dependent on manual updates for each new version. The latest stable release of the extension is now [preinstalled](https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions) as part of the App Service image. The files are located in *d:\Program Files (x86)\SiteExtensions\ApplicationInsightsAgent* and are automatically updated with each stable release. If you follow the autoinstrumentation instructions to enable monitoring, it will automatically remove the deprecated extension for you.

If both autoinstrumentation monitoring and manual SDK-based instrumentation are detected, only the manual instrumentation settings will be honored. This arrangement prevents duplicate data from being sent. To learn more, see the [Troubleshooting section](#troubleshooting).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Enable autoinstrumentation monitoring

For a complete list of supported autoinstrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

> [!NOTE]
> The combination of `APPINSIGHTS_JAVASCRIPT_ENABLED` and `urlCompression` isn't supported. For more information, see the explanation in the [Troubleshooting section](#appinsights_javascript_enabled-and-urlcompression-isnt-supported).

1. **Select Application Insights** in the Azure control panel for your app service. Then select **Enable**.

    :::image type="content"source="./media/azure-web-apps/enable.png" alt-text="Screenshot that shows the Application Insights tab with Enable selected.":::

1. Choose to create a new resource, or select an existing Application Insights resource for this application.

    > [!NOTE]
    > When you select **OK** to create the new resource, you're prompted to select **Apply monitoring settings**. Selecting **Continue** links your new Application Insights resource to your app service. Doing so also triggers a restart of your app service.

     :::image type="content"source="./media/azure-web-apps/change-resource.png" alt-text="Screenshot that shows the Change your resource dropdown.":::

1. After you specify which resource to use, you can choose how you want Application Insights to collect data per platform for your application. ASP.NET app monitoring is on by default with two different levels of collection.

    :::image type="content"source="./media/azure-web-apps-net/instrument-net.png" alt-text="Screenshot that shows the Application Insights site extensions page with Create new resource selected.":::

     The following table summarizes the data that's collected for each route.
            
    | Data | ASP.NET basic collection | ASP.NET recommended collection |
    | --- | --- | --- |
    | Adds CPU, memory, and I/O usage trends |No |Yes |
    | Collects usage trends, and enables correlation from availability results to transactions | Yes |Yes |
    | Collects exceptions unhandled by the host process | Yes |Yes |
    | Improves APM metrics accuracy under load, when sampling is used | Yes |Yes |
    | Correlates micro-services across request/dependency boundaries | No (single-instance APM capabilities only) |Yes |

1. To configure sampling, which you could previously control via the *applicationinsights.config* file, you can now interact with it via application settings with the corresponding prefix `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor`.

    - For example, to change the initial sampling percentage, you can create an application setting of `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_InitialSamplingPercentage` and a value of `100`.
    - To disable sampling, set `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_MinSamplingPercentage` to a value of `100`.
    - Supported settings include:
        - `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_InitialSamplingPercentage`
        - `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_MinSamplingPercentage`
        - `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_EvaluationInterval`
        - `MicrosoftAppInsights_AdaptiveSamplingTelemetryProcessor_MaxTelemetryItemsPerSecond`

    - For the list of supported adaptive sampling telemetry processor settings and definitions, see the [code](https://github.com/microsoft/ApplicationInsights-dotnet/blob/master/BASE/Test/ServerTelemetryChannel.Test/TelemetryChannel.Tests/AdaptiveSamplingTelemetryProcessorTest.cs) and [sampling documentation](./sampling.md#configuring-adaptive-sampling-for-aspnet-applications).

## Enable client-side monitoring

Client-side monitoring is an opt-in for ASP.NET. To enable client-side monitoring:

1. Select **Settings** > **Configuration**.
1. Under **Application settings**, create a new application setting:

     - **Name**: Enter **APPINSIGHTS_JAVASCRIPT_ENABLED**.
     - **Value**: Enter **true**.

1. Save the settings and restart your app.

To disable client-side monitoring, either remove the associated key value pair from **Application settings** or set the value to **false**.

## Automate monitoring

To enable telemetry collection with Application Insights, only application settings need to be set.

:::image type="content"source="./media/azure-web-apps-net/application-settings-net.png" alt-text="Screenshot that shows App Service application settings with Application Insights settings.":::

### Application settings definitions

|App setting name |  Definition | Value |
|-----------------|:------------|-------------:|
|ApplicationInsightsAgent_EXTENSION_VERSION | Main extension, which controls runtime monitoring. | `~2` |
|XDT_MicrosoftApplicationInsights_Mode |  In default mode, only essential features are enabled to ensure optimal performance. | `default` or `recommended` |
|InstrumentationEngine_EXTENSION_VERSION | Controls if the binary-rewrite engine `InstrumentationEngine` will be turned on. This setting has performance implications and affects cold start/startup time. | `~1` |
|XDT_MicrosoftApplicationInsights_BaseExtensions | Controls if SQL and Azure table text will be captured along with the dependency calls. Performance warning: Application cold startup time will be affected. This setting requires the `InstrumentationEngine`. | `~1` |

[!INCLUDE [azure-web-apps-arm-automation](../../../includes/azure-monitor-app-insights-azure-web-apps-arm-automation.md)]

## Upgrade monitoring extension/agent: .NET

### Upgrade from versions 2.8.9 and up

Upgrading from version 2.8.9 happens automatically, without any extra actions. The new monitoring bits are delivered in the background to the target app service. They'll be picked when the application restarts.

To check which version of the extension you're running, go to `https://yoursitename.scm.azurewebsites.net/ApplicationInsights`.

:::image type="content"source="./media/azure-web-apps/extension-version.png" alt-text="Screenshot that shows the URL path to check the version of the extension you're running." border="false":::

### Upgrade from versions 1.0.0 - 2.6.5

Starting with version 2.8.9, the preinstalled site extension is used. If you're on an earlier version, you can update via one of two ways:

* [Upgrade by enabling via the portal](#enable-autoinstrumentation-monitoring): Even if you have the Application Insights extension for App Service installed. The UI shows only the **Enable** button. Behind the scenes, the old private site extension will be removed.
* [Upgrade through PowerShell](#enable-through-powershell):

    1. Set the application settings to enable the preinstalled site extension `ApplicationInsightsAgent`. For more information, see [Enable through PowerShell](#enable-through-powershell).
    1. Manually remove the private site extension named Application Insights extension for App Service.

If the upgrade is done from a version prior to 2.5.1, check that the Application Insights DLLs are removed from the application bin folder. For more information, see the steps in the [Troubleshooting section](#troubleshooting).

## Troubleshooting

> [!NOTE]
> When you create a web app with the `ASP.NET` runtimes in App Service, it deploys a single static HTML page as a starter website. We do *not* recommend that you troubleshoot an issue with a default template. Deploy an application before you troubleshoot an issue.

Here's our step-by-step troubleshooting guide for extension/agent-based monitoring for ASP.NET-based applications running on App Service.

1. Check that the `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of `~2`.
1. Browse to `https://yoursitename.scm.azurewebsites.net/ApplicationInsights`.  

    :::image type="content"source="./media/azure-web-apps/app-insights-sdk-status.png" alt-text="Screenshot that shows the preceding link's results page."border ="false":::

    - Confirm that `Application Insights Extension Status` is `Pre-Installed Site Extension, version 2.8.x.xxxx` and is running.

         If it isn't running, follow the instructions to [enable Application Insights monitoring](#enable-autoinstrumentation-monitoring).

    - Confirm that the status source exists and looks like `Status source D:\home\LogFiles\ApplicationInsights\status\status_RD0003FF0317B6_4248_1.json`.

         If a similar value isn't present, it means the application isn't currently running or isn't supported. To ensure that the application is running, try manually visiting the application URL/application endpoints, which will allow the runtime information to become available.

    - Confirm that `IKeyExists` is `true`.
        If not, add `APPINSIGHTS_INSTRUMENTATIONKEY` and `APPLICATIONINSIGHTS_CONNECTION_STRING` with your instrumentation key GUID to your application settings.

    - Confirm that there are no entries for `AppAlreadyInstrumented`, `AppContainsDiagnosticSourceAssembly`, and `AppContainsAspNetTelemetryCorrelationAssembly`.

         If any of these entries exist, remove the following packages from your application: `Microsoft.ApplicationInsights`, `System.Diagnostics.DiagnosticSource`, and `Microsoft.AspNet.TelemetryCorrelation`.

### Default website deployed with web apps doesn't support automatic client-side monitoring

When you create a web app with the `ASP.NET` runtimes in App Service, it deploys a single static HTML page as a starter website. The static webpage also loads an ASP.NET-managed web part in IIS. This page allows for testing codeless server-side monitoring but doesn't support automatic client-side monitoring.

If you want to test out codeless server and client-side monitoring for ASP.NET in an App Service web app, we recommend that you follow the official guides for [creating an ASP.NET Framework web app](../../app-service/quickstart-dotnetcore.md?tabs=netframework48). Then use the instructions in the current article to enable monitoring.

### APPINSIGHTS_JAVASCRIPT_ENABLED and urlCompression isn't supported

If you use `APPINSIGHTS_JAVASCRIPT_ENABLED=true` in cases where content is encoded, you might get errors like:

- 500 URL rewrite error.
- 500.53 URL rewrite module error with the message "Outbound rewrite rules can't be applied when the content of the HTTP response is encoded ('gzip')."

An error occurs because the `APPINSIGHTS_JAVASCRIPT_ENABLED` application setting is set to `true` and content encoding is present at the same time. This scenario isn't supported yet. The workaround is to remove `APPINSIGHTS_JAVASCRIPT_ENABLED` from your application settings. Unfortunately, if client/browser-side JavaScript instrumentation is still required, manual SDK references are needed for your webpages. Follow the [instructions](https://github.com/Microsoft/ApplicationInsights-JS#snippet-setup-ignore-if-using-npm-setup) for manual instrumentation with the JavaScript SDK.

For the latest information on the Application Insights agent/extension, see the [release notes](https://github.com/MohanGsk/ApplicationInsights-Home/blob/master/app-insights-web-app-extensions-releasenotes.md).

[!INCLUDE [azure-web-apps-troubleshoot](../../../includes/azure-monitor-app-insights-azure-web-apps-troubleshoot.md)]

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

### PHP and WordPress aren't supported

PHP and WordPress sites aren't supported. There's currently no officially supported SDK/agent for server-side monitoring of these workloads. You can manually instrument client-side transactions on a PHP or WordPress site by adding the client-side JavaScript to your webpages by using the [JavaScript SDK](./javascript.md).

The following table provides a more detailed explanation of what these values mean, their underlying causes, and recommended fixes.

|Problem value|Explanation|Fix
|---- |----|---|
| `AppAlreadyInstrumented:true` | This value indicates that the extension detected that some aspect of the SDK is already present in the application and will back off. It can be because of a reference to `System.Diagnostics.DiagnosticSource`, `Microsoft.AspNet.TelemetryCorrelation`, or `Microsoft.ApplicationInsights`.  | Remove the references. Some of these references are added by default from certain Visual Studio templates. Older versions of Visual Studio might add references to `Microsoft.ApplicationInsights`.
|`AppAlreadyInstrumented:true` | This value can also be caused by the presence of the preceding DLLs in the app folder from a previous deployment. | Clean the app folder to ensure that these DLLs are removed. Check both your local app's bin directory and the wwwroot directory on the App Service resource. To check the wwwroot directory of your App Service web app, select **Advanced Tools (Kudu)** > **Debug console** > **CMD** > **home\site\wwwroot**.
|`AppContainsAspNetTelemetryCorrelationAssembly: true` | This value indicates that the extension detected references to `Microsoft.AspNet.TelemetryCorrelation` in the application and will back off. | Remove the reference.
|`AppContainsDiagnosticSourceAssembly**:true`|This value indicates that the extension detected references to `System.Diagnostics.DiagnosticSource` in the application and will back off.| For ASP.NET, remove the reference.
|`IKeyExists:false`|This value indicates that the instrumentation key isn't present in the app setting `APPINSIGHTS_INSTRUMENTATIONKEY`. Possible causes might be that the values were accidentally removed, or you forgot to set the values in the automation script. | Make sure the setting is present in the App Service application settings.

### System.IO.FileNotFoundException after 2.8.44 upgrade

The 2.8.44 version of autoinstrumentation upgrades Application Insights SDK to 2.20.0. The Application Insights SDK has an indirect reference to `System.Runtime.CompilerServices.Unsafe.dll` through `System.Diagnostics.DiagnosticSource.dll`. If the application has [binding redirect](/dotnet/framework/configure-apps/file-schema/runtime/bindingredirect-element) for `System.Runtime.CompilerServices.Unsafe.dll` and if this library isn't present in the application folder, it might throw `System.IO.FileNotFoundException`.

To resolve this issue, remove the binding redirect entry for `System.Runtime.CompilerServices.Unsafe.dll` from the web.config file. If the application wanted to use `System.Runtime.CompilerServices.Unsafe.dll`, set the binding redirect as shown here:

```  
<dependentAssembly>
	<assemblyIdentity name="System.Runtime.CompilerServices.Unsafe" publicKeyToken="b03f5f7f11d50a3a" culture="neutral" />
	<bindingRedirect oldVersion="0.0.0.0-4.0.4.1" newVersion="4.0.4.1" />
</dependentAssembly>
```

As a temporary workaround, you could set the app setting `ApplicationInsightsAgent_EXTENSION_VERSION` to a value of `2.8.37`. This setting will trigger App Service to use the old Application Insights extension. Temporary mitigations should only be used as an interim.

## Release notes

For the latest updates and bug fixes, see the [release notes](web-app-extension-release-notes.md).

## Next steps

* [Run the profiler on your live app](./profiler.md).
* [Monitor Azure Functions with Application Insights](monitor-functions.md).
* [Enable Azure diagnostics](../agents/diagnostics-extension-to-application-insights.md) to be sent to Application Insights.
* [Monitor service health metrics](../data-platform.md) to make sure your service is available and responsive.
* [Receive alert notifications](../alerts/alerts-overview.md) whenever operational events happen or metrics cross a threshold.
* Use [Application Insights for JavaScript apps and webpages](javascript.md) to get client telemetry from the browsers that visit a webpage.
* [Availability overview](availability-overview.md)
