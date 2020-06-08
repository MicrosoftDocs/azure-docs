---
title: Tutorial - add template functions
description: Add template functions to your Azure Resource Manager template to construct values.
author: mumian
ms.date: 03/27/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Add template functions to your ARM template

In this tutorial, you learn how to add [template functions](template-functions.md) to your Azure Resource Manager (ARM) template. You use functions to dynamically construct values. In addition to these system-provided template functions, you can also create [user-defined functions](./template-user-defined-functions.md). This tutorial takes **7 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about parameters](template-tutorial-add-parameters.md), but it's not required.

You must have Visual Studio Code with the Resource Manager Tools extension, and either Azure PowerShell or Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

At the end of the previous tutorial, your template had the following JSON:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-sku/azuredeploy.json":::

The location of the storage account is hard-coded to **East US**. However, you may need to deploy the storage account to other regions. You're again facing an issue of your template lacking flexibility. You could add a parameter for location, but it would be great if its default value made more sense than just a hard-coded value.

## Use function

If you've completed the previous tutorial in this series, you've already used a function. When you added **"[parameters('storageName')]"**, you used the [parameters](template-functions-deployment.md#parameters) function. The brackets indicate that the syntax inside the brackets is a [template expression](template-expressions.md). Resource Manager resolves the syntax rather than treating it as a literal value.

Functions add flexibility to your template by dynamically getting values during deployment. In this tutorial, you use a function to get the location of the resource group you're using for deployment.

The following example highlights the changes to add a parameter called **location**.  The parameter default value calls the [resourceGroup](template-functions-resource.md#resourcegroup) function. This function returns an object with information about the resource group being used for deployment. One of the properties on the object is a location property. When you use the default value, the storage account location has the same location as the resource group. The resources inside a resource group don't have to share the same location. You can also provide a different location when needed.

Copy the whole file and replace your template with its contents.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-location/azuredeploy.json" range="1-44" highlight="24-27,34":::

## Deploy template

In the previous tutorials, you created a storage account in East US, but your resource group was created in Central US. For this tutorial, your storage account is created in the same region as the resource group. Use the default value for location, so you don't need to provide that parameter value. You must provide a new name for the storage account because you're creating a storage account in a different location. For example, use **store2** as the prefix instead of **store1**.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the **templateFile** variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addlocationparameter `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storageName "{new-unique-name}"
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addlocationparameter \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storageName={new-unique-name}
```

---

> [!NOTE]
> If the deployment failed, use the **debug** switch with the deployment command to show the debug logs.  You can also use the **verbose** switch to show the full debug logs.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Select the resource group you deployed to.
1. You see that a storage account resource has been deployed and has the same location as the resource group.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you used a function when defining the default value for a parameter. In this tutorial series, you'll continue using functions. By the end of the series, you'll add functions to every section of the template.

> [!div class="nextstepaction"]
> [Add variables](template-tutorial-add-variables.md)
