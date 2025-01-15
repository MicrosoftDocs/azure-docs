---
title: 'Quickstart: Create a storage task by using Bicep'
titleSuffix: Azure Storage Actions Preview
description: Learn how to create a storage task by using Bicep.
ms.service: azure-storage-actions
author: normesta
ms.author: normesta
ms.topic: quickstart-bicep
ms.custom: subject-bicepqs
ms.date: 01/15/2025
---

# Quickstart: Create a storage task with Bicep

This quickstart describes how to create a storage task by using Bicep.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from
[Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/storage-task/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.storage.actions/storage-task/main.bicep":::

The [Microsoft.StorageActions/storageTasks](/azure/templates/microsoft.storageactions/2023-01-01/storagetasks) Azure resource is defined in the Bicep file. 

## Deploy the Bicep file

The following scripts are designed for and tested in [Azure Cloud Shell](../../cloud-shell/overview.md). Choose **Try It** to open a Cloud Shell instance right in your browser. 

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
read -p "Enter a resource group name that is used for generating resource names:" resourceGroupName &&
read -p "Enter the location (like 'eastus' or 'northeurope'):" location &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage.actions/storage-task/main.bicep" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri &&
echo "Press [ENTER] to continue ..." &&
read
```
### [Azure PowerShell](#tab/azure-powershell)

```powershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter a resource group name that is used for generating resource names"
$location = Read-Host -Prompt "Enter the location (like 'eastus' or 'northeurope')"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage.actions/storage-task/main.bicep"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

Read-Host -Prompt "Press [ENTER] to continue ..."
```
---

## Review deployed resources

1. In the Azure portal, search for _Storage Tasks_. Then, under **Services**, select **Storage tasks - Azure Storage Actions**.

2. In the list of storage tasks, search for the name of the storage task that you deployed.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the deployed storage task as it appears in the Azure portal.](../media/storage-tasks/storage-quickstart-bicep/deployed-storage-task-in-azure-portal.png)


## Clean up resources

When no longer needed, delete the resource group. The resource group and all the resources in the
resource group are deleted. Use the following command to delete the resource group and all its contained resources.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --name <resource-group-name>
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name <resource-group-name>
```

---

Replace `<resource-group-name>` with the name of your resource group.

## Next steps

> [!div class="nextstepaction"]
> Read more about Azure Storage Actions. See [What is Azure Storage Actions Preview?](../overview.md).