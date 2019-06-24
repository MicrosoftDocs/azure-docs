---
title: Azure Diagnostics extension configuration schema version history
description: Relevant to collecting perf counters in Azure Virtual Machines, VM Scale Sets, Service Fabric, and Cloud Services.
services: azure-monitor
author: rboucher
ms.service: azure-monitor
ms.devlang: dotnet
ms.topic: reference
ms.date: 09/20/2018
ms.author: robb
ms.subservice: diagnostic-extension
---
# Azure Diagnostics extension configuration schema versions and history
This page indexes Azure Diagnostics extension schema versions shipped as part of the Microsoft Azure SDK.  

> [!NOTE]
> The Azure Diagnostics extension is the component used to collect performance counters and other statistics from:
> - Azure Virtual Machines
> - Virtual Machine Scale Sets
> - Service Fabric
> - Cloud Services
> - Network Security Groups
>
> This page is only relevant if you are using one of these services.

The Azure Diagnostics extension is used with other Microsoft diagnostics products like Azure Monitor, which includes Application Insights and Log Analytics. For more information, see [Microsoft Monitoring Tools Overview](../../azure-monitor/overview.md).

## Azure SDK and diagnostics versions shipping chart  

|Azure SDK version | Diagnostics extension version | Model|  
|------------------|-------------------------------|------|  
|1.x               |1.0                            |plug-in|  
|2.0 - 2.4         |1.0                            |plug-in|  
|2.5               |1.2                            |extension|  
|2.6               |1.3                            |"|  
|2.7               |1.4                            |"|  
|2.8               |1.5                            |"|  
|2.9               |1.6                            |"|
|2.96              |1.7                            |"|
|2.96              |1.8                            |"|
|2.96              |1.8.1                          |"|
|2.96              |1.9                            |"|
|2.96              |1.11                           |"|


 Azure Diagnostics version 1.0 first shipped in a plug-in model -- meaning that when you installed the Azure SDK, you got the version of Azure diagnostics shipped with it.  

 Starting with SDK 2.5 (diagnostics version 1.2), Azure diagnostics went to an extension model. The tools to utilize new features were only available in newer Azure SDKs, but any service using Azure diagnostics would pick up the latest shipping version directly from Azure. For example, anyone still using SDK 2.5 would be loading the latest version shown in the previous table, regardless if they are using the newer features.  

## Schemas index  
Different versions of Azure diagnostics use different configuration schemas.

[Diagnostics 1.0 Configuration Schema](diagnostics-extension-schema-1dot0.md)  

[Diagnostics 1.2 Configuration Schema](diagnostics-extension-schema-1dot2.md)  

[Diagnostics 1.3 and later Configuration Schema](diagnostics-extension-schema-1dot3.md)  

## Version history

### Diagnostics extension 1.11
Added support for the Azure Monitor sink. This sink is only applicable to performance counters. Enables sending performance counters collected on your VM, VMSS, or cloud service to Azure Monitor as custom metrics. The Azure Monitor sink supports:
* Retrieving all performance counters sent to Azure Monitor via the [Azure Monitor metrics APIs.](https://docs.microsoft.com/rest/api/monitor/metrics/list)
* Alerting on all performance counters sent to Azure Monitor via the new [unified alerts experience](../../azure-monitor/platform/alerts-overview.md) in Azure Monitor
* Treating wildcard operator in performance counters as the "Instance" dimension on your metric. For example if you collected the "LogicalDisk(\*)/DiskWrites/sec" counter you would be able to filter and split on the "Instance" dimension to plot or alert on the Disk Writes/sec for each Logical Disk (C:, D:, etc.)

Define Azure Monitor as a new sink in your diagnostics extension configuration
```json
"SinksConfig": {
    "Sink": [
        {
            "name": "AzureMonitorSink",
            "AzureMonitor": {}
        },
    ]
}
```

```XML
<SinksConfig>  
  <Sink name="AzureMonitorSink">
      <AzureMonitor/>
  </Sink>
</SinksConfig>
```
> [!NOTE]
> Configuring the Azure Monitor sink for Classic VMs and Classic CLoud Service requires more parameters to be defined in the Diagnostics extension's private config.
>
> For more details please reference the [detailed diagnostics extension schema documentation.](diagnostics-extension-schema-1dot3.md)

Next, you can configure your performance counters to be routed to the Azure Monitor Sink.
```json
"PerformanceCounters": {
    "scheduledTransferPeriod": "PT1M",
    "sinks": "AzureMonitorSink",
    "PerformanceCounterConfiguration": [
        {
            "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
            "sampleRate": "PT1M",
            "unit": "percent"
        }
    ]
},
```
```XML
<PerformanceCounters scheduledTransferPeriod="PT1M", sinks="AzureMonitorSink">  
  <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT1M" unit="percent" />  
</PerformanceCounters>
```

### Diagnostics extension 1.9
Added Docker support.


### Diagnostics extension 1.8.1
Can specify a SAS token instead of a storage account key in the private config. If a SAS token is provided, the storage account key is ignored.


```json
{
    "storageAccountName": "diagstorageaccount",
    "storageAccountEndPoint": "https://core.windows.net",
    "storageAccountSasToken": "{sas token}",
    "SecondaryStorageAccounts": {
        "StorageAccount": [
            {
                "name": "secondarydiagstorageaccount",
                "endpoint": "https://core.windows.net",
                "sasToken": "{sas token}"
            }
        ]
    }
}
```

```xml
<PrivateConfig>
    <StorageAccount name="diagstorageaccount" endpoint="https://core.windows.net" sasToken="{sas token}" />
    <SecondaryStorageAccounts>
        <StorageAccount name="secondarydiagstorageaccount" endpoint="https://core.windows.net" sasToken="{sas token}" />
    </SecondaryStorageAccounts>
</PrivateConfig>
```


### Diagnostics extension 1.8
Added Storage Type to PublicConfig. StorageType can be *Table*, *Blob*, *TableAndBlob*. *Table* is the default.


```json
{
    "WadCfg": {
    },
    "StorageAccount": "diagstorageaccount",
    "StorageType": "TableAndBlob"
}
```

```xml
<PublicConfig>
    <WadCfg />
    <StorageAccount>diagstorageaccount</StorageAccount>
    <StorageType>TableAndBlob</StorageType>
</PublicConfig>
```


### Diagnostics extension 1.7
Added the ability to route to EventHub.

### Diagnostics extension 1.5
Added the sinks element and the ability to send diagnostics data to [Application Insights](../../azure-monitor/app/cloudservices.md) making it easier to diagnose issues across your application as well as the system and infrastructure level.

### Azure SDK 2.6 and diagnostics extension 1.3
For Cloud Service projects in Visual Studio, the following changes were made. (These changes also apply to later versions of Azure SDK.)

* The local emulator now supports diagnostics. This change means you can collect diagnostics data and ensure your application is creating the right traces while you're developing and testing in Visual Studio. The connection string `UseDevelopmentStorage=true` enables diagnostics data collection while you're running your cloud service project in Visual Studio by using the Azure storage emulator. All diagnostics data is collected in the (Development Storage) storage account.
* The diagnostics storage account connection string (Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString) is stored once again in the service configuration (.cscfg) file. In Azure SDK 2.5 the diagnostics storage account was specified in the diagnostics.wadcfgx file.

There are some notable differences between how the connection string worked in Azure SDK 2.4 and earlier and how it works in Azure SDK 2.6 and later.

* In Azure SDK 2.4 and earlier, the connection string was used at runtime by the diagnostics plugin to get the storage account information for transferring diagnostics logs.
* In Azure SDK 2.6 and later, Visual Studio uses the diagnostics connection string to configure the diagnostics extension with the appropriate storage account information during publishing. The connection string lets you define different storage accounts for different service configurations that Visual Studio will use when publishing. However, because the diagnostics plugin is no longer available (after Azure SDK 2.5), the .cscfg file by itself can't enable the Diagnostics Extension. You have to enable the extension separately through tools such as Visual Studio or PowerShell.
* To simplify the process of configuring the diagnostics extension with PowerShell, the package output from Visual Studio also contains the public configuration XML for the diagnostics extension for each role. Visual Studio uses the diagnostics connection string to populate the storage account information present in the public configuration. The public config files are created in the Extensions folder and follow the pattern `PaaSDiagnostics.<RoleName>.PubConfig.xml`. Any PowerShell based deployments can use this pattern to map each configuration to a Role.
* The connection string in the .cscfg file is also used by the Azure portal to access the diagnostics data so it can appear in the **Monitoring** tab. The connection string is needed to configure the service to show verbose monitoring data in the portal.

#### Migrating projects to Azure SDK 2.6 and later
When migrating from Azure SDK 2.5 to Azure SDK 2.6 or later, if you had a diagnostics storage account specified in the .wadcfgx file, then it will stay there. To take advantage of the flexibility of using different storage accounts for different storage configurations, you'll have to manually add the connection string to your project. If you're migrating a project from Azure SDK 2.4 or earlier to Azure SDK 2.6, then the diagnostics connection strings are preserved. However, note the changes in how connection strings are treated in Azure SDK 2.6 as specified in the previous section.

#### How Visual Studio determines the diagnostics storage account
* If a diagnostics connection string is specified in the .cscfg file, Visual Studio uses it to configure the diagnostics extension when publishing, and when generating the public configuration xml files during packaging.
* If no diagnostics connection string is specified in the .cscfg file, then Visual Studio falls back to using the storage account specified in the .wadcfgx file to configure the diagnostics extension when publishing, and generating the public configuration xml files when packaging.
* The diagnostics connection string in the .cscfg file takes precedence over the storage account in the .wadcfgx file. If a diagnostics connection string is specified in the .cscfg file, then Visual Studio uses that and ignores the storage account in .wadcfgx.

#### What does the "Update development storage connection strings…" checkbox do?
The checkbox for **Update development storage connection strings for Diagnostics and Caching with Microsoft Azure storage account credentials when publishing to Microsoft Azure** gives you a convenient way to update any development storage account connection strings with the Azure storage account specified during publishing.

For example, suppose you select this checkbox and the diagnostics connection string specifies `UseDevelopmentStorage=true`. When you publish the project to Azure, Visual Studio will automatically update the diagnostics connection string with the storage account you specified in the Publish wizard. However, if a real storage account was specified as the diagnostics connection string, then that account is used instead.

### Diagnostics functionality differences between Azure SDK 2.4 and earlier and Azure SDK 2.5 and later
If you're upgrading your project from Azure SDK 2.4 to Azure SDK 2.5 or later, you should bear in mind the following diagnostics functionality differences.

* **Configuration APIs are deprecated** – Programmatic configuration of diagnostics is available in Azure SDK 2.4 or earlier versions, but is deprecated in Azure SDK 2.5 and later. If your diagnostics configuration is currently defined in code, you'll need to reconfigure those settings from scratch in the migrated project in order for diagnostics to keep working. The diagnostics configuration file for Azure SDK 2.4 is diagnostics.wadcfg, and diagnostics.wadcfgx for Azure SDK 2.5 and later.
* **Diagnostics for cloud service applications can only be configured at the role level, not at the instance level.**
* **Every time you deploy your app, the diagnostics configuration is updated** – This can cause parity issues if you change your diagnostics configuration from Server Explorer and then redeploy your app.
* **In Azure SDK 2.5 and later, crash dumps are configured in the diagnostics configuration file, not in code** – If you have crash dumps configured in code, you'll have to manually transfer the configuration from code to the configuration file, because the crash dumps aren't transferred during the migration to Azure SDK 2.6.

