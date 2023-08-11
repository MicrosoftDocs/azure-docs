---
title: Monitor Azure app services performance Node.js | Microsoft Docs
description: Application performance monitoring for Azure app services using Node.js. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 03/22/2023
ms.devlang: javascript
ms.custom: "devx-track-js"
ms.reviewer: abinetabate
---

# Application Monitoring for Azure App Service and Node.js

Monitoring of your Node.js web applications running on [Azure App Services](../../app-service/index.yml) doesn't require any modifications to the code. This article walks you through enabling Azure Monitor Application Insights monitoring and provides preliminary guidance for automating the process for large-scale deployments.

## Enable Application Insights

The easiest way to enable application monitoring for Node.js applications running on Azure App Services is through Azure portal.
Turning on application monitoring in Azure portal will automatically instrument your application with Application Insights, and doesn't require any code changes.

> [!NOTE]
> If both autoinstrumentation monitoring and manual SDK-based instrumentation are detected, only the manual instrumentation settings will be honored. This is to prevent duplicate data from being sent. To learn more about this, check out the [troubleshooting section](#troubleshooting) in this article.

### Autoinstrumentation through Azure portal

For a complete list of supported autoinstrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

You can turn on monitoring for your Node.js apps running in Azure App Service just with one click, no code change required.
Application Insights for Node.js is integrated with Azure App Service on Linux - both code-based and custom containers, and with App Service on Windows for code-based apps.
The integration is in public preview. The integration adds Node.js SDK, which is in GA.

1. **Select Application Insights** in the Azure control panel for your app service, then select **Enable**.

    :::image type="content"source="./media/azure-web-apps/enable.png" alt-text="Screenshot of Application Insights tab with enable selected."::: 

2. Choose to create a new resource, or select an existing Application Insights resource for this application.

    > [!NOTE]
    > When you select **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**.

    :::image type="content"source="./media/azure-web-apps/change-resource.png" alt-text="Screenshot of Change your resource dropdown."::: 

3. Once you've specified which resource to use, you're all set to go. 

    :::image type="content"source="./media/azure-web-apps-nodejs/app-service-node.png" alt-text="Screenshot of instrument your application."::: 


## Enable client-side monitoring

To enable client-side monitoring for your Node.js application, you need to [manually add the client-side JavaScript SDK to your application](./javascript.md).

## Automate monitoring

In order to enable telemetry collection with Application Insights, only the following Application settings need to be set:

:::image type="content"source="./media/azure-web-apps-nodejs/application-settings-nodejs.png" alt-text="Screenshot of App Service Application Settings with available Application Insights settings."::: 

### Application settings definitions

| App setting name | Definition | Value |
|------------------|------------|------:|
| ApplicationInsightsAgent_EXTENSION_VERSION | Main extension, which controls runtime monitoring. | `~2` in Windows or `~3` in Linux. |
| XDT_MicrosoftApplicationInsights_NodeJS | Flag to control if Node.js agent is included. | 0 or 1 (only applicable in Windows). |

> [!NOTE]
> Profiler and snapshot debugger are not available for Node.js applications

[!INCLUDE [azure-web-apps-arm-automation](../../../includes/azure-monitor-app-insights-azure-web-apps-arm-automation.md)]

## Troubleshooting

Below is our step-by-step troubleshooting guide for extension/agent based monitoring for Node.js based applications running on Azure App Services.

# [Windows](#tab/windows)

1. Check that `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of "~2".
2. Browse to `https://yoursitename.scm.azurewebsites.net/ApplicationInsights`.  

    :::image type="content"source="./media/azure-web-apps/app-insights-sdk-status.png" alt-text="Screenshot of the link above results page."border ="false"::: 

    - Confirm that the `Application Insights Extension Status` is `Pre-Installed Site Extension, version 2.8.x.xxxx, is running.` 

         If it isn't running, follow the [enable Application Insights monitoring instructions](#enable-application-insights).

    - Navigate to *D:\local\Temp\status.json* and open *status.json*.

    Confirm that `SDKPresent` is set to false, `AgentInitializedSuccessfully` to true and `IKey` to have a valid iKey.

    Below is an example of the JSON file:

    ```json
        "AppType":"node.js",
                
        "MachineName":"c89d3a6d0357",
                
        "PID":"47",
                
        "AgentInitializedSuccessfully":true,
                
        "SDKPresent":false,
                
        "IKey":"00000000-0000-0000-0000-000000000000",
                
        "SdkVersion":"1.8.10"
    
    ```

    If `SDKPresent` is true this indicates that the extension detected that some aspect of the SDK is already present in the Application, and will back-off.


# [Linux](#tab/linux)

1. Check that `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of "~3".
2. Navigate to */var/log/applicationinsights/* and open *status.json*.

    Confirm that `SDKPresent` is set to false, `AgentInitializedSuccessfully` to true and `IKey` to have a valid iKey.

    Below is an example of the JSON file:

    ```json
        "AppType":"node.js",
                
        "MachineName":"c89d3a6d0357",
                
        "PID":"47",
                
        "AgentInitializedSuccessfully":true,
                
        "SDKPresent":false,
                
        "IKey":"00000000-0000-0000-0000-000000000000",
                
        "SdkVersion":"1.8.10"
    
    ```

    If `SDKPresent` is true this indicates that the extension detected that some aspect of the SDK is already present in the Application, and will back-off.
---

[!INCLUDE [azure-web-apps-troubleshoot](../../../includes/azure-monitor-app-insights-azure-web-apps-troubleshoot.md)]

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Release notes

For the latest updates and bug fixes, [consult the release notes](web-app-extension-release-notes.md).

## Next steps

* [Monitor Azure Functions with Application Insights](monitor-functions.md).
* [Enable Azure diagnostics](../agents/diagnostics-extension-to-application-insights.md) to be sent to Application Insights.
* [Monitor service health metrics](../data-platform.md) to make sure your service is available and responsive.
* [Receive alert notifications](../alerts/alerts-overview.md) whenever operational events happen or metrics cross a threshold.
* Use [Application Insights for JavaScript apps and web pages](javascript.md) to get client telemetry from the browsers that visit a web page.
* [Availability overview](availability-overview.md)
