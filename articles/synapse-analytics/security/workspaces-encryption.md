---
title: Azure Synapse Analytics encryption
description: An article that explains encryption in Azure Synapse Analytics
author: nanditavalsan
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: security
ms.date: 11/19/2020
ms.author: nanditav
ms.reviewer: jrasnick
---
# Encryption for Azure Synapse Analytics workspaces

This article will describe:
* Encryption of data at rest in Synapse Analytics workspaces.
* Configuration of Synapse workspaces to enable encryption with a customer managed key.
* Managing keys used to encrypt data in workspaces.

## Encryption of data at rest

A complete Encryption-at-Rest solution ensures the data is never persisted in un-encrypted form. Double encryption of data at rest mitigates threats with two, separate layers of encryption to protect against compromises of any single layer. Azure Synapse Analytics offers a second layer of encryption for the data in your workspace with a customer-managed key. This key is safeguarded in your [Azure Key Vault](../../key-vault/general/overview.md), which allows you to take ownership of key management and rotation.

The first layer of encryption for Azure services is enabled with platform-managed keys. By default, Azure Disks, and data in Azure Storage accounts are automatically encrypted at rest. Learn more about how encryption is used in Microsoft Azure in the [Azure Encryption Overview](../../security/fundamentals/encryption-overview.md).

## Azure Synapse encryption

This section will help you better understand how customer-managed key encryption is enabled and enforced in Synapse workspaces. This encryption uses existing keys or new keys generated in Azure Key Vault. A single key is used to encrypt all the data in a workspace. Synapse workspaces support RSA keys with 2048 and 3072 byte-sized keys.

> [!NOTE]
> Synapse workspaces do not support the use of Elliptic-Curve Cryptography (ECC) keys for encryption.

The data in the following Synapse components is encrypted with the customer-managed key configured at the workspace level:
* SQL pools
 * Dedicated SQL pools
 * Serverless SQL pools
* Apache Spark pools
* Azure Data Factory integration runtimes, pipelines, datasets.

## Workspace encryption configuration

Workspaces can be configured to enable double encryption with a customer-managed key at the time of workspace creation. Select the “Enable double encryption using a customer-managed key” option on the "Security" tab when creating your new workspace. You can choose to enter a key identifier URI or select from a list of key vaults in the **same region** as the workspace. The Key Vault itself needs to have **purge protection enabled**.

> [!IMPORTANT]
> The configuration setting for double encryption cannot be changed after the workspace is created.

:::image type="content" source="./media/workspaces-encryption/workspaces-encryption.png" alt-text="This diagram shows the option that must be selected to enable a workspace for double encryption with a customer-managed key.":::

### Key access and workspace activation

The Azure Synapse encryption model with customer-managed keys involves the workspace accessing the keys in Azure Key Vault to encrypt and decrypt as needed. The keys are made accessible to the workspace either through an access policy or [Azure Key Vault RBAC access](../../key-vault/general/rbac-guide.md). When granting permissions via an Azure Key Vault access policy, choose the [“Application-only”](../../key-vault/general/security-features.md#key-vault-authentication-options) option during policy creation (select the workspace's managed identity and do not add it as an authorized application).

 The workspace managed identity must be granted the permissions it needs on the key vault before the workspace can be activated. This phased approach to workspace activation ensures that data in the workspace is encrypted with the customer-managed key. Note that encryption can be enabled or disabled for dedicated SQL Pools- each pool is not enabled for encryption by default.

#### Permissions

To encrypt or decrypt data at rest, the workspace managed identity must have the following permissions:
* WrapKey (to insert a key into Key Vault when creating a new key).
* UnwrapKey (to get the key for decryption).
* Get (to read the public part of a key)

#### Workspace activation

After your workspace (with double encryption enabled) is created, it will remain in a "Pending" state until activation succeeds. The workspace must be activated before you can fully use all functionality. For example, you can only create a new dedicated SQL pool once activation succeeds. Grant the workspace managed identity access to the key vault and click on the activation link in the workspace Azure portal banner. Once the activation completes successfully, your workspace is ready to use with the assurance that all data in it is protected with your customer-managed key. As previously noted, the key vault must have purge protection enabled for activation to succeed.

:::image type="content" source="./media/workspaces-encryption/workspace-activation.png" alt-text="This diagram shows the banner with the activation link for the workspace.":::


### Manage the workspace customer-managed key 

You can change the customer-managed key used to encrypt data from the **Encryption** page in the Azure portal. Here too, you can choose a new key using a key identifier or select from Key Vaults that you have access to in the same region as the workspace. If you choose a key in a different key vault from the ones previously used, grant the workspace managed identity "Get", "Wrap", and "Unwrap" permissions on the new key vault. The workspace will validate its access to the new key vault and all data in the workspace will be re-encrypted with the new key.

:::image type="content" source="./media/workspaces-encryption/workspace-encryption-management.png" alt-text="This diagram shows the workspace Encryption section in the Azure portal.":::

>[!IMPORTANT]
>When changing the encryption key of a workspace, retain the key until you replace it in the workspace with a new key. This is  to allow decryption of data with the old key before it gets re-encrypted with the new key.

Azure Key Vaults policies for automatic, periodic rotation of keys, or actions on the keys can result in the creation of new key versions. You can choose to re-encrypt all the data in the workspace with the latest version of the active key. To-re-encrypt, change the key in the Azure portal to a temporary key and then switch back to the key you wish to use for encryption. As an example, to update data encryption using the latest version of active key Key1, change the workspace customer-managed key to temporary key, Key2. Wait for encryption with Key2 to finish. Then switch the workspace customer-managed key back to Key1-data in the workspace will be re-encrypted with the latest version of Key1.

> [!NOTE]
> Azure Synapse Analytics is actively working on adding functionality to automatically re-encrypt data when new key versions are created. Until this functionality is available, to ensure consistency in your workspace, force the re-encryption of data using the process detailed above.

#### SQL Transparent Data Encryption with service-managed keys

SQL Transparent Data Encryption (TDE) is available for dedicated SQL Pools in workspaces *not* enabled for double encryption. In this type of workspace, a service-managed key is used to provide double encryption for the data in the dedicated SQL pools. TDE with the service-managed key can be enabled or disabled for individual dedicated SQL pools.

## Next steps

[Use built-in Azure Policies to implement encryption protection for Synapse workspaces](../policy-reference.md)

