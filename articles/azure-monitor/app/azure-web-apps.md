---
title: Monitor Azure app services performance | Microsoft Docs
description: Application performance monitoring for Azure app services. Chart load and response time, dependency information and set alerts on performance.
services: application-insights
documentationcenter: .net
author: mrbullwinkle
manager: carmonm
ms.assetid: 0b2deb30-6ea8-4bc4-8ed0-26765b85149f
ms.service: application-insights
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 03/26/2019
ms.author: mbullwin

---
# Monitor Azure App Service performance

Enabling monitoring on your .NET and .NET Core based web applications running on Azure App Services is now easier than ever. Whereas previously you needed to manually install a site extension, the latest extension/agent and monitoring capabilities are now baked into the app service image by default. This article will walk you through enabling monitoring as well as provide guidance for automating the process for large scale deployments.

## Enable Application Insights

There are two ways to enable application monitoring for Azure App Services hosted applications:

* **Agent based application monitoring** (ApplicationInsightsAgent).  
    * This is the easiest to enable, and no advanced configuration is required. It is often referred to as "runtime" monitoring. For Azure App Services we recommend at a minimum enabling this level of monitoring, and then based on your specific scenario you can evaluate whether more advanced monitoring through manual instrumentation is needed.

* **Manually instrumenting the application through code** by installing the Application Insights SDK.
    * This approach is much more flexible, but it requires advanced Application Insights SDK configuration.
    * If you need to leverage custom API calls to track events/dependencies not captured by default with agent based monitoring you would need to use this method. To learn more about...

> [!NOTE]
> If both agent based monitoring and manual SDK based instrumentation is detected only the manual instrumentation settings will be honored. This is to prevent duplicate data from sent. To learn more about this check out the [troubleshooting section]() below.

### Enable agent based application monitoring

# [.NET](#tab/net)

1. **Select Application Insights** in the Azure control panel for your app service.

    ![Under Settings, choose Application Insights](./media/azure-web-apps/settings-app-insights.png)

   * Choose to create a new resource, unless you already set up an Application Insights resource for this application. 

     > [!NOTE]
     > When you click **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**. 

     ![Instrument your web app](./media/azure-web-apps/create-resource.png)

2. After specifying which resource to use, you can choose how you want application insights to collect data per platform for your application. ASP.NET app monitoring is on-by-default with two different levels of collection.

    ![Choose options per platform](./media/azure-web-apps/choose-options-new.png)

   * .NET **Basic collection** level offers essential single-instance APM capabilities.

   * .NET **Recommended collection** level:
       * Adds CPU, memory, and I/O usage trends.
       * Correlates micro-services across request/dependency boundaries.
       * Collects usage trends, and enables correlation from availability results to transactions.
       * Collects exceptions unhandled by the host process.
       * Improves APM metrics accuracy under load, when sampling is used.

# [.NET Core](#tab/netcore)

1. **Select Application Insights** in the Azure control panel for your app service.

    ![Under Settings, choose Application Insights](./media/azure-web-apps/settings-app-insights.png)

   * Choose to create a new resource, unless you already set up an Application Insights resource for this application. 

     > [!NOTE]
     > When you click **OK** to create the new resource you will be prompted to **Apply monitoring settings**. Selecting **Continue** will link your new Application Insights resource to your app service, doing so will also **trigger a restart of your app service**. 

     ![Instrument your web app](./media/azure-web-apps/create-resource.png)

2. After specifying which resource to use, you can choose how you want application insights to collect data per platform for your application. ASP.NET app monitoring is on-by-default with two different levels of collection.

    ![Choose options per platform](./media/azure-web-apps/choose-options-new.png)

  .NET Core offers **Recommended collection** or **Disabled** for .NET Core 2.0 and 2.1.

# [Node.js](#tab/nodejs)

Node.js App Service based web applications do not currently support automatic agent/extension based monitoring. To enable monitoring for your node.js application you need to [manually instrument your application](https://docs.microsoft.com/azure/azure-monitor/learn/nodejs-quick-start) with the Application Insights Node.js SDK.

# [Java](#tab/java)

Java App Service based web applications do not currently support automatic agent/extension based monitoring. To enable monitoring for your Java application you need to [manually instrument your application](https://docs.microsoft.com/en-us/azure/azure-monitor/app/java-get-started) with the Application Insights Java SDK.

---

## Enable client-side monitoring

# [.NET](#tab/net)

* Select Settings > Application Settings
   * Under App Settings, add a new key value pair:

     Key: `APPINSIGHTS_JAVASCRIPT_ENABLED`

     Value: `true`
   * **Save** the settings and **Restart** your app.

# [.NET Core](#tab/netcore)

Client-side monitoring is enabled by default for .NET Core apps with **Recommended collection**, regardless of whether the app setting 'APPINSIGHTS_JAVASCRIPT_ENABLED' is present. Granular UI/Application setting based support for disabling client-side monitoring is not currently available for .NET Core.

# [Node.js](#tab/nodejs)

Node.js App Service based web applications do not currently support automatic agent/extension based monitoring. To enable monitoring for your node.js application you need to [manually instrument your application](https://docs.microsoft.com/azure/azure-monitor/learn/nodejs-quick-start) with the Application Insights Node.js SDK.

# [Java](#tab/java)

Java App Service based web applications do not currently support automatic agent/extension based monitoring. To enable monitoring for your Java application you need to [manually instrument your application](https://docs.microsoft.com/azure/azure-monitor/app/java-get-started) with the Application Insights Java SDK.

---

## Automate monitoring

In order to enable telemetry collection with Application Insights only the Application settings need to be set:

   ![App Service Application Settings with available Application Insights settings](./media/azure-web-apps/application-settings.png)

### Application settings definitions

|App setting name |  Definition | Value |
|-----------------|:------------|-------------:|
|ApplicationInsightsAgent_EXTENSION_VERSION | Main extension, which controls runtime monitoring. | `~2` |
|XDT_MicrosoftApplicationInsights_Mode |  In default mode only, essential features are enabled in order to insure optimal performance. | `default` or `recommended`. |
|InstrumentationEngine_EXTENSION_VERSION | Controls if the binary-rewrite engine `InstrumentationEngine` will be turned on. This setting has performance implications and impacts cold start/startup time. | `~1` |
|XDT_MicrosoftApplicationInsights_BaseExtensions | Controls if SQL & Azure table text will be captured along with the dependency calls. Performance warning: this requires the `InstrumentationEngine`. | `~1` |

### App Service Application settings with Azure Resource Manager

Application settings for App Services can be managed and configured with [Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates). This method can be used when deploying new App Service resources with Azure Resource Manager automation, or for modifying the settings of existing resources.

The basic structure of the application settings JSON for an app service is below:

```JSON
      "resources": [
        {
          "name": "appsettings",
          "type": "config",
          "apiVersion": "2015-08-01",
          "dependsOn": [
            "[resourceId('Microsoft.Web/sites', variables('webSiteName'))]"
          ],
          "tags": {
            "displayName": "Application Insights Settings"
          },
          "properties": {
            "key1": "value1",
            "key2": "value2"
          }
        }
      ]

```

For an example of an Azure Resource Manager template with Application settings configured for Application Insights this [template](https://github.com/Andrew-MSFT/BasicImageGallery) can be helpful, specifically the section starting on [line 238](https://github.com/Andrew-MSFT/BasicImageGallery/blob/c55ada54519e13ce2559823c16ca4f97ddc5c7a4/CoreImageGallery/Deploy/CoreImageGalleryARM/azuredeploy.json#L238).

### Automate the creation of an Application Insights resource and link to your newly created App Service.

To create an Azure Resource Manager template with all the default Application Insights settings configured, begin the process as if you were going to create a new Web App with Application Insights enabled.

Select **Automation options**

   ![App Service web app creation menu](./media/azure-web-apps/create-web-app.png)

This generates the latest Azure Resource Manager template with all required settings configured.

  ![App Service web app template](./media/azure-web-apps/arm-template.png)

Below is a sample, replace all instances of  `AppMonitoredSite` with your site name:

```json
{
    "resources": [
        {
            "name": "[parameters('name')]",
            "type": "Microsoft.Web/sites",
            "properties": {
                "siteConfig": {
                    "appSettings": [
                        {
                            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
                            "value": "[reference('microsoft.insights/components/AppMonitoredSite', '2015-05-01').InstrumentationKey]"
                        },
                        {
                            "name": "ApplicationInsightsAgent_EXTENSION_VERSION",
                            "value": "~2"
                        }
                    ]
                },
                "name": "[parameters('name')]",
                "serverFarmId": "[concat('/subscriptions/', parameters('subscriptionId'),'/resourcegroups/', parameters('serverFarmResourceGroup'), '/providers/Microsoft.Web/serverfarms/', parameters('hostingPlanName'))]",
                "hostingEnvironment": "[parameters('hostingEnvironment')]"
            },
            "dependsOn": [
                "[concat('Microsoft.Web/serverfarms/', parameters('hostingPlanName'))]",
                "microsoft.insights/components/AppMonitoredSite"
            ],
            "apiVersion": "2016-03-01",
            "location": "[parameters('location')]"
        },
        {
            "apiVersion": "2016-09-01",
            "name": "[parameters('hostingPlanName')]",
            "type": "Microsoft.Web/serverfarms",
            "location": "[parameters('location')]",
            "properties": {
                "name": "[parameters('hostingPlanName')]",
                "workerSizeId": "[parameters('workerSize')]",
                "numberOfWorkers": "1",
                "hostingEnvironment": "[parameters('hostingEnvironment')]"
            },
            "sku": {
                "Tier": "[parameters('sku')]",
                "Name": "[parameters('skuCode')]"
            }
        },
        {
            "apiVersion": "2015-05-01",
            "name": "AppMonitoredSite",
            "type": "microsoft.insights/components",
            "location": "West US 2",
            "properties": {
                "ApplicationId": "[parameters('name')]",
                "Request_Source": "IbizaWebAppExtensionCreate"
            }
        }
    ],
    "parameters": {
        "name": {
            "type": "string"
        },
        "hostingPlanName": {
            "type": "string"
        },
        "hostingEnvironment": {
            "type": "string"
        },
        "location": {
            "type": "string"
        },
        "sku": {
            "type": "string"
        },
        "skuCode": {
            "type": "string"
        },
        "workerSize": {
            "type": "string"
        },
        "serverFarmResourceGroup": {
            "type": "string"
        },
        "subscriptionId": {
            "type": "string"
        }
    },
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0"
}
```

> [!NOTE]
> The template will generate application settings in “default” mode. This mode is performance optimized, though you can modify the template to activate whichever features you prefer.



## More telemetry

* [Web page load data](../../azure-monitor/app/javascript.md)
* [Custom telemetry](../../azure-monitor/app/api-custom-events-metrics.md)

## Troubleshooting

### Do I still need to go to Extensions - Add - Application Insights extension for new App Service apps?

No, you no longer need to add the extension manually. Enabling Application Insights via the Settings blade will add all the needed Application settings to enable monitoring. This is now possible, because the files previously added by the extension are now [preinstalled](https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions) as part of the App Service image. The files are located in `d:\Program Files (x86)\SiteExtensions\ApplicationInsightsAgent`.

### If runtime and build time monitoring are both enabled do I end up with duplicate data?

No, by default if build time monitoring is detected runtime monitoring via the extension will stop sending data and only the build time monitoring configuration will be honored. The determination of whether to disable runtime monitoring is based on detection of any of these three files:

* Microsoft.ApplicationInsights dll
* Microsoft.ASP.NET.TelemetryCorrelation dll
* System.Diagnostics.DiagnosticSource dll

It is important to keep in mind that in many versions of Visual Studio, some or all of these files are added by default to the ASP.NET and ASP.NET Core Visual Studio template files. If your project was created based off of one of the templates even if you haven't explicitly enabled Application Insights, the presence of the file dependency would prevent runtime monitoring from activating.

### APPINSIGHTS_JAVASCRIPT_ENABLED causes incomplete HTML response in NET CORE web applications.

Enabling Javascript via App Services can cause html responses to be cut off.

* Workaround 1: set APPINSIGHTS_JAVASCRIPT_ENABLED Application Setting to false or remove it completely and restart
* Workaround 2: add sdk via code and remove extension (Profiler and Snapshot debugger won't work with this configuration)

To track this issue, go to [Azure extension causing incomplete HTML response](https://github.com/Microsoft/ApplicationInsights-Home/issues/277).

For .NET Core the following are currently **not supported**:

* Self-contained deployment.
* Apps targeting the .NET Framework.
* .NET Core 2.2 applications.

> [!NOTE]
> .NET Core 2.0 and .NET Core 2.1 are supported. When .NET Core 2.2 support is added this article will be updated.

## Next steps
* [Run the profiler on your live app](../../azure-monitor/app/profiler.md).
* [Azure Functions](https://github.com/christopheranderson/azure-functions-app-insights-sample) - monitor Azure Functions with Application Insights
* [Enable Azure diagnostics](../../azure-monitor/platform/diagnostics-extension-to-application-insights.md) to be sent to Application Insights.
* [Monitor service health metrics](../../azure-monitor/platform/data-collection.md) to make sure your service is available and responsive.
* [Receive alert notifications](../../azure-monitor/platform/alerts-overview.md) whenever operational events happen or metrics cross a threshold.
* Use [Application Insights for JavaScript apps and web pages](../../azure-monitor/app/javascript.md) to get client telemetry from the browsers that visit a web page.
* [Set up Availability web tests](../../azure-monitor/app/monitor-web-app-availability.md) to be alerted if your site is down.