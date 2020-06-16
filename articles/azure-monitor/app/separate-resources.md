---
title: How to design your Application Insights deployment - One vs many resources?
description: Direct telemetry to different resources for development, test, and production stamps.
ms.topic: conceptual
ms.date: 05/11/2020

---

# How many Application Insights resources should I deploy

When you are developing the next version of a web application, you don't want to mix up the [Application Insights](../../azure-monitor/app/app-insights-overview.md) telemetry from the new version and the already released version. To avoid confusion, send the telemetry from different development stages to separate Application Insights resources, with separate instrumentation keys (ikeys). To make it easier to change the instrumentation key as a version moves from one stage to another, it can be useful to set the ikey in code instead of in the configuration file.

(If your system is an Azure Cloud Service, there's [another method of setting separate ikeys](../../azure-monitor/app/cloudservices.md).)

## About resources and instrumentation keys

When you set up Application Insights monitoring for your web app, you create an Application Insights *resource* in Microsoft Azure. You open this resource in the Azure portal in order to see and analyze the telemetry collected from your app. The resource is identified by an *instrumentation key* (ikey). When you install the Application Insights package to monitor your app, you configure it with the instrumentation key, so that it knows where to send the telemetry.

Each Application Insights resource comes with metrics that are available out-of-box. If completely separate components report to the same Application Insights resource, these metrics may not make sense to dashboard/alert on.

### When to use a single Application Insights resource

-	For application components that are deployed together. Usually developed by a single team, managed by the same set of DevOps/ITOps users.
-	If it makes sense to aggregate Key Performance Indicators (KPIs) such as response durations, failure rates in dashboard etc., across all of them by default (you can choose to segment by role name in the Metrics Explorer experience).
-	If there is no need to manage Role-based Access Control (RBAC) differently between the application components.
-	If you don’t need metrics alert criteria that are different between the components.
-	If you do not need to manage continuous exports differently between the components.
-	If you do not need to manage billing/quotas differently between the components.
-	If it is okay to have an API key have the same access to data from all components. And 10 API keys are sufficient for the needs across all of them.
-	If it is okay to have the same smart detection and work item integration settings across all roles.

### Other things to keep in mind

-	You may need to add custom code to ensure that meaningful values are set into the [Cloud_RoleName](https://docs.microsoft.com/azure/azure-monitor/app/app-map?tabs=net#set-cloud-role-name) attribute. Without meaningful values set for this attribute, *NONE* of the portal experiences will work.
- For Service Fabric applications and classic cloud services, the SDK automatically reads from the Azure Role Environment and sets these. For all other types of apps, you will likely need to set this explicitly.
-	Live Metrics experience does not support splitting by role name.

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
The iKey is also used in your app's web pages, in the [script that you got from the quickstart pane](../../azure-monitor/app/javascript.md). Instead of coding it literally into the script, generate it from the server state. For example, in an ASP.NET app:

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

To create an Applications Insights resource follow the [resource creation guide](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource).

### Getting the instrumentation key
The instrumentation key identifies the resource that you created.

You need the instrumentation keys of all the resources to which your app will send data.

## Filter on build number
When you publish a new version of your app, you'll want to be able to separate the telemetry from different builds.

You can set the Application Version property so that you can filter [search](../../azure-monitor/app/diagnostic-search.md) and [metric explorer](../../azure-monitor/platform/metrics-charts.md) results.

There are several different methods of setting the Application Version property.

* Set directly:

    `telemetryClient.Context.Component.Version = typeof(MyProject.MyClass).Assembly.GetName().Version;`
* Wrap that line in a [telemetry initializer](../../azure-monitor/app/api-custom-events-metrics.md#defaults) to ensure that all TelemetryClient instances are set consistently.
* [ASP.NET] Set the version in `BuildInfo.config`. The web module will pick up the version from the BuildLabel node. Include this file in your project and remember to set the Copy Always property in Solution Explorer.

    ```XML

    <?xml version="1.0" encoding="utf-8"?>
    <DeploymentEvent xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/VisualStudio/DeploymentEvent/2013/06">
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
To track the application version, make sure `buildinfo.config` is generated by your Microsoft Build Engine process. In your `.csproj` file, add:  

```XML

    <PropertyGroup>
      <GenerateBuildInfoConfigFile>true</GenerateBuildInfoConfigFile>    <IncludeServerNameInBuildInfo>true</IncludeServerNameInBuildInfo>
    </PropertyGroup>
```

When it has the build info, the Application Insights web module automatically adds **Application version** as a property to every item of telemetry. That allows you to filter by version when you perform [diagnostic searches](../../azure-monitor/app/diagnostic-search.md), or when you [explore metrics](../../azure-monitor/platform/metrics-charts.md).

However, notice that the build version number is generated only by the Microsoft Build Engine, not by the developer build from Visual Studio.

### Release annotations
If you use Azure DevOps, you can [get an annotation marker](../../azure-monitor/app/annotations.md) added to your charts whenever you release a new version. 

## Next steps

* [Shared resources for multiple roles](../../azure-monitor/app/app-map.md)
* [Create a Telemetry Initializer to distinguish A|B variants](../../azure-monitor/app/api-filtering-sampling.md#add-properties)
