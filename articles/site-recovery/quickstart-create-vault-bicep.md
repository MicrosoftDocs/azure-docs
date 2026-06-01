---
title: Quickstart to create an Azure Recovery Services vault using Bicep.
description: In this quickstart, you learn how to create an Azure Recovery Services vault using Bicep.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.date: 02/13/2026
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
# Customer intent: As an IT administrator, I want to create a Recovery Services vault using Bicep, so that I can ensure business continuity and disaster recovery for my applications during outages.
---

# Quickstart: Create a Recovery Services vault by using Bicep

This quickstart shows how to set up a Recovery Services vault by using Bicep. The [Azure Site Recovery](site-recovery-overview.md) service helps you maintain your business continuity and disaster recovery (BCDR) strategy, so your business applications stay online during planned and unplanned outages. Site Recovery manages disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an active Azure subscription, create a
[free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Review the Bicep file

This quickstart uses a Bicep file from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/recovery-services-vault-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.recoveryservices/recovery-services-vault-create/main.bicep":::

The Bicep file defines two Azure resources:

- [Microsoft.RecoveryServices vaults](/azure/templates/microsoft.recoveryservices/vaults): creates the vault.
- [Microsoft.RecoveryServices/vaults/backupstorageconfig](/rest/api/backup/backup-resource-storage-configs): configures the vault's backup redundancy settings.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** on your local computer.
1. Deploy the Bicep file by using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters vaultName=<vault-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -vaultName "<vault-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<vault-name\>** with the name of the vault.

    When the deployment finishes, you see a message indicating the deployment succeeded.

## Review deployed resources

Use Azure CLI or Azure PowerShell to confirm that the vault was created.

# [CLI](#tab/CLI)

```azurecli-interactive
az backup vault show --name <vault-name> --resource-group exampleRG
az backup vault backup-properties show --name <vault-name> --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$vaultBackupConfig = Get-AzRecoveryServicesVault -Name "<vault-name>"

Get-AzRecoveryServicesVault -Name "<vault-name>" -ResourceGroupName "exampleRG"
Get-AzRecoveryServicesBackupProperty -Vault $vaultBackupConfig
```

---

> [!NOTE]
> Replace **\<vault-name\>** with the name of the vault you created.

## Clean up resources

If you plan to use the new resources, no action is needed. Otherwise, you can remove the resource group and vault that was created in this quickstart. To delete the resource group and its resources, use Azure CLI or Azure PowerShell.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created a Recovery Services vault by using Bicep. To learn more about disaster recovery, see [Set up disaster recovery](azure-to-azure-quickstart.md).
