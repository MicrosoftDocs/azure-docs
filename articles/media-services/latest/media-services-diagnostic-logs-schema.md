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

## Key delivery service request log schema

```json
{TODO}
```

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