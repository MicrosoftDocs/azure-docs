---
title: Encrypt and decrypt using Azure Key Vault keys with JavaScript
description: Encrypt and decrypt data with keys in JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 06/21/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to encrypt and decrypt data using a key to the Key Vault with the SDK.
---

# List keys and versions in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then create a [CryptographyClient]() use the client to set, update, and rotate a key in Azure Key Vault.

## List all keys

List current version of all keys that are not deleted. 



```javascript
import { KeyClient, CreateKeyOptions, KeyVaultKey } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const vaultName = process.env.AZURE_KEYVAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new KeyClient(url, credential);

// Get latest version of not-deleted keys 
for await (const keyProperties of client.listPropertiesOfKeys()) {
    console.log(keyProperties);
}
```

## List all keys with paging

```javascript
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const vaultName = process.env.AZURE_KEYVAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new KeyClient(url, credential);

let page=1;
const maxPageSize=5;

// Get latest version of not-deleted keys 
for await (const keyProperties of client.listPropertiesOfKeys().byPage({maxPageSize})) {
    console.log(`Page ${page++} ---------------------`)
    
    for (const props of keyProperties) {
        console.log(`${props.name}`);
    }
}
```

## List all versions of all keys

```javascript
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const vaultName = process.env.AZURE_KEYVAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new KeyClient(url, credential);

// Get latest version of not-deleted keys 
for await (const keyProperties of client.listPropertiesOfKeys()) {

    console.log(keyProperties.name);

    // Get all versions of key
    for await (const versionProperties of client.listPropertiesOfKeyVersions(
        keyProperties.name
    )) {
        console.log(`\tversion: ${versionProperties.version} created on ${versionProperties.createdOn}`);
    }
}
```

Refer to the [List all keys with paging](#list-all-keys-with-paging) example to see how to page through the results.

## List all deleted but not yet purged keys

```javascript
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const vaultName = process.env.AZURE_KEYVAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new KeyClient(url, credential);

for await (const deletedKey of client.listDeletedKeys()) {
    console.log(
        `Deleted: ${deletedKey.name} deleted on ${deletedKey.properties.deletedOn}, to be purged on ${deletedKey.properties.scheduledPurgeDate}`
    );
}
```

Refer to the [List all keys with paging](#list-all-keys-with-paging) example to see how to page through the results.

## Next steps

* [Get a key with JavaScript SDK](javascript-developer-guide-get-key.md)