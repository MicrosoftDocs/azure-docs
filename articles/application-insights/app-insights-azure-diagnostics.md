---
title: Send Azure Diagnostic logs to Application Insights | Microsoft Docs
description: Configure the details of the Azure Cloud Services diagnostic logs that are sent to the Application Insights portal.
services: application-insights
documentationcenter: .net
author: sbtron
manager: douge

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 11/17/2015
ms.author: awills

---
# Configure Azure Diagnostic logging to Application Insights
When you set up a Cloud Services project or a Virtual Machine in Microsoft Azure, [Azure can generate a diagnostic log](../vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines.md). You can have this sent on to Application Insights so that you can analyze it along with diagnostic and usage telemetry sent from within the app by the Application Insights SDK. The Azure log includes events in the management of the app such as start, stop, crashes, as well as performance counters. The log also includes calls in the app to System.Diagnostics.Trace.

This article describes configuration of the diagnostic capture in detail.

You need Azure SDK 2.8 or later installed in Visual Studio.

## Get an Application Insights resource
For the best experience, [add the Application Insights SDK to each role of your Cloud Services app](app-insights-cloudservices.md), or [to whatever app you will run in your VM](app-insights-overview.md). You can then send the diagnostic data to be  analyzed and displayed in the same Application Insights resource.

Alternatively, if you don't want to use the SDK - for example, if the app is already live - you can just [create a new Application Insights resource](app-insights-create-new-resource.md) in the Azure portal. Choose **Azure Diagnostics** as the application type.

## Send Azure diagnostics to Application Insights
If you are able to update your app project, then in Visual Studio select each role, choose its Properties, and in the Configuration tab, select **Send diagnostics to Application Insights**.

Alternatively, when you use the Publish command to upload your app, you can choose the Application Insights option on the Diagnostics page.

If your app is already live, use Visual Studio's Server Explorer or Cloud Services explorer to open the properties of the app. Select **Send diagnostics to Application Insights**.

In each case you'll be asked for the details of the Application Insights resource you created.

We recommend that you send the data for separate roles to separate resources. You can display their metric charts alongside each other in the portal by creating a [dashboard](app-insights-dashboards.md).

[Learn more about setting up Application Insights for a Cloud Services app](app-insights-cloudservices.md).

## Configuring the Azure diagnostics adapter
Read on only if you want to select the parts of the log that you send to Application Insights. By default, everything is sent, including: Microsoft Azure events; performance counters; trace calls from the app to System.Diagnostics.Trace.

When you change the diagnostics options in the role properties editor or publish wizard, you're actually changing the content of two sets of files:

* Role [diagnostic configuration files](https://msdn.microsoft.com/library/azure/dn782207.aspx). You'll find them in Solution Explorer under `<Your Service>/Roles/*/diagnostics.wadcfgx`
* Service configuration files, `ServiceConfiguration.*.cscfg`.

Edit these files directly in order to effect more specific options than the wizards allow for. Read on for more details. 

## Separate development and production resources
You can send the telemetry data from the development and production stamps of your app to different Application Insights resources. This avoids getting your development telemetry swamped by live telemetry. 

1. [Create new Application Insights resources](app-insights-create-new-resource.md) for each stamp. Get the instrumentation key from the Essentials tab of each resource.
2. Edit the two .cscfg files and insert different instrumentation keys.

## Choose the priority levels to send
In the diagnostics configuration file `diagnostics.wadcfgx` for each role, you can filter the log messages by level.

### Define a sink
`<SinksConfig>` defines the additional sink where the Azure diagnostics data can be sent.  An example `SinksConfig` looks like this:

```xml

    <SinksConfig>
     <Sink name="ApplicationInsights">
      <ApplicationInsights/>
      <Channels>
        <Channel logLevel="Error" name="MyTopDiagData"  />
        <Channel logLevel="Verbose" name="MyLogData"  />
      </Channels>
     </Sink>
    </SinksConfig>

```

`Channels` names a data stream that will be sent to the sink. The channel acts like a filter. The `loglevel` attribute lets you specify the log level that the channel will send. The available values are: `{Verbose, Information, Warning, Error, Critical}`.

### Send data to the sink
Send data to the Application Insights sink by adding the sinks attribute to under the DiagnosticMonitorConfiguration node, or any node under it. Adding the sinks element to each node specifies that you want data collected from that node and any node under it to be sent to the sink specified.

For example, the default created by the Azure SDK is to send all the Azure diagnostic data:

```xml

    <DiagnosticMonitorConfiguration overallQuotaInMB="4096" sinks="ApplicationInsights">
```

But if you want to send only error logs, qualify the sink name with a channel name:

```xml

    <DiagnosticMonitorConfiguration overallQuotaInMB="4096" sinks="ApplicationInsights.MyTopDiagdata">
```

Notice that we're using the name of the Sink that we defined, together with the name of a channel that we defined above.

If you only wanted to send Verbose application logs to Application Insights then you would add the sinks attribute to the `Logs` node.

```xml

    <Logs scheduledTransferPeriod="PT1M" scheduledTransferLogLevelFilter="Verbose" sinks="ApplicationInsights.MyLogData"/>
```

You can also include multiple sinks in the configuration at different levels in the hierarchy. In that case the sink specified at the top level of the hierarchy acts as a global setting and the one specified at the individual element element acts like an override to that global setting.

Here is a complete example of the public configuration file that sends all errors to Application Insights (specified at the `DiagnosticMonitorConfiguration` node) and in addition Verbose level logs for the Application Logs (specified at the `Logs` node).

```xml

    <WadCfg>
     <DiagnosticMonitorConfiguration overallQuotaInMB="4096"
       sinks="ApplicationInsights.MyTopDiagData">
       <!-- All info below sent to this channel -->
      <DiagnosticInfrastructureLogs />
      <PerformanceCounters>
        <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT3M" sinks="ApplicationInsights.MyLogData/>
        <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
        <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT3M" />
      </PerformanceCounters>
      <WindowsEventLog scheduledTransferPeriod="PT1M">
        <DataSource name="Application!*" />
      </WindowsEventLog>
      <Logs scheduledTransferPeriod="PT1M" scheduledTransferLogLevelFilter="Verbose"
            sinks="ApplicationInsights.MyLogData"/>
       <!-- This specific info sent to this channel -->
     </DiagnosticMonitorConfiguration>

     <SinksConfig>
      <Sink name="ApplicationInsights">
        <ApplicationInsights/>
        <Channels>
          <Channel logLevel="Error" name="MyTopDiagData"  />
          <Channel logLevel="Verbose" name="MyLogData"  />
        </Channels>
      </Sink>
     </SinksConfig>
    </WadCfg>
```


There are some limitations to be aware of with this functionality:

* Channels are only meant to work with log type and not performance counters. If you specify a channel with a performance counter element it will be ignored.
* The log level for a channel cannot exceed the log level for what is being collected by Azure diagnostics. For example: you cannot collect Application Log errors in the Logs element and try to send Verbose logs to the Application Insight sync. The scheduledTransferLogLevelFilter attribute must always collect equal or more logs than the logs you are trying to send to a sink.
* You cannot send any blob data collected by Azure diagnostics extension to Application Insights. For example anything specified under the Directories node. For Crash Dumps the actual crash dump will still be sent to blob storage and only a notification that the crash dump was generated will be sent to Application Insights.

## Next steps
* [Monitoring Azure Cloud Services with Application Insights](app-insights-cloudservices.md)
* [Using PowerShell to send Azure diagnostics to Application Insights](app-insights-powershell-azure-diagnostics.md)
* [Azure Diagnostics Configuration file](https://msdn.microsoft.com/library/azure/dn782207.aspx)

