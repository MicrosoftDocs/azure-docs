---
title: Enable a Azure Key Vault secret with JavaScript
description: Enable or disable a Key Vault secret using JavaScript.
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: secrets
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 05/22/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to enable a secret from the Key Vault with the SDK.
---

# Enable and disable a secret in Azure Key Vault with JavaScript

Create the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then use the client to enable and disable a secret from Azure Key Vault.

## Enable a secret

To enable a secret in Azure Key Vault, use the [updateSecretProperties](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-updatesecretproperties) method of the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) class. 

```javascript
const name = 'mySecret';
const version= 'd9f2f96f120d4537ba7d82fecd913043'

const properties = await client.updateSecretProperties(
    secretName,
    version,
    { enabled: true }
);

// get secret value
const { value } = await client.getSecret(secretName, version);
```

This method returns the [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object. 

## Disable a new secret

To disable a secret when it's created, use the [setSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-setsecret) method with the option for **enabled** set to false.

```javascript
const mySecretName = 'mySecret';
const mySecretValue = 'mySecretValue';

// Success
const { name, value, properties } = await client.setSecret(
    mySecretName, 
    mySecretValue, 
    { enabled: false }
);

// Can't read value of disabled secret
try{
    const secret = await client.getSecret(
        mySecretName, 
        properties.version
    );
} catch(err){
    // `Operation get is not allowed on a disabled secret.`
    console.log(err.message);
}
```

## Disable an existing secret

To disable an existing secret in Azure Key Vault, use the [updateSecretProperties](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-updatesecretproperties) method of the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) class. 

```javascript
const name = 'mySecret';
const version= 'd9f2f96f120d4537ba7d82fecd913043';

// Success
const properties = await client.updateSecretProperties(
    secretName,
    version,
    { enabled: false }
);

// Can't read value of disabled secret
try{
    const { value } = await client.getSecret(secretName, version);
} catch(err){
    // `Operation get is not allowed on a disabled secret.`
    console.log(err.message);
}
```

This method returns the [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object. 

## Next steps

* [Delete secret](javascript-developer-guide-delete-secret.md)