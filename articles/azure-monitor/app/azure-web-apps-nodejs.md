---
title: Monitor Azure app services performance Node.js | Microsoft Docs
description: Application performance monitoring for Azure app services using Node.js. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 08/06/2021
ms.custom: "devx-track-js"
---

# Application Monitoring for Azure App Service and Node.js

Enabling monitoring on your Node.js based web applications running on [Azure App Services](../../app-service/index.yml) is now easier than ever. Whereas previously you needed to manually instrument your app, the latest extension/agent is now built into the App Service image by default. This article will walk you through enabling Azure Monitor application Insights monitoring as well as provide preliminary guidance for automating the process for large-scale deployments.


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

You can monitor your Node.js apps running in Azure App Service without any code change, just with a couple of simple steps. Application insights for Node.js applications is integrated with App Service on Linux - both code-based and custom containers, and with App Service on Windows for code-based apps. The integration is in public preview. The integration adds Node.js SDK, which is in GA. 

1. **Select Application Insights** in the Azure control panel for your app service.

    > [!div class="mx-imgBorder"]
    > ![Under Settings, choose Application Insights.](./media/azure-web-apps/ai-enable.png)
   * Choose to create a new resource, unless you already set up an Application Insights resource for this application. 

     > [!NOTE]
     > When you click **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**. 
    ![Instrument your web app.](./media/azure-web-apps/create-resource-01.png)

2. Once you have specified which resource to use, you are all set to go. 

    > [!div class="mx-imgBorder"]
    > ![Choose options per platform.](./media/azure-web-apps/app-service-node.png)

## Enable client-side monitoring


To enable client-side monitoring for your Node.js application, you need to [manually add the client-side JavaScript SDK to your application](./javascript.md).

## Automate monitoring

In order to enable telemetry collection with Application Insights, only the Application settings need to be set:

   ![App Service Application Settings with available Application Insights settings](../media/azure-web-apps/application-settings-nodejs.png)

### Application settings definitions

# [Windows](#tab/windows)
|App setting name |  Definition | Value |
|-----------------|:------------|-------------:|
|ApplicationInsightsAgent_EXTENSION_VERSION | Main extension, which controls runtime monitoring. | `~2` |
|XDT_MicrosoftApplicationInsights_NodeJS |  Flag to control if node.js Agent is included. | 0 or 1. |

# [Linux](#tab/linux)
|App setting name |  Definition | Value |
|-----------------|:------------|-------------:|
|ApplicationInsightsAgent_EXTENSION_VERSION | Main extension, which controls runtime monitoring. | `~3` |


[!INCLUDE [azure-web-apps-arm-automation](./includes/azure-web-apps-arm-automation.md)]


## Troubleshooting

Below is our step-by-step troubleshooting guide for extension/agent based monitoring for Node.js based applications running on Azure App Services.

# [Windows](#tab/windows)

1. Check that `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of "~2".
2. Browse to `https://yoursitename.scm.azurewebsites.net/ApplicationInsights`.  

    ![Screenshot of https://yoursitename.scm.azurewebsites/applicationinsights results page](./media/azure-web-apps/app-insights-sdk-status.png)

    - Confirm that the `Application Insights Extension Status` is `Pre-Installed Site Extension, version 2.8.x.xxxx, is running.` 

         If it is not running, follow the [enable Application Insights monitoring instructions](#enable-application-insights).

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



[!INCLUDE [azure-web-apps-footer](./includes/azure-web-apps-footer.md)]