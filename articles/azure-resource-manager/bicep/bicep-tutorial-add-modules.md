---
title: Tutorial - add modules to Azure Resource Manager Bicep file
description: Use modules to encapsulate complex details of the raw resource declaration.
author: mumian
ms.date: 03/25/2021
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Add modules to Azure Resource Manager Bicep file

In the [previous tutorial](bicep-tutorial-use-parameter-file.md), you learned how to use a parameter file to deploy your Bicep file. In this tutorial, you learn how to use Bicep modules to encapsulate complex details of the raw resource declaration. The modules can be shared and reused within your solution.  It takes about **12 minutes** to complete.

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## Prerequisites

We recommend that you complete the [tutorial about parameter file](bicep-tutorial-use-parameter-file.md), but it's not required.

You must have Visual Studio Code with the Bicep extension, and either Azure PowerShell or Azure CLI. For more information, see [Bicep tools](bicep-tutorial-create-first-bicep.md#get-tools).

## Review Bicep file

At the end of the previous tutorial, your Bicep file had the following contents:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.bicep":::

This Bicep file works well. But for larger solutions, you want to break your Bicep file into many related modules so you can share and reuse these modules. The current Bicep file deploys a storage account, an app service plan, and a website.  Let's separate the storage account into a module.

## Create Bicep module

Every Bicep file can be consumed as a module, so there is no specific syntax for defining a module. Create a _storage.bicep_ file with the following contents:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-module/storage.bicep":::

This module contains the storage account resource and the related parameters and variables. The values for the _location_ parameter and the _resourceTags_ parameters have been removed. These values will be passed from the main Bicep file.

## Consume Bicep module

Replace the storage account resource definition in the existing _azuredeploy.bicep_ with the following Bicep contents:

```bicep
module stg './storage.bicep' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: storagePrefix
    location: location
    resourceTags: resourceTags
  }
}
```

- **module**: Keyword.
- **symbolic name** (stg): This is an identifier for the module.
- **module file**: The path to the module in this example is specified using a relative path (./storage.bicep). All paths in Bicep must be specified using the forward slash (/) directory separator to ensure consistent compilation cross-platform. The Windows backslash (\) character is unsupported.

To retrieve storage endpoint, update the output in _azuredeploy.bicep_ to the following Bicep:

```bicep
output storageEndpoint object = stg.outputs.storageEndpoint
```

The completed azuredeploy.bicep has the following contents:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-module/azuredeploy.bicep":::

## Deploy template

Use either Azure CLI or Azure PowerShell to deploy the template.

If you haven't created the resource group, see [Create resource group](bicep-tutorial-create-first-bicep.md#create-resource-group). The example assumes you've set the `bicepFile` variable to the path to the Bicep file, as shown in the [first tutorial](bicep-tutorial-create-first-bicep.md#deploy-bicep-file).

# [PowerShell](#tab/azure-powershell)

To run this deployment cmdlet, you must have the [latest version](/powershell/azure/install-az-ps) of Azure PowerShell.

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addmodule `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $bicepFile `
  -storagePrefix "store" `
  -storageSKU Standard_LRS `
  -webAppName demoapp
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addmodule \
  --resource-group myResourceGroup \
  --template-file $bicepFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS webAppName=demoapp
```

---
> [!NOTE]
> If the deployment failed, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource groups from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. You will see the new resource group you deployed in this tutorial.
1. Select the resource group and view the deployed resources. Notice that they match the values you specified in your template file.

## Clean up resources

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field. If you've completed this series, you have three resource groups to delete - **myResourceGroup**, **myResourceGroupDev**, and **myResourceGroupProd**.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

Congratulations, you've finished this introduction to deploying Bicep files to Azure. Let us know if you have any comments and suggestions in the feedback section. Thanks!

The next tutorial series goes into more detail about deploying templates.

> [!div class="nextstepaction"]
> [Deploy a local template](./deployment-tutorial-local-template.md)
