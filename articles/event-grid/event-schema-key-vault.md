---
title: Azure Key Vault as Event Grid source
description: Describes the properties and schema provided for Azure Key Vault events with Azure Event Grid
services: event-grid
author: spelluru
ms.service: event-grid
ms.topic: conceptual
ms.date: 04/09/2020
ms.author: spelluru
---

# Azure Key Vault as Event Grid source

This article provides the properties and schema for events in [Azure Key Vault](../key-vault/index.yml), currently in preview. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Event Grid event schema

### Available event types

An Azure Key Vault account generates the following event types:

| Event full name | Event display name | Description |
| ---------- | ----------- |---|
| Microsoft.KeyVault.CertificateNewVersionCreated | Certificate New Version Created | Triggered when a new certificate or new certificate version is created. |
| Microsoft.KeyVault.CertificateNearExpiry | Certificate Near Expiry | Triggered when the current version of certificate is about to expire. (The event is triggered 30 days before the expiration date.) |
| Microsoft.KeyVault.CertificateExpired | Certificate Expired | Triggered when the certificate is expired. |
| Microsoft.KeyVault.KeyNewVersionCreated | Key New Version Created | Triggered when a new key or new key version is created. |
| Microsoft.KeyVault.KeyNearExpiry | Key Near Expiry | Triggered when the current version of a key is about to expire. (The event is triggered 30 days before the expiration date.) |
| Microsoft.KeyVault.KeyExpired | Key Expired | Triggered when a key is expired. |
| Microsoft.KeyVault.SecretNewVersionCreated | Secret New Version Created | Triggered when a new secret or new secret version is created. |
| Microsoft.KeyVault.SecretNearExpiry | Secret Near Expiry | Triggered when the current version of a secret is about to expire. (The event is triggered  30 days before the expiration date.) |
| Microsoft.KeyVault.SecretExpired | Secret Expired | Triggered when a secret is expired. |

### Event examples

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
         "vaultName":"sample-kv",
         "objectType":"Secret",
         "objectName ":"newsecret",
         "version":" ee059b2bb5bc48398a53b168c6cdcb10",
         "nbf":"1559081980",
         "exp":"1559082102"
      },
      "dataVersion":"1",
      "metadataVersion":"1"
   }
]
```

### Event properties

An event has the following top-level data:

| Property | Type | Description |
| ---------- | ----------- |---|
| id | string | The ID of the object that triggered this event |
| vaultName | string | The key vault name of the object that triggered this event |
| objectType | string | The type of the object that triggered this event |
| objectName | string | The name of the object that triggered this event |
| version | string | The version of the object that triggered this event |
| nbf | number | The not-before date in seconds since 1970-01-01T00:00:00Z of the object that triggered this event |
| exp | number | The expiration date in seconds since 1970-01-01T00:00:00Z of the object that triggered this event |

## Tutorials and how-tos
|Title  |Description  |
|---------|---------|
| [Monitoring Key Vault events with Azure Event Grid](../key-vault/general/event-grid-overview.md) | Overview of integrating Key Vault with Event Grid. |
| [Tutorial: Create and monitor Key Vault events with Event Grid](../key-vault/general/event-grid-tutorial.md) | Learn how to set up Event Grid notifications for Key Vault. |


## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md).
* For more information about how to create an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* To learn more about Key Vault integration with Event Grid, see [Monitoring Key Vault with Azure Event Grid (preview)](../key-vault/general/event-grid-overview.md).
* For a tutorial on Key Vault integration with Event Grid, see [Receive and respond to key vault notifications with Azure Event Grid (preview)](../key-vault/general/event-grid-tutorial.md).
* To get additional guidance for Key Vault and Azure Automation, see:
    - [What is Azure Key Vault?](../key-vault/general/overview.md)
    - [Monitoring Key Vault with Azure Event Grid (preview)](../key-vault/general/event-grid-overview.md)
    - [Receive and respond to key vault notifications with Azure Event Grid (preview)](../key-vault/general/event-grid-tutorial.md)
    - [Azure Automation overview](../automation/index.yml)
