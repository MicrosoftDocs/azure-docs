---
title: Tutorial - use parameter file to deploy template
description: Use parameter files that contain the values to use for deploying your Azure Resource Manager template (ARM template).
ms.date: 07/28/2023
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Use parameter files to deploy your ARM template

In this tutorial, you learn how to use [parameter files](parameter-files.md) to store the values you pass in during deployment. In the previous tutorials, you used inline parameters with your deployment command. This approach worked for testing your Azure Resource Manager template (ARM template), but when automating deployments it can be easier to pass a set of values for your environment. Parameter files make it easier to package parameter values for a specific environment. In this tutorial, you create parameter files for development and production environments. This instruction takes **12 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about tags](template-tutorial-add-tags.md), but it's not required.

You need to have Visual Studio Code with the Resource Manager Tools extension, and either Azure PowerShell or Azure Command-Line Interface (CLI). For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

Your template has many parameters you can provide during deployment. At the end of the previous tutorial, your template had the following JSON file:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.json":::

This template works well, but now you want to easily manage the parameters that you pass in for the template.

## Add parameter files

Parameter files are JSON files with a structure that's similar to your template. In the file, you provide the parameter values you want to pass in during deployment.

Within the parameter file, you provide values for the parameters in your template. The name of each parameter in your parameter file needs to match the name of a parameter in your template. The name is case-insensitive but to easily see the matching values we recommend that you match the casing from the template.

You don't have to provide a value for every parameter. If an unspecified parameter has a default value, that value is used during deployment. If a parameter doesn't have a default value and isn't specified in the parameter file, you're prompted to provide a value during deployment.

You can't specify a parameter name in your parameter file that doesn't match a parameter name in the template. You get an error when you provide unknown parameters.

In Visual Studio Code, create a new file with the following content. Save the file with the name _azuredeploy.parameters.dev.json_.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.parameters.dev.json":::

This file is your parameter file for the development environment. Notice that it uses **Standard_LRS** for the storage account, names resources with a **dev** prefix, and sets the `Environment` tag to **Dev**.

Again, create a new file with the following content. Save the file with the name _azuredeploy.parameters.prod.json_.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.parameters.prod.json":::

This file is your parameter file for the production environment. Notice that it uses **Standard_GRS** for the storage account, names resources with a **contoso** prefix, and sets the `Environment` tag to **Production**. In a real production environment, you would also want to use an app service with a SKU other than free, but we use that SKU for this tutorial.

## Deploy template

Use either Azure CLI or Azure PowerShell to deploy the template.

As a final test of your template, let's create two new resource groups. One for the dev environment and one for the production environment.

For the template and parameter variables, replace `{path-to-the-template-file}`, `{path-to-azuredeploy.parameters.dev.json}`, `{path-to-azuredeploy.parameters.prod.json}`, and the curly braces `{}` with your template and parameter file paths.

First, let's deploy to the dev environment.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$templateFile = "{path-to-the-template-file}"
$parameterFile="{path-to-azuredeploy.parameters.dev.json}"
New-AzResourceGroup `
  -Name myResourceGroupDev `
  -Location "East US"
New-AzResourceGroupDeployment `
  -Name devenvironment `
  -ResourceGroupName myResourceGroupDev `
  -TemplateFile $templateFile `
  -TemplateParameterFile $parameterFile
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you need to have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
templateFile="{path-to-the-template-file}"
devParameterFile="{path-to-azuredeploy.parameters.dev.json}"
az group create \
  --name myResourceGroupDev \
  --location 'East US'
az deployment group create \
  --name devenvironment \
  --resource-group myResourceGroupDev \
  --template-file $templateFile \
  --parameters $devParameterFile
```

---

Now, we deploy to the production environment.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$parameterFile="{path-to-azuredeploy.parameters.prod.json}"
New-AzResourceGroup `
  -Name myResourceGroupProd `
  -Location "West US"
New-AzResourceGroupDeployment `
  -Name prodenvironment `
  -ResourceGroupName myResourceGroupProd `
  -TemplateFile $templateFile `
  -TemplateParameterFile $parameterFile
```

# [Azure CLI](#tab/azure-cli)

```azurecli
prodParameterFile="{path-to-azuredeploy.parameters.prod.json}"
az group create \
  --name myResourceGroupProd \
  --location "West US"
az deployment group create \
  --name prodenvironment \
  --resource-group myResourceGroupProd \
  --template-file $templateFile \
  --parameters $prodParameterFile
```

---

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources you're creating. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource groups from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. You see the two new resource groups you deploy in this tutorial.
1. Select either resource group and view the deployed resources. Notice that they match the values you specified in your parameter file for that environment.

## Clean up resources

1. From the Azure portal, select **Resource groups** from the left menu.
1. Select the hyperlinked resource group name next to the check box. If you complete this series, you have three resource groups to delete - **myResourceGroup**, **myResourceGroupDev**, and **myResourceGroupProd**.
1. Select the **Delete resource group** icon from the top menu.

   > [!CAUTION]
   > Deleting a resource group is irreversible.

1. Type the resource group name in the pop-up window that displays and select **Delete**.

## Next steps

Congratulations. You've finished this introduction to deploying templates to Azure. Let us know if you have any comments and suggestions in the feedback section.

The next tutorial series goes into more detail about deploying templates.

> [!div class="nextstepaction"]
> [Deploy a local template](./deployment-tutorial-local-template.md)
