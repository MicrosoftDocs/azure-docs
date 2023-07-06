---
title: Get Azure Key Vault keys with JavaScript
description: Get lastest version or any version of key with JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 07/06/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to get a key to the Key Vault with the SDK.
---

# Get a key in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then use the client to set, update, and rotate a key in Azure Key Vault.

## Get key

You can get the latest version of a key or a specific version of a key with the [getKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-getkey) method. The version is within the [properties](/javascript/api/@azure/keyvault-keys/keyproperties) of the [KeyVaultKey](/javascript/api/@azure/keyvault-keys/keyvaultkey) object.

* Get latest version: `await client.getKey(name);`
* Get specific version: `await client.getKey(name, { version });`

```javascript
// Azure client libraries
import { DefaultAzureCredential } from '@azure/identity';
import {
    KeyClient,
} from '@azure/keyvault-keys';

// Authenticate to Azure Key Vault
const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

const name = `myRsaKey`;

// Get latest key
const latestKey = await client.getKey(name);
console.log(`${latestKey.name} version is ${latestKey.properties.version}`);

// Get previous key by version id
const keyPreviousVersionId = '2f2ec6d43db64d66ad8ffa12489acc8b';
const keyByVersion = await client.getKey(name, {
    version: keyPreviousVersionId
});
console.log(`Previous key version is ${keyByVersion.properties.version}`);
```

## Get all versions of a key

To get all versions of a key in Azure Key Vault, use the [
listPropertiesOfKeyVersions](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-listpropertiesofkeyversions) method of the KeyClient Class to get an iterable list of key's version's properties. This returns a [KeyProperties](/javascript/api/@azure/keyvault-keys/keyproperties) object, which doesn't include the version's value. If you want the version's value, use the version returned in the property to get the key's value with the getKey method.

|Method|Returns value| Returns properties|
|--|--|--|
|[getKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-getKey)|Yes|Yes|
|[listPropertiesOfKeyVersions](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-listpropertiesofkeyversions)|No|Yes|

```javascript
// Azure client libraries
import { DefaultAzureCredential } from '@azure/identity';
import {
    KeyClient,
} from '@azure/keyvault-keys';

// Authenticate to Azure Key Vault
const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

const name = `myRsaKey`;

for await (const keyProperties of client.listPropertiesOfKeyVersions(name)) {
    const thisVersion = keyProperties.version;
    
    const { key } = await client.getKey(name, {
        version: thisVersion
    });

    // do something with version's key value
}
```

## Get disabled key

Use the following table to understand what you can do with a disabled key.

|Allowed|Not allowed|
|--|--|
|Enable key<br>Update properties|Get value|


## Next steps

* [Enabled and disable key from JavaScript SDK](javascript-developer-guide-enable-disable-key.md)