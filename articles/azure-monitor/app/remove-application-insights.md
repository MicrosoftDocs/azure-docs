---
title: 'Remove Application Insights in Visual Studio: Azure Monitor' 
description: This article shows you how to remove the Application Insights SDK for ASP.NET and ASP.NET Core in Visual Studio. 
ms.topic: conceptual
ms.date: 04/06/2020
ms.reviewer: cithomas
---

# Remove Application Insights in Visual Studio

This article shows you how to remove the ASP.NET and ASP.NET Core Application Insights SDK in Visual Studio.

To remove Application Insights, you remove the NuGet packages and references from the API in your application. You can uninstall NuGet packages by using the Package Management Console or the Manage NuGet Solution in Visual Studio.

The following sections show two ways to remove NuGet packages and what was automatically added in your project. Confirm that the files added and the areas within your own code in which you made calls to the API are removed.

## Uninstall by using the Package Management Console

# [.NET](#tab/net)

1. To open the Package Management Console, select **Tools** > **NuGet Package Manager** > **Package Manager Console**.
     
    ![Screenshot that shows selecting Tools > NuGet Package Manager > Package Manager Console.](./media/remove-application-insights/package-manager.png)

    > [!NOTE]
    > If trace collection is enabled, you need to first uninstall Microsoft.ApplicationInsights.TraceListener. Enter `Uninstall-package Microsoft.ApplicationInsights.TraceListener`. Then follow the next steps to remove Microsoft.ApplicationInsights.Web.

1. Enter the following command: `Uninstall-Package Microsoft.ApplicationInsights.Web -RemoveDependencies`

    After you enter the command, the Application Insights package and all its dependencies are uninstalled from the project.
    
    ![Screenshot that shows entering the command in the console.](./media/remove-application-insights/package-management-console.png)

# [.NET Core](#tab/netcore)

1. To open the Package Management Console, select **Tools** > **NuGet Package Manager** > **Package Manager Console**.

    ![Screenshot that shows Tools > NuGet Package Manager > Package Manager Console.](./media/remove-application-insights/package-manager.png)

1. Enter the following command: `Uninstall-Package Microsoft.ApplicationInsights.AspNetCore -RemoveDependencies`

    After you enter the command, the Application Insights package and all its dependencies are uninstalled from the project.

---

## Uninstall by using the Visual Studio NuGet UI

# [.NET](#tab/net)

1. In the Solution Explorer on the right,right-click **Solution** and select **Manage NuGet Packages for Solution**.

    On the screen that appears, you can edit all the NuGet packages that are part of the project.
    
     ![Screenshot that shows right-clicking Solution in the Solution Explorer, and then selecting Manage NuGet Packages for Solution.](./media/remove-application-insights/manage-nuget-framework.png)

    > [!NOTE]
    > If trace collection is enabled, you need to first uninstall Microsoft.ApplicationInsights.TraceListener without removing the dependencies selected. Then follow the next steps to uninstall Microsoft.ApplicationInsights.Web with remove dependencies selected.

1. Select the **Microsoft.ApplicationInsights.Web** package. On the right, select the **Project** checkbox to select all projects.

1. To remove all dependencies when you uninstall, select the **Options** dropdown under the section where you selected a project.

    Under **Uninstall Options**, select the **Remove dependencies** checkbox.

1. Select **Uninstall**.
    
    ![Screenshot that shows the Microsoft.ApplicationInsights.Web window with Remove dependencies checked and Uninstall highlighted.](./media/remove-application-insights/uninstall-framework.png)

1. A dialog appears that shows all the dependencies to be removed from the application. Select **OK** to uninstall.
    
    ![Screenshot that shows a dialog with the dependencies to be removed.](./media/remove-application-insights/preview-uninstall-framework.png)
    
1.  After everything is uninstalled, you might still see **ApplicationInsights.config** and **AiHandleErrorAttribute.cs** in the Solution Explorer. You can delete the two files manually.

# [.NET Core](#tab/netcore)

1. In the Solution Explorer on the right, right-click **Solution** and select **Manage NuGet Packages for Solution**.

   A screen appears where you can edit all the NuGet packages that are part of the project.

    ![Screenshot that shows right-clicking Solution in the Solution Explorer and then select Manage NuGet Packages for Solution.](./media/remove-application-insights/manage-nuget-core.png)

1. Select the **Microsoft.ApplicationInsights.AspNetCore** package. On the right, select the **Project** checkbox to select all projects and then select **Uninstall**.

    ![Screenshot that shows Check remove dependencies, then Uninstall.](./media/remove-application-insights/uninstall-core.png)

---

## What is created when you add Application Insights

When you add Application Insights to your project, it creates files and adds code to some of your files. Solely uninstalling the NuGet Packages doesn't always discard the files and code. To fully remove Application Insights, check and manually delete the added code or files along with any API calls you added in your project.

# [.NET](#tab/net)

When you add Application Insights telemetry to a Visual Studio ASP.NET project, it adds the following files:

- ApplicationInsights.config
- AiHandleErrorAttribute.cs

The following pieces of code are added:

- [Your project's name].csproj

    ```C#
     <ApplicationInsightsResourceId>/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Default-ApplicationInsights-EastUS/providers/microsoft.insights/components/WebApplication4</ApplicationInsightsResourceId>
    ```

- Packages.config

    ```xml
    <packages>
    ...
    
      <package id="Microsoft.ApplicationInsights" version="2.12.0" targetFramework="net472" />
      <package id="Microsoft.ApplicationInsights.Agent.Intercept" version="2.4.0" targetFramework="net472" />
      <package id="Microsoft.ApplicationInsights.DependencyCollector" version="2.12.0" targetFramework="net472" />
      <package id="Microsoft.ApplicationInsights.PerfCounterCollector" version="2.12.0" targetFramework="net472" />
      <package id="Microsoft.ApplicationInsights.Web" version="2.12.0" targetFramework="net472" />
      <package id="Microsoft.ApplicationInsights.WindowsServer" version="2.12.0" targetFramework="net472" />
      <package id="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel" version="2.12.0" targetFramework="net472" />
    
      <package id="Microsoft.AspNet.TelemetryCorrelation" version="1.0.7" targetFramework="net472" />
    
      <package id="System.Buffers" version="4.4.0" targetFramework="net472" />
      <package id="System.Diagnostics.DiagnosticSource" version="4.6.0" targetFramework="net472" />
      <package id="System.Memory" version="4.5.3" targetFramework="net472" />
      <package id="System.Numerics.Vectors" version="4.4.0" targetFramework="net472" />
      <package id="System.Runtime.CompilerServices.Unsafe" version="4.5.2" targetFramework="net472" />
    ...
    </packages>
    ```

- Layout.cshtml

    If your project has a Layout.cshtml file, the following code is added:
    
    ```html
    <head>
    ...
        <script type = 'text/javascript' >
            var appInsights=window.appInsights||function(config)
            {
                function r(config){ t[config] = function(){ var i = arguments; t.queue.push(function(){ t[config].apply(t, i)})} }
                var t = { config:config},u=document,e=window,o='script',s=u.createElement(o),i,f;for(s.src=config.url||'//az416426.vo.msecnd.net/scripts/a/ai.0.js',u.getElementsByTagName(o)[0].parentNode.appendChild(s),t.cookie=u.cookie,t.queue=[],i=['Event','Exception','Metric','PageView','Trace','Ajax'];i.length;)r('track'+i.pop());return r('setAuthenticatedUserContext'),r('clearAuthenticatedUserContext'),config.disableExceptionTracking||(i='onerror',r('_'+i),f=e[i],e[i]=function(config, r, u, e, o) { var s = f && f(config, r, u, e, o); return s !== !0 && t['_' + i](config, r, u, e, o),s}),t
            }({
                instrumentationKey:'00000000-0000-0000-0000-000000000000'
            });
            
            window.appInsights=appInsights;
            appInsights.trackPageView();
        </script>
    ...
    </head>
    ```

- ConnectedService.json

    ```json
    {
      "ProviderId": "Microsoft.ApplicationInsights.ConnectedService.ConnectedServiceProvider",
      "Version": "16.0.0.0",
      "GettingStartedDocument": {
        "Uri": "https://go.microsoft.com/fwlink/?LinkID=613413"
      }
    }
    ```

- FilterConfig.cs

    ```csharp
            public static void RegisterGlobalFilters(GlobalFilterCollection filters)
            {
                filters.Add(new ErrorHandler.AiHandleErrorAttribute());// This line was added
            }
    ```

# [.NET Core](#tab/netcore)

When you add Application Insights telemetry to a Visual Studio ASP.NET Core template project, it adds the following code:

- [Your project's name].csproj

    ```csharp
      <PropertyGroup>
        <TargetFramework>netcoreapp3.1</TargetFramework>
        <ApplicationInsightsResourceId>/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/Default-ApplicationInsights-EastUS/providers/microsoft.insights/components/WebApplication4core</ApplicationInsightsResourceId>
      </PropertyGroup>
    
      <ItemGroup>
        <PackageReference Include="Microsoft.ApplicationInsights.AspNetCore" Version="2.12.0" />
      </ItemGroup>
    
      <ItemGroup>
        <WCFMetadata Include="Connected Services" />
      </ItemGroup>
    ```

- Appsettings.json

    ```json
    "ApplicationInsights": {
        "InstrumentationKey": "00000000-0000-0000-0000-000000000000"
    ```

- ConnectedService.json
    
    ```json
    {
      "ProviderId": "Microsoft.ApplicationInsights.ConnectedService.ConnectedServiceProvider",
      "Version": "16.0.0.0",
      "GettingStartedDocument": {
        "Uri": "https://go.microsoft.com/fwlink/?LinkID=798432"
      }
    }
    ```
- Startup.cs

    ```csharp
       public void ConfigureServices(IServiceCollection services)
            {
                services.AddRazorPages();
                services.AddApplicationInsightsTelemetry(); // This is added
            }
    ```

---

## Next steps

[Azure Monitor](../overview.md)
