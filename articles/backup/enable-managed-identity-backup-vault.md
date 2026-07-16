---
title: Enable Managed Identity for a Backup vault
description: Learn how to enable managed identity on a Backup vault
ms.topic: how-to
ms.service: azure-backup
ms.custom:
  - ignite-2025
  - build-2026
ms.date: 04/27/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
---

# Enable managed identities on Backup vault 

[!INCLUDE [Managed identities in Azure Backup](../../includes/backup-enable-managed-identity.md)]

## Enable managed identity

You can enable managed identities for a Backup vault using the Azure portal, Azure CLI, or PowerShell.

**Choose a client**:

# [Azure portal](#tab/azure-portal)

Azure Backup allows you to enable managed identity for a Backup vault either during vault creation or for an existing vault.

### Enable managed identity for Backup vault at vault creation

To enable managed identity for Backup vault at vault creation using Azure portal, follow these steps:

1. [Start creating a new Backup vault](create-manage-backup-vault.md#create-backup-vault) 
2. On the **Vault Properties** tab, under **Managed Identity Settings**, for **Enable System Identity**, toggle the state to **Enabled** 
4. For **Add User Identities** option, select **Add Identity** to attach one or more user-assigned identities 

    :::image type="content" source="./media/enable-managed-identity-backup-vault/backup-vault-create.png" alt-text="Screenshot for assigning managed identity to Backup Vault at creation." lightbox="./media/enable-managed-identity-backup-vault/backup-vault-create.png":::

### Enable managed identity for an existing Backup vault

To enable managed identities for an existing Backup vault, follow these steps: 

1. Go to your Backup vault and select **Settings** > **Identity**
2. On the **Identity** pane, for a system-assigned identity, on the **System assigned** tab, set **Status** to **On** and select Save

    :::image type="content" source="./media/enable-managed-identity-backup-vault/backup-vault-manage-system.png" alt-text="Screenshot for assigning system identity to Backup Vault." lightbox="./media/enable-managed-identity-backup-vault/backup-vault-manage-system.png":::

3. For a user-assigned identity, on the **User assigned** tab, select **+ Add** to attach one or more user-assigned identities 

    :::image type="content" source="./media/enable-managed-identity-backup-vault/backup-vault-manage-user.png" alt-text="Screenshot for assigning user identity to Backup Vault." lightbox="./media/enable-managed-identity-backup-vault/backup-vault-manage-user.png":::

# [Azure CLI](#tab/azure-cli)

To update managed identity for a Backup Vault using CLI, run the following command:

```azurecli
az dataprotection backup-vault identity assign --resource-group 
                                               --vault-name 
                                               [--acquire-policy-token] 
                                               [--change-reference] 
                                               [--mi-system-assigned --system-assigned] 
                                               [--mi-user-assigned --user-assigned] 
                                               [--no-wait {0, 1, f, false, n, no, t, true, y, yes}] 
```

[See more CLI commands](/cli/azure/dataprotection/backup-vault/identity?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-vault-identity-assign)

# [PowerShell](#tab/powershell)

To update managed identity for a Backup Vault using PowerShell, run the following cmdlet:

```azurepowershell
Update-AzDataProtectionBackupVault -ResourceGroupName <rg> -VaultName <vault> -IdentityType SystemAssigned 
```

[See more PowerShell cmdlets](/powershell/module/az.dataprotection/new-azdataprotectionbackupvault?view=azps-15.5.0&preserve-view=true#-identitytype)

>[!Note]
>Role assignments show immediately in the portal, but Azure Backup may take up to 15 minutes to pick up new permissions on the vault’s managed identity. If a validation or job fails with a permission error soon after assignment, wait a few minutes and retry.

---

## Next steps

- [Manage Backup vault](manage-backup-vault.md).
