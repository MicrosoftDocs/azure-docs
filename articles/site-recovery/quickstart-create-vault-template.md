---
title: Quickstart to create an Azure Recovery Services vault using an Azure Resource Manager template.
description: In this quickstart, you learn how to create an Azure Recovery Services vault using an Azure Resource Manager template.
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 04/29/2020
author: davidsmatlak
ms.author: v-dasmat
---

# Quickstart: Create a Recovery Services vault using a Resource Manager template

This quickstart describes how to set up a Recovery Services vault by using an Azure Resource Manager
template. The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business
continuity and disaster recovery (BCDR) strategy so your business applications stay online during
planned and unplanned outages. Site Recovery manages disaster recovery of on-premises machines and
Azure virtual machines (VM), including replication, failover, and recovery.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an active Azure subscription, you can create a
[free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

None.

## Create a Recovery Services vault

### Review the template

The template used in this quickstart is from
[Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-recovery-services-vault-create/).

:::code language="json" source="~/quickstart-templates/101-recovery-services-vault-create/azuredeploy.json" range="1-66" highlight="41-65":::

Two Azure resources are defined in the template:

- [Microsoft.RecoveryServices vaults](/azure/templates/microsoft.recoveryservices/vaults): creates the vault.
- [Microsoft.RecoveryServices/vaults/backupstorageconfig](/rest/api/backup/backupresourcestorageconfigs): configures the vault's backup redundancy settings.

The template includes optional parameters for the vault's backup configuration. The storage
redundancy settings are locally-redundant storage (LRS) or geo-redundant storage (GRS). For more
information, see [Set storage redundancy](../backup/backup-create-rs-vault.md#set-storage-redundancy).

For more Azure Recovery Services templates, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Recoveryservices&pageNumber=1&sort=Popular).

### Deploy the template

To deploy the template, the **Subscription**, **Resource group**, and **Vault name** are required.

1. To sign in to Azure and open the template, select the **Deploy to Azure** image.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-recovery-services-vault-create%2Fazuredeploy.json)

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
$resouceGroupName = Read-Host -Prompt "Enter the resource group name"
$vaultName = Read-Host -Prompt "Enter the vault name"
$vaultBackupConfig = Get-AzRecoveryServicesVault -Name $vaultName
Get-AzRecoveryServicesVault -ResourceGroupName $resouceGroupName -Name $vaultName
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
$resouceGroupName = Read-Host -Prompt "Enter the resource group name"
Remove-AzResourceGroup -Name $resouceGroupName
Write-Host "Press [ENTER] to continue..."
```

---

## Next steps

In this quickstart, you created a Recovery Services vault. To learn more about disaster recovery,
continue to the next quickstart article.

> [!div class="nextstepaction"]
> [Set up disaster recovery](azure-to-azure-quickstart.md)
