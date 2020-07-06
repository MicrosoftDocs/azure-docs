---
title: Enable Snapshot Debugger for .NET apps in Azure App Service | Microsoft Docs
description: Enable Snapshot Debugger for .NET apps in Azure App Service
ms.topic: conceptual
author: brahmnes
ms.author: bfung
ms.date: 03/26/2019

ms.reviewer: mbullwin
---

# Enable Snapshot Debugger for .NET apps in Azure App Service

Snapshot Debugger currently works for ASP.NET and ASP.NET Core apps that are running on Azure App Service on Windows service plans.

## <a id="installation"></a> Enable Snapshot Debugger
To enable Snapshot Debugger for an app, follow the instructions below. If you are running a different type of Azure service, here are instructions for enabling Snapshot Debugger on other supported platforms:
* [Azure Cloud Services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Service Fabric services](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [Azure Virtual Machines and virtual machine scale sets](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)
* [On-premises virtual or physical machines](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json)

If you are using a preview version of .NET Core, please follow the instructions for [Enable Snapshot Debugger for other environments](snapshot-debugger-vm.md?toc=/azure/azure-monitor/toc.json) first to include the [Microsoft.ApplicationInsights.SnapshotCollector](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector) NuGet package with the application, and then complete the rest of the instructions below. 

Application Insights Snapshot Debugger is pre-installed as part of the App Services runtime, but you need to turn it on to get snapshots for your App Service app. Once you have deployed an app, even if you have included the Application Insights SDK in the source code, follow the steps below to enable the snapshot debugger.

1. Navigate to the Azure control panel for your App Service.
2. Go to the **Settings > Application Insights** page.

   ![Enable App Insights on App Services portal](./media/snapshot-debugger/applicationinsights-appservices.png)

3. Either follow the instructions on the page to create a new resource or select an existing App Insights resource to monitor your app. Also make sure both switches for Snapshot Debugger are **On**.

   ![Add App Insights site extension][Enablement UI]

4. Snapshot Debugger is now enabled using an App Services App Setting.

    ![App Setting for Snapshot Debugger][snapshot-debugger-app-setting]

## Disable Snapshot Debugger

Follow the same steps as for **Enable Snapshot Debugger**, but switch both switches for Snapshot Debugger to **Off**.
We recommend that you have Snapshot Debugger enabled on all your apps to ease diagnostics of application exceptions.

## Azure Resource Manager template

For an Azure App Service, you can set app settings in an Azure Resource Manager template to enable Snapshot Debugger and Profiler. You add a config resource that contains the app settings as a child resource of the website:

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

