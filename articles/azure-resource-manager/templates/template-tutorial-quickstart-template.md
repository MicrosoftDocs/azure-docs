---
title: Tutorial - Use quickstart templates
description: Learn how to use Azure Quickstart Templates to complete your template development.
ms.date: 07/28/2023
ms.topic: tutorial
ms.custom:
---

# Tutorial: Use Azure Quickstart Templates

[Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/) is a repository of community contributed templates. You can use the sample templates in your template development. In this tutorial, you find a website resource definition and add it to your own template. This instruction takes **12 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about exported templates](template-tutorial-export-template.md), but it's not required.

You need to have Visual Studio Code with the Resource Manager Tools extension, and either Azure PowerShell or Azure Command-Line Interface (CLI). For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

At the end of the previous tutorial, your template had the following JSON file:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/export-template/azuredeploy.json":::

This template works for deploying storage accounts and app service plans, but you might want to add a website to it. You can use pre-built templates to quickly discover the JSON required for deploying a resource.

## Find template

1. Open [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/)
1. Select the tile with the title **Deploy a basic Linux web app**. If you have trouble finding it, here's the [direct link](https://azure.microsoft.com/resources/templates/webapp-basic-linux/).
1. Select **Browse on GitHub**.
1. Select _azuredeploy.json_.
1. Review the template. Look for the `Microsoft.Web/sites` resource.

    ![Resource Manager template quickstart web site](./media/template-tutorial-quickstart-template/resource-manager-template-quickstart-template-web-site.png)

## Revise existing template

Merge the quickstart template with the existing template:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/quickstart-template/azuredeploy.json" range="1-108" highlight="32-45,49,85-100":::

The web app name needs to be unique across Azure. To prevent having duplicate names, the `webAppPortalName` variable is updated from `"webAppPortalName": "[concat(parameters('webAppName'), '-webapp')]"` to `"webAppPortalName": "[concat(parameters('webAppName'), uniqueString(resourceGroup().id))]"`.

Add a comma at the end of the `Microsoft.Web/serverfarms` definition to separate the resource definition from the `Microsoft.Web/sites` definition.

There are a couple of important features to note in this new resource.

It has an element named `dependsOn` that's set to the app service plan. This setting is required because the app service plan needs to exist before the web app is created. The `dependsOn` element tells Resource Manager how to order the resources for deployment.

The `serverFarmId` property uses the [resourceId](template-functions-resource.md#resourceid) function. This function gets the unique identifier for a resource. In this case, it gets the unique identifier for the app service plan. The web app is associated with one specific app service plan.

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

To run this deployment command, you need to have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addwebapp \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS webAppName=demoapp
```

---

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources you're creating. Use the `debug` switch to get more information for debugging.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to delete the resource group.

1. From the Azure portal, select **Resource groups** from the left menu.
2. Type the resource group name in the **Filter for any field...** text field.
3. Check the box next to **myResourceGroup** and select **myResourceGroup** or your resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to use a quickstart template for your template development. In the next tutorial, you add tags to the resources.

> [!div class="nextstepaction"]
> [Add tags](template-tutorial-add-tags.md)
