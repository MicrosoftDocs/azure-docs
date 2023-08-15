---
title: Create, update, or rotate Azure Key Vault secrets with JavaScript
description: Create or update with the set method, or rotate secrets with JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: secrets
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 05/22/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to create, update, or rotate a secret to the Key Vault with the SDK.
---

# Set, update, and rotate a secret in Azure Key Vault with JavaScript

Create the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then use the client to set, update, and rotate a secret in Azure Key Vault.

## Set a secret

To set a secret in Azure Key Vault, use the [setSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-setsecret) method of the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) class. 

The secret value type is a string. The initial value can be anything that can be serialized to a string such as JSON or BASE64 encoded data. You need to provide the serialization before setting the secret in the Key Vault and deserialization after getting the secret from the Key Vault.

```javascript
const name = 'mySecret';
const value = 'mySecretValue'; // or JSON.stringify({'key':'value'})

const { name, value, properties } = await client.setSecret(
    secretName,
    secretValue
); 
```

When you create the secret, the [KeyVaultSecret](/javascript/api/@azure/keyvault-secrets/keyvaultsecret) response includes a [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object that includes the secret's metadata such as:

* `createdOn`: UTC date and time the secret was created. 
* `id`: Secret's full URL.
* `recoverableDays`: Number of days the secret can be recovered after deletion.
* `recoveryLevel`: Values include: 'Purgeable', 'Recoverable+Purgeable', 'Recoverable', 'Recoverable+ProtectedSubscription'. 
* `updatedOn`: UTC date and time the secret was last updated.
* `version`: Secret's version. 

## Set a secret with properties

Use the [setSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-setsecret) method of the SecretClient class with the [SetSecretOptions](/javascript/api/@azure/keyvault-secrets/setsecretoptions) to include optional parameters that live with the secret such as: 

* `contentType`: Your representation and understanding of the secret's content type. Suggestions for use include a native type, your own custom TypeScript type, or a MIME type. This value is visible in the Azure portal.
* `enabled`: Defaults to true.
* `expiresOn`: UTC date and time the secret expires.
* `notBefore`: UTC date and time before which the secret can't be used.
* `tags`: Custom name/value pairs that you can use to associate with the secret.

```javascript
const name = 'mySecret';
const value = JSON.stringify({
    'mykey':'myvalue', 
    'myEndpoint':'https://myendpoint.com'
});
const secretOptions = {
    // example options
    contentType: 'application/json',
    tags: { 
        project: 'test-cluster', 
        owner: 'jmclane',
        team: 'devops'
    }
};

const { name, value, properties } = await client.setSecret(
    secretName,
    secretValue, 
    secretOptions
);
```

This method returns the [KeyVaultSecret](/javascript/api/@azure/keyvault-secrets/keyvaultsecret) object. 

## Update secret value

To update a **secret value**, use the [setSecret](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-setsecret) method shown in the [previous section](#set-a-secret-with-properties). Make sure to pass the new value as a string and _all_ the properties you want to keep from the current version of the secret. Any current properties not set in additional calls to setSecret will be lost. 

This generates a new version of a secret. The returned [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object includes the new version Id.

## Update secret properties

To update a secret's properties, use the [updateSecretProperties](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-updatesecretproperties) method of the SecretClient class. Properties that aren't specified in the request are left unchanged. The value of a secret itself can't be changed. This operation requires the secrets/set permission.

```javascript
const name = 'mySecret';

// Update tags
const updatedTagName = 'existingTag';
const updatedTagValue = secret.properties.version.tags[updatedTagName] + ' additional information';

// Use version from existing secret
const version = secret.properties.version;

// Options to update
const secretOptions = {
    tags: {
        'newTag': 'newTagValue', // Set new tag
        'updatedTag': updatedTagValue // Update existing tag
    },
    enabled: false
}

// Update secret's properties - doesn't change secret name or value
const properties = await client.updateSecretProperties(
    secretName,
    secretVersion,
    secretOptions,
);
```

This method returns the [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object. 

## Rotate a secret

To rotate a secret, you need to create an Event Grid event subscription for SecretNearExpiry event and provide the rotation functionality that should be called with the event triggers. Use one of the following tutorials **Automate the rotation of a secret for resources** that use:

* [One set of authentication credentials](tutorial-rotation.md)
* [Two sets of authentication credentials](tutorial-rotation-dual.md)

## Next steps

* [Get a secret with JavaScript SDK](javascript-developer-guide-get-secret.md)