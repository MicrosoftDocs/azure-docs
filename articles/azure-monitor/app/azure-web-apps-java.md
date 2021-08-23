---
title: Monitor Azure app services performance Java | Microsoft Docs
description: Application performance monitoring for Azure app services using Java. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 08/06/2021
ms.custom: "devx-track-java"
---

# Application Monitoring for Azure App Service and Java

Monitoring of your Java-based web applications running on [Azure App Services](../../app-service/index.yml) does not require any modifications to the code. This article will walk you through enabling Azure Monitor application insights monitoring as well as provide preliminary guidance for automating the process for large-scale deployments.


## Enable Application Insights

The recommended way to enable application monitoring for Java application running on Azure App Services is through Azure portal. Turning on application monitoring in Azure portal will automatically instrument your application with application insights.  

### Auto-instrumentation through Azure portal

<<<<<<< HEAD
This method requires no code change or advanced configurations, making it the easiest way to get started with monitoring for Azure App Services. You can apply additional configurations, and then based on your specific scenario you can evaluate whether more advanced monitoring through [manual instrumentation](https://docs.microsoft.com/azure/azure-monitor/app/java-2x-get-started?tabs=maven) is needed.
=======
This method requires no code change or advanced configurations. For Azure App Services, this is the easiest way to get the monitoring started. You can apply additional configurations, and then based on your specific scenario you can evaluate whether more advanced monitoring through [manual instrumentation](./java-2x-get-started.md) is needed.
>>>>>>> 5a549de6b3ee26b59d6710b61e12f30b417a072d

### Enable backend monitoring

You can turn on monitoring for your Java apps running in Azure App Service just with one click, no code change required. Application Insights for Java is integrated with App Service on Linux - both code-based and custom containers, and with App Service on Windows - code-based apps. It is important to know how your application will be monitored. The integration adds [Application Insights Java 3.x](./java-in-process-agent.md) and you will get the telemetry auto-collected.

1. **Select Application Insights** in the Azure control panel for your app service.

    > [!div class="mx-imgBorder"]
    > ![Under Settings, choose Application Insights.](./media/azure-web-apps/ai-enable.png)
   * Choose to create a new resource, or select an existing Application Insights resource for this application.

    > [!NOTE]
    > When you click **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**. 

    >[!div class="mx-imgBorder"]
    >![Instrument your web app.](./media/azure-web-apps/ai-create-new.png)
2. This step is not required. After specifying which resource to use, you can configure the Java agent. If you do not configure the Java agent, default configurations will apply. 

    The full [set of configurations](./java-standalone-config.md) is available, you just need to paste a valid [json file](https://docs.microsoft.com/azure/azure-monitor/app/java-standalone-config#an-example). **Exclude the connection string and any configurations that are in preview** - you will be able to add the items that are currently in preview as they become generally available.

    Once you modify the configurations through Azure portal, APPLICATIONINSIGHTS_CONFIGURATION_FILE environment variable will automatically be populated and will appear in App Service settings panel. This variable will contain the full json content that you have pasted in Azure portal configuration text box for your Java app. 

    > [!div class="mx-imgBorder"]
    > ![Choose options per platform.](./media/azure-web-apps/create-app-service-ai.png)

### Enable client-side monitoring

To enable client-side monitoring for your Java application, you need to [manually add the client-side JavaScript SDK to your application](./javascript.md).

### Application settings

In order to enable telemetry collection with Application Insights, only the following Application settings need to be set:

|App setting name |  Definition | Value |
|-----------------|:------------|-------------:|
|ApplicationInsightsAgent_EXTENSION_VERSION | Controls runtime monitoring | `~2` for Windows or `~3` for Linux |
|XDT_MicrosoftApplicationInsights_Java |  Flag to control that Java agent is included | 0 or 1 only applicable in Windows
|APPLICATIONINSIGHTS_SELF_DIAGNOSTICS_LEVEL | Only use it if you need to debug the integration of Application Insights with App Service | debug

> [!div class="mx-imgBorder"]
> ![App Service Application Settings with available Application Insights settings](./media/azure-web-apps/application-settings-java.png)

> [!NOTE]
> Profiler and snapshot debugger are not available for Java applications

## Automate monitoring
[!INCLUDE [azure-web-apps-arm-automation](./includes/azure-web-apps-arm-automation.md)]


## Troubleshooting

Below is our step-by-step troubleshooting guide for extension/agent based monitoring for Java-based applications running on Azure App Services.

1. Check that `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of "~2" on Windows, "~3" on Linux
1. Examine the log file to see that the agent has started successfully: browse to `https://yoursitename.scm.azurewebsites.net/, under SSH change to the root directory, the log file is located under LogFiles/ApplicationInsights. 

    > [!div class="mx-imgBorder"]
    > ![Screenshot of https://yoursitename.scm.azurewebsites results page](./media/azure-web-apps/app-insights-java-status.png)
1. After enabling application monitoring for your Java app, you can validate that the agent is working by looking at the live metrics - even before you deploy and app to App Service you will see some requests from the environment. Remember that the full set of telemetry will only be available when you have your app deployed and running. 
1. Set APPLICATIONINSIGHTS_SELF_DIAGNOSTICS_LEVEL environment variable to 'debug' if you do not see any errors and there is no telemetry


[!INCLUDE [azure-web-apps-footer](./includes/azure-web-apps-footer.md)]