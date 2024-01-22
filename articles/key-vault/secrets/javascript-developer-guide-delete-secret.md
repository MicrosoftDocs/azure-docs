---
title: Delete Azure Key Vault secret with JavaScript
description: Delete, restore, or purge a Key Vault secret using JavaScript.
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: secrets
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 05/22/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to delete a secret from the Key Vault with the SDK.
---
# Delete, restore, or purge a secret in Azure Key Vault with JavaScript

Create the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then use the client to delete an existing secret from Azure Key Vault.

## Delete a secret

To delete a secret in Azure Key Vault, use the [beginDeleteSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-begindeletesecret) long running operation (LRO) method of the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) class, chained with the [pollUntilDone](/javascript/api/@azure/keyvault-secrets/pollerlike#@azure-keyvault-secrets-pollerlike-polluntildone) to wait until the deletion is complete. 

When a secret is deleted, it uses the configured [delete strategy](../general/soft-delete-overview.md) for the key vault.

```javascript
const existingSecretName = 'myExistingSecret';

// Begin LRO
const deletePoller = await client.beginDeleteSecret(secretName);

// Wait for LRO to complete
const deleteResult = await deletePoller.pollUntilDone();

console.log(`SecretName: ${deleteResult.name}`);
console.log(`DeletedDate: ${deleteResult.deletedOn}`);
console.log(`Version: ${deleteResult.properties.deletedOn}`);
console.log(`PurgeDate: ${deleteResult.scheduledPurgeDate}`);
```

This `deleteResult` is a [DeletedSecret](/javascript/api/@azure/keyvault-secrets/deletedsecret) object. 

## Recover a deleted secret

To recover a deleted secret in Azure Key Vault, use the [beginRecoverDeletedSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-beginrecoverdeletedsecret) long running operation (LRO) method of the SecretClient class, chained with the [pollUntilDone](/javascript/api/@azure/keyvault-secrets/pollerlike#@azure-keyvault-secrets-pollerlike-polluntildone) to wait until the recovery is complete. 

The recovered secret has the same:

* `name`
* `value`
* all properties including `enabled`, `createdOn`, `tags`, and `version`

```javascript
const deletedSecretName = 'myDeletedSecret';

// Begin LRO
const recoveryPoller = await client.beginRecoverDeletedSecret(secretName);

// Wait for LRO to complete
const recoveryResult = await recoveryPoller.pollUntilDone();

console.log(`SecretName: ${recoveryResult.name}`);
console.log(`Version: ${recoveryResult.version}`);
```

This `recoveryResult` is a [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object. 

## Purge a secret

To purge a secret in Azure Key Vault immediately, use the [beginDeleteSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-begindeletesecret) method of the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) class. 

The purge operation happens immediately and is irreversible. Consider creating a [backup](javascript-developer-guide-backup-secrets.md) of the secret before purging it. 

```javascript
const deletedSecretName = 'myDeletedSecret';

// Purge
await client.purgeDeletedSecret(mySecretName);
```

## Next steps

* [Find a secret](javascript-developer-guide-find-secret.md)