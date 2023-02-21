---
title: About Azure Key Vault secrets - Azure Key Vault
description: Overview of Azure Key Vault secrets.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: secrets
ms.topic: overview
ms.date: 01/17/2023
ms.author: mbaldwin
---

# About Azure Key Vault secrets

[Key Vault](../general/overview.md) provides secure storage of generic secrets, such as passwords and database connection strings.

From a developer's perspective, Key Vault APIs accept and return secret values as strings. Internally, Key Vault stores and manages secrets as sequences of octets (8-bit bytes), with a maximum size of 25k bytes each. The Key Vault service doesn't provide semantics for secrets. It merely accepts the data, encrypts it, stores it, and returns a secret identifier (`id`). The identifier can be used to retrieve the secret at a later time.  

For highly sensitive data, clients should consider extra layers of protection for data. Encrypting data using a separate protection key prior to storage in Key Vault is one example.  

Key Vault also supports a contentType field for secrets. Clients may specify the content type of a secret to help interpreting the secret data when it's retrieved. The maximum length of this field is 255 characters. The suggested usage is as a hint for interpreting the secret data. For instance, an implementation may store both passwords and certificates as secrets, then use this field to differentiate. There are no predefined values.  

## Encryption

All secrets in your Key Vault are stored encrypted. Key Vault encrypts secrets at rest with a hierarchy of encryption keys, with all keys in that hierarchy are protected by modules that are FIPS 140-2 compliant. This encryption is transparent, and requires no action from the user. The Azure Key Vault service encrypts your secrets when you add them, and decrypts them automatically when you read them.

The encryption leaf key of the key hierarchy is unique to each key vault. The encryption root key of the key hierarchy is unique to the security world, and its protection level varies between regions:
- China:  root key is protected by a module that is validated for FIPS 140-2 Level 1. 
- Other regions: root key is protected by a module that is validated for FIPS 140-2 Level 2 or higher. 

## Secret attributes

In addition to the secret data, the following attributes may be specified:  

- *exp*: IntDate, optional, default is **forever**. The *exp* (expiration time) attribute identifies the expiration time on or after which the secret data SHOULD NOT be retrieved, except in [particular situations](#date-time-controlled-operations). This field is for **informational** purposes only as it informs users of key vault service that a particular secret may not be used. Its value MUST be a number containing an IntDate value.   
- *nbf*: IntDate, optional, default is **now**. The *nbf* (not before) attribute identifies the time before which the secret data SHOULD NOT be retrieved, except in [particular situations](#date-time-controlled-operations). This field is for **informational** purposes only. Its value MUST be a number containing an IntDate value. 
- *enabled*: boolean, optional, default is **true**. This attribute specifies whether the secret data can be retrieved. The enabled attribute is used with *nbf* and *exp* when an operation occurs between *nbf* and *exp*, it will only be permitted if enabled is set to **true**. Operations outside the *nbf* and *exp* window are automatically disallowed, except in [particular situations](#date-time-controlled-operations).  

There are more read-only attributes that are included in any response that includes secret attributes:  

- *created*: IntDate, optional. The created attribute indicates when this version of the secret was created. This value is null for secrets created prior to the addition of this attribute. Its value must be a number containing an IntDate value.  
- *updated*: IntDate, optional. The updated attribute indicates when this version of the secret was updated. This value is null for secrets that were last updated prior to the addition of this attribute. Its value must be a number containing an IntDate value.

For information on common attributes for each key vault object type, see [Azure Key Vault keys, secrets and certificates overview](../general/about-keys-secrets-certificates.md)

### Date-time controlled operations

A secret's **get** operation will work for not-yet-valid and expired secrets, outside the *nbf* / *exp* window. Calling a secret's **get** operation, for a not-yet-valid secret, can be used for test purposes. Retrieving (**get**ting) an expired secret, can be used for recovery operations.

## Secret access control

Access Control for secrets managed in Key Vault, is provided at the level of the Key Vault that contains those secrets. The access control policy for secrets is distinct from the access control policy for keys in the same Key Vault. Users may create one or more vaults to hold secrets, and are required to maintain scenario appropriate segmentation and management of secrets.   

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

For more information on working with secrets, see [Secret operations in the Key Vault REST API reference](/rest/api/keyvault). For information on establishing permissions, see [Vaults - Create or Update](/rest/api/keyvault/keyvault/vaults/create-or-update) and [Vaults - Update Access Policy](/rest/api/keyvault/keyvault/vaults/update-access-policy). 

How-to guides to control access in Key Vault:
- [Assign a Key Vault access policy using CLI](../general/assign-access-policy-cli.md)
- [Assign a Key Vault access policy using PowerShell](../general/assign-access-policy-powershell.md)
- [Assign a Key Vault access policy using the Azure portal](../general/assign-access-policy-portal.md)
- [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](../general/rbac-guide.md)

## Secret tags  
You can specify more application-specific metadata in the form of tags. Key Vault supports up to 15 tags, each of which can have a 256 character name and a 256 character value.  

>[!Note]
>Tags are readable by a caller if they have the *list* or *get* permission.

## Usage Scenarios

| When to use | Examples |
|--------------|-------------|
|Securely store, manage lifecycle, and monitor credentials for service-to-service communication like passwords, access keys, service principal client secrets.  | - [Use Azure Key Vault with a Virtual Machine](../general/tutorial-net-virtual-machine.md)<br> - [Use Azure Key Vault with an Azure Web App](../general/tutorial-net-create-vault-azure-web-app.md) |

## Next steps

- [Key management in Azure](../../security/fundamentals/key-management.md)
- [Best practices for secrets management in Key Vault](secrets-best-practices.md)
- [About Key Vault](../general/overview.md)
- [About keys, secrets, and certificates](../general/about-keys-secrets-certificates.md)
- [Assign a Key Vault access policy](../general/assign-access-policy.md)
- [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](../general/rbac-guide.md)
- [Secure access to a key vault](../general/security-features.md)
- [Key Vault Developer's Guide](../general/developers-guide.md)
