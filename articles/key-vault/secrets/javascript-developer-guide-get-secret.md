---
title: Get Azure Key Vault secret with JavaScript
description: Get the current secret or a specific version of a secret in Azure Key Vault with JavaScript.
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: secrets
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 05/22/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to get a secret from the Key Vault with the SDK.
---

# Get a secret from Azure Key Vault with JavaScript

Create the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then use the client to get a secret from Azure Key Vault.

## Get current version of secret

To get a secret in Azure Key Vault, use the [getSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-getSecret) method of the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) class. 

```javascript
const name = 'mySecret';

const { name, properties, value } = await client.getSecret(secretName);
```

This method returns the [KeyVaultSecret](/javascript/api/@azure/keyvault-secrets/keyvaultsecret) object. 

## Get any version of secret

To get a specific version of a secret in Azure Key Vault, use the [GetSecretOptions](/javascript/api/@azure/keyvault-secrets/getsecretoptions) object when you call the [getSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-getSecret) method of the SecretClient class. This method returns the [KeyVaultSecret](/javascript/api/@azure/keyvault-secrets/keyvaultsecret) object. 

```javascript
const name = 'mySecret';
const options = {
    version: 'd9f2f96f120d4537ba7d82fecd913043'
};
 
const { name, properties, value } = await client.getSecret(secretName, options);
```

This method returns the [KeyVaultSecret](/javascript/api/@azure/keyvault-secrets/keyvaultsecret) object. 

## Get all versions of a secret

To get all versions of a secret in Azure Key Vault, use the [listPropertiesOfSecretVersions](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-listpropertiesofsecretversions) method of the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) Class to get an iterable list of secret's version's properties. This returns a [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object, which doesn't include the version's value. If you want the version's value, use the **version** returned in the property to get the secret's value with the [getSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-getSecret) method.

|Method|Returns value| Returns properties|
|--|--|--|
|[getSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-getSecret)|Yes|Yes|
|[listPropertiesOfSecretVersions](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-listpropertiesofsecretversions)|No|Yes|


```javascript
const versions = [];

for await (const secretProperties of client.listPropertiesOfSecretVersions(
secretName
)) {
    const { value } = await client.getSecret(secretName, {
        version: secretProperties?.version,
    });

    versions.push({
        name: secretName,
        version: secretProperties?.version,
        value: value,
        createdOn: secretProperties?.createdOn,
    });
}
```

## Get disabled secret

Use the following table to understand what you can do with a disabled secret.

|Allowed|Not allowed|
|--|--|
|Enable secret<br>Update properties|Get value|

## Next steps

* [Enable and disable secret](javascript-developer-guide-enable-disable-secret.md)