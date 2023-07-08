---
title: Sign and verify using Azure Key Vault keys with JavaScript
description: Sign and verify data with keys in JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 07/06/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to sign and verify data using a key to the Key Vault with the SDK.
---

# Sign and verify data using a key in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then create a [CryptographyClient](/javascript/api/@azure/keyvault-keys/cryptographyclient) use the client to set, update, and rotate a key in Azure Key Vault.

## Signing data

A few suggestions for signing data:

* Hash large data before signing 
* Hash one-way data before signing such as passwords
* Small 2-way data can be signed directly


## Sign and verify large or one-way data with key

To sign and verify your digested message, use the following methods:

For digested messages: 
* [sign](/javascript/api/@azure/keyvault-keys/cryptographyclient#@azure-keyvault-keys-cryptographyclient-sign) to sign the digest of a message. This is useful for large data or one-way data such as passwords.
* [verify](/javascript/api/@azure/keyvault-keys/cryptographyclient#@azure-keyvault-keys-cryptographyclient-verify) to verify the digest of a message.

```javascript
import { createHash } from "crypto";
import { DefaultAzureCredential } from '@azure/identity';
import {
  CryptographyClient,
  KeyClient,
  KnownSignatureAlgorithms
} from '@azure/keyvault-keys';

// get service client
const credential = new DefaultAzureCredential();
const serviceClient = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

// get existing key
const keyVaultKey = await serviceClient.getKey('MyRsaKey');

if (keyVaultKey?.name) {

    // get encryption client with key
    const cryptoClient = new CryptographyClient(keyVaultKey, credential);
    
    // get digest
    const digestableData = "MyLargeOrOneWayData";
    const digest = createHash('sha256')
      .update(digestableData)
      .update(process.env.SYSTEM_SALT || '')
      .digest();
    
    // sign digest
    const { result: signature } = await cryptoClient.sign(KnownSignatureAlgorithms.RS256, digest);
   
    // store signed digest in database

    // verify signature
    const { result: verified } = await cryptoClient.verify(KnownSignatureAlgorithms.RS256, digest, signature);
    console.log(`Verification ${verified ? 'succeeded' : 'failed'}.`);
}
```

## Sign and verify small data with key

To sign and verify your data, use the following methods:

For data:
* [signData](/javascript/api/@azure/keyvault-keys/cryptographyclient#@azure-keyvault-keys-cryptographyclient-signdata) to sign a block of data. 
* [verifyData](/javascript/api/@azure/keyvault-keys/cryptographyclient#@azure-keyvault-keys-cryptographyclient-verifydata) to verify data.

```javascript
import { createHash } from "crypto";
import { DefaultAzureCredential } from '@azure/identity';
import {
  CryptographyClient,
  KeyClient,
  KnownSignatureAlgorithms
} from '@azure/keyvault-keys';

// get service client
const credential = new DefaultAzureCredential();
const serviceClient = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
);

// get existing key
const keyVaultKey = await serviceClient.getKey('MyRsaKey');

if (keyVaultKey?.name) {

    // get encryption client with key
    const cryptoClient = new CryptographyClient(keyVaultKey, credential);
    
    const data = 'Hello you bright big beautiful world!';
    
    // sign
    const { result: signature } = await cryptoClient.signData(
        KnownSignatureAlgorithms.RS256,
        Buffer.from(data, 'utf8')
    );
    
    // verify signature
    const { result: verified } = await cryptoClient.verifyData(
        KnownSignatureAlgorithms.RS256,
        Buffer.from(data, 'utf8'),
        signature
    );
    console.log(`Verification ${verified ? 'succeeded' : 'failed'}.`);
}
```

## Next steps

* [Key types, algorithms, and operations](about-keys-details.md)