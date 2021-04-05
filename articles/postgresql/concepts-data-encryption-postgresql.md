---
title: Data encryption with customer-managed key - Azure Database for PostgreSQL - Single server
description: Azure Database for PostgreSQL Single server data encryption with a customer-managed key enables you to Bring Your Own Key (BYOK) for data protection at rest. It also allows organizations to implement separation of duties in the management of keys and data.
author: mksuni
ms.author: sumuth
ms.service: postgresql
ms.topic: conceptual
ms.date: 01/13/2020
---

# Azure Database for PostgreSQL Single server data encryption with a customer-managed key

Azure PostgreSQL leverages [Azure Storage encryption](../storage/common/storage-service-encryption.md) to encrypt data at-rest by default using Microsoft-managed keys. For Azure PostgreSQL users, it is a very similar to Transparent Data Encryption (TDE) in other databases such as SQL Server. Many organizations require full control on access to the data using a customer-managed key. Data encryption with customer-managed keys for Azure Database for PostgreSQL Single server enables you to bring your own key (BYOK) for data protection at rest. It also allows organizations to implement separation of duties in the management of keys and data. With customer-managed encryption, you are responsible for, and in a full control of, a key's lifecycle, key usage permissions, and auditing of operations on keys.

Data encryption with customer-managed keys for Azure Database for PostgreSQL Single server, is set at the server-level. For a given server, a customer-managed key, called the key encryption key (KEK), is used to encrypt the data encryption key (DEK) used by the service. The KEK is an asymmetric key stored in a customer-owned and customer-managed [Azure Key Vault](../key-vault/general/security-overview.md) instance. The Key Encryption Key (KEK) and Data Encryption Key (DEK) is described in more detail later in this article.

Key Vault is a cloud-based, external key management system. It's highly available and provides scalable, secure storage for RSA cryptographic keys, optionally backed by FIPS 140-2 Level 2 validated hardware security modules (HSMs). It doesn't allow direct access to a stored key, but does provide services of encryption and decryption to authorized entities. Key Vault can generate the key, imported it, or [have it transferred from an on-premises HSM device](../key-vault/keys/hsm-protected-keys.md).

> [!NOTE]
> This feature is available in all Azure regions where Azure Database for PostgreSQL Single server supports "General Purpose" and "Memory Optimized" pricing tiers. For other limitations, refer to the [limitation](concepts-data-encryption-postgresql.md#limitations) section.

## Benefits

Data encryption with customer-managed keys for Azure Database for PostgreSQL Single server provides the following benefits:

* Data-access is fully controlled by you by the ability to remove the key and making the database inaccessible 
*    Full control over the key-lifecycle, including rotation of the key to align with corporate policies
*    Central management and organization of keys in Azure Key Vault
*    Ability to implement separation of duties between security officers, and DBA and system administrators

## Terminology and description

**Data encryption key (DEK)**: A symmetric AES256 key used to encrypt a partition or block of data. Encrypting each block of data with a different key makes crypto analysis attacks more difficult. Access to DEKs is needed by the resource provider or application instance that is encrypting and decrypting a specific block. When you replace a DEK with a new key, only the data in its associated block must be re-encrypted with the new key.

**Key encryption key (KEK)**: An encryption key used to encrypt the DEKs. A KEK that never leaves Key Vault allows the DEKs themselves to be encrypted and controlled. The entity that has access to the KEK might be different than the entity that requires the DEK. Since the KEK is required to decrypt the DEKs, the KEK is effectively a single point by which DEKs can be effectively deleted by deletion of the KEK.

The DEKs, encrypted with the KEKs, are stored separately. Only an entity with access to the KEK can decrypt these DEKs. For more information, see [Security in encryption at rest](../security/fundamentals/encryption-atrest.md).

## How data encryption with a customer-managed key work

:::image type="content" source="media/concepts-data-access-and-security-data-encryption/postgresql-data-encryption-overview.png" alt-text="Diagram that shows an overview of Bring Your Own Key":::

For a PostgreSQL server to use customer-managed keys stored in Key Vault for encryption of the DEK, a Key Vault administrator gives the following access rights to the server:

* **get**: For retrieving the public part and properties of the key in the key vault.
* **wrapKey**: To be able to encrypt the DEK. The encrypted DEK is stored in the Azure Database for PostgreSQL.
* **unwrapKey**: To be able to decrypt the DEK. Azure Database for PostgreSQL needs the decrypted DEK to encrypt/decrypt the data

The key vault administrator can also [enable logging of Key Vault audit events](../azure-monitor/insights/key-vault-insights-overview.md), so they can be audited later.

When the server is configured to use the customer-managed key stored in the key vault, the server sends the DEK to the key vault for encryptions. Key Vault returns the encrypted DEK, which is stored in the user database. Similarly, when needed, the server sends the protected DEK to the key vault for decryption. Auditors can use Azure Monitor to review Key Vault audit event logs, if logging is enabled.

## Requirements for configuring data encryption for Azure Database for PostgreSQL Single server

The following are requirements for configuring Key Vault:

* Key Vault and Azure Database for PostgreSQL Single server must belong to the same Azure Active Directory (Azure AD) tenant. Cross-tenant Key Vault and server interactions aren't supported. Moving the Key Vault resource afterwards requires you to reconfigure the data encryption.
* The key vault must be set with 90 days for 'Days to retain deleted vaults'. If the existing key vault has been configured with a lower number, you will need to create a new key vault as it cannot be modified after creation.
* Enable the soft-delete feature on the key vault, to protect from data loss if an accidental key (or Key Vault) deletion happens. Soft-deleted resources are retained for 90 days, unless the user recovers or purges them in the meantime. The recover and purge actions have their own permissions associated in a Key Vault access policy. The soft-delete feature is off by default, but you can enable it through PowerShell or the Azure CLI (note that you can't enable it through the Azure portal). 
* Enable Purge protection to enforce a mandatory retention period for deleted vaults and vault objects
* Grant the Azure Database for PostgreSQL Single server access to the key vault with the get, wrapKey, and unwrapKey permissions by using its unique managed identity. In the Azure portal, the unique 'Service' identity is automatically created when data encryption is enabled on the PostgreSQL Single server. See [Data encryption for Azure Database for PostgreSQL Single server by using the Azure portal](howto-data-encryption-portal.md) for detailed, step-by-step instructions when you're using the Azure portal.

The following are requirements for configuring the customer-managed key:

* The customer-managed key to be used for encrypting the DEK can be only asymmetric, RSA 2048.
* The key activation date (if set) must be a date and time in the past. The expiration date (if set) must be a future date and time.
* The key must be in the *Enabled* state.
* If you're [importing an existing key](/rest/api/keyvault/ImportKey/ImportKey) into the key vault, make sure to provide it in the supported file formats (`.pfx`, `.byok`, `.backup`).

## Recommendations

When you're using data encryption by using a customer-managed key, here are recommendations for configuring Key Vault:

* Set a resource lock on Key Vault to control who can delete this critical resource and prevent accidental or unauthorized deletion.
* Enable auditing and reporting on all encryption keys. Key Vault provides logs that are easy to inject into other security information and event management tools. Azure Monitor Log Analytics is one example of a service that's already integrated.
* Ensure that Key Vault and Azure Database for PostgreSQL Single server reside in the same region, to ensure a faster access for DEK wrap, and unwrap operations.
* Lock down the Azure KeyVault to only **private endpoint and selected networks** and allow only *trusted Microsoft* services to secure the resources.

    :::image type="content" source="media/concepts-data-access-and-security-data-encryption/keyvault-trusted-service.png" alt-text="trusted-service-with-AKV":::

Here are recommendations for configuring a customer-managed key:

* Keep a copy of the customer-managed key in a secure place, or escrow it to the escrow service.

* If Key Vault generates the key, create a key backup before using the key for the first time. You can only restore the backup to Key Vault. For more information about the backup command, see [Backup-AzKeyVaultKey](/powershell/module/az.keyVault/backup-azkeyVaultkey).

## Inaccessible customer-managed key condition

When you configure data encryption with a customer-managed key in Key Vault, continuous access to this key is required for the server to stay online. If the server loses access to the customer-managed key in Key Vault, the server begins denying all connections within 10 minutes. The server issues a corresponding error message, and changes the server state to *Inaccessible*. Some of the reason why the server can reach this state are:

* If we create a Point In Time Restore server for your Azure Database for PostgreSQL Single server, which has data encryption enabled, the newly created server will be in *Inaccessible* state. You can fix the server state through [Azure portal](howto-data-encryption-portal.md#using-data-encryption-for-restore-or-replica-servers) or [CLI](howto-data-encryption-cli.md#using-data-encryption-for-restore-or-replica-servers).
* If we create a read replica for your Azure Database for PostgreSQL Single server, which has data encryption enabled, the replica server will be in *Inaccessible* state. You can fix the server state through [Azure portal](howto-data-encryption-portal.md#using-data-encryption-for-restore-or-replica-servers) or [CLI](howto-data-encryption-cli.md#using-data-encryption-for-restore-or-replica-servers).
* If you delete the KeyVault, the Azure Database for PostgreSQL Single server will be unable to access the key and will move to *Inaccessible* state. Recover the [Key Vault](../key-vault/general/key-vault-recovery.md) and revalidate the data encryption to make the server *Available*.
* If we delete the key from the KeyVault, the Azure Database for PostgreSQL Single server will be unable to access the key and will move to *Inaccessible* state. Recover the [Key](../key-vault/general/key-vault-recovery.md) and revalidate the data encryption to make the server *Available*.
* If the key stored in the Azure KeyVault expires, the key will become invalid and the Azure Database for PostgreSQL Single server will transition into *Inaccessible* state. Extend the key expiry date using [CLI](/cli/azure/keyvault/key#az-keyvault-key-set-attributes) and then revalidate the data encryption to make the server *Available*.

### Accidental key access revocation from Key Vault

It might happen that someone with sufficient access rights to Key Vault accidentally disables server access to the key by:

* Revoking the key vault's get, wrapKey, and unwrapKey permissions from the server.
* Deleting the key.
* Deleting the key vault.
* Changing the key vault's firewall rules.

* Deleting the managed identity of the server in Azure AD.

## Monitor the customer-managed key in Key Vault

To monitor the database state, and to enable alerting for the loss of transparent data encryption protector access, configure the following Azure features:

* [Azure Resource Health](../service-health/resource-health-overview.md): An inaccessible database that has lost access to the customer key shows as "Inaccessible" after the first connection to the database has been denied.
* [Activity log](../service-health/alerts-activity-log-service-notifications-portal.md): When access to the customer key in the customer-managed Key Vault fails, entries are added to the activity log. You can reinstate access as soon as possible, if you create alerts for these events.

* [Action groups](../azure-monitor/alerts/action-groups.md): Define these groups to send you notifications and alerts based on your preferences.

## Restore and replicate with a customer's managed key in Key Vault

After Azure Database for PostgreSQL Single server is encrypted with a customer's managed key stored in Key Vault, any newly created copy of the server is also encrypted. You can make this new copy either through a local or geo-restore operation, or through read replicas. However, the copy can be changed to reflect a new customer's managed key for encryption. When the customer-managed key is changed, old backups of the server start using the latest key.

To avoid issues while setting up customer-managed data encryption during restore or read replica creation, it's important to follow these steps on the primary and restored/replica servers:

* Initiate the restore or read replica creation process from the primary Azure Database for PostgreSQL Single server.
* Keep the newly created server (restored/replica) in an inaccessible state, because its unique identity hasn't yet been given permissions to Key Vault.
* On the restored/replica server, revalidate the customer-managed key in the data encryption settings. This ensures that the newly created server is given wrap and unwrap permissions to the key stored in Key Vault.

## Limitations

For Azure Database for PostgreSQL, the support for encryption of data at rest using customers managed key (CMK) has few limitations -

* Support for this functionality is limited to **General Purpose** and **Memory Optimized** pricing tiers.
* This feature is only supported in regions and servers which support storage up to 16TB. For the list of Azure regions supporting storage up to 16TB, refer to the storage section in documentation [here](concepts-pricing-tiers.md#storage)

    > [!NOTE]
    > - All new PostgreSQL servers created in the regions listed above, support for encryption with customer manager keys is **available**. Point In Time Restored (PITR) server or read replica will not qualify though in theory they are ‘new’.
    > - To validate if your provisioned server supports up to 16TB, you can go to the pricing tier blade in the portal and see the max storage size supported by your provisioned server. If you can move the slider up to 4TB, your server may not support encryption with customer managed keys. However, the data is encrypted using service managed keys at all times. Please reach out to AskAzureDBforPostgreSQL@service.microsoft.com if you have any questions.

* Encryption is only supported with RSA 2048 cryptographic key.

## Next steps

Learn how to [set up data encryption with a customer-managed key for your Azure database for PostgreSQL Single server by using the Azure portal](howto-data-encryption-portal.md).
