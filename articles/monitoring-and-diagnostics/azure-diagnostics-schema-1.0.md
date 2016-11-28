---
title: Azure Diagnostics 1.0 Configuration Schema | Microsoft Docs
description: Schema version 1.0 for Azure diagnostics shipped as part of the Microsoft Azure SDK.
services: multiple
documentationcenter: .net
author: rboucher
manager: ''
editor: ''

ms.assetid: 
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 11/25/2016
ms.author: robb

---
The Azure Diagnostics configuration file defines values that are used to initialize the Diagnostics Monitor. This file is used to initialize diagnostic configuration settings when the diagnostics monitor starts.  
  
 By default, the Azure Diagnostics configuration schema file is installed to the `C:\Program Files\Microsoft SDKs\Azure\.NET SDK\<version>\schemas` directory. Replace `<version>` with the installed version of the [Azure SDK](http://www.windowsazure.com/develop/downloads/).  
  
> [!NOTE]
>  The diagnostics configuration file is typically used with startup tasks that require diagnostic data to be collected earlier in the startup process. For more information about using Azure Diagnostics, see [Collect Logging Data by Using Azure Diagnostics](assetId:///83a91c23-5ca2-4fc9-8df3-62036c37a3d7).  
  
## Example of the diagnostics configuration file  
 The following example shows a typical diagnostics configuration file:  
  
```  
  
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
 The diagnostics configuration file includes the following elements:  
  
 [DiagnosticMonitorConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DiagnosticMonitorConfiguration)  
  
 [DiagnosticInfrastructureLogs Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DiagnosticInfrastructureLogs)  
  
 [Logs Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_Logs)  
  
 [Directories Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_Directories)  
  
 [CrashDumps Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_CrashDumps)  
  
 [FailedRequestLogs Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_FailedRequestLogs)  
  
 [IISLogs Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_IISLogs)  
  
 [DataSources Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DataSources)  
  
 [DirectoryConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DirectoryConfiguration)  
  
 [Absolute Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_Absolute)  
  
 [LocalResource Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_LocalResource)  
  
 [PerformanceCounters Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_PerformanceCounters)  
  
 [PerformanceCounterConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_PerformanceCounterConfiguration)  
  
 [WindowsEventLog Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_windowsEventLog)  
  
 [DataSource Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DataSource)  
  
## DiagnosticMonitorConfiguration Element  
 The **DiagnosticMonitorConfiguration** element is the top-level element of the diagnostics configuration file.  
  
 The following table describes the attributes of the **DiagnosticMonitorConfiguration** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**configurationChangePollInterval**|**duration**|Optional. Specifies the interval at which the diagnostic monitor polls for diagnostic configuration changes.<br /><br /> The default is PT1M.|  
|**overallQuotaInMB**|**unsignedInt**|Optional. The total amount of file system storage allocated for all logging buffers.<br /><br /> The default is 4000 MB and if you provide a value for this attribute, it must not exceed this amount.|  
  
## DiagnosticInfrastructureLogs Element  
 The **DiagnosticInfrastructureLogs** element defines the buffer configuration for the logs that are generated by the underlying diagnostics infrastructure. The parent of this element is the [DiagnosticMonitorConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DiagnosticMonitorConfiguration).  
  
 The following table describes the attributes of the **DiagnosticInfrastructureLogs** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**bufferQuotaInMB**|**unsignedInt**|Optional. Specifies the maximum amount of file system storage that is available for the specified data.<br /><br /> The default is 0.|  
|**scheduledTransferLogLevelFilter**|**string**|Optional. Specifies the minimum severity level for log entries that are transferred. The default value is **Undefined**. Other possible values are **Verbose**, **Information**, **Warning**, **Error**, and **Critical**.|  
|**scheduledTransferPeriod**|**duration**|Optional. Specifies the interval between scheduled transfers of data, rounded up to the nearest minute.<br /><br /> The default is PT0S.|  
  
## Logs Element  
 The **Logs** element defines the buffer configuration for basic Azure logs. The parent of this element is the [DiagnosticMonitorConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DiagnosticMonitorConfiguration).  
  
 The following table describes the attributes of the **Logs** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**bufferQuotaInMB**|**unsignedInt**|Optional. Specifies the maximum amount of file system storage that is available for the specified data.<br /><br /> The default is 0.|  
|**scheduledTransferLogLevelFilter**|**string**|Optional. Specifies the minimum severity level for log entries that are transferred. The default value is **Undefined**. Other possible values are **Verbose**, **Information**, **Warning**, **Error**, and **Critical**.|  
|**scheduledTransferPeriod**|**duration**|Optional. Specifies the interval between scheduled transfers of data, rounded up to the nearest minute.<br /><br /> The default is PT0S.|  
  
##  <a name="bk_Directories"></a> Directories Element  
 The **Directories** element defines the buffer configuration for file-based logs that you can define. This element is the parent element of the [CrashDumps Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_CrashDumps), [FailedRequestLogs Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_FailedRequestLogs), [IISLogs Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_IISLogs), and [DataSources Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DataSources). The parent of this element is the [DiagnosticMonitorConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DiagnosticMonitorConfiguration).  
  
 The following table describes the attributes of the **Directories** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**bufferQuotaInMB**|**unsignedInt**|Optional. Specifies the maximum amount of file system storage that is available for the specified data.<br /><br /> The default is 0.|  
|**scheduledTransferPeriod**|**duration**|Optional. Specifies the interval between scheduled transfers of data, rounded up to the nearest minute.<br /><br /> The default is PT0S.|  
  
## CrashDumps Element  
 The **CrashDumps** element defines the crash dumps directory. The parent of this element is the [Directories Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_Directories).  
  
 The following table describes the attributes of the **CrashDumps** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**container**|**string**|The name of the container where the contents of the directory is to be transferred.|  
|**directoryQuotaInMB**|**unsignedInt**|Optional. Specifies the maximum size of the directory in megabytes.<br /><br /> The default is 0.|  
  
## FailedRequestLogs Element  
 The **FailedRequestLogs** element defines the failed request log directory. The parent of this element is the [Directories Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_Directories).  
  
 The following table describes the attributes of the **FailedRequestLogs** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**container**|**string**|The name of the container where the contents of the directory is to be transferred.|  
|**directoryQuotaInMB**|**unsignedInt**|Optional. Specifies the maximum size of the directory in megabytes.<br /><br /> The default is 0.|  
  
##  <a name="bk_IISLogs"></a> IISLogs Element  
 The **IISLogs** element defines the IIS log directory. The parent of this element is the [Directories Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_Directories).  
  
 The following table describes the attributes of the **IISLogs** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**container**|**string**|The name of the container where the contents of the directory is to be transferred.|  
|**directoryQuotaInMB**|**unsignedInt**|Optional. Specifies the maximum size of the directory in megabytes.<br /><br /> The default is 0.|  
  
## DataSources Element  
 The **DataSources** element defines zero or more additional log directories. The parent of this element is the [Directories Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_Directories). This element is the parent element of the [DirectoryConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DirectoryConfiguration).  
  
## DirectoryConfiguration Element  
 The **DirectoryConfiguration** element defines the directory of log files to monitor. The parent of this element is the [DataSources Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DataSources). This element is the parent element of the [Absolute Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_Absolute) and [LocalResource Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_LocalResource)t.  
  
 The following table describes the attributes of the **DirectoryConfiguration** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**container**|**string**|The name of the container where the contents of the directory is to be transferred.|  
|**directoryQuotaInMB**|**unsignedInt**|Optional. Specifies the maximum size of the directory in megabytes.<br /><br /> The default is 0.|  
  
## Absolute Element  
 The **Absolute** element defines an absolute path of the directory to monitor with optional environment expansion. The parent of this element is the [DirectoryConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DirectoryConfiguration).  
  
 The following table describes the attributes of the **Absolute** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**path**|**string**|Required. The absolute path to the directory to monitor.|  
|**expandEnvironment**|**boolean**|Required. If set to **true**, environment variables in the path are expanded.|  
  
## LocalResource Element  
 The **LocalResource** element defines a path relative to a local resource defined in the service definition. The parent of this element is the [DirectoryConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DirectoryConfiguration).  
  
 The following table describes the attributes of the **LocalResource** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**name**|**string**|Required. The name of the local resource that contains the directory to monitor.|  
|**relativePath**|**string**|Required. The path relative to the local resource to monitor.|  
  
## PerformanceCounters Element  
 The **PerformanceCounters** element defines the path to the performance counter to collect. The parent of this element is the [DiagnosticMonitorConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DiagnosticMonitorConfiguration). This element is the parent element of the [PerformanceCounterConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_PerformanceCounterConfiguration).  
  
 The following table describes the attributes of the **PerformanceCounters** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**bufferQuotaInMB**|**unsignedInt**|Optional. Specifies the maximum amount of file system storage that is available for the specified data.<br /><br /> The default is 0.|  
|**scheduledTransferPeriod**|**duration**|Optional. Specifies the interval between scheduled transfers of data, rounded up to the nearest minute.<br /><br /> The default is PT0S.|  
  
## PerformanceCounterConfiguration Element  
 The **PerformanceCounterConfiguration** element defines the performance counter to collect. The parent of this element is the [PerformanceCounters Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_PerformanceCounters).  
  
 The following table describes the attributes of the **PerformanceCounterConfiguration** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**counterSpecifier**|**string**|Required. The path to the performance counter to collect.|  
|**sampleRate**|**duration**|Required. The rate at which the performance counter should be collected.|  
  
## WindowsEventLog Element  
 The **WindowsEventLog** element defines the event logs to monitor. The parent of this element is the [DiagnosticMonitorConfiguration Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DiagnosticMonitorConfiguration). This element is the parent element of the [DataSource Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_DataSource).  
  
 The following table describes the attributes of the **WindowsEventLog** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**bufferQuotaInMB**|**unsignedInt**|Optional. Specifies the maximum amount of file system storage that is available for the specified data.<br /><br /> The default is 0.|  
|**scheduledTransferLogLevelFilter**|**string**|Optional. Specifies the minimum severity level for log entries that are transferred. The default value is **Undefined**. Other possible values are **Verbose**, **Information**, **Warning**, **Error**, and **Critical**.|  
|**scheduledTransferPeriod**|**duration**|Optional. Specifies the interval between scheduled transfers of data, rounded up to the nearest minute.<br /><br /> The default is PT0S.|  
  
## DataSource Element  
 The **DataSource** element defines the event log to monitor. The parent of this element is the [WindowsEventLog Element](../Topic/Azure%20Diagnostics%201.0%20Configuration%20Schema.md#bk_windowsEventLog).  
  
 The following table describes the attributes of the **DataSource** element.  
  
|Attribute|Type|Description|  
|---------------|----------|-----------------|  
|**name**|**string**|Required. An XPath expression specifying the log to collect.|  
  
## See Also  
 [Schema Reference](../Topic/Schema%20Reference.md)

