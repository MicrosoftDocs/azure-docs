---
title: About Azure Key Vault keys, secrets and certificates - Azure Key Vault
description: Overview of Azure Key Vault REST interface and developer details for keys, secrets and certificates.
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.topic: overview
ms.date: 04/17/2020
ms.author: mbaldwin
---

# About keys, secrets, and certificates

Azure Key Vault enables Microsoft Azure applications and users to store and use several types of secret/key data:

- Cryptographic keys: Supports multiple key types and algorithms, and enables the use of Hardware Security Modules (HSM) for high value keys. For more information, see [About keys](../keys/about-keys.md).
- Secrets: Provides secure storage of secrets, such as passwords and database connection strings. For more information, see [About secrets](../secrets/about-secrets.md).
- Certificates: Supports certificates, which are built on top of keys and secrets and add an automated renewal feature. For more information, see [About certificates](../certificates/about-certificates.md).
- Azure Storage: Can manage keys of an Azure Storage account for you. Internally, Key Vault can list (sync) keys with an Azure Storage Account, and regenerate (rotate) the keys periodically. For more information, see [Manage storage account keys with Key Vault](../secrets/overview-storage-keys.md).

For more general information about Key Vault, see [About Azure Key Vault](overview.md).

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
-   **Identity** - an identity from Azure Active Directory (AAD).  
-   **IntDate** - a JSON decimal value representing the number of seconds from 1970-01-01T0:0:0Z UTC until the specified UTC date/time. See RFC3339 for details regarding date/times, in general and UTC in particular.  

## Objects, identifiers, and versioning

Objects stored in Key Vault are versioned whenever a new instance of an object is created. Each version is assigned a unique identifier and URL. When an object is first created, it's given a unique version identifier and marked as the current version of the object. Creation of a new instance with the same object name gives the new object a unique version identifier, causing it to become the current version.  

Objects in Key Vault can be addressed by specifing a version or by omitting version for operations on current version of the object. For example, given a Key with the name `MasterKey`, performing operations without specifing a version causes the system to use the latest available version. Performing operations with the version-specific identifier causes the system to use that specific version of the object.  

Objects are uniquely identified within Key Vault using a URL. No two objects in the system have the same URL, regardless of geo-location. The complete URL to an object is called the Object Identifier. The URL consists of a prefix that identifies the Key Vault, object type, user provided Object Name, and an Object Version. The Object Name is case-insensitive and immutable. Identifiers that don't include the Object Version are referred to as Base Identifiers.  

For more information, see [Authentication, requests, and responses](authentication-requests-and-responses.md)

An object identifier has the following general format:  

`https://{keyvault-name}.vault.azure.net/{object-type}/{object-name}/{object-version}`  

Where:  

|||  
|-|-|  
|`keyvault-name`|The name for a key vault in the Microsoft Azure Key Vault service.<br /><br /> Key Vault names are selected by the user and are globally unique.<br /><br /> Key Vault name must be a 3-24 character string, containing only 0-9, a-z, A-Z, and -.|  
|`object-type`|The type of the object, "keys",  "secrets", or 'certificates'.|  
|`object-name`|An `object-name` is a user provided name for and must be unique within a Key Vault. The name must be a 1-127 character string, starting with a letter and containing only 0-9, a-z, A-Z, and -.|  
|`object-version`|An `object-version` is a system-generated, 32 character string identifier that is optionally used to address a unique version of an object.|  

## Next steps

- [About keys](../keys/about-keys.md)
- [About secrets](../secrets/about-secrets.md)
- [About certificates](../certificates/about-certificates.md)
- [Authentication, requests, and responses](../general/authentication-requests-and-responses.md)
- [Key Vault Developer's Guide](../general/developers-guide.md)
