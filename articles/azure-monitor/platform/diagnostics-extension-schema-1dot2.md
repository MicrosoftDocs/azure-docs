---
title: Azure Diagnostics extension 1.2 Configuration Schema
description: ONLY relevant if you are using Azure SDK 2.5 with Azure Virtual Machines, Virtual Machine Scale Sets, Service Fabric, or Cloud Services.
services: azure-monitor
author: rboucher
ms.service: azure-monitor
ms.devlang: dotnet
ms.topic: reference
ms.date: 05/15/2017
ms.author: robb
ms.subservice: diagnostic-extension
---
# Azure Diagnostics 1.2 configuration schema
> [!NOTE]
> Azure Diagnostics is the component used to collect performance counters and other statistics from Azure Virtual Machines, Virtual Machine Scale Sets, Service
> Fabric, and Cloud Services.  This page is only relevant if you are using one of these services.
>

Azure Diagnostics is used with other Microsoft diagnostics products like Azure Monitor, which includes Application Insights and Log Analytics.

This schema defines the possible values you can use to initialize diagnostic configuration settings when the diagnostics monitor starts.  


 Download the public configuration file schema definition by executing the following PowerShell command:  

```powershell  
(Get-AzureServiceAvailableExtension -ExtensionName 'PaaSDiagnostics' -ProviderNamespace 'Microsoft.Azure.Diagnostics').PublicConfigurationSchema | Out-File –Encoding utf8 -FilePath 'C:\temp\WadConfig.xsd'  
```  

 For more information about using Azure Diagnostics, see [Enabling Diagnostics in Azure Cloud Services](https://azure.microsoft.com/documentation/articles/cloud-services-dotnet-diagnostics/).  

## Example of the diagnostics configuration file  
 The following example shows a typical diagnostics configuration file:  

```xml
<?xml version="1.0" encoding="utf-8"?>  
<PublicConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">  
  <WadCfg>  
    <DiagnosticMonitorConfiguration overallQuotaInMB="10000">  
      <PerformanceCounters scheduledTransferPeriod="PT1M">  
        <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT1M" unit="percent" />  
      </PerformanceCounters>  
      <Directories scheduledTransferPeriod="PT5M">  
        <IISLogs containerName="iislogs" />  
        <FailedRequestLogs containerName="iisfailed" />  
        <DataSources>  
          <DirectoryConfiguration containerName="mynewprocess">  
            <Absolute path="C:\MyNewProcess" expandEnvironment="false" />  
          </DirectoryConfiguration>  
          <DirectoryConfiguration containerName="badapp">  
            <Absolute path="%SYSTEMDRIVE%\BadApp" expandEnvironment="true" />  
          </DirectoryConfiguration>  
          <DirectoryConfiguration containerName="goodapp">  
            <LocalResource name="Skippy" relativePath="..\PeanutButter"/>  
          </DirectoryConfiguration>  
        </DataSources>  
      </Directories>  
      <EtwProviders>  
        <EtwEventSourceProviderConfiguration provider="MyProviderClass" scheduledTransferPeriod="PT5M">  
          <Event id="0"/>  
          <Event id="1" eventDestination="errorTable"/>  
          <DefaultEvents />  
        </EtwEventSourceProviderConfiguration>  
        <EtwManifestProviderConfiguration provider="5974b00b-84c2-44bc-9e58-3a2451b4e3ad" scheduledTransferLogLevelFilter="Information" scheduledTransferPeriod="PT2M">  
          <Event id="0"/>  
          <DefaultEvents eventDestination="defaultTable"/>  
        </EtwManifestProviderConfiguration>  
      </EtwProviders>  
      <WindowsEventLog scheduledTransferPeriod="PT5M">  
        <DataSource name="System!*[System[Provider[@Name='Microsoft Antimalware']]]"/>  
        <DataSource name="System!*[System[Provider[@Name='NTFS'] and (EventID=55)]]" />  
        <DataSource name="System!*[System[Provider[@Name='disk'] and (EventID=7 or EventID=52 or EventID=55)]]" />  
      </WindowsEventLog>  
      <CrashDumps containerName="wad-crashdumps" directoryQuotaPercentage="30" dumpType="Mini">  
        <CrashDumpConfiguration processName="mynewprocess.exe" />  
        <CrashDumpConfiguration processName="badapp.exe"/>  
      </CrashDumps>  
    </DiagnosticMonitorConfiguration>  
  </WadCfg>  
</PublicConfig>  

```  

## Diagnostics Configuration Namespace  
 The XML namespace for the diagnostics configuration file is:  

```  
http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration  
```  

## PublicConfig Element  
 Top-level element of the diagnostics configuration file. The following table describes the elements of the configuration file.  

|Element Name|Description|  
|------------------|-----------------|  
|**WadCfg**|Required. Configuration settings for the telemetry data to be collected.|  
|**StorageAccount**|The name of the Azure Storage account to store the data in. This may also be specified as a parameter when executing the Set-AzureServiceDiagnosticsExtension cmdlet.|  
|**LocalResourceDirectory**|The directory on the virtual machine to be used by the Monitoring Agent to store event data. If not set, the default directory is used:<br /><br /> For a Worker/web role: `C:\Resources\<guid>\directory\<guid>.<RoleName.DiagnosticStore\`<br /><br /> For a Virtual Machine: `C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<WADVersion>\WAD<WADVersion>`<br /><br /> Required attributes are:<br /><br /> -                      **path** - The directory on the system to be used by Azure Diagnostics.<br /><br /> -                      **expandEnvironment** - Controls whether environment variables are expanded in the path name.|  

## WadCFG Element  
Defines configuration settings for the telemetry data to be collected. The following table describes child elements:  

|Element name|Description|  
|------------------|-----------------|  
|**DiagnosticMonitorConfiguration**|Required. Optional attributes are:<br /><br /> -                     **overallQuotaInMB** - The maximum amount of local disk space that may be consumed by the various types of diagnostic data collected by Azure Diagnostics. The default setting is 5120MB.<br /><br /> -                     **useProxyServer** - Configure Azure Diagnostics to use the proxy server settings as set in IE settings.|  
|**CrashDumps**|Enable collection of crash dumps. Optional attributes are:<br /><br /> -                     **containerName** - The name of the blob container in your Azure Storage account to be used to store crash dumps.<br /><br /> -                     **crashDumpType** - Configures Azure Diagnostics to collect Mini or Full crash dumps.<br /><br /> -                     **directoryQuotaPercentage**- Configures the percentage of **overallQuotaInMB** to be reserved for crash dumps on the VM.|  
|**DiagnosticInfrastructureLogs**|Enable collection of logs generated by Azure Diagnostics. The diagnostic infrastructure logs are useful for troubleshooting the diagnostics system itself. Optional attributes are:<br /><br /> -                     **scheduledTransferLogLevelFilter** - Configures the minimum severity level of the logs collected.<br /><br /> -                     **scheduledTransferPeriod** - The interval between scheduled transfers to storage rounded up to the nearest minute. The value is an [XML “Duration Data Type.”](https://www.w3schools.com/xml/schema_dtypes_date.asp)|  
|**Directories**|Enables the collection of the contents of a directory, IIS failed access request logs and/or IIS logs. Optional attribute:<br /><br /> **scheduledTransferPeriod** - The interval between scheduled transfers to storage rounded up to the nearest minute. The value is an [XML “Duration Data Type.”](https://www.w3schools.com/xml/schema_dtypes_date.asp)|  
|**EtwProviders**|Configures collection of ETW events from EventSource and/or ETW Manifest based providers.|  
|**Metrics**|This element enables you to generate a performance counter table that is optimized for fast queries. Each performance counter that is defined in the **PerformanceCounters** element is stored in the Metrics table in addition to the Performance Counter table. Required attribute:<br /><br /> **resourceId** - This is the resource ID of the Virtual Machine you are deploying Azure Diagnostics to. Get the **resourceID** from the [Azure portal](https://portal.azure.com). Select **Browse** -> **Resource Groups** -> **<Name\>**. Click the **Properties** tile and copy the value from the **ID** field.|  
|**PerformanceCounters**|Enables the collection of performance counters. Optional attribute:<br /><br /> **scheduledTransferPeriod** - The interval between scheduled transfers to storage rounded up to the nearest minute. Value is an [XML “Duration Data Type”.](https://www.w3schools.com/xml/schema_dtypes_date.asp)|  
|**WindowsEventLog**|Enables the collection of Windows Event Logs. Optional attribute:<br /><br /> **scheduledTransferPeriod** - The interval between scheduled transfers to storage rounded up to the nearest minute. Value is an [XML “Duration Data Type”.](https://www.w3schools.com/xml/schema_dtypes_date.asp)|  

## CrashDumps Element  
 Enables collection of crash dumps. The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**CrashDumpConfiguration**|Required. Required attribute:<br /><br /> **processName** - The name of the process you want Azure Diagnostics to collect a crash dump for.|  
|**crashDumpType**|Configures Azure Diagnostics to collect mini or full crash dumps.|  
|**directoryQuotaPercentage**|Configures the percentage of **overallQuotaInMB** to be reserved for crash dumps on the VM.|  

## Directories Element  
 Enables the collection of the contents of a directory, IIS failed access request logs and/or IIS logs. The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**DataSources**|A list of directories to monitor.|  
|**FailedRequestLogs**|Including this element in the configuration enables collection of logs about failed requests to an IIS site or application. You must also enable tracing options under **system.WebServer** in **Web.config**.|  
|**IISLogs**|Including this element in the configuration enables the collection of IIS logs:<br /><br /> **containerName** - The name of the blob container in your Azure Storage account to be used to store the IIS logs.|  

## DataSources Element  
 A list of directories to monitor. The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**DirectoryConfiguration**|Required. Required attribute:<br /><br /> **containerName** - The name of the blob container in your Azure Storage account to be used to store the log files.|  

## DirectoryConfiguration Element  
 **DirectoryConfiguration** may include either the **Absolute** or **LocalResource** element but not both. The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**Absolute**|The absolute path to the directory to monitor. The following attributes are required:<br /><br /> -                     **Path** - The absolute path to the directory to monitor.<br /><br /> -                      **expandEnvironment** - Configures whether environment variables in Path are expanded.|  
|**LocalResource**|The path relative to a local resource to monitor. Required attributes are:<br /><br /> -                     **Name** - The local resource that contains the directory to monitor<br /><br /> -                     **relativePath** - The path relative to Name that contains the directory to monitor|  

## EtwProviders Element  
 Configures collection of ETW events from EventSource and/or ETW Manifest based providers. The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**EtwEventSourceProviderConfiguration**|Configures collection of events generated from [EventSource Class](https://msdn.microsoft.com/library/system.diagnostics.tracing.eventsource\(v=vs.110\).aspx). Required attribute:<br /><br /> **provider** - The class name of the EventSource event.<br /><br /> Optional attributes are:<br /><br /> -                     **scheduledTransferLogLevelFilter** - The minimum severity level to transfer to your storage account.<br /><br /> -                     **scheduledTransferPeriod** - The interval between scheduled transfers to storage rounded up to the nearest minute. Value is an [XML Duration Data Type](https://www.w3schools.com/xml/schema_dtypes_date.asp).|  
|**EtwManifestProviderConfiguration**|Required attribute:<br /><br /> **provider** - The GUID of the event provider<br /><br /> Optional attributes are:<br /><br /> - **scheduledTransferLogLevelFilter** - The minimum severity level to transfer to your storage account.<br /><br /> -                     **scheduledTransferPeriod** - The interval between scheduled transfers to storage rounded up to the nearest minute. Value is an [XML Duration Data Type](https://www.w3schools.com/xml/schema_dtypes_date.asp).|  

## EtwEventSourceProviderConfiguration Element  
 Configures collection of events generated from [EventSource Class](https://msdn.microsoft.com/library/system.diagnostics.tracing.eventsource\(v=vs.110\).aspx). The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**DefaultEvents**|Optional attribute:<br /><br /> **eventDestination** - The name of the table to store the events in|  
|**Event**|Required attribute:<br /><br /> **id** - The id of the event.<br /><br /> Optional attribute:<br /><br /> **eventDestination** - The name of the table to store the events in|  

## EtwManifestProviderConfiguration Element  
 The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**DefaultEvents**|Optional attribute:<br /><br /> **eventDestination** - The name of the table to store the events in|  
|**Event**|Required attribute:<br /><br /> **id** - The id of the event.<br /><br /> Optional attribute:<br /><br /> **eventDestination** - The name of the table to store the events in|  

## Metrics Element  
 Enables you to generate a performance counter table that is optimized for fast queries. The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**MetricAggregation**|Required attribute:<br /><br /> **scheduledTransferPeriod** - The interval between scheduled transfers to storage rounded up to the nearest minute. Value is an [XML Duration Data Type](https://www.w3schools.com/xml/schema_dtypes_date.asp).|  

## PerformanceCounters Element  
 Enables the collection of performance counters. The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**PerformanceCounterConfiguration**|The following attributes are required:<br /><br /> -                     **counterSpecifier** - The name of the performance counter. For example, `\Processor(_Total)\% Processor Time`. To get a list of performance counters on your host run the command `typeperf`.<br /><br /> -                     **sampleRate** - How often the counter should be sampled.<br /><br /> Optional attribute:<br /><br /> **unit** - The unit of measure of the counter.|  

## PerformanceCounterConfiguration Element  
 The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**annotation**|Required attribute:<br /><br /> **displayName** - The display name for the counter<br /><br /> Optional attribute:<br /><br /> **locale** - The locale to use when displaying the counter name|  

## WindowsEventLog Element  
 The following table describes child elements:  

|Element Name|Description|  
|------------------|-----------------|  
|**DataSource**|The Windows Event logs to collect. Required attribute:<br /><br /> **name** - The XPath query describing the windows events to be collected. For example:<br /><br /> `Application!*[System[(Level >= 3)]], System!*[System[(Level <=3)]], System!*[System[Provider[@Name='Microsoft Antimalware']]], Security!*[System[(Level >= 3]]`<br /><br /> To collect all events, specify “*”.|

