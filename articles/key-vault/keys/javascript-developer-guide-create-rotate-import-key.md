---
title: Create, update, or rotate Azure Key Vault keys with JavaScript
description: Create or update with the set method, or rotate keys with JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 05/22/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to create, update, or rotate a key to the Key Vault with the SDK.
---

# Create, rotate, and import a key in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then use the client to set, update, and rotate a key in Azure Key Vault.


## Create a key with a rotation policy

To create a key in Azure Key Vault, use the [createKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-createkey) method of the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) class. After the key is created, update the key with a rotation policy. 

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
const timestamp: string = Date.now().toString();
const keyName = `mykey-${timestamp}`;

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
        ]
    };
    
    // Set rotation policy: KeyRotationPolicy
    const keyRotationPolicy = await client.updateKeyRotationPolicy(
        key.name,
        rotationPolicyProperties
    );
    console.log(keyRotationPolicy);
}
```

## Manually rotate key

To rotate a key means to create a new version of the key. The previous version isn't deleted, but it's no longer the active version.

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

const keyName = `MyKey`

// Get key
let key = await client.getKey(keyName);
console.log(key);

if(key?.name){

key = await client.rotateKey(key.name);
console.log(key);
}
```

## Next steps

* [Get a key with JavaScript SDK](javascript-developer-guide-get-key.md)