---
title: Azure Event Grid Azure Key Vault event schema
description: Describes the properties and schema provided for Azure Key Vault events with Azure Event Grid
services: event-grid
author: msmbaldwin
ms.service: event-grid
ms.topic: reference
ms.date: 10/25/2019
ms.author: mbaldwin
---

# Azure Event Grid event schema for Azure Key Vault (preview)

This article provides the properties and schema for [Azure Key Vault](../key-vault/index.yml) events, currently in preview. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

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

The following example show schema for **Microsoft.KeyVault.SecretNewVersionCreated**.

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

## Event properties

An event has the following top-level data:

| Property | Type | Description |
| ---------- | ----------- |---|
| id | string | The ID of the object that triggered this event. |
| vaultName | string | Key vault name of the object that triggered this event. |
| objectType | string | The type of the object that triggered this event |
| objectName | string | The name of the object that triggered this event |
| version | string | The version of the object that triggered this event |
| nbf | number | Not before date in seconds since 1970-01-01T00:00:00Z of the object that triggered this event |
| exp | number | The expiration date in seconds since 1970-01-01T00:00:00Z of the object that triggered this event |


## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* To learn more about Key Vault / Event Grid integration, see [Monitoring Key Vault with Azure Event Grid (preview)](../key-vault/event-grid-overview.md)
* To see a tutorial on Key Vault / Event Grid integration, see [How to: Route Key Vault Events to Automation Runbook (preview)](../key-vault/event-grid-tutorial.md).

- [Azure Key Vault overview](../key-vault/key-vault-overview.md)
- [Azure Event Grid overview](overview.md)
- [Monitoring Key Vault with Azure Event Grid (preview)](../key-vault/event-grid-overview.md)
- [How to: Route Key Vault Events to Automation Runbook (preview)](../key-vault/event-grid-tutorial.md).
- [Azure Automation overview](../automation/index.yml)
