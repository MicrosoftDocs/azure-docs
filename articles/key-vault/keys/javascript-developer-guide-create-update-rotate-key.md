---
title: Create, update, or rotate Azure Key Vault keys with JavaScript
description: Create or update with the set method, or rotate keys with JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 07/06/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to create, update, or rotate a key to the Key Vault with the SDK.
---

# Create, rotate, and update properties of a key in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then use the client to set, update, and rotate a key in Azure Key Vault.

To rotate a key means to create a new version of the key and set that version as the latest version. The previous version isn't deleted, but it's no longer the active version.

## Create a key with a rotation policy

To create a key in Azure Key Vault, use the [createKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-createkey) method of the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) class. Set any properties with the optional [createKeyOptions](/javascript/api/%40azure/keyvault-keys/createkeyoptions) object. After the key is created, update the key with a rotation policy. 

A [KeyVaultKey](/javascript/api/@azure/keyvault-keys/keyvaultkey) is returned. Update the key using [updateKeyRotationPolicy](/javascript/api/@azure/keyvault-keys/keyclient) with a policy, which includes notification.

Convenience create methods are available for the following key types, which set properties associated with that key type:

* [createKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-createkey)
* [createEcKey](/javascript/api/@azure/keyvault-keys/keyclient#createeckey)
* [createOctKey](/javascript/api/@azure/keyvault-keys/keyclient#createoctkey)
* [createRsaKey](/javascript/api/@azure/keyvault-keys/keyclient#creatersakey)


```javascript
// Azure client libraries
import { DefaultAzureCredential } from '@azure/identity';
import {
  CreateKeyOptions,
  KeyClient,
  KeyRotationPolicyProperties,
  KnownKeyOperations,
  KnownKeyTypes
} from '@azure/keyvault-keys';

// Day/time manipulation
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

// Authenticate to Azure Key Vault
const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

// Name of key
const keyName = `mykey-${Date.now().toString()}`;

// Set key options
const keyOptions: CreateKeyOptions = {
enabled: true,
expiresOn: dayjs().add(1, 'year').toDate(),
exportable: false,
tags: {
    project: 'test-project'
},
keySize: 2048,
keyOps: [
    KnownKeyOperations.Encrypt,
    KnownKeyOperations.Decrypt
    // KnownKeyOperations.Verify,
    // KnownKeyOperations.Sign,
    // KnownKeyOperations.Import,
    // KnownKeyOperations.WrapKey,
    // KnownKeyOperations.UnwrapKey
]
};

// Set key type
const keyType = KnownKeyTypes.RSA; //  'EC', 'EC-HSM', 'RSA', 'RSA-HSM', 'oct', 'oct-HSM'

// Create key
const key = await client.createKey(keyName, keyType, keyOptions);
if (key) {
    // Set rotation policy properties: KeyRotationPolicyProperties
    const rotationPolicyProperties: KeyRotationPolicyProperties = {
        expiresIn: 'P90D',
        lifetimeActions: [
        {
            action: 'Rotate',
            timeAfterCreate: 'P30D'
        },
        {
            action: 'Notify',
            timeBeforeExpiry: dayjs.duration({ days: 7 }).toISOString()
        }
    ]};
    
    // Set rotation policy: KeyRotationPolicy
    const keyRotationPolicy = await client.updateKeyRotationPolicy(
        key.name,
        rotationPolicyProperties
    );
    console.log(keyRotationPolicy);
}
```

## Manually rotate key

When you need to rotate the key, use the [rotateKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-rotatekey) method. This creates a new version of the key and sets that version as the active version. 

```javascript
// Azure client libraries
import { DefaultAzureCredential } from '@azure/identity';
import {
  KeyClient
} from '@azure/keyvault-keys';

// Authenticate to Azure Key Vault
const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

// Get existing key
let key = await client.getKey(`MyKey`);
console.log(key);

if(key?.name){

    // rotate key
    key = await client.rotateKey(key.name);
    console.log(key);
}
```

## Update key properties

Update properties of the latest version of the key with the [updateKeyProperties](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-updatekeyproperties-1) or update a specific version of a key with [updateKeyProperties](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-updatekeyproperties). Any [UpdateKeyPropertiesOptions](/javascript/api/@azure/keyvault-keys/updatekeypropertiesoptions) properties not specified are left unchanged. This doesn't change the key value.

```javascript
// Azure client libraries
import { DefaultAzureCredential } from '@azure/identity';
import {
  KeyClient
} from '@azure/keyvault-keys';

// Authenticate to Azure Key Vault
const credential = new DefaultAzureCredential();
const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

// Get existing key
const key = await client.getKey('MyKey');

if (key) {

    // 
    const updateKeyPropertiesOptions = {
        enabled: false,
        // expiresOn,
        // keyOps,
        // notBefore, 
        // releasePolicy, 
        tags: { 
            ...key.properties.tags, subproject: 'Health and wellness' 
        }
    }
    
    // update properties of latest version
    await client.updateKeyProperties(
        key.name,
        updateKeyPropertiesOptions
    );
    
    // update properties of specific version
    await client.updateKeyProperties(
        key.name,
        key?.properties?.version,
        {
            enabled: true
        }
    );
}
```

## Update key value

To update a key value, use the [rotateKey](#manually-rotate-key) method. Make sure to pass the new value with all the properties you want to keep from the current version of the key. Any current properties not set in additional calls to rotateKey will be lost.

This generates a new version of a key. The returned [KeyVaultKey](/javascript/api/@azure/keyvault-keys/keyvaultkey) object includes the new version ID.

## Next steps

* [Get a key with JavaScript SDK](javascript-developer-guide-get-key.md)