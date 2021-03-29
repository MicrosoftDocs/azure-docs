---
title: Tutorial - use parameter file to deploy Azure Resource Manager Bicep file
description: Use parameter files that contain the values to use for deploying your Bicep file.
author: mumian
ms.date: 03/10/2021
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Use parameter files to deploy Azure Resource Manager Bicep file

In this tutorial, you learn how to use [parameter files](parameter-files.md) to store the values you pass in during deployment. In the previous tutorials, you used inline parameters with your deployment command. This approach worked for testing your Bicep file, but when automating deployments it can be easier to pass a set of values for your environment. Parameter files make it easier to package parameter values for a specific environment. You use the same JSON parameter file as you deploy a JSON template. In this tutorial, you'll create parameter files for development and production environments. It takes about **12 minutes** to complete.

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## Prerequisites

We recommend that you complete the [tutorial about tags](bicep-tutorial-add-tags.md), but it's not required.

You must have Visual Studio Code with the Bicep extension, and either Azure PowerShell or Azure CLI. For more information, see [Bicep tools](bicep-tutorial-create-first-bicep.md#get-tools).

## Review Bicep file

Your Bicep file has many parameters you can provide during deployment. At the end of the previous tutorial, your Bicep file looked like:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.bicep":::

This Bicep file works well, but now you want to easily manage the parameters that you pass in for the Bicep file.

## Add parameter files

Parameter files are JSON files with a structure that is similar to JSON templates. In the file, you provide the parameter values you want to pass in during deployment.

Within the parameter file, you provide values for the parameters in your Bicep file. The name of each parameter in your parameter file must match the name of a parameter in your Bicep file. The name is case-insensitive but to easily see the matching values we recommend that you match the casing from the Bicep file.

You don't have to provide a value for every parameter. If an unspecified parameter has a default value, that value is used during deployment. If a parameter doesn't have a default value and isn't specified in the parameter file, you're prompted to provide a value during deployment.

You can't specify a parameter name in your parameter file that doesn't match a parameter name in the Bicep file. You get an error when unknown parameters are provided.

In Visual Studio Code, create a new file with following content. Save the file with the name _azuredeploy.parameters.dev.json_.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.parameters.dev.json":::

This file is your parameter file for the development environment. Notice that it uses **Standard_LRS** for the storage account, names resources with a **dev** prefix, and sets the `Environment` tag to **Dev**.

Again, create a new file with the following content. Save the file with the name _azuredeploy.parameters.prod.json_.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.parameters.prod.json":::

This file is your parameter file for the production environment. Notice that it uses **Standard_GRS** for the storage account, names resources with a **contoso** prefix, and sets the `Environment` tag to **Production**. In a real production environment, you would also want to use an app service with a SKU other than free, but we'll continue to use that SKU for this tutorial.

## Deploy Bicep file

Use either Azure CLI or Azure PowerShell to deploy the Bicep file.

In this tutorial, let's create two new resource groups. One for the dev environment and one for the production environment.

For the template and parameter variables, replace `{path-to-the-bicep-file}`, `{path-to-azuredeploy.parameters.dev.json}`, `{path-to-azuredeploy.parameters.prod.json}`, and the curly braces `{}` with your Bicep file and parameter file paths.

First, we'll deploy to the dev environment.

# [PowerShell](#tab/azure-powershell)

To run this deployment cmdlet, you must have the [latest version](/powershell/azure/install-az-ps) of Azure PowerShell.

```azurepowershell
$bicepFile = "{path-to-the-bicep-file}"
$parameterFile="{path-to-azuredeploy.parameters.dev.json}"
New-AzResourceGroup `
  -Name myResourceGroupDev `
  -Location "East US"
New-AzResourceGroupDeployment `
  -Name devenvironment `
  -ResourceGroupName myResourceGroupDev `
  -TemplateFile $bicepFile `
  -TemplateParameterFile $parameterFile
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
bicepFile="{path-to-the-bicep-file}"
devParameterFile="{path-to-azuredeploy.parameters.dev.json}"
az group create \
  --name myResourceGroupDev \
  --location "East US"
az deployment group create \
  --name devenvironment \
  --resource-group myResourceGroupDev \
  --template-file $bicepFile \
  --parameters $devParameterFile
```

---

Now, we'll deploy to the production environment.

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
> If the deployment failed, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource groups from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. You see the two new resource groups you deployed in this tutorial.
1. Select either resource group and view the deployed resources. Notice that they match the values you specified in your parameter file for that environment.

## Clean up resources

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you use a parameter file to deploy your Bicep file. In the next tutorial, you'll learn how to modularize your Bicep files.

> [!div class="nextstepaction"]
> [Add modules](./bicep-tutorial-add-modules.md)
