---
title: Encrypt backup data in a Backup vault by using customer-managed keys
description: Learn how to use Azure Backup to encrypt your backup data by using customer-managed keys (CMKs) in a Backup vault.
ms.topic: how-to
ms.date: 11/28/2024
ms.custom: references_regions, devx-track-azurepowershell-azurecli
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Encrypt backup data in a Backup vault by using customer-managed keys

You can use Azure Backup to encrypt your backup data via customer-managed keys (CMKs) instead of platform-managed keys (PMKs), which are enabled by default. Your keys to encrypt the backup data must be stored in [Azure Key Vault](/azure/key-vault/).

The encryption key that you use for encrypting backups might be different from the one that you use for the source. An AES 256-based data encryption key (DEK) helps protect the data. Your key encryption keys (KEKs), in turn, help protect the DEK. You have full control over the data and the keys.

To allow encryption, you must grant the Backup vault’s managed identity that you want to use for CMK, the permissions to access the encryption key in the key vault. You can change the key when necessary.

>[!Note]
>**Encryption Settings** and **CMK** are used interchangeably.

## Supported regions

CMKs for Backup vaults are currently available in all Azure public regions.

## Key Vault and managed HSM key requirements

Before you enable encryption on a Backup vault, review the following requirements:

- Encryption settings use Azure Key Vault or a managed hardware security module (HSM) key, along with the details of the Backup vault's managed identity.

- The Backup vault's managed identity needs to have:

  - A built-in [Crypto Service Encryption User role](/azure/role-based-access-control/built-in-roles#key-vault-crypto-service-encryption-user) assigned, if your key vault is using a role-based access control (RBAC) configuration that's based on identity and access management (IAM).
  - **Get**, **Wrap**, and **Unwrap** permissions if your key vault is using a configuration that's based on access policies.
  - **Get**, **Wrap**, and **Unwrap** permissions granted via local RBAC on the key if you're using a managed HSM. [Learn more](/azure/key-vault/managed-hsm/overview).

- Ensure that you have a valid, enabled Key Vault key. Don't use an expired or disabled key, because it can't be used for encryption at rest and will lead to failures of backup and restore operations. The Key Vault term also indicates a managed HSM if you didn't note it earlier.

- Key Vault must have soft delete and purge protection enabled.

- Encryption settings support Azure Key Vault RSA and RSA-HSM keys only of sizes 2,048, 3,072, and 4,096. [Learn more about keys](/azure/key-vault/keys/about-keys). Before you consider Key Vault regions for encryption settings, see [Key Vault disaster recovery scenarios](/azure/key-vault/general/disaster-recovery-guidance) for regional failover support.

## Considerations

Before you enable encryption on a Backup vault, review the following considerations:

- After you enable encryption by using CMKs for a Backup vault, you can't revert to using PMKs (the default). You can change the encryption keys or the managed identity to meet requirements.

- CMK is applied on the Azure Backup storage vault and vault-archive tiers. It isn't applicable for the operational tier.

- Moving a CMK-encrypted Backup vault across resource groups and subscriptions isn't currently supported.

- After you enable encryption settings on the Backup vault, don't disable or detach the managed identity or remove Key Vault permissions used for encryption settings. These actions lead to failure of backup, restore, tiering, and restore-point expiration jobs. They'll incur costs for the data stored in the Backup vault until:

  - You restore the Key Vault permissions.
  - You reenable a system-assigned identity, grant the key vault permissions to it, and update encryption settings (if you used the system-assigned identity for encryption settings).
  - You reattach the managed identity make sure that it has permissions to access the key vault and the key to use the new user-assigned identity.

- Encryption settings use the Azure Key Vault key and the Backup vault's managed identity details.

  If the key or Key Vault that you're using is deleted or access is revoked and can't be restored, you'll lose access to the data stored in the Backup vault. Also, ensure that you have appropriate permissions to provide and update managed identity, Backup vault, and key vault details.

- Vaults that use user-assigned managed identities for CMK encryption don't support the use of private endpoints for Azure Backup.

- Key vaults that limit access to specific networks are currently not supported with User-assigned managed identities for CMK encryption.

## Enable encryption by using customer-managed keys at vault creation

When you create a Backup vault, you can enable encryption on backups by using CMKs. [Learn how to create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

**Choose a client**:

# [Azure portal](#tab/azure-portal)

To enable the encryption, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Backup vault**.

1. On the **Vault Properties** tab, select **Add Identity**.

   :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/backup-vault-properties.png" alt-text="Screenshot that shows Backup vault properties." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/backup-vault-properties.png":::

1. On the **Select user assigned managed identity** blade, select a *managed identity* from the list that you want to use for encryption, and then select **Add**.

2. For **Encryption type**, select **Use customer-managed key**.

3. To specify the key to be used for encryption, select the appropriate option.

   To enable autorotation of the encryption key version used for the Backup vault, choose **Select from Key Vault**. Or remove the version component from the key URI by selecting **Enter key URI**. [Learn more about autorotation](encryption-at-rest-with-cmk.md#enable-autorotation-of-encryption-keys).

4. Provide the URI for the encryption key. You can also browse and select the key.

   :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/add-key-uri.png" alt-text="Screenshot that shows the option for using a customer-managed key and encryption key details." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/add-key-uri.png":::

5. Add the user-assigned managed identity to manage encryption with CMKs.

   During the vault creation, only *user-assigned managed identities* can be used for CMK. 
    
    :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/add-user-assigned-managed-identity.png" alt-text="Screenshot shows the addition of user-assigned managed identity to the vault." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/add-user-assigned-managed-identity.png":::

   To use CMK with system-assigned managed identity, update the vault properties after creating the vault.

    :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/add-system-assigned-managed-identity.png" alt-text="Screenshot shows the addition of system-assigned managed identity to the vault." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/add-system-assigned-managed-identity.png":::

6. To enable encryption on the backup storage infrastructure, select **Infrastructure Encryption**.

   You can enable Infrastructure Encryption only on a new vault during  creation and using Customer-Managed Keys (CMK).

7. Add tags (optional) and continue creating the vault.


# [PowerShell](#tab/powershell)

To enable the encryption on the Backup vault, update the following parameters in the [New-AzDataProtectionBackupVault](/powershell/module/az.dataprotection/new-azdataprotectionbackupvault?view=azps-11.6.0&preserve-view=true#example-3-create-a-backup-vault-with-cmk) command, and then run it.

- `[-IdentityUserAssignedIdentity <Hashtable>]`
- `[-CmkEncryptionState <EncryptionState>]`
- `[-CmkInfrastructureEncryption <InfrastructureEncryptionState>]`
- `[-CmkIdentityType <IdentityType>]`
- `[-CmkUserAssignedIdentityId <String>]`
- `[-CmkEncryptionKeyUri <String>]`

```azurepowershell-interactive
New-AzDataProtectionBackupVault -SubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ResourceGroupName "resourceGroupName" -VaultName "vaultName" -Location "location" -StorageSetting $storagesetting -IdentityType UserAssigned -UserAssignedIdentity $userAssignedIdentity -CmkEncryptionState Enabled -CmkIdentityType UserAssigned -CmkUserAssignedIdentityId $cmkIdentityId -CmkEncryptionKeyUri $cmkKeyUri -CmkInfrastructureEncryption Enabled
```


# [CLI](#tab/cli)

To enable the encryption on the Backup vault, update the following parameters in the [az dataprotection backup-vault create](/cli/azure/dataprotection/backup-vault?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-vault-create) command, and then run it.

- `[--cmk-encryption-key-uri]`
- `[--cmk-encryption-state {Disabled, Enabled, Inconsistent}]`
- `[--cmk-identity-type {SystemAssigned, UserAssigned}]`
- `[--cmk-infra-encryption {Disabled, Enabled}]`
- `[--cmk-uami]`

```azurecli-interactive
az dataprotection backup-vault create --resource-group
                                      --storage-setting
                                      --vault-name
                                      [--azure-monitor-alerts-for-job-failures {Disabled, Enabled}]
                                      [--cmk-encryption-key-uri]
                                      [--cmk-encryption-state {Disabled, Enabled, Inconsistent}]
                                      [--cmk-identity-type {SystemAssigned, UserAssigned}]
                                      [--cmk-infra-encryption {Disabled, Enabled}]
                                      [--cmk-uami]
                                      [--cross-region-restore-state {Disabled, Enabled}]
                                      [--cross-subscription-restore-state {Disabled, Enabled, PermanentlyDisabled}]
                                      [--e-tag]
                                      [--immutability-state {Disabled, Locked, Unlocked}]
                                      [--location]
                                      [--no-wait {0, 1, f, false, n, no, t, true, y, yes}]
                                      [--retention-duration-in-days]
                                      [--soft-delete-state {AlwaysOn, Off, On}]
                                      [--tags]
                                      [--type]
                                      [--uami]
```


---


## Update the Backup vault properties to encrypt by using customer-managed keys


You can modify the **Encryption Settings** of a Backup vault in the following scenarios:

- Enable Customer Managed Key for an already existing vault. For Backup vaults, you can enable CMK before or after protecting items to the vault.
- Update details in the Encryption Settings, such as the managed identity or encryption key.

Let's enable Customer Managed Key for an existing vault. 

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

**Choose a client**:

# [Azure portal](#tab/azure-portal)

To enable a system-assigned managed identity for your Backup vault, follow these steps:

1. Go to *your Backup vault* > **Identity**.

2. Select the **System assigned** tab.

3. Change the **Status** to **On**.

4. Select **Save** to enable the identity for the vault.

:::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/enable-system-assigned-managed-identity-for-vault.png" alt-text="Screenshot that shows selections for enabling a system-assigned managed identity." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/enable-system-assigned-managed-identity-for-vault.png":::

The preceding steps generate an object ID, which is the system-assigned managed identity of the vault.


# [PowerShell](#tab/powershell)

To enable a system-assigned managed identity for the Backup vault, use the [Update-AzDataProtectionBackupVault](/powershell/module/az.dataprotection/update-azdataprotectionbackupvault?view=azps-11.6.0&preserve-view=true) command.

```azurepowershell-interactive
Update-AzDataProtectionBackupVault -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" -ResourceGroupName "resourceGroupName" -VaultName "vaultName" -IdentityType “SystemAssigned”
```

# [CLI](#tab/cli)

To enable a system-assigned managed identity for the Backup vault, use the [az dataprotection backup-vault update](/cli/azure/dataprotection/backup-vault?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-vault-update) command.

---


#### Assign a user-assigned managed identity to the vault

To assign a user-assigned managed identity for your Backup vault, follow these steps:

1. Go to *your Backup vault* > **Identity**.

2. Select the **User assigned (preview)** tab.

3. Select **+Add** to add a user-assigned managed identity.

4. On the **Add user assigned managed identity** panel, select the subscription for your identity.

5. Select the identity from the list. You can also filter by the name of the identity or resource group.

6. Select **Add** to finish assigning the identity.

  :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/add-user-assigned-managed-identity.png" alt-text="Screenshot that shows selections for assigning a user-assigned managed identity to a vault." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/add-user-assigned-managed-identity.png":::

> [!NOTE]
> Key vaults that limit access to specific networks aren't yet supported for use with user-assigned managed identities for CMK encryption.

### Assign permissions to the Backup vault's Managed Identity(system or user-assigned)  to access the encryption key in Azure Key Vault

**Choose a client**:

# [Azure portal](#tab/azure-portal)

You need to permit the Backup vault's managed identity to access the key vault that contains the encryption key.

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

You can also assign an RBAC role to the Backup vault that contains the previously mentioned permissions, such as the [Key Vault Crypto Officer](/azure/key-vault/general/rbac-guide#azure-built-in-roles-for-key-vault-data-plane-operations) role. This role might contain additional permissions.

# [PowerShell](#tab/powershell)

To assign the permissions to the Backup vault, run the following commands:

1. Fetch the principal ID of the Backup vault by using the [Get-AzADServicePrincipal](/powershell/module/az.resources/get-azadserviceprincipal?view=azps-12.0.0&preserve-view=true) command. 
2. Set an access policy for the key vault by using this ID in the [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy?view=azps-12.0.0&preserve-view=true) command.

**Example**:

```azurepowershell-interactive
$sp = Get-AzADServicePrincipal -DisplayName MyVault
$Set-AzKeyVaultAccessPolicy -VaultName myKeyVault -ObjectId $sp.Id -PermissionsToKeys get,list,unwrapkey,wrapkey
```


# [CLI](#tab/cli)

To assign the permissions to the Backup vault, run the following commands:

1. Fetch the principal ID of the Backup vault by using the [az ad sp list](/cli/azure/ad/sp?view=azure-cli-latest&preserve-view=true#az-ad-sp-list) command.
2. Set an access policy for the key vault by using this ID in the [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest&preserve-view=true#az-keyvault-set-policy) command.

**Example**:

```azurecli-interactive
az ad sp list --display-name MyVault
az keyvault set-policy --name myKeyVault --object-id <object-id> --key-permissions get,list,unwrapkey,wrapkey
```

---




### Enable soft delete and purge protection on Azure Key Vault

You need to enable soft delete and purge protection on the key vault that stores your encryption key.

**Choose a client**:

# [Azure portal](#tab/azure-portal)

You can set these properties from the Azure Key Vault interface, as shown in the following screenshot. Alternatively, you can set these properties while creating the key vault. [Learn more about these Key Vault properties](/azure/key-vault/general/soft-delete-overview).

:::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/soft-delete-purge-protection.png" alt-text="Screenshot of options for enabling soft delete and purge protection." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/soft-delete-purge-protection.png":::


# [PowerShell](#tab/powershell)

To enable soft delete on the vault, run the following commands:

1. Sign in to your Azure account.

   ```azurepowershell-interactive
   Login-AzAccount
   ```

2. Select the subscription that contains your vault.

   ```azurepowershell-interactive
   Set-AzContext -SubscriptionId SubscriptionId
   ```

3. Enable soft delete.

   ```azurepowershell-interactive
   ($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "AzureKeyVaultName").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"
   Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
   ```

4. Enable purge protection.

   ```azurepowershell-interactive
   ($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "AzureKeyVaultName").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enablePurgeProtection" -Value "true"
   Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
   ```


# [CLI](#tab/cli)

To enable soft delete on the vault, run the following commands:

1. Sign in to your Azure account.

   ```azurecli-interactive
   az login
   ```

2. Select the subscription that contains your vault.

   ```azurecli-interactive
   az account set --subscription "Subscription1"
   ```

3. Enable soft delete.

   ```azurecli-interactive
   az keyvault update --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {VAULT NAME} --enable-soft-delete true
   ```

4. Enable purge protection.

   ```azurecli-interactive
   az keyvault update --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {VAULT NAME} --enable-purge-protection true
   ```

---


### Assign the encryption key to the Backup vault

Before you select the encryption key for your vault, ensure that you have successfully:

- Enabled the Backup vault's managed identity and assigned the required permissions to it.
- Enabled soft delete and purge protection for the key vault.

>[!Note]
>If there're any updates to the current Key Vault details in the **Encryption Settings** with new key vault information, the managed identity used for **Encryption Settings** must retain access to the original Key Vault, with *Get* and *Unwrap* permissions, and the key should be in *Enabled* state. This access is necessary to execute the *key rotation* from the *previous* key to the *new* key.

To assign the key, follow these steps:

1. Go to *your Backup vault* > **Properties**.

   :::image type="content" source="./media/encryption-at-rest-with-cmk/encryption-settings.png" alt-text="Screenshot that shows properties for a Backup vault." lightbox="./media/encryption-at-rest-with-cmk/encryption-settings.png":::

2. For **Encryption Settings**, select **Update**.

   :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/update-encryption-settings.png" alt-text="Screenshot that shows the link for updating encryption settings." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/update-encryption-settings.png":::

3. On the **Encryption Settings** blade, select **Use your own key** and then specify the key by using one of the following options. Be sure to use an RSA key that's in an enabled and active state.

    - Select **Enter key URI**. In the **Key URI** box, enter the URI for the key that you want to use for encrypting data in this Backup vault. You can also get this key URI from the corresponding key in your key vault.

      Be sure to copy the key URI correctly. We recommend that you use the **Copy to clipboard** button provided with the key identifier.

      :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/encryption-key-with-full-key-uri.png" alt-text="Screenshot that shows selections for entering a key URI." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/encryption-key-with-full-key-uri.png":::

      When you try to update encryption settings but the update operation fails because of an internal error, the encryption setting is updated to **Inconsistent** and requires your attention. In such cases, check your encryption settings details, ensure that they are correct. For example, the **Update Encryption Settings** operation runs again with the existing Managed Identity attached to the vault. If the encryption settings details are same, the update operation is not affected.

      Also if you disable or detach the managed identity being used in Encryption Settings, the Encryption Settings would change to ‘Inconsistent’ state unless you re-enable system assign identity(if it was used), grant the required Key Vault permissions and perform Encryption Settings update operation again. For User Assigned Identity, when you re-attach the identity, Encryption Settings state will be automatically be restored if the Key Vault permissions are there.
 


      :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/key-uri.png" alt-text="Screenshot that shows the status warning for a failed update." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/key-uri.png":::

      When you're specifying the encryption key by using the full key URI with the version component, the key won't be autorotated. You need to update keys manually by specifying the new key or version when required. Alternatively, remove the version component of the key URI to get automatic key version rotation.

      :::image type="content" source="./media/encryption-at-rest-with-cmk/key-uri.png" alt-text="Screenshot that shows a key URI for a Backup vault." lightbox="./media/encryption-at-rest-with-cmk/key-uri.png":::

    - Choose **Select from Key Vault**. On the **Key picker** pane, browse to and select the key from the key vault.

      :::image type="content" source="./media/encryption-at-rest-with-cmk-for-backup-vault/key-vault-encryption.png" alt-text="Screenshot that shows the option for selecting a key from a key vault." lightbox="./media/encryption-at-rest-with-cmk-for-backup-vault/key-vault-encryption.png":::

      When you specify the encryption key by using the **Key picker** pane, the key version will be autorotated whenever a new version for the key is enabled. [Learn more about enabling autorotation of encryption keys](encryption-at-rest-with-cmk.md#enable-autorotation-of-encryption-keys).

4. Select **Update**.

5. Track the progress and status of the encryption key assignment under **Notifications**.

    ### Update encryption settings

You can update the encryption settings anytime. Whenever you want to use a new key URI, ensure that your existing key vault still has access to the managed identity and the key is valid. Otherwise, the update operation will fail.

The managed identity that you want to use for encryption needs the appropriate permissions.

## Back up to a vault encrypted via customer-managed keys

Before you configure backup protection, confirm that you have successfully:

- Created a Backup vault.
- Enabled the Backup vault's system-assigned managed identity or assigned a user-assigned managed identity to the vault.
- Assigned permissions to your Backup vault (or the user-assigned managed identity) to access encryption keys from your key vault.
- Enabled soft delete and purge protection for your key vault.
- Assigned a valid encryption key for your Backup vault.

The process to configure and perform backups to a Backup vault that's encrypted via CMKs is the same as the process to configure and perform backups to a vault that uses PMKs. There are no changes to the experience.

## Private Endpoint support

You can use Azure Key Vault with Private Endpoint (PE) using System-Assigned Managed Identity of the vault. 

If the public network access of the Azure Key Vault is disabled, the access restrictions will prevent you to use Azure portal from outside the private endpoint enabled network machine to Select Key Vault and Key on the **Encryption Settings** blade. However, you can use the **Key Vault key URI** to provide Key Vault key details in **Encryption Settings**.

## Troubleshoot operation errors for encryption settings

This section lists the various troubleshooting scenarios that you might encounter for Backup vault encryption.

### Backup, restore, and background operations failures


**Causes**:

- **Cause 1**: If there's an issue with your **Backup vault Encryption Settings**, such as you have removed Key Vault permissions from Encryption Settings’ managed identity, disabled system-assigned identity, or detached/deleted the managed identity from the Backup vault that you're using for encryption settings, then *backup* and *restore* jobs fail. 

- **Cause 2**: Tiering of restore points and restore-points expiration jobs will fail without showing errors in the Azure portal or other interfaces (for example, REST API or CLI). These operations will continue to fail and incur costs.

**Recommended actions**:

- **Recommendation 1**: Restore the permissions, update the managed identity details that have access to the key vault.

- **Recommendation 2**:  Restore the required encryption settings to the Backup vault.


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

- The Key Vault and key don't exist, and aren't reachable to the Azure Backup service via network settings.

**Recommended action**: Check the Key Vault access policies and grant permissions accordingly.

### Vault deletion failure

**Error code**: `CloudServiceRetryableError`

**Cause**: If there is an issue with your Backup Vault Encryption Settings (such as you have removed Key Vault/MHSM permissions from the managed identity of the Encryption Settings, disabled system-assigned identity, detached/deleted the managed identity from the Backup vault used for encryption settings, or the key vault/MHSM key is deleted), then vault deletion might fail.

**Recommended action**: To address this issue:

- Ensure that the managed identity being used for Encryption Settings still has the permissions to access the key vault/MHSM. Restore them before you proceed for deletion of the vault.
- [Reattach/enable the managed identity and assign the required Key Vault/MHSM permissions](#enable-a-managed-identity-for-your-backup-vault).
- If the key vault key is deleted, then the vault deletion might fail. However, to recover the deleted key from the **Soft Deleted** state, ensure that you have the required permissions to the managed identity on the key vault/MHSM, and then retry the **delete Backup vault** operation.

## Validate error codes

Azure Backup validates the selected *Azure Key Vault* when CMK is applied on the backup vault. If the Key Vault doesn't have the required configuration settings (**Soft Delete Enabled** and **Purge Protection Enabled**), the following error-codes appear:

### UserErrorCMKPurgeProtectionNotEnabledOnKeyVault

**Error code**: `UserErrorCMKPurgeProtectionNotEnabledOnKeyVault`

**Cause**: Soft delete isn't enabled on the Key Vault.

**Recommended action**: Enable soft delete on the Key Vault, and then retry the operation.

### UserErrorCMKSoftDeleteNotEnabledOnKeyVault

**Error code**: `UserErrorCMKSoftDeleteNotEnabledOnKeyVault`

**Cause**: Purge Protection isn't enabled on the Key Vault.

**Recommended action**: Enable Purge Protection on the Key Vault, and then retry the operation.

## Next step

- [Overview of security features in Azure Backup](security-overview.md).
- [Encrypt backup data by using customer-managed keys](encryption-at-rest-with-cmk.md)
- [Data encryption-at-Rest](/azure/security/fundamentals/encryption-atrest)
- [Azure Storage encryption for data at rest](/azure/storage/common/storage-service-encryption)
