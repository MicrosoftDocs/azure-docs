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

A [KeyVaultkey](/javascript/api/@azure/keyvault-keys/keyvaultkey) is returned. Update the key using [updateKeyRotationPolicy](/javascript/api/@azure/keyvault-keys/keyclient) with a policy which includes notification.

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

To rotate a key means to create a new version of the key and set that version as the latest version. The previous version isn't deleted, but it's no longer the active version.

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

## Import a key

A best practice is to allow Key Vault to generate your keys. If you need to migrate a key to Key Vault, the key needs to be in the JWK format with any Base64 values converted to UInt8Array values.

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

const keyName = `MyImportedKey`;

// Key must be converted to Jwk format
const keyInJWKFormat =
{
"p": Buffer.from("21DSdJucATc4p6OyajUDAunbanGfY0TjeELnDUfCrqFElWOX0lSw4Hy52eJkkvahqk6sUrZUa82QhJn607RPQLLIU08OUhbgvLkvhLeQYT38Tzshoefn6IoQypOk0Gn0pQ00A-nVbb7kFLx8PgT-6QA46llOqF5FZ395NjzW3V8", "base64"),
"kty": "RSA",
"q": Buffer.from("z1VpOnSDbcQWjuLzjDEyLWKCxskd00r2bzvYtyS593c4qD1KrguiO-3HWLtMIz5vv3861892IT6XvLJYZLR5inoXfEIpKY-0DSLC5vXtbyvbJoHm72ONJpZRP-6iVHsyNrIm6ZjKi4xKip8fulGcwXwSHA4NgC5X9cwKcAmPxo0", "base64"),
"d": Buffer.from("OcfB9Yv8qgB3p4LHK0pBYl1B3zhM80mq9_lk-6dewc9UZtNaWhc8j6H3IFFT2CdSFobywV87YUXcOpawEVcKCuXaXy5N2aO9qa-xz5yQYacV3T3DALgAyLPwW0AqN0l2neRPTmu38PqRl7_s1-7Y4XYmx8Cn1mELXNw_MURBRtA7DY-qLd_31OdxR37NUYfWmMWCC37DzMDXuoaWIOIPnZ0QUW2MTt4YXMOYD22dZWV5JFtrFPCb19E2FjlgT4oS4N0AUFldVq73fx8igXNAzq3dDSudg3q8eNWxsO9OCkw38rYgK2A5Fw4Km324JaPuZfuN8SlrMo5A_VXKRobp2Q", "base64"),
"e": Buffer.from("AQAB", "base64"),
"use": "enc",
"qi": Buffer.from("HfdGlVI9nKucgkHj9qQJJpwQG8a0DWiZQ8BwnHjgUwQCN7d85Vzc7gr-bidpg3NRRo1yVeeS7NO0wFpYMVUCoeh8Q6UdhhFz_C8gzzWHETPeJ6vV-3oKMaVXweFU16hwCrUI-rOTuoYTkARnNr-ZNjsgTYMbLVtJOgO8wF402rI", "base64"),
"dp": Buffer.from("yulVPjP2u5022st2uBMCDUEHE826VSMYfl0P3talBeMJTFpPznczCw_6998hhGORobuWbhRpuTAA5N5-Fj8-EDMZaxK6wjKOja2cjGM1vvKVrUydSmoAw8Jx1KuTkoxloAu-M1y2bgpuhcz5-nuuyS6-efxU7SwDdMWZBRh3B2s", "base64"),
"alg": Buffer.from("RSA1_5", "base64"),
"dq": Buffer.from("FqRYMocI11Ljt8T3Hec9eJFagMTz2eBE207o0s9S88B0UoMnBazFkc_cxkbmAK9P2tTVIz5Hw0enoHbFinHfGA1PRUWgYyaLXifeqwROYqaibykehCQWBRHDW7z-w0UU7b4026vQ6r5uYYcRGvLQsJyRCblLJiVpe7FFroiMx_0", "base64"),
"n": Buffer.from("sZ-GKGT9icg6-74JLMuRoRiPMJ9r0MSG8T8XAg7ANx46EqhX3kzoUYqFrV2tSD4VqSVlgg8pyDm0bTZeT8t-ScCWsIz8snWAqNmIOSOOSURO33c0_1Pe0XQSGTL96oBv6E6kqdSVSuypcAqfTB2Ms8XukCl-taUGFkId918fV4cDvBWdekaf1DbmG3D05vjfqNG-ZXYnJlgRG4Soz5RrNEWkftcdWcj8Jg7kDCYKXCcYJbyaT13vdW7A10_gY6AgmZT0Y2DJeb8qyhMT_WPnXz8fURbE8U2-fLcKXD-RFUJcHOYftcKM9dF-8UUNI_64kegynTJNdjaLv89LsKBnUw", "base64"),
}
const key = await client.importKey(keyName, keyInJWKFormat);
console.log(key);
```

## Next steps

* [Get a key with JavaScript SDK](javascript-developer-guide-get-key.md)