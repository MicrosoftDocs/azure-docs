---
title: Enable Managed Identity for a Recovery Services vault
description: Enable managed identity on a Recovery Services vault
ms.topic: how-to
ms.service: azure-backup
ms.custom:
  - ignite-2025
  - build-2026
ms.date: 04/23/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
---

# Enable managed identities on Recovery Services Vault

[!INCLUDE [Managed identities in Azure Backup](../../includes/backup-enable-managed-identity.md)]

## Enable managed identity

### Azure portal

To enable managed identities for a Recovery Services vault using the Azure portal, follow these steps:

1. Go to your Recovery Services vault and select **Settings** >  **Identity**
2. On the **Identity** pane, for a system-assigned identity, select the **System assigned** tab, set **Status** to **On**, and select **Save**

    :::image type="content" source="./media/enable-managed-identity-recovery-services-vault/recovery-services-vault-system.png" alt-text="Screenshot for assigning system identity to Recovery Services Vault." lightbox="./media/enable-managed-identity-recovery-services-vault/recovery-services-vault-system.png":::

3. For a user-assigned identity, select the **User assigned** tab, select **+ Add**, choose the subscription and identity, and select **Add**

    :::image type="content" source="./media/enable-managed-identity-recovery-services-vault/recovery-services-vault-user.png" alt-text="Screenshot for assigning user identity to Recovery Services Vault." lightbox="./media/enable-managed-identity-recovery-services-vault/recovery-services-vault-user.png":::

### Azure CLI

To update managed identity for a Recovery Services Vault using CLI, run the following command:

```azurecli
az backup vault identity assign --resource-group <rg> --name <vault> --system-assigned
```

```azurecli
az backup vault identity assign --resource-group <rg> --name <vault> --user-assigned <uami-resource-id> 
```

[See more CLI commands](/cli/azure/backup/vault/identity?view=azure-cli-latest&preserve-view=true#az-backup-vault-identity-assign).

### PowerShell

To update managed identity for a Recovery Services Vault using PowerShell, run the following cmdlet:

```azurepowershell
Update-AzRecoveryServicesVault -ResourceGroupName <rg> -Name <vault> -IdentityType SystemAssigned 
```

```azurepowershell
$vault = Get-AzRecoveryServicesVault -Name "vaultName" -ResourceGroupName "resourceGroupName" 
$identity1 = Get-AzUserAssignedIdentity -ResourceGroupName "resourceGroupName" -Name "UserIdentity1" 
$identity2 = Get-AzUserAssignedIdentity -ResourceGroupName "resourceGroupName" -Name "UserIdentity2" 
$updatedVault = Update-AzRecoveryServicesVault -ResourceGroupName $vault.ResourceGroupName -Name $vault.Name -IdentityType UserAssigned -IdentityId $identity1.Id, $identity2.Id 
$updatedVault.Identity | Format-List
```

[See more PowerShell cmdlets](/powershell/module/az.recoveryservices/update-azrecoveryservicesvault?view=azps-15.5.0&preserve-view=true#examples).

## Next steps

- [Manage Recovery Services vault](backup-azure-manage-windows-server.md).
