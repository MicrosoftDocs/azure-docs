<properties
	pageTitle="Streaming Azure Diagnostics data in the hot path using Event Hubs | Microsoft Azure"
	description="Illustrates how to configure Azure Diagnostics with Event Hubs from end to end, including guidance for common scenarios."
	services="event-hubs"
	documentationCenter="na"
	authors="sethmanheim"
	manager="timlt"
	editor="" />
<tags
	ms.service="event-hubs"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="na"
	ms.date="07/14/2016"
	ms.author="sethm" />

# Streaming Azure Diagnostics data in the hot path by using Event Hubs

Azure Diagnostics provides flexible ways to collect metrics and logs from cloud services virtual machines (VMs) and transfer results to Azure Storage. Starting in the March 2016 (SDK 2.9) time frame, you can sink Diagnostics to completely custom data sources and transfer hot path data in seconds by using [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/).

Supported data types include:

- Event Tracing for Windows (ETW) events
- Performance counters
- Windows event logs
- Application logs
- Azure Diagnostics infrastructure logs

This article shows you how to configure Azure Diagnostics with Event Hubs from end to end. Guidance is also provided for the following common scenarios:

- How to customize the logs and metrics that get sinked to Event Hubs
- How to change configurations in each environment
- How to view Event Hubs stream data
- How to troubleshoot the connection  

## Prerequisites

Event Hubs sinking in Azure Diagnostics is supported in Cloud Services, VMs, Virtual Machine Scale Sets, and Service Fabric  starting in the Azure SDK 2.9 and the corresponding Azure Tools for Visual Studio.

- Azure Diagnostics extension 1.6 ([Azure SDK for .NET 2.9 or later](https://azure.microsoft.com/downloads/) targets this by default)
- [Visual Studio 2013 or later](https://www.visualstudio.com/downloads/download-visual-studio-vs.aspx)
- Existing configurations of Azure Diagnostics in an application by using a *.wadcfgx* file and one of the following methods:
	- Visual Studio: [Configuring Diagnostics for Azure Cloud Services and Virtual Machines](../vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines.md)
	- Windows PowerShell: [Enable diagnostics in Azure Cloud Services using PowerShell](../cloud-services/cloud-services-diagnostics-powershell.md)
- Event Hubs namespace provisioned per the article, [Get started with Event Hubs](./event-hubs-csharp-ephcs-getstarted.md)

## Connect Azure Diagnostics to Event Hubs sink

Azure Diagnostics always sinks logs and metrics, by default, to an Azure Storage account. An application may additionally sink to Event Hubs by adding a new **Sinks** section to the **WadCfg** element in the **PublicConfig** section of the *.wadcfgx* file. In Visual Studio, the *.wadcfgx* file is stored in the followign path: **Cloud Service Project** > **Roles** >  **(RoleName)** > **diagnostics.wadcfgx** file.

```
<SinksConfig>
  <Sink name="HotPath">
    <EventHub Url="https://diags-mycompany-ns.servicebus.windows.net/diageventhub" SharedAccessKeyName="SendRule" />
  </Sink>
</SinksConfig>
```

In this example, the Event Hub URL is set to the fully qualified namespace of the Event Hub: Service Bus namespace  + “/” + Event Hub name.  

The Event Hub URL is displayed in the [Azure portal](http://go.microsoft.com/fwlink/?LinkID=213885) on the Event Hubs dashboard.  

The **Sink** name can be set to any valid string as long as the same value is used consistently throughout the config file.

> [AZURE.NOTE]  There may be additional sinks, such as *applicationInsights* configured in this section. Azure Diagnostics allows one or more sinks to be defined if each sink is also declared in the **PrivateConfig** section.  

The Event Hubs sink must also be declared and defined in the **PrivateConfig** section of the *.wadcfgx* config file.

```
<PrivateConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
  <StorageAccount name="" key="" endpoint="" />
  <EventHub Url="https://diags-mycompany-ns.servicebus.windows.net/diageventhub" SharedAccessKeyName="SendRule" SharedAccessKey="9B3SwghJOGEUvXigc6zHPInl2iYxrgsKHZoy4nm9CUI=" />
</PrivateConfig>
```

The `SharedAccessKeyName` value must match a Shared Access Signature (SAS) key and policy that has been defined in the **Service Bus/Event Hubs** namespace. Browse to the Event Hubs dashboard in the [Azure portal](https://manage.windowsazure.com), click the **Configure** tab, and set up a named policy (for example, "SendRule") that has *Send* permissions. The **StorageAccount** is also declared in **PrivateConfig**. There is no need to change values here if they are working. In this example, we leave the values empty, which is a sign that a downstream asset will set the values. For example, the *ServiceConfiguration.Cloud.cscfg* environment configuration file sets the environment-appropriate names and keys.  

> [AZURE.WARNING] The Event Hubs SAS key is stored in plain text in the *.wadcfgx* file. Often, this key is checked in to source code control or is available as an asset in your build server, so you should protect it as appropriate. We recommend that you use a SAS key here with *Send only* permissions so that a malicious user can write to the Event Hub, but not listen to it or manage it.

## Configure Azure Diagnostics logs and metrics to sink with Event Hubs

As discussed earlier, all default and custom diagnostics data, that is, metrics and logs, is automatically sinked to Azure Storage in the configured intervals. With Event Hubs and any additional sink, you can specify any root or leaf node in the hierarchy to be sinked with the Event Hub. This includes ETW events, performance counters, Windows event logs, and application logs.   

It is important to consider how many data points should actually be transferred to Event Hubs. Typically, developers transfer low-latency hot-path data that must be consumed and interpreted quickly. Systems that monitor alerts or autoscale rules are examples. A developer might also configure an alternate analysis store or search store -- for example, Azure Stream Analytics, Elasticsearch, a custom monitoring system, or a favorite monitoring system from others.

The following are some example configurations.

```
<PerformanceCounters scheduledTransferPeriod="PT1M" sinks="HotPath">
  <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Requests/Sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Errors Total/Sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Queued" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Rejected" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT3M" />
</PerformanceCounters>
```

In the following example, the sink is applied to the parent **PerformanceCounters** node in the hierarchy, which means all child **PerformanceCounters** will be sent to Event Hubs.  

```
<PerformanceCounters scheduledTransferPeriod="PT1M">
  <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Requests/Sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Errors Total/Sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Queued" sampleRate="PT3M" sinks="HotPath" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Rejected" sampleRate="PT3M" sinks="HotPath"/>
  <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT3M" sinks="HotPath"/>
</PerformanceCounters>
```

In the previous example, the sink is applied to only three counters: **Requests Queued**, **Requests Rejected**, and **% Processor time**.  

The following example shows how a developer can limit the amount of sent data to be the critical metrics that are used for this service’s health.  

```
<Logs scheduledTransferPeriod="PT1M" sinks="HotPath" scheduledTransferLogLevelFilter="Error" />
```

In this example, the sink is applied to logs and is filtered only to error level trace.

## Deploy and update a Cloud Services application and diagnostics config

Visual Studio provides the easiest path to deploy the application and Event Hubs sink configuration. To view and edit the file, open the *.wadcfgx* file in Visual Studio, edit it, and save it. The path is **Cloud Service Project** > **Roles** > **(RoleName)** > **diagnostics.wadcfgx**.  

At this point, all deployment and deployment update actions in Visual Studio, Visual Studio Team System, and all commands or scripts that are based on MSBuild and use the **/t:publish** target include the *.wadcfgx* in the packaging process. In addition, deployments and updates deploy the file to Azure by using the appropriate Azure Diagnostics agent extension on your VMs.

After you deploy the application and Azure Diagnostics configuration, you will immediately see activity in the dashboard of the Event Hub. This indicates that you're ready to move on to viewing the hot-path data in the listener client or analysis tool of your choice.  

In the following figure, the Event Hubs dashboard shows healthy sending of diagnostics data to the Event Hub starting sometime after 11 PM. That's when the application was deployed with an updated *.wadcfgx* file, and the sink was configured properly.

![][0]  

> [AZURE.NOTE] When you make updates to the Azure Diagnostics config file (.wadcfgx), it's recommended that you push the updates to the entire application as well as the configuration by using either Visual Studio publishing, or a Windows PowerShell script.  

## View hot-path data

As discussed previously, there are many use cases for listening to and processing Event Hubs data.

One simple approach is to create a small test console application to listen to the Event Hub and print the output stream. You can place the following code, which is explained in more detail
in [Get started with Event Hubs](./event-hubs-csharp-ephcs-getstarted.md)), in a console application.  

Note that the console application must include the [Event Processor Host Nuget package](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost/).  

Remember to replace the values in angle brackets in the **Main** function with values for your resources.   

```
//Console application code for EventHub test client
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ServiceBus.Messaging;

namespace EventHubListener
{
    class SimpleEventProcessor : IEventProcessor
    {
        Stopwatch checkpointStopWatch;

        async Task IEventProcessor.CloseAsync(PartitionContext context, CloseReason reason)
        {
            Console.WriteLine("Processor Shutting Down. Partition '{0}', Reason: '{1}'.", context.Lease.PartitionId, reason);
            if (reason == CloseReason.Shutdown)
            {
                await context.CheckpointAsync();
            }
        }

        Task IEventProcessor.OpenAsync(PartitionContext context)
        {
            Console.WriteLine("SimpleEventProcessor initialized.  Partition: '{0}', Offset: '{1}'", context.Lease.PartitionId, context.Lease.Offset);
            this.checkpointStopWatch = new Stopwatch();
            this.checkpointStopWatch.Start();
            return Task.FromResult<object>(null);
        }

        async Task IEventProcessor.ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
        {
            foreach (EventData eventData in messages)
            {
                string data = Encoding.UTF8.GetString(eventData.GetBytes());
	                Console.WriteLine(string.Format("Message received.  Partition: '{0}', Data: '{1}'",
	                    context.Lease.PartitionId, data));

                foreach (var x in eventData.Properties)
                {
                    Console.WriteLine(string.Format("    {0} = {1}", x.Key, x.Value));
                }
            }

            //Call checkpoint every 5 minutes, so that worker can resume processing from 5 minutes back if it restarts.
            if (this.checkpointStopWatch.Elapsed > TimeSpan.FromMinutes(5))
            {
                await context.CheckpointAsync();
                this.checkpointStopWatch.Restart();
            }
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            string eventHubConnectionString = "Endpoint= <your connection string>”
            string eventHubName = "<Event Hub name>";
            string storageAccountName = "<Storage account name>";
            string storageAccountKey = "<Storage account key>”;
            string storageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}", storageAccountName, storageAccountKey);

            string eventProcessorHostName = Guid.NewGuid().ToString();
            EventProcessorHost eventProcessorHost = new EventProcessorHost(eventProcessorHostName, eventHubName, EventHubConsumerGroup.DefaultGroupName, eventHubConnectionString, storageConnectionString);
            Console.WriteLine("Registering EventProcessor...");
            var options = new EventProcessorOptions();
            options.ExceptionReceived += (sender, e) => { Console.WriteLine(e.Exception); };
            eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>(options).Wait();

            Console.WriteLine("Receiving. Press enter key to stop worker.");
            Console.ReadLine();
            eventProcessorHost.UnregisterEventProcessorAsync().Wait();
        }
    }
}
```

## Troubleshoot Event Hubs sink

- The Event Hub does not show incoming or outgoing event activity as expected.

	Check that your Event Hub is successfully provisioned. All connection info in the **PrivateConfig** section of *.wadcfgx* must match the values of your resource as seen in the portal. Make sure that you have a SAS policy defined ("SendRule" in the example) in the portal and that *Send* permission is granted.  

- After an update, the Event Hub no longer shows incoming or outgoing event activity.

	First, make sure that the Event Hub and configuration info is correct as explained previously. Sometimes the **PrivateConfig** is reset in a deployment update. The recommended fix is to make all changes to *.wadcfgx* in the project and then push a complete application update. If this is not possible, make sure that the diagnostics update pushes a complete **PrivateConfig** that includes the SAS key.  

- I tried the suggestions, and the Event Hub is still not working.

	Try looking in the Azure Storage table that contains logs and errors for Azure Diagnostics itself: **WADDiagnosticInfrastructureLogsTable**. One option is to use a tool such as [Azure Storage Explorer](http://www.storageexplorer.com) to connect to this storage account, view this table, and add a query for TimeStamp in the last 24 hours. You can use the tool to export a .csv file and open it in an application such as Microsoft Excel. Excel makes it easy to search for calling-card strings, such as **EventHubs**, to see what error is reported.  

## Next steps

•	[Learn more about Event Hubs](https://azure.microsoft.com/services/event-hubs/)

## Appendix: Complete Azure Diagnostics configuration file (.wadcfgx) example

```
<?xml version="1.0" encoding="utf-8"?>
<DiagnosticsConfiguration xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
  <PublicConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
    <WadCfg>
      <DiagnosticMonitorConfiguration overallQuotaInMB="4096" sinks="applicationInsights.errors">
        <DiagnosticInfrastructureLogs scheduledTransferLogLevelFilter="Error" />
        <Directories scheduledTransferPeriod="PT1M">
          <IISLogs containerName="wad-iis-logfiles" />
          <FailedRequestLogs containerName="wad-failedrequestlogs" />
        </Directories>
        <PerformanceCounters scheduledTransferPeriod="PT1M" sinks="HotPath">
          <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Requests/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Errors Total/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Queued" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Rejected" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT3M" />
        </PerformanceCounters>
        <WindowsEventLog scheduledTransferPeriod="PT1M">
          <DataSource name="Application!*" />
        </WindowsEventLog>
        <CrashDumps>
          <CrashDumpConfiguration processName="WaIISHost.exe" />
          <CrashDumpConfiguration processName="WaWorkerHost.exe" />
          <CrashDumpConfiguration processName="w3wp.exe" />
        </CrashDumps>
        <Logs scheduledTransferPeriod="PT1M" sinks="HotPath" scheduledTransferLogLevelFilter="Error" />
      </DiagnosticMonitorConfiguration>
      <SinksConfig>
        <Sink name="HotPath">
          <EventHub Url="https://diageventhub-py-ns.servicebus.windows.net/diageventhub-py" SharedAccessKeyName="SendRule" />
        </Sink>
        <Sink name="applicationInsights">
          <ApplicationInsights />
          <Channels>
            <Channel logLevel="Error" name="errors" />
          </Channels>
        </Sink>
      </SinksConfig>
    </WadCfg>
    <StorageAccount />
  </PublicConfig>
  <PrivateConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
    <StorageAccount name="" key="" endpoint="" />
    <EventHub Url="https://diageventhub-py-ns.servicebus.windows.net/diageventhub-py" SharedAccessKeyName="SendRule" SharedAccessKey="YOUR_KEY_HERE" />
  </PrivateConfig>
  <IsEnabled>true</IsEnabled>
</DiagnosticsConfiguration>
```

The complementary *ServiceConfiguration.Cloud.cscfg* for this example looks like the following.

```
<?xml version="1.0" encoding="utf-8"?>
<ServiceConfiguration serviceName="MyFixItCloudService" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration" osFamily="3" osVersion="*" schemaVersion="2015-04.2.6">
  <Role name="MyFixIt.WorkerRole">
    <Instances count="1" />
    <ConfigurationSettings>
      <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="YOUR_CONNECTION_STRING" />
    </ConfigurationSettings>
  </Role>
</ServiceConfiguration>
```

<!-- Images. -->
[0]: ./media/event-hubs-streaming-azure-diags-data/dashboard.png
