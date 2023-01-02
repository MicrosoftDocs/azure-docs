---
title: Azure Key Vault as Event Grid source
description: Describes the properties and schema provided for Azure Key Vault events with Azure Event Grid
ms.topic: conceptual
ms.date: 11/17/2022
---

# Azure Key Vault as Event Grid source

This article provides the properties and schema for events in [Azure Key Vault](../key-vault/index.yml). For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md) and [Cloud event schema](cloud-event-schema.md).


## Available event types

An Azure Key Vault account generates the following event types:

| Event full name | Event display name | Description |
| ---------- | ----------- |---|
| Microsoft.KeyVault.CertificateNewVersionCreated | Certificate New Version Created | Triggered when a new certificate or new certificate version is created. |
| Microsoft.KeyVault.CertificateNearExpiry | Certificate Near Expiry | Triggered when the current version of certificate is about to expire. (The event is triggered 30 days before the expiration date.) |
| Microsoft.KeyVault.CertificateExpired | Certificate Expired | Triggered when the current version of a certificate is expired. |
| Microsoft.KeyVault.KeyNewVersionCreated | Key New Version Created | Triggered when a new key or new key version is created. |
| Microsoft.KeyVault.KeyNearExpiry | Key Near Expiry | Triggered when the current version of a key is about to expire. The event time can be configured using [key rotation policy](../key-vault/keys/how-to-configure-key-rotation.md) |
| Microsoft.KeyVault.KeyExpired | Key Expired | Triggered when the current version of a key is expired. |
| Microsoft.KeyVault.SecretNewVersionCreated | Secret New Version Created | Triggered when a new secret or new secret version is created. |
| Microsoft.KeyVault.SecretNearExpiry | Secret Near Expiry | Triggered when the current version of a secret is about to expire. (The event is triggered  30 days before the expiration date.) |
| Microsoft.KeyVault.SecretExpired | Secret Expired | Triggered when the current version of a secret is expired. |
| Microsoft.KeyVault.VaultAccessPolicyChanged | Vault Access Policy Changed | Triggered when an access policy on Key Vault changed. It includes a scenario when Key Vault permission model is changed to/from Azure role-based access control.   |

## Event examples

# [Event Grid event schema](#tab/event-grid-event-schema)

The following example show schema for **Microsoft.KeyVault.SecretNewVersionCreated**:

```JSON
[
   {
      "id":"00eccf70-95a7-4e7c-8299-2eb17ee9ad64",
      "topic":"/subscriptions/{subscription-id}/resourceGroups/sample-rg/providers/Microsoft.KeyVault/vaults/sample-kv",
      "subject":"newsecret",
      "eventType":"Microsoft.KeyVault.SecretNewVersionCreated",
      "eventTime":"2019-07-25T01:08:33.1036736Z",
      "data":{
         "Id":"https://sample-kv.vault.azure.net/secrets/newsecret/ee059b2bb5bc48398a53b168c6cdcb10",
         "VaultName":"sample-kv",
         "ObjectType":"Secret",
         "ObjectName":"newsecret",
         "Version":"ee059b2bb5bc48398a53b168c6cdcb10",
         "NBF":"1559081980",
         "EXP":"1559082102"
      },
      "dataVersion":"1",
      "metadataVersion":"1"
   }
]
```

# [Cloud event schema](#tab/cloud-event-schema)

The following example show schema for **Microsoft.KeyVault.SecretNewVersionCreated**:

```JSON
[
   {
      "id":"00eccf70-95a7-4e7c-8299-2eb17ee9ad64",
      "source":"/subscriptions/{subscription-id}/resourceGroups/sample-rg/providers/Microsoft.KeyVault/vaults/sample-kv",
      "subject":"newsecret",
      "type":"Microsoft.KeyVault.SecretNewVersionCreated",
      "time":"2019-07-25T01:08:33.1036736Z",
      "data":{
         "Id":"https://sample-kv.vault.azure.net/secrets/newsecret/ee059b2bb5bc48398a53b168c6cdcb10",
         "VaultName":"sample-kv",
         "ObjectType":"Secret",
         "ObjectName":"newsecret",
         "Version":"ee059b2bb5bc48398a53b168c6cdcb10",
         "NBF":"1559081980",
         "EXP":"1559082102"
      },
      "specversion":"1.0"
   }
]
```

---

### Event properties

# [Event Grid event schema](#tab/event-grid-event-schema)
An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | App Configuration event data. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |


# [Cloud event schema](#tab/cloud-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | App Configuration event data. |
| `specversion` | string | CloudEvents schema specification version. |

---
 

The data object has the following properties:

| Property | Type | Description |
| ---------- | ----------- |---|
| `id` | string | The ID of the object that triggered this event |
| `VaultName` | string | The key vault name of the object that triggered this event |
| `ObjectType` | string | The type of the object that triggered this event |
| `ObjectName` | string | The name of the object that triggered this event |
| `Version` | string | The version of the object that triggered this event |
| `NBF` | number | The not-before date in seconds since 1970-01-01T00:00:00Z of the object that triggered this event |
| `EXP` | number | The expiration date in seconds since 1970-01-01T00:00:00Z of the object that triggered this event |

## Tutorials and how-tos
|Title  |Description  |
|---------|---------|
| [Monitoring Key Vault events with Azure Event Grid](../key-vault/general/event-grid-overview.md) | Overview of integrating Key Vault with Event Grid. |
| [Tutorial: Create and monitor Key Vault events with Event Grid](../key-vault/general/event-grid-logicapps.md) | Learn how to set up Event Grid notifications for Key Vault. |


## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md).
* For more information about how to create an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* For more information about Key Vault, see [What is Azure Key Vault?](../key-vault/general/overview.md)

