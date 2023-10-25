---
title: How to migrate key workloads 
description: How to migrate key workloads
author: msmbaldwin
ms.author: mbaldwin
services: key-vault
ms.topic: conceptual
ms.service: key-vault
ms.subservice: managed-hsm
ms.date: 11/15/2022
---

# How to migrate key workloads

Azure Key Vault and Azure Managed HSM do not allow the export of keys, to protect the key material and ensure that the HSM properties of the keys can't be changed.

If you want a key to be highly portable, it is best to create it in a supported HSM and import it into Azure Key Vault or Azure Managed HSM.

> [!NOTE]
> The only exception is if a key is created with a [key release policy](../keys/policy-grammar.md) restricting exports to confidential compute enclaves you trust to handle the key material. Such secure key operations are not general-purpose exports of the key.

There are several scenarios that require the migration of key workloads:
- Switching security boundaries, such as when switching between subscriptions, resource groups, or owners.
- Moving regions due to compliance boundaries or risks in a given region.
- Changing to a new offering, such as from Azure Key Vault to [Azure Managed HSM](../managed-hsm/overview.md), which offers greater security, isolation, and compliance than Key Vault Premium.

Below we discuss several methods for migrating workloads to use a new key, either into a new vault or into a new managed HSM.

## Azure Services using customer-managed key

For most workloads that use keys in Key Vault, the most effective way to migrate a key into a new location (a new managed HSM or new key vault in a different subscription or region) is to:

1. Create a new key in the new vault or managed HSM.
1. Ensure that the workload has access to this new key, by adding the workload's identity to the appropriate role in [Azure Key Vault](rbac-guide.md) or [Azure Managed HSM](../managed-hsm/access-control.md).
1. Update the workload to use the new key as the customer managed encryption key.
1. Retain the old key until you no longer want the backups of the workload data that they key originally protected.

For example, to update Azure Storage to use a new key, follow the instructions at [Configure customer-managed keys for an existing storage account - Azure Storage](../../storage/common/customer-managed-keys-configure-existing-account.md). The previous customer managed key is needed until Storage is updated to the new key; once Storage has successfully been updated to the new key, the previous key is no longer needed.

## Custom applications and client-side encryption

For client-side encryption or custom applications you've built, that directly encrypt data using the keys in Key Vault, the process is different:

1. Create the new key vault or managed HSM, and create a new key encryption key (KEK).
1. Re-encrypt any keys or data that was encrypted by the old key using the new key. (If data was directly encrypted by the key in key vault, this may take some time, as all data must be read, decrypted, and encrypted with the new key. Use [envelope encryption](../../security/fundamentals/encryption-atrest.md#envelope-encryption-with-a-key-hierarchy) where possible to make such key rotations faster).

  When re-encrypting the data, we recommend a three-level key hierarchy, which will make KEK rotation easier in the future:
    1. The Key Encryption Key in Azure Key Vault or Managed HSM
    1. The Primary Key
    1. Data Encryption Keys derived from the Primary Key
1. Verify data after migration (and before deletion).
1. Do not delete old key/key vault until you no longer want the backups of data associated with it.

## Migrating tenant keys in Azure Information Protection
Migrating tenant keys in Azure Information Protection is referred to as "rekeying" or "rolling your key". [Customer-managed - AIP tenant key life cycle operations](/azure/information-protection/operations-customer-managed-tenant-key#rekey-your-tenant-key) has detailed instructions on how to perform this operation.

It is not safe to delete the old tenant key until you no longer need the content or documents protected with the old tenant key. If you want to migrate documents to be protected by the new key, you must:

1. Remove protection from the document protected with the old tenant key.
1. Apply protection again, which will use the new tenant key.

## Next steps

- [About Azure Key Vault](overview.md)
- [About Azure Key Vault Managed HSM?](../managed-hsm/overview.md)
- [Key management is Azure](../../security/fundamentals/key-management.md)
