---
title: Tutorial - add tags to resources in Azure Resource Manager Bicep file
description: Add tags to resources that you deploy in your Bicep files. Tags let you logically organize resources.
author: mumian
ms.date: 03/10/2021
ms.topic: tutorial
ms.author: jgao
ms.custom:
---

# Tutorial: Add tags in Azure Resource Manager Bicep files

In this tutorial, you learn how to add tags to resources in your Bicep files. [Tags](../management/tag-resources.md) help you logically organize your resources. The tag values show up in cost reports. This tutorial takes **8 minutes** to complete.

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## Prerequisites

We recommend that you complete the [tutorial about Quickstart templates](bicep-tutorial-quickstart-template.md), but it's not required.

You must have Visual Studio Code with the Bicep extension, and either Azure PowerShell or Azure CLI. For more information, see [Bicep tools](bicep-tutorial-create-first-bicep.md#get-tools).

## Review Bicep file

Your previous Bicep file deployed a storage account, App Service plan, and web app.

:::code language="bicep" source="~/resourcemanager-templates/get-started-with-templates/quickstart-template/azuredeploy.bicep":::

After deploying these resources, you might need to track costs and find resources that belong to a category. You can add tags to help solve these issues.

## Add tags

You tag resources to add values that help you identify their use. For example, you can add tags that list the environment and the project. You could add tags that identify a cost center or the team that owns the resource. Add any values that make sense for your organization.

The following example shows the changes to the Bicep file. Copy the whole file and replace your Bicep file with its contents.

:::code language="bicep" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.bicep" range="1-81" highlight="27-30,38,51,71":::

## Deploy Bicep file

It's time to deploy the Bicep file and look at the results.

If you haven't created the resource group, see [Create resource group](bicep-tutorial-create-first-bicep.md#create-resource-group). The example assumes you've set the `bicepFile` variable to the path to the Bicep file, as shown in the [first tutorial](bicep-tutorial-create-first-bicep.md#deploy-bicep-file).

# [PowerShell](#tab/azure-powershell)

To run this deployment cmdlet, you must have the [latest version](/powershell/azure/install-az-ps) of Azure PowerShell.

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addtags `
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
  --name addtags \
  --resource-group myResourceGroup \
  --template-file $bicepFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS webAppName=demoapp
```

---

> [!NOTE]
> If the deployment failed, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Select the resource group you deployed to.
1. Select one of the resources, such as the storage account resource. You see that it now has tags.

   ![Show tags](./media/bicep-tutorial-add-tags/show-tags.png)

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you added tags to the resources. In the next tutorial, you'll learn how to use parameter files to simplify passing in values to the deployment.

> [!div class="nextstepaction"]
> [Use parameter file](bicep-tutorial-use-parameter-file.md)
