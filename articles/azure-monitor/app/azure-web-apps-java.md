---
title: Monitor Azure app services performance Java | Microsoft Docs
description: Application performance monitoring for Azure app services using Java. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 06/23/2023
ms.devlang: java
ms.custom: devx-track-java, devx-track-extended-java
ms.reviewer: abinetabate
---

# Application Monitoring for Azure App Service and Java

Monitoring of your Java web applications running on [Azure App Services](../../app-service/index.yml) doesn't require any modifications to the code. This article walks you through enabling Azure Monitor Application Insights monitoring and provides preliminary guidance for automating the process for large-scale deployments.

## Enable Application Insights

The recommended way to enable application monitoring for Java applications running on Azure App Services is through Azure portal.
Turning on application monitoring in Azure portal will automatically instrument your application with Application Insights, and doesn't require any code changes.
You can apply extra configurations, and then based on your specific scenario you [add your own custom telemetry](./opentelemetry-add-modify.md?tabs=java#modify-telemetry) if needed.

### Autoinstrumentation through Azure portal

You can turn on monitoring for your Java apps running in Azure App Service just with one selection, no code change required. The integration adds [Application Insights Java 3.x](./opentelemetry-enable.md?tabs=java) and auto-collects telemetry.

For a complete list of supported autoinstrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

1. **Select Application Insights** in the Azure control panel for your app service, then select **Enable**.

    :::image type="content"source="./media/azure-web-apps/enable.png" alt-text="Screenshot of Application Insights tab with enable selected."::: 

2. Choose to create a new resource, or select an existing Application Insights resource for this application.

    > [!NOTE]
    > When you select **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**. 

    :::image type="content"source="./media/azure-web-apps/change-resource.png" alt-text="Screenshot of Change your resource dropdown.":::

3. This last step is optional. After specifying which resource to use, you can configure the Java agent. If you don't configure the Java agent, default configurations apply.

    The full [set of configurations](./java-standalone-config.md) is available, you just need to paste a valid [json file](./java-standalone-config.md#an-example). **Exclude the connection string and any configurations that are in preview** - you're able to add the items that are currently in preview as they become generally available.

    Once you modify the configurations through Azure portal, APPLICATIONINSIGHTS_CONFIGURATION_FILE environment variable are automatically populated and appear in App Service settings panel. This variable contains the full json content that you've pasted in Azure portal configuration text box for your Java app. 

    :::image type="content"source="./media/azure-web-apps-java/create-app-service-ai.png" alt-text="Screenshot of instrument your application."::: 
    

## Enable client-side monitoring

To enable client-side monitoring for your Java application, you need to [manually add the client-side JavaScript SDK to your application](./javascript.md).

## Automate monitoring

In order to enable telemetry collection with Application Insights, only the following Application settings need to be set:

:::image type="content"source="./media/azure-web-apps-java/application-settings-java.png" alt-text="Screenshot of App Service Application Settings with available Application Insights settings.":::

### Application settings definitions

| App setting name | Definition | Value |
|------------------|------------|------:|
| ApplicationInsightsAgent_EXTENSION_VERSION | Main extension, which controls runtime monitoring. | `~2` in Windows or `~3` in Linux. |
| XDT_MicrosoftApplicationInsights_Java | Flag to control if Java agent is included. | 0 or 1 (only applicable in Windows). |

> [!NOTE]
> Profiler and snapshot debugger are not available for Java applications

[!INCLUDE [azure-web-apps-arm-automation](../../../includes/azure-monitor-app-insights-azure-web-apps-arm-automation.md)]

## Troubleshooting

Use our step-by-step guide to troubleshoot Java-based applications running on Azure App Services.

1. Check that `ApplicationInsightsAgent_EXTENSION_VERSION` app setting is set to a value of "~2" on Windows, "~3" on Linux
1. Examine the log file to see that the agent has started successfully: browse to `https://yoursitename.scm.azurewebsites.net/, under SSH change to the root directory, the log file is located under LogFiles/ApplicationInsights. 
  
    :::image type="content"source="./media/azure-web-apps-java/app-insights-java-status.png" alt-text="Screenshot of the link above results page."::: 

1. After enabling application monitoring for your Java app, you can validate that the agent is working by looking at the live metrics - even before you deploy and app to App Service you'll see some requests from the environment. Remember that the full set of telemetry is only available when you have your app deployed and running. 
1. Set APPLICATIONINSIGHTS_SELF_DIAGNOSTICS_LEVEL environment variable to 'debug' if you don't see any errors and there's no telemetry

[!INCLUDE [azure-web-apps-troubleshoot](../../../includes/azure-monitor-app-insights-azure-web-apps-troubleshoot.md)]

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Manually deploy the latest Application Insights Java version

The Application Insights Java version is updated automatically as part of App Services updates.

If you encounter an issue that's fixed in the latest version of Application Insights Java, you can update it manually. 

To manually update, follow these steps:

1. Upload the Java agent jar file to App Service

    > a. First, get the latest version of Azure CLI by following the instructions [here](/cli/azure/install-azure-cli-windows?tabs=azure-cli).

    > b. Next, get the latest version of the Application Insights Java agent by following the instructions [here](./opentelemetry-enable.md?tabs=java).

    > c. Then, deploy the Java agent jar file to App Service using the following command: `az webapp deploy --src-path applicationinsights-agent-{VERSION_NUMBER}.jar --target-path java/applicationinsights-agent-{VERSION_NUMBER}.jar --type static --resource-group {YOUR_RESOURCE_GROUP} --name {YOUR_APP_SVC_NAME}`. Alternatively, you can use [this guide](../../app-service/quickstart-java.md?tabs=javase&pivots=platform-linux#3---configure-the-maven-plugin) to deploy the agent through the Maven plugin.

2. Disable Application Insights via the Application Insights tab in the Azure portal.

3. Once the agent jar file is uploaded, go to App Service configurations. If you
   need to use **Startup Command** for Linux, please include jvm arguments:

   :::image type="content"source="./media/azure-web-apps/startup-command.png" alt-text="Screenshot of startup command.":::
   
   **Startup Command** doesn't honor `JAVA_OPTS` for JavaSE or `CATALINA_OPTS` for Tomcat.

   If you don't use **Startup Command**, create a new environment variable, `JAVA_OPTS` for JavaSE or `CATALINA_OPTS` for Tomcat, with the value
   `-javaagent:{PATH_TO_THE_AGENT_JAR}/applicationinsights-agent-{VERSION_NUMBER}.jar`.

4. Restart the app to apply the changes.

> [!NOTE]
> If you set the `JAVA_OPTS` for JavaSE or `CATALINA_OPTS` for Tomcat environment variable, you will have to disable Application Insights in the portal. Alternatively, if you prefer to enable Application Insights from the portal, make sure that you don't set the `JAVA_OPTS` for JavaSE or `CATALINA_OPTS` for Tomcat variable in App Service configurations settings. 

## Release notes

For the latest updates and bug fixes, [consult the release notes](web-app-extension-release-notes.md).

## Next steps

* [Monitor Azure Functions with Application Insights](monitor-functions.md).
* [Enable Azure diagnostics](../agents/diagnostics-extension-to-application-insights.md) to be sent to Application Insights.
* [Monitor service health metrics](../data-platform.md) to make sure your service is available and responsive.
* [Receive alert notifications](../alerts/alerts-overview.md) whenever operational events happen or metrics cross a threshold.
* Use [Application Insights for JavaScript apps and web pages](javascript.md) to get client telemetry from the browsers that visit a web page.
* [Availability overview](availability-overview.md)
