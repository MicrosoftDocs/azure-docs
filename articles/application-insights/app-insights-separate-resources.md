---
title: Separating telemetry from development, test, and release in Azure Application Insights | Microsoft Docs
description: Direct telemetry to different resources for development, test, and production stamps.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.assetid: 578e30f0-31ed-4f39-baa8-01b4c2f310c9
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 05/15/2017
ms.author: mbullwin

---
# Separating telemetry from Development, Test, and Production

When you are developing the next version of a web application, you don't want to mix up the [Application Insights](app-insights-overview.md) telemetry from the new version and the already released version. To avoid confusion, send the telemetry from different development stages to separate Application Insights resources, with separate instrumentation keys (ikeys). To make it easier to change the instrumentation key as a version moves from one stage to another, it can be useful to set the ikey in code instead of in the configuration file. 

(If your system is an Azure Cloud Service, there's [another method of setting separate ikeys](app-insights-cloudservices.md).)

## About resources and instrumentation keys

When you set up Application Insights monitoring for your web app, you create an Application Insights *resource* in Microsoft Azure. You open this resource in the Azure portal in order to see and analyze the telemetry collected from your app. The resource is identified by an *instrumentation key* (ikey). When you install the Application Insights package to monitor your app, you configure it with the instrumentation key, so that it knows where to send the telemetry.

You typically choose to use separate resources or a single shared resource in different scenarios:

* Different, independent applications - Use a separate resource and ikey for each app.
* Multiple components or roles of one business application - Use a [single shared resource](app-insights-monitor-multi-role-apps.md) for all the component apps. Telemetry can be filtered or segmented by the cloud_RoleName property.
* Development, Test, and Release - Use a separate resource and ikey for versions of the system in 'stamp' or stage of production.
* A | B testing - Use a single resource. Create a TelemetryInitializer to add a property to the telemetry that identifies the variants.


## <a name="dynamic-ikey"></a> Dynamic instrumentation key

To make it easier to change the ikey as the code moves between stages of production, set it in code instead of in the configuration file.

Set the key in an initialization method, such as global.aspx.cs in an ASP.NET service:

*C#*

    protected void Application_Start()
    {
      Microsoft.ApplicationInsights.Extensibility.
        TelemetryConfiguration.Active.InstrumentationKey = 
          // - for example -
          WebConfigurationManager.AppSettings["ikey"];
      ...

In this example, the ikeys for the different resources are placed in different versions of the web configuration file. Swapping the web configuration file - which you can do as part of the release script - will swap the target resource.

### Web pages
The iKey is also used in your app's web pages, in the [script that you got from the quick start blade](app-insights-javascript.md). Instead of coding it literally into the script, generate it from the server state. For example, in an ASP.NET app:

*JavaScript in Razor*

    <script type="text/javascript">
    // Standard Application Insights web page script:
    var appInsights = window.appInsights || function(config){ ...
    // Modify this part:
    }({instrumentationKey:  
      // Generate from server property:
      "@Microsoft.ApplicationInsights.Extensibility.
         TelemetryConfiguration.Active.InstrumentationKey"
    }) // ...


## Create additional Application Insights resources
To separate telemetry for different application components, or for different stamps (dev/test/production) of the same component, then you'll have to create a new Application Insights resource.

In the [portal.azure.com](https://portal.azure.com), add an Application Insights resource:

![Click New, Application Insights](./media/app-insights-separate-resources/01-new.png)

* **Application type** affects what you see on the overview blade and the properties available in [metric explorer](app-insights-metrics-explorer.md). If you don't see your type of app, choose one of the web types for web pages.
* **Resource group** is a convenience for managing properties like [access control](app-insights-resources-roles-access-control.md). You could use separate resource groups for development, test, and production.
* **Subscription** is your payment account in Azure.
* **Location** is where we keep your data. Currently it can't be changed. 
* **Add to dashboard** puts a quick-access tile for your resource on your Azure Home page. 

Creating the resource takes a few seconds. You'll see an alert when it's done.

(You can write a [PowerShell script](app-insights-powershell-script-create-resource.md) to create a resource automatically.)

### Getting the instrumentation key
The instrumentation key identifies the resource that you created. 

![Click Essentials, click the Instrumentation Key, CTRL+C](./media/app-insights-separate-resources/02-props.png)

You need the instrumentation keys of all the resources to which your app will send data.

## Filter on build number
When you publish a new version of your app, you'll want to be able to separate the telemetry from different builds.

You can set the Application Version property so that you can filter [search](app-insights-diagnostic-search.md) and [metric explorer](app-insights-metrics-explorer.md) results.

![Filtering on a property](./media/app-insights-separate-resources/050-filter.png)

There are several different methods of setting the Application Version property.

* Set directly:

    `telemetryClient.Context.Component.Version = typeof(MyProject.MyClass).Assembly.GetName().Version;`
* Wrap that line in a [telemetry initializer](app-insights-api-custom-events-metrics.md#defaults) to ensure that all TelemetryClient instances are set consistently.
* [ASP.NET] Set the version in `BuildInfo.config`. The web module will pick up the version from the BuildLabel node. Include this file in your project and remember to set the Copy Always property in Solution Explorer.

    ```XML

    <?xml version="1.0" encoding="utf-8"?>
    <DeploymentEvent xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/VisualStudio/DeploymentEvent/2013/06">
      <ProjectName>AppVersionExpt</ProjectName>
      <Build type="MSBuild">
        <MSBuild>
          <BuildLabel kind="label">1.0.0.2</BuildLabel>
        </MSBuild>
      </Build>
    </DeploymentEvent>

    ```
* [ASP.NET] Generate BuildInfo.config automatically in MSBuild. To do this, add a few lines to your `.csproj` file:

    ```XML

    <PropertyGroup>
      <GenerateBuildInfoConfigFile>true</GenerateBuildInfoConfigFile>    <IncludeServerNameInBuildInfo>true</IncludeServerNameInBuildInfo>
    </PropertyGroup>
    ```

    This generates a file called *yourProjectName*.BuildInfo.config. The Publish process renames it to BuildInfo.config.

    The build label contains a placeholder (AutoGen_...) when you build with Visual Studio. But when built with MSBuild, it is populated with the correct version number.

    To allow MSBuild to generate version numbers, set the version like `1.0.*` in AssemblyReference.cs

## Version and release tracking
To track the application version, make sure `buildinfo.config` is generated by your Microsoft Build Engine process. In your .csproj file, add:  

```XML

    <PropertyGroup>
      <GenerateBuildInfoConfigFile>true</GenerateBuildInfoConfigFile>    <IncludeServerNameInBuildInfo>true</IncludeServerNameInBuildInfo>
    </PropertyGroup>
```

When it has the build info, the Application Insights web module automatically adds **Application version** as a property to every item of telemetry. That allows you to filter by version when you perform [diagnostic searches](app-insights-diagnostic-search.md), or when you [explore metrics](app-insights-metrics-explorer.md).

However, notice that the build version number is generated only by the Microsoft Build Engine, not by the developer build in Visual Studio.

### Release annotations
If you use Azure DevOps, you can [get an annotation marker](app-insights-annotations.md) added to your charts whenever you release a new version. The following image shows how this marker appears.

![Screenshot of sample release annotation on a chart](./media/app-insights-asp-net/release-annotation.png)
## Next steps

* [Shared resources for multiple roles](app-insights-monitor-multi-role-apps.md)
* [Create a Telemetry Initializer to distinguish A|B variants](app-insights-api-filtering-sampling.md#add-properties)
