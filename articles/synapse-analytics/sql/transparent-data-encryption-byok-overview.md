---
title: Customer-Managed Transparent Data Encryption (TDE)
titleSuffix: Azure Synapse Analytics
description: Learn how to protect standalone Azure Synapse Analytics dedicated SQL pools with a customer-managed TDE key in Azure Key Vault.
author: Pietervanhove
ms.author: pivanho
ms.reviewer: vanto
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
ms.custom:
  - sfi-image-nochange
---

# Customer-managed TDE for Azure Synapse Analytics

**Applies to:** Azure Synapse Analytics dedicated SQL pools (formerly SQL DW)

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]


[Transparent data encryption (TDE)](/sql/relational-databases/security/encryption/transparent-data-encryption?view=azure-sqldw-latest&preserve-view=true) with customer-managed key (CMK) enables Bring Your Own Key (BYOK) scenario for data protection at rest, and allows organizations to implement separation of duties in the management of keys and data. By using customer-managed TDE, you take responsibility for and have full control of key lifecycle management (key creation, upload, rotation, deletion), key usage permissions, and auditing of operations on keys.

In this scenario, the Transparent Data Encryption (TDE) protector is a customer-managed key that secures the Database Encryption Key (DEK). You store the TDE protector in either [Azure Key Vault](/azure/key-vault/general/security-features) or [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview), which are secure cloud-based key management services designed for high availability and scalability. Both services support cryptographic keys protected by FIPS 140-2 validated hardware: Azure Key Vault supports FIPS 140-2 Level 2, and Azure Key Vault Managed HSM supports FIPS 140-2 Level 3. Both services also support asymmetric and symmetric key types, and the supported algorithms and usage depend on the TDE deployment model. You can generate the key in the service, import it, or [securely transfer it from on-premises HSMs](/azure/key-vault/keys/hsm-protected-keys). Direct access to keys is restricted, so authorized services perform cryptographic operations without exposing the key material.


> [!NOTE]
> This article covers standalone dedicated SQL pools (formerly SQL DW).
>
> - For Azure Synapse Analytics dedicated SQL pools (formerly SQL DW), set the TDE protector at the server level. All encrypted databases associated with that server inherit the TDE protector. 
> - Encrypt the data in dedicated SQL pools and serverless SQL pools in a Synapse workspace by using the customer-managed key configured at the workspace level. For more information on transparent data encryption for dedicated SQL pools inside Synapse workspaces, see [Azure Synapse Analytics encryption](/azure/synapse-analytics/security/workspaces-encryption). 

## Customer Managed Key (CMK) and Bring Your Own Key (BYOK)

In this article, the terms Customer Managed Key (CMK) and Bring Your Own Key (BYOK) are used interchangeably, but they represent some differences.

- **Customer Managed Key (CMK)** - You manage the key lifecycle, including key creation, rotation, and deletion. Store the key in [Azure Key Vault](/azure/key-vault/general/overview) or [Azure Managed HSM](/azure/key-vault/managed-hsm/overview) and use it for encryption of the Database Encryption Key (DEK).

- **Bring Your Own Key (BYOK)** - You securely bring or import your own key from an on-premises hardware security module (HSM) into Azure Key Vault. Such imported keys might be used as any other key in Azure Key Vault, including as a Customer Managed Key for encryption of the DEK. For more information, see [Import HSM-protected keys to Managed HSM (BYOK)](/azure/key-vault/managed-hsm/hsm-protected-keys-byok).

## Benefits of the customer-managed TDE

Customer-managed TDE provides the following benefits:

- Full and granular control over usage and management of the TDE protector.

- Transparency of the TDE protector usage.

- Ability to implement separation of duties in the management of keys and data within the organization.

- Azure Key Vault administrator can revoke key access permissions to make encrypted database inaccessible.

- Central management of keys in Azure Key Vault.

- Greater trust from your end customers, since Azure Key Vault is designed such that Microsoft can't see nor extract encryption keys.

> [!IMPORTANT]  
> For those using service-managed TDE who want to start using customer-managed TDE, data stays encrypted during the process of switching over, and there's no downtime or re-encryption of the database files. Switching from a service-managed key to a customer-managed key only requires re-encryption of the DEK, which is a fast and online operation.

## Permissions to configure customer-managed TDE in Azure Key Vault

Select the type of Azure Key Vault you want to use.

For the SQL logical server in Azure to use the TDE protector stored in Azure Key Vault for encryption of the DEK, the **Key Vault Administrator** needs to give access rights to the server by using its unique Microsoft Entra identity. The server identity can be a system-assigned managed identity or a user-assigned managed identity assigned to the server. There are two access models to grant the server access to the key vault:

- Azure role-based access control (RBAC) - Use Azure RBAC to grant a user, group, or application access to the key vault. This method is recommended for its flexibility and granularity. The server identity needs the [Key Vault Crypto Service Encryption User](/azure/key-vault/general/rbac-guide#azure-built-in-roles-for-key-vault-data-plane-operations) role to use the key for encryption and decryption operations.
- Vault access policy - Use the key vault access policy to grant the server access to the key vault. This method is simpler and more straightforward, but less flexible. The server identity needs the following permissions on the key vault:

  - **get** - for retrieving the public part and properties of the key in the Azure Key Vault
  - **wrapKey** - to be able to protect (encrypt) DEK
  - **unwrapKey** - to be able to unprotect (decrypt) DEK

In the **Access configuration** Azure portal menu of the key vault, you have the option of selecting **Azure role-based access control** or **Vault access policy**. For step-by-step instructions on setting up an Azure Key Vault access configuration for TDE, see [Set up SQL Server TDE Extensible Key Management by using Azure Key Vault](/sql/relational-databases/security/encryption/setup-steps-for-extensible-key-management-using-the-azure-key-vault?view=azure-sqldw-latest&preserve-view=true). For more information on the access models, see [Azure Key Vault security](/azure/key-vault/general/security-features#access-model-overview).

A **Key Vault Administrator** can also [enable logging of key vault audit events](/azure/azure-monitor/insights/key-vault-insights-overview), so they can be audited later.

When you configure a server to use a TDE protector from Azure Key Vault, the server sends the DEK of each TDE-enabled database to the key vault for encryption. The key vault returns the encrypted DEK, which the server stores in the user database.

When needed, the server sends the protected DEK to the key vault for decryption.

Auditors can use Azure Monitor to review key vault AuditEvent logs if logging is enabled.

> [!NOTE]
> It might take around 10 minutes for any permission changes to take effect for the key vault. This time includes revoking access permissions to the TDE protector in AKV, and users might still have access permissions.


## Requirements to configure customer-managed TDE in Azure Key Vault

- Enable [soft-delete](/azure/key-vault/general/soft-delete-overview) and [purge protection](/azure/key-vault/general/soft-delete-overview#purge-protection) features on the Azure Key Vault. This configuration helps prevent accidental or malicious key vault or key deletion that can lead to the database going into *Inaccessible* state. When you configure the TDE protector on an existing server or during server creation, Azure SQL validates that the key vault you're using has soft-delete and purge protection turned on. If soft-delete and purge protection aren't enabled on the key vault, the TDE protector setup fails with an error. In this case, enable soft-delete and purge protection on the key vault, and then perform the TDE protector setup.

- When using a firewall with Azure Key Vault, you must enable the option **Allow trusted Microsoft services to bypass the firewall**, unless you're using [private endpoints for the Azure Key Vault](/azure/key-vault/general/private-link-service). For more information, see [Configure Azure Key Vault firewalls and virtual networks](/azure/key-vault/general/network-security).


### Key requirements for configuring TDE protector

Transparent Data Encryption with customer-managed keys uses an external key, referred to as the TDE protector, stored in Azure Key Vault to protect the database encryption key (DEK).

The following requirements apply.

#### Supported key types and sizes

The TDE protector can be backed by asymmetric keys stored in Azure Key Vault. Supported key sizes are 2,048-bit and 3,072-bit.

#### Key state and validity requirements

- If you specify a key activation date, set it to a date and time in the past.
- If you specify a key expiration date, set it to a date and time in the future.
- The key must be in the *Enabled* state.

#### Key import requirements

If you import an existing key into Azure Key Vault, provide the key in one of the following supported formats:

- `.pfx`
- `.byok`
- `.backup`

## Recommendations for configuring customer-managed TDE in Azure Key Vault

To maintain high availability and avoid throttling issues, follow these guidelines per subscription:

- To ensure optimal performance and reliability, use a **dedicated Azure Key Vault** for Azure SQL. Don't share this key vault with other services. If the key vault is under heavy load due to shared usage or excessive key operations, it can negatively affect database performance, especially during encryption key access. Azure Key Vault enforces [throttling limits](/azure/key-vault/general/service-limits). When these limits are exceeded, operations might be delayed or fail. This risk is highest during server failovers, which trigger key operations for every database on the server.

  For more information about throttling behavior, see [Azure Key Vault throttling guidance](/azure/key-vault/general/overview-throttling).




  - The number of Hyperscale databases that you can associate with a single Azure Key Vault depends on the number of page servers. Each page server is linked to a logical data file. To find the number of page servers, run the following query.

    ```sql
    -- # of page servers (primary copies) for this database
    SELECT COUNT(*) AS page_server_count
    FROM sys.database_files
    WHERE type_desc = 'ROWS';
    ```

    Don't associate more than **500 page servers** with a single Azure Key Vault. As the database grows, the number of page servers increases automatically, so it's important to monitor database size regularly. If the number of page servers exceeds 500, use a dedicated Azure Key Vault for each Hyperscale database, and don't share that key vault with other Azure SQL resources.

  - **Monitor** and configure Azure Key Vault **alerts**. For more information about monitoring and alerting, see [Monitor Azure Key Vault](/azure/key-vault/general/monitor-key-vault) and [Configure Azure Key Vault alerts](/azure/key-vault/general/alert).
- Set a resource lock on the key vault to control who can delete this critical resource and prevent accidental or unauthorized deletion. To learn more about [resource locks](/azure/azure-resource-manager/management/lock-resources).

- Enable auditing and reporting on all encryption keys: Azure Key Vault provides logs that are easy to inject into other security information and event management tools. Operations Management Suite [Log Analytics](/azure/azure-monitor/insights/key-vault-insights-overview) is one example of a service that is already integrated.

- Use a key vault from an Azure region that can replicate its content to a paired region for maximum availability. For more information, see [Best practices for using Azure Key Vault](/azure/key-vault/general/best-practices) and [Azure Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance).

### Recommendations for configuring TDE protector

- Keep a copy of the TDE protector in a secure location or escrow it to an escrow service.

- If you generate the key in the key vault, create a key backup before using the key in Azure Key Vault for the first time. You can restore the backup only to an Azure Key Vault. To learn more, see the [Backup-AzKeyVaultKey](/powershell/module/az.keyvault/backup-azkeyvaultkey) command. Azure Managed HSM supports creating a full backup of the entire contents of the HSM, including all keys, versions, attributes, tags, and role assignments. For more information, see [Full backup and restore and selective key restore](/azure/key-vault/managed-hsm/backup-restore).

- Create a new backup whenever you make any changes to the key (for example, key attributes, tags, ACLs).

- **Keep previous versions** of the key in the key vault or Managed HSM when rotating keys, so you can restore older database backups. When the TDE protector changes for a database, old backups of the database **aren't updated** to use the latest TDE protector. At restore time, each backup needs the TDE protector it was encrypted with at creation time. To rotate keys, follow the instructions in the article [Rotate the Transparent data encryption (TDE) protector](transparent-data-encryption-byok-key-rotation.md).

- Keep all previously used keys in Azure Key Vault even after switching to service-managed keys. It ensures database backups can be restored with the TDE protectors stored in Azure Key Vault. TDE protectors created with Azure Key Vault have to be maintained until all remaining stored backups have been created with service-managed keys. Make recoverable backup copies of these keys by using [Backup-AzKeyVaultKey](/powershell/module/az.keyvault/backup-azkeyvaultkey).

- To remove a potentially compromised key during a security incident without the risk of data loss, follow the steps in the article [Remove a Transparent Data Encryption (TDE) protector using PowerShell](transparent-data-encryption-byok-remove-tde-protector.md). Always rotate to a new TDE protector and verify that all databases are using the new key before deleting or disabling the compromised key. Deleting or disabling the key without rotating first causes all encrypted databases to become inaccessible, and doesn't invalidate any key copies that were previously backed up and restored to another vault.

## Rotation of TDE protector

When you rotate the TDE protector, you replace the key that protects the database encryption key (DEK). Key rotation is an online operation and takes only a few seconds. This operation decrypts and re-encrypts only the database encryption key, not the entire database.

You can rotate the TDE protector by switching the configuration to use a new key stored in Azure Key Vault. Depending on the offering and supported configuration, this key can be:

- Switching to a new key version of the same key
- Switching to a different key

[Rotation of the TDE protector](transparent-data-encryption-byok-key-rotation.md) can be done manually or by using the automated rotation feature.

You can enable [automated rotation of the TDE protector](transparent-data-encryption-byok-key-rotation.md#automatic-key-rotation) when you configure the TDE protector for the server. Automated rotation is disabled by default. When enabled, the server continuously checks the key vault for new versions of the key used as the TDE protector. If the server detects a new version of the key, it automatically rotates the TDE protector on the server or database to the latest key version within 24 hours.

> [!NOTE]
> When you set TDE with CMK by using manual or automated rotation of keys, you always use the latest version of the key that the system supports. The setup doesn't allow using a previous or lower version of keys. Always using the latest key version complies with the Azure SQL security policy that disallows previous key versions that might be compromised.

## Inaccessible TDE protector

When you configure TDE to use a customer-managed key, the database needs continuous access to the TDE protector to stay online. If the server loses access to the customer-managed TDE protector in Azure Key Vault, the database starts denying all connections within 10 minutes, displays an error message, and changes its state to *Inaccessible*. The only action allowed on a database in the Inaccessible state is deleting it.

### Inaccessible state

If the database is inaccessible due to an intermittent networking outage (such as a 5XX error), no action is required, as the databases come back online automatically. To reduce the effect of network errors or outages when accessing the TDE protector in Azure Key Vault, the service introduces a 24-hour buffer before it attempts to move the database to an inaccessible state. If a failover occurs before reaching the inaccessible state, the database becomes unavailable due to the loss of the encryption cache.

If the server loses access to the customer-managed TDE protector in Azure Key Vault due to any [Azure Key Vault error](#accidental-tde-protector-access-revocation) (such as a 4XX error), the database moves to an inaccessible state after 30 minutes.

### Restore database access after an Azure Key Vault error

After access to the key is restored, bringing the database back online requires additional time and steps, which might vary based on the duration of key unavailability and the size of the data within the database.

If key access is restored within 30 minutes, the database automatically heals within the subsequent hour. However, if key access is restored after more than 30 minutes, automatic healing of the database isn't possible. In such cases, restoring the database involves extra procedures through the Azure portal and can be time-consuming, depending on the database's size.

Once the database is back online, previously configured server-level settings, including failover group configurations, tags, and database-level settings such as elastic pool configurations, read scale, auto pause, point-in-time restore history, long-term retention policy, and others are lost. Hence, it's recommended that customers implement a notification system to detect the loss of encryption key access within 30 minutes. After the 30-minute window has expired, we advise validating all server and database level settings on the recovered database.

Following is a view of the extra steps required on the portal to bring an inaccessible database back online.

### Accidental TDE protector access revocation

It might happen that someone with sufficient access rights to the key vault or managed HSM accidentally disables server access to the key by:

- revoking the key vault's or managed HSM *get*, *wrapKey*, *unwrapKey* permissions from the server

- deleting the key

- deleting the key vault or managed HSM

- changing the key vault's or managed HSM firewall rules

- deleting the managed identity of the server in Microsoft Entra ID

Learn more about [the common causes for database to become inaccessible](/sql/relational-databases/security/encryption/troubleshoot-tde?view=azuresqldb-current&preserve-view=true#common-errors-causing-databases-to-become-inaccessible).

### Blocked connectivity between SQL Managed Instance and Azure Key Vault

The network connectivity block between SQL Managed Instance and key vault or managed HSM happens mostly when the key vault or managed HSM resource exists but its endpoint can't be reached from the managed instance. All scenarios where the key vault or managed HSM endpoint can be reached but connection is denied, missing permissions, etc., cause the databases to change their state to *Inaccessible*.

The most common causes for lack of networking connectivity to Azure Key Vault are:

- Azure Key Vault is exposed via private endpoint and the private IP address of the Azure Key Vault service isn't allowed in the outbound rules of the Network Security Group (NSG) associated with the managed instance subnet.

- Bad DNS resolution, like when the key vault or managed HSM FQDN isn't resolved or resolves to an invalid IP address.

[Test the connectivity](https://github.com/Azure/sqlmi/tree/main/how-to/how-to-test-tcp-connection-from-mi) from SQL Managed Instance to the Azure Key Vault hosting the TDE protector.

- The endpoint is your vault FQDN, like *<vault_name>.vault.azure.net* (without the https://).
- The port to be tested is 443.
- The result for RemoteAddress should exist and be the correct IP address
- The result for TCP test should be *TcpTestSucceeded: True*.

In case the test returns *TcpTestSucceeded: False*, review the networking configuration:

- Check the resolved IP address, confirm it's valid. A missing value means there's issues with DNS resolution.

  - Confirm that the network security group on the managed instance has an **outbound** rule that covers the resolved IP address on port 443, especially when the resolved address belongs to the key vault's or managed HSM private endpoint.

  - Check other networking configurations like route table, existence of virtual appliance and its configuration, etc.

<a id="monitoring-of-the-customer-managed-tde"></a>

## Monitor the customer-managed TDE

To monitor database state and to enable alerting for loss of TDE protector access, configure the following Azure features:

- [Azure Resource Health](/azure/service-health/resource-health-overview). An inaccessible database that lost access to the TDE protector shows as "Unavailable" after the first connection to the database is denied.

- [Activity Log](/azure/service-health/alerts-activity-log-service-notifications-portal) when access to the TDE protector in the customer-managed key vault fails, entries are added to the activity log. By creating alerts for these events, you can reinstate access as soon as possible.

- [Action Groups](/azure/azure-monitor/alerts/action-groups) can be defined to send you notifications and alerts based on your preferences, for example, Email, SMS, Push, Voice, Logic App, Webhook, ITSM, or Automation Runbook.

## Database backup and restore with customer-managed TDE

Once a database is encrypted with TDE using a key from Azure Key Vault, any newly generated backups are also encrypted with the same TDE protector. When the TDE protector is changed, old backups of the database **aren't updated** to use the latest TDE protector.

To restore a backup encrypted with a TDE protector from Azure Key Vault, make sure that the key material is available to the target server. Therefore, keep all the old versions of the TDE protector in key vault or managed HSM, so database backups can be restored.

> [!IMPORTANT]  
> There can't be more than one TDE protector set for a server at any moment. The key marked with **Make the key the default TDE protector** in the Azure portal pane is the TDE protector. However, multiple keys can be linked to a server without marking them as a TDE protector. These keys aren't used for protecting the DEK, but can be used during restore from a backup if the backup file is encrypted with the key with the corresponding thumbprint.

If the key that is needed for restoring a backup is no longer available to the target server, the following error message is returned on the restore try:
"Target server `<Servername>` doesn't have access to all AKV URIs created between \<Timestamp #1> and \<Timestamp #2>. Retry operation after restoring all AKV URIs."

To mitigate it, run the [Get-AzSqlServerKeyVaultKey](/powershell/module/az.sql/get-azsqlserverkeyvaultkey) cmdlet for the target server or [Get-AzSqlInstanceKeyVaultKey](/powershell/module/az.sql/get-azsqlinstancekeyvaultkey) for the target managed instance to return the list of available keys and identify the missing ones. To ensure all backups can be restored, make sure the target server for the restore has access to all of keys needed. These keys don't need to be marked as TDE protector.

To learn more about backup recovery for dedicated SQL pools in Azure Synapse Analytics, see [Recover a dedicated SQL pool](/azure/synapse-analytics/sql-data-warehouse/backup-and-restore).

Another consideration for log files: Backed up log files remain encrypted with the original TDE protector, even if it was rotated and the database is now using a new TDE protector. At restore time, both keys are needed to restore the database. If the log file is using a TDE protector stored in Azure Key Vault, this key is needed at restore time, even if the database was changed to use service-managed TDE in the meantime.

## High availability with customer-managed TDE

By using Azure Key Vault's multiple layers of redundancy, TDEs that use a customer-managed key can benefit from Azure Key Vault's availability and resilience. They can fully rely on the Azure Key Vault redundancy solution.

Azure Key Vault's multiple redundancy layers ensure key access even if individual service components fail or Azure regions or availability zones are down. For more information, see [Azure Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance).

Azure Key Vault offers the following components of availability and resilience automatically without user intervention:

- [Data replication](/azure/key-vault/general/disaster-recovery-guidance#data-replication)
- [Failover within a region](/azure/key-vault/general/disaster-recovery-guidance#failover-within-a-region)
- [Failover across regions](/azure/key-vault/general/disaster-recovery-guidance#failover-within-a-region)

## Related content

- [Transparent Data Encryption for Azure Synapse Analytics](transparent-data-encryption-tde-overview.md)
- [Rotate the TDE protector](transparent-data-encryption-byok-key-rotation.md)
- [Remove a TDE protector](transparent-data-encryption-byok-remove-tde-protector.md)
- [Azure Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance)
