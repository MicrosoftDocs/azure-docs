---
title: Find or list Azure Key Vault secrets with JavaScript
description: Find a set of secrets or list secrets or secret version in a Key Vault JavaScript.
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: secrets
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 05/22/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to find or list a secret from the Key Vault with the SDK.
---
# List or find a secret in Azure Key Vault with JavaScript

Create the [SecretClient](/javascript/api/@azure/keyvault-secrets/secretclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then use the client to find a secret from Azure Key Vault.

All list methods return an iterable. You can get all items in the list or chain the [byPage](/javascript/api/@azure/core-paging/pagedasynciterableiterator#@azure-core-paging-pagedasynciterableiterator-bypage) method to iterate a page of items at a time. 

Once you have a secret's properties, you can then use the [getSecret](javascript-developer-guide-get-secret.md#get-current-version-of-secret) method to get the secret's value.

## List all secrets

To list all secrets in Azure Key Vault, use the [listPropertiesOfSecrets](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-listpropertiesofsecrets) method to get a current secret's properties.

```javascript
for await (const secretProperties of client.listPropertiesOfSecrets()){

  // do something with properties
  console.log(`Secret name: ${secretProperties.name}`);

}
```

This method returns the [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object. 


## List all secrets by page

To list all secrets in Azure Key Vault, use the [listPropertiesOfSecrets](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-listpropertiesofsecrets) method to get secret properties a page at a time by setting the [PageSettings](/javascript/api/@azure/core-paging/pagesettings) object.

```javascript
// 5 secrets per page
const maxResults = 5;
let pageCount = 1;
let itemCount=1;

// loop through all secrets
for await (const page of client.listPropertiesOfSecrets().byPage({ maxPageSize: maxResults })) {

  let itemOnPageCount = 1;

  // loop through each secret on page
  for (const secretProperties of page) {
    
    console.log(`Page:${pageCount++}, item:${itemOnPageCount++}:${secretProperties.name}`);
    
    itemCount++;
  }
}
console.log(`Total # of secrets:${itemCount}`);
```

This method returns the [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object. 

## List all versions of a secret

To list all versions of a secret in Azure Key Vault, use the [listPropertiesOfSecretVersions](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-listpropertiesofsecretversions) method. 

```javascript
for await (const secretProperties of client.listPropertiesOfSecretVersions(secretName)) {

  // do something with version's properties
  console.log(`Version created on: ${secretProperties.createdOn.toString()}`);
}
```

This method returns the [SecretProperties](/javascript/api/@azure/keyvault-secrets/secretproperties) object. 

## List deleted secrets

To list all deleted secrets in Azure Key Vault, use the [listDeletedSecrets]() method. 

```javascript
// 5 secrets per page
const maxResults = 5;
let pageCount = 1;
let itemCount=1;

// loop through all secrets
for await (const page of client.listDeletedSecrets().byPage({ maxPageSize: maxResults })) {

  let itemOnPageCount = 1;

  // loop through each secret on page
  for (const secretProperties of page) {
    
    console.log(`Page:${pageCount++}, item:${itemOnPageCount++}:${secretProperties.name}`);
    
    itemCount++;
  }
}
console.log(`Total # of secrets:${itemCount}`);
```

The secretProperties object is a [DeletedSecret](/javascript/api/@azure/keyvault-secrets/deletedsecret) object.  

## Find secret by property

To find the current (most recent) version of a secret, which matches a property name/value, loop over all secrets and compare the properties. The following JavaScript code finds all enabled secrets. 

This code uses the following method in a loop of all secrets:

* [listPropertiesOfSecrets()](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-listpropertiesofsecrets) - returns latest version's property object per secret


```javascript

const secretsFound = [];

const propertyName = "enabled"
const propertyValue = false;

for await (const secretProperties of client.listPropertiesOfSecrets()){

  if(propertyName === 'tags'){
    if(JSON.stringify(secretProperties.tags) === JSON.stringify(propertyValue)){
      secretsFound.push( secretProperties.name )
    }
  } else {
    if(secretProperties[propertyName].toString() === propertyValue.toString()){
      secretsFound.push( secretProperties.name )
    }
  }
}

console.log(secretsFound)
/*
[
  'my-secret-1683734823721',
  'my-secret-1683735278751',
  'my-secret-1683735523489',
  'my-secret-1684172237551'
]
*/
```

## Find versions by property

To find all versions, which match a property name/value, loop over all secret versions and compare the properties. 

This code uses the following methods in a nested loop:

* [listPropertiesOfSecrets()](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-listpropertiesofsecrets) - returns latest versions's property object per secret
* [listPropertiesOfSecretVersions()](/javascript/api/@azure/keyvault-secrets/secretclient#@azure-keyvault-secrets-secretclient-listpropertiesofsecretversions) - returns all versions for 1 secret

```javascript
const secretsFound = [];

const propertyName = 'createdOn';
const propertyValue = 'Mon May 15 2023 20:52:37 GMT+0000 (Coordinated Universal Time)';

for await (const { name } of client.listPropertiesOfSecrets()){

  console.log(`Secret name: ${name}`);

  for await (const secretProperties of client.listPropertiesOfSecretVersions(name)) {
  
    console.log(`Secret version ${secretProperties.version}`);

    if(propertyName === 'tags'){
      if(JSON.stringify(secretProperties.tags) === JSON.stringify(propertyValue)){
        console.log(`Tags match`);
        secretsFound.push({ name: secretProperties.name, version: secretProperties.version });
      }
    } else {
      if(secretProperties[propertyName].toString() === propertyValue.toString()){
        console.log(`${propertyName} matches`);
        secretsFound.push({ name: secretProperties.name, version: secretProperties.version });
      }
    }
  }
}

console.log(secretsFound);
/*
[
  {
    name: 'my-secret-1684183956189',
    version: '93beaec3ff614be9a67cd2f4ef4d90c5'
  }
]
*/
```

## Next steps

* [Back up and restore secret](javascript-developer-guide-backup-secrets.md)