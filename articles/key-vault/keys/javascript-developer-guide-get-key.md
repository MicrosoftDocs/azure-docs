---
title: Get Azure Key Vault keys with JavaScript
description: Get lastest version or any version of key with JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 05/22/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to get a key to the Key Vault with the SDK.
---

# Get a key in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then use the client to set, update, and rotate a key in Azure Key Vault.

## Get key

You can get the latest version of a key or a specific version of a key. The version is within the [properties](/javascript/api/@azure/keyvault-keys/keyproperties) of the [KeyVaultKey](/javascript/api/@azure/keyvault-keys/keyvaultkey) object.

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

## Next steps

* [Get a key with JavaScript SDK](javascript-developer-guide-get-key.md)