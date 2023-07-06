---
title: List keys using Azure Key Vault keys with JavaScript
description: List keys in JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 07/06/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to list keys to the Key Vault with the SDK.
---

# List keys and versions in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault).

## List all keys

List current version of all keys with the iterable [listPropertiesOfKeys](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-listpropertiesofkeys). 

```javascript
import { KeyClient, CreateKeyOptions, KeyVaultKey } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

// Get latest version of (not soft-deleted) keys 
for await (const keyProperties of client.listPropertiesOfKeys()) {
    console.log(keyProperties.version);
}
```

The returned [KeyProperties](/javascript/api/@azure/keyvault-keys/keyproperties) object includes the key version. 

## List all keys by page

To list all keys in Azure Key Vault, use the [listPropertiesOfKeys](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-listpropertiesofkeys) method to get secret properties a page at a time by setting the [PageSettings](/javascript/api/@azure/core-paging/pagesettings) object.

```javascript
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

let page = 1;
const maxPageSize = 5;

// Get latest version of not-deleted keys 
for await (const keyProperties of client.listPropertiesOfKeys().byPage({maxPageSize})) {
    console.log(`Page ${page++} ---------------------`)
    
    for (const props of keyProperties) {
        console.log(`${props.name}`);
    }
}
```

The returned [KeyProperties](/javascript/api/@azure/keyvault-keys/keyproperties) object includes the key version. 

## List all versions of a key

To list all versions of a key in Azure Key Vault, use the [listPropertiesOfKeyVersions](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-listpropertiesofkeyversions) method.

```javascript
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

// Get all versions of key
for await (const versionProperties of client.listPropertiesOfKeyVersions(
    keyName
)) {
    console.log(`\tversion: ${versionProperties.version} created on ${versionProperties.createdOn}`);
}
```

The returned [KeyProperties](/javascript/api/@azure/keyvault-keys/keyproperties) object includes the key version. 

Refer to the [List all keys by page](#list-all-keys-by-page) example to see how to page through the results.

## List deleted keys

To list all deleted keys in Azure Key Vault, use the [listDeletedKeys](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-listdeletedkeys) method.

```javascript
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

for await (const deletedKey of client.listDeletedKeys()) {
    console.log(
        `Deleted: ${deletedKey.name} deleted on ${deletedKey.properties.deletedOn}, to be purged on ${deletedKey.properties.scheduledPurgeDate}`
    );
}
```
The deletedKey object is a [DeletedKey](/javascript/api/@azure/keyvault-keys/deletedkey) object which includes the KeyProperties object with additional properties such as: 

* `deletedOn` - The time when the key was deleted.
* `scheduledPurgeDate` - The date when the key is scheduled to be purged. After a key is purged, it cannot be [recovered](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-beginrecoverdeletedkey). If you [backed up the key](javascript-developer-guide-backup-delete-restore-key.md), you can restore it with the same name and all its versions.

Refer to the [List all keys by page](#list-all-keys-by-page) example to see how to page through the results.

## Next steps

* [Import key with JavaScript SDK](javascript-developer-guide-import-key.md)