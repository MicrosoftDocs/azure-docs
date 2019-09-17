---
title: Azure Event Grid Azure Key Vault event schema
description: Describes the properties and schema provided for Azure Key Vault events with Azure Event Grid
services: event-grid
author: msmbaldwin
ms.service: event-grid
ms.topic: reference
ms.date: 09/04/2019
ms.author: mbaldwin
---

# Azure Event Grid event schema for Azure Key Vault

This article provides the properties and schema for [Azure Key Vault](../key-vault/index.yml) events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Available event types

An Azure Key Vault account emits the following event types:

| Event full Name | Event display name | description |
| ---------- | ----------- |---|
| Microsoft.KeyVault.CertificateNewVersionCreated | Certificate New Version Created | Triggered when new certificate or new certificate version is created |
| Microsoft.KeyVault.CertificateNearExpiry | Certificate Near Expiry | Triggered when current version of certificate is about to expire (default  is 30 days before expiration date) |
| Microsoft.KeyVault.CertificateExpired | Certificate Expired | Triggered when certificate is expired |
| Microsoft.KeyVault.KeyNewVersionCreated | Key New Version Created | Triggered when new key or new key version is created |
| Microsoft.KeyVault.KeyNearExpiry | Key Near Expiry | Triggered when current version of key is about to expire (default  is 30 days before expiration date) |
| Microsoft.KeyVault.KeyExpired | Key Expired | Triggered when key is expired |
| Microsoft.KeyVault.SecretNewVersionCreated | Secret New Version Created | Triggered when new secret or new secret version is created |
| Microsoft.KeyVault.SecretNearExpiry | Secret Near Expiry | Triggered when current version of secret is about to expire (default  is 30 days before expiration date) |
| Microsoft.KeyVault.SecretExpired | Secret Expired | Triggered when secret is expired |

## Event examples

The following example shows the schema of a **GeofenceEntered** event

```JSON
{   
   "id":"7f8446e2-1ac7-4234-8425-303726ea3981", 
   "topic":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Maps/accounts/{accountName}", 
   "subject":"/spatial/geofence/udid/{udid}/id/{eventId}", 
   "data":{   
      "geometries":[   
         {   
            "deviceId":"device_1", 
            "udId":"1a13b444-4acf-32ab-ce4e-9ca4af20b169", 
            "geometryId":"2", 
            "distance":-999.0, 
            "nearestLat":47.618786, 
            "nearestLon":-122.132151 
         } 
      ], 
      "expiredGeofenceGeometryId":[   
      ], 
      "invalidPeriodGeofenceGeometryId":[   
      ] 
   }, 
   "eventType":"Microsoft.Maps.GeofenceEntered", 
   "eventTime":"2018-11-08T00:54:17.6408601Z", 
   "metadataVersion":"1", 
   "dataVersion":"1.0" 
}
```

The following example show schema for **GeofenceResult**.

```JSON
[
   {
      "id":"00eccf70-95a7-4e7c-8299-2eb17ee9ad64",
      "topic":"/subscriptions/9ddb6ca6-f086-4796-8c53-ea831f1df369/resourceGroups/sample-rg/providers/Microsoft.KeyVault/vaults/sample-kv",
      "subject":"newsecret",
      "eventType":"Microsoft.KeyVault.SecretNewVersionCreated",
      "eventTime":"2019-07-25T01:08: 33.1036736Z",
      "data":{
         "Id":"https://sample-kv.vault.azure.net/secrets/newsecret/ee059b2bb5bc48398a53b168c6cdcb10",
         "vaultName":"sample-kv",
         "objectType":"Secret",
         "objectName ":" newsecret ",
         "version":" ee059b2bb5bc48398a53b168c6cdcb10",
         "nbf":"1559081980",
         "exp":"1559082102"
      },
      "dataVersion":"1",
      "metadataVersion":"1"
   }
]
```

## Event properties

An event has the following top-level data:

| Property | Type | Description |
| ---------- | ----------- |---|
| id | string | The id of the object that triggered this event. |
| vaultName" | string | Key vault name of the object that triggered this event. |
| objectType | string | The type of the object that triggered this event |
| objectName | string | The name of the object that triggered this event |
| version | string | The version of the object that triggered this event |
| nbf | number | Not before date in seconds since 1970-01-01T00:00:00Z of the object that triggered this event |
| exp | number | The expiration date in seconds since 1970-01-01T00:00:00Z of the object that triggered this event |


## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).