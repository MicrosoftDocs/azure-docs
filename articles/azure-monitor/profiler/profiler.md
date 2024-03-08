---
title: Enable Profiler for Azure App Service apps | Microsoft Docs
description: Profile live apps on Azure App Service with Application Insights Profiler.
ms.topic: conceptual
ms.date: 09/21/2023
ms.reviewer: ryankahng
---

# Enable Profiler for Azure App Service apps

Application Insights Profiler is preinstalled as part of the Azure App Service runtime. You can run Profiler on ASP.NET and ASP.NET Core apps running on App Service by using the Basic service tier or higher. Follow these steps, even if you included the Application Insights SDK in your application at build time.

To enable Profiler on Linux, walk through the [ASP.NET Core Azure Linux web apps instructions](profiler-aspnetcore-linux.md).

> [!NOTE]
> Codeless installation of Application Insights Profiler follows the .NET Core support policy. For more information about supported runtime, see [.NET Core Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).

## Prerequisites

- An [Azure App Service ASP.NET/ASP.NET Core app](../../app-service/quickstart-dotnetcore.md).
- An [Application Insights resource](/previous-versions/azure/azure-monitor/app/create-new-resource) connected to your App Service app.

## Verify the "Always on" setting is enabled

1. In the Azure portal, go to your App Service instance.
1. Under **Settings** on the left pane, select **Configuration**.

   :::image type="content" source="./media/profiler/configuration-menu.png" alt-text="Screenshot that shows selecting Configuration on the left pane.":::

1. Select the **General settings** tab.
1. Verify that **Always on** > **On** is selected.

   :::image type="content" source="./media/profiler/always-on.png" alt-text="Screenshot that shows the General tab on the Configuration pane showing that Always On is enabled.":::

1. Select **Save** if you made changes.

## Enable Application Insights and Profiler

The following sections show you how to enable Application Insights for the same subscription or different subscriptions.

### For Application Insights and App Service in the same subscription

If your Application Insights resource is in the same subscription as your instance of App Service:

1. Under **Settings** on the left pane, select **Application Insights**.

   :::image type="content" source="./media/profiler/app-insights-menu.png" alt-text="Screenshot that shows selecting Application Insights on the left pane.":::

1. Under **Application Insights**, select **Enable**.
1. Verify that you connected an Application Insights resource to your app.

   :::image type="content" source="./media/profiler/enable-app-insights.png" alt-text="Screenshot that shows enabling Application Insights on your app.":::

1. Scroll down and select the **.NET** or **.NET Core** tab, depending on your app.
1. Verify that **Collection level** > **Recommended** is selected.
1. Under **Profiler**, select **On**.

   If you chose the **Basic** collection level earlier, the Profiler setting is disabled.
1. Select **Apply** > **Yes** to confirm.

   :::image type="content" source="./media/profiler/enable-profiler.png" alt-text="Screenshot that shows enabling Profiler on your app.":::

### For Application Insights and App Service in different subscriptions

If your Application Insights resource is in a different subscription from your instance of App Service, you need to enable Profiler manually by creating app settings for your App Service instance. You can automate the creation of these settings by using a template or other means. Here are the settings you need to enable Profiler.

|App setting    | Value    |
|---------------|----------|
|APPINSIGHTS_INSTRUMENTATIONKEY         | iKey for your Application Insights resource    |
|APPINSIGHTS_PROFILERFEATURE_VERSION | 1.0.0 |
|DiagnosticServices_EXTENSION_VERSION | ~3 |

Set these values by using:
- [Azure Resource Manager templates](../app/azure-web-apps-net-core.md#app-service-application-settings-with-azure-resource-manager)
- [Azure PowerShell](/powershell/module/az.websites/set-azwebapp)
- [Azure CLI](/cli/azure/webapp/config/appsettings)

## Enable Profiler for regional clouds

Currently, the only regions that require endpoint modifications are [Azure Government](../../azure-government/compare-azure-government-global-azure.md#application-insights) and [Microsoft Azure operated by 21Vianet](/azure/china/resources-developer-guide).

|App setting    | US Government Cloud | China Cloud |   
|---------------|---------------------|-------------|
|ApplicationInsightsProfilerEndpoint         | `https://profiler.monitor.azure.us`    | `https://profiler.monitor.azure.cn` |
|ApplicationInsightsEndpoint | `https://dc.applicationinsights.us` | `https://dc.applicationinsights.azure.cn` |

<a name='enable-azure-active-directory-authentication-for-profile-ingestion'></a>

## Enable Microsoft Entra authentication for profile ingestion

Application Insights Profiler supports Microsoft Entra authentication for profile ingestion. For all profiles of your application to be ingested, your application must be authenticated and provide the required application settings to the Profiler agent.

Profiler only supports Microsoft Entra authentication when you reference and configure Microsoft Entra ID by using the [Application Insights SDK](../app/asp-net-core.md#configure-the-application-insights-sdk) in your application.

To enable Microsoft Entra ID for profile ingestion:

1. Create and add the managed identity to authenticate against your Application Insights resource to your App Service:

   1.  [System-assigned managed identity documentation](../../app-service/overview-managed-identity.md?tabs=portal%2chttp#add-a-system-assigned-identity)

   1.  [User-assigned managed identity documentation](../../app-service/overview-managed-identity.md?tabs=portal%2chttp#add-a-user-assigned-identity)

1. [Configure and enable Microsoft Entra ID](../app/azure-ad-authentication.md?tabs=net#configure-and-enable-azure-ad-based-authentication) in your Application Insights resource.

1. Add the following application setting to let the Profiler agent know which managed identity to use.

   - For system-assigned identity:

       | App setting    | Value    |
       | -------------- |--------- |
       | APPLICATIONINSIGHTS_AUTHENTICATION_STRING         | `Authorization=AAD`    |

   - For user-assigned identity:

       | App setting   | Value    |
       | ------------- | -------- |
       | APPLICATIONINSIGHTS_AUTHENTICATION_STRING         | `Authorization=AAD;ClientId={Client id of the User-Assigned Identity}`    |

## Disable Profiler

To stop or restart Profiler for an individual app's instance:

1. Under **Settings** on the left pane, select **WebJobs**.

   :::image type="content" source="./media/profiler/web-jobs-menu.png" alt-text="Screenshot that shows selecting web jobs on the left pane.":::

1. Select the webjob  named `ApplicationInsightsProfiler3`.

1. Select **Stop**.

   :::image type="content" source="./media/profiler/stop-web-job.png" alt-text="Screenshot that shows selecting stop for stopping the webjob.":::

1. Select **Yes** to confirm.

We recommend that you have Profiler enabled on all your apps to discover any performance issues as early as possible.

You can delete Profiler's files when you use WebDeploy to deploy changes to your web application. You can prevent the deletion by excluding the *App_Data* folder from being deleted during deployment.

## Next steps
- Learn how to [generate load and view Profiler traces](./profiler-data.md)
- Learn how to use the [Code Optimizations feature](../insights/code-optimizations.md) alongside the Application Insights Profiler
