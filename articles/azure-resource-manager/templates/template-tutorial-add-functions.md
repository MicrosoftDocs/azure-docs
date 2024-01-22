---
title: Tutorial - add template functions
description: Add template functions to your Azure Resource Manager template (ARM template) to construct values.
ms.date: 07/28/2023
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Add template functions to your ARM template

In this tutorial, you learn how to add [template functions](template-functions.md) to your Azure Resource Manager template (ARM template). You use functions to dynamically construct values. In addition to these system-provided template functions, you can also create [user-defined functions](./user-defined-functions.md). This tutorial takes **7 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about parameters](template-tutorial-add-parameters.md), but it's not required.

You need to have [Visual Studio Code](https://code.visualstudio.com/) installed and working with the Azure Resource Manager Tools extension, and either Azure PowerShell or Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

At the end of the previous tutorial, your template had the following JSON file:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-sku/azuredeploy.json":::

Suppose you hard-coded the location of the [Azure storage account](../../storage/common/storage-account-create.md) to **eastus**, but you need to deploy it to another region. You need to add a parameter to add flexibility to your template and allow it to have a different location.

## Use function

If you completed the [parameters tutorial](./template-tutorial-add-parameters.md#make-template-reusable), you used a function. When you added `"[parameters('storageName')]"`, you used the [parameters](template-functions-deployment.md#parameters) function. The brackets indicate that the syntax inside the brackets is a [template expression](template-expressions.md). Resource Manager resolves the syntax instead of treating it as a literal value.

Functions add flexibility to your template by dynamically getting values during deployment. In this tutorial, you use a function to get the resource group deployment location.

The following example highlights the changes to add a parameter called `location`. The parameter default value calls the [resourceGroup](template-functions-resource.md#resourcegroup) function. This function returns an object with information about the deployed resource group. One of the object properties is a location property. When you use the default value, the storage account and the resource group have the same location. The resources inside a group have different locations.

Copy the whole file and replace your template with its contents.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-location/azuredeploy.json" range="1-44" highlight="24-27,34":::

## Deploy template

In the previous tutorials, you created a storage account in the East US, but your resource group is created in the Central US. For this tutorial, you create a storage account in the same region as the resource group. Use the default value for location, so you don't need to provide that parameter value. You need to provide a new name for the storage account because you're creating a storage account in a different location. Use **store2**, for example, as the prefix instead of **store1**.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the `templateFile` variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addlocationparameter `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storageName "{new-unique-name}"
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you need to have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addlocationparameter \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storageName={new-unique-name}
```

---

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Check the box to the left of **myResourceGroup** and select **myResourceGroup**.
1. Select the resource group you created. The default name is **myResourceGroup**.
1. Notice your deployed storage account and your resource group have the same location.


## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to delete the resource group.

1. From the Azure portal, select **Resource groups** from the left menu.
2. Type the resource group name in the **Filter for any field...** text field.
3. Check the box next to **myResourceGroup** and select **myResourceGroup** or your resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you use a function to define the default value for a parameter. In this tutorial series, you continue to use functions. By the end of the series, you add functions to every template section.

> [!div class="nextstepaction"]
> [Add variables](template-tutorial-add-variables.md)
