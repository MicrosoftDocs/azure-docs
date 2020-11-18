---
title: Azure template samples - Apply Windows Azure Diagnostics Extension
description: Sample template for applying the Windows Azure Diagnostics extension
ms.topic: sample
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Apply Windows Azure Diagnostics extension to Azure Cloud Services (extended support)
This sample shows how to apply the Windows Azure diagnostics extension to a Cloud Service (extended support) Web roles. 

## Example: Windows Azure Diagnostics Extension

```JSON
"wadPublicConfig_WebRole1": { 

"value": "<PublicConfig xmlns=\"http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration\"> 

  \r\n  <WadCfg> 

    \r\n    <DiagnosticMonitorConfiguration overallQuotaInMB=\"4096\"> 

      \r\n      <DiagnosticInfrastructureLogs scheduledTransferLogLevelFilter=\"Error\" />\r\n      <Logs scheduledTransferPeriod=\"PT1M\" scheduledTransferLogLevelFilter=\"Error\" />\r\n      <Directories scheduledTransferPeriod=\"PT1M\"> 

        \r\n        <IISLogs containerName=\"wad-iis-logfiles\" />\r\n        <FailedRequestLogs containerName=\"wad-failedrequestlogs\" />\r\n 

      </Directories>\r\n      <WindowsEventLog scheduledTransferPeriod=\"PT1M\"> 

        \r\n        <DataSource name=\"Application!*[System[(Level=1 or Level=2 or Level=3)]]\" />\r\n        <DataSource name=\"Windows Azure!*[System[(Level=1 or Level=2 or Level=3 or Level=4)]]\" />\r\n 

      </WindowsEventLog>\r\n      <CrashDumps containerName=\"wad-crashdumps\" dumpType=\"Mini\"> 

        \r\n        <CrashDumpConfiguration processName=\"WaIISHost.exe\" />\r\n        <CrashDumpConfiguration processName=\"WaWorkerHost.exe\" />\r\n        <CrashDumpConfiguration processName=\"w3wp.exe\" />\r\n 

      </CrashDumps>\r\n      <PerformanceCounters scheduledTransferPeriod=\"PT1M\"> 

        \r\n        <PerformanceCounterConfiguration counterSpecifier=\"\\Memory\\Available MBytes\" sampleRate=\"PT3M\" />\r\n        <PerformanceCounterConfiguration counterSpecifier=\"\\Web Service(_Total)\\ISAPI Extension Requests/sec\" sampleRate=\"PT3M\" />\r\n        <PerformanceCounterConfiguration counterSpecifier=\"\\Web Service(_Total)\\Bytes Total/Sec\" sampleRate=\"PT3M\" />\r\n        <PerformanceCounterConfiguration counterSpecifier=\"\\ASP.NET Applications(__Total__)\\Requests/Sec\" sampleRate=\"PT3M\" />\r\n        <PerformanceCounterConfiguration counterSpecifier=\"\\ASP.NET Applications(__Total__)\\Errors Total/Sec\" sampleRate=\"PT3M\" />\r\n        <PerformanceCounterConfiguration counterSpecifier=\"\\ASP.NET\\Requests Queued\" sampleRate=\"PT3M\" />\r\n        <PerformanceCounterConfiguration counterSpecifier=\"\\ASP.NET\\Requests Rejected\" sampleRate=\"PT3M\" />\r\n        <PerformanceCounterConfiguration counterSpecifier=\"\\Processor(_Total)\\% Processor Time\" sampleRate=\"PT3M\" />\r\n 

      </PerformanceCounters>\r\n      <Metrics resourceId=\"/subscriptions/47ff8d6e-e419-464f-8940-dfa750f2115d/resourceGroups/GC23OCT/providers/Microsoft.Compute/cloudServices/gc23oct1\" />\r\n 

    </DiagnosticMonitorConfiguration>\r\n 

  </WadCfg>\r\n  <StorageAccount>devstoreaccount1</StorageAccount>\r\n  <StorageType>TableAndBlob</StorageType>\r\n 

</PublicConfig>" 

}, 

 

"wadPrivateConfig_WebRole1": { 

"value": "<PrivateConfig xmlns=\"http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration\"> 

  \r\n  <StorageAccount name=\"devstoreaccount1\" key=\"Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==\" />\r\n 

</PrivateConfig>" 

} 
```


## Next steps