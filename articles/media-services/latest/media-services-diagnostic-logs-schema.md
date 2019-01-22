---
title: Azure Media Services diagnostic logs schemas
description: This article shows the Azure Media Services diagnostic logs schemas.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/20/2019
ms.author: juliako

---

# Diagnostic logs schemas

Azure Media Services uses [Azure Monitor](../../azure-monitor/overview.md) to enable you to monitor metrics and diagnostic logs that help you understand how your applications are performing. You can create alerts and notifications for the diagnostic logs. You can monitor and send logs to [Azure Storage](https://azure.microsoft.com/services/storage/), stream them to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/), and export them to [Log Analytics](https://azure.microsoft.com/services/log-analytics/), or use 3rd party services.

For detailed information, see [Azure Monitor Metrics](../../azure-monitor/platform/data-collection.md) and [Azure Monitor Diagnostic logs](../../azure-monitor/platform/diagnostic-logs-overview.md).

This article describes Media Services Diagnostic logs schemas.

## Common schema properties 

This section describes the properties that are common between other Media Services diagnostic logs. 

|Name|Description|
|---|---|
|resourceId|The Azure resource ID.|
|operationName|The operation name.|
|operationVersion|The operation version.|
|category|The log category name. For example, "KeyDeliveryRequests".|
|resultType|The result type. For example, Started, InProgress, Succeeded, Failed.|
|resultSignature|The result signature. The HTTP status code of response. For example, OK, Forbidden.|
|durationMs|The duration of the operation.|
|callerIpAddress|The caller IP address.|
|CorrelationId|The operation correlation ID.|
|identity|The caller identity. Includes the following:<br/>"issuer" - The token issuer.<br/>"audience"- The token audience.<br/>"claims"-The token claims.|
|level|The log severity level.|
|location|The Azure region for the resource.|

## Key delivery log schema

These properties are specific to a key delivery log schema.

|Name|Description|
|---|---|
|keyId|The ID of the requested key.|
|policyName|The Azure Resource Manager name of the policy.|
|tokenType|The token type.|
|identity|The identity from the token.|
|errorMessage|The error message.|

### Example

The following is a key delivery service request log example:

```json
{
    "time": "2019-01-11T17:59:10.4908614Z",
    "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-0000000000000/RESOURCEGROUPS/SBKEY/PROVIDERS/MICROSOFT.MEDIA/MEDIASERVICES/SBDNSTEST",
    "operationName": "MICROSOFT.MEDIA/MEDIASERVICES/CONTENTKEYS/READ",
    "operationVersion": "1.0",
    "category": "KeyDeliveryRequests",
    "resultType": "Succeeded",
    "resultSignature": "OK",
    "durationMs": 315,
    "identity": {
        "authorization": {
            "issuer": "http://testissuer",
            "audience": "urn:testsudience"
        },
        "claims": {
            "urn:microsoft:azure:mediaservices:contentkeyidentifier": "00000000-0000-0000-0000-0000000000000",
            "iss": "http://testissuer",
            "aud": "urn:testsudience",
            "exp": "1547233138"
        }
    },
    "level": "Informational",
    "location": "uswestcentral",
    "properties": {
        "requestId": "00000000-0000-0000-0000-0000000000000",
        "keyType": "Clear",
        "keyId": "00000000-0000-0000-0000-0000000000000",
        "policyName": "00000000-0000-0000-0000-0000000000000",
        "tokenType": "JWT",
        "statusMessage": "OK"
    }
} 
```

## Streaming endpoint log schema

```json
{TODO}
```

## Next steps

[Monitor Media Services metrics and diagnostic logs](media-services-azure-monitor-overview.md)