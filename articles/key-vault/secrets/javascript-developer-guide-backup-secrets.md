---
title: Back up Azure Key Vault secret with JavaScript
description: Back up and restore Key Vault secret using JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: secrets
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 05/22/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to backup a secret from the Key Vault with the SDK.
---
# Back up and restore a secret in Azure Key Vault with JavaScript

Create the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then use the client to back up and restore an existing secret from Azure Key Vault.

## Back up a secret

To back up a secret (and all its versions and properties) in Azure Key Vault, use the [backupSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-backupsecret) method of the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) class. 

```javascript
const existingSecretName = 'myExistingSecret';

const backupResult = await client.backupSecret(secretName);
```

This `backupResult` is a Uint8Array, which is also known as a Buffer in Node.js. You can store the result in a blob in [Azure Storage](/azure/storage) or move it to another Key Vault as shown below in the Restore operation.

## Restore a backed-up secret

To restore a backed-up secret (and all its versions and properties) in Azure Key Vault, use the [restoreSecretBackup](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-restoresecretbackup) method of the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) class. 

```javascript
// ... continuing code from previous section

// Restore to different (client2) Key Vault
const recoveryResult = await client2.restoreSecretBackup(backupResult);
```

This `recoveryResult` is a [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object for the current or most recent version. 

## Next steps

* [Find a secret](javascript-developer-guide-find-secret.md)