---
title: Tutorial - add variable to template
description: Add variables to your Azure Resource Manager template to simplify the syntax.
author: mumian
ms.date: 03/27/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Add variables to your ARM template

In this tutorial, you learn how to add a variable to your Azure Resource Manager (ARM) template. Variables simplify your templates by enabling you to write an expression once and reuse it throughout the template. This tutorial takes **7 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about functions](template-tutorial-add-functions.md), but it's not required.

You must have Visual Studio Code with the Resource Manager Tools extension, and either Azure PowerShell or Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

At the end of the previous tutorial, your template had the following JSON:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-location/azuredeploy.json":::

The parameter for the storage account name is hard-to-use because you have to provide a unique name. If you've completed the earlier tutorials in this series, you're probably tired of guessing a unique name. You solve this problem by adding a variable that constructs a unique name for the storage account.

## Use variable

The following example highlights the changes to add a variable to your template that creates a unique storage account name. Copy the whole file and replace your template with its contents.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-variable/azuredeploy.json" range="1-47" highlight="5-9,29-31,36":::

Notice that it includes a variable named **uniqueStorageName**. This variable uses four functions to construct a string value.

You're already familiar with the [parameters](template-functions-deployment.md#parameters) function, so we won't examine it.

You're also familiar with the [resourceGroup](template-functions-resource.md#resourcegroup) function. In this case, you get the **id** property instead of the **location** property, as shown in the previous tutorial. The **id** property returns the full identifier of the resource group, including the subscription ID and resource group name.

The [uniqueString](template-functions-string.md#uniquestring) function creates a 13 character hash value. The returned value is determined by the parameters you pass in. For this tutorial, you use the resource group ID as the input for the hash value. That means you could deploy this template to different resource groups and get a different unique string value. However, you get the same value if you deploy to the same resource group.

The [concat](template-functions-string.md#concat) function takes values and combines them. For this variable, it takes the string from the parameter and the string from the uniqueString function, and combines them into one string.

The **storagePrefix** parameter enables you to pass in a prefix that helps you identify storage accounts. You can create your own naming convention that makes it easier to identify storage accounts after deployment from a long list of resources.

Finally, notice that the storage name is now set to the variable instead of a parameter.

## Deploy template

Let's deploy the template. Deploying this template is easier than the previous templates because you provide just the prefix for the storage name.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the **templateFile** variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

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

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addnamevariable \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS
```

---

> [!NOTE]
> If the deployment failed, use the **debug** switch with the deployment command to show the debug logs.  You can also use the **verbose** switch to show the full debug logs.

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
> [Add outputs](template-tutorial-add-outputs.md)
