---
title: Azure Media Services diagnostic logs schemas - Azure
description: This article demonstrates the Azure Media Services diagnostic logs schemas.
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

[Azure Monitor](../../azure-monitor/overview.md) enables you to monitor metrics and diagnostic logs that help you understand how your applications are performing. You can monitor Media Services diagnostic logs and create alerts and notifications for the collected metrics and logs. You can send logs to [Azure Storage](https://azure.microsoft.com/services/storage/), stream them to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/), and export them to [Log Analytics](https://azure.microsoft.com/services/log-analytics/), or use 3rd party services.

For detailed information, see [Azure Monitor Metrics](../../azure-monitor/platform/data-platform.md) and [Azure Monitor Diagnostic logs](../../azure-monitor/platform/platform-logs-overview.md).

This article describes Media Services diagnostic logs schemas.

## Top-level diagnostic logs schema

For detailed description of the top-level diagnostic logs schema, see [Supported services, schemas, and categories for Azure Diagnostic Logs](../../azure-monitor/platform/tutorial-dashboards.md).

## Key delivery log schema

### Properties

These properties are specific to the key delivery log schema.

|Name|Description|
|---|---|
|keyId|The ID of the requested key.|
|keyType|Could be one of the following values: "Clear" (no encryption), "FairPlay", "PlayReady", or "Widevine".|
|policyName|The Azure Resource Manager name of the policy.|
|tokenType|The token type.|
|statusMessage|The status message.|

### Examples

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

## Additional notes

* Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Next steps

[Monitor Media Services metrics and diagnostic logs](media-services-metrics-diagnostic-logs.md)
