---
title: Monitor Azure app services performance Java | Microsoft Docs
description: Application performance monitoring for Azure app services using Java. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 08/06/2021
ms.custom: "devx-track-java"
---

# Application Monitoring for Azure App Service and Java

Enabling monitoring on your Java based web applications running on [Azure App Services](../../app-service/index.yml) is now easier than ever. Whereas previously you needed to manually instrument your app, the latest extension/agent is now built into the App Service image by default. This article will walk you through enabling Azure Monitor application Insights monitoring as well as provide preliminary guidance for automating the process for large-scale deployments.


## Enable Application Insights

There are two ways to enable application monitoring for Azure App Services hosted applications:

* **Agent-based application monitoring** (ApplicationInsightsAgent).  
    * This method is the easiest to enable, and no code change or advanced configurations are required. It is often referred to as "runtime" monitoring. For Azure App Services we recommend at a minimum enabling this level of monitoring, and then based on your specific scenario you can evaluate whether more advanced monitoring through manual instrumentation is needed.

* **Manually instrumenting the application through code** by installing the Application Insights SDK.

    * This approach is much more customizable, but it requires [adding a dependency on the Application Insights SDK npm packages](./nodejs.md). This method, also means you have to manage the updates to the latest version of the packages yourself.

    * If you need to make custom API calls to track events/dependencies not captured by default with agent-based monitoring, you would need to use this method. Check out the [API for custom events and metrics article](./api-custom-events-metrics.md) to learn more.

> [!NOTE]
> If both agent-based monitoring and manual SDK-based instrumentation is detected, only the manual instrumentation settings will be honored. This is to prevent duplicate data from being sent. To learn more about this, check out the [troubleshooting section](#troubleshooting) below.
## Enable agent-based monitoring

You can turn on monitoring for your Java apps running in Azure App Service just with one click, no code change required. Application Insights for Java is integrated with App Service on Linux - both code-based and custom containers, and with App Service on Windows - code-based apps. It is important to know how your application will be monitored. The integration adds [Application Insights Java 3.x](./java-in-process-agent.md) and you will get all the telemetry that it auto-collects.

1. **Select Application Insights** in the Azure control panel for your app service.

    > [!div class="mx-imgBorder"]
    > ![Under Settings, choose Application Insights.](./media/azure-web-apps/ai-enable.png)
   * Choose to create a new resource, or select an existing Application Insights resource for this application.

    > [!NOTE]
    > When you click **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**. 
    >[!div class="mx-imgBorder"]
    >![Instrument your web app.](./media/azure-web-apps/ai-create-new.png)
2. This step is not required. After specifying which resource to use, you can configure the Java agent. If you do not configure the Java agent, default configurations will apply. The full [set of configurations](./java-standalone-config.md) is available, you just need to paste a valid json file. Exclude the connection string and any configurations that are in preview - you will be able to add those as they become generally available.

    > [!div class="mx-imgBorder"]
    > ![Choose options per platform.](./media/azure-web-apps/create-app-service-ai.png)

## Enable client-side monitoring


To enable client-side monitoring for your Java application, you need to [manually add the client-side JavaScript SDK to your application](./javascript.md).

## Automate monitoring

In order to enable telemetry collection with Application Insights, only the Application settings need to be set:

   ![App Service Application Settings with available Application Insights settings](./media/azure-web-apps/application-settings.png)

### Application settings definitions

|App setting name |  Definition | Value |
|-----------------|:------------|-------------:|
|ApplicationInsightsAgent_EXTENSION_VERSION | Main extension, which controls runtime monitoring. | `~2` for Windows or `~3` for Linux |
|XDT_MicrosoftApplicationInsights_Mode |  In default mode, only essential features are enabled in order to insure optimal performance. | `default` or `recommended`. |
|InstrumentationEngine_EXTENSION_VERSION | Controls if the binary-rewrite engine `InstrumentationEngine` will be turned on. This setting has performance implications and impacts cold start/startup time. | `~1` |
|XDT_MicrosoftApplicationInsights_BaseExtensions | Controls if SQL & Azure table text will be captured along with the dependency calls. Performance warning: application cold start up time will be affected. This setting requires the `InstrumentationEngine`. | `~1` |
|XDT_MicrosoftApplicationInsights_PreemptSdk | For ASP.NET Core apps only. Enables Interop (interoperation) with Application Insights SDK. Loads the extension side-by-side with the SDK and uses it to send telemetry (disables the Application Insights SDK). |`1`|

[!INCLUDE [azure-web-apps-arm-automation](./includes/azure-web-apps-arm-automation.md)]


## Troubleshooting

Below is our step-by-step troubleshooting guide for extension/agent based monitoring for Node.js based applications running on Azure App Services.

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


[!INCLUDE [azure-web-apps-footer](./includes/azure-web-apps-footer.md)]