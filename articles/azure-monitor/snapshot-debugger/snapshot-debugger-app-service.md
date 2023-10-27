---
title: Enable Snapshot Debugger for .NET apps in Azure App Service | Microsoft Docs
description: Enable Snapshot Debugger for .NET apps in Azure App Service
ms.topic: conceptual
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.date: 04/24/2023
ms.custom: devdivchpfy22, devx-track-arm-template, devx-track-dotnet
---

# Enable Snapshot Debugger for .NET apps in Azure App Service

Snapshot Debugger currently supports ASP.NET and ASP.NET Core apps that are running on Azure App Service on Windows service plans.

> [!NOTE]
> We recommend that you run your application on the Basic service tier, or higher, when using Snapshot Debugger. For most applications, the Free and Shared service tiers don't have enough memory or disk space to save snapshots. The Consumption tier is not currently available for Snapshot Debugger.

## <a id="installation"></a> Enable Snapshot Debugger

Snapshot Debugger is pre-installed as part of the App Services runtime, but you need to turn it on to get snapshots for your App Service app. To enable Snapshot Debugger for an app, follow the instructions below:

> [!NOTE]
> If you're using a preview version of .NET Core, or your application references Application Insights SDK (directly or indirectly via a dependent assembly), follow the instructions for [Enable Snapshot Debugger for other environments](snapshot-debugger-vm.md) to include the [`Microsoft.ApplicationInsights.SnapshotCollector`](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package with the application.

> [!NOTE]
> Codeless installation of Application Insights Snapshot Debugger follows the .NET Core support policy.
> For more information about supported runtimes, see [.NET Core Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).

After you've deployed your .NET app:

1. Go to the Azure control panel for your App Service.
1. Go to the **Settings** > **Application Insights** page.

   :::image type="content" source="./media/snapshot-debugger/application-insights-app-services.png" alt-text="Screenshot showing the Enable App Insights on App Services portal.":::

1. Either follow the instructions on the page to create a new resource or select an existing App Insights resource to monitor your app.
1. Switch Snapshot Debugger toggles to **On**.
  
   :::image type="content" source="./media/snapshot-debugger/enablement-ui.png" alt-text="Screenshot showing how to add App Insights site extension.":::
  
1. Snapshot Debugger is now enabled using an App Services App Setting.

    :::image type="content" source="./media/snapshot-debugger/snapshot-debugger-app-setting.png" alt-text="Screenshot showing App Setting for Snapshot Debugger.":::

If you're running a different type of Azure service, here are instructions for enabling Snapshot Debugger on other supported platforms:

* [Azure Function](snapshot-debugger-function-app.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Service Fabric services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Virtual Machines and Virtual Machine Scale Sets](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [On-premises virtual or physical machines](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
  
## Enable Snapshot Debugger for other clouds

Currently the only regions that require endpoint modifications are [Azure Government](../../azure-government/compare-azure-government-global-azure.md#application-insights) and [Microsoft Azure operated by 21Vianet](/azure/china/resources-developer-guide) through the Application Insights Connection String.

|Connection String Property    | US Government Cloud | China Cloud |  
|---------------|---------------------|-------------|
|SnapshotEndpoint         | `https://snapshot.monitor.azure.us`    | `https://snapshot.monitor.azure.cn` |

For more information about other connection overrides, see [Application Insights documentation](../app/sdk-connection-string.md?tabs=net#connection-string-with-explicit-endpoint-overrides).

<a name='enable-azure-active-directory-authentication-for-snapshot-ingestion'></a>

## Enable Microsoft Entra authentication for snapshot ingestion

Application Insights Snapshot Debugger supports Microsoft Entra authentication for snapshot ingestion. This means, for all snapshots of your application to be ingested, your application must be authenticated and provide the required application settings to the Snapshot Debugger agent.

As of today, Snapshot Debugger only supports Microsoft Entra authentication when you reference and configure Microsoft Entra ID using the Application Insights SDK in your application.

To turn-on Microsoft Entra ID for snapshot ingestion:

1. Create and add the managed identity you want to use to authenticate against your Application Insights resource to your App Service.

    1. For System-Assigned Managed identity, see the following [documentation](../../app-service/overview-managed-identity.md?tabs=portal%2chttp#add-a-system-assigned-identity).

    1. For User-Assigned Managed identity, see the following [documentation](../../app-service/overview-managed-identity.md?tabs=portal%2chttp#add-a-user-assigned-identity).

1. Configure and turn on Microsoft Entra ID in your Application Insights resource. For more information, see the following [documentation](../app/azure-ad-authentication.md?tabs=net#configure-and-enable-azure-ad-based-authentication)
1. Add the following application setting, used to let Snapshot Debugger agent know which managed identity to use:

For System-Assigned Identity:

|App Setting    | Value    |
|---------------|----------|
|APPLICATIONINSIGHTS_AUTHENTICATION_STRING         | Authorization=AD    |

For User-Assigned Identity:

|App Setting    | Value    |
|---------------|----------|
|APPLICATIONINSIGHTS_AUTHENTICATION_STRING         | Authorization=AD;ClientID={Client ID of the User-Assigned Identity}    |

## Disable Snapshot Debugger

To disable Snapshot Debugger, repeat the [steps for enabling](#installation). However, switch the Snapshot Debugger toggles to **Off**.

## Azure Resource Manager template

For an Azure App Service, you can set app settings within the Azure Resource Manager template to enable Snapshot Debugger and Profiler. For example:

```json
{
  "apiVersion": "2015-08-01",
  "name": "[parameters('webSiteName')]",
  "type": "Microsoft.Web/sites",
  "location": "[resourceGroup().location]",
  "dependsOn": [
    "[variables('hostingPlanName')]"
  ],
  "tags": { 
    "[concat('hidden-related:', resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName')))]": "empty",
    "displayName": "Website"
  },
  "properties": {
    "name": "[parameters('webSiteName')]",
    "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]"
  },
  "resources": [
    {
      "apiVersion": "2015-08-01",
      "name": "appsettings",
      "type": "config",
      "dependsOn": [
        "[parameters('webSiteName')]",
        "[concat('AppInsights', parameters('webSiteName'))]"
      ],
      "properties": {
        "APPINSIGHTS_INSTRUMENTATIONKEY": "[reference(resourceId('Microsoft.Insights/components', concat('AppInsights', parameters('webSiteName'))), '2014-04-01').InstrumentationKey]",
        "APPINSIGHTS_PROFILERFEATURE_VERSION": "1.0.0",
        "APPINSIGHTS_SNAPSHOTFEATURE_VERSION": "1.0.0",
        "DiagnosticServices_EXTENSION_VERSION": "~3",
        "ApplicationInsightsAgent_EXTENSION_VERSION": "~2"
      }
    }
  ]
},
```

## Not Supported Scenarios

Below you can find scenarios where Snapshot Collector isn't supported:

|Scenario    | Side Effects | Recommendation |
|------------|--------------|----------------|
|You're using the Snapshot Collector SDK in your application directly (*.csproj*) and have enabled the advanced option "Interop".| The local Application Insights SDK (including Snapshot Collector telemetry) will be lost and no Snapshots will be available. <br/> Your application could crash at startup with `System.ArgumentException: telemetryProcessorTypedoes not implement ITelemetryProcessor.` <br/> [Learn more about the Application Insights feature "Interop".](../app/azure-web-apps-net-core.md#troubleshooting) | If you're using the advanced option "Interop", use the codeless Snapshot Collector injection (enabled through the Azure portal). |

## Next steps

* Generate traffic to your application that can trigger an exception. Then, wait 10 to 15 minutes for snapshots to be sent to the Application Insights instance.
* See [snapshots](snapshot-debugger-data.md?toc=/azure/azure-monitor/toc.json#view-snapshots-in-the-portal) in the Azure portal.
* For help with troubleshooting Snapshot Debugger issues, see [Snapshot Debugger troubleshooting](snapshot-debugger-troubleshoot.md).

[Enablement UI]: ./media/snapshot-debugger/enablement-ui.png
[snapshot-debugger-app-setting]:./media/snapshot-debugger/snapshot-debugger-app-setting.png
