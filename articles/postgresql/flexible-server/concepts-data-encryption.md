---
title: Data encryption with customer-managed key - Azure Database for PostgreSQL - Flexible Server
description: Azure Database for PostgreSQL Flexible Server data encryption with a customer-managed key enables you to Bring Your Own Key (BYOK) for data protection at rest. It also allows organizations to implement separation of duties in the management of keys and data.
author: gennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 1/24/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: conceptual
---

# Azure Database for PostgreSQL - Flexible Server Data Encryption with a Customer-managed Key 

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]



Azure PostgreSQL uses [Azure Storage encryption](../../storage/common/storage-service-encryption.md) to encrypt data at-rest by default using Microsoft-managed keys. For Azure PostgreSQL users, it's similar to Transparent Data Encryption (TDE) in other databases such as SQL Server. Many organizations require full control of access to the data using a customer-managed key. Data encryption with customer-managed keys for Azure Database for PostgreSQL Flexible Server enables you to bring your key (BYOK) for data protection at rest. It also allows organizations to implement separation of duties in the management of keys and data. With customer-managed encryption, you're responsible for, and in full control of, a key's lifecycle, key usage permissions, and auditing of operations on keys.

Data encryption with customer-managed keys for Azure Database for PostgreSQL Flexible Server  is set at the server level. For a given server, a customer-managed key, called the key encryption key (KEK), is used to encrypt the service's data encryption key (DEK). The KEK is an asymmetric key stored in a customer-owned and customer-managed [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)) instance. The Key Encryption Key (KEK) and Data Encryption Key (DEK) are described in more detail later in this article.

Key Vault is a cloud-based, external key management system. It's highly available and provides scalable, secure storage for RSA cryptographic keys, optionally backed by FIPS 140-2 Level 2 validated hardware security modules (HSMs). It doesn't allow direct access to a stored key but provides encryption and decryption services to authorized entities. Key Vault can generate the key, import it, or have it transferred from an on-premises HSM device.

## Benefits

Data encryption with customer-managed keys for Azure Database for PostgreSQL - Flexible Server  provides the following benefits:

- You fully control data-access by the ability to remove the key and make the database inaccessible.

- Full control over the key-lifecycle, including rotation of the key to aligning with corporate policies.

- Central management and organization of keys in Azure Key Vault.

- Enabling encryption doesn't have any additional performance impact with or without customers managed key (CMK) as PostgreSQL relies on the Azure storage layer for data encryption in both scenarios. The only difference is when CMK is used **Azure Storage Encryption Key**, which performs actual data encryption, is encrypted using CMK.

- Ability to implement separation of duties between security officers, DBA, and system administrators.

## Terminology and description

**Data encryption key (DEK)**: A symmetric AES256 key used to encrypt a partition or block of data. Encrypting each block of data with a different key makes crypto analysis attacks more difficult. Access to DEKs is needed by the resource provider or application instance that encrypts and decrypting a specific block. When you replace a DEK with a new key, only the data in its associated block must be re-encrypted with the new key.

**Key encryption key (KEK)**: An encryption key used to encrypt the DEKs. A KEK that never leaves Key Vault allows the DEKs themselves to be encrypted and controlled. The entity that has access to the KEK might be different than the entity that requires the DEK. Since the KEK is required to decrypt the DEKs, the KEK is effectively a single point by which DEKs can be effectively deleted by deleting the KEK.

The DEKs, encrypted with the KEKs, are stored separately. Only an entity with access to the KEK can decrypt these DEKs. For more information, see [Security in encryption at rest](../../security/fundamentals/encryption-atrest.md).

## How data encryption with a customer-managed key work

:::image type="content" source="./media/concepts-data-encryption/postgresql-data-encryption-overview.png" alt-text ="Diagram that shows an overview of Bring Your Own Key." :::

Microsoft Entra [user- assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) will be used to connect and retrieve customer-managed key. Follow this [tutorial](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md) to create identity.


For a PostgreSQL server to use customer-managed keys stored in Key Vault for encryption of the DEK, a Key Vault administrator gives the following **access rights** to the managed identity created above:

- **get**: For retrieving, the public part and properties of the key in the key Vault.

- **list**: For listing\iterating through keys in, the key Vault.

- **wrapKey**: To be able to encrypt the DEK. The encrypted DEK is stored in the Azure Database for PostgreSQL.

- **unwrapKey**: To be able to decrypt the DEK. Azure Database for PostgreSQL needs the decrypted DEK to encrypt/decrypt the data

The key vault administrator can also [enable logging of Key Vault audit events](../../key-vault/general/howto-logging.md?tabs=azure-cli), so they can be audited later.
> [!IMPORTANT]  
> Not providing above access rights to the Key Vault to managed identity for access to KeyVault may result in failure to fetch encryption key and subsequent failed setup of the Customer Managed Key (CMK) feature.


When the server is configured to use the customer-managed key stored in the key Vault, the server sends the DEK to the key Vault for encryptions. Key Vault returns the encrypted DEK stored in the user database. Similarly, when needed, the server sends the protected DEK to the key Vault for decryption. Auditors can use Azure Monitor to review Key Vault audit event logs, if logging is enabled.

## Requirements for configuring data encryption for Azure Database for PostgreSQL Flexible Server

The following are requirements for configuring Key Vault:

- Key Vault and Azure Database for PostgreSQL Flexible Server must belong to the same Microsoft Entra tenant. Cross-tenant Key Vault and server interactions aren't supported. Moving the Key Vault resource afterward requires you to reconfigure the data encryption.

- The key Vault must be set with 90 days for 'Days to retain deleted vaults'. If the existing key Vault has been configured with a lower number, you'll need to create a new key vault as it can't be modified after creation.

- **Enable the soft-delete feature on the key Vault**, to protect from data loss if an accidental key (or Key Vault) deletion happens. Soft-deleted resources are retained for 90 days unless the user recovers or purges them in the meantime. The recover and purge actions have their own permissions associated with a Key Vault access policy. The soft-delete feature is off by default, but you can enable it through PowerShell or the Azure CLI (note that you can't enable it through the Azure portal).

- Enable Purge protection to enforce a mandatory retention period for deleted vaults and vault objects

- Grant the Azure Database for PostgreSQL Flexible Server access to the key Vault with the get, list, wrapKey, and unwrapKey permissions using its unique managed identity.

The following are requirements for configuring the customer-managed key in Flexible Server:

- The customer-managed key to be used for encrypting the DEK can be only asymmetric, RSA 2048.

- The key activation date (if set) must be a date and time in the past. The expiration date (if set) must be a future date and time.

- The key must be in the *Enabled- state.

- If you're importing an existing key into the Key Vault, provide it in the supported file formats (`.pfx`, `.byok`, `.backup`).

### Recommendations

When you're using data encryption by using a customer-managed key, here are recommendations for configuring Key Vault:

- Set a resource lock on Key Vault to control who can delete this critical resource and prevent accidental or unauthorized deletion.

- Enable auditing and reporting on all encryption keys. Key Vault provides logs that are easy to inject into other security information and event management tools. Azure Monitor Log Analytics is one example of a service that's already integrated.

- Ensure that Key Vault and Azure Database for PostgreSQL = Flexible Server reside in the same region to ensure a faster access for DEK wrap, and unwrap operations.

- Lock down the Azure KeyVault to only **disable public access** and allow only *trusted Microsoft* services to secure the resources.

:::image type="content" source="media/concepts-data-encryption/key-vault-trusted-service.png" alt-text="Screenshot of an image of networking screen with trusted-service-with-AKV setting." lightbox="media/concepts-data-encryption/key-vault-trusted-service.png":::

> [!NOTE]
>Important to note, that after choosing **disable public access** option in Azure Key Vault networking and allowing only *trusted Microsoft* services you may see error similar to following : *You have enabled the network access control. Only allowed networks will have access to this key vault* while attempting to administer Azure Key Vault via portal through public access. This doesn't preclude ability to provide key during CMK setup or fetch keys from Azure Key Vault during server operations. 

Here are recommendations for configuring a customer-managed key:

- Keep a copy of the customer-managed key in a secure place, or escrow it to the escrow service.

- If Key Vault generates the key, create a key backup before using the key for the first time. You can only restore the backup to Key Vault.

### Accidental key access revocation from Key Vault

It might happen that someone with sufficient access rights to Key Vault accidentally disables server access to the key by:

- Revoking the Key Vault's **list**, **get**, **wrapKey**, and **unwrapKey** permissions from the identity used to retrieve key in KeyVault.

- Deleting the key.

- Deleting the Key Vault.

- Changing the Key Vault's firewall rules.

- Deleting the managed identity of the server in Microsoft Entra ID.

## Monitor the customer-managed key in Key Vault

To monitor the database state, and to enable alerting for the loss of transparent data encryption protector access, configure the following Azure features:

- [Azure Resource Health](../../service-health/resource-health-overview.md): An inaccessible database that has lost access to the Customer Key shows as "Inaccessible" after the first connection to the database has been denied.
- [Activity log](../../service-health/alerts-activity-log-service-notifications-portal.md): When access to the Customer Key in the customer-managed Key Vault fails, entries are added to the activity log. You can reinstate access if you create alerts for these events as soon as possible.
- [Action groups](../../azure-monitor/alerts/action-groups.md): Define these groups to send you notifications and alerts based on your preferences.

## Restore and replicate with a customer's managed key in Key Vault

After Azure Database for PostgreSQL - Flexible Server is encrypted with a customer's managed key stored in Key Vault, any newly created server copy is also encrypted. You can make this new copy through a [PITR restore](concepts-backup-restore.md) operation or read replicas.

Avoid issues while setting up customer-managed data encryption during restore or read replica creation by following these steps on the primary and restored/replica servers:

- Initiate the restore or read replica creation process from the primary Azure Database for PostgreSQL - Flexible Server.

- On the restored/replica server, you can change the customer-managed key and\or Microsoft Entra identity used to access Azure Key Vault in the data encryption settings. Ensure that the newly created server is given list, wrap and unwrap permissions to the key stored in Key Vault.

-  Don't revoke the original key after restoring, as at this time we don't support key revocation after restoring CMK enabled server to another server

## Using Azure Key Vault Managed HSM

**Hardware security modules (HSMs)** are hardened, tamper-resistant hardware devices that secure cryptographic processes by generating, protecting, and managing keys used for encrypting and decrypting data and creating digital signatures and certificates. HSMs are tested, validated and certified to the highest security standards including FIPS 140-2 and Common Criteria. Azure Key Vault Managed HSM (Hardware Security Module) is a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using FIPS 140-2 Level 3 validated HSMs. 

You can pick **Azure Key Vault Managed HSM** as key store when creating new PostgreSQL Flexible Server in Azure Portal with Customer Managed Key (CMK) feature, as alternative to **Azure Key Vault**.  The prerequisites in terms of user defined identity and permissions are same as with Azure Key Vault, as already listed [above](#requirements-for-configuring-data-encryption-for-azure-database-for-postgresql-flexible-server).  More information on how to create Azure Key Vault  Managed HSM, its advantages and differences with shared Azure Key Vault based certificate store, as well as how to import keys into AKV Managed HSM is available [here](../../key-vault/managed-hsm/overview.md). 

## Inaccessible customer-managed key condition

When you configure data encryption with a customer-managed key in Key Vault, continuous access to this key is required for the server to stay online. If the server loses access to the customer-managed key in Key Vault, the server begins denying all connections within 10 minutes. The server issues a corresponding error message, and changes the server state to *Inaccessible*.
Some of the reasons why server state can become *Inaccessible* are:

-  If you delete the KeyVault, the Azure Database for PostgreSQL - Flexible Server will be unable to access the key and will move to *Inaccessible*  state. [Recover the Key Vault](../../key-vault/general/key-vault-recovery.md) and revalidate the data encryption to make the server *Available*.
- If you delete the key from the KeyVault, the Azure Database for PostgreSQL- Flexible Server will be unable to access the key and will move to *Inaccessible* state. [Recover the Key](../../key-vault/general/key-vault-recovery.md) and revalidate the data encryption to make the server *Available*.
- If you delete [managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) from Microsoft Entra ID that is used to retrieve a key from KeyVault, the Azure Database for PostgreSQL- Flexible Server will be unable to access the key and will move to *Inaccessible* state.[Recover the identity](../../active-directory/fundamentals/recover-from-deletions.md) and revalidate data encryption to make server *Available*. 
- If you revoke  the Key Vault's list, get, wrapKey, and unwrapKey access policies from the [managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) that is used to retrieve a key from KeyVault, the Azure Database for PostgreSQL- Flexible Server will be unable to access the key and will move to *Inaccessible* state. [Add required access policies](../../key-vault/general/assign-access-policy.md) to the identity in KeyVault. 
- If you set up overly restrictive Azure KeyVault firewall rules that cause Azure Database for PostgreSQL- Flexible Server inability to communicate with Azure KeyVault to retrieve keys. If you enable [KeyVault firewall](../../key-vault/general/overview-vnet-service-endpoints.md#trusted-services), make sure you check an option to *'Allow Trusted Microsoft Services to bypass this firewall.'*

> [!NOTE]
> When a key is either disabled, deleted, expired, or not reachable server with data encrypted using that key will become **inaccessible** as stated above. Server will not become available until the key is enabled again, or you assign a new key.
> Generally, server will become **inaccessible** within an 60 minutes after a key is either disabled, deleted,  expired, or cannot be reached. Similarly after key becomes available it may take up to 60 minutes until server becomes accessible again. 

## Using Data Encryption with Customer Managed Key (CMK) and Geo-redundant Business Continuity features, such as Replicas and Geo-redundant backup

Azure Database for PostgreSQL - Flexible Server supports advanced [Data Recovery (DR)](../flexible-server/concepts-business-continuity.md) features, such as [Replicas](../../postgresql/flexible-server/concepts-read-replicas.md) and [geo-redundant backup](../flexible-server/concepts-backup-restore.md).  Following are requirements for setting up data encryption with CMK and these features, additional to [basic requirements for data encryption with CMK](#requirements-for-configuring-data-encryption-for-azure-database-for-postgresql-flexible-server):

* The Geo-redundant backup encryption key needs to be the created in an Azure Key Vault (AKV) in the region where the Geo-redundant backup is stored 
* The [Azure Resource Manager (ARM) REST API](../../azure-resource-manager/management/overview.md) version for supporting Geo-redundant backup enabled CMK servers is '2022-11-01-preview'. Therefore, using [ARM templates](../../azure-resource-manager/templates/overview.md) for automation of creation of servers utilizing both encryption with CMK and geo-redundant backup features,  please use this ARM API version. 
*  Same [user managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md)can't be used to authenticate for primary database Azure Key Vault (AKV) and Azure Key Vault (AKV) holding encryption key for Geo-redundant backup. To make sure that we maintain regional resiliency we recommend creating user managed identity in the same region as the geo-backups. 
* If [Read replica database](../flexible-server/concepts-read-replicas.md) is set up to be encrypted with CMK during creation, its encryption key needs to be resident in an Azure Key Vault (AKV) in the region where Read replica database resides. [User assigned identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) to authenticate against this Azure Key Vault (AKV) needs to be created in the same region. 

## Limitations

The following are current limitations for configuring the customer-managed key in Flexible Server:

- CMK encryption can only be configured during creation of a new server, not as an update to the existing Flexible Server. You can [restore PITR backup to new server with CMK encryption](./concepts-backup-restore.md#point-in-time-recovery) instead. 

- Once enabled, CMK encryption can't be removed. If customer desires to remove this feature, it can only be done via [restore of the server to non-CMK server](./concepts-backup-restore.md#point-in-time-recovery).



## Next steps

- [Microsoft Entra ID](../../active-directory-domain-services/overview.md)
