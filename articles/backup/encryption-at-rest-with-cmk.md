---
title: Encrypt backup data by using customer-managed keys
description: Learn how to use Azure Backup to encrypt your backup data by using customer-managed keys (CMKs).
ms.topic: conceptual
ms.date: 08/25/2023
ms.custom: devx-track-azurepowershell-azurecli, devx-track-azurecli
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Encrypt backup data by using customer-managed keys

You can use Azure Backup to encrypt your backup data via customer-managed keys (CMKs) instead of platform-managed keys (PMKs), which are enabled by default. Your keys to encrypt the backup data must be stored in [Azure Key Vault](../key-vault/index.yml).

The encryption key that you use for encrypting backups might be different from the one that you use for the source. An AES 256-based data encryption key (DEK) helps protect the data. Your key encryption keys (KEKs), in turn, help protect the DEK. You have full control over the data and the keys.

To allow encryption, you must grant the Backup vault the permissions to access the encryption key in the key vault. You can change the key when necessary.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Create a Recovery Services vault.
> - Configure the Recovery Services vault to encrypt the backup data by using CMKs.
> - Back up data to a vault that's encrypted via CMKs.
> - Restore data from backups.

## Considerations

- You can use this feature (using Azure Backup to encrypt backup data via CMKs) to encrypt *new Recovery Services vaults only*. Any vault that contains existing items registered or attempted to be registered to it aren't supported.

- After you enable encryption by using CMKs for a Recovery Services vault, you can't revert to using PMKs (the default). You can change the encryption keys to meet requirements.

- This feature currently *doesn't support backup via the Microsoft Azure Recovery Services (MARS) agent*, and you might not be able to use a CMK-encrypted vault for backup via the MARS agent. The MARS agent uses passphrase-based encryption. This feature also doesn't support backup of virtual machines (VMs) that you created in the classic deployment model.

- This feature isn't related to [Azure Disk Encryption](../virtual-machines/disk-encryption-overview.md), which uses guest-based encryption of a VM's disk by using BitLocker for Windows and DM-Crypt for Linux.

- You can encrypt the Recovery Services vault only by using keys that are stored in Azure Key Vault and located in the *same region*. Also, keys must be [supported](../key-vault/keys/about-keys.md#key-types-and-protection-methods) RSA keys and must be in the enabled state.

- Moving a CMK-encrypted Recovery Services vault across resource groups and subscriptions isn't currently supported.

- When you move a Recovery Services vault that's already encrypted via CMKs to a new tenant, you need to update the Recovery Services vault to re-create and reconfigure the vault's managed identity and CMK (which should be in the new tenant). If you don't update the vault, the backup and restore operations will fail. You also need to reconfigure any Azure role-based access control (RBAC) permissions that you set up within the subscription.

- You can configure this feature through the Azure portal and PowerShell. Use Az module 5.3.0 or later to use CMKs for backups in the Recovery Services vault.

  > [!WARNING]
  > If you're using PowerShell to manage encryption keys for Backup, we don't recommend updating the keys from the portal. If you update the keys from the portal, you can't use PowerShell to update the keys further until a PowerShell update to support the new model is available. However, you can continue to update the keys from the Azure portal.

- If you haven't created and configured your Recovery Services vault, see [this article](backup-create-rs-vault.md).

## Configure a vault to encrypt by using customer-managed keys

To configure a vault, perform the following actions in sequence:

1. Enable a managed identity for your Recovery Services vault.

2. Assign permissions to the Recovery Services vault to access the encryption key in Azure Key Vault.

3. Enable soft delete and purge protection on Azure Key Vault.

4. Assign the encryption key to the Recovery Services vault.

The following sections discuss each of these actions in detail.

### Enable a managed identity for your Recovery Services vault

Azure Backup uses system-assigned managed identities and user-assigned managed identities to authenticate the Recovery Services vault to access encryption keys stored in Azure Key Vault. You can choose which managed identity to use.

> [!NOTE]
> After you enable a managed identity, you must *not* disable it (even temporarily). Disabling the managed identity might lead to inconsistent behavior.

#### Enable a system-assigned managed identity for the vault

Choose a client:

# [Azure portal](#tab/portal)

1. Go to *your Recovery Services vault* > **Identity**.

2. Select the **System assigned** tab.

3. Change **Status** to **On**.

4. Select **Save** to enable the identity for the vault.

:::image type="content" source="media/encryption-at-rest-with-cmk/enable-system-assigned-managed-identity-for-vault.png" alt-text="Screenshot that shows selections for enabling a system-assigned managed identity." lightbox="media/encryption-at-rest-with-cmk/enable-system-assigned-managed-identity-for-vault.png":::

The preceding steps generate an object ID, which is the system-assigned managed identity of the vault.

# [PowerShell](#tab/powershell)

Use the [Update-AzRecoveryServicesVault](/powershell/module/az.recoveryservices/update-azrecoveryservicesvault) command to enable a system-assigned managed identity for the Recovery Services vault.

Example:

```AzurePowerShell
$vault=Get-AzRecoveryServicesVault -ResourceGroupName "testrg" -Name "testvault"

Update-AzRecoveryServicesVault -IdentityType SystemAssigned -ResourceGroupName TestRG -Name TestVault

$vault.Identity | fl
```

Output:

```output
PrincipalId : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TenantId    : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Type        : SystemAssigned
```

# [CLI](#tab/cli)

Use the [az backup vault identity assign](/cli/azure/backup/vault/identity) command to enable a system-assigned managed identity for the Recovery Services vault.

Example:

```Azure CLI
az backup vault identity assign --system-assigned --resource-group MyResourceGroup --name MyVault
```

Output:

```output
PrincipalId : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TenantId    : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Type        : SystemAssigned
```

---

#### Assign a user-assigned managed identity to the vault (in preview)

> [!NOTE]
> Vaults that use user-assigned managed identities for CMK encryption don't support the use of private endpoints for Backup.
>
> Key vaults that limit access to specific networks aren't yet supported for use with user-assigned managed identities for CMK encryption.

To assign the user-assigned managed identity for your Recovery Services vault, choose a client:

# [Azure portal](#tab/portal)

1. Go to *your Recovery Services vault* > **Identity**.

2. Select the **User assigned (preview)** tab.

3. Select **+Add** to add a user-assigned managed identity.

4. On the **Add user assigned managed identity** panel, select the subscription for your identity.

5. Select the identity from the list. You can also filter by the name of the identity or resource group.

6. Select **Add** to finish assigning the identity.

:::image type="content" source="media/encryption-at-rest-with-cmk/assign-user-assigned-managed-identity-to-vault.png" alt-text="Screenshot that shows selections for assigning a user-assigned managed identity to a vault." lightbox="media/encryption-at-rest-with-cmk/assign-user-assigned-managed-identity-to-vault.png":::

# [PowerShell](#tab/powershell)

Use the [Update-AzRecoveryServicesVault](/powershell/module/az.recoveryservices/update-azrecoveryservicesvault) command to enable a user-assigned managed identity for the Recovery Services vault.

Example:

```AzurePowerShell
$vault = Get-AzRecoveryServicesVault -Name "vaultName" -ResourceGroupName "resourceGroupName"
$identity1 = Get-AzUserAssignedIdentity -ResourceGroupName "resourceGroupName" -Name "UserIdentity1"
$identity2 = Get-AzUserAssignedIdentity -ResourceGroupName "resourceGroupName" -Name "UserIdentity2"
$updatedVault = Update-AzRecoveryServicesVault -ResourceGroupName $vault.ResourceGroupName -Name $vault.Name -IdentityType UserAssigned -IdentityId $identity1.Id, $identity2.Id

$updatedVault.Identity | fl
```

Output:

```output
PrincipalId : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TenantId    : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Type        : UserAssigned
UserAssignedIdentities : {[/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/UserIdentity1, Microsoft.Azure.Management.RecoveryServices.Models.UserIdentity],[/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/UserIdentity2,Microsoft.Azure.Management.RecoveryServices.Models.UserIdentity]}
```

# [CLI](#tab/cli)

Use the [az backup vault identity assign](/cli/azure/backup/vault/identity) command to enable a system-assigned managed identity for the Recovery Services vault.

Example:

```Azure CLI
az backup vault identity assign --user-assigned MyIdentityId1 --resource-group MyResourceGroup --name MyVault
```

Output:

```output
PrincipalId : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TenantId    : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Type        : UserAssigned
UserAssignedIdentities : {[/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/MyIdentityId1,Microsoft.Azure.Management.RecoveryServices.Models.UserIdentity]}
```

---

### Assign permissions to the Recovery Services vault to access the encryption key in Azure Key Vault

You now need to permit the Recovery Services vault's managed identity to access the key vault that contains the encryption key.

If you're using a user-assigned identity, you must assign the same permissions to it.

Choose a client:

# [Azure portal](#tab/portal)

1. Go to *your key vault* > **Access policies**. Select **+Add Access Policy**.

    :::image type="content" source="./media/encryption-at-rest-with-cmk/access-policies.png" alt-text="Screenshot that shows selections to add an access policy." lightbox="./media/encryption-at-rest-with-cmk/access-policies.png":::

2. Specify the actions to permit on the key. For **Key permissions**, select the **Get**, **List**, **Unwrap Key**, and **Wrap Key** operations.

    :::image type="content" source="./media/encryption-at-rest-with-cmk/key-permissions.png" alt-text="Screenshot that shows selections for assigning key permissions." lightbox="./media/encryption-at-rest-with-cmk/key-permissions.png":::

3. Go to **Select principal** and search for your vault in the search box by using its name or managed identity. When the vault appears, select it and then choose **Select** at the bottom of the panel.

    :::image type="content" source="./media/encryption-at-rest-with-cmk/select-principal.png" alt-text="Screenshot that shows the panel for selecting a principal." lightbox="./media/encryption-at-rest-with-cmk/select-principal.png":::

4. Select **Add** to add the new access policy.

5. Select **Save** to save changes that you made to the access policy of the key vault.

You can also assign an RBAC role to the Recovery Services vault that contains the previously mentioned permissions, such as the [Key Vault Crypto Officer](../key-vault/general/rbac-guide.md#azure-built-in-roles-for-key-vault-data-plane-operations) role. This role might contain additional permissions.

# [PowerShell](#tab/powershell)

Use the [Get-AzADServicePrincipal](/powershell/module/az.resources/get-azadserviceprincipal) command to get the principal ID of the Recovery Services vault. Then, use this ID in the [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) command to set an access policy for the key vault.

Example:

```AzurePowerShell
$sp = Get-AzADServicePrincipal -DisplayName MyVault
$Set-AzKeyVaultAccessPolicy -VaultName myKeyVault -ObjectId $sp.Id -PermissionsToKeys get,list,unwrapkey,wrapkey
```

# [CLI](#tab/cli)

Use the [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) command to get the principal ID of the Recovery Services vault. Then, use this ID in the [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) command to set an access policy for the key vault.

Example:

```Azure CLI
az ad sp list --display-name MyVault
az keyvault set-policy --name myKeyVault --object-id <object-id> --key-permissions get,list,unwrapkey,wrapkey
```

---

### Enable soft delete and purge protection on Azure Key Vault

You need to enable soft delete and purge protection on the key vault that stores your encryption key.

Choose a client:

# [Azure portal](#tab/portal)

You can enable soft delete and purge protection from the Azure Key Vault interface, as shown in the following screenshot. Alternatively, you can set these properties while creating the key vault. [Learn more about these Key Vault properties](../key-vault/general/soft-delete-overview.md).

:::image type="content" source="./media/encryption-at-rest-with-cmk/soft-delete-purge-protection.png" alt-text="Screenshot that shows the toggles for enabling soft delete and purge protection." lightbox="./media/encryption-at-rest-with-cmk/soft-delete-purge-protection.png":::

# [PowerShell](#tab/powershell)

1. Sign in to your Azure account:

    ```azurepowershell
    Login-AzAccount
    ```

2. Select the subscription that contains your vault:

    ```azurepowershell
    Set-AzContext -SubscriptionId SubscriptionId
    ```

3. Enable soft delete:

    ```azurepowershell
    ($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "AzureKeyVaultName").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"
    ```

    ```azurepowershell
    Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
    ```

4. Enable purge protection:

    ```azurepowershell
    ($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "AzureKeyVaultName").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enablePurgeProtection" -Value "true"
    ```

    ```azurepowershell
    Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
    ```

# [CLI](#tab/cli)

1. Sign in to your Azure account:

    ```azurecli
    az login
    ```

2. Select the subscription that contains your vault:

    ```azurecli
    az account set --subscription "Subscription1"
    ```

3. Enable soft delete:

    ```azurecli
    az keyvault update --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {VAULT NAME} --enable-soft-delete true
    ```

4. Enable purge protection:

    ```azurecli
    az keyvault update --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} -n {VAULT NAME} --enable-purge-protection true
    ```

---

### Assign an encryption key to the Recovery Services vault

Before you select the encryption key for your vault, ensure that you successfully:

- Enabled the Recovery Services vault's managed identity and assigned the required permissions to it.
- Enabled soft delete and purge protection for the key vault.
- Don't have any items protected or registered to the Recovery Services vault for which you want to enable CMK encryption.

To assign the key and follow the steps, choose a client:

# [Azure portal](#tab/portal)

1. Go to *your Recovery Services vault* > **Properties**.

2. Under **Encryption Settings**, select **Update**.

    :::image type="content" source="./media/encryption-at-rest-with-cmk/encryption-settings.png" alt-text="Screenshot that shows properties for a Recovery Services vault." lightbox="./media/encryption-at-rest-with-cmk/encryption-settings.png":::

3. On the **Encryption Settings** pane, select **Use your own key** and then specify the key by using one of the following options. Be sure to use an RSA key that's in an enabled state.

    - Select **Enter key URI**. In the **Key Uri** box, enter the URI for the key that you want to use for encrypting data in this Recovery Services vault. You can also get this key URI from the corresponding key in your key vault. In the **Subscription** box, specify the subscription for the key vault that contains this key.

      Be sure to copy the key URI correctly. We recommend that you use the **Copy to clipboard** button provided with the key identifier.

      :::image type="content" source="./media/encryption-at-rest-with-cmk/key-uri.png" alt-text="Screenshot that shows a key URI for a Recovery Services vault." lightbox="./media/encryption-at-rest-with-cmk/key-uri.png":::

      When you're specifying the encryption key by using the full key URI with the version component, the key won't be autorotated. You need to update keys manually by specifying the new key or version when required. Alternatively, remove the version component of the key URI to get automatic rotation.

    - Choose **Select from Key Vault**. On the **Key picker** pane, browse to and select the key from the key vault.

      :::image type="content" source="./media/encryption-at-rest-with-cmk/key-vault.png" alt-text="Screenshot that shows the option for selecting a key from a key vault." lightbox="./media/encryption-at-rest-with-cmk/key-vault.png":::

      When you specify the encryption key by using the **Key picker** pane, the key will be autorotated whenever a new version for the key is enabled. [Learn more about enabling autorotation of encryption keys](#enable-autorotation-of-encryption-keys).

4. Select **Save**.

5. Track the progress and status of the encryption key assignment by using the **Backup Jobs** view on the left menu. The status should soon change to **Completed**. Your vault will now encrypt all the data with the specified key as a KEK.

    :::image type="content" source="./media/encryption-at-rest-with-cmk/status-succeeded.png" alt-text="Screenshot that shows the status of a backup job as completed." lightbox="./media/encryption-at-rest-with-cmk/status-succeeded.png":::

    The encryption key updates are also logged in the vault's activity log.

    :::image type="content" source="./media/encryption-at-rest-with-cmk/activity-log.png" alt-text="Screenshot that shows an activity log." lightbox="./media/encryption-at-rest-with-cmk/activity-log.png":::

# [PowerShell](#tab/powershell)

Use the [Set-AzRecoveryServicesVaultProperty](/powershell/module/az.recoveryservices/set-azrecoveryservicesvaultproperty) command to enable CMK encryption and to assign or update an encryption key.

Example:

```azurepowershell
$keyVault = Get-AzKeyVault -VaultName "testkeyvault" -ResourceGroupName "testrg" 
$key = Get-AzKeyVaultKey -VaultName $keyVault -Name "testkey" 
Set-AzRecoveryServicesVaultProperty -EncryptionKeyId $key.ID -KeyVaultSubscriptionId "xxxx-yyyy-zzzz"  -VaultId $vault.ID


$enc=Get-AzRecoveryServicesVaultProperty -VaultId $vault.ID
$enc.encryptionProperties | fl
```

Output:

```output
EncryptionAtRestType          : CustomerManaged
KeyUri                        : testkey
SubscriptionId                : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
LastUpdateStatus              : Succeeded
InfrastructureEncryptionState : Disabled
```

# [CLI](#tab/cli)

Use the [az backup vault encryption update](/cli/azure/backup/vault/encryption#az-backup-vault-encryption-update) command to enable CMK encryption and to assign or update an encryption key.

Example:

```azurecli
az backup vault encryption update --encryption-key-id MyEncryptionKeyId --mi-system-assigned --resource-group MyResourceGroup --name MyVault
```

Output:

```output
EncryptionAtRestType          : CustomerManaged
KeyUri                        : testkey
SubscriptionId                : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
LastUpdateStatus              : Succeeded
InfrastructureEncryptionState : Disabled
```

This process remains the same when you want to update or change the encryption key. If you want to update and use a key from another key vault (different from the one that you're currently using), ensure that:

- The key vault is in the same region as the Recovery Services vault.
- The key vault has soft delete and purge protection enabled.
- The Recovery Services vault has the required permissions to access the key vault.

---

## Back up data to a vault encrypted via customer-managed keys

Before you configure backup protection, confirm that you successfully:

- Created your Recovery Services vault.
- Enabled the Recovery Services vault's system-assigned managed identity or assigned a user-assigned managed identity to the vault.
- Assigned permissions to your Recovery Services vault (or the user-assigned managed identity) to access encryption keys from your key vault.
- Enabled soft delete and purge protection for your key vault.
- Assigned a valid encryption key for your Recovery Services vault.

This checklist is important because after you configure (or try to configure) an item to back up to a non-CMK encrypted vault, you can't enable CMK encryption on it. It continues to use PMKs.

The process to configure and perform backups to a Recovery Services vault that's encrypted via CMKs is the same as the process to configure and perform backups to a vault that uses PMKs. There are no changes to the experience. This statement is true for the [backup of Azure VMs](./quick-backup-vm-portal.md) and the backup of workloads running inside a VM (for example, [SAP HANA](./tutorial-backup-sap-hana-db.md) or [SQL Server](./tutorial-sql-backup.md) databases).

## Restore data from a backup

### Restore data from a VM backup

You can restore data stored in the Recovery Services vault according to the steps described in [this article](./backup-azure-arm-restore-vms.md). When you're restoring from a Recovery Services vault that's encrypted via CMKs, you can choose to encrypt the restored data by using a disk encryption set (DES).

The experience that this section describes applies only when you restore data from CMK-encrypted vaults. When you restore data from a vault that isn't using CMK encryption, the restored data is encrypted via PMKs. If you restore from an instant recovery snapshot, the restored data is encrypted via the mechanism that you used for encrypting the source disk.

#### Restore a disk or VM

When you recover a disk or VM from a **Snapshot** recovery point, the restored data is encrypted with the DES that you used to encrypt the source VM's disks.

When you're restoring a disk or VM from a recovery point with **Recovery Type** as **Vault**, you can choose to encrypt the restored data by using a DES that you specify. Alternatively, you can continue to restore the data without specifying a DES. In that case, the encryption setting on the VM is applied.

During cross-region restore, CMK-enabled Azure VMs (which aren't backed up in a CMK-enabled Recovery Services vault) are restored as non-CMK-enabled VMs in the secondary region.

You can encrypt the restored disk or VM after the restore is complete, regardless of the selection that you made when you started the restore.

:::image type="content" source="./media/encryption-at-rest-with-cmk/restore-points.png" alt-text="Screenshot that shows restore points and recovery types." lightbox="./media/encryption-at-rest-with-cmk/restore-points.png":::

#### Select a disk encryption set while restoring from a vault recovery point

Choose a client:

# [Azure portal](#tab/portal)

To specify a DES under **Encryption Settings** in the restore pane, follow these steps:

1. For **Encrypt disk(s) using your key?**, select **Yes**.

2. In the **Encryption Set** dropdown list, select the DES that you want to use for the restored disks. Ensure that you have access to the DES.

> [!NOTE]
> The ability to choose a DES while restoring is supported if you're doing a cross-region restore. However, it's currently not supported if you're restoring a VM that uses Azure Disk Encryption.

:::image type="content" source="./media/encryption-at-rest-with-cmk/encrypt-disk-using-your-key.png" alt-text="Screenshot that shows selections for encrypting a disk by using a key." lightbox="./media/encryption-at-rest-with-cmk/encrypt-disk-using-your-key.png":::

# [PowerShell](#tab/powershell)

Use the [Get-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupitem) command with the parameter `-DiskEncryptionSetId <string>` to [specify the DES](/powershell/module/az.compute/get-azdiskencryptionset) for encrypting the restored disk. For more information about restoring disks from a VM backup, see [this article](./backup-azure-vms-automation.md#restore-an-azure-vm).

Example:

```azurepowershell
$namedContainer = Get-AzRecoveryServicesBackupContainer  -ContainerType "AzureVM" -Status "Registered" -FriendlyName "V2VM" -VaultId $vault.ID
$backupitem = Get-AzRecoveryServicesBackupItem -Container $namedContainer  -WorkloadType "AzureVM" -VaultId $vault.ID
$startDate = (Get-Date).AddDays(-7)
$endDate = Get-Date
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -Item $backupitem -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime() -VaultId $vault.ID
$restorejob = Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -StorageAccountName "DestAccount" -StorageAccountResourceGroupName "DestRG" -TargetResourceGroupName "DestRGforManagedDisks" -DiskEncryptionSetId "testdes1" -VaultId $vault.ID
```

# [CLI](#tab/cli)

Use the [az backup restore restore-disks](/cli/azure/backup/restore#az-backup-restore-restore-disks) command with the parameter `-DiskEncryptionSetId <string>` to [specify the DES](/cli/azure/disk-encryption-set) for encrypting the restored disk.

Example:

```azurecli
az backup recoverypoint list --container-name MyContainer --item-name MyItem --resource-group MyResourceGroup --vault-name MyVault
az backup restore restore-disks --container-name MyContainer --disk-encryption-set-id testdes1 --item-name MyItem --resource-group MyResourceGroup --rp-name MyRp --storage-account mystorageaccount --vault-name MyVault
```

---

#### Restore files

When you perform a file restore, the restored data is encrypted with the key that you used to encrypt the target location.

### Restore SAP HANA/SQL databases in Azure VMs

When you restore from a backed-up SAP HANA or SQL Server database running in an Azure VM, the restored data is encrypted through the encryption key that you used at the target storage location. It can be a CMK or a PMK that's used for encrypting the disks of the VM.

## Additional topics

### Enable encryption by using customer-managed keys at vault creation (in preview)

Enabling encryption at vault creation by using CMKs is in limited public preview and requires allowlisting of subscriptions. To sign up for the preview, fill out the [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0H3_nezt2RNkpBCUTbWEapURDNTVVhGOUxXSVBZMEwxUU5FNDkyQkU4Ny4u) and write to us at [AskAzureBackupTeam@microsoft.com](mailto:AskAzureBackupTeam@microsoft.com).

When your subscription is allowlisted, the **Backup Encryption** tab appears. You use this tab to enable encryption on the backup by using CMKs during the creation of a new Recovery Services vault.

To enable the encryption, follow these steps:

1. On the **Backup Encryption** tab, specify the encryption key and the identity to use for encryption. The settings apply to Backup only and are optional.

1. For **Encryption type**, select **Use customer-managed key**.

1. To specify the key to use for encryption, select the appropriate option for **Encryption key**. You can provide the URI for the encryption key, or browse and select the key.

   If you specify the key by using the **Select from Key Vault** option, autorotation of the encryption key is enabled automatically. [Learn more about autorotation](#enable-autorotation-of-encryption-keys).

1. For **Identity**, specify the user-assigned managed identity to manage encryption by using CMKs. Choose **Select** to browse to and select the required identity.

1. Add tags (optional) and continue creating the vault.

:::image type="content" source="media/encryption-at-rest-with-cmk/enable-encryption-using-cmk-at-vault.png" alt-text="Screenshot that shows selections for enabling encryption at the vault level." lightbox="media/encryption-at-rest-with-cmk/enable-encryption-using-cmk-at-vault.png":::

### Enable autorotation of encryption keys

To specify the CMK for encrypting backups, use one of the following options:

- **Enter key URI**
- **Select from Key Vault**

Using the **Select from Key Vault** option enables autorotation for the selected key. This option eliminates the manual effort to update to the next version. However, when you use this option:

- The update to the key version can take up to an hour to take effect.
- After a key update takes effect, the old version should also be available (in an enabled state) for at least one subsequent backup job.

When you specify the encryption key by using the full key URI, the key won't be automatically rotated. You need to perform key updates manually by specifying the new key when required. To enable automatic rotation, remove the version component of the key URI.

### Use Azure Policy to audit and enforce encryption via customer-managed keys (in preview)

With Azure Backup, you can use Azure Policy to audit and enforce encryption of data in the Recovery Services vault by using CMKs. You can use the audit policy for auditing encrypted vaults by using CMKs that were enabled after April 1, 2021.

For vaults that have CMK encryption enabled before April 1, 2021, the policy might not be applied or might show false negative results. That is, these vaults might be reported as noncompliant despite having CMK encryption enabled.

To use the audit policy for auditing vaults with CMK encryption enabled before April 1, 2021, use the Azure portal to update an encryption key. This approach helps you upgrade to the new model. If you don't want to change the encryption key, provide the same key again through the key URI or the key selection option.

> [!WARNING]
> If you're using PowerShell for managing encryption keys for Backup, we don't recommend that you update an encryption key from the portal. If you update a key from the portal, you can't use PowerShell to update the encryption key until a PowerShell update to support the new model is available. However, you can continue updating the key from the portal.

## Frequently asked questions

### Can I encrypt an existing Backup vault by using customer-managed keys?

No. You can enable CMK encryption for new vaults only. A vault must never have had any items protected to it. In fact, you must not attempt to protect any items to the vault before you enable encryption by using CMKs.

### I tried to protect an item to my vault, but it failed, and the vault still doesn't contain any items protected to it. Can I enable CMK encryption for this vault?

No. The vault must not have had any attempts to protect any items to it in the past.

### I have a vault that's using CMK encryption. Can I later revert to PMK encryption even if I have backup items protected to the vault?

No. After you enable CMK encryption, you can't revert to using PMKs. You can change the keys according to your requirements.

### Does CMK encryption for Azure Backup also apply to Azure Site Recovery?

No. This article discusses encryption of Backup data only. For Azure Site Recovery, you need to set the property separately as available from the service.

### I missed one of the steps in this article and proceeded to protect my data source. Can I still use CMK encryption?

If you don't follow the steps in the article and you proceed to protect items, the vault might not be able to use CMK encryption. We recommend that you use [this checklist](#back-up-data-to-a-vault-encrypted-via-customer-managed-keys) before you protect items.

### Does using CMK encryption add to the cost of my backups?

Using CMK encryption for Backup doesn't incur any additional costs. But you might continue to incur costs for using your key vault where your key is stored.

## Next steps

[Overview of security features in Azure Backup](security-overview.md)
