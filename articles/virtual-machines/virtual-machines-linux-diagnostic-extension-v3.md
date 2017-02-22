---
title: Page title that displays in the browser tab and search results | Microsoft Docs
description: Article description that will be displayed on landing pages and in most search results
services: virtual-machines-linux
documentationcenter: dev-center-name
author: jasonzio
manager: anandram


ms.service: virtual-machines-linux
ms.devlang: may be required
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: required
ms.date: 02/15/2017
ms.author: jasonzio@microsoft.com

---
# Use Linux Diagnostic Extension v3 to monitor metrics and logs
## Introduction
(**Note**: The Linux Diagnostic Extension is open-sourced on [Github](https://github.com/Azure/azure-linux-extensions/tree/master/Diagnostic) where the most current information on the extension is first published. You might want to check the [Github page](https://github.com/Azure/azure-linux-extensions/tree/master/Diagnostic) first.)

The Linux Diagnostic Extension helps a user monitor the health of a Linux VM that are running on Microsoft Azure. It has the following capabilities:

* Collects system performance metrics from the VM and stores them in a table in the same storage account as the VM's boot vhd.
* Enables users to customize the data metrics that will be collected and uploaded.
* Retrieves log events from syslog and stores them in a table in the same storage account as the VM's boot vhd.
* Enables users to customize the syslog facilities and severity levels of events that will be collected and uploaded.
* Enables users to upload specified log files to a designated storage table.

This extension works with both the classic and Resource Manager deployment models.

### Migration from previous versions of the extension
The latest version of the extension is **3.0**, and **any old versions (2.x) will be deprecated and unpublished by July of 2018**.

This extension introduces breaking changes to the configuration of the extension. One such change was made to improve the security of the extension; as a result, backwards compatibility with 2.x could not be maintained. Also, the Extension Publisher for this extension is different than the publisher for the 2.x versions.

In order to migrate from 2.x to this new version of the extension, you must uninstall the old extension (under the old publisher name) and then install the new extension.

We strongly recommended you install the extension and automatic minor version upgrade enabled. On classic (ASM) VMs, you can achieve this by specifying '3.*' as the version if you are installing the extension through Azure XPLAT CLI or Powershell. On ARM VMs, you can achieve this by including '"autoUpgradeMinorVersion": true' in the VM deployment template.

## Enable the extension
You can enable this extension by using the [Azure portal](https://portal.azure.com/#), Azure PowerShell, or Azure CLI scripts.

To view and configure the system and performance data directly from the Azure portal, follow [these steps on the Azure blog](https://azure.microsoft.com/blog/2014/09/02/windows-azure-virtual-machine-monitoring-with-wad-extension/ "URL to the Windows blog"/).

This article focuses on how to enable and configure the extension by using Azure CLI commands. This allows you to read and view the data directly from the storage table.

Note that the configuration methods that are described here won't work for the Azure portal. To view and configure the system and performance data directly from the Azure portal, the extension must be enabled through the portal.

## Prerequisites
* **Azure Linux Agent version 2.0.6 or later**.
  Note that most Azure VM Linux gallery images include version 2.0.6 or later. You can run **WAAgent -version** to confirm which version is installed on the VM. If the VM is running a version that's earlier than 2.0.6, you can follow [these instructions on GitHub](https://github.com/Azure/WALinuxAgent "instructions") to update it.
* **Azure CLI**. Follow [this guidance for installing CLI](../xplat-cli-install.md) to set up the Azure CLI environment on your machine. After Azure CLI is installed, you can use the **azure** command from your command-line interface (Bash, Terminal, or command prompt) to access the Azure CLI commands. For example:
  
  * Run **azure vm extension set --help** for detailed help information.
  * Run **azure login** to sign in to Azure.
  * Run **azure vm list** to list all the virtual machines that you have on Azure.
* A storage account to store the data. You will need a storage account name that was created previously and an access key to upload the data to your storage.

## Protected Settings
This set of configuration information contains sensitive information which should be protected. These settings are transmitted to and stored by the extension in encrypted form.
```json
{
	"storageAccountName" : "the storage account to receive data",
	"storageAccountEndPoint": "the URL prefix for the cloud for this account",
	"storageAccountSasToken": "SAS access token",
	"mdsdHttpProxy": "HTTP proxy settings",
}
```
Name | Value
---- | -----
storageAccountName | The name of the storage account in which data will be written by the extension
storageAccountEndPoint | The endpoint identifying the cloud in which the storage account exists. For the Azure public cloud, this would be "https://core.windows.net"; set this appropriately for a storage account in a national cloud.
sasTableKey | An [Account SAS token](https://azure.microsoft.com/en-us/blog/sas-update-account-sas-now-supports-all-storage-services/) for Blob and Table services (ss='bt'), containers and objects (srt='co'), which grants add, create, list, update, and write permissions (sp='acluw')
mdsdHttpProxy | (optional) HTTP proxy information needed to enable the extension to connect to the specified storage account and endpoint.

## Public settings
This structure contains various blocks of settings which control the various information collected by the extension.
```json
{
    "enableSyslog": "",
    "mdsdHttpProxy" : "",
    "ladCfg":  { ... },
    "perfCfg": { ... },
    "syslogCfg": { ... },
    "fileLogs": { ... }
}
```
Element | Value
------- | -----
enableSyslog | If false, the extension will ignore all configuration elements related to syslog and will make no changes to the syslog configuration on the VM.
mdsdHttpProxy | (optional) Same as in the Private Settings (see above). The public value is overridden by the private value, if set. 

The remaining elements are described in detail, below.
### ladCfg
```json
"ladCfg": {
    "eventVolume": "Medium",
    "sinksConfig": { ... },
    "sinks": "",
    "metrics": { ... },
    "performanceCounters": { ... },
    "syslogEvents": { ... }
}
```
Controls the gathering of metrics and logs for delivery to the Azure Metrics service and to other data destinations ("sinks").

The Azure Metrics service requires metrics to be stored in a very particular Azure storage table. Similarly, log events must be stored in a different, but also very particular, table. All instances of the diagnostic extension configured (via Private Config) to use the same storage account name and endpoint will add their metrics and logs to the same table. If too many VMs are writing to the same table partition, Azure can throttle writes to that partition. The eventVolume setting changes how partition keys are constructed so that, across all instances of the extension writing to the same table, entries are spread across 1, 10, or 100 different partitions.  

The Azure Metrics service tables 

Element | Value
------- | -----
eventVolume | Controls the number of partitions created within the storage table. Must be one of "Large", "Medium", or "Small".
 
#### sinksConfig
```json
"sinksConfig": {
    "Sink": [
        {
            "name": "sinkname",
            "type": "sinktype"
        },
    ]
},
```
Defines additional destinations to which the extension will deliver the information it collects. The Sink array contains an object for each additional data sink. The object will contain additional attributes as determined by the "type" attribute.

Element | Value
------- | -----
name | A string used to refer to this sink elsewhere in the extension configuration
type | The type of sink being defined.

#### metrics
```json
"metrics": {
    "resourceId": "/subscriptions/...",
    "metricAggregation" : [
        { "scheduledTransferPeriod" : "PT1H" },
        { "scheduledTransferPeriod" : "PT1M" }
    ]
}
```

Samples of the metrics specified in the performanceCounters section are collected every 15 seconds. If multiple scheduledTransferPeriod frequencies appear (as in the example), each aggregation is computed independently. The name of the storage table to which aggregated metrics are written (and from which Acure Metrics reads data) is based, in part, on the transfer period of the aggregated metrics stored within it.


Element | Value
------- | -----
resourceId | The ARM resource ID of the VM or of the VM Scale Set to which the VM belongs.
scheduledTransferPeriod | The frequency at which aggregate metrics are to be computed and transferred to Azure Metrics, expressed as an IS 8601 time interval.

Samples of the metrics specified in the performanceCounters section are collected every 15 seconds. If multiple scheduledTransferPeriod frequencies appear (as in the example), each aggregation is computed independently. The name of the storage table to which aggregated metrics are written (and from which Acure Metrics reads data) is based, in part, on the transfer period of the aggregated metrics stored within it.

#### performanceCounters
```json
"performanceCounters": {
    "performanceCounterConfiguration": [
        {
            "type": "builtin",
            "class": "Processor",
            "counter": "PercentIdleTime",
            "counterSpecifier": "/builtin/Processor/PercentIdleTime",
            "table": "MyTableName",
            "condition": "IsAggregate=TRUE",
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
type | Identifies the actual provider of the metric.
class | Together with "counter", identifies the specific metric within the provider's namespace.
counter | Together with "class", identifies the specific metric within the provider's namespace.
counterSpecifier | Identifies the specific metric within the Azure Metrics namespace.
table | 
condition | Selects a specific instance of the object to which the metric applies or selects the aggregation across all instances of that object. See the metric definitions (below) for more information.
displayName | The label (in the language specified by the associated locale setting) to be attached to this data in Azure Metrics. 

#### syslogEvents
```json
"syslogEvents": {
    "syslogEventConfiguration": {
        "facilityName": "minSeverity",
    }
}
```
The syslogEventConfiguration collection has one entry for each syslog facility of interest. Setting a minSeverity of "NONE" for a particular facility behaves exactly as if that facility did not appear in the element at all; no events from that facility are captured. 

Element | Value
------- | -----
facilityName | A syslog facility name (e.g. "LOG_USER" or "LOG_LOCAL0"). See the "facility" section of the [syslog man page](http://man7.org/linux/man-pages/man3/syslog.3.html) for the full list.
minSeverity | A syslog severity level (e.g. "LOG_ERR") or the value "NONE". See the "level" section of the [syslog man page](http://man7.org/linux/man-pages/man3/syslog.3.html) for the full list. The extension will capture events sent to the facility at or above the specified level. If set to NONE, no log messages from the facility will be captured.

### perfCfg
Controls execution of arbitrary [OMI](https://github.com/Microsoft/omi) queries.

```
"perfCfg": [
    {
        "namespace": "root/scx",
        "query": "SELECT PercentAvailableMemory, PercentUsedSwap FROM SCX_MemoryStatisticalInformation",
        "table": "LinuxOldMemory",
        "frequency": 300
    }
]
```
Element | Value
------- | -----
namespace | (optional) The OMI namespace within which the query should be executed. If unspecified, the default value is "root/scx", implemented by the [System Center Cross-platform Providers](http://scx.codeplex.com/wikipage?title=xplatproviders&referringTitle=Documentation).  
query | The OMI query to be executed.
table | The Azure storage table into which the results of the query will be placed.
frequency | (optional) The number of seconds between execution of the query. Default value is 300 (5 minutes); a value less than 15 will be treated as 15 seconds.

### syslogCfg
Controls the delivery of syslog events to the specified Azure storage table within the account identified by the Private Config. Log entries captured to these tables are not processed by any other component of Azure; you would use this feature only if you had tools of your own which expected to see this data in this manner.
 
```json
"syslogCfg": [
    {
        "facility": "LOG_USER",
        "minSeverity": "LOG_ERR",
        "table": "SyslogAuthEvents"
    },
]
```
Element | Value
------- | -----
facility | A syslog facility name. See the "facility" section of the [syslog man page](http://man7.org/linux/man-pages/man3/syslog.3.html) for the full list.
minSeverity | A syslog severity level. See the "level" section of the [syslog man page](http://man7.org/linux/man-pages/man3/syslog.3.html) for the full list.
### fileLogs
Controls the capture of log files by rsyslogd. As new text lines are written to the file, rsyslogd captures them and passes them to the diagnostic extension, which in turn writes them as table rows.
```json
"fileLogs": {
    "fileLogConfiguration": [
        {
            "file": "/var/log/mydaemonlog",
            "table": "MyDaemonEvents"
        }
    ]
}
```
Element | Value
------- | -----
file | The full pathname of the log file to be watched and captured.
table | The Azure storage table into which the results of the query will be placed.

## Metrics supported by "builtin"
The "builtin" metric provider is a source of metrics most interesting to a broad set of users. These metrics fall into five broad classes:
- Processor
- Memory
- Network
- Filesystem
- Disk

The available metrics are described in greater detail in the following sections.

### Builtin metrics for the Processor class
The Processor class of metrics provide information about processor usage in the VM. When aggregating percentages, the result is the average across all CPUs. For example, given a VM with two cores, if one core was 100% busy for a given aggregation window and the other core was 100% idle, the reported PercentIdleTime would be 50; if each core was 50% busy for the same period, the reported result would also be 50. In a four core system, with one core 100% busy and the others completely idle, the reported PercentIdleTime would be 75.

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

To obtain a single metric aggregated across all processors, set "condition" to "IsAggregate=TRUE". To obtain a metric for a specific processor, set "condition" to "Name=\\"*nn*\\"" where *nn* is the logical processor number as known to the operating system, typically in the range 0..*n-1*.

### Builtin metrics for the Memory class
The Memory class of metrics provide information about memory utilization, paging, and swapping.

counter | Meaning
------- | -------
AvailableMemory | Available physical memory in MiB
PercentAvailableMemory | Available physical memory as a percent of total memory
UsedMemory | In-use physical memory (MiB)
PercentUsedMemory | In-use physical memory as a percent of total memory
PagesPerSec | Total paging (read/write)
PagesReadPerSec | Pages read from backing store (pagefile, program file, mapped file, etc)
PagesWrittenPerSec | Pages written to backing store (pagefile, mapped file, etc)
AvailableSwap | Unused swap space (MiB)
PercentAvailableSwap | Unused swap space as a percentage of total swap
UsedSwap | In-use swap space (MiB)
PercentUsedSwap | In-use swap space as a percentage of total swap

This family of metrics has only a single instance; the "condition" attribute has no useful settings and should be omitted.
### Builtin metrics for the Network class
The Network class of metrics provide information about network activity, aggregated across all network devices (eth0, eth1, etc.) since boot. Bandwidth information is not directly available; it can be computed, of course, but this is probably better retrieved from host metrics rather than from within the guest.

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

This family of metrics has only a single instance; the "condition" attribute has no useful settings and should be omitted.
### Builtin metrics for the Filesystem class
The Filesystem class of metrics provide information about filesystem usage. Absolute and percentage values are reported as they'd be displayed to an ordinary user (not root).

counter | Meaning
------- | -------
FreeMegabytes | Available disk space in MiB
UsedMegabytes | Used disk space in MiB
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

Aggregated values across all file systems can be obtained by setting "condition" to "IsAggregate=True". Values for a specific mounted file system can be obtained by setting "condition" to "Name=\\"*mountpoint*\\"" where *mountpoint* is the path at which the filesystem was mounted ("/", "/mnt", etc.).

### Builtin metrics for the Disk class
The Disk class of metrics provide information about disk device usage. These statistics apply to the drive itself without regard to the number of file systems that may exist on the device; if there are multiple file systems on a device, the counters for that device are, effectively, aggregated across of them.

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

Aggregated values across all disks can be obtained by setting "condition" to "IsAggregate=True". Values for a specific disk device can be obtained by setting "condition" to "Name=\\"*devicename*\\"" where *devicename* is the path of the device file for the disk ("/dev/sda1", "/dev/sdb1", etc.).

## Scenario - Customize the performance monitor metrics
This section describes how to customize the performance and diagnostic data table.

Step 1. Create a file named PrivateConfig.json with the content that was described in Scenario 1. Also create a file named PublicConfig.json. Specify the particular data you want to collect.

For all supported providers and variables, reference the [System Center Cross Platform Solutions site](https://scx.codeplex.com/wikipage?title=xplatproviders). You can have multiple queries and store them in multiple tables by appending more queries to the script.

By default, the Rsyslog data is always collected.

    {
          "perfCfg":
          [
              {
                  "query" : "SELECT PercentAvailableMemory, AvailableMemory, UsedMemory ,PercentUsedSwap FROM SCX_MemoryStatisticalInformation",
                  "table" : "LinuxMemory"
              }
          ]
    }


Step 2. Run **azure vm extension set vm_name LinuxDiagnostic Microsoft.OSTCExtensions '2.*'
--private-config-path PrivateConfig.json --public-config-path PublicConfig.json**.

## Scenario - Upload your own log files
This section describes how to collect and upload specific log files to your storage account. You need to specify both the path to your log file and the name of the table where you want to store your log. You can create multiple log files by adding multiple file/table entries to the script.

Step 1. Create a file named PrivateConfig.json with the content that was described in Scenario 1. Then create another file named PublicConfig.json with the following content:

    {
        "fileCfg" :
        [
            {
                "file" : "/var/log/mysql.err",
                "table" : "mysqlerr"
             }
        ]
    }


Step 2. Run **azure vm extension set vm_name LinuxDiagnostic Microsoft.OSTCExtensions '2.*'
--private-config-path PrivateConfig.json --public-config-path PublicConfig.json**.

Note that with this setting on the extension versions prior to 2.3, all logs written to `/var/log/mysql.err` might be duplicated to `/var/log/syslog` (or `/var/log/messages` depending on the Linux distro) as well. If you'd like to avoid this duplicate logging, you can exclude logging of `local6` facility logs in your rsyslog configuration. It depends on the Linux distro, but on an Ubuntu 14.04 system, the file to modify is `/etc/rsyslog.d/50-default.conf` and you can replace the line `*.*;auth,authpriv.none -/var/log/syslog` to `*.*;auth,authpriv,local6.none -/var/log/syslog`. This issue is fixed in the latest hotfix release of 2.3 (2.3.9007), so if you have the extension version 2.3, this issue should not happen. If it still does even after restarting your VM, please contact us and help us troubleshoot why the latest hotfix version is not installed automatically.

## Scenario - Stop the extension from collecting any logs
This section describes how to stop the extension from collecting logs. Note that the monitoring agent process will be still up and running even with this reconfiguration. If you'd like to stop the monitoring agent process completely, you can do so by disabling the extension. The command to disable the extension is **azure vm extension set --disable <vm_name> LinuxDiagnostic Microsoft.OSTCExtensions '2.*'**.

Step 1. Create a file named PrivateConfig.json with the content that was described in Scenario 1. Create another file named PublicConfig.json with the following content:

    {
        "perfCfg" : [],
        "enableSyslog" : "false"
    }


Step 2. Run **azure vm extension set vm_name LinuxDiagnostic Microsoft.OSTCExtensions '2.*'
--private-config-path PrivateConfig.json --public-config-path PublicConfig.json**.

## Review your data
The performance and diagnostic data are stored in an Azure Storage table. Review [How to use Azure Table Storage from Ruby](../storage/storage-ruby-how-to-use-table-storage.md) to learn how to access the data in the storage table by using Azure CLI scripts.

In addition, you can use following UI tools to access the data:

1. Visual Studio Server Explorer. Go to your storage account. After the VM runs for about five minutes, you'll see the four default tables: “LinuxCpu”, ”LinuxDisk”, ”LinuxMemory”, and ”Linuxsyslog”. Double-click the table names to view the data.
2. [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/ "Azure Storage Explorer").

![image](./media/virtual-machines-linux-classic-diagnostic-extension/no1.png)

If you've enabled fileCfg or perfCfg (as described in Scenarios 2 and 3), you can use Visual Studio Server Explorer and Azure Storage Explorer to view non-default data.


