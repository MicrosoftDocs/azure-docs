---
title: Create an Azure App Configuration store using Bicep
titleSuffix: Azure App Configuration
description: Learn how to create an Azure App Configuration store using Bicep.
author: maud-lv
ms.author: malev
ms.date: 05/06/2022
ms.service: azure-app-configuration
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create an Azure App Configuration store using Bicep

This quickstart describes how you can use Bicep to:

- Deploy an App Configuration store.
- Create key-values in an App Configuration store.
- Read key-values in an App Configuration store.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/app-configuration-store-kv/).

> [!NOTE]
> Bicep files use the same underlying engine as ARM templates. All of the tips, notes, and important information found in the [ARM template quickstart](./quickstart-resource-manager.md) apply here. It's recommended to reference this information when working with Bicep files.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.appconfiguration/app-configuration-store-kv/main.bicep":::

Two Azure resources are defined in the Bicep file:

- [Microsoft.AppConfiguration/configurationStores](/azure/templates/microsoft.appconfiguration/2020-07-01-preview/configurationstores): create an App Configuration store.
- [Microsoft.AppConfiguration/configurationStores/keyValues](/azure/templates/microsoft.appconfiguration/2020-07-01-preview/configurationstores/keyvalues): create a key-value inside the App Configuration store.

With this Bicep file, we create one key with two different values, one of which has a unique label.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters configStoreName=<store-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -configStoreName "<store-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<store-name\>** with the name of the App Configuration store.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use Azure CLI or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

You can also use the Azure portal to list the resources:

1. Sign in to the Azure portal.
1. In the search box, enter *App Configuration*, then select **App Configuration** from the list.
1. Select the newly created App Configuration resource.
1. Under **Operations**, select **Configuration explorer**.
1. Verify that two key-values exist.

## Clean up resources

When no longer needed, use Azure CLI or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

You can also use the Azure portal to delete the resource group:

1. Navigate to your resource group.
1. Select **Delete resource group**.
1. A tab will appear. Enter the resource group name and select **Delete**.

## Next steps

To learn about adding feature flag and Key Vault reference to an App Configuration store, check out the ARM template examples.

- [app-configuration-store-ff](https://azure.microsoft.com/resources/templates/app-configuration-store-ff/)
- [app-configuration-store-keyvaultref](https://azure.microsoft.com/resources/templates/app-configuration-store-keyvaultref/)
