---
title: Azure Application Insights for ASP.NET Core | Microsoft Docs
description: Monitor web applications for availability, performance and usage.
services: application-insights
documentationcenter: .net
author: mrbullwinkle
manager: carmonm
ms.assetid: 3b722e47-38bd-4667-9ba4-65b7006c074c
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 06/03/2018
ms.author: mbullwin
---

# Application Insights for ASP.NET Core

Azure Application Insights provides in-depth monitoring of your web application down to the code level. You can easily monitor your web application for availability, performance, and usage. You can also quickly identify and diagnose errors in your application without waiting for a user to report them.

This article walks you through creating a sample ASP.NET Core [Razor Pages](https://docs.microsoft.com/aspnet/core/mvc/razor-pages/?tabs=visual-studio) application in Visual Studio, and how to start monitoring with Azure Application Insights.

## Prerequisites

- NET Core 2.0.0 SDK or later.
- [Visual Studio 2017](https://www.visualstudio.com/downloads/) version 15.7.3 or later with the ASP.NET and web development workload. 

## Create an ASP.NET Core project in Visual Studio

1. Right-click and Launch **Visual Studio 2017** as administrator.
2. Select **File** > **New** > **Project** (Ctrl-Shift-N).

   ![Screenshot of Visual Studio File New Project Menu](./media/app-insights-asp-net-core/001-new-project.png)

3. Expand **Visual C#** > Select **.NET Core** > **ASP.NET Core Web Application**. Enter a **Name** > **Solution name** > Check **Create new Git repository**.

   ![Screenshot of Visual Studio File New Project Wizard](./media/app-insights-asp-net-core/002-asp-net-core-web-application.png)

4. Select **.Net Core** > **ASP.NET Core 2.0** **Web Application** > **OK**.

    ![Screenshot of Visual Studio File New Project Selection Menu](./media/app-insights-asp-net-core/003-web-application.png)

## Application Insights search

By default in Visual Studio version 2015 Update 2 or greater with an ASP.NET Core 2+ based project you can take advantage of [Application Insights search](https://docs.microsoft.com/azure/application-insights/app-insights-visual-studio) even before you explicitly add Application Insights to your project.

To test out this functionality:

1. Run your app by clicking IIS Express ![Screenshot of Visual Studio IIS Express icon](./media/app-insights-asp-net-core/004-iis-express.png)

2. Select **View** > **Other Windows** > **Application Insights search**.

   ![Screenshot of Visual Studio Diagnostic Tools](./media/app-insights-asp-net-core/005-view-other-windows-search.png)

3. The debug session telemetry is currently available for local analysis only. To fully enable Application Insights, select **Telemetry Readiness** in the upper right, or follow the steps in the next section.

   ![Screenshot of Visual Studio Application Insights Search](./media/app-insights-asp-net-core/006-search.png)

> [!NOTE]
> To learn more about how Visual Studio lights up features like [Application Insights Search](app-insights-visual-studio.md) and [CodeLens](app-insights-visual-studio-codelens.md) locally before you have added Application Insights to your ASP.NET Core project check out the explanation at the [end of this article.](#Application-Insights-search-continued)

## Add Application Insights Telemetry

1. Select **Project** > **Add Application Insights Telemetry...**. (Or you can right-click **Connected Services** and select Add Connected Service.)

    ![Screenshot of Visual Studio File New Project Selection Menu](./media/app-insights-asp-net-core/007-project-add-telemetry.png)

2. Select **Get Started**. (Depending on your version of Visual Studio the text may vary slightly. Some older versions instead, have a **Start Free** button.)

    ![Screenshot of Visual Studio File New Project Selection Menu](./media/app-insights-asp-net-core/008-get-started.png)

3. Select an appropriate **Subscription** > **Resource** > **Register**.

## Changes Made to your project

Application Insights is low overhead. To review the modifications made to your project by adding Application Insights telemetry:

Select **View** > **Team Explorer** (Ctrl+\, Ctrl+M) > **Project** > **Changes**

- Four changes total:

  ![Screenshot of files changed by adding Application Insights](./media/app-insights-asp-net-core/009-changes.png)

- One new file is created:

   _ConnectedService.json_

```json
{
  "ProviderId": "Microsoft.ApplicationInsights.ConnectedService.ConnectedServiceProvider",
  "Version": "8.12.10405.1",
  "GettingStartedDocument": {
    "Uri": "https://go.microsoft.com/fwlink/?LinkID=798432"
  }
}
```

- Three files are modified: (Additional comments added to highlight changes)

  _appsettings.json_

```json
{
  "Logging": {
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "Warning"
    }
  },
// Changes to file post adding Application Insights Telemetry:
  "ApplicationInsights": {
    "InstrumentationKey": "10101010-1010-1010-1010-101010101010"
  }
}
//
```

  _ContosoDotNetCore.csproj_

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>netcoreapp2.0</TargetFramework>
 <!--Changes to file post adding Application Insights Telemetry:-->
    <ApplicationInsightsResourceId>/subscriptions/2546c5a9-fa20-4de1-9f4a-62818b14b8aa/resourcegroups/Default-ApplicationInsights-EastUS/providers/microsoft.insights/components/DotNetCore</ApplicationInsightsResourceId>
    <ApplicationInsightsAnnotationResourceId>/subscriptions/2546c5a9-fa20-4de1-9f4a-62818b14b8aa/resourcegroups/Default-ApplicationInsights-EastUS/providers/microsoft.insights/components/DotNetCore</ApplicationInsightsAnnotationResourceId>
<!---->
  </PropertyGroup>
  <ItemGroup>
 <!--Changes to file post adding Application Insights Telemetry:-->
    <PackageReference Include="Microsoft.ApplicationInsights.AspNetCore" Version="2.1.1" />
<!---->
    <PackageReference Include="Microsoft.AspNetCore.All" Version="2.0.8" />
  </ItemGroup>
  <ItemGroup>
    <DotNetCliToolReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Tools" Version="2.0.4" />
  </ItemGroup>
<!--Changes to file post adding Application Insights Telemetry:-->
  <ItemGroup>
    <WCFMetadata Include="Connected Services" />
  </ItemGroup>
<!---->
</Project>
```

   _Program.cs_

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DotNetCore
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
// Change to file post adding Application Insights Telemetry:
                .UseApplicationInsights()
//
                .UseStartup<Startup>()
                .Build();
    }
}
```

## Synthetic transactions with PowerShell

To automate requests against your app with synthetic transactions.

1. Run your app by clicking IIS Express ![Screenshot of Visual Studio IIS Express icon](./media/app-insights-asp-net-core/004-iis-express.png)

2. Copy the url from the browser address bar. It is in the format http://localhost:{random port number}

   ![Screenshot of browser url address bar](./media/app-insights-asp-net-core/0013-copy-url.png)

3. Run the following PowerShell loop to create 100 synthetic transactions against your test app. Modify the port number after **localhost:** to match the url you copied in the previous step.

   ```PowerShell
   for ($i = 0 ; $i -lt 100; $i++)
   {
    Invoke-WebRequest -uri http://localhost:50984/
   }
   ```

## Open Application Insights Portal

After running the PowerShell from the previous section, launch Application Insights to view the transactions and confirm that data is being collected. 

From the Visual Studio menu, select **Project** > **Application Insights** > **Open Application Insights Portal**

   ![Screenshot of Application Insights Overview](./media/app-insights-asp-net-core/010-portal.png)

> [!NOTE]
> In the example screenshot above **Live Stream**, **Page View Load Time**, and **Failed Requests** are currently not collected. The next section will walk through adding each. If you are already collecting **Live Stream**, and **Page View Load Time**, then only follow the steps for **Failed Requests**.

## Collect Failed Requests, Live Stream, & Page View Load Time

### Failed Requests

Technically **Failed Requests** are being collected, but none have occurred yet. To speed the process along a custom exception can be added to the existing project to simulate a real-world exception. If your app is still running in Visual Studio before proceeding **Stop Debugging** (Shift+F5)

1. In **Solution Explorer** > expand **Pages** > **About.cshtml** > open **About.cshtml.cs**.

   ![Screenshot of Visual Studio Solution Explorer](./media/app-insights-asp-net-core/011-about.png)

2. Add an Exception under ``Message=`` and save the change to the file.

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc.RazorPages;

    namespace DotNetCore.Pages
    {
        public class AboutModel : PageModel
        {
            public string Message { get; set; }

            public void OnGet()
            {
                Message = "Your application description page.";
                throw new Exception("Test Exception");
            }
        }
    }
    ```

### Live Stream

To access the Live Stream functionality of Application Insights with ASP.NET Core update to the  **Microsoft.ApplicationInsights.AspNetCore 2.2.0** NuGet packages.

From Visual Studio, select **Project** > **Manage NuGet Packages** > **Microsoft.ApplicationInsights.AspNetCore** > Version **2.2.0** > **Update**.

  ![Screenshot of NuGet Package Manager](./media/app-insights-asp-net-core/012-nuget-update.png)

Multiple confirmation prompts will occur. Read and accept if you agree with the changes.

### Page View Load Time

1. In Visual Studio navigate to **Solution Explorer** > **Pages** > two files will need to be modified: _Layout.cshtml_, and _ViewImports.cshtml_

2. In __ViewImports.cshtml_, add:

   ```csharp
   @using Microsoft.ApplicationInsights.AspNetCore
   @inject JavaScriptSnippet snippet
   ```

3. In **_Layout.cshtml** add the line below before the ``</head>`` tag, but also prior to any other scripts.

    ```csharp
    @Html.Raw(snippet.FullScript)
    ```

### Test Failed Requests, Page View Load Time, Live Stream

To test out and confirm that everything is working:

1. Run your app by clicking IIS Express ![Screenshot of Visual Studio IIS Express icon](./media/app-insights-asp-net-core/0012-iis-express.png)

2. Navigate to the **About** page to trigger the test exception. (If you are running in Debug mode, you will need to click **Continue** in Visual Studio for the exception to show up in Application Insights.)

3. Rerun the simulated PowerShell transaction script from earlier (You may need to adjust the port number in the script.)

4. If the Applications Insights Overview is not still open, from Visual Studio menu select **Project** > **Application Insights** > **Open Application Insights Portal**. 

   > [!TIP]
   > If you aren't seeing your new traffic yet, check the **Time range** and click **Refresh**.

   ![Screenshot of Overview window](./media/app-insights-asp-net-core/0019-overview-updated.png)

5. Select Live Stream

   ![Screenshot of Live Metrics Stream](./media/app-insights-asp-net-core/0020-live-metrics-stream.png)

   (If your PowerShell script is still running you should see live metrics, if it has stopped run the script again with Live Stream open.)

## App Insights SDK Comparison

The Application Insights product group has been working hard to achieve  feature parity between the [full .NET Framework SDK](https://github.com/Microsoft/ApplicationInsights-dotnet) and the .Net Core SDK. The 2.2.0 release of the [ASP.NET Core SDK](https://github.com/Microsoft/ApplicationInsights-aspnetcore) for Application Insights has largely closed the feature gap.

To understand more about the differences and tradeoffs between [.NET and .NET Core](https://docs.microsoft.com/dotnet/standard/choosing-core-framework-server).

   | SDK Comparison | ASP.NET        | ASP.NET Core 2.1.0    | ASP.NET Core 2.2.0 |
  |:-- | :-------------: |:------------------------:|:----------------------:|
   | **Live Metrics**      | **+** |**-** | **+** |
   | **Server Telemetry Channel** | **+** |**-** | **+**|
   |**Adaptive Sampling**| **+** | **-** | **+**|
   | **SQL Dependency Calls**     | **+** |**-** | **+**|
   | **Performance Counters*** | **+** | **-**| **-**|

_Performance Counters_ in this context refers to [server-side performance counters](https://docs.microsoft.com/azure/application-insights/app-insights-performance-counters) like processor, memory, and disk utilization.

## Open-source SDK
[Read and contribute to the code](https://github.com/Microsoft/ApplicationInsights-aspnetcore#recent-updates)

## Application Insights search continued

To better understand how Application Insights search works in Visual Studio for an ASP.NET Core 2 project even when an explicit install of the Application Insights NuGet packages haven't happened yet. It can be helpful to examine the Debug Output.

If you search the output for the word _insight_ it will highlight results similar to the following:

```DebugOuput
'dotnet.exe' (CoreCLR: clrhost): Loaded 'C:\Program Files\dotnet\store\x64\netcoreapp2.0\microsoft.aspnetcore.applicationinsights.hostingstartup\2.0.3\lib\netcoreapp2.0\Microsoft.AspNetCore.ApplicationInsights.HostingStartup.dll'.
'dotnet.exe' (CoreCLR: clrhost): Loaded 'C:\Program Files\dotnet\store\x64\netcoreapp2.0\microsoft.applicationinsights.aspnetcore\2.1.1\lib\netstandard1.6\Microsoft.ApplicationInsights.AspNetCore.dll'.

Application Insights Telemetry (unconfigured): {"name":"Microsoft.ApplicationInsights.Dev.Message","time":"2018-06-03T17:32:38.2796801Z","tags":{"ai.location.ip":"127.0.0.1","ai.operation.name":"DEBUG /","ai.internal.sdkVersion":"aspnet5c:2.1.1","ai.application.ver":"1.0.0.0","ai.cloud.roleInstance":"CONTOSO-SERVER","ai.operation.id":"de85878e-4618b05bad11b5a6","ai.internal.nodeName":"CONTOSO-SERVER","ai.operation.parentId":"|de85878e-4618b05bad11b5a6."},"data":{"baseType":"MessageData","baseData":{"ver":2,"message":"Request starting HTTP/1.1 DEBUG http://localhost:53022/  0","severityLevel":"Information","properties":{"AspNetCoreEnvironment":"Development","Protocol":"HTTP/1.1","CategoryName":"Microsoft.AspNetCore.Hosting.Internal.WebHost","Host":"localhost:53022","Path":"/","Scheme":"http","ContentLength":"0","DeveloperMode":"true","Method":"DEBUG"}}}}
```

CoreCLR is loading two assemblies: 

- _Microsoft.AspNetCore.ApplicationInsights.HostingStartup.dll_
- _Microsoft.ApplicationInsights.AspNetCore.dll_.

And the _unconfigured_ in each instance of Application Insights telemetry indicates that this application isn't associated with an ikey so the data that is generated while your app is running isn't being sent to Azure and is only available for local search and analysis.

Part of how this is possible is that the NuGet package _Microsoft.AspNetCore.All_ takes as a dependency [_Microsoft.ASPNetCoreApplicationInsights.HostingStartup_](https://docs.microsoft.com/dotnet/api/microsoft.aspnetcore.applicationinsights.hostingstartup.applicationinsightshostingstartup?view=aspnetcore-2.1)

![Screenshot of NuGet dependency Graph for Microsoft.AspNETCore.all](./media/app-insights-asp-net-core/013-dependency.png)

Outside of Visual Studio if you were editing a ASP.NET Core project in VSCode or some other editor these assemblies wouldn't automatically load during debug if you haven't explicitly added Application Insights to your project.

However, in Visual Studio this lighting up of local Application Insights features from external assemblies is accomplished via use of the [IHostingStartup Interface](https://docs.microsoft.com/dotnet/api/microsoft.aspnetcore.hosting.ihostingstartup?view=aspnetcore-2.1) which dynamically adds Application Insights during debug.

To learn more about enhancing an app from an [external assembly in ASP.NET Core with IHostingStartup](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/platform-specific-configuration?view=aspnetcore-2.1). 

### How to disable Application Insights in Visual Studio .NET Core projects

While the automatic light up of Application Insights search functionality can be useful to some, seeing debug telemetry generated when you weren't expecting it can be confusing.

If just disabling telemetry generation is sufficient you can add this code block to the Configure method of your _Startup.cs_ file:

```csharp
  var configuration = app.ApplicationServices.GetService<Microsoft.ApplicationInsights.Extensibility.TelemetryConfiguration>();
            configuration.DisableTelemetry = true;
            if (env.IsDevelopment())
```

The CoreCLR will still load _Microsoft.AspNetCore.ApplicationInsights.HostingStartup.dll_ and _Microsoft.ApplicationInsights.AspNetCore.dll_, but they won't do anything.

If you want to completely disable Application Insights in your Visual Studio .NET Core project, the preferred method is to select **Tools** > **Options** > **Projects and Solutions** > **Web Projects** > and check the box to disable local Application Insights for ASP.NET Core web projects. This functionality was added in Visual Studio 15.6.

![Screenshot of Visual Studio Options Window Web Projects screen](./media/app-insights-asp-net-core/014-disable.png)

If you are running an earlier version of Visual Studio, and you want to completely remove all assemblies loaded via IHostingStartup you can either add:

`.UseSetting(WebHostDefaults.PreventHostingStartupKey, "true")`

to _Program.cs_:

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DotNetCore
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseSetting(WebHostDefaults.PreventHostingStartupKey, "true")
                .UseStartup<Startup>()
                .Build();
    }
}
```

Or alternatively you could add ``"ASPNETCORE_preventHostingStartup": "True"`` to _launchSettings.json_ environment variables.

The issue with using either of these methods is it won't just disable Application Insights it will disable anything in Visual Studio that was leveraging the IHostingStartup light up functionality.

## Video

> [!VIDEO https://channel9.msdn.com/events/Connect/2016/100/player] 

## Next steps
* [Explore Users Flows](app-insights-usage-flows.md) to understand how users navigate through your app.
* [Configure Snapshot Collection](https://docs.microsoft.com/azure/application-insights/app-insights-snapshot-debugger#configure-snapshot-collection-for-aspnet-core-20-applications) to see the state of source code and variables at the moment an exception is thrown.
* [Use the API](app-insights-api-custom-events-metrics.md) to send your own events and metrics for a more detailed view of your app's performance and usage.
* [Availability tests](app-insights-monitor-web-app-availability.md) check your app constantly from around the world.
