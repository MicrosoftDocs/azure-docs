---
title: Azure Synapse Analytics encryption
description: Understand encryption of data at rest in Synapse Analytics workspaces, configuration of encryption, key management, and Transparent Data Encryption (TDE).
author: meenalsri
ms.author: mesrivas

ms.date: 07/31/2024
ms.service: azure-synapse-analytics
ms.subservice: security
ms.topic: conceptual
ms.custom: sfi-image-nochange
---

# Encryption for Azure Synapse Analytics workspaces

This article will describe:
- Encryption of data at rest in Synapse Analytics workspaces.
- Configuration of Synapse workspaces to enable encryption with a customer managed key.
- Managing keys used to encrypt data in workspaces.

## Encryption of data at rest

A complete Encryption-at-Rest solution ensures the data is never persisted in unencrypted form. Double encryption of data at rest mitigates threats with two, separate layers of encryption to protect against compromises of any single layer. Azure Synapse Analytics offers a second layer of encryption for the data in your workspace with a customer-managed key. This key is safeguarded in your [Azure Key Vault](/azure/key-vault/general/overview), which allows you to take ownership of key management and rotation.

The first layer of encryption for Azure services is enabled with platform-managed keys. By default, Azure Disks, and data in Azure Storage accounts are automatically encrypted at rest. Learn more about how encryption is used in Microsoft Azure in the [Azure Encryption Overview](../../security/fundamentals/encryption-overview.md).

> [!NOTE]
> Some items considered customer content, such as table names, object names, and index names, might be transmitted in log files for support and troubleshooting by Microsoft.

## Azure Synapse encryption

This section will help you better understand how customer-managed key encryption is enabled and enforced in Synapse workspaces. This encryption uses existing keys or new keys generated in Azure Key Vault. A single key is used to encrypt all the data in a workspace. Synapse workspaces support RSA 2048 and 3072 byte-sized keys, and RSA-HSM keys.

> [!NOTE]
> Synapse workspaces do not support the use of EC, EC-HSM, and oct-HSM keys for encryption. 

The data in the following Synapse components is encrypted with the customer-managed key configured at the workspace level:
- SQL pools
   - Dedicated SQL pools
   - Serverless SQL pools
- Data Explorer pools
- Apache Spark pools
- Azure Data Factory integration runtimes, pipelines, datasets.

## Workspace encryption configuration

Workspaces can be configured to enable double encryption with a customer-managed key at the time of workspace creation. Enable double encryption using a customer-managed key on the "Security" tab when creating your new workspace. You can choose to enter a key identifier URI or select from a list of key vaults in the **same region** as the workspace. The Key Vault itself needs to have **purge protection enabled**.

> [!IMPORTANT]
> The configuration setting for double encryption cannot be changed after the workspace is created.

:::image type="content" source="media/workspaces-encryption/workspaces-encryption.png" alt-text="This diagram shows the option that must be selected to enable a workspace for double encryption with a customer-managed key." lightbox="media/workspaces-encryption/workspaces-encryption.png":::

## Prerequisites: Key Rotation and SQL Pool Status

> [!WARNING]
> **Before changing the encryption key of your workspace:**
>
> - **Ensure all dedicated SQL pools are in the Online state.** Offline pools will not be re-encrypted and cannot resume if the old key or key version is deleted, disabled, or expired.
> - **Retain all old keys and key versions** used for encryption until every SQL pool is brought online and re-encrypted with the new key. Only disable or delete the old key after all pools have successfully rotated to the new key.
>
> ⚠️ *Failure to follow these prerequisites may result in SQL pools being permanently inaccessible, or backup data becoming unrecoverable.*

**Key Rotation Checklist**

| Step | Action                                                        | Status |
|------|---------------------------------------------------------------|--------|
| 1    | Confirm all SQL pools are Online                              | ☐      |
| 2    | Ensure old key is retained and enabled                        | ☐      |
| 3    | Rotate CMK                                                    | ☐      |
| 4    | Verify all pools are re-encrypted                             | ☐      |
| 5    | Safely disable old key or key version (after all pools done)  | ☐      |

## Key management best practices

> [!IMPORTANT]
> 
> When changing the encryption key of a workspace, **retain the old key** until you have replaced it in the workspace with a new key. This allows decryption of data with the old key before it gets re-encrypted with the new key.  
> 
> The state of the SQL pool (**Online/Offline**) does **not** affect the workspace customer managed key (CMK) rotation process, but *offline pools will remain encrypted with the old key or key version*.  
> 
> If the old key or key version is disabled or expired, **offline pools will not resume** as decryption is not possible. Upon resuming these pools, the old key or key version must (1) be enabled and (2) have an expiration date set in the future to allow decryption and subsequent re-encryption with the new key or key version.  
>
> **To ensure a smooth CMK rotation,** if some SQL pools are offline during the process, the old key or key version should remain enabled and have its expiration date set in the future. This is crucial until the offline pools are successfully resumed and re-encrypted with the new key or key version.
>
> **Do not delete old keys or key versions** until all pools and backups are successfully re-encrypted and validated. Only *disable* the old key after all requirements are met.

### Key Rotation Troubleshooting

If a SQL pool is stuck offline after a key rotation:

1. **Check the SQL pool key version** using PowerShell to confirm which key or key version the pool is expecting:
   
    ```powershell
    Get-AzSqlServerTransparentDataEncryptionProtector -ServerName 'ContosoServer' -ResourceGroupName 'WORKSPACE_MANAGED_RESOURCE_GROUP'
    ```
> [!NOTE] 
> The `ResourceGroupName` refers to the workspace's **managed resource group**. You can find this in the Azure portal by selecting your Synapse workspace and viewing the `managedResourceGroup` value in the JSON view.
    
2. **Enable** the required old key or key version in Azure Key Vault.
3. **Set an expiration date** in the future for the old key or key version.
4. Resume the SQL pool.
5. Once the pool is back online, allow it to re-encrypt with the new key.
6. **Verify the encryption status** of each database by running the following T-SQL query in your SQL pool:
   
    ```sql
    SELECT
        [name],
        [is_encrypted]
    FROM
        sys.databases;
    ```
    
    - The `is_encrypted` column will show the encryption status (`1` = encrypted, `0` = not encrypted).
      
7. After confirming all pools and backups are accessible and encrypted, you may safely disable (not delete) the old key or key version.

### Key access and workspace activation

The Azure Synapse encryption model with customer-managed keys involves the workspace accessing the keys in Azure Key Vault to encrypt and decrypt as needed. The keys are made accessible to the workspace either through an access policy or [Azure Key Vault RBAC](/azure/key-vault/general/rbac-guide). When granting permissions via an Azure Key Vault access policy, choose the ["Application-only"](/azure/key-vault/general/security-features#key-vault-authentication-options) option during policy creation (select the workspaces managed identity and do not add it as an authorized application).

The workspace managed identity must be granted the permissions it needs on the key vault before the workspace can be activated. This phased approach to workspace activation ensures that data in the workspace is encrypted with the customer-managed key. Encryption can be enabled or disabled for individual dedicated SQL Pools. Each dedicated pool is not enabled for encryption by default.

<a id="using-a-user-assigned-managed-identity"></a>

#### Use a User-assigned Managed identity

Workspaces can be configured to use a [User-assigned Managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to access your customer-managed key stored in Azure Key Vault. Configure a User-assigned Managed identity to avoid phased activation of your Azure Synapse workspace when using double encryption with customer-managed keys. The Managed Identity Contributor built-in role is required to assign a user-assigned managed identity to an Azure Synapse workspace.

> [!NOTE]
> A User-assigned Managed Identity cannot be configured to access customer-managed key when Azure Key Vault is behind a firewall.

:::image type="content" source="media/workspaces-encryption/workspaces-encryption-uami.png" alt-text="This diagram shows the option that must be selected to enable a workspace to use user-assigned managed-identity for double encryption with a customer-managed key." lightbox="media/workspaces-encryption/workspaces-encryption-uami.png":::

#### Permissions

To encrypt or decrypt data at rest, the managed identity must have the following permissions. Similarly, if you are using a Resource Manager template to create a new key, the 'keyOps' parameter of the template must have the following permissions:

- WrapKey (to insert a key into Key Vault when creating a new key).
- UnwrapKey (to get the key for decryption).
- Get (to read the public part of a key)

#### Workspace activation

If you do not configure a user-assigned managed identity to access customer managed keys during workspace  creation, your workspace will remain in a "Pending" state until activation succeeds. The workspace must be activated before you can fully use all functionality. For example, you can only create a new dedicated SQL pool once activation succeeds. Grant the workspace managed identity access to the key vault and select the activation link in the workspace Azure portal banner. Once the activation completes successfully, your workspace is ready to use with the assurance that all data in it's protected with your customer-managed key. As previously noted, the key vault must have purge protection enabled for activation to succeed.

:::image type="content" source="media/workspaces-encryption/workspace-activation.png" alt-text="This diagram shows the banner with the activation link for the workspace." lightbox="media/workspaces-encryption/workspace-activation.png":::

### Manage the workspace customer-managed key

You can change the customer-managed key used to encrypt data from the **Encryption** page in the Azure portal. Here too, you can choose a new key using a key identifier or select from Key Vaults that you have access to in the same region as the workspace. If you choose a key in a different key vault from the ones previously used, grant the workspace-managed identity "Get", "Wrap", and "Unwrap" permissions on the new key vault. The workspace will validate its access to the new key vault and all data in the workspace will be re-encrypted with the new key.

:::image type="content" source="media/workspaces-encryption/workspace-encryption-management.png" alt-text="This diagram shows the workspace Encryption section in the Azure portal." lightbox="media/workspaces-encryption/workspace-encryption-management.png":::

Azure Key Vaults policies for automatic, periodic rotation of keys, or actions on the keys can result in the creation of new key versions. You can choose to re-encrypt all the data in the workspace with the latest version of the active key. To-re-encrypt, change the key in the Azure portal to a temporary key and then switch back to the key you wish to use for encryption. As an example, to update data encryption using the latest version of active key Key1, change the workspace customer-managed key to temporary key, Key2. Wait for encryption with Key2 to finish. Then switch the workspace customer-managed key back to Key1-data in the workspace will be re-encrypted with the latest version of Key1.

> [!NOTE]
> **Key rotation is a three-step process:**
> 1. Change the workspace customer-managed key from your **main key** to a **temporary key**.
> 2. **Wait 15–30 minutes** for the re-encryption process to complete.
> 3. Change the workspace customer-managed key back to your **main key** (now using the new version).
>
> This process ensures all workspace data is securely re-encrypted with the latest key version.

> [!NOTE]
> Azure Synapse Analytics does not automatically re-encrypt data when new key versions are created. To ensure consistency in your workspace, force the re-encryption of data using the process detailed above.

#### SQL Transparent Data Encryption with service-managed keys

SQL Transparent Data Encryption (TDE) is available for dedicated SQL Pools in workspaces *not* enabled for double encryption. In this type of workspace, a service-managed key is used to provide double encryption for the data in the dedicated SQL pools. TDE with the service-managed key can be enabled or disabled for individual dedicated SQL pools.

### Cmdlets for Azure SQL Database and Azure Synapse

To configure TDE through PowerShell, you must be connected as the Azure Owner, Contributor, or SQL Security Manager.

Use the following cmdlets for Azure Synapse workspace. 

| Cmdlet | Description |
| --- | --- |
| [Set-AzSynapseSqlPoolTransparentDataEncryption](/powershell/module/az.synapse/set-azsynapsesqlpooltransparentdataencryption) |Enables or disables transparent data encryption for a SQL pool.|
| [Get-AzSynapseSqlPoolTransparentDataEncryption](/powershell/module/az.synapse/get-azsynapsesqlpooltransparentdataencryption) |Gets the transparent data encryption state for a SQL pool. |
| [New-AzSynapseWorkspaceKey](/powershell/module/az.synapse/new-azsynapseworkspacekey) |Adds a Key Vault key to a workspace. |
| [Get-AzSynapseWorkspaceKey](/powershell/module/az.synapse/get-azsynapseworkspacekey) |Gets the Key Vault keys for a workspace  |
| [Update-AzSynapseWorkspace](/powershell/module/az.synapse/update-azsynapseworkspace) |Sets the transparent data encryption protector for a workspace. |
| [Get-AzSynapseWorkspace](/powershell/module/az.synapse/get-azsynapseworkspace) |Gets the transparent data encryption protector |
| [Remove-AzSynapseWorkspaceKey](/powershell/module/az.synapse/remove-azsynapseworkspacekey) |Removes a Key Vault key from a workspace. |


## Related content

- [Use built-in Azure Policies to implement encryption protection for Synapse workspaces](../policy-reference.md)
- [Create an Azure key vault and a key by using Resource Manager template](/azure/key-vault/keys/quick-create-template)
