---
title: Send data from Windows Azure diagnostics extension to Azure Event Hubs
description: Configure diagnostics extension in Azure Monitor to send data to Azure Event Hub so you can forward it to locations outside of Azure.
ms.subservice: diagnostic-extension
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/18/2020

---

# Send data from Windows Azure diagnostics extension to Azure Event Hubs
Azure diagnostics extension is an agent in Azure Monitor that collects monitoring data from the guest operating system and workloads of Azure virtual machines and other compute resources. This article describes how to send data from the Windows Azure Diagnostic extension (WAD) to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) so you can forward to locations outside of Azure.

## Supported data

The data collected from the guest operating system that can be sent to Event Hubs includes the following. Other data sources collected by WAD, including IIS Logs and crash dumps, cannot be sent to Event Hubs.

* Event Tracing for Windows (ETW) events
* Performance counters
* Windows event logs, including application logs in the Windows event log
* Azure Diagnostics infrastructure logs

## Prerequisites

* Windows diagnostics extension 1.6 or higher. See [Azure Diagnostics extension configuration schema versions and history](diagnostics-extension-versions.md) for a version history and [Azure Diagnostics extension overview](diagnostics-extension-overview.md) for supported resources.
* Event Hubs namespace must always be provisioned. See [Get started with Event Hubs](../../event-hubs/event-hubs-dotnet-standard-getstarted-send.md) for details.


## Configuration schema
See [Install and configure Windows Azure diagnostics extension (WAD)](diagnostics-extension-windows-install.md) for different options for enabling and configuring the diagnostics extension and [Azure Diagnostics configuration schema](diagnostics-extension-schema-windows.md) for a reference of the configuration schema. The rest of this article will describe how to use this configuration to send data to an event hub. 

Azure Diagnostics always sends logs and metrics to an Azure Storage account. You can configure one or more *data sinks* that send data to additional locations. Each sink is defined in the [SinksConfig element](diagnostics-extension-schema-windows.md#sinksconfig-element) of the public configuration with sensitive information in the private configuration. This configuration for event hubs uses the values in the following table.

| Property | Description |
|:---|:---|
| Name | Descriptive name for the sink. Used in the configuration to specify which data sources to send to the sink. |
| Url  | Url of the event hub in the form \<event-hubs-namespace\>.servicebus.windows.net/\<event-hub-name\>.          |
| SharedAccessKeyName | Name of a shared access policy for the event hub that has at least **Send** authority. |
| SharedAccessKey     | Primary or secondary key from the shared access policy for the event hub. |

Example public and private configurations are shown below. This is a minimal configuration with a single performance counter and event log to illustrate how to configure and use the event hub data sink. See [Azure Diagnostics configuration schema](diagnostics-extension-schema-windows.md) for a more complex example.

### Public configuration

```JSON
{
    "WadCfg": {
        "DiagnosticMonitorConfiguration": {
            "overallQuotaInMB": 5120,
            "PerformanceCounters": {
                "scheduledTransferPeriod": "PT1M",
                "sinks": "myEventHub",
                "PerformanceCounterConfiguration": [
                    {
                        "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
                        "sampleRate": "PT3M"
                    }
                ]
            },
            "WindowsEventLog": {
                "scheduledTransferPeriod": "PT1M",
                "sinks": "myEventHub",
                    "DataSource": [
                    {
                        "name": "Application!*[System[(Level=1 or Level=2 or Level=3)]]"
                    }
                ]
            }
        },
        "SinksConfig": {
            "Sink": [
                {
                    "name": "myEventHub",
                    "EventHub": {
                        "Url": "https://diags-mycompany-ns.servicebus.windows.net/diageventhub",
                        "SharedAccessKeyName": "SendRule"
                    }
                }
            ]
        }
    },
    "StorageAccount": "mystorageaccount",
}
```


### Private configuration

```JSON
{
    "storageAccountName": "mystorageaccount",
    "storageAccountKey": "{base64 encoded key}",
    "storageAccountEndPoint": "https://core.windows.net",
    "EventHub": {
        "Url": "https://diags-mycompany-ns.servicebus.windows.net/diageventhub",
        "SharedAccessKeyName": "SendRule",
        "SharedAccessKey": "{base64 encoded key}"
    }
}
```



## Configuration options
To send data to a data sink, you specify the **sinks** attribute on the data source's node. Where you place the **sinks** attribute determines the scope of the assignment. In the following example, the **sinks** attribute is defined to the **PerformanceCounters** node which will cause all child performance counters to be sent to the event hub.

```JSON
"PerformanceCounters": {
    "scheduledTransferPeriod": "PT1M",
    "sinks": "MyEventHub",
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

```JSON
"PerformanceCounters": {
    "scheduledTransferPeriod": "PT1M",
    "PerformanceCounterConfiguration": [
        {
            "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
            "sampleRate": "PT3M",
            "sinks": "MyEventHub"
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
            "sinks": "MyEventHub"
        },
        {
            "counterSpecifier": "\\ASP.NET\\Requests Queued",
            "sampleRate": "PT3M",
            "sinks": "MyEventHub"
        }
    ]
}
```

## Validating configuration
You can use a variety of methods to validate that data is being sent to the event hub. ne straightforward method is to use Event Hubs capture as described in [Capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage](../../event-hubs/event-hubs-capture-overview.md). 


## Troubleshoot Event Hubs sinks

- Look at the Azure Storage table **WADDiagnosticInfrastructureLogsTable** which contains logs and errors for Azure Diagnostics itself. One option is to use a tool such as [Azure Storage Explorer](https://www.storageexplorer.com) to connect to this storage account, view this table, and add a query for TimeStamp in the last 24 hours. You can use the tool to export a .csv file and open it in an application such as Microsoft Excel. Excel makes it easy to search for calling-card strings, such as **EventHubs**, to see what error is reported.  

- Check that your event hub is successfully provisioned. All connection info in the **PrivateConfig** section of the configuration must match the values of your resource as seen in the portal. Make sure that you have a SAS policy defined (*SendRule* in the example) in the portal and that *Send* permission is granted.  

## Next steps

* [Event Hubs overview](../../event-hubs/event-hubs-about.md)
* [Create an event hub](../../event-hubs/event-hubs-create.md)
* [Event Hubs FAQ](../../event-hubs/event-hubs-faq.md)

<!-- Images. -->
[0]: ../../event-hubs/media/event-hubs-streaming-azure-diags-data/dashboard.png



