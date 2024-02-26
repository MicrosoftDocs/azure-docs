---
title: Create multiple resource instances in Bicep
description: Use different methods to create multiple resource instances in Bicep
ms.date: 06/23/2023
ms.topic: quickstart
ms.custom: mode-api, devx-track-bicep
#Customer intent: As a developer new to Azure deployment, I want to learn how to create multiple resources in Bicep.
---

# Quickstart: Create multiple resource instances in Bicep

Learn how to use different `for` syntaxes to create multiple resource instances in Bicep. Even though this article only shows creating multiple resource instances, the same methods can be used to define copies of module, variable, property, or output. To learn more, see [Bicep loops](./loops.md).

This article contains the following topics:

- [use integer index](#use-integer-index)
- [use array elements](#use-array-elements)
- [use array and index](#use-array-and-index)
- [use dictionary object](#use-dictionary-object)
- [loop with condition](#loop-with-condition)

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

To set up your environment for Bicep development, see [Install Bicep tools](install.md). After completing those steps, you'll have [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). You also have either the latest [Azure CLI](/cli/azure/) or the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az).

## Create a single instance

In this section, you define a Bicep file for creating a storage account, and then deploy the Bicep file. The subsequent sections provide the Bicep samples for different `for` syntaxes. You can use the same deployment method to deploy and experiment those samples. If your deployment fails, it is likely one of the two causes:

- The storage account name is too long. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- The storage account name is not unique. Your storage account name must be unique within Azure.

The following Bicep file defines one storage account:

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/createStorage.bicep":::

Save the Bicep file locally, and then use Azure CLI or Azure PowerShell to deploy the Bicep file:

# [CLI](#tab/CLI)

```azurecli
resourceGroupName = "{provide-a-resource-group-name}"
templateFile="{provide-the-path-to-the-bicep-file}"

az group create --name $resourceGroupName --location eastus

az deployment group create --resource-group $resourceGroupName --template-file $templateFile
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
$resourceGroupName = "{provide-a-resource-group-name}"
$templateFile = "{provide-the-path-to-the-bicep-file}"

New-AzResourceGroup -Name $resourceGroupName -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile $templateFile
```

---

## Use integer index

A for loop with an index is used in the following sample to create two storage accounts:

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopNumbered.bicep" highlight="2,4-5":::

The index number is used as a part of the storage account name. After deploying the Bicep file, you get two storage accounts that are similar to:

:::image type="content" source="./media/quickstart-loops/bicep-loop-number-0-2.png" alt-text="Use integer index with 0 as the starting number":::

Inside range(), the first number is the starting number, and the second number is the number of times the loop will run. So if you change it to **range(3,2)**, you will also get two storage accounts:

:::image type="content" source="./media/quickstart-loops/bicep-loop-number-3-2.png" alt-text="Use integer index with 3 as the starting number":::

The output of the preceding sample shows how to reference the resources created in a loop. The output is similar to:

```json
"outputs": {
  "names": {
    "type": "Array",
    "value": [
      {
        "name": "0storage52iyjssggmvue"
      },
      {
        "name": "1storage52iyjssggmvue"
      }
    ]
  }
},
```

## Use array elements

You can loop through an array. The following sample shows an array of strings.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopArrayString.bicep" highlight="2-5,7-8":::

The loop uses all the strings in the array as a part of the storage account names. In this case, it creates two storage accounts:

:::image type="content" source="./media/quickstart-loops/bicep-loop-array-string.png" alt-text="Use an array of strings":::

You can also loop through an array of objects. The loop not only customizes the storage account names, but also configures the SKUs.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopArrayObject.bicep" highlight="2-11,13-14,17":::

The loop creates two storage accounts. The SKU of the storage account with the name starting with **fabrikam** is **Premium_LRS**.

:::image type="content" source="./media/quickstart-loops/bicep-loop-array-string.png" alt-text="Use an array of strings":::

## Use array and index

In same cases, you might want to combine an array loop with an index loop. The following sample shows how to use the array and the index number for the naming convention.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopArrayStringAndNumber.bicep" highlight="2-5,7-8":::

After deploying the preceding sample, you create two storage accounts that are similar to:

:::image type="content" source="./media/quickstart-loops/bicep-loop-array-string-number.png" alt-text="Use an array of strings and index number":::

## Use dictionary object

To iterate over elements in a dictionary object, use the [items function](./bicep-functions-object.md#items), which converts the object to an array. Use the `value` property to get properties on the objects.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopObject.bicep" highlight="3-12,14,15,18":::

The loop creates two storage accounts. The SKU of the storage account with the name starting with **fabrikam** is **Premium_LRS**.

:::image type="content" source="./media/quickstart-loops/bicep-loop-dictionary-object.png" alt-text="Use a dictionary object":::

## Loop with condition

For resources and modules, you can add an `if` expression with the loop syntax to conditionally deploy the collection.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopWithCondition.bicep" highlight="3,5":::

For more information, see [conditional deployment in Bicep](./conditional-resource-deployment.md).

## Clean up resources

When the Azure resources are no longer needed, use the Azure CLI or Azure PowerShell module to delete the quickstart resource group.

# [CLI](#tab/CLI)

```azurecli
resourceGroupName = "{provide-the-resource-group-name}"

az group delete --name $resourceGroupName
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
$resourceGroupName = "{provide-the-resource-group-name}"

Remove-AzResourceGroup -Name $resourceGroupName
```

---

## Next steps

> [!div class="nextstepaction"]
> [Learn modules for Bicep](learn-bicep.md)
