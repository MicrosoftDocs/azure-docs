---
title: Stream Azure Diagnostics data to Event Hubs
description: Configuring Azure Diagnostics with Event Hubs end to end, including guidance for common scenarios.
ms.service:  azure-monitor
ms.subservice: diagnostic-extension
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/26/2020

---

# Send data from Windows Azure diagnostics extension to Event Hubs
The Diagnostics extension in Azure Monitor allows you to collect logs and metrics from Azure compute resources into Azure Storage and also send them to other destinations. This article describes how to send data from the Windows Azure Diagnostic extension (WAD) to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) so you can send the data to locations outside of Azure.

## Supported data

The data collected from the guest operating system that can be sent to Event Hubs includes the following. Other data sources collected by WAD, including IIS Logs and crash dumps, cannot be sent to Event Hubs.

* Event Tracing for Windows (ETW) events
* Performance counters
* Windows event logs
* Azure Diagnostics infrastructure logs

## Prerequisites

* Windows diagnostics extension 1.6 or higher. See [Azure Diagnostics extension configuration schema versions and history](diagnostics-extension-schema.md) for a version history and [Azure Diagnostics extension overview](diagnostics-extension-overview.md) for supported resources.
* Event Hubs namespace provisioned per the article, [Get started with Event Hubs](../../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)

## Configuration schema
See [Azure Diagnostics configuration schema](diagnostics-extension-schema-windows.md) for a reference of the configuration schema for the Windows diagnostics extension. The rest of this article will describe how to use this configuration to send data to an event hub. 


## Define the event hub sink
Azure Diagnostics always sends logs and metrics to an Azure Storage account. You can configure one or more *data sinks* that send data to an additional location. Each sink is defined in the *SinksConfig* section of the configuration. This configuration uses the values in the following table.


| Property | Description |
|:---|:---|
| Name | Descriptive name for the sink. Used in the configuration to specify which data sources send to the sink. |
| Url  | Url of the event hub in the form <event-hubs-namespace>.servicebus.windows.net/<event-hub-name>.          |
| SharedAccessKeyName | Name of a shared access policy for the event hub that has at least **Send** authority. |
| SharedAccessKey     | Primary or secondary key from the shared access policy for the event hub. |

Example public configurations are shown below in both JSON and XML.

```xml
<PublicConfig>
    <WadCfg>
        ...
        <SinksConfig>
            <Sink name="EventHub">
                <EventHub Url="https://diags-mycompany-ns.servicebus.windows.net/diageventhub" SharedAccessKeyName="SendRule" />
            </Sink>
        </SinksConfig>
        ...
    </WadCfg>
</PublicConfig>
```
```JSON
"PublicConfig": {
    "WadCfg": {
        ...
        "SinksConfig": {
            "Sink": [
                {
                    "name": "EventHub",
                    "EventHub": {
                        "Url": "https://diags-mycompany-ns.servicebus.windows.net/diageventhub",
                        "SharedAccessKeyName": "SendRule"
                    }
                }
            ]
        }
        ...
    }
}
```

Example private configurations are shown below in both JSON and XML.

```XML
<PrivateConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
    ...
    <EventHub Url="https://diags-mycompany-ns.servicebus.windows.net/diageventhub" SharedAccessKeyName="SendRule" SharedAccessKey="TXzyJcEmLVRAYEE7HaBbbQ9UuXsFD+MKNk5C2KP4wa0=" />
    ...
</PrivateConfig>
```
```JSON
{
    ...
    "EventHub": {
        "Url": "https://diags-mycompany-ns.servicebus.windows.net/diageventhub",
        "SharedAccessKeyName": "SendRule",
        "SharedAccessKey": "TXzyJcEmLVRAYEE7HaBbbQ9UuXsFD+MKNk5C2KP4wa0="
    }
    ...
}
```



## Configure Azure Diagnostics to send logs and metrics to Event Hubs
With the event hub data sink defined, you can configure metrics and logs from guest operating system to be sent to it. The data will also be collected to the storage account defined in the configuration.



```xml
<PerformanceCounters scheduledTransferPeriod="PT1M" sinks="EventHub">
  <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT1M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT1M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT1M" />
</PerformanceCounters>
```
```JSON
"PerformanceCounters": {
    "scheduledTransferPeriod": "PT1M",
    "sinks": "HotPath",
    "PerformanceCounterConfiguration": [
        {
            "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
            "sampleRate": "PT3M"
        },
        {
            "counterSpecifier": "\\Memory\\Available MBytes",
            "sampleRate": "PT3M"
        },
        {
            "counterSpecifier": "\\Web Service(_Total)\\ISAPI Extension Requests/sec",
            "sampleRate": "PT3M"
        }
    ]
}
```



As discussed previously, all default and custom diagnostics data, that is, metrics and logs, is automatically sent to Azure Storage in the configured intervals. With Event Hubs and any additional sink, you can specify any root or leaf node in the hierarchy to be sent to the event hub. This includes ETW events, performance counters, Windows event logs, and application logs.   

## Recommendations

It is important to consider how many data points should actually be transferred to Event Hubs. Typically, developers transfer low-latency hot-path data that must be consumed and interpreted quickly. Systems that monitor alerts or autoscale rules are examples. A developer might also configure an alternate analysis store or search store -- for example, Azure Stream Analytics, Elasticsearch, a custom monitoring system, or a favorite monitoring system from others.

In the following example, the **sinks** attribute is defined to the **PerformanceCounters** node which will cause all child performance counters to be sent to the event hub.

```xml
<PerformanceCounters scheduledTransferPeriod="PT1M" sinks="EventHub">
  <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT3M" />
</PerformanceCounters>
```
```JSON
"PerformanceCounters": {
    "scheduledTransferPeriod": "PT1M",
    "sinks": "EventHub",
    "PerformanceCounterConfiguration": [
        {
            "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
            "sampleRate": "PT3M"
        },
        {
            "counterSpecifier": "\\Memory\\Available MBytes",
            "sampleRate": "PT3M"
        },
        {
            "counterSpecifier": "\\Web Service(_Total)\\ISAPI Extension Requests/sec",
            "sampleRate": "PT3M"
        }
    ]
}
```

In the following example, the **sinks** attribute is applied directly to three counters which will cause only those performance counters to be sent to the event hub. 

```xml
<PerformanceCounters scheduledTransferPeriod="PT1M">
  <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Queued" sampleRate="PT3M" sinks="EventHub" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Rejected" sampleRate="PT3M" sinks="EventHub"/>
  <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT3M" sinks="EventHub"/>
</PerformanceCounters>
```
```JSON
"PerformanceCounters": {
    "scheduledTransferPeriod": "PT1M",
    "PerformanceCounterConfiguration": [
        {
            "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
            "sampleRate": "PT3M",
            "sinks": "EventHub"
        },
        {
            "counterSpecifier": "\\Memory\\Available MBytes",
            "sampleRate": "PT3M"
        },
        {
            "counterSpecifier": "\\Web Service(_Total)\\ISAPI Extension Requests/sec",
            "sampleRate": "PT3M"
        },
        {
            "counterSpecifier": "\\ASP.NET\\Requests Rejected",
            "sampleRate": "PT3M",
            "sinks": "EventHub"
        },
        {
            "counterSpecifier": "\\ASP.NET\\Requests Queued",
            "sampleRate": "PT3M",
            "sinks": "EventHub"
        }
    ]
}
```



The following example shows how you can limit the amount of data sent to the critical metrics that are used for this service’s health. In this example, the sink is applied to logs and is filtered only to error level trace.

```XML
<Logs scheduledTransferPeriod="PT1M" sinks="HotPath" scheduledTransferLogLevelFilter="Error" />
```
```JSON
"Logs": {
    "scheduledTransferPeriod": "PT1M",
    "scheduledTransferLogLevelFilter": "Error",
    "sinks": "HotPath"
}
```




## Viewing data sent to event hub
A simple approach is view the data sent to the event hub is to create a small test console application to listen to the event hub and print the output stream. You can place the following code, which is explained in more detail
in [Get started with Event Hubs](../../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)), in a console application. The console application must include the [Event Processor Host NuGet package](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost/). Replace the values in angle brackets in the **Main** function with values for your resources.   

```csharp
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
            string eventHubConnectionString = "Endpoint= <your connection string>";
            string eventHubName = "<Event hub name>";
            string storageAccountName = "<Storage account name>";
            string storageAccountKey = "<Storage account key>";
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

## Troubleshoot Event Hubs sinks
Look at the Azure Storage table **WADDiagnosticInfrastructureLogsTable** which contains logs and errors for Azure Diagnostics itself. One option is to use a tool such as [Azure Storage Explorer](https://www.storageexplorer.com) to connect to this storage account, view this table, and add a query for TimeStamp in the last 24 hours. You can use the tool to export a .csv file and open it in an application such as Microsoft Excel. Excel makes it easy to search for calling-card strings, such as **EventHubs**, to see what error is reported.  

Check that your event hub is successfully provisioned. All connection info in the **PrivateConfig** section of the configuration must match the values of your resource as seen in the portal. Make sure that you have a SAS policy defined (*SendRule* in the example) in the portal and that *Send* permission is granted.  

## Next steps

* [Event Hubs overview](../../event-hubs/event-hubs-about.md)
* [Create an event hub](../../event-hubs/event-hubs-create.md)
* [Event Hubs FAQ](../../event-hubs/event-hubs-faq.md)

<!-- Images. -->
[0]: ../../event-hubs/media/event-hubs-streaming-azure-diags-data/dashboard.png



