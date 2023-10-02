---
title: Azure Key Vault Keys, Secrets, and Certificates Overview
description: Overview of Azure Key Vault REST interface and developer details for keys, secrets and certificates.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: overview
ms.date: 04/18/2023
ms.author: mbaldwin
---

# Azure Key Vault keys, secrets and certificates overview

Azure Key Vault enables Microsoft Azure applications and users to store and use several types of secret/key data: keys, secrets, and certificates. Keys, secrets, and certificates are collectively referred to as "objects".

## Object identifiers
Objects are uniquely identified within Key Vault using a case-insensitive identifier called the object identifier. No two objects in the system have the same identifier, regardless of geo-location. The identifier consists of a prefix that identifies the key vault, object type, user provided object name, and an object version. Identifiers that don't include the object version are referred to as "base identifiers". Key Vault object identifiers are also valid URLs, but should always be compared as case-insensitive strings.

For more information, see [Authentication, requests, and responses](authentication-requests-and-responses.md)

An object identifier has the following general format (depending on container type):  

- **For Vaults**:
`https://{vault-name}.vault.azure.net/{object-type}/{object-name}/{object-version}`  

- **For Managed HSM pools**:
`https://{hsm-name}.managedhsm.azure.net/{object-type}/{object-name}/{object-version}`  

> [!NOTE]
> See [Object type support](#object-types) for types of objects supported by each container type.

Where:  

| Element | Description |  
|-|-|  
| `vault-name` or `hsm-name` | The name for a key vault or a Managed HSM pool in the Microsoft Azure Key Vault service.<br /><br />Vault names and Managed HSM pool names are selected by the user and are globally unique.<br /><br />Vault name and Managed HSM pool name must be a 3-24 character string, containing only 0-9, a-z, A-Z, and not consecutive -.|  
| `object-type` | The type of the object, "keys",  "secrets", or "certificates".|  
| `object-name` | An `object-name` is a user provided name for and must be unique within a key vault. The name must be a 1-127 character string, starting with a letter and containing only 0-9, a-z, A-Z, and -.|  
| `object-version `| An `object-version` is a system-generated, 32 character string identifier that is optionally used to address a unique version of an object. |  

## DNS suffixes for object identifiers
The Azure Key Vault resource provider supports two resource types: vaults and managed HSMs. This table shows the DNS suffix used by the data-plane endpoint for vaults and managed HSM pools in various cloud environments.

Cloud environment | DNS suffix for vaults | DNS suffix for managed HSMs
---|---|---
Azure Cloud | .vault.azure.net | .managedhsm.azure.net
Microsoft Azure operated by 21Vianet Cloud | .vault.azure.cn | Not supported
Azure US Government | .vault.usgovcloudapi.net | Not supported
Azure German Cloud | .vault.microsoftazure.de | Not supported

## Object types
 This table shows object types and their suffixes in the object identifier.

Object type|Identifier Suffix|Vaults|Managed HSM Pools
--|--|--|--
**Cryptographic keys**||
HSM-protected keys|/keys|Supported|Supported
Software-protected keys|/keys|Supported|Not supported
**Other object types**||
Secrets|/secrets|Supported|Not supported
Certificates|/certificates|Supported|Not supported
Storage account keys|/storage|Supported|Not supported

- **Cryptographic keys**: Supports multiple key types and algorithms, and enables the use of software-protected and HSM-protected keys. For more information, see [About keys](../keys/about-keys.md).
- **Secrets**: Provides secure storage of secrets, such as passwords and database connection strings. For more information, see [About secrets](../secrets/about-secrets.md).
- **Certificates**: Supports certificates, which are built on top of keys and secrets and add an automated renewal feature. Keep in mind when a certificate is created, an addressable key and secret are also created with the same name. For more information, see [About certificates](../certificates/about-certificates.md).
- **Azure Storage account keys**: Can manage keys of an Azure Storage account for you. Internally, Key Vault can list (sync) keys with an Azure Storage Account, and regenerate (rotate) the keys periodically. For more information, see [Manage storage account keys with Key Vault](../secrets/overview-storage-keys.md).

For more general information about Key Vault, see [About Azure Key Vault](overview.md). For more information about Managed HSM pools, see What is [Azure Key Vault Managed HSM?](../managed-hsm/overview.md)

## Data types

Refer to the JOSE specifications for relevant data types for keys, encryption, and signing.  

-   **algorithm** - a supported algorithm for a key operation, for example, RSA1_5  
-   **ciphertext-value** - cipher text octets, encoded using Base64URL  
-   **digest-value** - the output of a hash algorithm, encoded using Base64URL  
-   **key-type** - one of the supported key types, for example RSA (Rivest-Shamir-Adleman).  
-   **plaintext-value** - plaintext octets, encoded using Base64URL  
-   **signature-value** - output of a signature algorithm, encoded using Base64URL  
-   **base64URL** - a Base64URL [RFC4648] encoded binary value  
-   **boolean** - either true or false  
-   **Identity** - an identity from Azure Active Directory (Azure AD).  
-   **IntDate** - a JSON decimal value representing the number of seconds from 1970-01-01T0:0:0Z UTC until the specified UTC date/time. See RFC3339 for details regarding date/times, in general and UTC in particular.  

## Objects, identifiers, and versioning

Objects stored in Key Vault are versioned whenever a new instance of an object is created. Each version is assigned a unique object identifier. When an object is first created, it's given a unique version identifier and marked as the current version of the object. Creation of a new instance with the same object name gives the new object a unique version identifier, causing it to become the current version.  

Objects in Key Vault can be retrieved by specifying a version or by omitting version to get latest version of the object. Performing operations on objects requires providing version to use specific version of the object.

> [!NOTE]
> The values you provide for Azure resources or object IDs may be copied globally for the purpose of running the service. The value provided should not include personally identifiable or sensitive information.

## Next steps

- [About keys](../keys/about-keys.md)
- [About secrets](../secrets/about-secrets.md)
- [About certificates](../certificates/about-certificates.md)
- [Authentication, requests, and responses](../general/authentication-requests-and-responses.md)
- [Key Vault Developer's Guide](../general/developers-guide.md)
