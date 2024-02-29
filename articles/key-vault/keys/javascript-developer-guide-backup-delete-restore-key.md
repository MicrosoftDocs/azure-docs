---
title: Back up and restore keys with Azure Key Vault
description: Back up, delete, restore, and purge keys with Azure Key Vault and the client SDK. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 07/06/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to backup and restore keys using a key to the Key Vault with the SDK.
---

# Back up, delete and restore keys in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then create a [CryptographyClient](/javascript/api/@azure/keyvault-keys/cryptographyclient) use the client to set, update, and rotate a key in Azure Key Vault.

## Back up, delete, purge and restore key

Before deleting a key and its versions, back up the key and serialize to a secure data store. Once the key is backed up, delete the key and all versions. If the vault uses soft-deletes, you can wait for the purge date to pass or purge the key manually. Once the key is purged, you can restore the key and all version from the backup. If you want to restore the key prior to the purge, you don't need to use the backup object but instead you can recover the soft-deleted key and all versions.

```javascript
// Authenticate to Azure Key Vault
const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

// Create key
const keyName = `myKey-${Date.now()}`;
const key = await client.createRsaKey(keyName);
console.log(`${key.name} is created`);

// Backup key and all versions (as Uint8Array)
const keyBackup = await client.backupKey(keyName);
console.log(`${key.name} is backed up`);

// Delete key - wait until delete is complete
await (await client.beginDeleteKey(keyName)).pollUntilDone();
console.log(`${key.name} is deleted`);

// Purge soft-deleted key 
await client.purgeDeletedKey(keyName);
console.log(`Soft-deleted key, ${key.name}, is purged`);

if (keyBackup) {
    // Restore key and all versions to
    // Get last version
    const { name, key, properties } = await client.restoreKeyBackup(keyBackup);
    console.log(`${name} is restored from backup, latest version is ${properties.version}`);
    
    // do something with key
}
```

## Next steps

* [Encrypt and descript key with JavaScript SDK](javascript-developer-guide-encrypt-decrypt-key.md)