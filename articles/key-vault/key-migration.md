---
title: Monitor Key Vault with Key Vault insights | Microsoft Docs
description: This article describes the Key Vault insights. 
author: msmbaldwin
ms.author: mbaldwin
services: azure-monitor 
ms.topic: conceptual
ms.service: key-vault
ms.date: 09/10/2020
ms.custom: subject-monitoring

---

# How to migrate key workloads between Azure Key Vault and Azure Managed HSM

Azure Key Vault and Azure Managed HSM do not allow the export of keys to protect the key material and ensure that the HSM properties of the key can't be changed. If you want a key to be highly portable, it is best to create it a supported HSM and import it into Azure Key Vaults or Azure Managed HSM. 

> [!NOTE]
> The only exception is if a key is created with a key release policy (link to SKR policy document) restricting exports to confidential compute enclaves you trust to handle the key material. Such secure key operations are not general purpose exports of the key.

Yet there are several scenarios that require the migration of key workloads:
- Switching security boundaries, such as when switching between subscriptions, resource groups, or owners.
- Moving regions due to compliance boundaries or risks in a given region.
- Switching between offerings, such as from Azure Key Vault to [Azure Managed HSM](/azure/key-vault/managed-hsm/overview), which offers greater security, isolation, and compliance than Key Vault Premium.

Below we discuss several methods for migrating workloads to use a new key, either into a new vault or into a new HSM pool.

## Azure Services using Customer-managed Key

For most Azure services which use keys in Key Vault, the most effective way to migrate to a key into a new location (a new Managed HSM or new key vault in a different subscription or region) is to:
1. Create a new key in the new vault or pool. Be sure to authorize access by the service to this new key by adding the service to the appropriate role in [Azure Key Vault](/azure/key-vault/general/rbac-guide) or [Azure Managed HSM](/azure/key-vault/managed-hsm/access-control).
1. Update the service to use the new key as the customer managed encryption key.
1. Retain the old key until you no longer want the backups of data it originally protected.
1. Old key is in deprecated hardware.

For example, to update Azure Storage to use a new key follow the instructions at [Configure customer-managed keys for an existing storage account - Azure Storage](/azure/storage/common/customer-managed-keys-configure-existing-account). Note that the previous customer managed key is need until Storage is updated to use the new key, but once it has successfully been updated to the new key the previous key is no longer needed.

## Custom applications and client-side encryption

For client-side encryption or custom applications you've built that directly encrypt data using the keys in Key Vault there is more to consider.

- Create the new vault / pool and a new key encryption key.
- Re-encrypt all data using new Key URI. This is a size of data operation as all data must be read, decrypted, and encrypted with the new key.
  - Using a 3 level key hierarchy is helpful to make this easier and faster in the future. We recommend:
    1. Key Encryption Key in Key Vault
    1. Master Key
    1. Data Encryption Keys derived from Master Key
- Do not delete old key/key vault until you no longer want the backups of data associated with it/

## Migrating Tenant Keys in Azure Information Protection

Migrating tenant keys in Azure Information Protection is referred to as "rekeying" or "rolling your key". [Customer-managed - AIP tenant key life cycle operations](/azure/information-protection/operations-customer-managed-tenant-key#rekey-your-tenant-key) has detailed instructions on how to perform this operation. Note that it is not safe to delete the old tenant key until you no longer need the content or documents protected with the old tenant key. If you want to migrate documents to be protected by the new key you must:

1. Remove protection from the document protected with the old tenant key.
1. Apply protection again, which will use the new tenant key.
