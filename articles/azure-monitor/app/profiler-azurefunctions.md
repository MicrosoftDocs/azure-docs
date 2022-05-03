---
title: Profile Azure Function App with Application Insights Profiler
description: Enable Application Insights Profiler for Azure Function App.
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: charles.weininger
ms.topic: conceptual
ms.date: 05/03/2022
---

# Profile live Azure Function App with Application Insights

In this article, you'll use the Azure portal to:
- View the current app settings for your Function App. 
- Add two new app settings to enable Profiler on the Function App. 
- Navigate to the Profiler for your Function App to view data.

> [!NOTE]
> You can enable the Application Insights Profiler for Azure Function Apps on the **App Service** plan. 

## Pre-requisites

- [An Azure Function App](../../azure-functions/functions-create-function-app-portal.md). Verify your Function App is on the **App Service** plan. 
     
  :::image type="content" source="./media/profiler-azurefunctions/choose-plan.png" alt-text="Where to select App Service plan from drop-down in Function App creation":::


- Linked to [an Application Insights resource](./create-new-resource.md). Make note of the instrumentation key.

## App settings for enabling Profiler

|App Setting    | Value    |
|---------------|----------|
|APPINSIGHTS_PROFILERFEATURE_VERSION | 1.0.0 |
|DiagnosticServices_EXTENSION_VERSION | ~3 |

## Add app settings to your Azure Function App

From your Function App overview page in the Azure portal:

1. Under **Settings**, select **Configuration**.

   :::image type="content" source="./media/profiler-azurefunctions/configuration-menu.png" alt-text="Selecting Configuration from under the Settings section of the left side menu":::

1. In the **Application settings** tab, verify the `APPINSIGHTS_INSTRUMENTATIONKEY` setting is included in the settings list.

   :::image type="content" source="./media/profiler-azurefunctions/appinsights-key.png" alt-text="Screenshot showing the App Insights Instrumentation Key setting in the list":::

1. Select **New application setting**.

   :::image type="content" source="./media/profiler-azurefunctions/new-setting-button.png" alt-text="Screenshot outlining the new application setting button":::

1. Copy the **App Setting** and its **Value** from the [table above](#app-settings-for-enabling-profiler) and paste into the corresponding fields.

   :::image type="content" source="./media/profiler-azurefunctions/app-setting-1.png" alt-text="Screenshot adding the app insights profiler feature version setting":::

   :::image type="content" source="./media/profiler-azurefunctions/app-setting-2.png" alt-text="Screenshot adding the diagnostic services extension version setting":::

   Leave the **Deployment slot setting** blank for now.

1. Click **OK**.

1. Click **Save** in the top menu, then **Continue**.

   :::image type="content" source="./media/profiler-azurefunctions/save-button.png" alt-text="Screenshot outlining the save button in the top menu of the configuration blade":::

   :::image type="content" source="./media/profiler-azurefunctions/continue-button.png" alt-text="Screenshot outlining the continue button in the dialog after saving":::

The app settings now show up in the table:

   :::image type="content" source="./media/profiler-azurefunctions/app-settings-table.png" alt-text="Screenshot showing the two new app settings in the table on the configuration blade":::


## View the Profiler data for your Azure Function App

1. Under **Settings**, select **Application Insights (preview)** from the left menu.

   :::image type="content" source="./media/profiler-azurefunctions/app-insights-menu.png" alt-text="Screenshot showing application insights from the left menu of the function app":::

1. Select **View Application Insights data**.

   :::image type="content" source="./media/profiler-azurefunctions/view-app-insights-data.png" alt-text="Screenshot showing the button for viewing application insights data for the function app":::

1. On the App Insights page for your Function App, select **Performance** from the left menu.

   :::image type="content" source="./media/profiler-azurefunctions/performance-menu.png" alt-text="Screenshot showing the performance link in the left menu of the app insights blade of the function app":::

1. Select **Profiler** from the top menu of the Performance blade.

   :::image type="content" source="./media/profiler-azurefunctions/profiler-function-app.png" alt-text="Screenshot showing link to profiler for function app":::


## Next Steps

- Set these values using [Azure Resource Manager Templates](./azure-web-apps-net-core.md#app-service-application-settings-with-azure-resource-manager), [Azure PowerShell](/powershell/module/az.websites/set-azwebapp), or the [Azure CLI](/cli/azure/webapp/config/appsettings).
- Learn more about [Profiler settings](profiler-settings.md).
