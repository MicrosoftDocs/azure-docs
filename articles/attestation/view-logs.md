---
title: Azure Attestation logs
description: Describes the full logs that are collected for Azure Attestation
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: reference
ms.date: 01/23/2023
ms.author: mbaldwin

---

# Azure Attestation logging

If you create one or more Azure Attestation resources, you’ll want to monitor how and when your attestation instance is accessed, and by whom. You can do so by enabling logging for Microsoft Azure Attestation, which saves information in an Azure storage account you provide.  

Logging information will be available up to 10 minutes after the operation occurred (in most cases, it will be quicker). Since you provide the storage account, you can secure your logs via standard Azure access controls and delete logs you no longer want to keep in your storage account.

## Interpret your Azure Attestation logs

When logging is enabled, up to three containers might be automatically created for you in your specified storage account:  **insights-logs-auditevent, insights-logs-operational, insights-logs-notprocessed**. It is recommended to only use **insights-logs-operational** and **insights-logs-notprocessed**. **insights-logs-auditevent** was created to provide early access to logs for customers using VBS. Future enhancements to logging will occur in the **insights-logs-operational** and **insights-logs-notprocessed**.  

**Insights-logs-operational** contains generic information across all TEE types. 

**Insights-logs-notprocessed** contains requests that the service was unable to process, typically due to malformed HTTP headers, incomplete message bodies, or similar issues.  

Individual blobs are stored as text, formatted as a JSON blob. Let’s look at an example log entry: 


```json
{  
 "Time": "2021-11-03T19:33:54.3318081Z", 
 "resourceId": "/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.Attestation/attestationProviders/<instance name>",
 "region": "EastUS", 
 "operationName": "AttestSgxEnclave", 
 "category": "Operational", 
 "resultType": "Succeeded", 
 "resultSignature": "400", 
 "durationMs": 636, 
 "callerIpAddress": "::ffff:24.17.183.201", 
 "traceContext": "{\"traceId\":\"e4c24ac88f33c53f875e5141a0f4ce13\",\"parentId\":\"0000000000000000\",}", 
 "identity": "{\"callerAadUPN\":\"deschuma@microsoft.com\",\"callerAadObjectId\":\"6ab02abe-6ca2-44ac-834d-42947dbde2b2\",\"callerId\":\"deschuma@microsoft.com\"}",
 "uri": "https://deschumatestrp.eus.test.attest.azure.net:443/attest/SgxEnclave?api-version=2018-09-01-preview", 
 "level": "Informational", 
 "location": "EastUS", 
 "properties": 
  { 
    "failureResourceId": "", 
    "failureCategory": "None", 
    "failureDetails": "", 
    "infoDataReceived": 
    { 
      "Headers": 
      { 
      "User-Agent": "PostmanRuntime/7.28.4" 
      }, 
      "HeaderCount": 10,
      "ContentType": "application/json",
      "ContentLength": 6912, 
      "CookieCount": 0, 
      "TraceParent": "" 
    } 
   } 
 } 
```

Most of these fields are documented in the [Top-level common schema](../azure-monitor/essentials/resource-logs-schema.md#top-level-common-schema). The following table lists the field names and descriptions for the entries not included in the top-level common schema: 

|     Field Name                           |     Description                                                                         |
|------------------------------------------|-----------------------------------------------------------------------------------------------|
|     traceContext                        |     JSON blob representing the W3C trace-context |
|    uri                       |     Request URI  |

The properties contain additional Azure attestation specific context:

|     Field Name                           |     Description                                                                         |
|------------------------------------------|-----------------------------------------------------------------------------------------------|
|     failureResourceId                        |     Resource ID of component that resulted in request failure  |
|    failureCategory                       |     Broad category indicating category of a request failure. Includes categories such as AzureNetworkingPhysical, AzureAuthorization etc.   |
|    failureDetails                       |     Detailed information about a request failure, if available   |
|    infoDataReceived                       |     Information about the request received from the client. Includes some HTTP headers, the number of headers received, the content type and content length    |

## Next steps
- [How to enable Microsoft Azure Attestation logging](enable-logging.md)
