---
title: Quickstart to create an Azure Recovery Services vault using Bicep.
description: In this quickstart, you learn how to create an Azure Recovery Services vault using Bicep.
author: schaffererin
ms.author: v-eschaffer
ms.date: 05/24/2022
ms.topic: quickstart
ms.custom: devx-track-azurepowershell, subject-armqs, mode-arm
---

# Quickstart: Create a Recovery Services vault using Bicep

This quickstart describes how to set up a Recovery Services vault using Bicep. The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy so your business applications stay online during planned and unplanned outages. Site Recovery manages disaster recovery of on-premises machines and Azure virtual machines (VM), including replication, failover, and recovery.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an active Azure subscription, you can create a
[free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/recovery-services-vault-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.recoveryservices/recovery-services-vault-create/main.bicep":::

Two Azure resources are defined in the Bicep file:

- [Microsoft.RecoveryServices vaults](/azure/templates/microsoft.recoveryservices/vaults): creates the vault.
- [Microsoft.RecoveryServices/vaults/backupstorageconfig](/rest/api/backup/backup-resource-storage-configs): configures the vault's backup redundancy settings.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

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

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

If you plan to use the new resources, no action is needed. Otherwise, you can remove the resource group and vault that was created in this quickstart. To delete the resource group and its resources use Azure CLI or Azure PowerShell.

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

In this quickstart, you created a Recovery Services vault using Bicep. To learn more about disaster recovery, continue to the next quickstart article.

> [!div class="nextstepaction"]
> [Set up disaster recovery](azure-to-azure-quickstart.md)
