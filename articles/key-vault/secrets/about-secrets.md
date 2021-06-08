---
title: About Azure Key Vault secrets - Azure Key Vault
description: Overview of Azure Key Vault secrets.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: secrets
ms.topic: overview
ms.date: 09/04/2019
ms.author: mbaldwin
---

# About Azure Key Vault secrets

[Key Vault](../general/overview.md) provides secure storage of generic secrets, such as passwords and database connection strings.

From a developer's perspective, Key Vault APIs accept and return secret values as strings. Internally, Key Vault stores and manages secrets as sequences of octets (8-bit bytes), with a maximum size of 25k bytes each. The Key Vault service doesn't provide semantics for secrets. It merely accepts the data, encrypts it, stores it, and returns a secret identifier ("id"). The identifier can be used to retrieve the secret at a later time.  

For highly sensitive data, clients should consider additional layers of protection for data. Encrypting data using a separate protection key prior to storage in Key Vault is one example.  

Key Vault also supports a contentType field for secrets. Clients may specify the content type of a secret to assist in interpreting the secret data when it's retrieved. The maximum length of this field is 255 characters. There are no pre-defined values. The suggested usage is as a hint for interpreting the secret data. For instance, an implementation may store both passwords and certificates as secrets, then use this field to differentiate. There are no predefined values.  

## Encryption

All secrets in your Key Vault are stored encrypted. This encryption is transparent, and requires no action from the user. The Azure Key Vault service encrypts your secrets when you add them, and decrypts them automatically when you read them. The encryption key is unique to each key vault.

## Secret attributes

In addition to the secret data, the following attributes may be specified:  

- *exp*: IntDate, optional, default is **forever**. The *exp* (expiration time) attribute identifies the expiration time on or after which the secret data SHOULD NOT be retrieved, except in [particular situations](#date-time-controlled-operations). This field is for **informational** purposes only as it informs users of key vault service that a particular secret may not be used. Its value MUST be a number containing an IntDate value.   
- *nbf*: IntDate, optional, default is **now**. The *nbf* (not before) attribute identifies the time before which the secret data SHOULD NOT be retrieved, except in [particular situations](#date-time-controlled-operations). This field is for **informational** purposes only. Its value MUST be a number containing an IntDate value. 
- *enabled*: boolean, optional, default is **true**. This attribute specifies whether the secret data can be retrieved. The enabled attribute is used in conjunction with *nbf* and *exp* when an operation occurs between *nbf* and *exp*, it will only be permitted if enabled is set to **true**. Operations outside the *nbf* and *exp* window are automatically disallowed, except in [particular situations](#date-time-controlled-operations).  

There are additional read-only attributes that are included in any response that includes secret attributes:  

- *created*: IntDate, optional. The created attribute indicates when this version of the secret was created. This value is null for secrets created prior to the addition of this attribute. Its value must be a number containing an IntDate value.  
- *updated*: IntDate, optional. The updated attribute indicates when this version of the secret was updated. This value is null for secrets that were last updated prior to the addition of this attribute. Its value must be a number containing an IntDate value.

For information on common attributes for each key vault object type, see [Azure Key Vault keys, secrets and certificates overview](../general/about-keys-secrets-certificates.md)

### Date-time controlled operations

A secret's **get** operation will work for not-yet-valid and expired secrets, outside the *nbf* / *exp* window. Calling a secret's **get** operation, for a not-yet-valid secret, can be used for test purposes. Retrieving (**get**ting) an expired secret, can be used for recovery operations.

## Secret access control

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

How-to guides to control access in Key Vault:
- [Assign a Key Vault access policy using CLI](../general/assign-access-policy-cli.md)
- [Assign a Key Vault access policy using PowerShell](../general/assign-access-policy-powershell.md)
- [Assign a Key Vault access policy using the Azure portal](../general/assign-access-policy-portal.md)
- [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](../general/rbac-guide.md)

## Secret tags  
You can specify additional application-specific metadata in the form of tags. Key Vault supports up to 15 tags, each of which can have a 256 character name and a 256 character value.  

>[!Note]
>Tags are readable by a caller if they have the *list* or *get* permission.

## Azure Storage account key management

Key Vault can manage [Azure storage account](../../storage/common/storage-account-overview.md) keys:

- Internally, Key Vault can list (sync) keys with an Azure storage account. 
- Key Vault regenerates (rotates) the keys periodically.
- Key values are never returned in response to caller.
- Key Vault manages keys of both storage accounts and classic storage accounts.

For more information, see:
- [Storage account access keys](../../storage/common/storage-account-keys-manage.md)
- [Storage account keys management in Azure Key Vault](../secrets/overview-storage-keys.md))


## Storage account access control

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

How-to guides to control access in Key Vault:
- [Assign a Key Vault access policy using CLI](../general/assign-access-policy-cli.md)
- [Assign a Key Vault access policy using PowerShell](../general/assign-access-policy-powershell.md)
- [Assign a Key Vault access policy using the Azure portal](../general/assign-access-policy-portal.md)
- [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](../general/rbac-guide.md)


## Next steps

- [About Key Vault](../general/overview.md)
- [About keys, secrets, and certificates](../general/about-keys-secrets-certificates.md)
- [About keys](../keys/about-keys.md)
- [About certificates](../certificates/about-certificates.md)
- [Secure access to a key vault](../general/security-features.md)
- [Key Vault Developer's Guide](../general/developers-guide.md)