---
title: Azure Compute - Linux Diagnostic Extension | Microsoft Docs
description: How to configure the Azure Linux Diagnostic Extension (LAD) to collect metrics and log events from Linux VMs running in Azure.
services: virtual-machines-linux
documentationcenter: dev-center-name
author: jasonzio
manager: anandram


ms.service: virtual-machines-linux
ms.devlang: may be required
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: required
ms.date: 05/09/2017
ms.author: jasonzio@microsoft.com

---

# Use Linux Diagnostic Extension to monitor metrics and logs

This document describes version 3.0 and newer of the Linux Diagnostic Extension. For information about version 2.3 and older, see [this document](./classic/diagnostic-extension.md).

## Introduction

The Linux Diagnostic Extension helps a user monitor the health of a Linux VM running on Microsoft Azure. It has the following capabilities:

* Collects system performance metrics from the VM and stores them in a specific table in a designated storage account.
* Retrieves log events from syslog and stores them in a specific table in the designated storage account.
* Enables users to customize the data metrics that are collected and uploaded.
* Enables users to customize the syslog facilities and severity levels of events that are collected and uploaded.
* Enables users to upload specified log files to a designated storage table.
* Supports sending metrics and log events to arbitrary EventHub endpoints and JSON-formatted blobs in the designated storage account.

This extension works with both Azure deployment models.

### Migration from previous versions of the extension

The latest version of the extension is **3.0**. **Any old versions (2.x) are deprecated and may be unpublished on or after July 31, 2018**.

This extension introduces breaking changes to the configuration of the extension. One such change was made to improve the security of the extension; as a result, backwards compatibility with 2.x could not be maintained. Also, the Extension Publisher for this extension is different than the publisher for the 2.x versions.

To migrate from 2.x to this new version of the extension, you must uninstall the old extension (under the old publisher name), then install version 3 of the extension.

Recommendations:

* Install the extension with automatic minor version upgrade enabled.
  * On classic deployment model VMs, specify '3.*' as the version if you are installing the extension through Azure XPLAT CLI or Powershell.
  * On Azure Resource Manager deployment model VMs, include '"autoUpgradeMinorVersion": true' in the VM deployment template.
* Use a new/different storage account for LAD 3.0. There are several small incompatibilities between LAD 2.3 and LAD 3.0 that make sharing an account troublesome:
  * LAD 3.0 stores syslog events in a table with a different name.
  * The counterSpecifier strings for builtin metrics differ in LAD 3.0.

## Enable the extension

You can enable this extension by using the Azure PowerShell cmdlets, Azure CLI scripts, or Azure deployment templates.

Use the Azure portal to view performance data or set alerts:

![image](./media/diagnostic-extension/graph_metrics.png)

The Azure portal cannot be used to enable or configure LAD 3.0. Instead, it installs and configures version 2.3. Azure portal graphs and alerts work with data from both versions of the extension.

## Prerequisites

* **Azure Linux Agent version 2.2.0 or later**. Most Azure VM Linux gallery images include version 2.2.7 or later. Run `/usr/sbin/waagent -version` to confirm the version installed on the VM. If the VM is running an older version of the guest agent, follow [these instructions](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/update-agent) to update it.
* **Azure CLI**. [Set up the Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) environment on your machine.
* An existing storage account to store the data and an associated SAS token that grants the needed access rights.

## Protected Settings

This set of configuration information contains sensitive information that should be protected from public view, for example, storage credentials. These settings are transmitted to and stored by the extension in encrypted form.

```json
{
    "storageAccountName" : "the storage account to receive data",
    "storageAccountEndPoint": "the hostname suffix for the cloud for this account",
    "storageAccountSasToken": "SAS access token",
    "mdsdHttpProxy": "HTTP proxy settings",
    "sinksConfig": { ... }
}
```

Name | Value
---- | -----
storageAccountName | The name of the storage account in which data is written by the extension.
storageAccountEndPoint | (optional) The endpoint identifying the cloud in which the storage account exists. If this setting is absent, LAD defaults to the Azure public cloud, `https://core.windows.net`. To use a storage account in Azure Germany, Azure Government, or Azure China, set this value accordingly.
storageAccountSasToken | An [Account SAS token](https://azure.microsoft.com/blog/sas-update-account-sas-now-supports-all-storage-services/) for Blob and Table services (ss='bt'), applicable to containers and objects (srt='co'), which grants add, create, list, update, and write permissions (sp='acluw'). Do *not* include the leading question-mark (?).
mdsdHttpProxy | (optional) HTTP proxy information needed to enable the extension to connect to the specified storage account and endpoint.
sinksConfig | (optional) Details of alternative destinations to which metrics and events can be delivered. The specific details of each data sink supported by the extension are covered in the sections that follow.

You can easily construct the required SAS token through the Azure portal.

1. Select the general-purpose storage account to which you want the extension to write
1. Select "Shared access signature" from the Settings part of the left menu
1. Make the appropriate sections as previously described
1. Click the "Generate SAS" button.

![image](./media/diagnostic-extension/makeSAS.png)

Copy the generated SAS into the storageAccountSasToken field; remove the leading question-mark ("?").

### sinksConfig

```json
"sinksConfig": {
    "sink": [
        {
            "name": "sinkname",
            "type": "sinktype",
            ...
        },
        ...
    ]
},
```

This section defines additional destinations to which the extension sends the information it collects. The "sink" array contains an object for each additional data sink. The "type" attribute determines the other attributes in the object.

Element | Value
------- | -----
name | A string used to refer to this sink elsewhere in the extension configuration.
type | The type of sink being defined. Determines the other values (if any) in instances of this type.

Version 3.0 of the Linux Diagnostic Extension supports two sink types: EventHub, and JsonBlob.

#### The EventHub sink

```json
"sink": [
    {
        "name": "sinkname",
        "type": "EventHub",
        "sasUrl": "https SAS URL"
    },
    ...
]
```

The "sasURL" entry contains the full URL, including SAS token, for the EventHub endpoint to which data should be published. The SAS URL should be built using the EventHub endpoint (policy-level) shared key, not the root-level shared key for the entire EventHub subscription. Event Hubs SAS tokens differ from Storage SAS tokens; see [this web page](https://docs.microsoft.com/rest/api/eventhub/generate-sas-token) for details.

#### The JsonBlob sink

```json
"sink": [
    {
        "name": "sinkname",
        "type": "JsonBlob"
    },
    ...
]
```

Data directed to a JsonBlob sink is stored in blobs in Azure storage. Each instance of LAD creates a blob every hour for each sink name. Each blob always contains a syntactically valid JSON array of object. New entries are atomically added to the array. Blobs are stored in a container with the same name as the sink. The Azure storage rules for blob container names apply to the names of JsonBlob sinks: between 3 and 63 lower-case alphanumeric ASCII characters or dashes.

## Public settings

This structure contains various blocks of settings that control the information collected by the extension.

```json
{
    "StorageAccount": "the storage account to receive data",
    "mdsdHttpProxy" : "",
    "ladCfg":  { ... },
    "perfCfg": { ... },
    "fileLogs": { ... }
}
```

Element | Value
------- | -----
StorageAccount | The name of the storage account in which data is written by the extension. Must be the same name as is specified in the Protected settings.
mdsdHttpProxy | (optional) Same as in the [Protected Settings](#Protected-Settings). The public value is overridden by the private value, if set. Place proxy settings that contain a secret, such as a password, in the [Protected settings](#Protected-settings).

The remaining elements are described in detail in the following sections.

### ladCfg

```json
"ladCfg": {
    "diagnosticMonitorConfiguration": {
        "eventVolume": "Medium",
        "metrics": { ... },
        "performanceCounters": { ... },
        "syslogEvents": { ... }
    },
    "sampleRateInSeconds": 15
}
```

This structure controls the gathering of metrics and logs for delivery to the Azure Metrics service and to other data sinks.

The Azure Metrics service requires metrics to be stored in a precisely named Azure storage table. Similarly, log events must be stored in a different, but also precisely named, table. All instances of the diagnostic extension configured to use the same storage account name and endpoint add their metrics and logs to the same table. If too many VMs are writing to the same table partition, Azure can throttle writes to that partition. The eventVolume setting causes entries to be spread across 1 (Small), 10 (Medium), or 100 (Large) different partitions. Usually, "Medium" is sufficient to ensure traffic is not throttled.

Element | Value
------- | -----
eventVolume | Controls the number of partitions created within the storage table. Must be one of "Large", "Medium", or "Small."
sampleRateInSeconds | The default interval between collection of raw (unaggregated) metrics. The smallest supported sample rate is 15 seconds.

#### metrics

```json
"metrics": {
    "resourceId": "/subscriptions/...",
    "metricAggregation" : [
        { "scheduledTransferPeriod" : "PT1H" },
        { "scheduledTransferPeriod" : "PT5M" }
    ]
}
```

Samples of the metrics specified in the performanceCounters section are periodically collected. Those raw samples are aggregated to produce mean, minimum, maximum, and last-collected values, along with the count of raw samples used to compute the aggregate. If multiple scheduledTransferPeriod frequencies appear (as in the example), each aggregation is computed independently over the specified interval. The transfer period is included in the name of the storage table in which LAD writes the aggregated metrics are written.

Element | Value
------- | -----
resourceId | The Azure Resource Manager resource ID of the VM or of the virtual machine scale set to which the VM belongs. This setting must be also specified if any JsonBlob sink is used in the configuration.
scheduledTransferPeriod | The frequency at which aggregate metrics are to be computed and transferred to Azure Metrics, expressed as an IS 8601 time interval. The smallest transfer period is 60 seconds, that is, PT1M.

Samples of the metrics specified in the performanceCounters section are collected every 15 seconds or at the sample rate explicitly defined for the counter. If multiple scheduledTransferPeriod frequencies appear (as in the example), each aggregation is computed independently. The name of the storage table to which aggregated metrics are written is based, in part, on the transfer period of the aggregated metrics stored within it.

#### performanceCounters

```json
"performanceCounters": {
    "sinks": "",
    "performanceCounterConfiguration": [
        {
            "type": "builtin",
            "class": "Processor",
            "counter": "PercentIdleTime",
            "counterSpecifier": "/builtin/Processor/PercentIdleTime",
            "condition": "IsAggregate=TRUE",
            "sampleRate": "PT15S",
            "unit": "Percent",
            "annotation": [
                {
                    "displayName" : "Aggregate CPU %idle time",
                    "locale" : "en-us"
                }
            ],
        },
    ]
}
```

Element | Value
------- | -----
sinks | A comma-separated list of names of sinks (as defined in the sinksConfig section of the Private configuration file) to which aggregated metric results should be published. All aggregated metrics are published to each listed sink. Example: "EHsink1,myjsonsink"
type | Identifies the actual provider of the metric.
class | Together with "counter", identifies the specific metric within the provider's namespace.
counter | Together with "class", identifies the specific metric within the provider's namespace.
counterSpecifier | Identifies the specific metric within the Azure Metrics namespace.
condition | Selects a specific instance of the object to which the metric applies or selects the aggregation across all instances of that object. For more information, see the [builtin metric definitions](#Metrics-supported-by-builtin).
sampleRate | IS 8601 interval that sets the rate at which raw samples for this metric are collected. If not set, the collection interval is set by the value of sampleRateInSeconds (see "ladCfg"). The shortest supported sample rate is 15 seconds (PT15S).
unit | Should be one of these strings: "Count", "Bytes", "Seconds", "Percent", "CountPerSecond", "BytesPerSecond", "Millisecond". Defines the unit for the metric. Consumers of the collected data expect the collected data values to match this unit. LAD ignores this field.
displayName | The label (in the language specified by the associated locale setting) to be attached to this data in Azure Metrics. LAD ignores this field.

The counterSpecifier is an arbitrary identifier. Consumers of metrics, like the Azure portal charting and alerting feature, use counterSpecifier as the "key" that identifies a metric or an instance of a metric. For builtin metrics, we recommend you use counterSpecifier values that begin with `/builtin/`. If you are collecting a specific instance of a metric, we recommend you attach the identifier of the instance to the counterSpecifier value. Some examples:

* `/builtin/Processor/PercentIdleTime` - Idle time averaged across all cores
* `/builtin/Disk/FreeSpace(/mnt)` - Free space for the /mnt filesystem
* `/builtin/Disk/FreeSpace` - Free space averaged across all mounted filesystems

Neither LAD nor the Azure portal expects the counterSpecifier value to match any pattern. Be consistent in how you construct counterSpecifier values.

#### syslogEvents

```json
"syslogEvents": {
    "sinks": "",
    "syslogEventConfiguration": {
        "facilityName1": "minSeverity",
        "facilityName2": "minSeverity",
        ...
    }
}
```

The syslogEventConfiguration collection has one entry for each syslog facility of interest. If minSeverity is "NONE" for a particular facility, or if that facility does not appear in the element at all, no events from that facility are captured.

Element | Value
------- | -----
sinks | A comma-separated list of names of sinks to which individual log events are published. All log events matching the restrictions in syslogEventConfiguration are published to each listed sink. Example: "EHforsyslog"
facilityName | A syslog facility name (such as "LOG\_USER" or "LOG\_LOCAL0"). See the "facility" section of the [syslog man page](http://man7.org/linux/man-pages/man3/syslog.3.html) for the full list.
minSeverity | A syslog severity level (such as "LOG\_ERR" or "LOG\_INFO"). See the "level" section of the [syslog man page](http://man7.org/linux/man-pages/man3/syslog.3.html) for the full list. The extension captures events sent to the facility at or above the specified level.

### perfCfg

Controls execution of arbitrary [OMI](https://github.com/Microsoft/omi) queries.

```json
"perfCfg": [
    {
        "namespace": "root/scx",
        "query": "SELECT PercentAvailableMemory, PercentUsedSwap FROM SCX_MemoryStatisticalInformation",
        "table": "LinuxOldMemory",
        "frequency": 300,
        "sinks": ""
    }
]
```

Element | Value
------- | -----
namespace | (optional) The OMI namespace within which the query should be executed. If unspecified, the default value is "root/scx", implemented by the [System Center Cross-platform Providers](http://scx.codeplex.com/wikipage?title=xplatproviders&referringTitle=Documentation).
query | The OMI query to be executed.
table | (optional) The Azure storage table, in the designated storage account (see [Protected Settings](#Protected-Settings)).
frequency | (optional) The number of seconds between execution of the query. Default value is 300 (5 minutes); minimum value is 15 seconds.
sinks | (optional) A comma-separated list of names of additional sinks to which raw sample metric results should be published. No aggregation of these raw samples is computed by the extension or by Azure Metrics.

Either "table" or "sinks", or both, must be specified.

### fileLogs

Controls the capture of log files. LAD configures fluentd to capture new text lines as they are written to the file and to pass them to the diagnostic extension. LAD writes the captured lines to table rows and/or any specified sinks (JsonBlob or EventHub).

```json
"fileLogs": {
    "fileLogConfiguration": [
        {
            "file": "/var/log/mydaemonlog",
            "table": "MyDaemonEvents",
            "sinks": ""
        }
    ]
}
```

Element | Value
------- | -----
file | The full pathname of the log file to be watched and captured. The pathname must name a single file; it cannot name a directory or contain wildcards.
table | (optional) The Azure storage table, in the designated storage account (as specified in the protected configuration), into which new lines from the "tail" of the file are written.
sinks | (optional) A comma-separated list of names of additional sinks to which log lines sent.

Either "table" or "sinks", or both, must be specified.

## Metrics supported by the "builtin" provider

The "builtin" metric provider is a source of metrics most interesting to a broad set of users. These metrics fall into five broad classes:

* Processor
* Memory
* Network
* Filesystem
* Disk

### Builtin metrics for the Processor class

The Processor class of metrics provides information about processor usage in the VM. When aggregating percentages, the result is the average across all CPUs. In a two core VM, if one core was 100% busy and the other was 100% idle, the reported PercentIdleTime would be 50. If each core was 50% busy for the same period, the reported result would also be 50. In a four core VM, with one core 100% busy and the others idle, the reported PercentIdleTime would be 75.

counter | Meaning
------- | -------
PercentIdleTime | Percentage of time during the aggregation window that processors were executing the kernel idle loop
PercentProcessorTime | Percentage of time executing a non-idle thread
PercentIOWaitTime | Percentage of time waiting for IO operations to complete
PercentInterruptTime | Percentage of time executing hardware/software interrupts and DPCs (deferred procedure calls)
PercentUserTime | Of non-idle time during the aggregation window, the percentage of time spent in user more at normal priority
PercentNiceTime | Of non-idle time, the percentage spent at lowered (nice) priority
PercentPrivilegedTime | Of non-idle time, the percentage spent in privileged (kernel) mode

The first four counters should sum to 100%. The last three counters also sum to 100%; they subdivide the sum of PercentProcessorTime, PercentIOWaitTime, and PercentInterruptTime.

To obtain a single metric aggregated across all processors, set `"condition": "IsAggregate=TRUE"`. To obtain a metric for a specific processor, such as the second logical processor of a four core VM, set `"condition": "Name=\\"1\\""`. Logical processor numbers are in the range `[0..n-1]`.

### Builtin metrics for the Memory class

The Memory class of metrics provides information about memory utilization, paging, and swapping.

counter | Meaning
------- | -------
AvailableMemory | Available physical memory in MiB
PercentAvailableMemory | Available physical memory as a percent of total memory
UsedMemory | In-use physical memory (MiB)
PercentUsedMemory | In-use physical memory as a percent of total memory
PagesPerSec | Total paging (read/write)
PagesReadPerSec | Pages read from backing store (pagefile, program file, mapped file, etc.)
PagesWrittenPerSec | Pages written to backing store (pagefile, mapped file, etc.)
AvailableSwap | Unused swap space (MiB)
PercentAvailableSwap | Unused swap space as a percentage of total swap
UsedSwap | In-use swap space (MiB)
PercentUsedSwap | In-use swap space as a percentage of total swap

This class of metrics has only a single instance. The "condition" attribute has no useful settings and should be omitted.

### Builtin metrics for the Network class

The Network class of metrics provides information about network activity on an individual network interfaces since boot. LAD does not expose bandwidth metrics, which can be retrieved from host metrics.

counter | Meaning
------- | -------
BytesTransmitted | Total bytes sent since boot
BytesReceived | Total bytes received since boot
BytesTotal | Total bytes sent or received since boot
PacketsTransmitted | Total packets sent since boot
PacketsReceived | Total packets received since boot
TotalRxErrors | Number of receive errors since boot
TotalTxErrors | Number of transmit errors since boot
TotalCollisions | Number of collisions reported by the network ports since boot

 Although this class is instanced, LAD does not support capturing Network metrics aggregated across all network devices. To obtain the metrics for a specific interface, such as eth0, set `"condition": "InstanceID=\\"eth0\\""`.

### Builtin metrics for the Filesystem class

The Filesystem class of metrics provides information about filesystem usage. Absolute and percentage values are reported as they'd be displayed to an ordinary user (not root).

counter | Meaning
------- | -------
FreeSpace | Available disk space in bytes
UsedSpace | Used disk space in bytes
PercentFreeSpace | Percentage free space
PercentUsedSpace | Percentage used space
PercentFreeInodes | Percentage of unused inodes
PercentUsedInodes | Percentage of allocated (in use) inodes summed across all filesystems
BytesReadPerSecond | Bytes read per second
BytesWrittenPerSecond | Bytes written per second
BytesPerSecond | Bytes read or written per second
ReadsPerSecond | Read operations per second
WritesPerSecond | Write operations per second
TransfersPerSecond | Read or write operations per second

Aggregated values across all file systems can be obtained by setting `"condition": "IsAggregate=True"`. Values for a specific mounted file system, such as "/mnt", can be obtained by setting `"condition": 'Name="/mnt"'`.

### Builtin metrics for the Disk class

The Disk class of metrics provides information about disk device usage. These statistics apply to the entire drive. If there are multiple file systems on a device, the counters for that device are, effectively, aggregated across all of them.

counter | Meaning
------- | -------
ReadsPerSecond | Read operations per second
WritesPerSecond | Write operations per second
TransfersPerSecond | Total operations per second
AverageReadTime | Average seconds per read operation
AverageWriteTime | Average seconds per write operation
AverageTransferTime | Average seconds per operation
AverageDiskQueueLength | Average number of queued disk operations
ReadBytesPerSecond | Number of bytes read per second
WriteBytesPerSecond | Number of bytes written per second
BytesPerSecond | Number of bytes read or written per second

Aggregated values across all disks can be obtained by setting `"condition": "IsAggregate=True"`. To get information for a specific device (for example, /dev/sdf1), set `"condition": "Name=\\"/dev/sdf1\\""`.

## Installing and configuring LAD 3.0 via CLI

Assuming your protected settings are in the file PrivateConfig.json and your public configuration information is in PublicConfig.json, run this command:

```azurecli
azure vm extension set *resource_group_name* *vm_name* LinuxDiagnostic Microsoft.Azure.Diagnostics '3.*' --private-config-path PrivateConfig.json --public-config-path PublicConfig.json
```

The command assumes you are using the Azure Resource Management mode (arm) of the Azure CLI. To configure LAD for classic deployment model (ASM) VMs, switch to "asm" mode (`azure config mode asm`) and omit the resource group name in the command. For more information, see the [cross-platform CLI documentation](https://docs.microsoft.com/azure/xplat-cli-connect).

## An example LAD 3.0 configuration

Based on the preceding definitions, here's a sample LAD 3.0 extension configuration with some explanation. To apply this sample to your case, you should use your own storage account name, account SAS token, and EventHubs SAS tokens.

### PrivateConfig.json

These private settings configure:

* a storage account
* a matching account SAS token
* several sinks (JsonBlob or EventHubs with SAS tokens)

```json
{
  "storageAccountName": "yourdiagstgacct",
  "storageAccountSasToken": "sv=xxxx-xx-xx&ss=bt&srt=co&sp=wlacu&st=yyyy-yy-yyT21%3A22%3A00Z&se=zzzz-zz-zzT21%3A22%3A00Z&sig=fake_signature",
  "sinksConfig": {
    "sink": [
      {
        "name": "SyslogJsonBlob",
        "type": "JsonBlob"
      },
      {
        "name": "FilelogJsonBlob",
        "type": "JsonBlob"
      },
      {
        "name": "LinuxCpuJsonBlob",
        "type": "JsonBlob"
      },
      {
        "name": "MyJsonMetricsBlob",
        "type": "JsonBlob"
      },
      {
        "name": "LinuxCpuEventHub",
        "type": "EventHub",
        "sasURL": "https://youreventhubnamespace.servicebus.windows.net/youreventhubpublisher?sr=https%3a%2f%2fyoureventhubnamespace.servicebus.windows.net%2fyoureventhubpublisher%2f&sig=fake_signature&se=1808096361&skn=yourehpolicy"
      },
      {
        "name": "MyMetricEventHub",
        "type": "EventHub",
        "sasURL": "https://youreventhubnamespace.servicebus.windows.net/youreventhubpublisher?sr=https%3a%2f%2fyoureventhubnamespace.servicebus.windows.net%2fyoureventhubpublisher%2f&sig=yourehpolicy&skn=yourehpolicy"
      },
      {
        "name": "LoggingEventHub",
        "type": "EventHub",
        "sasURL": "https://youreventhubnamespace.servicebus.windows.net/youreventhubpublisher?sr=https%3a%2f%2fyoureventhubnamespace.servicebus.windows.net%2fyoureventhubpublisher%2f&sig=yourehpolicy&se=1808096361&skn=yourehpolicy"
      }
    ]
  }
}
```

### PublicConfig.json

These public settings cause LAD to:

* Upload percent-processor-time and used-disk-space metrics to the `WADMetrics*` table
* Upload messages from syslog facility "user" and severity "info" to the `LinuxSyslog*` table
* Upload raw OMI query results (PercentProcessorTime and PercentIdleTime) to the named `LinuxCPU` table
* Upload appended lines in file `/var/log/myladtestlog` to the `MyLadTestLog` table

In each case, data is also uploaded to:

* Azure Blob storage (container name is as defined in the JsonBlob sink)
* EventHubs endpoint (as specified in the EventHubs sink)

```json
{
  "StorageAccount": "yourdiagstgacct",
  "sampleRateInSeconds": 15,
  "ladCfg": {
    "diagnosticMonitorConfiguration": {
      "performanceCounters": {
        "sinks": "MyMetricEventHub,MyJsonMetricsBlob",
        "performanceCounterConfiguration": [
          {
            "unit": "Percent",
            "type": "builtin",
            "counter": "PercentProcessorTime",
            "counterSpecifier": "/builtin/Processor/PercentProcessorTime",
            "annotation": [
              {
                "locale": "en-us",
                "displayName": "Aggregate CPU %utilization"
              }
            ],
            "condition": "IsAggregate=TRUE",
            "class": "Processor"
          },
          {
            "unit": "Bytes",
            "type": "builtin",
            "counter": "UsedSpace",
            "counterSpecifier": "/builtin/FileSystem/UsedSpace",
            "annotation": [
              {
                "locale": "en-us",
                "displayName": "Used disk space on /"
              }
            ],
            "condition": "Name=\"/\"",
            "class": "Filesystem"
          }
        ]
      },
      "metrics": {
        "metricAggregation": [
          {
            "scheduledTransferPeriod": "PT1H"
          },
          {
            "scheduledTransferPeriod": "PT1M"
          }
        ],
        "resourceId": "/subscriptions/your_azure_subscription_id/resourceGroups/your_resource_group_name/providers/Microsoft.Compute/virtualMachines/your_vm_name"
      },
      "eventVolume": "Large",
      "syslogEvents": {
        "sinks": "SyslogJsonBlob,LoggingEventHub",
        "syslogEventConfiguration": {
          "LOG_USER": "LOG_INFO"
        }
      }
    }
  },
  "perfCfg": [
    {
      "query": "SELECT PercentProcessorTime, PercentIdleTime FROM SCX_ProcessorStatisticalInformation WHERE Name='_TOTAL'",
      "table": "LinuxCpu",
      "frequency": 60,
      "sinks": "LinuxCpuJsonBlob,LinuxCpuEventHub"
    }
  ],
  "fileLogs": [
    {
      "file": "/var/log/myladtestlog",
      "table": "MyLadTestLog",
      "sinks": "FilelogJsonBlob,LoggingEventHub"
    }
  ]
}
```

The `resourceId` in the configuration must match that of the VM or the virtual machine scale set.

* Azure platform metrics charting and alerting knows the resourceId of the VM you're working on. It expects to find the data for your VM using the resourceId the lookup key.
* If you use Azure autoscale, the resourceId in the autoscale configuration must match the resourceId used by LAD.
* The resourceId is built into the names of JsonBlobs written by LAD.

## Configuring and enabling the extension for Azure portal metrics charting experiences

These installation instructions and a [downloadable sample configuration](https://github.com/Azure/azure-linux-extensions/blob/master/Diagnostic/tests/lad_2_3_compatible_portal_pub_settings.json) configure LAD 3.0 to:

* capture and store the same metrics as were provided by LAD 2.3;
* capture a useful set of file system metrics, new to LAD 3.0;
* capture the default syslog collection enabled by LAD 2.3;
* enable the Azure portal experience for charting and alerting on VM metrics.

The downloadable configuration is just an example; modify it to suit your own needs.

To use this script, first install the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) and the wget command. Fill in the correct parameters on the first three lines, then execute this script as root:

```bash
# Set your Azure VM diagnostic parameters correctly below
my_resource_group=<your_azure_resource_group_name_containing_your_azure_linux_vm>
my_linux_vm=<your_azure_linux_vm_name>
my_diagnostic_storage_account=<your_azure_storage_account_for_storing_vm_diagnostic_data>

# Should login to Azure first before anything else
az login

# Get VM resource ID as well, and replace storage account name and resource ID in the public settings.
my_vm_resource_id=$(az vm show -g $my_resource_group -n $my_linux_vm --query "id" -o tsv)
wget https://github.com/Azure/azure-linux-extensions/blob/master/Diagnostic/tests/lad_2_3_compatible_portal_pub_settings.json -O portal_public_settings.json
sed -i "s#__DIAGNOSTIC_STORAGE_ACCOUNT__#$my_diagnostic_storage_account#g" portal_public_settings.json
sed -i "s#__VM_RESOURCE_ID__#$my_vm_resource_id#g" portal_public_settings.json

# Set protected settings (storage account SAS token)
my_diagnostic_storage_account_sastoken=$(az storage account generate-sas --account-name $my_diagnostic_storage_account --expiry 9999-12-31T23:59Z --permissions wlacu --resource-types co --services bt -o tsv)
my_lad_protected_settings="{'storageAccountName': '$my_diagnostic_storage_account', 'storageAccountSasToken': '$my_diagnostic_storage_account_sastoken'}"

# Finallly enable (set) the extension for the Portal metrics charts experience
az vm extension set --publisher Microsoft.Azure.Diagnostics --name LinuxDiagnostic --version 3.0 --resource-group $my_resource_group --vm-name $my_linux_vm --protected-settings "${my_lad_protected_settings}" --settings portal_public_settings.json
```

The URL and its contents are subject to change. Download a copy of the portal settings JSON file and customize it for your needs. Any templates or automation you construct should use your own copy, rather than downloading that URL each time.

### Important notes on customizing the downloaded `portal_public_settings.json`

After experimenting with the downloaded `portal_public_settings.json` configuration as is, you should customize it for your own purposes. For example, you may want to remove the entire `syslogEvents` section if you don't need to collect syslog events at all. You can also remove unneeded metrics from the `performanceCounterConfiguration` section. CPU and network resources are consumed in collecting and storing metrics and log events; collect only what you need.

## Review your data

The performance and diagnostic data are stored in an Azure Storage table by default. Azure Storage APIs are available for many languages and platforms.

If you specified JsonBlob sinks for your LAD extension configuration, then the same storage account's blob containers holds your performance and/or diagnostic data. You can consume the blob data using any Azure Blob Storage APIs.

In addition, you can use following UI tools to access the data in Azure Storage:

1. [Microsoft Azure Storage Explorer](http://storageexplorer.com/)
1. Visual Studio Server Explorer.
1. [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/ "Azure Storage Explorer").

This snapshot of a Microsoft Azure Storage Explorer session shows the generated Azure Storage tables and containers from a correctly configured LAD 3.0 extension on a test VM. The image doesn't match exactly with the [sample LAD 3.0 configuration](#An-example-LAD-3.0-configuration).

![image](./media/diagnostic-extension/stg_explorer.png)

See the relevant [EventHubs documentation](https://docs.microsoft.com/azure/event-hubs/event-hubs-what-is-event-hubs) to learn how to consume messages published to an EventHubs endpoint.
