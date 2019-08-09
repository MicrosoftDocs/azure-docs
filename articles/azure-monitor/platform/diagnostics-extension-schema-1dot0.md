---
title: Azure Diagnostics 1.0 Configuration Schema
description: ONLY relevant if you are using Azure SDK 2.4 and below with Azure Virtual Machines, Virtual Machine Scale Sets, Service Fabric, or Cloud Services.
services: azure-monitor
author: rboucher
ms.service: azure-monitor
ms.devlang: dotnet
ms.topic: reference
ms.date: 05/15/2017
ms.author: robb
ms.subservice: diagnostic-extension
---
# Azure Diagnostics 1.0 Configuration Schema
> [!NOTE]
> Azure Diagnostics is the component used to collect performance counters and other statistics from Azure Virtual Machines, Virtual Machine Scale Sets, Service
> Fabric, and Cloud Services.  This page is only relevant if you are using one of these services.
>

Azure Diagnostics is used with other Microsoft diagnostics products like Azure Monitor, which includes Application Insights and Log Analytics.

The Azure Diagnostics configuration file defines values that are used to initialize the Diagnostics Monitor. This file is used to initialize diagnostic configuration settings when the diagnostics monitor starts.  

 By default, the Azure Diagnostics configuration schema file is installed to the `C:\Program Files\Microsoft SDKs\Azure\.NET SDK\<version>\schemas` directory. Replace `<version>` with the installed version of the [Azure SDK](https://www.windowsazure.com/develop/downloads/).  

> [!NOTE]
>  The diagnostics configuration file is typically used with startup tasks that require diagnostic data to be collected earlier in the startup process. For more information about using Azure Diagnostics, see [Collect Logging Data by Using Azure Diagnostics](assetId:///83a91c23-5ca2-4fc9-8df3-62036c37a3d7).  

## Example of the diagnostics configuration file  
 The following example shows a typical diagnostics configuration file:  

```xml  
<?xml version="1.0" encoding="utf-8"?>
<DiagnosticMonitorConfiguration xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration"  
      configurationChangePollInterval="PT1M"  
      overallQuotaInMB="4096">  
   <DiagnosticInfrastructureLogs bufferQuotaInMB="1024"  
      scheduledTransferLogLevelFilter="Verbose"  
      scheduledTransferPeriod="PT1M" />  
   <Logs bufferQuotaInMB="1024"  
      scheduledTransferLogLevelFilter="Verbose"  
      scheduledTransferPeriod="PT1M" />  

   <Directories bufferQuotaInMB="1024"   
      scheduledTransferPeriod="PT1M">  

      <!-- These three elements specify the special directories   
           that are set up for the log types -->  
      <CrashDumps container="wad-crash-dumps" directoryQuotaInMB="256" />  
      <FailedRequestLogs container="wad-frq" directoryQuotaInMB="256" />  
      <IISLogs container="wad-iis" directoryQuotaInMB="256" />  

      <!-- For regular directories the DataSources element is used -->  
      <DataSources>  
         <DirectoryConfiguration container="wad-panther" directoryQuotaInMB="128">  
            <!-- Absolute specifies an absolute path with optional environment expansion -->  
            <Absolute expandEnvironment="true" path="%SystemRoot%\system32\sysprep\Panther" />  
         </DirectoryConfiguration>  
         <DirectoryConfiguration container="wad-custom" directoryQuotaInMB="128">  
            <!-- LocalResource specifies a path relative to a local   
                 resource defined in the service definition -->  
            <LocalResource name="MyLoggingLocalResource" relativePath="logs" />  
         </DirectoryConfiguration>  
      </DataSources>  
   </Directories>  

   <PerformanceCounters bufferQuotaInMB="512" scheduledTransferPeriod="PT1M">  
      <!-- The counter specifier is in the same format as the imperative   
           diagnostics configuration API -->  
      <PerformanceCounterConfiguration   
         counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT5S" />  
   </PerformanceCounters>  

   <WindowsEventLog bufferQuotaInMB="512"  
      scheduledTransferLogLevelFilter="Verbose"  
      scheduledTransferPeriod="PT1M">  
      <!-- The event log name is in the same format as the imperative   
           diagnostics configuration API -->  
      <DataSource name="System!*" />  
   </WindowsEventLog>  
</DiagnosticMonitorConfiguration>  
```  

## DiagnosticsConfiguration Namespace  
 The XML namespace for the diagnostics configuration file is:  

```  
http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration  
```  

## Schema Elements  
 The diagnostics configuration file includes the following elements.


## DiagnosticMonitorConfiguration Element  
The top-level element of the diagnostics configuration file.  

Attributes:

|Attribute  |Type   |Required| Default | Description|  
|-----------|-------|--------|---------|------------|  
|**configurationChangePollInterval**|duration|Optional | PT1M| Specifies the interval at which the diagnostic monitor polls for diagnostic configuration changes.|  
|**overallQuotaInMB**|unsignedInt|Optional| 4000 MB. If you provide a value, it must not exceed this amount |The total amount of file system storage allocated for all logging buffers.|  

## DiagnosticInfrastructureLogs Element  
Defines the buffer configuration for the logs that are generated by the underlying diagnostics infrastructure.

Parent Element: DiagnosticMonitorConfiguration Element.  

Attributes:

|Attribute|Type|Description|  
|---------|----|-----------------|  
|**bufferQuotaInMB**|unsignedInt|Optional. Specifies the maximum amount of file system storage that is available for the specified data.<br /><br /> The default is 0.|  
|**scheduledTransferLogLevelFilter**|string|Optional. Specifies the minimum severity level for log entries that are transferred. The default value is **Undefined**. Other possible values are **Verbose**, **Information**, **Warning**, **Error**, and **Critical**.|  
|**scheduledTransferPeriod**|duration|Optional. Specifies the interval between scheduled transfers of data, rounded up to the nearest minute.<br /><br /> The default is PT0S.|  

## Logs Element  
 Defines the buffer configuration for basic Azure logs.

 Parent element: DiagnosticMonitorConfiguration Element.  

Attributes:  

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**bufferQuotaInMB**|unsignedInt|Optional. Specifies the maximum amount of file system storage that is available for the specified data.<br /><br /> The default is 0.|  
|**scheduledTransferLogLevelFilter**|string|Optional. Specifies the minimum severity level for log entries that are transferred. The default value is **Undefined**. Other possible values are **Verbose**, **Information**, **Warning**, **Error**, and **Critical**.|  
|**scheduledTransferPeriod**|duration|Optional. Specifies the interval between scheduled transfers of data, rounded up to the nearest minute.<br /><br /> The default is PT0S.|  

## Directories Element  
Defines the buffer configuration for file-based logs that you can define.

Parent element: DiagnosticMonitorConfiguration Element.  


Attributes:  

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**bufferQuotaInMB**|unsignedInt|Optional. Specifies the maximum amount of file system storage that is available for the specified data.<br /><br /> The default is 0.|  
|**scheduledTransferPeriod**|duration|Optional. Specifies the interval between scheduled transfers of data, rounded up to the nearest minute.<br /><br /> The default is PT0S.|  

## CrashDumps Element  
 Defines the crash dumps directory.

 Parent Element: Directories Element.  

Attributes:  

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**container**|string|The name of the container where the contents of the directory is to be transferred.|  
|**directoryQuotaInMB**|unsignedInt|Optional. Specifies the maximum size of the directory in megabytes.<br /><br /> The default is 0.|  

## FailedRequestLogs Element  
 Defines the failed request log directory.

 Parent Element Directories Element.  

Attributes:  

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**container**|string|The name of the container where the contents of the directory is to be transferred.|  
|**directoryQuotaInMB**|unsignedInt|Optional. Specifies the maximum size of the directory in megabytes.<br /><br /> The default is 0.|  

##  IISLogs Element  
 Defines the IIS log directory.

 Parent Element Directories Element.  

Attributes:  

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**container**|string|The name of the container where the contents of the directory is to be transferred.|  
|**directoryQuotaInMB**|unsignedInt|Optional. Specifies the maximum size of the directory in megabytes.<br /><br /> The default is 0.|  

## DataSources Element  
 Defines zero or more additional log directories.

 Parent Element: Directories Element.

## DirectoryConfiguration Element  
 Defines the directory of log files to monitor.

 Parent Element: DataSources Element.

Attributes:

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**container**|string|The name of the container where the contents of the directory is to be transferred.|  
|**directoryQuotaInMB**|unsignedInt|Optional. Specifies the maximum size of the directory in megabytes.<br /><br /> The default is 0.|  

## Absolute Element  
 Defines an absolute path of the directory to monitor with optional environment expansion.

 Parent Element: DirectoryConfiguration Element.  

Attributes:  

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**path**|string|Required. The absolute path to the directory to monitor.|  
|**expandEnvironment**|boolean|Required. If set to **true**, environment variables in the path are expanded.|  

## LocalResource Element  
 Defines a path relative to a local resource defined in the service definition.

 Parent Element: DirectoryConfiguration Element.  

Attributes:  

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**name**|string|Required. The name of the local resource that contains the directory to monitor.|  
|**relativePath**|string|Required. The path relative to the local resource to monitor.|  

## PerformanceCounters Element  
 Defines the path to the performance counter to collect.

 Parent Element: DiagnosticMonitorConfiguration Element.


 Attributes:  

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**bufferQuotaInMB**|unsignedInt|Optional. Specifies the maximum amount of file system storage that is available for the specified data.<br /><br /> The default is 0.|  
|**scheduledTransferPeriod**|duration|Optional. Specifies the interval between scheduled transfers of data, rounded up to the nearest minute.<br /><br /> The default is PT0S.|  

## PerformanceCounterConfiguration Element  
 Defines the performance counter to collect.

 Parent Element: PerformanceCounters Element.  

 Attributes:  

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**counterSpecifier**|string|Required. The path to the performance counter to collect.|  
|**sampleRate**|duration|Required. The rate at which the performance counter should be collected.|  

## WindowsEventLog Element  
 Defines the event logs to monitor.

 Parent Element: DiagnosticMonitorConfiguration Element.

  Attributes:

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**bufferQuotaInMB**|unsignedInt|Optional. Specifies the maximum amount of file system storage that is available for the specified data.<br /><br /> The default is 0.|  
|**scheduledTransferLogLevelFilter**|string|Optional. Specifies the minimum severity level for log entries that are transferred. The default value is **Undefined**. Other possible values are **Verbose**, **Information**, **Warning**, **Error**, and **Critical**.|  
|**scheduledTransferPeriod**|duration|Optional. Specifies the interval between scheduled transfers of data, rounded up to the nearest minute.<br /><br /> The default is PT0S.|  

## DataSource Element  
 Defines the event log to monitor.

 Parent Element: WindowsEventLog Element.  

 Attributes:

|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**name**|string|Required. An XPath expression specifying the log to collect.|  

