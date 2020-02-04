---
title: Stream Azure Diagnostics data to Event Hubs
description: Configuring Azure Diagnostics with Event Hubs end to end, including guidance for common scenarios.
ms.service:  azure-monitor
ms.subservice: diagnostic-extension
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/03/2020

---

# Send data from Windows Azure diagnostics extension to Azure Event Hubs
Azure diagnostics extension is an agent in Azure Monitor that collects monitoring data from the guest operating system and workloads of Azure virtual machines and other compute resources. This article describes how to send data from the Windows Azure Diagnostic extension (WAD) to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) so you can forward to locations outside of Azure.

## Supported data

The data collected from the guest operating system that can be sent to Event Hubs includes the following. Other data sources collected by WAD, including IIS Logs and crash dumps, cannot be sent to Event Hubs.

* Event Tracing for Windows (ETW) events
* Performance counters
* Windows event logs
* Azure Diagnostics infrastructure logs

## Prerequisites

* Windows diagnostics extension 1.6 or higher. See [Azure Diagnostics extension configuration schema versions and history](diagnostics-extension-versions.md) for a version history and [Azure Diagnostics extension overview](diagnostics-extension-overview.md) for supported resources.
* Event Hubs namespace must always be provisioned. See [Get started with Event Hubs](../../event-hubs/event-hubs-dotnet-standard-getstarted-send.md) for details.

## Configuring diagnostics extension
The rest of this article provides details on defining the diagnostics extension configuration for event hubs. See [Install and configure Windows Azure diagnostics extension (WAD)](diagnostics-extension-windows-install.md) for different options for applying this configuration to a particular virtual machine. 

## Configuration schema
Azure diagnostics extension is configured using both a public and private configuration. See [Azure Diagnostics configuration schema](diagnostics-extension-schema-windows.md) for a reference of the configuration schema for the Windows diagnostics extension. The rest of this article will describe how to use this configuration to send data to an event hub. 

Azure Diagnostics always sends logs and metrics to an Azure Storage account. You can configure one or more *data sinks* that send data to additional locations. Each sink is defined in the [SinksConfig element](diagnostics-extension-schema-windows.md#sinksconfig-element) of the public configuration with sensitive information in the private configuration. This configuration uses the values in the following table.

| Property | Description |
|:---|:---|
| Name | Descriptive name for the sink. Used in the configuration to specify which data sources to send to the sink. |
| Url  | Url of the event hub in the form \<event-hubs-namespace\>.servicebus.windows.net/\<event-hub-name\>.          |
| SharedAccessKeyName | Name of a shared access policy for the event hub that has at least **Send** authority. |
| SharedAccessKey     | Primary or secondary key from the shared access policy for the event hub. |

Example public and private configurations are shown below in both JSON and XML. This is a minimal configuration with a single performance counter and event log to illustrate how to configure and use the event hub data sink. See [Azure Diagnostics configuration schema](diagnostics-extension-schema-windows.md) for a more complex example.

### Public configuration

```JSON
{
    "PublicConfig": {
        "WadCfg": {
            "DiagnosticMonitorConfiguration": {
                "overallQuotaInMB": 10000
            },
            "PerformanceCounters": {
                "scheduledTransferPeriod": "PT1M",
                "sinks": "EventHub",
                "PerformanceCounterConfiguration": [
                    {
                        "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
                        "sampleRate": "PT3M"
                    }
                ]
            },
            "WindowsEventLog": {
                "scheduledTransferPeriod": "PT1M",
                "sinks": "EventHub",
                    "DataSource": [
                    {
                        "name": "Application!*"
                    }
                ]
            },
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
        }
    }
}
```

```xml
<PublicConfig>
    <WadCfg>
        <DiagnosticMonitorConfiguration overallQuotaInMB="10000"> 
        <PerformanceCounters scheduledTransferPeriod="PT1M", sinks="EventHub">  
            <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT1M" unit="percent" />  
        </PerformanceCounters>
        <WindowsEventLog scheduledTransferPeriod="PT5M", sinks="EventHub">  
            <DataSource name="Application!*"/>  
        </WindowsEventLog>  
        <SinksConfig>
            <Sink name="EventHub">
                <EventHub Url="https://diags-mycompany-ns.servicebus.windows.net/diageventhub" SharedAccessKeyName="SendRule" />
            </Sink>
        </SinksConfig>
    </WadCfg>
</PublicConfig>
```

### Private configuration

```JSON
{
    "PrivateConfig" {
        "storageAccountName": "mystorageaccount",
        "storageAccountKey": "{base64 encoded key}",
        "storageAccountEndPoint": "https://core.windows.net",
        "EventHub": {
            "Url": "https://diags-mycompany-ns.servicebus.windows.net/diageventhub",
            "SharedAccessKeyName": "SendRule",
            "SharedAccessKey": "{base64 encoded key}"
        }
    }
}
```

```XML
<PrivateConfig>
    <StorageAccount name="mystorageaccount" key="{base64 encoded key}" endpoint="https://core.windows.net"  /> 
    <EventHub Url="https://myeventhub-ns.servicebus.windows.net/diageventhub" SharedAccessKeyName="SendRule" SharedAccessKey="{base64 encoded key}" />
</PrivateConfig>
```


## Configuration options
To send data to a data sink, you specify the **sinks** attribute on the data source's node. Where you place the **sinks** attribute determines the scope of the assignment. In the following example, the **sinks** attribute is defined to the **PerformanceCounters** node which will cause all child performance counters to be sent to the event hub.

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

```xml
<PerformanceCounters scheduledTransferPeriod="PT1M" sinks="EventHub">
  <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT3M" />
</PerformanceCounters>
```


In the following example, the **sinks** attribute is applied directly to three counters which will cause only those performance counters to be sent to the event hub. 

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

```xml
<PerformanceCounters scheduledTransferPeriod="PT1M">
  <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Queued" sampleRate="PT3M" sinks="EventHub" />
  <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Rejected" sampleRate="PT3M" sinks="EventHub"/>
  <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT3M" sinks="EventHub"/>
</PerformanceCounters>
```


## Filter data

The following example shows how you can limit the amount of data sent to the critical metrics that are used for this service’s health. In this example, the sink is applied to logs and is filtered only to error level trace.

```JSON
"Logs": {
    "scheduledTransferPeriod": "PT1M",
    "scheduledTransferLogLevelFilter": "Error",
    "sinks": "EventHub"
}
```

```XML
<Logs scheduledTransferPeriod="PT1M" sinks="EventHub" scheduledTransferLogLevelFilter="Error" />
```




## View data sent to event hub
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
---

## Troubleshoot Event Hubs sinks
Look at the Azure Storage table **WADDiagnosticInfrastructureLogsTable** which contains logs and errors for Azure Diagnostics itself. One option is to use a tool such as [Azure Storage Explorer](https://www.storageexplorer.com) to connect to this storage account, view this table, and add a query for TimeStamp in the last 24 hours. You can use the tool to export a .csv file and open it in an application such as Microsoft Excel. Excel makes it easy to search for calling-card strings, such as **EventHubs**, to see what error is reported.  

Check that your event hub is successfully provisioned. All connection info in the **PrivateConfig** section of the configuration must match the values of your resource as seen in the portal. Make sure that you have a SAS policy defined (*SendRule* in the example) in the portal and that *Send* permission is granted.  

## Next steps

* [Event Hubs overview](../../event-hubs/event-hubs-about.md)
* [Create an event hub](../../event-hubs/event-hubs-create.md)
* [Event Hubs FAQ](../../event-hubs/event-hubs-faq.md)

<!-- Images. -->
[0]: ../../event-hubs/media/event-hubs-streaming-azure-diags-data/dashboard.png



