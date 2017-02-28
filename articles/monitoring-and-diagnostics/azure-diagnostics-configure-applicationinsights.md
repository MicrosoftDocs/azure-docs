---
title: Configure Azure Diagnostics to send data to Application Insights | Microsoft Docs
description: Update the Azure Diagnostics public configuration to send data to Application Insights.
services: multiple
documentationcenter: .net
author: sbtron
manager: douge
editor: ''

ms.assetid: f9e12c3e-c307-435e-a149-ef0fef20513a
ms.service: application-insights
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/15/2015
ms.author: saurabh

---
# Configure Azure Diagnostics to send data to Application Insights
Azure diagnostics send data to Azure Storage tables.  However, you can also pipe all or a subset of the data to other locations using Azure Diagnostics extension 1.5 or later.

This article describes how to send data from the Azure Diagnostics extension to Application Insights.


## Configuring Application Insights as a Sink
The Azure diagnostics extension 1.5 introduced sinks. Sinks are other locations where you can send diagnostic data.

Example configuration for Application Insights:

```XML
    <SinksConfig>
        <Sink name="ApplicationInsights">
          <ApplicationInsights>{Insert InstrumentationKey}</ApplicationInsights>
          <Channels>
            <Channel logLevel="Error" name="MyTopDiagData"  />
            <Channel logLevel="Verbose" name="MyLogData"  />
          </Channels>
        </Sink>
      </SinksConfig>
```

- The **Sink** *name* attribute is a string value that uniquely identifies the sink.

- The **ApplicationInsights** element specifies instrumentation key of the Application insights resource where the Azure diagnostics data is sent.
    - If you don't have an existing Application Insights resource, see [Create a new Application Insights resource](../application-insights/app-insights-create-new-resource.md) for more information on creating a resource and getting the instrumentation key.
    - If you are developing a Cloud Service project with Azure SDK 2.8 and later, this instrumentation key is automatically populated in the public configuration based on the **APPINSIGHTS_INSTRUMENTATIONKEY** service configuration setting when packaging the cloud service project. See [Use Application Insights with Azure Diagnostics to troubleshoot Cloud Service issues](../cloud-services/cloud-services-dotnet-diagnostics-applicationinsights.md).

- The **Channels** element contains one or more **Channel** elements.
    - The *name* attribute uniquely refers to that channel.
    - The *loglevel* attribute lets you specify the log level that the channel allows. The available log levels in order of most least information are
        - Verbose
        - Information
        - Warning
        - Error
        - Critical

A channel acts like a filter and allows you to select specific log levels to send to the target sink. For example you could collect verbose logs and send them to storage, but send only Errors to the sink.

The following graphic shows this relationship.

![Diagnostics Public Configuration](./media/azure-diagnostics-configure-applicationinsights/AzDiag_Channels_App_Insights.png)

## Send data to the Application Insights sink
Once the Application Insights sink is defined, you can send data to that sink by adding the *sink* attribute to the elements under the **DiagnosticMonitorConfiguration** node. Adding the *sinks* element to each node specifies that you want data collected from that node and any node under it to be sent to the sink specified.

For example, if you want to send all the data that is being collected by Azure diagnostics then you can add the *sink* attribute directly to the **DiagnosticMonitorConfiguration** node. Set the value of the *sinks* to the Sink name that was specified in the **SinkConfig**.

```XML
<DiagnosticMonitorConfiguration overallQuotaInMB="4096" sinks="ApplicationInsights">
```

If you wanted to send only error logs to the Application Insights sink then you can set the *sinks* value to be the Sink name followed by the channel name separated by a period ("."). For example to send only error logs to the Application Insights sink use the MyTopDiagdata channel which was defined in the SinksConfig above.  

```XML
<DiagnosticMonitorConfiguration overallQuotaInMB="4096" sinks="ApplicationInsights.MyTopDiagdata">
```

If you only wanted to send Verbose application logs to Application Insights then you would add the *sinks* attribute to the **Logs** node.

```XML
<Logs scheduledTransferPeriod="PT1M" scheduledTransferLogLevelFilter="Verbose" sinks="ApplicationInsights.MyLogData"/>
```

You can also include multiple sinks in the configuration at different levels in the hierarchy. In that case the sink specified at the top level of the hierarchy acts as a global setting and the one specified at the individual element acts like an override to that global setting.    

Here is a complete example of the public configuration file that sends all errors to Application Insights (specified at the **DiagnosticMonitorConfiguration** node) and in addition Verbose level logs for the Application Logs (specified at the **Logs** node).

```XML
<WadCfg>
  <DiagnosticMonitorConfiguration overallQuotaInMB="4096"
       sinks="ApplicationInsights.MyTopDiagData"> <!-- All info below sent to this channel -->
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
            sinks="ApplicationInsights.MyLogData"/> <!-- This specific info sent to this channel -->
  </DiagnosticMonitorConfiguration>

<SinksConfig>
    <Sink name="ApplicationInsights">
      <ApplicationInsights>{Insert InstrumentationKey}</ApplicationInsights>
      <Channels>
        <Channel logLevel="Error" name="MyTopDiagData"  />
        <Channel logLevel="Verbose" name="MyLogData"  />
      </Channels>
    </Sink>
  </SinksConfig>
</WadCfg>
```

![Diagnostics Sinks  Configuration with Application Insights](./media/azure-diagnostics-configure-applicationinsights/Azure_Diagnostics_Sinks.png)

There are some limitations to be aware of with this functionality

* Channels are only meant to work with log type and not performance counters. If you specify a channel with a performance counter element it is ignored.
* The log level for a channel cannot exceed the log level for what is being collected by Azure diagnostics. For example: you cannot collect Application Log errors in the Logs element and try to send Verbose logs to the Application Insight sink. The *scheduledTransferLogLevelFilter* attribute must always collect equal or more logs than the logs you are trying to send to a sink.
* You cannot send any blob data collected by Azure diagnostics extension to Application Insights. For example anything specified under the *Directories* node. For Crash Dumps the actual crash dump is sent to blob storage and only a notification that the crash dump was generated is sent to Application Insights.

## Next Steps
* Use [PowerShell](../cloud-services/cloud-services-diagnostics-powershell.md) to enable the Azure diagnostics extension for your application.
* Use [Visual Studio](../vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines.md) to enable the Azure diagnostics extension for your application
