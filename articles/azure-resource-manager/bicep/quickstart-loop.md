---
title: Create multiple resource instances in Bicep
description: Use different methods to create multiple resource instances in Bicep
ms.date: 12/06/2021
ms.topic: quickstart

#Customer intent: As a developer new to Azure deployment, I want to learn how to create multiple resources in Bicep.
---

# Quickstart: Create multiple instances

Learn how to use different methods to create multiple resource instances in Bicep. Even though this articles shows how to create multiple resource instances, the same methods can be used to define copies of module, variable, property, or output.

These methods include:

- [use integer index](#use-integer-index)
- [use array elements](#use-array-elements)
- [use array and index](#use-array-and-index)
- [use object](#use-object)
- [loop with condition](#loop-with-condition)

To learn more, see [Loops](./loop.md).

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

To set up your environment for Bicep development, see [Install Bicep tools](install.md). After completing those steps, you'll have [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). You also have either the latest [Azure CLI](/cli/azure/) or the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az).

## Create a single instance

In this section, you learn how to create a Bicep file for creating a storage account, and how to deploy the Bicep file.  The subsequent sections provide the Bicep samples for different methods. You can use the same deployment methods to deploy and experience those samples.

To create a single instance of a storage account:

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/createStorage.bicep":::

To deploy the Bicep file:

# [CLI](#tab/CLI)

```azurecli
az group create --name arm-vscode --location eastus

az deployment group create --resource-group arm-vscode --template-file azuredeploy.json --parameters azuredeploy.parameters.json
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name arm-vscode -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName arm-vscode -TemplateFile ./azuredeploy.json -TemplateParameterFile ./azuredeploy.parameters.json
```

---

## Use integer index

A for loop is used in the next example to create two storage account:

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopNumbered.bicep" highlight="4-5":::

After deploying the Bicep file, you get two storage accounts similar to:

:::image type="content" source="./media/quickstart-loops/bicep-loop-number-0-2.png" alt-text="Use integer index":::

Inside range(), the first number is the starting number, and the second number is the number of time it will run. So if you change it to **range(3,2)**, you will get:

:::image type="content" source="./media/quickstart-loops/bicep-loop-number-3-2.png" alt-text="Use integer index":::

The output of the sample shows how to reference the resources created in a loop:

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

You can loop through an array. The following example shows an array of string:

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopArrayString.bicep" highlight="7-8":::

The loop uses all the values in the array. In this case, it create two storage accounts:

:::image type="content" source="./media/quickstart-loops/bicep-loop-array-string.png" alt-text="Use an array of strings":::

The following sample shows how to loop through an array of objects. The loop not only customize the storage account names, but also configure the SKUs.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopArrayObject.bicep" highlight="13-14,17":::

:::image type="content" source="./media/quickstart-loops/bicep-loop-array-object.png" alt-text="Use an array of strings":::

## use array and index

You can combine an array loop with an index loop. The following sample shows how to use the array and the index number for the naming convention.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopArrayObjectAndNumber.bicep" highlight="4-5":::


## Use dictionary object

To iterate over elements in a dictionary object, use the items function, which converts the object to an array. Use the value property to get properties on the objects.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopObject.bicep" highlight="13-14,17":::

# Loop with condition

For resources and modules, you can add an if expression with the loop syntax to conditionally deploy the collection.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopWithCondition.bicep" highlight="3,5":::

## Next steps

> [!div class="nextstepaction"]
> [Bicep in Microsoft Learn](learn-bicep.md)
