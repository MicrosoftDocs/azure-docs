---
title: Enable and disable keys using Azure Key Vault keys with JavaScript
description: Enable and disable keys from cryptographic operations with keys in JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 07/06/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to enable and disable cryptographic operations using a key to the Key Vault with the SDK.
---

# Enable and disable a key in Azure Key Vault with JavaScript

To enable a key for use with cryptographic operations in Azure Key Vault, use the [updateKeyProperties](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-updatekeyproperties) method of the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) class. 

## Enable a key

To enable a key in Azure Key Vault, use the [updateKeyProperties](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-updatekeyproperties) method of the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) class. 

```javascript
const properties = await keyClient.updateKeyProperties(
    keyName,
    version, // optional, remove to update the latest version
    { enabled: true }
);
```

Refer to the [update key properties](javascript-developer-guide-create-update-rotate-key.md#update-key-properties) example for the full code example.

## Disable a new key

To disable a new key, use the [createKey](javascript-developer-guide-create-update-rotate-key.md#create-a-key-with-a-rotation-policy) method and use the [createKeyOptions](/javascript/api/%40azure/keyvault-keys/createkeyoptions) to disable the key. 

```javascript
const keyVaultKey = await keyClient.createKey(keyName, keyType, { enabled: false });
```

## Disable an existing key

To disable a key in Azure Key Vault, use the [updateKeyProperties](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-updatekeyproperties) method of the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) class. 

```javascript
const properties = await keyClient.updateKeyProperties(
    keyName,
    version, // optional, remove to update the latest version
    { enabled: false }
);
```

Refer to the [update key properties](javascript-developer-guide-create-update-rotate-key.md#update-key-properties) example for the full code example.

## Next steps

* [List keys with JavaScript SDK](javascript-developer-guide-list-key-version.md)