---
title: Encrypt backup data in a Backup vault by using customer-managed keys
description: Learn how to use Azure Backup to encrypt your backup data by using customer-managed keys (CMKs) in a Backup vault.
ms.topic: how-to
ms.date: 03/06/2024
ms.custom: references_regions, devx-track-azurepowershell-azurecli
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Encrypt backup data in a Backup vault by using customer-managed keys (preview)

You can use Azure Backup to encrypt your backup data via customer-managed keys (CMKs) instead of platform-managed keys (PMKs), which are enabled by default. Your keys to encrypt the backup data must be stored in [Azure Key Vault](../key-vault/index.yml).

The encryption key that you use for encrypting backups might be different from the one that you use for the source. An AES 256-based data encryption key (DEK) helps protect the data. Your key encryption keys (KEKs), in turn, help protect the DEK. You have full control over the data and the keys.

To allow encryption, you must grant the Backup vault the permissions to access the encryption key in the key vault. You can change the key when necessary.

Support for CMK configuration for a Backup vault is in preview.

## Support matrix

### Supported regions

CMKs for Backup vaults are currently available in all Azure public regions.

### Key Vault and managed HSM key requirements

- Encryption settings use Azure Key Vault or a managed hardware security module (HSM) key, along with the details of the Backup vault's managed identity.

- The Backup vault's managed identity needs to have:

  - A built-in [Crypto Service Encryption User role](/azure/role-based-access-control/built-in-roles#key-vault-crypto-service-encryption-user) assigned, if your key vault is using a role-based access control (RBAC) configuration that's based on identity and access management (IAM).
  - **Get**, **Wrap**, and **Unwrap** permissions if your key vault is using a configuration that's based on access policies.
  - **Get**, **Wrap**, and **Unwrap** permissions granted via local RBAC on the key if you're using a managed HSM. [Learn more](../key-vault/managed-hsm/overview.md).

- Ensure that you have a valid, enabled Key Vault key. Don't use an expired or disabled key, because it can't be used for encryption at rest and will lead to failures of backup and restore operations. The Key Vault term also indicates a managed HSM if you didn't note it earlier.

- Key Vault must have soft delete and purge protection enabled.

- Encryption settings support Azure Key Vault RSA and RSA-HSM keys only of sizes 2,048, 3,072, and 4,096. [Learn more about keys](../key-vault/keys/about-keys.md). Before you consider Key Vault regions for encryption settings, see [Key Vault disaster recovery scenarios](../key-vault/general/disaster-recovery-guidance.md) for regional failover support.

### Known limitations

- If you remove Key Vault access permissions from the managed identity, PostgreSQL backup or restore operations will fail with a generic error.

- If you remove Key Vault permissions from encryption settings, disable system-assigned identity, or detach/delete the managed identity from the Backup vault that you're using for encryption settings, tiering of background operations and restore-point expiration jobs will fail without surfacing errors to the Azure portal or other interfaces (for example, REST API or CLI). These operations will continue to fail and incur costs until you restore the required settings.

## Considerations

- After you enable encryption by using CMKs for a Backup vault, you can't revert to using PMKs (the default). You can change the encryption keys or the managed identity to meet requirements.

- A CMK is applied on the Azure Backup storage vault and vault-archive tiers. It isn't applicable for the operational tier.

- Moving a CMK-encrypted Backup vault across resource groups and subscriptions isn't currently supported.

- The feature of user-assigned managed identities for Backup vaults is currently in preview. You can configure it by using the Azure portal and REST APIs.

- After you enable encryption settings on the Backup vault, don't disable or detach the managed identity or remove Key Vault permissions used for encryption settings. These actions lead to failure of backup, restore, tiering, and restore-point expiration jobs. They'll incur costs for the data stored in the Backup vault until:

  - You restore the Key Vault permissions.
  - You reenable a system-assigned identity, grant the key vault permissions to it, and update encryption settings (if you used the system-assigned identity for encryption settings).
  - You reattach the managed identity make sure that it has permissions to access the key vault and the key to use the new user-assigned identity.

- Encryption settings use the Azure Key Vault key and the Backup vault's managed identity details.

  If the key or key vault that you're using is deleted or access is revoked and can't be restored, you'll lose access to the data stored in the Backup vault. Also, ensure that you have appropriate permissions to provide and update managed identity, Backup vault, and key vault details.

## Enable encryption by using customer-managed keys at vault creation

When you create a Backup vault, you can enable encryption on backups by using CMKs. [Learn how to create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

To enable the encryption, follow these steps:

1. On the **Vault Properties** tab, specify the encryption key and the identity to be used for encryption.

   :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/backup-vault-properties.png" alt-text="Screenshot that shows Backup vault properties." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/backup-vault-properties.png":::

2. For **Encryption type**, select **Use customer-managed key**.

3. To specify the key to be used for encryption, select the appropriate option.

   To enable autorotation of the encryption key used for the Backup vault, choose **Select from Key Vault**. Or run the version component from the key URI by selecting **Enter key URI**. [Learn more about autorotation](encryption-at-rest-with-cmk.md#enable-autorotation-of-encryption-keys).

4. Provide the URI for the encryption key. You can also browse and select the key.

   :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/add-key-uri.png" alt-text="Screenshot that shows the option for using a customer-managed key and encryption key details." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/add-key-uri.png":::

5. Specify the user-assigned managed identity to manage encryption with CMKs.

6. Add tags (optional) and continue creating the vault.

## Update the Backup vault properties to encrypt by using customer-managed keys

To configure a vault, perform the following actions in sequence:

1. Enable a managed identity for your Backup vault.

2. Assign permissions to the Backup vault to access the encryption key in Azure Key Vault.

3. Enable soft delete and purge protection on Azure Key Vault.

4. Assign the encryption key to the Backup vault.

The following sections discuss each of these actions in detail.

### Enable a managed identity for your Backup vault

Azure Backup uses system-assigned managed identities and user-assigned managed identities of the Backup vault to access encryption keys stored in Azure Key Vault. You can choose which managed identity to use.

> [!NOTE]
> After you enable a managed identity, you must *not* disable it (even temporarily). Disabling the managed identity might lead to inconsistent behavior.

For security reasons, you can't update both a Key Vault key URI and a managed identity in a single request. Update one attribute at a time.

#### Enable a system-assigned managed identity for the vault

To enable a system-assigned managed identity for your Backup vault, follow these steps:

1. Go to *your Backup vault* > **Identity**.

2. Select the **System assigned** tab.

3. Change the **Status** to **On**.

4. Select **Save** to enable the identity for the vault.

:::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/enable-system-assigned-managed-identity-for-vault.png" alt-text="Screenshot that shows selections for enabling a system-assigned managed identity." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/enable-system-assigned-managed-identity-for-vault.png":::

The preceding steps generate an object ID, which is the system-assigned managed identity of the vault.

#### Assign a user-assigned managed identity to the vault (in preview)

To assign a user-assigned managed identity for your Backup vault, follow these steps:

1. Go to *your Backup vault* > **Identity**.

2. Select the **User assigned (preview)** tab.

3. Select **+Add** to add a user-assigned managed identity.

4. On the **Add user assigned managed identity** panel, select the subscription for your identity.

5. Select the identity from the list. You can also filter by the name of the identity or resource group.

6. Select **Add** to finish assigning the identity.

:::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/assign-user-assigned-managed-identity-to-vault.png" alt-text="Screenshot that shows selections for assigning a user-assigned managed identity to a vault." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/assign-user-assigned-managed-identity-to-vault.png":::

> [!NOTE]
> Vaults that use user-assigned managed identities for CMK encryption don't support the use of private endpoints for Backup.
>
> Key vaults that limit access to specific networks aren't yet supported for use with user-assigned managed identities for CMK encryption.

### Assign permissions to the Backup vault to access the encryption key in Azure Key Vault

You now need to permit the Backup vault's managed identity to access the key vault that contains the encryption key.

#### Scenario: Key Vault has access control (IAM) configuration enabled

Follow these steps:

1. Go to *your key vault* > **Access Control**, and then select **Add Role Assignment**.
2. Select the **Key Vault Crypto Service Encryption User** role from **Job function** roles.
3. Select **Next** > **Assign Access to** > **Managed Identity** > **Select Members**.
4. Select your Backup vault's managed identity.
5. Select **Next** and assign.

#### Scenario: Key vault has configuration of access policies enabled

Follow these steps:

1. Go to *your key vault* > **Access policies**, and then select **+Create**.

    :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/access-policies.png" alt-text="Screenshot that shows the button for creating an access policy." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/access-policies.png":::

2. Specify the actions to permit on the key. Under **Key permissions**, select the **Get**, **List**, **Unwrap Key**, and **Wrap Key** operations. Then select **Next**.

    :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/key-permissions.png" alt-text="Screenshot that shows the selection of key permissions." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/key-permissions.png":::

3. On the **Principal** tab, search for your vault in the search box by using its name or managed identity. When the vault appears, select it and then select **Next**.

    :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/select-principal.png" alt-text="Screenshot of selecting a principal in a key vault." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/select-principal.png":::

4. Select **Add** to add the new access policy.

5. Select **Save** to save changes that you made to the access policy of the key vault.

If you're using a user-assigned identity, you must assign the same permissions to it.

You can also assign an RBAC role to the Backup vault that contains the previously mentioned permissions, such as the [Key Vault Crypto Officer](../key-vault/general/rbac-guide.md#azure-built-in-roles-for-key-vault-data-plane-operations) role. This role might contain additional permissions.

### Enable soft delete and purge protection on Azure Key Vault

You need to enable soft delete and purge protection on the key vault that stores your encryption key.

You can set these properties from the Azure Key Vault interface, as shown in the following screenshot. Alternatively, you can set these properties while creating the key vault. [Learn more about these Key Vault properties](../key-vault/general/soft-delete-overview.md).

:::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/soft-delete-purge-protection.png" alt-text="Screenshot of options for enabling soft delete and purge protection." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/soft-delete-purge-protection.png":::

### Assign the encryption key to the Backup vault

Before you select the encryption key for your vault, ensure that you successfully:

- Enabled the Backup vault's managed identity and assigned the required permissions to it.
- Enabled soft delete and purge protection for the key vault.

To assign the key, follow these steps:

1. Go to *your Backup vault* > **Properties**.

   :::image type="content" source="./media/encryption-at-rest-with-cmk/encryption-settings.png" alt-text="Screenshot that shows properties for a Backup vault." lightbox="./media/encryption-at-rest-with-cmk/encryption-settings.png":::

2. For **Encryption Settings (Preview)**, select **Update**.

   :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/update-encryption-settings.png" alt-text="Screenshot that shows the link for updating encryption settings." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/update-encryption-settings.png":::

3. On the **Encryption Settings (Preview)** pane, select **Use your own key** and then specify the key by using one of the following options. Be sure to use an RSA key that's in an enabled and active state.

    - Select **Enter key URI**. In the **Key URI** box, enter the URI for the key that you want to use for encrypting data in this Backup vault. You can also get this key URI from the corresponding key in your key vault.

      Be sure to copy the key URI correctly. We recommend that you use the **Copy to clipboard** button provided with the key identifier.

      :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/encryption-key-with-full-key-uri.png" alt-text="Screenshot that shows selections for entering a key URI." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/encryption-key-with-full-key-uri.png":::

      When you try to update encryption settings but the update operation fails because of an internal error, the encryption setting is updated to **Inconsistent** and requires your attention.

      :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/key-uri.png" alt-text="Screenshot that shows the status warning for a failed update." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/key-uri.png":::

      When you're specifying the encryption key by using the full key URI with the version component, the key won't be autorotated. You need to update keys manually by specifying the new key or version when required. Alternatively, remove the version component of the key URI to get automatic rotation.

      :::image type="content" source="./media/encryption-at-rest-with-cmk/key-uri.png" alt-text="Screenshot that shows a key URI for a Backup vault." lightbox="./media/encryption-at-rest-with-cmk/key-uri.png":::

    - Choose **Select from Key Vault**. On the **Key picker** pane, browse to and select the key from the key vault.

      :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/key-vault-encryption.png" alt-text="Screenshot that shows the option for selecting a key from a key vault." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/key-vault-encryption.png":::

      When you specify the encryption key by using the **Key picker** pane, the key will be autorotated whenever a new version for the key is enabled. [Learn more about enabling autorotation of encryption keys](encryption-at-rest-with-cmk.md#enable-autorotation-of-encryption-keys).

4. Select **Update**.

5. Track the progress and status of the encryption key assignment under **Notifications**.

    :::image type="content" source="./media/encryption-at-rest-with-cmk/status-succeeded.png" alt-text="Screenshot that shows the status of a backup job as completed." lightbox="./media/encryption-at-rest-with-cmk/status-succeeded.png":::

    The encryption key updates are also logged in the vault's activity log, under the **Backup Vault update (PATCH)** operation.

### Update encryption settings

You can update the encryption settings anytime. Whenever you want to use a new key URI, ensure that your existing key vault still has access to the managed identity and the key is valid. Otherwise, the update operation will fail.

The managed identity that you want to use for encryption needs the appropriate permissions.

## Back up to a vault encrypted via customer-managed keys

Before you configure backup protection, confirm that you successfully:

- Created a Backup vault.
- Enabled the Backup vault's system-assigned managed identity or assigned a user-assigned managed identity to the vault.
- Assigned permissions to your Backup vault (or the user-assigned managed identity) to access encryption keys from your key vault.
- Enabled soft delete and purge protection for your key vault.
- Assigned a valid encryption key for your Backup vault.

The process to configure and perform backups to a Backup vault that's encrypted via CMKs is the same as the process to configure and perform backups to a vault that uses PMKs. There are no changes to the experience.

## Troubleshoot operation errors for encryption settings

### Missing permissions for a managed identity

**Error code**: `UserErrorCMKMissingMangedIdentityPermissionOnKeyVault`

**Cause**: This error occurs when:

- The managed identity that you're using for encryption settings doesn't have the permissions to access the key vault. Also, the backup or restore jobs might fail with this error code if the access is removed after encryption settings are updated or a managed identity is disabled or detached from the Backup vault.
- You're using a non-RSA key URI.

**Recommended action**: Ensure that the managed identity that you use for encryption settings has the required permissions and the key is an RSA type. Then retry the operation.

### Vault authentication failure

**Error code**: `UserErrorCMKKeyVaultAuthFailure`

**Cause**: The managed identity in the encryption settings doesn't have the required permissions to access the key vault or key. The backup vault's managed identity (system-assigned or user-assigned identity used for encryption settings) should have the following permissions on your key vault:

- If your key vault is using an RBAC configuration that's based on IAM, you need Key Vault Crypto Service Encryption User built-in role permissions.
- If you use access policies, you need **Get**, **Wrap** and **Unwrap** permissions.

**Recommended action**: Check the Key Vault access policies and grant permissions accordingly.

## Next steps

[Overview of security features in Azure Backup](security-overview.md).
