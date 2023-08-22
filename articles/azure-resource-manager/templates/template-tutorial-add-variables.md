---
title: Tutorial - add variable to template
description: Add variables to your Azure Resource Manager template (ARM template) to simplify the syntax.
ms.date: 07/28/2023
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Add variables to your ARM template

In this tutorial, you learn how to add a variable to your Azure Resource Manager template (ARM template). Variables simplify your templates. They let you write an expression once and reuse it throughout the template. This tutorial takes **7 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about functions](template-tutorial-add-functions.md), but it's not required.

You need to have [Visual Studio Code](https://code.visualstudio.com/) installed and working with the Azure Resource Manager Tools extension, and either Azure PowerShell or Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

At the end of the previous tutorial, your template had the following JSON file:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-location/azuredeploy.json":::

Your [Azure storage account](../../storage/common/storage-account-create.md) name needs to be unique to easily continue to build your ARM template. If you've completed the earlier tutorials in this series, you're tired of coming up with a unique name. You solve this problem by adding a variable that creates a unique name for your storage account.

## Use variable

The following example highlights the changes to add a variable to your template that creates a unique storage account name. Copy the whole file and replace your template with its contents.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-variable/azuredeploy.json" range="1-47" highlight="5-9,29-31,36":::

Notice that it includes a variable named `uniqueStorageName`. This variable uses four functions to create a string value.

You're already familiar with the [parameters](template-functions-deployment.md#parameters) function, so we won't examine it.

You're also familiar with the [resourceGroup](template-functions-resource.md#resourcegroup) function. In this case, you get the `id` property instead of the `location` property, as shown in the previous tutorial. The `id` property returns the full identifier of the resource group, including the subscription ID and the resource group name.

The [uniqueString](template-functions-string.md#uniquestring) function creates a 13-character hash value. The parameters you pass determine the returned value. For this tutorial, you use the resource group ID as the input for the hash value. That means you could deploy this template to different resource groups and get a different unique string value. You get the same value, however, if you deploy to the same resource group.

The [concat](template-functions-string.md#concat) function takes values and combines them. For this variable, it takes the string from the parameter and the string from the `uniqueString` function and combines them into one string.

The `storagePrefix` parameter lets you pass in a prefix that helps you identify storage accounts. You can create your own naming convention that makes it easier to identify storage accounts after deployment from an extensive list of resources.

Finally, notice that the storage account name is now set to the variable instead of a parameter.

## Deploy template

Let's deploy the template. Deploying this template is easier than the previous templates because you provide just the prefix for the storage account name.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the `templateFile` variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addnamevariable `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storagePrefix "store" `
  -storageSKU Standard_LRS
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you need to have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addnamevariable \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS
```

---

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Select your resource group.
1. Notice your deployed storage account name is **store**, plus a string of random characters.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to delete the resource group.

1. From the Azure portal, select **Resource groups** from the left menu.
2. Type the resource group name in the **Filter for any field...** text field.
3. Check the box next to **myResourceGroup** and select **myResourceGroup** or your resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you add a variable that creates a unique storage account name. In the next tutorial, you return a value from the deployed storage account.

> [!div class="nextstepaction"]
> [Add outputs](template-tutorial-add-outputs.md)
