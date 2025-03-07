---
title: Quickstart to create an Azure Recovery Services vault using an Azure Resource Manager template.
description: In this quickstart, you learn how to create an Azure Recovery Services vault using an Azure Resource Manager template (ARM template).
ms.date: 05/23/2024
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.service: azure-site-recovery
---

# Quickstart: Create a Recovery Services vault using an ARM template

This quickstart describes how to set up a Recovery Services vault by using an Azure Resource Manager
template (ARM template). The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business
continuity and disaster recovery (BCDR) strategy so your business applications stay online during
planned and unplanned outages. Site Recovery manages disaster recovery of on-premises machines and
Azure virtual machines (VM), including replication, failover, and recovery.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

To protect VMware or physical server, see [Modernized architecture](./physical-server-azure-architecture-modernized.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.recoveryservices%2Frecovery-services-vault-create%2Fazuredeploy.json":::

## Prerequisites

If you don't have an active Azure subscription, you can create a
[free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from
[Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/recovery-services-vault-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.recoveryservices/recovery-services-vault-create/azuredeploy.json":::

Two Azure resources are defined in the template:

- [Microsoft.RecoveryServices vaults](/azure/templates/microsoft.recoveryservices/vaults): creates the vault.
- [Microsoft.RecoveryServices/vaults/backupstorageconfig](/rest/api/backup/backup-resource-storage-configs): configures the vault's backup redundancy settings.

The template includes optional parameters for the vault's backup configuration. The storage
redundancy settings are locally redundant storage (LRS) or geo-redundant storage (GRS). For more
information, see [Set storage redundancy](../backup/backup-create-rs-vault.md#set-storage-redundancy).

For more Azure Recovery Services templates, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Recoveryservices&pageNumber=1&sort=Popular).

## Deploy the template

To deploy the template, the **Subscription**, **Resource group**, and **Vault name** are required.

1. To sign in to Azure and open the template, select the **Deploy to Azure** image.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.recoveryservices%2Frecovery-services-vault-create%2Fazuredeploy.json":::

1. Select or enter the following values:

   :::image type="content" source="media/quickstart-create-vault-template/create-vault-template.png" alt-text="Template to create a Recovery Services vault.":::

   - **Subscription**: select your Azure subscription.
   - **Resource group**: select an existing group or select **Create new** to add a group.
   - **Location**: defaults to the resource group's location and becomes unavailable after a
     resource group is selected.
   - **Vault Name**: Provide a name for the vault.
   - **Change Storage Type**: Default is **false**. Select **true** only if you need to change the
     vault's storage type.
   - **Vault Storage Type**: Default is **GloballyRedundant**. If the storage type was set to
     **true**, select **LocallyRedundant**.
   - **Location**: the function `[resourceGroup().location]` defaults to the resource group's
     location. To change the location, enter a value such as **westus**.
   - Select the check box **I agree to the terms and conditions stated above**.

1. To begin the vault's deployment, select the **Purchase** button. After a successful deployment, a
   notification is displayed.

   :::image type="content" source="media/quickstart-create-vault-template/deployment-success.png" alt-text="Vault deployment was successful.":::

## Validate the deployment

To confirm that the vault was created, use Azure CLI or Azure PowerShell.

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the resource group name:" &&
read resourceGroupName &&
echo "Enter the vault name:" &&
read vaultName &&
az backup vault show --name $vaultName --resource-group $resourceGroupName &&
az backup vault backup-properties show --name $vaultName --resource-group $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
$vaultName = Read-Host -Prompt "Enter the vault name"
$vaultBackupConfig = Get-AzRecoveryServicesVault -Name $vaultName
Get-AzRecoveryServicesVault -ResourceGroupName $resourceGroupName -Name $vaultName
Get-AzRecoveryServicesBackupProperty -Vault $vaultBackupConfig
Write-Host "Press [ENTER] to continue..."
```

---

The following output is an excerpt of the vault's information:

# [CLI](#tab/CLI)

```Output
"id": "/subscriptions/<Subscription Id>/resourceGroups/myResourceGroup
         /providers/Microsoft.RecoveryServices/vaults/myVault"
"location": "eastus"
"name": "myVault"
"resourceGroup": "myResourceGroup"

"storageModelType": "GeoRedundant"
"storageType": "GeoRedundant"
"type": "Microsoft.RecoveryServices/vaults/backupstorageconfig"
```

# [PowerShell](#tab/PowerShell)

```Output
Name              : myVault
Type              : Microsoft.RecoveryServices/vaults
Location          : eastus
ResourceGroupName : myResourceGroup
SubscriptionId    : <Subscription Id>

BackupStorageRedundancy
-----------------------
GeoRedundant
```

---

## Clean up resources

If you plan to use the new resources, no action is needed. Otherwise, you can remove the resource
group and vault that was created in this quickstart. To delete the resource group and its resources
use Azure CLI or Azure PowerShell.

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the resource group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

---

## Next steps

In this quickstart, you created a Recovery Services vault. To learn more about disaster recovery,
continue to the next quickstart article - [Set up disaster recovery](azure-to-azure-quickstart.md).
