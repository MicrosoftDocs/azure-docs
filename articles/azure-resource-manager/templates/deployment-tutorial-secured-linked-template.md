---
title: Tutorial - Deploy a secured linked template
description: Learn how to deploy a secured linked template
ms.date: 02/20/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Deploy a secured linked template

In the [previous tutorial](./deployment-tutorial-linked template.md), you deploy a linked template. In this tutorial, you use SAS to grant limited access to the linked template file in your own Azure Storage account. For more information about SAS, see [Using shared access signatures (SAS)](../../storage/common/storage-sas-overview.md). It takes about **12 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about deploying a linked template](./deployment-tutorial-linked template.md), but it's not required.

## Review templates

At the end of the quickstart tutorial, your template had the following JSON, which deployed a storage account, App Service plan, and web app.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/quickstart-template/azuredeploy.json":::


## Deploy template

Use either Azure CLI or Azure PowerShell to deploy a template.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the **templateFile** variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addwebapp `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storagePrefix "store" `
  -storageSKU Standard_LRS `
  -webAppName demoapp
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group deployment create \
  --name addwebapp \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS webAppName=demoapp
```

---

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to use a quickstart template for your template development. In the next tutorial, you add tags to the resources.

> [!div class="nextstepaction"]
> [Add tags](template-tutorial-add-tags.md)
