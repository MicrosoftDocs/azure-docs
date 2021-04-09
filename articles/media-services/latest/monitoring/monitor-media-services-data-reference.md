---
title: Monitoring Media Services data reference 
description: Important reference material needed when you monitor Media Services 
author: IngridAtMicrosoft
ms.author: inhenkel
manager: femila
ms.topic: reference
ms.service: media-services
ms.custom: subject-monitoring
ms.date: 03/17/2021
---

# Monitoring Media Services data reference

This article covers the data that is useful for monitoring Media Services. For more information about all platform metrics supported in Azure Monitor, review [Supported metrics with Azure Monitor](../../../azure-monitor/essentials/metrics-supported.md).

## Media Services metrics

Metrics are collected at regular intervals whether or not the value changes. They're useful for alerting because they can be sampled frequently, and an alert can be fired quickly with relatively simple logic.


Media Services supports monitoring metrics for the following resources:

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Media Services general | [General](/azure/azure-monitor/essentials/metrics-supported#microsoftmediamediaservices) |
| Live Events | [Microsoft.Media/mediaservices/liveEvents](/azure/azure-monitor/essentials/metrics-supported#microsoftmediamediaservicesliveevents) 
| Streaming Endpoints | [Microsoft.Media/mediaservices/streamingEndpoints](/azure/azure-monitor/essentials/metrics-supported#microsoftmediamediaservicesstreamingendpoints), which are relevant to the [Streaming Endpoints REST API](/rest/api/media/streamingendpoints). 


You should also review [account quotas and limits](../limits-quotas-constraints-reference.md).


## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../../../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

<!--**PLACEHOLDER** for dimensions table.-->
OutputFormat, 
HttpStatusCode, 
ErrorCode, 
TrackName

## Resource logs

## Media Services resource logs

Resource logs provide rich and frequent data about the operation of an Azure resource. For more information, see [How to collect and consume log data from your Azure resources](../../../azure-monitor/essentials/platform-logs-overview.md).

Media Services supports the following resource logs:
[Microsoft.Media/mediaservices](/azure/azure-monitor/essentials/resource-logs-categories#microsoftmediamediaservices)

## Schemas

For detailed description of the top-level diagnostic logs schema, see [Supported services, schemas, and categories for Azure Diagnostic Logs](../../../azure-monitor/essentials/resource-logs-schema.md).

## Key delivery log schema properties

These properties are specific to the key delivery log schema.

|Name|Description|
|---|---|
|keyId|The ID of the requested key.|
|keyType|Could be one of the following values: "Clear" (no encryption), "FairPlay", "PlayReady", or "Widevine".|
|policyName|The Azure Resource Manager name of the policy.|
|tokenType|The token type.|
|statusMessage|The status message.|

### Example

Properties of the key delivery requests schema.

```json
{
    "time": "2019-01-11T17:59:10.4908614Z",
    "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-0000000000/RESOURCEGROUPS/SBKEY/PROVIDERS/MICROSOFT.MEDIA/MEDIASERVICES/SBDNSTEST",
    "operationName": "MICROSOFT.MEDIA/MEDIASERVICES/CONTENTKEYS/READ",
    "operationVersion": "1.0",
    "category": "KeyDeliveryRequests",
    "resultType": "Succeeded",
    "resultSignature": "OK",
    "durationMs": 315,
    "identity": {
        "authorization": {
            "issuer": "http://testacs",
            "audience": "urn:test"
        },
        "claims": {
            "urn:microsoft:azure:mediaservices:contentkeyidentifier": "3321e646-78d0-4896-84ec-c7b98eddfca5",
            "iss": "http://testacs",
            "aud": "urn:test",
            "exp": "1547233138"
        }
    },
    "level": "Informational",
    "location": "uswestcentral",
    "properties": {
        "requestId": "b0243468-d8e5-4edf-a48b-d408e1661050",
        "keyType": "Clear",
        "keyId": "3321e646-78d0-4896-84ec-c7b98eddfca5",
        "policyName": "56a70229-82d0-4174-82bc-e9d3b14e5dbf",
        "tokenType": "JWT",
        "statusMessage": "OK"
    }
} 
```

```json
 {
    "time": "2019-01-11T17:59:33.4676382Z",
    "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-0000000000/RESOURCEGROUPS/SBKEY/PROVIDERS/MICROSOFT.MEDIA/MEDIASERVICES/SBDNSTEST",
    "operationName": "MICROSOFT.MEDIA/MEDIASERVICES/CONTENTKEYS/READ",
    "operationVersion": "1.0",
    "category": "KeyDeliveryRequests",
    "resultType": "Failed",
    "resultSignature": "Unauthorized",
    "durationMs": 2,
    "level": "Error",
    "location": "uswestcentral",
    "properties": {
        "requestId": "875af030-b77c-416b-b7e1-58f23ebec182",
        "keyType": "Clear",
        "keyId": "3321e646-78d0-4896-84ec-c7b98eddfca5",
        "policyName": "56a70229-82d0-4174-82bc-e9d3b14e5dbf",
        "tokenType": "None",
        "statusMessage": "No token present in authorization header or URL."
    }
} 
```

>[!NOTE]
> Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Next steps

[!INCLUDE [monitoring-next-steps](../includes/monitoring-next-steps.md)]
