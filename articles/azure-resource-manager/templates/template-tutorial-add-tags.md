---
title: Tutorial - add tags to resources in template
description: Add tags to resources that you deploy in your Azure Resource Manager template. Tags let you logically organize resources.
author: mumian
ms.date: 03/27/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Add tags in your ARM template

In this tutorial, you learn how to add tags to resources in your Azure Resource Manager (ARM) template. [Tags](../management/tag-resources.md) help you logically organize your resources. The tag values show up in cost reports. This tutorial takes **8 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about Quickstart templates](template-tutorial-quickstart-template.md), but it's not required.

You must have Visual Studio Code with the Resource Manager Tools extension, and either Azure PowerShell or Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

Your previous template deployed a storage account, App Service plan, and web app.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/quickstart-template/azuredeploy.json":::

After deploying these resources, you might need to track costs and find resources that belong to a category. You can add tags to help solve these issues.

## Add tags

You tag resources to add values that help you identify their use. For example, you can add tags that list the environment and the project. You could add tags that identify a cost center or the team that owns the resource. Add any values that make sense for your organization.

The following example highlights the changes to the template. Copy the whole file and replace your template with its contents.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-tags/azuredeploy.json" range="1-118" highlight="46-52,64,78,102":::

## Deploy template

It's time to deploy the template and look at the results.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the **templateFile** variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addtags `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
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
  --template-file $templateFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS webAppName=demoapp
```

---

> [!NOTE]
> If the deployment failed, use the **debug** switch with the deployment command to show the debug logs.  You can also use the **verbose** switch to show the full debug logs.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Select the resource group you deployed to.
1. Select one of the resources, such as the storage account resource. You see that it now has tags.

   ![Show tags](./media/template-tutorial-add-tags/show-tags.png)

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you added tags to the resources. In the next tutorial, you'll learn how to use parameter files to simplify passing in values to the template.

> [!div class="nextstepaction"]
> [Use parameter file](template-tutorial-use-parameter-file.md)
