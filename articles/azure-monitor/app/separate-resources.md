---
title: 'Design your Application Insights deployment: One vs. many resources?'
description: Direct telemetry to different resources for development, test, and production stamps.
ms.topic: conceptual
ms.date: 09/12/2023
ms.reviewer: rijolly
---

# How many Application Insights resources should I deploy?

When you're developing the next version of a web application, you don't want to mix up the [Application Insights](../../azure-monitor/app/app-insights-overview.md) telemetry from the new version and the already released version.

To avoid confusion, send the telemetry from different development stages to separate Application Insights resources with separate instrumentation keys.

To make it easier to change the instrumentation key as a version moves from one stage to another, it can be useful to [set the instrumentation key dynamically in code](#dynamic-instrumentation-key) instead of in the configuration file.

If your system is an instance of Azure Cloud Services, there's [another method of setting separate instrumentation keys](../../azure-monitor/app/azure-web-apps-net-core.md).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## About resources and instrumentation keys

When you set up Application Insights monitoring for your web app, you create an Application Insights resource in Azure. You open this resource in the Azure portal to see and analyze the telemetry collected from your app. The resource is identified by an instrumentation key. When you install the Application Insights package to monitor your app, you configure it with the instrumentation key so that it knows where to send the telemetry.

Each Application Insights resource comes with metrics that are available out of the box. If separate components report to the same Application Insights resource, it might not make sense to alert on these metrics.

### When to use a single Application Insights resource

Use a single Application Insights resource:

- For application components that are deployed together. These applications are usually developed by a single team and managed by the same set of DevOps/ITOps users.
- If it makes sense to aggregate key performance indicators, such as response durations or failure rates in a dashboard, across all of them by default. You can choose to segment by role name in the metrics explorer.
- If there's no need to manage Azure role-based access control differently between the application components.
- If you don't need metrics alert criteria that are different between the components.
- If you don't need to manage continuous exports differently between the components.
- If you don't need to manage billing/quotas differently between the components.
- If it's okay to have an API key have the same access to data from all components. And 10 API keys are sufficient for the needs across all of them.
- If it's okay to have the same smart detection and work item integration settings across all roles.

> [!NOTE]
> If you want to consolidate multiple Application Insights resources, you can point your existing application components to a new, consolidated Application Insights resource. The telemetry stored in your old resource won't be transferred to the new resource. Only delete the old resource when you have enough telemetry in the new resource for business continuity.

### Other considerations

Be aware that:

- You might need to add custom code to ensure that meaningful values are set into the [Cloud_RoleName](./app-map.md?tabs=net#set-or-override-cloud-role-name) attribute. Without meaningful values set for this attribute, none of the portal experiences will work.
- For Azure Service Fabric applications and classic cloud services, the SDK automatically reads from the Azure Role Environment and sets these services. For all other types of apps, you'll likely need to set this explicitly.
- Live Metrics doesn't support splitting by role name.

## <a name="dynamic-instrumentation-key"></a> Dynamic instrumentation key

To make it easier to change the instrumentation key as the code moves between stages of production, reference the key dynamically in code instead of using a hardcoded or static value.

Set the key in an initialization method, such as `global.asax.cs`, in an ASP.NET service:

```csharp
protected void Application_Start()
{
  Microsoft.ApplicationInsights.Extensibility.
    TelemetryConfiguration.Active.InstrumentationKey = 
      // - for example -
      WebConfigurationManager.AppSettings["ikey"];
  ...
```

In this example, the instrumentation keys for the different resources are placed in different versions of the web configuration file. Swapping the web configuration file, which you can do as part of the release script, will swap the target resource.

### Webpages
The instrumentation key is also used in your app's webpages, in the [script that you got from the quickstart pane](../../azure-monitor/app/javascript.md). Instead of coding it literally into the script, generate it from the server state. For example, in an ASP.NET app:

```javascript
<script type="text/javascript">
// Standard Application Insights webpage script:
var appInsights = window.appInsights || function(config){ ...
// Modify this part:
}({instrumentationKey:  
  // Generate from server property:
  "@Microsoft.ApplicationInsights.Extensibility.
     TelemetryConfiguration.Active.InstrumentationKey"
  }
 )
//...
```

## Create more Application Insights resources

To create an Applications Insights resource, see [Create an Application Insights resource](./create-workspace-resource.md).

> [!WARNING]
> You may incur additional network costs if your Application Insights resource is monitoring an Azure resource (i.e., telemetry producer) in a different region. Costs will vary depending on the region the telemetry is coming from and where it is going. Refer to [Azure bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/) for details.

### Get the instrumentation key
The instrumentation key identifies the resource that you created.

You need the instrumentation keys of all the resources to which your app will send data.

## Filter on the build number
When you publish a new version of your app, you'll want to be able to separate the telemetry from different builds.

You can set the **Application Version** property so that you can filter [search](../../azure-monitor/app/diagnostic-search.md) and [metric explorer](../../azure-monitor/essentials/metrics-charts.md) results.

There are several different methods of setting the **Application Version** property.

* Set directly:

    `telemetryClient.Context.Component.Version = typeof(MyProject.MyClass).Assembly.GetName().Version;`
* Wrap that line in a [telemetry initializer](../../azure-monitor/app/api-custom-events-metrics.md#defaults) to ensure that all `TelemetryClient` instances are set consistently.
* ASP.NET: Set the version in `BuildInfo.config`. The web module will pick up the version from the `BuildLabel` node. Include this file in your project and remember to set the **Copy Always** property in Solution Explorer.

    ```xml
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

* ASP.NET: Generate `BuildInfo.config` automatically in the Microsoft Build Engine. Add a few lines to your `.csproj` file:

    ```xml
    <PropertyGroup>
      <GenerateBuildInfoConfigFile>true</GenerateBuildInfoConfigFile>    <IncludeServerNameInBuildInfo>true</IncludeServerNameInBuildInfo>
    </PropertyGroup>
    ```

    This step generates a file called *yourProjectName*`.BuildInfo.config`. The Publish process renames it to `BuildInfo.config`.

    The build label contains a placeholder (*AutoGen_...*) when you build with Visual Studio. But when built with the Microsoft Build Engine, it's populated with the correct version number.

    To allow the Microsoft Build Engine to generate version numbers, set the version like `1.0.*` in `AssemblyReference.cs`.

## Version and release tracking
To track the application version, make sure `buildinfo.config` is generated by your Microsoft Build Engine process. In your `.csproj` file, add:

```xml
<PropertyGroup>
  <GenerateBuildInfoConfigFile>true</GenerateBuildInfoConfigFile>
  <IncludeServerNameInBuildInfo>true</IncludeServerNameInBuildInfo>
</PropertyGroup>
```

When the Application Insights web module has the build information, it automatically adds **Application Version** as a property to every item of telemetry. For this reason, you can filter by version when you perform [diagnostic searches](../../azure-monitor/app/diagnostic-search.md) or when you [explore metrics](../../azure-monitor/essentials/metrics-charts.md).

The build version number is generated only by the Microsoft Build Engine, not by the developer build from Visual Studio.

### Release annotations

If you use Azure DevOps, you can [get an annotation marker](./release-and-work-item-insights.md?tabs=release-annotations) added to your charts whenever you release a new version.

## Frequently asked questions

This section provides answers to common questions.

### How do I move an Application Insights resource to a new region?

Moving existing Application Insights resources from one region to another is *currently not supported*. Historical data that you've collected *can't be migrated* to a new region. The only partial workaround is to:
          
1. Create a new Application Insights resource ([classic](/previous-versions/azure/azure-monitor/app/create-new-resource) or [workspace based](./create-workspace-resource.md)) in the new region.
1. Re-create all unique customizations specific to the original resource in the new resource.
1. Modify your application to use the new region resource's [instrumentation key](/previous-versions/azure/azure-monitor/app/create-new-resource#copy-the-instrumentation-key) or [connection string](./sdk-connection-string.md).
1. Test to confirm that everything is continuing to work as expected with your new Application Insights resource.
1. At this point, you can either keep or delete the original Application Insights resource. If you delete a classic Application Insights resource, *all historical data is lost*. If the original resource was workspace based, its data remains in Log Analytics. Keeping the original Application Insights resource allows you to access its historical data until its data retention settings run out.
          
Unique customizations that commonly need to be manually re-created or updated for the resource in the new region include but aren't limited to:
          
- Re-create custom dashboards and workbooks.
- Re-create or update the scope of any custom log/metric alerts.
- Re-create availability alerts.
- Re-create any custom Azure role-based access control settings that are required for your users to access the new resource.
- Replicate settings involving ingestion sampling, data retention, daily cap, and custom metrics enablement. These settings are controlled via the **Usage and estimated costs** pane.
- Any integration that relies on API keys, such as [release annotations](./release-and-work-item-insights.md?tabs=release-annotations) and [live metrics secure control channel](./live-stream.md#secure-the-control-channel). You need to generate new API keys and update the associated integration.
- Continuous export in classic resources must be configured again.
- Diagnostic settings in workspace-based resources must be configured again.
          
> [!NOTE]
> If the resource you're creating in a new region is replacing a classic resource, we recommend that you explore the benefits of [creating a new workspace-based resource](./create-workspace-resource.md). Alternatively, [migrate your existing resource to workspace based](./convert-classic-resource.md).

## Next steps

* [Shared resources for multiple roles](../../azure-monitor/app/app-map.md)
* [Create a Telemetry Initializer to distinguish A|B variants](../../azure-monitor/app/api-filtering-sampling.md#add-properties)
