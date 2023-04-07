---
title: Create users - Azure Cosmos DB for PostgreSQL
description: How to enable data encrytion with customer managed keys
ms.author: akashrao
author: akashraokm
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: concepts
ms.date: 04/06/2023
---

# Overview 

Data stored in your Azure Cosmos DB for PostgreSQL cluster is automatically and seamlessly encrypted with keys managed by Microsoft **(service-managed keys)**. Optionally, now you can choose to add an additional layer of security by enabling encryption with **customer managed keys**. Azure Cosmos DB for PostgreSQL uses [Azure Storage encryption](/azure/storage/common/storage-service-encryption.md) to encrypt data at-rest by default using service-managed keys ( Microsoft managed).

### Service Managed Keys

The Azure Cosmos DB for PostgreSQL service uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. All Data including backups and temporary files created while running queries are encrypted on disk. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system-managed. Storage encryption is always on and cannot be disabled.

### Customer Managed Keys

Many organizations require full control of access to the data using a customer-managed key. Data encryption with customer-managed keys for Azure Cosmos DB for PostgreSQL enables you to bring your own key for protecting data at rest. It also allows organizations to implement separation of duties in the management of keys and data. With customer-managed encryption, you're responsible for, and in full control of, a key's lifecycle, key usage permissions, and auditing of operations on keys.

Data encryption with customer-managed keys for Azure Cosmos DB for PostgreSQL is set at the server level. Data, including backups, are encrypted on disk, including the temporary files created while running queries. For a given cluster, a customer-managed key, called the key encryption key (KEK), is used to encrypt the service's data encryption key (DEK). The KEK is an asymmetric key stored in a customer-owned and customer-managed [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) instance. The Key Encryption Key (KEK) and Data Encryption Key (DEK) are described in more detail later in the concepts section.

Key Vault is a cloud-based, Azure’s key management system. It's highly available and provides scalable, secure storage for RSA cryptographic keys, optionally backed by FIPS 140-2 Level 2 validated hardware security modules (HSMs). It doesn't allow direct access to a stored key but provides encryption and decryption services to authorized entities. Key Vault can generate the key, import it, or have it transferred from an on-premises HSM device.


## Terminology and description

### Data encryption key (DEK):
A symmetric AES256 key used to encrypt a partition or block of data. Encrypting each block of data with a different key makes crypto analysis attacks more difficult. Access to DEKs is needed by the resource provider or application instance that is encrypting and decrypting a specific block. When you replace a DEK with a new key, only the data in its associated block must be re-encrypted with the new key.

### Key encryption key (KEK): 
An encryption key used to encrypt the DEKs. A KEK that never leaves Key Vault allows the DEKs themselves to be encrypted and controlled. The entity that has access to the KEK might be different than the entity that requires the DEK. Since the KEK is required to decrypt the DEKs, the KEK is effectively a single point by which DEKs can be effectively deleted by deletion of the KEK.

The DEKs, encrypted with the KEKs, are stored separately. Only an entity with access to the KEK can decrypt these DEKs. For more information, see [Security in encryption at rest](/azure/security/fundamentals/encryption-atrest.md).

## How data encryption with a customer-managed key work 

For a cluster to use customer-managed keys stored in Key Vault for encryption of the DEK, a Key Vault administrator gives the following access rights to the server:

* get: For retrieving the public part and properties of the key in the key vault.
* wrapKey: To be able to encrypt the DEK. The encrypted DEK is stored in the Azure Cosmos DB for PostgreSQL.
* unwrapKey: To be able to decrypt the DEK. Azure Cosmos DB for PostgreSQL needs the decrypted DEK to encrypt/decrypt the data

The key vault administrator can also enable logging of Key Vault audit events, so they can be audited later.
When the Azure Cosmos DB for PostgreSQL cluster is configured to use the customer-managed key stored in the key vault, the cluster sends the DEK to the key vault for encryptions. Key Vault returns the encrypted DEK, which is stored in the user database. Similarly, when needed, the server sends the protected DEK to the key vault for decryption. Auditors can use Azure Monitor to review Key Vault audit event logs, if logging is enabled.

![Architecture of Data Enrcryption with Customer Managed Keys](media/concepts-customer-managed-keys/Architecture.png)

## Benefits

Data encryption with customer-managed keys for Azure Cosmos DB for PostgreSQL provides the following benefits:

* Data-access is fully controlled by you, with the ability to remove the key and make the database inaccessible.
* Full control over the key-lifecycle, including rotation of the key to align with corporate policies.
* Central management and organization of keys in Azure Key Vault.
* Enabling encryption does not have any additional performance impact with or without customers managed key (CMK) as Azure Cosmos DB for PostgreSQL relies on Azure storage layer for data encryption in both the scenarios, the only difference is when CMK is used Azure Storage Encryption Key which performs actual data encryption is encrypted using CMK.
* Ability to implement separation of duties between security officers, and DBA and system administrators.