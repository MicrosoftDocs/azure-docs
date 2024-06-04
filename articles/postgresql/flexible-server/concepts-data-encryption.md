---
title: Data encryption with a customer-managed key in Azure Database for PostgreSQL - Flexible Server
description: Learn how data encryption with a customer-managed key in Azure Database for PostgreSQL - Flexible Server enables you to bring your own key for data protection at rest and allows organizations to implement separation of duties in the management of keys and data.
author: gennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 05/24/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.custom:
  - ignite-2023
---

# Data encryption with a customer-managed key in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server uses [Azure Storage encryption](../../storage/common/storage-service-encryption.md) to encrypt data at rest by default, by using Microsoft-managed keys. For users of Azure Database for PostgreSQL flexible server, it's similar to transparent data encryption in other databases such as SQL Server.

Many organizations require full control of access to the data by using a customer-managed key (CMK). Data encryption with CMKs for Azure Database for PostgreSQL flexible server enables you to bring your key (BYOK) for data protection at rest. It also allows organizations to implement separation of duties in the management of keys and data. With CMK encryption, you're responsible for, and in full control of, a key's lifecycle, key usage permissions, and auditing of operations on keys.

Data encryption with CMKs for Azure Database for PostgreSQL flexible server is set at the server level. For a particular server, a type of CMK called the key encryption key (KEK) is used to encrypt the service's data encryption key (DEK). The KEK is an asymmetric key stored in a customer-owned and customer-managed [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) instance. The KEK and DEK are described in more detail later in this article.

Key Vault is a cloud-based, external key management system. It's highly available and provides scalable, secure storage for RSA cryptographic keys, optionally backed by [FIPS 140 validated](/azure/key-vault/keys/about-keys#compliance) hardware security modules (HSMs). It doesn't allow direct access to a stored key but provides encryption and decryption services to authorized entities. Key Vault can generate the key, import it, or have it transferred from an on-premises HSM device.

## Benefits

Data encryption with CMKs for Azure Database for PostgreSQL flexible server provides the following benefits:

- You fully control data access. You can remove a key to make a database inaccessible.

- You fully control a key's life cycle, including rotation of the key to align with corporate policies.

- You can centrally manage and organize keys in Key Vault.

- Turning on encryption doesn't affect performance with or without CMKs, because PostgreSQL relies on the Azure Storage layer for data encryption in both scenarios. The only difference is that when you use a CMK, the Azure Storage encryption key (which performs actual data encryption) is encrypted.

- You can implement a separation of duties between security officers, database administrators, and system administrators.

## Terminology

**Data encryption key (DEK)**: A symmetric AES 256 key that's used to encrypt a partition or block of data. Encrypting each block of data with a different key makes cryptanalysis attacks more difficult. The resource provider or application instance that encrypts and decrypts a specific block needs access to DEKs. When you replace a DEK with a new key, only the data in its associated block must be re-encrypted with the new key.

**Key encryption key (KEK)**: An encryption key that's used to encrypt the DEKs. A KEK that never leaves Key Vault allows the DEKs themselves to be encrypted and controlled. The entity that has access to the KEK might be different from the entity that requires the DEKs. Because the KEK is required to decrypt the DEKs, the KEK is effectively a single point by which you can delete DEKs (by deleting the KEK).

The DEKs, encrypted with a KEK, are stored separately. Only an entity that has access to the KEK can decrypt these DEKs. For more information, see [Security in encryption at rest](../../security/fundamentals/encryption-atrest.md).

## How data encryption with a CMK works

:::image type="content" source="./media/concepts-data-encryption/postgresql-data-encryption-overview.png" alt-text ="Diagram that shows an overview of bring your own key." :::

A Microsoft Entra [user-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) is used to connect and retrieve a CMK. To create an identity, follow [this tutorial](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md).

For a PostgreSQL server to use CMKs stored in Key Vault for encryption of the DEK, a Key Vault administrator gives the following *access rights* to the managed identity that you created:

- **get**: For retrieving the public part and properties of the key in Key Vault.

- **list**: For listing and iterating through keys in Key Vault.

- **wrapKey**: For encrypting the DEK. The encrypted DEK is stored in Azure Database for PostgreSQL.

- **unwrapKey**: For decrypting the DEK. Azure Database for PostgreSQL needs the decrypted DEK to encrypt and decrypt the data.

The Key Vault administrator can also [enable logging of Key Vault audit events](../../key-vault/general/howto-logging.md?tabs=azure-cli), so they can be audited later.

Alternative to *access rights* assignment , as explained above, you can create a new Azure RBAC role assignment with the role [Key Vault Crypto Service Encryption User](../../key-vault/general/rbac-guide.md#azure-built-in-roles-for-key-vault-data-plane-operations).

> [!IMPORTANT]  
> Not providing the preceding access rights or RBAC assignment to a managed identity for access to Key Vault might result in failure to fetch an encryption key and failure to set up the CMK feature.

When you configure the server to use the CMK stored in Key Vault, the server sends the DEK to Key Vault for encryption. Key Vault returns the encrypted DEK stored in the user database. When necessary, the server sends the protected DEK to Key Vault for decryption. Auditors can use Azure Monitor to review Key Vault audit event logs, if logging is turned on.

## Requirements for configuring data encryption for Azure Database for PostgreSQL flexible server

Here are requirements for configuring Key Vault:

- Key Vault and Azure Database for PostgreSQL flexible server must belong to the same Microsoft Entra tenant. Cross-tenant Key Vault and server interactions aren't supported. Moving the Key Vault resource afterward requires you to reconfigure the data encryption.

- The **Days to retain deleted vaults** setting for Key Vault must be **90**. If you configured the existing Key Vault instance with a lower number, you need to create a new Key Vault instance because you can't modify an instance after creation.

- It is recommended to set the **Days to retain deleted vaults** configuration for Key Vault to 90 days. In the event that you have configured an existing Key Vault instance with a lower number, it should still valid. However, if you wish to modify this setting and increase the value, it is necessary to create a new Key Vault instance. Once an instance is created, it is not possible to modify its configuration.

- Enable the soft-delete feature in Key Vault to help protect from data loss if a key or a Key Vault instance is accidentally deleted. Key Vault retains soft-deleted resources for 90 days unless the user recovers or purges them in the meantime. The recover and purge actions have their own permissions associated with a Key Vault access policy.

  The soft-delete feature is off by default, but you can turn it on through PowerShell or the Azure CLI. You can't turn it on through the Azure portal.

- Enable purge protection to enforce a mandatory retention period for deleted vaults and vault objects.

- Grant the Azure Database for PostgreSQL flexible server instance access to Key Vault with the **get**, **list**, **wrapKey**, and **unwrapKey** permissions, by using its unique managed identity.  Alternatively, create a new Azure RBAC role assignment with the role **[Key Vault Crypto Service Encryption User](../../key-vault/general/rbac-guide.md#azure-built-in-roles-for-key-vault-data-plane-operations)** for the managed identity.

Here are requirements for configuring the CMK in Azure Database for PostgreSQL flexible server:

- The CMK to be used for encrypting the DEK can be only asymmetric, RSA, or RSA-HSM. Key sizes of 2,048, 3,072, and 4,096 are supported.

- The date and time for key activation (if set) must be in the past. The date and time for expiration (if set) must be in the future.

- The key must be in the `*Enabled-` state.

- If you're importing an existing key into Key Vault, provide it in the supported file formats (`.pfx`, `.byok`, or `.backup`).

### Recommendations

When you're using a CMK for data encryption, here are recommendations for configuring Key Vault:

- Set a resource lock on Key Vault to control who can delete this critical resource and to prevent accidental or unauthorized deletion.

- Enable auditing and reporting on all encryption keys. Key Vault provides logs that are easy to inject into other security information and event management (SIEM) tools. Azure Monitor Logs is one example of a service that's already integrated.

- Ensure that Key Vault and Azure Database for PostgreSQL flexible server reside in the same region to ensure faster access for DEK wrap and unwrap operations.

- Lock down Key Vault by selecting **Disable public access** and **Allow trusted Microsoft services to bypass this firewall**.

  :::image type="content" source="media/concepts-data-encryption/key-vault-trusted-service.png" alt-text="Screenshot of network options for disabling public access and allowing only trusted Microsoft services." lightbox="media/concepts-data-encryption/key-vault-trusted-service.png":::

> [!NOTE]
> After you select **Disable public access** and **Allow trusted Microsoft services to bypass this firewall**, you might get an error similar to the following when you try to use public access to administer Key Vault via the portal: "You have enabled the network access control. Only allowed networks will have access to this key vault." This error doesn't preclude the ability to provide keys during CMK setup or fetch keys from Key Vault during server operations.

Here are recommendations for configuring a CMK:

- Keep a copy of the CMK in a secure place, or escrow it to the escrow service.

- If Key Vault generates the key, create a key backup before you use the key for the first time. You can only restore the backup to Key Vault.

### Accidental key access revocation from Key Vault

Someone with sufficient access rights to Key Vault might accidentally disable server access to the key by:

- Revoking the **list**, **get**, **wrapKey**, and **unwrapKey** permissions from the identity that's used to retrieve the key in Key Vault.

- Deleting the key.

- Deleting the Key Vault instance.

- Changing the Key Vault firewall rules.

- Deleting the managed identity of the server in Microsoft Entra ID.

## Monitoring the CMK in Key Vault

To monitor the database state, and to turn on alerts for the loss of access to the transparent data encryption protector, configure the following Azure features:

- [Resource health](../../service-health/resource-health-overview.md): A database that lost access to the CMK appears as **Inaccessible** after the first connection to the database is denied.
- [Activity log](../../service-health/alerts-activity-log-service-notifications-portal.md): When access to the CMK in the customer-managed Key Vault instance fails, entries are added to the activity log. You can reinstate access if you create alerts for these events as soon as possible.
- [Action groups](../../azure-monitor/alerts/action-groups.md): Define these groups to receive notifications and alerts based on your preferences.

## Restoring with a customer's managed key in Key Vault

After Azure Database for PostgreSQL flexible server is encrypted with a customer's managed key stored in Key Vault, any newly created server copy is also encrypted. You can make this new copy through a [point-in-time restore (PITR)](concepts-backup-restore.md) operation or read replicas.

When you're setting up customer-managed data encryption during restore or creation of a read replica, you can avoid problems by following these steps on the primary and restored/replica servers:

- Initiate the restore process or the process of creating a read replica from the primary Azure Database for PostgreSQL flexible server instance.

- On the restored or replica server, you can change the CMK and/or the Microsoft Entra identity that's used to access Key Vault in the data encryption settings. Ensure that the newly created server has **list**, **wrap**, and **unwrap** permissions to the key stored in Key Vault.

- Don't revoke the original key after restoring. At this time, we don't support key revocation after you restore a CMK-enabled server to another server.

## Managed HSMs

Hardware security modules (HSMs) are tamper-resistant hardware devices that help secure cryptographic processes by generating, protecting, and managing keys used for encrypting data, decrypting data, creating digital signatures, and creating digital certificates. HSMs are tested, validated, and certified to the highest security standards, including FIPS 140 and Common Criteria.

Azure Key Vault Managed HSM is a fully managed, highly available, single-tenant, standards-compliant cloud service. You can use it to safeguard cryptographic keys for your cloud applications through [FIPS 140-3 validated HSMs](/azure/key-vault/keys/about-keys#compliance).

When you're creating new Azure Database for PostgreSQL flexible server instances in the Azure portal with the CMK feature, you can choose **Azure Key Vault Managed HSM** as a key store as an alternative to **Azure Key Vault**. The prerequisites, in terms of user-defined identity and permissions, are the same as with Azure Key Vault (as listed [earlier in this article](#requirements-for-configuring-data-encryption-for-azure-database-for-postgresql-flexible-server)). For more information on how to create a Managed HSM instance, its advantages and differences from a shared Key Vault-based certificate store, and how to import keys into Managed HSM, see [What is Azure Key Vault Managed HSM?](../../key-vault/managed-hsm/overview.md).

## Inaccessible CMK condition

When you configure data encryption with a CMK in Key Vault, continuous access to this key is required for the server to stay online. If the server loses access to the CMK in Key Vault, the server begins denying all connections within 10 minutes. The server issues a corresponding error message and changes the server state to **Inaccessible**.

Some of the reasons why the server state becomes **Inaccessible** are:

- If you delete the Key Vault instance, the Azure Database for PostgreSQL flexible server instance can't access the key and moves to an **Inaccessible** state. To make the server **Available**, [recover the Key Vault instance](../../key-vault/general/key-vault-recovery.md) and revalidate the data encryption.
- If you delete the key from Key Vault, the Azure Database for PostgreSQL flexible server instance can't access the key and moves to an **Inaccessible** state. To make the server **Available**, [recover the key](../../key-vault/general/key-vault-recovery.md) and revalidate the data encryption.
- If you delete, from Microsoft Entra ID, a [managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) that's used to retrieve a key from Key Vault,  or by delete Azure RBAC role assignment with the role [Key Vault Crypto Service Encryption User](../../key-vault/general/rbac-guide.md#azure-built-in-roles-for-key-vault-data-plane-operations). the Azure Database for PostgreSQL flexible server instance can't access the key and moves to an **Inaccessible** state. To make the server **Available**, [recover the identity](../../active-directory/fundamentals/recover-from-deletions.md) and revalidate data encryption.
- If you revoke the Key Vault **list**, **get**, **wrapKey**, and **unwrapKey** access policies from the [managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) that's used to retrieve a key from Key Vault, the Azure Database for PostgreSQL flexible server instance can't access the key and moves to an **Inaccessible** state. [Add required access policies](../../key-vault/general/assign-access-policy.md) to the identity in Key Vault.
- If you set up overly restrictive Key Vault firewall rules, Azure Database for PostgreSQL flexible server can't communicate with Key Vault to retrieve keys. When you configure a Key Vault firewall, be sure to select the option to allow [trusted Microsoft services](../../key-vault/general/overview-vnet-service-endpoints.md#trusted-services) to bypass the firewall.

> [!NOTE]
> When a key is disabled, deleted, expired, or not reachable, a server that has data encrypted through that key becomes **Inaccessible**, as stated earlier. The server won't become available until you re-enable the key or assign a new key.
>
> Generally, a server becomes **Inaccessible** within 60 minutes after a key is disabled, deleted, expired, or not reachable. After key the becomes available, the server might take up to 60 minutes to become **Accessible** again.

## Recovering from Managed Identity Deletion 

In rare case when Entra ID managed identity, which used by CMK to retrieve a key from Azure Key Vault (AKV), is deleted in Microsoft Entra ID following are recommended steps to recover:
1. Either [recover the identity](../../active-directory/fundamentals/recover-from-deletions.md) or create new managed Entra ID identity 
2. Make sure this identity has proper permissions for operations on key in Azure Key Vault (AKV). Depending on the permission model of the key vault (access policy or Azure RBAC), key vault access can be granted either by creating an access policy on the key vault (**list**, **get**, **wrapKey**, and **unwrapKey** access policies), or by creating a new Azure RBAC role assignment with the role [Key Vault Crypto Service Encryption User](../../key-vault/general/rbac-guide.md#azure-built-in-roles-for-key-vault-data-plane-operations).
3. Revalidate CMK data encryption with a new or recovered identity in Azure Database for PostgreSQL - Flexible Server Data Encryption Azure portal screen. 
> [!IMPORTANT]
> Simply creating new Entra ID identity with the same name as deleted identity doesn't recover from managed identity deletion.


## Using data encryption with CMKs and geo-redundant business continuity features

Azure Database for PostgreSQL flexible server supports advanced [data recovery](../flexible-server/concepts-business-continuity.md) features, such as [replicas](../../postgresql/flexible-server/concepts-read-replicas.md) and [geo-redundant backup](../flexible-server/concepts-backup-restore.md). Following are requirements for setting up data encryption with CMKs and these features, in addition to [basic requirements for data encryption with CMKs](#requirements-for-configuring-data-encryption-for-azure-database-for-postgresql-flexible-server):

- The geo-redundant backup encryption key needs to be created in a Key Vault instance in the region where the geo-redundant backup is stored.
- The [Azure Resource Manager REST API](../../azure-resource-manager/management/overview.md) version for supporting geo-redundant backup-enabled CMK servers is 2022-11-01-preview. If you want to use [Azure Resource Manager templates](../../azure-resource-manager/templates/overview.md) to automate the creation of servers that use both encryption with CMKs and geo-redundant backup features, use this API version.
- You can't use the same [user-managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) to authenticate for the primary database's Key Vault instance and the Key Vault instance that holds the encryption key for geo-redundant backup. To maintain regional resiliency, we recommend that you create the user-managed identity in the same region as the geo-redundant backups.
- If you set up a [read replica database](../flexible-server/concepts-read-replicas.md) to be encrypted with CMKs during creation, its encryption key needs to be in a Key Vault instance in the region where the read replica database resides. The [user-assigned identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) to authenticate against this Key Vault instance needs to be created in the same region.

## Limitations

Here are current limitations for configuring the CMK in Azure Database for PostgreSQL flexible server:

- You can configure CMK encryption only during creation of a new server, not as an update to an existing Azure Database for PostgreSQL flexible server instance. You can [restore a PITR backup to a new server with CMK encryption](./concepts-backup-restore.md#point-in-time-recovery) instead.

- After you configure CMK encryption, you can't remove it. If you want to remove this feature, the only way is to [restore the server to a non-CMK server](./concepts-backup-restore.md#point-in-time-recovery).

## Next steps

- Learn about [Microsoft Entra Domain Services](../../active-directory-domain-services/overview.md).
