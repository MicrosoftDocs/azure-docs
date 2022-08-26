---
title: Enable Profiler for Azure App Service apps | Microsoft Docs
description: Profile live apps on Azure App Service with Application Insights Profiler.
ms.topic: conceptual
ms.date: 07/15/2022
ms.reviewer: jogrima
---

# Enable Profiler for Azure App Service apps

Application Insights Profiler is pre-installed as part of the App Services runtime. You can run Profiler on ASP.NET and ASP.NET Core apps running on Azure App Service using Basic service tier or higher. Follow these steps even if you've included the App Insights SDK in your application at build time.

To enable Profiler on Linux, walk through the [ASP.NET Core Azure Linux web apps instructions](profiler-aspnetcore-linux.md).

> [!NOTE]
> Codeless installation of Application Insights Profiler follows the .NET Core support policy.  
> For more information about supported runtime, see [.NET Core Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).


## Prerequisites

- An [Azure App Services ASP.NET/ASP.NET Core app](../../app-service/quickstart-dotnetcore.md).
- [Application Insights resource](../app/create-new-resource.md) connected to your App Service app. 

## Verify "Always On" setting is enabled

1. In the Azure portal, navigate to your App Service.
1. Under **Settings** in the left side menu, select **Configuration**.

   :::image type="content" source="./media/profiler/configuration-menu.png" alt-text="Screenshot of selecting Configuration from the left side menu.":::

1. Select the **General settings** tab.
1. Verify **Always On** > **On** is selected.

   :::image type="content" source="./media/profiler/always-on.png" alt-text="Screenshot of the General tab on the Configuration pane and showing the Always On being enabled.":::

1. Select **Save** if you've made changes.

## Enable Application Insights and Profiler

### For Application Insights and App Service in the same subscription

If your Application Insights resource is in the same subscription as your App Service:

1. Under **Settings** in the left side menu, select **Application Insights**.

   :::image type="content" source="./media/profiler/app-insights-menu.png" alt-text="Screenshot of selecting Application Insights from the left side menu.":::

1. Under **Application Insights**, select **Enable**.
1. Verify you've connected an Application Insights resource to your app. 

   :::image type="content" source="./media/profiler/enable-app-insights.png" alt-text="Screenshot of enabling App Insights on your app.":::

1. Scroll down and select the **.NET** or **.NET Core** tab, depending on your app.
1. Verify **Collection Level** > **Recommended** is selected.
1. Under **Profiler**, select **On**. 
   - If you chose the **Basic** collection level earlier, the Profiler setting is disabled. 
1. Select **Apply**, then **Yes** to confirm.

   :::image type="content" source="./media/profiler/enable-profiler.png" alt-text="Screenshot of enabling Profiler on your app.":::

### For Application Insights and App Service in different subscriptions

If your Application Insights resource is in a different subscription from your App Service, you'll need to enable Profiler manually by creating app settings for your Azure App Service. You can automate the creation of these settings using a template or other means. The settings needed to enable the Profiler:

|App Setting    | Value    |
|---------------|----------|
|APPINSIGHTS_INSTRUMENTATIONKEY         | iKey for your Application Insights resource    |
|APPINSIGHTS_PROFILERFEATURE_VERSION | 1.0.0 |
|DiagnosticServices_EXTENSION_VERSION | ~3 |

Set these values using:
- [Azure Resource Manager Templates](../app/azure-web-apps-net-core.md#app-service-application-settings-with-azure-resource-manager)
- [Azure PowerShell](/powershell/module/az.websites/set-azwebapp)
- [Azure CLI](/cli/azure/webapp/config/appsettings)

## Enable Profiler for regional clouds

Currently the only regions that require endpoint modifications are [Azure Government](../../azure-government/compare-azure-government-global-azure.md#application-insights) and [Azure China](/azure/china/resources-developer-guide).

|App Setting    | US Government Cloud | China Cloud |   
|---------------|---------------------|-------------|
|ApplicationInsightsProfilerEndpoint         | `https://profiler.monitor.azure.us`    | `https://profiler.monitor.azure.cn` |
|ApplicationInsightsEndpoint | `https://dc.applicationinsights.us` | `https://dc.applicationinsights.azure.cn` |

## Enable Azure Active Directory authentication for profile ingestion

Application Insights Profiler supports Azure AD authentication for profiles ingestion. For all profiles of your application to be ingested, your application must be authenticated and provide the required application settings to the Profiler agent.

Profiler only supports Azure AD authentication when you reference and configure Azure AD using the [Application Insights SDK](../app/asp-net-core.md#configure-the-application-insights-sdk) in your application.

To enable Azure AD for profiles ingestion:

1. Create and add the managed identity to authenticate against your Application Insights resource to your App Service.

   a.  [System-Assigned Managed identity documentation](../../app-service/overview-managed-identity.md?tabs=portal%2chttp#add-a-system-assigned-identity)

   b.  [User-Assigned Managed identity documentation](../../app-service/overview-managed-identity.md?tabs=portal%2chttp#add-a-user-assigned-identity)

1. [Configure and enable Azure AD](../app/azure-ad-authentication.md?tabs=net#configuring-and-enabling-azure-ad-based-authentication) in your Application Insights resource.

1. Add the following application setting to let the Profiler agent know which managed identity to use:

   For System-Assigned Identity:

   | App Setting    | Value    |
   | -------------- |--------- |
   | APPLICATIONINSIGHTS_AUTHENTICATION_STRING         | `Authorization=AAD`    |

   For User-Assigned Identity:

   | App Setting   | Value    |
   | ------------- | -------- |
   | APPLICATIONINSIGHTS_AUTHENTICATION_STRING         | `Authorization=AAD;ClientId={Client id of the User-Assigned Identity}`    |

## Disable Profiler

To stop or restart Profiler for an individual app's instance:

1. Under **Settings** in the left side menu, select **WebJobs**.

   :::image type="content" source="./media/profiler/web-jobs-menu.png" alt-text="Screenshot of selecting web jobs from the left side menu.":::

1. Select the webjob  named `ApplicationInsightsProfiler3`.

1. Click **Stop** from the top menu.

   :::image type="content" source="./media/profiler/stop-web-job.png" alt-text="Screenshot of selecting stop for stopping the webjob.":::

1. Select **Yes** to confirm.

We recommend that you have Profiler enabled on all your apps to discover any performance issues as early as possible.

Profiler's files can be deleted when using WebDeploy to deploy changes to your web application. You can prevent the deletion by excluding the App_Data folder from being deleted during deployment. 

## Next steps
Learn how to...
> [!div class="nextstepaction"]
> [Generate load and view Profiler traces](./profiler-data.md)
