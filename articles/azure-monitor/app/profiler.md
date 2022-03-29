---
title: Profile live Azure App Service apps with Application Insights | Microsoft Docs
description: Profile live apps on Azure App Service with Application Insights Profiler.
ms.topic: conceptual
ms.date: 08/06/2018
---

# Profile live Azure App Service apps with Application Insights

You can run Profiler on ASP.NET and ASP.NET Core apps that are running on Azure App Service using Basic service tier or higher. Enabling Profiler on Linux is currently only possible via [this method](profiler-aspnetcore-linux.md).

## <a id="installation"></a> Enable Profiler for your app
To enable Profiler for an app, follow the instructions below. If you're running a different type of Azure service, here are instructions for enabling Profiler on other supported platforms:
* [Cloud Services](./profiler-cloudservice.md?toc=%2fazure%2fazure-monitor%2ftoc.json)
* [Service Fabric Applications](./profiler-servicefabric.md?toc=%2fazure%2fazure-monitor%2ftoc.json)
* [Virtual Machines](./profiler-vm.md?toc=%2fazure%2fazure-monitor%2ftoc.json)

Application Insights Profiler is pre-installed as part of the App Services runtime. The steps below will show you how to enable it for your App Service. Follow these steps even if you've included the App Insights SDK in your application at build time.

> [!NOTE]
> Codeless installation of Application Insights Profiler follows the .NET Core support policy.
> For more information about supported runtimes, see [.NET Core Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).

1. Navigate to the Azure control panel for your App Service.
1. Enable "Always On" setting for your app service. You can find this setting under **Settings**, **Configuration** page (see screenshot in the next step), and select the **General settings** tab.
1. Navigate to **Settings > Application Insights** page.

   ![Enable App Insights on App Services portal](./media/profiler/AppInsights-AppServices.png)

1. Either follow the instructions on the pane to create a new resource or select an existing App Insights resource to monitor your app. Also make sure the Profiler is **On**. If your Application Insights resource is in a different subscription from your App Service, you can't use this page to configure Application Insights. You can still do it manually though by creating the necessary app settings manually. [The next section contains instructions for manually enabling Profiler.](#enable-profiler-manually-or-with-azure-resource-manager) 

   ![Add App Insights site extension][Enablement UI]

1. Profiler is now enabled using an App Services App Setting.

    ![App Setting for Profiler][profiler-app-setting]

## Enable Profiler manually or with Azure Resource Manager
Application Insights Profiler can be enabled by creating app settings for your Azure App Service. The page with the options shown above creates these app settings for you. But you can automate the creation of these settings using a template or other means. These settings will also work if your Application Insights resource is in a different subscription from your Azure App Service.
Here are the settings needed to enable the profiler:

|App Setting    | Value    |
|---------------|----------|
|APPINSIGHTS_INSTRUMENTATIONKEY         | iKey for your Application Insights resource    |
|APPINSIGHTS_PROFILERFEATURE_VERSION | 1.0.0 |
|DiagnosticServices_EXTENSION_VERSION | ~3 |


You can set these values using [Azure Resource Manager Templates](./azure-web-apps-net-core.md#app-service-application-settings-with-azure-resource-manager), [Azure PowerShell](/powershell/module/az.websites/set-azwebapp),  [Azure CLI](/cli/azure/webapp/config/appsettings).

## Enable Profiler for other clouds

Currently the only regions that require endpoint modifications are [Azure Government](../../azure-government/compare-azure-government-global-azure.md#application-insights) and [Azure China](/azure/china/resources-developer-guide).

|App Setting    | US Government Cloud | China Cloud |   
|---------------|---------------------|-------------|
|ApplicationInsightsProfilerEndpoint         | `https://profiler.monitor.azure.us`    | `https://profiler.monitor.azure.cn` |
|ApplicationInsightsEndpoint | `https://dc.applicationinsights.us` | `https://dc.applicationinsights.azure.cn` |

## Enable Azure Active Directory authentication for profile ingestion

Application Insights Profiler supports Azure AD authentication for profiles ingestion. This means, for all profiles of your application to be ingested, your application must be authenticated and provide the required application settings to the Profiler agent.

As of today, Profiler only supports Azure AD authentication when you reference and configure Azure AD using the Application Insights SDK in your application.

Below you can find all the steps required to enable Azure AD for profiles ingestion:
1. Create and add the managed identity you want to use to authenticate against your Application Insights resource to your App Service.

   a.  For System-Assigned Managed identity, see the following [documentation](../../app-service/overview-managed-identity.md?tabs=portal%2chttp#add-a-system-assigned-identity)

   b.  For User-Assigned Managed identity, see the following [documentation](../../app-service/overview-managed-identity.md?tabs=portal%2chttp#add-a-user-assigned-identity)

2. Configure and enable Azure AD in your Application Insights resource. For more information, see the following [documentation](./azure-ad-authentication.md?tabs=net#configuring-and-enabling-azure-ad-based-authentication)
3. Add the following application setting, used to let Profiler agent know which managed identity to use:

For System-Assigned Identity:

|App Setting    | Value    |
|---------------|----------|
|APPLICATIONINSIGHTS_AUTHENTICATION_STRING         | Authorization=AAD    |

For User-Assigned Identity:

|App Setting    | Value    |
|---------------|----------|
|APPLICATIONINSIGHTS_AUTHENTICATION_STRING         | Authorization=AAD;ClientId={Client id of the User-Assigned Identity}    |

## Disable Profiler

To stop or restart Profiler for an individual app's instance, on the left sidebar, select **WebJobs** and stop the webjob named `ApplicationInsightsProfiler3`.

  ![Disable Profiler for a web job][disable-profiler-webjob]

We recommend that you have Profiler enabled on all your apps to discover any performance issues as early as possible.

Profiler's files can be deleted when using WebDeploy to deploy changes to your web application. You can prevent the deletion by excluding the App_Data folder from being deleted during deployment. 


## Next steps

* [Working with Application Insights in Visual Studio](./visual-studio.md)

[Enablement UI]: ./media/profiler/Enablement_UI.png
[profiler-app-setting]:./media/profiler/profiler-app-setting.png
[disable-profiler-webjob]: ./media/profiler/disable-profiler-webjob.png