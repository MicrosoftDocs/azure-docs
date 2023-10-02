---
title: Encrypt and decrypt using Azure Key Vault keys with JavaScript
description: Encrypt and decrypt data with keys in JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 07/06/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to encrypt and decrypt data using a key to the Key Vault with the SDK.
---

# Encrypt and decrypt data using a key in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then create a [CryptographyClient](/javascript/api/@azure/keyvault-keys/cryptographyclient) use the client to set, update, and rotate a key in Azure Key Vault.

## Select an encryption algorithm

To make the best use of the SDK and its provided enums and types, select your encryption algorithm before continuing to the next section. 

* RSA - Rivest–Shamir–Adleman
* AES GCM - Advanced Encryption Standard Galois Counter Mode
* AES CBC - Advanced Encryption Standard Cipher Block Chaining

Use the [KnownEncryptionAlgorithms](/javascript/api/@azure/keyvault-keys/knownencryptionalgorithms) enum to select a specific algorithm. 

```javascript
import {
  KnownEncryptionAlgorithms
} from '@azure/keyvault-keys';

const myAlgorithm = KnownEncryptionAlgorithms.RSAOaep256
```

## Get encryption key

[Create](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-createkey) or [get](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-getkey) your [KeyVaultKey](/javascript/api/@azure/keyvault-keys/keyvaultkey) encryption key from the Key Vault to use with encryption and decryption.

## Encrypt and decrypt with a key

Encryption requires one of the following parameter objects:

* [RsaEncryptParameters](/javascript/api/@azure/keyvault-keys/rsaencryptparameters)
* [AesGcmEncryptParameters](/javascript/api/@azure/keyvault-keys/aesgcmdecryptparameters)
* [AesCbcEncryptParameters](/javascript/api/@azure/keyvault-keys/aescbcencryptparameters)

All three parameter objects require the `algorithm` and the `plaintext` used to encrypt. An example of RSA encryption parameters is shown below.

```javascript
import { DefaultAzureCredential } from '@azure/identity';
import {
  CryptographyClient,
  KeyClient,
  KnownEncryptionAlgorithms
} from '@azure/keyvault-keys';

// get service client using AZURE_KEYVAULT_NAME environment variable
const credential = new DefaultAzureCredential();
const serviceClient = new KeyClient(
`https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
credential
);

// get existing key
const keyVaultKey = await serviceClient.getKey('myRsaKey');

if (keyVaultKey?.name) {

    // get encryption client
    const encryptClient = new CryptographyClient(keyVaultKey, credential);
    
    // set data to encrypt
    const originalInfo = 'Hello World';
    
    // set encryption algorithm
    const algorithm = KnownEncryptionAlgorithms.RSAOaep256;
    
    // encrypt settings: RsaEncryptParameters | AesGcmEncryptParameters | AesCbcEncryptParameters
    const encryptParams = {
        algorithm,
        plaintext: Buffer.from(originalInfo)
    };
    
    // encrypt
    const encryptResult = await encryptClient.encrypt(encryptParams);
    
    // ... hand off encrypted result to another process
    // ... other process needs to decrypt data

    // decrypt settings: DecryptParameters
    const decryptParams = {
        algorithm,
        ciphertext: encryptResult.result
    };
    
    // decrypt
    const decryptResult = await encryptClient.decrypt(decryptParams);
    console.log(decryptResult.result.toString());
}
```

The **encryptParams** object sets the parameters for encryption. Use the following encrypt parameter objects to set properties.

* [RsaEncryptParameters](/javascript/api/@azure/keyvault-keys/rsaencryptparameters)
* [AesGcmEncryptParameters](/javascript/api/@azure/keyvault-keys/aesgcmencryptparameters)
* [AesCbcEncryptParameters](/javascript/api/@azure/keyvault-keys/aescbcencryptparameters)

The **decryptParams** object sets the parameters for decryption. Use the following decrypt parameter objects to set properties.

* [RsaDecryptParameters](/javascript/api/@azure/keyvault-keys/rsadecryptparameters)
* [AesGcmDecryptParameters](/javascript/api/@azure/keyvault-keys/aesgcmdecryptparameters)
* [AesCbcDecryptParameters](/javascript/api/@azure/keyvault-keys/aescbcdecryptparameters)

## Next steps

* [Sign and verify with key with JavaScript SDK](javascript-developer-guide-sign-verify-key.md)