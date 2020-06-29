---
title: Tutorial - use parameter file to deploy template
description: Use parameter files that contain the values to use for deploying your Azure Resource Manager template.
author: mumian
ms.date: 03/27/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Use parameter files to deploy your ARM template

In this tutorial, you learn how to use [parameter files](parameter-files.md) to store the values you pass in during deployment. In the previous tutorials, you used inline parameters with your deployment command. This approach worked for testing your Azure Resource Manager (ARM) template, but when automating deployments it can be easier to pass a set of values for your environment. Parameter files make it easier to package parameter values for a specific environment. In this tutorial, you'll create parameter files for development and production environments. It takes about **12 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about tags](template-tutorial-add-tags.md), but it's not required.

You must have Visual Studio Code with the Resource Manager Tools extension, and either Azure PowerShell or Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

Your template has many parameters you can provide during deployment. At the end of the previous tutorial, your template looked like:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.json":::

This template works well, but now you want to easily manage the parameters that you pass in for the template.

## Add parameter files

Parameter files are JSON files with a structure that is similar to your template. In the file, you provide the parameter values you want to pass in during deployment.

In VS Code, create a new file with following content. Save the file with the name **azuredeploy.parameters.dev.json**.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.parameters.dev.json":::

This file is your parameter file for the development environment. Notice that it uses Standard_LRS for the storage account, names resources with a **dev** prefix, and sets the **Environment** tag to **Dev**.

Again, create a new file with the following content. Save the file with the name **azuredeploy.parameters.prod.json**.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.parameters.prod.json":::

This file is your parameter file for the production environment. Notice that it uses Standard_GRS for the storage account, names resources with a **contoso** prefix, and sets the **Environment** tag to **Production**. In a real production environment, you would also want to use an app service with a SKU other than free, but we'll continue to use that SKU for this tutorial.

## Deploy template

Use either Azure CLI or Azure PowerShell to deploy the template.

As a final test of your template, let's create two new resource groups. One for the dev environment and one for the production environment.

First, we'll deploy to the dev environment.

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

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
templateFile="{path-to-the-template-file}"
devParameterFile="{path-to-azuredeploy.parameters.dev.json}"
az group create \
  --name myResourceGroupDev \
  --location "East US"
az deployment group create \
  --name devenvironment \
  --resource-group myResourceGroupDev \
  --template-file $templateFile \
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
> If the deployment failed, use the **debug** switch with the deployment command to show the debug logs.  You can also use the **verbose** switch to show the full debug logs.

## Verify deployment

You can verify the deployment by exploring the resource groups from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. You see the two new resource groups you deployed in this tutorial.
1. Select either resource group and view the deployed resources. Notice that they match the values you specified in your parameter file for that environment.

## Clean up resources

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field. If you've completed this series, you have three resource groups to delete - myResourceGroup, myResourceGroupDev, and myResourceGroupProd.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

Congratulations, you've finished this introduction to deploying templates to Azure. Let us know if you have any comments and suggestions in the feedback section. Thanks!

The next tutorial series goes into more detail about deploying templates.

> [!div class="nextstepaction"]
> [Deploy a local template](./deployment-tutorial-local-template.md)
