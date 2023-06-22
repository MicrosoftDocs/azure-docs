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

## Set a key

To set a key in Azure Key Vault, use the [setKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-setkey) method of the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) class. 

The key value type is a string. The initial value can be anything that can be serialized to a string such as JSON or BASE64 encoded data. You need to provide the serialization before setting the key in the Key Vault and deserialization after getting the key from the Key Vault.

```javascript
const name = 'myKey';
const value = 'myKeyValue'; // or JSON.stringify({'key':'value'})

const { name, value, properties } = await client.setKey(
    keyName,
    keyValue
); 
```

When you create the key, the [KeyVaultKey](/javascript/api/@azure/keyvault-keys/keyvaultkey) response includes a [KeyProperties](/javascript/api/@azure/keyvault-keys/keyproperties) object that includes the key's metadata such as:

* `createdOn`: UTC date and time the key was created. 
* `id`: Key's full URL.
* `recoverableDays`: Number of days the key can be recovered after deletion.
* `recoveryLevel`: Values include: 'Purgeable', 'Recoverable+Purgeable', 'Recoverable', 'Recoverable+ProtectedSubscription'. 
* `updatedOn`: UTC date and time the key was last updated.
* `version`: Key's version. 

## Set a key with properties

Use the [setKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-setkey) method of the KeyClient class with the [SetKeyOptions](/javascript/api/@azure/keyvault-keys/setkeyoptions) to include optional parameters that live with the key such as: 

* `contentType`: Your representation and understanding of the key's content type. Suggestions for use include a native type, your own custom TypeScript type, or a MIME type. This value is visible in the Azure portal.
* `enabled`: Defaults to true.
* `expiresOn`: UTC date and time the key expires.
* `notBefore`: UTC date and time before which the key can't be used.
* `tags`: Custom name/value pairs that you can use to associate with the key.

```javascript
const name = 'myKey';
const value = JSON.stringify({
    'mykey':'myvalue', 
    'myEndpoint':'https://myendpoint.com'
});
const keyOptions = {
    // example options
    contentType: 'application/json',
    tags: { 
        project: 'test-cluster', 
        owner: 'jmclane',
        team: 'devops'
    }
};

const { name, value, properties } = await client.setKey(
    keyName,
    keyValue, 
    keyOptions
);
```

This method returns the [KeyVaultKey](/javascript/api/@azure/keyvault-keys/keyvaultkey) object. 

## Update key value

To update a **key value**, use the [setKey](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-setkey) method shown in the [previous section](#set-a-key-with-properties). Make sure to pass the new value as a string and _all_ the properties you want to keep from the current version of the key. Any current properties not set in additional calls to setKey will be lost. 

This generates a new version of a key. The returned [KeyProperties](/javascript/api/@azure/keyvault-keys/keyproperties) object includes the new version Id.

## Update key properties

To update a key's properties, use the [updateKeyProperties](/javascript/api/@azure/keyvault-keys/keyclient#@azure-keyvault-keys-keyclient-updatekeyproperties) method of the KeyClient class. Properties that aren't specified in the request are left unchanged. The value of a key itself can't be changed. This operation requires the keys/set permission.

```javascript
const name = 'myKey';

// Update tags
const updatedTagName = 'existingTag';
const updatedTagValue = key.properties.version.tags[updatedTagName] + ' additional information';

// Use version from existing key
const version = key.properties.version;

// Options to update
const keyOptions = {
    tags: {
        'newTag': 'newTagValue', // Set new tag
        'updatedTag': updatedTagValue // Update existing tag
    },
    enabled: false
}

// Update key's properties - doesn't change key name or value
const properties = await client.updateKeyProperties(
    keyName,
    keyVersion,
    keyOptions,
);
```

This method returns the [KeyProperties](/javascript/api/@azure/keyvault-keys/keyproperties) object. 

## Rotate a key

To rotate a key, you need to create an Event Grid event subscription for KeyNearExpiry event and provide the rotation functionality that should be called with the event triggers. Use one of the following tutorials **Automate the rotation of a key for resources** that use:

* [One set of authentication credentials](tutorial-rotation.md)
* [Two sets of authentication credentials](tutorial-rotation-dual.md)

## Next steps

* [Get a key with JavaScript SDK](javascript-developer-guide-get-key.md)