---
title: Tutorial - add variable to Azure Resource Manager Bicep file
description: Add variables to your Bicep file to simplify the syntax.
author: mumian
ms.date: 03/10/2021
ms.topic: tutorial
ms.author: jgao
ms.custom:
---

# Tutorial: Add variables to Azure Resource Manager Bicep file

In this tutorial, you learn how to add a variable to your Bicep file. Variables simplify your Bicep files by enabling you to write an expression once and reuse it throughout the Bicep file. This tutorial takes **7 minutes** to complete.

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## Prerequisites

We recommend that you complete the [tutorial about functions](bicep-tutorial-add-functions.md), but it's not required.

You must have Visual Studio Code with the Bicep extension, and either Azure PowerShell or Azure CLI. For more information, see [Bicep tools](bicep-tutorial-create-first-bicep.md#get-tools).

## Review Bicep file

At the end of the previous tutorial, your Bicep file had the following contents:

:::code language="bicep" source="~/resourcemanager-templates/get-started-with-templates/add-location/azuredeploy.bicep":::

The parameter for the storage account name is hard-to-use because you have to provide a unique name. If you've completed the earlier tutorials in this series, you're probably tired of guessing a unique name. You solve this problem by adding a variable that constructs a unique name for the storage account.

## Use variable

The following example shows the changes to add a variable to your Bicep file that creates a unique storage account name. Copy the whole file and replace your Bicep file with its contents.

:::code language="bicep" source="~/resourcemanager-templates/get-started-with-templates/add-variable/azuredeploy.bicep" range="1-31" highlight="1-3,19,22":::

Notice that it includes a variable named `uniqueStorageName`. This variable uses three functions to construct a string value.

You're familiar with the [resourceGroup](template-functions-resource.md#resourcegroup) function. In this case, you get the `id` property instead of the `location` property, as shown in the previous tutorial. The `id` property returns the full identifier of the resource group, including the subscription ID and resource group name.

The [uniqueString](template-functions-string.md#uniquestring) function creates a 13 character hash value. The returned value is determined by the parameters you pass in. For this tutorial, you use the resource group ID as the input for the hash value. That means you could deploy this Bicep file to different resource groups and get a different unique string value. However, you get the same value if you deploy to the same resource group.

Bicep supports a [string interpolation](https://en.wikipedia.org/wiki/String_interpolation#) syntax. For this variable, it takes the string from the parameter and the string from the `uniqueString` function, and combines them into one string.

The `storagePrefix` parameter enables you to pass in a prefix that helps you identify storage accounts. You can create your own naming convention that makes it easier to identify storage accounts after deployment from a long list of resources.

Finally, notice that the storage name is now set to the variable instead of a parameter.

## Deploy Bicep file

Let's deploy the Bicep file. Deploying this Bicep file is easier than the previous Bicep files because you provide just the prefix for the storage name.

If you haven't created the resource group, see [Create resource group](bicep-tutorial-create-first-bicep.md#create-resource-group). The example assumes you've set the `bicepFile` variable to the path to the Bicep file, as shown in the [first tutorial](bicep-tutorial-create-first-bicep.md#deploy-bicep-file).

# [PowerShell](#tab/azure-powershell)

To run this deployment cmdlet, you must have the [latest version](/powershell/azure/install-az-ps) of Azure PowerShell.

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addnamevariable `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $bicepFile `
  -storagePrefix "store" `
  -storageSKU Standard_LRS
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addnamevariable \
  --resource-group myResourceGroup \
  --template-file $bicepFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS
```

---

> [!NOTE]
> If the deployment failed, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Select the resource group you deployed to.
1. You see that a storage account resource has been deployed. The name of the storage account is **store** plus a string of random characters.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you added a variable that creates a unique name for a storage account. In the next tutorial, you return a value from the deployed storage account.

> [!div class="nextstepaction"]
> [Add outputs](bicep-tutorial-add-outputs.md)
