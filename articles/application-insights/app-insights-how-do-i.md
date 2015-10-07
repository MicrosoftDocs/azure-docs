<properties 
	pageTitle="How do I ... in Application Insights" 
	description="FAQ in Application Insights." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/23/2015" 
	ms.author="awills"/>

# How do I ... in Application Insights?

## Get an email when ...

### Email if my site goes down

Set an [availability web test](app-insights-monitor-web-app-availability.md).

### Email if my site is overloaded

Set an [alert](app-insights-alerts.md) on **Server response time**. A threshold between 1 and 2 seconds should work.

![](./media/app-insights-how-do-i/030-server.png)

Your app might also show signs of strain by returning failure codes. Set an alert on **Failed requests**.

If you want to set an alert on **Server exceptions**, you might have to do [some additional setup](app-insights-asp-net-exceptions.md) in order to see data.


### Email on an event in my app

Let's suppose you'd like to get an email when a specific event occurs. Application Insights doesn't provide this facility directly, but it can [send an alert when a metric crosses a threshold](app-insights-alerts.md). 

Alerts can be set on [custom metrics](app-insights-api-custom-events-metrics.md#track-metric), though not custom events. Write some code to increase a metric when the event occurs:

    telemetry.TrackMetric("Alarm", 10);

or:

    var measurements = new Dictionary<string,double>();
    measurements ["Alarm"] = 10;
    telemetry.TrackEvent("status", null, measurements);

Because alerts have two states, you have to send a low value when you consider the alert to have ended:

    telemetry.TrackMetric("Alarm", 0.5);

Create a chart in [metric explorer](app-insights-metric-explorer.md) to see your alarm:

![](./media/app-insights-how-do-i/010-alarm.png)

Now set an alert to fire when the metric goes above a mid value for a short period:


![](./media/app-insights-how-do-i/020-threshold.png)

Set the averaging period to the minimum. 

You'll get emails both when the metric goes above and below the threshold.

Some points to consider:

* An alert has two states ("alert" and "healthy"). The state is evaluated only when a metric is received.
* An email is sent only when the state changes. This is why you have to send both high and low-value metrics. 
* To evaluate the alert, the average is taken of the received values over the preceding period. This occurs every time a metric is received, so emails can be sent more frequently than the period you set.
* Since emails are sent both on "alert" and "healthy", you might want to consider re-thinking your one-shot event as a two-state condition. For example, instead of a "job completed" event, have a "job in progress" condition, where you get emails at the start and end of a job.
 
## Application version filter

When you publish a new version of your app, you'll want to be able to separate the telemetry from different versions.

You can set the Application Version property so that you can filter [search](app-insights-diagnostic-search.md) and [metric explorer](app-insights-metrics-explorer.md) results. 


![](./media/app-insights-how-do-i/050-filter.png)

There are several different methods of setting the Application Version property.

* Set directly:

    `telemetryClient.Context.Component.Version = typeof(MyProject.MyClass).Assembly.GetName().Version;`

* Wrap that line in a [telemetry initializer](app-insights-api-custom-events-metrics.md#telemetry-initializers) to ensure that all TelemetryClient instances are set consistently.

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
* [ASP.NET] Generate BuildInfo.config automatically in MSBuild. To do this, add a few lines to your .csproj file:

    ```XML

    <PropertyGroup>
      <GenerateBuildInfoConfigFile>true</GenerateBuildInfoConfigFile>    <IncludeServerNameInBuildInfo>true</IncludeServerNameInBuildInfo>
    </PropertyGroup> 
    ```

    This generates a file called *yourProjectName*.BuildInfo.config. The Publish process renames it to BuildInfo.config.

    The build label contains a placeholder (AutoGen_...) when you build with Visual Studio. But when built with MSBuild, it is populated with the correct version number.

    To allow MSBuild to generate version numbers, set the version like `1.0.*` in AssemblyReference.cs

## Reduce traffic from my app to Application Insights 

* Try [Sampling](app-insights-sampling.md), which sends only a defined percentage of user sessions.
* [Disable telemetry modules](app-insights-configuration-with-applicationinsights-config.md) that you don't need.
