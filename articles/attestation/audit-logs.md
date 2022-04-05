---
title: Azure Attestation audit logs
description: Describes the full audit logs that are collected for Azure Attestation
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: reference
ms.date: 11/23/2020
ms.author: mbaldwin


---

# Azure Attestation logging

If you create one or more Azure Attestation resources, you’ll want to monitor how and when your attestation instance is accessed, and by whom. You can do this by enabling logging for Microsoft Azure Attestation, which saves information in an Azure storage account you provide.  

Logging information will be available up to 10 minutes after the operation occurred (in most cases, it will be quicker than this). Since you provide the storage account, you can secure your logs via standard Azure access controls and delete logs you no longer want to keep in your storage account. 

## Interpret your Azure Attestation logs

When logging is enabled, up to three containers may be automatically created for you in your specified storage account:  **insights-logs-auditevent, insights-logs-operational, insights-logs-notprocessed**. It is recommended to only use **insights-logs-operational** and **insights-logs-notprocessed**. **insights-logs-auditevent** was created to provide early access to logs for customers using VBS. Future enhancements to logging will occur in the **insights-logs-operational** and **insights-logs-notprocessed**.  

**Insights-logs-operational** contains generic information across all TEE types. 

**Insights-logs-notprocessed** contains requests which the service was unable to process, typically due to malformed HTTP headers, incomplete message bodies, or similar issues.  

Individual blobs are stored as text, formatted as a JSON blob. Let’s look at an example log entry: 


```json
gfhgj
```

Most of these fields are documented in the [Top-level common schema](/azure-monitor/essentials/resource-logs-schema#top-level-common-schema). The following table lists the field names and descriptions for the entries not included in the top-level common schema: 

|     Field Name                           |     Description                                                                         |
|------------------------------------------|-----------------------------------------------------------------------------------------------|
|     traceContext                        |     JSON blob representing the W3C trace-context |
|    uri                       |     Request URI  |

The properties contains additional Azure attestation specific context: 

|     Field Name                           |     Description                                                                         |
|------------------------------------------|-----------------------------------------------------------------------------------------------|
|     failureResourceId                        |     Resource ID of component which resulted in request failure  |
|    failureCategory                       |     Broad category indicating category of a request failure. Includes categories such as AzureNetworkingPhysical, AzureAuthorization etc.   |
|    failureDetails                       |     Detailed information about a request failure, if available   |
|    infoDataReceived                       |     Information about the request received from the client. Includes some HTTP headers, the number of headers received, the conent type and content length    |
