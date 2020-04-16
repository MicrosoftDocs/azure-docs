---
title: About Azure Key Vault secrets - Azure Key Vault
description: Overview of Azure Key Vault REST interface and developer details for secrets.
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: secrets
ms.topic: overview
ms.date: 09/04/2019
ms.author: mbaldwin
---

# About Azure Key Vault secrets

Azure Key Vault enables Microsoft Azure applications and users to store and use several types of secret data:

- Secrets: Provides secure storage of secrets, such as passwords and database connection strings.

- Azure Storage: Can manage keys of an Azure Storage account for you. Internally, Key Vault can list (sync) keys with an Azure Storage Account, and regenerate (rotate) the keys periodically. 

For more general information about Key Vault, see [What is Azure Key Vault?](/azure/key-vault/key-vault-overview)

## Azure Key Vault

The following sections offer general information applicable across the implementation of the Key Vault service. 

### Objects, identifiers, and versioning

Objects stored in Key Vault are versioned whenever a new instance of an object is created. Each version is assigned a unique identifier and URL. When an object is first created, it's given a unique version identifier and marked as the current version of the object. Creation of a new instance with the same object name gives the new object a unique version identifier, causing it to become the current version.  

Objects in Key Vault can be addressed using the current identifier or a version-specific identifier. For example, given a Key with the name `MasterKey`, performing operations with the current identifier causes the system to use the latest available version. Performing operations with the version-specific identifier causes the system to use that specific version of the object.  

Objects are uniquely identified within Key Vault using a URL. No two objects in the system have the same URL, regardless of geo-location. The complete URL to an object is called the Object Identifier. The URL consists of a prefix that identifies the Key Vault, object type, user provided Object Name, and an Object Version. The Object Name is case-insensitive and immutable. Identifiers that don't include the Object Version are referred to as Base Identifiers.  

For more information, see [Authentication, requests, and responses](../general/authentication-requests-and-responses.md)

An object identifier has the following general format:  

`https://{keyvault-name}.vault.azure.net/{object-type}/{object-name}/{object-version}`  

Where:  

|||  
|-|-|  
|`keyvault-name`|The name for a key vault in the Microsoft Azure Key Vault service.<br /><br /> Key Vault names are selected by the user and are globally unique.<br /><br /> Key Vault name must be a 3-24 character string, containing only 0-9, a-z, A-Z, and -.|  
|`object-type`|The type of the object, either "keys" or "secrets".|  
|`object-name`|An `object-name` is a user provided name for and must be unique within a Key Vault. The name must be a 1-127 character string, containing only 0-9, a-z, A-Z, and -.|  
|`object-version`|An `object-version` is a system-generated, 32 character string identifier that is optionally used to address a unique version of an object.|  

## Key Vault secrets 

### Working with secrets

From a developer's perspective, Key Vault APIs accept and return secret values as strings. Internally, Key Vault stores and manages secrets as sequences of octets (8-bit bytes), with a maximum size of 25k bytes each. The Key Vault service doesn't provide semantics for secrets. It merely accepts the data, encrypts it, stores it, and returns a secret identifier ("id"). The identifier can be used to retrieve the secret at a later time.  

For highly sensitive data, clients should consider additional layers of protection for data. Encrypting data using a separate protection key prior to storage in Key Vault is one example.  

Key Vault also supports a contentType field for secrets. Clients may specify the content type of a secret to assist in interpreting the secret data when it's retrieved. The maximum length of this field is 255 characters. There are no pre-defined values. The suggested usage is as a hint for interpreting the secret data. For instance, an implementation may store both passwords and certificates as secrets, then use this field to differentiate. There are no predefined values.  

### Secret attributes

In addition to the secret data, the following attributes may be specified:  

- *exp*: IntDate, optional, default is **forever**. The *exp* (expiration time) attribute identifies the expiration time on or after which the secret data SHOULD NOT be retrieved, except in [particular situations](#date-time-controlled-operations). This field is for **informational** purposes only as it informs users of key vault service that a particular secret may not be used. Its value MUST be a number containing an IntDate value.   
- *nbf*: IntDate, optional, default is **now**. The *nbf* (not before) attribute identifies the time before which the secret data SHOULD NOT be retrieved, except in [particular situations](#date-time-controlled-operations). This field is for **informational** purposes only. Its value MUST be a number containing an IntDate value. 
- *enabled*: boolean, optional, default is **true**. This attribute specifies whether the secret data can be retrieved. The enabled attribute is used in conjunction with *nbf* and *exp* when an operation occurs between *nbf* and *exp*, it will only be permitted if enabled is set to **true**. Operations outside the *nbf* and *exp* window are automatically disallowed, except in [particular situations](#date-time-controlled-operations).  

There are additional read-only attributes that are included in any response that includes secret attributes:  

- *created*: IntDate, optional. The created attribute indicates when this version of the secret was created. This value is null for secrets created prior to the addition of this attribute. Its value must be a number containing an IntDate value.  
- *updated*: IntDate, optional. The updated attribute indicates when this version of the secret was updated. This value is null for secrets that were last updated prior to the addition of this attribute. Its value must be a number containing an IntDate value.

#### Date-time controlled operations

A secret's **get** operation will work for not-yet-valid and expired secrets, outside the *nbf* / *exp* window. Calling a secret's **get** operation, for a not-yet-valid secret, can be used for test purposes. Retrieving (**get**ting) an expired secret, can be used for recovery operations.

### Secret access control

Access Control for secrets managed in Key Vault, is provided at the level of the Key Vault that contains those secrets. The access control policy for secrets, is distinct from the access control policy for keys in the same Key Vault. Users may create one or more vaults to hold secrets, and are required to maintain scenario appropriate segmentation and management of secrets.   

The following permissions can be used, on a per-principal basis, in the secrets access control entry on a vault, and closely mirror the operations allowed on a secret object:  

- Permissions for secret management operations
  - *get*: Read a secret  
  - *list*: List the secrets or versions of a secret stored in a Key Vault  
  - *set*: Create a secret  
  - *delete*: Delete a secret  
  - *recover*: Recover a deleted secret
  - *backup*: Back up a secret in a key vault
  - *restore*: Restore a backed up secret to a key vault

- Permissions for privileged operations
  - *purge*: Purge (permanently delete) a deleted secret

For more information on working with secrets, see [Secret operations in the Key Vault REST API reference](/rest/api/keyvault). For information on establishing permissions, see [Vaults - Create or Update](/rest/api/keyvault/vaults/createorupdate) and [Vaults - Update Access Policy](/rest/api/keyvault/vaults/updateaccesspolicy). 

### Secret tags  
You can specify additional application-specific metadata in the form of tags. Key Vault supports up to 15 tags, each of which can have a 256 character name and a 256 character value.  

>[!Note]
>Tags are readable by a caller if they have the *list* or *get* permission.

## Azure Storage account key management

Key Vault can manage Azure storage account keys:

- Internally, Key Vault can list (sync) keys with an Azure storage account. 
- Key Vault regenerates (rotates) the keys periodically.
- Key values are never returned in response to caller.
- Key Vault manages keys of both storage accounts and classic storage accounts.

For more information, see [Azure Key Vault Storage Account Keys](../secrets/overview-storage-keys.md))

### Storage account access control

The following permissions can be used when authorizing a user or application principal to perform operations on a managed storage account:  

- Permissions for managed storage account and SaS-definition operations
  - *get*: Gets information about a storage account 
  - *list*: List storage accounts managed by a Key Vault
  - *update*: Update a storage account
  - *delete*: Delete a storage account  
  - *recover*: Recover a deleted storage account
  - *backup*: Back up a storage account
  - *restore*: Restore a backed-up storage account to a Key Vault
  - *set*: Create or update a storage account
  - *regeneratekey*: Regenerate a specified key value for a storage account
  - *getsas*: Get information about a SAS definition for a storage account
  - *listsas*: List storage SAS definitions for a storage account
  - *deletesas*: Delete a SAS definition from a storage account
  - *setsas*: Create or update a new SAS definition/attributes for a storage account

- Permissions for privileged operations
  - *purge*: Purge (permanently delete) a managed storage account

For more information, see the [Storage account operations in the Key Vault REST API reference](/rest/api/keyvault). For information on establishing permissions, see [Vaults - Create or Update](/rest/api/keyvault/vaults/createorupdate) and [Vaults - Update Access Policy](/rest/api/keyvault/vaults/updateaccesspolicy).

## See Also

- [Authentication, requests, and responses](../general/authentication-requests-and-responses.md)
- [Key Vault Developer's Guide](../general/developers-guide.md)
