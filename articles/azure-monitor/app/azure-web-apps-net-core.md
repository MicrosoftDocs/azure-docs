---
title: Monitor Azure App Service performance in .NET Core | Microsoft Docs
description: Application performance monitoring for Azure App Service using ASP.NET Core. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 03/22/2023
ms.devlang: csharp
ms.custom: devx-track-dotnet
ms.reviewer: abinetabate
---

# Application monitoring for Azure App Service and ASP.NET Core

Enabling monitoring on your ASP.NET Core-based web applications running on [Azure App Service](../../app-service/index.yml) is now easier than ever. Previously, you needed to manually instrument your app. Now, the latest extension/agent is built into the App Service image by default. This article walks you through enabling Azure Monitor Application Insights monitoring. It also provides preliminary guidance for automating the process for large-scale deployments.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Enable autoinstrumentation monitoring

For a complete list of supported autoinstrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

# [Windows](#tab/Windows)

> [!IMPORTANT]
> Only .NET Core [Long Term Support](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) is supported for autoinstrumentation on Windows.

[Trim self-contained deployments](/dotnet/core/deploying/trimming/trim-self-contained) is *not supported*. Use [manual instrumentation](./asp-net-core.md) via code instead.

> [!NOTE]
> Autoinstrumentation used to be known as "codeless attach" before October 2021.

See the following [Enable monitoring](#enable-monitoring) section to begin setting up Application Insights with your App Service resource.

# [Linux](#tab/Linux)

> [!IMPORTANT]
> Only .NET Core [Long Term Support](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) is supported for autoinstrumentation on Linux.

[Trim self-contained deployments](/dotnet/core/deploying/trimming/trim-self-contained) is *not supported*. Use [manual instrumentation](./asp-net-core.md) via code instead.


See the following [Enable monitoring](#enable-monitoring) section to begin setting up Application Insights with your App Service resource.

---

### Enable monitoring

1. Select **Application Insights** in the left pane for your app service. Then select **Enable**.

    :::image type="content"source="./media/azure-web-apps/enable.png" alt-text=" Screenshot that shows the Application Insights tab with Enable selected.":::

1. Create a new resource or select an existing Application Insights resource for this application.

    > [!NOTE]
    > When you select **OK** to create a new resource, you're prompted to **Apply monitoring settings**. Selecting **Continue** links your new Application Insights resource to your app service. Your app service then restarts.

    :::image type="content"source="./media/azure-web-apps/change-resource.png" alt-text="Screenshot that shows the Change your resource dropdown.":::

1. After you specify which resource to use, you can choose how you want Application Insights to collect data per platform for your application. ASP.NET Core collection options are **Recommended** or **Disabled**.

    :::image type="content"source="./media/azure-web-apps-net-core/instrument-net-core.png" alt-text=" Screenshot that shows instrumenting your application section.":::

## Enable client-side monitoring

Client-side monitoring is enabled by default for ASP.NET Core apps with **Recommended** collection, regardless of whether the app setting `APPINSIGHTS_JAVASCRIPT_ENABLED` is present.

If you want to disable client-side monitoring:

1. Select **Settings** > **Configuration**.
1. Under **Application settings**, create a **New application setting** with the following information:

    - **Name**: `APPINSIGHTS_JAVASCRIPT_ENABLED`
    - **Value**: `false`

1. **Save** the settings. Restart your app.

## Automate monitoring

To enable telemetry collection with Application Insights, only the application settings must be set.

:::image type="content"source="./media/azure-web-apps-net-core/application-settings-net-core.png" alt-text="Screenshot that shows App Service application settings with Application Insights settings.":::

### Application settings definitions

|App setting name |  Definition | Value |
|-----------------|:------------|-------------:|
|ApplicationInsightsAgent_EXTENSION_VERSION | Main extension, which controls runtime monitoring. | `~3` |
|XDT_MicrosoftApplicationInsights_Mode |  In default mode, only essential features are enabled to ensure optimal performance. | `disabled` or `recommended`. |
|XDT_MicrosoftApplicationInsights_PreemptSdk | For ASP.NET Core apps only. Enables Interop (interoperation) with the Application Insights SDK. Loads the extension side by side with the SDK and uses it to send telemetry. (Disables the Application Insights SDK.) |`1`|

[!INCLUDE [azure-web-apps-arm-automation](../../../includes/azure-monitor-app-insights-azure-web-apps-arm-automation.md)]

## Upgrade monitoring extension/agent - .NET

To upgrade the monitoring extension/agent, follow the steps in the next sections.

### Upgrade from versions 2.8.9 and up

Upgrading from version 2.8.9 happens automatically, without any extra actions. The new monitoring bits are delivered in the background to the target app service, and on application restart they'll be picked up.

To check which version of the extension you're running, go to `https://yoursitename.scm.azurewebsites.net/ApplicationInsights`.

:::image type="content"source="./media/azure-web-apps/extension-version.png" alt-text="Screenshot that shows the URL path to check the version of the extension you're running." border="false":::

### Upgrade from versions 1.0.0 - 2.6.5

Starting with version 2.8.9, the preinstalled site extension is used. If you're using an earlier version, you can update via one of two ways:

* [Upgrade by enabling via the portal](#enable-autoinstrumentation-monitoring): Even if you have the Application Insights extension for App Service installed, the UI shows only the **Enable** button. Behind the scenes, the old private site extension will be removed.
* [Upgrade through PowerShell](#enable-through-powershell):

    1. Set the application settings to enable the preinstalled site extension `ApplicationInsightsAgent`. For more information, see [Enable through PowerShell](#enable-through-powershell).
    1. Manually remove the private site extension named **Application Insights extension for Azure App Service**.

If the upgrade is done from a version prior to 2.5.1, check that the `ApplicationInsights` DLLs are removed from the application bin folder. For more information, see [Troubleshooting steps](#troubleshooting).

## Troubleshooting

> [!NOTE]
> When you create a web app with the `ASP.NET Core` runtimes in App Service, it deploys a single static HTML page as a starter website. We *do not* recommend that you troubleshoot an issue with the default template. Deploy an application before you troubleshoot an issue.

What follows is our step-by-step troubleshooting guide for extension/agent-based monitoring for ASP.NET Core-based applications running on App Service.

# [Windows](#tab/windows)

1. Check that the `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of `~2`.
1. Browse to `https://yoursitename.scm.azurewebsites.net/ApplicationInsights`.  

    :::image type="content"source="./media/azure-web-apps/app-insights-sdk-status.png" alt-text="Screenshot that shows the link above the results page."border ="false":::
    
    - Confirm that **Application Insights Extension Status** is `Pre-Installed Site Extension, version 2.8.x.xxxx, is running.`
    
         If it isn't running, follow the instructions in the section [Enable Application Insights monitoring](#enable-autoinstrumentation-monitoring).

    - Confirm that the status source exists and looks like `Status source D:\home\LogFiles\ApplicationInsights\status\status_RD0003FF0317B6_4248_1.json`.

         If a similar value isn't present, it means the application isn't currently running or isn't supported. To ensure that the application is running, try manually visiting the application URL/application endpoints, which will allow the runtime information to become available.

    - Confirm that **IKeyExists** is `True`. If it's `False`, add `APPINSIGHTS_INSTRUMENTATIONKEY` and `APPLICATIONINSIGHTS_CONNECTION_STRING` with your ikey GUID to your application settings.

    -  If your application refers to any Application Insights packages, enabling the App Service integration might not take effect and the data might not appear in Application Insights. An example would be if you've previously instrumented, or attempted to instrument, your app with the [ASP.NET Core SDK](./asp-net-core.md). To fix the issue, in the portal, turn on **Interop with Application Insights SDK**. You'll start seeing the data in Application Insights.
    
        > [!IMPORTANT]
        > This functionality is in preview.

        :::image type="content"source="./media/azure-web-apps-net-core/interop.png" alt-text=" Screenshot that shows the interop setting enabled.":::
        
        The data will now be sent by using a codeless approach, even if the Application Insights SDK was originally used or attempted to be used.

        > [!IMPORTANT]
        > If the application used the Application Insights SDK to send any telemetry, the telemetry will be disabled. In other words, custom telemetry (for example, any `Track*()` methods) and custom settings (such as sampling) will be disabled.

# [Linux](#tab/linux)

1. Check that the `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of `~3`.
1. Browse to `https://your site name.scm.azurewebsites.net/ApplicationInsights`.
1. Within this site, confirm:
   * The status source exists and looks like `Status source /var/log/applicationinsights/status_abcde1234567_89_0.json`.
   * The value `Auto-Instrumentation enabled successfully` is displayed. If a similar value isn't present, it means the application isn't running or isn't supported. To ensure that the application is running, try manually visiting the application URL/application endpoints, which will allow the runtime information to become available.
   * **IKeyExists** is `True`. If it's `False`, add `APPINSIGHTS_INSTRUMENTATIONKEY` and `APPLICATIONINSIGHTS_CONNECTION_STRING` with your ikey GUID to your application settings.

   :::image type="content" source="media/azure-web-apps-net-core/auto-instrumentation-status.png" alt-text="Screenshot that shows the autoinstrumentation status webpage." lightbox="media/azure-web-apps-net-core/auto-instrumentation-status.png":::



---
### Default website deployed with web apps doesn't support automatic client-side monitoring

When you create a web app with the ASP.NET Core runtimes in App Service, it deploys a single static HTML page as a starter website. The static webpage also loads an ASP.NET-managed web part in IIS. This behavior allows for testing codeless server-side monitoring but doesn't support automatic client-side monitoring.

If you want to test out codeless server and client-side monitoring for ASP.NET Core in an App Service web app, we recommend that you follow the official guides for [creating an ASP.NET Core web app](../../app-service/quickstart-dotnetcore.md). Then use the instructions in the current article to enable monitoring.

[!INCLUDE [azure-web-apps-troubleshoot](../../../includes/azure-monitor-app-insights-azure-web-apps-troubleshoot.md)]

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

### PHP and WordPress aren't supported

PHP and WordPress sites aren't supported. There's currently no officially supported SDK/agent for server-side monitoring of these workloads. To manually instrument client-side transactions on a PHP or WordPress site by adding the client-side JavaScript to your webpages, use the [JavaScript SDK](./javascript.md).

The following table provides an explanation of what these values mean, their underlying causes, and recommended fixes.

|Problem value |Explanation |Fix |
|---- |----|---|
| `AppAlreadyInstrumented:true` | This value indicates that the extension detected that some aspect of the SDK is already present in the application and will back off. It can be because of a reference to `Microsoft.ApplicationInsights.AspNetCore` or `Microsoft.ApplicationInsights`.  | Remove the references. Some of these references are added by default from certain Visual Studio templates. Older versions of Visual Studio reference `Microsoft.ApplicationInsights`. |
|`AppAlreadyInstrumented:true` | This value can also be caused by the presence of `Microsoft.ApplicationsInsights` DLL in the app folder from a previous deployment. | Clean the app folder to ensure that these DLLs are removed. Check both your local app's bin directory and the *wwwroot* directory on the App Service. (To check the wwwroot directory of your App Service web app, select **Advanced Tools (Kudu**) > **Debug console** > **CMD** > **home\site\wwwroot**). |
|`IKeyExists:false`|This value indicates that the instrumentation key isn't present in the app setting `APPINSIGHTS_INSTRUMENTATIONKEY`. Possible causes include accidentally removing the values or forgetting to set the values in automation script. | Make sure the setting is present in the App Service application settings. |

## Release notes

For the latest updates and bug fixes, see the [Release notes](web-app-extension-release-notes.md).

## Next steps

* [Run the Profiler on your live app](./profiler.md).
* [Monitor Azure Functions with Application Insights](monitor-functions.md).
* [Enable Azure diagnostics](../agents/diagnostics-extension-to-application-insights.md) to be sent to Application Insights.
* [Monitor service health metrics](../data-platform.md) to make sure your service is available and responsive.
* [Receive alert notifications](../alerts/alerts-overview.md) whenever operational events happen or metrics cross a threshold.
* Use [Application Insights for JavaScript apps and webpages](javascript.md) to get client telemetry from the browsers that visit a webpage.
* [Availability](availability-overview.md)

