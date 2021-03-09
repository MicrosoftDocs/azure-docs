---
title: Enable Snapshot Debugger for .NET apps in Azure App Service | Microsoft Docs
description: Enable Snapshot Debugger for .NET apps in Azure App Service
ms.topic: conceptual
author: cweining
ms.author: cweining
ms.date: 03/26/2019

ms.reviewer: mbullwin
---

# Enable Snapshot Debugger for .NET apps in Azure App Service

Snapshot Debugger currently supports ASP.NET and ASP.NET Core apps that are running on Azure App Service on Windows service plans.

We recommend you run your application on the Basic service tier, or higher, when using snapshot debugger.

For most applications, the Free and Shared service tiers don't have enough memory or disk space to save snapshots.

## <a id="installation"></a> Enable Snapshot Debugger
To enable Snapshot Debugger for an app, follow the instructions below.

If you're running a different type of Azure service, here are instructions for enabling Snapshot Debugger on other supported platforms:
* [Azure Function](snapshot-debugger-function-app.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Service Fabric services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Virtual Machines and virtual machine scale sets](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [On-premises virtual or physical machines](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)

> [!NOTE]
> If you're using a preview version of .NET Core, or your application references Application Insights SDK, directly or indirectly via a dependent assembly, follow the instructions for [Enable Snapshot Debugger for other environments](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) to include the [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package with the application, and then complete the rest of the instructions below. 
>
> Codeless installation of Application Insights Snapshot Debugger follows the .NET Core support policy.
> For more information about supported runtimes, see [.NET Core Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).

Snapshot Debugger is pre-installed as part of the App Services runtime, but you need to turn it on to get snapshots for your App Service app.

Once you've deployed an app, follow the steps below to enable the snapshot debugger:

1. Navigate to the Azure control panel for your App Service.
2. Go to the **Settings > Application Insights** page.

   ![Enable App Insights on App Services portal](./media/snapshot-debugger/applicationinsights-appservices.png)

3. Either follow the instructions on the page to create a new resource or select an existing App Insights resource to monitor your app. Also make sure both switches for Snapshot Debugger are **On**.

   ![Add App Insights site extension][Enablement UI]

4. Snapshot Debugger is now enabled using an App Services App Setting.

    ![App Setting for Snapshot Debugger][snapshot-debugger-app-setting]

## Enable Snapshot Debugger for other clouds

Currently the only regions that require endpoint modifications are [Azure Government](https://docs.microsoft.com/azure/azure-government/compare-azure-government-global-azure#application-insights) and [Azure China](https://docs.microsoft.com/azure/china/resources-developer-guide) through the Application Insights Connection String.

|Connection String Property    | US Government Cloud | China Cloud |   
|---------------|---------------------|-------------|
|SnapshotEndpoint         | `https://snapshot.monitor.azure.us`    | `https://snapshot.monitor.azure.cn` |

For more information about other connection overrides, see [Application Insights documentation](https://docs.microsoft.com/azure/azure-monitor/app/sdk-connection-string?tabs=net#connection-string-with-explicit-endpoint-overrides).

## Disable Snapshot Debugger

Follow the same steps as for **Enable Snapshot Debugger**, but switch both switches for Snapshot Debugger to **Off**.

We recommend you have Snapshot Debugger enabled on all your apps to ease diagnostics of application exceptions.

## Azure Resource Manager template

For an Azure App Service, you can set app settings within the Azure Resource Manager template to enable Snapshot Debugger and Profiler, see the below template snippet:

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

## Next steps

- Generate traffic to your application that can trigger an exception. Then, wait 10 to 15 minutes for snapshots to be sent to the Application Insights instance.
- See [snapshots](snapshot-debugger.md?toc=/azure/azure-monitor/toc.json#view-snapshots-in-the-portal) in the Azure portal.
- For help with troubleshooting Snapshot Debugger issues, see [Snapshot Debugger troubleshooting](snapshot-debugger-troubleshoot.md?toc=/azure/azure-monitor/toc.json).

[Enablement UI]: ./media/snapshot-debugger/enablement-ui.png
[snapshot-debugger-app-setting]:./media/snapshot-debugger/snapshot-debugger-app-setting.png

